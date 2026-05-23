'use client';

import React from 'react';
import CollapsibleCard from './CollapsibleCard';
import styles from './DetailedInfo.module.css';
import { ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

export default function JawsBarInfo() {
  return (
    <CollapsibleCard title="제품 정보: 죠스바 제로" badge="NATURAL-SYNTHETIC MIX" iconType="info" defaultOpen={true}>
      <div className={styles.grid} style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div className={styles.infoTitle}>기본 정보</div>
          <div className={styles.infoValue} style={{ fontSize: '24px' }}>죠스바 제로</div>
          <div className={styles.infoDesc}>기존 죠스바의 맛은 유지하면서 당류를 0g으로 줄인 아이스바 제품입니다.</div>
        </div>
        <div>
          <div className={styles.infoTitle}>사용된 감미료</div>
          <div className={styles.tags}>
            <span className={styles.tag}>알룰로스</span>
            <span className={styles.tag}>수크랄로스</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div>
          <div className={`${styles.boxTitle} ${styles.greenTitle}`}>
            <ThumbsUp size={16} /> PROS (장점)
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>당류 및 칼로리 0으로 다이어트에 적합</li>
            <li className={styles.listItem}>알룰로스 사용으로 비교적 자연스러운 단맛</li>
            <li className={styles.listItem}>기존 제품과 유사한 식감 유지</li>
          </ul>
        </div>
        <div>
          <div className={`${styles.boxTitle} ${styles.redTitle}`}>
            <ThumbsDown size={16} /> CONS (단점)
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>특유의 대체감미료 끝맛이 느껴질 수 있음</li>
            <li className={styles.listItem}>과다 섭취 시 소화 불량 가능성</li>
          </ul>
        </div>
      </div>

      <div className={`${styles.box} ${styles.orangeBox}`} style={{ margin: '24px 0' }}>
        <div className={`${styles.boxTitle} ${styles.orangeTitle}`}>
          <AlertTriangle size={16} /> CAUTIONS (주의사항)
        </div>
        <p className={styles.paragraph}>
          알룰로스는 과도하게 섭취할 경우 복부 팽만감이나 설사를 유발할 수 있습니다. 개인의 장 민감도에 따라 섭취량을 조절하시기 바랍니다.
        </p>
      </div>

      <div className={styles.imageContainer}>
        <img src="/jawsbar.png" alt="Jaws Bar Zero" className={styles.image} />
      </div>
    </CollapsibleCard>
  );
}
