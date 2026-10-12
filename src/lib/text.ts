/**
 * Κεφαλαία ελληνικά χωρίς τόνους (ΟΣΠΡΙΑ, όχι ΌΣΠΡΙΑ). Τα διαλυτικά μένουν (ΑΪΔΙ).
 * Δεν βασιζόμαστε στο CSS `text-transform: uppercase`, γιατί η συμπεριφορά του
 * εξαρτάται από το lang και τον browser. Όλο το κείμενο με κεφαλαία περνά από εδώ.
 */
export function upperEl(text: string): string {
  return text
    .normalize('NFD')
    .replace(/́/g, '')
    .normalize('NFC')
    .toLocaleUpperCase('el-GR');
}

/** Ποσότητα για εμφάνιση: 1250 γρ → "1,3 κιλά", 2.5 κουτί → "2,5 κουτί". */
export function fmtQty(qty: number, unit: string): string {
  if (!qty) return '';
  if (unit === 'γρ' && qty >= 1000) {
    return `${(Math.round(qty / 100) / 10).toString().replace('.', ',')} κιλά`;
  }
  return `${(Math.round(qty * 10) / 10).toString().replace('.', ',')} ${unit}`;
}
