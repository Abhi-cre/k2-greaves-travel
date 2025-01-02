import React,{Suspense,lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
  // ,Navigate
} from "react-router-dom";
// Pages

const SiteComponentMain = lazy(() => import('../views/SiteComponentMain'));
const LoginComponentMain = lazy(() => import('../views/LoginComponentMain'));
const Navigator = () => {
  

  return (
    <Router>
       <Suspense fallback={<div className="loading-container">
        <div className="loader"></div>
    </div>}>
     
        <Routes> 
        <Route  path="/user/*"  element={<LoginComponentMain/>} />  
        <Route  path="/*"  element={<SiteComponentMain/>} />
        </Routes> 
    
      </Suspense>
    </Router>
  );
};

export default Navigator;