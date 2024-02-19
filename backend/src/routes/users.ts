import express, { Request, Response, Router } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
const { checkSchema, validationResult } = require("express-validator");
const userRouter = express.Router();

userRouter.post(
  "/register",
  [
    checkSchema({
      email: { errorMessage: "Must be valid Email", isEmail: true },
      password: {
        errorMessage: "password must be at least 8 character long",
        notEmpty: true,
        isLength: { options: { min: 8 } },
      },
      firstName: { notEmpty: true },
      lastName: { notEmpty: true },
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

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
      return res.status(200).send({ message: "Registration complete" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

userRouter.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(400).json({ message: "user not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

export default userRouter;
