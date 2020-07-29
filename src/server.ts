import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helloRouter from "@/routes/hello";
import icd10Router from "@/routes/icd10";
import * as r4Codesystem from "@/model/fhirR4Codesystem"

async function startApiServer(): Promise<void> {
  const app: express.Application = express();
  const port: string = process.env.PORT || "7000";

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  r4Codesystem.ICD10gm.initCodesystem();
  const checkCodesystem: string = r4Codesystem.ICD10gm.codesystemFailed ? "failed" : "succeded";
  console.log(`Loading ICD10gm Codesystem ${checkCodesystem}`);

  app.use("/hello", helloRouter);
  app.use("/icd10", icd10Router);

  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

startApiServer();
