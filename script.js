const basePath = document.body.dataset.base;
let user = null;
let csrfToken = '';
let menuItems = [];
const params = new URLSearchParams(location.search);

function find(selector) {
    return document.querySelector(selector);
}

function addLink(container, text, path) {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = basePath + path;
    container.append(link);
    return link;
}

function addOption(select, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    select.append(option);
}

async function api(url, formData) {
    const options = { credentials: 'same-origin' };

    if (formData) {
        formData.set('csrf_token', csrfToken);
        options.method = 'POST';
        options.body = formData;
    }

    let response;
    try {
        response = await fetch(basePath + '/api' + url, options);
    } catch (error) {
        throw new Error('Սերվերի հետ կապ չկա։ Ստուգիր սերվերը։');
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error('Սերվերը JSON պատասխան չի վերադարձրել։ Ստուգիր PHP-ի կարգավորումները։');
    }

    if (!response.ok) {
        throw new Error(data.error || 'Գործողությունը չհաջողվեց։');
    }

    return data;
}

function showError(container, text) {
    const message = document.createElement('p');
    message.className = 'notice error';
    message.setAttribute('role', 'alert');
    message.textContent = text;
    container.append(message);
}


async function logoutUser() {
    try {
        await api('/logout', new FormData());
        location.href = basePath + '/';
    } catch (error) {
        showError(find('#header'), error.message);
    }
}


function showNav() {
    const header = find('#header');
    header.innerHTML = '<nav id="nav"></nav>';
    const brand = addLink(header, 'INTERSHIP', '/');
    brand.className = 'brand';
    header.prepend(brand);
    const nav = find('#nav');
    addLink(nav, 'Ապրանքներ', '/');

    if (!user) {
        addLink(nav, 'Մուտք', '/login');
        addLink(nav, 'Գրանցում', '/register');
        return;
    }

    addLink(nav, 'Ավելացնել ապրանք', '/add');
    if (user.status === 'admin') {
        addLink(nav, 'Ադմին', '/admin');
    }

    const name = document.createElement('span');
    name.className = 'muted';
    name.textContent = user.full_name;
    nav.append(name);

    const logout = document.createElement('button');
    logout.type = 'button';
    logout.textContent = 'Ելք';
    logout.onclick = logoutUser;
    nav.append(logout);
}


async function showMenu() {
    const data = await api('/menu');
    const container = find('#menu');
    container.innerHTML = '<h2>Բաժիններ</h2>';

    if (data.items.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Մենյուն դեռ դատարկ է։';
        container.append(empty);
    }

    const hasAll = data.items.some(item => Number(item.parent_id) === 0 && item.title.trim() === 'Բոլորը');
    if (!hasAll) {
        addLink(container, 'Բոլորը', '/').className = 'menu-link';
    }
    menuLevel(data.items, 0, container);
}

function menuLevel(items, parentId, container) {
    for (const item of items) {
        if (Number(item.parent_id) !== Number(parentId)) {
            continue;
        }

        const row = document.createElement('div');
        row.className = 'menu-item';
        container.append(row);
        const path = item.title.trim() === 'Բոլորը' ? '/' : '/?category_id=' + item.id;
        const link = addLink(row, item.title, path);
        link.className = 'menu-link';

        const children = document.createElement('div');
        children.className = 'children';
        children.id = 'children-' + item.id;
        menuLevel(items, item.id, children);

        if (children.childElementCount === 0) {
            continue;
        }

        children.hidden = true;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'menu-button';
        button.textContent = '▸';
        button.setAttribute('aria-label', item.title + '՝ ենթաբաժիններ');
        button.setAttribute('aria-controls', children.id);
        button.setAttribute('aria-expanded', 'false');
        button.onclick = function() {
            children.hidden = !children.hidden;
            button.textContent = children.hidden ? '▸' : '▾';
            button.setAttribute('aria-expanded', String(!children.hidden));
        };
        row.append(button, children);
    }
}


async function deleteProduct(id, button, detailsPage) {
    if (!confirm('Ջնջե՞լ ապրանքը։')) {
        return;
    }

    button.disabled = true;
    const formData = new FormData();
    formData.set('id', id);

    try {
        await api('/delete', formData);
        if (detailsPage) {
            location.href = basePath + '/';
        } else {
            await allProducts();
        }
    } catch (error) {
        showError(find('#main'), error.message);
        button.disabled = false;
    }
}


async function allProducts() {
    const main = find('#main');
    main.innerHTML = '<h1>Ապրանքների ցանկ</h1><div class="grid" id="products"></div>';
    const container = find('#products');
    const category = params.get('category_id');
    const query = category === null ? '' : '?category_id=' + encodeURIComponent(category);
    const data = await api('/products' + query);

    if (data.products.length === 0) {
        container.textContent = 'Ապրանքներ դեռ չկան։';
    }

    for (const product of data.products) {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <h2></h2>
            <p class="summary"></p>
            <p class="price"></p>
            <p class="stock"></p>
            <p class="category"></p>
            <div class="actions"><a class="show">Դիտել ապրանքը</a></div>
        `;
        card.querySelector('h2').textContent = product.name;
        card.querySelector('.summary').textContent = product.description;
        card.querySelector('.price').textContent = product.price + ' ֏';
        card.querySelector('.stock').textContent = 'Քանակ ' + product.stock;
        card.querySelector('.category').textContent = 'Կատեգորիա՝ ' + (product.category_name || 'Չնշված');
        card.querySelector('.show').href = basePath + '/show?id=' + product.id + (category === null ? '' : '&category_id=' + encodeURIComponent(category));
        const actions = card.querySelector('.actions');

        productActions(actions, product, false);
        container.append(card);
    }
}


async function showProduct(id) {
    const data = await api('/product?id=' + encodeURIComponent(id || ''));
    const product = data.product;
    const main = find('#main');
    main.innerHTML = `
        <h1></h1>
        <p class="description"></p>
        <p class="price"></p>
        <p id="stock"></p>
        <p id="category"></p>
        <p class="muted" id="author"></p>
        <p class="muted" id="created"></p>
        <p class="muted" id="updated"></p>
        <div class="actions"><a id="back">Վերադառնալ</a></div>
    `;
    main.querySelector('h1').textContent = product.name;
    main.querySelector('.description').textContent = product.description;
    main.querySelector('.price').textContent = product.price + ' ֏';
    find('#stock').textContent = 'Քանակ ' + product.stock;
    find('#created').textContent = 'Ստեղծված՝ ' + product.created_at;
    find('#author').textContent = 'Հեղինակ՝ ' + (product.author_name || 'Անհայտ');
    find('#updated').hidden = !product.updated_at;
    if (product.updated_at) {
        find('#updated').textContent = 'Փոփոխված՝ ' + product.updated_at;
    }
    find('#category').textContent = 'Կատեգորիա՝ ' + (product.category_name || 'Չնշված');
    const category = params.get('category_id');
    find('#back').href = basePath + '/' + (category === null ? '' : '?category_id=' + encodeURIComponent(category));

    productActions(main.querySelector('.actions'), product, true);
}


async function productForm(id) {
    const main = find('#main');
    if (!user) {
        showError(main, 'Նախ մուտք գործիր։');
        return;
    }

    main.innerHTML = `
        <h1 id="title">Ավելացնել ապրանք</h1>
        <form class="form" id="product-form">
            <label>Անվանում
                <input name="name" maxlength="240" required>
            </label>
            <label>Նկարագրություն
                <textarea name="description" maxlength="10000" required></textarea>
            </label>
            <label>Կատեգորիա
                <select name="category_id" required><option value="">Ընտրիր կատեգորիան</option></select>
            </label>
            <label>Գին (դրամ)
                <input name="price" type="number" min="0" max="99999999.99" step="0.01" required>
            </label>
            <label>Քանակ
                <input name="stock" type="number" min="0" max="9999999" step="1" value="0" required>
            </label>
            <div id="form-message" aria-live="polite"></div>
            <button type="submit" class="primary" disabled>Պահպանել</button>
        </form>
    `;
    const form = find('#product-form');
    const output = find('#form-message');
    const button = form.querySelector('button');

    form.onsubmit = function(event) {
        event.preventDefault();
    };

    const categories = await api('/menu');
    for (const category of categories.items) {
        addOption(form.elements.category_id, category.id, '#' + category.id + ' · ' + category.title);
    }
    if (categories.items.length === 0) {
        showError(output, 'Կատեգորիաներ դեռ չկան։ Խնդրիր ադմինին մենյուում կատեգորիա ստեղծել։');
        button.disabled = true;
        return;
    }

    if (id) {
        find('#title').textContent = 'Խմբագրել ապրանքը';
        const data = await api('/product?id=' + encodeURIComponent(id));
        if (!canManageProduct(data.product)) {
            main.textContent = '';
            showError(main, 'Կարող ես խմբագրել միայն քո ապրանքները։');
            return;
        }
        form.elements.name.value = data.product.name;
        form.elements.description.value = data.product.description;
        form.elements.price.value = data.product.price;
        form.elements.stock.value = data.product.stock;
        form.elements.category_id.value = data.product.category_id || '';
    }

    button.disabled = false;

    form.onsubmit = async function(event) {
        event.preventDefault();
        if (button.disabled) return;
        output.textContent = '';

        const name = form.elements.name.value.trim();
        const description = form.elements.description.value.trim();
        if (name === '' || new TextEncoder().encode(name).length > 240) {
            showError(output, 'Անվանումը պարտադիր է, մինչև 240 բայթ։');
            return;
        }
        if (description === '' || new TextEncoder().encode(description).length > 10000) {
            showError(output, 'Նկարագրությունը պարտադիր է, մինչև 10000 բայթ։');
            return;
        }
        if (!form.reportValidity()) return;

        const price = form.elements.price.value;
        const priceParts = price.split('.');
        if (price.toLowerCase().includes('e') || price.includes('+') || price.includes('-')
            || priceParts[0].length > 8 || (priceParts[1] && priceParts[1].length > 2)) {
            showError(output, 'Գինը՝ 0–99999999.99, մինչև 2 տասնորդական թվանշան։');
            return;
        }
        const stock = Number(form.elements.stock.value);
        if (!Number.isInteger(stock) || stock < 0 || stock > 9999999) {
            showError(output, 'Քանակը պետք է լինի ամբողջ թիվ՝ 0–9999999։');
            return;
        }

        button.disabled = true;
        const formData = new FormData(form);
        formData.set('name', name);
        formData.set('description', description);
        formData.set('stock', String(stock));
        let url = '/add';
        if (id) {
            url = '/edit';
            formData.set('id', id);
        }

        try {
            const data = await api(url, formData);
            location.href = basePath + '/show?id=' + (id || data.id);
        } catch (error) {
            showError(output, error.message);
        } finally {
            button.disabled = false;
        }
    };
}


function canManageProduct(product) {
    return user && (user.status === 'admin' || Number(product.user_id) === Number(user.id));
}

function productActions(container, product, detailsPage) {
    if (!canManageProduct(product)) {
        return;
    }

    const id = product.id;
    addLink(container, 'Խմբագրել', '/edit?id=' + id);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'danger';
    remove.textContent = 'Ջնջել';
    remove.onclick = function() {
        deleteProduct(id, remove, detailsPage);
    };
    container.append(remove);
}

function authForm(register) {
    const main = find('#main');
    let title = 'Մուտք';
    if (register) {
        title = 'Գրանցում';
    }

    main.innerHTML = '<h1></h1><form class="form" id="auth-form"></form>';
    main.querySelector('h1').textContent = title;
    const form = find('#auth-form');

    if (register) {
        form.innerHTML = `
            <label>Անուն ազգանուն
                <input name="full_name" minlength="2" maxlength="150" autocomplete="name" required>
            </label>
        `;
    }

    form.innerHTML += `
        <label>Email
            <input name="email" type="email" maxlength="190" autocomplete="username" required>
        </label>
        <label>Գաղտնաբառ
            <input name="password" type="password" autocomplete="current-password" required>
        </label>
    `;

    if (register) {
        form.innerHTML += `
            <label>Կրկնել գաղտնաբառը
                <input name="password2" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
            </label>
        `;
    }

    form.innerHTML += `
        <div id="form-message" aria-live="polite"></div>
        <button type="submit" class="primary"></button>
    `;
    const output = find('#form-message');
    const button = form.querySelector('button');
    button.textContent = title;
    if (register) {
        form.elements.password.minLength = 8;
        form.elements.password.maxLength = 72;
        form.elements.password.autocomplete = 'new-password';
    }

    form.onsubmit = async function(event) {
        event.preventDefault();
        output.textContent = '';
        if (button.disabled) return;
        if (register) {
            const name = form.elements.full_name.value.trim();
            const length = new TextEncoder().encode(name).length;
            if (length < 2 || length > 150) {
                showError(output, 'Անվան երկարությունը՝ 2–150 բայթ։');
                return;
            }
            form.elements.full_name.value = name;
        }
        if (register && form.elements.password.value !== form.elements.password2.value) {
            showError(output, 'Գաղտնաբառերը տարբեր են։');
            return;
        }

        button.disabled = true;
        let url = '/login';
        if (register) {
            url = '/register';
        }
        try {
            const data = await api(url, new FormData(form));
            if (register) {
                form.reset();
                const message = document.createElement('p');
                message.className = 'notice';
                message.textContent = data.message;
                output.append(message);
                addLink(output, 'Անցնել մուտքի էջ', '/login');
            } else {
                location.href = basePath + '/';
            }
        } catch (error) {
            showError(output, error.message);
        } finally {
            button.disabled = false;
        }
    };
}


async function adminPage() {
    const main = find('#main');
    if (!user || user.status !== 'admin') {
        showError(main, 'Այս էջը միայն ադմինի համար է։');
        return;
    }

    const data = await api('/menu');
    menuItems = data.items;
    main.innerHTML = `
        <h1>Մենյուի կառավարում</h1>
        <p>Ընտրիր ծնողը և հերթականությունը։ Փոքր թիվը ցուցադրվում է առաջինը։</p>
        <section class="card" id="menu-editor"></section>
        <div class="admin-list" id="menu-list"></div>
    `;
    menuForm(null, 0);
    const list = find('#menu-list');

    for (const item of menuItems) {
        const row = document.createElement('article');
        row.className = 'admin-row';
        row.innerHTML = `
            <div><strong></strong><p class="muted"></p></div>
            <div class="actions">
                <button type="button" class="add-child">Ենթամենյու +</button>
                <button type="button" class="edit-menu">Խմբագրել</button>
                <button type="button" class="danger">Ջնջել</button>
            </div>
        `;
        row.querySelector('strong').textContent = '#' + item.id + ' · ' + item.title;
        row.querySelector('p').textContent = 'Ծնող՝ ' + (item.parent_id || 'չկա') + ' / Հերթ՝ ' + item.sort_order;
        row.querySelector('.add-child').onclick = function() {
            menuForm(null, item.id);
            find('#menu-editor').scrollIntoView();
        };
        row.querySelector('.edit-menu').onclick = function() {
            menuForm(item, item.parent_id || 0);
            find('#menu-editor').scrollIntoView();
        };
        const remove = row.querySelector('.danger');
        remove.onclick = async function() {
            if (!confirm('Ջնջե՞լ տարրը։ Ենթատարրերը կտեղափոխվեն մեկ մակարդակ վերև։')) {
                return;
            }
            remove.disabled = true;
            const formData = new FormData();
            formData.set('id', item.id);
            try {
                await api('/menu/delete', formData);
                await showMenu();
                await adminPage();
            } catch (error) {
                showError(row, error.message);
                remove.disabled = false;
            }
        };
        list.append(row);
    }
}

function menuForm(item, parentId) {
    const editor = find('#menu-editor');
    editor.innerHTML = `
        <h2 id="editor-title">Նոր տարր</h2>
        <form class="form" id="menu-form">
            <label>Անվանում
                <input name="title" maxlength="240" required>
            </label>
            <label>Ծնող տարր
                <select name="parent_id"><option value="0">Առանց ծնողի</option></select>
            </label>
            <label>Հերթականություն
                <input name="sort_order" type="number" min="0" max="9999999" step="1" value="0" required>
            </label>
            <div id="menu-message" aria-live="polite"></div>
            <button type="submit" class="primary">Պահպանել</button>
            <button type="button" id="cancel">Չեղարկել</button>
        </form>
    `;
    const form = find('#menu-form');
    const output = find('#menu-message');
    const button = form.querySelector('[type="submit"]');

    for (const node of menuItems) {
        if (item && isDescendant(node.id, item.id)) {
            continue;
        }
        addOption(form.elements.parent_id, node.id, '#' + node.id + ' · ' + node.title);
    }
    form.elements.parent_id.value = parentId;

    if (item) {
        find('#editor-title').textContent = 'Խմբագրել #' + item.id;
        form.elements.title.value = item.title;
        form.elements.sort_order.value = item.sort_order;
    }
    find('#cancel').onclick = function() {
        menuForm(null, 0);
    };

    form.onsubmit = async function(event) {
        event.preventDefault();
        output.textContent = '';
        button.disabled = true;
        const formData = new FormData(form);
        let url = '/menu/add';
        if (item) {
            url = '/menu/edit';
            formData.set('id', item.id);
        }

        try {
            await api(url, formData);
            await showMenu();
            await adminPage();
            const message = document.createElement('p');
            message.className = 'notice';
            message.textContent = 'Մենյուն պահպանված է։';
            find('#menu-message').append(message);
        } catch (error) {
            showError(output, error.message);
        } finally {
            button.disabled = false;
        }
    };
}

function isDescendant(id, parentId) {
    while (Number(id) !== 0) {
        if (Number(id) === Number(parentId)) {
            return true;
        }
        let nextId = 0;
        for (const node of menuItems) {
            if (Number(node.id) === Number(id)) {
                nextId = node.parent_id;
                break;
            }
        }
        id = nextId;
    }
    return false;
}

async function start() {
    document.body.innerHTML = `
        <header class="header" id="header"></header>
        <div class="layout">
            <aside class="sidebar" id="menu"></aside>
            <main id="main"></main>
        </div>
    `;

    const main = find('#main');

    try {
        const data = await api('/session');
        user = data.user;
        csrfToken = data.csrf_token;

        showNav();
        await showMenu();

        let url = location.pathname;
        if (basePath !== '' && (url === basePath || url.startsWith(basePath + '/'))) {
            url = url.slice(basePath.length);
        }
        const id = params.get('id');

        if (url === '' || url === '/') {
            await allProducts();
        } else if (url === '/show') {
            await showProduct(id);
        } else if (url === '/add') {
            await productForm(null);
        } else if (url === '/edit') {
            if (!id) {
                throw new Error('Նշիր ապրանքի ID-ն։');
            }
            await productForm(id);
        } else if (url === '/login') {
            authForm(false);
        } else if (url === '/register') {
            authForm(true);
        } else if (url === '/admin') {
            await adminPage();
        } else {
            main.textContent = '404 - Page not found';
        }
    } catch (error) {
        showError(main, error.message);
    }
}

start();
