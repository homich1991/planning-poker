import {Button} from "@material-ui/core";

export function ScoreButton(props) {
    return (
        <Button
            variant="contained"
            color="primary"
            className={props.styles}
            onClick={() => props.postMark(props.score)}
        > {props.score} </Button>
    )
}
