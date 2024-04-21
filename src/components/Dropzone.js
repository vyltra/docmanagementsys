import React, { Component } from "react";
import '../App.css';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from 'react-dropzone';

// this component creates the dropzone
// it has been detached from the upload component, so Upload can be reused in the future as an edit interface

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
                this.props.onDrop(file);
            } else {
                this.setState({ uploadStatus: 1 });
                this.props.onDrop(null);
            }
        } else {
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
