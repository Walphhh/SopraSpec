import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware to log request
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the SopraSpec Backend API");
});

export default app;
