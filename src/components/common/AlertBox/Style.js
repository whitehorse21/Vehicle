import { StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../../colors';

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
	    top: 0,
	    bottom: 0,
	    left: 0,
	    right: 0,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: 'rgba(0, 0, 0, 0.6)'
	},
	messageWrapper: {
		height: 90,
		width: 300,
	    backgroundColor: colors.white,
	   	justifyContent: 'center'
	},
	messageText: {
	    fontSize: 14,
	    color: colors.violet,
	    fontFamily: 'Montserrat-Regular',
	    marginHorizontal: 20
	},
	buttonContainer: {
	    flexDirection: 'row',
	    height: 50,
	    borderTopWidth: 1,
	    borderTopColor: colors.lightGray,
	    backgroundColor: colors.white
	},
	cancelButton: {
	    width: 150,
	    justifyContent: 'center',
	    alignItems: 'center',
	    borderRightWidth: 1,
	    borderRightColor: colors.lightGray
	},
	okButton: {
		width: 150,
	    justifyContent: 'center',
	    alignItems: 'center'
	},
	cancelButtonText: {
	    fontSize: 14,
	    color: colors.black,
	    fontFamily: 'Montserrat-Medium'
	},
	okButtonText: {
		fontSize: 14,
	    color: colors.violet,
	    fontFamily: 'Montserrat-Bold'
	}
})

export default styles