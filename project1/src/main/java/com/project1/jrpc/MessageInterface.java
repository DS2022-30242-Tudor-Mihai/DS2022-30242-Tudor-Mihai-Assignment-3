package com.project1.jrpc;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.googlecode.jsonrpc4j.JsonRpcService;

@JsonRpcService("/chat")
public interface MessageInterface {
    void sendMessage(@JsonRpcParam(value = "role") String role, @JsonRpcParam(value = "sender") String senderUsername, @JsonRpcParam(value = "receiver") String receiverUsername, @JsonRpcParam(value = "theMessage") String message);
}
