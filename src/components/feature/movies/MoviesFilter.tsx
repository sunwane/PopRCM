"use client";

import { useEffect, useState } from "react";
import { useFilterOptions } from "@/hooks/useFilter";
import { getMovieTypesText, getStatusText } from "@/utils/getText";
import { useRouter } from "next/navigation";

export interface MoviesFilterProps {
  query?: string;
  typeProps?: string;
  genresProps?: string[];
  countryProps?: string;
  languageProps?: string;
  yearProps?: string;
  statusProps?: string;
  sortByProps?: string;
}

export default function MoviesFilter({
  query = "",
  typeProps = "Tất cả",
  genresProps = [],
  countryProps = "Tất cả",
  languageProps = "Tất cả",
  yearProps = "",
  statusProps = "Tất cả",
  sortByProps = "Mới cập nhật",
}:  MoviesFilterProps) {
  const [isActive, setIsActive] = useState(false);
  const route = useRouter();

  // Gọi useFilter trực tiếp ở top level của component
  const {
    countries,
    allgenres,
    languages,
    types,
    statuses,
    sortOptions,
    country,
    genres,
    language,
    type,
    year,
    status,
    sortBy,
    updateCountry,
    updateType,
    updateGenres,
    updateLanguage,
    updateYear,
    updateStatus,
    updateSortBy,
  } = useFilterOptions();

  useEffect(() => {
    // Khởi tạo giá trị bộ lọc từ props
    updateType(typeProps);
    genresProps.forEach((genreName) => {
      const genre = allgenres.find((g) => g.genresName === genreName);
      if (genre) {
        updateGenres(genre);
      }
    });
    const countryObj = countries.find((c) => c.name === countryProps);
    if (countryObj) {
      updateCountry(countryObj);
    }
    updateLanguage(languageProps);
    updateYear(yearProps || null);
    updateStatus(statusProps);
    updateSortBy(sortByProps);

    console.log("countryProps:", countryProps);
    console.log("genresProps:", genresProps);

  }, []);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="inline-block">
      {/* Button */}
      <button
        className={`flex items-center px-2 transition bg-(--background) ${
          isActive ? "text-(--hover) absolute left-8" : "text-white"
        }`}
        onClick={handleClick}
      >
        <img
          src={isActive ? "/icons/FilterOnFocus.png" : "/icons/Filter.png"}
          alt=""
          className="w-4.5 h-4.5 inline-block mr-1.5"
        />
        <div className="text-[15px] font-bold">Bộ lọc</div>
      </button>

      {/* Filter Content */}
      {isActive && (
        <div className="mt-3 pt-3 px-6 pb-2 border border-[#939393] rounded-2xl">
          <table className="w-full text-white border-collapse text-sm">
            <tbody>
              {/* Quốc gia */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Quốc gia:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      country.name === "Tất cả" ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                    }`}
                    onClick={() => updateCountry({id:"all", name: "Tất cả"})}
                  >
                    Tất cả
                  </button>
                  {countries.map((countryItem) => (
                    <button
                      key={countryItem.id}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        country === countryItem ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                      }`}
                      onClick={() => updateCountry(countryItem)}
                    >
                      {countryItem.name}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Phân loại */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Phân loại:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      type === "Tất cả" ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                    }`}
                    onClick={() => updateType("Tất cả")}
                  >
                    Tất cả
                  </button>
                  {types.map((typeItem, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        typeItem === type ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                      }`}
                      onClick={() => updateType(typeItem)}
                    >
                      {getMovieTypesText(typeItem)}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Thể loại */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Thể loại:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      genres.some((genre) => genre.id !== "all")
                      ? "" : "bg-white/10 text-(--hover) border-2 border-(--hover)/30"
                    }`}
                    onClick={() => updateGenres({id: "all",genresName: "Tất cả"})}
                  >
                    Tất cả
                  </button>
                  {allgenres.map((genreItem) => (
                    <button
                      key={genreItem.id}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        genres.some((selectedGenre) => selectedGenre.id === genreItem.id)
                          ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30"
                          : ""                      }`}
                      onClick={() => updateGenres(genreItem)}
                    >
                      {genreItem.genresName}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Ngôn ngữ */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Ngôn ngữ:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      language === "Tất cả" ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                    }`}
                    onClick={() => updateLanguage("Tất cả")}
                  >
                    Tất cả
                  </button>
                  {languages.map((lang, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        language === lang ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                      }`}
                      onClick={() => updateLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Năm sản xuất */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Năm sản xuất:</td>
                <td className="flex flex-wrap gap-2.5 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      !year ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                    }`}
                    onClick={() => updateYear(null)}
                  >
                    Tất cả
                  </button>
                  <div className="relative flex grow items-center">
                    <input
                      type="text"
                      placeholder="Nhập năm"
                      value={year || ""}
                      onChange={(e) => updateYear(e.target.value || null)}
                      className="w-40 pl-9 pr-3 py-2 text-sm placeholder-sm font-light bg-white/15 
                        rounded-md text-white/80 placeholder-white/50 placeholder:font-light 
                        focus:outline-none focus:ring-1 focus:ring-(--hover) focus:bg-white/25 
                        transition tracking-wider"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white/80 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </td>
              </tr>

              {/* Trạng thái */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Trạng thái:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  <button
                    className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                      status === "Tất cả" ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                    }`}
                    onClick={() => updateStatus("Tất cả")}
                  >
                    Tất cả
                  </button>
                  {statuses.map((stat, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        status === stat ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                      }`}
                      onClick={() => updateStatus(stat)}
                    >
                      {getStatusText(stat)}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Sắp xếp theo */}
              <tr className="border-b border-(--surface-divine)">
                <td className="py-4 px-4 font-bold min-w-[12vw] align-top">Sắp xếp theo:</td>
                <td className="flex flex-wrap gap-2 py-2 px-4">
                  {sortOptions.map((option, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-md hover:text-(--hover) transition ${
                        sortBy === option ? "bg-white/10 text-(--hover) border-2 border-(--hover)/30" : ""
                      }`}
                      onClick={() => updateSortBy(option)}
                    >
                      {option}
                    </button>
                  ))}
                </td>
              </tr>

              {/* Buttons */}
              <tr>
                <td className="py-2 px-4 font-bold"></td>
                <td className="flex gap-2 pt-4 pb-6 px-4">
                  <button
                    className="px-4 py-2 bg-(--hover) rounded-lg text-black hover:bg-(--text-highlight) hover:text-white transition"
                    onClick={() => {
                      route.replace("/filterResult/?"+ new URLSearchParams({
                        query: query || "",
                        country: country.id !== "all" ? country.id : "",
                        genres: genres.length > 0 ? genres.map(g => g.id).join(",") : "",
                        type: type !== "Tất cả" ? type : "",
                        language: language !== "Tất cả" ? language : "",
                        year: year || "",
                        status: status !== "Tất cả" ? status : "",
                        sortBy: sortBy !== "Mới cập nhật" ? sortBy : "",
                      }).toString());
                    }}
                  >
                    Áp dụng
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                    onClick={() => {
                      // Reset tất cả filter
                      updateCountry({id:"all", name:"Tất cả"});
                      updateType("Tất cả");
                      updateGenres({id:"all", genresName:"Tất cả"});
                      updateLanguage("Tất cả");
                      updateYear(null);
                      updateSortBy("Mới cập nhật");
                    }}
                  >
                    Đặt lại
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                    onClick={handleClick}
                  >
                    Đóng
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}