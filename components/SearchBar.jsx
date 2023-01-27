import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import { useWindowDimensions } from '../lib/hooks';
import { debounce, parentsUntil } from '../lib/functions';

export const Suggestion = ({
  text = '',
  showIcon = true,
  selectSuggestion = () => {},
}) => (
  <li className="search-suggestion">
    <button
      tabIndex={0}
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

export const _cacheSearchTerm = (term, key) => {
  if (localStorage) {
    let cached = localStorage.getItem(key);
    if (cached === null) {
      cached = term;
    } else {
      let arrayOfCached = cached.split(',');
      if (arrayOfCached.indexOf(term) > -1) {
        arrayOfCached.splice(arrayOfCached.indexOf(term), 1);
      }

      if (arrayOfCached.length >= 5) {
        arrayOfCached = arrayOfCached.slice(0, 4);
      }

      arrayOfCached.unshift(term);
      cached = arrayOfCached.join(',');
    }

    localStorage.setItem(key, cached);
  }
};

/**
 * @callback handleOnChange
 * @param {text} value form value
 */
/**
 *
 * @param {Object} props
 * @param {text} props.placeholderText Placeholder text for search bar
 * @param {text} props.activeBackgroundColor HTML accepted color for container bg color when text input is focused
 * @param {text} props.inactiveBackgroundColor HTML accepted color for container bg color when text input is not focused
 * @param {number} props.top CSS value `top` for wrapper to allow for dynamic animation
 * @param {text} props.className class for container
 * @param {text} props.wrapperClassName class for form wrapper
 * @param {text} props.searchSuggestionsClassName class for search suggestions wrapper
 * @param {text} props.modalSearchBarWrapperClassName class for search bar modal wrapper
 * @param {handleOnChange} props.handleOnChange callback when text input is updated
 * @param {boolean} props.showSuggestions show or hide suggestions
 */
export default function SearchBar({
  placeholderText = 'Search Items',
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  top = 0,
  className = '',
  wrapperClassName = 'max-w-screen-lg ',
  searchSuggestionsClassName = '',
  modalSearchBarWrapperClassName = '',
  handleOnChange = () => {},
  showBottomSpacing = true,
  searchType = ['items'],
  showSuggestions = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [formValue, setFormValue] = useState('');
  const { width } = useWindowDimensions();
  const searchBarRef = useRef();
  const closeBtnRef = useRef();
  const formRef = useRef();
  const suggestions = useRef([]);

  // make sure the two search bars will animate to each other,
  // but not to other instances of this component
  const uniq = useRef(uuidV4());

  const handleFormUpdate = (e) => {
    setFormValue(e.target.value);
    handleOnChange(e.target.value);
  };

  const _handleClose = () => {
    setIsFocused(false);
    // setFormValue('');
  };

  const _handleOnFocus = () => {
    setIsFocused(true);
  };

  const selectSuggestion = (suggestion) => {
    setFormValue(suggestion);
    setTimeout(() => {
      formRef.current.submit();
    }, 100);
  };

  useEffect(() => {
    if (isFocused && searchBarRef.current) {
      searchBarRef.current.focus();
    }
  }, [searchBarRef, isFocused]);

  useEffect(() => {
    if (localStorage && showSuggestions) {
      const cached = localStorage.getItem(searchType.join(','));
      if (cached !== null && cached.length > 0)
        suggestions.current = cached.split(',');
    }
  }, [searchType, showSuggestions]);

  useEffect(() => {
    const handleFocusIn = (e) => {
      const parents = parentsUntil(document.activeElement, formRef.current);
      if (parents[parents.length - 1] == formRef.current) {
        setIsFocused(true);
      }
    };

    const handleFocusOut = debounce((e) => {
      if (document.activeElement !== document.querySelector('body')) {
        const parents = parentsUntil(document.activeElement, formRef.current);
        if (parents[parents.length - 1] !== formRef.current) {
          setIsFocused(false);
        }
      } else {
        setIsFocused(false);
      }
    }, 100);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [formRef]);

  const _handleSubmit = (e) => {
    if (formValue.length === 0) {
      e.preventDefault();
    } else {
      _cacheSearchTerm(formValue, searchType.join(','));
    }
  };

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
          className={`search-bar-wrapper search-bar-wrapper--transparent ${wrapperClassName} ${
            isFocused &&
            width > 1080 &&
            suggestions.current.length > 0 &&
            showSuggestions
              ? 'rounded-b-none rounded-t-22'
              : ''
          }`}>
          <form
            className="w-full flex relative"
            ref={formRef}
            onFocus={_handleOnFocus}
            method="get"
            action="/search"
            onSubmit={_handleSubmit}>
            <input
              type="hidden"
              name="contentType"
              value={searchType.join(',')}
            />
            {(isFocused === false || width > 1080) && (
              <input
                value={formValue}
                onChange={handleFormUpdate}
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
              tabIndex={-1}
              ref={closeBtnRef}
              onClick={_handleClose}
              className="search-close-btn absolute right-3 opacity-0 translate-y-2 pointer-events-none">
              <span className="fal fa-times search-icon border-l-1 border-bg pl-2"></span>
            </button>
          </form>
          <AnimatePresence>
            {isFocused && width > 1080 && showSuggestions && (
              <motion.div
                transition={{ bounce: 0, duration: 0.1 }}
                variants={{
                  initial: { y: '-10%', opacity: 0 },
                  animate: { y: '0%', opacity: 1 },
                  exit: { y: '-10%', opacity: 0 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`search-suggestions ${searchSuggestionsClassName}`}>
                <ul className="plain">
                  {suggestions.current.map((suggestion, key) => (
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
            <form
              className=""
              ref={formRef}
              method="get"
              onFocus={_handleOnFocus}
              action="/search"
              onSubmit={_handleSubmit}>
              <div
                className={`px-4 py-3 ${modalSearchBarWrapperClassName}`}
                style={{ backgroundColor: activeBackgroundColor }}>
                <motion.div
                  layoutId={`${uniq.current}-search-bar`}
                  className="search-bar-wrapper bg-white placeholder:text-grey-dark border-0 border-grey-dark relative search-bar-wrapper--active">
                  <div className="w-full flex">
                    <input
                      type="hidden"
                      name="contentType"
                      value={searchType.join(',')}
                    />
                    <input
                      value={formValue}
                      onChange={handleFormUpdate}
                      ref={searchBarRef}
                      placeholder={placeholderText}
                      autoComplete="off"
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
                  </div>
                </motion.div>
              </div>
              <motion.div
                transition={{ duration: 0.2 }}
                variants={{
                  // initial: { y: '-100%', opacity: 0 },
                  animate: { y: 0, opacity: 1 },
                  exit: { y: 50, scale: 0.9 },
                }}
                className={`search-suggestions !top-[56px] ${searchSuggestionsClassName}`}>
                <ul className="plain">
                  {suggestions.current.map((suggestion, key) => (
                    <Suggestion
                      key={key}
                      selectSuggestion={selectSuggestion}
                      text={suggestion}
                    />
                  ))}
                </ul>
              </motion.div>
            </form>
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
    </>
  );
}
