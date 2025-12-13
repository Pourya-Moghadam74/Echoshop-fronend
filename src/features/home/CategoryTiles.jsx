import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import { Link } from "react-router-dom";

const CATEGORY_URL = "/api/categories/";

export default function CategoryTiles() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(CATEGORY_URL);

        let categoriesData = [];

        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          categoriesData = response.data.results;
        } else if (response.data && typeof response.data === "object") {
          categoriesData =
            Object.values(response.data).filter(Array.isArray)[0] || [];
        }

        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 p-4 mx-4 rounded">
        {error}
      </div>
    );
  }

  const featuredCategories = Array.isArray(categories)
    ? categories.slice(0, 4)
    : [];

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center my-4">
        {featuredCategories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="block w-[250px] rounded shadow bg-white overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-orange-300"
          >
            <div
              className="h-[310px] bg-gray-300 bg-cover bg-center flex items-end justify-center"
              style={{
                backgroundImage: `url(category-${category.id}-bg.jpg)`,
              }}
            >
              <div className="w-full bg-white bg-opacity-50 py-2 text-center">
                <h3 className="text-black font-bold tracking-wide">
                  {category.name.toUpperCase()}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
     </div>
  );
}
