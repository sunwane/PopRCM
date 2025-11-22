import { useState, useEffect } from "react";
import { CountryService } from "@/services/CountryService";
import { Country } from "@/types/Country";

export function useCountryData() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await CountryService.getAllCountries();
        setAllCountries(countries);
      } catch (err) {
        setError("Lỗi khi tải danh sách quốc gia");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const findCountryById = (id: string): Country | null => {
    return allCountries.find(country => country.id === id) || null;
  };

  return {
    allCountries,
    loading,
    error,
    findCountryById
  };
}