import { elements } from "./state";
import englishTranslations from "../../../lang/en.json";

let currentLanguage = "hy";
try {
    if (localStorage.getItem("intership_language") === "en")
        currentLanguage = "en";
} catch {}

export function t(text) {
    if (currentLanguage === "hy") {
        return text;
    }

    return Object.prototype.hasOwnProperty.call(englishTranslations, text)
        ? englishTranslations[text]
        : text;
}

export function setupLanguageButtons() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });

    const container = elements.languageSwitcher;
    container.textContent = "";

    const languages = [
        { code: "hy", label: "Հայերեն" },
        { code: "en", label: "English" },
    ];

    languages.forEach(function (language) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = language.label;
        const flag = document.createElement("span");
        flag.className = "language-flag flag-" + language.code;
        flag.setAttribute("aria-hidden", "true");
        button.prepend(flag);

        button.setAttribute(
            "aria-pressed",
            String(currentLanguage === language.code),
        );

        if (currentLanguage === language.code) {
            button.className = "active";
        }

        button.addEventListener("click", function () {
            if (currentLanguage === language.code) {
                return;
            }

            const form = document.querySelector("#content form");
            if (
                form?.dataset.dirty === "true" &&
                !window.confirm(
                    t(
                        "Լեզուն փոխելիս չպահպանված տվյալները կկորչեն։ Շարունակե՞լ։",
                    ),
                )
            )
                return;
            try {
                localStorage.setItem("intership_language", language.code);
            } catch {
                return;
            }

            window.location.reload();
        });

        container.append(button);
    });
}

["input", "change"].forEach((type) => {
    document.addEventListener(type, (event) => {
        if (event.target.form) event.target.form.dataset.dirty = "true";
    });
});