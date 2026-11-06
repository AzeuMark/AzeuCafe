/**
 * The 16-slide AzeuCafe presentation — slide definitions + the FULL SPOKEN
 * SCRIPT under each one. Scripts are revealed only in the PresenterNotes
 * drawer (toggle button bottom-right, or press S) so the audience never
 * sees them.
 *
 * Tone: a HOW-TO-USE + WHY-YOUR-DATA-IS-SAFE talk for a general audience.
 * No engineering or implementation talk — just the product experience.
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
      'Hi everyone. My name is Uelmark G. Valdehueza — online I go by AzeuMark — and today I will walk you through AzeuCafe. In the first part of this talk, I will show you how to use the system as a customer, step by step: creating your account, browsing the menu, placing an order, and claiming it at the counter. Then I will show you the other side of the counter: how the café itself runs your order from behind the scenes. In the second part, I will answer a question that matters to every one of us: what happens to your personal information once you type it in — your name, your phone number, your claim details — and exactly how the system keeps it safe. By the end you will know two things: how to use AzeuCafe, and why you can trust it with your data. Let us get started.',
  },
  {
    id: 2,
    act: 'usage',
    kicker: 'How to use it',
    title: 'So, what is AzeuCafe?',
    subtitle: 'Two sides of one counter: the customer screen, and the café screen. One golden rule: cash at the counter.',
    content: 'intro',
    script:
      'AzeuCafe does one simple thing: it removes the line from your coffee. You open the site — on your phone or your laptop — you look at the menu of the day with photos and real peso prices, you place your order, and the system hands you a claim code, like a stub at the movies. You show that code at the cashier, pay in cash, and take your seat while the coffee is made. There are two sides to it. If you are a customer, everything you need lives on one screen: the menu, your cart, checkout, and your order tracker. If you are the café, there is a second screen — the owner side — where the queue lives: new orders come in, get accepted, get made, and get handed out. And one golden rule holds the whole thing together: payment is CASH at the counter. No cards, no e-wallets, no online payment of any kind plays any part in this system. Your money stays in your pocket until you hold your cup.',
  },
  {
    id: 3,
    act: 'usage',
    kicker: 'How to use it · Getting started',
    title: 'Create your account',
    subtitle: 'One quick sign-up — then your order history follows you everywhere.',
    content: 'start',
    script:
      'First time here? Tap Log in, then Sign up. The form asks for three things — your name, your email, and a password of your choice — and that is the whole ceremony. From that moment, everything you order belongs to your account: your history is kept, and if you come back tomorrow on a different phone or laptop, you just log in and everything is still where you left it. Returning regulars simply log in and start ordering. One thing is worth knowing right now, because we will return to it later: the password you type is scrambled beyond recognition before it is kept anywhere. The system will later use it to check that it is really you — but nobody, not even the café, can take that scrambled version and turn it back into your password. Your account is your key, and it is never the café business to read it.',
  },
  {
    id: 4,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Browse the menu, fill your cart',
    subtitle: 'Photos, peso prices, and a cart that behaves like a real tray.',
    content: 'menu',
    script:
      'The menu is the fun part. Everything is grouped the way you would find it at the counter — espresso drinks, iced drinks, pastries, and snacks — each item with a real photo, a short description, and its price in pesos. Found something? One tap and it drops into your cart, like putting a pastry on your tray; tap the basket icon in the top bar any time to see what you have collected. In the cart you can adjust quantities up or down, and remove the croissant you suddenly regret: this is coffee, not a contract — change your mind as often as you like. And if you must close the site — class starts, emails arrive — your cart keeps its contents for later, so your half-built snack run survives. When everything looks right, proceed to checkout.',
  },
  {
    id: 5,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Place the order, get your claim code',
    subtitle: 'One screen: who is claiming, any note for the barista — then a big AZ-code appears.',
    content: 'checkout',
    script:
      'Checkout asks for two things, and only two. First: the NAME of the person who will claim the order — you, or a friend picking up for you. Second: a phone number, in case the café needs to reach you about the order. Then there is a small note box for the barista: less sugar, oat milk, extra hot — a courtesy the counter reads every time. Check the summary on the side, and when the total looks right, tap Place order. A claim code appears, something like AZ-0001, big and bold on the screen. That code is your receipt and your ticket at the same time: proof that you ordered, in a shape you can read out at the counter. Notice, too, that the total shown here is the total you pay — the price was already agreed between you and the café, no surprises waiting for you at the cash register.',
  },
  {
    id: 6,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Pay cash at the counter',
    subtitle: 'Read the code. Pay in pesos. That is the entire payment process.',
    content: 'cash',
    script:
      'Here is how the payment moment actually goes. You walk to the counter and read your claim code: AZ-0001. The cashier finds your order already listed on their screen — the items, the total, the note — you hand over your pesos, done. The system never touches your money: there is no card number stored in AzeuCafe, no e-wallet, no saved payment method — nothing exists that could ever be charged. You keep your money in your pocket until you hold your cup. And because payment is cash, there is nothing ABOUT your money to protect either: no transaction trails, no card fingerprints, no billing anything. Using the system costs you nothing extra: no fees, no cut, no charges — you pay only for the coffee, and only in cash.',
  },
  {
    id: 7,
    act: 'usage',
    kicker: 'How to use it · Customer',
    title: 'Track your order — and know the rules',
    subtitle: 'Five statuses tell you exactly what is happening. Cancel freely before the café starts making it.',
    content: 'track',
    script:
      'On your Orders page, an order walks through five statuses, and each one tells you exactly what is happening at the counter. Waiting — the café has not accepted it yet; you can cancel for free with one tap and your money stays yours. Processing — the café has accepted and started making it; an order can no longer be cancelled in this stage, and if life changed in the meantime you simply talk to the person at the counter — the café itself can cancel it for you there and then. Ready — your order is done and waiting: tap the button that appears, "mark completed", and the loop closes. Completed — claimed, paid, done. Cancelled — only ever shown when an order was agreed to be cancelled, either by you while Waiting or by the café itself. Those are the rules, and they exist to protect both sides: the café cannot lose work it already started, and you never chase an order you already gave up on.',
  },
  {
    id: 8,
    act: 'usage',
    kicker: 'How to use it · Owner',
    title: 'Behind the counter: the menu room',
    subtitle: 'Add items, edit anything, and retire what is sold out — old receipts stay true.',
    content: 'ownerMenu',
    script:
      'Let us spend two minutes on the other side of the counter — knowing it exists makes the whole picture real. When the café logs in, its menu room opens. Adding an item is a small form: name, price, a short description, and a picture — and for the picture the café chooses how: pick one from a ready-made gallery of photos, upload its own image from its computer, or paste a link. Any item can be edited at any time: adjust a price, sharpen a description, swap a photo. And when something is sold out, the café does not deactivate it — it RETIRES it. That is a small word with a big meaning: retired items disappear from the public menu board, but every order placed while an item was available still shows exactly what it bought and at what price — history stays honest. If the croissant returns tomorrow, one click brings it back.',
  },
  {
    id: 9,
    act: 'usage',
    kicker: 'How to use it · Owner',
    title: 'Behind the counter: the live queue',
    subtitle: 'Orders land on the owner screen within seconds — what to make, whom to call, at a glance.',
    content: 'queue',
    script:
      'And here is the heartbeat of the café: the live queue that updates every few seconds. New orders pop in highlighted. Each card shows exactly what to make, the quantity, the claim details as the customer typed them — the name to call, the phone to ring — and that little barista note, like "less sugar please." From there, the screen only ever shows the buttons that make sense at that moment: Accept — the café takes charge, your order is now Processing on your phone too. Ready — the drink is done and sitting at the counter, and the customer sees the banner immediately. Hand out — code verified, order claimed, loop closed. And Cancel — for the moments when real life intervenes: a machine stops, a customer asks nicely. The café can call the number on the card and settle it like human beings. Every one of these changes appears on the customer side automatically, no refresh needed, no phone calls back.',
  },
  {
    id: 10,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'What we keep — and why',
    subtitle: 'Only what the café actually needs. Nothing else is collected, period.',
    content: 'protects',
    script:
      'And now the part I promised we would come back to: your data. Real protection starts before any technology, with one simple question: should we even KEEP this? AzeuCafe collects only what it truly needs. Your NAME — so the right cup goes to the right hands at the counter. Your PHONE — so the café can reach you if there is a question about your order. Your NOTE — so your coffee comes out the way you asked for it. Your EMAIL — that is how you log back in tomorrow, nothing more. Your PASSWORD — needed for the login itself, never readable by anyone. And that is the entire list. AzeuCafe never asks for your address, your birthday, your government ID. And because payment is cash at the counter, the system holds zero card numbers, zero wallet links, zero billing anything. Data you never give out cannot leak. What you DO give, the system protects — and the next slides show exactly how.',
  },
  {
    id: 11,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Your name and phone go in a vault',
    subtitle: 'The moment your order is placed, your details are scrambled into unreadable text that only the café can read back.',
    content: 'cipher',
    script:
      'Here is what actually happens to the personal details you type. The moment your order is saved, the system locks your name and your phone inside a vault. What remains in the records does not look like "Juan Dela Cruz" — it looks like complete gibberish: random letters, numbers and symbols that mean nothing to anyone without the key. Picture it like this: you write your phone number on a slip of paper, put the paper in a locked steel box, and throw away the original slip. Anyone peeking at the box sees metal. Only the café itself holds the key — and it opens the box only at the moment it actually needs to call you about an order, then closes it again. No key, no peek: even a copy of the records without the key is just a pile of locked boxes. You can watch this protection run live two slides from now — with your own words.',
  },
  {
    id: 12,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Watch it work — with your own words',
    subtitle: 'Not a picture of encryption — the protection itself, running live.',
    content: 'playground',
    script:
      'Let us make that concrete. This is a real demonstration — nothing staged, nothing recorded. I will type any words into this box; use one of your names from the audience, or "Juan Dela Cruz" if you prefer. I press ENCRYPT — and the system does to this sentence exactly what it does to your personal details every single time they enter the machine: it becomes unreadable letters and numbers. Then I press DECRYPT — and it comes back perfectly, because the system can always undo its own lock. One more trick: I corrupt ONE character of that scrambled text — a one-letter scratch — and try to decrypt it. The system refuses. It does not guess, it does not return garbage: an integrity check inside the protection fails loudly and the system raises its hand instead of lying. That is what protecting every order looks like from the inside. And the secret key that unscrambles your data never leaves the café.',
  },
  {
    id: 13,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Your password: unreadable, even to us',
    subtitle: 'Checking a password and reading a password are two different things — this system can only ever do the first.',
    content: 'passwords',
    script:
      'Now the sacred one: your password. When you sign up, the system never keeps the password you typed — not in a file, not behind a lock, nowhere. Instead it computes a unique fingerprint of it and keeps only that. Think of how a fingerprint works: always the same for the same finger, impossible to reconstruct a person from, and useless to anyone who steals a fingerprint album. So when you log in, the system does not read your password back — it computes the fingerprint of what you just typed and simply checks: does it match the one on file? Yes, you are in. No, this is not you — without ever knowing the actual password. Which is why staff cannot reveal it, a breach cannot expose it, and you should still never reuse a password anywhere — this system guards what it holds, but a password reused on other sites is beyond this café’s reach.',
  },
  {
    id: 14,
    act: 'protected',
    kicker: 'How your data is protected',
    title: 'Who sees what — exactly',
    subtitle: 'Personal data appears only where it must: on your screen, and on the café screen while it serves you.',
    content: 'who',
    script:
      'Protection is also a question of who can see what, and here the answer is short. YOU see your own orders — your items, your notes, your totals, your history: your tickets, your business. THE CAFÉ sees the claim details of the orders it is serving — the name to call out, the phone to ring if there is a delay — and that is the extent of it; the café cannot see your password, cannot see the orders of another customer, and has no access to anything beyond its own counter work. EVERYONE ELSE sees the menu — photos, prices, descriptions — and exactly zero personal information, because the public side touches no personal data at all. A last tip that doubles as privacy advice: the counter asks for your CLAIM code, not your life story. The code proves you ordered without announcing anything about you — you can even send a friend to claim an order for you.',
  },
  {
    id: 15,
    act: null,
    kicker: 'The people behind the coffee',
    title: 'The Team',
    subtitle: '',
    content: 'team',
    script:
      'A quick beat about the people behind this before we land. I am Uelmark G. Valdehueza — AzeuMark — and I built AzeuCafe from first sketch to final product: the customer journey you just walked through, the owner side of the counter, and every protection we discussed. The dashed card beside mine is deliberately reserved for my teammate — their name and role will be added in the final version of this deck. One more thing worth saying: this system was run through real situations before it was shown to anyone. First orders, changed minds, sold-out items retired mid-day, orders cancelled from both sides, logins from different devices — the rules held in every single case. What you saw today is not a mockup: it is a working café, and it is running as we speak.',
  },
  {
    id: 16,
    act: null,
    kicker: 'Summary',
    title: 'Thank you — and questions?',
    subtitle: '',
    content: 'thanks',
    script:
      'Let me land the whole talk in thirty seconds. To USE AzeuCafe: browse the menu, build your cart, place your order, keep your AZ claim code, pay cash at the counter, and follow everything on My Orders. Cancel freely while your order is still Waiting; when it is Ready, tap "mark completed" — and if it is Processing, the counter is one conversation away. To TRUST it: AzeuCafe collects only what it needs — and nothing else; it holds zero payment data because payment is cash; your name, phone and claim details are locked in a vault the moment they arrive, opened only by the café while it serves you; your password is stored as an unreadable fingerprint that nobody — including the café — can turn back; and every screen shows each person exactly what they need and nothing wider. Thank you very much for listening — I will happily take your questions now.',
  },
]
