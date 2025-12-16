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
authRouter.get("/check", verifyJWT, (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Token is valid", user: req.user });
});
export default authRouter;
