import axios from "axios";
import React, {Component} from "react";
import {} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SockJsClient from 'react-stomp';
import UserService from "../../Services/UserService";

const SOCKET_URL = 'https://localhost:8443/ws-message';
const JRPC_URL = 'https://localhost:8443/chat';

export default class WelcomeMessageComponent extends Component{ 

    constructor(props){
        super(props)
        this.state = this.initialState;
    }

    initialState = {
        users: [],
        chats: [{
            theSender: '',
            theReceiver: '',
            theMessage: '',
        }],
        selectedUser: '',
        typing: false
    }

    componentDidMount(){
        if (localStorage.getItem("username")  == null){
            window.location.href = "/error";
        }
        if (localStorage.getItem('role') === 'administrator') {
            UserService.getUsers().then((response) => {
                const filteredUsers = response.data.filter(user => user.role === 'client');
                this.setState({ users : filteredUsers });
                console.log(filteredUsers);
            });
        }
        else{
            UserService.getUsers().then((response) => {
                const filteredUsers = response.data.filter(user => user.role === 'administrator');
                this.setState({ users : filteredUsers });
                console.log(filteredUsers);
            });
        }
    }

    clearStorage = event => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        delete axios.defaults.headers.common["Authorization"];
    }

    onConnected = () => {
        console.log("Connected!!")
    }
    
    onMessageReceivedChat = (msg) => {
        let array =  this.state.chats;
        if (array !== null){
            if (array[array.length - 1].theMessage === this.state.selectedUser + ' is  typing...'){
                array.pop();
                this.setState({chats: array});
            }  
        }
        const message = JSON.parse(JSON.stringify(msg));
        if (message.theReceiver === this.state.selectedUser || message.theReceiver === localStorage.getItem('username')){
            let array =  this.state.chats;
            if (array == null){
                array = [];
            }
            array.push(message);
            this.setState({chats: array});
        }
    }

    onMessageReceivedRead = (msg) => {
        const message = JSON.parse(JSON.stringify(msg));
        if (message.theReceiver === localStorage.getItem('username')){
            alert(message.theMessage);
        }
    }

    onMessageReceivedTyping = (msg) => {
        const message = JSON.parse(JSON.stringify(msg));
        if (message.theReceiver === localStorage.getItem('username') && message.theSender === this.state.selectedUser){
            let array =  this.state.chats;
            if (array == null){
                array = [];
            }
            array.push(message);
            this.setState({chats: array});
        }
    }

    getChat = (username) =>{
        this.setState({selectedUser: username});
        if (localStorage.getItem('role') === 'administrator') {
            const toSend = {
                id: '1',
                jsonrpc: '2.0',
                method: 'getChat',
                params: {
                    username: username + localStorage.getItem('username')
                }
            }
            axios.post(JRPC_URL, toSend).then((response) => {
                this.setState({ chats : response.data.result });
                console.log(response.data);
            })
        }
        else{
            const toSend = {
                id: '1',
                jsonrpc: '2.0',
                method: 'getChat',
                params: {
                    username: localStorage.getItem('username') + username
                }
            }
            axios.post(JRPC_URL, toSend).then((response) => {
                this.setState({ chats : response.data.result });
                console.log(response.data);
            })
        }
    }

    heRead = () => {
        const toSend = {
            id: '1',
            jsonrpc: '2.0',
            method: 'heRead',
            params: {
                sender: localStorage.getItem('username'),
                receiver: this.state.selectedUser,
            }
        }
        axios.post(JRPC_URL, toSend);
    }

    sendMessage = () => {
        this.setState({
            typing: false
        });

        const toSend = {
            id: '1',
            jsonrpc: '2.0',
            method: 'sendMessage',
            params: {
                sender: localStorage.getItem('username'),
                receiver: this.state.selectedUser,
                message: this.input.value
            }
        }
        axios.post(JRPC_URL, toSend);
        this.input.value = "";
    }

    handleTyping = (event) =>{
        if(!this.state.typing){
            this.setState({typing: true});
            const toSend = {
                id: '1',
                jsonrpc: '2.0',
                method: 'isTyping',
                params: {
                    sender: localStorage.getItem('username'),
                    receiver: this.state.selectedUser,
                }
            }
            axios.post(JRPC_URL, toSend);
        }
    }

    render(){
        return (
            <div>
                {/* for taking the chat*/}
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/chat']}
                    onConnect={this.onConnected}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={msg => this.onMessageReceivedChat(msg)}
                    debug={true}
                />
                {/*for read message*/}
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/heread']}
                    onConnect={this.onConnected}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={msg => this.onMessageReceivedRead(msg)}
                    debug={true}
                />
                {/*for typing*/}
                <SockJsClient
                    url={SOCKET_URL}
                    topics={['/topic/istyping']}
                    onConnect={this.onConnected}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={msg => this.onMessageReceivedTyping(msg)}
                    debug={true}
                />
                <div className="p-5 bg-dark text-white rounded text-center">
                    <h1>Welcome to your profile page </h1>
                    <h2>{localStorage.getItem("username")} </h2>
                    <h3>
                        <Link   onClick={this.clearStorage}
                            to="/" 
                            className="btn bg-dark text-white rounded text-center"
                            style={{ textDecoration: 'underline' }}
                        >
                            Log Out
                        </Link>
                    </h3>
                </div>
                <div className="p-5 bg-dark text-white rounded text-center mt-5">
                    <div className="chat-form d-flex mx-auto" style={{textAlign: "center", width: "50%", margin: "auto"}}>
                        <div className="left-section p-2 mr-3 border border-white">
                            <h5 className="text-center mb-3">The people you can chat with</h5>
                            <ul className="list-unstyled">
                                {this.state.users.map(user => (
                                    <li key={user.username} className="border border-gray p-2 mb-2" 
                                            onClick={() => this.getChat(user.username)}>
                                        {user.username}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="right-section p-2 border border-white" style={{display: "flex", flexDirection: "column", height: "100%", width: "90%"}}>
                            {this.state.selectedUser 
                                ?   this.state.chats
                                        ?   <div className="chat-section" style={{height: "300px", background: 'white', marginBottom: '20px', color: 'black', overflow: 'auto'}}>
                                                {this.state.chats
                                                    .map((message, index) => {
                                                        const align = message.theSender === localStorage.getItem('username') ? 'right' : 'left';
                                                        return (
                                                            <div key={index} style={{textAlign: align, marginBottom: '10px'}}>
                                                                {message.theMessage}
                                                            </div>
                                                        );
                                                })}
                                            </div>
                                        :   <div style={{height: "300px", background: 'white', marginBottom: '20px', color: 'black', overflow: 'auto'}}>

                                            </div>
                                :   <div style={{background: 'gray', marginBottom: '10px'}}> 
                                        No chat was selected
                                    </div>
                            }
                            {this.state.selectedUser
                                ?   <div className="text-field-section d-flex align-items-end" style={{width: '100%'}}>
                                        <input type="text" placeholder="Type your message here" style={{marginRight: "5px", flex: "1"}} 
                                                            ref={(input) => this.input = input} onChange={(event) => this.handleTyping(event)} onFocus={() => this.heRead()}/>
                                        <button onClick={() => this.sendMessage()}>Send</button>
                                    </div>
                               :    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}