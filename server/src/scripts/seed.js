/**
 * Idempotent seed: `npm run seed`
 *  - upserts the single Owner account from .env (public registration can
 *    never create owners — this script is the ONLY creator)
 *  - upserts the 12 sample menu items (idempotent by name+category)
 */
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { encrypt } from '../utils/aescrypt.js'
import User from '../models/user.model.js'
import MenuItem from '../models/menuItem.model.js'

const KEY = () => process.env.AES_KEY

const MENU_SEED = [
  // espresso-drinks
  { name: 'Cappuccino', category: 'espresso-drinks', price: 140, description: 'Double espresso under a cloud of steamed milk.', image: 'cappuccino.jpg' },
  { name: 'Espresso Doppio', category: 'espresso-drinks', price: 110, description: 'Two shots. No excuses.', image: 'espresso-doppio.jpg' },
  { name: 'Cafe Latte', category: 'espresso-drinks', price: 130, description: 'Silky steamed milk over a double shot.', image: 'cafe-latte.jpg' },
  // iced-drinks
  { name: 'Iced Americano', category: 'iced-drinks', price: 120, description: 'Bold espresso, chilled, poured over ice.', image: 'iced-americano.jpg' },
  { name: 'Iced Caramel Latte', category: 'iced-drinks', price: 150, description: 'Cold latte swirled with house caramel.', image: 'iced-caramel-latte.jpg' },
  { name: 'Iced Matcha Latte', category: 'iced-drinks', price: 160, description: 'Ceremonial matcha shaken with milk.', image: 'iced-matcha-latte.jpg' },
  // pastries
  { name: 'Butter Croissant', category: 'pastries', price: 90, description: 'Flaky, laminated, unapologetically French.', image: 'butter-croissant.jpg' },
  { name: 'Blueberry Cheesecake', category: 'pastries', price: 165, description: 'Creamy baked cheesecake on a nutty crust.', image: 'blueberry-cheesecake.jpg' },
  { name: 'Chocolate Chip Cookie', category: 'pastries', price: 75, description: 'Warm-baked with a gooey center.', image: 'chocolate-chip-cookie.jpg' },
  // snacks
  { name: 'Clubhouse Sandwich', category: 'snacks', price: 180, description: 'Triple-stacked, served with fries.', image: 'clubhouse-sandwich.jpg' },
  { name: 'Loaded Fries', category: 'snacks', price: 140, description: 'Cheese, bacon bits, a little chaos.', image: 'loaded-fries.jpg' },
  { name: 'Tuna Wrap', category: 'snacks', price: 155, description: 'Tuna salad tucked in a soft tortilla.', image: 'tuna-wrap.jpg' },
]

async function main() {
  const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/azeucafe'
  await mongoose.connect(uri)
  console.log('MongoDB connected for seeding.')

  // 1) Owner account
  const ownerEmail = String(process.env.OWNER_EMAIL ?? 'owner@azeucafe.local').toLowerCase()
  const ownerPassword = String(process.env.OWNER_PASSWORD ?? 'owner1234')
  const ownerName = String(process.env.OWNER_NAME ?? 'Owner')
  await User.updateOne(
    { email: ownerEmail },
    {
      $set: {
        name: encrypt(ownerName, KEY()), // name encrypted like every user's
        password: await bcrypt.hash(ownerPassword, 10),
        role: 'owner',
      },
      $setOnInsert: { email: ownerEmail, phone: '' },
    },
    { upsert: true },
  )
  console.log(`Owner ensured: ${ownerEmail} (password from OWNER_PASSWORD)`)

  // 2) Menu items
  let created = 0
  for (const seedItem of MENU_SEED) {
    const result = await MenuItem.updateOne(
      { name: seedItem.name, category: seedItem.category },
      {
        $set: {
          name: seedItem.name,
          description: seedItem.description,
          category: seedItem.category,
          price: seedItem.price,
          image: { type: 'library', path: `/menu/${seedItem.image}` },
        },
        $setOnInsert: { retired: false },
      },
      { upsert: true },
    )
    if (result.upsertedCount) created += 1
  }
  console.log(`Menu ensured: ${MENU_SEED.length} items (${created} newly inserted).`)

  await mongoose.disconnect()
  console.log('Seed complete.')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message)
    console.error('Tip: is the local MongoDB ("mongod") running? MONGO_URI is in server/.env')
    process.exit(1)
  })
