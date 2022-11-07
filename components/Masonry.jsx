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
}) {
  const { width } = useWindowDimensions();
  const [showAll, setShowAll] = useState(false);
  const computedItems = showAll ? items : items.slice(0, columns);
  const childElements = computedItems.map(card);

  const _handleClick = () => {
    setShowAll(!showAll);
  };

  let masonryColumns = mobileColumns;
  if (width >= 768) {
    masonryColumns = tabletColumns;
  }

  if (width >= 1080) {
    masonryColumns = desktopColumns;
  }

  return (
    <div
      className={`grid gap-x-4 gap-y-4 mt-2 items-start ${className}`}
      style={{
        gridTemplateColumns: `repeat(${masonryColumns}, minmax(0, 1fr))`,
      }}>
      {childElements}
      {items.length > columns && showAll === false && (
        <button
          onClick={_handleClick}
          style={{
            gridColumn: `span ${masonryColumns} / span ${masonryColumns}`,
          }}
          className="uppercase text-center font-bold text-blue-light hover:text-blue-dark transition-colors cursor-pointer">
          View All
        </button>
      )}
    </div>
  );
}
