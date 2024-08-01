import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes,Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/* <Link></Link> */}
    </div>
  );
};

const NotFound = () => {
  const location = useLocation();
  const path = location.pathname;
  const lastSegment = path.substring(path.lastIndexOf('/') + 1);
  console.log(lastSegment);

// useEffect(function () =>{

// }[])

  return (
    <div>
      <h2>404 Page Not Found</h2>
      <p>The path you entered: {path}</p>
      
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
