import RSocketWebSocketClient from "rsocket-websocket-client";
import {BufferEncoders, MESSAGE_RSOCKET_COMPOSITE_METADATA, RSocketClient} from "rsocket-core";

function urlFromLocation() {
    const port = window.location.port === '3000' ? `:${8080}` : `:${window.location.port}`;
    const isSecure = window.location.protocol === 'https:';
    const hostname = window.location.hostname;
    return `${isSecure ? 'wss' : 'ws'}://${hostname}${port}/rsocket`;
}

export function connect(responder, socketProblemHandler) {
    console.log("connecting");
    const socketClient = new RSocketClient({
        setup: {
            keepAlive: 30000,
            lifetime: 90000,
            dataMimeType: 'application/octet-stream',
            metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
        },
        responder: responder,
        transport: new RSocketWebSocketClient({url: urlFromLocation()}, BufferEncoders),
    });
    return new Promise((resolve, reject) => {
        socketClient.connect()
            .subscribe({
                onComplete(r) {
                    resolve(r);
                    socketProblemHandler();
                },
                onError(e) {
                    reject(e);
                    socketProblemHandler();
                }
            })
    });
}
