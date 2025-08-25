import pdfkit from "pdfkit";
import BlobStream from "blob-stream";

// TODO: Turn this into a proper service with error handling and logging
// TODO: Modularise the PDF generation to make the spec generation more dynamic.

interface System {
  name: string;
  description: string;
  products: string[];
}
export const GenerateSpec = async (): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new pdfkit();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.text("Hello, this is a sample PDF document created using pdfkit.");
    doc.end();
  });
};
