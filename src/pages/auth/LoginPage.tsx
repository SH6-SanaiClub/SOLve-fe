import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { type AuthLoginRequest } from '../../types/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AxiosError } from 'axios';
import { useAuthStore } from '../../store/authStore';
import { ROUTE_PATHS } from '../../constants/routePaths';


export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const [loginData, setLoginData] = useState<AuthLoginRequest>({
    loginId: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginData);
      setSession({
        accessToken: response.accessToken,
        user: response.user
      });
      alert('로그인 성공! 환영합니다.');
      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = (err.response?.data as { message?: string })?.message || '로그인 실패';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="app-shell">
      <section className="page-card flex flex-col gap-4">
        <span className="text-sm font-semibold text-primary-500">SOLve</span>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-font-main">로그인</h1>
          <p className="text-base text-font-sub">SOLve 서비스에 로그인합니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
          <Input 
            label="아이디" 
            name="loginId" 
            value={loginData.loginId} 
            onChange={handleChange} 
            placeholder="아이디를 입력하세요."
            required 
          />
          <Input 
            label="비밀번호" 
            name="password" 
            type="password" 
            value={loginData.password} 
            onChange={handleChange} 
            placeholder="비밀번호를 입력하세요."
            required 
          />
          <Button type="submit" variant="primary" fullWidth>
            로그인
          </Button>
          <Link to={ROUTE_PATHS.signupAgreement}>
            <Button type="button" variant="outline" fullWidth>
              회원가입
            </Button>
          </Link>
        </form>

        <hr className="my-4 border-gray-200" />

        <p className="text-center text-xs text-font-sub leading-relaxed">
          부정가입 방지를 위해 본 서비스는 가입 후 24시간 이내에는 서비스 이용이 제한될 수 있습니다.
        </p>
      </section>
    </div>
  );
}