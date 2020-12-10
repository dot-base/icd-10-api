import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import icd10Router from "@/routes/icd10";
import ICD10gm from "@/model/ICD10gmCodesystem";

async function startApiServer(): Promise<void> {
  const app: express.Application = express();
  const port: string = process.env.PORT || "3000";

  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  try {
    ICD10gm.getInstance();
    console.log("Loading and prefiltering ICD10gm Codesystem succeded");
  } catch (error) {
    throw error;
  }

  app.use("/api/icd10", icd10Router);

  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
  }

  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

startApiServer();
