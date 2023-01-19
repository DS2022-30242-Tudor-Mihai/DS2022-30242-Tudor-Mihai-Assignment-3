package com.project1.jrpc;

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImpl;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@AutoJsonRpcServiceImpl
public class MessageInterfaceImplementation implements MessageInterface {

    private SimpMessagingTemplate simpMessagingTemplate;
    private HashMap<String, List<TheMessageToSend>> chatHistory;

    public MessageInterfaceImplementation(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.chatHistory = new HashMap<>();
    }

    @Override
    public void sendMessage(String sender, String receiver, String message) {
        TheMessageToSend theMessageToSend = new TheMessageToSend(sender, receiver, message);
        if (chatHistory.containsKey(receiver + sender) || chatHistory.containsKey(sender + receiver)) {
            try {
                chatHistory.get(receiver + sender).add(theMessageToSend);
            } catch (Exception e) {
                chatHistory.get(sender + receiver).add(theMessageToSend);
            }
        } else {
            List<TheMessageToSend> messages = new ArrayList<>();
            messages.add(theMessageToSend);
            chatHistory.put(receiver + sender, messages);
        }
        simpMessagingTemplate.convertAndSend("/topic/chat", theMessageToSend.toString());
    }

    @Override
    public void isTyping(String sender, String receiver) {
        TheMessageToSend theMessageToSend = new TheMessageToSend(sender, receiver, sender + " is  typing...");
        simpMessagingTemplate.convertAndSend("/topic/istyping", theMessageToSend);
    }

    @Override
    public void heRead(String sender, String receiver) {
        TheMessageToSend theMessageToSend = new TheMessageToSend(sender, receiver, "The Message Was Read by " + sender);
        simpMessagingTemplate.convertAndSend("/topic/heread", theMessageToSend.toString());
    }

    @Override
    public List<TheMessageToSend> getChat(String username) {
        return this.chatHistory.get(username);
    }
}
