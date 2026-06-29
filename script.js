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

// --- БАЗА ДАННЫХ МЕНЮ (Сгруппировано по категориям согласно фото меню) ---
const MENU_ITEMS = [
    // --- ЗАВТРАКИ / ВЫПЕЧКА ---
    { name: "Блины домашние", price: 40, category: "breakfast", image: "images/blini.jpg" },
    { name: "Блины постные с джемом", price: 40, category: "breakfast", image: "images/blini_postnie_s_dzhemom.jpg" },
    { name: "Блины с капустой", price: 55, category: "breakfast", image: "images/blini_s_kapustoy.jpg" },
    { name: "Драники картофельные", price: 69, category: "breakfast", image: "images/draniki_kartofelnie.jpg" },
    { name: "Запеканка творожная", price: 74, category: "breakfast", image: "images/zapekanka_tvorozhnaya.jpg" },
    { name: "Каша молочная овсяная с маслом", price: 49, category: "breakfast", image: "images/kasha_s_maslom.jpg" },
    { name: "Омлет натуральный паровой", price: 64, category: "breakfast", image: "images/omlet_parovoy.jpg" },
    { name: "Рулет морковный с курагой", price: 65, category: "breakfast", image: "images/rulet_morkovny_s_kuragoy.jpg" },
    { name: "Сырники творожные", price: 65, category: "breakfast", image: "images/syrniki_tvorozhnye.jpg" },

    // --- ЗАКУСКИ ---
    { name: "Ассорти фруктовое (стакан)", price: 115, category: "appetizers", image: "images/assorti_fruktovoe.jpg" },
    { name: "Рулет куриный с овощами", price: 118, category: "appetizers", image: "images/rulet_kuriny.jpg" },

    // --- САЛАТЫ ---
    { name: "Винегрет с кв.капустой и з.горошком", price: 47, category: "salads", image: "images/vinegret.jpg" },
    { name: "Салат \"Коктейль\" овощной", price: 80, category: "salads", image: "images/salat_kokteyl.jpg" },
    { name: "Салат \"Маскарад\" с кр/палочками/ветчиной", price: 81, category: "salads", image: "images/maskarad.jpg" },
    { name: "Салат \"Сельдь под шубой\"", price: 78, category: "salads", image: "images/seld_pod_shuboy.jpg" },
    { name: "Салат \"Фреш\" с бужениной", price: 92, category: "salads", image: "images/fresh_s_buzheninoy.jpg" },
    { name: "Салат из св.капусты с сельдереем", price: 41, category: "salads", image: "images/salat_iz_svezhey_kapusty.jpg" },
    { name: "Салат из свеклы с конс.огурцом", price: 52, category: "salads", image: "images/salat_iz_svekly.jpg" },
    { name: "Салат из тыквы/яблок/сметаны", price: 42, category: "salads", image: "images/salat_iz_tykvy.jpg" },

    // --- ПЕРВЫЕ БЛЮДА ---
    { name: "Суп куриный с мак.изделиями", price: 71, category: "soups", image: "images/sup_kuriny.jpg" },
    { name: "Суп-пюре сырный с гренками", price: 79, category: "soups", image: "images/sup_syrny.jpg" },
    { name: "Щи постные по-Уральски", price: 75, category: "soups", image: "images/shi_po_uralski.jpg" },

    // --- РЫБНЫЕ БЛЮДА ---
    { name: "Камбала жареная", price: 106, category: "fish", image: "images/kambala.jpg" },
    { name: "Колбаски рыбные жареные", price: 129, category: "fish", image: "images/kolbaski_rybnye.jpg" },
    { name: "Филе горбуши с польским соусом", price: 139, category: "fish", image: "images/file_gorbushi.jpg" },

    // --- МЯСНЫЕ БЛЮДА ---
    { name: "\"Зажарка\" овощная с куриной мякотью", price: 198, category: "meat", image: "images/kurica_s_ovoshami.jpg" },
    { name: "Биточки по-селянски", price: 131, category: "meat", image: "images/bitochki_poselyanski.jpg" },
    { name: "Запеканка из печени с рисом", price: 95, category: "meat", image: "images/zapekanka_iz_pecheni.jpg" },
    { name: "Котлета куриная Пожарская", price: 115, category: "meat", image: "images/kotleti_pozharskie.jpg" },
    { name: "Манты с мясом и картофелем", price: 150, category: "meat", image: "images/manty.jpg" },
    { name: "Окорочка фаршированные грибами", price: 173, category: "meat", image: "images/okorochka_farshirovannye.jpg" },
    { name: "Пельмени мясные", price: 144, category: "meat", image: "images/pelmeni.jpg" },
    { name: "Сарделька отварная", price: 97, category: "meat", image: "images/sardelka.jpg" },
    { name: "Свинина в белой панировке", price: 139, category: "meat", image: "images/svinina.jpg" },
    { name: "Филе куры в белой панировке", price: 119, category: "meat", image: "images/file.jpg" },
    { name: "Филе куры в сырной корочке", price: 132, category: "meat", image: "images/file_kurinoe_v_syrnoy.jpg" },
    { name: "Филе куры по-французски с грибами", price: 132, category: "meat", image: "images/kura_po_francuzski.jpg" },
    { name: "Фрикадельки мясные в соусе", price: 105, category: "meat", image: "images/frikadelki.jpg" },
    { name: "Шницель \"Полесский\"", price: 105, category: "meat", image: "images/shnicel_polesskiy.jpg" },
    { name: "Эскалоп из свинины", price: 147, category: "meat", image: "images/eskalop.jpg" },

    // --- ГАРНИРЫ ---
    { name: "Гречневая лапша с овощами", price: 82, category: "sides", image: "images/grechnevaya_lapsha.jpg" },
    { name: "Пюре картофельное", price: 55, category: "sides", image: "images/pyure.jpg" },
    { name: "Рис отварной", price: 45, category: "sides", image: "images/ris.jpg" },
    { name: "Цв/капуста с фасолью/морковью", price: 74, category: "sides", image: "images/cvetnaya_kapusta_s_fasolyu.jpg" }
];

    // --- ФУНКЦИЯ ДИНАМИЧЕСКОЙ ОТРИСОВКИ КАРТОЧЕК ---
    // --- СЛОВАРЬ КАТЕГОРИЙ ДЛЯ ОТОБРАЖЕНИЯ НА РУССКОМ ---
const CATEGORY_TITLES = {
    breakfast: "🥞 Завтраки / Выпечка",
    appetizers: "🥗 Закуски",
    salads: "🥗 Салаты",
    soups: "🥣 Первые блюда",
    fish: "🐟 Рыбные блюда",
    meat: "🥩 Мясные блюда",
    sides: "🍚 Гарниры"
};

// --- ФУНКЦИЯ ОТРИСОВКИ МЕНЮ ПО КАТЕГОРИЯМ ---
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = ''; // Очищаем контейнер

    // Группируем элементы меню по категориям
    const groupedMenu = {};
    MENU_ITEMS.forEach(item => {
        if (!groupedMenu[item.category]) {
            groupedMenu[item.category] = [];
        }
        groupedMenu[item.category].push(item);
    });

    // Перебираем категории в нужном нам порядке
    const categoryOrder = ['breakfast', 'appetizers', 'salads', 'soups', 'fish', 'meat', 'sides'];

    categoryOrder.forEach(categoryKey => {
        const items = groupedMenu[categoryKey];
        if (!items || items.length === 0) return; // Если в категории нет блюд, пропускаем

        // Создаем блок для категории
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section';
        categorySection.style.gridColumn = "1 / -1"; // Чтобы заголовок растягивался на всю ширину сетки
        categorySection.style.marginTop = "30px";

        // Создаем красивый заголовок категории
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = CATEGORY_TITLES[categoryKey] || categoryKey;
        categoryTitle.style.borderBottom = "2px solid var(--primary-color)";
        categoryTitle.style.paddingBottom = "8px";
        categoryTitle.style.marginBottom = "20px";
        categoryTitle.style.color = "var(--text-main)";
        categorySection.appendChild(categoryTitle);

        menuContainer.appendChild(categorySection);

        // Отрисовываем блюда этой категории
        items.forEach(item => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/300x200?text=%D0%9D%D0%B5%D1%82+%D1%84%D0%BE%D1%82%D0%BE'">
                <div class="product-info">
                    <h4 class="product-title">${item.name}</h4>
                    <p class="product-price">${item.price} ₽</p>
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-name="${item.name}">-</button>
                        <input type="number" class="qty-input" data-name="${item.name}" value="0" min="0" readonly>
                        <button class="qty-btn plus" data-name="${item.name}">+</button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(productCard);
        });
    });

    // Навешиваем обработчики событий на новые кнопки управления количеством
    setupQuantityControls();
}

// Вынесем логику кнопок плюс/минус в отдельную функцию, чтобы вызывать её после перерисовки
function setupQuantityControls() {
    document.querySelectorAll('.qty-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const input = document.querySelector(`.qty-input[data-name="${name}"]`);
            input.value = parseInt(input.value) + 1;
            updateCartDisplay();
        });
    });

    document.querySelectorAll('.qty-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const input = document.querySelector(`.qty-input[data-name="${name}"]`);
            if (parseInt(input.value) > 0) {
                input.value = parseInt(input.value) - 1;
                updateCartDisplay();
            }
        });
    });
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
        const quantityInputs = document.querySelectorAll('.qty-input');
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
            document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
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
