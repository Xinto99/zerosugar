import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeEmbeddings } from '@langchain/pinecone';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

const responseSchema = z.object({
  conversational_response: z.string().describe("자연스럽고 친절한 한국어 챗봇 안내 메시지. 카드가 출력된다면 이 메시지 다음에 나옵니다."),
  cards_data: z.array(z.object({
    type: z.enum(['sweetener', 'product']).describe("대상 종류 (감미료 또는 개별 상품)"),
    title: z.string().describe("감미료 또는 제품의 정확한 명칭"),
    english_name: z.string().optional().describe("감미료일 경우 반드시 영문명 입력 (예: Erythritol, Stevioside, Sucralose). PubChem API 조회에 사용됨."),
    badge: z.string().describe("우측 상단 뱃지 (예: NATURAL-DERIVED, NATURAL-SYNTHETIC MIX 등)"),
    description: z.string().describe("해당 감미료/제품에 대한 상세하고 깊이 있는 설명 (특히 공신력 있는 기관의 입장 및 배경지식 포함)"),
    pros: z.array(z.string()).describe("장점 2~3개 (문장형태 아님)"),
    cons: z.array(z.string()).describe("단점 2~3개 (문장형태 아님)"),
    cautions: z.string().describe("부작용 및 주의사항 텍스트 (식약처, WHO, FDA 등의 일일섭취허용량(ADI) 및 안전성 권고 내용 등 매우 구체적이고 상세한 정보 포함)"),
    tags: z.array(z.string()).optional().describe("제품일 경우 포함된 감미료 이름 목록 (예: 알룰로스, 수크랄로스)"),
    sweetener_english_names: z.array(z.string()).optional().describe("제품일 경우 포함된 감미료의 영문명 목록 (PubChem API 조회에 사용됨)"),
    usage_examples: z.array(z.object({
      category: z.string().describe("예: 유제품, 소스류"),
      examples: z.string().describe("해당 카테고리의 실제 활용 예시 (예: 저칼로리 요거트)")
    })).optional().describe("감미료일 경우 주요 활용 사례"),
    references: z.array(z.object({
      source_name: z.string().describe("출처 기관명 또는 논문 제목"),
      url: z.string().describe("해당 출처의 웹사이트 주소 또는 논문 링크(DOI 등)")
    })).optional().describe("정보 제공에 사용된 공신력 있는 출처(식약처, WHO 등) 및 논문 링크 목록")
  })).optional().nullable().describe("질문과 일치하는 명확한 감미료나 제품 정보가 있을 경우 생성. 여러 정보가 섞인 단순 질문이면 null. 제품 추천시 최대 3개까지 배열로 반환.")
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });
    const indexName = 'zerosugar';
    const index = pc.Index(indexName);

    const embeddings = new PineconeEmbeddings({
      apiKey: process.env.PINECONE_API_KEY as string,
      model: 'llama-text-embed-v2',
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    const results = await vectorStore.similaritySearch(query, 10); // Get top 10 results to ensure product rows are fetched

    let context = '';
    if (results.length > 0) {
      context = results.map(doc => doc.pageContent).join('\n\n');
    }

    // Initialize Gemini model with structured output
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-3.1-flash-lite-preview',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.1,
    });

    const structuredModel = model.withStructuredOutput(responseSchema);

    const promptTemplate = PromptTemplate.fromTemplate(`
당신은 대체감미료 및 제로슈거 제품 정보를 전문적으로 안내하는 친절하고 똑똑한 AI 어시스턴트(LEAF WORK)입니다.
아래에 제공된 검색된 정보(Context)를 바탕으로 사용자의 질문(Question)에 답해주세요.

- 사용자가 특정 감미료나 단일 제품에 대해 물어보면 'cards_data' 배열에 1개의 객체를 담아서 반환해주세요.
- 특정 감미료를 사용한 제품이 있는지 물어볼 경우, 반드시 **검색된 정보(Context) 안에 존재하는 실제 샘플 제품 데이터만**을 사용하여 최대 3개까지 찾아 'cards_data' 배열에 카드 형태로 제공해주세요. 임의로 가상의 제품을 지어내면 절대 안 됩니다.
- 특정 대체감미료에 대해 설명할 때는 표면적인 내용에 그치지 말고, 아래의 기관들이 제공하는 안전성 평가, 일일섭취허용량(ADI), 발암물질 분류 여부, 최근 연구 동향 등을 활용하여 매우 깊이 있고 구체적으로 설명해주세요. 
- 명확한 주체가 없는 단순 인삿말이나 일반적인 질문인 경우 'cards_data'는 빼고 'conversational_response'만 작성해주세요.
- conversational_response에는 카드에 미처 다 담지 못한 심도 있는 배경지식이나 관련 연구의 맥락, 공신력 있는 기관의 공식 입장을 친절하고 상세하게 풀어서 설명해주세요.
- 정보를 제공할 때, 아래의 공신력 있는 기관이나 논문을 적극적으로 참고하고, 사용된 출처는 'references' 배열에 정확한 사이트 링크(URL)와 함께 반드시 포함해주세요:
  [참고 기관] 식약처, 한국식품연구원, WHO, 국제암연구소(IARC), FDA, 유럽식품안전청(EFSA)
  [참고 논문]
  1. Rios-Leyvraz, M., & Montez, J. (2022). Health effects of the use of non-sugar sweeteners: a systematic review and meta-analysis.
  2. Witkowski, M., et al. (2023). The artificial sweetener erythritol and cardiovascular disease risk. Nature Medicine.
  3. Witkowski, M., et al. (2024). Xylitol is associated with cardiovascular risk. European Heart Journal.
  4. Suez, J., et al. (2022). Personalized microbiome-driven effects of non-nutritive sweeteners on human glucose intolerance. Cell.
  5. Debras, C., et al. (2022). Artificial sweeteners and cancer risk: Results from the NutriNet-Santé population-based cohort study. PLOS Medicine.
  6. McGlynn, N. D., et al. (2022). Association of Low- and No-Calorie Sweetened Beverages as a Replacement for Sugar-Sweetened Beverages With Body Weight and Cardiometabolic Risk. JAMA Network Open.
  7. Ebbeling, C. B., et al. (2012). A trial of sugar-free or sugar-sweetened beverages and body weight in children. New England Journal of Medicine (NEJM).
  8. Yunker, A. G., et al. (2021). Obesity and sex-related associations with differential effects of sucralose vs sucrose on appetite and central brain reward responses. JAMA Network Open.
  9. Debras, C., et al. (2023). Artificial Sweeteners and Risk of Type 2 Diabetes in the Prospective NutriNet-Santé Cohort. Diabetes Care.

Context:
{context}

Question:
{question}
`);

    const formattedPrompt = await promptTemplate.format({
      context: context || "관련된 구체적인 정보가 데이터베이스에 없습니다.",
      question: query,
    });

    const response = await structuredModel.invoke(formattedPrompt);

    return NextResponse.json({ 
      response: response.conversational_response,
      cardsData: response.cards_data || null
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
