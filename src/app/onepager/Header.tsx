import { TextField } from '@material-ui/core';
import * as React from 'react';
import UIStore from '../stores/Store';
import useItemStyle from '../styles/onepager/Items';
import DefaultPanel from './DefaultPanel';

export default function Header(): React.ReactElement {
    const classes = useItemStyle();

    const store = UIStore.useState();

    return (
        <DefaultPanel>
            <TextField className={classes.input} label={'Document Titel'} value={store.documentTitle} onChange={(ev) => {
                UIStore.update((s) => {
                    s.documentTitle = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Organistation'} value={store.organisation} onChange={(ev) => {
                UIStore.update((s) => {
                    s.organisation = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Lab/Kurs'} value={store.labCourse} onChange={(ev) => {
                UIStore.update((s) => {
                    s.labCourse = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Name'} value={store.name} onChange={(ev) => {
                UIStore.update((s) => {
                    s.name = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Platz'} value={store.place} onChange={(ev) => {
                UIStore.update((s) => {
                    s.place = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Assistent/in'} value={store.assistant} onChange={(ev) => {
                UIStore.update((s) => {
                    s.assistant = ev.currentTarget.value;
                });
            }} />
            <TextField className={classes.input} label={'Versuch/Herzustellendes Präparat'} value={store.preparation} onChange={(ev) => {
                UIStore.update((s) => {
                    s.preparation = ev.currentTarget.value;
                });
            }} />
        </DefaultPanel>
    );
}
