import {StyleSheet} from 'react-native';
import {colors} from '../../../colors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.lightBlue
	},
	headerWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
	    width: '100%',
	    height: 50,
	    backgroundColor: colors.blue
	},
	headText: {	
		fontSize: 16,
		fontFamily: 'Montserrat-Medium',
		color: colors.white,
		textTransform: 'capitalize'
	},
	directionView: {
	    flexDirection: 'row'
	},
	leftBubbleTriangle: {
	    width: 10,
	    backgroundColor: 'transparent',
	    borderStyle: 'solid',
	    borderLeftWidth: 10,
	    borderTopWidth: 10,
	    borderLeftColor: 'transparent',
	    borderTopColor: colors.white
	},
	rightBubbleTriangle: {
	    width: 10,
	    backgroundColor: 'transparent',
	    borderStyle: 'solid',
	    borderRightWidth: 10,
	    borderTopWidth: 10,
	    borderRightColor: 'transparent',
	    borderTopColor: colors.aquaBlue
	},
	leftBubbleWrapper: {
	    paddingTop: 5,
	    alignItems: "flex-start",
	    backgroundColor: colors.white,
	    marginRight: 80,
	    borderBottomLeftRadius: 10,
	   	borderBottomRightRadius: 10,
	   	borderTopLeftRadius: 0,
	    borderTopRightRadius: 10
	},
	leftOtherWrapper: {
	    paddingLeft: 5,
	    marginRight: 0,
	    backgroundColor: colors.white
	},
	rightOtherWrapper: {
	    backgroundColor: colors.aquaBlue,
	    paddingRight: 5,
	    borderBottomLeftRadius: 10,
	   	borderBottomRightRadius: 10,
	   	borderTopLeftRadius: 10,
	    borderTopRightRadius: 0
	},
	bottomLeftRadius: {
	    borderBottomLeftRadius: 0
	},
	bottomRightRadius: {
	    borderBottomRightRadius: 10
	},
	topLeftRadius: {
	    borderTopLeftRadius: 0
	},
	topRightRadius: {
	    borderTopRightRadius: 0
	},
	leftText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.blue
	},
	rightText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white
	},
	textInputStyle: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.blue
	},
	sendBtnWrapper: {
		height: 44,
        padding: 10
	},
	sendIcon: {
		fontSize: 20, 
		fontFamily: 'fontawesome',
		color: colors.blue
	}
})

export default styles