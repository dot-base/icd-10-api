import express from "express";
import { ICD10Controller } from "@/controller/icd10Controller";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  if (req.query.search) {
    try {
      const icd10Res = ICD10Controller.getFiltered(req.query.search as string);
      return res.status(200).send(icd10Res);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }
  return res.status(400).send("no query component 'search' present").end();
});

export default router;
