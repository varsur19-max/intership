// Display full category paths when different branches share a name.
function categoryOptions(items) {
    const byId = new Map(items.map((item) => [Number(item.id), item]));
    return items.map((item) => {
        const labels = [item.title];
        const seen = new Set([Number(item.id)]);
        let parent = byId.get(Number(item.parent_id));
        while (parent && !seen.has(Number(parent.id))) {
            seen.add(Number(parent.id));
            labels.unshift(parent.title);
            parent = byId.get(Number(parent.parent_id));
        }
        return { id: item.id, title: labels.join(" / ") };
    });
}

let menuRequestVersion = 0;
async function loadMenu() {
    const version = ++menuRequestVersion;
    const items = await request("/menu-items");
    if (version !== menuRequestVersion) return;
    menuItems = items;

    if (
        selectedCategory !== null &&
        !menuItems.some((item) => Number(item.id) === selectedCategory)
    ) {
        selectedCategory = null;
    }

    renderMenu();
}

function renderMenu() {
    const container = document.getElementById("category-menu");
    container.textContent = "";

    const allButton = document.createElement("button");
    allButton.textContent = t("Բոլորը");

    if (selectedCategory === null) {
        allButton.className = "active";
    }

    allButton.addEventListener("click", function () {
        resetSearch();
        selectCategory(null);
    });

    enableCategoryDrop(allButton, null);

    container.append(allButton);

    const visited = new Set();
    function buildLevel(parentId) {
        const list = document.createElement("ul");

        menuItems
            .filter((item) => item.parent_id == parentId)
            .forEach(function (item) {
                if (visited.has(Number(item.id))) return;
                visited.add(Number(item.id));
                const row = document.createElement("li");
                const button = document.createElement("button");

                button.textContent = item.title;

                if (Number(item.id) === selectedCategory) {
                    button.className = "active";
                }

                button.addEventListener("click", function () {
                    selectCategory(Number(item.id));
                });

                const line = document.createElement("div");
                line.className = "menu-item-line";

                line.append(button);

                enableCategoryDrop(button, Number(item.id));

                if (currentUser && currentUser.role === "admin") {
                    line.append(createDragHandle("menu", item.id));
                }

                row.append(line);

                const children = buildLevel(item.id);

                if (children.children.length > 0) {
                    row.append(children);
                }

                list.append(row);
            });

        return list;
    }

    container.append(buildLevel(null));
}

async function selectCategory(id) {
    selectedCategory = id;
    renderMenu();
    await showProducts(1);
}

async function showMenuAdmin(editId = null) {
    const viewId = beginView("admin");
    if (!currentUser || currentUser.role !== "admin") {
        message.textContent = t("Այս բաժինը միայն ադմինիստրատորի համար է։");
        return;
    }

    message.textContent = "";
    content.textContent = t("Բեռնվում է...");

    try {
        await loadMenu();
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        content.textContent = "";
        message.textContent = error.message;
        return;
    }

    if (!isCurrentView(viewId)) return;
    const editing =
        editId === null
            ? null
            : menuItems.find((item) => Number(item.id) === Number(editId));

    if (editId !== null && !editing) {
        content.textContent = "";
        message.textContent = t("Կատեգորիան այլևս գոյություն չունի։");
        return;
    }

    if (!isCurrentView(viewId)) return;
    content.innerHTML = `
        <h2>${t("Մենյուի կառավարում")}</h2>

        <form id="menu-form">
            <label>
                ${t("Կատեգորիայի անունը")}
                <input name="title" maxlength="150" required>
            </label>

            <label>
                ${t("Ծնող կատեգորիա")}
                <select name="parent_id">
                    <option value="">${t("Հիմնական կատեգորիա")}</option>
                </select>
            </label>

            <label>
                ${t("Հերթականություն")}
                <input
                    type="number"
                    name="sort_order"
                    min="0"
                    max="1000000"
                    step="1"
                    value="0"
                    required
                >
            </label>

            <button type="submit">
                ${editing ? t("Պահպանել փոփոխությունները") : t("Ավելացնել")}
            </button>

            <button type="button" id="new-category">
                ${t("Նոր կատեգորիա")}
            </button>
        </form>

        <h3>${t("Գոյություն ունեցող կատեգորիաներ")}</h3>
        <div id="menu-list"></div>
    `;

    const form = document.getElementById("menu-form");
    const parentSelect = form.elements.namedItem("parent_id");
    const saveButton = form.querySelector('[type="submit"]');
    const list = document.getElementById("menu-list");

    const excluded = new Set();

    function excludeBranch(id) {
        const numberId = Number(id);

        if (excluded.has(numberId)) {
            return;
        }

        excluded.add(numberId);

        menuItems
            .filter((item) => Number(item.parent_id) === numberId)
            .forEach((item) => excludeBranch(item.id));
    }

    if (editing) {
        excludeBranch(editing.id);
    }

    const visited = new Set();
    function addParentOptions(parentId, prefix = "") {
        menuItems
            .filter((item) => item.parent_id == parentId)
            .forEach(function (item) {
                if (
                    excluded.has(Number(item.id)) ||
                    visited.has(Number(item.id))
                ) {
                    return;
                }

                visited.add(Number(item.id));
                const option = document.createElement("option");
                option.value = item.id;
                option.textContent = prefix + item.title;
                parentSelect.append(option);

                addParentOptions(item.id, prefix + "— ");
            });
    }

    addParentOptions(null);

    if (editing) {
        form.elements.namedItem("title").value = editing.title;
        form.elements.namedItem("sort_order").value = editing.sort_order;
        parentSelect.value =
            editing.parent_id === null ? "" : String(editing.parent_id);
    }

    document
        .getElementById("new-category")
        .addEventListener("click", function () {
            showMenuAdmin();
        });

    if (menuItems.length === 0) {
        list.textContent = t("Կատեգորիաներ դեռ չկան։");
    }

    menuItems.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "menu-row";

        const parent = menuItems.find(
            (candidate) => Number(candidate.id) === Number(item.parent_id),
        );

        const title = document.createElement("span");
        title.textContent =
            item.title +
            t(" | Ծնող՝ ") +
            (parent ? parent.title : t("Չկա")) +
            t(" | Հերթականություն՝ ") +
            item.sort_order;

        const editButton = document.createElement("button");
        editButton.textContent = t("Խմբագրել");

        editButton.addEventListener("click", function () {
            showMenuAdmin(item.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "danger-button";
        deleteButton.textContent = t("Ջնջել");

        deleteButton.addEventListener("click", function () {
            deleteMenuItem(item.id, deleteButton);
        });

        row.append(title, editButton, deleteButton);
        list.append(row);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        message.textContent = "";
        saveButton.disabled = true;

        const data = Object.fromEntries(new FormData(form));

        if (data.parent_id === "") {
            data.parent_id = null;
        }

        const url = editing ? "/menu-items/" + editing.id : "/menu-items";

        const method = editing ? "PUT" : "POST";

        try {
            await request(url, method, data);
        } catch (error) {
            if (!isCurrentView(viewId)) return;
            message.textContent = error.message;
            saveButton.disabled = false;
            return;
        }

        if (isCurrentView(viewId)) await showMenuAdmin();
    });
}

async function deleteMenuItem(id, button) {
    const viewId = viewVersion;
    const confirmed = window.confirm(
        t(
            "Ջնջե՞լ կատեգորիան։ Դրա ապրանքները կմնան առանց կատեգորիայի, " +
                "իսկ անմիջական ենթակետերը կդառնան հիմնական կատեգորիաներ։",
        ),
    );

    if (!confirmed) {
        return;
    }

    message.textContent = "";
    button.disabled = true;

    try {
        await request("/menu-items/" + id, "DELETE");
    } catch (error) {
        if (isCurrentView(viewId)) message.textContent = error.message;
        button.disabled = false;
        return;
    }

    if (isCurrentView(viewId)) await showMenuAdmin();
}
