package com.homich.planningpoker.player;

import lombok.AllArgsConstructor;
import org.springframework.messaging.rsocket.RSocketRequester;
import reactor.core.publisher.Flux;

import java.nio.ByteBuffer;

@AllArgsConstructor
public class PlayerClient {

    final RSocketRequester requester;

    public Flux<ByteBuffer> play(ByteBuffer byteBuffer) {
        return requester.route("game.play")
                .data(byteBuffer)
                .retrieveFlux(ByteBuffer.class);
    }
}
