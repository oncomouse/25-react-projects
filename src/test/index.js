/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import StyledTransition from '../utilities/StyledTransition';

const TransitionBox = styled(StyledTransition)`
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 3px;
  margin: 2px;
  background: ${props => props.background};
`;

const Test = () => {
  const [active, setIn] = useState(false);
  return (
    <div css={css`display: flex;`}>
      <TransitionBox
        transitions={{
          enter: css`
            opacity: 1.0;
          `,
          enterActive: css`
            opacity: 0.0;
            transition: opacity 250ms ease-in;
          `,
          enterDone: css`
            opacity: 0.0;
          `,
          exit: css`
            opacity: 0;
          `,
          exitActive: css`
            opacity: 1.0;
            transition: opacity 250ms ease-in;
          `
        }}
        timeout={250}
        background="rgb(192,53,70)"
        in={active}
        onClick={() => setIn(active => !active)}
      >
        <div>Hello</div>
      </TransitionBox>
      <TransitionBox
        transitions={{
          enter: css`
            opacity: 1.0;
            transform: rotate(0deg);
          `,
          enterActive: css`
            opacity: 0;
            transform: rotate(720deg);
            transition: opacity 500ms ease-in, transform 500ms ease-in;
          `,
          enterDone: css`
            opacity: 0;
          `,
          exit: css`
            opacity: 0;
          `,
          exitActive: css`
            opacity: 1.0;
            transform: rotate(-720deg);
            transition: opacity 500ms ease-in, transform 500ms ease-in;
          `
        }}
        timeout={500}
        background="rgb(192,53,70)"
        in={active}
        onClick={() => setIn(active => !active)}
      >
        <div>Hello</div>
      </TransitionBox>
    </div>
  );
}

export default Test;