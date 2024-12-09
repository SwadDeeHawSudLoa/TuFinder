"use client";
import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const range = 1; // Number of pages to show before/after the current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Always show the first page
        i === totalPages || // Always show the last page
        (i >= currentPage - range && i <= currentPage + range) // Show surrounding pages
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-4 flex justify-center items-center space-x-1 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className={`rounded px-3 py-2 ${
          currentPage > 1 ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100"
        }`}
        disabled={currentPage <= 1}
      >
        «
      </button>
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`mx-1 rounded px-3 py-2 ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className={`rounded px-3 py-2 ${
          currentPage < totalPages
            ? "bg-gray-200 hover:bg-gray-300"
            : "bg-gray-100"
        }`}
        disabled={currentPage >= totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
