
document.addEventListener('DOMContentLoaded', function() {

    const quantityInputs = document.querySelectorAll('.item-quantity');
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

    //обновления корзины на экране
    function updateCartDisplay() {
        let cartHtml = '';
        let total = 0;
        let hasItems = false;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                hasItems = true;
                const name = input.dataset.name;
                const price = parseInt(input.dataset.price);
                const itemTotal = price * quantity;
                total += itemTotal;

                // Добавляем строку в корзину
                cartHtml += `<div class="cart-item-row">
                    <span>${name} (x${quantity})</span>
                    <span>${itemTotal} ₽</span>
                </div>`;
            }
        });

        if (!hasItems) {
            cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
        } else {
            cartItemsDiv.innerHTML = cartHtml;
        }
        totalPriceSpan.textContent = total;
    }

    // изменения во всех полях количества
    quantityInputs.forEach(input => {
        input.addEventListener('input', updateCartDisplay);
    });

    // отправка заказа
    async function submitOrder() {
        // 1. Собираем заказ
        const orderItems = [];
        let total = 0;
        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const name = input.dataset.name;
                const price = parseInt(input.dataset.price);
                orderItems.push({ name: name, quantity: quantity, price: price });
                total += price * quantity;
            }
        });

        // проверка что корзина не пуста
        if (orderItems.length === 0) {
            orderStatus.textContent = 'Ошибка: Добавьте блюда в заказ.';
            orderStatus.className = 'error';
            return;
        }

        // проверка что имя и телефон заполнены
        if (!customerName.value.trim() || !customerPhone.value.trim()) {
            orderStatus.textContent = 'Ошибка: Введите имя и номер телефона.';
            orderStatus.className = 'error';
            return;
        }

        // подготовка данные для отправки
        const orderData = {
            name: customerName.value.trim(),
            phone: customerPhone.value.trim(),
            items: orderItems,
            total: total,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        // отправка данных 
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbz9vpuBJ_LeZcU8KW7VNbIzbwPJHE9ExJNJGlW9GDKLDsOd5vAqQfPbQWH5NfVPJV22/exec'; 

        orderStatus.textContent = 'Отправка заказа...';
        orderStatus.className = '';

        try {
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Важно для работы с Google Apps Script без CORS
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

             orderStatus.textContent = '✅ Заказ успешно отправлен! Скоро он будет готов.';
             orderStatus.className = 'success';

             // Очищаем корзину и поля 
             quantityInputs.forEach(input => input.value = 0);
             customerName.value = '';
             customerPhone.value = '';
             updateCartDisplay();


        } catch (error) {
            console.error('Ошибка:', error);
            orderStatus.textContent = '❌ Ошибка при отправке. Попробуйте еще раз или сообщите администратору.';
            orderStatus.className = 'error';
        }
    }

    // Вешаем обработчик на кнопку отправки
    submitButton.addEventListener('click', submitOrder);

    // Первоначальное обновление корзины
    updateCartDisplay();
});