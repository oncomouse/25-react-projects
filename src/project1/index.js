import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import { compose, contains, filter, prop, toLower } from 'ramda';

export const searchList = search => filter(compose(contains(search), toLower));

const Header = styled.div`
  background: #00BFB3;
  border: 2px solid white;
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  & h1 {
    font-size: 50px;
    text-decoration: underline;
  }
  & .about {
    font-size: 25px;
  }
`;

const Project1 = () => {
  const [search, setSearch] = useState('');
  const [artists, setArtists] = useState(['Loading…']);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/anonymous/1295788c7bff052a1e8a/raw/6e109604c7a7f3efe77c8048bb2fe2f3e1cdcb7b/gistfile1.json')
      .then(response=>response.json())
      .then(prop('Reggae'))
      .then(setArtists)
  }, []);

  const searchFunction = searchList(search);
  return (
    <div>
      <Global styles={css`
        @import url("https://fonts.googleapis.com/css?family=Quicksand");
        body {
          background: #023436;
          text-align: center;
          font-family: 'Quicksand', sans-serif;
          padding-top: 15px;
        }
      `} />
      <Header>
        <h1>React Search</h1>
        <p className="about">Here is a list of Reggae artists rendered from a JSON object</p>
      </Header>
      <Form search={search} setSearch={setSearch} />
      <List content={searchFunction(artists)} />
    </div>
  );
}

const FormContainer = styled.form`
  & h3 {
    font-size: 40px;
    color: white;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  & label {
    display: none;
  }
  & input {
    border: 1px solid white;
    padding: 5px;
    width: 350px;
    height: 25px;
    font-size: 25px;

    &:focus {
      outline: none;
    }
  }
`

const Form = (props) => {
  const {
    search,
    setSearch
  } = props;
  const handleChange = ev => setSearch(ev.target.value);
  return (
    <FormContainer onSubmit={ev=>ev.preventDefault()}>
      <h3>Search:</h3>
      <div>
        <label htmlFor="search">Search the list of reggae artists</label>
        <input
          type="text"
          value={search}
          placeholder="Search the list of reggae artists"
          onChange={handleChange}
        />
      </div>
    </FormContainer>
  )
}

const ListContainer = styled.ul`
  width: 300px;
  margin: 0 auto;
  text-align: left;
  margin-top: 25px;
  padding-left: 50px;
  padding-top: 25px;
  background: #40BCD8;
  font-size: 20px;
`;

const List = (props) => {
  const {
    content
  } = props;

  return (
    <ListContainer>
      {content.map((item, i) => (<li key={i}>{item}</li>))}
    </ListContainer>
  )
}

export default Project1;