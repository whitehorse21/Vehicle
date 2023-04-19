import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../../../colors';

const Spinner = ({backgroundColor, indicatorColor}) => {
  return (
    <View style={[styles.container, {backgroundColor: backgroundColor ? backgroundColor : colors.lightBlue }]}>
      <ActivityIndicator size="large" color={indicatorColor ? indicatorColor : colors.blue} />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	} 
})