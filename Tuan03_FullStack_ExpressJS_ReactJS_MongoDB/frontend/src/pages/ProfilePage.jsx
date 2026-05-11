import { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Spin, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get('/auth/me');
      const currentUser = response.data.data.user;

      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      const message =
        error.response?.data?.message || 'Cannot get current user information.';

      setErrorMessage(message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="center-page">
        <Spin size="large" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="center-page">
        <Alert message={errorMessage} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Card className="profile-card">
        <Title level={2}>Student Profile</Title>
        <Text type="secondary">
          Data is loaded from ExpressJS API and MongoDB database.
        </Text>

        <Descriptions bordered column={1} className="profile-info">
          <Descriptions.Item label="Full name">
            {user.fullName}
          </Descriptions.Item>

          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

          <Descriptions.Item label="Student ID">
            {user.studentId}
          </Descriptions.Item>

          <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
        </Descriptions>

        <Button type="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

export default ProfilePage;