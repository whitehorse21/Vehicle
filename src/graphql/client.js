import React, {Component} from 'react';
import { getData } from '../storage';

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: "http://68.183.155.137:5000/graphql",
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {
    const token = await getData('token');
    operation.setContext({
      headers: {
        authorization: JSON.parse(token)
      },
    });
  },
  onError: ({
    graphQLErrors, networkError
  }) => {
    if (graphQLErrors) {
      // TODO - Handle graphql error
      // if (__DEV__) console.warn(graphQLErrors);
    }
    if (networkError) {
      // TODO - Handle network error
      // if (__DEV__) console.warn(networkError);
    }
  },
});

export default client;