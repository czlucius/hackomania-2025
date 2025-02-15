import React from "react";
import styled from "styled-components";
import grassImage from "../grass.jpg";

const SplashContainer = styled.div`
  display: flex;
  flex-direction: row; // Default to row for larger screens
  height: 100vh;
  width: 100vw;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) { /* Adjust breakpoint as needed */
    flex-direction: column; // Switch to column on smaller screens
  }
`;

const LeftSide = styled.div`
  width: 50%;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 30px; /* Adjust padding for smaller screens */

  @media (max-width: 768px) {
    width: 100%; // Take full width on smaller screens
    padding: 20px; /* Adjust padding further if needed */
    align-items: center; // Center horizontally on mobile
  }
`;

const AppName = styled.h1`
  font-size: 2.5rem; /* Slightly smaller app name on mobile */
  color: #333;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center; // Center on mobile
  }
`;

const Tagline = styled.p`
  font-size: 1.1rem; /* Slightly smaller tagline on mobile */
  color: #666;
  margin-bottom: 25px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center; // Center on mobile
  }
`;

const GreenButton = styled.button`
  background-color: #008000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem; /* Slightly smaller button on mobile */
  font-weight: 500;
  cursor: pointer;
  margin-left: 0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #006400;
  }

  @media (max-width: 768px) {
    padding: 10px 25px; // Adjust padding on mobile
    font-size: 1rem;
  }
`;

const RightSide = styled.div`
  width: 50%;
//   background: linear-gradient(to bottom, #90EE90, #32CD32);
  background-size: cover;
  background-position: center;
  background-image: url(${grassImage}); // Use template literal to insert the image
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    width: 100%; // Take full width on smaller screens
    height: 50vh; // Give a defined height to the image section
  }
`;

const Splash = ({ onGetStarted }) => {
  const handleClick = () => {
    onGetStarted();
  };

  return (
    <SplashContainer>
      <LeftSide>
        <AppName>Recipe Generator</AppName>
        <Tagline>Discover delicious meals from your leftovers.</Tagline>
        <a href="/started"><GreenButton onClick={handleClick}>Get Started</GreenButton></a>
      </LeftSide>
      <RightSide />
    </SplashContainer>
  );
};

export default Splash;