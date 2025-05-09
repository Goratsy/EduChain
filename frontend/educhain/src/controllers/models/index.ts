// Типы и модели для API

type HealthCheckResponse = string;
type AdminResponse = { admin: string };
type UserRole = 'None' | 'Admin' | 'University' | 'Student';

interface UserInfo {
    address: string;
    role: UserRole;
    achievementsCount: number;
    achievements: Achievement[];
}

interface Achievement {
    studentId: string;
    courseName: string;
    grade: number;
    university: string;
}

interface UsersResponse {
    users: string[];
}

interface AddUniversityRequest {
    universityAddress: string;
    adminAddress: string;
    privateKey: string;
}

interface AddUniversityResponse {
    success: boolean;
    transactionHash: string;
    universityAddress: string;
    blockNumber: number;
}

interface AddStudentRequest {
    studentAddress: string;
    universityAddress: string;
    privateKey: string;
}

interface AddStudentResponse {
    success: boolean;
    transactionHash: string;
    studentAddress: string;
}

interface AddAchievementRequest {
    studentAddress: string;
    studentId: string;
    courseName: string;
    grade: number;
    universityAddress: string;
    privateKey: string;
}

interface AddAchievementResponse {
    success: boolean;
    transactionHash: string;
    achievement: {
        studentId: string;
        courseName: string;
        grade: number;
    };
}

export type {
    HealthCheckResponse,
    AdminResponse,
    UserInfo,
    Achievement,
    UsersResponse,
    AddUniversityRequest,
    AddUniversityResponse,
    AddStudentRequest,
    AddStudentResponse,
    AddAchievementRequest,
    AddAchievementResponse
};
