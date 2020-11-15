import { TextField, Typography } from '@material-ui/core';
import * as React from 'react';
import UIStore from '../stores/Store';
import DefaultPanel from './DefaultPanel';
import ListInputSpecifications from './ListInputSpecifcations';

export default function SecurityThings(): React.ReactElement {
    const store = UIStore.useState();

    const humanAndEnvironmentDangerCallback = (change: Array<string>): void => {
        UIStore.update((store) => {
            store.humanAndEnvironmentDanger = change;
        });
    };

    const rulesOfConductCallback = (change: Array<string>): void => {
        UIStore.update((store) => {
            store.rulesOfConduct = change;
        });
    };

    const inCaseOfDangerCallback = (change: Array<string>): void => {
        UIStore.update((store) => {
            store.inCaseOfDanger = change;
        });
    };

    const disposalCallback = (change: Array<string>): void => {
        UIStore.update((store) => {
            store.disposal = change;
        });
    };



    return (
        <DefaultPanel>
            <Typography variant={'caption'}>
                Gefahren für Mensch und Umwelt, die von den Ausgangsmaterialien bzw. dem(n) Produkt ausgehen, soweit sie nicht durch genannte Angaben abgedeckt sind (z.B. krebserregend, fruchtschädigend, hautresorptiv):
            </Typography>
            <ListInputSpecifications
                defaultValues={store.humanAndEnvironmentDanger}
                updateCallBack={humanAndEnvironmentDangerCallback}
            />

            <Typography variant={'caption'}>
                Schutzmaßnahmen und Verhaltensregeln:
            </Typography>
            <ListInputSpecifications
                defaultValues={store.rulesOfConduct}
                updateCallBack={rulesOfConductCallback}
            />

            <Typography variant={'caption'}>
                Verhalten im Gefahrenfall, Erste-Hilfe-Maßnahmen (gegebenfalls Kopie der entsprechenden Literaturstelle beiheften):
            </Typography>
            <ListInputSpecifications
                defaultValues={store.inCaseOfDanger}
                updateCallBack={inCaseOfDangerCallback}
            />
            
            <Typography variant={'caption'}>
                Entsorgung:
            </Typography>
            <ListInputSpecifications
                defaultValues={store.disposal}
                updateCallBack={disposalCallback}
            />
        </DefaultPanel>
    );
}
