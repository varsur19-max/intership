async function logoutUser() {
    try {
        await api('/logout', new FormData());
        location.href = basePath + '/';
    } catch (error) {
        showError(find('#header'), error.message);
    }
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


