/* =====================================================================
   ערב היכרות – ארץ הצבי | לוגיקת העמוד
   - אנימציות (כולל כניסת משפחת הצבאים בגלילה)
   - טופס אישור הגעה ושליחה מאובטחת ל-Google Apps Script
   - שיתוף, יומן וניווט
   שום פרט אישי לא נשמר בדפדפן (לא Local Storage ולא אנליטיקה).
   ===================================================================== */
(function () {
  "use strict";

  var C = window.MEET_CONFIG || {};
  var doc = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MOTION = doc.classList.contains("motion");
  window.__meetReady = true;

  /* ---------------- Door intro ---------------- */
  function runDoor() {
    if (!doc.classList.contains("intro")) { doc.classList.add("go"); return; }
    try { sessionStorage.setItem("meetDoor", "1"); } catch (e) {}
    var door = document.createElement("div");
    door.className = "door";
    door.setAttribute("aria-hidden", "true");
    door.innerHTML = '<div class="door-panel door-r"></div><div class="door-panel door-l"></div>' +
      '<div class="door-emblem"><img src="/meet/assets/images/logo-mark.webp" alt=""></div>';
    document.body.appendChild(door);
    doc.classList.remove("intro");
    var opened = false;
    function open() {
      if (opened) return; opened = true;
      door.classList.add("open");
      setTimeout(function () { doc.classList.add("go"); }, 350);
      setTimeout(function () { door.classList.add("gone"); door.remove(); }, 1300);
    }
    // פתיחה מהירה – לא מעכבת את הגישה לתוכן; לחיצה/גלילה פותחות מיד
    setTimeout(open, 450);
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, open, { once: true, passive: true });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var els = $$(".reveal, .footer");
    if (!MOTION || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Scroll scene + floating CTA ---------------- */
  var scene = $("#scene");
  var heroCta = $("#heroCta");
  var rsvp = $("#rsvp");
  var floatCta = $("#floatCta");
  var floatLink = floatCta ? floatCta.querySelector("a") : null;
  var submitted = false;
  var ticking = false;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function easeInOut(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.pageYOffset || doc.scrollTop;

    if (scene && MOTION) {
      var r = scene.getBoundingClientRect();
      var absTop = r.top + y;
      var start = Math.max(0, absTop - vh * 0.8);
      var range = Math.max(vh * 0.6, 300);
      var p = clamp((y - start) / range, 0, 1);
      var e = easeInOut(p);
      scene.style.setProperty("--p", e.toFixed(4));
      var bob = Math.abs(Math.sin(p * Math.PI * 5)) * (1 - p) * -10;
      scene.style.setProperty("--bob", bob.toFixed(2) + "px");
    }

    if (floatCta) {
      var pastHero = heroCta ? heroCta.getBoundingClientRect().bottom < 0 : y > vh;
      var beforeForm = rsvp ? rsvp.getBoundingClientRect().top > vh * 0.85 : true;
      var show = pastHero && beforeForm && !submitted;
      if (show !== floatCta.classList.contains("show")) {
        floatCta.classList.toggle("show", show);
        floatCta.setAttribute("aria-hidden", show ? "false" : "true");
        if (floatLink) floatLink.tabIndex = show ? 0 : -1;
      }
    }
  }

  /* ---------------- Smooth scroll to form ---------------- */
  function initToForm() {
    $$(".js-to-form").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        rsvp.scrollIntoView({ behavior: MOTION ? "smooth" : "auto", block: "start" });
        try { history.replaceState(null, "", "#rsvp"); } catch (e) {}
        setTimeout(function () { rsvp.focus({ preventScroll: true }); }, MOTION ? 700 : 0);
        tokenPrefetch();
      });
    });
  }

  /* ---------------- Links from config ---------------- */
  function initLinks() {
    var ev = C.event || {};
    if (ev.start) {
      var g = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" + encodeURIComponent(ev.title || "") +
        "&dates=" + ev.start + "/" + ev.end +
        "&ctz=" + encodeURIComponent(ev.timezone || "Asia/Jerusalem") +
        "&details=" + encodeURIComponent(ev.details || "") +
        "&location=" + encodeURIComponent(ev.location || "");
      $$(".js-gcal").forEach(function (a) { a.href = g; });
    }
    if (C.wazeUrl) $$(".js-waze").forEach(function (a) { a.href = C.wazeUrl; });
    if (C.mapsUrl) $$(".js-maps").forEach(function (a) { a.href = C.mapsUrl; });
    var wa = "https://wa.me/?text=" + encodeURIComponent(C.shareText || C.pageUrl || location.href);
    $$(".js-wa").forEach(function (a) { a.href = wa; });

    $$(".js-copy").forEach(function (b) {
      b.addEventListener("click", function () { copyText(C.pageUrl || location.href); });
    });
    if (navigator.share) {
      $$(".js-native-share").forEach(function (b) {
        b.hidden = false;
        b.addEventListener("click", function () {
          navigator.share({ title: document.title, text: C.shareText || "" }).catch(function () {});
        });
      });
    }
    // close calendar menu when clicking outside
    document.addEventListener("click", function (e) {
      $$("details.cal-menu[open]").forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
    });
  }

  function copyText(text) {
    function done() { toast("הקישור הועתק! אפשר להדביק ולשתף"); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast(text); }
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* =====================================================================
     RSVP form
     ===================================================================== */
  var form = $("#rsvpForm");
  var submitBtn = $("#submitBtn");
  var attempted = false;
  var inFlight = false;
  var submissionId = null;     // נשמר בזיכרון בלבד – מונע רישום כפול בניסיון חוזר
  var token = null;
  var tokenPromise = null;

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var a = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(a);
    a[6] = (a[6] & 15) | 64; a[8] = (a[8] & 63) | 128;
    var h = Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
  }

  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    var isList = (typeof RadioNodeList !== "undefined" && el instanceof RadioNodeList) || (el.length !== undefined && !el.tagName);
    if (isList) {
      for (var i = 0; i < el.length; i++) if (el[i].checked && !el[i].disabled) return el[i].value;
      return "";
    }
    return (el.value || "").trim();
  }

  function normalizePhone(raw) {
    var d = String(raw || "").replace(/[^\d+]/g, "");
    if (d.indexOf("+972") === 0) d = "0" + d.slice(4);
    else if (d.indexOf("972") === 0 && d.length === 12) d = "0" + d.slice(3);
    d = d.replace(/\D/g, "");
    return d;
  }

  function validators() {
    return {
      parentName: function (v) {
        if (!v) return "שדה חובה";
        if (v.length < 2 || !/[A-Za-z֐-׿]/.test(v)) return "נא לכתוב שם מלא";
        return "";
      },
      childName: function (v) {
        if (!v) return "שדה חובה";
        if (!/[A-Za-z֐-׿]/.test(v)) return "נא לכתוב את שם הילד/ה";
        return "";
      },
      gan: function (v) { return v ? "" : "שדה חובה"; },
      attending: function (v) { return v ? "" : "שדה חובה"; },
      phone: function (v) {
        if (!v) return "שדה חובה";
        return /^05\d{8}$/.test(normalizePhone(v)) ? "" : "מספר לא תקין (לדוגמה: 050-1234567)";
      }
    };
  }

  function fieldBox(name) {
    if (name === "attending") return $("#attendingSet");
    var el = form.elements[name];
    return el && el.closest ? el.closest(".field") : null;
  }

  function setError(name, msg) {
    if (attempted && !msg && $("#errSummary") && !$("#errSummary").hidden) {
      setTimeout(function () { if (!$$(".field.invalid", form).length) $("#errSummary").hidden = true; }, 0);
    }
    var box = fieldBox(name);
    var err = $("#" + name + "-err");
    if (!box) return;
    box.classList.toggle("invalid", !!msg);
    box.classList.toggle("valid", !msg && !!val(name));
    if (err) err.textContent = msg || "";
    var input = name === "attending" ? null : form.elements[name];
    if (input) input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (name === "attending") $$('input[name="attending"]').forEach(function (r) { r.setAttribute("aria-invalid", msg ? "true" : "false"); });
  }

  function validateAll() {
    var v = validators(), errors = [];
    Object.keys(v).forEach(function (k) {
      var msg = v[k](val(k));
      setError(k, msg);
      if (msg) errors.push({ name: k, msg: msg });
    });
    return errors;
  }

  function showSummary(errors) {
    $("#errSummary").hidden = !errors.length;
  }

  function updateProgress() {
    var req = ["parentName", "childName", "gan", "phone", "attending"];
    var v = validators();
    var done = req.filter(function (k) { return val(k) && !v[k](val(k)); }).length;
    var left = req.length - done;
    $("#progressFill").style.width = (done / req.length * 100) + "%";
    var txt = left === 0 ? "מעולה! אפשר לשלוח" : left === 1 ? "נשאר שדה חובה אחד" : "נשארו " + left + " שדות חובה";
    $("#progressText").textContent = txt;
    $(".progress").classList.toggle("done", left === 0);
  }

  function initForm() {
    if (!form) return;
    var v = validators();

    ["parentName", "childName", "gan", "phone"].forEach(function (name) {
      var el = form.elements[name];
      el.addEventListener("blur", function () {
        if (el.value.trim() || attempted) setError(name, v[name](val(name)));
      });
      el.addEventListener("input", function () {
        if (attempted || fieldBox(name).classList.contains("invalid")) setError(name, v[name](val(name)));
        updateProgress();
      });
      // Enter עובר לשדה הבא במקום לשלוח את הטופס
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.isComposing) {
          e.preventDefault();
          var order = ["parentName", "childName", "gan", "phone"];
          var i = order.indexOf(name);
          if (i > -1 && i < order.length - 1) form.elements[order[i + 1]].focus();
          else if (name === "phone") form.querySelector('input[name="attending"]').focus();
          else el.blur();
        }
      });
    });

    $$('input[name="attending"]').forEach(function (r) {
      r.addEventListener("change", function () { setError("attending", ""); updateProgress(); });
    });

    // שדה מותנה: היכן לומדים האחים
    var wrap = $("#siblingsWrap");
    $$('input[name="siblings"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var open = val("siblings") === "yes";
        wrap.classList.toggle("open", open);
        wrap.setAttribute("aria-hidden", open ? "false" : "true");
        $$('input[name="siblingsWhere"]').forEach(function (s) {
          s.disabled = !open;
          if (!open) s.checked = false;
        });
      });
    });

    var q = form.elements.questions, qc = $("#questions-count span");
    q.addEventListener("input", function () { qc.textContent = q.value.length; });

    // שינוי בטופס אחרי שגיאת שליחה = רישום חדש
    form.addEventListener("input", function () { $("#sendError").hidden = true; });

    // הבאת אסימון אבטחה כשהטופס מתקרב למסך
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { tokenPrefetch(); tio.disconnect(); }
      }, { rootMargin: "600px 0px" });
      tio.observe(form);
    }
    form.addEventListener("focusin", tokenPrefetch, { once: true });

    form.addEventListener("submit", onSubmit);
    updateProgress();
  }

  /* ---------- server security token (verified on the server) ---------- */
  function tokenPrefetch() {
    if (!C.endpoint || token || tokenPromise) return tokenPromise;
    tokenPromise = fetchJSON(C.endpoint + (C.endpoint.indexOf("?") > -1 ? "&" : "?") + "action=token", { method: "GET" }, 20000)
      .then(function (j) {
        if (j && j.ok && j.t && j.s) token = { t: j.t, s: j.s };
        tokenPromise = null;
        return token;
      })
      .catch(function () { tokenPromise = null; return null; });
    return tokenPromise;
  }

  function fetchJSON(url, opts, timeoutMs) {
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 25000) : null;
    opts = opts || {};
    opts.redirect = "follow";
    opts.credentials = "omit";
    opts.cache = "no-store";
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error("http_" + res.status);
      return res.json();
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  function setLoading(on) {
    inFlight = on;
    submitBtn.disabled = on;
    submitBtn.classList.toggle("loading", on);
    submitBtn.setAttribute("aria-busy", on ? "true" : "false");
    $(".btn-label", submitBtn).textContent = on ? "שולחים..." : "שליחת אישור הגעה";
    $("#srStatus").textContent = on ? "שולחים את הטופס, רגע אחד" : "";
  }

  function showSendError(msg) {
    var box = $("#sendError");
    $("#sendErrorMsg").textContent = msg;
    box.hidden = false;
    box.scrollIntoView({ behavior: MOTION ? "smooth" : "auto", block: "center" });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (inFlight) return;            // מניעת לחיצה כפולה
    attempted = true;
    $("#sendError").hidden = true;

    var errors = validateAll();
    showSummary(errors);
    updateProgress();
    if (errors.length) {
      var first = errors[0].name;
      var target = first === "attending" ? form.querySelector('input[name="attending"]') : form.elements[first];
      $("#errSummary").scrollIntoView({ behavior: MOTION ? "smooth" : "auto", block: "start" });
      setTimeout(function () { target.focus({ preventScroll: true }); }, MOTION ? 450 : 0);
      return;
    }

    if (!C.endpoint) {
      showSendError("הטופס עדיין לא חובר למערכת השמירה, ולכן הפרטים לא נשלחו. אפשר לעדכן את בית הספר בדוא\"ל: e.hatzvi17@gmail.com");
      return;
    }

    if (!submissionId) submissionId = uuid();
    setLoading(true);

    var payload = {
      id: submissionId,
      parentName: val("parentName"),
      childName: val("childName"),
      gan: val("gan"),
      attending: val("attending"),
      phone: normalizePhone(val("phone")),
      siblings: val("siblings"),
      siblingsWhere: val("siblings") === "yes" ? val("siblingsWhere") : "",
      questions: val("questions"),
      website: form.elements.website.value
    };

    send(payload, 0);
  }

  function send(payload, attempt) {
    (token ? Promise.resolve(token) : (tokenPrefetch() || Promise.resolve(null)))
      .then(function (tk) {
        payload.t = tk ? tk.t : "";
        payload.s = tk ? tk.s : "";
        return fetchJSON(C.endpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },   // בקשה "פשוטה" – ללא preflight
          body: JSON.stringify(payload)
        }, 30000);
      })
      .then(function (res) {
        // הצלחה רק אם השרת אישר במפורש שהשורה נשמרה, עם אותו מזהה
        if (res && res.ok === true && res.id === payload.id) {
          success(payload.attending, res.duplicate);
          return;
        }
        var code = res && res.error;
        if (code === "too_fast" && attempt < 2) {
          // שומרים על אותו אסימון ומחכים שיעברו כמה שניות
          setTimeout(function () { send(payload, attempt + 1); }, 4500);
          return;
        }
        if (code === "token" && attempt < 2) {
          token = null;
          setTimeout(function () { send(payload, attempt + 1); }, 4500);
          return;
        }
        setLoading(false);
        if (code === "closed") showSendError("ההרשמה לערב ההיכרות נסגרה. לשאלות אפשר לכתוב לנו: e.hatzvi17@gmail.com");
        else if (code === "invalid" && res.fields) {
          Object.keys(res.fields).forEach(function (k) { setError(k, res.fields[k]); });
          showSendError("חלק מהפרטים לא התקבלו. נא לבדוק את השדות המסומנים ולנסות שוב.");
        } else if (code === "busy") showSendError("המערכת עמוסה כרגע. נא לנסות שוב בעוד רגע.");
        else showSendError("הפרטים לא נשמרו בגלל תקלה. אפשר ללחוץ שוב על \"שליחת אישור הגעה\" – הפרטים שמילאתם נשארו בטופס. (קוד: " + (code || "unknown") + (res && res.detail ? " – " + res.detail : "") + ")");
      })
      .catch(function (err) {
        setLoading(false);
        var timeout = err && err.name === "AbortError";
        showSendError(timeout
          ? "השליחה לקחה יותר מדי זמן ולא קיבלנו אישור שהפרטים נשמרו. אפשר לנסות שוב – לא ייווצר רישום כפול."
          : "נראה שיש בעיית חיבור לאינטרנט. הפרטים שמילאתם נשארו בטופס – אפשר לנסות שוב.");
      });
  }

  function success(attending) {
    submitted = true;
    setLoading(false);
    update();
    var thanks = $("#thanks");
    var yes = attending === "yes";
    $("#thanksTitle").textContent = yes ? "איזה כיף, נתראה בארץ הצבי!" : "תודה שעדכנתם אותנו!";
    var body = $("#thanksBody");
    body.innerHTML = "";
    function p(html) { var el = document.createElement("p"); el.innerHTML = html; body.appendChild(el); }
    if (yes) {
      p("אישור ההגעה שלכם התקבל.");
      p("אנחנו מחכים לפגוש אתכם <strong>ביום רביעי, אור לי\"ד בטבת ה'תשפ\"ז (23 בדצמבר), בשעה 19:00</strong>.");
    } else {
      p("אנו מצטערים שלא תוכלו להצטרף אלינו למפגש.");
      p('נשמח לעמוד לרשותכם בכל שאלה באמצעות הדוא"ל של בית הספר: <a href="mailto:e.hatzvi17@gmail.com" dir="ltr">e.hatzvi17@gmail.com</a>');
    }
    $("#thanksYes").hidden = !yes;

    form.hidden = true;
    $(".form-head").hidden = true;
    thanks.hidden = false;
    form.reset();
    submissionId = null;

    requestAnimationFrame(function () {
      thanks.classList.add("play");
      $("#formCard").scrollIntoView({ behavior: MOTION ? "smooth" : "auto", block: "start" });
      thanks.focus({ preventScroll: true });
      if (yes && MOTION) setTimeout(confetti, 350);
    });
  }

  /* ---------------- Confetti ---------------- */
  function confetti() {
    var cv = $("#confetti");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
    var colors = ["#F39A1E", "#FFB648", "#1B4F9C", "#0E2547", "#A9D8F6", "#8cc63f"];
    var parts = [];
    for (var i = 0; i < 110; i++) {
      parts.push({
        x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35,
        vx: (Math.random() - .5) * 14 * dpr, vy: (-Math.random() * 13 - 5) * dpr,
        w: (6 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr,
        r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length]
      });
    }
    var t0 = performance.now();
    (function frame(now) {
      var dt = now - t0;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += .35 * dpr; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, 1 - dt / 2800);
        ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * .6);
        ctx.restore();
      });
      if (dt < 2800) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ---------------- Init ---------------- */
  function init() {
    runDoor();
    initReveal();
    initLinks();
    initToForm();
    initForm();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
