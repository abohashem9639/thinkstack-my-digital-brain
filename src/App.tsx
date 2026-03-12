import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import TasksPage from "./pages/TasksPage";
import PomodoroPage from "./pages/PomodoroPage";
import IdeasPage from "./pages/IdeasPage";
import SnippetsPage from "./pages/SnippetsPage";
import GoalsPage from "./pages/GoalsPage";
import KnowledgePage from "./pages/KnowledgePage";
import TechLibraryPage from "./pages/TechLibraryPage";
import HabitsPage from "./pages/HabitsPage";
import FocusPage from "./pages/FocusPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/*"
                  element={
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/pomodoro" element={<PomodoroPage />} />
                        <Route path="/ideas" element={<IdeasPage />} />
                        <Route path="/snippets" element={<SnippetsPage />} />
                        <Route path="/goals" element={<GoalsPage />} />
                        <Route path="/knowledge" element={<KnowledgePage />} />
                        <Route path="/tech-library" element={<TechLibraryPage />} />
                        <Route path="/habits" element={<HabitsPage />} />
                        <Route path="/focus" element={<FocusPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayout>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
