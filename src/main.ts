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

// const burger = document.querySelector('.header__burger') as HTMLButtonElement | null;
// const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement | null;
// const overlay = document.querySelector('.mobile-menu__overlay') as HTMLElement | null;
// const closeBtn = document.querySelector('.mobile-menu__close-btn') as HTMLButtonElement | null;

// if (burger && mobileMenu && overlay) {
//     mobileMenu.addEventListener('click', (e) => {
//         e.stopPropagation();
//     });

//     // Открытие/закрытие по бургеру
//     burger.addEventListener('click', () => {
//         const isOpen = burger.classList.toggle('header__burger--open');
//         burger.setAttribute('aria-expanded', String(isOpen));
//         mobileMenu.classList.toggle('mobile-menu--open');
//         overlay.classList.toggle('mobile-menu__overlay--open');
//         document.body.style.overflow = isOpen ? 'hidden' : '';
//     });

//     // Закрытие по клику на оверлей
//     overlay.addEventListener('click', () => {
//         burger.classList.remove('header__burger--open');
//         burger.setAttribute('aria-expanded', 'false');
//         mobileMenu.classList.remove('mobile-menu--open');
//         overlay.classList.remove('mobile-menu__overlay--open');
//         document.body.style.overflow = '';
//     });

//     // Закрытие по кнопке закрытия
//     closeBtn?.addEventListener('click', () => {
//         burger.classList.remove('header__burger--open');
//         burger.setAttribute('aria-expanded', 'false');
//         mobileMenu.classList.remove('mobile-menu--open');
//         overlay.classList.remove('mobile-menu__overlay--open');
//         document.body.style.overflow = '';
//     });

//     // Закрытие по ссылкам внутри меню (если нужно)
//     mobileMenu.querySelectorAll('.header__mobile-link').forEach((link) => {
//         link.addEventListener('click', () => {
//             burger.classList.remove('header__burger--open');
//             burger.setAttribute('aria-expanded', 'false');
//             mobileMenu.classList.remove('mobile-menu--open');
//             overlay.classList.remove('mobile-menu__overlay--open');
//             document.body.style.overflow = '';
//         });
//     });
// }

// === Мобильное подменю ===

// const mobileToggles = document.querySelectorAll('.mobile-menu__button, .mobile-menu__subtoggle');

// mobileToggles.forEach((toggle) => {
//     toggle.addEventListener('click', (e) => {
//         e.stopPropagation();

//         const targetId = toggle.getAttribute('aria-controls');
//         if (!targetId) return;
//         const target = document.getElementById(targetId);
//         if (!target) return;

//         // Закрываем другие открытые подменю того же уровня
//         const isSub = toggle.classList.contains('mobile-menu__subtoggle');
//         const parent = toggle.closest('.mobile-menu__item, .mobile-menu__subitem');
//         if (parent) {
//             const siblings = isSub
//                 ? parent.querySelectorAll('.mobile-menu__submenu-level2--open')
//                 : parent.querySelectorAll('.mobile-menu__submenu--open');
//             siblings.forEach((el) => {
//                 if (el !== target) {
//                     el.classList.remove('mobile-menu__submenu--open', 'mobile-menu__submenu-level2--open');
//                     const btn = document.querySelector(`[aria-controls="${el.id}"]`);
//                     if (btn) btn.setAttribute('aria-expanded', 'false');
//                 }
//             });
//         }

//         // Явно проверяем, открыто ли подменю
//         const isOpen =
//             target.classList.contains('mobile-menu__submenu--open') ||
//             target.classList.contains('mobile-menu__submenu-level2--open');

//         if (isOpen) {
//             // Закрываем
//             target.classList.remove('mobile-menu__submenu--open', 'mobile-menu__submenu-level2--open');
//             toggle.setAttribute('aria-expanded', 'false');
//             target.setAttribute('aria-hidden', 'true');
//         } else {
//             // Открываем
//             target.classList.add('mobile-menu__submenu--open');
//             toggle.setAttribute('aria-expanded', 'true');
//             target.setAttribute('aria-hidden', 'false');
//         }
//     });
// });
// === Кнопка "Каталог услуг" (первый уровень) ===
const catalogToggle = document.querySelector('.mobile-menu__button') as HTMLButtonElement | null;
const catalogSubmenu = document.getElementById('mobile-submenu-catalog') as HTMLElement | null;

if (catalogToggle && catalogSubmenu) {
    catalogToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Переключаем класс открытия
        const isOpen = catalogSubmenu.classList.toggle('mobile-menu__submenu--open');
        catalogToggle.setAttribute('aria-expanded', String(isOpen));
        catalogSubmenu.setAttribute('aria-hidden', String(!isOpen));
    });
}

// === Подменю второго уровня (лаборатории) ===
const subToggles = document.querySelectorAll('.mobile-menu__subtoggle');

subToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = toggle.getAttribute('aria-controls');
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;

        // Закрываем другие открытые подменю второго уровня (опционально)
        const parent = toggle.closest('.mobile-menu__subitem');
        if (parent) {
            parent.querySelectorAll('.mobile-menu__submenu-level2--open').forEach((el) => {
                if (el !== target) {
                    el.classList.remove('mobile-menu__submenu-level2--open');
                    const btn = document.querySelector(`[aria-controls="${el.id}"]`);
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Переключаем текущее подменю
        const isOpen = target.classList.toggle('mobile-menu__submenu-level2--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        target.setAttribute('aria-hidden', String(!isOpen));
    });
});

const burger = document.querySelector('.header__burger') as HTMLButtonElement | null;
const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement | null;
const overlay = document.querySelector('.mobile-menu__overlay') as HTMLElement | null;
const closeBtn = document.querySelector('.mobile-menu__close-btn') as HTMLButtonElement | null;

// Функция закрытия всех подменю в мобильном меню
function closeAllMobileSubmenus() {
    const submenus = document.querySelectorAll('.mobile-menu__submenu--open, .mobile-menu__submenu-level2--open');
    submenus.forEach((el) => {
        el.classList.remove('mobile-menu__submenu--open', 'mobile-menu__submenu-level2--open');
        const toggle = document.querySelector(`[aria-controls="${el.id}"]`);
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            el.setAttribute('aria-hidden', 'true');
        }
    });
}

if (burger && mobileMenu && overlay) {
    // Останавливаем всплытие кликов внутри меню, чтобы они не закрывали его
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Открытие/закрытие по бургеру
    burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('header__burger--open');
        burger.setAttribute('aria-expanded', String(isOpen));

        // Если открываем меню — сбрасываем все подменю
        if (isOpen) {
            closeAllMobileSubmenus();
        }

        mobileMenu.classList.toggle('mobile-menu--open');
        overlay.classList.toggle('mobile-menu__overlay--open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', () => {
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        overlay.classList.remove('mobile-menu__overlay--open');
        closeAllMobileSubmenus();
        document.body.style.overflow = '';
    });

    // Закрытие по кнопке закрытия
    closeBtn?.addEventListener('click', () => {
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        overlay.classList.remove('mobile-menu__overlay--open');
        closeAllMobileSubmenus();
        document.body.style.overflow = '';
    });

    // Закрытие по ссылкам внутри меню (если есть)
    mobileMenu.querySelectorAll('.header__mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('header__burger--open');
            burger.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('mobile-menu--open');
            overlay.classList.remove('mobile-menu__overlay--open');
            closeAllMobileSubmenus();
            document.body.style.overflow = '';
        });
    });
}
