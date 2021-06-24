package com.homich.planningpoker.entity;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class Game {
    private final Map<String, String> idToScore = new HashMap<>();
    private final Map<String, Player> players = new HashMap<>();
    private boolean showScore = false;

    public void applyMark(String playerId, String score) {
        idToScore.put(playerId, score);
    }

    public void registerPlayer(Player player) {
        players.put(player.getId(), player);
    }

    public void unregisterPlayer(String id) {
        idToScore.remove(id);
        players.remove(id);
    }

    public void toggleScore() {
        this.showScore = !this.showScore;
    }

    public void clearScore(){
        idToScore.clear();
        showScore = false;
    }
}
