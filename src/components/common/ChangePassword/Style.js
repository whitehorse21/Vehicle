import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		justifyContent: 'center',
		alignItems: 'center'
	},
	inlineLabelTextInput: {
	    height: 44,
		width: 248,
		marginTop: 10,
		backgroundColor: colors.white,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingHorizontal: 15,
	    borderRadius: 32,
	    textAlign: 'center',
	    paddingVertical: 5
	},
	buttonWrapper: {
		marginTop: 15
	}
})

export default styles