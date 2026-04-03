import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageScaffold } from '../PageScaffold'; 
import { authService } from '../../services/authService';
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
        phoneNumber: formData.phoneNumber.trim() 
      });
      alert('회원가입 성공!');
      navigate('/login'); 
    } catch (err) {
      if (err instanceof AxiosError) {
        // 서버에서 보내주는 에러 메시지 구조에 맞춰 타입을 단언해줍니다.
        const errorMessage = (err.response?.data as { message?: string })?.message || '가입 중 오류가 발생했습니다.';
        alert(errorMessage);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } // <--- 여기가 빠져있었습니다!
  };

  return (
    <PageScaffold 
      title="회원가입" 
      description="SOLve의 새로운 가족이 되어주세요."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }}>
        <Input 
          label="아이디" 
          name="loginId"
          value={formData.loginId}
          onChange={handleChange} 
          placeholder="아이디를 입력하세요"
          required 
        />
        
        <Input 
          label="비밀번호" 
          name="password"
          type="password" 
          value={formData.password}
          onChange={handleChange} 
          placeholder="비밀번호를 입력하세요"
          required 
        />

        <Input 
          label="이름" 
          name="name"
          value={formData.name}
          onChange={handleChange} 
          required 
        />

        <Input 
          label="이메일" 
          name="email"
          type="email" 
          value={formData.email}
          onChange={handleChange} 
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>생년월일</label>
          <input 
            name="birthdate"
            type="date" 
            style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <Button type="submit" variant="primary" size="lg">
          회원가입 완료
        </Button>
      </form>
    </PageScaffold>
  );
}