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
export default function RemoveableInput(props: { defaultValue: string, index: number }): React.ReactElement {
    const classes = useStyle();
    const [removeMouse, setRemoveMouse] = React.useState(false);

    return (
        <Box className={classes.inputDirection}>
            <Input className={classes.inputs} defaultValue={props.defaultValue} onChange={(evt) => {
                // TODO evaluate this
                // const foo = props.defaultValue;
                // foo[props.index] = evt.currentTarget.value;
                // props.updateCallBack(foo);
                console.log(props.defaultValue);
            }}></Input>
            <IconButton
                // TODO evaluate this
                // onClick={() => {
                //     const array = [...props.defaultValues];
                //     const inde = array.indexOf(i);
                //     if (inde !== -1) {
                //         array.splice(inde, 1);
                //         props.updateCallBack(array);
                //     }
                // }}
                onMouseEnter={() => setRemoveMouse(true)}
                onMouseLeave={() => setRemoveMouse(false)}
            >{removeMouse ? <RemoveCircleIcon /> : <RemoveCircleOutlineIcon />}</IconButton>
        </Box>
    );
}
