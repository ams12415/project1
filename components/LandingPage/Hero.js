import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdOutlineBusAlert } from "react-icons/md";
import { GiBusStop } from "react-icons/gi";
import { BiTimer } from "react-icons/bi";
import { useStateContext } from '@/context/StateContext';

const COURSE_LOCATIONS = {
  "CMPSC": "West Deck",
  "CMPEN": "West Deck",
  "MATH": "Visual Arts Bldg",
  "ECON": "Forum Bldg",
  "ENGL": "Willard Bldg",
  "CHEM": "Shortlidge Rd"
};

const heroColor = "#E8E9EA";
const logoColor = '#032c58'

const Hero = () => {
  const { user } = useStateContext();
  const [busData, setBusData] = useState(null);
  const [minutesAway, setMinutesAway] = useState(null);
  const [walkingTime, setWalkingTime] = useState(null);
  const displayName = user?.email ? user.email.split('@')[0].toUpperCase() : "GUEST";

  useEffect(() => {
    const fetchBusAndRoute = async () => {
      try {
        // getting bus data
        const busResponse = await fetch("/api/bus");
        const busData = await busResponse.json();

        if (busData && busData.Entities && busData.Entities.length > 0) {
          // getting some bus (temp for now)
          const activeBus = busData.Entities.find(
            (entity) => entity.Vehicle?.Trip?.RouteId === "BL" || entity.Vehicle?.Trip?.RouteId === "25"
          ) || busData.Entities[0]; 

          if (activeBus) {
            setBusData(activeBus);
    
            const speed = activeBus.Vehicle?.Position?.Speed || 0;
            const estimate = speed > 0 ? 5 : 10;
            setMinutesAway(estimate);
          } else {
             setMinutesAway("N/A");
          }
        }

        // 2. walking time (hardcoded, temporary)
        const startLon = -77.8616; 
        const startLat = 40.7982; 
        const stopLon = -77.8633; 
        const stopLat = 40.7965; 

        const routeResponse = await fetch(`/api/route?start_lon=${startLon}&start_lat=${startLat}&end_lon=${stopLon}&end_lat=${stopLat}`);
        const routeData = await routeResponse.json();
        
        if (routeData.features && routeData.features.length > 0) {
           // convert from seconds to minuts
           const walkMins = Math.round(routeData.features[0].properties.summary.duration / 60);
           setWalkingTime(walkMins);
        }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchBusAndRoute();
    const interval = setInterval(fetchBusAndRoute, 30000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Section>
      <WelcomeMessage>WELCOME, {displayName}</WelcomeMessage>
      <BusArrivalIcon></BusArrivalIcon>
      <BusArrivalIcon></BusArrivalIcon>
      <BusArrivalTime>{minutesAway ? `${minutesAway} MIN. TO STOP` : "LOADING..."}</BusArrivalTime>
      <Container>
        <StyledBus/>
        <ProgressBar/>
        <StyledBusStop/>
      </Container>
      <RouteInfoText>BLUE LOOP to MATH 220</RouteInfoText>
      <RouteLeaveTimesContainer>
        <BoardTime>3:00 PM</BoardTime>
        <TimeArrow></TimeArrow>
        <ArriveTime>3:05 PM</ArriveTime>
      </RouteLeaveTimesContainer>
      <RouteSubheadings>
          <BoardSubHeading>BOARD</BoardSubHeading>
          <ArriveSubHeading>ARRIVE</ArriveSubHeading>
      </RouteSubheadings>
      <AdditionalInfoSection>
        <AdditionalInformation>
          NEXT IN {minutesAway ? minutesAway : "..."} MIN OR WALK: {walkingTime ? walkingTime : "..."} MIN | NO CLOSURES
        </AdditionalInformation>
      </AdditionalInfoSection>
    </Section>
  );
};

const BusArrivalIcon = styled(BiTimer)`
  display: flex;
  width: 100%;
  height: 5rem;
  position: relative;
  top: 16%;
  justify-items: center;
`

const Section = styled.section`
display: block;
background-color: ${heroColor};
width: 100%;
height: 75vh;
`;

const BusArrivalTime = styled.div`
  font-size: 1rem;
  font-family: 'helvetica';
  text-align: center;
  padding: 1rem;
  font-weight: bold;
  position: relative;
  top:15%;
  color: ${logoColor}
`;


// me using icons
const StyledBus = styled(MdOutlineBusAlert)`
  width: 25%;
  height: 6rem;
  position: absolute;
  left: 6.5%;
  top: 16rem;
  z-index: 5;
`

const StyledBusStop = styled(GiBusStop)`
  width: 50%;
  height: 6rem;
  position: relative;
  top: 2rem;

`

// progress bar

let loopColor = "red";

const ProgressBar = styled.div`
  width: 50%;
  height: 2rem;
  border-radius: 1rem;
  background: repeating-linear-gradient(
    45deg,
    ${loopColor},
    ${loopColor} 10px,
    white 10px,
    white 20px
  );
  position: relative;
  top: 50%;
  left: 20%
  
`

const Container = styled.div`
  display: flex;
  height: 10rem;
  width: 100%;
`;

// route stuff

const RouteInfoText = styled.div`
  text-align: center;
  font-family: 'helvetica';
  font-weight: bold;
  font-size: 2rem;
`

const BoardTime = styled.div`
  color: ${logoColor};
  width: 20%;
  font-size: 2rem;
  text-align: right;
  margin-right: 1rem; 
`
const TimeArrow = styled.div`
  background: repeating-linear-gradient(
    45deg,
    ${logoColor},
    ${logoColor} 10px,
    white 10px,
    white 20px
  );
  border-radius: 1rem;
  width: 60%;
`

const ArriveTime = styled.div`
  font-size: 2rem;
  width: 20%;
  font-color: ${logoColor};
  margin-left: 1rem;
`

const RouteLeaveTimesContainer = styled.div`
  display: flex;
  font-weight: bold;
`
const RouteSubheadings = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 0.8rem;
  font-family: 'helvetica';
  text-align: center;
`

const BoardSubHeading = styled.div`
  width: 50%
`
const ArriveSubHeading = styled.div`
  width: 50%
`

const AdditionalInfoSection = styled.div`
  display: flex;
  justify-content: center;
  border-top: black .1rem solid;
`

const AdditionalInformation = styled.div`
  color: black;
  font-size: 2rem;
`

const HeroTextColumn = styled.div`
`;

const Header = styled.h1`
`;

const Highlight = styled.span`
`;

const SubHeader = styled.h2`

`;

const SubheaderAndStarsColumn = styled.div`

`;

const CTAButton = styled.button`

`;
const WelcomeMessage = styled.div`
  font-size: 1.5rem;
  font-family: 'helvetica';
  font-weight: bold;
  color: ${logoColor};
  text-align: center;
  padding-top: 2rem;
  letter-spacing: 2px;
`;

export default Hero;
