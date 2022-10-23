import { useState } from 'react';
import Card from './Card';

export default function ItemMasonry({ items, columns = 4 }) {
  const [showAll, setShowAll] = useState(false);
  const computedItems = showAll ? items : items.slice(0, columns);
  const childElements = computedItems.map((item, key) => (
    <div key={key} className="w-full">
      <Card
        uniqueKey={`card-${key}`}
        prefixIcon={item.resourceIcon || ''}
        content={{
          image: item.images ? item.images[0] : {},
          headerText: item.title,
          contentType: 'items',
          slug: item.slug,
        }}
      />
    </div>
  ));

  const _handleClick = () => {
    setShowAll(!showAll);
  };

  return (
    <div
      className="grid gap-x-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr));` }}>
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
