import {encodeCompositeMetadata, encodeRoute, MESSAGE_RSOCKET_ROUTING} from "rsocket-core";
import {connect} from "./RSocket";
import {Game as G} from "../generated/sources/flatbuffers/js/main/com/homich/data/game";
import {Builder, ByteBuffer} from "flatbuffers";
import {PlayerScore} from "../generated/sources/flatbuffers/js/main/com/homich/data/player-score";


export default class APIClient {
    constructor(rsocket) {
        this.rsocket = rsocket;
    }

    login(userName, role, socketProblemHandler) {
        return new Promise((resolve, reject) => {
                const builder = new Builder()
                const playerScore = PlayerScore.createPlayerScore(
                    builder,
                    builder.createString(''),
                    builder.createString(userName),
                    builder.createString(role),
                    builder.createString("")
                );
                builder.finish(playerScore);
                const bytes = builder.asUint8Array();
                this.rsocket.requestResponse({
                    metadata: encodeCompositeMetadata([
                        [MESSAGE_RSOCKET_ROUTING, encodeRoute('game.players.login')],
                    ]),
                    data: Buffer.from(bytes)
                }).subscribe({
                    onComplete: (payload) => {
                        resolve(payload.data.toString());
                        socketProblemHandler()
                    },
                    onError: e => {
                        reject(e)
                        socketProblemHandler()
                    }
                })
            }
        );
    }

    listAndListen(roomsHandler, socketProblemHandler) {
        function extractScore(gameEventBuffer) {
            let dataBuf = ByteBuffer.allocate(gameEventBuffer.data);
            return G.getRootAsGame(dataBuf);
        }

        return new Promise((resolve, reject) =>
            this.rsocket.requestStream({
                metadata: encodeCompositeMetadata([
                    [MESSAGE_RSOCKET_ROUTING, encodeRoute('game.score')],
                ]),
            }).subscribe({
                onSubscribe(s) {
                    s.request(2147483642)
                },
                onNext(eventBuf) {
                    roomsHandler(extractScore(eventBuf));
                },
                onError(err) {
                    reject(err)
                    socketProblemHandler()
                },
                onComplete() {
                    resolve()
                    socketProblemHandler()
                }
            })
        );
    }

    postMark(score) {
        return new Promise((resolve, reject) =>
            this.rsocket.requestResponse({
                metadata: encodeCompositeMetadata([
                    [MESSAGE_RSOCKET_ROUTING, encodeRoute('game.play.score')],
                ]),
                data: Buffer.from(score)
            }).subscribe({
                onComplete: (payload) => {
                    resolve(payload.data.toString());
                },
                onError: e => reject(e)
            })
        );
    }

    getCurrentScore() {
        return this.runVoidMethod('game.score.current');
    }

    toggleScore() {
        return this.runVoidMethod('game.score.toggle');
    }

    clearScore() {
        return this.runVoidMethod('game.score.clear');
    }

    runVoidMethod(route){
        return new Promise((resolve, reject) =>
            this.rsocket.requestResponse({
                metadata: encodeCompositeMetadata([
                    [MESSAGE_RSOCKET_ROUTING, encodeRoute(route)],
                ])
            }).subscribe({
                onComplete: () => {
                },
                onError: e => reject(e)
            })
        );
    }

}

APIClient.create = function (onGameStartedHandler, socketProblemHandler) {
    return connect({
        requestChannel: flowable => onGameStartedHandler(flowable)
    }, socketProblemHandler)
        .then((rsocket) => new APIClient(rsocket))
}
