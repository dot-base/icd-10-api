import express from "@/express";
import bodyParser from "body-parser";

export default class Server {
  private static get port(): string {
    return process.env.PORT || "3000";
  }

  private static setDefaultEnvironmentVariables() {
    process.env.MAX_SEARCH_WORDS = process.env.MAX_SEARCH_WORDS ?? "6";
  }

  constructor() {
    this.startApiServer();
  }

  private async startApiServer() {
    express.use(bodyParser.urlencoded({ extended: true }));
    express.use(bodyParser.json());

    Server.setDefaultEnvironmentVariables();

    express.listen(Server.port, () => {
      console.log(`Server is listening on ${Server.port}`);
    });
  }
}

new Server();
