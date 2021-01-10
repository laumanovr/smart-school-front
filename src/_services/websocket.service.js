import SockJS from 'sockjs-client';
import webstomp from 'webstomp-client';
import ChatService from '@/_services/chat.service';
import {EventEmitter} from 'events';

export class WebSocketService {
    constructor() {
        this.subscription = '';
        this.stompClient = '';
        this.currentChannel = '';
        this.eventEmitter = new EventEmitter;
    }

    initChannelConnection(users) {
        ChatService.establishChannel(users).then((res) => {
            this.currentChannel = res.channelUuid;
            this.getChannelExistingMessages(this.currentChannel);
        }).catch((err) => {
            this.eventEmitter.emit('onError', err);
        });
    }

    getChannelExistingMessages(channel) {
        ChatService.getExistingMessages(channel).then((res) => {
            if (res._embedded) {
                this.eventEmitter.emit('oldMessages', {messages: res._embedded.chatResourceList});
            }
            if (this.subscription) {
                this.closePrevSubscription();
                this.setChatSubscription(channel);
            } else {
                this.initSocketForChat(channel);
            }
        }).catch((err) => {
            this.eventEmitter.emit('onError', err);
        });
    }

    initSocketForChat(channel) {
        const socket = new SockJS(process.env.VUE_APP_SOCKET_URL);
        this.stompClient = webstomp.over(socket);
        this.stompClient.connect({}, () => {
                this.setChatSubscription(channel);
            }, (error) => {
                console.log('Error while connecting to WebSocket', error);
                this.eventEmitter.emit('onError', error);
            }
        );
    }

    setChatSubscription(channel) {
        this.subscription = this.stompClient.subscribe(`/topic/private.chat.${channel}`, (resp) => {
            this.eventEmitter.emit('newMessage', {message: resp});
        });
    }

    sendMsgData(msgData) {
        this.stompClient.send(`/app/private.chat.${this.currentChannel}`, msgData, {});
    }

    closePrevSubscription() {
        this.subscription.unsubscribe();
        this.subscription = '';
    }

    disconnectSocket() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }
}
export default new WebSocketService();

