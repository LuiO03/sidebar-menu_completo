// ========== INICIALIZACIÓN ========== //
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
  actualizarIconoToggleSidebar();
});

// ========== SUBMENÚ ========== //
function toggleSubMenu(btn) {
  const subMenu = btn.nextElementSibling;
  const isOpen = subMenu.classList.toggle("show");
  btn.classList.toggle("rotate", isOpen);

  const id = btn.getAttribute("data-id");
  if (id) {
    localStorage.setItem(`submenu-${id}`, isOpen ? "open" : "closed");
  }
}

function aplicarSubMenusGuardados() {
  document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const estado = localStorage.getItem(`submenu-${id}`);
    if (estado === "open") {
      btn.nextElementSibling.classList.add("show");
      btn.classList.add("rotate");
    }
  });
}

// ========== OVERLAY Y ESCAPE ========== //
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

  sidebar.classList.remove("show");
  userSidebar.classList.remove("open");
  overlay.classList.remove("active");
  document.body.classList.remove("no-scroll");

  sidebar.style.left = "";
  userSidebar.style.right = "";
  overlay.style.opacity = "";
}

// ========== SIDEBAR PRINCIPAL ========== //
function registrarEventosSidebarPrincipal() {
  const toggleBtn = document.getElementById("toggle-btn");
  const toggleIcon = document.getElementById("toggle-icon");

  toggleBtn?.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth <= 800) {
      const userSidebar = document.getElementById("userSidebar");
      userSidebar.classList.remove("open");
      userSidebar.style.right = "";

      const abierto = sidebar.classList.toggle("show");
      overlay.classList.toggle("active", abierto);
      document.body.classList.toggle("no-scroll", abierto);
      sidebar.style.left = abierto ? "0" : "";

      // Siempre mostrar flecha a la derecha en modo móvil
      if (toggleIcon) {
        toggleIcon.className = "ri-arrow-right-double-fill";
      }
    } else {
      const estaCerrado = sidebar.classList.toggle("close");

      // Actualizar clase en <html>
      document.documentElement.classList.toggle("sidebar-cerrado", estaCerrado);

      // Guardar estado en localStorage
      localStorage.setItem("sidebar-estado", estaCerrado ? "close" : "open");

      // Cambiar ícono según estado
      if (toggleIcon) {
        toggleIcon.className = estaCerrado
          ? "ri-arrow-right-double-fill"
          : "ri-arrow-left-double-fill";
      }
    }

    actualizarIconoToggleSidebar(); // 🔁 icono después de cada clic
  });
}


function actualizarIconoToggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleIcon = document.getElementById("toggle-icon");

  if (!toggleIcon) return;

  if (window.innerWidth <= 800) {
    // Siempre a la derecha en móvil
    toggleIcon.className = "ri-arrow-right-double-fill";
  } else {
    // En escritorio, depende de si el sidebar está cerrado
    const estaCerrado = sidebar.classList.contains("close");
    toggleIcon.className = estaCerrado
      ? "ri-arrow-right-double-fill"
      : "ri-arrow-left-double-fill";
  }
}

// ========== SIDEBAR USUARIO ========== //
function registrarEventosSidebarUsuario() {
  const avatar = document.querySelector(".user-avatar");
  const configBtn = document.querySelector(".topbar-right .icon-button");
  const userSidebar = document.getElementById("userSidebar");
  const overlay = document.getElementById("overlay");

  const toggle = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("show");
    sidebar.style.left = "";

    const abierto = userSidebar.classList.toggle("open");
    overlay.classList.toggle("active", abierto);
    document.body.classList.toggle("no-scroll", abierto);
    userSidebar.style.right = abierto ? "0" : "";
  };

  avatar?.addEventListener("click", toggle);
  configBtn?.addEventListener("click", toggle);
}

// ========== ICONOS LINE A FILL ========== //
function manejarIconosLineFill() {
  document.querySelectorAll(".icon").forEach((icono) => {
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

// ========== ESTADO INICIAL ========== //
function aplicarEstadosIniciales() {
  const sidebar = document.getElementById("sidebar");

  // Restaurar estado del sidebar
  const estado = localStorage.getItem("sidebar-estado");
  if (estado === "close") {
    sidebar.classList.add("close");
  } else {
    sidebar.classList.remove("close");
  }

  // Aplicar clases para destacar el ítem activo
  const activeItem = sidebar.querySelector("li.active");
  if (activeItem) {
    activeItem.previousElementSibling?.classList.add("before-active");
    activeItem.nextElementSibling?.classList.add("after-active");
  }
}

// ========== TOGGLE MODO OSCURO ========== //
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

// ========== MODO RESPONSIVE ========== //
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
  window.addEventListener("resize", () => {
    aplicarModoResponsive();
    actualizarIconoToggleSidebar(); // 🔁 icono al cambiar tamaño
  });
}

// ========== GESTOS DESDE BORDES ========== //
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

    const touchY = e.touches[0].clientY;
    const target = e.target;
    const scrollable = target.closest(".sidebar-menu"); // Asegúrate de usar el selector correcto

    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
      tipo = "scrolling"; // Bloquea gestos si el contenido tiene scroll vertical
      return;
    }
    if (
      target.closest("#sidebar")?.scrollHeight >
      target.closest("#sidebar")?.clientHeight
    ) {
      // Marca que estamos tocando dentro de un contenedor con scroll vertical
      tipo = "scrolling"; // ✋ Bloquea gestos laterales
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
    if (!dragging || !tipo || tipo === "scrolling") return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    /*
    overlay.classList.add("active");

    let progreso = Math.abs(deltaX) / maxSidebarWidth;
    let opacidad = Math.min(0.6 + (progreso - 1) * 0.25, 0.85); // Aumenta hasta 0.85
    if (progreso < 1) {
      opacidad = progreso * 0.6; // hasta 0.6
    }
    overlay.style.opacity = opacidad.toFixed(2);*/

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
    if (!dragging || !tipo || tipo === "scrolling") return;
    const deltaX = currentX - startX;
    dragging = false;

    sidebar.style.transition = "left 0.2s ease";
    userSidebar.style.transition = "right 0.2s ease";
    overlay.style.opacity = "";

    if (tipo === "left" && deltaX > umbral) {
      // Cerrar userSidebar si está abierto
      userSidebar.classList.remove("open");
      userSidebar.style.right = "";

      sidebar.classList.add("show");
      sidebar.style.left = "0";
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    } else if (tipo === "right" && deltaX < -umbral) {
      // Cerrar sidebar si está abierto
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
      // Rebotar suavemente si no se cumplió el umbral
      if (tipo.startsWith("cerrar")) {
        if (tipo === "cerrar-left") {
          sidebar.style.left = "0";
        } else if (tipo === "cerrar-right") {
          userSidebar.style.right = "0";
        }
      } else {
        if (tipo === "left") {
          sidebar.style.left = "";
        } else if (tipo === "right") {
          userSidebar.style.right = "";
        }
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
