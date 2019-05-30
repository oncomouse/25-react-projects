import React, { useState, useEffect } from 'react';
import { __, add, subtract, times } from 'ramda';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import useInterval from '../utilities/useInterval';

const Project2 = () => {
  const [down, setDown] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if(count === 75) {
      setDown(true);
    }
    if(count === 0) {
      setDown(false);
    }
  }, [count]);

  useInterval(() => {
    setCount(down ? subtract(__, 1) : add(1));
  }, 40)

  const rand = () => Math.round(Math.random() * 255);
  const randColor = () => ({
    background: `rgb(${rand()},${rand()},${rand()})`
  });

  const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    margin-top: 30px;
  `;
  const Box = styled.div`
    margin: 3px;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 50px;
  `;

  return (
    <Container>
      <Global styles={css`
        body {
          background: rgb(30,30,30);
          color: rgb(35,35,35);
          text-align: center;
          font-family: Avenir;
        }
      `} />
      {times(i => (<Box key={i} style={randColor()} />), count)}
    </Container>
  );
}

export default Project2;