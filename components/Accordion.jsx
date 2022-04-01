import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { v4 as uuidV4 } from 'uuid';
import { Carousel, CarouselCard } from './Carousel';

const AccordionContext = createContext();

export const AccordionProvider = ({ children, headers }) => {
  const [selected, setSelected] = useState(headers[0]);
  // make sure the two search bars will animate to each other,
  // but not to other instances of this component
  const hash = useRef(uuidV4());

  return (
    <AccordionContext.Provider value={{ selected, setSelected, headers, hash }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const AccordionHeader = ({ className = '' }) => {
  const {
    selected,
    setSelected,
    headers: items,
    hash,
  } = useContext(AccordionContext);
  const headerRefs = useRef({});
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setScroll(headerRefs.current[selected].offsetLeft);
  }, [selected]);

  return (
    <div className={`border-grey border-b-1 ${className}`}>
      <Carousel
        autoScroll={false}
        className="mt-5"
        autoSlideSize={true}
        scrollTo={scroll}
        sliderClassName="gap-x-8 relative">
        {items.map((header, key) => {
          return (
            <CarouselCard key={key}>
              <button
                onClick={() => {
                  setSelected(header);
                }}>
                <div
                  ref={(el) => (headerRefs.current[header] = el)}
                  className={`text-xs uppercase font-bold tracking-wider font-archivo pb-1 ${
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
                      layoutId={`${hash}-selector`}></motion.div>
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

export const AccordionBody = ({ className = '', ...items }) => {
  const { selected, setSelected, hash } = useContext(AccordionContext);
  const itemRefs = useRef({});
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    setScroll(itemRefs.current[selected].offsetLeft);
  }, [selected]);

  return (
    <div className={`${className}`}>
      <Carousel
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
                height: selected === key ? 'auto' : 10,
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
