import React, {Component} from "react";
import ReactNative, {View, Text, TouchableOpacity, TextInput, Image, FlatList, findNodeHandle} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import apolloClient from '../../../graphql/client';
import {ADD_NOTIFICATION} from '../../../graphql/mutations';
import {GET_NOTIFICATIONS} from '../../../graphql/queries';
import styles from './Style';
import { colors } from '../../../colors';
import {images} from '../../../../assets';
import Spinner from '../../common/Spinner/Component';
import InformationBar from '../../common/InformationBar/Component';
import SelectBox from '../../common/SelectBox/Component';
import Toast from '../../common/Toast/Component';
import moment from "moment";

class CreateNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      notifications: [],
      notification: {title: '', recipients: 'client', detail: ''},
      displaySelectBox: false,
      selectBoxTop: 0
    }
    Navigation.events().bindComponent(this);
  }

  componentDidAppear() {
    this.fetchNotifications()
  }

  fetchNotifications = async () => {
    try {
      this.setState({ loading: true })
      const resultList = await apolloClient.query({
        query: GET_NOTIFICATIONS,
        fetchPolicy: 'no-cache'
      })
      if (resultList && resultList.data && resultList.data.getNotifications) {
        this.setState({ notifications: resultList.data.getNotifications })
      }
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  sendNotification = async () => {
    if (this.validateInputs()) {
      const { notification } = this.state
      try {
        const result = await this.props.sendNotification({
          variables: {
            title: notification.title,
            detail: notification.detail,
            role: notification.recipients
          }
        });
        if (result && result.data && result.data.addNotification) {
          const { notifications } = this.state
          notifications.push(result.data.addNotification)
          await this.setState({ notifications, notification: {title: '', recipients: 'client', detail: ''} })
          this.refs.toast.show('Notification send successfully')
          setTimeout(() => {this.flatList.scrollToEnd()}, 100)
        }
      } catch (error) {
        console.log(error)
        this.refs.toast.show('Cannot send notification')
      }
    }
  }

  validateInputs = () => {
    const { notification } = this.state
    if(notification.title.trim().length === 0) {
      this.refs.toast.show('Please insert title')
      return false
    }
    if(notification.detail.trim().length === 0) {
      this.refs.toast.show('Please insert detail')
      return false
    }
    return true
  }

  cancelNotification = () => {
    this.setState({ notification: {title: '', recipients: 'client', detail: ''} })
  }

  handleInputChange = ({ key, value }) => {
    const notification = this.state.notification
    notification[key] = value
    this.setState({ notification })
  }

  renderNotificationHistory = () => {
    if(this.state.notifications && this.state.notifications.length > 0) {
      return (
        <FlatList
          ref={elm => this.flatList = elm}
          keyExtractor={(notification, index) => index.toString()}
          data={this.state.notifications}
          extraData={this.state}
          style={styles.flatList}
          renderItem={notification => this.renderNotification(notification)}
          indicatorStyle={'white'}
          bounces={false}
          nestedScrollEnabled={true}
        />
      )
    } else {
      return <Text style={styles.notFoundText}>No notifications found</Text>
    }
  }

  renderNotification = ({item, index}) => {
    return (
      <View style={[styles.notificationView , {marginTop: index == 0 ? 0 : 10}]}>
        <Text 
          style={styles.infoText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
        >
          {moment(item.createdAt).format('DD/MM')}  {item.title} - {this.getRole(item.role)}
        </Text>
      </View>
    )
  }

  openSelectBox = () => {
    this.selectBox.measureInWindow((x, y) => {
      this.setState({ selectBoxTop: y + 5, displaySelectBox: true });
    });
  }

  handleUserTypeSelection = ({key, value}) => {
    this.handleInputChange({key, value})
    this.setState({ displaySelectBox: false })
  }

  getRole = (role) => {
    switch (role) {
      case 'client':
        return 'clientes'
        break;
      case 'carrier':
        return 'transportistas'
        break;
      case 'agent':
        return 'agentes'
        break;
      case 'all':
        return 'todos los usuarios'
        break;
      default:
        return null
        break;
    }
  }

  scrollToInput (reactNode: any) {
    this.scroll?.props?.scrollToFocusedInput(reactNode)
  }

  render() {
    const { loading, notification, displaySelectBox, selectBoxTop } = this.state
    return (
      <View style={styles.container}>
        <InformationBar titleText={'NOTIFICACIONES'} />
        <KeyboardAwareScrollView 
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          innerRef={ref => { this.scroll = ref }}
        >
          <View>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>Historial</Text>
            </View>
            <View style={styles.notificationWrapper}>
            {loading ? 
              <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} /> 
            : 
              this.renderNotificationHistory()
            }
            </View>
          </View>
          <View style={styles.addNotificationWrapper}>
            <Text style={styles.titleText}>CREAR NUEVA NOTIFICACION</Text>
            <View style={styles.wrapper}>
              <Text style={styles.text}>Título</Text>
              <TextInput
                style={styles.titleTextInput}
                autoCapitalize="none"
                selectionColor={colors.white}
                onChangeText={value => this.handleInputChange({key: 'title', value})}
                value={notification.title} 
                underlineColorAndroid={'transparent'}
                blurOnSubmit={false}
                onSubmitEditing={() => this.detail.focus()}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
              /> 
            </View>
            <View style={styles.wrapper}>
              <Text style={styles.text}>Destinatarios</Text>
              <TouchableOpacity style={styles.picker} activeOpacity={0.8} onPress={() => this.openSelectBox()}>
                <Text style={styles.pickerText}>{this.getRole(notification.recipients)}</Text>
                <Image source={images.downArrow} resizeMode={'contain'} style={[styles.arrowIcon, { transform: [{ rotate: displaySelectBox ? '180deg' : '0deg' }] }]} />
              </TouchableOpacity>  
              <View ref={elm => this.selectBox = elm} collapsable={false}>
                {displaySelectBox && 
                  <SelectBox 
                    items={[
                      {label: 'Clientes', value: 'client'}, 
                      {label: 'Transportistas', value: 'carrier'},
                      {label: 'Agentes', value: 'agent'},
                      {label: 'Todos los usuarios', value: 'all'}
                    ]}
                    displaySelectBox={displaySelectBox} 
                    style={{ top: selectBoxTop, width: '65%' }} 
                    selectedItem={notification.recipients}
                    handleItemSelection={(selectedItem) => this.handleUserTypeSelection({key: 'recipients', value: selectedItem.value})}
                    hide={() => this.setState({displaySelectBox: false})} 
                  />
                }
              </View>
            </View>
            <Text style={styles.bodyTitleText}>Cuerpo</Text>
            <View style={styles.bodyWrapper}>
              <TextInput
                style={styles.msgTextInput}
                autoCapitalize="none"
                selectionColor={colors.white}
                onChangeText={value => this.handleInputChange({key: 'detail', value})}
                value={notification.detail} 
                underlineColorAndroid={'transparent'}
                multiline={true}
                ref={(input) => { this.detail = input }}
                onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
              /> 
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity activeOpacity={0.8} style={styles.sendButton} onPress={() => this.sendNotification()}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.cancelButton} onPress={() => this.cancelNotification()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Toast ref="toast" positionValue={110} />
        </KeyboardAwareScrollView>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => Navigation.popTo('Home')} activeOpacity={0.8}>
          <Image source={images.home} resizeMode={'contain'} style={styles.homeIcon} />
        </TouchableOpacity> 
      </View>
    );
  }
}

const withMutation = compose(
  graphql(ADD_NOTIFICATION, { name: 'sendNotification' })
)(CreateNotification);

export default withMutation;