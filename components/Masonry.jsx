import { useEffect } from 'react';
import { createContext, useState, useContext } from 'react';
import { useWindowDimensions } from '../lib/hooks';

export default function Masonry({
  items,
  columns = 4,
  card,
  className = '',
  mobileColumns = 2,
  tabletColumns = 3,
  desktopColumns = 4,
  expandedByDefault = false,
}) {
  const { width } = useWindowDimensions();
  const [showAll, setShowAll] = useState(expandedByDefault);
  const masonryColumns =
    width < 768 ? mobileColumns : width < 1080 ? tabletColumns : desktopColumns;
  const computedItems = showAll ? items : items.slice(0, masonryColumns);
  const childElements = computedItems.map(card);

  const _handleClick = () => {
    setShowAll(!showAll);
  };

  const _handleResize = () => {
    if (width > 1080 && showAll === false) {
      setShowAll(true);
    }
  };

  useEffect(() => {
    _handleResize();
  }, [width]);

  return (
    <div
      className={`grid gap-x-4 gap-y-4 mt-2 items-start ${className}`}
      style={{
        gridTemplateColumns: `repeat(${masonryColumns}, minmax(0, 1fr))`,
      }}>
      {childElements}
      {items.length > masonryColumns && showAll === false && (
        <button
          onClick={_handleClick}
          style={{
            gridColumn: `span ${masonryColumns} / span ${masonryColumns}`,
          }}
          className="text-center font-bold text-coral hover:text-coral-dark transition-colors cursor-pointer">
          View All
          <i className="far fa-arrow-down ml-2"></i>
        </button>
      )}
    </div>
  );
}
