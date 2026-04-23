document.addEventListener('DOMContentLoaded', function () {
	let formData = {};//Переменная для сохранения данных из инпутов
	const form = document.getElementById('form');
	const LS = localStorage;

	//Сохранние данных
	form.addEventListener('input', function (event) {
		if (event.target.type === "checkbox") {
			formData[event.target.name] = event.target.checked
		} else {
			formData[event.target.name] = event.target.value
		}
		LS.setItem('formData', JSON.stringify(formData))
	});

	//Восстановление данных
	if (LS.getItem('formData')) {
		formData = JSON.parse(LS.getItem('formData'));
		for (let key in formData) {
			const element = form.elements[key];
			if (!element) continue;
			if (element.type === 'checkbox') {
				element.checked = !!formData[key];
			} else {
				element.value = formData[key];
			}
		}
	}

	// Живая очистка ошибок (при вводе)
	function setupLiveClearing() {
		// Для всех текстовых полей
		const textFields = ['email', 'name', 'lastname', 'password'];
		textFields.forEach(fieldId => {
			const field = document.getElementById(fieldId);
			if (!field) return;

			field.addEventListener('input', function () {
				// Удаляем класс ошибки с этого поля
				this.classList.remove('error-input');

				// Удаляем сообщение об ошибке, которое находится сразу после этого поля
				const nextDiv = this.nextElementSibling;
				if (nextDiv && nextDiv.classList.contains('error-text')) {
					nextDiv.remove();
				}

				// Для поля name или lastname — удаляем весь контейнер .field-errors
				if (fieldId === 'name' || fieldId === 'lastname') {
					const groupErrors = document.querySelector('.field-errors');
					if (groupErrors) groupErrors.remove();

					// Также убираем красную рамку у соседнего поля в группе
					const otherId = fieldId === 'name' ? 'lastname' : 'name';
					const otherField = document.getElementById(otherId);
					if (otherField) otherField.classList.remove('error-input');
				}
			});
		});

		// Для чекбокса
		const checkbox = document.getElementById('checkbox');
		if (checkbox) {
			checkbox.addEventListener('change', function () {
				// Удаляем сообщение об ошибке чекбокса
				const errorDiv = document.querySelector('.conditions + .error-text, .conditions ~ .error-text');
				if (errorDiv && errorDiv.classList.contains('error-text')) {
					errorDiv.remove();
				}
				// Удаляем красную рамку с label
				const label = document.querySelector('label[for="checkbox"]');
				if (label) label.classList.remove('error-input');
			});
		}
	}

	// Вызываем функцию настройки
	setupLiveClearing();

	//Валидация формы 
	form.addEventListener('submit', function (event) {
		event.preventDefault();//предотвращаем стандартную отправку форм
		clearErrors();

		let isValid = true;

		let email = document.getElementById('email');
		let name = document.getElementById('name');
		let lastname = document.getElementById('lastname');
		let password = document.getElementById('password');
		const checkbox = document.getElementById('checkbox');

		// Функция для ошибки под полем email, password
		const showErrorUnderField = (message, input) => {
			const errorDiv = document.createElement('div');
			errorDiv.className = 'error-text';
			errorDiv.textContent = message;
			errorDiv.style.color = 'red';
			errorDiv.style.fontSize = '14px';
			errorDiv.style.marginTop = '4px';
			input.insertAdjacentElement('afterend', errorDiv);
			input.classList.add('error-input');
			isValid = false;
		};

		// Функция для ошибки под полем checkbox
		const errorUnderCheckbox = (message) => {
			const errorCheck = document.createElement('div');
			errorCheck.className = 'error-text';
			errorCheck.textContent = message;
			errorCheck.style.cssText = 'color: red; font-size: 14px; margin-top: 4px;';

			const conditionsBlock = document.querySelector('.conditions');
			conditionsBlock.insertAdjacentElement('afterend', errorCheck);

			// Добавляем класс ошибки к label (который рисует чекбокс)
			const label = document.querySelector('label[for="checkbox"]');
			label.classList.add('error-input');

			isValid = false;
		};

		// Функция для ошибок имени/фамилии (под блоком .field)
		const addFieldGroupError = (message, fieldId) => {
			let errorContainer = document.querySelector('.field-errors');
			if (!errorContainer) {
				errorContainer = document.createElement('div');
				errorContainer.className = 'field-errors';
				errorContainer.style.marginTop = '4px';
				const fieldBlock = document.querySelector('.field');
				fieldBlock.insertAdjacentElement('afterend', errorContainer);
			}

			const errorElement = document.createElement('div');
			errorElement.className = 'error-text';
			errorElement.textContent = message;
			errorElement.style.color = 'red';
			errorElement.style.fontSize = '14px';
			errorContainer.appendChild(errorElement);

			const field = document.getElementById(fieldId);
			if (field) field.classList.add('error-input');

			isValid = false;
		}
		// Валидация email 
		const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
		if (!emailRegex.test(email.value.trim())) {
			showErrorUnderField('Введите корректный email (например, name@domain.com)', email);
		}
		// Имя и фамилия
		if (!name.value.trim()) addFieldGroupError('Введите имя', 'name');
		if (!lastname.value.trim()) addFieldGroupError('Введите фамилию', 'lastname');

		// Пароль
		const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
		if (!passwordRegex.test(password.value.trim())) {
			showErrorUnderField('Пароль должен быть длиной от 8 до 16 символов, включать как минимум одну цифру, одну букву в нижнем и одну букву в верхнем регистре', password);
		}

		// Проверка чекбокса
		if (!checkbox.checked) {
			errorUnderCheckbox('Вы должны принять условия использования');
		}

		// Если все поля валидны
		if (isValid) {
			alert('Регистрация прошла успешно');
			LS.removeItem('formData');
			formData = {};
			this.reset();
		}
	});
})
//Функция очистки ошибок (при отправке)
function clearErrors() {
	// Удаляем все сообщения об ошибках
	document.querySelectorAll('.error-text').forEach(el => el.remove());

	// Удаляем красную рамку со всех полей ввода
	document.querySelectorAll('.form__input').forEach(input => {
		input.classList.remove('error-input');
	});

	// Снимаем красную рамку с кастомного чекбокса (с label)
	const label = document.querySelector('label[for="checkbox"]');
	if (label) label.classList.remove('error-input');

	// Удаляем контейнер групповых ошибок для имени/фамилии
	const fieldErrors = document.querySelector('.field-errors');
	if (fieldErrors) fieldErrors.remove();
}


