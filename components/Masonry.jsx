import { createContext, useState, useContext } from 'react';

export default function Masonry({ items, columns = 4, card, className = '' }) {
  const [showAll, setShowAll] = useState(false);
  const computedItems = showAll ? items : items.slice(0, columns);
  const childElements = computedItems.map(card);

  const _handleClick = () => {
    setShowAll(!showAll);
  };

  return (
    <div
      className={`grid gap-x-4 gap-y-4 items-start ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {childElements}
      {items.length > columns && showAll === false && (
        <button
          onClick={_handleClick}
          style={{ gridColumn: `span ${columns} / span ${columns}` }}
          className="uppercase text-center font-bold text-blue-light hover:text-blue-dark transition-colors cursor-pointer">
          View All
        </button>
      )}
    </div>
  );
}
