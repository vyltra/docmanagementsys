const fs = require('fs');
const pdfjs = require('pdfjs-dist');

const { fromPath } = require("pdf2pic");



const options = {
    density: 100,
    saveFilename: "untitled",
    savePath: "./images",
    format: "png",
    width: 600,
    height: 600
};
const convert = fromPath("./abstract.pdf", options);
const pageToConvertAsImage = 1;

convert(pageToConvertAsImage, { responseType: "image" })
    .then((resolve) => {
        console.log("Page 1 is now converted as image");

        return resolve;
    });

