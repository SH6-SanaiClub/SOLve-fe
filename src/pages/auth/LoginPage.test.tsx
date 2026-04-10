/** @vitest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, afterEach } from 'vitest'; // cleanup은 여기서 빼세요
import { LoginPage } from './LoginPage';
import { authService } from '../../services/authService';

// authService 모킹
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('LoginPage 컴포넌트 테스트', () => {
  // 테스트 하나가 끝날 때마다 전체 document를 강제로 비웁니다.
  afterEach(() => {
    document.body.innerHTML = ''; 
  });

  it('아이디와 비밀번호 입력 시 값이 변경되어야 한다', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // 이제 화면에 하나만 존재하므로 getByLabelText가 작동합니다.
    const idInput = screen.getByLabelText('아이디') as HTMLInputElement;
    const pwInput = screen.getByLabelText('비밀번호') as HTMLInputElement;

    fireEvent.change(idInput, { target: { value: 'myId' } });
    fireEvent.change(pwInput, { target: { value: 'myPw' } });

    expect(idInput.value).toBe('myId');
  });

  it('로그인 버튼 클릭 시 API가 호출되어야 한다', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('아이디'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'pass1' } });
    
const loginButton = screen.getByRole('button', { name: '로그인' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        loginId: 'user1',
        password: 'pass1',
      });
    });
  });
});