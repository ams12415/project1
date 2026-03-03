import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'

import onTimeLogo from './weareontime.png';

const logoColor = '#032c58'

const Navbar = () => {
  const { setUser } = useStateContext()

  return (
    <Nav>
      <Logo onClick={() => logOut(setUser)} href="/"></Logo>
      <NavLinks>
        <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
        <ButtonLink href="/auth/login">Login</ButtonLink>
      </NavLinks>
    </Nav>
  );
};
// styling the logo which is also the nav to home
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 5rem;
`;

const Logo = styled(Link)`
  display: block-inline;
  width: 23rem;
  height: 5rem;
  background-image: url(${onTimeLogo.src});
  background-size: cover;
`;
const NavLinks = styled.div`
  width: 23rem;
  padding-top: 1rem;
`;

const ButtonLink = styled(Link)`
  text-transform: uppercase;
  text-decoration: none;g
  margin: 1rem;
  font-family: "Helvetica";

  color: white;
  background: ${logoColor};
  padding: 1rem;
  border-radius: 0.25rem;
`;

export default Navbar;
