import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Assuming role is stored in localStorage after login

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // If the user's role is not allowed, redirect to home or show an error
    return <Navigate to="/" />;
  }

  // If authorized, render the child component
  return children;
}

export default ProtectedRoute;