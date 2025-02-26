import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  setPageNo: (pageNo: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageNo,
  totalPages,
  setPageNo,
}) => {
  const maxVisiblePages = 5;

  let startPage = Math.max(1, pageNo - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  startPage = Math.max(1, startPage);
  endPage = Math.min(totalPages, endPage);

  return (
    <div className=" flex justify-between items-center mt-4">
      <div className=" flex items-center ">
        {" "}
        <label htmlFor="">Page</label>
        <input
          value={pageNo}
          onChange={(e) => setPageNo(+e.target.value)}
          type="number"
          name=""
          id=""
          min={1}
          max={totalPages}
          className=" text-[14px] px-2 py-1 w-[60px] outline-none border-[1px] rounded-md  border-gray-300 ml-2"
        />
      </div>
      <div className="flex items-center justify-center space-x-2 ">
        <button
          onClick={() => setPageNo(pageNo - 1)}
          disabled={pageNo === 1}
          className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            onClick={() => setPageNo(page)}
            className={`px-4 py-1 rounded-md transition-all duration-200 ${
              page === pageNo
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setPageNo(pageNo + 1)}
          disabled={pageNo === totalPages}
          className="px-3 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
