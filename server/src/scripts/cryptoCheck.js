/**
 * AESCrypt sanity check: `npm run test:crypto`
 *
 * Three proofs used in the security slideshow:
 *   1. roundtrip — decrypt(encrypt(x)) === x
 *   2. tamper    — a modified ciphertext MUST fail (GCM auth tag)
 *   3. wrong key — decryption with a different key MUST fail
 */
import 'dotenv/config'
import { encrypt, decrypt } from '../utils/aescrypt.js'

const KEY = process.env.AES_KEY

let pass = 0
let fail = 0

// 1) Roundtrip on realistic user data (incl. spaces)
for (const text of ['Uelmark', '0917 123 4567', 'less sugar please']) {
  const cipher = encrypt(text, KEY)
  const back = decrypt(cipher, KEY)
  if (back === text) {
    pass += 1
    console.log(`PASS roundtrip: "${text}" -> ${cipher.slice(0, 28)}... -> decoded exactly`)
  } else {
    fail += 1
    console.log(`FAIL roundtrip: expected "${text}", got "${back}"`)
  }
}

// 2) Tampering — flip characters at the tail of the ciphertext, decrypt must throw
const tamperBase = encrypt('Juan Dela Cruz', KEY)
const tampered = tamperBase.slice(0, -2) + (tamperBase.endsWith('AA') ? 'BB' : 'AA')
try {
  decrypt(tampered, KEY)
  fail += 1
  console.log('FAIL tamper: tampered ciphertext decrypted (must throw!)')
} catch {
  pass += 1
  console.log('PASS tamper: decrypt() threw on tampered ciphertext (auth tag mismatch)')
}

// 3) Wrong key — a valid-format key with wrong bytes must not decrypt
const wrongKey = '00'.repeat(32)
try {
  decrypt(tamperBase, wrongKey)
  fail += 1
  console.log('FAIL wrong-key: decryption succeeded with the wrong key (must throw!)')
} catch {
  pass += 1
  console.log('PASS wrong-key: decrypt() threw with a wrong key (GCM tag mismatch)')
}

console.log(`\nResult: ${pass} passed, ${fail} failed.`)
console.log(fail === 0 ? 'AESCrypt is behaving correctly.' : 'AESCrypt NEEDS ATTENTION.')
process.exit(fail === 0 ? 0 : 1)
