import React, { Component } from "react";
import '../App.css';




class PDFViewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            documentData: null
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
                this.setState({ documentData: data }); // Assuming you want to save the data in the state
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
    }

    render() {
        return (
            <div className="PDFViewer">
                test
            </div>
        )
    }

}

export default PDFViewer


