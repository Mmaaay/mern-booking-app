import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import React from "react";
import LatestDestinationCard from "../components/LatestDestinationCard";

const Home = () => {
  const { data: hotels } = useQuery("hotels", () => apiClient.fetchHotels());

  const topRowHotels = hotels?.slice(0, 2) || [];

  const bottomRowHotels = hotels?.slice(2) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-extrabold text-gray-900">Latest Destinations</h2>
      <p className="text-lg text-gray-500">Most recent destinations added</p>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {topRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {bottomRowHotels.map((hotel) => (
            <LatestDestinationCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;