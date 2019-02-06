import React, {Component} from 'react'
import {Platform,Text, View,Button, TextInput,ScrollView} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import styles from './styles'

const CHATKIT_TOKEN_PROVIDER_ENDPOINT = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/adaa48b0-8e75-432a-9517-6e1284481eb7/token';
const CHATKIT_INSTANCE_LOCATOR = 'v1:us1:adaa48b0-8e75-432a-9517-6e1284481eb7';
const CHATKIT_ROOM_ID = '19404656';
const CHATKIT_USER_NAME = 'DiscoveryOne';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component{
    constructor(props){
        super(props)
        this.state={
            messages: []
        }
    }
    componentDidMount() {
        const tokenProvider = new TokenProvider({
          url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
        });
    
        const chatManager = new ChatManager({
          instanceLocator: CHATKIT_INSTANCE_LOCATOR,
          userId: CHATKIT_USER_NAME,
          tokenProvider: tokenProvider,
        });
    
        chatManager
          .connect()
          .then(currentUser => {
            this.currentUser = currentUser;
            this.currentUser.subscribeToRoom({
              roomId: CHATKIT_ROOM_ID,
              hooks: {
                onMessage: this.onReceive,
              },
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
      onReceive = data => {
        const { id, senderId, text, createdAt } = data;
        const incomingMessage = {
          _id: id,
          text: text,
          createdAt: new Date(createdAt),
          user: {
            _id: senderId,
            name: senderId,
            avatar:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA',
          },
        };
    
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, incomingMessage),
        }));
      };
    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
      }
    render() {
      return (
        
        <View style={styles.mainContainer}>
        
         <GiftedChat style={styles.chatDiv}
         renderAvatarOnTop = {true}
         bottomOffset= {300}
         placeholder={'Please type your message here..'}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
        </View>
        
      );
    }
  }