import { Router } from "express";
import * as userController from "./user.controller.js";
import asyncHandler from "express-async-handler";
const router = Router();

router.post("/", asyncHandler(userController.signup));
router.post("/signin", asyncHandler(userController.signin));
router.put("/", asyncHandler(userController.updateAccount));
router.delete("/", asyncHandler(userController.deleteAccount));
router.get("/:_id", asyncHandler(userController.getUserData));

export default router;
