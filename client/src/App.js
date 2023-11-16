import './App.css';
import LoaderComponent from './components/loader';
import LoginComponent from './components/login';
import DashboardComponent from './components/dashboard/dashboard';
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {

  // const [loading, setLoading] = useState(true);
  // const [userEmail, setUserEmail] = useState(null);
  // console.log(userEmail);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const storedEmail = localStorage.getItem('userEmail');
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //       setUserEmail(storedEmail);
  //       setLoading(false);
  //     } catch (error) {
  //         console.error('Error fetching data:', error);
  //         setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const storedEmail = localStorage.getItem('userEmail');
  //   setUserEmail(storedEmail);
  //   setLoading(false);
  // }, []);

  return (
    <div className='h-screen w-screen'>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardComponent />}
          />
          <Route
            path="/login"
            element={<LoginComponent />}
          />
          <Route
            path="/"
            element={<LoginComponent />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
