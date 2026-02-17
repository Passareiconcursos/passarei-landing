import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

export interface StudentProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  plan: string;
  planStatus: string | null;
  examType: string | null;
  cargo: string | null;
  state: string | null;
  firstInteractionDate: string | null;
  totalQuestionsAnswered: number;
  onboardingDone: boolean;
}

interface StudentAuthContextType {
  student: StudentProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateProfile: (profile: StudentProfile) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

const TOKEN_KEY = "passarei_student_token";

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/sala/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.profile) {
        setStudent(data.profile);
      } else {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setStudent(null);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/sala/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setStudent(data.profile);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Erro ao fazer login." };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch("/api/sala/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setStudent(data.profile);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Erro ao criar conta." };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setStudent(null);
    fetch("/api/sala/auth/logout", { method: "POST" }).catch(() => {});
    setLocation("/sala");
  };

  const updateProfile = (profile: StudentProfile) => {
    setStudent(profile);
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        token,
        isLoading,
        isAuthenticated: !!student,
        login,
        register,
        logout,
        refresh: fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const context = useContext(StudentAuthContext);
  if (context === undefined) {
    throw new Error("useStudentAuth must be used within StudentAuthProvider");
  }
  return context;
}
