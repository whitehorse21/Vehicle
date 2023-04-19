import { StyleSheet, Platform, Dimensions } from 'react-native'
import { colors } from '../../../colors'

const text = {
	fontSize: 14,
	fontFamily: 'Montserrat-Regular',
	color: colors.violet
}

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.lightBlue
	},
	filterWrapper: {
		marginTop: 5, 
		alignItems: 'center'
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	innerWrapper: {
		flexDirection: 'row',	
		backgroundColor: colors.white,
		borderRadius: 32,
		marginLeft: 10,
		marginTop: 10 
	},
	deleteWrapper: {
		paddingVertical: 5, 
		paddingHorizontal: 10
	},
	deleteIcon: {
		color: colors.violet, 
		fontSize: 15, 
		fontFamily: 'fontawesome'
	},
	filterText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
    	color: colors.violet,
	    paddingVertical: 5,
	    paddingLeft: 10
	},
	flatListWrapper: {
		flex: 1,
		marginLeft: 15,
		marginRight: 5,
		marginVertical: 20
	},
	rowWrapper: {
		flexDirection: 'row'
	},
	imageWrapper: {
		height: 80,
		width: 80,
		borderRadius: 40,
		backgroundColor: colors.blue,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		alignSelf: 'center'
	},
	image: {
		height: 80,
		width: 80,
		borderRadius: 40,
		backgroundColor: colors.blue,
		marginRight: 12
	},
	cameraIcon: {
		tintColor: colors.white
	},
	statusWrapper: {
		marginTop: 15,
		height: 14,
		width: 14,
		marginRight: 5
	},
	bubble: {
		height: 14,
		width: 14,
		borderRadius: 7,
		backgroundColor: colors.lightGreen,		
	},
	rightWrapper: {
		paddingTop: 10,
		paddingBottom: 10,
		width: windowWidth - 155,
		borderBottomWidth: 1,
		borderBottomColor: colors.aquaBlue
	},
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	nameText: {
		...text,
		textTransform: 'capitalize',
		width: windowWidth - 210
	},
	ratingText: {
		...text,
	},
	locationIcon: {
		height: 14,
		width: 14,
		tintColor: colors.blue
	},
	originText: {
		marginLeft: 3,
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.violet,
		width:  windowWidth - 260
	},
	valueText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.violet
	},
	valueWrapper: {
		height: 24,
		width: 80,
		borderRadius: 32,
		borderColor: colors.aquaBlue,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 5
	},
	buttonWrapper: {
		height: 29,
		width: windowWidth - 155,
		borderRadius: 32,
		backgroundColor: colors.aquaBlue,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btnText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textAlign: 'center'
	},
	modalView: {
		flex: 1
	},
	closeWrapper: {
		padding: 10
	},
	applyText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		padding: 10
	},
	mainWrapper: {
		flex: 1,
		justifyContent: 'center'
	},
	priceBtnWrapper: {
		height: 67,
		width: 67,
		borderRadius: 33.5,
		borderWidth: 1,
		borderColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: colors.white,
		borderRadius: 32,
		marginLeft: 10,
		paddingHorizontal: 18
	},
	top: {
		marginTop: 15
	},
	notFoundText: {
	    fontSize: 16,
	    fontFamily: 'Montserrat-Medium',
	    color: colors.violet,
	    textAlign: 'center',
	    marginTop: 15
	}
})

export default styles