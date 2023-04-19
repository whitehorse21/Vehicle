import React,{Component} from 'react';
import {View, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import styles from './Style';
import {Navigation} from 'react-native-navigation';
import {Close, } from '../../../../assets';

export default class BackButton extends Component {
	render() {
		const { props } = this
		return (
			<View style = {{width: '100%'}}>
				<TouchableOpacity activeOpacity={0.8} style = {styles.button_view} onPress = {() => this.props.onPress()}>
					<Image style = {[styles.close_image, {tintColor: props.color ? props.color : null}]} source = {require('../../../../assets/images/close.png')}></Image>
				</TouchableOpacity>
			</View>
		)
	}
}