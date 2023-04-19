import React,{Component} from 'react';
import {View, Text, TouchableOpacity, Image, TouchableWithoutFeedback} from 'react-native';
import styles from './Style';
import {Navigation} from 'react-native-navigation';

export default class BackHeader extends Component {
	render() {
		const { props } = this
		return (
			<View style = {styles.header_view}>
				<TouchableOpacity style = {styles.backbutton_view} onPress = {() => Navigation.pop(this.props.screenId)}>
					<Image style = {styles.backbutton_image} source = {require('../../../../assets/images/back_arrow.png')}></Image>
					<Text style = {styles.backbutton_text}>{"Atrás"}</Text>
				</TouchableOpacity>
            </View>
		)
	}
}