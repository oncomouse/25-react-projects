/** @jsx jsx */
import { useState, memo } from 'react';
import { Global, css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { compose, composeWith, map, path, prop, reverse, then } from 'ramda';

function shuffle(array) {
  let counter = array.length;
  const shuffled = array.slice();

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    const temp = shuffled[counter];
    shuffled[counter] = shuffled[index];
    shuffled[index] = temp;
  }

  return shuffled;
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Hind+Siliguri");
body {
  background: linear-gradient(#E85756, #FFF159);
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: "Hind Siliguri", sans-serif;
}

button:hover {
  color: #E85756 !important;
  background: #16324F !important;
  cursor: pointer;
}

button:focus {
  outline: none;
}

a, a:visited {
  color: #16324F;
}

a:hover {
  color: #09cc7d;
}
`;
const Project6 = memo(() => {
  const [gifs, setGifs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const getGifs = ev => {
    ev.preventDefault();

    composeWith(then, [
      gifs => {
        setGifs([...gifs]);
        setFiltered([...gifs]);
      },
      compose(
        map(path(['images', 'fixed_height', 'url'])),
        prop('data')
      ),
      response => response.json(),
      fetch
    ])('https://api.giphy.com/v1/gifs/trending?api_key=EJCv76s5lESrvAoZVkE90HI2vFpDDXuG&limit=25&rating=G')
  }
  const getRandom = () => setFiltered([sample(gifs)]);
  const randomOrder = () => setFiltered(shuffle);
  const reverseOrder = () => setFiltered(reverse);
  const clearGifs = () => {
    setGifs([]);
    setFiltered([]);
  };
  const showAll = () => setFiltered([...gifs]);

  return (
    <div>
      <h1 css={css`
        margin-top: 50px;
        margin-bottom: 15px;
        font-size: 50px;
        text-align: center;
        color: rgb(19, 41, 61);
      `}>
        Trending GIFs courtesy of the Giphy API
      </h1>
      <ButtonContainer
        getGifs={getGifs}
        getRandom={getRandom}
        showAll={filtered.length === 0 || filtered.length === gifs.length ? null : showAll}
        randomOrder={randomOrder}
        reverseOrder={reverseOrder}
        clearGifs={clearGifs}
      />
      <ImageContainer gifs={filtered} />
    </div>
  )
})


const ButtonContainer = memo((props) => {
  const {
    getGifs,
    getRandom,
    showAll,
    randomOrder,
    reverseOrder,
    clearGifs
  } = props;

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <div css={css`
        text-align: center;
        margin-bottom: 20px;
      `}>
        <Button onClick={getGifs}>Load (or Reload) Trending GIFs</Button>
        <br />
        <Button onClick={getRandom}>Select One at Random</Button>
        {showAll === null ? null : (
          <Button css={css`margin-left: 12px;`} onClick={showAll}>Show All GIFs</Button>
        )}
        <br />
        <Button onClick={randomOrder}>Randomize Order</Button>
        <br />
        <Button onClick={reverseOrder}>Reverse Order</Button>
        <br />
        <Button onClick={clearGifs}>Clear All</Button>
      </div>
    </div>
  );
})

const Button = styled.button`
  font-size: 30px;
  border: none;
  background: white;
  margin-top: 15px;
  border-radius: 10px;
  padding: 12px;
  background: #13293D;
  color: #FFF159;
`;

const ImageContainer = memo((props) => {
  const {
    gifs
  } = props;

  return (
    <div css={css`
      text-align: center;
    `}>
      {gifs.map((gif, i) => (
        <Image src={gif} key={i} alt="Giphy" />
      ))}
    </div>
  )
});

const Image = styled.img`
  border-radius: 15px;
  display: inline-block;
  margin-right: 8px;
`;

export default Project6;
