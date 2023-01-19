package com.project1.jrpc;

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImpl;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@AutoJsonRpcServiceImpl
public class MessageInterfaceImplementation implements MessageInterface{

    private SimpMessagingTemplate simpMessagingTemplate;
    private HashMap<String, List<String>> chatHistory;

    public MessageInterfaceImplementation(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatHistory = new HashMap<>();
    }

    @Override
    public void sendMessage(String role, String senderUsername, String receiverUsername, String message) {
//        if (role.equals("administrator")){
//            simpMessagingTemplate.convertAndSend("/topic/chat", message);
//            return ;
//        }
//        else if (role.equals("client")){
//            return ;
//        }
//        else{
//            return null;
//        }
    }
}
