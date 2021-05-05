// dependencies

import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import * as ROUTES from "../constants/routes";

// protected route

export default function ProtectedRoute({ user, children, ...rest }) {
  return (
    // route to user dashboard - as long as the user is logged in
    <Route
      {...rest}
      render={({ location }) => {
        if (user) {
          return React.cloneElement(children, { user });
        }
        // if the user is not logged in, redirect to the login page

        if (!user) {
          return (
            <Redirect
              to={{
                pathname: ROUTES.LOGIN,
                state: { from: location },
              }}
            />
          );
        }

        return null;
      }}
    />
  );
}

// 

ProtectedRoute.propTypes = {
    user: PropTypes.object, 
    children: PropTypes.object.isRequired
};
