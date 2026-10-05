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


