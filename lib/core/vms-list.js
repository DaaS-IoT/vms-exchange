const vmsList = {};

const addRecorder = (din, vmsUri) => {
    vmsList[din] = {
        vmsUri
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

const getDinsForVmsUri = (vmsUri) => {
    const mapped = mapListByVmsUri();
    return mapped[vmsUri] ? mapped[vmsUri].dins : [];
}

module.exports = {
    addRecorder,
    removeRecorder,
    getRecorders,
    getVmsList,
    getVmsUriForDin,
    getDinsForVmsUri,
}
