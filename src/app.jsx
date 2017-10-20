import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import Auth from './core/middleware/Auth';
import Layout from './components/pages/Layout.jsx';
import Login from './components/pages/Login.jsx';
import Routes from './config/routes';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/login" component={Login} onEnter={Auth.routeEnter.bind(Auth)} />
    <Route path="/" component={Layout} onChange={Auth.routeChange.bind(Auth)} onEnter={Auth.routeEnter.bind(Auth)}>
      { Routes.map((route, key) => (
          <Route path={route.path} key={key} getComponent={route.resolve} />
        ))
      }
    </Route>
  </Router>,
  document.getElementById('app')
);
