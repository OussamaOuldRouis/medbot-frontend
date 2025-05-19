
import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";

const Index = () => {
  const { user } = useAuth();
  
  return user ? <Dashboard /> : <LandingPage />;
};

export default Index;
