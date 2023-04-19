import { StyleSheet } from 'react-native'
import { colors } from '../../../colors'

const text = {
	fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.violet
}

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.lightBlue
	},
	keyboardAvoidingContainer: {
		flex: 1,
		marginTop: 10
	},
	keyboardAvoidingContentContainer: {
	    flexGrow: 1,
	    marginHorizontal: 20,
	    justifyContent: 'space-around'
	},
	warningStyle: {
		marginTop: 5,
		marginBottom: 8
	},
	textInputwrapper: {
		justifyContent: 'center',
		marginVertical: 5
	},
	locationIcon: {
		position: 'absolute',
		left: 20,
		zIndex: 2,
		height: 27,
		width: 27
	},
	inlineLabelTextInput: {
		position: 'relative',
		height: 45,
		backgroundColor: colors.white,
	    paddingLeft: 55,
	    paddingRight: 15,
	    borderRadius: 30,
	    ...text
	},
	titleText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
    	color: colors.violet,
    	marginTop: 8,
    	marginBottom: 5,
    	marginLeft: 10
	},
	rowWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	btnWrapper: {
		width: 115,
	    height: 45,
	    borderRadius: 32,
	    justifyContent: 'center',
	    alignItems: 'center',
	    alignSelf: 'center',
	    backgroundColor: colors.white
	},
	btnText: {
		...text
	},
	rangeText: {
		...text,
		marginHorizontal: 15
	},
	textInput: {
		backgroundColor: colors.white,
	   	width: 150,
	    height: 45,
	    paddingHorizontal: 15,
	    borderRadius: 30,
	    ...text
	},
	infoWrapper: {
		height: 94,
	    width: 94,
	    borderRadius: 32,
	    borderColor: colors.aquaBlue,
	    borderWidth: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    marginLeft: 30,
	    padding: 5
	},
	infoText: {
		fontSize: 10,
		fontFamily: 'Montserrat-Regular',
		color: colors.blue,
		textAlign: 'center'
	},
	btnContainer: {
		marginTop: 5,
		marginBottom: 15
	},
	modalViewWrapper: {
		flex: 1,
		margin: 10,
		justifyContent: 'space-around'
	},
	instructionsWrapper: {
		flex: 1,
		margin: 10,
		borderRadius: 32, 
		borderWidth: 1, 
		borderColor: colors.aquaBlue,
		paddingHorizontal: 20 
	},
	headText: {
		alignSelf: 'center',
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.aquaBlue,
	    paddingBottom: 6,
	    borderBottomWidth: 1, 
		borderBottomColor: colors.aquaBlue,
		marginTop: 20
	},
	innerWrapper: {
		marginTop: 30
	},
	instructionText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.lightBlue
	},
	dimensionFormateText: {
		fontFamily: 'Montserrat-Bold'
	},
	textStyle: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
    	color: colors.violet,
    	marginLeft: 10
	}
})

export default styles