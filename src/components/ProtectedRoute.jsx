import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth);

  if (user.uid === "" || user.uid === undefined || user.uid === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
