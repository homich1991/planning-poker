package com.homich.planningpoker.entity;

import com.homich.planningpoker.player.PlayerClient;
import jdk.jshell.spi.ExecutionControl;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import reactor.core.publisher.Flux;

import java.nio.ByteBuffer;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Player {
    @EqualsAndHashCode.Include
    private String id;
    private String name;
    private String role;

    private PlayerClient playerClient;

    public Flux<ByteBuffer> play(ByteBuffer byteBuffer){
        return playerClient.play(byteBuffer);
    }

}

