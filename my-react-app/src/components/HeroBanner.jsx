import React from "react";
import { Carousel } from "react-bootstrap";
import "./HeroCarousel.css";

const HeroBanner = () => {
  return (
    <Carousel fade interval={3500} className="hero-carousel">

      {/* Slide 1 */}
      <Carousel.Item>
        <img
          className="d-block w-100 hero-img"
          src="category-1-bg.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h1 className="hero-title">Shop the Latest Deals</h1>
          <p className="hero-text">Exclusive discounts on top products</p>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 2 */}
      <Carousel.Item>
        <img
          className="d-block w-100 hero-img"
          src="category-2-bg.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1 className="hero-title">New Arrivals</h1>
          <p className="hero-text">Fresh products added weekly</p>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 3 */}
      <Carousel.Item>
        <img
          className="d-block w-100 hero-img"
          src="category-3-bg.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1 className="hero-title">Your Favorite Brands</h1>
          <p className="hero-text">Quality products you can trust</p>
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>
  );
};

export default HeroBanner;
