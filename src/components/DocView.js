import React, {Component} from "react";
import "../App.css";
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dummy from '../assets/dummy.png'



const Item = styled(Paper)(({ theme  }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



const items_old = [1, 2, 3, 4, 5, 6];


class DocView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/getAllDocuments')
            .then((response) => response.json())
            .then((data) => this.setState({ items: data }))
            .catch((error) => console.error('Error: ', error));
    }

    render() {
        const { items } = this.state;

        return (
            <div className="DocView">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                        {items.map((item, index) => (
                            <Grid className="GridItem" key={index} lg={4}>
                                <div className="Item">
                                    <img className="ItemImage" src={dummy} alt="Dummy" /> <br />
                                    {`${item["document_name"]}`} <br />
                                </div>
                                <div className="ItemFooter">Footer</div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
        );
    }
}

export default DocView;