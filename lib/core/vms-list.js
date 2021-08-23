const vmsList = {};
const webSocketList = {};

const addRecorder = (din, vmsUri, onCloseCallback = null) => {
    vmsList[din] = {
        vmsUri,
        onCloseCallback,
        bound: false,
    };
}

const removeRecorder = (din) => {
    delete vmsList[din];
}

const getRecorders = () => {
    return Object.entries(vmsList).map(arr => {
        return {
            din: arr[0],
            vmsUri: arr[1].vmsUri
        }
    });
}

const mapListByVmsUri = () => {
    const mapped = {};
    for (const [din, obj] of Object.entries(vmsList)) {
        if(mapped[obj.vmsUri] === undefined) {
            mapped[obj.vmsUri] = {
                dins: [],
            };
        }
        mapped[obj.vmsUri].dins.push(din);
    }

    return mapped;
}

const getVmsList = () => {
    const mapped = mapListByVmsUri();
    return Object.entries(mapped).map(arr => {
        return {
            vmsUri: arr[0],
            dins: arr[1].dins
        }
    });
}

const getVmsUriForDin = (din) => {
    return vmsList[din] ? vmsList[din].vmsUri : undefined;
}

const getVmsOnCloseCallbackForDin = (din) => {
    return vmsList[din] ? vmsList[din].onCloseCallback : undefined;
}

const isVmsBoundForDin = (din) => {
    return vmsList[din] ? vmsList[din].bound : false;
}

const bindVmsForDin = (din) => {
    if(vmsList[din]) {
        vmsList[din].bound = true;
    }
}

const unbindVmsForDin = (din) => {
    if(vmsList[din]) {
        vmsList[din].bound = false;
    }
}

const getDinsForVmsUri = (vmsUri) => {
    const mapped = mapListByVmsUri();
    return mapped[vmsUri] ? mapped[vmsUri].dins : [];
}

const setWebSocketForVmsUri = (vmsUri, webSocket, onCloseCallback = null) => {
    webSocketList[vmsUri] = {
        uri: vmsUri,
        timestamp: Date.now(),
        vmsInitialized: false,
        webSocket: webSocket,
        onCloseCallback,
    };
}

const unsetWebSocketForVmsUri = (vmsUri) => {
    delete webSocketList[vmsUri];
}

const getWebSocketObjectForVmsUri = (vmsUri) => {
    return webSocketList[vmsUri];
}

module.exports = {
    addRecorder,
    removeRecorder,
    getRecorders,
    getVmsList,
    getVmsUriForDin,
    getVmsOnCloseCallbackForDin,
    isVmsBoundForDin,
    bindVmsForDin,
    unbindVmsForDin,
    getDinsForVmsUri,
    setWebSocketForVmsUri,
    unsetWebSocketForVmsUri,
    getWebSocketObjectForVmsUri,
}
