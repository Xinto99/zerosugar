'use client';

import React from 'react';
import CollapsibleCard from './CollapsibleCard';
import styles from './DetailedInfo.module.css';
import { CheckCircle2, MinusCircle, AlertTriangle, Lightbulb } from 'lucide-react';

export default function SteviaInfo() {
  return (
    <CollapsibleCard title="스테비아 상세 정보" badge="NATURAL-DERIVED" defaultOpen={true}>
      <div className={styles.imageContainer}>
        <img src="/stevia.png" alt="Stevia Rebaudiana Bertoni" className={styles.image} />
        <div className={styles.imageLabel}>Stevia Rebaudiana Bertoni</div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.box} ${styles.greenBox}`}>
          <div className={`${styles.boxTitle} ${styles.greenTitle}`}>
            <CheckCircle2 size={16} /> Pros (장점)
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>천연 유래 성분</li>
            <li className={styles.listItem}>혈당 지수(GI) 0</li>
            <li className={styles.listItem}>충치 예방 도움</li>
          </ul>
        </div>
        <div className={`${styles.box} ${styles.blueBox}`}>
          <div className={`${styles.boxTitle} ${styles.blueTitle}`}>
            <MinusCircle size={16} /> Cons (단점)
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>특유의 쌉싸름한 뒷맛</li>
            <li className={styles.listItem}>설탕과 다른 입자 질감</li>
            <li className={styles.listItem}>베이킹 시 구조감 차이</li>
          </ul>
        </div>
      </div>

      <div className={`${styles.box} ${styles.orangeBox}`} style={{ marginBottom: '16px' }}>
        <div className={`${styles.boxTitle} ${styles.orangeTitle}`}>
          <AlertTriangle size={16} /> Cautions (주의사항)
        </div>
        <p className={styles.paragraph}>
          국화과 식물(돼지풀, 국화 등) 알레르기가 있는 경우 섭취 시 주의가 필요합니다. 또한 설탕 대용으로 과다 섭취할 경우 일부 사용자에게서 복통이나 설사를 유발할 수 있습니다.
        </p>
      </div>

      <div className={`${styles.box} ${styles.blueBox}`}>
        <div className={`${styles.boxTitle} ${styles.blueTitle}`} style={{ color: '#0ea5e9' }}>
          <Lightbulb size={16} /> 주요 활용 사례 (Usage Examples)
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-dark)', marginBottom: '16px' }}>
          스테비아는 설탕 대체제로 다양한 가공식품 및 가정 요리에 활용됩니다.
        </p>
        <div className={styles.grid}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#046c4e' }}>유제품 (Dairy)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>저칼로리 요거트, 우유</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#046c4e' }}>소스류 (Sauces)</div>
            <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>무설탕 케첩, 잼</div>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}
