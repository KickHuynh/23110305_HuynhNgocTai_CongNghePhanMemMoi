import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Form, Input, Typography, Alert } from 'antd';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await axiosClient.post('/auth/login', values);

      const token = response.data.token;
      const user = response.data.data.user;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/profile');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Title level={2}>Login</Title>
        <Text type="secondary">
          Login to view your FullStack profile information.
        </Text>

        {errorMessage && (
          <Alert
            className="alert-message"
            message={errorMessage}
            type="error"
            showIcon
          />
        )}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Email is not valid' },
            ]}
          >
            <Input placeholder="tai.week03@gmail.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="123456" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form>

        <p className="auth-footer">
          Do not have an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;