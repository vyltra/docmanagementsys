import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

// If you want to use a worker, set the worker source to the imported worker file
GlobalWorkerOptions.workerSrc = pdfjsWorker;

function PDFRenderImage({ file, onImageReady }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);

                getDocument({ data: typedarray }).promise.then(pdf => {
                    pdf.getPage(1).then(function(page) {
                        const scale = 0.5;
                        const viewport = page.getViewport({ scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext).promise.then(function() {
                            // Adjust the canvas to the desired size and get the data URL
                            const thumbnailCanvas = document.createElement('canvas');
                            thumbnailCanvas.width = 200;
                            thumbnailCanvas.height = 100;
                            const ctx = thumbnailCanvas.getContext('2d');
                            ctx.scale(200 / viewport.width, 100 / viewport.height);
                            ctx.drawImage(canvas, 0, 0);
                            const imageDataUrl = thumbnailCanvas.toDataURL();

                            setImageUrl(imageDataUrl);
                            if (onImageReady) onImageReady(imageDataUrl);
                        });
                    });
                });
            };

            fileReader.readAsArrayBuffer(file);
        }
    }, [file, onImageReady]);

    return null // Now it only returns the image URL
}

export default PDFRenderImage;
