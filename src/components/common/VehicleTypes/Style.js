import { StyleSheet } from 'react-native'
import { colors } from '../../../colors'
import {shadow} from '../../../common_style';

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	containerStyle: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	wrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 8,
		marginHorizontal: 15
	},
	typeWrapper: {
		width: 126,
		height: 65,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 35,
		borderWidth: 1,
		borderColor: colors.aquaBlue
	},
	nameText: {
		fontSize: 14,
		fontFamily: 'Montserrat-Medium',
	    color: colors.white
	},
	infoText: {
		fontSize: 12,
		fontFamily: 'Montserrat-Regular',
	    color: colors.white
	}
})

export default styles