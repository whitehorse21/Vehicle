import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../../colors'

const styles = StyleSheet.create({
	container: {
  	flex: 1,
  	backgroundColor: colors.lightBlue
	},
  keyboardAvoidingContainer: {
    flexGrow: 1, 
    justifyContent: 'center'
  },
	logo: {
		alignSelf: 'center',
		height: 120,
		width: 120,
		borderRadius: 0,
    marginTop: 10,
		marginBottom: 30
	},
  button: {
    backgroundColor: colors.blue
  },
  registerTitleText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.gray
  },
  registersubTitleText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.blue,
    marginTop: 8,
    marginBottom: 10
  }
})

export default styles