// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", () => {
  aplicarEstadosIniciales();
  manejarIconosLineFill();
  registrarEventosSidebarPrincipal();
  registrarEventosSidebarUsuario();
  registrarEventosOverlay();
  registrarEventoLuces();
  manejarResponsiveSidebar();
  aplicarSubMenusGuardados();
  registrarGestosSidebars();
});

// ========== SUBMENÚ ==========
function toggleSubMenu(btn) {
  const subMenu = btn.nextElementSibling;
  const isOpen = subMenu.classList.toggle("show");
  btn.classList.toggle("rotate", isOpen);

  // Guardar en localStorage según el botón (usa un identificador único)
  const id = btn.getAttribute("data-id");
  if (id) {
    localStorage.setItem(`submenu-${id}`, isOpen ? "open" : "closed");
  }
}

function aplicarSubMenusGuardados() {
  const botones = document.querySelectorAll(".dropdown-btn");

  botones.forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const estado = localStorage.getItem(`submenu-${id}`);

    if (estado === "open") {
      const subMenu = btn.nextElementSibling;
      subMenu.classList.add("show");
      btn.classList.add("rotate");
    }
  });
} //importante guada data-id al button que tiene sub-menu

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
    document.body.classList.remove("no-scroll"); // Quitar scroll
  }
}

// ========== SIDEBAR PRINCIPAL ==========
function registrarEventosSidebarPrincipal() {
  const toggleBtn = document.getElementById("toggle-btn");
  toggleBtn?.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth <= 800) {
      const abierto = sidebar.classList.toggle("show"); // <== define aquí
      overlay.classList.toggle("active", abierto);
      document.body.classList.toggle("no-scroll", abierto);
    } else {
      const estaCerrado = sidebar.classList.toggle("close");
      localStorage.setItem("sidebar-estado", estaCerrado ? "close" : "open");
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
    document.body.classList.toggle("no-scroll", abierto);
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
      document.body.classList.remove("no-scroll");
    }
  };

  aplicarModoResponsive();
  window.addEventListener("resize", aplicarModoResponsive);
}

// ========== GESTOS TOUCH PARA ABRIR Y CERRAR SIDEBARS ==========
function registrarGestosSidebars() {
  let touchStartX = 0;
  let touchEndX = 0;
  const umbral = 50; // Distancia mínima para considerar swipe
  const bordeActivacion = 30;

  const sidebar = document.getElementById("sidebar");
  const userSidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");

  document.addEventListener("touchstart", (e) => {
    // Solo considerar el primer dedo
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  document.addEventListener("touchend", (e) => {
    if (e.changedTouches.length === 1) {
      touchEndX = e.changedTouches[0].clientX;
      manejarGesto();
    }
  });

  function manejarGesto() {
    const esMovil = window.innerWidth <= 800;
    if (!esMovil) return;

    const deltaX = touchEndX - touchStartX;

    // === ABRIR SIDE BAR IZQUIERDO ===
    if (touchStartX < bordeActivacion && deltaX > umbral) {
      cerrarSidebars(); // Asegura que no se superpongan
      sidebar.classList.add("show");
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    }

    // === ABRIR SIDE BAR DERECHO ===
    else if (
      touchStartX > window.innerWidth - bordeActivacion &&
      deltaX < -umbral
    ) {
      cerrarSidebars();
      userSidebar.classList.add("open");
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    }

    // === CERRAR SIDE BAR IZQUIERDO ===
    else if (
      sidebar.classList.contains("show") &&
      deltaX < -umbral &&
      touchStartX < 250
    ) {
      cerrarSidebars();
    }

    // === CERRAR SIDE BAR DERECHO ===
    else if (
      userSidebar.classList.contains("open") &&
      deltaX > umbral &&
      touchStartX > window.innerWidth - 250
    ) {
      cerrarSidebars();
    }
  }
}



