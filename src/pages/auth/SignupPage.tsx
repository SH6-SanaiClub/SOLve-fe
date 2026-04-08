import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTE_PATHS } from '../../constants/routePaths';
import { type AuthJoinRequest } from '../../types/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AxiosError } from 'axios';

export function SignupPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<AuthJoinRequest>({
    loginId: '',
    password: '',
    name: '',
    email: '',
    phoneNumber: '',
    birthdate: '',
    ciDi: ''
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
const [idCheckMessage, setIdCheckMessage] = useState("");
const [idCheckColor, setIdCheckColor] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  if (name === 'phoneNumber') {
    // 숫자만 남기기
    const onlyNums = value.replace(/[^0-9]/g, '');
    
    // 하이픈 자동 삽입 로직
    let formattedPhone = '';
    if (onlyNums.length <= 3) {
      formattedPhone = onlyNums;
    } else if (onlyNums.length <= 7) {
      formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    } else {
      formattedPhone = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    return; 
  }
  setFormData(prev => ({ ...prev, [name]: value }));
  
  if (name === 'loginId') {
    setIsIdChecked(false);
    setIdCheckMessage("");
  }
};
  const handleCheckId = async () => {
    if (!formData.loginId) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
      const isDuplicate = await authService.checkLoginId(formData.loginId);
      if (isDuplicate) {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
        setIdCheckColor("red");
        setIsIdChecked(false);
      } else {
        setIdCheckMessage("사용 가능한 아이디입니다.");
        setIdCheckColor("green");
        setIsIdChecked(true);
      }
    } catch  {
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isIdChecked) {
      alert('아이디 중복 확인을 먼저 진행해주세요.');
      return;
    }
    if (formData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const requestData = {
        ...formData,
        phoneNumber: formData.phoneNumber.trim(),
        ciDi: `DEV_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
      };
      await authService.signup(requestData);
      navigate(ROUTE_PATHS.signupComplete);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = (err.response?.data as { message?: string })?.message || '가입 중 오류가 발생했습니다.';
        alert(errorMessage);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
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
          <h2 className="text-base font-semibold text-font-main mb-2">기본 정보를 입력해주세요</h2>
          <p className="text-xs text-font-sub">회원님의 소중한 정보를 안전하게 입력해주세요.</p>
        </div>

  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex gap-2 items-start"> 
              
              <div className="flex-1 flex flex-col min-w-0"> 
                <Input 
                  label="아이디" 
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleChange} 
                  placeholder="아이디를 입력하세요"
                  className="w-full" 
                  required 
                />
                
                {idCheckMessage && (
                  <p
                    className="mt-1.5 text-[11px] font-medium text-right pr-0.5" 
                    style={{ color: idCheckColor }}
                  >
                    {idCheckColor === 'green' ? '✓ ' : '✕ '} {idCheckMessage}
                  </p>
                )}
              </div>

              <div className="pt-6 shrink-0"> 
                <button
                  type="button"
                  onClick={handleCheckId}
                  className="hover:bg-[#C5DCFF] transition-colors"
                  style={{
                    width: '100px',
                    height: '48px', 
                    backgroundColor: '#D6E4FF',
                    color: '#0046FF',
                    border: '1px solid #A1C1FF',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  중복확인
                </button>
              </div>
            </div>
          </div>

          <Input 
            label="비밀번호" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange} 
            placeholder="영문, 숫자, 특수문자 조합 8-16자"
            required 
          />

          <Input 
            label="비밀번호 확인" 
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            required 
          />

          <Input 
            label="이름" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required 
          />

          <Input 
            label="생년월일" 
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            required 
          />

          <Input 
            label="전화번호" 
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange} 
            placeholder="010-0000-0000"
            required 
          />

          <Input 
            label="이메일" 
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            required 
          />
          
          <Button type="submit" variant="primary" fullWidth size="md" className="mt-4">
            완료
          </Button>
        </form>
      </section>
    </div>
  );
}