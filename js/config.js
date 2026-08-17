(function () {
  'use strict';

  const siteConfig = {
    businessName: 'Ban Taco',
    whatsapp: '524494971521',
    phone: '449 497 1521',
    address: 'Aguascalientes, Aguascalientes, México.',
    addressComplete: false,
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.87804801104877,-102.2700457005695',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=21.87804801104877,-102.2700457005695',
    mapEmbedUrl: 'https://www.google.com/maps?q=21.87804801104877,-102.2700457005695&z=17&output=embed',
    latitude: 21.87804801104877,
    longitude: -102.2700457005695,
    instagram: 'https://www.instagram.com/ban_taco/',
    tiktok: 'https://www.tiktok.com/@taqueriabantaco?_r=1&_t=ZS-983CUiHzI2a',
    websiteUrl: '',
    contactEmail: '',
    timezone: 'America/Mexico_City',
    shareText: 'Conoce Ban Taco, consulta el menú, nuestros platillos y servicios.',
    businessHours: {
      monday: { open: '13:00', close: '03:00' },
      tuesday: { open: '13:00', close: '03:00' },
      wednesday: { open: '13:00', close: '03:00' },
      thursday: { open: '13:00', close: '04:00' },
      friday: { open: '13:00', close: '05:00' },
      saturday: { open: '13:00', close: '05:00' },
      sunday: { open: '13:00', close: '03:00' }
    },
    legal: {
      responsibleName: '',
      responsibleAddress: '',
      privacyEmail: '',
      lastUpdated: '15 de julio de 2026'
    },
    messages: {
      order: 'Hola, quiero hacer un pedido en Ban Taco. ¿Qué platillos tienen disponibles?',
      banquet: 'Hola, me gustaría solicitar una cotización para un banquete. El evento sería para aproximadamente ___ personas.',
      general: 'Hola, me gustaría recibir información sobre Ban Taco.'
    }
  };

  function whatsappUrl(message) {
    return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function deepFreeze(object) {
    Object.getOwnPropertyNames(object).forEach((name) => {
      const value = object[name];
      if (value && typeof value === 'object' && !Object.isFrozen(value)) deepFreeze(value);
    });
    return Object.freeze(object);
  }

  siteConfig.whatsappUrl = whatsappUrl;
  siteConfig.social = {
    instagram: siteConfig.instagram,
    tiktok: siteConfig.tiktok,
  };
  window.BANTACO_CONFIG = deepFreeze(siteConfig);
})();
