/**
 * ארץ הצבי · אמנת ההורים — קליטת טפסים ל-Google Sheets
 *
 * התקנה (5 דקות):
 * 1. צרו Google Sheet חדש בחשבון של הנהגת ההורים.
 * 2. בתפריט: הרחבות ← Apps Script. מחקו את הקוד הקיים והדביקו את הקובץ הזה.
 * 3. שמרו, ואז: פריסה ← פריסה חדשה ← סוג: אפליקציית אינטרנט.
 *    "הפעלה בתור": אני. "למי יש גישה": כל אחד.
 * 4. העתיקו את כתובת ה-Web App (מסתיימת ב-/exec) לקובץ content/config.ts בשדה formEndpoint, ובנו מחדש.
 *
 * מד ההצטרפות באתר:
 * המד מוצג רק אם הנהגת ההורים אישרה לפרסם מספרים. כדי לאשר:
 * Apps Script ← הגדרות פרויקט ← מאפייני סקריפט ← הוסיפו PUBLISH_COUNTS עם הערך true.
 * המד מציג רק מספר משפחות לפי שכבה, בלי שמות ובלי פרטים מזהים.
 */

const SHEET_NAME = 'הצטרפויות';
const HEADERS = ['תאריך', 'שכבה', 'כיתה', 'עמדה', 'מידע נוסף', 'רכישה משותפת', 'נציגות', 'שם', 'פרטי קשר'];
const STANCE = {
  delay: 'מעוניינים לדחות',
  reduce: 'כבר יש סמארטפון, בוחנים צמצום',
  curious: 'מתלבטים, רוצים לשמוע עוד',
};
const GRADES = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setRightToLeft(true);
    sh.setFrozenRows(1);
  }
  return sh;
}

function clean_(v, max) {
  return String(v || '')
    .replace(/^[=+\-@]/, "'$&") // מניעת הזרקת נוסחאות
    .slice(0, max);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (GRADES.indexOf(d.grade) === -1 || !STANCE[d.stance]) {
      return json_({ ok: false });
    }
    const it = Array.isArray(d.interests) ? d.interests : [];
    sheet_().appendRow([
      new Date(),
      d.grade,
      clean_(d.klass, 2),
      STANCE[d.stance],
      it.indexOf('info') > -1 ? '✓' : '',
      it.indexOf('purchase') > -1 ? '✓' : '',
      it.indexOf('rep') > -1 ? '✓' : '',
      clean_(d.name, 60),
      clean_(d.contact, 80),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.action !== 'counts') return json_({ ok: true });
  const publish = PropertiesService.getScriptProperties().getProperty('PUBLISH_COUNTS') === 'true';
  if (!publish) return json_({ published: false });
  const rows = sheet_().getDataRange().getValues().slice(1);
  const counts = {};
  rows.forEach(function (r) {
    if (r[3] === STANCE.delay || r[3] === STANCE.reduce) counts[r[1]] = (counts[r[1]] || 0) + 1;
  });
  return json_({ published: true, counts: counts });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
