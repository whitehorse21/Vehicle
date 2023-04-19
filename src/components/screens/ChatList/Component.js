import React, {Component} from "react";
import {View, Text, TouchableOpacity, TextInput, Image, Keyboard} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Navigation} from 'react-native-navigation';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import apolloClient from '../../../graphql/client';
import {GET_CHAT_ROOM_LIST} from '../../../graphql/queries';
import Spinner from '../../common/Spinner/Component';
import {getData} from '../../../storage';
import styles from './Style';
import {images} from '../../../../assets';
import { colors } from '../../../colors';

class ChatList extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	loading: true,
	    	chatUsers: [],
	    	searchText: ''
	    }
	    Navigation.events().bindComponent(this);
	}

	componentDidAppear() {
		this.getChatUsers()
  	}

  	componentDidDisappear() {
  		this.setState({ loading: true })
  	}

	getChatUsers = async () => {
		try {
	      	const result = await apolloClient.query({
	        	query: GET_CHAT_ROOM_LIST,
	        	fetchPolicy: 'no-cache'
	      	})
	      	if(result && result.data && result.data.getChatRoomList && result.data.getChatRoomList.length > 0) {	
	      		const currentUserId = JSON.parse(await getData('userId'))
	      		const chatUsers = []
	      		result.data.getChatRoomList.forEach((chatRoom) => {
		          	chatUsers.push(
		            	{
		            		roomId: chatRoom._id,
			              	userId: chatRoom.users[0]._id === currentUserId ? chatRoom.users[1]._id : chatRoom.users[0]._id,
			                name: chatRoom.users[0]._id === currentUserId ? chatRoom.users[1].name : chatRoom.users[0].name,
			                image: chatRoom.users[0]._id === currentUserId ? chatRoom.users[1].image : chatRoom.users[0].image,
			                unread: chatRoom.unread,
			                lastMessage: chatRoom.lastMessage
		            	}
		          	)
		      	}) 
		      	this.setState({ chatUsers })
	      	}
	      	this.setState({ loading: false })
	    } catch (error) {
	    	this.setState({ loading: false })
	    }
	}

	renderSerachBox = () => {
		return (
			<View style={styles.serchWrapper}> 
	        	<TextInput
	                style={styles.inlineLabelTextInput}
	                autoCapitalize="none"
	                selectionColor={colors.blue}
	                onChangeText={changedText => this.setState({searchText: changedText})}
	                placeholder={'Buscar contactos'}
	                placeholderTextColor={colors.blue}
	                value={this.state.searchText} 
	                underlineColorAndroid={'transparent'}
	            /> 
	            <Image source={images.search} style={styles.searchIcon} /> 
	        </View>
		)
	}

	renderChatUsers = () => {
		let { chatUsers, searchText } = this.state
		if(searchText && searchText.trim()) {
			chatUsers = chatUsers.filter((user) => {
				var r = new RegExp(searchText.trim(), 'i')
				return r.test(user.name)
			})
		}
		if(chatUsers && chatUsers.length > 0) {
			return (
				<KeyboardAwareScrollView 
		          	style={styles.scrollContainer}
		          	bounces={false}
		          	indicatorStyle={'white'}
		        >	
					{chatUsers.map((user, index) => (
				    	<View style={styles.rowWrapper} key={index}>
				    		{user && user.image ? 
				    			<Image source={{ uri: user.image }} style={styles.image} />
				    		:
				    			<View style={styles.imageWrapper}>
				    				<Image source={images.camera} style={styles.cameraIcon} />
				    			</View>
				    		}
				    		<TouchableOpacity style={styles.rightWrapper} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'Chat', {userId: user.userId, userName: user.name, roomId: user.roomId})}>
				    			<View style={styles.row}>
				    				<Text style={styles.nameText} numberOfLines={1} ellipsizeMode={'tail'}>{user.name}</Text>
			    					{user && user.unread > 0 && (
			    						<View style={styles.badge}>
						                	<Text style={styles.badgeText}>
						                  		{ user.unread > 99 ? '+99' : user.unread }
						                	</Text>
						              	</View>
						            )}
						        </View>
				    			<Text style={styles.description} numberOfLines={2} ellipsizeMode={'tail'}>{user.lastMessage}</Text>
							</TouchableOpacity>
				    	</View>
			    	))}
			    </KeyboardAwareScrollView>
			)
		} else {
			return (
				<View style={styles.container}>
					<Text style={styles.notFoundText}>No se encontraron usuarios</Text>
				</View>
			)
		}
	}

	goToHome = () => {
		Keyboard.dismiss()
		Navigation.popTo('Home')
	}

	render() {
		const { loading } = this.state
	  	return (
	  		<View style={styles.container}>
	  			{this.renderSerachBox()}
				{ loading ? 
					<Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} />
				:
					this.renderChatUsers()
			    }
		        <TouchableOpacity style={styles.iconWrapper} onPress={() => this.goToHome()} activeOpacity={0.8}>
		        	<Image source={images.home} resizeMode={'contain'} style={styles.homeIcon} />
		        </TouchableOpacity> 
	  		</View>
	  	);
	}
}

export default ChatList