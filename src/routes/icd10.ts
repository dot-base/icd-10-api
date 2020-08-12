import express from "express";
import * as icd10 from "../services/filter";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const str = JSON.parse(JSON.stringify(req.query));
    const icd10Res: string | JSON = await icd10.getFiltered(str.search ? str.search : "");

    res.status(200).send(icd10Res);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default router;
