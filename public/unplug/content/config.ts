/**
 * הגדרות האתר. זה הקובץ היחיד שצריך לערוך כדי לחבר את הטופס.
 */
export const CONFIG = {
  /** כתובת האתר המלאה (משמשת לשיתוף ול-Open Graph) */
  siteUrl: 'https://hatzvi.site/unplug/',

  /**
   * כתובת ה-Web App של Google Apps Script (ראו apps-script/Code.gs ו-README).
   * כל עוד הערך ריק, כפתור השליחה בטופס לא מוצג, ובמקומו מופיעה הודעה שההרשמה תיפתח בקרוב.
   */
  formEndpoint: '',

  /**
   * הצגת מד ההצטרפות הקהילתי.
   * המד מושך נתונים אמיתיים מה-Apps Script, ורק אם הנהגת ההורים אישרה את פרסומם
   * (מאפיין PUBLISH_COUNTS=true בסקריפט). אם אין נתונים, המד מוסתר.
   */
  showCommunityCounter: true,

  /** קרדיט בתחתית */
  credit: 'הנהגת ההורים וועדת המסכים · ארץ הצבי במורשת',
} as const;
