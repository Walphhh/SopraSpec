# Backend Documentation

This folder contains the Express.js backend for the project.  
All source code lives in `src/` and follows a modular, feature-based structure.

---

## Directory Overview

### `/config`

Contains configuration files for global settings.

- `db-config.ts` → Database connection setup
- `env-config.ts` → Environment variable loading & validation

**Purpose:** Centralize all environment and system configuration.

---

### `/routes`

Defines all API endpoints and connects them to controllers.

- `user-routes.ts` → Routes for `/users`
- `auth-routes.ts` → Routes for `/auth`

**Purpose:** Map URLs to controller functions.

### _Code Snippet Example_

```ts
import { Router } from "express";
import { getUsers, createUser } from "../controllers/user-controller";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);

export default router;
```

---

### `/controllers`

Handles HTTP requests and responses.

- Extracts parameters from the request
- Calls the appropriate service
- Sends the final response

**Purpose:** Orchestrates the request → service → response flow.

### _Code Snippet Example_

```ts
import { Request, Response } from "express";
import * as userService from "../services/user-service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};
```

---

### `/services`

Contains business logic and database operations.

- Talks to `models` for data retrieval
- Performs calculations, transformations, or validations

**Purpose:** Keeps controllers lean and reusable.

### _Code Snippet Example_

```ts
import User from "../models/user-model";

export const getAllUsers = async () => {
  return User.find();
};

export const createUser = async (data: { name: string; email: string }) => {
  return User.create(data);
};
```

---

### `/models`

Database schemas and ORM models.

- `user-model.ts` → User table/schema definition

**Purpose:** Defines how data is stored in the database.

### _Code Snippet Example_

```ts
import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model("User", userSchema);
```

---

### `/middlewares`

Express middleware functions.

- `auth-middleware.ts` → Verifies user authentication
- `error-middleware.ts` → Centralized error handler

**Purpose:** Reusable request/response interceptors.

### _Code Snippet Example_

```ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt-util";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(403).json({ message: "Forbidden" });
  }
};
```

---

### `/utils`

Helper functions and utilities.

- `jwt-util.ts` → JWT token signing/verification
- `password-util.ts` → Hash/compare passwords

**Purpose:** General-purpose utilities used across the app.

### _Code Snippet Example_

```ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "devsecret";

export const signToken = (payload: object) =>
  jwt.sign(payload, SECRET, { expiresIn: "1h" });

export const verifyToken = (token: string) => jwt.verify(token, SECRET);
```

---

### `app.ts`

Configures the Express app:

- Sets up middleware
- Registers routes
- Attaches error handling

### _Code Snippet Example_

```ts
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

export default app;
```

---

### `server.ts`

Application entry point:

- Starts the server
- Handles shutdown signals

### _Code Snippet Example_

```ts
import app from "./app";
import { connectDB } from "./config/db-config";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
```

## Modularising Methods

To keep our code organised and prevent naming collisions, related functions are grouped into a single object.  
This works like a **feature-based namespace** — all methods for a specific domain (e.g., `User`) live together.

### Example

#### Declaration

```ts
// services/user-service.ts
export const UserService = {
  async getUser(id: string) {
    return UserModel.findById(id);
  },

  async getUserId(email: string) {
    const user = await UserModel.findOne({ email });
    return user?.id;
  },
};
```

#### Usage

```ts
import { UserService } from "../services/user-service";

const user = await UserService.getUser("123");
const userId = await UserService.getUserId("test@example.com");
```

### Benefits

1. Logical grouping – All user-related operations are in one object.
2. Cleaner imports – Import one object instead of multiple separate functions.
3. Avoids name clashes – No getUser from two different modules overwriting each other.
4. Easier to extend – Add new methods without touching multiple exports.

### When to Use

- For services, utilities, or feature-specific logic that share a domain.
- When you want a clear mental model:
  - `UserService.doThing()`,
  - `AuthService.doThing()`,
  - `PostService.doThing()`.

## Documentation Guidelines

Use JSDoc comments for every method.

Include:

- A short description of the method
- Parameter names, types, and descriptions
- The return type and what it represents
- Keep comments up-to-date when changing method logic.
- If a method is complex, note side effects, error cases, and expected data shape.

  Example:

```ts
/**
 * Deletes a user by ID.
 * @param id - The ID of the user to delete.
 * @returns A boolean indicating if the user was deleted successfully.
 * @throws {Error} If the user does not exist.
 */
async deleteUser(id: string): Promise<boolean> { ... }
```
