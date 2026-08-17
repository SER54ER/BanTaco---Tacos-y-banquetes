(function () {
  'use strict';

  const config = window.BANTACO_CONFIG;
  const nativeButton = document.getElementById('shareNative');
  const whatsapp = document.getElementById('shareWhatsapp');
  const copyButton = document.getElementById('copyLink');
  const status = document.getElementById('shareStatus');
  if (!whatsapp || !copyButton || !status) return;

  function currentUrl() {
    return window.location.href;
  }

  function updateLinks() {
    const url = currentUrl();
    const message = `${config.shareText} ${url}`;
    whatsapp.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  async function copyUrl() {
    const value = currentUrl();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('copy failed');
      }
      status.textContent = 'Enlace copiado';
      copyButton.dataset.copied = 'true';
      window.setTimeout(() => { copyButton.dataset.copied = 'false'; }, 1800);
    } catch (_) {
      status.textContent = 'No se pudo copiar. Selecciona la dirección del navegador.';
    }
  }

  if (nativeButton) {
    if ('share' in navigator) {
      nativeButton.hidden = false;
      nativeButton.addEventListener('click', async () => {
        try {
          await navigator.share({ title: config.businessName, text: config.shareText, url: currentUrl() });
          status.textContent = 'Sitio compartido';
        } catch (error) {
          if (error && error.name !== 'AbortError') status.textContent = 'Elige una de las opciones para compartir.';
        }
      });
    } else {
      nativeButton.hidden = true;
    }
  }

  copyButton.addEventListener('click', copyUrl);
  updateLinks();
})();
