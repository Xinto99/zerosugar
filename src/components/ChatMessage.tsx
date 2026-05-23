'use client';

import React from 'react';
import styles from './ChatMessage.module.css';
import { Leaf, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  sender: 'user' | 'ai';
  text?: React.ReactNode;
  time?: string;
  avatarType?: 'leaf' | 'sparkle';
  children?: React.ReactNode;
}

export default function ChatMessage({ sender, text, time, avatarType = 'leaf', children }: ChatMessageProps) {
  const isUser = sender === 'user';
  
  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : styles.aiRow}`}>
      {!isUser && (
        <div className={`${styles.avatar} ${avatarType === 'leaf' ? styles.green : styles.teal}`}>
          {avatarType === 'leaf' ? <Leaf size={16} /> : <Sparkles size={16} />}
        </div>
      )}
      
      <div className={`${styles.messageContent} ${isUser ? styles.userContent : ''}`}>
        {text && (
          <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
            {text}
          </div>
        )}
        
        {children && (
          <div className={styles.childrenContainer}>
            {children}
          </div>
        )}
        
        {time && (
          <div className={styles.timestamp}>{time}</div>
        )}
      </div>
    </div>
  );
}
