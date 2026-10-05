function showNav() {
    const header = find('#header');
    header.innerHTML = '<nav id="nav"></nav>';
    const brand = addLink(header, 'INTERSHIP1', '/');
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


