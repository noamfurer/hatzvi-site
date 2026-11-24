/* טעינה מוקדמת: מפעיל אנימציות רק אם המשתמש לא ביקש להפחית תנועה.
   אם הסקריפט הראשי לא נטען מסיבה כלשהי – אחרי 3 שניות כל התוכן מוצג בכל מקרה. */
(function () {
  var d = document.documentElement;
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (reduce) return;
  d.classList.add("motion");
  try {
    if (!sessionStorage.getItem("meetDoor") && !location.hash) d.classList.add("intro");
  } catch (e) {}
  setTimeout(function () {
    if (!window.__meetReady) {
      d.classList.remove("intro");
      d.classList.add("go", "fallback");
    }
  }, 3000);
})();
