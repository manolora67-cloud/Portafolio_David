(function () {
  const fileItems = document.querySelectorAll(".file-item");
  const panes = document.querySelectorAll(".pane");
  const tabsBar = document.getElementById("tabs");
  const statusFile = document.getElementById("statusFile");
  const statusLang = document.getElementById("statusLang");
  const statusLines = document.getElementById("statusLines");

  const openTabs = []; // { target, label, lang }

  function labelFor(item) {
    return item.textContent.trim();
  }

  function renderTabs() {
    tabsBar.innerHTML = "";
    openTabs.forEach((tab) => {
      const el = document.createElement("div");
      el.className = "tab" + (tab.target === currentTarget ? " active" : "");
      el.dataset.target = tab.target;

      const label = document.createElement("span");
      label.textContent = tab.label;
      el.appendChild(label);

      const close = document.createElement("span");
      close.className = "tab-close";
      close.textContent = "×";
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab.target);
      });
      el.appendChild(close);

      el.addEventListener("click", () => openFile(tab.target, tab.label, tab.lang));
      tabsBar.appendChild(el);
    });
  }

  function closeTab(target) {
    const idx = openTabs.findIndex((t) => t.target === target);
    if (idx === -1) return;
    openTabs.splice(idx, 1);

    if (target === currentTarget) {
      const next = openTabs[idx] || openTabs[idx - 1];
      if (next) {
        openFile(next.target, next.label, next.lang);
      } else {
        currentTarget = null;
        panes.forEach((p) => p.classList.remove("active"));
        tabsBar.innerHTML = "";
        return;
      }
    }
    renderTabs();
  }

  let currentTarget = null;

  function openFile(target, label, lang) {
    currentTarget = target;

    panes.forEach((p) => p.classList.toggle("active", p.dataset.pane === target));
    fileItems.forEach((it) => it.classList.toggle("active", it.dataset.target === target));

    if (!openTabs.find((t) => t.target === target)) {
      openTabs.push({ target, label, lang });
    }
    renderTabs();

    statusFile.textContent = label;
    statusLang.textContent = lang;

    const activePane = document.querySelector(`.pane[data-pane="${target}"]`);
    const lineCount = activePane ? activePane.querySelectorAll(".line").length : 0;
    statusLines.textContent = lineCount + " líneas";

    // Cierra el sidebar en móvil tras elegir un archivo
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
  }

  fileItems.forEach((item) => {
    item.addEventListener("click", () => {
      openFile(item.dataset.target, labelFor(item), item.dataset.lang);
    });
  });

  // Carpeta "proyectos" plegable
  const projectsToggle = document.getElementById("projectsToggle");
  const projectsFolder = document.getElementById("projectsFolder");
  projectsToggle.addEventListener("click", () => {
    projectsToggle.classList.toggle("collapsed");
    projectsFolder.classList.toggle("collapsed");
  });

  // Sidebar en móvil
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  document.getElementById("menuBtn").addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  });
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  // Estado inicial: sobre-mi.md abierto
  const first = document.querySelector('.file-item[data-target="sobre-mi"]');
  openFile(first.dataset.target, labelFor(first), first.dataset.lang);
})();
