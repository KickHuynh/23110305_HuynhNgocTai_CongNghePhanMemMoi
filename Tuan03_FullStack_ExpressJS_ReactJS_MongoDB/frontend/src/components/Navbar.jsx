import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <Link to="/" className="logo">
        UTE Week 03 FullStack
      </Link>

      <div className="nav-actions">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <Button danger onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;