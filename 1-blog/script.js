'use strict'
// Получаем элементы меню
const menuItems = document.querySelectorAll('.menu__item a');

// Добавляем обработчики для каждого пункта меню
menuItems.forEach((item) => {
	item.addEventListener('click', (e) => {
		e.preventDefault(); // Отменяем стандартное поведение ссылки

		// Определяем, к какому разделу прокручивать
        let targetId = '';//Создаём переменную для хранения ID раздела (пока пустую)
        const text = item.textContent.trim();//Получаем текст ссылки и обрезаем лишние пробелы
        
        if (text === 'HTML и CSS') {
            targetId = '#html-css';
        } else if (text === 'Frontend') {
            targetId = '#html-css'; // Можно направить в тот же раздел
        } else if (text === 'Backend') {
            targetId = '#backend';
        }
		// Плавная прокрутка
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
		// Обновляем активный пункт меню
        updateActiveMenuItem(item);
	})
})
// Функция для обновления активного пункта
function updateActiveMenuItem(activeItem) {
    menuItems.forEach(item => {
        item.style.fontWeight = '400';
        item.style.opacity = '0.7';
    });
    activeItem.style.fontWeight = '700';
    activeItem.style.opacity = '1';
}