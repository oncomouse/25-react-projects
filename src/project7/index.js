/** @jsx jsx */
import { Global, jsx, css } from '@emotion/core';
import { memo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { mapObjIndexed, reverse } from 'ramda';

const INITIAL_STATE = {
  data: [28, 12.2, 11.4, 8.4, 6.9, 5.8, 5.2, 3.0, 2.6, 2.2, 1.9, 1.8, 1.6, 1.5, 1.4, 1.2, 0.1, 0.1],
  occupation: ["Full-Stack Web Developer", "Back-End Web Developer", "Student", "Mobile Developer (Android, iOS, WP, and MultiPlatform)", "Desktop Develop", "Front-End Web Developer", "Other", "Enterprise Level Services Developer", "Embedded Application Developer", "DevOps", "Developer with a Statistics or Mathematics Background", "Executive (VP of Engineering, CTO, CIO, etc.)", "Data Scientist", "System Administrator", "Engineering Manager", "Analyst", "Business Intelligence or Data WWarehousing Expert", "Maching Learning Developer"]
};

const GLOBAL_STYLE = css`
@import url("https://fonts.googleapis.com/css?family=Avenir");
body {
  background: #323232;
  min-width: 1000px;
}

button:hover {
  cursor: pointer;
  color: #0EB0D6 !important;
  background: #191919 !important;
}

button:focus {
  outline: none;
}

a, a:visited {
  color: #95949D;
  text-decoration: none;
}

a:hover {
  color: #0EB0D6;
  text-decoration: underline;
}
`;

const Project7 = memo(() => {
  const [data, setData] = useState(INITIAL_STATE);

  const reverseData = () => setData(mapObjIndexed(reverse))

  const highChartOptions = {
    title: {
      text: 'StackOverflow 2016 Developer Survey Results for Occupation'
    },
    xAxis: {
      categories: data.occupation
    },
    yAxis: {
      title: {
        text: 'Percentage of Respondants'
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          formatter: function formatter() {
            return `${Highcharts.numberFormat(this.y)}%`;
          }
        }
      }
    },
    chart: {
      backgroundColor: "#FCFFC5",
      type: "bar",
      height: 750
    },
    series: [{
      name: 'Developer Occupations',
      data: data.data
    }]
  }

  return (
    <div css={css`
      color: rgb(149, 148, 157);
      font-family: Avenir;
      font-size: 35px;
      margin-top: 25px;
      margin-bottom: 0px;
      text-align: center;
    `}>
      <p css={css`
        color: rgb(149, 148, 157);
        font-family: Avenir;
        font-size: 35px;
        margin-top: 25px;
        margin-bottom: 0px;
      `}>HighCharts rendered in React</p>
      <div css={css`
        width: 900px;
        height: 750px;
        border: 1px solid black;
        margin: 65px auto;
        margin-top: 25px;
        margin-bottom: 0px;
        overflow: hidden;
      `}>
        <Global styles={GLOBAL_STYLE} />
        <HighchartsReact
          highcharts={Highcharts}
          options={highChartOptions}
        />
      </div>
      <button
        onClick={reverseData}
        css={css`
          border: none;
          font-size: 18px;
          background: rgb(14, 176, 214);
          padding: 7px;
          border-radius: 7px;
          margin-top: 25px;
        `}
      >Click to reverse data order!</button>
      <p css={css`
        font-family: Avenir;
        font-size: 15px;
        margin-top: 10px;
        margin-bottom: 25px;
      `}>
        <a href="http://stackoverflow.com/research/developer-survey-2016">- view the full survey results -</a>
      </p>
    </div>
  );
})

export default Project7;