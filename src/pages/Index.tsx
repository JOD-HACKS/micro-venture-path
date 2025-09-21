import { Navigate } from 'react-router-dom';

// Index page redirects to Landing
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
