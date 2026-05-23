'use client';

import React, { useState } from 'react';
import styles from './ChatInput.module.css';
import { Send, Image as ImageIcon, Paperclip, CheckCircle2, RotateCcw } from 'lucide-react';

interface ChatInputProps {
  placeholder: string;
  isInitialScreen: boolean;
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ placeholder, isInitialScreen, onSend, isLoading }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {!isInitialScreen && (
          <Paperclip size={20} className={styles.leftIcon} />
        )}
        
        <input
          type="text"
          className={styles.inputField}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        {isInitialScreen && (
          <ImageIcon size={20} className={styles.rightIcon} />
        )}
        
        <button 
          className={styles.sendBtn} 
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
        >
          <Send size={18} />
        </button>
      </div>

      <div className={styles.footer}>
        {isInitialScreen ? (
          <>
            <div className={styles.footerItem}>
              <CheckCircle2 size={14} /> Science-backed analysis
            </div>
            <div className={styles.footerItem}>
              <RotateCcw size={14} /> Updated: Oct 2023
            </div>
          </>
        ) : (
          <div className={styles.footerItem}>
            AI는 부정확한 정보를 제공할 수 있으니 전문가의 조언을 참고하세요.
          </div>
        )}
      </div>
    </div>
  );
}
