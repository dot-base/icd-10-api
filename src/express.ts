import express from "express";
import ICD10Router from "@/routers/icd10";


const app = express();

app.use(express.json());

app.use("/api/icd10", ICD10Router);

export default app;
