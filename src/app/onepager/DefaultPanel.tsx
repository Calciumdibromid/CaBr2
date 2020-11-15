import { makeStyles, Paper, Theme } from '@material-ui/core';
import * as React from 'react';

const useStyle = makeStyles((theme: Theme) => ({
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        margin: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
}));

export default function DefaultPanel(props: {children: React.ReactNode}): JSX.Element {
    const classes = useStyle();

    return (
        <Paper elevation={3} className={classes.paper}>
            {props.children}
        </Paper>
    );
}
