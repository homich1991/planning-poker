package com.homich.planningpoker.controller;

import com.homich.data.PlayerScore;
import com.homich.planningpoker.entity.Player;
import com.homich.planningpoker.player.PlayerClient;
import com.homich.planningpoker.player.support.PlayerAwareRSocket;
import com.homich.planningpoker.service.GameService;
import io.rsocket.RSocket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.stereotype.Controller;

import java.nio.ByteBuffer;
import java.util.Objects;
import java.util.UUID;

@Controller
@MessageMapping("game.players")
@RequiredArgsConstructor
@Slf4j
public class PlayerController {
    private final GameService gameService;

    @MessageMapping("login")
    public String login(@Payload ByteBuffer userData, RSocketRequester requester) {
        PlayerScore playerData = PlayerScore.getRootAsPlayerScore(userData);

        //TODO: Do not create user again if it is already logged in
        String id = UUID.randomUUID().toString();
        PlayerClient playerClient = new PlayerClient(requester);
        Player player = new Player(id, playerData.name(), playerData.role(), playerClient);
        gameService.connectPlayer(player);

        final RSocket rsocket = Objects.requireNonNull(requester.rsocket());

        ((PlayerAwareRSocket) rsocket).player = player;

        rsocket.onClose()
                .doFinally(__ -> gameService.disconnectPlayer(id))
                .subscribe();
        log.debug("New player connected -> " + player);
        return id;
    }
}
