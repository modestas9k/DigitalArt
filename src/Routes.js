import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header, Loading } from "./components";
import { Home, Register, Login } from "./pages";
const AboutLazy = lazy(() => import(`./pages/About/About`));

function Routes() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/about" component={AboutLazy} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Routes;
