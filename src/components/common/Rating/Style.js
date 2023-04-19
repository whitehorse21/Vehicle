import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../colors';

const windowWidth = Dimensions.get('window').width

const text = {
	fontSize: 14,
	fontFamily: 'Montserrat-Regular',
	color: colors.white
}

const styles = StyleSheet.create({
	rowWrapper: {
		flexDirection: 'row'
	},
	imageWrapper: {
		height: 44,
		width: 44,
		borderRadius: 22,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8
	},
	image: {
		height: 44,
		width: 44,
		borderRadius: 22,
		backgroundColor: colors.white,
		marginRight: 8
	},
	starWrapper: {
	    flexDirection: 'row',
	    marginTop: 5
	},
	starImage: {
	    height: 32,
	    width: 32,
	    marginLeft: 8
	},
	infoText: {
		...text,
		marginTop: 5,
		width: windowWidth - 115
	},
	buttonText: {
		...text,
		textAlign: 'center'
	},
	button: {
		height: 29,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.aquaBlue,
		borderRadius: 32,
		marginVertical: 10,
		paddingHorizontal: 18
	}
})

export default styles