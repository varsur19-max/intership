// Entry point: the feature functions live in separate files.
async function start() {
    const viewId = beginView("loading");
    content.textContent = t("Բեռնվում է...");
    try {
        const result = await request("/auth/user");
        if (!isCurrentView(viewId)) return;
        currentUser = result.user;

        navigation.innerHTML = `
            <button id="products-button">${t("Բոլորը")}</button>
        `;

        document
            .getElementById("products-button")
            .addEventListener("click", function () {
                resetSearch();
                selectCategory(null);
            });

        if (currentUser) {
            const greeting = document.createElement("span");
            greeting.className = "user-greeting";
            greeting.textContent = t("Բարև, ") + currentUser.name;

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

            navigation.append(greeting, addButton, logoutButton);

            if (currentUser.role === "admin") {
                const menuButton = document.createElement("button");
                menuButton.textContent = t("Մենյուի կառավարում");

                menuButton.addEventListener("click", function () {
                    showMenuAdmin();
                });

                navigation.append(menuButton);
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

            navigation.append(loginButton, registerButton);
        }

        await loadMenu();
        if (isCurrentView(viewId)) await showProducts();
    } catch (error) {
        if (!isCurrentView(viewId)) return;
        content.textContent = "";
        message.textContent = error.message;
    }
}

setupLanguageButtons();
start();
