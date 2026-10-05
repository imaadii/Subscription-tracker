import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const auth_router = Router();

// PATH - api/v1/auth/signup
auth_router.post('/signup', signup);

// PATH - api/v1/auth/signin
auth_router.post('/signin', signin);

// PATH - api/v1/auth/signout
auth_router.post('/signout', signout);

export default auth_router;