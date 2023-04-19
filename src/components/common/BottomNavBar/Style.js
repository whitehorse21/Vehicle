import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
	iconWrapper: {
		position: 'absolute',
		alignSelf: 'flex-end',
		height: 90,
		width: 90,
		backgroundColor: colors.blue,
		borderRadius: 45,
	    right: -30,
	    bottom: -30
	},
	chatIcon: {
		left: 20,
		top: 20
	}
})

export default styles