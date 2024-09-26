import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

export function usePdfGenerateBlob(pdfDocument) {
  useEffect(() => {});
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);
  const generatePdf = () => {
    return pdf(pdfDocument)
      .toBlob()
      .then((blob) => {
        setPdfBlobUrl(() => {
          return URL.createObjectURL(blob);
        });
      });
  };
  return [pdfBlobUrl, setPdfBlobUrl, generatePdf];
}

export const PdfIframe = ({ blob }) => {
  return (
    <>
      {blob && (
        <>
          <iframe
            src={blob}
            title="Generated PDF"
            width="100%"
            height="600px"
            min-height="600px"
            style={{ border: '1px solid #ccc' }}
          />
        </>
      )}
    </>
  );
};

{
  /* <iframe
          src={pdfBlobUrl}
          title="Generated PDF"
          width="80%"
          height="600px"
          style={{ border: '1px solid #ccc' }}
        /> */
}
