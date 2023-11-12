import React, { useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.entry';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

function PDFRenderImage({ file, onImageReady, desiredDpi = 25 }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);

                getDocument({ data: typedarray }).promise.then(pdf => {
                    pdf.getPage(1).then(function(page) {
                        // assume 72 DPI for PDF internal resolution
                        const internalDpi = 72;
                        const scale = desiredDpi / internalDpi;
                        const viewport = page.getViewport({ scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };

                        page.render(renderContext).promise.then(function() {
                            setImageUrl(canvas.toDataURL());
                            if (onImageReady) onImageReady(canvas.toDataURL());
                        });
                    });
                });
            };

            fileReader.readAsArrayBuffer(file);
        }
    }, [file, onImageReady, desiredDpi]);

    return null;
}

export default PDFRenderImage;
