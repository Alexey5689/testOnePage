import '@scss/style.scss';

// DOM элементы
const toggleBtn = document.getElementById('catalog-toggle') as HTMLButtonElement | null;
const dropdown = document.getElementById('catalog-menu') as HTMLDivElement | null;

// Функция закрытия всех подменю второго уровня
function closeAllSubmenus() {
    document.querySelectorAll('.header__submenu--open').forEach((el) => {
        el.classList.remove('header__submenu--open');
        el.setAttribute('aria-hidden', 'true');
        const toggle = document.querySelector(`[aria-controls="${el.id}"]`);
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

if (toggleBtn && dropdown) {
    // Функция открытия/закрытия основного меню
    const toggleMenu = (forceState?: boolean) => {
        const isOpen = forceState ?? dropdown.classList.toggle('header__dropdown--open');
        const expanded = isOpen ? 'true' : 'false';
        toggleBtn.setAttribute('aria-expanded', expanded);
        dropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        // Поворот стрелки
        const arrow = toggleBtn.querySelector('.header__contacts-icon:last-child');
        if (arrow) {
            arrow.classList.toggle('rotated', isOpen);
        }

        // Если закрываем основное меню — закрываем все подменю
        if (!isOpen) {
            closeAllSubmenus();
        }
    };

    // Клик по кнопке каталога
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!toggleBtn.contains(target) && !dropdown.contains(target)) {
            if (dropdown.classList.contains('header__dropdown--open')) {
                toggleMenu(false);
            }
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('header__dropdown--open')) {
            toggleMenu(false);
            toggleBtn.focus();
        }
    });

    // Закрытие при потере фокуса
    dropdown.addEventListener('focusout', (e) => {
        const related = e.relatedTarget as HTMLElement | null;
        if (related && !dropdown.contains(related) && !toggleBtn.contains(related)) {
            toggleMenu(false);
        }
    });
}

// Подменю второго уровня (обработчики кликов)
const submenuToggles = document.querySelectorAll('.header__dropdown-toggle');

submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const submenuId = toggle.getAttribute('aria-controls');
        if (!submenuId) return;

        const submenu = document.getElementById(submenuId);
        if (!submenu) return;

        // Закрываем все другие открытые подменю
        document.querySelectorAll('.header__submenu--open').forEach((el) => {
            if (el.id !== submenuId) {
                el.classList.remove('header__submenu--open');
                el.setAttribute('aria-hidden', 'true');
                const otherToggle = document.querySelector(`[aria-controls="${el.id}"]`);
                if (otherToggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Переключаем текущее подменю
        const isOpen = submenu.classList.toggle('header__submenu--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        submenu.setAttribute('aria-hidden', String(!isOpen));
    });
});

// Модальное окно
const modal = document.getElementById('modal-calc') as HTMLDivElement | null;
const modalTrigger = document.querySelector('.diagnostic-button__button') as HTMLButtonElement | null;
const closeButtons = document.querySelectorAll('[data-close]');

function openModal() {
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // запрещаем скролл
    // Фокус на окно (или на первый инпут)
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
}

function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    // Возвращаем фокус на кнопку
    modalTrigger?.focus();
}

// Открытие по клику на кнопку
modalTrigger?.addEventListener('click', openModal);

// Закрытие по клику на элементы с data-close (оверлей и крестик)
closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeModal);
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal();
    }
});

// === Загрузка файлов ===
const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
const fileList = document.getElementById('fileList') as HTMLDivElement | null;
const dropzone = document.getElementById('fileDropzone') as HTMLDivElement | null;

if (fileInput && fileList && dropzone) {
    const files: File[] = [];

    // Функция рендеринга списка
    function renderFileList() {
        if (!fileList) return; // защита на случай, если элемент исчезнет
        fileList.innerHTML = '';
        if (files.length === 0) return;

        files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'modal__file-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'modal__file-name';
            nameSpan.textContent = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'modal__file-remove';
            removeBtn.type = 'button';
            removeBtn.innerHTML = '&times;';
            removeBtn.setAttribute('aria-label', `Удалить ${file.name}`);

            removeBtn.addEventListener('click', () => {
                files.splice(index, 1);
                renderFileList();
                if (fileInput) fileInput.value = ''; // сброс значения
            });

            item.appendChild(nameSpan);
            item.appendChild(removeBtn);
            fileList.appendChild(item);
        });
    }

    // Обработка выбранных файлов
    function handleFiles(selectedFiles: FileList) {
        for (const file of selectedFiles) {
            files.push(file);
        }
        renderFileList();
    }

    // Обработчик выбора через input
    fileInput.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            handleFiles(target.files);
        }
        if (fileInput) fileInput.value = '';
    });

    // Drag-and-drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const dt = e.dataTransfer;
        if (dt && dt.files.length > 0) {
            handleFiles(dt.files);
        }
    });

    // Клик по зоне — активируем input
    dropzone.addEventListener('click', () => {
        if (fileInput) fileInput.click();
    });
}
