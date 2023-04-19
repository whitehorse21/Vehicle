import { StyleSheet } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style';

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.lightBlue
	},
	keyboardAvoidingContainer: {
	    flexGrow: 1,
	    justifyContent: 'center',
	    alignItems: 'center'
	},
	imagePickerWrapper: {
		height: 144,
	    width: 144,
	    borderRadius: 72,
	    backgroundColor: colors.white,
	    alignItems: 'center',
	    justifyContent: 'center',
	    alignSelf: 'center',
	    marginTop: 15,
	    marginBottom: 25
	},
	imageWrapper: {
		alignItems: 'center'
	},
	image: {
		height: 144,
	    width: 144,
	    borderRadius: 72,
	    zIndex: 2
	},
	imagePickerText: {
	    textAlign: 'center',
	    fontSize: 10,
	    fontFamily: 'Montserrat-Medium',
	    letterSpacing: 0.80,
	    color: colors.blue,
	    marginTop: 5
	},
	buttonWrapper: {
		flexDirection: 'row',
		marginVertical: 5,
		height: 44,
		width: '80%',
		backgroundColor: colors.blue,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
		...shadow
	},
	textInput: {
		height: 44,
		width: '80%',
		marginTop: 10,
	    backgroundColor: colors.blue,
	    fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white,
	    paddingHorizontal: 15,
	    borderRadius: 32,
	    textAlign: 'center'
	},
	buttonText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white
	},
	inlineLabelTextInput: {
		height: 44,
		width: '80%',
		marginTop: 10,
		backgroundColor: colors.white,
		fontSize: 14,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingHorizontal: 15,
	    borderRadius: 32
	},
	rowWrapper: {
		flexDirection: 'row',
		width: '80%',
		justifyContent: 'space-between',
		marginTop: 5
	},
	buttonContainer: {
		width: '100%',
		marginVertical: 15
	},
	customeWidth: {
		width: '48%'
	},
	wrongInputWarningWrapper: {
		width: '75%'
	},
	menuWrapper: {
		width: '78%',
		paddingVertical: 5,
		paddingHorizontal: 10,
	    borderRadius: 8,
	    backgroundColor: colors.white,
	    alignSelf: 'center',
	    position: 'absolute',
	    zIndex: 1,
	    ...shadow
	},
	menuItemText: {
		fontSize: 14,
	    color: colors.violet,
		paddingVertical: 2
	}
})

export default styles