// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", () => {
  aplicarEstadosIniciales();
  manejarIconosLineFill();
  registrarEventosSidebarPrincipal();
  registrarEventosSidebarUsuario();
  registrarEventosOverlay();
  registrarEventoLuces();
  manejarResponsiveSidebar();
  registrarGestosSidebars();
});

// ========== SUBMENÚ ==========
function toggleSubMenu(btn) {
  const subMenu = btn.nextElementSibling;
  subMenu.classList.toggle("show");
  btn.classList.toggle("rotate");
}

// ========== OVERLAY ==========
function registrarEventosOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", cerrarSidebars);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarSidebars();
  });
}

function cerrarSidebars() {
  const sidebar = document.getElementById("sidebar");
  const userSidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");

  let cerrado = false;

  if (sidebar.classList.contains("show")) {
    sidebar.classList.remove("show");
    cerrado = true;
  }

  if (userSidebar.classList.contains("open")) {
    userSidebar.classList.remove("open");
    cerrado = true;
  }

  if (cerrado) {
    overlay.classList.remove("active");
  }
}

// ========== SIDEBAR PRINCIPAL ==========
function registrarEventosSidebarPrincipal() {
  const toggleBtn = document.getElementById("toggle-btn");
  toggleBtn?.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth <= 800) {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("active", sidebar.classList.contains("show"));
    } else {
      sidebar.classList.toggle("close");
    }
  });
}

// ========== SIDEBAR USUARIO ==========
function registrarEventosSidebarUsuario() {
  const avatar = document.querySelector(".user-avatar");
  const configBtn = document.querySelector(".topbar-right .icon-button");
  const sidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");

  const toggle = () => {
    const abierto = sidebar.classList.toggle("open");
    overlay.classList.toggle("active", abierto);
  };

  avatar?.addEventListener("click", toggle);
  configBtn?.addEventListener("click", toggle);
}

// ========== ICONOS LINE A FILL ==========
function manejarIconosLineFill() {
  const iconos = document.querySelectorAll(".icon");

  iconos.forEach((icono) => {
    const claseLine = [...icono.classList].find((c) => c.endsWith("-line"));
    if (!claseLine) return;

    const claseFill = claseLine.replace("-line", "-fill");
    icono.dataset.line = claseLine;
    icono.dataset.fill = claseFill;

    const li = icono.closest("li");
    if (!li) return;

    if (li.classList.contains("active")) {
      icono.classList.replace(claseLine, claseFill);
    }

    li.addEventListener("mouseenter", () => {
      if (!li.classList.contains("active")) {
        icono.classList.replace(icono.dataset.line, icono.dataset.fill);
      }
    });

    li.addEventListener("mouseleave", () => {
      if (!li.classList.contains("active")) {
        icono.classList.replace(icono.dataset.fill, icono.dataset.line);
      }
    });
  });
}

// ========== ESTADO INICIAL ==========
function aplicarEstadosIniciales() {
  const activeItem = document.querySelector("#sidebar li.active");
  if (!activeItem) return;

  const prev = activeItem.previousElementSibling;
  const next = activeItem.nextElementSibling;

  if (prev) prev.classList.add("before-active");
  if (next) next.classList.add("after-active");
}

// ========== LUCES (TOGGLE) ==========
function registrarEventoLuces() {
  const footerContent = document.querySelector(".sidebar-footer-content");
  const darkToggle = document.getElementById("darkToggle");
  const modoIcono = document.getElementById("modoIcono");
  const modoTexto = document.getElementById("modoTexto");

  if (footerContent && darkToggle && modoIcono && modoTexto) {
    footerContent.addEventListener("click", (e) => {
      if (!e.target.closest("label")) {
        darkToggle.checked = !darkToggle.checked;
        darkToggle.dispatchEvent(new Event("change"));
      }
    });

    const actualizarEstadoLuces = () => {
      const activado = darkToggle.checked;

      modoIcono.classList.toggle("ri-lightbulb-line", !activado);
      modoIcono.classList.toggle("ri-lightbulb-fill", activado);
      modoIcono.classList.add("rotar");
      setTimeout(() => modoIcono.classList.remove("rotar"), 400);

      modoTexto.classList.add("cambiando");
      setTimeout(() => {
        const nuevoTexto = activado ? "Apagar Luces" : "Prender Luces";
        modoTexto.textContent = nuevoTexto;
        footerContent.setAttribute("data-label", nuevoTexto);
        modoTexto.classList.remove("cambiando");
      }, 150);
    };

    darkToggle.addEventListener("change", actualizarEstadoLuces);
    actualizarEstadoLuces();
  }
}

// ========== RESPONSIVE ==========
function manejarResponsiveSidebar() {
  const sidebar = document.getElementById("sidebar");
  const userSidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");

  const aplicarModoResponsive = () => {
    const esMovil = window.innerWidth <= 800;

    if (esMovil) {
      sidebar.classList.remove("close");
    } else {
      sidebar.classList.remove("show");
      userSidebar.classList.remove("open");
      overlay.classList.remove("active");
    }
  };

  aplicarModoResponsive();
  window.addEventListener("resize", aplicarModoResponsive);
}

function isInsideScrollable(el) {
  while (el && el !== document.body) {
    const overflowY = window.getComputedStyle(el).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
}

function registrarGestosSidebars() {
  const sidebar = document.getElementById("sidebar");
  const userSidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");
  const maxSidebarWidth = 250;
  const umbral = 60;
  const bordeActivacion = 60;

  let startX = null;
  let currentX = null;
  let dragging = false;
  let tipo = null;

  document.body.addEventListener("touchstart", (e) => {
    if (window.innerWidth > 800 || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    currentX = startX;
    dragging = true;

    // ⛔ Si el toque comienza dentro de un contenedor con scroll vertical, cancelamos el gesto
    if (isInsideScrollable(e.target)) {
      dragging = false;
      tipo = null;
      return;
    }

    if (sidebar.classList.contains("show") && startX < maxSidebarWidth) {
      tipo = "cerrar-left";
    } else if (
      userSidebar.classList.contains("open") &&
      startX > window.innerWidth - maxSidebarWidth
    ) {
      tipo = "cerrar-right";
    } else if (startX < bordeActivacion) {
      tipo = "left";
    } else if (startX > window.innerWidth - bordeActivacion) {
      tipo = "right";
    } else {
      tipo = null;
    }
  });

  document.body.addEventListener("touchmove", (e) => {
    if (!dragging || !tipo) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    overlay.classList.add("active");

    let progreso = Math.abs(deltaX) / maxSidebarWidth;
    let opacidad = Math.min(0.6 + (progreso - 1) * 0.25, 0.85);
    if (progreso < 1) {
      opacidad = progreso * 0.6;
    }
    overlay.style.opacity = opacidad.toFixed(2);

    if (tipo === "left") {
      const pos = Math.min(
        Math.max(-maxSidebarWidth + deltaX, -maxSidebarWidth),
        0
      );
      sidebar.style.transition = "none";
      sidebar.style.left = `${pos}px`;
    } else if (tipo === "right") {
      const pos = Math.min(
        Math.max(-maxSidebarWidth - deltaX, -maxSidebarWidth),
        0
      );
      userSidebar.style.transition = "none";
      userSidebar.style.right = `${pos}px`;
    } else if (tipo === "cerrar-left") {
      const pos = Math.min(Math.max(deltaX, -maxSidebarWidth), 0);
      sidebar.style.transition = "none";
      sidebar.style.left = `${pos}px`;
    } else if (tipo === "cerrar-right") {
      const pos = Math.min(Math.max(-deltaX, -maxSidebarWidth), 0);
      userSidebar.style.transition = "none";
      userSidebar.style.right = `${pos}px`;
    }
  });

  document.body.addEventListener("touchend", () => {
    if (!dragging || !tipo) return;
    const deltaX = currentX - startX;
    dragging = false;

    sidebar.style.transition = "left 0.2s ease";
    userSidebar.style.transition = "right 0.2s ease";
    overlay.style.opacity = "";

    if (tipo === "left" && deltaX > umbral) {
      userSidebar.classList.remove("open");
      userSidebar.style.right = "";

      sidebar.classList.add("show");
      sidebar.style.left = "0";
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    } else if (tipo === "right" && deltaX < -umbral) {
      sidebar.classList.remove("show");
      sidebar.style.left = "";

      userSidebar.classList.add("open");
      userSidebar.style.right = "0";
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    } else if (tipo === "cerrar-left" && deltaX < -umbral) {
      cerrarSidebars();
    } else if (tipo === "cerrar-right" && deltaX > umbral) {
      cerrarSidebars();
    } else {
      if (tipo.startsWith("cerrar")) {
        if (tipo === "cerrar-left") {
          sidebar.style.left = "0";
        } else if (tipo === "cerrar-right") {
          userSidebar.style.right = "0";
        }
      } else {
        sidebar.style.left = "";
        userSidebar.style.right = "";
      }

      if (
        !sidebar.classList.contains("show") &&
        !userSidebar.classList.contains("open")
      ) {
        overlay.classList.remove("active");
      }
    }

    tipo = null;
  });
}
