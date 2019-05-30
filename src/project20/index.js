/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';

const GLOBAL_STYLE = css`
body {
  background: #36413E;
  background: linear-gradient(to top right, #0f0f0f, #323232) fixed no-repeat;
  color: #D7D6D6;
  text-align: center;
}

h1 {
  font-size: 50px;
  font-weight: normal;
  color: #FF5E33;
}

.controlWrapper .allBtn {
  margin-top: -25px;
  margin-bottom: 15px;
}
.controlWrapper button {
  width: 175px;
  font-size: 22px;
  padding: 10px;
  margin: 5px;
  font-family: Avenir;
  border: none;
  border-Radius: 3px;
  box-shadow: none;
  transition: color 150ms ease-in, background 100ms ease-in;
}
.controlWrapper button:hover {
  cursor: pointer;
  background: #06FF96 !important;
  color: #FF5E33;
  transition: color 150ms ease-in, background 100ms ease-in;
}
.controlWrapper button:focus {
  outline: none;
}
.controlWrapper .controls {
  max-width: 750px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.controlWrapper .controls hr {
  margin-top: 25px;
  margin-bottom: -45px;
  width: 85vw;
  border: 1px solid #F8F4A6;
}

.transitionsContainer {

}

.transitionBox {
  border: 1px solid #F8F4A6;
  transition: border 150ms ease-in;
}

.transitionBox:hover {
  border: 1px solid #FF5E33;
  transition: border 150ms ease-in;
}

.fadeDiv-enter {
  opacity: 0.01;
}

.fadeDiv-enter.fadeDiv-enter-active {
  opacity: 1;
  transition: opacity 1000ms ease-in;
}

.fadeDiv-leave {
  opacity: 1;
}

.fadeDiv-leave.fadeDiv-leave-active {
  opacity: 0.01;
  transition: opacity 1000ms ease-in;
}

.slideInDiv-enter {
  transform: translate3d(600%, 0, 0);
}

.slideInDiv-enter.slideInDiv-enter-active {
  transform: translate3d(0, 0, 0);
  transition: transform 800ms ease-in;
}

.slideInDiv-leave {
  transform: translate3d(0, 0, 0);
}

.slideInDiv-leave.slideInDiv-leave-active {
  transform: translate3d(600%, 0, 0);
  transition: transform 800ms ease-in;
}

.slideUpDiv-enter {
  transform: translate3d(0, -300%, 0);
}

.slideUpDiv-enter.slideUpDiv-enter-active {
  transform: translate3d(0, 0, 0);
  transition: transform 800ms ease-in;
}

.slideUpDiv-leave {
  transform: translate3d(0, 0, 0);
}

.slideUpDiv-leave.slideUpDiv-leave-active {
  transform: translate3d(0, -300%, 0);
  transition: transform 800ms ease-in;
}

.sliderDiv-enter {
  transform: translate3d(-1000%, -300%, 0);
}

.sliderDiv-enter.sliderDiv-enter-active {
  transform: translate3d(0, 0, 0);
  transition: transform 1000ms ease-in;
}

.sliderDiv-leave {
  transform: translate3d(0, 0, 0);
}

.sliderDiv-leave.sliderDiv-leave-active {
  transform: translate3d(-1000%, 300%, 0);
  transition: transform 1000ms ease-in;
}

.heightInDiv-enter {
  max-height: 0;
}

.heightInDiv-enter.heightInDiv-enter-active {
  max-height: 150px;
  transition: max-height 1000ms ease-in;
}

.heightInDiv-leave {
  max-height: 150px;
}

.heightInDiv-leave.heightInDiv-leave-active {
  max-height: 0;
  transition: max-height 1000ms ease-in;
}

.widthInDiv-enter {
  max-width: 0;
}

.widthInDiv-enter.widthInDiv-enter-active {
  max-width: 150px;
  transition: max-width 750ms ease-in;
}

.widthInDiv-leave {
  max-width: 150px;
}

.widthInDiv-leave.widthInDiv-leave-active {
  max-width: 0;
  transition: max-width 1000ms ease-in;
}

.widthInTextBefore {
  color: transparent;
  transition: color 250ms ease-out;
}

.widthInTextAfter {
  color: #000000;
  transition: color 2500ms ease-out;
  transition-delay: .75s;
}

.sizeInDiv-enter {
  max-width: 0;
  max-height: 0;
}

.sizeInDiv-enter.sizeInDiv-enter-active {
  max-width: 150px;
  max-height: 150px;
  transition: max-width 650ms ease-in, max-height 750ms ease-in;
}

.sizeInDiv-leave {
  max-width: 150px;
  max-height: 150px;
}

.sizeInDiv-leave.sizeInDiv-leave-active {
  max-width: 0;
  max-height: 0;
  transition: max-width 1000ms ease-in, max-height 1000ms ease-in;
}

.sizeTextBefore {
  color: transparent;
  transition: color 250ms linear;
}

.sizeTextAfter {
  color: #F0EBD8;
  transition: color 2500ms linear;
  transition-delay: .75s;
}

.rotateInDiv-enter {
  transform: rotate(720deg);
  opacity: 0.01;
}

.rotateInDiv-enter.rotateInDiv-enter-active {
  transform: rotate(0deg);
  opacity: 1;
  transition: transform 1000ms ease-in, opacity 1000ms ease-in;
}

.rotateInDiv-leave {
  transform: rotate(0deg);
  opacity: 1;
}

.rotateInDiv-leave.rotateInDiv-leave-active {
  transform: rotate(720deg);
  opacity: 0.01;
  transition: transform 1500ms ease-in, opacity 1500ms ease-in;
}

.rotateTextBefore {
  color: transparent;
  transition: color 1000ms ease-in;
}

.rotateTextAfter {
  color: #FF3F00;
  transition: color 1000ms ease-in;
  transition-delay: .05s;
}
`;

const Elements = {};
Elements.ControlWrapper = styled.div``;
Elements.TransitionsContainer =styled.div`
  padding: 50px;
  color: #141414;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;
Elements.TransitionBlock = styled.div`
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
    color: rgb(25, 25, 25);
    background: ${props => props.bg || 'rgb(192, 53, 70)'};
`;

const Project20 = () => {
  
  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <Elements.ControlWrapper></Elements.ControlWrapper>
      <Elements.TransitionsContainer>

      </Elements.TransitionsContainer>
    </div>
  );
}

export default Project20;