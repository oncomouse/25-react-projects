/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import StyledTransition from '../utilities/StyledTransition';
import { curry, evolve, not, reduce } from 'ramda';

const GLOBAL_STYLE = css`
body {
  background: #36413E;
  background: linear-gradient(to top right, #0f0f0f, #323232) fixed no-repeat;
  color: #D7D6D6;
  text-align: center;
}
`;

const Elements = {};
Elements.Title = styled.h1`
  font-size: 50px;
  font-weight: normal;
  color: #FF5E33;
`;
Elements.ControlWrapper = styled.div``;
Elements.Controls = styled.div`
  max-width: 750px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;

  hr {
    margin-top: 25px;
    margin-bottom: -45px;
    width: 85vw;
    border: 1px solid #F8F4A6;
  }
`;
Elements.ControlButton = styled.button`
  width: 175px;
  font-size: 22px;
  padding: 10px;
  margin: 5px;
  font-family: Avenir;
  border: none;
  border-Radius: 3px;
  box-shadow: none;
  background: ${props => props.background || 'rgb(6, 255, 150)'};
  transition: color 150ms ease-in, background 100ms ease-in;

  &:hover {
    cursor: pointer;
    background: #06FF96 !important;
    color: #FF5E33;
    transition: color 150ms ease-in, background 100ms ease-in;    
  }

  &:focus {
    outline: none;
  }
`;
Elements.AllButton = styled(Elements.ControlButton)`
  margin-top: -25px;
  margin-bottom: 15px;
`;
Elements.TransitionsContainer =styled.div`
  padding: 50px;
  color: #141414;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;
Elements.TransitionBlock = styled(StyledTransition)`
  border: 1px solid #F8F4A6;
  width: 150px;
  height: 150px;
  padding: 10px;
  margin: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-family: Avenir;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  color: ${({color}) => color || 'rgb(25, 25, 25)'};
  background: ${({background}) => background || 'rgb(192, 53, 70)'};

  &:hover {
    border: 1px solid #FF5E33;
    transition: border-color 150ms ease-in;
  }
`;

const ACTIVE_BUTTON_BG = 'rgb(253, 214, 146)';

const TRANSITIONS = [
  {
    key: 'fadeOut',
    buttonText: 'Fade Out',
    buttonActiveText: 'Fade In',
    duration: 1000,
    css: {
      enter: css`
        transition: opacity 1000ms ease-in;
        opacity: 1.0;
      `,
      enterActive: css`
        transition: opacity 1000ms ease-in;
        opacity: 0;
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transition: opacity 1000ms ease-in;
        opacity: 0;
      `,
      exitActive: css`
        transition: opacity 1000ms ease-in;
        opacity: 1.0;
      `
    },
    divText: 'This div fades in and out'
  },
  {
    key: 'slideIn',
    buttonText: 'Slide Out Right',
    buttonActiveText: 'Slide In Left',
    duration: 800,
    css: {
      enter: css`
        transform: translate3d(0, 0, 0);
      `,
      enterActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(700%, 0, 0);
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: translate3d(700%, 0, 0);
      `,
      exitActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(0, 0, 0);
      `
    },
    divText: 'This div slides in and out',
    background: 'rgb(0, 78, 102)'
  },
  {
    key: 'slideUp',
    buttonText: 'Slide Out Up',
    buttonActiveText: 'Slide In Down',
    duration: 800,
    css: {
      enter: css`
        transform: translate3d(0, 0, 0);
      `,
      enterActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(0, -400%, 0);
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: translate3d(0, -400%, 0);
      `,
      exitActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(0, 0, 0);
      `
    },
    divText: 'This div slides up and down',
    background: 'rgb(248, 202, 0)'
  },
  {
    key: 'slider',
    buttonText: 'Slider Out',
    buttonActiveText: 'Slider In',
    duration: 1000,
    css: {
      enter: css`
        transform: translate3d(0, 0, 0);
      `,
      enterActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(-1000%, 300%, 0);
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: translate3d(-1000%, 300%, 0);
      `,
      exitActive: css`
        transition: transform 800ms ease-in;
        transform: translate3d(0, 0, 0);
      `
    },
    divText: 'This div slides around',
    background: 'rgb(52, 138, 167)'
  },
  {
    key: 'height',
    buttonText: 'Height In',
    buttonActiveText: 'Height Out',
    duration: 1000,
    css: {
      enter: css`
        transform: scaleY(1);
      `,
      enterActive: css`
        transition: transform 1000ms ease-in;
        transform: scaleY(0);
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: scaleY(0);
      `,
      exitActive: css`
        transition: transform 800ms ease-in;
        transform: scaleY(1);
      `
    },
    divText: 'This button grows and squishes',
    background: 'rgb(191, 78, 48)'
  },
  {
    key: 'width',
    buttonText: 'Width In',
    buttonActiveText: 'Width Out',
    duration: 1000,
    css: {
      enter: css`
        transform: scaleX(1);
        color: inherit;
      `,
      enterActive: css`
        transition: transform 1000ms ease-in, color 1000ms ease-in;
        transform: scaleX(0);
        color: transparent;
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: scaleX(0);
        color: transparent;
      `,
      exitActive: css`
        transition: transform 1000ms ease-in, color 1000ms ease-in;
        transform: scaleX(1);
        color: inherit;
      `
    },
    divText: 'This div expands and squeezes (with fade in text!)',
    background: 'rgb(237, 49, 127)'
  },
  {
    key: 'size',
    buttonText: 'Size In',
    buttonActiveText: 'Size Out',
    duration: 1000,
    css: {
      enter: css`
        transform: scale(1);
      `,
      enterActive: css`
        transition: transform 1000ms ease-in, color 1000ms ease-in;
        transform: scale(0);
        transform-origin: center;
        color: transparent;
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        transform: scale(0);
        transform-origin: center;
        color: transparent;
      `,
      exitActive: css`
        transition: transform 1000ms ease-in, color 1000ms ease-in;
        transform: scale(1);
        color: #F0EBD8;
      `
    },
    divText: 'This div expands and contracts (with fade in text!)',
    background: 'rgb(29, 45, 68)',
    color: '#F0EBD8'
  },
  {
    key: 'rotate',
    buttonText: 'Rotate In',
    buttonActiveText: 'Rotate Out',
    duration: 1000,
    css: {
      enter: css`
        transform: rotate(0);
        opacity: 1.0;
      `,
      enterActive: css`
        transition: transform 1000ms ease-in, opacity 1000ms ease-in, color 1000ms ease-in;
        opacity: 0.0;
        transform: rotate(720deg);
        color: transparent;
      `,
      enterDone: css`
        display: none;
      `,
      exit: css`
        opacity: 0.0;
        transform: rotate(720deg);
        color: transparent;
      `,
      exitActive: css`
        transition: transform 1000ms ease-in, opacity 1000ms ease-in, color 1000ms ease-in;
        transform: rotate(0);
        opacity: 1.0;
        color: #FF3F00;
      `
    },
    divText: 'This div rotates!',
    color: '#FF3F00',
    background: 'rgb(91, 55, 88)'
  }
]

const makeAllState = curry((value, transitions) => reduce((obj, transition) => ({ ...obj, [transition.key]: value }), {}, transitions));

const Project20 = () => {
  const [state, setState] = useState(makeAllState(false, TRANSITIONS));
  const [all, setAll] = useState(false);

  const evolver = key => evolve({
    [key]: not
  })

  const onClick = key => () => {
    setState(evolver(key));
  };

  const toggleAll = () => {
    setState(makeAllState(!all, TRANSITIONS));
    setAll(!all);
  };

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <Elements.Title>React CSS Transitions</Elements.Title>
      <Elements.ControlWrapper>
        <Elements.AllButton onClick={toggleAll}>Toggle All {all ? 'On' : 'Off'}</Elements.AllButton>
        <Elements.Controls>
          {TRANSITIONS.map(transition => (
            <Elements.ControlButton
              key={transition.key}
              onClick={onClick(transition.key)}
              background={state[transition.key] ? ACTIVE_BUTTON_BG : undefined }
            >
              { !state[transition.key] ? transition.buttonText : transition.buttonActiveText }
            </Elements.ControlButton>
          ))}
          <hr/>
        </Elements.Controls>
      </Elements.ControlWrapper>
      <Elements.TransitionsContainer>
        {TRANSITIONS.map(transition => 
          (<Elements.TransitionBlock
            key={transition.key}
            in={state[transition.key]}
            timeout={transition.duration}
            onClick={onClick(transition.key)}
            transitions={transition.css}
            background={transition.background}
            color={transition.color}
          >
            <div>{transition.divText}</div>
          </Elements.TransitionBlock>)
        )}
      </Elements.TransitionsContainer>
    </div>
  );
}

export default Project20;