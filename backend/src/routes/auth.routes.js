import Router from "express";
import {
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);

export default authRouter;
