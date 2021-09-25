import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, isAuthenticated, ...rest }) {
  console.log({...rest})
  return (
    <Route
      {...rest}
      component={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
