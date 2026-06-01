/**
 * 🌤️ Weather Forecast App
 * Использует Open-Meteo API, Fetch и DOM manipulation
 */

// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
  DEFAULT_LOCATION: { lat: 55.7558, lon: 37.6173, name: 'Москва' },
  API_BASE: 'https://api.open-meteo.com/v1',
  GEOCODING_API: 'https://geocoding-api.open-meteo.com/v1',
  CARDS_PER_PAGE: 4,
  HOURLY_FORECAST_COUNT: 24,
  DAILY_FORECAST_DAYS: 7
};

// ===== КОДЫ ПОГОДЫ =====
const WEATHER_CODES = {
  0: { icon: '☀️', text: 'Ясно' },
  1: { icon: '🌤️', text: 'Преим. ясно' },
  2: { icon: '⛅', text: 'Переменная облачность' },
  3: { icon: '☁️', text: 'Пасмурно' },
  45: { icon: '🌫️', text: 'Туман' },
  48: { icon: '🌫️', text: 'Иней' },
  51: { icon: '🌦️', text: 'Морось' },
  53: { icon: '🌦️', text: 'Умеренная морось' },
  55: { icon: '🌧️', text: 'Сильная морось' },
  61: { icon: '🌧️', text: 'Слабый дождь' },
  63: { icon: '🌧️', text: 'Дождь' },
  65: { icon: '🌧️', text: 'Сильный дождь' },
  71: { icon: '🌨️', text: 'Слабый снег' },
  73: { icon: '🌨️', text: 'Снег' },
  75: { icon: '❄️', text: 'Сильный снег' },
  77: { icon: '🌨️', text: 'Снежные зёрна' },
  80: { icon: '🌦️', text: 'Ливень' },
  81: { icon: '🌧️', text: 'Сильный ливень' },
  82: { icon: '⛈️', text: 'Очень сильный ливень' },
  85: { icon: '🌨️', text: 'Снежная крупа' },
  86: { icon: '❄️', text: 'Сильный снегопад' },
  95: { icon: '⛈️', text: 'Гроза' },
  96: { icon: '⛈️', text: 'Гроза с градом' },
  99: { icon: '⛈️', text: 'Сильная гроза с градом' }
};

// ===== СОСТОЯНИЕ ПРИЛОЖЕНИЯ =====
const appState = {
  location: { ...CONFIG.DEFAULT_LOCATION },
  view: 'daily',
  forecast: null,
  currentIndex: 0
};

// ===== DOM-ЭЛЕМЕНТЫ =====
const DOM = {};

/**
 * Инициализация ссылок на DOM-элементы
 */
function cacheDOM() {
  DOM.carousel = document.getElementById('carousel');
  DOM.location = document.getElementById('location');
  DOM.message = document.getElementById('message');
  DOM.prevBtn = document.getElementById('prevBtn');
  DOM.nextBtn = document.getElementById('nextBtn');
  DOM.dots = document.getElementById('dots');
  DOM.toggleBtns = document.querySelectorAll('.toggle-btn');
  DOM.cityInput = document.getElementById('cityInput');
  DOM.searchBtn = document.getElementById('searchBtn');
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
  DOM.prevBtn.addEventListener('click', () => moveCarousel(-1));
  DOM.nextBtn.addEventListener('click', () => moveCarousel(1));

  DOM.toggleBtns.forEach(btn => {
    btn.addEventListener('click', handleViewToggle);
  });

  DOM.searchBtn.addEventListener('click', handleCitySearch);
  DOM.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCitySearch();
  });

  // Свайпы для мобильных
  let startX = 0;
  DOM.carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  
  DOM.carousel.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      moveCarousel(diff > 0 ? 1 : -1);
    }
  }, { passive: true });
}

/**
 * Переключение вида (день/час)
 */
function handleViewToggle(e) {
  DOM.toggleBtns.forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
  appState.view = e.currentTarget.dataset.view;
  appState.currentIndex = 0;
  if (appState.forecast) renderCarousel();
}

/**
 * Запрос геолокации пользователя
 */
function requestGeolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      showMessage('Геолокация не поддерживается', 'error');
      loadDefaultLocation();
      return resolve();
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        appState.location = { 
          lat: latitude, 
          lon: longitude, 
          name: 'Ваше местоположение' 
        };
        updateLocationDisplay();
        await fetchWeather(latitude, longitude);
        resolve();
      },
      async (err) => {
        console.warn('Геолокация отклонена:', err.message);
        showMessage('Доступ к геолокации запрещён. Показываем Москву.', 'info');
        loadDefaultLocation();
        await fetchWeather(CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lon);
        resolve();
      },
      { 
        enableHighAccuracy: false, 
        timeout: 8000, 
        maximumAge: 300000 
      }
    );
  });
}

/**
 * Загрузка местоположения по умолчанию
 */
function loadDefaultLocation() {
  appState.location = { ...CONFIG.DEFAULT_LOCATION };
  updateLocationDisplay();
}

/**
 * Обновление отображения местоположения
 */
function updateLocationDisplay() {
  DOM.location.innerHTML = `📍 ${appState.location.name}`;
}

/**
 * Обработка поиска города
 */
async function handleCitySearch() {
  const city = DOM.cityInput.value.trim();
  if (!city) return;

  showMessage('🔍 Поиск города...');
  
  try {
    const response = await fetch(
      `${CONFIG.GEOCODING_API}/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`
    );
    const data = await response.json();

    if (!data.results?.length) {
      showMessage(`❌ Город "${city}" не найден`, 'error');
      return;
    }

    const result = data.results[0];
    appState.location = {
      lat: result.latitude,
      lon: result.longitude,
      name: `${result.name}, ${result.country}`
    };

    updateLocationDisplay();
    DOM.cityInput.value = '';
    await fetchWeather(appState.location.lat, appState.location.lon);
    showMessage('✅ Прогноз обновлён!', 'success');
  } catch (err) {
    console.error('Ошибка поиска:', err);
    showMessage('❌ Ошибка при поиске города', 'error');
  }
}

/**
 * Загрузка прогноза погоды с Open-Meteo
 */
async function fetchWeather(lat, lon) {
  showMessage('⏳ Загрузка прогноза...');
  
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      hourly: 'temperature_2m,relativehumidity_2m,precipitation_probability,weathercode',
      daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: CONFIG.DAILY_FORECAST_DAYS
    });

    const response = await fetch(`${CONFIG.API_BASE}/forecast?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    appState.forecast = await response.json();
    appState.currentIndex = 0;
    renderCarousel();
    showMessage('');
  } catch (err) {
    console.error('Ошибка загрузки погоды:', err);
    showMessage('❌ Не удалось загрузить прогноз. Проверьте соединение.', 'error');
  }
}

/**
 * Рендеринг карусели
 */
function renderCarousel() {
  if (!appState.forecast) return;

  DOM.carousel.innerHTML = '';
  DOM.dots.innerHTML = '';

  const items = appState.view === 'daily' 
    ? prepareDailyItems() 
    : prepareHourlyItems();

  if (items.length === 0) {
    DOM.carousel.innerHTML = '<div class="loading">Нет данных для отображения</div>';
    return;
  }

  // Создание карточек
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = `card ${appState.view === 'hourly' ? 'time-card' : ''}`;
    card.innerHTML = `
      <div class="${appState.view === 'daily' ? 'date' : 'time'}">${item.time}</div>
      <div class="icon">${item.icon}</div>
      <div class="temp">${item.temp}</div>
      <div class="condition">${item.condition}</div>
      ${item.extra ? `<div class="extra">${item.extra}</div>` : ''}
    `;
    DOM.carousel.appendChild(card);
  });

  // Точки навигации
  const pageCount = Math.ceil(items.length / CONFIG.CARDS_PER_PAGE);
  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToPage(i));
    DOM.dots.appendChild(dot);
  }

  updateCarouselPosition();
}

/**
 * Подготовка данных для дневного прогноза
 */
function prepareDailyItems() {
  const { daily } = appState.forecast;
  return daily.time.map((date, i) => {
    const code = daily.weathercode[i];
    const weather = WEATHER_CODES[code] || { icon: '❓', text: 'Неизвестно' };
    return {
      time: formatDate(date),
      icon: weather.icon,
      temp: `${Math.round(daily.temperature_2m_max[i])}°`,
      condition: weather.text,
      extra: `Мин: ${Math.round(daily.temperature_2m_min[i])}° • Осадки: ${daily.precipitation_probability_max[i]}%`
    };
  });
}

/**
 * Подготовка данных для почасового прогноза
 */
function prepareHourlyItems() {
  const { hourly } = appState.forecast;
  const now = new Date();
  const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
  const endIdx = Math.min(startIdx + CONFIG.HOURLY_FORECAST_COUNT, hourly.time.length);
  
  if (startIdx === -1) return [];
  
  return hourly.time.slice(startIdx, endIdx).map((time, idx) => {
    const realIdx = startIdx + idx;
    const code = hourly.weathercode[realIdx];
    const weather = WEATHER_CODES[code] || { icon: '❓', text: 'Неизвестно' };
    return {
      time: formatTime(time),
      icon: weather.icon,
      temp: `${Math.round(hourly.temperature_2m[realIdx])}°`,
      condition: weather.text,
      extra: `Влажность: ${hourly.relativehumidity_2m[realIdx]}%`
    };
  });
}

/**
 * Перемещение карусели
 */
function moveCarousel(direction) {
  const itemsCount = appState.view === 'daily' 
    ? appState.forecast.daily.time.length 
    : Math.min(CONFIG.HOURLY_FORECAST_COUNT, appState.forecast.hourly.time.length);
  
  const pageCount = Math.ceil(itemsCount / CONFIG.CARDS_PER_PAGE);
  appState.currentIndex = Math.max(0, Math.min(appState.currentIndex + direction, pageCount - 1));
  updateCarouselPosition();
}

/**
 * Переход к конкретной странице
 */
function goToPage(pageIndex) {
  const itemsCount = appState.view === 'daily' 
    ? appState.forecast.daily.time.length 
    : Math.min(CONFIG.HOURLY_FORECAST_COUNT, appState.forecast.hourly.time.length);
    
  const pageCount = Math.ceil(itemsCount / CONFIG.CARDS_PER_PAGE);
  
  if (pageIndex >= 0 && pageIndex < pageCount) {
    appState.currentIndex = pageIndex;
    updateCarouselPosition();
  }
}

/**
 * Обновление позиции карусели
 */
function updateCarouselPosition() {
  const cardWidth = 180 + 15; // ширина карточки + gap
  const offset = -appState.currentIndex * cardWidth * CONFIG.CARDS_PER_PAGE;
  DOM.carousel.style.transform = `translateX(${offset}px)`;

  // Обновление активных точек
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === appState.currentIndex);
  });
}

/**
 * Форматирование даты
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Сегодня';
  if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
  
  return date.toLocaleDateString('ru-RU', { 
    weekday: 'short', 
    day: 'numeric',
    month: 'numeric'
  });
}

/**
 * Форматирование времени
 */
function formatTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Отображение сообщений
 */
function showMessage(text, type = '') {
  if (!text) {
    DOM.message.innerHTML = '';
    DOM.message.className = '';
    return;
  }
  DOM.message.textContent = text;
  DOM.message.className = type;
}

/**
 * Основная функция инициализации
 */
async function init() {
  cacheDOM();
  setupEventListeners();
  await requestGeolocation();
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', init);