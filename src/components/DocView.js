import React, {Component} from "react";
import "../App.css";
import Grid from "@mui/material/Unstable_Grid2";
import Box from '@mui/material/Box';
import PDFViewer from "./PDFViewer";
import UserContext from './UserContext';
import Search from "./Search";


class DocView extends Component {

    static contextType = UserContext;
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showPDFViewer: false,
            selectedPDF: null,
            searchTags: [],
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

    handleSearchTagsChange = (tags) => {
        this.setState({ searchTags: tags}, () => { //use callback from of setState to avoid timing issue with setState being async
            this.query();
        });
    }

    componentDidMount() {
        // initial query
        // omit if it is a search
        if (this.props.activeTab !== 4) {
            this.query();
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        // execute query on state change
        if (prevProps.activeTab !== this.props.activeTab) {
            this.query();
        }
    }



    async query() {
        const { userId } = this.context;

        switch (this.props.activeTab) {
            case 1:
                fetch('http://localhost:3001/getDocumentsForUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ownerId: userId }), // converts state to json and sends in response body
                })
                    .then(response => { // handle response
                        // Check if the response is successful
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.setState({ items: data });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                break
            case 2:
                fetch('http://localhost:3001/getSharedDocumentsForUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ownerId: userId }), // converts state to json and sends in response body
                })
                    .then(response => { // handle response
                        // Check if the response is successful
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.setState({ items: data });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                break
            case 4:
                fetch('http://localhost:3001/searchDocuments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchTags: this.state.searchTags, userId: userId }), // converts state to json and sends in response body
                })
                    .then(response => { // handle response
                        // Check if the response is successful
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        this.setState({ items: data });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                break
        }


    }

    render() {
        const { activeTab } = this.props;
        const { items } = this.state;
        console.log(items);
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
                    {activeTab === 4 && <Search onTagsChange={this.handleSearchTagsChange}/>}
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
                                    <div className="ItemFooter">{`${item["custom_name"]}`}</div>
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
