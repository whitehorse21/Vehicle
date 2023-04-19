import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style'

const styles = StyleSheet.create({
	infoWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	    width: '100%',
	    height: 40,
	    backgroundColor: colors.aquaBlue,
	    paddingHorizontal: 15,
	    ...shadow
	},
	infoText: {
	    fontSize: 14,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.white
	},
	wrapperStyle: {
		backgroundColor: colors.white, 
		paddingRight: 0 
	},
	filterText: {
	    fontSize: 14,
	    fontFamily: 'Montserrat-Regular',
	    color: colors.aquaBlue
	},
	iconWrapper: {
		height: 40,
		width: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	filterIcon: {
		height: 21,
		width: 21,
		tintColor: colors.aquaBlue
	},
})

export default styles