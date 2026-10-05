let draggedItem = null;
let moveBusy = false;

function moveNotice(message, error = false) {
    let notice = find('#move-notice');
    if (!notice) {
        notice = document.createElement('p');
        notice.id = 'move-notice';
        notice.setAttribute('role', 'status');
        find('#main').prepend(notice);
    }
    notice.className = error ? 'notice error' : 'notice';
    notice.textContent = t(message);
}

function clearDrag() {
    draggedItem = null;
    document.querySelectorAll('.dragging, .drop-active').forEach(element => {
        element.classList.remove('dragging', 'drop-active');
    });
}

function addDragHandle(container, kind, id) {
    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    if (kind === 'product') handle.classList.add('product-drag-handle');
    handle.textContent = '⠿ ' + t('Քաշիր այստեղից');
    handle.draggable = true;
    handle.title = t('Քաշիր այստեղից');
    handle.addEventListener('dragstart', event => {
        if (moveBusy) {
            event.preventDefault();
            return;
        }
        draggedItem = { kind, id: Number(id) };
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', kind + ':' + id);
        container.classList.add('dragging');
    });
    handle.addEventListener('dragend', clearDrag);
    container.prepend(handle);
}

function makeDropTarget(element, kind, targetId, position) {
    element.addEventListener('dragover', event => {
        if (moveBusy || !draggedItem || draggedItem.kind !== kind) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        element.classList.add('drop-active');
    });
    element.addEventListener('dragleave', () => element.classList.remove('drop-active'));
    element.addEventListener('drop', async event => {
        if (moveBusy || !draggedItem || draggedItem.kind !== kind) return;
        event.preventDefault();
        event.stopPropagation();
        const source = draggedItem;
        clearDrag();
        if (kind === 'menu' && source.id === Number(targetId)) return;
        const data = new FormData();
        data.set('id', source.id);
        data.set('target_id', targetId);
        data.set('position', position);
        moveBusy = true;
        moveNotice('Պահպանվում է…');
        try {
            await api(kind === 'menu' ? '/menu/move' : '/product/move', data);
            await showMenu();
            if (kind === 'menu') await adminPage();
            else await allProducts();
            moveNotice('Տեղափոխումը պահպանված է։');
        } catch (error) {
            moveNotice(error.message, true);
        } finally {
            moveBusy = false;
        }
    });
}

