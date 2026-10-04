// Հայերեն բնագիրը և անգլերեն թարգմանությունը մեկ բառարանում են։
const translations = {
    "Քաշիր այստեղից": "Drag from here",
    "Քաշիր ապրանքը դեպի ձախ կողմի կատեգորիան։": "Drag the product onto a category on the left.",
    "Տեղափոխումը պահպանված է։": "Move saved.",
    "Պահպանվում է…": "Saving…",
    "Կարող ես տեղափոխել միայն քո ապրանքները։": "You can only move your own products.",
    "Սխալ տեղափոխում։": "Invalid move.",
    "Առաջ": "Before",
    "Ներս": "Inside",
    "Հետո": "After",
    "Տեղափոխել հիմնական մակարդակ": "Move to the top level",
    "Քաշիր տարրը «Առաջ», «Ներս» կամ «Հետո» դաշտի վրա։": "Drag an item onto Before, Inside or After.",
    "Նույն տեղում տեղափոխում չի պահանջվում։": "The item is already there.",
    "Ավարտիր ընթացիկ տեղափոխումը։": "Wait for the current move to finish.",

    "Ապրանքներ": "Products",
    "Մուտք": "Log in",
    "Գրանցում": "Register",
    "Ավելացնել ապրանք": "Add product",
    "Ադմին": "Admin",
    "Ելք": "Log out",
    "Բաժիններ": "Categories",
    "Բոլորը": "All",
    "Էլեկտրոնիկա": "Electronics",
    "Հեռախոսներ": "Phones",
    "Համակարգիչներ": "Computers",
    "Մենյուն դեռ դատարկ է։": "The menu is empty.",
    "՝ ենթաբաժիններ": ": subcategories",
    "Ջնջե՞լ ապրանքը։": "Delete this product?",
    "Ապրանքների ցանկ": "Product list",
    "Ապրանքներ դեռ չկան։": "No products yet.",
    "Ապրանքներ դեռ չկան": "No products yet.",
    "Դիտել ապրանքը": "View product",
    "Քանակ ": "Quantity: ",
    "Կատեգորիա՝ ": "Category: ",
    "Չնշված": "Not specified",
    "Վերադառնալ": "Back",
    "Ստեղծված՝ ": "Created: ",
    "Հեղինակ՝ ": "Author: ",
    "Անհայտ": "Unknown",
    "Փոփոխված՝ ": "Modified: ",
    "Նախ մուտք գործիր։": "Please log in first.",
    "Անվանում": "Name",
    "Նկարագրություն": "Description",
    "Կատեգորիա": "Category",
    "Ընտրիր կատեգորիան": "Choose a category",
    "Գին (դրամ)": "Price (AMD)",
    "Քանակ": "Quantity",
    "Պահպանել": "Save",
    "Կատեգորիաներ դեռ չկան։ Խնդրիր ադմինին մենյուում կատեգորիա ստեղծել։": "No categories yet. Ask an admin to create a menu category.",
    "Խմբագրել ապրանքը": "Edit product",
    "Կարող ես խմբագրել միայն քո ապրանքները։": "You can only edit your own products.",
    "Անվանումը պարտադիր է, մինչև 240 բայթ։": "Name is required, up to 240 bytes.",
    "Նկարագրությունը պարտադիր է, մինչև 10000 բայթ։": "Description is required, up to 10000 bytes.",
    "Գինը՝ 0–99999999.99, մինչև 2 տասնորդական թվանշան։": "Price must be 0–99999999.99 with up to 2 decimal places.",
    "Քանակը պետք է լինի ամբողջ թիվ՝ 0–9999999։": "Quantity must be a whole number from 0 to 9999999.",
    "Խմբագրել": "Edit",
    "Ջնջել": "Delete",
    "Անուն ազգանուն": "Full name",
    "Գաղտնաբառ": "Password",
    "Կրկնել գաղտնաբառը": "Repeat password",
    "Անվան երկարությունը՝ 2–150 բայթ։": "Name must be 2–150 bytes long.",
    "Գաղտնաբառերը տարբեր են։": "Passwords do not match.",
    "Անցնել մուտքի էջ": "Go to login",
    "Այս էջը միայն ադմինի համար է։": "This page is for admins only.",
    "Մենյուի կառավարում": "Menu management",
    "Ընտրիր ծնողը և հերթականությունը։ Փոքր թիվը ցուցադրվում է առաջինը։": "Choose a parent and display order. Smaller numbers appear first.",
    "Ենթամենյու +": "Submenu +",
    "Ծնող՝ ": "Parent: ",
    "չկա": "none",
    " / Հերթ՝ ": " / Order: ",
    "Ջնջե՞լ տարրը։ Ենթատարրերը կտեղափոխվեն մեկ մակարդակ վերև։": "Delete this item? Its children will move up one level.",
    "Նոր տարր": "New item",
    "Ծնող տարր": "Parent item",
    "Առանց ծնողի": "No parent",
    "Հերթականություն": "Display order",
    "Չեղարկել": "Cancel",
    "Խմբագրել #": "Edit #",
    "Մենյուն պահպանված է։": "Menu saved.",
    "Նշիր ապրանքի ID-ն։": "Specify the product ID.",
    "Սերվերի հետ կապ չկա։ Ստուգիր սերվերը։": "Cannot connect to the server. Check the server.",
    "Սերվերը JSON պատասխան չի վերադարձրել։ Ստուգիր PHP-ի կարգավորումները։": "The server did not return JSON. Check the PHP settings.",
    "Գործողությունը չհաջողվեց։": "The operation failed.",
    "Տվյալների մշակման սխալ։ Կրկին փորձիր։": "Data processing failed. Please try again.",
    "Չթույլատրված մեթոդ։": "Method not allowed.",
    "Սխալ տվյալներ։": "Invalid data.",
    "Անվտանգության token-ը հնացել է։ Թարմացրու էջը։": "Your security token has expired. Refresh the page.",
    "API հասցեն չի գտնվել։": "API endpoint not found.",
    "Բազայի կապը չհաջողվեց։": "Database connection failed.",
    "Սխալ ID։": "Invalid ID.",
    "Սխալ կատեգորիա։": "Invalid category.",
    "Ապրանքը չի գտնվել։": "Product not found.",
    "Ապրանքի ստուգումը չհաջողվեց։": "Could not check the product.",
    "Կարող ես փոփոխել կամ ջնջել միայն քո ապրանքները։": "You can only edit or delete your own products.",
    "Ընտրիր ապրանքի կատեգորիան։": "Choose a product category.",
    "Կատեգորիայի ստուգումը չհաջողվեց։": "Could not check the category.",
    "Կատեգորիան չի գտնվել։ Ընտրիր գործող կատեգորիա։": "Category not found. Choose an existing category.",
    "նշեք քանակը։": "Enter a quantity greater than zero.",
    "Ապրանքն ավելացված է։": "Product added.",
    "Փոփոխությունները պահպանված են։": "Changes saved.",
    "Ապրանքը ջնջված է։": "Product deleted.",
    "Այս գործողությունը միայն ադմինի համար է։": "This action is for admins only.",
    "Օգտատերը չի գտնվել։": "User not found.",
    "Գրիր ճիշտ email։": "Enter a valid email address.",
    "Գաղտնաբառը՝ 8–72 բայթ։": "Password must be 8–72 bytes long.",
    "Այս email-ն արդեն գրանցված է։": "This email is already registered.",
    "Այս անունը կամ email-ն արդեն օգտագործվում է։": "This name or email is already in use.",
    "Այս անունն արդեն օգտագործվում է։ Ընտրիր այլ անուն։": "This name is already in use. Choose another name.",
    "Անվան ստուգումը չհաջողվեց։": "Could not check the name.",
    "Գրանցումն ավարտված է։ Կարող ես մուտք գործել։": "Registration complete. You can now log in.",
    "Սխալ email կամ գաղտնաբառ։": "Incorrect email or password.",
    "Մուտքը հաջողվեց։": "Logged in successfully.",
    "Դուրս եկար։": "Logged out.",
    "Մենյուի անվանումը պարտադիր է, մինչև 240 բայթ։": "Menu name is required, up to 240 bytes.",
    "Մենյուի տարրը չի գտնվել։": "Menu item not found.",
    "Մենյուն ավելացված է։": "Menu item added.",
    "Մենյուն փոփոխված է։": "Menu item updated.",
    "Ծնողը և հերթականությունը պետք է ճիշտ թվեր լինեն։": "Parent and order must be valid numbers.",
    "Ծնող տարրը չի գտնվել։": "Parent item not found.",
    "Ինքն իրեն կամ սեփական ենթամենյուն ծնող ընտրել չի կարելի։": "An item or its descendant cannot be its own parent.",
    "Տարրը ջնջված է։ Ենթատարրերը տեղափոխված են մեկ մակարդակ վերև։": "Item deleted. Its children moved up one level.",
    "Laravel-ի բաղադրիչները տեղադրված չեն։ Նախագծի պանակում գործարկիր composer install։": "Laravel components are missing. Run composer install in the project folder.",
    "PHP սերվերը հասանելի չէ։ Միացրու PHP/Apache-ը։": "PHP server is unavailable. Start PHP/Apache.",
    "Նկար (ոչ պարտադիր)": "Image (optional)",
    "JPG, PNG կամ WebP, մինչև 2 ՄԲ։": "JPG, PNG or WebP, up to 2 MB.",
    "Հեռացնել նկարը": "Remove image",
    "Նոր նկար չընտրելու դեպքում հինը կմնա։": "Leave the file empty to keep the current image.",
    "Նկարի առավելագույն չափը 2 ՄԲ է։": "Maximum image size is 2 MB.",
    "Ընտրիր JPG, PNG կամ WebP նկար՝ մինչև 8000×8000 չափով։": "Choose a JPG, PNG or WebP image, up to 8000×8000 pixels.",
    "Նկարի վերբեռնումը չհաջողվեց։": "Image upload failed.",
    "Սխալ նկար։": "Invalid image.",
    "Նկարի նախադիտում": "Image preview"
};
let language = 'hy';
try { language = localStorage.getItem('intership-language') === 'en' ? 'en' : 'hy'; } catch (error) {}
document.documentElement.lang = language;
function t(text) {
    return language === 'en' ? (translations[text] || text) : text;
}

function showLanguageButtons(header) {
    const box = document.createElement('div');
    box.className = 'language-buttons';
    for (const code of ['hy', 'en']) {
        const button = document.createElement('button');
        button.type = 'button';
        // CSS flags also work on Windows systems without flag emoji support.
        button.innerHTML = '<span aria-hidden="true" class="flag flag-' + code + '"></span>';
        button.append(document.createTextNode(code === 'hy' ? 'Հայերեն' : 'English'));
        button.lang = code;
        button.setAttribute('aria-pressed', String(code === language));
        button.onclick = async function() {
            if (code === language) return;
            // Keep entered product/login data when changing language.
            const oldForm = document.querySelector('#product-form, #auth-form');
            const savedFields = oldForm ? Array.from(oldForm.elements).filter(el => el.name).map(el => ({
                name: el.name, value: el.value, checked: el.checked,
                files: el.type === 'file' ? el.files : null
            })) : [];
            box.querySelectorAll('button').forEach(el => el.disabled = true);
            try { localStorage.setItem('intership-language', code); } catch (error) {}
            language = code;
            document.documentElement.lang = code;
            // Re-render translated labels without changing the current address.
            await start();
            const newForm = document.querySelector('#product-form, #auth-form');
            if (newForm) {
                for (const field of savedFields) {
                    const input = newForm.elements.namedItem(field.name);
                    if (!input) continue;
                    if (field.files) input.files = field.files;
                    else input.value = field.value;
                    input.checked = field.checked;
                }
                if (newForm.elements.image && newForm.elements.image.onchange) newForm.elements.image.onchange();
            }
        };
        box.append(button);
    }
    header.append(box);
}

function showProductImage(container, product) {
    if (!Number(product.has_image)) return;
    const img = document.createElement('img');
    img.className = 'product-image';
    img.alt = product.name;
    img.loading = 'lazy';
    img.src = basePath + '/api/image?id=' + encodeURIComponent(product.id);
    img.onerror = function() { img.hidden = true; };
    container.prepend(img);
}

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
        throw new Error(t('Սերվերի հետ կապ չկա։ Ստուգիր սերվերը։'));
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error(t('Սերվերը JSON պատասխան չի վերադարձրել։ Ստուգիր PHP-ի կարգավորումները։'));
    }

    if (!response.ok) {
        throw new Error(data.error || t('Գործողությունը չհաջողվեց։'));
    }

    return data;
}

function showError(container, text) {
    const message = document.createElement('p');
    message.className = 'notice error';
    message.setAttribute('role', 'alert');
    message.textContent = t(text);
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
    showLanguageButtons(header);
    const nav = find('#nav');
    addLink(nav, t('Ապրանքներ'), '/');

    if (!user) {
        addLink(nav, t('Մուտք'), '/login');
        addLink(nav, t('Գրանցում'), '/register');
        return;
    }

    addLink(nav, t('Ավելացնել ապրանք'), '/add');
    if (user.status === 'admin') {
        addLink(nav, t('Ադմին'), '/admin');
    }

    const name = document.createElement('span');
    name.className = 'muted';
    name.textContent = user.full_name;
    nav.append(name);

    const logout = document.createElement('button');
    logout.type = 'button';
    logout.textContent = t('Ելք');
    logout.onclick = logoutUser;
    nav.append(logout);
}


async function showMenu() {
    const data = await api('/menu');
    const container = find('#menu');
    container.innerHTML = `<h2>${t("Բաժիններ")}</h2>`;

    if (data.items.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = t('Մենյուն դեռ դատարկ է։');
        container.append(empty);
    }

    const hasAll = data.items.some(item => Number(item.parent_id) === 0 && item.title.trim() === 'Բոլորը');
    if (!hasAll) {
        addLink(container, t('Բոլորը'), '/').className = 'menu-link';
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
        const link = addLink(row, t(item.title), path);
        link.className = 'menu-link';
        if (item.title.trim() !== 'Բոլորը') {
            makeDropTarget(link, 'product', item.id, 'inside');
        }

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
        button.setAttribute('aria-label', item.title + t('՝ ենթաբաժիններ'));
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
    if (!confirm(t('Ջնջե՞լ ապրանքը։'))) {
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
    main.innerHTML = `<h1>${t("Ապրանքների ցանկ")}</h1><div class="grid" id="products"></div>`;
    const container = find('#products');
    if (user) {
        const hint = document.createElement('p');
        hint.textContent = t('Քաշիր ապրանքը դեպի ձախ կողմի կատեգորիան։');
        main.insertBefore(hint, container);
    }
    const category = params.get('category_id');
    const query = category === null ? '' : '?category_id=' + encodeURIComponent(category);
    const data = await api('/products' + query);

    if (data.products.length === 0) {
        container.textContent = t('Ապրանքներ դեռ չկան։');
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
            <div class="actions"><a class="show">${t("Դիտել ապրանքը")}</a></div>
        `;
        showProductImage(card, product);
        card.querySelector('h2').textContent = product.name;
        card.querySelector('.summary').textContent = product.description;
        card.querySelector('.price').textContent = product.price + ' ֏';
        card.querySelector('.stock').textContent = t('Քանակ ') + product.stock;
        card.querySelector('.category').textContent = t('Կատեգորիա՝ ') + (t(product.category_name) || t('Բոլորը'));
        card.querySelector('.show').href = basePath + '/show?id=' + product.id + (category === null ? '' : '&category_id=' + encodeURIComponent(category));
        const actions = card.querySelector('.actions');

        productActions(actions, product, false);
        if (canManageProduct(product)) {
            addDragHandle(card, 'product', product.id);
        }
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
        <div class="actions"><a id="back">${t("Վերադառնալ")}</a></div>
    `;
    showProductImage(main, product);
    main.querySelector('h1').textContent = product.name;
    main.querySelector('.description').textContent = product.description;
    main.querySelector('.price').textContent = product.price + ' ֏';
    find('#stock').textContent = t('Քանակ ') + product.stock;
    find('#created').textContent = t('Ստեղծված՝ ') + product.created_at;
    find('#author').textContent = t('Հեղինակ՝ ') + (product.author_name || t('Անհայտ'));
    find('#updated').hidden = !product.updated_at;
    if (product.updated_at) {
        find('#updated').textContent = t('Փոփոխված՝ ') + product.updated_at;
    }
    find('#category').textContent = t('Կատեգորիա՝ ') + (t(product.category_name) || t('Բոլորը'));
    const category = params.get('category_id');
    find('#back').href = basePath + '/' + (category === null ? '' : '?category_id=' + encodeURIComponent(category));

    productActions(main.querySelector('.actions'), product, true);
}


async function productForm(id) {
    const main = find('#main');
    if (!user) {
        showError(main, t('Նախ մուտք գործիր։'));
        return;
    }

    main.innerHTML = `
        <h1 id="title">${t("Ավելացնել ապրանք")}</h1>
        <form class="form" id="product-form">
            <label>${t("Անվանում")}
                <input name="name" maxlength="240" required>
            </label>
            <label>${t("Նկարագրություն")}
                <textarea name="description" maxlength="10000" required></textarea>
            </label>
            <label>${t("Կատեգորիա")}
                <select name="category_id"><option value="">${t("Բոլորը")}</option></select>
            </label>
            <label>${t("Գին (դրամ)")}
                <input name="price" type="number" min="0" max="99999999.99" step="0.01" required>
            </label>
            <label>${t("Քանակ")}
                <input name="stock" type="number" min="0" max="9999999" step="1" value="0" required>
            </label>
            <label>${t("Նկար (ոչ պարտադիր)")}
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp">
            </label>
            <p class="muted">${t("JPG, PNG կամ WebP, մինչև 2 ՄԲ։")}</p>
            <img id="image-preview" class="product-image" hidden alt="">
            <label id="remove-image-label" class="checkbox-label" hidden>
                <input name="remove_image" type="checkbox" value="1">${t("Հեռացնել նկարը")}
            </label>
            <p id="keep-image-hint" class="muted" hidden>${t("Նոր նկար չընտրելու դեպքում հինը կմնա։")}</p>
            <div id="form-message" aria-live="polite"></div>
            <button type="submit" class="primary" disabled>${t("Պահպանել")}</button>
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
        addOption(form.elements.category_id, category.id, '#' + category.id + ' · ' + t(category.title));
    }


    let editingProduct = null;
    if (id) {
        find('#title').textContent = t('Խմբագրել ապրանքը');
        const data = await api('/product?id=' + encodeURIComponent(id));
        if (!canManageProduct(data.product)) {
            main.textContent = '';
            showError(main, t('Կարող ես խմբագրել միայն քո ապրանքները։'));
            return;
        }
        editingProduct = data.product;
        form.elements.name.value = data.product.name;
        form.elements.description.value = data.product.description;
        form.elements.price.value = data.product.price;
        form.elements.stock.value = data.product.stock;
        form.elements.category_id.value = data.product.category_id || '';
    }

    let previewUrl = '';
    const preview = find('#image-preview');
    preview.alt = t('Նկարի նախադիտում');
    let currentImageUrl = '';
    if (id) {
        if (Number(editingProduct.has_image)) {
            currentImageUrl = basePath + '/api/image?id=' + encodeURIComponent(id);
            preview.src = currentImageUrl;
            preview.hidden = false;
            find('#remove-image-label').hidden = false;
            find('#keep-image-hint').hidden = false;
        }
    }
    form.elements.image.onchange = function() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = '';
        output.textContent = '';
        const file = form.elements.image.files[0];
        if (file && (file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
            showError(output, t('JPG, PNG կամ WebP, մինչև 2 ՄԲ։'));
            form.elements.image.value = '';
        } else if (file) {
            previewUrl = URL.createObjectURL(file);
            form.elements.remove_image.checked = false;
        }
        preview.src = previewUrl || currentImageUrl;
        preview.hidden = !(previewUrl || currentImageUrl) || form.elements.remove_image.checked;
    };
    form.elements.remove_image.onchange = function() {
        if (form.elements.remove_image.checked) {
            form.elements.image.value = '';
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            previewUrl = '';
        }
        preview.src = previewUrl || currentImageUrl;
        preview.hidden = form.elements.remove_image.checked || !(previewUrl || currentImageUrl);
    };
    button.disabled = false;

    form.onsubmit = async function(event) {
        event.preventDefault();
        if (button.disabled) return;
        output.textContent = '';

        const name = form.elements.name.value.trim();
        const description = form.elements.description.value.trim();
        if (name === '' || new TextEncoder().encode(name).length > 240) {
            showError(output, t('Անվանումը պարտադիր է, մինչև 240 բայթ։'));
            return;
        }
        if (description === '' || new TextEncoder().encode(description).length > 10000) {
            showError(output, t('Նկարագրությունը պարտադիր է, մինչև 10000 բայթ։'));
            return;
        }
        if (!form.reportValidity()) return;

        const price = form.elements.price.value;
        const priceParts = price.split('.');
        if (price.toLowerCase().includes('e') || price.includes('+') || price.includes('-')
            || priceParts[0].length > 8 || (priceParts[1] && priceParts[1].length > 2)) {
            showError(output, t('Գինը՝ 0–99999999.99, մինչև 2 տասնորդական թվանշան։'));
            return;
        }
        const stock = Number(form.elements.stock.value);
        if (!Number.isInteger(stock) || stock < 0 || stock > 9999999) {
            showError(output, t('Քանակը պետք է լինի ամբողջ թիվ՝ 0–9999999։'));
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
    addLink(container, t('Խմբագրել'), '/edit?id=' + id);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'danger';
    remove.textContent = t('Ջնջել');
    remove.onclick = function() {
        deleteProduct(id, remove, detailsPage);
    };
    container.append(remove);
}

function authForm(register) {
    const main = find('#main');
    let title = t('Մուտք');
    if (register) {
        title = t('Գրանցում');
    }

    main.innerHTML = '<h1></h1><form class="form" id="auth-form"></form>';
    main.querySelector('h1').textContent = title;
    const form = find('#auth-form');

    if (register) {
        form.innerHTML = `
            <label>${t("Անուն ազգանուն")}
                <input name="full_name" minlength="2" maxlength="150" autocomplete="name" required>
            </label>
        `;
    }

    form.innerHTML += `
        <label>Email
            <input name="email" type="email" maxlength="190" autocomplete="username" required>
        </label>
        <label>${t("Գաղտնաբառ")}
            <input name="password" type="password" autocomplete="current-password" required>
        </label>
    `;

    if (register) {
        form.innerHTML += `
            <label>${t("Կրկնել գաղտնաբառը")}
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
                showError(output, t('Անվան երկարությունը՝ 2–150 բայթ։'));
                return;
            }
            form.elements.full_name.value = name;
        }
        if (register && form.elements.password.value !== form.elements.password2.value) {
            showError(output, t('Գաղտնաբառերը տարբեր են։'));
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
                message.textContent = t(data.message);
                output.append(message);
                addLink(output, t('Անցնել մուտքի էջ'), '/login');
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
        showError(main, t('Այս էջը միայն ադմինի համար է։'));
        return;
    }

    const data = await api('/menu');
    menuItems = data.items;
    main.innerHTML = `
        <h1>${t("Մենյուի կառավարում")}</h1>
        <p>${t("Ընտրիր ծնողը և հերթականությունը։ Փոքր թիվը ցուցադրվում է առաջինը։")}</p>
        <section class="card" id="menu-editor"></section>
        <div class="admin-list" id="menu-list"></div>
    `;
    menuForm(null, 0);
    const list = find('#menu-list');
    const hint = document.createElement('p');
    hint.textContent = t('Քաշիր տարրը «Առաջ», «Ներս» կամ «Հետո» դաշտի վրա։');
    list.before(hint);
    const rootDrop = document.createElement('div');
    rootDrop.className = 'drop-zone';
    rootDrop.textContent = t('Տեղափոխել հիմնական մակարդակ');
    makeDropTarget(rootDrop, 'menu', 0, 'inside');
    list.before(rootDrop);

    for (const item of menuItems) {
        const row = document.createElement('article');
        row.className = 'admin-row';
        row.innerHTML = `
            <div><strong></strong><p class="muted"></p></div>
            <div class="actions">
                <button type="button" class="add-child">${t("Ենթամենյու +")}</button>
                <button type="button" class="edit-menu">${t("Խմբագրել")}</button>
                <button type="button" class="danger">${t("Ջնջել")}</button>
            </div>
        `;
        row.querySelector('strong').textContent = '#' + item.id + ' · ' + item.title;
        row.querySelector('p').textContent = t('Ծնող՝ ') + (item.parent_id || t('չկա')) + t(' / Հերթ՝ ') + item.sort_order;
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
            if (!confirm(t('Ջնջե՞լ տարրը։ Ենթատարրերը կտեղափոխվեն մեկ մակարդակ վերև։'))) {
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
        addDragHandle(row, 'menu', item.id);
        const zones = document.createElement('div');
        zones.className = 'drop-zones';
        for (const [position, label] of [['before', 'Առաջ'], ['inside', 'Ներս'], ['after', 'Հետո']]) {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.textContent = t(label);
            makeDropTarget(zone, 'menu', item.id, position);
            zones.append(zone);
        }
        row.append(zones);
        list.append(row);
    }
}

function menuForm(item, parentId) {
    const editor = find('#menu-editor');
    editor.innerHTML = `
        <h2 id="editor-title">${t("Նոր տարր")}</h2>
        <form class="form" id="menu-form">
            <label>${t("Անվանում")}
                <input name="title" maxlength="240" required>
            </label>
            <label>${t("Ծնող տարր")}
                <select name="parent_id"><option value="0">${t("Առանց ծնողի")}</option></select>
            </label>
            <label>${t("Հերթականություն")}
                <input name="sort_order" type="number" min="0" max="9999999" step="1" value="0" required>
            </label>
            <div id="menu-message" aria-live="polite"></div>
            <button type="submit" class="primary">${t("Պահպանել")}</button>
            <button type="button" id="cancel">${t("Չեղարկել")}</button>
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
        find('#editor-title').textContent = t('Խմբագրել #') + item.id;
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
            message.textContent = t('Մենյուն պահպանված է։');
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

// Տվյալները պահում ենք միայն ընթացիկ էջում․ դրսից քաշած ֆայլը տեղափոխում չէ։
let draggedItem = null;
let moveBusy = false;

function moveNotice(message, error = false) {
    let notice = find('#move-notice');
    if (!notice) {
        notice = document.createElement('p');
        notice.id = 'move-notice';
        notice.setAttribute('role', 'status');
        find('#main').prepend(notice);
    }
    notice.className = error ? 'notice error' : 'notice';
    notice.textContent = t(message);
}

function clearDrag() {
    draggedItem = null;
    document.querySelectorAll('.dragging, .drop-active').forEach(element => {
        element.classList.remove('dragging', 'drop-active');
    });
}

function addDragHandle(container, kind, id) {
    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    if (kind === 'product') handle.classList.add('product-drag-handle');
    handle.textContent = '⠿ ' + t('Քաշիր այստեղից');
    handle.draggable = true;
    handle.title = t('Քաշիր այստեղից');
    handle.addEventListener('dragstart', event => {
        if (moveBusy) {
            event.preventDefault();
            return;
        }
        draggedItem = { kind, id: Number(id) };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', kind + ':' + id);
        container.classList.add('dragging');
    });
    handle.addEventListener('dragend', clearDrag);
    container.prepend(handle);
}

function makeDropTarget(element, kind, targetId, position) {
    element.addEventListener('dragover', event => {
        if (moveBusy || !draggedItem || draggedItem.kind !== kind) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        element.classList.add('drop-active');
    });
    element.addEventListener('dragleave', () => element.classList.remove('drop-active'));
    element.addEventListener('drop', async event => {
        if (moveBusy || !draggedItem || draggedItem.kind !== kind) return;
        event.preventDefault();
        event.stopPropagation();
        const source = draggedItem;
        clearDrag();
        if (kind === 'menu' && source.id === Number(targetId)) return;
        const data = new FormData();
        data.set('id', source.id);
        data.set('target_id', targetId);
        data.set('position', position);
        moveBusy = true;
        moveNotice('Պահպանվում է…');
        try {
            await api(kind === 'menu' ? '/menu/move' : '/product/move', data);
            await showMenu();
            if (kind === 'menu') await adminPage();
            else await allProducts();
            moveNotice('Տեղափոխումը պահպանված է։');
        } catch (error) {
            moveNotice(error.message, true);
        } finally {
            moveBusy = false;
        }
    });
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
    showNav();

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
                throw new Error(t('Նշիր ապրանքի ID-ն։'));
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
