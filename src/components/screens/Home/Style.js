import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style'

const button = {
	height: 52,
	width: 230,
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 32,
	marginTop: 15
}

const outerLineButton = {
	height: 40,
	width: 200,
	backgroundColor: 'transparent',
    paddingHorizontal: 15,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.aquaBlue,
    marginTop: 10
}

const text = {
	fontSize: 14,
	fontFamily: 'Montserrat-Regular',
	color: colors.violet,
	textAlign: 'center'
}

const styles = StyleSheet.create({
	container: {
	  	flex: 1
	},
	keyboardAvoidingContainer: {
	    flexGrow: 1, 
	    justifyContent: 'space-around',
		alignItems: 'center'
	},
	logo: {
		height: 180,
		width: 280,
		paddingLeft: 10,
		alignItems: 'center'
	},
	actionButton: {
		...button,
		...shadow,
		backgroundColor: colors.aquaBlue
	},
	actionButtonText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white
	},
	inlineLabelTextInput: {
		...outerLineButton,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.aquaBlue,
	    textAlign: 'center',
	},
	chagePasswordButton: {
		...outerLineButton,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	chagePasswordButtonText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.aquaBlue
	},
	logoutButton: {
		height: 40,
		width: 130,
		borderRadius: 32, 
		backgroundColor: colors.blue,
	    justifyContent: 'center',
	    alignItems: 'center',
	    marginVertical: 15,
	    ...shadow
	},
	wrapper: {
		width: '100%',
		alignItems: 'center'
	},
	mainWrapper: {
		flex: 1,
	  	alignItems: 'center'
	},
	picWrapper: {
		marginTop: 50,
		height: 180,
		width: 180,
		borderRadius: 90,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center'
	},
	profilePic: {
		marginTop: 50,
		height: 180,
		width: 180,
		borderRadius: 90,
		backgroundColor: colors.white
	},
	titleText: {
		...text,
		marginTop: 15,
		marginBottom: 25
	},
	button: {
		...button,
		backgroundColor: 'transparent',
		borderWidth: 2,
		borderColor: colors.aquaBlue
	},
	buttonText: {
		...text
	},
	mapWrapper: {
		flex: 1,
		...shadow,
	    backgroundColor: colors.white
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	bottomWrapper: {
		marginTop: 5,
		marginHorizontal: 15
	},
	switchWrapper: {
		alignSelf: 'flex-end'
	},
	detailsWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 25
	},
	imageWrapper: {
		height: 70,
		width: 70,
		borderRadius: 35,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 15
	},
	image: {
		height: 70,
		width: 70,
		borderRadius: 35,
		backgroundColor: colors.white,
		marginRight: 15
	},
	ratingWrapper: {
		height: 30,
		width: 136,
		borderRadius: 32,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: colors.aquaBlue,
		marginTop: 5
	},
	promotionText: {
		marginTop: 15,
		marginBottom: 10,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textAlign: 'center'
	},
	flatlistWrapper: {
		height: 90,
		marginHorizontal: 35,
		marginBottom: 10
	},
	flatlistContainerStyle: {
		alignItems: 'center'
	},
	promotionView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 250,
	    borderRadius: 32,
	    paddingVertical: 8,
	    backgroundColor: colors.white,
	    marginTop: 10,
	    paddingHorizontal: 15
  	},
  	createPromotionWrapper: {
  		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 32,
		borderColor: colors.aquaBlue,
		marginHorizontal: 35,
		padding: 15
	},
	rowWrapper: {
		flexDirection: 'row',
		justifyContent: 'center', 
		marginTop: 10,
		marginBottom: 5
	},
	discountInputBox: {
		height: 35,
		width: 80,
		paddingHorizontal: 15,
		borderWidth: 1,
		borderRadius: 32,
		borderColor: colors.white,
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white
	},
	createPromotionButton: {
		height: 35,
		width: 80,
		paddingHorizontal: 15,
		backgroundColor: colors.aquaBlue,
		marginLeft: 20,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 32
	},
	notFoundText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		color: colors.white,
	    textAlign: 'center',
	    marginTop: 10
	},
	userNameText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.violet,
		marginLeft: 5
	},
	downloadTitleText: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
		color: colors.violet,
		marginTop: 20,
		padding: 5
	},
	modal: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	downloadingText: {
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
		color: colors.white,
		marginTop: 20
	}
})

export default styles