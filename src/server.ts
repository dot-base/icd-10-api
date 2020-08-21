import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import icd10Router from "@/routes/icd10";
import ICD10gm from "@/model/ICD10gmCodesystem";

async function startApiServer(): Promise<void> {
  const app: express.Application = express();
  const port: string = process.env.PORT || "7000";

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  try {
    ICD10gm.getInstance();
    console.log("Loading and prefiltering ICD10gm Codesystem succeded");
  } catch (error) {
    throw error;
  }

  app.use("/icd10", icd10Router);

  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

startApiServer();
