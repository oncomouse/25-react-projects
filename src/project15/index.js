/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import { __, T, always, concat, cond, equals, is, slice } from 'ramda';

const GLOBAL_STYLE=css`
@import url("https://fonts.googleapis.com/css?family=Ubuntu");
body {
  min-width: 700px;
  background: #f94e3f;
  color: #272932;
}
`;
const StyledElements = {};
StyledElements.Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;
StyledElements.Case = styled.div`
  width: 450px;
  background: #37352B;
  border: 1px solid #272932;
  border-radius: 2px;
  text-align: center;
  padding-bottom: 15px;
`;
StyledElements.Title = styled.h1`
  text-align: center;
  font-family: "Ubuntu", sans-serif;
  font-size: 38px;
  color: #0BDCA8;
  margin: 10px;
`;
StyledElements.InputField = styled.span`
  width: 380px;
  font-size: 30px;
  font-family: system-ui;
  padding: 5px 15px 5px 0;
  text-align: right;
  margin-bottom: 5px;
  border: 1px solid #0BDCA8;
  background: #59656F;
  color: #272932;
  display: inline-block;
  height: 35px;
`;
StyledElements.UI = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: center;
`;
StyledElements.UIButton = styled.button`
  width: 100px;
  height: 100px;
  border: 1px solid #272932;
  background: #fff1b9;
  font-family: "Ubuntu", sans-serif;
  font-size: 40px;

  &:focus {
    z-index: 3;
  }

  &:hover {
    background: #67D5B5;
    color: #272932;
    cursor: pointer;
  }
`;
StyledElements.NumberButton = styled(StyledElements.UIButton)``;
StyledElements.OperationsButton = styled(StyledElements.UIButton)`
  &:hover {
    background: #bebebe;
  }
`;
StyledElements.SpecialUIButton = styled(StyledElements.UIButton)`
  &:hover {
    background: #ff7473;
  }
`;
StyledElements.DeleteButton = styled(StyledElements.SpecialUIButton)`
  font-size: 30px;
`;
StyledElements.ClearButton = styled(StyledElements.SpecialUIButton)`
  font-size: 35px;
`;
StyledElements.EnterButton = styled.button`
  width: 400px;
  height: 100px;
  border: 1px solid #272932;
  background: #67D5B5;
  font-family: "Ubuntu", sans-serif;
  font-size: 35px;

  &:hover {
    background: #0BDCA8;
    cursor: pointer;
  }
`;

const Project15 = () => {
  const [input, setInput] = useState('');

  const buttonClick = value => () => {
    if (value === 'CE') {
      return setInput('');
    } else if (value === 'del') {
      setInput(slice(0, -1));
    } else {
      setInput(concat(__, String(value)));
    }
  };

  const doMath = () => setInput(input => {
    let newInput = '';
    try {
      newInput = String(eval(input));
    } catch(error) {
      newInput = 'Syntax Error!';
    }
    return newInput;
  });

  const generateButton = (value) => {
    const key = cond([
      [is(Number), always('NumberButton')],
      [equals('CE'), always('ClearButton')],
      [equals('del'), always('DeleteButton')],
      [T, always('OperationsButton')]
    ])(value);
    const Component = StyledElements[key];
    return (
      <Component key={value} onClick={buttonClick(value)}>{value}</Component>
    )
  }

  const ops = [7,8,9,'/',4,5,6,'*',1,2,3,'+','CE',0,'del','-'];

  return (
    <StyledElements.Container>
      <Global styles={GLOBAL_STYLE} />
      <StyledElements.Case>
        <StyledElements.Title>JavaScript Calculator</StyledElements.Title>
        <StyledElements.InputField>{input}</StyledElements.InputField>
        <StyledElements.UI>
          {
            ops.map(generateButton)
          }
          <StyledElements.EnterButton onClick={doMath}>Enter</StyledElements.EnterButton>
        </StyledElements.UI>
      </StyledElements.Case>
    </StyledElements.Container>
  );
}

export default Project15;