import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style';

const windowHeight = Dimensions.get('window').height

const button = {
	height: 53,
	width: 244,
	borderRadius: 40,
	alignItems: 'center',
	justifyContent: 'center',
	marginBottom: 15,
	...shadow
}

const text = {
	marginTop: 10,
	fontSize: 14,
	fontFamily: 'Montserrat-Regular',
	textAlign: 'center'
}

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.white
	},
	firstContainer: {
		height: windowHeight / 2,
		backgroundColor: colors.blue,
		alignItems: 'center',
		justifyContent: 'center'
	},
	secondContainer: {
		height: windowHeight / 2,
		backgroundColor: colors.aquaBlue,
		alignItems: 'center',
		justifyContent: 'center'
	},
	freeServiceButton: {
		...button,
		backgroundColor: colors.aquaBlue
	},
	freeServiceBtnText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white
	},
	premiumServiceButton: {
		...button,
		backgroundColor: colors.white
	},
	premiumServiceBtnText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.violet
	},
	textStyle: {
		...text,
		color: colors.aquaBlue
	},
	msgText: {
		...text,
		color: colors.white,
		textAlign: 'center'
	},
	infoText: {
		...text,
		color: colors.violet,
		textAlign: 'center'
	}
})

export default styles