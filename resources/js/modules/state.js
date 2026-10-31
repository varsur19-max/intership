export const elements = {
    navigation: document.getElementById("navigation"),
    content: document.getElementById("content"),
    message: document.getElementById("message"),
    categoryMenu: document.getElementById("category-menu"),
    languageSwitcher: document.getElementById("language-switcher"),
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    searchSuggestions: document.getElementById("search-suggestions"),
    contactButton: document.getElementById("contact-button"),
};

export const state = {
    currentUser: null,
    menuItems: [],
    selectedCategory: null,
    searchQuery: "",
    viewVersion: 0,
    currentPage: 1,
};