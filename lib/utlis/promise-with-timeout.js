const promiseWithTimeout = (timeoutMs, promise, failureMessage) => {
    let timeoutHandle;
    const timeoutPromise = new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(failureMessage)), timeoutMs);
    });

    return Promise.race([
        promise(),
        timeoutPromise,
    ]).then((result) => {
        clearTimeout(timeoutHandle);
        return result;
    });
}

export default promiseWithTimeout;
