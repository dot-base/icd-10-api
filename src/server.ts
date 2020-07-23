import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helloRouter from "@/routes/hello";

async function startApiServer(): Promise<void> {
  const app: express.Application = express();
  const port: string = process.env.PORT || "3000";

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

  app.use("/hello", helloRouter);

  app.listen(port);
  console.log(`Server is listening on port ${port}`);
}

startApiServer();
