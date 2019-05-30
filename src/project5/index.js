import React, { createContext, useContext, useEffect, useState, memo } from 'react';
import { max, reduce, tap } from 'ramda';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';

const MaxContext = createContext(0);
const DateContext = createContext({date: null, gdp: null});
const UpdateDateContext = createContext(() => false);

const CHART_HEIGHT = 615;
const CHART_WIDTH = 1000;

const GLOBAL_STYLE=css`
@import url('https://fonts.googleapis.com/css?family=Jaldi|Fenix');
body {
  background: #011627;
  min-width: 1200px;
  font-family: 'Jaldi', sans-serif;
  color: #EFFFE9;
}

.scroll {
  border: 3px solid #2EC4B6;
  border-radius: 3px;
  font-size: 20px;
  width: 750px;
  height: 125px;
  text-align: center;
  margin: 35px auto;
  background: #333030;

  & h2 {
    margin-bottom: 0;
    margin-top: 12.5px;
  }
}
`;

const Project5 = () => {
  const [data, setData] = useState({ data: []});
  const [maxGdp, setMaxGdp] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [dateInfo, setDateInfo] = useState({date: null, gdp: null});

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(res => res.json())
      .then(tap(() => console.log('JSON Data Downloaded')))
      .then(setData)
  }, []);

  useEffect(() => {
    setMaxGdp(
      reduce(
        (large, item) => max(item[1], large),
        -Infinity,
        data.data
      )
    )
    setTotalItems(data.data.length);
  }, [data]);

  return (
    <div>
      <Global styles={GLOBAL_STYLE} />
      <Title>Modeling US GDP Economic Data with React</Title>
      <SubTitle>— A remix of the Free Code Camp D3.js Bar Chart Zipline — </SubTitle>
      <MaxContext.Provider value={maxGdp}>
        <DateContext.Provider value={dateInfo}>
          <UpdateDateContext.Provider value={setDateInfo}>
            <Chart data={data.data} totalItems={totalItems} />
          </UpdateDateContext.Provider>
        </DateContext.Provider>
      </MaxContext.Provider>
      <div className="scroll">
        <h2>Scroll the Chart Range:</h2>
        <Slider
          value={totalItems}
          min={1}
          max={data.data.length}
          update={setTotalItems}
          style={{width: 500}}
        />
      </div>
    </div>
  );
}

const Title = styled.h1`
  text-align: center;
  margin-top: 35px;
  margin-bottom: 0;
  font-size: 50px;
`;

const SubTitle = styled.p`
  text-align: center;
  margin-top: -5px;
  margin-bottom: 15px;
  font-size: 22px;
`;

const DateInfoContainer = styled.div`
  width: 325px;
  height: 80px;
  padding: 10px;
  padding-left: 12px;
  position: absolute;
  transform: rotateX(180deg);
  background: rgba(46, 196, 180, 0.25);
  font-family: 'Fenix', serif;
  font-size: 30px;
  top: 500px;
  left: 15px;

  &.empty {
    opacity: 0;
  }

  & p {
    margin-top: 0;
    margin-bottom: 0.5rem;  
  }
`

const DateInfo = memo((props) => {
  const {
    date,
    gdp
  } = props;

  return date === null ? (<DateInfoContainer className='empty'/>) : (
    <DateInfoContainer>
      <p>Date: {date}</p>
      <p>GDP: ${gdp.toFixed(1)} (billions)</p>
    </DateInfoContainer>
  )
})

const ChartContainer = styled.div`
  width: ${CHART_WIDTH}px;
  display: flex;
  flex-direction: row;
  transform: rotateX(180deg);
  min-height: ${CHART_HEIGHT}px;
  margin-left: auto;
  margin-right: auto;
  border: 10px solid #2EC4B6;
  border-radius: 5px;
  z-index: 1;
`

const Chart = memo((props) => {
  const {
    data,
    totalItems
  } = props;

  const maxGdp = useContext(MaxContext);
  // const totalItems = useContext(TotalItemsContext);
  const setDateInfo = useContext(UpdateDateContext);
  const { date, gdp } = useContext(DateContext);

  return (
    <ChartContainer>
      <DateInfo date={date} gdp={gdp} />
      {data.slice(-totalItems).map((item, i) => (
        <ChartBar
          key={i}
          date={item[0]}
          gdp={item[1]}
          maxGdp={maxGdp}
          totalItems={totalItems}
          setDateInfo={setDateInfo}
        />
      ))}
    </ChartContainer>
  )
})

const ChartBarContainer = styled.div`
  background: #E71D36;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  &:hover {
    background: #2EC4B6;
  }
`;

const ChartBar = memo((props) => {
  const {
    gdp,
    date,
    maxGdp,
    totalItems,
    setDateInfo
  } = props;

  const mouseOver = () => setDateInfo({
    date,
    gdp
  })

  const mouseOut = () => setDateInfo({date: null, gdp: null});

  return (
    <ChartBarContainer
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      height={ (gdp / maxGdp) * CHART_HEIGHT }
      width={CHART_WIDTH / totalItems}
    />
  );
});

const SliderContainer = styled.input`
  -webkit-appearance: none;
  width: 100%;
  background: transparent;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 30px;
    width: 10px;
    border-radius: 3px;
    background: #2EC4B6;
    cursor: pointer;
    margin-top: -9px;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 12px;
    cursor: pointer;
    background: #E71D36;
    border-radius: 3px;
  }
`;

const Slider = memo((props) => {
  const {
    min,
    max,
    value,
    update,
    step,
    ...otherProps
  } = props;

  const handleChange = ev => update(ev.target.value);

  return (
    <SliderContainer
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      {...otherProps}
    />
  )
})

Slider.defaultProps = {
  step: 1,
  min: 0,
  max: 100
}

Project5.whyDidYouRender = false;
Slider.whyDidYouRender = false;
Chart.whyDidYouRender = false;
ChartBar.whyDidYouRender = false;
DateInfo.whyDidYouRender = false;

export default Project5;