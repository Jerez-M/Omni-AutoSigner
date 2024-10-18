import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import ProductsPage from "./pages/admin/unsignedDocuments/UnsignedDocsPage";
import UsersPage from "./pages/admin/signedDocuments/SignedDocsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import Header from "./components/common/Header";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("Overview");
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
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
      default:
        setTitle("Overview");
    }
  }, [location]);

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100'>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`flex-1 pt-20 overflow-auto scrollable hide-scrollbar ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <Header
          title={title}
          isSidebarOpen={isSidebarOpen}
          onProfileClick={() => { }}
          onLogout={() => { }}
          username={"JEREMIAH MUCHAZONDIDA"}
        />
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