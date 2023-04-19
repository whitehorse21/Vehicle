import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import {colors} from '../../../colors';
import styles from './Style';

export default class FullWidthButton extends Component {
    render() {
        const props = this.props
        return (
            <TouchableOpacity 
                style={[styles.button, props.style]} 
                onPress={props.onPress}
                disabled={props.disabled || props.loading}
                activeOpacity={0.8}
            >
                {props.loading ? 
                    <ActivityIndicator color={colors.lightBlue} />
                :
                <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                {
                    this.props.appleSignin &&
                    <Image style = {{width: 25, height: 25, resizeMode: 'contain', marginHorizontal: 10}} source = {require('../../../../assets/images/apple_logo.png')}></Image>
                }
                    <Text style={styles.buttonText}>{props.buttonText.toUpperCase()}</Text>
                </View>
                }
            </TouchableOpacity>        
        );
    }
}
