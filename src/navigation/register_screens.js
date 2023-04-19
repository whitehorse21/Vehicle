import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import { Navigation } from "react-native-navigation";
import { ApolloProvider } from 'react-apollo';
import { Provider } from "react-redux";
import screens from './screens';
import store from '../store';
import ApolloClient from '../graphql/client';

const wrapWithProvider = (Component) => {
  return class extends React.Component {
    render() {
      return (
        <ApolloProvider client={ApolloClient}>
        	<Provider store={store}>
	        	<SafeAreaView style={{ flex: 1}}>
	          		<Component {...this.props} />
	          	</SafeAreaView>
	        </Provider>
        </ApolloProvider>
      );
    }
  };
};

export const registerScreens = () => {
	Object.keys(screens).map(key => screens[key]).forEach((screen) => {
  	Navigation.registerComponent(screen.id, () => wrapWithProvider(screen.screen));
  })
}