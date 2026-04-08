import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { apiClient } from './apiClient';

vi.mock('./apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('authService 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear(); // 테스트마다 스토리지 초기화
  });

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
    expect(apiClient.post).toHaveBeenCalledWith('/auth/join', mockData);
  });

  it('login 성공 시 토큰을 반환하고 localStorage에 저장해야 한다', async () => {
    const loginData = { loginId: 'testUser', password: 'password123' };
    const mockResponse = { 
      data: { 
        accessToken: 'token123', 
        refreshToken: 'refresh123', // 리프레시 토큰 추가
        user: { name: '테스터' } 
      } 
    };
    
    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await authService.login(loginData);
    
    // 결과값 확인
    expect(result.accessToken).toBe('token123');
    
    // 💡 인터셉터 로직을 위해 스토리지에 잘 저장되었는지 확인
    expect(localStorage.getItem('accessToken')).toBe('token123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh123');
  });
});