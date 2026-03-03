import React from 'react';
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import { BiSolidBus } from "react-icons/bi";


const logoColor = '#032c58'

export default function Home() {
  return (
    <>
      <Navbar/>
      <Container>
        <Header>
            Routes
        </Header>
        <LoopPanel>
            <h1>BLOOP</h1>
            <LoopIcon1></LoopIcon1>
            <h1>Red Link</h1>
            <LoopIcon2></LoopIcon2>
            <h1>WHOOP</h1>
            <LoopIcon3></LoopIcon3>
        </LoopPanel>
        <LoopLines>
            <h3>No Closures for Blue Loop at this time.</h3>
            <BloopLine></BloopLine>
            <RedLink></RedLink>
            <WhoopLine></WhoopLine>
        </LoopLines>
        </Container>
    </>
  )
}

const Container = styled.div`
  font-family: 'helvetica';
  background-color: #E8E9EA;
  width: 100%;
  height: 60vh;
`

const Header = styled.div`
  background-color: ${logoColor};
  color: white;
  font-weight: bold;
  height: 2.5rem;
  text-align: center;
  align-content: center;
  font-size: 2rem;
`

const LoopPanel = styled.div`
    padding: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    &:hover {
        cursor: pointer;
    }
`
// rewrite with props later pls
const BloopLabel = styled.div`
    color: lightblue;
`
const LoopIcon1 = styled(BiSolidBus)`
    height: 12vh;
    width: 12vh;
    color: blue;
`
const LoopIcon2 = styled(BiSolidBus)`
    height: 12vh;
    width: 12vh;
    color: red;
`
const LoopIcon3 = styled(BiSolidBus)`
    height: 12vh;
    width: 12vh;
    color: black;
`

const LoopLines = styled.div`
    display: flex;
    justify-content: space-around;
    align-content: center
`

const BloopLine = styled.div`
    height: 7rem;
    width: 1.5rem;
    background-color: blue;
    border: .1rem black solid;
`
const BloopInfo = styled.div`

`


const RedLink = styled.div`
    height: 7rem;
    width: 1.5rem;
    background-color: red;
    border: .1rem black solid;
`

const WhoopLine = styled.div`
    height: 7rem;
    width: 1.5rem;
    background-color: white;
    border: .1rem black solid;
`