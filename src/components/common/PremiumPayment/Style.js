import { StyleSheet } from 'react-native';
import { colors } from '../../../colors';
import {shadow} from '../../../common_style';

const styles = StyleSheet.create({
  modalContentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 20,
    color: colors.blue,
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.80
  },
  priceText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: colors.blue,
    marginTop: 5,
    marginBottom: 10
  },
  imageStyle: {
    height: 55,
    width: 60
  },
  textInputStyle: {
    height: 38,
    width: 230,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: 'transparent',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: colors.aquaBlue,
    paddingHorizontal: 15,
    borderRadius: 32,
    borderColor: colors.aquaBlue,
    borderWidth: 1
  },
});

export default styles;
