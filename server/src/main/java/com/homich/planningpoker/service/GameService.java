package com.homich.planningpoker.service;

import com.homich.planningpoker.entity.Game;
import com.homich.planningpoker.entity.Player;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.nio.ByteBuffer;

import static com.homich.planningpoker.utils.SinksSupport.RETRY_NON_SERIALIZED;

@Service
@Slf4j
public class GameService {

    final Sinks.Many<ByteBuffer> scoreUpdates;
    private final Game game;

    private final GameBufferGenerator gameBufferGenerator;

    public GameService(GameBufferGenerator gameBufferGenerator) {
        this.gameBufferGenerator = gameBufferGenerator;
        this.game = new Game();
        scoreUpdates = Sinks.many().multicast().directBestEffort();
    }

    public void postMark(String playerId, String score) {
        this.game.applyMark(playerId, score);
        sendGameUpdate();
    }

    public Flux<ByteBuffer> listAndListen() {
        return scoreUpdates.asFlux();
    }

    public void connectPlayer(Player player) {
        game.registerPlayer(player);
        sendGameUpdate();
    }

    public void disconnectPlayer(String id) {
        game.unregisterPlayer(id);
        log.debug("Player disconnection -> " + id);
        sendGameUpdate();
    }

    public void sendGameUpdate() {
        ByteBuffer gameBuffered = gameBufferGenerator.buildGameBuffer(this.game);
        scoreUpdates.emitNext(gameBuffered, RETRY_NON_SERIALIZED);
    }

    public void toggleScores() {
        this.game.toggleScore();
        sendGameUpdate();
    }

    public void clearScores() {
        this.game.clearScore();
        sendGameUpdate();
    }
}
