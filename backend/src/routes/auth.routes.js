import Router from "express";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleUpdatePassword,
} from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", verifyJWT, handleLogout);
authRouter.post("/updatepassword", verifyJWT, handleUpdatePassword);

export default authRouter;
