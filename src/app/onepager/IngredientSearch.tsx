import { Box, Button, Divider, makeStyles, Theme } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutline';
import SearchBar from 'material-ui-search-bar';
import * as React from 'react';
import useItemStyle from '../styles/onepager/Items';
import DefaultPanel from './DefaultPanel';

const useStyle = makeStyles((theme: Theme) => ({
    grid: {
        display: 'grid',
        gridTemplateColumns: 'auto',
        // rowGap: theme.spacing(1),
    },
    item: {
        maxHeight: theme.spacing(4.5),
    },
    box: {
        // minHeight: 400,
        // maxHeight: 400,
    },
}));

export default function IngredientSearch(): React.ReactElement {
    const itemClasses = useItemStyle();
    const classes = useStyle();

    const [data, setData] = React.useState<Record<string, boolean>>({ '': false });

    React.useEffect(() => {
        setData({
            'CAS: 65272-71-1; Name: Chromschwefelsäure': false,
            'CAS: 8014-95-7; Name: Oleum': false,
            'CAS: 7782-99-2; Name: Schweflige Säure': false,
        });
    }, []);

    return (
        <React.Fragment>
            <DefaultPanel>
                <SearchBar className={itemClasses.input} />
                <Box className={classes.box}>
                    <ul style={{ listStyle: 'none' }}>
                        {
                            Object.entries(data).map((result, index) => {
                                return (
                                    <li key={index} className={classes.item}>
                                        <Button
                                            fullWidth
                                            endIcon={result[1] ? <CheckCircleIcon /> : <CheckCircleOutlinedIcon />}
                                            onClick={() => {
                                                const foo = data;

                                                Object.entries(foo).reduce((acc, cur) => {
                                                    acc[cur[0]] = true;
                                                    return acc;
                                                }, {});
                                                setData(foo);
                                            }}
                                        >
                                            {result[0]}
                                        </Button>
                                        <Divider />
                                    </li>
                                );
                            })
                        }
                    </ul>
                </Box>
            </DefaultPanel>
        </React.Fragment>
    );
}
