import React, {Component} from "react";
import '../App.css'
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

class Dropzone extends Component {



    render(){
        return (
                <div className="UploadBox">
                    <UploadFileIcon className="UploadFileIcon"/>
                    <p>Drag File here to Upload</p>
                    <Button component="label" variant="contained">
                        Select File
                        <VisuallyHiddenInput type="file" />
                    </Button>
                </div>
        )
    }


}



export default Dropzone