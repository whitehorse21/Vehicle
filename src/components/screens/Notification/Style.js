import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors} from '../../../colors';
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const text = {
	fontSize: 14,
	fontFamily: 'Montserrat-Regular',
	color: colors.white
}

const button = {
	height: 29,
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: colors.aquaBlue,
	borderRadius: 32
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.blue
	},
	mainWrapper: {
		flex: 1,
		marginHorizontal: 15,
		marginBottom: 10,
		paddingHorizontal: 5,
		paddingVertical: 18,
		borderWidth: 1,
		borderColor: colors.aquaBlue,
		borderRadius: 32 
	},
	containerStyle: {
		flexGrow: 1
	},
	notificationWrapper: {
		marginTop: 4,
		paddingBottom: 12,
		marginHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: colors.aquaBlue
	},
	rowWrapper: {
		flexDirection: 'row'
	},
	timeText: {
		fontSize: 10,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		alignSelf: 'flex-end'
	},
	imageWrapper: {
		height: 44,
		width: 44,
		borderRadius: 22,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8
	},
	image: {
		height: 44,
		width: 44,
		borderRadius: 22,
		marginRight: 8,
		backgroundColor: colors.white
	},
	infoText: {
		...text,
		marginTop: 5,
		width: windowWidth - 115
	},
	textStyle: {
		...text,
		width: windowWidth - 120
	},
	valueWrapper: {
		height: 24,
		width: 225,
		borderRadius: 32,
		borderColor: colors.aquaBlue,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8
	},
	valueText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.white
	},
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginVertical: 10 
	},
	payButton: {
		...button,
		paddingHorizontal: 12
	},
	openChatButton: {
		...button,
		paddingHorizontal: 12,
		marginLeft: 10
	},
	rejectButton: {
		...button,
		paddingHorizontal: 12,
		backgroundColor: colors.red, 
		marginLeft: 10
	},
	buttonText: {
		...text,
		textAlign: 'center'
	},
	button: {
		...button,
		paddingHorizontal: 18
	},
	starWrapper: {
		flexDirection: 'row',
		marginTop: 5
	},
	starImage: {
		height: 32,
		width: 32,
		tintColor: colors.white,
		marginLeft: 8
	},
	paymentWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	paymentButton: {
		height: 52,
		width: 112,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		borderWidth: 1,
		borderColor: colors.white
	},
	selectedpaymentButton: {
		height: 52,
		width: 112,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		backgroundColor: colors.aquaBlue
	},
	confirmButton: {
		height: 36,
		width: 190,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 6,
		backgroundColor: colors.aquaBlue,
		...shadow
	},
	confirmButtonText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Bold',
		letterSpacing: 1,
		color: colors.white
	},
	mainContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	msgText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80,
		color: colors.white,
		textAlign: 'center',
		marginVertical: 20
	},
	freightInfoWrapper: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
		marginTop: 10
	},
	infoWrapper: {
		marginBottom: 20
	},
	text: {
		...text,
		width: windowWidth - 90
	},
	valueTextInput: {
		height: 34,
	    width: 225,
	    backgroundColor: 'transparent',
	    fontSize: 12,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.white,
	    paddingHorizontal: 15,
	    borderRadius: 32,
	    borderColor: colors.aquaBlue,
	    borderWidth: 1,
	    marginBottom: 20
	},
	headText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
		letterSpacing: 0.80,
		color: colors.white,
		textAlign: 'center',
		marginBottom: 5
	},
	notFoundText: {
	    fontSize: 16,
	    fontFamily: 'Montserrat-Medium',
	    color: colors.lightBlue,
	    textAlign: 'center'
	},
	broadCastNotificationTitleText: {
		...text,
		marginTop: 5,
		width: windowWidth - 60
	},
	broadCastNotificationDetailText: {
		...text,
		width:  windowWidth - 60
	},
	nameText: {
		...text,
		width: windowWidth - 90,
		textTransform: 'capitalize'
	},
	btnStyle: {
		backgroundColor: colors.red, 
		marginLeft: 10
	},
	rejectNotificationWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	}
})

export default styles