import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './Style';
import {colors} from '../../../colors';
import {images} from '../../../../assets';
import CloseModalButton from '../CloseModalButton/Component'

class InformationBar extends Component {
	render() {
		const { props } = this
		if(props.from && props.from === 'filterScreen') {
			return (
				<View style={[ styles.infoWrapper, styles.wrapperStyle]}>
		          	<Text style={styles.filterText}>Filtros</Text>
		          	<TouchableOpacity activeOpacity={0.6} onPress={props.onPress} style={styles.iconWrapper}>
		          		<Image source={images.filter} resizeMode={'contain'} style={styles.filterIcon} />
		          	</TouchableOpacity>
		        </View>
			)
		}
		return (
			<View style={[ styles.infoWrapper, { justifyContent: props.value ? 'space-between' : 'center'}]}>
	          	<Text style={styles.infoText}>{props.titleText}</Text>
	          	{props.value && <Text style={styles.infoText}>{props.value}</Text>}
				{
					props.onClosePress &&
					<View style = {{position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 5, elevation: 5}}>
						<CloseModalButton onPress={props.onClosePress}/>
					</View>
				}
	        </View>
		)
	}
}

export default InformationBar