/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import marked from 'marked';

const GLOBAL_STYLES = css`
@import url("https://fonts.googleapis.com/css?family=Indie+Flower");
@import url("https://fonts.googleapis.com/css?family=Muli");

body {
  background-color: #1B2021;
  background-image: url("http://i1361.photobucket.com/albums/r662/bonham000/Codepen%20Images/dotnoise-light-grey_zpskfycsh5a.png");
  min-width: 1000px;
}

a, a:visited {
  color: #2892D7;
}

a:hover {
  text-decoration: underline;
  color: #f94e3f;
}
`;

const Styled = {};
Styled.Title = styled.h1`
  font-family: "Indie Flower", cursive;
  text-align: center;
  font-size: 65px;
  color: #FF532F;
  margin-top: 10px;
  margin-bottom: 0px;
`;
Styled.Subtitle = styled.h2`
  font-family: "Indie Flower", cursive;
  text-align: center;
  font-size: 26px;
  color: #FFE066;
  margin-top: -15px;
  margin-bottom: 15px;

  & a, & a:visited {
    text-decoration: none;
    color: #FFE066;
  }

  & a:hover {
    text-decoration: underline;
    color: #32C6FF;
  }
`;
Styled.Container = styled.div`
  display: flex;
  flex-direction: row;
`;
Styled.TextInput = styled.textarea`
  font-size: 15px;
  font-family: "Muli", sans-serif;
  color: #191919;
  background: #FFF1D0;
  width: 40vw;
  max-width: 40vw;
  min-height: 460px;
  margin-top: 5px;
  margin-left: 10px;
  margin-rigth: 10px;
  padding: 15px;
  border: 1px solid #141414;
`;
Styled.TextOutput = styled.div`
  background: #272625;
  color: #dae9f4;
  font-size: 15px;
  font-family: "Muli", sans-serif;
  width: 60vw;
  margin: 5px;
  padding: 0 15px 0 15px;
  border: 1px solid #141414;
`;

const Project21 = () => {
  const [markdown, setMarkdown] = useState(`This is an h1 header
============

Now an h2
---------------

Paragraphs are separated by a blank line.

*Italic*, **bold**, and \`monospace\`, ~~strikethrough~~ are simple

~~~
var hello = function() {
	console.log("Hello from a function!");
}
~~~
Here is a list of items:

* Free Code Camp
* React
* Sass

[*Here is a link to Free Code Camp*](https://freecodecamp.com)
`);

  const onChange = ev => setMarkdown(ev.target.value);
  return (
    <div>
      <Global styles={GLOBAL_STYLES} />
      <Styled.Title>React Markdown Previewer</Styled.Title>
      <Styled.Subtitle>A Free Code Camp project built with React and Marked</Styled.Subtitle>
      <Styled.Container>
        <div>
          <Styled.TextInput onChange={onChange}>{markdown}</Styled.TextInput>
        </div>
        <Styled.TextOutput dangerouslySetInnerHTML={{ __html: marked(markdown)}} />
      </Styled.Container>
    </div>
  );
}

export default Project21;