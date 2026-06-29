document.addEventListener('DOMContentLoaded', function() {

    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const submitButton = document.getElementById('submit-order');
    const customerName = document.getElementById('customer-name');
    const customerPhone = document.getElementById('customer-phone');
    const orderStatus = document.getElementById('order-status');

    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWSCH4DF03dr5KHbK9OHUfQi5D5fbtuejMMl9Rvr9Ri7Ee_A/formResponse';
    const FIELD_IDS = {
        name: 'entry.1598896576',
        phone: 'entry.967339619',
        order: 'entry.2085750648',
        total: 'entry.271726782'
    };
    const CLIENT_ID = "721070299233-d7jimru41hrc0ghs1nn6p38d4p3jjogn.apps.googleusercontent.com";

    // --- МЕНЮ ПО КАТЕГОРИЯМ (цены из актуального меню) ---
    const MENU_CATEGORIES = [
        {
            name: "Завтраки",
            items: [
                { name: "Блины домашние", price: 40, image: "images/blini.jpg" },
                { name: "Блины постные с джемом", price: 40, image: "images/blini_postnie_s_dzhemom.jpg" },
                { name: "Блины с капустой", price: 55, image: "images/blini_s_kapustoy.jpg" },
                { name: "Драники картофельные", price: 69, image: "images/draniki_kartofelnie.jpg" },
                { name: "Запеканка творожная", price: 74, image: "images/zapekanka_tvorozhnaya.jpg" },
                { name: "Каша молочная овсяная с маслом", price: 49, image: "images/kasha_s_maslom.jpg" },
                { name: "Омлет натуральный паровой", price: 64, image: "images/omlet_parovoy.jpg" },
                { name: "Рулет морковный с курагой", price: 65, image: "images/rulet_morkovny_s_kuragoy.jpg" },
                { name: "Сырники творожные", price: 65, image: "images/syrniki_tvorozhnye.jpg" }
            ]
        },
        {
            name: "Закуски",
            items: [
                { name: "Ассорти фруктовое", price: 115, image: "images/assorti_fruktovoe.jpg" },
                { name: "Рулет куриный с овощами", price: 118, image: "images/rulet_kuriny.jpg" }
            ]
        },
        {
            name: "Салаты",
            items: [
                { name: "Винегрет с кв. капустой и з. горошком", price: 47, image: "images/vinegret.jpg" },
                { name: "Салат «Коктейль» овощной", price: 80, image: "images/salat_kokteyl.jpg" },
                { name: "Салат «Маскарад» с кр/палочками/ветчиной", price: 81, image: "images/maskarad.jpg" },
                { name: "Сельдь под шубой", price: 78, image: "images/seld_pod_shuboy.jpg" },
                { name: "Фреш-ролл с бужениной", price: 92, image: "images/fresh_s_buzheninoy.jpg" },
                { name: "Салат из св. капусты с сельдереем", price: 41, image: "images/salat_iz_svezhey_kapusty.jpg" },
                { name: "Салат из свеклы с конс. огурцом", price: 52, image: "images/salat_iz_svekly.jpg" },
                { name: "Салат из тыквы/яблок/сметаны", price: 42, image: "images/salat_iz_tykvy.jpg" }
            ]
        },
        {
            name: "Первые блюда",
            items: [
                { name: "Суп куриный с мак. изделиями", price: 71, image: "images/sup_kuriny.jpg" },
                { name: "Суп-пюре сырный с гренками", price: 79, image: "images/sup_syrny.jpg" },
                { name: "Щи постные по-Уральски", price: 75, image: "images/shi_po_uralski.jpg" }
            ]
        },
        {
            name: "Рыбные блюда",
            items: [
                { name: "Камбала жареная", price: 106, image: "images/kambala.jpg" },
                { name: "Колбаски рыбные жареные", price: 129, image: "images/kolbaski_rybnye.jpg" },
                { name: "Филе горбуши с польским соусом", price: 139, image: "images/file_gorbushi.jpg" }
            ]
        },
        {
            name: "Мясные блюда",
            items: [
                { name: "Зажарка овощная с куриной мякотью", price: 198, image: "images/kurica_s_ovoshami.jpg" },
                { name: "Биточки по-селянски", price: 131, image: "images/bitochki_poselyanski.jpg" },
                { name: "Запеканка из печени с рисом", price: 95, image: "images/zapekanka_iz_pecheni.jpg" },
                { name: "Котлета куриная Пожарская", price: 115, image: "images/kotleti_pozharskie.jpg" },
                { name: "Манты с мясом и картофелем", price: 150, image: "images/manty.jpg" },
                { name: "Окорочка фаршированные грибами", price: 173, image: "images/okorochka_farshirovannye.jpg" },
                { name: "Пельмени мясные", price: 144, image: "images/pelmeni.jpg" },
                { name: "Сарделька отварная", price: 97, image: "images/sardelka.jpg" },
                { name: "Свинина в белой панировке", price: 139, image: "images/svinina.jpg" },
                { name: "Филе куры в белой панировке", price: 119, image: "images/file.jpg" },
                { name: "Филе куры в сырной корочке", price: 132, image: "images/file_kurinoe_v_syrnoy.jpg" },
                { name: "Филе куры по-французски с грибами", price: 132, image: "images/kura_po_francuzski.jpg" },
                { name: "Фрикадельки мясные в соусе", price: 105, image: "images/frikadelki.jpg" },
                { name: "Шницель Полесский", price: 105, image: "images/shnicel_polesskiy.jpg" },
                { name: "Эскалоп из свинины", price: 147, image: "images/eskalop.jpg" }
            ]
        },
        {
            name: "Гарниры",
            items: [
                { name: "Гречневая лапша с овощами", price: 82, image: "images/grechnevaya_lapsha.jpg" },
                { name: "Пюре картофельное", price: 55, image: "images/pyure.jpg" },
                { name: "Рис отварной", price: 45, image: "images/ris.jpg" },
                { name: "Цветная капуста с фасолью/морковью", price: 74, image: "images/cvetnaya_kapusta_s_fasolyu.jpg" }
            ]
        }
    ];

    // --- ОТРИСОВКА МЕНЮ ПО КАТЕГОРИЯМ ---
    function renderMenu() {
        const menuSection = document.getElementById('menu-section');
        if (!menuSection) return;

        // Удаляем всё кроме заголовка h2
        Array.from(menuSection.children).forEach(child => {
            if (child.tagName !== 'H2') child.remove();
        });

        MENU_CATEGORIES.forEach(category => {
            const section = document.createElement('section');
            section.className = 'category';

            const heading = document.createElement('h3');
            heading.textContent = category.name;
            section.appendChild(heading);

            const grid = document.createElement('div');
            grid.className = 'products-grid';

            category.items.forEach(item => {
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
                grid.appendChild(card);
            });

            section.appendChild(grid);
            menuSection.appendChild(section);
        });

        setupQuantityControls();
    }

    function setupQuantityControls() {
        document.querySelectorAll('.quantity-controls').forEach(control => {
            const minusBtn = control.querySelector('.minus');
            const plusBtn = control.querySelector('.plus');
            const input = control.querySelector('.item-quantity');

            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', () => {
                    let v = parseInt(input.value) || 0;
                    if (v > 0) { input.value = v - 1; updateCartDisplay(); }
                });
                plusBtn.addEventListener('click', () => {
                    input.value = (parseInt(input.value) || 0) + 1;
                    updateCartDisplay();
                });
                input.addEventListener('input', () => {
                    if (isNaN(parseInt(input.value)) || parseInt(input.value) < 0) input.value = 0;
                    updateCartDisplay();
                });
            }
        });
    }

    renderMenu();


    // --- Google Авторизация ---
    function handleCredentialResponse(response) {
        const payload = parseJwt(response.credential);
        if (customerName) customerName.value = `${payload.name} (${payload.email})`;
        const overlay = document.getElementById('auth-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    function parseJwt(token) {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')));
    }

    function initGoogleAuth() {
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredentialResponse });
            google.accounts.id.renderButton(document.getElementById("google-btn"), { theme: "outline", size: "large", width: 280 });
        } else {
            setTimeout(initGoogleAuth, 100);
        }
    }
    initGoogleAuth();


    // --- Корзина ---
    function updateCartDisplay() {
        const inputs = document.querySelectorAll('.item-quantity');
        let cartHtml = '';
        let total = 0;
        let hasItems = false;

        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                hasItems = true;
                const price = parseInt(input.dataset.price) || 0;
                const itemTotal = price * qty;
                total += itemTotal;
                cartHtml += `<div class="cart-item-row"><span>${input.dataset.name} (x${qty})</span><span>${itemTotal} ₽</span></div>`;
            }
        });

        cartItemsDiv.innerHTML = hasItems ? cartHtml : '<p class="empty-text">Корзина пуста</p>';
        totalPriceSpan.textContent = `${total} ₽`;
    }


    // --- Отправка заказа ---
    async function submitOrder() {
        const inputs = document.querySelectorAll('.item-quantity');
        let orderItems = [];
        let total = 0;

        inputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                orderItems.push(`${input.dataset.name} (x${qty})`);
                total += (parseInt(input.dataset.price) || 0) * qty;
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

        const formData = new URLSearchParams();
        formData.append(FIELD_IDS.name, customerName.value.trim());
        formData.append(FIELD_IDS.phone, customerPhone.value.trim());
        formData.append(FIELD_IDS.order, orderItems.join(', '));
        formData.append(FIELD_IDS.total, `${total} ₽`);

        try {
            await fetch(`${GOOGLE_FORM_URL}?${formData.toString()}`, { method: 'GET', mode: 'no-cors' });

            orderStatus.textContent = '✅ Заказ успешно отправлен! Ожидайте выдачи.';
            orderStatus.className = 'success';

            inputs.forEach(input => input.value = 0);
            customerPhone.value = '';
            updateCartDisplay();

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

    submitButton.addEventListener('click', submitOrder);
    updateCartDisplay();
});
