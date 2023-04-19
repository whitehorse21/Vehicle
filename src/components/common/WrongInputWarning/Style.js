import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../colors';

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
	warningWrapper: {
	    alignSelf: 'center',
	    width: windowWidth - 80,
	    paddingVertical: 6,
	    backgroundColor: colors.red,
	    flexDirection: 'row',
	    alignItems: 'center',
	    marginBottom: 10
	},
	wraningIcon: {
	    padding: 5,
	    marginHorizontal: 10,
	},
	errorText: {
		width: windowWidth - 130,
	    fontSize: 12,
	    fontFamily: 'Montserrat-Bold',
	    color: colors.white
	}
})

export default styles