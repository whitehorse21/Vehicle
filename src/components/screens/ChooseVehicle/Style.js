import { StyleSheet } from 'react-native'
import { colors } from '../../../colors'

const styles = StyleSheet.create({
	container: {
  	flex: 1,
  	backgroundColor: colors.lightBlue
	},
  containerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxWrapper: {
    height: 160,
    width: 155,
    borderRadius: 32,
    borderColor: colors.aquaBlue,
    borderWidth: 2,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    marginTop: 10,
    width: 115,
    height: 70
  },
  vehicleTypeText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: colors.blue
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: colors.blue
  }
})

export default styles