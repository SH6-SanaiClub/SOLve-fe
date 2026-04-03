import { describe, it, expect, vi } from 'vitest';
import { authService } from './authService';
import { apiClient } from './apiClient';

// apiClient.post를 가짜(Mock) 함수로 만듭니다.
vi.mock('./apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('authService 테스트', () => {
  it('signup 함수가 올바른 경로와 파라미터로 호출되어야 한다', async () => {
    const mockData = {
      loginId: 'testUser',
      password: 'password123',
      name: '테스터',
      email: 'test@test.com',
      phoneNumber: '01012345678',
      birthdate: '1995-01-01',
      ciDi: 'TEMP'
    };

    await authService.signup(mockData);

    // /auth/join 경로로 데이터가 전달되었는지 확인
    expect(apiClient.post).toHaveBeenCalledWith('/auth/join', mockData);
  });

  it('login 함수 성공 시 데이터를 반환해야 한다', async () => {
    const loginData = { loginId: 'testUser', password: 'password123' };
    const mockResponse = { data: { accessToken: 'token123', user: { name: '테스터' } } };
    
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await authService.login(loginData);
    expect(result.accessToken).toBe('token123');
  });
});