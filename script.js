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
