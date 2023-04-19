import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../../colors';
import styles from './Style';

export default class SimpleButton extends Component {
    render() {
        const props = this.props
        return (
            <TouchableOpacity 
                style={[ styles.button, { backgroundColor: props.backgroundColor ?  props.backgroundColor : colors.aquaBlue }, props.style ]} 
                onPress={props.onPress}
                disabled={props.disabled}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </TouchableOpacity>        
        );
    }
}