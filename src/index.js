import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from 'react-apollo';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create WebSocket client
const WSClient = new SubscriptionClient(`wss://react.eogresources.com/graphql`, {
  reconnect: true,
});

const client = new ApolloClient({
  link: WSClient,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
