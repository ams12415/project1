import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { isEmailInUse, register} from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/Dashboard/Navbar'

const logoColor = '#032c58';

const Signup = () => {
  const { user, setUser } = useStateContext();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');;

  const router = useRouter()

  async function validateEmail(){
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(emailRegex.test(email) == false ){
        return false;
    }
    console.log('so far so good...')
    const emailResponse = await isEmailInUse(email)
    console.log('email response', emailResponse)
    if(emailResponse.length == 0 ){
        return false;
    }

    return true;
}

  async function handleSignup(){
    const isValidEmail = await validateEmail()
    // console.log('isValidEmail', isValidEmail)
    // if(!isValidEmail){ return; }
    setError('');
    try {
      await register(email, password, setUser)
      router.push('/') // Make sure this matches your actual Hero page route!
    } catch(err) {
        console.log('Error Signing Up', err)
        // Firebase sends specific error codes we can check
        if (err.code === 'auth/weak-password') {
            setError('Password must be at least 6 characters.');
        } else if (err.code === 'auth/email-already-in-use') {
            setError('That email is already in use.');
        } else {
            setError('Failed to create an account. Check your info.');
        }
    }
  }


  return (
    <>
    <Navbar/>
    <Section>
        <Header>Signup</Header>
        <Container>
          <InputTitle>Email</InputTitle>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <br/>
          <InputTitle>Password</InputTitle>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

          <UserAgreementText>By signing in, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <MainButton onClick={handleSignup}>Signup</MainButton>
        </Container>
    </Section>
    </>
  )
}

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
  text-align: center;
  align-content: center;
  font-size: 2rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  border: solid black 4px;
`

const Input = styled.input`
  font-size: 16px;
  border: .25rem solid ${logoColor};
  padding: 1rem;

`;

const InputTitle = styled.label` /* Changed to label for semantics */
  font-size: 1.25rem;
  color: ${logoColor};
  padding: 1rem;
`;

const MainButton = styled.button`
  font-size: 16px;

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
`;

const UserAgreementSpan = styled(Link)` 
  color: #007bff;

`;


export default Signup