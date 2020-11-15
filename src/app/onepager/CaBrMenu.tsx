import { Drawer, Fab, makeStyles, Menu, MenuItem, Theme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { open, save } from 'tauri/api/dialog';
import UIStore from '../stores/Store';

const useStyle = makeStyles((theme: Theme) => ({
    fab: {
        position: 'fixed',
        left: theme.spacing(3),
        top: theme.spacing(2),
    },
}));

export default function CaBrMenu(): React.ReactElement {
    const classes = useStyle();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const clearData = () => {
        UIStore.update((store) => {
            store.documentTitle = '';
            store.organisation = '';
            store.labCourse = '';
            store.name = '';
            store.place = '';
            store.assistant = '';
            store.preparation = '';
        });
        handleClose();
    };

    const openData = () => {
        open({ filter: '*.json' });
        handleClose();
    };

    const saveData = () => {
        save({ filter: '*.pdf' });
        handleClose();
    };

    return (
        <React.Fragment>
            <Fab color={'primary'} className={classes.fab} onClick={handleClick}>
                <MenuIcon />
            </Fab>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={clearData}>Neue Betriebsanweisung</MenuItem>
                <MenuItem onClick={openData}>Bestehen Betriebsanweisung öffnen</MenuItem>
                <MenuItem onClick={openData}>Import Beryllium Datei</MenuItem>
                <MenuItem onClick={saveData}>Als PDF speichern</MenuItem>
            </Menu>
        </React.Fragment>
    );
}
