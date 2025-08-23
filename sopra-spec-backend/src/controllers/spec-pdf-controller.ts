import { GenerateSpec } from "@src/services/spec-pdf-service";
import { Status, getStatusMessage } from "@src/utils/status-codes";
import { Request, Response } from "express";

/** Generates a PDF document and opens it in a new tab.
 * @param req -
 * @param res -
 */
export const generatePdf = async (req: Request, res: Response) => {
  try {
    const pdfBuffer = await GenerateSpec();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=spec.pdf");
    res.send(pdfBuffer).status(Status.SUCCESS);
  } catch (err) {
    console.error(err);
    res.status(Status.INTERNAL_SERVER_ERROR).send("Failed to generate PDF");
  }
};
