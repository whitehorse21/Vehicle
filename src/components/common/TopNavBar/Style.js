import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
	headerWraper: {
	    width: '100%',
	    height: 60,
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    alignItems: 'center',
	    backgroundColor: colors.blue
	},
	notificationIconWrapper: {
		// alignSelf: 'flex-end',
		paddingHorizontal: 15,
		// paddingTop: 15,
		// paddingBottom: 4
	},
	iconWrapper: {
		height: 60,
		width: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	titleText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textTransform: 'uppercase'
	},
	badge: {
		height: 20,
		borderRadius: 10,
		backgroundColor: colors.red,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 8,
		right: 8
	},
	badgeText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
		color: colors.white
	}
})

export default styles