import React from "react";
import "../App.css";
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme  }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



const items = [1, 2, 3, 4, 5, 6];

function DocView() {
    return(
        <div className="DocView">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {items.map((item, index) => (
                        <Grid key={index} lg={4}>
                            <div className="Item">
                                {`This is a Box ${item}`} <br/>
                                {`This is a Box ${item}`} <br/>
                                {`This is a Box ${item}`} <br/>
                            </div>
                        </Grid>
                    ))}

                </Grid>
            </Box>
        </div>
    )
}

export default DocView