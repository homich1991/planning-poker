package com.homich.planningpoker.controller;

import com.homich.planningpoker.entity.Player;
import com.homich.planningpoker.player.support.PlayerAwareRSocket;
import com.homich.planningpoker.service.GameService;
import io.rsocket.RSocket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.nio.ByteBuffer;
import java.util.Objects;

@Controller
@MessageMapping("game")
@RequiredArgsConstructor
@Slf4j
public class GameController {
    private final GameService gameService;

    @MessageMapping("score")
    public Flux<ByteBuffer> getScores() {
        return this.gameService.listAndListen();
    }

    @MessageMapping("score.current")
    public void getCurrentScores() {
        this.gameService.sendGameUpdate();
    }

    @MessageMapping("score.toggle")
    public void toggleScores() {
        this.gameService.toggleScores();
    }

    @MessageMapping("score.clear")
    public void clearScores() {
        this.gameService.clearScores();
    }

    @MessageMapping("play.score")
    public void postMark(@Payload String score, RSocketRequester requester) {
        final RSocket rsocket = Objects.requireNonNull(requester.rsocket());
        Player player = ((PlayerAwareRSocket) rsocket).player;
        if (player == null) {
            requester.dispose();
            return;
        }
        gameService.postMark(player.getId(), score);
        log.debug("Player {} posted score {}", player, score);
    }
}
