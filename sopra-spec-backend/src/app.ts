import express from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import authRouter from "./routes/auth-routes";
import selectionRouter from "./routes/selection-routes";

const app = express();

// Middleware to log request
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/api/auth", authRouter);
app.use("/api/selection", selectionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the SopraSpec Backend API!");
});

export default app;
