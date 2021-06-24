package com.homich.planningpoker.service;

import com.google.flatbuffers.FlatBufferBuilder;
import com.homich.data.PlayerScore;
import com.homich.data.PlayerScoreByRoles;
import com.homich.data.ScoreCount;
import com.homich.planningpoker.entity.Game;
import com.homich.planningpoker.entity.Player;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class GameBufferGenerator {

    public ByteBuffer buildGameBuffer(Game game) {
        final FlatBufferBuilder builder = new FlatBufferBuilder();
        com.homich.data.Game.finishGameBuffer(
                builder,
                com.homich.data.Game.createGame(builder,
                        com.homich.data.Game.createPlayersByRolesVector(builder,
                                generatePlayerByRoles(builder, game)
                        ),
                        game.isShowScore()
                )
        );
        return builder.dataBuffer().position(builder.dataBuffer().capacity() - builder.offset());
    }

    private int[] generatePlayerByRoles(FlatBufferBuilder builder, Game game) {
        Set<String> roles = game.getPlayers().values()
                .stream()
                .map(Player::getRole)
                .collect(Collectors.toSet());
        int i = 0;
        var playerRolesOffset = new int[roles.size()];

        for (String role : roles) {
            var roleOffset = builder.createString(role);
            PlayerByRoleComputedScore playerScore = generatePlayerScores(builder, game, role);
            playerRolesOffset[i] = PlayerScoreByRoles.createPlayerScoreByRoles(builder,
                    roleOffset,
                    playerScore.averageScore,
                    PlayerScoreByRoles.createPlayersVector(builder,
                            playerScore.players
                    ),
                    PlayerScoreByRoles.createScoreCountVector(builder,
                            playerScore.scoresCount)
            );
            i++;
        }
        return playerRolesOffset;
    }

    private PlayerByRoleComputedScore generatePlayerScores(FlatBufferBuilder builder, Game game, String role) {
        List<Map.Entry<String, Player>> players = game.getPlayers().entrySet()
                .stream()
                .filter(entry -> role.equals(entry.getValue().getRole()))
                .collect(Collectors.toList());


        var playersOffsets = new int[players.size()];
        var i = 0;

        double scoreSum = 0.0;
        int count = 0;

        var scoresCount = new HashMap<String, Integer>();

        for (var user : players) {
            Player player = user.getValue();

            var idOffset = builder.createString(player.getId());
            var nameOffset = builder.createString(player.getName());
            var roleOffset = builder.createString(player.getRole());
            String score = Optional.ofNullable(game.getIdToScore().get(user.getKey())).orElse("-");
            if (!game.isShowScore() && !"-".equals(score)) {
                score = "+";
            }
            if (game.isShowScore()) {
                try {
                    String scoreToParse = ("½".equals(score)) ? "0.5" : score;

                    scoreSum += Double.parseDouble(scoreToParse);
                    count++;
                    scoresCount.compute(score, (k, v) -> (v == null) ? 1 : v + 1);
                } catch (NumberFormatException ignored) {
                }
            }

            var scoreOffset = builder.createString(score);

            PlayerScore.startPlayerScore(builder);
            PlayerScore.addId(builder, idOffset);
            PlayerScore.addName(builder, nameOffset);
            PlayerScore.addScore(builder, scoreOffset);
            PlayerScore.addRole(builder, roleOffset);
            playersOffsets[i] = PlayerScore.endPlayerScore(builder);
            i++;
        }

        return new PlayerByRoleComputedScore(playersOffsets, builder.createString(getResultAverageScore(scoreSum, count)),
                buildScoresCount(builder, scoresCount));
    }

    private int[] buildScoresCount(FlatBufferBuilder builder, HashMap<String, Integer> scoresCount) {
        var scoresCountOffsets = new int[scoresCount.size()];
        int i = 0;

        for (var scoreCount : scoresCount.entrySet()) {
            scoresCountOffsets[i] = ScoreCount.createScoreCount(builder, builder.createString(scoreCount.getKey()), scoreCount.getValue());
            i++;
        }
        return scoresCountOffsets;
    }

    private String getResultAverageScore(double scoreSum, int count) {
        if (count == 0) {
            return "";
        }
        double as = scoreSum / count;
        if ((as == Math.floor(as)) && !Double.isInfinite(as)) {
            return (int) as + "";
        } else {
            return new DecimalFormat("##.##").format(as);
        }
    }

    @AllArgsConstructor
    private class PlayerByRoleComputedScore {
        int[] players;
        int averageScore;
        int[] scoresCount;
    }
}
