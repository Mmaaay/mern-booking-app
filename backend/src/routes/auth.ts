import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express, { Request, Response, Router } from "express";
import User from "../models/user";
import verifyToken from "../middleware/auth";
const { checkSchema, validationResult } = require("express-validator");

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    checkSchema({
      email: {
        errorMessage: "Email is required",
        notEmpty: true,
        isEmail: true,
      },
      password: {
        errorMessage: "Password is wrong",
        isLength: { options: { min: 8 } },
      },
    }),
  ],

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

authRouter.get(
  "/validate-token",
  verifyToken,
  (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId });
  }
);

authRouter.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.send()
});

export default authRouter;
