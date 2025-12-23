import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  storeBuiltResume,
  fetchBuildHistory,
} from "../controllers/build.controllers.js";
const buildRouter = Router();

buildRouter.post("/build", verifyJWT, storeBuiltResume);

buildRouter.post("/build/history", verifyJWT, fetchBuildHistory);

export default buildRouter;
