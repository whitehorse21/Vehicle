import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';
import {shadow} from '../../../common_style';

const styles = StyleSheet.create({
  button: {
    width: 170,
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
    ...shadow
  },
  buttonText: {
  	fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
});

export default styles;
