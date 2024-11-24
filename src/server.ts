import express from "express";
import "dotenv/config.js";
import router from "./router";
import { connectDB } from "./config/db";

const app = express();
connectDB();

//* Leer datos de los formularios.
app.use(express.json());

app.use("/", router);

export default app;
