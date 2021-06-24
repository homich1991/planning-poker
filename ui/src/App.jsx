import './App.css';
import APIClient from './api/APIClient'
import {useEffect, useRef, useState} from "react";
import Game from "./game/Game";
import {Button, makeStyles} from "@material-ui/core";
import {Login} from "./component/Login";
import {Scores} from "./component/Scores";
import {SPECTATOR} from "./Constants";
import {ScoreButton} from "./component/ScoreButton";

const useStyles = makeStyles(theme => ({
    paper: {
        margin: "50px auto",
        display: 'block',
        width: "700px",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 0),
    },
    formControl: {
        margin: theme.spacing(3),
    },
    scoreButton: {
        margin: "10px",
    }
}));

function App() {
    const classes = useStyles();

    const client = useRef(undefined);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [spectatorRole, setSpectatorRole] = useState(false);
    const [playerByRoleScores, setPlayerByRoleScores] = useState([])
    const [currentMark, setCurrentMark] = useState('')
    const [showScores, setShowScores] = useState(false)

    useEffect(async () => {
        client.current = await APIClient.create(flowable => {
            const game = new Game();
            return game.start(flowable)
        }, socketProblemHandler)
    }, []);


    const joinGame = (userName, role) => {
        client.current.login(userName, role, socketProblemHandler)
            .then((userId) => setUserData(userName, role, userId))
            .then(client.current.listAndListen(handleGameEvent, socketProblemHandler))
            .then(client.current.getCurrentScore())

    }

    const socketProblemHandler = () => {
        setUserId('')
    }

    const setUserData = (userName, role, id) => {
        setUserName(userName);
        setRole(role);
        setSpectatorRole(SPECTATOR === role)
        setUserId(id)
    }

    const postMark = (score) => {
        setCurrentMark(score)
        client.current.postMark(score)
            .then((_) => {
            })
    }

    const toggleScore = () => {
        client.current.toggleScore()
            .then((_) => {
            })
    }

    const clearScore = () => {
        setCurrentMark('')
        client.current.clearScore()
            .then((_) => {
            })
    }

    const handleGameEvent = (data) => {
        const playersByRoles =
            [...new Array(data.playersByRolesLength()).keys()]
                .map(i => {
                    const playerByRole = data.playersByRoles(i);
                    const players =
                        [...new Array(playerByRole.playersLength()).keys()]
                            .map(i => {
                                const player = playerByRole.players(i);
                                return {
                                    id: player.id(),
                                    name: player.name(),
                                    score: player.score(),
                                    role: player.role()
                                };
                            });
                    const scoresCount =
                        [...new Array(playerByRole.scoreCountLength()).keys()]
                            .map(i => {
                                const scoreCount = playerByRole.scoreCount(i);
                                return {
                                    score: scoreCount.score(),
                                    count: scoreCount.count()
                                };
                            });
                    return {
                        role: playerByRole.role(),
                        players: players,
                        averageScore: playerByRole.averageScore(),
                        scoresCount: scoresCount
                    };
                });

        // console.log('new scores')
        // playersByRoles.forEach((p) => console.log(p))

        setPlayerByRoleScores(playersByRoles);
        setShowScores(data.showScores())
    }

    const scoreArr = ['0', '½', '1', '2', '3', '5', '8', '13', '?']

    const scoreButtons = scoreArr.map(scoreItem =>
        <ScoreButton key={scoreItem}
                     postMark={postMark}
                     score={scoreItem}
                     styles={classes.scoreButton}
        />
    );

    return (
        <div>
            {!userId
                ? <Login
                    joinGame={joinGame}
                    setUserData={setUserData}
                />
                : <div className={classes.paper}>
                    <p>Name: <b>{userName}</b></p>
                    <p>Role: {role}</p>
                    {(spectatorRole) ? <p/>
                        :
                        <div>
                            {(currentMark) ? <p>You've chosen: <b>{currentMark}</b></p> : <p>Choose the score</p>}
                            {scoreButtons}
                        </div>
                    }
                    <p/>
                    <Scores key="scores" playerByRoleScores={playerByRoleScores}/>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => toggleScore()}
                    > {showScores ? 'Hide scores' : 'Show scores'} </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => clearScore()}
                    > Clear scores </Button>
                </div>
            }
        </div>
    );
}

export default App;
