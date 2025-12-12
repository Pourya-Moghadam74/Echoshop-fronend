import { useEffect, useState } from "react";
import "./HeroCarousel.css"; // Optional if you want to keep the same file name

const slides = [
  {
    img: "category-1-bg.jpg",
    title: "Shop the Latest Deals",
    text: "Exclusive discounts on top products",
  },
  {
    img: "category-2-bg.jpg",
    title: "New Arrivals",
    text: "Fresh products added weekly",
  },
  {
    img: "category-3-bg.jpg",
    title: "Your Favorite Brands",
    text: "Quality products you can trust",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Caption */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl mt-2 drop-shadow-md">
              {slide.text}
            </p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all
              ${index === current ? "bg-white scale-125" : "bg-white/50"}
            `}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
