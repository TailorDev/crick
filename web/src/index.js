import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import App from './App';
import Home from './Home';
import Project from './Project';
import Teams from './Teams';
import './index.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router>
        <App>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/projects/:id" component={Project} />
            <Route path="/teams" component={Teams} />
          </Switch>
        </App>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
