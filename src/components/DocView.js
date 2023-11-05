import React, {Component} from "react";
import "../App.css";
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import dummy from '../assets/dummy.png'
import PDFViewer from "./PDFViewer";


const Item = styled(Paper)(({ theme  }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function Base64Image({ base64 }) {
    if (!base64) {
        return <p>No image provided</p>;
    }

    const src = `data:image/png;base64,${base64}`;
    return (
        <img
            src={src}
            alt="Base64 Encoded"
            onError={() => console.error("Error loading base64 image")}
        />
    );
}




const items_old = [1, 2, 3, 4, 5, 6];


class DocView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showPDFViewer: false,
            selectedPDF: null,
        };
    }

    openPDFViewer = (pdf) => {
        this.setState({
            showPDFViewer: true,
            selectedPDF: pdf,
        });
    };

    closePDFViewer = () => {
        this.setState({
            showPDFViewer: false,
            selectedPDF: null,
        });
    };

    handleDocumentClick = (index) => {
        this.openPDFViewer(index);
    };

    componentDidMount() {
        fetch('http://localhost:3001/getAllDocuments')
            .then((response) => response.json())
            .then((data) => this.setState({ items: data }))
            .catch((error) => console.error('Error: ', error));
    }

    render() {
        const { items } = this.state;
        if (this.state.showPDFViewer) {
            return(
                <PDFViewer
                    selectedPDF={this.state.selectedPDF}
                    onClose={this.closePDFViewer}
                />
            )
        } else {
            return (
                <div className="DocView">
                    <Box sx={{flexGrow: 1}}>
                        <Grid container spacing={3}>
                            {items.map((item, index) => (
                                <Grid className="GridItem" key={index} lg={4} onClick={() => this.handleDocumentClick(item.id)}>
                                    <div className="Item">
                                        <br/>
                                        <img src={item["image"]}/> <br/>
                                        <div className="docName">{`${item["document_name"]}`}</div>
                                        <br/>
                                    </div>
                                    <div className="ItemFooter">{`${item["customName"]}`}</div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
            );
        }
    }
}

export default DocView;
