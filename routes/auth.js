import express from "express";
import {login} from "../controllers/auth.js"

const authroutes = express.Router();

authroutes.post("/login", login);

export default authroutes;