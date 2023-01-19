package com.project1.jrpc;

public class TheMessageToSend {

    private String theSender;
    private String theReceiver;
    private String theMessage;

    public TheMessageToSend(String theSender, String theReceiver, String theMessage) {
        this.theSender = theSender;
        this.theReceiver = theReceiver;
        this.theMessage = theMessage;
    }

    public String getTheSender() {
        return theSender;
    }

    public void setTheSender(String theSender) {
        this.theSender = theSender;
    }

    public String getTheReceiver() {
        return theReceiver;
    }

    public void setTheReceiver(String theReceiver) {
        this.theReceiver = theReceiver;
    }

    public String getTheMessage() {
        return theMessage;
    }

    public void setTheMessage(String theMessage) {
        this.theMessage = theMessage;
    }

    @Override
    public String toString() {
        return "{" +
                "\"theSender\":\"" + theSender + "\"" +
                ", \"theReceiver\":\"" + theReceiver + "\"" +
                ", \"theMessage\":\"" + theMessage + "\"" +
                '}';
    }
}
