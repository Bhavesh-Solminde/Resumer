import Router from "express";
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
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", verifyJWT, handleLogout);
authRouter.post("/updatepassword", verifyJWT, handleUpdatePassword);
authRouter.put("/updateprofile", verifyJWT, updateProfile);
authRouter.get("/check", verifyJWT, (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Token is valid", user: req.user });
});
authRouter.post("/refresh-token", refreshAccessToken);

// 1. The Route your Button hits (Triggers Google Login Screen)
authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false, // We use JWT, not session
    scope: ["profile", "email"],
  })
);

// 2. The Route Google hits after login (The Callback)
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/auth/login?error=google_failed",
  }),
  handleGoogleCallback
);

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
  handleGoogleCallback // Reusing the same logic!
);

export default authRouter;
