import { useState, useEffect } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage 
}: PaginationProps) {
  const [inputValue, setInputValue] = useState((currentPage || 1).toString());

  // Update input value when currentPage changes
  useEffect(() => {
    setInputValue((currentPage || 1).toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(inputValue);
      if (!isNaN(page) && page >= 1 && page <= (totalPages || 1)) {
        onPageChange(page);
      } else {
        setInputValue((currentPage || 1).toString()); // Reset invalid input
      }
    }
  };

  const handleInputBlur = () => {
    const page = parseInt(inputValue);
    if (!isNaN(page) && page >= 1 && page <= (totalPages || 1)) {
      onPageChange(page);
    } else {
      setInputValue((currentPage || 1).toString()); // Reset invalid input
    }
  };

  const handlePrevious = () => {
    if (hasPrevPage && currentPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && currentPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center space-x-2 my-8">
      <button
        onClick={handlePrevious}
        disabled={!hasPrevPage}
        className={`px-4 py-3 rounded-full justify-center flex items-center transition-colors ${
          hasPrevPage 
            ? 'bg-(--surface)/50 cursor-pointer hover:bg-(--surface)' 
            : 'bg-gray-600/30 cursor-not-allowed opacity-50'
        }`}
      >
        <img src="/icons/Left.png" alt="previous" className="w-5 h-5" />
      </button>
      
      <div className="bg-(--surface)/50 flex items-center space-x-2 px-6 py-3 rounded-3xl text-[13px]">
        <div>Trang</div>
        <input 
          type="number" 
          className="border-2 border-white/20 rounded-md max-w-20 py-0.5 pl-3 text-white bg-transparent" 
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          onBlur={handleInputBlur}
          min={1}
          max={totalPages || 1}
        />
        <div>/ {totalPages || 1}</div>
      </div>
      
      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className={`px-4 py-3 rounded-full justify-center flex items-center transition-colors ${
          hasNextPage 
            ? 'bg-(--surface)/50 cursor-pointer hover:bg-(--surface)' 
            : 'bg-gray-600/30 cursor-not-allowed opacity-50'
        }`}
      >
        <img src="/icons/Right.png" alt="next" className="w-5 h-5" />
      </button>
    </div>
  );
}