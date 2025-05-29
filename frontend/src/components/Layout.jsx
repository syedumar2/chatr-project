import { AuthProvider } from "@/utils/AuthContext";


const Layout = ({ children }) => {
  return (
    <AuthProvider>
    <div className="min-h-screen bg-gray-900 text-white">

      {children}
    </div>
    </AuthProvider>
  );
};

export default Layout;
