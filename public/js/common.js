const navigation = document.getElementById("navigation");
const content = document.getElementById("content");
const message = document.getElementById("message");
let currentUser = null;
let menuItems = [];
let selectedCategory = null;
let searchQuery = "";

const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

// A view token prevents old requests from replacing a newer screen.
let viewVersion = 0;
let currentPage = 1;
function beginView(name) {
    content.dataset.view = name;
    message.textContent = "";
    hideSuggestions();
    return ++viewVersion;
}
function isCurrentView(version) {
    return version === viewVersion;
}
function productPlaceholder() {
    const box = document.createElement("div");
    box.className = "image-placeholder";
    box.setAttribute("aria-label", t("Նկար չկա"));
    box.innerHTML =
        '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="m32 7 23 13v25L32 58 9 45V20L32 7Z" stroke="currentColor" stroke-width="2"/><path d="m9 20 23 13 23-13M32 33v25M21 14l23 13" stroke="currentColor" stroke-width="2"/></svg>';
    return box;
}
async function request(url, method = "GET", data = null) {
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
    if (response.status === 401)
        throw new Error(t("Շարունակելու համար մուտք գործիր։"));
    if (response.status === 404)
        throw new Error(t("Տվյալը չի գտնվել։ Թարմացրու ցուցակը։"));

    if (response.status === 413) {
        throw new Error(t("Ուղարկված տվյալների չափը չափազանց մեծ է։"));
    }

    if (response.status === 419) {
        throw new Error(t("Սեսիան ժամկետանց է։ Թարմացրու էջը։"));
    }

    if (response.status === 429) {
        throw new Error(t("Չափազանց շատ փորձեր։ Փորձիր մեկ րոպեից։"));
    }

    const contentType = response.headers.get("Content-Type") || "";

    if (!contentType.includes("application/json")) {
        throw new Error(t("Սերվերից ստացվել է անվավեր պատասխան։"));
    }

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
