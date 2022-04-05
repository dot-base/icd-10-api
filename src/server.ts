import { Express } from "express";
import express from "@/express";
import bodyParser from "body-parser";
import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import ICD10gm from "@/model/ICD10gmCodesystem";

export default class Server {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static get sentryIsEnabled(): boolean {
    return !!process.env.SENTRY_DSN && !!process.env.SENTRY_ENVIRONMENT;
  }

  private static enableSentry(app: Express) {
    if (!Server.sentryIsEnabled) return;
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
    app.use(Sentry.Handlers.errorHandler());
  }

  constructor() {
    this.startApiServer();
  }

  private async startApiServer() {
    express.use(bodyParser.urlencoded({ extended: true }));
    express.use(bodyParser.json());
    express.use(cors());

    Server.enableSentry(express);

    express.listen(Server.port, () => {
      console.log(`Server listening on ${Server.port}`);
    });
  }
}

new Server();
