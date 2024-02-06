import Hotel, { HotelType } from "./../models/hotel";
import express, { Request, Response } from "express";
import multer from "multer";
import { buffer } from "stream/consumers";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
const { checkSchema } = require("express-validator");

const hotelRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

// api/my-hotels
hotelRouter.post(
  "/",
  verifyToken,
  [
    checkSchema({
      name: { errorMessage: "This field is required", notEmpty: true },
      city: { errorMessage: "This field is required", notEmpty: true },
      country: { errorMessage: "This field is required", notEmpty: true },
      description: { errorMessage: "This field is required", notEmpty: true },
      type: { errorMessage: "This field is required", notEmpty: true },
      adultCount: {
        errorMessage: "This field is required",
        isNumeric: true,
        notEmpty: true,
      },
      childCount: {
        errorMessage: "This field is required",
        isNumeric: true,
        notEmpty: true,
      },
      facilities: {
        errorMessage: "This field is required",
        isArray: true,
        notEmpty: true,
      },
      pricePerNight: {
        errorMessage: "This field is required",
        isNumeric: true,
        notEmpty: true,
      },
      starRating: {
        errorMessage: "This field is required",
        isNumeric: true,
        notEmpty: true,
      },
      imageUrls: {
        errorMessage: "This field is required",
        isArray: true,
        notEmpty: true,
      },
    }),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      //upload images
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      //if upload successful , add data to hotel
      const imageUrls = await Promise.all(uploadPromises);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //add hotel to db
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //return a 201 status
      res.status(201).send(hotel);
    } catch (e) {
      console.log("error creating hotel:", e);
      res.status(500).json({ message: "something went wrong!" });
    }
  }
);

export default hotelRouter;
