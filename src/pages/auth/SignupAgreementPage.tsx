import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ROUTE_PATHS } from '../../constants/routePaths';

const agreementItems = [
  { key: 'terms', label: '[필수] 서비스 이용약관', required: true },
  { key: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의', required: true },
  { key: 'credit', label: '[필수] 개인정보 및 신용정보 제3자 제공 동의', required: true },
  { key: 'lookup', label: '[필수] 개인정보 및 신용정보 조회 동의', required: true },
  { key: 'marketing', label: '[선택] 마케팅 정보 수신 동의', required: false },
];

export function SignupAgreementPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    credit: false,
    lookup: false,
    marketing: false,
  });

  const allRequiredChecked = agreementItems
    .filter(item => item.required)
    .every(item => checked[item.key]);

  const allChecked = agreementItems.every(item => checked[item.key]);

  const toggleAll = (value: boolean) => {
    const next = agreementItems.reduce((acc, item) => {
      acc[item.key] = value;
      return acc;
    }, {} as Record<string, boolean>);
    setChecked(next);
  };

  const handleCheckbox = (key: string, v: boolean) => {
    setChecked(prev => ({ ...prev, [key]: v }));
  };

  const goNext = () => {
    if (!allRequiredChecked) return;
    navigate(ROUTE_PATHS.signup);
  };

  return (
    <div className="app-shell">
      <section className="page-card flex flex-col gap-6">
        <div className="flex items-center gap-3 -mx-6 -mt-6 px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="text-lg font-semibold text-font-main hover:opacity-70"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-font-main">회원가입</h1>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-font-main mt-4">안전한 금융 생활을 위해 약관에 동의해 주세요</h2>
          <p className="text-sm text-font-sub mt-1">서비스 이용을 위한 필수 절차입니다.</p>
        </div>

        <div className="flex flex-col gap-2 px-2">
          <label className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={e => toggleAll(e.target.checked)}
                className="mr-2"
              />
              전체 동의하기
            </div>
            <span className="text-xs text-font-sub">필수 및 선택 약관에 모두 동의합니다.</span>
          </label>

          {agreementItems.map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(checked[item.key])}
                  onChange={e => handleCheckbox(item.key, e.target.checked)}
                  className="mr-2"
                />
                <span>{item.label}</span>
              </div>
              {item.required ? <span className="text-xs text-warning">필수</span> : <span className="text-xs text-font-sub">선택</span>}
            </label>
          ))}

          <p className="text-xs text-font-sub pt-2">
            SOLve는 고객님의 개인정보를 최신 암호화 기술로 안전하게 보호하며, 동의하지 않은 목적에는 절대 사용하지 않습니다.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          fullWidth
          disabled={!allRequiredChecked}
          onClick={goNext}
        >
          다음
        </Button>
      </section>
    </div>
  );
}
