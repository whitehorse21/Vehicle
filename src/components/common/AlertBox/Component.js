import React,{Component} from 'react';
import {View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import styles from './Style';

export default class AlertBox extends Component {
	render() {
		const { props } = this
		return (
			<Modal
		        visible={props.visible}
		        onRequestClose={props.closeAlert}
		        supportedOrientations={['portrait']}
		        transparent
		    >
		    	<TouchableWithoutFeedback onPress={props.closeAlert}>
		          	<View style={styles.container}>
		            	<View style={styles.messageWrapper}>
		            		<Text style={styles.messageText}>{props.message}</Text>
		            	</View>
				        <View style={styles.buttonContainer}>
				          <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={props.closeAlert}>
				            <Text style={styles.cancelButtonText}>Cancel</Text>
				          </TouchableOpacity>
				          <TouchableOpacity style={styles.okButton} activeOpacity={0.8} onPress={props.onPress}>
				            <Text style={styles.okButtonText}>Remove</Text>
				          </TouchableOpacity>
				        </View>
		            </View>
		        </TouchableWithoutFeedback>
		    </Modal>
		)
	}
}