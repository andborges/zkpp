import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import useToken from './hooks/useToken';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Logout from './pages/Logout';
import Home from './pages/Home';

const {
  isAuthenticated
} = useToken();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ?
            (<Component {...props} />) :
            (<Redirect to={{ pathname: "/signin", state: { from: props.location } }} />)
    }
  />
);

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/logout" component={Logout} />

        {<PrivateRoute path="/" component={Home} />}

        <Route path="*" component={() => <h1>Page not found</h1>} />
      </Switch>
    </BrowserRouter>
  );
}