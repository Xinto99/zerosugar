import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { PineconeEmbeddings } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export async function POST() {
  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });
    const indexName = 'zerosugar';
    const index = pc.Index(indexName);

    const embeddings = new PineconeEmbeddings({
      apiKey: process.env.PINECONE_API_KEY as string,
      model: 'llama-text-embed-v2',
    });

    const docs: Document[] = [];

    // Load sweeteners
    const sweetenersPath = path.join(process.cwd(), 'samples', 'sweeteners.csv');
    const sweetenersCsv = fs.readFileSync(sweetenersPath, 'utf-8');
    const sweetenersData: any[] = parse(sweetenersCsv, { columns: true, skip_empty_lines: true });

    for (const row of sweetenersData) {
      docs.push(new Document({
        pageContent: `감미료 이름: ${row.sweetener_name}\n설명: ${row.description}\n장점: ${row.pros}\n단점: ${row.cons}\n사용되는 식품군: ${row.food_categories}`,
        metadata: { type: 'sweetener', name: row.sweetener_name }
      }));
    }

    // Load products
    const productsPath = path.join(process.cwd(), 'samples', 'products.csv');
    const productsCsv = fs.readFileSync(productsPath, 'utf-8');
    const productsData: any[] = parse(productsCsv, { columns: true, skip_empty_lines: true });

    for (const row of productsData) {
      docs.push(new Document({
        pageContent: `제품 이름: ${row.product_name}\n사용된 감미료: ${row.sweetener_used}\n장점(이점): ${row.benefits}\n단점: ${row.drawbacks}\n주의사항: ${row.cautions}`,
        metadata: { type: 'product', name: row.product_name, sweeteners: row.sweetener_used }
      }));
    }

    // Upload to Pinecone
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      maxConcurrency: 5, // Prevent rate limiting
    });

    return NextResponse.json({ success: true, message: `Successfully embedded ${docs.length} documents.` });
  } catch (error: any) {
    console.error('Embedding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
