הוראות פריסה — אתר ארץ הצבי
==============================

מבנה התיקייה
-------------
  wrangler.jsonc   קובץ הגדרות ל-Cloudflare
  _worker.js       השרת (שומר את המבזקים והתמונות)
  public/          כל קבצי האתר — index.html, terms.html, accessibility.html, img וכו'

חשוב: המבנה הזה חייב להישמר בדיוק. wrangler.jsonc ו-_worker.js בשורש,
כל השאר בתוך public.


שלב 1 — יצירת האחסון (KV)
--------------------------
Cloudflare Dashboard → תפריט צדדי → Storage & Databases → KV → Create
שם: hatzvi-site → Create

אחרי היצירה יופיע בשורה של hatzvi-site מזהה ארוך (Namespace ID),
משהו בסגנון:  8f3c1a9e42b74d0b9c15e7ab2d6f0031
העתיקו אותו.


שלב 2 — הדבקת המזהה בקובץ ההגדרות
-----------------------------------
פותחים את הקובץ wrangler.jsonc (בעורך טקסט או ישירות ב-GitHub),
ומחליפים את השורה:

      "id": "PASTE_YOUR_KV_NAMESPACE_ID_HERE"

במזהה שהעתקתם, למשל:

      "id": "8f3c1a9e42b74d0b9c15e7ab2d6f0031"

שומרים. ב-GitHub: לוחצים על הקובץ → אייקון העיפרון → עורכים → Commit changes.


שלב 3 — העלאה ל-GitHub
-----------------------
מעלים את שלושת הפריטים לשורש ה-repository:
   wrangler.jsonc
   _worker.js
   התיקייה public (על כל תוכנה)

אם כבר העליתם קודם קבצים לשורש (index.html, img וכו') — מוחקים אותם משם,
כי עכשיו הם נמצאים בתוך public.


שלב 4 — סיסמת ניהול (מומלץ)
----------------------------
Workers & Pages → hatzvi-site → Settings → Variables and Secrets
Add → סוג Secret
   Name:  ADMIN_PASSWORD
   Value: הסיסמה שתבחרו
Save. (מחליפה את ברירת המחדל 102030)


שלב 5 — פריסה
--------------
כל עדכון ב-GitHub מפעיל פריסה אוטומטית.
לפריסה ידנית: Deployments → שלוש נקודות ליד הפריסה האחרונה → Retry deployment.


בדיקה
------
פותחים בדפדפן:  https://hatzvi.site/api/config

  {"cfg":null,"storage":true}   ← הכול תקין
  ..."storage":false            ← המזהה בשלב 2 לא נכון או לא נשמר
  404                            ← wrangler.jsonc לא בשורש, או שהפריסה נכשלה

אם הפריסה נכשלת, פתחו את ה-Build log — הוא אומר בדיוק מה חסר.


איך משתמשים
------------
כפתור "הגדרות" בתחתית האתר → סיסמה.
עריכת מבזקים, טקסטים ותמונות נשמרת קודם במחשב שלכם.
כדי שכולם יראו — "שמירה ופרסום לכל הגולשים".
הפס בראש המקטע מדווח בדיוק מה מצב החיבור לשרת.
