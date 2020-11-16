import { Box, IconButton, Input, makeStyles } from '@material-ui/core';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import * as React from 'react';

const useStyle = makeStyles(() => ({
    inputDirection: {
        display: 'flex',
        flexDirection: 'row',
    },
    inputs: {
        width: '100%',
    },
}));

// TODO make this actually removable
// TODO find better naming
export default function RemoveableInput(props: { defaultValue: string, index: number, defaultValues: Array<string>, updateCallBack(change: Array<string>): void }): React.ReactElement {
    const classes = useStyle();
    const [removeMouse, setRemoveMouse] = React.useState(false);

    const onUpdateItem = (change: string) => {
        const list = props.defaultValues.map((item, i) => {
            if (i === props.index) {
                return change;
            } else {
                return item;
            }
        });
        props.updateCallBack(list);
    };

    const onRemoveItem = (i: number) => {
        const list = props.defaultValues.filter((_, j) => i !== j);
        props.updateCallBack(list);
    };

    return (
        <Box className={classes.inputDirection}>
            <Input
                className={classes.inputs}
                defaultValue={props.defaultValue}
                autoFocus // TODO this is a very hacky solution!! find a better way!
                onChange={(evt) => {
                    evt.preventDefault();
                    onUpdateItem(evt.currentTarget.value);
                }} />
            <IconButton
                onClick={() => {
                    onRemoveItem(props.index);
                }}
                onMouseEnter={() => setRemoveMouse(true)}
                onMouseLeave={() => setRemoveMouse(false)}
            >{removeMouse ? <RemoveCircleIcon /> : <RemoveCircleOutlineIcon />}</IconButton>
        </Box>
    );
}
