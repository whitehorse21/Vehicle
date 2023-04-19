import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../../colors';
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const button = {
	height: 44,
	width: 227,
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 32,
	marginTop: 10
}

const iconWrapper = {
	height: 45,
	width: 45,
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'flex-end',
	position: 'absolute',
	zIndex: 1
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.blue
	},
	scrollView: {
		flex: 1,
		marginVertical: 15
	},
	scrollViewContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center'	
	},
	closeIconWrapper: {
		...iconWrapper,
		top: 0
	},
	imagePickerWrapper: {
		height: 130,
		width: 130,
		borderRadius: 65,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	image: {
		height: 130,
	    width: 130,
	    borderRadius: 65,
	    zIndex: 2
	},
	iconWrapper: {
		alignItems: 'center'
	},
	picText: {
		marginTop: 5,
		fontSize: 10,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80,
		color: colors.violet,
		textAlign: 'center'
	},
	outerlineButton: {
		height: 44,
		width: 206,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.aquaBlue,
		marginTop: 10,
		marginBottom: 5
	},
	tosText: {
		fontSize: 10,
		color: colors.white,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80
	},
	text: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textAlign: 'center'
	},
	buttonWrapper: {
		...button,
		backgroundColor: colors.white
	},
	buttonText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.violet
	},
	button: {
		...button,
		...shadow,
		backgroundColor: colors.aquaBlue,
		marginTop: 15
	},
	textStyle: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white
	},
	neighborhoodTextInput: {
		height: 36,
		width: 227,
		textAlign: 'center',
		backgroundColor: colors.white,
	    fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingHorizontal: 15,
	    borderRadius: 32,
	    marginTop: 10,
	},
	menuWrapper: {
		width: '80%',
		paddingVertical: 5,
		paddingHorizontal: 10,
	    borderRadius: 8,
	    backgroundColor: colors.white,
	    alignSelf: 'center',
	    position: 'absolute',
	    zIndex: 1,
	    bottom: 90,
	    ...shadow
	},
	menuItemText: {
		fontSize: 14,
	    color: colors.violet,
		paddingVertical: 2
	},
	inlineLabelTextInput: {
		width: 227,
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
	downArrowIcon: {
		position: 'absolute',
		height: 12,
		width: 12,
		tintColor: colors.blue,
		right: 12
	},
	modalView: {
		flex: 1, 
		margin: 10
	},
	tabWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		paddingBottom: 10,
		borderBottomWidth: 2,
		borderBottomColor: colors.white
	},
	rowWrapper: {
		flexDirection: 'row',
		marginHorizontal: 10,
		marginTop: 10
	},
	boxImage: {
		height: 35,
		width: 35,
		tintColor: colors.white,
		marginRight: 20
	},
	recordText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		width: windowWidth - 95
	},
	avtarWrapper: {
		height: 40,
		width: 40,
		backgroundColor: colors.lightBlue,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		marginRight: 15
	},
	row: {
		flexDirection: 'row'
	},
	infoText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		width: (windowWidth - 95) / 2
	},
	paymentWrapper: {
		height: 24,
		width: 210,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: colors.aquaBlue,
		marginTop: 5
	},
	chatIconWrapper: {
		...iconWrapper,
		bottom: 0
	},
	modalContentView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	wrapper: {
		marginTop: 35
	},
	valueTextInputStyle: {
		height: 40,
		width: 260,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white,
	    paddingHorizontal: 15,
	    borderRadius: 32,
	    textAlign: 'center',
	    borderWidth: 1,
	    borderColor: colors.aquaBlue
	},
	vehicleTypeButton: {
		height: 40,
		width: 260,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		backgroundColor: colors.lightBlue,
		marginTop: 10,
		marginBottom: 10,
		...shadow
	},
	vehicleTypeText: {
		fontSize: 14,
		color: colors.violet
	},
	textInputContainer: {
		flexDirection: 'row',
		marginVertical: 5
	},
	vehicleInfoTextInputStyle: {
		width: 125,
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingHorizontal: 12,
	    paddingVertical: 5,
	    borderRadius: 32,
	    textAlign: 'center',
	    backgroundColor: colors.white
	},
	calenderTextStyle: {
		fontSize: 14,
		color: colors.white
	},
	futureFreightDateStyle: {
		backgroundColor: 'transparent', 
		borderWidth: 1, 
		borderColor: colors.aquaBlue
	},
	currentDateStyle: {
		backgroundColor: 'transparent', 
		borderWidth: 1, 
		borderColor: colors.white
	},
	pastFreightDateStyle: {
		backgroundColor: colors.aquaBlue
	},
	freightWrapper: {
		flexDirection: 'row',
		width: windowWidth - 40,
		height: 73,
		backgroundColor: colors.lightBlue,
		borderRadius: 40,
		alignSelf: 'center',
		zIndex: 1,
		position: 'absolute',
		bottom: 5,
		paddingHorizontal: 20,
		alignItems: 'center'
	},
	boxImageStyle: {
		height: 40,
		width: 40,
		tintColor: colors.blue,
		marginRight: 10
	},
	date: {
		width: windowWidth - 150,
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80,
		color: colors.blue
	},
	freightInfoText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80,
		color: colors.blue
	},
	closeWrapper: {
		height: 10,
		width: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btnText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Medium',
		color: colors.white,
		letterSpacing: 0.80,
		textAlign: 'center'
	},
	wrongInputWarningWrapper: {
		width: 240
	}
})

export default styles