'use client';

import React, { useState } from 'react';
import styles from './CollapsibleCard.module.css';
import { ChevronDown, FileText, Info } from 'lucide-react';

interface CollapsibleCardProps {
  title: string;
  badge?: string;
  iconType?: 'file' | 'info';
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export default function CollapsibleCard({ title, badge, iconType = 'file', defaultOpen = false, children }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.card}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.headerLeft}>
          {iconType === 'file' ? <FileText size={20} className={styles.icon} /> : <Info size={20} className={styles.icon} />}
          <h4 className={styles.title}>{title}</h4>
          {badge && <span className={`${styles.badge} ${badge.includes('SYNTHETIC') ? styles.synthetic : ''}`}>{badge}</span>}
        </div>
        <ChevronDown size={20} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </div>
      
      {isOpen && children && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
}
