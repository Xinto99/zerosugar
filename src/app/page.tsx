'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Sidebar from '../components/Sidebar';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import MaltitolInfo from '../components/MaltitolInfo';
import SteviaInfo from '../components/SteviaInfo';
import JawsBarInfo from '../components/JawsBarInfo';
import TypingIndicator from '../components/TypingIndicator';
import { Settings, User, Leaf } from 'lucide-react';
import DynamicInfoCard, { CardData } from '../components/DynamicInfoCard';

type ChatState = 'initial' | 'loading' | 'maltitol' | 'stevia' | 'jawsbar' | 'search_result';

export default function Home() {
  const [chatState, setChatState] = useState<ChatState>('initial');
  const [userQuery, setUserQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [cardsData, setCardsData] = useState<CardData[]>([]);

  const getUpgradeProps = () => {
    switch(chatState) {
      case 'maltitol':
      case 'stevia':
      case 'search_result':
        return { bg: '#ffedd5', text: '#c2410c', btn: '#c2410c', desc: '더 상세한 분석과 전문가 모드를 경험하세요.' };
      case 'jawsbar':
        return { bg: '#2dd4bf', text: '#042f2e', btn: '#0d9488', desc: 'Detailed chemical analysis and unlimited reports.' };
      default:
        return { bg: '#ccfbf1', text: '#046c4e', btn: '#046c4e', desc: 'Unlock detailed clinical data' };
    }
  };

  const handleSend = async (text: string) => {
    setUserQuery(text);
    setChatState('loading');
    setCardsData([]);
    
    // Check if the input exactly matches original hardcoded tests
    if (text === '말티톨에 대해 알려줘.') {
      setTimeout(() => setChatState('maltitol'), 1000);
      return;
    }
    if (text === '스테비아에 대해 알려줘.') {
      setTimeout(() => setChatState('stevia'), 1000);
      return;
    }
    if (text === '죠스바 제로 정보 알려줘.') {
      setTimeout(() => setChatState('jawsbar'), 1000);
      return;
    }

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      
      if (data.error) {
        setSearchResult('검색 중 오류가 발생했습니다: ' + data.error);
      } else {
        setSearchResult(data.response);
        if (data.cardsData) {
          setCardsData(data.cardsData);
        }
      }
      setChatState('search_result');
    } catch (error) {
      setSearchResult('검색 요청 실패. 서버 연결을 확인하세요.');
      setChatState('search_result');
    }
  };

  const handleNewChat = () => {
    setChatState('initial');
    setUserQuery('');
    setCardsData([]);
  };

  const handleHistoryClick = (type: string) => {
    if (type === 'maltitol') {
      handleSend('말티톨에 대해 알려줘.');
    } else {
      handleSend('죠스바 제로 정보 알려줘.');
    }
  };

  const upgradeProps = getUpgradeProps();

  return (
    <div className={styles.layout}>
      <Sidebar 
        onNewChat={handleNewChat} 
        onHistoryClick={handleHistoryClick}
        upgradeBgColor={upgradeProps.bg}
        upgradeTextColor={upgradeProps.text}
        upgradeBtnColor={upgradeProps.btn}
        upgradeText={upgradeProps.desc}
      />
      
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <div style={{flex: 1}}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-color)', letterSpacing: '1px', lineHeight: '1' }}>ZERONOTE</span>
            <span style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: '500', marginTop: '4px' }}>대체감미료 정보제공 사이트</span>
          </div>
        </div>

        <div className={styles.chatArea}>
          {chatState === 'initial' && (
            <WelcomeScreen onSuggestionClick={handleSend} />
          )}

          {chatState === 'loading' && (
            <div className={styles.chatContainer} style={{ height: '100%', justifyContent: 'center' }}>
              <div className={styles.loadingLogoContainer}>
                <div className={styles.loadingLogoText}>
                  LEAF <Leaf size={28} /> RK
                </div>
                <div className={styles.loadingSubtitle}>당신의 스마트한 감미료 가이드</div>
                <div className={styles.loadingDesc}>성분표 속 어려운 감미료 이름을 물어보세요.</div>
              </div>

              <ChatMessage sender="user" text={userQuery} />
              
              <ChatMessage sender="ai">
                <TypingIndicator />
              </ChatMessage>
            </div>
          )}

          {chatState === 'maltitol' && (
            <div className={styles.chatContainer}>
              <ChatMessage sender="user" text={userQuery || '말티톨에 대해 알려줘.'} time="오후 2:30" />
              <ChatMessage sender="ai" time="오후 2:31">
                <p>
                  말티톨(Maltitol)은 설탕의 단맛을 약 90% 정도 유지하면서도 칼로리는 절반 수준인 **당알콜계 대체 감미료**입니다.
                  <br /><br />
                  제과나 제빵에서 설탕과 유사한 질감을 낼 수 있어 무설탕 초콜릿, 캔디 등에 자주 쓰이지만, 체내 흡수율과 소화 과정에서 몇 가지 주의할 점이 있습니다. 아래 상세 정보를 확인해 보세요.
                </p>
                <MaltitolInfo />
              </ChatMessage>
            </div>
          )}

          {chatState === 'stevia' && (
            <div className={styles.chatContainer}>
              <ChatMessage sender="user" text={userQuery || '스테비아에 대해 알려줘.'} time="10:42 AM" />
              <ChatMessage sender="ai">
                <p>
                  스테비아(Stevia)는 국화과 다년생 식물인 스테비아의 잎에서 추출한 천연 감미료입니다. 설탕보다 약 200~300배 강한 단맛을 내지만 칼로리가 거의 없어 당뇨 환자나 다이어트 식단에 널리 사용됩니다.
                </p>
                <SteviaInfo />
              </ChatMessage>
            </div>
          )}

          {chatState === 'jawsbar' && (
            <div className={styles.chatContainer}>
              <ChatMessage sender="user" text={userQuery || '죠스바 제로 정보 알려줘.'} />
              <ChatMessage sender="ai" avatarType="sparkle">
                <p>죠스바 제로에 대한 정보입니다.</p>
                <JawsBarInfo />
              </ChatMessage>
            </div>
          )}

          {chatState === 'search_result' && (
            <div className={styles.chatContainer}>
              <ChatMessage sender="user" text={userQuery} />
              <ChatMessage sender="ai" avatarType="sparkle">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', color: 'var(--text-dark)', marginBottom: cardsData.length > 0 ? '16px' : '0' }}>
                  {searchResult}
                </div>
                {cardsData.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cardsData.map((data, idx) => (
                      <DynamicInfoCard key={idx} data={data} />
                    ))}
                  </div>
                )}
              </ChatMessage>
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <ChatInput 
            placeholder={
              chatState === 'initial' ? "감미료 이름이나 식품명을 입력해 보세요..." :
              chatState === 'maltitol' ? "말티톨에 대해 더 궁금한 점이 있나요?" :
              chatState === 'stevia' ? "대체감미료에 대해 궁금한 점을 물어보세요..." :
              "죠스바 제로 정보 알려줘."
            }
            isInitialScreen={chatState === 'initial'}
            onSend={handleSend}
            isLoading={chatState === 'loading'}
          />
        </div>
      </main>
    </div>
  );
}
