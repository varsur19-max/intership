import { state } from "./state.js";
import { showProducts } from "./products.js";
import { t } from "./language.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("search-suggestions");

searchInput.placeholder = t("Որոնել ապրանք...");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    state.searchQuery = searchInput.value.trim();
    showProducts(1);
});

export function renderSuggestions(names) {
    suggestionsBox.textContent = "";
    suggestionsBox.hidden = names.length === 0;

    if (names.length === 0) return;

    const title = document.createElement("p");
    title.textContent = t("Գուցե նկատի ունեիր՝");
    suggestionsBox.append(title);

    names.forEach(function (name) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = name;

        button.addEventListener("click", function () {
            searchInput.value = name;
            state.searchQuery = name;
            showProducts(1);
        });

        suggestionsBox.append(button);
    });
}

export function hideSuggestions() {
    renderSuggestions([]);
}

export function resetSearch() {
    searchInput.value = "";
    state.searchQuery = "";
    hideSuggestions();
}
