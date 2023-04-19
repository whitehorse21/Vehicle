import React, {Component} from "react";
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from "moment";
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import apolloClient from '../../../graphql/client';
import {REMOVE_USER, EDIT_USER_MUTATION} from '../../../graphql/mutations';
import {USERS_LIST} from '../../../graphql/queries';
import styles from './Style';
import {colors} from '../../../colors';
import {images, Camera} from '../../../../assets';
import Spinner from '../../common/Spinner/Component';
import Toast from '../../common/Toast/Component';
import InformationBar from '../../common/InformationBar/Component';
import ModalBox from '../../common/ModalBox/Component';
import SelectBox from '../../common/SelectBox/Component';
import AlertBox from '../../common/AlertBox/Component';
import {validateEmail} from '../../../utils/validators';
import CloseModalButton from '../../common/CloseModalButton/Component'

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      searchText: '',
      activeTab: 'client',
      displayModal: false,
      selectedUser: {id: '', username: '', email: '', image: '', role: '', registrationDate: '', carrierType: ''},
      displaySelectBox: false,
      selectBoxTop: 0,
      selectBoxLeft: 0,
      loading: true,
      displayAlert: false
    }
    Navigation.events().bindComponent(this);
  }
	
  componentDidAppear() {
    this.setUsersList()
  }

  setUsersList = async () => {
    try {
      this.setState({ loading: true });
      const resultList = await apolloClient.query({
        query: USERS_LIST,
        variables: {
          role: this.state.activeTab,
          search: this.state.searchText
        },
        fetchPolicy: 'no-cache'
      })
      if (resultList && resultList.data && resultList.data.getAllUsers) {
        this.setState({ users: resultList.data.getAllUsers })
      }
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  editUser = async () => {
    const { selectedUser } = this.state
    let userInfo = {
      username: selectedUser.username,
      email: selectedUser.email,
      userId: selectedUser.id
    }
    if(selectedUser.role && selectedUser.role === 'carrier' && selectedUser.carrierType) {
      userInfo['carrierType'] = selectedUser.carrierType
    }
    if (this.validateInputs()) {
      try {
        const result = await this.props.editUser({
          variables: userInfo
        });
        if (result && result.data && result.data.editUser) {
          const updatedUserList = this.state.users.map(user => {
            if(user._id === selectedUser.id) return result.data.editUser
            return user
          })
          await this.setState({users: updatedUserList, displayModal: false})
          await this.refs.toast.show('User updated successfully')
        }
      } catch (error) {
        await this.setState({displayModal: false})
        await this.refs.toast.show('Cannot update user details')
      }
    }
  }

  removeUser = async () => {
    const { selectedUser } = this.state
    try {
      const isRemoved = await this.props.removeUser({
        variables: {
          userId: selectedUser.id
        }
      });
      if(isRemoved) {
        const updatedUserList = this.state.users.filter((user) => {
          return user._id !== selectedUser.id
        })
        await this.setState({users: updatedUserList, displayAlert: false, displayModal: false})
        await this.refs.toast.show('User removed successfully')
      }
    } catch (error) {
      await this.setState({displayAlert: false, displayModal: false})
      await this.refs.toast.show('Cannot remove user')
    }
  }

  validateInputs = () => {
    const { selectedUser } = this.state
    if (selectedUser.username.trim().length === 0) {
      this.refs.errorMsgToast.show('Please insert username')
      return false
    }
    if (!validateEmail(selectedUser.email.trim())) {
      this.refs.errorMsgToast.show(selectedUser.email.length > 0 ? 'Invalid email' : 'Please insert email')
      return false
    } 
    return true
  }

  openModal = (user) => {
    const selectedUser = {
      id: user._id, 
      username: user && user.username ? user.username : '', 
      email: user && user.email ? user.email : '', 
      image: user && user.profile && user.profile.image ? user.profile.image : undefined,
      role: user && user.roles ? user.roles : '',
      registrationDate: user && user.createdAt ? user.createdAt : '',
      carrierType: user && user.profile && user.profile.carrierType ? user.profile.carrierType : ''
    }
    this.setState({ selectedUser, displayModal: true })
  }

  closeModal = () => {
    this.setState({ displayPicker: false, displayAlert: false, displayModal: false })
    this.setState({ selectedUser: {id: '', username: '', email: '', image: '', role: '', registrationDate: '', carrierType: ''} })
  }

  renderModal = () => {
    const {type, selectedUser, displaySelectBox, selectBoxTop, selectBoxLeft, displayAlert} = this.state
      return (
        <ModalBox
          displayModal={this.state.displayModal}
          closeModal={() => this.closeModal()}
        >
          <View style={{flex: 1}}>
            <CloseModalButton onPress={() => this.closeModal()}/>
            <View style={styles.modalContentView}>
              <View style={styles.infoWrapper}>
                <View style={styles.leftWrapper}>
                  {selectedUser.image ?
                    <Image source={{ uri: selectedUser.image }} style={styles.avtar} />
                  :
                    <View style={styles.avtarWrapper}>
                      <Camera />
                    </View>
                  }
                  <Text style={styles.text}>Fecha de registro</Text>
                  <Text style={styles.text}>{moment(selectedUser.registrationDate).format('DD / MM / YYYY')}</Text>
                </View>
                <View>
                  <Text style={styles.text}>Nombre de usuario</Text>
                  {this.renderTextInput('username', selectedUser.username)}
                  <Text style={styles.text}>Correo electrónico</Text>
                  {this.renderTextInput('email', selectedUser.email)}
                  {(selectedUser.role === 'carrier' || selectedUser.role === 'agent') && (
                    <View>
                      <Text style={styles.text}>Tipo de usuario</Text>
                      <TouchableOpacity style={styles.pickerButton} activeOpacity={0.8} onPress={() => this.openSelectBox()}>
                        <Text style={styles.pickerText}>{selectedUser.carrierType ? selectedUser.carrierType : 'Tipo de usuario'}</Text>
                      </TouchableOpacity>
                      <View ref={elm => this.selectBox = elm} collapsable={false}>
                        {displaySelectBox && 
                          <SelectBox 
                            items={[{label: 'Free', value: 'free'}, {label: 'Premium', value: 'premium'}]}
                            displaySelectBox={displaySelectBox} 
                            style={[styles.pickerStyle, { top: selectBoxTop, left: selectBoxLeft }]} 
                            selectedItem={selectedUser.carrierType}
                            handleItemSelection={(selectedType) => this.handleTypeSelection({key: 'carrierType', value: selectedType.value})}
                            hide={() => this.setState({displaySelectBox: false})} 
                          />
                        }
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.wrapper}>
                <TouchableOpacity activeOpacity={0.8} style={styles.saveButton} onPress={() => this.editUser()}>
                  <Text style={styles.buttonText}>GUARDAR</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.removeButton} onPress={() => this.setState({ displayAlert: true })}>
                  <Text style={styles.buttonText}>ELIMINAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Toast ref="errorMsgToast" position={'top'} positionValue={270} />
          {displayAlert && this.renderAlert()}
        </ModalBox>
      )
  }

  renderAlert = () => {
    return (
      <AlertBox
        visible={this.state.displayAlert}
        closeAlert={() => this.setState({ displayAlert: false })}
        message={'Are you sure you want to delete this user?'}
        onPress={() => this.removeUser()}
      />
    )
  }

  openSelectBox = () => {
    this.selectBox.measureInWindow((x, y) => {
      this.setState({ selectBoxTop: y + 5, selectBoxLeft: x, displaySelectBox: true });
    });
  }

  handleTypeSelection = ({key, value}) => {
    this.handleInputChange({key, value})
    this.setState({ displaySelectBox: false })
  }

  renderTextInput = (key, value) => {
    return (
      <TextInput
        style={styles.inlineLabelTextInput}
        autoCapitalize="none"
        selectionColor={colors.white}
        onChangeText={value => this.handleInputChange({key, value})}
        value={value} 
        underlineColorAndroid={'transparent'}
      /> 
    )
  }

  handleInputChange = ({ key, value }) => {
    const selectedUser = this.state.selectedUser
    selectedUser[key] = value
    this.setState({ selectedUser })
  };

  handleSearchInputChange = async (searchText) => {
    await this.setState({searchText})
    this.setUsersList()
  }

  renderSearchBox = () => {
    return (
      <View style={styles.searchWrapper}> 
        <TextInput
          style={styles.searchTextInput}
          autoCapitalize="none"
          selectionColor={colors.blue}
          onChangeText={changedText => this.handleSearchInputChange(changedText)}
          placeholder={'Buscar contactos'}
          placeholderTextColor={colors.blue}
          value={this.state.searchText} 
          underlineColorAndroid={'transparent'}
        /> 
        <Image source={images.search} style={styles.searchIcon} /> 
      </View>
    )
  }

  renderTab = (tabText, userType) => {
    const { activeTab } = this.state
    return (
      <TouchableOpacity disabled={activeTab === userType ? true : false} activeOpacity={0.8} onPress={() => this.handleTabChanged(userType)}>
        <Text style={[styles.tabText, { color: activeTab === userType ? colors.white : colors.aquaBlue }]}>{tabText}</Text>
      </TouchableOpacity>
    )
  }

  handleTabChanged = async (userType) => {
    await this.setState({activeTab: userType})
    this.setUsersList()
  }

  renderUsers = () => {
    const {users, activeTab} = this.state
    if(users &&  users.length > 0) {
      return (
        <KeyboardAwareFlatList
          keyExtractor={(user, index) => index.toString()}
          data={this.state.users}
          extraData={this.state}
          style={styles.flatList}
          containerStyle={styles.containerStyle}
          renderItem={user => this.renderUser(user)}
          indicatorStyle={'white'}
          bounces={false}
        />
      )
    } else {
      return <Text style={styles.notFoundText}>No {activeTab} users found</Text>
    }
  }

  renderUser = ({item, index}) => {
    return (
      <View style={styles.rowWrapper} key={index}>
        { item && item.profile && item.profile.image ?
          <Image source={{ uri: item.profile.image }} style={styles.image} />
        :
          <View style={styles.imageWrapper}>
            <Camera />
          </View>
        }
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.openModal(item)}>
          <Text style={styles.nameText} numberOfLines={1} ellipsizeMode={'tail'}>{item.username}</Text>
        </TouchableOpacity>
      </View>
    )
  }

	render() {
    const {loading} = this.state
  	return (
  		<View style={styles.container}>
        <InformationBar titleText={'USUARIOS'} />
        {this.renderSearchBox()}
        <View style={styles.tabWrapper}>
          {this.renderTab('clientes', 'client')}
          {this.renderTab('transportistas', 'carrier')}
          {this.renderTab('agentes', 'agent')}
        </View>
        {loading ? 
          <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} />  
        :
          this.renderUsers()
        }
        <TouchableOpacity style={styles.iconWrapper} onPress={() => Navigation.popTo('Home')} activeOpacity={0.8}>
          <Image source={images.home} resizeMode={'contain'} style={styles.homeIcon} />
        </TouchableOpacity> 
        <Toast ref="toast" />
        {this.renderModal()}
      </View>
  	);
	}
}

// const withMutation = compose(
//   graphql(REMOVE_USER, { name: 'removeUser' }),
//   graphql(EDIT_USER_MUTATION, { name: 'editUser' })
// )(Users);
const withMutation = compose(
  graphql(REMOVE_USER, { name: 'removeUser' }),
  graphql(EDIT_USER_MUTATION, { name: 'editUser' })
)(Users);
export default withMutation;