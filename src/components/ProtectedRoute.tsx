import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseAvailable } from "@/lib/supabase";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center p-4">Loading...</div>;
  }

  // Force them to Auth page if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
