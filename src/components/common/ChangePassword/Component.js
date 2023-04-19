import React, {Component} from 'react';
import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import apolloClient from '../../../graphql/client';
import {CHANGE_PASSWORD} from "../../../graphql/queries";
import {images} from '../../../../assets';
import SimpleButton from '../SimpleButton/Component';
import WrongInputWarning from '../WrongInputWarning/Component';
import styles from './Style';
import {colors} from '../../../colors';
import CloseModalButton from '../CloseModalButton/Component'

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: {oldPassword: "", newPassword: "", confirmPassword: ""},
            errorText: undefined
        }
    }

    handleInput = ({ key, value }) => {
        const credentials = this.state.credentials
        credentials[key] = value
        this.setState({ credentials })
    };

    renderTextInput = (key, value, placeholder) => {
        return (
            <TextInput
                style={styles.inlineLabelTextInput}
                autoCapitalize="none"
                selectionColor={colors.blue}
                onChangeText={changedText => this.handleInput({key, value: changedText})}
                placeholder={placeholder}
                placeholderTextColor={colors.violet}
                value={value} 
                underlineColorAndroid={'transparent'}
                secureTextEntry={true}
            /> 
        )
    }

    handleChangePassword = async () => {
        const { credentials } = this.state
        if (this.validateInputs()) {
            try {
              await apolloClient.query({
                query: CHANGE_PASSWORD,
                variables: {
                  oldPassword: this.state.credentials.oldPassword,
                  newPassword: this.state.credentials.newPassword,
                },
              });
              await this.props.onPress()
            } catch (error) {
                try {
                    if(error.graphQLErrors[0].message === 'Password is incorrect') this.setState({ errorText: 'contraseña actual es incorrecta' })
                    else this.setState({ errorText: error.graphQLErrors[0].message })
                } catch (e) {
                  console.log(e);
                }
            }
        }
    }

    validateInputs = () => {
        const { credentials } = this.state
        if (credentials.oldPassword.length === 0) {
            this.setState({ errorText: 'Por favor inserte contraseña actual' })
            return false
        }
        if (credentials.newPassword.length === 0) {
            this.setState({ errorText: 'Por favor inserte nueva contraseña' })
            return false
        }
        if (credentials.confirmPassword.length === 0) {
            this.setState({ errorText: 'Por favor inserte confirmar nueva contraseña' })
            return false
        }
        if (credentials.newPassword.length < 6) {
            this.setState({ errorText: 'ingrese almenos contraseña de seis caracteres' })
            return false
        }
        if (credentials.newPassword !== credentials.confirmPassword) {
            this.setState({ errorText: 'nueva y confirme contraseña no coincide' })
            return false;
        }
        return true;
    }

    render() {
        const { credentials, errorText } = this.state
        const props = this.props
        return (
            <View style = {{flex: 1, }}>
                <CloseModalButton onPress={this.props.onClosePress}/>
                <View style={styles.container}>
                    {errorText && (
                        <WrongInputWarning warningText={errorText} />
                    )}
                    {this.renderTextInput('oldPassword', credentials.oldPassword, 'Contraseña actual')}
                    {this.renderTextInput('newPassword', credentials.newPassword, 'Nueva contraseña')}
                    {this.renderTextInput('confirmPassword', credentials.confirmPassword, 'Confirmar nueva contraseña')}
                    <View style={styles.buttonWrapper}>
                        <SimpleButton buttonText={'guardar'} onPress={() => this.handleChangePassword()} />
                    </View>
                </View>
            </View>
        )
    }
}