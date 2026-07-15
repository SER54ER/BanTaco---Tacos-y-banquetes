(function () {
  'use strict';
  const config = window.BANTACO_CONFIG;
  const values = {
    businessName: config.businessName,
    responsibleName: config.legal.responsibleName || '[AGREGAR NOMBRE DEL RESPONSABLE]',
    responsibleAddress: config.legal.responsibleAddress || '[AGREGAR DOMICILIO]',
    privacyEmail: config.legal.privacyEmail || config.contactEmail || '[AGREGAR CORREO DE CONTACTO]',
    lastUpdated: config.legal.lastUpdated || '[AGREGAR FECHA DE ACTUALIZACIÓN]',
    phone: config.phone || '[AGREGAR TELÉFONO]'
  };
  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(`[data-legal="${key}"]`).forEach((node) => { node.textContent = value; });
  });
  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
})();
