import { Route, Routes } from 'react-router';
import './App.css';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import UniversityPage from './pages/UniversityPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/user/:address" element={<UserPage />} />
        <Route path="/admin-page" element={<AdminPage />} />
        <Route path="/university-page" element={<UniversityPage />} />
      </Routes>
    </>
  )
}

export default App;
