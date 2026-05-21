:root {
    --bg-color: #f7f8fa;
    --card-bg: #ffffff;
    --text-main: #333333;
    --text-muted: #777777;
    --primary-color: #28a745;
    --primary-hover: #218838;
    --border-color: #eaeaea;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-main);
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.main-header {
    margin-bottom: 30px;
}

.main-header h1 {
    font-size: 2.2rem;
    margin-bottom: 5px;
}

.main-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin: 0;
}

/* Двухколоночный макет */
.content-wrapper {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.menu-section {
    flex: 2;
}

.sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: sticky;
    top: 20px;
}

h2 {
    font-size: 1.6rem;
    margin-top: 0;
    margin-bottom: 20px;
}

h3 {
    font-size: 1.2rem;
    color: var(--text-muted);
    margin-bottom: 15px;
}

.category {
    margin-bottom: 35px;
}

/* Сетка карточек меню */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.item-card {
    background: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
}

.item-card:hover {
    transform: translateY(-2px);
}

.item-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    background-color: #eee;
}

.item-info {
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
}

.item-name {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 15px;
    line-height: 1.3;
}

.item-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.item-price {
    font-weight: bold;
    font-size: 1.1rem;
}

/* Стилизация кнопок Плюс/Минус */
.quantity-controls {
    display: flex;
    align-items: center;
    background: #f1f3f5;
    border-radius: 20px;
    padding: 2px;
}

.qty-btn {
    background: none;
    border: none;
    width: 28px;
    height: 28px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #495057;
    transition: background 0.2s;
    border-radius: 50%;
}

.qty-btn:hover {
    background: #e9ecef;
}

.item-quantity {
    width: 30px;
    border: none;
    background: transparent;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
    -moz-appearance: textfield;
}

.item-quantity::-webkit-outer-spin-button,
.item-quantity::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Боковые панели */
.sticky-panel {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.05);
}

.empty-text {
    font-style: italic;
    color: var(--text-muted);
}

.cart-item-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.95rem;
}

.cart-summary {
    margin-top: 20px;
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: var(--text-muted);
}

.summary-row.total {
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--text-main);
    margin-top: 10px;
}

/* Форма заказа */
.order-box label {
    display: block;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 5px;
    margin-top: 15px;
}

#customer-name, #customer-phone {
    width: 100%;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 1rem;
    background: #fdfdfd;
}

#customer-name:focus, #customer-phone:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

#submit-order {
    background-color: var(--primary-color);
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    width: 100%;
    margin-top: 20px;
    transition: background-color 0.2s;
}

#submit-order:hover {
    background-color: var(--primary-hover);
}

#order-status {
    margin-top: 15px;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 0.95rem;
}

.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Адаптивность для мобилок */
@media (max-width: 768px) {
    .content-wrapper {
        flex-direction: column;
    }
    .sidebar {
        position: static;
        width: 100%;
    }
}
