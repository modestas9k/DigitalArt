import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header, Loading } from "./components";
import { Home, EditProfile } from "./pages";
const UploadLazy = lazy(() => import(`./pages/Upload/Upload`));
const MyProfileLazy = lazy(() => import(`./pages/MyProfile/MyProfile`));
const ProfileLazy = lazy(() => import(`./pages/Profile/Profile`));

function Routes() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/editProfile" component={EditProfile} />
          <Route exact path="/upload" component={UploadLazy} />
          <Route exact path="/myProfile" component={MyProfileLazy} />
          <Route exact path="/profile/:id" component={ProfileLazy} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Routes;
