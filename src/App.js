/** @jsx jsx */
import { lazy, Suspense } from 'react';
import { jsx, css, Global } from '@emotion/core';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { find, propEq } from 'ramda';
import projects from './projects.json';

const Loading = (
  <div css={css`
    display: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 55px 35px;
    
    .ellipsis {
      color: rgb(114, 223, 250);
    }
  `}>
    <Global styles={css`
      body {
        font-family: proxima-nova, "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;
        margin: 0;
        background: rgb(30,30,30);
        color: rgb(150,150,150);
      }
    `} />
    <h1>
      Loading<span className="ellipsis">…</span>
    </h1>
  </div>
);

const Title = withRouter((props) => {
  const {
    location
  } = props;

  const title = location.pathname === '/' ? '25 React Projects' : find(propEq('id', location.pathname.replace('/projects/', '')), projects).name;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
})

const App = () => (
  <Router>
    <Title />
    <Suspense fallback={Loading}>
      <Switch>
        {projects.map((project, i) => (
          <Route key={i} path={`/projects/${project.id}/`} component={lazy(() => import(`./${project.id}`))} />
        ))}
        <Route path="/" component={lazy(() => import('./Home'))} />
      </Switch>
    </Suspense>
  </Router>
)

export default App;
