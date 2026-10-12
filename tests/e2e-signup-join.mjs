import puppeteer from 'puppeteer-core';

// Δοκιμή από άκρη σε άκρη σε πραγματικό browser: εγγραφή, νοικοκυριό, πρόσκληση, είσοδος δεύτερου χρήστη.
// Τρέχει με: APP_URL=https://naskal.github.io/meal-planner/ npm run test:e2e
// Στο τέλος σβήνει τα δεδομένα και τους λογαριασμούς δοκιμής.
const URL = process.env.APP_URL || 'http://localhost:4173/meal-planner/';
const KEY = 'AIzaSyB4OONAo0K_i-GBiOx7BH8kIjc4oy7yGwg';
const DOCS = 'https://firestore.googleapis.com/v1/projects/meal-planner-a6aee/databases/(default)/documents';
const stamp = Date.now();
const users = [
  { label: 'A', name: 'Δοκιμή Πρώτος', email: `mp-e2e-a-${stamp}@example.com`, password: 'E2e-test-pass-123' },
  { label: 'B', name: 'Δοκιμή Δεύτερος', email: `mp-e2e-b-${stamp}@example.com`, password: 'E2e-test-pass-123' },
];
const say = (m) => console.log(m);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--no-sandbox'],
});

async function clickText(page, text) {
  const ok = await page.evaluate((text) => {
    const el = [...document.querySelectorAll('button')].find((e) => e.textContent.trim().includes(text));
    if (!el) return false;
    el.click();
    return true;
  }, text);
  if (!ok) throw new Error('Δεν βρέθηκε κουμπί: ' + text);
}
const bodyText = (page) => page.evaluate(() => document.body.innerText);
const waitText = (page, text, ms = 20000) =>
  page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: ms }, text);

async function type(page, id, value) {
  const sel = '[id="' + id + '"]';
  await page.click(sel);
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.type(sel, value);
}

// Να μη φανεί ποτέ η οθόνη σφάλματος.
async function watchError(page) {
  await page.evaluateOnNewDocument(() => {
    window.__sawError = false;
    new MutationObserver(() => {
      if (document.body && document.body.innerText.includes('Δεν φορτώθηκαν τα δεδομένα')) window.__sawError = true;
    }).observe(document, { childList: true, subtree: true, characterData: true });
  });
}

let ok = true;
const expect = (cond, label) => {
  say((cond ? 'OK    ' : 'FAIL  ') + label);
  if (!cond) ok = false;
};

try {
  // ---- Χρήστης Α: εγγραφή και νέο νοικοκυριό
  const a = await (await browser.createBrowserContext()).newPage();
  await a.setViewport({ width: 390, height: 844 });
  await watchError(a);
  await a.goto(URL, { waitUntil: 'networkidle0' });
  await clickText(a, 'Δεν έχω λογαριασμό');
  await type(a, 'f-Το όνομά σου', users[0].name);
  await type(a, 'f-Email', users[0].email);
  await type(a, 'f-Κωδικός', users[0].password);
  await clickText(a, 'Δημιουργία λογαριασμού');
  await waitText(a, 'Φτιάχνω νέο νοικοκυριό');
  const title = await a.$eval('.gate-title', (e) => e.textContent);
  expect(title.includes(users[0].name), 'Α: ο χαιρετισμός δείχνει το όνομα (' + title + ')');
  await clickText(a, 'Φτιάχνω νέο νοικοκυριό');
  await type(a, 'f-Όνομα νοικοκυριού', 'ΔΟΚΙΜΗ E2E');
  await clickText(a, 'Δημιουργία');
  await waitText(a, 'Εβδομάδα 1 από 4');
  expect(!(await a.evaluate(() => window.__sawError)), 'Α: δεν εμφανίστηκε οθόνη σφάλματος');

  await a.click('button[aria-label="Λογαριασμός και ρυθμίσεις"]');
  await waitText(a, 'Δημιουργία κωδικού πρόσκλησης');
  await clickText(a, 'Δημιουργία κωδικού πρόσκλησης');
  await a.waitForSelector('.invite-code');
  const code = await a.$eval('.invite-code', (e) => e.textContent.trim());
  say('      κωδικός πρόσκλησης ' + code);

  // ---- Χρήστης Β: εγγραφή και είσοδος με κωδικό
  const b = await (await browser.createBrowserContext()).newPage();
  await b.setViewport({ width: 390, height: 844 });
  await watchError(b);
  await b.goto(URL, { waitUntil: 'networkidle0' });
  await clickText(b, 'Δεν έχω λογαριασμό');
  await type(b, 'f-Το όνομά σου', users[1].name);
  await type(b, 'f-Email', users[1].email);
  await type(b, 'f-Κωδικός', users[1].password);
  await clickText(b, 'Δημιουργία λογαριασμού');
  await waitText(b, 'Έχω κωδικό πρόσκλησης');
  await clickText(b, 'Έχω κωδικό πρόσκλησης');
  await type(b, 'f-Κωδικός πρόσκλησης', code);
  await clickText(b, 'Μπες στο νοικοκυριό');
  await waitText(b, 'Εβδομάδα 1 από 4');
  expect(!(await b.evaluate(() => window.__sawError)), 'Β: δεν εμφανίστηκε οθόνη σφάλματος');

  await b.click('button[aria-label="Λογαριασμός και ρυθμίσεις"]');
  await waitText(b, 'Νοικοκυριό');
  const t = await bodyText(b);
  expect(t.includes(users[0].name) && t.includes(users[1].name), 'Β: στις ρυθμίσεις φαίνονται και τα δύο ονόματα');
  expect(t.includes('ΔΟΚΙΜΗ E2E'), 'Β: φαίνεται το όνομα του νοικοκυριού');

  // Ο Α βλέπει live τον Β χωρίς refresh
  await waitText(a, users[1].name, 8000).catch(() => {});
  await a.click('button[aria-label="Πίσω"]').catch(() => {});
  await a.click('button[aria-label="Λογαριασμός και ρυθμίσεις"]').catch(() => {});
  await waitText(a, users[1].name, 8000);
  expect((await bodyText(a)).includes(users[1].name), 'Α: βλέπει τον Β στο νοικοκυριό');

  // Refresh: μένει συνδεδεμένος
  await b.reload({ waitUntil: 'domcontentloaded' });
  await waitText(b, 'Εβδομάδα 1 από 4');
  expect(true, 'Β: μετά από refresh μένει συνδεδεμένος');
} catch (err) {
  ok = false;
  say('ΣΦΑΛΜΑ ΔΟΚΙΜΗΣ: ' + err.message);
} finally {
  await browser.close();

  // Καθαρισμός: ο Β σβήνει το προφίλ του, ο Α το νοικοκυριό και το προφίλ του, μετά διαγράφονται οι λογαριασμοί.
  const signed = [];
  for (const u of users) {
    const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + KEY, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: u.email, password: u.password, returnSecureToken: true }),
    });
    const j = await r.json();
    if (j.idToken) signed.push({ ...u, uid: j.localId, token: j.idToken });
  }
  const headers = (s) => ({ authorization: 'Bearer ' + s.token });
  for (const s of [...signed].reverse()) {
    const prof = await (await fetch(DOCS + '/users/' + s.uid, { headers: headers(s) })).json();
    const hid = prof.fields && prof.fields.householdId && prof.fields.householdId.stringValue;
    if (s.label === 'A' && hid) {
      const d = await fetch(DOCS + '/households/' + hid, { method: 'DELETE', headers: headers(s) });
      say('Καθαρισμός νοικοκυριού ' + hid + ': HTTP ' + d.status);
    }
    const d2 = await fetch(DOCS + '/users/' + s.uid, { method: 'DELETE', headers: headers(s) });
    say('Καθαρισμός προφίλ ' + s.label + ': HTTP ' + d2.status);
  }
  for (const s of signed) {
    await fetch('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=' + KEY, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken: s.token }),
    });
  }
  say('Οι λογαριασμοί δοκιμής διαγράφηκαν.');
}
say(ok ? '\nΑΠΟΤΕΛΕΣΜΑ: ΟΛΑ ΕΝΤΑΞΕΙ' : '\nΑΠΟΤΕΛΕΣΜΑ: ΑΠΟΤΥΧΙΑ');
process.exit(ok ? 0 : 1);
