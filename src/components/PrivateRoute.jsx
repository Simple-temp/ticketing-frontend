import React from 'react';
import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
const auth = localStorage.getItem('auth');
if (!auth) return <Navigate to="/" replace />;
return children;
};


export default PrivateRoute;