import { elements, state } from "./state.js";
import { hideSuggestions } from "./search.js";
import { t } from "./language.js";

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
const statusMessages = {
    401: "Շարունակելու համար մուտք գործիր։",
    404: "Տվյալը չի գտնվել։ Թարմացրու ցուցակը։",
    413: "Ուղարկված տվյալների չափը չափազանց մեծ է։",
    419: "Սեսիան ժամկետանց է։ Թարմացրու էջը։",
    429: "Չափազանց շատ փորձեր։ Փորձիր մեկ րոպեից։",
};

export function beginView(name) {
    elements.content.dataset.view = name;
    elements.message.textContent = "";
    hideSuggestions();
    return ++state.viewVersion;
}
export function isCurrentView(version) {
    return version === state.viewVersion;
}
export function productPlaceholder() {
    const box = document.createElement("div");
    box.className = "image-placeholder";
    box.setAttribute("aria-label", t("Նկար չկա"));
    box.innerHTML =
        '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="m32 7 23 13v25L32 58 9 45V20L32 7Z" stroke="currentColor" stroke-width="2"/><path d="m9 20 23 13 23-13M32 33v25M21 14l23 13" stroke="currentColor" stroke-width="2"/></svg>';
    return box;
}
export async function request(url, method = "GET", data = null) {
    const options = {
        method,
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
    };

    if (data instanceof FormData) {
        options.body = data;
    } else if (data !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error(t("Կապը սերվերի հետ ընդհատվեց։ Փորձիր կրկին։"));
    }
    if (response.status >= 500)
        throw new Error(t("Սերվերի սխալ։ Փորձիր ավելի ուշ։"));

    if (statusMessages[response.status])
        throw new Error(t(statusMessages[response.status]));

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error(t("Սերվերից ստացվել է անվավեր պատասխան։"));
    }

    if (!response.ok) {
        const errorText = result.errors
            ? Object.values(result.errors)
                  .flat()
                  .map((text) => t(text))
                  .join("\n")
            : t(result.message || "Հարցումը չհաջողվեց։");

        throw new Error(errorText);
    }

    if (typeof result.message === "string") {
        result.message = t(result.message);
    }

    return result;
}

export async function confirmAndDelete({ url, question, button, refresh }) {
    if (!window.confirm(question)) return;

    const viewId = state.viewVersion;
    elements.message.textContent = "";
    button.disabled = true;

    try {
        await request(url, "DELETE");
    } catch (error) {
        if (isCurrentView(viewId)) elements.message.textContent = error.message;
        button.disabled = false;
        return;
    }

    if (isCurrentView(viewId)) await refresh();
}
