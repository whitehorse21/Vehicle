import {StyleSheet} from 'react-native';
import {colors} from '../../../colors';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.aquaBlue
	},
	buttonWrapper: {
		marginTop: 80
	},
	button: {
	    alignItems: 'center',
	    marginHorizontal: 30,
	    paddingVertical: 20,
	    paddingHorizontal: 15,
	    borderRadius: 50,
	    backgroundColor: colors.blue,
	    marginBottom: 20
	},
	buttonText: {
	  	fontSize: 14,
	    color: colors.white,
	    fontFamily: 'Montserrat-Regular'
	},
	titleText: {
		fontSize: 16,
		fontFamily: 'Montserrat-Regular',
		color: colors.white,
		textAlign: 'center',
		marginTop: 50
	},
	logo: {
		height: 80,
		width: 200,
		alignSelf: 'center'
	}
})

export default styles