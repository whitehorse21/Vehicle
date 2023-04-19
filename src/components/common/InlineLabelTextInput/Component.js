import React, {Component} from 'react';
import {View, TextInput, Text, Image} from 'react-native';
import {colors} from '../../../colors';
import styles from './Style';
import {Lock, User, images} from '../../../../assets';

export default class InlineLabelTextInput extends Component {
    constructor(props) {
        super(props);
    }

    getIcon = () => {
        const { type } = this.props
        switch (type) {
            case 'email':
                return <Image source={images.envelope} tintColor={colors.blue} />;
            case 'password':
                return <Lock />;
            case 'name':
                 return <User />;
            default:
              return null;
        }
    }

    render() {
        const props = this.props
        return (
            <View style={styles.wrapper}>
                <View style={styles.iconWrapper}>
                   {this.getIcon()}
                </View>
                <TextInput
                    style={styles.inlineLabelTextInput}
                    autoCapitalize="none"
                    selectionColor={colors.blue}
                    onChangeText={props.onChangeText}
                    placeholder={props.placeholder}
                    value={props.value} 
                    underlineColorAndroid={'transparent'}
                    secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                    blurOnSubmit={props.blurOnSubmit}
                    ref={props.reference}
                    onSubmitEditing={props.onSubmitEditing}
                    onFocus={props.onFocus}
                /> 
            </View>          
        );
    }
}
