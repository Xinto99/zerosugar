'use client';

import React from 'react';
import styles from './SuggestionCard.module.css';
import { HelpCircle, ShieldCheck, Search } from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  subtitle: string;
  type: 'green' | 'orange' | 'teal';
  iconType: 'help' | 'shield' | 'search';
  onClick: () => void;
}

export default function SuggestionCard({ title, subtitle, type, iconType, onClick }: SuggestionCardProps) {
  const getIcon = () => {
    switch (iconType) {
      case 'help': return <HelpCircle size={18} />;
      case 'shield': return <ShieldCheck size={18} />;
      case 'search': return <Search size={18} />;
      default: return null;
    }
  };

  return (
    <button className={styles.card} onClick={onClick}>
      <div className={`${styles.iconWrapper} ${styles[type]}`}>
        {getIcon()}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.subtitle}>{subtitle}</p>
    </button>
  );
}
