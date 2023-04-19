import { StyleSheet, Dimensions } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container: {
	  	flex: 1,
	  	backgroundColor: colors.white
	},
	mapWrapper: {
		flex: 1,
		...shadow,
	    backgroundColor: colors.white
	},
	map: {
		 ...StyleSheet.absoluteFillObject
	},
	mainWrapper: {
		marginTop: 10
	},
	locationBoxWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 44,
		width: windowWidth,
		backgroundColor: 'transparent',
	    borderBottomWidth: 1,
	    borderBottomColor: colors.lightBlue,
	    paddingHorizontal: 10
	},
	locationText: {
		fontSize: 14,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.violet,
	    marginLeft: 10,
	    width: windowWidth - 60
	},
	originIcon: {
		height: 27,
		width: 27,
		tintColor: colors.lightGreen
	},
	destinationIcon: {
		height: 27,
		width: 27,
		tintColor: colors.navyBlue
	}
})

export default styles