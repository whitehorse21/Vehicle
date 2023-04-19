import React,{Component} from 'react';
import {View, Text, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import styles from './Style';
import SimpleButton from '../SimpleButton/Component';

export default class SelectBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedItem: props.selectedItem || undefined
		}
	}

	renderMenuItems = () => {
		const { props } = this
		return (
			<FlatList
                data={props.items}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
              	bounces={false}
            />
		)
	}

	renderItem = ({ item, index }) => {
		const { props } = this
		const { selectedItem } = this.state
		let label = item.label ? item.label : item
		let value = item.value ? item.value : item

		return (
			<TouchableOpacity activeOpacity={0.8} onPress={() => props.handleItemSelection(item)}>
				<Text style={[styles.menuItemText, { fontFamily: selectedItem === value ? 'Montserrat-SemiBold' : 'Montserrat-Regular' } ]}>
					{label}
				</Text>
			</TouchableOpacity>
		)
	}

	render() {
		const props = this.props
		const {selectedItem} = this.state
		return (
			<Modal
		        visible={props.displaySelectBox}
		        onRequestClose={props.hide}
		        supportedOrientations={['portrait']}
		        transparent
		    >
		        <TouchableWithoutFeedback onPress={props.hide}>
		          <View style={StyleSheet.absoluteFill}>
		            <View style={[styles.menuWrapper, props.style]}>
		              {this.renderMenuItems()}
		            </View>
		          </View>
		        </TouchableWithoutFeedback>
		    </Modal>
		)
	}
}