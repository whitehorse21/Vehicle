import {StyleSheet} from 'react-native'
import {colors} from '../../../colors'

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: 'center'
	},
	iconWrapper: {
		position: 'absolute',
		left: 45,
		zIndex: 2
	},
	inlineLabelTextInput: {
		position: 'relative',
		height: 60,
		marginHorizontal: 20,
		marginVertical: 5,
		backgroundColor: colors.white,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingLeft: 55,
	    paddingRight: 12,
	    borderRadius: 30
	}
})

export default styles