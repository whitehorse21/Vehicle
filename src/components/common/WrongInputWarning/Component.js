import React from 'react';
import { View, Image, Text } from 'react-native';
import {images} from '../../../../assets';
import styles from './Style';

const WrongInputWarning = ({warningText, style}) => {
  return (
    <View style={[styles.warningWrapper, style]}>
        <Image style={styles.wraningIcon} source={images.warning} />
        <Text style={styles.errorText}>{warningText}</Text>
     </View>
  );
};

export default WrongInputWarning;