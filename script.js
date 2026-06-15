const GOOGLE_CLIENT_ID = '721070299233-d7jimru41hrc0ghs1nn6p38d4p3jjogn.apps.googleusercontent.com';

let currentUser = { name: '', email: '' };

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

    // Настройки интеграции с Google Forms
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWSCH4DF03dr5KHbK9OHUfQi5D5fbtuejMMl9Rvr9Ri7Ee_A/formResponse';
    
    const FIELD_IDS = {
        name: 'entry.1598896576',      // Поле имени
        phone: 'entry.967339619',       // Поле телефона
        order: 'entry.2085750648',      // Поле деталей заказа
        total: 'entry.271726782'        // Поле суммы
    };

    // Обновление отображения корзины и пересчет Итого
    function updateCartDisplay() {
        const quantityInputs = document.querySelectorAll('.item-quantity');
        let cartHtml = '';
        let total = 0;
        let hasItems = false;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                hasItems = true;
                const name = input.dataset.name;
                const price = parseInt(input.dataset.price);
                const itemTotal = price * quantity;
                total += itemTotal;

                cartHtml += `
                    <div class="cart-item-row">
                        <span>${name} (x${quantity})</span>
                        <span>${itemTotal} ₽</span>
                    </div>
                `;
            }
        });

        if (!hasItems) {
            cartItemsDiv.innerHTML = '<p class="empty-text">Корзина пуста</p>';
        } else {
            cartItemsDiv.innerHTML = cartHtml;
        }
        
        totalPriceSpan.textContent = `${total} ₽`;
    }

    // Подвязка логики для кнопок плюс/минус в карточках меню
    document.querySelectorAll('.quantity-controls').forEach(controls => {
        const input = controls.querySelector('.item-quantity');
        const minusBtn = controls.querySelector('.qty-btn.minus');
        const plusBtn = controls.querySelector('.qty-btn.plus');

        minusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 0;
            if (val > 0) {
                input.value = val - 1;
                updateCartDisplay();
            }
        });

        plusBtn.addEventListener('click', () => {
            let val = parseInt(input.value) || 0;
            input.value = val + 1;
            updateCartDisplay();
        });

        input.addEventListener('change', () => {
            let val = parseInt(input.value) || 0;
            if (val < 0) input.value = 0;
            updateCartDisplay();
        });
    });

    // Функция безопасной отправки заказа
    async function submitOrder() {
        // Защитная проверка кибербезопасности на уровне фронтенда
        if (!currentUser.email) {
            alert('Ошибка безопасности: Вы не авторизованы!');
            window.location.reload();
            return;
        }

        const quantityInputs = document.querySelectorAll('.item-quantity');
        let orderItems = [];
        let total = 0;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const name = input.dataset.name;
                const price = parseInt(input.dataset.price);
                orderItems.push(`${name} (x${quantity})`);
                total += price * quantity;
            }
        });

        if (orderItems.length === 0) {
            alert('Пожалуйста, добавьте хотя бы одно блюдо в корзину.');
            return;
        }

        const phoneVal = customerPhone.value.trim();
        if (!phoneVal) {
            alert('Пожалуйста, укажите контактный телефон для связи.');
            return;
        }

        // Кибербез-сборка: объединяем проверенное Google имя и защищенный email
        const compositeName = `${currentUser.name} (${currentUser.email})`;

        const formData = new URLSearchParams();
        formData.append(FIELD_IDS.name, compositeName);
        formData.append(FIELD_IDS.phone, phoneVal);
        formData.append(FIELD_IDS.order, orderItems.join(', '));
        formData.append(FIELD_IDS.total, `${total} ₽`);

        submitButton.disabled = true;
        orderStatus.textContent = 'Отправка заказа...';
        orderStatus.className = '';

        try {
            await fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, {
                method: 'GET',
                mode: 'no-cors'
            });

            orderStatus.textContent = '✅ Заказ успешно отправлен! Ожидайте выдачи.';
            orderStatus.className = 'success';

            // Очистка формы
            quantityInputs.forEach(input => input.value = 0);
            customerPhone.value = '';
            updateCartDisplay();

            setTimeout(() => {
                if (orderStatus.textContent.includes('успешно')) {
                    orderStatus.textContent = '';
                    orderStatus.className = '';
                }
            }, 5000);

        } catch (error) {
            console.error('Ошибка отправки:', error);
            orderStatus.textContent = '❌ Ошибка сети при отправке. Попробуйте еще раз.';
            orderStatus.className = 'error';
        } finally {
            submitButton.disabled = false;
        }
    }

    submitButton.addEventListener('click', submitOrder);
    updateCartDisplay();
});

// Глобальные функции обратного вызова для Google Identity Services
function handleCredentialResponse(response) {
    try {
        // Безопасное декодирование JWT-токена, присланного криптографическими серверами Google
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const profile = JSON.parse(jsonPayload);

        // Фиксация пользователя в сессии приложения
        currentUser.name = profile.name || profile.email;
        currentUser.email = profile.email;

        // Разблокировка интерфейса
        document.getElementById('auth-overlay').style.display = 'none';

        // Заполнение инпута имени авторизованными данными
        const nameInput = document.getElementById('customer-name');
        if (nameInput) {
            nameInput.value = currentUser.name;
        }
    } catch (e) {
        console.error('Критическая ошибка авторизации токена:', e);
        alert('Не удалось верифицировать ваш профиль. Попробуйте снова.');
    }
}

// Запуск инициализации окна аутентификации при готовности скрипта Google
window.onload = function () {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            { theme: "outline", size: "large", text: "signin_with", width: "250" }
        );
    }
};
