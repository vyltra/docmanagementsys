import React, { Component } from "react";
import '../App.css';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


class PDFViewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            documentData: null,
            numPages: null,
            pageNumber: 1,
        };
    }

    componentDidMount() {
        // Ensure that selectedPDF is passed as a prop to this component
        const { selectedPDF } = this.props;
        fetch('http://localhost:3001/getDocument', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documentId: selectedPDF }), // Assuming the backend expects a JSON with a documentId field
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const docData = data.document;
                this.setState({ documentData: { docData } }); // Update state with converted data
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    render() {


        const { pageNumber, numPages, documentData } = this.state;

        // Add a loading state to handle the null state before data is fetched
        if (!documentData) {
            return <div>Loading...</div>;
        }
        // Correct the file prop to use documentData.docData, which holds the base64 string
        return (
            <div className="PDFViewer">
                <Document
                    file={`data:application/pdf;base64,${documentData.docData}`}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                <div>
                    <p>Page {pageNumber} of {numPages}</p>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            onClick={() => this.setState((prevState) => ({ pageNumber: prevState.pageNumber - 1 }))}
                            disabled={pageNumber <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }))}
                            disabled={pageNumber >= numPages}
                        >
                            Next
                        </Button>
                        {this.props.onClose && (
                            <Button onClick={this.props.onClose} variant="contained">
                                Close
                            </Button>
                        )}
                    </Stack>
                </div>
            </div>
        )
    }

}

export default PDFViewer