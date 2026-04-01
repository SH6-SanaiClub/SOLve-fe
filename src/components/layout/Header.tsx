import React from 'react';

// 피그마 추출 스타일 기반 정의
const s: { [key: string]: React.CSSProperties } = {
  hero: { width: '342px', height: '128px', padding: '32px 0', margin: '16px', position: 'absolute', top: '80px', left: '24px', overflow: 'hidden' },
  heroTitle: { width: '342px', color: 'rgba(25,28,30,1)', fontFamily: 'Pretendard', fontWeight: 'bold', fontSize: '30px', textAlign: 'left', margin: 0, whiteSpace: 'pre-wrap' },
  heroIcon: { width: '73px', height: '77px', backgroundColor: '#f0f0f0', borderRadius: '12px', position: 'absolute', top: '2px', left: '269px' },
  
  rateCard: { width: '342px', height: '138px', background: 'rgba(255,255,255,1)', padding: '32px', borderRadius: '24px', boxShadow: '0px 10px 40px rgba(25, 28, 30, 0.06)', position: 'absolute', top: '208px', left: '24px', overflow: 'hidden' },
  rateSub: { color: 'rgba(67,70,87,1)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' },
  rateValue: { color: 'rgba(41,98,253,1)', fontSize: '48px', fontWeight: 600, marginLeft: '8px' },

  grayBox: { width: '342px', backgroundColor: 'rgba(242,243,246,1)', borderRadius: '24px', padding: '24px', position: 'absolute', left: '24px' },
  boxTitle: { color: 'rgba(25,28,30,1)', fontSize: '18px', fontWeight: 'bold', margin: 0, marginBottom: '12px' },
  boxDesc: { color: 'rgba(67,70,87,1)', fontSize: '14px', lineHeight: '1.4', margin: 0 },

  detailSection: { width: '342px', position: 'absolute', top: '537px', left: '24px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' },

  noticeBox: { width: '342px', background: 'rgba(242,243,246,1)', borderRadius: '24px', padding: '24px', position: 'absolute', top: '725px', left: '24px' },
  noticeItem: { display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '13px', color: 'rgba(67,70,87,1)', lineHeight: '1.5' }
};

export const SavingHero = ({ title }: { title: string }) => (
  <div style={s.hero}><p style={s.heroTitle}>{title}</p><div style={s.heroIcon} /></div>
);

export const InterestCard = ({ sub, total }: { sub: string, total: string }) => (
  <div style={s.rateCard}>
    <p style={s.rateSub}>{sub}</p>
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <span style={{ fontSize: '18px', color: 'rgba(67,70,87,1)' }}>최고</span>
      <span style={s.rateValue}>{total}</span>
    </div>
  </div>
);

export const ConditionCard = ({ title, desc }: { title: string, desc: string }) => (
  <div style={{ ...s.grayBox, top: '384px', height: '127px' }}>
    <p style={s.boxTitle}>{title}</p>
    <p style={s.boxDesc}>{desc}</p>
  </div>
);

export const DetailSection = ({ items }: { items: { l: string, v: string }[] }) => (
  <div style={s.detailSection}>
    <p style={{ color: 'rgba(67,70,87,1)', fontWeight: 'bold', marginBottom: '24px' }}>Product Details</p>
    {items.map((item, i) => (
      <div key={i} style={s.detailRow}>
        <span style={{ color: 'rgba(67,70,87,1)' }}>{item.l}</span>
        <span style={{ color: 'rgba(25,28,30,1)', fontWeight: 500 }}>{item.v}</span>
      </div>
    ))}
  </div>
);

export const NoticeSection = ({ items }: { items: string[] }) => (
  <div style={s.noticeBox}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <div style={{ width: '11px', height: '11px', backgroundColor: 'rgba(67,70,87,1)' }} />
      <span style={{ fontWeight: 'bold', fontSize: '12px', color: 'rgba(67,70,87,1)' }}>알아두세요</span>
    </div>
    {items.map((item, i) => (
      <div key={i} style={s.noticeItem}>
        <div style={{ minWidth: '4px', height: '4px', backgroundColor: 'rgba(196,197,218,1)', borderRadius: '50%', marginTop: '6px' }} />
        <span>{item}</span>
      </div>
    ))}
  </div>
);