import { Box, Button, IconButton, Input, makeStyles, Theme } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import * as React from 'react';
import RemoveableInput from './RemoveableInput';

const useStyle = makeStyles((theme: Theme) => ({
    groot: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputDirection: {
        display: 'flex',
        flexDirection: 'row',
    },
    inputs: {
        width: '100%',
    },
    addButton: {
        width: '5%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
}));

export default function ListInputSpecifications(props: { defaultValues: Array<string>, updateCallBack(change: Array<string>): void }): React.ReactElement {
    const classes = useStyle();

    const [addMouse, setAddMouse] = React.useState(false);

    return (
        <Box className={classes.groot}>
            {
                props.defaultValues.map((i, index) => {
                    return <RemoveableInput key={i} defaultValue={i} index={index} />;
                })
            }
            <Button className={classes.addButton} onMouseEnter={() => setAddMouse(true)} onMouseLeave={() => setAddMouse(false)} onClick={() => {
                props.updateCallBack(props.defaultValues.concat(''));
            }}>{addMouse ? <AddCircleIcon /> : <AddCircleOutlineIcon />}</Button>
        </Box>
    );
}
