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

