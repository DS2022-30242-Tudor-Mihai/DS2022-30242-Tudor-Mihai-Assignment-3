package com.project1.jrpc;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.googlecode.jsonrpc4j.JsonRpcService;
import java.util.List;

@JsonRpcService("chat")
public interface MessageInterface {
    void sendMessage(@JsonRpcParam(value = "sender") String sender, @JsonRpcParam(value = "receiver") String receiver, @JsonRpcParam(value = "message") String message);

    void isTyping(@JsonRpcParam(value = "sender") String sender, @JsonRpcParam(value = "receiver") String receiver);

    void heRead(@JsonRpcParam(value = "sender") String sender, @JsonRpcParam(value = "receiver") String receiver);

    List<TheMessageToSend> getChat(@JsonRpcParam(value = "username") String username);
}
