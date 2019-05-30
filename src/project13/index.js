/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState } from 'react';
import { apply, compose, drop, prepend, zip, zipWith } from 'ramda';
import fetch from 'fetch-jsonp';

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Ubuntu");
@import url("https://fonts.googleapis.com/css?family=Trirong");

body {
  background: #FFFFF2;
  color: #274555;
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}
`;

const StyledElements = {};
StyledElements.Title = styled.h1`
  margin: 35px auto 20px auto;
  font-size: 50px;
`;
StyledElements.Subtitle = styled.h2``;
StyledElements.InputBox = styled.input`
  font-size: 22px;
  width: 350px;
  padding: 10px;
  border: 1px solid rgba(39, 41, 50, 0.15);
  border-radius: 3px;
`;
StyledElements.Button = styled.button`
  font-size: 22px;
  padding: 10px 15px 10px 15px;
  border: none;
  border-radius: 3px;
  font-family: "Trirong", serif;
  background: rgba(39, 41, 50, 0.95);
  color: #FFFFF2;

  &:hover {
    cursor: pointer;
    background: rgba(39, 41, 50, 0.85);
  }
`;
StyledElements.SubmitButton = styled(StyledElements.Button)`
  margin-left: 8px;
`;
StyledElements.RandomButton = styled(StyledElements.Button)`
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 18px;
`;
StyledElements.RangeInput = styled.input`
  -webkit-appearance: none;
  width: ${props => props.width}px;

  &::-webkit-slider-runnable-track {
    width: 300px;
    height: 5px;
    margin-bottom: 3px;
    background: #ddd;
    border: none;
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #272932;
    margin-top: -5px;
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-runnable-track {
    background: #ccc;
  }
`;
StyledElements.Counter = styled.span`
  margin-left: 7px;
  margin-top: -5px;
  font-size: 20px;
`;
StyledElements.Results = styled.div`
  padding: 15px;
`;
StyledElements.ResultsHead = styled.thead``;
StyledElements.TitleHead = styled.th`
  width: 150px;
  text-align: right;
  padding-left: 10px;
  font-family: 26px;
  font-family: "Ubuntu", sans-serif;
`;
StyledElements.InfoHead = styled.th`
  text-align: left;
  padding-left: 25px;
`;
StyledElements.ResultBox = styled.tr`
  padding-top: 5px;
`;
StyledElements.ResultCell = styled.td`
  padding: 10px 5px 10px 5px;
`;
StyledElements.TitleCell = styled(StyledElements.ResultCell)`
  width: 150px;
  padding-right: 10px;
  text-align: right;
  font-size: 22px;
  font-family: "Ubuntu", sans-serif;
  color: #191919;
  background: rgba(39, 41, 50, 0.05);
  border: 1px solid rgba(39, 41, 50, 0.1);
`;
StyledElements.InfoCell = styled(StyledElements.ResultCell)`
  text-align: left;
  background: rgba(39, 41, 50, 0.95);
  border: 1px solid rgba(250, 250, 250, 0.1);
  color: #FFFFF2;
  font-family: "Trirong", serif;
  padding-left: 15px;
  padding-right: 15px;

  &:hover {
    cursor: pointer;
    background: rgba(39, 41, 50, 0.85);
}
`;

const zip3 = (a, b, c) => compose(zipWith(prepend, a), zip(b))(c)

const Project13 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articleCount, setArticleCount] = useState(3);
  const [articles, setArticles] = useState([]);

  const search = () => fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=50&format=json`)
    .then(response => response.json())
    .then(drop(1))
    .then(apply(zip3))
    .then(setArticles);

  const onSearchSubmit = ev => {
    ev.preventDefault();
    search(searchTerm);
  }

  const onSearchChange = ev => setSearchTerm(ev.target.value);

  const onCountChange = ev => setArticleCount(parseInt(ev.target.value, 10));

  const openUrl = window.open;

  const randomArticle = () => openUrl('https://en.wikipedia.org/wiki/Special:Random')

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <StyledElements.Title>Wikipedia Viewer</StyledElements.Title>
      <StyledElements.Subtitle>Search Wikipedia:</StyledElements.Subtitle>
      <div>
        <form onSubmit={onSearchSubmit}>
          <StyledElements.InputBox type="text" placeholder="Type here…" value={searchTerm} onChange={onSearchChange} />
          <StyledElements.SubmitButton>Submit Search</StyledElements.SubmitButton>
        </form>
        <StyledElements.RandomButton onClick={randomArticle}>or generate a random article</StyledElements.RandomButton>
        </div>
      <StyledElements.RangeInput width="400" type="range" min="3" max="50" value={articleCount} onChange={onCountChange} />
      <StyledElements.Counter>count: {articleCount}</StyledElements.Counter>
      {
        articles.length === 0 ? null : (
          <table>
            <StyledElements.ResultsHead>
              <tr>
                <StyledElements.TitleHead>Article Title</StyledElements.TitleHead>
                <StyledElements.InfoHead>Snippet (click to view article)</StyledElements.InfoHead>
              </tr>
            </StyledElements.ResultsHead>
            <tbody>
              {
                articles.slice(0, articleCount).map(([title, snippet, url], i) => (
                  <StyledElements.ResultBox key={i}>
                    <StyledElements.TitleCell>{title}</StyledElements.TitleCell>
                    <StyledElements.InfoCell onClick={() => openUrl(url)}>{snippet}</StyledElements.InfoCell>
                  </StyledElements.ResultBox>
                ))
              }
            </tbody>
          </table>
        )
      }
    </div>
  );
}

export default Project13;