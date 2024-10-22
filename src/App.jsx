import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import UnsignedDocsPage from "./pages/admin/unsignedDocuments/UnsignedDocsPage";
import UsersPage from "./pages/admin/signedDocuments/SignedDocsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import Header from "./components/common/Header";
import "./App.css";
import SignedEmployees from "./pages/admin/signedDocuments/SignedEmployeesPage";
import ViewDocuments from "./pages/user/ViewDocument";
import LoginPage from "./pages/auth/Login";
import authService from "./services/auth.service";
import UnauthorizedAccessErrorPage from "./components/common/UnauthorizedAccessErrorPage";
import LandingPage from "./pages/auth/LandingPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("Overview");
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/overview':
        setTitle("Overview");
        break;
      case '/unsigned-documents':
        setTitle("Unsigned Documents");
        break;
      case '/signed-documents':
        setTitle("Signed Documents");
        break;
      case '/settings':
        setTitle("Settings");
        break;
      case '/signed-documents/:id/employees':
        setTitle("Signatures");
        break;
      case '/view-documents':
        setTitle("Documents");
        break;
      default:
        setTitle("Overview");
    }
  }, [location]);

  const isLoginPage = location.pathname === '/admin/login';
  const isLandingPage = location.pathname === '/';
  const shouldShowSidebarAndHeader = !isLoginPage && !isLandingPage;

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100'>
      {shouldShowSidebarAndHeader && (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}
      <div className={`flex-1 ${shouldShowSidebarAndHeader ? 'pt-20' : ''} overflow-auto scrollable hide-scrollbar ${isSidebarOpen && shouldShowSidebarAndHeader ? 'ml-0' : 'ml-0'}`}>
        {shouldShowSidebarAndHeader && (
          <Header
            title={title}
            isSidebarOpen={isSidebarOpen}
            onProfileClick={() => { }}
            onLogout={() => { }}
            username={authService.getUsername()}
          />
        )}
        <Routes>
          <Route path='/admin/login' element={<LoginPage />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/overview' element={authService.getUserRole() === "ADMIN" ? <OverviewPage /> : <UnauthorizedAccessErrorPage />} />
          <Route path='/unsigned-documents' element={authService.getUserRole() === "ADMIN" ? <UnsignedDocsPage /> : <UnauthorizedAccessErrorPage />} />
          <Route path='/signed-documents' element={authService.getUserRole() === "ADMIN" ? <UsersPage /> : <UnauthorizedAccessErrorPage />} />
          <Route path='/signed-documents/:id/employees' element={authService.getUserRole() === "ADMIN" ? <SignedEmployees /> : <UnauthorizedAccessErrorPage />} />
          <Route path='/view-documents' element={<ViewDocuments />} />
          <Route path='/settings' element={authService.getUserRole() === "ADMIN" ? <SettingsPage /> : <UnauthorizedAccessErrorPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;