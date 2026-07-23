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

// === Модальное окно ===
const modal = document.getElementById('modal-calc') as HTMLDivElement | null;
const calcTrigger = document.querySelector('.diagnostic-button__button') as HTMLButtonElement | null;
const adviceTrigger = document.getElementById('consultation-trigger') as HTMLButtonElement | null;
const closeButtons = document.querySelectorAll('[data-close]');

// Все окна
const windows = {
    calc: modal?.querySelector('.modal__window--calc') as HTMLElement | null,
    advice: modal?.querySelector('.modal__window--advice') as HTMLElement | null,
    success: modal?.querySelector('.modal__window--success') as HTMLElement | null,
};

// Функция показа окна
function showWindow(type: 'calc' | 'advice' | 'success') {
    Object.values(windows).forEach((win) => win?.classList.remove('active'));
    const target = windows[type];
    if (target) target.classList.add('active');
}

// Открытие модалки
function openModal(type: 'calc' | 'advice' = 'calc') {
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    showWindow(type);
}

// Закрытие модалки
function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
}

// Триггеры открытия
calcTrigger?.addEventListener('click', () => openModal('calc'));
adviceTrigger?.addEventListener('click', () => openModal('advice'));

// Закрытие по крестику/оверлей
closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal();
    }
});

// === Переключение между окнами ===
const calcSubmit = document.querySelector('.modal__window--calc .modal__submit') as HTMLButtonElement | null;
const adviceSubmit = document.querySelector('.modal__window--advice .modal__submit') as HTMLButtonElement | null;

calcSubmit?.addEventListener('click', (e) => {
    e.preventDefault();
    showWindow('advice');
});

adviceSubmit?.addEventListener('click', (e) => {
    e.preventDefault();
    showWindow('success');
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
            removeBtn.innerHTML = `<svg width="10.33" height="10.33" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.46662 23.932L0 22.4653L10.4994 11.966L0 1.46662L1.46662 0L11.966 10.4994L22.4653 0L23.932 1.46662L13.4326 11.966L23.932 22.4653L22.4653 23.932L11.966 13.4326L1.46662 23.932Z" fill="black"/>
            </svg>`;
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

const burger = document.querySelector('.header__burger') as HTMLButtonElement | null;
const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement | null;
const overlay = document.querySelector('.mobile-menu__overlay') as HTMLElement | null;

if (burger && mobileMenu && overlay) {
    // Открытие/закрытие по бургеру
    burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('header__burger--open');
        burger.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.classList.toggle('mobile-menu--open');
        overlay.classList.toggle('mobile-menu__overlay--open');

        console.log('overlay classes:', overlay.className); // посмотри, добавился ли --open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', () => {
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        overlay.classList.remove('mobile-menu__overlay--open');
        document.body.style.overflow = '';
    });

    // Закрытие по ссылкам внутри меню (если нужно)
    mobileMenu.querySelectorAll('.header__mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('header__burger--open');
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('mobile-menu--open');
            overlay.classList.remove('mobile-menu__overlay--open');
            document.body.style.overflow = '';
        });
    });
}
