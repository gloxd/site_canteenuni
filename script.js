document.addEventListener('DOMContentLoaded', function() {

    const cartItemsDiv = document.getElementById('cart-items');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

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

    // 1. ДЕЛЕГИРОВАНИЕ КЛИКОВ: Обработка нажатий на кнопки + и - по всему документу
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
            
            // Сразу пересчитываем корзину
            updateCartDisplay();
        }
    });

    // 2. РУЧНОЙ ВВОД: Обработка ввода чисел непосредственно в инпуты руками
    document.body.addEventListener('input', function(event) {
        if (event.target.classList.contains('item-quantity')) {
            let val = parseInt(event.target.value);
            
            // Проверка на отрицательные значения или некорректный ввод
            if (isNaN(val) || val < 0) {
                event.target.value = 0;
            } else {
                event.target.value = val; // Сбрасываем лишние нули впереди (например, 05 превратится в 5)
            }
            
            // Сразу пересчитываем корзину
            updateCartDisplay();
        }
    });

    // Очистка пустых полей при потере фокуса
    document.body.addEventListener('blur', function(event) {
        if (event.target.classList.contains('item-quantity')) {
            if (event.target.value === '') {
                event.target.value = 0;
                updateCartDisplay();
            }
        }
    }, true);

    // Функция отправки заказа
    async function submitOrder() {
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

        if (orderItems.length === 0) {
            orderStatus.textContent = 'Ошибка: Добавьте блюда в корзину.';
            orderStatus.className = 'error';
            return;
        }

        if (!customerName.value.trim() || !customerPhone.value.trim()) {
            orderStatus.textContent = 'Ошибка: Заполните имя и телефон.';
            orderStatus.className = 'error';
            return;
        }

        const orderData = {
            name: customerName.value.trim(),
            phone: customerPhone.value.trim(),
            items: orderItems,
            total: total,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        // Твой URL Google Apps Script остался неизменным
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbz9vpuBJ_LeZcU8KW7VNbIzbwPJHE9ExJNJGlW9GDKLDsOd5vAqQfPbQWH5NfVPJV22/exec'; 

        orderStatus.textContent = 'Отправка заказа...';
        orderStatus.className = '';

        try {
            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

             orderStatus.textContent = '✅ Заказ успешно отправлен! Ожидайте выдачи.';
             orderStatus.className = 'success';

             // Сброс формы после успешного заказа
             quantityInputs.forEach(input => input.value = 0);
             customerName.value = '';
             customerPhone.value = '';
             updateCartDisplay();

        } catch (error) {
            console.error('Ошибка:', error);
            orderStatus.textContent = '❌ Ошибка сети при отправке. Попробуйте еще раз.';
            orderStatus.className = 'error';
        }
    }

    submitButton.addEventListener('click', submitOrder);

    // Первичный запуск для обнуления интерфейса
    updateCartDisplay();
});
