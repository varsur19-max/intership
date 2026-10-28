const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("search-suggestions");

searchInput.placeholder = t("Որոնել ապրանք...");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    searchQuery = searchInput.value.trim();
    showProducts(1);
});

function renderSuggestions(names) {
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
            searchQuery = name;
            showProducts(1);
        });

        suggestionsBox.append(button);
    });
}

function hideSuggestions() {
    renderSuggestions([]);
}

function resetSearch() {
    searchInput.value = "";
    searchQuery = "";
    hideSuggestions();
}