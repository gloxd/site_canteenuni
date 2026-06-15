document.addEventListener('DOMContentLoaded', function() {

    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

    // ТВОЙ URL ГУГЛ ФОРМЫ
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWSCH4DF03dr5KHbK9OHUfQi5D5fbtuejMMl9Rvr9Ri7Ee_A/formResponse';
    
    // ID ПОЛЕЙ В ФОРМЕ
    const FIELD_IDS = {
        name: 'entry.1598896576',      // Имя клиента
        phone: 'entry.967339619',       // Телефон
        order: 'entry.2085750648',      // Детали заказа
        total: 'entry.271726782'        // Сумма заказа
    };

    // Твой Client ID авторизации Google
    const CLIENT_ID = "721070299233-d7jimru41hrc0ghs1nn6p38d4p3jjogn.apps.googleusercontent.com";

    // --- ЛОГИКА Google Авторизации ---

    function handleCredentialResponse(response) {
        // Декодируем JWT токен от Google, чтобы вытащить инфо о юзере
        const responsePayload = parseJwt(response.credential);
        console.log("Пользователь успешно вошел:", responsePayload);

        // Автозаполнение имени в инпуте формы заказа
        if (customerName) {
            customerName.value = `${responsePayload.name} (${responsePayload.email})`;
        }

        // Скрываем блокирующий экран
        const overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Вспомогательная функция для расшифровки токена Google
    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Безопасная инициализация кнопки авторизации (защита от рассинхронизации загрузки скрипта)
    function initGoogleAuth() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("google-btn"),
                { theme: "outline", size: "large", width: 280 }  
            );
        } else {
            setTimeout(initGoogleAuth, 100); // Перепроверяем через 100мс
        }
    }

    // Запускаем проверку авторизации
    initGoogleAuth();


    // --- ЛОГИКА РАБОТЫ КОРЗИНЫ ---

    // Расчет корзины
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
                const price = parseInt(input.dataset.price) || 0;
                const itemTotal = price * quantity;
                total += itemTotal;

                cartHtml += `
                    <div class="cart-item-row">
                        <span>${name} (x${quantity})</span>
                        <span>${itemTotal} ₽</span>
                    </div>`;
            }
        });

        if (!hasItems) {
            cartItemsDiv.innerHTML = '<p class="empty-text">Корзина пуста</p>';
        } else {
            cartItemsDiv.innerHTML = cartHtml;
        }
        
        subtotalPriceSpan.textContent = `${total} ₽`;
        totalPriceSpan.textContent = `${total} ₽`;
    }

    // Навешиваем клики на кнопки Плюс/Минус в карточках товаров
    document.querySelectorAll('.quantity-controls').forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.item-quantity');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                let currentVal = parseInt(input.value) || 0;
                if (currentVal > 0) {
                    input.value = currentVal - 1;
                    updateCartDisplay();
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentVal = parseInt(input.value) || 0;
                input.value = currentVal + 1;
                updateCartDisplay();
            });

            input.addEventListener('input', () => {
                let currentVal = parseInt(input.value);
                if (isNaN(currentVal) || currentVal < 0) {
                    input.value = 0;
                }
                updateCartDisplay();
            });
        }
    });


    // --- ОТПРАВКА ЗАКАЗА В GOOGLE ТАБЛИЦУ ---

    async function submitOrder() {
        const quantityInputs = document.querySelectorAll('.item-quantity');
        let orderItems = [];
        let total = 0;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const name = input.dataset.name;
                orderItems.push(`${name} (x${quantity})`);
                total += (parseInt(input.dataset.price) || 0) * quantity;
            }
        });

        if (orderItems.length === 0) {
            orderStatus.textContent = '⚠️ Ваша корзина пуста!';
            orderStatus.className = 'error';
            return;
        }

        if (!customerName.value.trim() || !customerPhone.value.trim()) {
            orderStatus.textContent = '⚠️ Заполните все поля (пройдите авторизацию и укажите телефон)!';
            orderStatus.className = 'error';
            return;
        }

        orderStatus.textContent = '⏳ Отправка заказа...';
        orderStatus.className = 'pending';

        // Собираем данные в структуру для Google формы
        const formData = new URLSearchParams();
        formData.append(FIELD_IDS.name, customerName.value.trim());
        formData.append(FIELD_IDS.phone, customerPhone.value.trim());
        formData.append(FIELD_IDS.order, orderItems.join(', '));
        formData.append(FIELD_IDS.total, `${total} ₽`);

        try {
            // Отправка методом GET (в no-cors режиме для обхода блокировок браузера)
            await fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, {
                method: 'GET',
                mode: 'no-cors'
            });

            orderStatus.textContent = '✅ Заказ успешно отправлен! Ожидайте выдачи.';
            orderStatus.className = 'success';

            // Очищаем количество у товаров в меню
            quantityInputs.forEach(input => input.value = 0);
            customerPhone.value = ''; // Телефон стираем для нового заказа
            updateCartDisplay(); // Сбрасываем внешний вид корзины

            setTimeout(() => {
                if (orderStatus.textContent.includes('✅')) {
                    orderStatus.textContent = '';
                    orderStatus.className = '';
                }
            }, 6000);

        } catch (error) {
            console.error('Ошибка:', error);
            orderStatus.textContent = '❌ Ошибка при отправке. Попробуйте еще раз.';
            orderStatus.className = 'error';
        }
    }

    // Подключаем отправку к кнопке заказа
    submitButton.addEventListener('click', submitOrder);

    // Первичный запуск отрисовки пустой корзины
    updateCartDisplay();
});
