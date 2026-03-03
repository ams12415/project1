import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdOutlineBusAlert } from "react-icons/md";
import { GiBusStop } from "react-icons/gi";
import { BiTimer } from "react-icons/bi";
import { useStateContext } from '@/context/StateContext';

const heroColor = "#E8E9EA";
const logoColor = '#032c58';
const blueLoopColor = '#005596'; // Penn State Blue

const STOP_MAP = {
  "Pattee Transit Center": "Pattee Library",
  "Visual Arts Bldg": "Visual Arts",
  "East Halls": "Curtin Rd",
  "Shortlidge Rd": "the HUB (Shortlidge Rd)"
};

const STOP_COORDS = {
  "Pattee Transit Center": { lat: 40.7982, lon: -77.8616 },
  "Visual Arts Bldg": { lat: 40.7998, lon: -77.8600 },
  "East Halls": { lat: 40.8005, lon: -77.8500 },
  "Shortlidge Rd": { lat: 40.7970, lon: -77.8605 }
};

const Hero = () => {
  const { user, courses } = useStateContext();
  const [busData, setBusData] = useState(null);
  const [minutesAway, setMinutesAway] = useState(null);
  const [walkingTime, setWalkingTime] = useState(null);
  const displayName = user?.email ? user.email.split('@')[0].toUpperCase() : "GUEST";

  useEffect(() => {
    const startLon = -77.8616; 
    const startLat = 40.7982; 
    
    const destinationPoint = (courses && courses.length > 0) 
      ? STOP_COORDS[courses[0].location] 
      : STOP_COORDS["Shortlidge Rd"];

    const fetchBusAndRoute = async () => {
      try {
        const busResponse = await fetch("/api/bus");
        const busData = await busResponse.json();

        if (busData && busData.Entities && busData.Entities.length > 0) {
          const activeBus = busData.Entities.find(
            (entity) => entity.Vehicle?.Trip?.RouteId === "BL" || entity.Vehicle?.Trip?.RouteId === "25"
          ) || busData.Entities[0]; 

          if (activeBus) {
            setBusData(activeBus);
            const speed = activeBus.Vehicle?.Position?.Speed || 0;
            const estimate = speed > 5 ? 3 : 8; // Faster bus is closer
            setMinutesAway(estimate);
          }
        }
        // no more hardcoded
        const stopLon = destinationPoint?.lon || -77.8605; 
        const stopLat = destinationPoint?.lat || 40.7970;

        const routeResponse = await fetch(`/api/route?start_lon=${startLon}&start_lat=${startLat}&end_lon=${stopLon}&end_lat=${stopLat}`);
        const routeData = await routeResponse.json();
        
        if (routeData.features && routeData.features.length > 0) {
           const walkMins = Math.round(routeData.features[0].properties.summary.duration / 60);
           setWalkingTime(walkMins);
        }
      } catch (err) { console.error(err); }
    };

    fetchBusAndRoute();
    const interval = setInterval(fetchBusAndRoute, 30000); 
    return () => clearInterval(interval);
  }, [courses]);

  const busPosition = minutesAway ? Math.max(0, Math.min(90, (10 - minutesAway) * 10)) : 10;

  return (
    <Section>
      <WelcomeMessage>WELCOME, {displayName}</WelcomeMessage>
      
      <StatusContainer>
        <BiTimer size="3rem" color={logoColor} />
        <BusArrivalTime>
          {minutesAway ? `${minutesAway} MIN. TO STOP` : "LOCATING BUS..."}
        </BusArrivalTime>
      </StatusContainer>

      <TrackingArea>
        <StyledBus position={busPosition} />
        <ProgressBar />
        <StyledBusStop />
      </TrackingArea>

      <RouteInfoText>
        {courses && courses.length > 0 
          ? `BLUE LOOP to ${STOP_MAP[courses[0].location] || "Campus"}` 
          : "BLUE LOOP to HUB"}
      </RouteInfoText>

      <RouteLeaveTimesContainer>
        <BoardTime>{(courses && courses.length > 0) ? courses[0].time : "3:00 PM"}</BoardTime>
        <TimeArrow />
        <ArriveTime>SUCCESS</ArriveTime>
      </RouteLeaveTimesContainer>

      <AdditionalInfoSection>
        <AdditionalInformation>
          {walkingTime ? `WALK TO STOP: ${walkingTime} MIN` : "CALCULATING WALK..."} | NO CLOSURES
        </AdditionalInformation>
      </AdditionalInfoSection>
    </Section>
  );
};

const Section = styled.section`
  background-color: ${heroColor};
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-top: 2rem;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BusArrivalTime = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-weight: bold;
  color: ${logoColor};
  margin-top: 0.5rem;
`;

const TrackingArea = styled.div`
  position: relative;
  width: 80%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
`;

const StyledBus = styled(MdOutlineBusAlert)`
  font-size: 4rem;
  color: ${blueLoopColor};
  position: absolute;
  bottom: 40px;
  left: ${props => props.position}%;
  transition: left 2s ease-in-out;
  z-index: 5;
`;

const StyledBusStop = styled(GiBusStop)`
  font-size: 4rem;
  color: ${logoColor};
  position: absolute;
  right: 0;
  bottom: 40px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 15px;
  border-radius: 10px;
  background: #ccc;
  position: absolute;
  bottom: 25px;
  overflow: hidden;
  
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      ${blueLoopColor},
      ${blueLoopColor} 10px,
      white 10px,
      white 20px
    );
  }
`;

const RouteInfoText = styled.div`
  font-family: 'Helvetica', sans-serif;
  font-weight: bold;
  font-size: 1.8rem;
  color: ${logoColor};
`;

const RouteLeaveTimesContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  justify-content: space-between;
  font-weight: bold;
`;

const BoardTime = styled.div`
  font-size: 1.5rem;
  color: ${logoColor};
`;

const TimeArrow = styled.div`
  flex-grow: 1;
  height: 10px;
  margin: 0 1rem;
  background: ${logoColor};
  border-radius: 5px;
`;

const ArriveTime = styled.div`
  font-size: 1.5rem;
  color: ${logoColor};
`;

const AdditionalInfoSection = styled.div`
  width: 100%;
  border-top: 2px solid #ccc;
  padding-top: 1rem;
  text-align: center;
`;

const AdditionalInformation = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const WelcomeMessage = styled.div`
  font-size: 1.2rem;
  font-family: 'Helvetica', sans-serif;
  font-weight: bold;
  color: ${logoColor};
  letter-spacing: 2px;
`;

export default Hero;