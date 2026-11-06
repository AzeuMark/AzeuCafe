/**
 * The 16-slide AzeuCafe presentation — slide definitions + the FULL SPOKEN
 * SCRIPT under each one. Scripts are revealed only in the PresenterNotes
 * drawer (toggle button bottom-right, or press S) so the audience never
 * sees them.
 *
 * Tone: a HOW-TO-USE + WHY-YOUR-DATA-IS-SAFE talk for a general audience.
 * No engineering or implementation talk — just the product experience.
 *
 * Length budget: ≈860 words across all 16 scripts → a natural, calm
 * delivery lands at ≈5½–6 minutes total (written for a VIDEO submission:
 * pure explanation, no questions, no audience interaction).
 * Act 2 keeps every assurance spelled out even in the short form.
 *
 * Slide visuals live in ../SlideContent.jsx keyed by `content`.
 */

export const ACT_META = {
  usage: { label: 'How to use it', color: '#4E86D8' },
  protected: { label: 'How your data is protected', color: '#E5A13C' },
}

export const slides = [
  {
    id: 1,
    act: null,
    kicker: 'AzeuMark presents',
    title: 'AzeuCafe',
    subtitle:
      'Order ahead from your phone, pay cash at the counter — and rest easy, because your personal data is protected the whole way.',
    content: 'title',
    script:
      'Hi everyone — I am Uelmark G. Valdehueza, online I go by AzeuMark, and this is AzeuCafe. In the next five minutes you will learn two things: how to use it, as customer and as café — and how it protects the personal details you type in when you order.',
  },
  {
    id: 2,
    act: 'usage',
    kicker: 'How to use it',
    title: 'What AzeuCafe does',
    subtitle: 'Two sides of one counter: the customer screen, and the café screen. One golden rule: cash at the counter.',
    content: 'intro',
    script:
      'AzeuCafe removes the line from your coffee. Browse the menu with photos and peso prices, place your order, and a claim code appears. The café runs its own queue screen, where new orders land within seconds. The golden rule: payment is cash at the counter — nothing online ever touches your money.',
  },
  {
    id: 3,
    act: 'usage',
    kicker: 'How to use it · Getting started',
    title: 'Create your account',
    subtitle: 'One quick sign-up — then your order history follows you everywhere.',
    content: 'start',
    script:
      'Signing up takes one form: a name, an email, and a password you choose. Everything you order belongs to your account afterwards, on any device. And remember — your password is scrambled beyond recognition before it is kept. Nobody can turn it back.',
  },
  {
    id: 4,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Browse the menu, fill your cart',
    subtitle: 'Photos, peso prices, and a cart that behaves like a real tray.',
    content: 'menu',
    script:
      'The menu is the fun part: espresso, iced drinks, pastries, snacks — every item with a real photo and its peso price. One tap drops it into your cart, and you can change anything freely — this is coffee, not a contract. The cart survives closing the site, then checkout.',
  },
  {
    id: 5,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Place the order, get your claim code',
    subtitle: 'One screen: who is claiming, any note for the barista — then a big AZ-code appears.',
    content: 'checkout',
    script:
      'Checkout asks two things: who claims the order — you, or a friend — and a phone number, in case the café needs to reach you. A barista note is optional: less sugar, oat milk. Tap Place order, and the claim code appears — AZ-0001 — your receipt and ticket in one.',
  },
  {
    id: 6,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Pay cash at the counter',
    subtitle: 'Read the code. Pay in pesos. That is the entire payment process.',
    content: 'cash',
    script:
      'At the counter, read your code. The cashier already has the order listed — items, total, note — you hand over your pesos, done. The system never touches money: no card, no wallet, nothing that could ever be charged. Your cash stays yours until you hold your cup.',
  },
  {
    id: 7,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Track your order — and know the rules',
    subtitle: 'Five statuses tell you exactly what is happening. Cancel freely before the café starts making it.',
    content: 'track',
    script:
      'On My Orders, your order walks five statuses, and each tells you exactly what is happening. Waiting — cancel free, one tap. Processing — being made; changes now go through the counter. Ready — tap mark-completed and the loop closes. Completed. Cancelled — only ever by agreement.',
  },
  {
    id: 8,
    act: 'usage',
    kicker: 'How to use it · Owner',
    title: 'Behind the counter: the menu room',
    subtitle: 'Add items, edit anything, and retire what is sold out — old receipts stay true.',
    content: 'ownerMenu',
    script:
      'Behind the counter is the menu room: name, price, description, a picture — from a gallery, an upload, or a link. Items are editable any time, and when something is sold out the café retires it instead of deleting it — old receipts stay exactly true.',
  },
  {
    id: 9,
    act: 'usage',
    kicker: 'How to use it · Owner',
    title: 'Behind the counter: the live queue',
    subtitle: 'Orders land on the owner screen within seconds — what to make, whom to call, at a glance.',
    content: 'queue',
    script:
      'The queue refreshes every few seconds: what to make, the claim details as typed, any barista note. Accept — the customer sees Processing on their own screen. Ready — the drink is done. Hand out — code verified, order closed. Cancel, only for real life: the café calls the number on the card and settles it in person.',
  },
  {
    id: 10,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'What we keep — and why',
    subtitle: 'Only what the café actually needs. Nothing else is collected, period.',
    content: 'protects',
    script:
      'Now the promised part: your data. Real protection starts with the simplest idea: keep only what the café truly needs. Name — the right cup to the right hands. Phone — to reach you. Note, email, password — for your order, your account, the sign-in itself. That is all. No address, no birthday, no ID — and cash means zero card numbers exist anywhere. Data you never give is data nobody can steal.',
  },
  {
    id: 11,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Your name and phone go in a vault',
    subtitle: 'The moment your order is placed, your details are scrambled into unreadable text that only the café can read back.',
    content: 'cipher',
    script:
      'The moment your order is saved, your name and phone are locked inside a vault. The records show only gibberish — letters and numbers that mean nothing without the key. Only the café holds that key, and opens the box only to call you about an order, then closes it again. A stolen copy without the key is a pile of locked boxes.',
  },
  {
    id: 12,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Watch it work — with your own words',
    subtitle: 'Not a picture of encryption — the protection itself, running live.',
    content: 'playground',
    script:
      'This is the real system, live on screen. I type any words, press Encrypt — they come out scrambled, exactly like your order details, every time. Decrypt brings them back, perfectly. Then I corrupt one character and try to decrypt. The system refuses: it will not guess, it will not return garbage — the integrity check raises its hand instead of lying. And the key never leaves the café.',
  },
  {
    id: 13,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Your password: unreadable, even to us',
    subtitle: 'Checking a password and reading a password are two different things — this system can only ever do the first.',
    content: 'passwords',
    script:
      'Your password is kept as a one-way fingerprint — never the word itself. Like a real fingerprint: same every time, but no way to rebuild the person from it. At login, the system only checks whether the fingerprint matches. A match opens the account; no match refuses the door — and nobody ever saw the password. So a robbed database holds fingerprints, not passwords: nobody, staff or thief, can read them.',
  },
  {
    id: 14,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Who sees what — exactly',
    subtitle: 'Personal data appears only where it must: on your screen, and on the café screen while it serves you.',
    content: 'who',
    script:
      'You see your own orders — your business. The café sees claim details of the orders it is serving — the name to call, the phone to ring — and nothing beyond that; passwords are out of its reach entirely. Everyone else sees the menu — zero personal data anywhere. And the counter asks for your claim code, not your life story.',
  },
  {
    id: 15,
    act: null,
    kicker: 'The people behind the coffee',
    title: 'The Team',
    subtitle: '',
    content: 'team',
    script:
      'I am Uelmark G. Valdehueza — AzeuMark — and I built AzeuCafe end to end: the customer flow, the owner side, and every protection you just saw. The dashed card beside mine is reserved for my teammate. And none of it is a mockup: the café is running live right now.',
  },
  {
    id: 16,
    act: null,
    kicker: 'Summary',
    title: 'Thank you for watching',
    subtitle: '',
    content: 'thanks',
    script:
      'So, the whole talk: menu, cart, claim code, cash at the counter, track on My Orders — cancel free while Waiting, mark-completed when Ready. And to trust it: only needed data is kept; cash means zero payment data; name and phone vault-locked on arrival; your password an unreadable fingerprint; every screen shows exactly what each person needs — nothing wider. Thank you for watching.',
  },
]
