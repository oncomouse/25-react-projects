import React, { useEffect, useState } from 'react';
import { Global, css } from '@emotion/core';
import { compose, contains, toLower, head, is, filter as Rfilter, tap } from 'ramda';

const DATA_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const GLOBAL_STYLE = css`
body {
  background: #353848;
  color: #ff7473;
}
.title {
  margin-left: 25px;
}
input {
  margin-left: 25px;
  padding: 9px;
  font-size: 20px;
  border: none;
  background: rgb(30,30,30);
  color: #67D5B5;
  border-radius: 3px;
}

label {
  display: none;
}
::-webkit-input-placeholder {
  color: #ffc952;
}
table {
  margin-top: 15px;
  margin-left: 25px;
}
th {
  text-align: left;
  color: #ff7473;
  border-bottom: 1px solid #ffc952;
  font-size: 18px;
}
td {
  color: #47b8e0;
}
.country {
  width: 350px;
}
.capital {
  width: 200px;
}
.region {
  width: 200px;
}
.subregion {
  width: 200px;
}
.lat, .lon {
  width: 100px;
}
`;

const search = target => compose(
  contains(target),
  toLower,
  x => (is(String) ? x : (head(x) || '')),
);

const Project3 = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    country: '',
    capital: '',
    region: '',
    subregion: ''
  });

  const updateFilter = key => ev => {
    const value = ev.target.value;
    setFilter(filter => ({
      ...filter,
      [key]: value
    }));
  }

  const filtered = (filter, data) => {
    const filters = Rfilter(x => x !== '', filter);
    if (Object.keys(filters).length === 0) {
      return data
    }
    return data.filter(country => Object.keys(filters).reduce((retVal, key) => {
      return !retVal ? false : search(filters[key])(key === 'country' ? country.name.official : country[key]);
    }, true));
  }

  useEffect(() => {
    fetch(DATA_URL)
      .then(response => response.json())
      .then(tap(() => console.log('JSON Data Downloaded')))
      .then(setData);
  }, []);

  return (
    <div>
      <Global styles={GLOBAL_STYLE}/>
      {data.length === 0 ? null : (
        <div>
          <h1 className="title">Country/Capital Data Multi-Search Service</h1>
          <div className="buttons">
            <Filter
              title="Filter by Country"
              value={filter.country}
              update={updateFilter('country')}
            />
            <Filter
              title="Filter by Capital"
              value={filter.capital}
              update={updateFilter('capital')}
            />
            <Filter
              title="Filter by Region"
              value={filter.region}
              update={updateFilter('region')}
            />
            <Filter
              title="Filter by Subregion"
              value={filter.subregion}
              update={updateFilter('subregion')}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th className="country">Country</th>
                <th className="capital">Capital</th>
                <th className="region">Region</th>
                <th className="subregion">Subregion</th>
                <th className="lat">Latitude</th>
                <th className="lon">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {filtered (filter, data).map((country, i) => (<Country key={i} country={country} />))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Filter = (props) => {
  const {
    title,
    value,
    update
  } = props;
  return (
    <input type="text" name={title} placeholder={title} onChange={update} value={value} />
  )
}

const Country = (props) => {
  const {
    country
  } = props;


  return (
    <tr>
      <td className="country">{country.name.official.slice(0, 30)}</td>
      <td className="capital">{is(Array)(country.capital) ? country.capital.join(', ') : country.capital}</td>
      <td className="region">{country.region}</td>
      <td className="subregion">{country.subregion}</td>
      <td className="lat">{country.latlng[0].toFixed(2)}</td>
      <td className="lon">{country.latlng[1].toFixed(2)}</td>
    </tr>
  )
}

export default Project3;