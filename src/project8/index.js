/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { memo, useEffect, useState } from 'react';
import {
  __,
  add,
  append,
  both,
  compose,
  cond,
  curry,
  equals,
  gte,
  identity,
  ifElse,
  indexOf,
  lt,
  lte,
  max,
  min,
  nth,
  subtract,
  update,
  without
} from 'ramda';
import logo from '../logo.svg';
import useInterval from '../utilities/useInterval';

const GLOBAL_STYLE = css`
@import url('https://fonts.googleapis.com/css?family=Prompt');

body {
  background: #492540;
  font-family: 'Prompt', sans-serif;
}

input[type=range] {
  -webkit-appearance: none;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 300px;
  height: 5px;
  background: #f26d5b;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #f6ea8c;
  margin-top: -8px;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: #f26d5b;
}
`
const DELAY = 75;
const MIN = [0, 0];
const MAX = [450, 450];

const KEY = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};
const inRange = both(gte(__, KEY.LEFT), lte(__, KEY.DOWN));

export const moveFactory = (borderMin, borderMax) => {
  /**
 * Function that calculates a generic move on the board:
 * 
 * @param {function} math - A mathematical function (Number, Number) -> Number
 * @param {function} compare - A choice function (x, y) -> (x || y)
 * @param {array} border - Boundary values (must have same indexing as vector)
 * @param {number} index - An index value for vector and border
 * @param {number} vector - Array of [top, left, speed] values
 */
  const changePosition = curry((math, compare, border, index, vector) => update(
    index,
    // Run the choice function on the appropriate border value:
    compare(
      nth(index, border),
      // Run the mathematical function on the appropriate position element and speed:
      math(
        nth(index, vector),
        nth(2, vector)
      )
    ),
    vector
  ));
  const lower = changePosition(subtract, max, borderMin);
  const raise = changePosition(add, min, borderMax);
  const moveUp = lower(0);
  const moveDown = raise(0);
  const moveLeft = lower(1);
  const moveRight = raise(1);
  const move = curry((keycode, vector) => cond([
    [equals(KEY.LEFT), () => moveLeft(vector)],
    [equals(KEY.UP), () => moveUp(vector)],
    [equals(KEY.RIGHT), () => moveRight(vector)],
    [equals(KEY.DOWN), () => moveDown(vector)]
  ])(keycode));

  return move;
}

const move = moveFactory(MIN, MAX); 

const Project8 = memo(() => {
  const [vector, setVector] = useState([0, 0, 1]);
  const [isMoving, setIsMoving] = useState(false);
  const [directions, setDirections] = useState([]);

  const updateSpeed = (ev) => {
    const speed = parseInt(ev.target.value, 10);
    setVector(vector => ([
      ...vector.slice(0, 2),
      speed
    ]))
  };

  useInterval(() => {
    directions.map(keyCode => setVector(move(keyCode)))
  }, isMoving ? DELAY : null);

  useEffect(() => setIsMoving(directions.length !== 0), [directions]);

  const keyPress = (ev) => {
    const keyCode = ev.keyCode;
    if (inRange(keyCode)) {
      ev.preventDefault();

      setDirections(ifElse(
        compose(
          lt(__, 0),
          indexOf(keyCode)
        ),
        append(keyCode),
        identity
      ));
    }
  }

  const keyUp = (ev) => {
    const keyCode = ev.keyCode;
    if (inRange(keyCode)) {
      ev.preventDefault();
      setDirections(without([keyCode]));
    }
  }
  
  useEffect(() => {
    const listener = document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', listener);
  }, []);

  useEffect(() => {
    const listener = document.addEventListener('keyup', keyUp);
    return () => document.removeEventListener('keyup', listener);
  }, []);

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <div css={css`
        width: 500px;
        height: 500px;
        margin: 25px auto;
        background: rgb(25, 25, 25);
        border: 15px solid rgb(246, 234, 140);
        border-radius: 10px;
      `}>
        <Logo src={logo} style={{
          left: parseInt(vector[1], 10),
          top: parseInt(vector[0], 10)
        }} />
      </div>
      <div css={css`
        text-align: center;
      `}>
        <h2 css={css`color: rgb(242, 109, 91)`}>Control Movement Speed</h2>
        <input type="range" min="1" max="50" step={1} value={vector[2]} onChange={updateSpeed} />
      </div>
    </div>
  );
});

const Logo = styled.img`
    position: relative;
    width: 50px;
    height: 50px;
    transition: all ${DELAY / 1000}s linear;
`;

export default Project8;