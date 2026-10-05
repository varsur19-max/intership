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

