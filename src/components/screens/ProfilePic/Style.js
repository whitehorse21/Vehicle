import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../../colors'

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.lightBlue,
	  	justifyContent: "center"
	},
	imagePickerWrapper: {
		height: 250,
	    width: 250,
	    borderRadius: 125,
	    backgroundColor: colors.white,
	    alignItems: 'center',
	    justifyContent: 'center',
	    alignSelf: 'center',
	    marginTop: 20,
	    marginBottom: 40
	},
	image: {
		height: 250,
	    width: 250,
	    borderRadius: 125,
	    zIndex: 2
	},
	iconWrapper: {
		alignItems: 'center'
	},
	imagePickerText: {
	    textAlign: 'center',
	    fontSize: 10,
	    fontFamily: 'Montserrat-Medium',
	    color: colors.blue,
	    lineHeight: 15,
	    letterSpacing: 0.80,
	    alignSelf: 'center',
	    marginTop: 5
	},
	buttonWrapper: {
		marginTop: 70
	},
	nameText: {
		fontSize: 10,
		fontFamily: 'Montserrat-Medium',
	    color: colors.blue,
	    textAlign: 'center',
	    textTransform: 'uppercase'
	}
})

export default styles