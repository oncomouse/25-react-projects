/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import { useEffect, useState } from 'react';
import { prop } from 'ramda';
import useInterval from '../utilities/useInterval';

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Work+Sans");
@import url("https://fonts.googleapis.com/css?family=Maitree");

html {
  background: #2E382E;
  background: url(http://wallpapercave.com/wp/8cEpZrx.jpg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

body {
  font-family: "Work Sans", sans-serif;
}

p {
  font-size: 26px;
  font-family: "Maitree", serif;
  margin-bottom: 5px;
}

a, a:visited {
  color: #50C9CE;
}

a:hover {
  color: #e9eb9e;
}

ul {
  font-size: 24px;
  text-align: left;
  width: 350px;
  margin: 0 auto;
  font-family: "Maitree", serif;
}

table {
  border-collapse: collapse;
}

td {
  border-collapse: collapse;
  border-bottom: 1px solid rgba(252, 252, 252, 0.25);
}
`;

const getVelocity = (...position) => getDistance(...position) / 5 * 3600;
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
const deg2rad = (deg) => deg * (Math.PI / 180);
const kph2mph = kph => (kph / 1.609344).toFixed(2);

const Project10 = () => {
  const [astronauts, setAstronauts] = useState([]);
  const [position, setPosition] = useState({
    latitude: NaN,
    longitude: NaN,
    timestamp: NaN
  })

  const updatePosition = ({iss_position, timestamp}) => setPosition(oldPosition => {
    if (isNaN(position.latitude)) {
      return {
        latitude: parseFloat(iss_position.latitude, 10),
        longitude: parseFloat(iss_position.longitude, 10),
        timestamp: parseInt(timestamp, 10)
      };
    }
    const latitude = parseFloat(iss_position.latitude, 10);
    const longitude = parseFloat(iss_position.longitude, 10);
    const velocity = getVelocity(oldPosition.latitude, oldPosition.longitude, latitude, longitude).toFixed(2);
    return {
      latitude,
      longitude,
      velocity,
      timestamp: parseInt(timestamp, 10)
    }
  })

  const fetchPosition = () => fetch('http://api.open-notify.org/iss-now.json')
    .then(response => response.json())
    .then(updatePosition);

  useEffect(() => { fetchPosition(); }, []);
  useInterval(() => { fetchPosition(); }, 5000);

  useEffect(() => {
    fetch('http://api.open-notify.org/astros.json')
      .then(response => response.json())
      .then(prop('people'))
      .then(setAstronauts)
  }, []);

  return (
    <div css={css`
      text-align: center;
      color: rgb(80, 201, 206);
      font-size: 35px;
    `}>
      <Global styles={GLOBAL_STYLE} />
      <h1 css={css`
        font-size: 45px;
        margin-bottom: 0;
      `}>Current Information From Space</h1>
      <Astronauts astronauts={astronauts} />
      <h2 css={css`
        margin-top: 20px;
        margin-bottom: 15px;
      `}>Current Data on the ISS:</h2>
      <Position { ...position } />
      <DataTable { ...position } />
      <p css={css`
        font-size: 24px;
        margin-bottom: 25px;
      `}>
        Data provided courtesy of <a target="_blank" rel="noopener noreferrer" href="http://open-notify.org/Open-Notify-API/ISS-Location-Now/">Open Notify</a> and refreshed every 5 seconds
      </p>
    </div>
  );
}

const Astronauts = (props) => {
  const {
    astronauts
  } = props;

  return (
    <div>
      <p>At this moment there {astronauts.length === 1 ? 'is' : 'are'} {astronauts.length} human{astronauts.length === 1 ? '' : 's'} in space. They are:</p>
      <ul>
        {astronauts.map(({craft, name}, i) => (
          <li key={i}>{name}, Craft: {craft}</li>
        ))}
      </ul>
    </div>
  )
}

const PositionStyles = {
  table: css`
    margin: 25px auto;
    padding: 10px;
    border: 1px solid rgba(252, 252, 252, 0.25);
  `,
  td: {
    left: css`
      text-align: right;
      padding: 15px 15px 15px 25px;
      background: rgba(36, 32, 56, 0.4);
      color: rgb(247, 236, 225);
      border-collapse: collapse;
      border-right: 1px solid rgba(252, 252, 252, 0.25);
    `,
    right: css`
      text-align: left;
      background: rgba(80, 201, 206, 0.7);
      padding-left: 10px;
      padding-right: 25px;
      color: rgb(36, 32, 56);
    `
  }
}

const parseTime = timestamp => {
  const unix = Number(timestamp);
  const date = new Date(unix * 1000);
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

const Position = (props) => {
  const {
    latitude,
    longitude,
    velocity,
    timestamp
  } = props;

  return (
    <table css={PositionStyles.table}>
      <tbody>
        <PositionDataRow caption="Current Latitude" data={!isNaN(latitude) ? latitude : ''} />
        <PositionDataRow caption="Current Longitude" data={!isNaN(longitude) ? longitude : ''} />
        <PositionDataRow caption="Current Timestamp (unix):" data={!isNaN(timestamp) ? timestamp : ''} />
        <PositionDataRow caption="Current Timestamp (natural):" data={!isNaN(timestamp) ? parseTime(timestamp) : ''} />
        <PositionDataRow caption="Estimated Velocity (km/h):	" data={!isNaN(velocity) ? velocity : ''} />
        <PositionDataRow caption="Estimated Velocity (mph):" data={!isNaN(velocity) ? kph2mph(velocity) : ''} />
      </tbody>
    </table>
  )
}

const PositionDataRow = (props) => {
  const {
    caption,
    data
  } = props;

  return(
    <tr>
      <td css={PositionStyles.td.left}>{caption}</td>
      <td css={PositionStyles.td.right}>{data}</td>
    </tr>
  )
}

const DataTableStyles = {
  table: css`
    margin: 25px auto;
  `,
  thead: {
    tr: css`
      border-collapse: collapse;
      border: 1px solid rgba(252, 252, 252, 0.25);
      border-bottom: 1px solid rgba(36, 32, 56, 0.2);
    `,
    th: css`
      background: rgba(36, 32, 56, 0.4);
      color: #F7ECE1;
      font-weight: normal;
      padding: 10px 12px 10px 12px;
      font-size: 22px;
      border: 1px solid rgba(252, 252, 252, 0.25);
      border-bottom: 1px solid rgba(36, 32, 56, 0.2);
    `
  },
  tbody: {
    td: css`
      padding: 5px 10px 5px 10px;
      color: #242038;
      border-right: 1px solid rgba(36, 32, 56, 0.2);
      border-bottom: 1px solid rgba(36, 32, 56, 0.2);
      font-size: 20px;
      background: rgba(233, 235, 158, 0.85);
      &:hover {
        background: #50C9CE;
      }
    `
  }
}

const DataTable = (props) => {
  const {
    latitude,
    longitude,
    velocity,
    timestamp
  } = props;
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!isNaN(velocity)) {
      setHistory(history => ([
        ...history,
        {
          latitude,
          longitude,
          velocity,
          timestamp
        }
      ]))
    }
  }, [latitude, longitude, velocity, timestamp])

  return (
    <table css={DataTableStyles.table}>
      <thead>
        <tr css={DataTableStyles.thead.tr}>
          <th css={DataTableStyles.thead.th}>
            Count
          </th>
          <th css={DataTableStyles.thead.th}>
            Latitude
          </th>
          <th css={DataTableStyles.thead.th}>
            Longitude
          </th>
          <th css={DataTableStyles.thead.th}>
            Unix Time
          </th>
          <th css={DataTableStyles.thead.th}>
            Natural Time
          </th>
          <th css={DataTableStyles.thead.th}>
            Velocity (km/h)
          </th>
          <th css={DataTableStyles.thead.th}>
            Velocity (mph)
          </th>
        </tr>
      </thead>
      <tbody>
        {
          history.map(({
            latitude,
            longitude,
            velocity,
            timestamp
          }, i) => (
            <tr key={i}>
              <td css={DataTableStyles.tbody.td}>{i+1}</td>
              <td css={DataTableStyles.tbody.td}>{latitude}</td>
              <td css={DataTableStyles.tbody.td}>{longitude}</td>
              <td css={DataTableStyles.tbody.td}>{timestamp}</td>
              <td css={DataTableStyles.tbody.td}>{parseTime(timestamp)}</td>
              <td css={DataTableStyles.tbody.td}>{!isNaN(velocity) ? velocity : ''}</td>
              <td css={DataTableStyles.tbody.td}>{!isNaN(velocity) ? kph2mph(velocity) : ''}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default Project10;