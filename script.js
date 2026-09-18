(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Volver arriba (definido antes de usarlo en onScroll) ---- */
  var toTopBtn = document.getElementById("toTop");
  function toggleBackToTop() {
    toTopBtn.style.visibility = window.scrollY > 600 ? "visible" : "hidden";
  }
  toTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---- Nav: sombra al hacer scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
    toggleBackToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menú móvil ---- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Enlace activo según la sección visible ---- */
  var sections = ["sobre-mi", "proyectos", "contacto"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navAnchors = navLinks.querySelectorAll("a[data-section]");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.dataset.section === entry.target.id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- Copiar correo / teléfono ---- */
  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var value = el.getAttribute("data-copy");
      if (!navigator.clipboard) return; // deja que el enlace funcione normal
      e.preventDefault();
      navigator.clipboard.writeText(value).then(function () {
        var note = document.createElement("span");
        note.className = "copied-note";
        note.textContent = "Copiado";
        el.insertAdjacentElement("afterend", note);
        setTimeout(function () { note.remove(); }, 1600);
      });
    });
  });

  /* ---- Año en el footer ---- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- Entrada del hero (un solo momento orquestado) ---- */
  if (!reduceMotion) {
    var heroEls = [
      document.getElementById("heroRole"),
      document.getElementById("heroName"),
      document.getElementById("heroLine"),
      document.getElementById("heroBio"),
      document.getElementById("heroActions"),
    ];
    heroEls.forEach(function (el, i) {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      el.style.transitionDelay = i * 90 + "ms";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        heroEls.forEach(function (el) {
          if (!el) return;
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      });
    });
  }
})();
