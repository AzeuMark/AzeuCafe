/**
 * The 16-slide security presentation — slide definitions + the FULL SPOKEN
 * SCRIPT under each one. Scripts are revealed only in the PresenterNotes
 * drawer (button bottom-right, or press S) so the audience never sees them.
 *
 * Slide visuals live in ../SlideContent.jsx keyed by `content`.
 */

export const ACT_META = {
  usage: { label: 'Act 1 · Usage', color: '#4E86D8' },
  security: { label: 'Act 2 · Security', color: '#E5A13C' },
  aescrypt: { label: 'Act 3 · AESCrypt', color: '#3D8B5F' },
}

export const slides = [
  {
    id: 1,
    act: null,
    kicker: 'AzeuMark presents',
    title: 'AzeuCafe',
    subtitle:
      'A cash-at-counter café ordering system with AES-256-GCM encryption at its core — and every design choice explained.',
    content: 'title',
    script:
      'Good day, everyone. My name is Uelmark G. Valdehueza — online, I go by AzeuMark — and what you are about to see is AzeuCafe, my capstone project for this subject. AzeuCafe is a full café ordering system: a customer browses the menu on their phone, places an order, shows an order code at the counter, and pays in cash. Behind that simple surface runs an Express API and a MongoDB database, and running through all of it, a single security idea: every piece of personal data that touches that database is encrypted with AES-256-GCM — real cryptography, not a checkbox. This presentation has three acts. Act 1 is a quick walkthrough of how the system is used. Act 2 is an honest look at what we protect and why. Act 3 goes deep into the actual security file — the AESCrypt module — where I will show you the real code, running live, decrypting your own words. That is roughly ten to twelve minutes. Let us start the espresso machine.',
  },
  {
    id: 2,
    act: 'usage',
    kicker: 'Act 1 · Usage',
    title: 'What is AzeuCafe?',
    subtitle: 'Two roles. One golden rule: pay cash at the counter.',
    content: 'roles',
    script:
      'First, the shape of the system. There are exactly two roles. A user is a customer: they register, they browse the menu, they order, they claim. The owner is the café itself: they manage the menu and run the order queue from a separate dashboard. Nothing in between — no middlemen, no admin panel needed. And there is one golden rule the whole design is built around: payment is CASH at the counter. Deliberately, there is no payment gateway, no card numbers, no e-wallets anywhere in this project. That is both honest scope for a school build and a security choice — the system never touches money, so the most dangerous class of web attacks, payment fraud, is simply out of scope by design. The system tracks, prepares, and timestamps the order; your wallet stays in your pocket until the cup does. Those two roles and that rule are the frame for everything you will see next.',
  },
  {
    id: 3,
    act: 'usage',
    kicker: 'Act 1 · Usage · User',
    title: 'Register & login',
    subtitle: 'Passwords are hashed with bcrypt. Sessions ride an httpOnly JWT cookie.',
    content: 'auth',
    script:
      'Registration and login happen in one modal that opens over any page. Two trust boundaries are already enforced here, and both are enforced server-side. First: the registration form can only ever create the role "user". You could open dev tools and edit the form all day — the server ignores what the client claims and assigns the role itself. Nobody can self-promote to owner. Second: the password is never stored as a password. On the way in, bcrypt hashes it with a per-user salt; the original is mathematically destroyed. When you log in, the hash is compared, and if it matches, the server answers with a JSON web token set as an httpOnly cookie. httpOnly means even the page JavaScript cannot read that token — cross-site scripts get nothing. Sessions live in the browser cookie jar, not in localStorage where an XSS attack would go shopping.',
  },
  {
    id: 4,
    act: 'usage',
    kicker: 'Act 1 · Usage · User',
    title: 'Browse the menu & fill the cart',
    subtitle: 'Photos, prices, quantities — and the browser still gets to send nothing but ids.',
    content: 'menu',
    script:
      'The public menu is served by one endpoint, grouped into four categories: espresso drinks, iced drinks, pastries, and snacks. Every item has a photo, a description, and a peso price — the same data the counter sees. You tap items into the cart, and a stepper adjusts quantities up to fifty. Here is the part I want you to notice, because it is the quiet security backbone of the entire ordering flow: the browser is allowed to send ONLY item ids and quantities. Not prices, not names, not totals. It does not matter how I tamper with the page or with a copy of the request — the server looks each id up in its own menu collection, takes the price from its own database, and computes the total there. The client proposes what it wants; the server decides what it costs. Hold that thought for two more slides.',
  },
  {
    id: 5,
    act: 'usage',
    kicker: 'Act 1 · Usage · User',
    title: 'Checkout → the claim code',
    subtitle: 'Place the order, read the code at the counter, pay in cash.',
    content: 'checkout',
    script:
      'Checkout is one screen. The customer confirms their claim details — name and phone — and may add a note for the barista, like "less sugar please". The moment the order is placed, the server does three things. One: it re-prices every line item from its own menu collection, so the total is computed server-side, exactly as promised on the last slide. Two: it packs the freshly computed items into an immutable snapshot on the order — names, prices, photos — so if the owner later edits the menu or changes a price, receipts that already exist never change. Three: it encrypts the contact name and phone number with AES-256-GCM before the order row is even saved. The customer then gets their claim code — like AZ-0001 — and a big panel that says PAY CASH AT THE COUNTER. They read the code to the cashier; the cashier punches it in on the owner dashboard, and that order goes waiting → processing → ready → completed — the cashier is the engine of that state machine.',
  },
  {
    id: 6,
    act: 'usage',
    kicker: 'Act 1 · Usage · User',
    title: 'Order tracking & the rules',
    subtitle: 'Five statuses. The cancel rule depends on who you are and when you ask.',
    content: 'statuses',
    script:
      'Every order lives in exactly one of five statuses: waiting, processing, ready, completed — or cancelled. So what CAN the user do? In waiting, they may cancel — free, instant, the café has not yet accepted it. In processing, they may NOT cancel. This is a deliberate rule, and yes, it is also just how cafés work in real life: the milk is already steaming. If processing still matters, you talk to the owner — and on this system, the owner therefore CAN cancel in processing, because only the café knows whether the drink was already made or whether giving a refund is worth it. In ready, the user again has a button: "got it — mark completed", claiming on their end, so the dashboard stays accurate. Every one of these rules is enforced by a transitions table on the server — you will see that exact table on the owner dashboard in a moment.',
  },
  {
    id: 7,
    act: 'usage',
    kicker: 'Act 1 · Usage · Owner',
    title: 'Menu management',
    subtitle: 'Add, edit, or soft-retire. Three ways to give an item a photo.',
    content: 'ownerMenu',
    script:
      'Now the owner side. On the menu manager, the owner can add new items, edit existing ones — name, price, category, description — and retire items. Retire, not delete: the delete button actually only sets a flag called "retired". Why? Because of old orders. Every order has its own snapshot — an order that sold a Butter Croissant on Monday still needs to know what a Butter Croissant was and what it cost, forever. So retired items vanish from the public menu but stay physically in the database, and can be restored with one click. For photos, the owner picks a source three ways: bundled library — twelve photos shipped with the app, so the demo works with zero network; file upload — multer receives the photo on the server with a type and size check; or paste a URL. All three feed one photo field, the server validates the result, and only the owner role can touch any of this.',
  },
  {
    id: 8,
    act: 'usage',
    kicker: 'Act 1 · Usage · Owner',
    title: 'The orders dashboard',
    subtitle: 'One queue, five-second polling, and the rules table you already saw.',
    content: 'ownerOrders',
    script:
      'On the other screen, the owner sees the whole queue. Active orders are highlighted; finished ones dim out. It polls every five seconds, so a customer can be standing at the counter while the owner watches the order appear. Each card shows the claim code, the items and totals, the barista note — and the customer contact name and phone, displayed in plaintext. That is not a leak: that is the last step of the encryption journey. The data is encrypted at rest in MongoDB; when the OWNER — an authenticated user with the owner role, through the owner API — asks for it, the server decrypts it for them, because the owner must call that customer. Authorization decides who may read secrets, not whether they exist. The action buttons are the transitions table made physical: Accept moves waiting to processing; Mark Ready moves processing to ready; Hand Out completes it; Cancel, with a confirmation, works while the order is still active. And just like the user side, all of these transitions are validated AGAIN on the server before anything changes.',
  },
  {
    id: 9,
    act: 'security',
    kicker: 'Act 2 · Security',
    title: 'What we protect & why',
    subtitle: 'Think like an attacker: the database is the treasure chest.',
    content: 'protects',
    script:
      'Now act two. Let us think like an attacker with a list of questions. If someone at this school lost the MongoDB data — a dump file, a copy of the disk — what would they actually hold? That is the whole threat model in one sentence. And here is the honest answer, column by column. The password column does not scare me: it is bcrypt-hashed — irreversible, salted, deliberately slow to brute force. The email column is plaintext: a choice we will defend in a minute. But the names and the phone numbers — the actual personal data of real users — would be sitting there as ciphertext: strings like "v1.x9Kq..." that are nothing without the key. Same for every order claim snapshot, every customer call-back number. So the crown jewels are protected, the threatening-but-less-sensitive data is guarded differently, and the harmless data is left alone. Real design means choosing per data type — not one giant padlock over everything.',
  },
  {
    id: 10,
    act: 'security',
    kicker: 'Act 2 · Security',
    title: 'Encrypted vs hashed vs plaintext',
    subtitle: 'Three kinds of data, three different tools — and each one for a reason.',
    content: 'table',
    script:
      'This table is the heart of the security design — the question every system must answer per column: can we get the data back? For names and phone numbers, YES — we must. The tech is AES-256-GCM, a symmetric cipher: encrypt with the server key, decrypt with the same server key. It is secure and reversible, with the key as the single secret. For PASSWORDS, the answer must be NO — never, ever reversible, even by us. That is bcrypt: a one-way hash plus a unique salt per user, deliberately slow so that guessing a billion candidates takes years. Compare that to just bulking AES-256 and you see the misunderstanding: we do NOT encrypt passwords, because whoever steals the key would then own every password in the world. And EMAIL is plaintext by choice: login needs exact-match lookups, uniqueness, and indexing, and an email is the one piece of these three you use publicly every day. Every column here is a documented, defensible decision — the code agrees with the slides.',
  },
  {
    id: 11,
    act: 'security',
    kicker: 'Act 2 · Security',
    title: 'Keys & honest limitations',
    subtitle: 'Where the secret lives — and what happens if it is lost.',
    content: 'keys',
    script:
      'Where does the magic key live? In exactly one place: the server .env file, on the server, gitignored — it has never been inside the Git history of this project and never inside the client bundle. AES_KEY is thirty-two random bytes, hex-encoded: sixty-four characters. JWT_SECRET guards the sessions, the same story. What happens if that file is lost? This is the part most projects hide — and we will say it out loud: the encrypted data becomes unreadable. By design, decryption does not lie: it refuses to return garbage or fake data. The system has a safeDecrypt helper that surfaces a marker — "unreadable — wrong key or tampered" — so the page keeps working and the owner knows something is wrong. The payload format is versioned — it starts with "v1", so if a key rotation were ever needed, it is a known upgrade path, not an archaeology project. That is honest engineering: a school-scale system has school-scale boundaries, and we can name them.',
  },
  {
    id: 12,
    act: 'aescrypt',
    kicker: 'Act 3 · AESCrypt',
    title: 'Meet the file',
    subtitle: 'One module. Two functions. The entire security policy of the data layer.',
    content: 'meet',
    script:
      'Welcome to act three — where I stop describing and start showing. The entire data-security policy of AzeuCafe lives in one file, server/src/utils/aescrypt.js. The rulebook has one line on it: nothing else in the project is allowed to encrypt or decrypt — models and controllers import these two functions, and you will see on the next slide that this is literally true. Two functions. encrypt(text, key) takes any string and a thirty-two-byte hex key and returns the version pack — notice the algorithm is frozen inside the module: AES-256-GCM. It cannot be downgraded or misconfigured by a caller. It generates a fresh random IV each time, cipher.update, cipher.final, cipher.getAuthTag, and packs version, IV, tag, and ciphertext with base64 and dots. decrypt(text, key) is the exact inverse, and its most important property is what it does NOT do: it never returns garbage. Unknown format? Throw. Wrong key? Throw. One byte of the payload changed? GCM authentication fails, and final() throws. That is what "authenticated encryption" means — integrity is part of the deal, not an afterthought.',
  },
  {
    id: 13,
    act: 'aescrypt',
    kicker: 'Act 3 · AESCrypt',
    title: 'The REAL code',
    subtitle: 'No mockup, no paraphrase — the actual file, bundled straight from the server.',
    content: 'code',
    script:
      'This window is not a screenshot and not a paraphrase of the code. It is the actual file — the build imports it raw, straight out of the server folder, so what the class sees is exactly what runs. Top of file: the imports from node:crypto — createCipheriv, createDecipheriv, randomBytes — plus the header comment that acts as the law of the file: the single-gatekeeper rule, and the WHY of GCM: authenticated encryption, tamper-proof by construction. parseKey validates that the key is exactly 32 bytes; anything else refuses to run. Then encrypt: fresh twelve-byte IV so the same name never encrypts to the same ciphertext twice — I will show you that property live in one minute. The four pieces — version, IV, tag, ciphertext — are base64-joined with dots. And decrypt: format check, key check, setAuthTag, and final() as the cliff edge — a single flipped bit in the database makes it throw instead of surrendering fake data. Next slide: we run it.',
  },
  {
    id: 14,
    act: 'aescrypt',
    kicker: 'Act 3 · AESCrypt',
    title: 'Live: encrypt, decrypt, tamper',
    subtitle: 'The playground calls the REAL encrypt() and decrypt() on the server — try it while I talk.',
    content: 'playground',
    script:
      'This playground is wired to two public demo endpoints that exist for exactly this slide — and they do not contain any demo crypto of their own. They call the real encrypt() and decrypt() functions from the aescrypt file you just saw. Type any name — try your own, or "Juan Dela Cruz" — and press Encrypt. The server answers with a fresh, unique ciphertext — the same words will never produce the same ciphertext twice — and you see it morph on screen. Note the beginning: "v1." — same as the ones you saw in the code, same as the values sitting encrypted in the classroom database right now. Now the part that usually gets applause: find one character inside that ciphertext and corrupt it — I gave you a button that flips exactly one character — then press Decrypt. The server REFUSES. It does not reply with garbled data, it does not guess, it throws and tells you the truth: wrong key or tampered. That is AES-256-GCM authentication working live — in front of you, in one click. And in all of this, the key never left the server — your words traveled, your words came back, and the secret stayed home.',
  },
  {
    id: 15,
    act: null,
    kicker: 'The people behind the coffee',
    title: 'The Team',
    subtitle: '',
    content: 'team',
    script:
      'Quick beat before the last slide, on a matter of fairness: who built this. I am Uelmark G. Valdehueza — AzeuMark — I designed and built the whole system end to end: the React client, the Express server, the MongoDB schema, the AESCrypt module, the order state machine, and this presentation. The dashed slot beside me on the slide is intentionally reserved for my teammate — their name and role will be added in the final version of this deck. One more thing worth saying: the testing plan cut in two directions. User journeys were driven through the real UI — and then attacker attempts were driven against the API behind its back: invalid item ids, totals made up from client prices, tampered ciphertexts, cancel attempts from roles that should not be allowed. The rules held. That is why the demo you just saw works not only when you are friendly, but also when you are not.',
  },
  {
    id: 16,
    act: null,
    kicker: 'Summary',
    title: 'Thank you — and questions?',
    subtitle: 'The system is real, the code is real, the audience was the first attack class it survived.',
    content: 'thanks',
    script:
      'Let me land this in thirty seconds. AzeuCafe: a café ordering system where payment happens at the counter in cash, customers get claim codes, and orders walk a strict five-status state machine that the server, not the screen, enforces. Security as an idea, not a feature: passwords hashed with bcrypt — a one-way door with a salt; personal data — names, phones, and every order claim snapshot — encrypted with AES-256-GCM, authenticated, tamper-proof, key held only in the server .env; email openly plaintext because that is what email is for; and project-scale honesty about limitations — the versioned payloads and the safeDecrypt pathway point to known upgrade paths instead of wishful thinking. Every promise in this deck maps to a file in the repository: server-plan.md, client-plan.md and implemented.md say where everything lives, and the code you just watched run is the same code in the demo database right now. Thank you for listening — and I am happy to take questions.',
  },
]
