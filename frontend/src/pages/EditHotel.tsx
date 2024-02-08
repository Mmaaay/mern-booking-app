import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";
import * as apiClient from "../api-client.ts";
import ManageHotelForm from "../forms/MangeHotelForm/ManageHotelForm.tsx";
import React from "react";
import { useAppContext } from "../context/AppContext.tsx";

const EditHotel = () => {
  const { hotelId } = useParams();
  const {showToast} = useAppContext()
  const { mutate , isLoading} = useMutation(apiClient.updateMyHotelById , {
    onSuccess :  ()=>showToast({message:"Hotel Saved!" , type:"SUCCESS"}),
    onError : () => {}
  })

  const handleSave = (hotelFormData : FormData) => {
    mutate(hotelFormData)
  }

  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );
  return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading = {isLoading}/>;
};

export default EditHotel;
