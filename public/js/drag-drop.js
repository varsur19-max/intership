let draggedItem = null;
let dragBusy = false;

function clearDropHighlights() {
    document.querySelectorAll(".drop-target").forEach(function (element) {
        element.classList.remove("drop-target");
    });
}

function createDragHandle(kind, id) {
    const handle = document.createElement("button");

    handle.type = "button";
    handle.className = "drag-handle";
    handle.textContent = "⁞⁞";
    handle.title = t("Քաշիր՝ տեղափոխելու համար");
    handle.setAttribute("aria-label", t("Քաշիր՝ տեղափոխելու համար"));
    handle.draggable = true;

    handle.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    handle.addEventListener("dragstart", function (event) {
        if (dragBusy) {
            event.preventDefault();
            return;
        }

        event.stopPropagation();

        draggedItem = {
            kind,
            id: Number(id),
        };

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", JSON.stringify(draggedItem));
    });

    handle.addEventListener("dragend", function () {
        draggedItem = null;
        clearDropHighlights();
    });

    return handle;
}

function addDropZone(element, canAccept, onDrop) {
    element.addEventListener("dragover", function (event) {
        if (dragBusy || !draggedItem || !canAccept(draggedItem)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        event.dataTransfer.dropEffect = "move";
        element.classList.add("drop-target");
    });

    element.addEventListener("dragleave", function () {
        element.classList.remove("drop-target");
    });

    element.addEventListener("drop", async function (event) {
        if (dragBusy || !draggedItem || !canAccept(draggedItem)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const item = draggedItem;
        const viewId = viewVersion;

        draggedItem = null;
        dragBusy = true;

        clearDropHighlights();
        message.textContent = "";

        try {
            await onDrop(item);
        } catch (error) {
            if (isCurrentView(viewId)) message.textContent = error.message;
        } finally {
            dragBusy = false;
        }
    });
}

function enableProductDrag(card, product, page) {
    const canMove =
        currentUser &&
        (currentUser.role === "admin" ||
            Number(currentUser.id) === Number(product.user_id));

    if (canMove) {
        card.prepend(createDragHandle("product", product.id));
    }

    addDropZone(
        card,
        function (item) {
            return (
                currentUser &&
                currentUser.role === "admin" &&
                item.kind === "product" &&
                item.id !== Number(product.id)
            );
        },
        async function (item) {
            const viewId = viewVersion;
            await request("/products/" + item.id + "/position", "PATCH", {
                before_id: product.id,
            });

            if (isCurrentView(viewId)) await showProducts(page);
        },
    );
}

function enableCategoryDrop(button, categoryId) {
    addDropZone(
        button,
        function (item) {
            if (!currentUser) {
                return false;
            }

            if (item.kind === "product") {
                return true;
            }

            return (
                item.kind === "menu" &&
                currentUser.role === "admin" &&
                item.id !== categoryId
            );
        },
        async function (item) {
            const viewId = viewVersion;
            if (item.kind === "product") {
                await request("/products/" + item.id + "/category", "PATCH", {
                    category_id: categoryId,
                });

                if (isCurrentView(viewId)) await selectCategory(categoryId);
                return;
            }

            const menuItem = menuItems.find(function (candidate) {
                return Number(candidate.id) === item.id;
            });

            if (!menuItem) {
                throw new Error(t("Կատեգորիան այլևս գոյություն չունի։"));
            }

            await request("/menu-items/" + item.id + "/parent", "PATCH", {
                parent_id: categoryId,
            });

            await loadMenu();
            if (isCurrentView(viewId)) await showProducts();
        },
    );
}
