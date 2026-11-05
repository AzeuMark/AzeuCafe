import MenuItemPhoto from './MenuItemPhoto.jsx'
import { peso } from '../utils/format.js'

/**
 * Card used on the Menu page: photo, name, description, price, add-to-cart.
 */
export default function MenuItemCard({ item, onAdd, justAdded = false }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-espresso/10 bg-foam transition-colors hover:border-caramel/60 dark:border-milk/10 dark:bg-roast">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <MenuItemPhoto
          name={item.name}
          image={item.image}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg leading-snug">{item.name}</h3>
          <span className="shrink-0 font-mono text-sm text-caramel-deep">{peso(item.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-bean/60 dark:text-milk/60">
          {item.description}
        </p>

        <button
          type="button"
          onClick={() => onAdd(item)}
          className={`mt-4 w-full rounded-full py-2 text-sm font-semibold transition ${
            justAdded
              ? 'bg-status-ready text-milk'
              : 'bg-espresso text-milk hover:bg-caramel-deep dark:bg-milk dark:text-espresso dark:hover:bg-caramel'
          }`}
        >
          {justAdded ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
