/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { add, subtract, __ } from 'ramda';
import useInterval from '../utilities/useInterval';

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Rasa");
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css");

body {
  background: #272932;
  background-color: #0074cc;
  background-color: #e00025;
  background-image: url("http://www.transparenttextures.com/patterns/shattered-dark.png");
  color: #ffc952;
  padding: 50px;
  font-family: "Rasa", serif;
  font-size: 25px;
  min-width: 1000px;
}

hr {
  margin-top: 40px;
  margin-bottom: 2.5px;
}
`;

const StyledElements = {};
StyledElements.Title = styled.h1`
  font-size: 65px;
  color: #FFFFF2;
  margin-left: 25px;
`;
StyledElements.Control = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-left: 25px;
  
  & > div {
    margin-left: 50px;

    &:first-of-type {
      margin-left: 0; 
    }
  }
`;
StyledElements.SpeedControl = styled.div`
  float: right;
  margin-top: 10px;
`;
StyledElements.CheckContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  input {
    margin-top: 10px;
  }
  
  p {
    margin-left: 8px;
    margin-bottom: 16px;
    color: #4EFFAF;
  }
`;
StyledElements.Timer = styled.div`
  margin-left: 25px;
  margin-top: 25px;
`;
StyledElements.Button = styled.button`
  color: #272932;
  padding: 7px;
  margin: 5px;
  background: #FFFFF2;
  border: 1px solid rgba(20, 20, 20, 0.05);

  &:disabled {
    opacity: 0.75;
  }
`;
StyledElements.TimeButton = styled(StyledElements.Button)`
  width: 40px;
  text-align: center;
`;
StyledElements.PlusButton = styled(StyledElements.TimeButton)`
  &:hover {
    background: #59BAFF;
  }
`;
StyledElements.MinusButton = styled(StyledElements.TimeButton)`
  &:hover {
    background: #FF4E57;
  }
`;
StyledElements.StartButton = styled(StyledElements.Button)`
  color: #272932;
  padding: 7px;
  margin: 5px;
  background: #FFFFF2;
  border: 1px solid rgba(20, 20, 20, 0.05);
  text-align: center;
  width: 135px;
  height: 51px;

  &:hover {
    border: none;
    background: #4EFFAF;
  }
`;

const add1 = add(1);
const subtract1 = subtract(__, 1);

const STATE = {
  OFF: 1,
  WORK: 2,
  BREAK: 3,
  DONE: 4
}

const Project16 = () => {
  const [time, setTime] = useState(5);
  const [breakTime, setBreakTime] = useState(2);
  const [running, setRunning] = useState(STATE.OFF);
  const [timer, setTimer] = useState(5 * 60);
  const [speed, setSpeed] = useState(1000);

  const getStatus = (running) => {
    if (running === STATE.WORK) {
      return 'Focus!';
    }
    if (running === STATE.BREAK) {
      return 'Break!';
    }
    if (running === STATE.DONE) {
      return 'Finished!';
    }
    return 'Ready?';
  }

  // This runs the timer. When the timer starts, we set a Timeout
  // based on the length of time. Then, when it finishes, we either 
  // move to the next (break) state or end (done state):
  useEffect(() => {
    if(running !== STATE.DONE) {
      const timer = setTimeout(() => {
        setRunning(running => {
          if(running === STATE.WORK) {
            return STATE.BREAK;
          }
          return STATE.DONE;
        })
      }, (running === STATE.WORK ? breakTime : time) * speed * 60)
      return () => clearTimeout(timer);
    }
  }, [running]);

  // Change the display timer every time the time input changes:
  useEffect(() => {
    setTimer(time * 60);
  }, [time]);

  // Update the display timer every second if running
  useInterval(() => {
    if (timer === 0) {
      setTimer(breakTime * 60);
    } else {
      setTimer(subtract1);
    }
  }, (running === STATE.OFF || running === STATE.DONE) ? null : speed)

  const startOrReset = () => {
    if (running === STATE.OFF) {
      setRunning(STATE.WORK);
    } else if (running === STATE.DONE) {
      setRunning(STATE.OFF);
      setTimer(time * 60);
    }
  };

  const changeSpeed = ev => ev.target.checked ? setSpeed(25) : setSpeed(1000);

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <StyledElements.Title>Free Code Camp Pomodoro Timer</StyledElements.Title>
      <hr />
      <StyledElements.SpeedControl>
        <StyledElements.CheckContainer>
          <input type="checkbox" onChange={changeSpeed} />
          <p>Speed Mode</p>
        </StyledElements.CheckContainer>
      </StyledElements.SpeedControl>
      <StyledElements.Control>
        <div>
          <h2>Time: {time} minute{time === 1 ? '':'s'}</h2>
          <StyledElements.MinusButton
            disabled={running !== STATE.OFF}
            onClick={() => setTime(subtract1)}
          >
            -
          </StyledElements.MinusButton>
          <StyledElements.PlusButton
            disabled={running !== STATE.OFF}
            onClick={() => setTime(add1)}
          >
            +
          </StyledElements.PlusButton>
        </div>
        <div>
          <h2>Break: {breakTime} minute{breakTime === 1 ? '' : 's'}</h2>
          <StyledElements.MinusButton
            disabled={running !== STATE.OFF}
            onClick={() => setBreakTime(subtract1)}
          >
            -
          </StyledElements.MinusButton>
          <StyledElements.PlusButton
            disabled={running !== STATE.OFF}
            onClick={() => setBreakTime(add1)}
          >
            +
          </StyledElements.PlusButton>
        </div>
        <div>
          <h2>{getStatus(running)}</h2>
          <StyledElements.StartButton
            disabled={running !== STATE.OFF && running !== STATE.DONE}
            onClick={startOrReset}
          >
            {running === STATE.DONE ? 'Reset?' : 'Start Timer' }
          </StyledElements.StartButton>
        </div>
      </StyledElements.Control>
      <StyledElements.Timer>
        {running === STATE.DONE ? (
          <h1 css={css`font-size: 125px`}>great job! =D</h1>
        ) : (<h1 css={
          (running === STATE.OFF || running === STATE.DONE) ? css`font-size: 40px` : css`font-size: 300px`
        }>{Math.floor(timer / 60)} : {(timer % 60).toFixed(0).toString().padStart(2, '0')}</h1>
        )}
      </StyledElements.Timer>
    </div>
  );
}

export default Project16;