import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageScaffold } from '../PageScaffold';
import { authService } from '../../services/authService';
import { type AuthLoginRequest } from '../../types/auth'; // 아까 만든 타입
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AxiosError } from 'axios';
import { useAuthStore } from '../../store/authStore';

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
    // 1. 서버에 로그인 요청
    const response = await authService.login(loginData);
    
    // 2. Zustand 스토어의 setSession 호출
    // response 자체가 { accessToken, user } 구조이므로 그대로 넣으면 됩니다.
    setSession({
      accessToken: response.accessToken,
      user: response.user
    });
    
    alert('로그인 성공! 환영합니다.');
    navigate('/'); // 메인 페이지로 이동
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = (err.response?.data as { message?: string })?.message || '로그인 실패';
      alert(errorMessage);
    }
  }
};

  return (
    <PageScaffold title="로그인" description="SOLve 서비스에 로그인합니다.">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
        <Input label="아이디" name="loginId" value={loginData.loginId} onChange={handleChange} required />
        <Input label="비밀번호" name="password" type="password" value={loginData.password} onChange={handleChange} required />
        <Button type="submit" variant="primary">로그인</Button>
      </form>
    </PageScaffold>
  );
}