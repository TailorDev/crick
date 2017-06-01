import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
import PrivateRoute from './Routing/PrivateRoute';
import NotFound from './Routing/NotFound';
import App from './App';
import Home from './Home';
import Project from './Project';
import Teams from './Teams';
import './index.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// TailorDev MUI theme for Crick
// https://material.io/color/#!/?view.left=0&view.right=1&primary.color=2e354f&secondary.color=5ec3a0&secondary.text.color=2e354f
const crickTheme = getMuiTheme({
  palette: {
    primary1Color: '#2e354f',
    primary2Color: '#060f27',
    primary3Color: '#585f7b',
    accent1Color: '#269272',
    accent2Color: '#91f6d1',
    accent3Color: '#5ec3a0',
    textColor: '#333',
  }
});

const store = configureStore();

ReactDOM.render(
  <MuiThemeProvider muiTheme={crickTheme}>
    <Provider store={store}>
      <Router>
        <App>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/projects/:id" component={Project} store={store} />
            <PrivateRoute exact path="/teams" component={Teams} store={store} />
            <PrivateRoute exact path="/teams/:id/edit" component={Teams} store={store} />
            <Route component={NotFound} />
          </Switch>
        </App>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
