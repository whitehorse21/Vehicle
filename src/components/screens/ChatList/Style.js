import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../../colors'

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.blue
	},
	serchWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: 20
	},
	searchIcon: {
		position: 'absolute',
		left: 270,
		zIndex: 2
	},
	inlineLabelTextInput: {
		position: 'relative',
		height: 44,
		width: 300,
		backgroundColor: colors.white,
		fontSize: 14,
	   	fontFamily: 'Montserrat-Regular',
	    color: colors.blue,
	    borderRadius: 32,
	    paddingLeft: 15,
	    textAlign: 'center',
	    paddingRight: 35
	},
	scrollContainer: {
		flexGrow: 1,
		marginTop: 20,
		marginBottom: 10
	},
	rowWrapper: {
		flexDirection: 'row',
		marginHorizontal: 20,
		marginTop: 15
	},
	imageWrapper: {
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: colors.lightBlue,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 15
	},
	image: {
		height: 50,
		width: 50,
		borderRadius: 25,
		backgroundColor: colors.lightBlue,
		marginRight: 15
	},
	cameraIcon: {
		tintColor: colors.white
	},
	rightWrapper: {
		width: windowWidth - 105,
		borderBottomWidth: 1,
		borderBottomColor: colors.aquaBlue
	},
	nameText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textTransform: 'capitalize',
		width: windowWidth - 130
	},
	description: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		marginTop: 4,
		marginBottom: 12
	},
	iconWrapper: {
		alignSelf: 'flex-end',
		height: 90,
		width: 90,
		backgroundColor: colors.lightBlue,
		borderRadius: 45,
	    marginRight: -30,
	    marginBottom: -30
	},
	homeIcon: {
		height: 29,
		width: 29,
		tintColor: colors.blue, 
		left: 20,
		top: 18
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	badge: {
	    height: 20,
	    width: 20,
	    backgroundColor: colors.aquaBlue,
	    borderRadius: 10,
	    justifyContent: 'center',
	    alignItems: 'center'
  	},
  	badgeText: {
  		color: colors.white,
	    fontSize: 10,
	    fontFamily: "Montserrat-Bold",
  	},
	notFoundText: {
		fontSize: 16,
	    fontFamily: 'Montserrat-Medium',
	    color: colors.white,
	    textAlign: 'center',
	    marginTop: 20
	}	
})

export default styles