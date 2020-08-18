import express from "express";
import * as icd10 from "../controller/icd10Controller";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  const str = JSON.parse(JSON.stringify(req.query));
  if (str.search) {
    try {
      const icd10Res: JSON = await icd10.getFiltered(str.search);
      res.status(200).send(icd10Res);
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else res.status(400).send("no search params defined");
});

export default router;
