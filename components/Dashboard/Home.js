import React from 'react';
import Link  from 'next/link';
import { IoIosBeaker  } from 'react-icons/io'; // Importing a home icon from react-icons
import styled from 'styled-components';

// home button

const Home = () => {
  return (
    <>
      <Square href="./index"></Square>
    </>
  );
};
// square is the button itself, as a link
const Square = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px; // Adjust the size as needed
  height: 50px; // Adjust the size as needed
  background-color: #33ff00; // Adjust the background color as needed
  color: white;
  border-radius: 4px; // Adjust for square or rounded corners
  text-decoration: none;
  
  svg {
    width: 24px; // Adjust icon size as needed
    height: 24px; // Adjust icon size as needed
  }

  &:hover {
    background-color: #0056b3; // Adjust hover effect as needed
  }
`;

export default Home;
