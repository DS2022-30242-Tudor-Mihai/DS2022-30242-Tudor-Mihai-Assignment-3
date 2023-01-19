import axios from "axios";
import React, {Component} from "react";
import {} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WelcomeMessageComponent extends Component{ 

    componentDidMount(){
        if (localStorage.getItem("username")  == null){
            window.location.href = "/error";
        }
    }

    clearStorage = event => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        delete axios.defaults.headers.common["Authorization"];
    }

    render(){
        return (
            <div>
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
                                <li className="border border-gray p-2 mb-2">UserName 1</li>
                                <li className="border border-gray p-2 mb-2">UserName 2</li>
                                <li className="border border-gray p-2 mb-2">UserName 3</li>
                            </ul>
                        </div>
                        <div className="right-section p-2 border border-white" style={{display: "flex", flexDirection: "column", height: "100%"}}>
                            <div className="chat-section" style={{height: "300px", background: 'white', marginBottom: '20px', color: 'black'}}>
                                Chat with selected user will appear here
                            </div>
                            <div className="text-field-section d-flex align-items-end" style={{width: '100%'}}>
                                <input type="text" placeholder="Type your message here" style={{marginRight: "5px", flex: "1"}}/>
                                <button>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}