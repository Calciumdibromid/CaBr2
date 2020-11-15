import { Box, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';
import CaBrMenu from './CaBrMenu';
import Header from './Header';
import IngredientSearch from './IngredientSearch';
import Preview from './Preview';
import SecurityThings from './SecurityThings';

const useStyle = makeStyles((theme: Theme) => ({
    background: {
        background: theme.palette.background.default,
    },
}));

/**
 * Friendship is Magic
 */
export default function OnePager(): React.ReactElement {
    const classes = useStyle();

    return (
        <Box className={classes.background}>
            <Header />
            <IngredientSearch />
            <SecurityThings />
            <Preview />
            <CaBrMenu />
        </Box>
    );
}
