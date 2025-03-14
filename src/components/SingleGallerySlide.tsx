import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Gallery } from "../types/types";
import "../style/SingleGallerySlide.scss";
import iconBackButton from "../assets/images/icon-back-button.svg";
import iconNextButton from "../assets/images/icon-next-button.svg";
import ModalImage from "./ModalImage";
import { motion, AnimatePresence } from "framer-motion";

interface SingleGallerySlideProps {
  gallery: Gallery[];
  startSlider: boolean;
  sliderButtonRef: React.RefObject<HTMLButtonElement>;
}

const SingleGallerySlide: React.FC<SingleGallerySlideProps> = ({
  gallery,
  startSlider,
  sliderButtonRef,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { slug } = useParams<{ slug: string }>(); // Określenie typu parametru

  const [id, setId] = useState(parseInt(slug!, 10)); //! oznacza, że slug nie jest undefined (dla TypScript)
  const [item, setItem] = useState(gallery[id]);

  const handlePreviousSlideClick = () => {
    setId((prevId) => {
      const newId = (prevId - 1 + gallery.length) % gallery.length; //działa podobnie jak w handleNextSlideClick
      setItem(gallery[newId]);
      return newId;
    });
  };

  const handleNextSlideClick = useCallback(() => {
    setId((prevId) => {
      const newId = (prevId + 1) % gallery.length;
      setItem(gallery[newId]);
      return newId;
    });
  }, [gallery]); // W zależności gdyby zmiany nastąpiły w gallery

  //Slider z interwałem
  useEffect(() => {
    if (startSlider) {
      const sliderInterval = setInterval(() => {
        handleNextSlideClick();
      }, 10000);

      return () => clearInterval(sliderInterval);
    }
  }, [startSlider, handleNextSlideClick]);

  //Jeśli nie ma slide z danym id np. slide/234 wtedy blokada przycisku odpowiedzialnego za slidera
  useEffect(() => {
    if (!item) {
      sliderButtonRef.current && (sliderButtonRef.current.disabled = true);
    }
  }, [item, sliderButtonRef]);

  if (!item) {
    return (
      <div className="gallery-slider-error">
        <h2>Slide does not exist</h2>
        <span>
          Return to{" "}
          <Link to="/" className="errorLink">
            main page
          </Link>
        </span>
      </div>
    ); // Gdy nie ma żadnego elementu (powiedzmy w adresie wyszukiwania będzie numer większy niż ilość elementów w galerii)
  }

  return (
    <>
      {isModalOpen && (
        <ModalImage image={item.images.gallery} closeModal={closeModal} />
      )}
      <div className="gallery-slide-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={id}
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gallery-slide-artwork-container wrapper"
          >
            <div className="gallery-slide-artwork-image-container">
              <div className="gallery-slide-image-container">
                <div className="gallery-slide-view-image-container">
                  <button
                    className="gallery-slide-view-image-container__button"
                    onClick={openModal}
                  >
                    View Image
                  </button>
                </div>
                <picture className="gallery-slide-image-container__picture">
                  <source
                    media="(min-width: 768px)"
                    srcSet={process.env.VITE_BASE_URL + item.images.hero.large}
                  />
                  <img
                    className="gallery-slide-image-container__artwork"
                    src={process.env.VITE_BASE_URL + item.images.hero.small}
                    alt={item.name}
                  />
                </picture>
                <motion.div
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1 }}
                  className="gallery-slide-artwork-name-container"
                >
                  <h3 className="gallery-slide-artwork-name-container__name">
                    {item.name}
                  </h3>
                  <span className="gallery-slide-artwork-name-container__artist">
                    {item.artist.name}
                  </span>
                  <img
                    className="gallery-slide-artwork-name-container__artist-image"
                    src={process.env.VITE_BASE_URL + item.artist.image}
                    alt={item.name}
                    width={128}
                    height={128}
                  />
                </motion.div>
              </div>
              <img
                className="gallery-slide-image-container__artist"
                src={process.env.VITE_BASE_URL + item.artist.image}
                alt={item.name}
                width={64}
                height={64}
              />
            </div>
            <div className="gallery-slide-artwork-description-container">
              <span className="gallery-slide-artwork-description-container__year">
                {item.year}
              </span>
              <p className="gallery-slide-artwork-description-container__description">
                {item.description}
              </p>
              <div className="gallery-slide-artwork-description-container__link-container">
                <a
                  href={item.source}
                  target="_blank"
                  className="gallery-slide-artwork-description-container__link linkSource"
                >
                  Go to source
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="gallery-slide-slider-container">
          <div
            style={{
              width: `${(100 / gallery.length) * (id + 1)}%`,
            }}
            className="gallery-slide-slider-container__progress-bar"
          ></div>

          <div className="gallery-slide-slider-artwork-and-buttons-container wrapper">
            <div className="gallery-slide-slider-artwork-name-container">
              <span className="gallery-slide-slider-artwork-name-container__name">
                {item.name}
              </span>
              <span className="gallery-slide-slider-artwork-name-container__artist">
                {item.artist.name}
              </span>
            </div>
            <div className="gallery-slide-slider-buttons-container">
              <button
                className="gallery-slide-slider-buttons-container__button"
                onClick={handlePreviousSlideClick}
              >
                <img src={iconBackButton} alt="previous" />
              </button>
              <button
                className="gallery-slide-slider-buttons-container__button"
                onClick={handleNextSlideClick}
              >
                <img src={iconNextButton} alt="next" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleGallerySlide;
