import React, { Component } from "react";
import '../App.css';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import { useDropzone } from 'react-dropzone';

const StyledDropzone = (props) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: props.onDrop,
         // prevent the dropzone from opening the file dialog when clicked
        noKeyboard: true, // prevent default keyboard behavior
        accept: 'application/pdf'
    });

    return (
        <div {...getRootProps({ className: 'Dropzone' })}>
            <input {...getInputProps()} />
            {props.children}
        </div>
    );
};

class Dropzone extends Component {

    state = {
        uploadStatus: 0, //0 = wait for upload / 1 = rejected / 2 = accepted
        filename: null
    };

    handleDrop = (acceptedFiles) => {
        // Check if any files were accepted
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            // Check if the file type is pdf
            if (file.type === 'application/pdf') {
                this.setState({
                    uploadStatus: 2,
                    filename: file.name
                });

                // Pass the file as a blob to the parent component
                this.props.onDrop(file);
            } else {
                this.setState({ uploadStatus: 1 });
                // Call the parent component function with null or handle error as needed
                this.props.onDrop(null);
            }
        } else {
            // No files were accepted
            this.setState({ uploadStatus: 1 });
            this.props.onDrop(null);
        }
    };

    render() {
        return (
                <StyledDropzone onDrop={this.handleDrop}>
                        <UploadFileIcon className="UploadFileIcon" />

                    {this.state.uploadStatus === 0 && (
                        <p>Drag file here to upload<br/><br/>
                            or click this field to select</p>
                    )}
                    {this.state.uploadStatus === 1 && (
                        <p className="warning-message">Only PDF files are accepted. Please try again.</p>
                    )}
                    {this.state.uploadStatus === 2 && (
                        <p className="warning-message">{this.state.filename}</p>
                    )}

                </StyledDropzone>
        );
    }
}

export default Dropzone;
