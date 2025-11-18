import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth-routes";
import systemStackRouter from "./routes/system-stack-routes";
import projectRouter from "./routes/project-routes";

const app = express();

// Middleware to log request
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // your frontend
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/system-stacks", systemStackRouter);
app.use("/api/projects", projectRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the SopraSpec Backend API!");
});

export default app;
