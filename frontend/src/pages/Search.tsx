import React, { useState } from "react";
import { useSearchContext } from "../context/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/starRatingFilter";
import HotelTypesFilter from "../components/hotelTypesFilter";
import HotelFacilitiesFilter from "../components/hotelFacilitesFilter";
import PriceFilter from "../components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelFacilities, setSelectedHotelFacilities] = useState<
    string[]
  >([]);
  const [selectedHotelType, setSelectedHotelType] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOptions, setSortOptions] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    facilities: selectedHotelFacilities,
    types: selectedHotelType,
    maxPrice: selectedPrice?.toString(),
    sortOptions,
  };

  const { data: HotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 sticky top-10">
        <div className="space-y-5 ">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleFilterChange(setSelectedStars)}
          />
          <HotelFacilitiesFilter
            selectedHotelFacilities={selectedHotelFacilities}
            onChange={handleFilterChange(setSelectedHotelFacilities)}
          />
          <HotelTypesFilter
            selectedHotelType={selectedHotelType}
            onChange={handleFilterChange(setSelectedHotelType)}
          />
          <PriceFilter
            SelectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {HotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            title="sortOptions"
            value={sortOptions}
            onChange={(event) => setSortOptions(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (Low to High)
            </option>
            <option value="pricePerNightDec">
              Price Per Night (High to Low)
            </option>
          </select>
        </div>
        {HotelData?.data.map((hotel) => (
          <SearchResultsCard hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={HotelData?.pagination.page || 1}
            pages={HotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;

function handleFilterChange(
  setState: React.Dispatch<React.SetStateAction<string[]>>
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetFilter = event.target.value;
    setState((prevState) =>
      event.target.checked
        ? [...prevState, targetFilter]
        : prevState.filter((val) => val !== targetFilter)
    );
  };
}
