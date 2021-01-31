import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import icd10Router from "@/routes/icd10";
import ICD10gm from "@/model/ICD10gmCodesystem";
import logger from "@/logger";

class Icd10Api {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static get sentryIsEnabled(): boolean {
    return !!process.env.SENTRY_DSN && !!process.env.SENTRY_ENVIRONMENT;
  }

  private async startApiServer() {
    const app: express.Application = express();

    if (Icd10Api.sentryIsEnabled) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
        environment: process.env.SENTRY_ENVIRONMENT,
      });

      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());

    app.use("/api/icd10", icd10Router);

    if (Icd10Api.sentryIsEnabled) {
      app.use(Sentry.Handlers.errorHandler());
    }

    app.listen(Icd10Api.port, () => {
      logger.info(`Server listening on ${Icd10Api.port}`);
    });
  }

  constructor() {
    ICD10gm.getInstance();
    this.startApiServer();
  }
}

new Icd10Api();
