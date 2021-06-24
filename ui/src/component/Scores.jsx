import { Grid, List, ListItem } from '@material-ui/core';
import {SPECTATOR} from "../Constants";

export function Scores(props) {

    const scoreToSign = (score) => {
        if (score === '+') {
            return '✅'
        }
        if (score === '-') {
            return '✘'
        }
        return score
    }


    const listScoresByRoles = props.playerByRoleScores
        .sort((a, b) => (a.role > b.role ? 1 : -1))
        .map((scores) => {
                return <Grid item flex>
                    {(scores.role !== SPECTATOR) ?
                        <div key={scores.role}>
                            <h4>{scores.role}: {scores.averageScore}</h4>
                            <List>
                                {scores.players.map((player) =>
                                    <ListItem key={player.id} disableGutters>{player.name} {scoreToSign(player.score)}</ListItem>
                                )}
                            </List>

                            {scores.scoresCount.length > 0 ? <div>
                                    <h4>Scores count</h4>
                                    <List>
                                        {[...scores.scoresCount].sort((a, b) => (
                                            b.count > a.count ? 1 : -1
                                        )).map((scoreCount) =>
                                            <ListItem key={scoreCount.score} disableGutters>{scoreCount.score}pt {"->"} {scoreCount.count}</ListItem>
                                        )}
                                    </List>
                                </div>
                                : <div/>
                            }

                        </div>
                        : <div/>}
                </Grid>;
            }
        );

    return (
        <Grid container wrap="nowrap" justify="space-around">
            {listScoresByRoles}
        </Grid>
    )
}
