function openContactModal() {
    if (!currentUser) {
        message.textContent = t("Նամակ գրելու համար մուտք գործիր։");
        message.scrollIntoView({ behavior: "smooth" });
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
            <h2 id="contact-title">${t("Կապվել մեզ հետ")}</h2>
            <form id="contact-form">
                <label>
                    ${t("Քո նամակը")}
                    <textarea name="message" rows="6" maxlength="5000" required></textarea>
                </label>
                <p id="contact-error" role="alert"></p>
                <div class="modal-actions">
                    <button type="button" id="contact-cancel">${t("Չեղարկել")}</button>
                    <button type="submit">${t("Ուղարկել")}</button>
                </div>
            </form>
        </div>
    `;

    document.body.append(overlay);

    const form = overlay.querySelector("#contact-form");
    const error = overlay.querySelector("#contact-error");
    form.querySelector("textarea").focus();

    function closeModal() {
        document.removeEventListener("keydown", onkeydown);
        overlay.remove();
    }

    function onkeydown(event) {
        if (event.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", onkeydown);
    overlay.querySelector("#contact-cancel").addEventListener("click", closeModal);
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) closeModal();
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        error.textContent = "";

        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;

        try {
            const result = await request(
                "/contact",
                "POST",
                Object.fromEntries(new FormData(form)),
            );

            closeModal();
            message.textContent = result.message;
            message.scrollIntoView({ behavior: "smooth"});
        }catch(err) {
            error.textContent = err.message;
            button.disabled = false
        }
    });
}

document
    .getElementById("contact-button")
    .addEventListener("click", openContactModal);