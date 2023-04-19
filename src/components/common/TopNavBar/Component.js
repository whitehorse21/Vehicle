import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';
import NetInfo from "@react-native-community/netinfo";
import {GET_NOTIFICATIONS_COUNT} from '../../../graphql/queries';
import apolloClient from '../../../graphql/client';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import styles from './Style';
import {Bar, Bell} from '../../../../assets';
import BackButton from '../BackButton/Component';

export default class TopNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            unreadNotifications: 0
        }
    }

    componentWillMount() {
        this.subscription = NetInfo.addEventListener(this.handleConnectionChange)
        this.setSubscriptionToNotificationsCount()
    }

    componentWillUnmount() {
        this.subscription && this.subscription()
        this.observableQuery && this.observableQuery.unsubscribe()
    }

    handleConnectionChange = (connectionInfo: NetInfoState) => {
        if (connectionInfo.isConnected) {
            if (this.observableQuery && this.observableQuery._state !== 'closed') {
                this.observableQuery.unsubscribe()
            }
            this.setSubscriptionToNotificationsCount()
        }
        this.setState({ isConnected: connectionInfo.isConnected })
    }

    setSubscriptionToNotificationsCount = async () => {
        try {
            this.observableQuery = apolloClient.watchQuery({
                query: GET_NOTIFICATIONS_COUNT,
                pollInterval: 500
            }).subscribe({
                next: ({ data }) => {
                    if(data) this.setState({ unreadNotifications: data.getNotificationsCount })
                },
                error: (error) => {
                    console.log(error)
                }
            })
        } catch (error) {
          console.log(error)
        }
    }

    openSideMenu = () => {
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
                left: {
                  visible: true
                }
            }
        })
    }

    render() {
        const props = this.props
        const { unreadNotifications } = this.state
        if(props.type && props.type === 'notification') {
            return (
                <View style={styles.headerWraper}>
                    <BackButton componentId = {this.props.componentId}/>
                    <TouchableOpacity style={styles.notificationIconWrapper} activeOpacity={0.8} onPress={() => props.onPress()}>
                        <Bell />
                        {unreadNotifications > 0 &&
                            <View style={[styles.badge, { width: unreadNotifications > 9 ? 22 : 20 }]}>
                                <Text style={styles.badgeText}>{unreadNotifications > 99 ? '+99' : unreadNotifications}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <View style={styles.headerWraper}>
            {
                props.type && props.type === 'side_menu' &&
                <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.8} onPress={() => this.openSideMenu()}>
                    <Bar />
                </TouchableOpacity>
            }
            {
                !(props.type && props.type === 'side_menu') &&
                <BackButton componentId = {this.props.componentId}/>
            }    
                <Text style={styles.titleText}>{props.title}</Text>
                <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'Notification')}>
                    <Bell />
                    {unreadNotifications > 0 &&
                        <View style={[styles.badge, { width: unreadNotifications > 9 ? 22 : 20, top: 14 }]}>
                            <Text style={styles.badgeText}>{unreadNotifications > 99 ? '+99' : unreadNotifications}</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>        
        );
    }
}