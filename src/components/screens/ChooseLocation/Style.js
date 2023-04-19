import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.white
	},
	keyboardAvoidingContainer: {
	    flexGrow: 1
	},
	mapWrapper: {
		flex: 1,
		...shadow,
	    backgroundColor: colors.white
	},
	map: {
		...StyleSheet.absoluteFillObject
	},
	detailsWrapper: {
		alignItems: 'center',
		paddingTop: 12,
		paddingBottom: 10 
	},
	titleText: {
		fontSize: 14, 
		fontFamily: 'Montserrat-Regular',
		color: colors.gray
	},
	textInputContainer: {
	    backgroundColor: 'transparent',
	    height: 44,
	    width: windowWidth,
	    borderBottomWidth: 1,
	    borderBottomColor: colors.lightBlue,
	    borderTopColor: 'transparent',
	    flexDirection: 'row',
	    alignItems: 'center'
	},
	textInput: {
		position: 'relative',
		width: windowWidth,
		backgroundColor: 'transparent',
		fontSize: 14,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    paddingLeft: 35
	},
	locationIcon: {
		position: 'absolute',
		left: 8,
		zIndex: 2,
		height: 27,
		width: 27
	}
})

export default styles