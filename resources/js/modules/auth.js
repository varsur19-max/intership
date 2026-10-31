import { elements } from "./state.js";
import { beginView, isCurrentView, request } from "./common.js";
import { t } from "./language.js";

export function showForm(type) {
    const viewId = beginView("auth");
    elements.message.textContent = "";

    const isRegister = type === "register";
    const title = isRegister ? t("Գրանցում") : t("Մուտք");

    if (!isCurrentView(viewId)) return;
    elements.content.innerHTML = `
        <h2>${title}</h2>

        <form id="auth-form">
            ${
                isRegister
                    ? `
                <label>
                    ${t("Անուն ազգանուն")}
                    <input
                        name="name"
                        autocomplete="name"
                        maxlength="150"
                        required
                    >
                </label>

                <label>
                    ${t("Էլեկտրոնային հասցե")}
                    <input
                        type="email"
                        name="email"
                        autocomplete="email"
                        maxlength="255"
                        required
                    >
                </label>
            `
                    : ""
            }

            <label>
                ${t("Օգտանուն")}
                <input
                    name="username"
                    autocomplete="username"
                    maxlength="50"
                    required
                >
            </label>

            <label>
                ${t("Գաղտնաբառ")}
                <input
                    type="password"
                    name="password"
                    autocomplete="${
                        isRegister ? "new-password" : "current-password"
                    }"
                    required
                >
            </label>

            ${
                isRegister
                    ? `
                <label>
                    ${t("Կրկնիր գաղտնաբառը")}
                    <input
                        type="password"
                        name="password_confirmation"
                        autocomplete="new-password"
                        required
                    >
                </label>
            `
                    : ""
            }

            <button type="submit">${title}</button>
        </form>
    `;

    const form = document.getElementById("auth-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        elements.message.textContent = "";

        const button = form.querySelector("button");
        button.disabled = true;

        const data = Object.fromEntries(new FormData(form));

        try {
            await request("/" + type, "POST", data);

            window.location.reload();
        } catch (error) {
            if (!isCurrentView(viewId)) return;
            elements.message.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    });
}


export async function logout() {
    elements.message.textContent = "";

    const button = document.getElementById("logout-button");
    button.disabled = true;

    try {
        await request("/logout", "POST");

        window.location.reload();
    } catch (error) {
        elements.message.textContent = error.message;
        button.disabled = false;
    }
}
