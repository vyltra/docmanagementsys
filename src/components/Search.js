import React, { Component } from "react";
import '../App.css';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

// this component generates the search field in the DocView component


class Search extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            tags: [],
            userTags: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/getUserTags')
            .then((response) => response.json())
            .then((data) => this.setState({ userTags: data }))
            .catch((error) => console.error('Error: ', error));
    }


    handleTagsChange = (event, value) => {
        // Update the state immediately
        this.setState({ tags: value });
    }


    handleSubmit = () => {
        // Pass the current state to the parent's `onTagsChange` function
        this.props.onTagsChange(this.state.tags);
    }


    render() {
        return (
            <div className="SearchBox">
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={this.state.userTags.map((option) => option.tag_name)}
                    freeSolo
                    onChange={this.handleTagsChange}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                sx={{
                                    '& .MuiChip-label': { // Target the label class within the Chip
                                        color: 'white', // Set the color to white
                                    },

                                }}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="filled"
                            label="Tags"
                            placeholder="Add Tags here"
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: 'white', // Text color
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'grey', // Label color
                                },
                                '& .MuiFilledInput-root': {
                                    backgroundColor: '#282c34', // Change the background color here
                                    borderTopLeftRadius: '4px', // Round the top corners
                                    borderTopRightRadius: '4px', // Round the top corners
                                    width: '50vw',
                                    '&:before': {
                                        borderBottomColor: '#282c34',
                                    },
                                    '&:after': {
                                        borderBottomColor: '#282c34',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#282c34', // Change the background color on hover (darker shade for example)
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#546e7a', // Change the background color on focus
                                    }
                                }
                            }}
                        />
                    )}
                />

                <Button
                    variant="contained"
                    onClick={this.handleSubmit}
                    sx={{
                        width: '5vw',
                        height: '4vh',
                        marginLeft: '1vw',
                    }}
                >
                    Search
                </Button>
            </div>

        );
    }
}

export default Search