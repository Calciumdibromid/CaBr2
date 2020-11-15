import { makeStyles, Theme } from '@material-ui/core';

export const useItemStyle = makeStyles((theme: Theme) => ({
    input: {
        width: 'auto',
        paddingRight: 'auto',
        marginBottom: theme.spacing(2),
    },
}));

export default useItemStyle;
