import Router from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  storeBuiltResume,
  fetchBuildHistory,
  fetchResumeById,
  deleteResume,
} from "../controllers/build.controllers.js";
const buildRouter = Router();

buildRouter.post("/build", verifyJWT, storeBuiltResume);

//send only the thumbnail, title and id
buildRouter.get("/build/history", verifyJWT, fetchBuildHistory);

//fetch the specific built resume thru id and pass it
buildRouter.get("build/:id", verifyJWT, fetchResumeById);

//delete the specific built resume thru id
buildRouter.delete("build/:id", verifyJWT, deleteResume);

export default buildRouter;
