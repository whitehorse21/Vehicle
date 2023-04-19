import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../colors';

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  modal: {
    height: 318,
    width: windowWidth,
    backgroundColor: colors.blue
  } 
})

export default styles