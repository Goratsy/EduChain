import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions} from '@tanstack/react-query';
import type { Achievement, AddAchievementRequest, AddAchievementResponse, AddStudentRequest, AddStudentResponse, AddUniversityRequest, AddUniversityResponse, AdminResponse, HealthCheckResponse, UserInfo, UsersResponse } from './models';
import apiClient from './api';


// 1. Проверка работы API
export const useHealthCheck = (options?: UseQueryOptions<HealthCheckResponse>) => {
  return useQuery<HealthCheckResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get<HealthCheckResponse>('/');
      return response.data;
    },
    ...options
  });
};

// 2. Получить адрес администратора
export const useAdminAddress = (options?: UseQueryOptions<string>) => {
  return useQuery<string>({
    queryKey: ['admin'],
    queryFn: async () => {
      const response = await apiClient.get<AdminResponse>('/admin');
      return response.data.admin;
    },
    ...options
  });
};

// 3. Получить информацию о пользователе
export const useUserInfo = (
  address: string | undefined, 
  options?: UseQueryOptions<UserInfo>
) => {
  return useQuery<UserInfo>({
    queryKey: ['user', address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
      const response = await apiClient.get<UserInfo>(`/user/${address}`);
      return response.data;
    },
    enabled: !!address,
    ...options
  });
};

// 4. Получить всех пользователей
export const useAllUsers = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get<UsersResponse>('/users');
      return response.data.users;
    },
    ...options
  });
};

// 5. Добавить университет
export const useAddUniversity = (
  options?: UseMutationOptions<AddUniversityResponse, unknown, AddUniversityRequest>
) => {
  return useMutation<AddUniversityResponse, unknown, AddUniversityRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AddUniversityResponse>('/add-university', data);
      return response.data;
    },
    ...options
  });
};

// 6. Добавить студента
export const useAddStudent = (
  options?: UseMutationOptions<AddStudentResponse, unknown, AddStudentRequest>
) => {
  return useMutation<AddStudentResponse, unknown, AddStudentRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AddStudentResponse>('/add-student', data);
      return response.data;
    },
    ...options
  });
};

// 7. Добавить достижение
export const useAddAchievement = (
  options?: UseMutationOptions<AddAchievementResponse, unknown, AddAchievementRequest>
) => {
  return useMutation<AddAchievementResponse, unknown, AddAchievementRequest>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AddAchievementResponse>('/add-achievement', data);
      return response.data;
    },
    ...options
  });
};

// 8. Получить достижения студента
export const useStudentAchievements = (
  studentAddress: string | undefined,
  options?: UseQueryOptions<Achievement[]>
) => {
  return useQuery<Achievement[]>({
    queryKey: ['achievements', studentAddress],
    queryFn: async () => {
      if (!studentAddress) throw new Error('Student address is required');
      const response = await apiClient.get<Achievement[]>(`/achievements/${studentAddress}`);
      return response.data;
    },
    enabled: !!studentAddress,
    ...options
  });
};