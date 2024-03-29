import Hotel from "./../models/hotel";
import { HotelType } from "../shared/types";
import express, { Request, Response } from "express";
import multer from "multer";
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
      const imageUrls = await uploadImages(imageFiles);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      //add hotel to db
      const hotel = new Hotel(newHotel);
      await hotel.save();

      //return a 201 status
      res.status(201).send(hotel);
    } catch (e) {
      res.status(500).json({ message: "something went wrong!" });
    }
  }
);

hotelRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "error fetching hotels" });
  }
});

hotelRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "error fetching hotel" });
  }
});

hotelRouter.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );
      if (!hotel) {
        return res.status(404).json({ message: "Hotel Not Found" });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImagesUrls = await uploadImages(files);
      hotel.imageUrls = [
        ...updatedImagesUrls,
        ...(updatedHotel.imageUrls || []),
      ];
      await hotel.save();
      res.status(201).json(hotel)
    } catch (error) { res.status(500).json({ message: "something went wrong!" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  //if upload successful , add data to hotel
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default hotelRouter;
