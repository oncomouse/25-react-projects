/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import fetch from 'fetch-jsonp'; //🙄

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Raleway");
@import url("https://fonts.googleapis.com/css?family=Rasa");
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css");

body {
  background: #272932;
  color: #00dffc;
  font-family: "Raleway", sans-serif;
  text-align: center;
}
`;

const StyledElements = {
  Title: styled.header`
    margin: 85px 0 25px 0;
    
    h1 {
      font-size: 45px;
    }
    
    a,
    a:visited {
      color: #00dffc;
      text-decoration: underline;
    }
    
    a:hover {
      color: #f94e3f;
    }
  `,
  Buttons: styled.div`
    margin-top: -15px;
  `,
  Button: styled.button`
    color: #ffc952;
    background: #274555;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    font-size: 28px;
    border-radius: 8px;

    &:hover {
      cursor: pointer;
      background: rgba(39, 69, 85, 0.5);
    }
  `,
  Quotes: styled.div`
    width: 750px;
    margin: 75px auto;
    background: rgba(39, 69, 85, 0.25);
    padding: 25px;
    border-radius: 25px;

    &:hover {
      background: rgba(39, 69, 85, 0.22);
    }
  `,
  QuoteText: styled.p`
    margin-top: 25px;
    font-size: 30px;
    color: #f94e3f;
    font-family: "Rasa", serif;
  `,
  QuoteAuthor: styled.p`
    font-size: 30px;
    color: #ffc952;
    margin-top: 15px;
  `
}

const Project11 = () => {
  const [quote, setQuote] = useState({
    quoteText: '',
    quoteAuthor: ''
  });

  const getQuote = () => {
    fetch('http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp', {
      jsonpCallback: 'jsonp' // Name of API GET parameter where callback name is sent
    })
      .then(response => response.json())
      .then(setQuote)
  }

  const tweetQuote = () => {
    var tweet = '';
    if (quote.quoteAuthor.length === 0) {
      tweet = quote.quoteText;
    } else {
      tweet = quote.quoteText.substr(0, 100) + " — " + quote.quoteAuthor;
    }
    var left = (window.screen.width - 800) / 2;
    window.open(`http://twitter.com/home?status=${tweet} @freecodecamp`, '', 'menubar = no, toolbar = no, resizable = yes, scrollbars = yes, height = 250, width = 800, left = ' + left + ', top = 150');
  }

  useEffect(getQuote, []);

  return (
    <div>
      <StyledElements.Title>
        <h1>
          <a href="http://freecodecamp.com/">Free Code Camp</a>
          { " " }
          Quote Machine
        </h1>
      </StyledElements.Title>
      <main>
        <StyledElements.Buttons>
          <StyledElements.Button onClick={getQuote}>Show me a random quote</StyledElements.Button>
          <StyledElements.Button onClick={tweetQuote}>Tweet random quote</StyledElements.Button>
        </StyledElements.Buttons>
        <StyledElements.Quotes>
          <StyledElements.QuoteText>{quote.quoteText}</StyledElements.QuoteText>
          {quote.quoteAuthor.length === 0 ? null : (<StyledElements.QuoteAuthor>—{quote.quoteAuthor}</StyledElements.QuoteAuthor>) }
        </StyledElements.Quotes>
      </main>
      <Global styles={GLOBAL_STYLE} />
    </div>
  );
}

export default Project11;