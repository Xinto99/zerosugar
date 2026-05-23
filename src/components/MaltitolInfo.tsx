'use client';

import React from 'react';
import CollapsibleCard from './CollapsibleCard';

export default function MaltitolInfo() {
  return (
    <CollapsibleCard title="말티톨 상세 정보" badge="Natural-derived" defaultOpen={false}>
      {/* Content empty since it's collapsed in the screenshot */}
      <p style={{ fontSize: '14px' }}>말티톨은 설탕 알코올의 일종으로...</p>
    </CollapsibleCard>
  );
}
