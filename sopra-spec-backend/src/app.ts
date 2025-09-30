import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth-routes";
import projectRouter from "./routes/project-routes";

const app = express();

// Middleware to log request
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the SopraSpec Backend API!");
});

export default app;
