import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageackground,
  removeObject,
  resumeReview,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog-title", auth, generateBlogTitle);
aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post(
  "/remove-image-background",
  upload.single("image"),
  auth,
  removeImageackground
);
aiRouter.post(
  "/remove-image-object",
  upload.single("image"),
  auth,
  removeObject
);
aiRouter.post("/review-resume", upload.single("resume"), auth, resumeReview);

export default aiRouter;
