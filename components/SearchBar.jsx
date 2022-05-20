import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import { useWindowDimensions } from '../lib/hooks';

const Suggestion = ({
  text = '',
  showIcon = true,
  selectSuggestion = () => {},
}) => (
  <li className="search-suggestion">
    <button
      type="button"
      className="hover:cursor-pointer w-full text-left"
      onClick={() => {
        selectSuggestion(text);
      }}>
      {showIcon && <span className="far fa-history"></span>}
      {text}
    </button>
  </li>
);

/**
 * @callback handleOnChange
 * @param {text} value form value
 */
/**
 *
 * @param {text} placeholderText Placeholder text for search bar
 * @param {text} activeBackgroundColor HTML accepted color for container bg color when text input is focused
 * @param {text} inactiveBackgroundColor HTML accepted color for container bg color when text input is not focused
 * @param {number} top CSS value `top` for wrapper to allow for dynamic animation
 * @param {text} className classes for container
 * @param {text} wrapperClassName classes for form wrapper
 * @param {handleOnChange} handleOnChange callback when text input is updated
 */
export default function SearchBar({
  placeholderText = 'Search Items',
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  top = 0,
  className = '',
  wrapperClassName = 'max-w-screen-lg ',
  handleOnChange = () => {},
  showBottomSpacing = true,
  searchType = ['items'],
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [formValue, setFormValue] = useState('');
  const { width } = useWindowDimensions();
  const searchBarRef = useRef();
  const closeBtnRef = useRef();
  const formRef = useRef();

  // make sure the two search bars will animate to each other,
  // but not to other instances of this component
  const uniq = useRef(uuidV4());

  const dummySuggestions = ['Rags', 'Shampoo', 'USB', 'Broken Cup', 'Lego'];

  const handleFormUpdate = (e) => {
    setFormValue(e.target.value);
    handleOnChange(e.target.value);
  };

  const _handleClose = () => {
    setIsFocused(false);
    // setFormValue('');
  };

  const handleOnFocus = () => {
    setIsFocused(true);
  };

  const selectSuggestion = (suggestion) => {
    setFormValue(suggestion);
    // setTimeout(() => {
    //   formRef.current.submit();
    // }, 400);
  };

  const handleOnBlur = (e) => {
    // console.log('onblur');
    setIsFocused(false);
    console.log(e);
    // console.log('set focus false');
    if (e.relatedTarget) {
      // console.log(e.relatedTarget);
      e.relatedTarget.click();
    }
  };

  useEffect(() => {
    if (isFocused && searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [searchBarRef, isFocused]);

  const _handleSubmit = (e) => {
    if (formValue.length === 0) {
      e.preventDefault();
    }
  };

  return (
    <form ref={formRef} method="get" action="/search" onSubmit={_handleSubmit}>
      <input type="hidden" name="contentType" value={searchType.join(',')} />
      <motion.div
        className={`w-full mx-auto px-4 ${className}`}
        style={{
          top,
          backgroundColor: inactiveBackgroundColor,
        }}>
        <motion.div
          layoutId={`${uniq.current}-search-bar`}
          className={`search-bar-wrapper bg-white placeholder:text-grey-dark border-0 border-grey-dark relative ${wrapperClassName} ${
            isFocused && width > 1080 ? 'rounded-b-none rounded-t-3xl' : ''
          }`}>
          {(isFocused === false || width > 1080) && (
            <input
              value={formValue}
              onChange={handleFormUpdate}
              onFocus={handleOnFocus}
              // onBlur={handleOnBlur}
              ref={searchBarRef}
              placeholder={placeholderText}
              autoComplete="off"
              type="text"
              name="searchTerm"
              id="searchTerm"
              className="search-bar bg-transparent peer text-black"
            />
          )}
          <button type="submit">
            <span className="far fa-search search-icon text-grey ease-in-out px-2"></span>
          </button>
          <button
            ref={closeBtnRef}
            onClick={_handleClose}
            className="search-close-btn absolute right-3 opacity-0 translate-y-2 pointer-events-none">
            <span className="fal fa-times search-icon border-l-1 border-bg pl-2"></span>
          </button>
          <AnimatePresence>
            {isFocused && width > 1080 && (
              <motion.div
                transition={{ bounce: 0, duration: 0.1 }}
                variants={{
                  initial: { y: '80%', opacity: 0 },
                  animate: { y: '100%', opacity: 1 },
                  exit: { y: '80%', opacity: 0 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className="search-suggestions absolute left-0 bottom-0 translate-y-[100%] lg:max-w-[800px]">
                <ul className="plain">
                  {dummySuggestions.map((suggestion, key) => (
                    <Suggestion
                      key={key}
                      selectSuggestion={selectSuggestion}
                      text={suggestion}
                    />
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isFocused && width < 1080 && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 100 },
            }}
            className="modal-wrapper !z-50 !flex-col top-0 left-0 !justify-start">
            <div
              className="px-4 py-3"
              style={{ backgroundColor: activeBackgroundColor }}>
              <motion.div
                layoutId={`${uniq.current}-search-bar`}
                className="search-bar-wrapper bg-white placeholder:text-grey-dark border-0 border-grey-dark relative search-bar-wrapper--active">
                <input
                  value={formValue}
                  onChange={handleFormUpdate}
                  onFocus={handleOnFocus}
                  // onBlur={handleOnBlur}
                  ref={searchBarRef}
                  placeholder={placeholderText}
                  type="text"
                  name="searchTerm"
                  id="searchTerm"
                  className="search-bar bg-transparent peer text-black"
                />
                <button type="submit">
                  <span className="far fa-search search-icon text-grey ease-in-out px-2"></span>
                </button>
                <button
                  ref={closeBtnRef}
                  onClick={_handleClose}
                  className="search-close-btn pr-3 opacity-0 translate-y-2 pointer-events-none">
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
              <ul className="plain">
                {dummySuggestions.map((suggestion, key) => (
                  <Suggestion
                    key={key}
                    selectSuggestion={selectSuggestion}
                    text={suggestion}
                  />
                ))}
              </ul>
            </motion.div>
            <button className="flex-1" onClick={_handleClose}></button>
          </motion.div>
        )}
      </AnimatePresence>
      {showBottomSpacing && (
        <div
          className="pb-2 lg:pb-10"
          style={{
            backgroundColor: inactiveBackgroundColor,
          }}
        />
      )}
    </form>
  );
}
