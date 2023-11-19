import './App.css';
import Loading from './pages/loader';
import NotFound from './pages/notFound';
import Login from './components/login';
import Dashboard from './components/dashboard/dashboard';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './router/privateRoute';

const App = () => {

  const isLoggedIn = localStorage.getItem('userEmail') !== null;

  return (
    <div className='h-screen w-screen'>
      <BrowserRouter>
        <Routes>
          {isLoggedIn &&
            <>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            </>}
          <Route path="/dashboard" loader={Loading} element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
          <Route path="/login" loader={Loading} element={<Login />} />
          <Route path="/" loader={Loading} element={<Login />} />
          <Route path="*" loader={Loading} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
