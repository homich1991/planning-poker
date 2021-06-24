import {Flowable} from "rsocket-flowable/build";

export default class Game {

    constructor() {
        this.callbacks = {};
    }

    start(flowable) {
        // const callbacks = this.callbacks;

        flowable.subscribe({
            onSubscribe(s) {
                s.request(2147483642)
            },
            onNext(t) {
                // const game = gameXyz.bomberman.game.data.Game.getRootAsGame(new flatbuffers.ByteBuffer(t.data));
                // callbacks['game.start'](game)
                // return;
                // const event = GameEvent.getRootAsGameEvent(new flatbuffers.ByteBuffer(t.data));
                // callbacks[event.eventType()](event);
            },
            onError(err) {
                console.error(err);
                // self.deletePlayer({id: self.id});
            },
            onComplete() {
                console.log("complete?")
            }
        })

        return new Flowable(subscriber => {
            console.log("subscribing")
            subscriber.onSubscribe({
                request(n) {
                    console.log("requested " + n)
                },
                cancel() {
                    console.log("cancelled")
                }
            });
            // this.rsocketEmit = (type, builderFunction) => {
            //     const builder = new flatbuffers.Builder()
            //     const gameEventOffset = GameEvent.createGameEvent(
            //         builder,
            //         type,
            //         builderFunction(builder)
            //     );
            //     GameEvent.finishGameEventBuffer(builder, gameEventOffset);
            //     const bytes = builder.asUint8Array();
            //     const data = Buffer.from(bytes);
            //     subscriber.onNext({
            //         metadata: encodeCompositeMetadata([
            //             [MESSAGE_RSOCKET_ROUTING, encodeRoute(`game.play`)],
            //         ]),
            //         data
            //     })
            // };
        })
    }
}
