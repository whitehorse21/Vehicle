import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../colors';
import {shadow} from '../../../common_style';

const styles = StyleSheet.create({
	menuWrapper: {
		paddingVertical: 5,
		paddingHorizontal: 10,
	    height: 100,
	    borderRadius: 8,
	    backgroundColor: colors.white,
	    alignSelf: 'center',
	    ...shadow
	},
	menuItemText: {
		fontSize: 14,
	    color: colors.violet,
		paddingVertical: 2
	}
})

export default styles