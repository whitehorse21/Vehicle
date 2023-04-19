import React, {Component} from "react";
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import { GiftedChat, Bubble, MessageText } from 'react-native-gifted-chat';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import {Navigation} from 'react-native-navigation';
import apolloClient from '../../../graphql/client';
import {GET_CHAT_ROOM_LIST, GET_CHAT_ROOM_MESSAGES} from '../../../graphql/queries';
import {ADD_CHAT_MESSAGE} from '../../../graphql/mutations';
import OfflineNotice from '../../common/OfflineNotice/Component';
import {getData} from '../../../storage';
import styles from './Style';
import { colors } from '../../../colors';
import TopNavBar from '../../common/TopNavBar/Component';
import BackButton from '../../common/BackButton/Component';

class Chat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			messages: [],
			chatRoomId: props.roomId || '',
			isConnected: true
		}
	}

	componentWillMount() {
		const {isConnected, chatRoomId} = this.state
		if (isConnected) {
			if(chatRoomId) this.setSubscriptionToChatRoom(chatRoomId)
			else this.getMessagesFromAPI()
		}
	}

	componentWillUnmount() {
	    if (this.observableQuery) {
	        this.observableQuery.unsubscribe()
	    }	    
	}

	onConnectionChanged = async (isConnected) => {
	    if (isConnected) {
	    	if (this.observableQuery && this.observableQuery._state !== 'closed') {
	      		this.observableQuery.unsubscribe()
	    	}
	      	if(this.state.chatRoomId) this.setSubscriptionToChatRoom(this.state.chatRoomId)
			else this.getMessagesFromAPI()
	    }
	    this.setState({ isConnected })
	}

	getMessagesFromAPI = async () => {
	    const currentUserId = JSON.parse(await getData('userId'))
	    const chatUsers = [this.props.userId, currentUserId]
	    try {
	      	const result = await apolloClient.query({
	        	query: GET_CHAT_ROOM_LIST,
	        	fetchPolicy: 'no-cache'
	      	})
	      	if(result && result.data && result.data.getChatRoomList && result.data.getChatRoomList.length > 0) {
		      	const { chatRoomExists, chatRoomId } = this.usersHaveAChatRoom(chatUsers, result.data.getChatRoomList)
		      	if (chatRoomExists) {
		        	this.setState({ chatRoomId })
		        	this.setSubscriptionToChatRoom(chatRoomId)
		      	}	 
	      	}
	    } catch (error) {
	     	console.log(error)
	    }
	}

	usersHaveAChatRoom = (chatUsers, chatRoomList) => {
		let chatRoomExists = false;
		let chatRoomId = '';
	    for (let i = 0; i < chatRoomList.length; i += 1) {
	     	if (
	        	(((chatUsers[0] === chatRoomList[i].users[0]._id) && (chatUsers[1] === chatRoomList[i].users[1]._id)) ||
	          	((chatUsers[0] === chatRoomList[i].users[1]._id) && (chatUsers[1] === chatRoomList[i].users[0]._id)))
	      	) {
	        	chatRoomId = chatRoomList[i]._id
	        	chatRoomExists = true
	        	break;
	      	}
	    }
		return { chatRoomExists, chatRoomId }
	}

  	setSubscriptionToChatRoom = async (chatRoomId) => {
	    try {
	      	this.observableQuery = apolloClient.watchQuery({
	        	query: GET_CHAT_ROOM_MESSAGES,
	        	variables: {
	         	 	roomId: chatRoomId
	        	},
	        	pollInterval: 500
	      	}).subscribe({
	        	next: ({ data }) => {
	        		if(data && data.getChatRoomMessages && data.getChatRoomMessages.messages) {
              			this.addMessagesFromAPI(data.getChatRoomMessages.messages)
              		}
	        	},
	        	error: (error) => {
	        		console.log(error)
	        	}
	      	})
	    } catch (error) {
	    	console.log(error)
	    }
  	}

  	addMessagesFromAPI = (messages = []) => {
    	const chatMessages = []
	    if (messages && messages.length > 0) {
	      	messages.forEach((message) => {
	          	chatMessages.push(
	            	{
		              	_id: message._id,
		                text: message.message,
		                createdAt: message.createdAt,
		                status: message.status,
		              	user: {
		                	_id:  message.creator && message.creator.creatorId === this.props.userId ? 2 : 1
		              	}
	            	}
	          	)
	      	})
	      	this.setState({ messages: GiftedChat.append([], chatMessages.reverse()) })
	    }    
  	}

  	onSend = async (message) => {
  		const { chatRoomId } = this.state
  		const data = {
  			message: message[0].text.trim(),
	        userId: this.props.userId
  		}
  		if(chatRoomId) data['roomId'] = chatRoomId
	    try {
	        const result = await this.props.addChatMessage({
	          variables: {
	            ...data
	          }
	        })
	        if(result && result.data && result.data.addMessage) {
	        	if(!chatRoomId) this.getMessagesFromAPI()
	        }
	    } catch (error) {
	      	Alert.alert('', 'Sorry, something went wrong.')
	    }
  	}

	renderBubble(props) {
	    const isPositionedLeft = props.position === "left"
	    return (
	        <View style={styles.directionView}>
	          	{isPositionedLeft && <View style={styles.leftBubbleTriangle} />}
	         	<View style={isPositionedLeft ? styles.leftBubbleWrapper : {}}>
		            <View style={styles.directionView}>
		              	<View>
			                <Bubble
			                  	{...props}
				                wrapperStyle={{
				                    left: styles.leftOtherWrapper,
				                    right: styles.rightOtherWrapper,
				                }}
			                  	containerToNextStyle={{
				                    left: styles.bottomLeftRadius,
				                    right: styles.bottomRightRadius,
			                  	}}
			                  	containerToPreviousStyle={{
				                    left: styles.topLeftRadius,
				                    right: styles.topRightRadius,
			                  	}}
			                />
		              	</View>
		              	{isPositionedLeft === false && <View style={styles.rightBubbleTriangle} />}
		            </View>
	        	</View>
	        </View>
	    );
  	}

  	renderMessageText = (props) => {
  		return (
  			<MessageText
  				{...props}
  				textStyle={{
			    	left: styles.leftText,
			    	right: styles.rightText
			   	}}
			/>
  		)
  	}

	renderSend = (props) => {
		if (props.text && props.text.trim().length > 0) {
		    return (
			    <TouchableOpacity
			        style={styles.sendBtnWrapper}
			        onPress={() => {
		                if (props.text && props.onSend) {
		                    props.onSend({ text: props.text.trim() }, true)
		                }
		            }}
			    >
			       <Text style={styles.sendIcon}>&#xf1d8;</Text>
			    </TouchableOpacity>
		    )
		}
		return <View />
	}
  

	renderGiftedChat = () => {
		return (
			<GiftedChat
				renderAvatar={null}
				messages={this.state.messages}
			    textInputProps={{ selectionColor: colors.blue }}
			    textInputStyle={styles.textInputStyle}
			    renderSend={this.renderSend}
			    onSend={message => this.onSend(message)}
			    user={{ _id: 1 }}
			    maxComposerHeight={85}
			    renderBubble={this.renderBubble}
			    renderMessageText={this.renderMessageText}
			    isAnimated={false}
		    />
		)
	}

	render() {
		const { props } = this
	    return (
	      	<View style={styles.container}>
	      		<OfflineNotice onConnectionChanged={this.onConnectionChanged} />
	      		<View style={styles.headerWrapper}>
					<View style = {{position: 'absolute', left: 0, top:0, height: '100%', justifyContent: 'center'}}>
						<BackButton componentId = {this.props.componentId}/>
					</View>
	      			<Text style={styles.headText}>{props.userName}</Text>
	      		</View>
	       		{this.renderGiftedChat()}
	       	</View>
	    );
	}
}

const withMutation = 
  	graphql(ADD_CHAT_MESSAGE, { name: 'addChatMessage' })
(Chat);

export default withMutation;