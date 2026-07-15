(function () {
  'use strict';

  const config = window.BANTACO_CONFIG;
  const schedule = config.businessHours || {};
  const list = document.getElementById('hoursList');
  const statusBadge = document.getElementById('businessStatus');
  const statusDetail = document.getElementById('businessStatusDetail');
  const todaySummary = document.getElementById('todayHours');
  const locationSummary = document.getElementById('locationHoursSummary');
  if (!list || !statusBadge || !statusDetail || !todaySummary) return;

  const days = [
    ['sunday', 'Domingo'], ['monday', 'Lunes'], ['tuesday', 'Martes'],
    ['wednesday', 'Miércoles'], ['thursday', 'Jueves'], ['friday', 'Viernes'], ['saturday', 'Sábado']
  ];

  function timeParts() {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: config.timezone,
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
    const dayNames = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dayIndex: dayNames[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) };
  }

  function intervalsFor(dayKey) {
    const value = schedule[dayKey];
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  function parseMinutes(value) {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''))) return null;
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function formatTime(value) {
    const minutes = parseMinutes(value);
    if (minutes === null) return value;
    const hours24 = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const suffix = hours24 < 12 ? 'a. m.' : 'p. m.';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${String(minutesPart).padStart(2, '0')} ${suffix}`;
  }

  function formatDay(dayKey) {
    const intervals = intervalsFor(dayKey);
    if (!intervals.length) return 'Por confirmar';
    return intervals.map((interval) => `${formatTime(interval.open)} – ${formatTime(interval.close)}`).join(' / ');
  }

  function hasConfirmedHours() {
    return days.some(([key]) => intervalsFor(key).some((interval) => parseMinutes(interval.open) !== null && parseMinutes(interval.close) !== null));
  }

  function currentState(now) {
    if (!hasConfirmedHours()) return { type: 'unknown' };

    const currentDayKey = days[now.dayIndex][0];
    const previousDayIndex = (now.dayIndex + 6) % 7;
    const previousDayKey = days[previousDayIndex][0];

    for (const interval of intervalsFor(previousDayKey)) {
      const open = parseMinutes(interval.open);
      const close = parseMinutes(interval.close);
      if (open === null || close === null || close > open) continue;
      if (now.minutes < close) return { type: 'open', close: interval.close, overnight: true };
    }

    for (const interval of intervalsFor(currentDayKey)) {
      const open = parseMinutes(interval.open);
      const close = parseMinutes(interval.close);
      if (open === null || close === null) continue;
      if (close > open && now.minutes >= open && now.minutes < close) return { type: 'open', close: interval.close };
      if (close <= open && now.minutes >= open) return { type: 'open', close: interval.close, overnight: true };
    }

    let next = null;
    for (let offset = 0; offset < 8; offset += 1) {
      const dayIndex = (now.dayIndex + offset) % 7;
      const dayKey = days[dayIndex][0];
      for (const interval of intervalsFor(dayKey)) {
        const open = parseMinutes(interval.open);
        if (open === null) continue;
        const delta = offset * 1440 + open - now.minutes;
        if (delta <= 0) continue;
        if (!next || delta < next.delta) next = { delta, dayIndex, open: interval.open };
      }
    }
    if (!next) return { type: 'closed' };
    return { type: next.delta <= 60 ? 'soon' : 'closed', next };
  }

  const now = timeParts();
  const todayKey = days[now.dayIndex][0];

  list.replaceChildren(...days.slice(1).concat(days.slice(0, 1)).map(([key, label]) => {
    const item = document.createElement('li');
    if (key === todayKey) item.classList.add('is-today');
    const day = document.createElement('span');
    day.textContent = label;
    const value = document.createElement('strong');
    value.textContent = formatDay(key);
    item.append(day, value);
    return item;
  }));

  const state = currentState(now);
  todaySummary.textContent = `Horario de hoy: ${formatDay(todayKey)}.`;

  if (state.type === 'unknown') {
    statusBadge.textContent = 'Horario por confirmar';
    statusBadge.dataset.state = 'unknown';
    statusDetail.textContent = 'Consulta nuestros horarios por WhatsApp.';
    todaySummary.textContent = 'Consulta nuestros horarios por WhatsApp.';
    if (locationSummary) locationSummary.textContent = 'Consulta nuestros horarios por WhatsApp.';
  } else if (state.type === 'open') {
    statusBadge.textContent = 'Abierto ahora';
    statusBadge.dataset.state = 'open';
    statusDetail.textContent = `Cierra a las ${formatTime(state.close)}${state.overnight ? ' del día siguiente' : ''}.`;
    if (locationSummary) locationSummary.textContent = `Abierto ahora · cierra a las ${formatTime(state.close)}.`;
  } else if (state.type === 'soon') {
    statusBadge.textContent = 'Abre próximamente';
    statusBadge.dataset.state = 'soon';
    statusDetail.textContent = `Abre a las ${formatTime(state.next.open)}.`;
    if (locationSummary) locationSummary.textContent = `Abre próximamente a las ${formatTime(state.next.open)}.`;
  } else {
    statusBadge.textContent = 'Cerrado';
    statusBadge.dataset.state = 'closed';
    if (state.next) {
      const label = state.next.dayIndex === now.dayIndex ? 'hoy' : days[state.next.dayIndex][1];
      statusDetail.textContent = `Próxima apertura: ${label} a las ${formatTime(state.next.open)}.`;
      if (locationSummary) locationSummary.textContent = `Cerrado · próxima apertura ${label} a las ${formatTime(state.next.open)}.`;
    } else {
      statusDetail.textContent = 'Consulta la próxima apertura por WhatsApp.';
      if (locationSummary) locationSummary.textContent = 'Consulta la próxima apertura por WhatsApp.';
    }
  }
})();
