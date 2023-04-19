import { StyleSheet } from 'react-native';
import {colors} from '../../../colors';

const styles = StyleSheet.create({
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white
	},
	closeContainer: {
		position: 'absolute',
		zIndex: 2,
		alignSelf: 'flex-end',
		top: 20,
		right: 5
	}
})

export default styles