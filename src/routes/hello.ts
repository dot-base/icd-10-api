import express from "express";

const router: express.Router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  res.send("hello");
});

export default router;
