import React, {Component} from "react";
import {View, Text, TouchableOpacity, Image} from 'react-native';
import { graphql } from 'react-apollo';
import {ADD_USER_ROLE} from '../../../graphql/mutations';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import styles from './Style';
import {colors} from '../../../colors';
import {setData} from '../../../storage';
import BackHeader from '../../common/BackHeader/Component';

class UserType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false
    }
  }

  editUserRole = async (role, screenId) => {
    // await setData('userType', role)
    //     navigateToScreen(this.props.componentId, screenId)
    this.setState({ isDisabled: true })
    try {
      const res = await this.props.addUserRole({
        variables: {
          role
        },
      });
      console.log(res)
      if(res && res.data && res.data.addUserRole) {
        await setData('userType', role)
        navigateToScreen(this.props.componentId, screenId)
      }
      this.setState({ isDisabled: false })
    } catch (error) {
      console.log("catch error", error);
      this.setState({ isDisabled: false })
    }
  }

  renderButton = (buttonText, role, screenId) => {
    return (
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.editUserRole(role, screenId)}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    )
  }

	render() {
    const { isDisabled } = this.state
  	return (
      <View style={styles.container}>
        <BackHeader screenId = {this.props.componentId}/>
        <Text style={styles.titleText}>¿Cómo deseas utilizar la app?</Text>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.editUserRole('client', 'ProfilePic')} disabled={isDisabled}>
            <Text style={styles.buttonText}>QUIERO UN VEHÍCULO PARA FLETE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.editUserRole('carrier', 'AddVehicle')} disabled={isDisabled}>
            <Text style={styles.buttonText}>QUIERO OFRECER MI VEHÍCULO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>POSEO UNA FLOTA DE VEHÍCULOS</Text>
          </TouchableOpacity>
        </View>
        {/*<Image
          source={{uri: 'https://via.placeholder.com/150'}}
          style={styles.logo}
        />*/}
  		</View>
    );
	}
}

const withMutation = graphql(ADD_USER_ROLE, { name: 'addUserRole' })(UserType)
export default withMutation