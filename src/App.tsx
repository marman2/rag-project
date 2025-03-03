// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthProvider";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ChatComponent from './components/ChatComponent';
import NotFound from '@/pages/404';
import { UserManagement } from "./components/UserManagement";
import { DocumentManagement } from "./components/DocumentManagement";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Layout>
              <Routes>
                <Route path="/" element={<ChatComponent />} />
                <Route path="/chat" element={<ChatComponent />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <DocumentManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
