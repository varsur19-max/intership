import { elements, state } from "./state.js";
import { resetSearch } from "./search.js";
import { showProducts, showProductForm } from "./products.js";
import { beginView, isCurrentView, request } from "./common.js";
import { loadMenu, selectCategory, showMenuAdmin } from "./menu.js";
import { showForm, logout } from "./auth.js";
import { t, setupLanguageButtons } from "./language.js";
import "./contact.js";

async function start() {
    const viewId = beginView("loading");
    elements.content.textContent = t("Բեռնվում է...");
    try {
        const result = await request("/auth/user");
        if (!isCurrentView(viewId)) return;
        state.currentUser = result.user;

        elements.navigation.innerHTML = `
            <button id="products-button">${t("Բոլորը")}</button>
        `;

        document
            .getElementById("products-button")
            .addEventListener("click", function () {
                resetSearch();
                selectCategory(null);
            });

        if (state.currentUser) {
            const greeting = document.createElement("span");
            greeting.className = "user-greeting";
            greeting.textContent = t("Բարև, ") + state.currentUser.name;

            const addButton = document.createElement("button");
            addButton.className = "primary-button";
            addButton.textContent = t("Ավելացնել ապրանք");
            addButton.addEventListener("click", function () {
                showProductForm();
            });

            const logoutButton = document.createElement("button");
            logoutButton.id = "logout-button";
            logoutButton.textContent = t("Ելք");
            logoutButton.addEventListener("click", logout);

            elements.navigation.append(greeting, addButton, logoutButton);

            if (state.currentUser.role === "admin") {
                const menuButton = document.createElement("button");
                menuButton.textContent = t("Մենյուի կառավարում");

                menuButton.addEventListener("click", function () {
                    showMenuAdmin();
                });

                elements.navigation.append(menuButton);
            }
        } else {
            const loginButton = document.createElement("button");
            loginButton.textContent = t("Մուտք");

            loginButton.addEventListener("click", function () {
                showForm("login");
            });

            const registerButton = document.createElement("button");
            registerButton.textContent = t("Գրանցում");

            registerButton.addEventListener("click", function () {
                showForm("register");
            });

            elements.navigation.append(loginButton, registerButton);
        }

        await loadMenu();
        if (isCurrentView(viewId)) await showProducts();
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        elements.content.textContent = "";
        elements.message.textContent = error.message;
    }
}

setupLanguageButtons();
start();
