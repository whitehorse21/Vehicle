import React,{Component} from 'react';
import {View, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import styles from './Style';
import {Navigation} from 'react-native-navigation';

export default class BackButton extends Component {
	render() {
		const { props } = this
		return (
			<TouchableOpacity style = {styles.backbutton_view} onPress = {() => Navigation.pop(this.props.componentId)}>
				<Image style = {styles.backbutton_image} source = {require('../../../../assets/images/back_arrow.png')}></Image>
			</TouchableOpacity>
		)
	}
}