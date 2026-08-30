import React from 'react';
import { Route, Switch, Redirect } from 'wouter';
import { HomePage, GamePage, TestPage, DebugPage } from './pages';

export const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game" component={GamePage} />
      <Route path="/test" component={TestPage} />
      <Route path="/debug" component={DebugPage} />
      {/* Fallback route */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default App;
