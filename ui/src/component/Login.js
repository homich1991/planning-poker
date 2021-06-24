import {Button, FormControl, FormControlLabel, FormHelperText, makeStyles, Radio, RadioGroup, TextField, FormLabel} from "@material-ui/core";
import {useState} from "react";
import {BE, FE, QA, SPECTATOR} from "../Constants";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        width: "400px",
        margin: "50px auto",
        display: "block",
    },
    inputControl: {
      display: "block",
        marginBottom: "20px",
    },
    formLabel: {
        fontSize: "1.2rem",
        fontWeight: "600",
        paddingBottom: "10px",
    }
}));

export function Login(props) {

    const classes = useStyles();

    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [helperText, setHelperText] = useState('');
    const [error, setError] = useState(false);

    const joinGame = (event) => {
        event.preventDefault();
        setHelperText('')
        setError(false);
        if (role === '') {
            setHelperText('Role should be selected!')
            setError(true);
        } else {
            props.joinGame(userName, role)
        }
    }

    const handleUsernameChange = (event) => {
        setUserName(event.target.value)
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value)
    };

    return (
        <div>
            <form onSubmit={joinGame}>
                <FormControl error={error} className={classes.formControl}>
                    <FormLabel component="legend" className={classes.formLabel}>Your Name:</FormLabel>
                    <TextField
                        id="username"
                        variant="outlined"
                        required
                        margin="small"
                        autoFocus
                        value={userName}
                        className={classes.inputControl}
                        onChange={handleUsernameChange}
                        autoComplete="name"
                    />

                    <FormLabel component="legend" className={classes.formLabel}>Choose your <s>destiny</s> skill:</FormLabel>
                    <RadioGroup aria-label="role"
                                name="role"
                                required
                                aria-required="true"
                                value={role}
                                onChange={handleRoleChange}>
                        <FormControlLabel value={BE} control={<Radio/>} label="Back-End"/>
                        <FormControlLabel value={FE} control={<Radio/>} label="Front-End"/>
                        <FormControlLabel value={QA} control={<Radio/>} label="QA"/>
                        <FormControlLabel value={SPECTATOR} control={<Radio/>} label="Spectator"/>
                    </RadioGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Join
                    </Button>
                </FormControl>
            </form>
        </div>
    )
}
