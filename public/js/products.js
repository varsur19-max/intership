async function showProducts(page = currentPage) {
    const viewId = beginView("catalog");
    message.textContent = "";
    if (!isCurrentView(viewId)) return;
    content.innerHTML = `
        <div class="section-heading"><div><p class="eyebrow">${t("ՔՈ ԿԱՏԱԼՈԳԸ")}</p><h2>${t("Ապրանքներ")}</h2></div><span id="catalog-count" class="count-pill"></span></div>
        <div id="products-list">${t("Բեռնվում է...")}</div>
        <div id="pagination"></div>
    `;

    const list = document.getElementById("products-list");
    const pagination = document.getElementById("pagination");

    try {
        const params = new URLSearchParams({ page });

        if (selectedCategory !== null) {
            params.set("category_id", selectedCategory);
        }

        const result = await request("/products?" + params.toString());
        if (!isCurrentView(viewId)) return;
        currentPage = result.current_page;
        if (result.current_page > result.last_page)
            return showProducts(result.last_page);
        document.getElementById("catalog-count").textContent =
            result.total + " " + t("ապրանք");

        list.textContent = "";

        if (result.data.length === 0) {
            list.textContent =
                selectedCategory === null
                    ? t("Ապրանքներ դեռ չկան։")
                    : t("Այս կատեգորիայում ապրանքներ չկան։");
            return;
        }

        result.data.forEach(function (product) {
            const card = document.createElement("article");
            card.className = "product-card";
            if (product.image_url) {
                card.append(createProductImage(product));
            } else {
                card.append(productPlaceholder());
            }

            const title = document.createElement("h3");
            title.textContent = product.name;

            const description = document.createElement("p");
            description.className = "product-description";
            description.textContent = product.description;

            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = t("Գին՝ ") + product.price + t(" դրամ");

            const stock = document.createElement("p");
            stock.className = "product-meta";
            stock.textContent = t("Քանակ՝ ") + product.stock;

            const author = document.createElement("p");
            author.className = "product-meta";
            author.textContent =
                t("Հեղինակ՝ ") +
                (product.user ? product.user.name : t("Անհայտ"));

            const category = document.createElement("p");
            category.className = "product-category";
            category.textContent =
                t("Կատեգորիա՝ ") +
                (product.category
                    ? product.category.title
                    : t("Առանց կատեգորիայի"));

            card.append(title, description, price, stock, author, category);

            const viewButton = document.createElement("button");
            viewButton.className = "view-button";
            viewButton.textContent = t("Դիտել");

            viewButton.addEventListener("click", function () {
                showProduct(product.id);
            });

            card.append(viewButton);

            if (product.updated_at !== product.created_at) {
                const modified = document.createElement("p");
                modified.className = "modified-badge";
                modified.textContent = t("Փոփոխված");
                card.append(modified);
            }

            enableProductDrag(card, product, page);

            list.append(card);
        });

        const previous = document.createElement("button");
        previous.textContent = t("Նախորդ");
        previous.disabled = result.current_page === 1;

        previous.addEventListener("click", function () {
            showProducts(result.current_page - 1);
        });

        const info = document.createElement("span");
        info.textContent =
            t("Էջ ") + result.current_page + " / " + result.last_page;

        const next = document.createElement("button");
        next.textContent = t("Հաջորդ");
        next.disabled = result.current_page >= result.last_page;

        next.addEventListener("click", function () {
            showProducts(result.current_page + 1);
        });

        pagination.append(previous, info, next);
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        list.textContent = "";
        message.textContent = error.message;
    }
}

async function showProductForm(productId = null) {
    const viewId = beginView("product-form");
    if (!currentUser) {
        showForm("login");
        return;
    }

    message.textContent = "";
    content.textContent = t("Բեռնվում է...");

    const isEdit = productId !== null;

    let product = null;
    let categories;

    try {
        categories = await request("/menu-items");

        if (isEdit) {
            const result = await request("/products/" + productId);

            if (!result.can_manage) {
                throw new Error(
                    t("Դու իրավունք չունես խմբագրելու այս ապրանքը։"),
                );
            }

            product = result.product;
        }
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        content.textContent = "";
        message.textContent = error.message;
        return;
    }

    if (!isCurrentView(viewId)) return;
    content.innerHTML = `
        <h2>${isEdit ? t("Խմբագրել ապրանքը") : t("Ավելացնել ապրանք")}</h2>

        <form id="product-form">
            <label>
                ${t("Ապրանքի անունը")}
                <input name="name" maxlength="150" required>
            </label>

            <label>
                ${t("Նկարագրություն")}
                <textarea
                    name="description"
                    rows="5"
                    maxlength="10000"
                    required
                ></textarea>
            </label>

            <label>
                ${t("Գինը՝ դրամով")}
                <input
                    type="number"
                    name="price"
                    min="0"
                    max="99999999.99"
                    step="0.01"
                    required
                >
            </label>

            <label>
                ${t("Քանակը")}
                <input
                    type="number"
                    name="stock"
                    min="0"
                    max="4294967295"
                    step="1"
                    value="0"
                    required
                >
            </label>

            <label>
                ${t("Կատեգորիա")}
                <select name="category_id" id="category-select">
                    <option value="">${t("Առանց կատեգորիայի")}</option>
                </select>
            </label>

            <label>
                ${t("Նկար՝ մինչև 2 ՄԲ")}
                <input
                    type="file"
                    name="image"
                    accept="image/jpeg,image/png,image/webp"
                >
            </label>

            <div id="current-product-image"></div>

            <button type="submit">${t("Պահպանել")}</button>
            <button type="button" id="cancel-product">${t("Հետ")}</button>
        </form>
    `;

    const form = document.getElementById("product-form");
    const select = document.getElementById("category-select");
    const saveButton = form.querySelector('[type="submit"]');

    categoryOptions(categories).forEach(function (category) {
        const option = document.createElement("option");

        option.value = category.id;
        option.textContent = category.title;

        select.append(option);
    });

    let previewVersion = 0;
    form.elements.namedItem("image").addEventListener("change", function () {
        const previewId = ++previewVersion;
        const box = document.getElementById("current-product-image");
        box.textContent = "";
        const file = this.files[0];
        if (!file) {
            if (product?.image_url) box.append(createProductImage(product));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            message.textContent = t("Նկարի առավելագույն չափը 2 ՄԲ է։");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (isCurrentView(viewId) && previewId === previewVersion)
                box.replaceChildren(
                    createProductImage({
                        image_url: reader.result,
                        name: file.name,
                    }),
                );
        };
        reader.readAsDataURL(file);
    });
    if (isEdit) {
        form.elements.namedItem("name").value = product.name;
        form.elements.namedItem("description").value = product.description;
        form.elements.namedItem("price").value = product.price;
        form.elements.namedItem("stock").value = product.stock;
        if (product.image_url) {
            const image = createProductImage(product);

            document.getElementById("current-product-image").append(image);
        }

        select.value =
            product.category_id === null ? "" : String(product.category_id);
    }

    document
        .getElementById("cancel-product")
        .addEventListener("click", function () {
            if (isEdit) {
                showProduct(productId);
            } else {
                showProducts();
            }
        });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        message.textContent = "";
        saveButton.disabled = true;

        const data = new FormData(form);
        const file = form.elements.namedItem("image").files[0];

        if (!file) {
            data.delete("image");
        } else if (file.size > 2 * 1024 * 1024) {
            message.textContent = t("Նկարի առավելագույն չափը 2 ՄԲ է։");
            saveButton.disabled = false;
            return;
        }

        if (isEdit) {
            data.set("_method", "PUT");
        }

        const url = isEdit ? "/products/" + productId : "/products";

        try {
            await request(url, "POST", data);
        } catch (error) {
            if (!isCurrentView(viewId)) return;
            message.textContent = error.message;
            saveButton.disabled = false;
            return;
        }

        if (!isCurrentView(viewId)) return;
        if (isEdit) {
            await showProduct(productId);
        } else {
            await selectCategory(null);
        }
    });
}

async function showProduct(id) {
    const viewId = beginView("detail");
    message.textContent = "";
    content.textContent = t("Բեռնվում է...");

    try {
        const result = await request("/products/" + id);
        if (!isCurrentView(viewId)) return;
        const product = result.product;

        if (!isCurrentView(viewId)) return;
        content.innerHTML = `
            <article class="product-card">
                <h2 id="product-title"></h2>
                <p id="product-description" class="product-description"></p>
                <p id="product-price"></p>
                <p id="product-stock"></p>
                <p id="product-author"></p>
                <p id="product-category"></p>
                <p id="product-modified"></p>

                <div id="product-actions"></div>
            </article>
        `;

        document.getElementById("product-title").textContent = product.name;

        if (product.image_url) {
            content
                .querySelector(".product-card")
                .prepend(createProductImage(product));
        }

        document.getElementById("product-description").textContent =
            product.description;

        document.getElementById("product-price").textContent =
            t("Գին՝ ") + product.price + t(" դրամ");

        document.getElementById("product-stock").textContent =
            t("Քանակ՝ ") + product.stock;

        document.getElementById("product-author").textContent =
            t("Հեղինակ՝ ") + (product.user ? product.user.name : t("Անհայտ"));

        document.getElementById("product-category").textContent =
            t("Կատեգորիա՝ ") +
            (product.category
                ? product.category.title
                : t("Առանց կատեգորիայի"));

        if (product.updated_at !== product.created_at) {
            document.getElementById("product-modified").textContent =
                t("Փոփոխված");
        }

        const actions = document.getElementById("product-actions");

        const backButton = document.createElement("button");
        backButton.textContent = t("Հետ");

        backButton.addEventListener("click", function () {
            showProducts();
        });

        actions.append(backButton);

        if (result.can_manage) {
            const editButton = document.createElement("button");
            editButton.textContent = t("Խմբագրել");

            editButton.addEventListener("click", function () {
                showProductForm(product.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = t("Ջնջել");

            deleteButton.addEventListener("click", function () {
                deleteProduct(product.id, deleteButton);
            });

            deleteButton.className = "danger-button";
            actions.append(editButton, deleteButton);
        }
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        content.textContent = "";
        message.textContent = error.message;
    }
}

async function deleteProduct(id, button) {
    const viewId = viewVersion;
    const confirmed = window.confirm(t("Ցանկանո՞ւմ ես ջնջել այս ապրանքը։"));

    if (!confirmed) {
        return;
    }

    message.textContent = "";
    button.disabled = true;

    try {
        await request("/products/" + id, "DELETE");
    } catch (error) {
        if (isCurrentView(viewId)) message.textContent = error.message;
        button.disabled = false;
        return;
    }

    if (isCurrentView(viewId)) await showProducts();
}

function createProductImage(product) {
    const image = document.createElement("img");

    image.src = product.image_url;
    image.alt = product.name;
    image.className = "product-image";
    image.loading = "lazy";

    image.draggable = false;
    image.addEventListener(
        "error",
        () => image.replaceWith(productPlaceholder()),
        { once: true },
    );

    return image;
}
