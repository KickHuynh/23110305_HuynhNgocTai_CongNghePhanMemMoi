import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Card, Form, Input, Typography, Alert } from 'antd';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

function RegisterPage() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await axiosClient.post('/auth/register', values);

      const token = response.data.token;
      const user = response.data.data.user;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/profile');
    } catch (error) {
      const message =
        error.response?.data?.message || 'Register failed. Please try again.';

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Title level={2}>Register</Title>
        <Text type="secondary">
          Create your student account for Week 03 FullStack project.
        </Text>

        {errorMessage && (
          <Alert
            className="alert-message"
            message={errorMessage}
            type="error"
            showIcon
          />
        )}

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Huynh Ngoc Tai" />
          </Form.Item>

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
            label="Student ID"
            name="studentId"
            rules={[{ required: true, message: 'Please enter your student ID' }]}
          >
            <Input placeholder="23110305" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="123456" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;