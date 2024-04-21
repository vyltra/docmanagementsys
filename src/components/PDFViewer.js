import React, { Component } from "react";
import '../App.css';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

// this component serves as a simple PDF viewer with some buttons for navigation and download

class PDFViewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            documentData: null,
            documentName: null,
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
            body: JSON.stringify({ documentId: selectedPDF }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const docData = data.document;
                const docName = data.documentName;
                this.setState({ documentData: { docData } });
                this.setState({ documentName: docName });
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    };

    // this method handles downloading the PDF
    downloadPDF = () => {
        const { documentData } = this.state;
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${documentData.docData}`;
        link.download = this.state.documentName || 'document.pdf'; // fallback to default name if documentName is not set
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {

        const { pageNumber, numPages, documentData } = this.state;

        // add a loading state to handle the null state before data is fetched
        if (!documentData) {
            return <div>Loading...</div>;
        }
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
                        <Button onClick={this.downloadPDF} variant="contained">
                            Download
                        </Button>
                    </Stack>
                </div>
            </div>
        )
    }

}

export default PDFViewer