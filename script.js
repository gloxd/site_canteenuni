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

    // --- БАЗА ДАННЫХ МЕНЮ (Все ваши переименованные блюда) ---
    const MENU_ITEMS = [
        { name: "Ассорти фруктовое", price: 120, image: "images/assorti_fruktovoe.jpg" },
        { name: "Биточки по-селянски", price: 160, image: "images/bitochki_poselyanski.jpg" },
        { name: "Блины постные с джемом", price: 60, image: "images/blini_postnie_s_dzhemom.jpg" },
        { name: "Блины", price: 40, image: "images/blini.jpg" },
        { name: "Блины с капустой", price: 70, image: "images/blini_s_kapustoy.jpg" },
        { name: "Винегрет", price: 50, image: "images/vinegret.jpg" },
        { name: "Гречневая лапша", price: 90, image: "images/grechnevaya_lapsha.jpg" },
        { name: "Драники картофельные", price: 80, image: "images/draniki_kartofelnie.jpg" },
        { name: "Запеканка из печени", price: 110, image: "images/zapekanka_iz_pecheni.jpg" },
        { name: "Запеканка творожная", price: 100, image: "images/zapekanka_tvorozhnaya.jpg" },
        { name: "Камбала запеченная", price: 180, image: "images/kambala.jpg" },
        { name: "Каша с маслом", price: 45, image: "images/kasha_s_maslom.jpg" },
        { name: "Колбаски рыбные", price: 140, image: "images/kolbaski_rybnye.jpg" },
        { name: "Кура по-французски", price: 170, image: "images/kura_po_francuzski.jpg" },
        { name: "Курица с овощами", price: 150, image: "images/kurica_s_ovoshami.jpg" },
        { name: "Манты", price: 160, image: "images/manty.jpg" },
        { name: "Салат Маскарад", price: 75, image: "images/maskarad.jpg" },
        { name: "Окорочка фаршированные", price: 190, image: "images/okorochka_farshirovannye.jpg" },
        { name: "Омлет паровой", price: 65, image: "images/omlet_parovoy.jpg" },
        { name: "Пельмени", price: 130, image: "images/pelmeni.jpg" },
        { name: "Котлеты Пожарские", price: 120, image: "images/kotleti_pozharskie.jpg" },
        { name: "Картофельное пюре", price: 50, image: "images/pyure.jpg" },
        { name: "Рис отварной", price: 45, image: "images/ris.jpg" },
        { name: "Рулет куриный", price: 140, image: "images/rulet_kuriny.jpg" },
        { name: "Рулет морковный с курагой", price: 95, image: "images/rulet_morkovny_s_kuragoy.jpg" },
        { name: "Салат-коктейль", price: 85, image: "images/salat_kokteyl.jpg" },
        { name: "Салат из свежей капусты", price: 45, image: "images/salat_iz_svezhey_kapusty.jpg" },
        { name: "Салат из тыквы", price: 55, image: "images/salat_iz_tykvy.jpg" },
        { name: "Сарделька отварная", price: 90, image: "images/sardelka.jpg" },
        { name: "Салат из свеклы", price: 45, image: "images/salat_iz_svekly.jpg" },
        { name: "Свинина запеченная", price: 210, image: "images/svinina.jpg" },
        { name: "Сельдь под шубой", price: 90, image: "images/seld_pod_shuboy.jpg" },
        { name: "Суп куриный", price: 80, image: "images/sup_kuriny.jpg" },
        { name: "Суп сырный", price: 95, image: "images/sup_syrny.jpg" },
        { name: "Сырники творожные", price: 110, image: "images/syrniki_tvorozhnye.jpg" },
        { name: "Филе мясное", price: 160, image: "images/file.jpg" },
        { name: "Филе горбуши", price: 190, image: "images/file_gorbushi.jpg" },
        { name: "Филе куры в сырной корочке", price: 165, image: "images/file_kurinoe_v_syrnoy.jpg" },
        { name: "Фреш-ролл с бужениной", price: 135, image: "images/fresh_s_buzheninoy.jpg" },
        { name: "Фрикадельки", price: 115, image: "images/frikadelki.jpg" },
        { name: "Цветная капуста с фасолью", price: 85, image: "images/cvetnaya_kapusta_s_fasolyu.jpg" },
        { name: "Шницель Полесский", price: 145, image: "images/shnicel_polesskiy.jpg" },
        { name: "Щи по-уральски", price: 80, image: "images/shi_po_uralski.jpg" },
        { name: "Эскалоп", price: 175, image: "images/eskalop.jpg" }
    ];

    // --- ФУНКЦИЯ ДИНАМИЧЕСКОЙ ОТРИСОВКИ КАРТОЧЕК ---
    function renderMenu() {
        const menuContainer = document.getElementById('menu-container');
        if (!menuContainer) return;

        menuContainer.innerHTML = ''; // Очищаем от старой разметки

        MENU_ITEMS.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';

            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='images/placeholder.jpg'">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <div class="item-actions">
                        <span class="item-price">${item.price} ₽</span>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" type="button">—</button>
                            <input type="number" class="item-quantity" value="0" min="0" data-name="${item.name}" data-price="${item.price}">
                            <button class="qty-btn plus" type="button">+</button>
                        </div>
                    </div>
                </div>
            `;
            menuContainer.appendChild(card);
        });

        // Навешиваем события на новые сгенерированные кнопки
        setupQuantityControls();
    }

    // Выделенная функция для привязки событий клика кнопкам Плюс/Минус
    function setupQuantityControls() {
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
    }

    // Сначала генерируем карточки меню из базы данных
    renderMenu();


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
        
        if (subtotalPriceSpan) subtotalPriceSpan.textContent = `${total} ₽`;
        totalPriceSpan.textContent = `${total} ₽`;
    }


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
