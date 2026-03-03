import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useStateContext } from '@/context/StateContext';
import { login } from '@/backend/Auth'; // We only need login here
import Link from 'next/link';
import Navbar from '@/components/Dashboard/Navbar';

const logoColor = '#032c58';

const Login = () => {
  const { user, setUser } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin() {
    setError(''); // Clear any old errors
    
    if (!email || !password) {
      setError("Please enter both an email and a password.");
      return;
    }

    try {
      await login(email, password, setUser);
      router.push('/'); // Redirect to your Hero dashboard page
    } catch (err) {
      console.error('Error Logging In', err);
      // Firebase throws specific errors for bad logins
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password.');
      } else {
        setError('Failed to login. Please try again.');
      }
    }
  }

  return (
    <>
      <Navbar />
      <Section>
        <Header>Login</Header>
        <Container>
          <InputTitle>Email</InputTitle>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <InputTitle>Password</InputTitle>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <UserAgreementText>
            By signing in, you automatically agree to our{' '}
            <UserAgreementSpan href="/legal/terms-of-use" target="_blank">
              Terms of Use
            </UserAgreementSpan>{' '}
            and{' '}
            <UserAgreementSpan href="/legal/privacy-policy" target="_blank">
              Privacy Policy.
            </UserAgreementSpan>
          </UserAgreementText>

          {/* This displays our red error messages! */}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <MainButton onClick={handleLogin}>Login</MainButton>
        </Container>
      </Section>
    </>
  );
};

// STYLES
const Section = styled.section`
  font-family: 'helvetica';
  background-color: #E8E9EA;
  width: 100%;
  height: 60vh;
`;

const Header = styled.h1`
  background-color: ${logoColor};
  color: white;
  font-weight: bold;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4rem;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 16px;
  border: .25rem solid ${logoColor};
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
`;

const InputTitle = styled.label`
  font-size: 1.25rem;
  color: ${logoColor};
  padding-bottom: 0.5rem;
  font-weight: bold;
`;

const MainButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
`;

const UserAgreementText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 20px;
  text-align: center;
  max-width: 300px;
`;

const UserAgreementSpan = styled(Link)`
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default Login;