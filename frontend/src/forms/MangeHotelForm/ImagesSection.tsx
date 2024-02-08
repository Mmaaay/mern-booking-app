import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import React from "react";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const exisitingImagesUrls = watch("imageUrls");

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      exisitingImagesUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rouned p-4 flex flex-col gap-4">
        {exisitingImagesUrls && (
          <div className="grid grid-cols-6 gap-4">
            {exisitingImagesUrls.map((img) => (
              <div key={img} className="relative group">
                <img
                  key={img}
                  src={img}
                  alt={img}
                  className="min-h-full object-cover"
                />
                <button
                  onClick={(event) => handleDelete(event, img)}
                  key={img}
                  className="absolute inset-0 w-full flex  justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imagefiles) => {
              const totalLength = imagefiles.length + (exisitingImagesUrls?.length || 0);

              if (totalLength === 0) {
                return "Upload at least one image";
              }
              if (totalLength > 6) {
                return "Total image count can not be more than 6";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 font-bold text-sm">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
