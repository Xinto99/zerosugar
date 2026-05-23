'use client';

import React from 'react';
import styles from './WelcomeScreen.module.css';
import { Leaf } from 'lucide-react';
import SuggestionCard from './SuggestionCard';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className={styles.container}>
      <div className={styles.logoIcon}>
        <Leaf size={40} className={styles.leaf} />
      </div>
      
      <h2 className={styles.title}>
        안녕하세요!{'\n'}대체감미료에 대해 무엇이든 물어보세요.
      </h2>
      
      <p className={styles.subtitle}>
        성분 분석부터 일일 권장 섭취량, 건강에 미치는 영향까지 과학적 근거를{'\n'}바탕으로 상세히 알려드립니다.
      </p>
      
      <div className={styles.cardsContainer}>
        <SuggestionCard 
          title="입문 가이드" 
          subtitle='"대체감미료란?"' 
          type="green" 
          iconType="help"
          onClick={() => onSuggestionClick('대체감미료란?')}
        />
        <SuggestionCard 
          title="안전성 체크" 
          subtitle='"말티톨 안전한가요?"' 
          type="orange" 
          iconType="shield"
          onClick={() => onSuggestionClick('말티톨 안전한가요?')}
        />
        <SuggestionCard 
          title="제품 정보" 
          subtitle='"죠스바 제로 정보 알려줘."' 
          type="teal" 
          iconType="search"
          onClick={() => onSuggestionClick('죠스바 제로 정보 알려줘.')}
        />
      </div>
    </div>
  );
}
