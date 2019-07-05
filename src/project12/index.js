/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import { T, always, tap, compose, composeWith, cond, equals, or, prop, then } from 'ramda';

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Montserrat");
@import url("https://fonts.googleapis.com/css?family=Pridi");

body {
  background: linear-gradient(#33E3FC, #47b8e0) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  font-family: "Montserrat", sans-serif;
  color: #3f4040;
  text-align: center;
  padding: 0;
  margin: 0;
  margin-bottom: 35px;
}
`;

const StyledElements = {};
StyledElements.Title = styled.h1`
  margin-top: 45px;
  margin-bottom: -5px;
  font-size: 50px;
  color: #f94e3f;
`;
StyledElements.Conditions = styled.p`
  font-size: 25px;
  margin-bottom: 5px;
`;
StyledElements.Weather = styled.p`
  font-size: 40px;
  margin-top: -5px;
  margin-bottom: 5px;
`;
StyledElements.Image = styled.img`
  width: 150px;
  margin-top: 20px;
  margin-bottom: -25px;
`;
StyledElements.Temperature = styled.p`
  font-size: 55px;
  margin-bottom: 0;
`;
StyledElements.Toggles = styled.div`
  width: 225px;
  margin: -25px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
StyledElements.Toggle = styled.p`
  font-family: "Pridi", serif;
  color: rgb(63, 64, 64);
  &:hover {
    color: #f94e3f;
    cursor: pointer;
  }
  &.active {
    color: rgb(249, 78, 63);
  }
`;
StyledElements.Data = styled.div`
  margin-top: 20px;
`;
StyledElements.City = styled.p`
  font-size: 22px;
  margin: 5px 0 5px 0;
`;
StyledElements.Coordinates = StyledElements.City;
StyledElements.Credits = styled.p`
  position: fixed;
  bottom: 0;
  height: 35px;
  width: 100%;
  background: rgba(39, 41, 50, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Avenir, arial;
  font-size: 16px;
  text-align: center;
  color: #c8c8c8;
  margin: 0;

  a,
  a:visited {
    color: #c8c8c8;
    text-decoration: none;
  }

  a:hover {
    color: #f94e3f;
    text-decoration: underline;
  }
`;

const k2c = k => (k - 273.15).toFixed(2);
const c2f = c => (c * 1.8 + 32).toFixed(2);

const FILTERS = {
  K: 'K',
  C: 'C',
  F: 'F'
}

const Project12 = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [tempFilter, setTempFilter] = useState(FILTERS.K);

  useEffect(() => {
    composeWith(then, [
      setLocation,
      response => response.json(),
      fetch
    ])('http://ip-api.com/json')
  }, [])

  useEffect(() => {
    const keyID = 'e75aa9eb22e3e903ba187251f2faa34f';
    if (location !== null) {
      composeWith(then, [
        ({ main, detail, tempK }) => setWeather({
          tempK: tempK,
          tempC: k2c(tempK),
          tempF: compose(c2f, k2c)(tempK),
          weather: {
            main,
            detail
          }
        }),
        response => ({
          main: response.weather[0].main,
          detail: response.weather[0].description,
          tempK: response.main.temp.toFixed(1)
        }),
        response => response.json(),
        fetch
      ])(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${keyID}`)
    }
  }, [location])

  const formatTemp = (temp) => {
    switch(tempFilter) {
      case FILTERS.K:
        return `${temp}K`;
      case FILTERS.C:
        return `${temp}°C`;
      case FILTERS.F:
        return `${temp}°F`;
      default:
        return `${temp}`;
    }
  }

  const currentTemp = compose(
    formatTemp,
    prop(cond([
      [equals(FILTERS.K), always('tempK')],
      [equals(FILTERS.C), always('tempC')],
      [equals(FILTERS.F), always('tempF')]
    ])(tempFilter))
  )

  return (
    <div>
      <StyledElements.Title>Current Weather Service</StyledElements.Title>
      <StyledElements.Conditions>The current weather conditions are:</StyledElements.Conditions>
      {weather === null ? null : (
        <div>
          <StyledElements.Weather>{weather.weather.main}, {weather.weather.detail}</StyledElements.Weather>
          <WeatherImage weather={weather} />
          <StyledElements.Temperature>
            {currentTemp(weather)}
          </StyledElements.Temperature>
          <StyledElements.Toggles>
            <StyledElements.Toggle onClick={() => setTempFilter(FILTERS.K)} className={tempFilter === FILTERS.K ? 'active' : ''}>Kelvin</StyledElements.Toggle>
            <StyledElements.Toggle onClick={() => setTempFilter(FILTERS.C)} className={tempFilter === FILTERS.C ? 'active' : ''}>Celsius</StyledElements.Toggle>
            <StyledElements.Toggle onClick={() => setTempFilter(FILTERS.F)} className={tempFilter === FILTERS.F ? 'active' : ''}>Fahrenheit</StyledElements.Toggle>
          </StyledElements.Toggles>
        </div>
      )}
      { location === null ? null: (
        <StyledElements.Data>
          <StyledElements.Coordinates>Your coordinates are: {location.lat.toFixed(2)}, {location.lon.toFixed(2)}</StyledElements.Coordinates>
          <StyledElements.City>Your location: {location.city}, {location.country}</StyledElements.City>
        </StyledElements.Data>
      )}
      <StyledElements.Credits>
      Weather icons courtesy of&nbsp;
        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/adamwhitcroft">Adam Whitcroft's</a>
        &nbsp;nice&nbsp;
        <a target="_blank" rel="noopener noreferrer" href="http://adamwhitcroft.com/climacons/">Climacon Set</a>
      </StyledElements.Credits>
      <Global styles={GLOBAL_STYLE} />
    </div>
  );
}

const WeatherImage = (props) => {
  const {
    weather: { detail }
  } = props;

  const imageSource = cond([
    [equals('clear sky'), always('http://i1361.photobucket.com/albums/r662/bonham000/Current%20Weather%20App/sun_zps5alfhawb.png')],
    [or(
      equals('few clouds'),
      equals('scattered clouds'),
      equals('broken clouds')
    ), always('http://i1361.photobucket.com/albums/r662/bonham000/Current%20Weather%20App/clouds_zpsimfgky1h.png')],
    [or(
      equals('shower rain'),
      equals('rain')
    ), always('http://i1361.photobucket.com/albums/r662/bonham000/Current%20Weather%20App/rain_zpsd8iqh9we.png')],
    [equals('thunderstorm'), always('http://i1361.photobucket.com/albums/r662/bonham000/Current%20Weather%20App/storm_zpsapxffwwd.png')],
    [T, always('http://i1361.photobucket.com/albums/r662/bonham000/Current%20Weather%20App/clouds_zpsimfgky1h.png')]
  ])

  return (
    <StyledElements.Image src={imageSource(detail)} />
  )
}

export default Project12;
