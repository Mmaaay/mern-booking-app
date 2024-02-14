import React from "react";

export type props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: props) => {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center">
      <ul className="flex border border-slate-300">
        {pageNumbers.map((Number) => (
          <li
            className={`px-2 py-1 ${page === Number ? "bg-gray-200" : ""}`}
          ><button onClick={() => onPageChange(Number)}>{Number}</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination
