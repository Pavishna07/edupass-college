
export enum UserRole {
  STUDENT = 'student',
  ADVISOR = 'advisor',
  HOD = 'hod',
  PRINCIPAL = 'principal',
  DEPUTY_WARDEN = 'deputy_warden',
  WARDEN = 'warden',
  SECURITY = 'security',
  ADMIN = 'admin'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export const DEPARTMENTS = [
  'ECE', 'EEE', 'CCE', 'CSBS', 'CSE', 'AIDS', 'AIML', 'IT', 
  'MECHANICAL', 'BIO-TECH', 'BIO-MEDICAL', 'CIVIL', 'CHEMICAL'
] as const;

export type Department = typeof DEPARTMENTS[number];

export enum RequestStatus {
  PENDING = 'pending', // Advisor level
  HOD_PENDING = 'hod_pending',
  PRINCIPAL_PENDING = 'principal_pending',
  DEPUTY_WARDEN_PENDING = 'deputy_warden_pending',
  WARDEN_PENDING = 'warden_pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXITED = 'exited'
}

export interface User {
  uid: string;
  email: string;
  password?: string; // Explicit password storage for mock auth
  role: UserRole;
  displayName: string;
  gender: Gender;
  department?: Department;
  registerNo?: string;
  profilePhoto?: string;
  advisorRef?: string; // UID of advisor
  hodRef?: string;     // UID of HOD
  classroomId?: string;
}

export interface OutpassRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  department: Department;
  classroomName: string;
  cgpa: string;
  reason: string;
  stayDuration: string;
  status: RequestStatus;
  currentLevel: UserRole;
  createdAt: number;
  wardenId?: string;
  deputyWardenId?: string;
  previousLeaveCount: number;
  advisorId?: string; // Explicitly stored for approval routing
  hodId?: string;     // Explicitly stored for approval routing
  exitVerifiedAt?: number;
}

export interface Classroom {
  id: string;
  name: string;
  advisorId: string;
  department: Department;
  studentIds: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'exit_verified' | 'status_update';
}
