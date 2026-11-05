import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import MenuItemPhoto from '../components/MenuItemPhoto.jsx'
import { peso } from '../utils/format.js'

export default function CartPage() {
  const { items, total, count, setQty, remove, clear } = useCart()

  if (count === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-28 text-center">
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-sm text-bean/70 dark:text-milk/70">
          The espresso machine is hot and the pastry case is full.
        </p>
        <Link
          to="/menu"
          className="mt-8 inline-block rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
        >
          Browse the menu
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-caramel-deep">
            Review
          </p>
          <h1 className="mt-2 font-display text-4xl">Your Cart</h1>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold uppercase tracking-widest text-bean/50 transition hover:text-status-cancelled dark:text-milk/50"
        >
          Clear cart
        </button>
      </div>

      <ul className="mt-8 divide-y divide-espresso/10 border-y border-espresso/10 dark:divide-milk/10 dark:border-milk/10">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <MenuItemPhoto
              name={item.name}
              image={item.image}
              className="h-16 w-16 shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium">{item.name}</h3>
              <p className="font-mono text-xs opacity-70">{peso(item.price)} each</p>
            </div>

            {/* quantity stepper */}
            <div className="flex items-center gap-1 rounded-full border border-espresso/15 dark:border-milk/15">
              <button
                type="button"
                aria-label={`Decrease ${item.name} quantity`}
                onClick={() => setQty(item.id, item.qty - 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none transition hover:bg-caramel/20"
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
              <button
                type="button"
                aria-label={`Increase ${item.name} quantity`}
                onClick={() => setQty(item.id, item.qty + 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none transition hover:bg-caramel/20"
              >
                +
              </button>
            </div>

            <span className="w-20 text-right font-mono text-sm font-semibold">
              {peso(item.price * item.qty)}
            </span>

            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() => remove(item.id)}
              className="grid h-8 w-8 place-items-center rounded-full text-bean/40 transition hover:bg-status-cancelled/10 hover:text-status-cancelled dark:text-milk/40"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="text-sm text-bean/70 dark:text-milk/70">
          {count} item{count === 1 ? '' : 's'} · priced by the server at checkout
        </span>
        <span className="font-display text-2xl">{peso(total)}</span>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/checkout"
          className="rounded-full bg-espresso px-7 py-3 text-sm font-semibold text-milk transition hover:bg-caramel-deep dark:bg-milk dark:text-espresso"
        >
          Proceed to checkout →
        </Link>
        <Link to="/menu" className="text-sm font-semibold text-caramel-deep hover:underline">
          Add more items
        </Link>
      </div>

      <p className="mt-4 text-xs text-bean/50 dark:text-milk/50">
        Payment is cash at the counter when you claim your order.
      </p>
    </div>
  )
}
