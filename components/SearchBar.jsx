import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';

const Suggestion = ({ text = '' }) => (
  <li className="search-suggestion">
    <span className="far fa-history"></span>
    {text}
  </li>
);

export default function SearchBar({
  placeholderText = 'Search Items',
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  top = 0,
  className = '',
  wrapperClassName = 'max-w-screen-lg ',
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [formValue, setFormValue] = useState('');
  const animControl = useAnimation();
  const searchBar = useRef();
  const closeBtn = useRef();
  const uniq = useRef(uuidV4());

  const dummySuggestions = ['Rags', 'Shampoo', 'USB', 'Broken Cup', 'Lego'];

  const handleChange = (e) => {
    setFormValue(e.target.value);
  };

  const handleClose = () => {
    setFormValue('');
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const handleOnBlur = (e) => {
    setIsFocused(false);
    if (e.relatedTarget === closeBtn.current) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isFocused) {
      searchBar.current.focus();
    }
  }, [searchBar, isFocused]);

  return (
    <>
      <motion.div
        className={`w-full mx-auto px-4 ${className}`}
        style={{
          top,
          backgroundColor: inactiveBackgroundColor,
        }}>
        <motion.div
          layoutId={`${uniq.current}-search-bar`}
          className={`search-bar-wrapper bg-white placeholder:text-grey-dark border-0 border-grey-dark relative ${wrapperClassName}`}>
          <input
            value={formValue}
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            ref={searchBar}
            placeholder={placeholderText}
            type="text"
            name=""
            id=""
            className="search-bar bg-transparent peer text-black"
          />
          <button>
            <span className="far fa-search search-icon text-grey ease-in-out px-2"></span>
          </button>
          <button
            ref={closeBtn}
            onClick={handleClose}
            className="search-close-btn absolute right-3 opacity-0 translate-y-2 pointer-events-none">
            <span className="fal fa-times search-icon border-l-1 border-bg pl-2"></span>
          </button>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 100 },
            }}
            className="modal-wrapper !flex-col top-0 left-0 !justify-start">
            <div
              className="px-4 py-3"
              style={{ backgroundColor: activeBackgroundColor }}>
              <motion.div
                layoutId={`${uniq.current}-search-bar`}
                className="search-bar-wrapper bg-white placeholder:text-grey-dark border-0 border-grey-dark relative search-bar-wrapper--active">
                <input
                  value={formValue}
                  onChange={handleChange}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                  ref={searchBar}
                  placeholder={placeholderText}
                  type="text"
                  name=""
                  id=""
                  className="search-bar bg-transparent peer text-black"
                />
                <button>
                  <span className="far fa-search search-icon text-grey ease-in-out px-2"></span>
                </button>
                <button
                  ref={closeBtn}
                  onClick={handleClose}
                  className="search-close-btn absolute right-3 opacity-0 translate-y-2 pointer-events-none">
                  <span className="fal fa-times search-icon border-l-1 border-bg pl-2"></span>
                </button>
              </motion.div>
            </div>
            <motion.div
              transition={{ duration: 0.2 }}
              variants={{
                // initial: { y: '-100%', opacity: 0 },
                // animate: { y: 0, opacity: 1 },
                exit: { y: 50, scale: 0.9 },
              }}
              className="search-suggestions">
              <ul>
                {dummySuggestions.map((suggestion, key) => (
                  <Suggestion key={key} text={suggestion} />
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
