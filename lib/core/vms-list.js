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
        mapped[obj.vmsUri].info = obj;
    }

    return mapped;
}

const getVmsList = () => {
    const mapped = mapListByVmsUri();
    return Object.entries(mapped).map(arr => {
        const vmsUri = arr[0];
        return {
            vmsUri: vmsUri,
            active: isVmsActive(vmsUri),
            dins: arr[1].dins,
            info: arr[1].info
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

const isVmsInitialized = (din) => {
    return vmsList[din] ? vmsList[din].vmsInitialized : false;
}

const setVmsInitialized = (din, data) => {
    vmsList[din].vmsInitialized = true;
    if(data.vin) {
        vmsList[din].vin = data.vin;
    }
    if(data.vms_version) {
        vmsList[din].vmsVersion = data.vms_version;
    }
}

const setVmsActive = (din, vmsUri, status) => {
    if(webSocketList[vmsUri]) {
        webSocketList[vmsUri].vmsActive = status;
    }
}

const isVmsActive = (vmsUri) => {
    return webSocketList[vmsUri] ? webSocketList[vmsUri].vmsActive : false;
}

const isVmsActiveForDin = (din) => {
    const vmsUri = getVmsUriForDin(din);
    return webSocketList[vmsUri] ? webSocketList[vmsUri].vmsActive : false;
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
        vmsActive: false,
        webSocket: webSocket,
        onCloseCallback,
        vin: null,
        vms_version: null,
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
    isVmsInitialized,
    isVmsActive,
    setVmsInitialized,
    setVmsActive,
    isVmsActiveForDin,
    bindVmsForDin,
    unbindVmsForDin,
    getDinsForVmsUri,
    setWebSocketForVmsUri,
    unsetWebSocketForVmsUri,
    getWebSocketObjectForVmsUri,
}
