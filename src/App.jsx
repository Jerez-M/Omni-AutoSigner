import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import ProductsPage from "./pages/admin/UnsignedDocsPage";
import UsersPage from "./pages/admin/SignedDocsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import Header from "./components/common/Header";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100'>
      {/* Background */}
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
        <div className='absolute inset-0 backdrop-blur-sm' />
      </div>

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className={`flex-1 pt-20 overflow-auto ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}> {/* Adjust for sidebar width */}
        <Header title="Overview" isSidebarOpen={isSidebarOpen} onProfileClick={() => {}} onLogout={() => {}} username={"JEREMIAH MUCHAZONDIDA"} />
        <Routes>
          <Route path='/' element={<OverviewPage />} />
          <Route path='/unsigned-documents' element={<ProductsPage />} />
          <Route path='/signed-documents' element={<UsersPage />} />
          <Route path='/settings' element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;