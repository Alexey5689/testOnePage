import '@scss/style.scss';

const toggleBtn = document.getElementById('catalog-toggle') as HTMLButtonElement | null;
const dropdown = document.getElementById('catalog-menu') as HTMLDivElement | null;

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
    const toggleMenu = (forceState?: boolean) => {
        const isOpen = forceState ?? dropdown.classList.toggle('header__dropdown--open');
        const expanded = isOpen ? 'true' : 'false';
        toggleBtn.setAttribute('aria-expanded', expanded);
        dropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

        const arrow = toggleBtn.querySelector('.header__contacts-icon:last-child');
        if (arrow) {
            arrow.classList.toggle('rotated', isOpen);
        }

        if (!isOpen) {
            closeAllSubmenus();
        }
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!toggleBtn.contains(target) && !dropdown.contains(target)) {
            if (dropdown.classList.contains('header__dropdown--open')) {
                toggleMenu(false);
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('header__dropdown--open')) {
            toggleMenu(false);
            toggleBtn.focus();
        }
    });

    dropdown.addEventListener('focusout', (e) => {
        const related = e.relatedTarget as HTMLElement | null;
        if (related && !dropdown.contains(related) && !toggleBtn.contains(related)) {
            toggleMenu(false);
        }
    });
}

const submenuToggles = document.querySelectorAll('.header__dropdown-toggle');

submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const submenuId = toggle.getAttribute('aria-controls');
        if (!submenuId) return;

        const submenu = document.getElementById(submenuId);
        if (!submenu) return;

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

        const isOpen = submenu.classList.toggle('header__submenu--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        submenu.setAttribute('aria-hidden', String(!isOpen));
    });
});

const modal = document.getElementById('modal-calc') as HTMLDivElement | null;
const calcTrigger = document.querySelector('.diagnostic-button__button') as HTMLButtonElement | null;
const adviceTrigger = document.getElementById('consultation-trigger') as HTMLButtonElement | null;
const closeButtons = document.querySelectorAll('[data-close]');

const windows = {
    calc: modal?.querySelector('.modal__window--calc') as HTMLElement | null,
    advice: modal?.querySelector('.modal__window--advice') as HTMLElement | null,
    success: modal?.querySelector('.modal__window--success') as HTMLElement | null,
};

function showWindow(type: 'calc' | 'advice' | 'success') {
    Object.values(windows).forEach((win) => win?.classList.remove('active'));
    const target = windows[type];
    if (target) target.classList.add('active');
}

function openModal(type: 'calc' | 'advice' = 'calc') {
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    showWindow(type);
}

function closeModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
}

calcTrigger?.addEventListener('click', () => openModal('calc'));
adviceTrigger?.addEventListener('click', () => openModal('advice'));

closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
        closeModal();
    }
});

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

const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
const fileList = document.getElementById('fileList') as HTMLDivElement | null;
const dropzone = document.getElementById('fileDropzone') as HTMLDivElement | null;

if (fileInput && fileList && dropzone) {
    const files: File[] = [];

    // Функция рендеринга списка
    function renderFileList() {
        if (!fileList) return;
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
                if (fileInput) fileInput.value = '';
            });

            item.appendChild(nameSpan);
            item.appendChild(removeBtn);
            fileList.appendChild(item);
        });
    }

    function handleFiles(selectedFiles: FileList) {
        for (const file of selectedFiles) {
            files.push(file);
        }
        renderFileList();
    }

    fileInput.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            handleFiles(target.files);
        }
        if (fileInput) fileInput.value = '';
    });

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

    dropzone.addEventListener('click', () => {
        if (fileInput) fileInput.click();
    });
}

const catalogToggle = document.querySelector('.mobile-menu__button') as HTMLButtonElement | null;
const catalogSubmenu = document.getElementById('mobile-submenu-catalog') as HTMLElement | null;

if (catalogToggle && catalogSubmenu) {
    catalogToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        const isOpen = catalogSubmenu.classList.toggle('mobile-menu__submenu--open');
        catalogToggle.setAttribute('aria-expanded', String(isOpen));
        catalogSubmenu.setAttribute('aria-hidden', String(!isOpen));
    });
}

const subToggles = document.querySelectorAll('.mobile-menu__subtoggle');

subToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = toggle.getAttribute('aria-controls');
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;

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

        const isOpen = target.classList.toggle('mobile-menu__submenu-level2--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        target.setAttribute('aria-hidden', String(!isOpen));
    });
});

const burger = document.querySelector('.header__burger') as HTMLButtonElement | null;
const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement | null;
const overlay = document.querySelector('.mobile-menu__overlay') as HTMLElement | null;
const closeBtn = document.querySelector('.mobile-menu__close-btn') as HTMLButtonElement | null;

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
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('header__burger--open');
        burger.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            closeAllMobileSubmenus();
        }

        mobileMenu.classList.toggle('mobile-menu--open');
        overlay.classList.toggle('mobile-menu__overlay--open');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        overlay.classList.remove('mobile-menu__overlay--open');
        closeAllMobileSubmenus();
        document.body.style.overflow = '';
    });

    closeBtn?.addEventListener('click', () => {
        burger.classList.remove('header__burger--open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('mobile-menu--open');
        overlay.classList.remove('mobile-menu__overlay--open');
        closeAllMobileSubmenus();
        document.body.style.overflow = '';
    });

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
