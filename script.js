document.addEventListener('DOMContentLoaded', function() {

    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

    // ТВОЙ URL ФОРМЫ (с правильным ID)
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWSCH4DF03dr5KHbK9OHUfQi5D5fbtuejMMl9Rvr9Ri7Ee_A/formResponse';
    
    // ID ПОЛЕЙ (найдены через инспектор)
    const FIELD_IDS = {
        name: 'entry.1598896576',      // Имя клиента
        phone: 'entry.967339619',       // Телефон
        order: 'entry.2085750648',      // Детали заказа
        total: 'entry.271726782'        // Сумма заказа
    };

    // Функция перерасчета и обновления отображения корзины
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
                        <strong>${itemTotal} ₽</strong>
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

    // Обработка кнопок + и -
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('qty-btn')) {
            const container = event.target.closest('.quantity-controls');
            if (!container) return;

            const input = container.querySelector('.item-quantity');
            if (!input) return;

            let currentVal = parseInt(input.value) || 0;

            if (event.target.classList.contains('plus')) {
                input.value = currentVal + 1;
            } else if (event.target.classList.contains('minus')) {
                if (currentVal > 0) {
                    input.value = currentVal - 1;
                }
            }
            
            updateCartDisplay();
        }
    });

    // Обработка ручного ввода
    document.body.addEventListener('input', function(event) {
        if (event.target.classList.contains('item-quantity')) {
            let val = parseInt(event.target.value);
            
            if (isNaN(val) || val < 0) {
                event.target.value = 0;
            } else {
                event.target.value = val;
            }
            
            updateCartDisplay();
        }
    });

    // Очистка пустых полей
    document.body.addEventListener('blur', function(event) {
        if (event.target.classList.contains('item-quantity')) {
            if (event.target.value === '') {
                event.target.value = 0;
                updateCartDisplay();
            }
        }
    }, true);

    // Функция отправки заказа через Google Forms
    async function submitOrder() {
        // Собираем данные заказа
        const quantityInputs = document.querySelectorAll('.item-quantity');
        const orderItems = [];
        let total = 0;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            if (quantity > 0) {
                const name = input.dataset.name;
                const price = parseInt(input.dataset.price) || 0;
                orderItems.push({ name: name, quantity: quantity, price: price });
                total += price * quantity;
            }
        });

        // Валидация
        if (orderItems.length === 0) {
            orderStatus.textContent = '❌ Добавьте блюда в корзину';
            orderStatus.className = 'error';
            setTimeout(() => {
                orderStatus.textContent = '';
                orderStatus.className = '';
            }, 3000);
            return;
        }

        if (!customerName.value.trim() || !customerPhone.value.trim()) {
            orderStatus.textContent = '❌ Заполните имя и телефон';
            orderStatus.className = 'error';
            setTimeout(() => {
                orderStatus.textContent = '';
                orderStatus.className = '';
            }, 3000);
            return;
        }

        // Формируем текст заказа для отправки
        let orderText = '';
        orderItems.forEach(item => {
            orderText += `${item.name} x${item.quantity} = ${item.price * item.quantity}₽\n`;
        });

        // Создаем данные для отправки в форму
        const formData = new URLSearchParams();
        formData.append(FIELD_IDS.name, customerName.value.trim());
        formData.append(FIELD_IDS.phone, customerPhone.value.trim());
        formData.append(FIELD_IDS.order, orderText.trim());
        formData.append(FIELD_IDS.total, `${total} ₽`);

        // Показываем статус отправки
        orderStatus.textContent = '⏳ Отправка заказа...';
        orderStatus.className = '';

        try {
            // Отправляем данные через fetch (no-cors режим)
            await fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, {
                method: 'GET',
                mode: 'no-cors'
            });

            // При успешной отправке
            orderStatus.textContent = '✅ Заказ успешно отправлен! Ожидайте выдачи.';
            orderStatus.className = 'success';

            // Сбрасываем форму
            quantityInputs.forEach(input => input.value = 0);
            customerName.value = '';
            customerPhone.value = '';
            updateCartDisplay();

            // Очищаем сообщение через 5 секунд
            setTimeout(() => {
                if (orderStatus.textContent === '✅ Заказ успешно отправлен! Ожидайте выдачи.') {
                    orderStatus.textContent = '';
                    orderStatus.className = '';
                }
            }, 5000);

        } catch (error) {
            console.error('Ошибка:', error);
            orderStatus.textContent = '❌ Ошибка при отправке. Попробуйте еще раз.';
            orderStatus.className = 'error';
            
            setTimeout(() => {
                if (orderStatus.textContent === '❌ Ошибка при отправке. Попробуйте еще раз.') {
                    orderStatus.textContent = '';
                    orderStatus.className = '';
                }
            }, 3000);
        }
    }

    // Добавляем обработчик на кнопку отправки
    submitButton.addEventListener('click', submitOrder);

    // Первичный запуск
    updateCartDisplay();
});
