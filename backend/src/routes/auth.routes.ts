import { Router, Request, Response } from "express";
import passport from "passport";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleUpdatePassword,
  refreshAccessToken,
  handleGoogleCallback,
  updateProfile,
} from "../controllers/auth.controllers.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";
// Type augmentation from ../types/express.d.ts is applied globally

const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", verifyJWT, handleLogout);
authRouter.post("/updatepassword", verifyJWT, handleUpdatePassword);
authRouter.put("/updateprofile", verifyJWT, updateProfile);

authRouter.get("/check", verifyJWT, (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Token is valid", { user: req.user }));
});

authRouter.post("/refresh-token", refreshAccessToken);

// OAuth: Google
authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/auth/login?error=google_failed",
  }),
  handleGoogleCallback
);

// OAuth: GitHub
authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/auth/login?error=github_failed",
    session: false,
  }),
  handleGoogleCallback
);

export default authRouter;
