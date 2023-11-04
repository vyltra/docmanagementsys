import React, { Component } from "react";
import '../App.css';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import { useDropzone } from 'react-dropzone';

const StyledDropzone = (props) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: props.onDrop,
         // prevent the dropzone from opening the file dialog when clicked
        noKeyboard: true // prevent default keyboard behavior
    });

    return (
        <div {...getRootProps({ className: 'Dropzone' })}>
            <input {...getInputProps()} />
            {props.children}
        </div>
    );
};

class Dropzone extends Component {

    handleDrop = (acceptedFile) => {
        console.log(acceptedFile);
        this.props.onDrop(acceptedFile);
    };

    render() {
        return (
                <StyledDropzone onDrop={this.handleDrop}>
                        <UploadFileIcon className="UploadFileIcon" />
                        <p>Drag file here to upload<br/><br/>
                        or click this field to select</p>
                </StyledDropzone>
        );
    }
}

export default Dropzone;
