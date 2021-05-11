import React from "react";
import styled from 'styled-components';

// import links for pages
import { Link } from 'react-router-dom';

// add styling content
const Nav = styled.div `
    background: #15171c;
    height: 80px;
    display: flex; 
    justify-content: flex-start;
    align-items: center; 
`;

const SidebarFilters = () => {
  return (
    <div>
      <Nav>Nav</Nav>
    </div>
  );
};

export default SidebarFilters;
