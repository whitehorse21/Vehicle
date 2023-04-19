import React, {Component} from "react";
import ReactNative, {View, Text, Image, TouchableOpacity, findNodeHandle, Keyboard, Platform} from 'react-native';
import {connect} from "react-redux";
import { ApolloConsumer } from "react-apollo";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import {AUTH_USER, FACEBOOK_LOGIN} from "../../../graphql/queries";
import styles from './Style';
import InlineLabelTextInput from '../../common/InlineLabelTextInput/Component';
import FullWidthButton from '../../common/FullWidthButton/Component';
import WrongInputWarning from '../../common/WrongInputWarning/Component';
import {navigateToScreen, startSingleScreenApp, startInitialisation} from '../../../navigation/navigation_settings';
import {setData, setMultipleData} from '../../../storage';
import {Logo} from '../../../../assets';
import { getDeviceToken } from '../../../notifications';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {email: "", password: ""},
      errorText: undefined,
      isDisabled: false
    };
  }
	
  handleInput = ({ key, value }) => {
    const credentials = this.state.credentials
    credentials[key] = value
    this.setState({ credentials })
  }

  handleLogin = async (client) => {
    this.setState({ isDisabled: true })
    if (this.validateInputs()) {
      Keyboard.dismiss()
      const deviceToken = getDeviceToken()
      const authData = {
        email: this.state.credentials.email.trim(),
        password: this.state.credentials.password
      }
      if(deviceToken) authData['deviceToken'] = deviceToken
      try {
        const { data } = await client.query({
          query: AUTH_USER,
          variables: { ...authData },
          fetchPolicy: 'no-cache'
        });
        if(data && data.authUser) {
           this.onLoginSuccess(data.authUser)
        }       
        this.setState({ isDisabled: false })
      } catch (error) {
        this.setState({ errorText: 'Credenciales no válidas', isDisabled: false });
      }
    } else { this.setState({ isDisabled: false })}
  }

  handleFacebookLogin = async (client, token) => {
    this.setState({ isDisabled: true })
    try {
      const { data } = await client.query({
        query: FACEBOOK_LOGIN,
        variables: {
          token
        },
        fetchPolicy: 'no-cache'
      });
      console.log('handleFacebookLogin FFFFFF = ', data);
      if(data && data.facebookLogin) {
        this.onLoginSuccess(data.facebookLogin)
      }       
      this.setState({ isDisabled: false })
    } catch (error) {
      console.log('handleFacebookLogin error = ', error.message);
      try {
        this.setState({ errorText: this.errorMap(error.graphQLErrors[0].message), isDisabled: false });
      } catch (e) {
        this.setState({ errorText: 'No puedes ingresar', isDisabled: false });
      }
    }
  }

  errorMap = (error) => {
    if(error === 'Email already exists. [403]') return 'Correo electrónico ya existe';
    else return 'No puedes ingresar';
  }

  onLoginSuccess = async (data) => {
    console.log("login response data", JSON.stringify(data))
    const keyValuePairs = [
      ['userId', data._id],
      ['token', data.token],
      ['username', data.username]
    ]
    await setMultipleData(keyValuePairs)
    if(data && data.email) await setData('email', data.email)
    if(data && data.role) {
      await setData('userType', data.role)
      if(data.role === 'carrier') {
        if(data.vehical) {
          await setData('userVehicle', data.vehical)
          startInitialisation()
        } else {
          startSingleScreenApp('AddVehicle')
        }
      } else {
        startInitialisation()
      }
    } else {
      startSingleScreenApp('UserType')
    }
  }

  validateInputs = () => {
    const { credentials } = this.state
    if (credentials.email.trim().length === 0) {
      this.setState({ errorText: 'Por favor ingrese correo electrónico' })
      return false
    }
    if (credentials.password.length === 0) {
      this.setState({ errorText: 'Por favor ingrese contraseña' })
      return false
    }
    return true
  }

  scrollToInput (reactNode: any) {
    this.scroll?.props?.scrollToFocusedInput(reactNode)
  }

  loginWithFacebook = (client) => {
    const instance = this
    LoginManager.logOut()
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    console.log('LoginManager = ', LoginManager);
    LoginManager.logInWithPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log('Login success');
          AccessToken.getCurrentAccessToken()
            .then((data) => {
              console.log('current AccessToken = ', data);
              instance.handleFacebookLogin(client, data.accessToken)
            })
            .catch(error => {
              console.log('current AccessToken = ', error.message);
              console.log(error)
              this.setState({ errorText: 'incapaz de iniciar sesión' });
            })
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
        this.setState({ errorText: 'No puede ingresar' });
      }
    )
  }

  loginWithApple = async(client) => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    if (credentialState === appleAuth.State.AUTHORIZED) {
      console.log("11111111", " signin successed ")
      alert("apple login is succecced")
    } else {
      console.log("11111111", " signin failed ")
    }
  }

	render() {
    const { credentials, errorText, isDisabled } = this.state
   
  	return (
      <ApolloConsumer>
        {client => (
    		<View style={styles.container}>
          <KeyboardAwareScrollView 
            contentContainerStyle={styles.keyboardAvoidingContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            innerRef={ref => { this.scroll = ref }}
            keyboardShouldPersistTaps={'always'}
          >
            <View style={styles.logo} >
              <Logo width={127} height={127} />
            </View>
            {errorText && (
              <WrongInputWarning warningText={errorText} />
            )}
            <InlineLabelTextInput
              value={credentials.email}
              onChangeText={changedText => this.handleInput({key: "email", value: changedText})}
              placeholder={'Correo electrónico'}
              reference={(input) => { this.email = input }}
              blurOnSubmit={false}
              onSubmitEditing={() => this.password.focus()}
              onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
              type={'email'}
            />
            <InlineLabelTextInput
              secureTextEntry
              value={credentials.password}
              onChangeText={changedText => this.handleInput({key: "password", value: changedText})}
              placeholder={'Contraseña'}
              reference={(input) => { this.password = input }}
              blurOnSubmit={true}
              onSubmitEditing={() => this.handleLogin(client)}
              onFocus={(event: Event) => { this.scrollToInput(ReactNative.findNodeHandle(event.target)) }}
              type={'password'}
            />
            <FullWidthButton 
              buttonText={'login'}
              onPress={() => this.handleLogin(client)}
              disabled={isDisabled}
            />
            <FullWidthButton 
              buttonText={'facebook login'}
              onPress={() => this.loginWithFacebook(client)}
              style={styles.button}
              disabled={isDisabled}
            />
          {
            Platform.OS == "ios" &&
            <FullWidthButton 
              buttonText={'Sign in With Apple'}
              onPress={() => this.loginWithApple(client)}
              style={{backgroundColor: 'black'}}
              disabled={isDisabled}
              appleSignin = {true}
            />
          }
            <Text style={styles.registerTitleText}>¿Aún no estas registrado?</Text>
            <TouchableOpacity onPress={() => navigateToScreen(this.props.componentId, 'Register')} activeOpacity={0.6}>
              <Text style={styles.registersubTitleText}>Registrarme</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
    		</View>
      )}
      </ApolloConsumer>
  	);
	}
}

export default Login
