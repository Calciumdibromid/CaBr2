import { Box, makeStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import UIStore from '../stores/Store';

const useStyle = makeStyles((theme: Theme) => ({
    table: {
        border: '1px solid black',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'auto auto auto auto auto auto auto',
        border: '1px solid black',
        margin: `${theme.spacing(1)} ${theme.spacing(15)}`,
    },
    gridheader: {
        gridColumnStart: 1,
        gridColumnEnd: 8,
        alignContent: 'center',
        border: '1px solid black',
    },
    gridname: {
        gridColumnStart: 1,
        gridColumnEnd: 3,
        alignContent: 'center',
        border: '1px solid black',
    },
    gridplace: {
        gridColumnStart: 3,
        gridColumnEnd: 5,
        alignContent: 'center',
        border: '1px solid black',
    },
    gridassistant: {
        gridColumnStart: 5,
        gridColumnEnd: 8,
        alignContent: 'center',
        border: '1px solid black',
    },
    handpheader: {
        gridColumnStart: 1,
        gridColumnEnd: 8,
        border: '1px solid black',
    },
    h: {
        gridColumnStart: 1,
        gridColumnEnd: 4,
        border: '1px solid black',
    },
    p: {
        gridColumnStart: 4,
        gridColumnEnd: 8,
        border: '1px solid black',
    },
    padding: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(.5),
        paddingBottom: theme.spacing(.5),
    },
}));

export default function Preview(): React.ReactElement {
    const classes = useStyle();

    const store = UIStore.useState();

    const SimpleList = (props: { list: Array<string>}): React.ReactElement => {
        return (
            <ul>
                {
                    props.list.map((value, index) => {
                        return (
                            <li key={index}>
                                {value}
                            </li>
                        );
                    })
                }
            </ul>
        );
    };

    return (
        <Box className={classes.grid}>
            <Typography align={'center'} variant={'h4'} className={classes.gridheader}>
                {store.documentTitle.length === 0 ? <div style={{ height: '41px' }} /> : <b>{store.documentTitle}</b>}
            </Typography>
            <Typography align={'center'} variant={'h4'} className={classes.gridheader}>
                {store.organisation.length === 0 ? <div style={{ height: '41px' }} /> : <b>{store.organisation}</b>}
            </Typography>
            <Typography align={'center'} variant={'h4'} className={classes.gridheader}>
                {store.labCourse.length === 0 ? <div style={{ height: '41px' }} /> : <b>{store.labCourse}</b>}
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridname} ${classes.padding}`}>
                Name<br />{store.name.length === 0 ? <div style={{ height: '24px' }} /> : store.name}
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridplace}  ${classes.padding}`}>
                Platz<br />{store.place.length === 0 ? <div style={{ height: '24px' }} /> : store.place}
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridassistant} ${classes.padding}`}>
                Assistenti/in<br />{store.assistant.length === 0 ? <div style={{ height: '24px' }} /> : store.assistant}
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridheader} ${classes.padding}`}>
                Versuch/Herzustellendes Präparat:<br />{store.preparation.length === 0 ? <div style={{ height: '24px' }} /> : <b>{store.preparation}</b>}
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                eingesetzte Stoffe<br />und Produkte
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                MG<br />[g/mol]
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                BP/MP<br />[C°]
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                GHS-<br />Symbol(e)
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                Nummern der H/P-Sätze
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                MAK, LD50<br />WGK
            </Typography>
            <Typography variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                Menge
            </Typography>
            {
                [
                    'Dummy1',
                    'Dummy2',
                    'Dummy3',
                    'Dummy4',
                    'Dummy5',
                    'Dummy6',
                    'Dummy7',
                ].map((element, index) => {
                    return (
                        <Typography key={index} variant={'body1'} className={`${classes.table} ${classes.padding}`}>
                            {element}
                        </Typography>
                    );
                })
            }
            <Typography align={'center'} variant={'body1'} className={`${classes.handpheader} ${classes.padding}`}>
                Wortlaut der wesentlichen oben genannten H- und P-Sätze
            </Typography>
            <Typography variant={'body1'} className={`${classes.h} ${classes.padding}`}>
                Dummy1 h<br />
                Dummy2 h<br />
            </Typography>
            <Typography variant={'body1'} className={`${classes.p} ${classes.padding}`}>
                Dummy1 p<br />
                Dummy2 p<br />
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridheader} ${classes.padding}`}>
                <b>Gefahren für Mensch und Umwelt, die von den Ausgangsmaterialien bzw. dem(n) Produkt ausgehen, soweit sie nicht durch genannte Angaben abgedeckt sind (z.B. krebserregend, fruchtschädigend, hautresorptiv):</b><br />
                <SimpleList list={store.humanAndEnvironmentDanger} />
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridheader} ${classes.padding}`}>
                <b>Schutzmaßnahmen und Verhaltensregeln:</b><br />
                <SimpleList list={store.rulesOfConduct} />
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridheader} ${classes.padding}`}>
                <b>Verhalten im Gefahrenfall, Erste-Hilfe-Maßnahmen (gegebenfalls Kopie der entsprechenden Literaturstelle beiheften):</b><br />
                <SimpleList list={store.inCaseOfDanger} />
            </Typography>
            <Typography variant={'body1'} className={`${classes.gridheader} ${classes.padding}`}>
                <b>Entsorgung:</b><br />
                <SimpleList list={store.disposal} />
            </Typography>
            <Typography variant={'body1'} className={`${classes.h}  ${classes.padding}`}>
                Hiermit verpflichte ich mich, den Versuch<br />
                gemäß den in dieser Betriebsanweisung<br />
                aufgeführten Sichereitsvorschriften durchzuführen.<br />
                <br />
                <br />_______________________________
                <br />Unterschrift des/der Student/in<br />
            </Typography>
            <Typography variant={'body1'} className={`${classes.p} ${classes.padding}`}>
                Präparat zur Synthese mit den auf der Vorderseite<br />
                berechneten Chemikalienmengen freigegeben<br />
                <br />
                <br /><br />_______________________________<br />
                Unterschrift des/der Assisten/tin<br />
            </Typography>
        </Box>
    );
}

