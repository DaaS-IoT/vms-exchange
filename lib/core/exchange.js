// import WebSocket from "ws";
const WebSocket = require('ws');
const { promiseWithTimeout } = require('../utlis/promise-with-timeout');
// import promiseWithTimeout from "../utlis/promise-with-timeout";
const {
    bindVmsForDin,
    getVmsUriForDin,
    getWebSocketObjectForVmsUri,
    isVmsBoundForDin,
    setWebSocketForVmsUri, unbindVmsForDin,
    unsetWebSocketForVmsUri
} = require("./vms-list");

const getWebSocketForDin = async (din, webSocket, timeout = 1000, retries = 0, reconnectionTimeout = 60000, forceRefresh = false) => {
    const wsUri = getVmsUriForDin(din);
    return new Promise((resolve, reject) => {
        if(!wsUri) {
            reject({error: 'invalid web socket url'});
            return;
        }

        let webSocketObject = getWebSocketObjectForVmsUri(wsUri);
        if(!forceRefresh && webSocketObject && webSocketObject.timestamp) {
            if(webSocketObject.webSocket || Date.now() - webSocketObject.timestamp < reconnectionTimeout) {
                resolve(webSocketObject.webSocket);
                return;
            }
        }

        if(forceRefresh && webSocketObject && webSocketObject.webSocket) {
            //      webSocketObject.webSocket.close();
            unsetWebSocketForVmsUri(wsUri);
        }

        try {
            setWebSocketForVmsUri(wsUri, new WebSocket(wsUri, {
                handshakeTimeout: timeout
            }))
            // warn: from here
            // if(this.recorderVmsList[recorder.id]) {
            //     this.recorderVmsList[recorder.id].updateVms(this.vmsList[wsUri]);
            // } else {
            //     this.recorderVmsList[recorder.id] = new RecorderVmsElementModel(recorder, this.vmsList[wsUri]);
            // }
        } catch (err) {
            reject(err);
            return;
        }

        webSocketObject = getWebSocketObjectForVmsUri(wsUri);
        webSocketObject.webSocket.onopen = () => {
            resolve(webSocketObject.webSocket);
        };
        webSocketObject.webSocket.onclose = (/*closeEvent*/) => {
            webSocketObject.webSocket = null;
            // this.recorderVmsList[recorder.id].updateVms(this.vmsList[wsUri]);


            // // warn: maybe restore this
            // const event = new EventModel('vamp:vms-disconnected', {
            //     uri: wsUri,
            // });
            // this.eventDispatcherService.dispatchEvent(event);
        };
        webSocketObject.webSocket.onmessage = (evt) => {
            console.log("Message received :", evt.data);
        };
        webSocketObject.webSocket.onerror = (evt) => {
            webSocketObject.webSocket = null;
            // this.recorderVmsList[recorder.id].updateVms(this.vmsList[wsUri]);
            reject(evt.message);
        }
    });
}

const bindRecorder = async (din) => {
    if(isVmsBoundForDin(din)) {
        return;
    }
    const command = {
        'command': 'bind_device',
        'object': {
            din,
            // 'session_id': this.vmsService.getVmsSessionId(recorder),
        }
    };

    try {
        const response = await sendMessage(din, command);
        bindVmsForDin(din);
        return response;
    } catch (error) {
        throw error;
    }
}

const unbindRecorder = async (din) => {
    if(!isVmsBoundForDin(din)) {
        return;
    }
    const command = {
        'command': 'unbind_device',
        'object': {
            din,
            // 'session_id': this.vmsService.getVmsSessionId(recorder),
        }
    };

    try {
        const response = await sendMessage(din, command);
        unbindVmsForDin(din);
        return response;
    } catch (error) {
        throw error;
    }
}

const sendMessage = async (din, message) => {
    if(typeof message !== 'string') {
        message = JSON.stringify(message);
    }
    let webSocket = null;
    try {
        webSocket = await getWebSocketForDin(din, null);
    } catch (error) {
        // handle/log error
    }

    return promiseWithTimeout(1000, () => {
        return new Promise((resolve, reject) => {
            if(!webSocket) {
                reject({error: 'no socket available for din: ' + din});
                return;
            }
            webSocket.onmessage = (evt) => {
                const data = JSON.parse(evt.data);
                resolve(data.object);
            }
            webSocket.onerror = (evt) => {
                reject(evt);
            }
            webSocket.send(message);
        });
    }, 'timed out while sending message to vms for din ' + din);
}

module.exports = {
    bindRecorder,
    unbindRecorder,
    sendMessage,
}
