import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modalbox';
import {images} from '../../../../assets';
import { colors } from '../../../colors';
import styles from './Style';

export default class ModalBox extends Component {
  render() {
    const { props } = this;
    return (
      <Modal
        isOpen={props.displayModal}
        coverScreen={true}
        style={[styles.modal, props.style]}
        swipeToClose={false}
        backdropPressToClose={false}
        backdropOpacity={0.6}
        onClosed={props.closeModal}
        backButtonClose={true}
      >
        {props.children}
      </Modal>
    );
  }
}