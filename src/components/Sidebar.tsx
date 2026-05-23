'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import { Plus, History, Settings } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  onHistoryClick: (type: string) => void;
  upgradeBgColor?: string;
  upgradeTextColor?: string;
  upgradeBtnColor?: string;
  upgradeText?: string;
}

export default function Sidebar({
  onNewChat,
  onHistoryClick,
  upgradeBgColor = '#ccfbf1',
  upgradeTextColor = '#046c4e',
  upgradeBtnColor = '#046c4e',
  upgradeText = 'Unlock detailed clinical data'
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className={styles.logoTitle}>ZERONOTE</h1>
        <p className={styles.logoSubtitle}>대체감미료 정보제공 사이트</p>
      </div>

      <button className={styles.newChatBtn} onClick={onNewChat}>
        <Plus size={18} />
        New Chat
      </button>

      <div className={styles.historySection}>
        <h2 className={styles.historyTitle}>RECENT HISTORY</h2>
        <ul className={styles.historyList}>
          <li className={styles.historyItem} onClick={() => onHistoryClick('maltitol')}>
            <History size={16} className={styles.historyIcon} />
            Maltitol Safety
          </li>
          <li className={styles.historyItem} onClick={() => onHistoryClick('zerosugar')}>
            <History size={16} className={styles.historyIcon} />
            Zero Sugar Drinks
          </li>
        </ul>
      </div>

      <div className={styles.bottomSection}>
        <button className={styles.settingsBtn}>
          <Settings size={18} />
          Settings
        </button>
        <div className={styles.bottomMenu}>
          <div className={styles.upgradeBox} style={{ backgroundColor: upgradeBgColor }}>
            <div className={styles.upgradeIcon}>✨</div>
            <div className={styles.upgradeText} style={{ color: upgradeTextColor }}>
              {upgradeText}
            </div>
            <button className={styles.upgradeBtn} style={{ color: upgradeBtnColor, borderColor: upgradeBtnColor }}>
              Upgrade to Pro
            </button>
          </div>

          <button 
            className={styles.menuItem} 
            style={{ width: '100%', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#1e293b', fontWeight: 'bold' }}
            onClick={async () => {
              try {
                alert('데이터 인덱싱을 시작합니다...');
                const res = await fetch('/api/embed', { method: 'POST' });
                const data = await res.json();
                if (data.success) alert(data.message);
                else alert('인덱싱 실패: ' + data.error);
              } catch (e) {
                alert('인덱싱 중 오류 발생');
              }
            }}
          >
            데이터 인덱싱
          </button>
        </div>
      </div>
    </aside>
  );
}
