import { Navigate, Route, Routes } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <div className="home-page">
      <Card className="home-card">
        <Title>Week 03 FullStack Project</Title>

        <Paragraph>
          Student: Huynh Ngoc Tai - 23110305
        </Paragraph>

        <Paragraph>
          This project demonstrates a fullstack authentication flow using
          ExpressJS, ReactJS, MongoDB, Mongoose, Axios and JWT.
        </Paragraph>

        <div className="home-actions">
          <Link to="/register">
            <Button type="primary">Register</Button>
          </Link>

          <Link to="/login">
            <Button>Login</Button>
          </Link>

          <Link to="/profile">
            <Button>Profile</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;