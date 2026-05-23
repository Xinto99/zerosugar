'use client';

import React from 'react';
import CollapsibleCard from './CollapsibleCard';
import styles from './DetailedInfo.module.css';
import { CheckCircle2, MinusCircle, AlertTriangle, Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';

export interface CardData {
  type: 'sweetener' | 'product';
  title: string;
  badge: string;
  english_name?: string;
  sweetener_english_names?: string[];
  description: string;
  pros: string[];
  cons: string[];
  cautions: string;
  tags?: string[]; // Sweeteners used (for product)
  usage_examples?: { category: string; examples: string }[]; // For sweetener
  references?: { source_name: string; url: string }[]; // Citations
}

export default function DynamicInfoCard({ data }: { data: CardData }) {
  const isProduct = data.type === 'product';
  const [moleculeError, setMoleculeError] = React.useState(false);

  const ProsIcon = isProduct ? ThumbsUp : CheckCircle2;
  const ConsIcon = isProduct ? ThumbsDown : MinusCircle;
  const prosTitle = isProduct ? 'PROS (장점)' : 'Pros (장점)';
  const consTitle = isProduct ? 'CONS (단점)' : 'Cons (단점)';

  const getImages = () => {
    let moleculeUrl = '/molecule.png'; // fallback
    if (!isProduct && data.english_name) {
      moleculeUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(data.english_name)}/PNG`;
    } else if (isProduct && data.sweetener_english_names && data.sweetener_english_names.length > 0) {
      moleculeUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(data.sweetener_english_names[0])}/PNG`;
    }

    let productUrl = '/generic_product.png'; // fallback
    if (data.title.includes('죠스바')) productUrl = '/jawsbar.png';
    else if (data.title.includes('스테비아')) productUrl = '/stevia.png';
    
    return { molecule: moleculeUrl, product: productUrl };
  };
  const images = getImages();

  return (
    <CollapsibleCard title={data.title} badge={data.badge} iconType={isProduct ? 'info' : 'default'} defaultOpen={true}>
      
      {/* Product Top Header */}
      {isProduct && (
        <div className={styles.grid} style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <div className={styles.infoTitle}>기본 정보</div>
            <div className={styles.infoValue} style={{ fontSize: '24px' }}>{data.title}</div>
            <div className={styles.infoDesc}>{data.description}</div>
          </div>
          {data.tags && data.tags.length > 0 && (
            <div>
              <div className={styles.infoTitle}>사용된 감미료</div>
              <div className={styles.tags}>
                {data.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sweetener Description */}
      {!isProduct && (
        <p className={styles.paragraph} style={{marginBottom: '16px'}}>{data.description}</p>
      )}

      {/* Pros & Cons Grid */}
      <div className={styles.grid}>
        <div className={`${styles.box} ${styles.greenBox}`}>
          <div className={`${styles.boxTitle} ${styles.greenTitle}`}>
            <ProsIcon size={16} /> {prosTitle}
          </div>
          <ul className={styles.list}>
            {data.pros.map((pro, i) => <li key={i} className={styles.listItem}>{pro}</li>)}
          </ul>
        </div>
        <div className={`${styles.box} ${isProduct ? styles.redBox : styles.blueBox}`}>
          <div className={`${styles.boxTitle} ${isProduct ? styles.redTitle : styles.blueTitle}`}>
            <ConsIcon size={16} /> {consTitle}
          </div>
          <ul className={styles.list}>
            {data.cons.map((con, i) => <li key={i} className={styles.listItem}>{con}</li>)}
          </ul>
        </div>
      </div>

      {/* Cautions */}
      {data.cautions && (
        <div className={`${styles.box} ${styles.orangeBox}`} style={{ margin: '16px 0' }}>
          <div className={`${styles.boxTitle} ${styles.orangeTitle}`}>
            <AlertTriangle size={16} /> {isProduct ? 'CAUTIONS (주의사항)' : 'Cautions (주의사항)'}
          </div>
          <p className={styles.paragraph}>{data.cautions}</p>
        </div>
      )}

      {/* Images - Below Cautions */}
      <div className={styles.grid} style={{ marginTop: '16px', gap: '16px' }}>
        {!isProduct && images.molecule && !moleculeError && (
          <div className={styles.imageContainer} style={{ margin: 0 }}>
            <img 
              src={images.molecule} 
              alt="분자식 구조" 
              className={styles.image} 
              style={{ maxHeight: '200px', objectFit: 'contain', backgroundColor: '#fff' }} 
              onError={() => setMoleculeError(true)}
            />
            <div className={styles.imageLabel}>분자식 구조</div>
          </div>
        )}
        {isProduct && (
          <div className={styles.box} style={{ margin: 0, padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
            <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(data.title)}`} target="_blank" rel="noreferrer" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <span>🔍</span> 실제 제품 사진 검색하기
            </a>
          </div>
        )}
      </div>

      {/* Sweetener Usage Examples */}
      {!isProduct && data.usage_examples && data.usage_examples.length > 0 && (
        <div className={`${styles.box} ${styles.blueBox}`}>
          <div className={`${styles.boxTitle} ${styles.blueTitle}`} style={{ color: '#0ea5e9' }}>
            <Lightbulb size={16} /> 주요 활용 사례 (Usage Examples)
          </div>
          <div className={styles.grid}>
            {data.usage_examples.map((ex, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#046c4e' }}>{ex.category}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>{ex.examples}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      {data.references && data.references.length > 0 && (
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-gray)', marginBottom: '8px' }}>
            참고 문헌 및 출처
          </div>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {data.references.map((ref, i) => (
              <li key={i} style={{ marginBottom: '4px', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <a href={ref.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                  • {ref.source_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

    </CollapsibleCard>
  );
}
