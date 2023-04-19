import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
  button: {
    width: 280,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
    backgroundColor: colors.aquaBlue
  },
  buttonText: {
  	fontSize: 12,
    color: colors.white,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 1
  }
});

export default styles;
