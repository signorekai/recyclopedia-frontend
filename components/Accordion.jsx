import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import { Carousel, CarouselCard } from './Carousel';
import { useWindowDimensions } from '../lib/hooks';
import qs from 'querystring';

const AccordionContext = createContext();

export const AccordionProvider = ({
  children,
  headers,
  startingItem = headers[0],
  setURLQuery = true,
}) => {
  const [selected, setSelected] = useState(startingItem);
  const router = useRouter();
  // make sure the two search bars will animate to each other,
  // but not to other instances of this component
  const hash = useRef(uuidV4());

  useEffect(() => {
    setSelected(startingItem);
  }, [startingItem]);

  useEffect(() => {
    if (
      router.query.section &&
      headers.indexOf(router.query.section) > -1 &&
      setURLQuery
    ) {
      setSelected(router.query.section);
    }
  }, [headers, router.query.section, setURLQuery]);

  return (
    <AccordionContext.Provider
      value={{ selected, setSelected, headers, hash, setURLQuery }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const AccordionHeader = ({
  className = '',
  carouselClassName = '',
  sliderClassName = '',
  cardClassName = 'min-w-max',
  onSelect = () => {},
}) => {
  const {
    selected,
    setSelected,
    headers: items,
    hash,
    setURLQuery,
  } = useContext(AccordionContext);
  const headerRefs = useRef({});
  const router = useRouter();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setScroll(headerRefs.current[selected].offsetLeft);
  }, [selected, headerRefs]);

  return (
    <div className={`border-grey border-b-1 ${className}`}>
      <Carousel
        autoScroll={false}
        autoSlideSize={true}
        scrollTo={scroll}
        className={carouselClassName}
        sliderClassName={`gap-x-8 relative ${sliderClassName}`}>
        {items.map((header, key) => {
          return (
            <CarouselCard className={cardClassName} key={key}>
              <button
                className={`pt-5`}
                onClick={() => {
                  if (setURLQuery) {
                    const queryParams = router.query;
                    queryParams['section'] = header;
                    router.push(`?${qs.stringify(queryParams)}`, null, {
                      shallow: true,
                    });
                  }
                  onSelect(header);
                  setSelected(header);
                }}>
                <div
                  ref={(el) => (headerRefs.current[header] = el)}
                  className={`text-xs uppercase font-bold tracking-2 font-archivo pb-1 ${
                    selected === header ? 'text-blue' : 'text-black'
                  }`}>
                  {header}
                </div>
                <AnimatePresence>
                  {selected === header && (
                    <motion.div
                      transition={{
                        duration: 0.7,
                        type: 'spring',
                        bounce: 0.1,
                      }}
                      variants={{
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0 },
                      }}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="h-1 bg-blue w-full"
                      layoutId={`${hash.current}-selector`}></motion.div>
                  )}
                </AnimatePresence>
              </button>
            </CarouselCard>
          );
        })}
      </Carousel>
    </div>
  );
};

export const AccordionBody = ({
  className = '',
  desktopControls = false,
  ...items
}) => {
  const { selected, setSelected, hash } = useContext(AccordionContext);
  const itemRefs = useRef({});
  const [scroll, setScroll] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setScroll(itemRefs.current[selected].offsetLeft);
  }, [width, selected]);

  return (
    <div className={`${className}`}>
      <Carousel
        desktopControls={desktopControls}
        autoScroll={false}
        className="mt-5"
        scrollTo={scroll}
        disableScroll={true}
        sliderClassName="relative gap-x-0">
        {Object.keys(items).map((key, i) => {
          // const Item = items[key];
          return (
            <CarouselCard
              style={{
                overflow: 'hidden',
                width: `${100 / Object.keys(items).length}%`,
                opacity: selected === key ? 1 : 0,
                maxHeight: selected === key ? 1000000000000000000 : 0,
              }}
              key={i}>
              <div ref={(el) => (itemRefs.current[key] = el)}>{items[key]}</div>
            </CarouselCard>
          );
        })}
      </Carousel>
    </div>
  );
};
