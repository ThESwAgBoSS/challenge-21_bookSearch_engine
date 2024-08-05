import React from 'react';
import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SearchBooks from './components/SearchBooks';
import SavedBooks from './components/SavedBooks';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Auth from './utils/auth';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: Auth.loggedIn() ? `Bearer ${Auth.getToken()}` : '',
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route exact path="/signup" component={SignupForm} />
            <Route exact path="/login" component={LoginForm} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;