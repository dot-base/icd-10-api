import express from "express";
import { ICD10Controller } from "@/controller/icd10";
import HTTPError from "@/utils/HTTPError";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  if (!req.query.search) 
    return res.status(400).send("Request is missing a query parameter 'search'.").end();
  
  try {
    const icd10Codes = ICD10Controller.getFiltered(req.query.search as string);
    return res.status(200).send(icd10Codes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if(e instanceof HTTPError) 
      res.status(e.status).send(e.message);
    else
      res.status(500).send(e.message);
  }
  
});

export default router;
