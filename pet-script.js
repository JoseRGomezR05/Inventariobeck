/* ═══════════════════════════════════════════════
   PLACA MASCOTA — pet-script.js
   Funciones: idioma, ubicación, edad, toast
   ═══════════════════════════════════════════════ */

/* ── CALCULAR EDAD DE LA MASCOTA ── */
function calcularEdadMascota() {
  // ← Cambia esta fecha por la de nacimiento real
  const nacimiento = new Date("2021-03-15");
  const hoy        = new Date();

  let años  = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth()    - nacimiento.getMonth();

  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
    años--;
    meses = 12 + meses;
  }

  const el = document.getElementById("pet_age_val");
  if (!el) return;

  // Formato inteligente según la edad
  if (años === 0) {
    el.textContent = meses + (currentLang === 'en' ? ' months' : ' meses');
  } else if (años === 1) {
    el.textContent = "1 " + (currentLang === 'en' ? 'year' : 'año');
  } else {
    el.textContent = años + " " + (currentLang === 'en' ? 'years' : 'años');
  }
}

/* ── ENVIAR UBICACIÓN AL DUEÑO ── */
function sendLocation() {
  const btn = document.getElementById("loc_btn");

  if (!navigator.geolocation) {
    showToast(currentLang === 'en'
      ? "Geolocation not supported"
      : "Geolocalización no disponible", true);
    return;
  }

  // Feedback mientras carga
  if (btn) {
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i>' +
      '<span>' + (currentLang === 'en' ? '⏳ Getting location...' : '⏳ Obteniendo ubicación...') + '</span>';
    btn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat  = pos.coords.latitude.toFixed(6);
      const lon  = pos.coords.longitude.toFixed(6);
      const maps = "https://www.google.com/maps?q=" + lat + "," + lon;

      const ownerPhone = "+573012344124"; // ← Cambia por el número real
      const petName    = "Andy";           // ← Cambia por el nombre real

      const msgEs = "🐾 ¡Encontré a " + petName + "! Aquí está mi ubicación: " + maps;
      const msgEn = "🐾 I found " + petName + "! Here's my location: " + maps;
      const msg   = currentLang === 'en' ? msgEn : msgEs;

      // Intentar WhatsApp directo
      const waUrl = "https://wa.me/" + ownerPhone.replace(/[^0-9]/g, '') +
                    "?text=" + encodeURIComponent(msg);

      // Web Share API (nativo en móvil)
      if (navigator.share) {
        navigator.share({
          title: "📍 Encontré a " + petName,
          text:  msg,
          url:   maps
        }).then(() => {
          showToast(currentLang === 'en' ? "✓ Location shared!" : "✓ ¡Ubicación compartida!");
        }).catch(() => {
          window.open(waUrl, "_blank");
        });
      } else {
        // Abrir WhatsApp con la ubicación
        window.open(waUrl, "_blank");
        showToast(currentLang === 'en'
          ? "📍 Opening WhatsApp with your location"
          : "📍 Abriendo WhatsApp con tu ubicación");
      }

      // Restaurar botón
      if (btn) {
        const t = translations[currentLang];
        btn.innerHTML =
          '<i class="fa-solid fa-location-dot"></i>' +
          '<span id="loc_label">' + t.loc_label + '</span>';
        btn.disabled = false;
      }
    },

    function(err) {
      const errMessages = {
        es: ["Error de ubicación", "Permiso denegado", "Ubicación no disponible", "Tiempo agotado"],
        en: ["Location error",    "Permission denied", "Position unavailable",   "Timeout"]
      };
      const msg = (errMessages[currentLang] || errMessages.es)[err.code] || "Error";
      showToast(msg, true);

      if (btn) {
        const t = translations[currentLang];
        btn.innerHTML =
          '<i class="fa-solid fa-location-dot"></i>' +
          '<span id="loc_label">' + t.loc_label + '</span>';
        btn.disabled = false;
      }
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

/* ── SISTEMA DE IDIOMAS ── */
let currentLang = 'es';

const translations = {
  es: {
    top_text:             "¡Encontré a esta mascota!",
    lost_title:           "¡MASCOTA ENCONTRADA!",
    lost_sub:             "Por favor contacta a su dueño",
    sec_appearance:       "Descripción Física",
    color_label:          "Color / Pelaje",
    weight_label:         "Peso aprox.",
    size_label:           "Tamaño",
    chip_label:           "Microchip",
    sec_marks:            "Señas Particulares",
    vet_label:            "Veterinario:",
    sec_gallery:          "Galería",
    gallery_hint:         "Fotos adicionales de la mascota",
    sec_owner:            "Datos del Dueño",
    address_val:          "Barrio El Prado, Barranquilla, Colombia",
    call_label:           "Llamar al dueño",
    alt_label:            "Número alternativo",
    loc_label:            "📍 Enviar mi ubicación al dueño",
    reward_title:         "¡Recompensa por devolución!",
    reward_text:          "El dueño agradece y recompensa tu ayuda",
    map_text:             "Zona habitual: Barrio El Prado, Barranquilla",
    footer_text:          "Placa Inteligente para Mascotas · MediQR",
  },
  en: {
    top_text:             "I found this pet!",
    lost_title:           "PET FOUND!",
    lost_sub:             "Please contact the owner",
    sec_appearance:       "Physical Description",
    color_label:          "Color / Coat",
    weight_label:         "Approx. weight",
    size_label:           "Size",
    chip_label:           "Microchip",
    sec_marks:            "Distinctive Marks",
    vet_label:            "Veterinarian:",
    sec_gallery:          "Gallery",
    gallery_hint:         "Additional photos of the pet",
    sec_owner:            "Owner Information",
    address_val:          "El Prado Neighborhood, Barranquilla, Colombia",
    call_label:           "Call the owner",
    alt_label:            "Alternative number",
    loc_label:            "📍 Send my location to owner",
    reward_title:         "Reward for returning the pet!",
    reward_text:          "The owner thanks you and offers a reward",
    map_text:             "Usual area: El Prado, Barranquilla",
    footer_text:          "Smart Pet Tag · MediQR",
  }
};

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Actualizar todos los elementos
  Object.keys(t).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[id];
  });

  // Botones activos
  document.getElementById("btn_es").classList.toggle("active", lang === 'es');
  document.getElementById("btn_en").classList.toggle("active", lang === 'en');

  // Recalcular edad con el nuevo idioma
  calcularEdadMascota();
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(message, isError = false) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  calcularEdadMascota();

  // Auto-detectar idioma del navegador
  const browserLang = (navigator.language || navigator.userLanguage || 'es').slice(0, 2);
  if (browserLang !== 'es') {
    setLanguage('en');
  }

  // Mostrar toast de bienvenida con el nombre de la mascota
  setTimeout(() => {
    const msg = currentLang === 'en'
      ? "🐾 Please help Max get home!"
      : "🐾 ¡Ayuda a Max a volver a casa!";
    showToast(msg);
  }, 1200);
});
