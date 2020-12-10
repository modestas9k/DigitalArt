import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header, Loading } from "./components";
import { Home, Register, Login } from "./pages";
const UploadLazy = lazy(() => import(`./pages/Upload/Upload`));
const MyProfileLazy = lazy(() => import(`./pages/MyProfile/MyProfile`));

function Routes() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/upload" component={UploadLazy} />
          <Route exact path="/myProfile" component={MyProfileLazy} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Routes;
