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
		marginBottom: 20
	},
  checkboxWrapper: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: '#888686',
    borderWidth: 1
  },
  checkboxImg: {
    height: 20,
    width: 20
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#4A4A4A',
    marginLeft: 5
  },
  tosTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: colors.aquaBlue
  },
  buttonWrapper: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  }
})

export default styles