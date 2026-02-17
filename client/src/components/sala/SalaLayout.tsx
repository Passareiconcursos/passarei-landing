import { ReactNode } from "react";
import { useStudentAuth } from "@/contexts/StudentAuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LogOut,
  Send,
  Loader2,
} from "lucide-react";

interface SalaLayoutProps {
  children: ReactNode;
}

const TELEGRAM_BOT_URL = "https://t.me/PassareiBot";

export function SalaLayout({ children }: SalaLayoutProps) {
  const { student, isLoading, isAuthenticated, logout } = useStudentAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !student) {
    setLocation("/sala");
    return null;
  }

  if (!student.onboardingDone) {
    setLocation("/sala/onboarding");
    return null;
  }

  // Format exam/cargo display
  const examLabel = student.examType || "";
  const cargoLabel = student.cargo ? ` — ${student.cargo}` : "";
  const firstName = student.name?.split(" ")[0] || "Aluno";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          {/* Left: Logo + Student info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg hidden sm:inline">Passarei</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-border" />
            <div className="hidden md:block text-sm">
              <span className="font-medium">{firstName}</span>
              {examLabel && (
                <span className="text-muted-foreground ml-1">
                  — Estuda para {examLabel}{cargoLabel}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Telegram</span>
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Mobile: Student info bar */}
        <div className="md:hidden border-t px-4 py-1.5 text-xs text-muted-foreground">
          {firstName} — {examLabel}{cargoLabel}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
