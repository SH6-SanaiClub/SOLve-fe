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
    ciDi: 'DEV_TEMP_TOKEN'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.signup({
        ...formData,
        phoneNumber: formData.phoneNumber.trim(),
      });
      alert('회원가입 성공!');
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
        {/* 헤더 */}
        <div className="flex items-center gap-3 -mx-6 -mt-6 px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="text-lg font-semibold text-font-main hover:opacity-70"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold text-font-main">회원가입</h1>
        </div>

        {/* 기본 정보 섹션 */}
        <div>
          <h2 className="text-base font-semibold text-font-main mb-2">기본 정보를 입력해주세요</h2>
          <p className="text-xs text-font-sub">회원님의 소중한 정보를 안전하게 입력해주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 아이디 (중복 확인 버튼 포함) */}
          <div className="flex gap-2 items-end">
            <Input 
              label="아이디" 
              name="loginId"
              value={formData.loginId}
              onChange={handleChange} 
              placeholder="아이디를 입력하세요"
              className="flex-[0.7]"
              required 
            />
            <div className="pt-6">
              <button
                type="button"
                onClick={() => alert('중복확인 기능 호출')}
                style={{
                  minWidth: '100px',
                  height: '48px',
                  backgroundColor: '#D6E4FF',
                  color: '#0046FF',
                  border: '1px solid #A1C1FF',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
                className="hover:bg-[#C5DCFF] transition-colors"
              >
                중복확인
              </button>
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
            label="이름" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="비밀번호를 한 번 더 입력해주세요"
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