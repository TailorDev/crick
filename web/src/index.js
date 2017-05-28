import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import App from './App';
import Project from './Project';
import './index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="App">
        <div className="App-header">
          <h2>crick.io</h2>
        </div>

        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/projects/:id" component={Project} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
