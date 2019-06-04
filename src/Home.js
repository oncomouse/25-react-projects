import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Global, css } from '@emotion/core';
import { match } from 'ramda';
import projects from './projects.json';
import logo from './logo.svg';

const Home = () => {

  return (
    <div>
      <Global styles={css`
        @import url("https://fonts.googleapis.com/css?family=Quicksand");
        body {
          background: rgb(30,30,30);
          font-family: proxima-nova, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
          text-align: center;
          color: rgb(114, 223, 250);
          width: 1200px;
          padding-bottom: 25px;
        }

        h1 {
          font-size: 50px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
      `} />
      <Header/>
      <Projects/>
    </div>
  );
}

const HeaderContainer = styled.div`
  position: fixed;
  left: 0;
  width: 400px;
  height: 100%;
  background: rgb(30,30,30);
  border-right: 1px solid white;
  padding-top: 5px;
`;

const Logo = styled.img`
  width: 330px;
  margin-top: -10px;
  margin-bottom: -30px;
`;

const About = styled.div`
  width: 350px;
  margin: 25px auto;

  & a {
    color: rgb(150,150,150);
    text-decoration: none;
  }
  
  & a:hover {
    text-decoration: underline;
  }
`

const AboutText = styled.p`
  color: white;
  font-family: 'Quicksand', sans-serif;
  font-size: 28px;
  color: rgb(150,150,150);
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo alt="The React Logo" src={logo} />
      <h1>25 React Projects</h1>
      <About>
        <AboutText>
          25 Projects to learn React. Page is based on the challenges set by <a href="http://sean-smith.me/assets/portfolio/25-react-projects/index.html">Sean Smith</a>.
        </AboutText>
      </About>
    </HeaderContainer>
  )
}

const ProjectsContainer = styled.div`
  position: absolute;
  left: 430px;
  width: 700px;
  padding-top: 15px;
  background: rgb(30,30,30);
  z-index: 1;

  h1 {
    text-align: left;
  }
`;

const Cell = styled.td`
  font-family: 'Quicksand', sans-serif;
  font-size: 27px;
  text-align: left;

  & a {
    color: white;
    text-decoration: none;
  }
  
  & a:hover {
    text-decoration: underline;
  }

  ${({left}) => left ? 'padding-right: 5px' : 'padding-left: 5px'}
`;

const Projects = () => {
  return (
    <ProjectsContainer>
      <h1>The Projects</h1>
      <table>
        <tbody>
          {projects.map((project, i) => {
            const number = parseInt(match(/([0-9]+)$/, project.id), 10);
            if(isNaN(number)) { return null }
            return (
              <tr key={i}>
                <Cell left={true}>Project {number}:</Cell>
                <Cell left={false}><Link to={`/projects/${project.id}`}>{project.name}</Link></Cell>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ProjectsContainer>
  );
}

export default Home;