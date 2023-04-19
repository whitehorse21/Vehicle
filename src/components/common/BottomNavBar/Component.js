import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import {Chat} from '../../../../assets';
import styles from './Style';
import {navigateToScreen} from '../../../navigation/navigation_settings'; 

export default class BottomNavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props
        return (
            <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'ChatList')}>
                <Chat style={styles.chatIcon} />
            </TouchableOpacity>     
        );
    }
}