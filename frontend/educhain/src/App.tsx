import { Route, Routes } from 'react-router';
import './App.css';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={''} />
        <Route path="/users" element={''} />
        <Route path="/user/:address" element={''} />
        <Route path="/admin-page" element={''} />
        <Route path="/university-page" element={''} />
      </Routes>
    </>
  )
}

export default App
