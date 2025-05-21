document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme);
        themeToggleBtn.innerHTML = theme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', theme);

        requestAnimationFrame(() => {
            const heroDividerPath = document.querySelector('#hero .section-divider.hero-divider path');
            const aboutSection = document.getElementById('about');
            if (heroDividerPath && aboutSection) {
                heroDividerPath.setAttribute('fill', window.getComputedStyle(aboutSection).backgroundColor);
            }

            const aboutDividerPath = document.querySelector('#about .section-divider.about-divider path');
            const skillsSectionForAboutDivider = document.getElementById('skills');
            if (aboutDividerPath && skillsSectionForAboutDivider) {
                aboutDividerPath.setAttribute('fill', window.getComputedStyle(skillsSectionForAboutDivider).backgroundColor);
            }
            
            const eduDividerTopPath = document.querySelector('#experience .section-divider.experience-divider-top path');
            const skillsSectionForEduTop = document.getElementById('skills');
            if (eduDividerTopPath && skillsSectionForEduTop) {
                eduDividerTopPath.setAttribute('fill', window.getComputedStyle(skillsSectionForEduTop).backgroundColor);
            }

            const eduDividerBottomPath = document.querySelector('#experience .section-divider.experience-divider-bottom path');
            const educationSectionForEduBottom = document.getElementById('education');
            if (eduDividerBottomPath && educationSectionForEduBottom) {
                eduDividerBottomPath.setAttribute('fill', window.getComputedStyle(educationSectionForEduBottom).backgroundColor);
            }

            const projectsDividerTopPath = document.querySelector('#projects .section-divider.projects-divider-top path');
            const educationSectionForProjectsTop = document.getElementById('education');
            if (projectsDividerTopPath && educationSectionForProjectsTop) {
                projectsDividerTopPath.setAttribute('fill', window.getComputedStyle(educationSectionForProjectsTop).backgroundColor);
            }
        });
    };

    let storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
        storedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
    }
    applyTheme(storedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
        applyTheme(newTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { 
            applyTheme(e.matches ? "dark-mode" : "light-mode");
        }
    });

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if(mobileMenuToggle && navLinks){
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });
        navLinks.querySelectorAll('a.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    const navLiAnchors = document.querySelectorAll('#nav-links li a.nav-link');
    function updateActiveLink() {
        let currentSectionId = 'hero';
        const headerHeight = header.offsetHeight || 70; 

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - Math.min(100, window.innerHeight * 0.2); 
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLiAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${currentSectionId}`) {
                a.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink); 

    const taglineElement = document.getElementById('hero-tagline');
    if (taglineElement) {
        const roles = ["Full Stack Developer", "Network Specialist", "Tech Enthusiast"];
        let roleIndex = 0;
        let charIndex = 0;
        let currentText = "";
        let isDeleting = false;

        function typeEffect() {
            currentText = roles[roleIndex];
            const speed = isDeleting ? 60 : 120;
            const baseText = `Seorang <span class="dynamic-role">`;
            const endText = `</span> dari Balikpapan.`;

            if (!isDeleting && charIndex < currentText.length) {
                taglineElement.innerHTML = `${baseText}${currentText.substring(0, charIndex + 1)}${endText}`;
                charIndex++;
            } else if (isDeleting && charIndex > 0) {
                taglineElement.innerHTML = `${baseText}${currentText.substring(0, charIndex - 1)}${endText}`;
                charIndex--;
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) { 
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }
            setTimeout(typeEffect, isDeleting && charIndex === 0 ? 1200 : (isDeleting ? speed : (charIndex === currentText.length ? 2000 : speed)));
        }
        setTimeout(typeEffect, 500);
    }

    const projectSwiper = new Swiper('.project-swiper-container', {
        slidesPerView: 1, 
        spaceBetween: 20, 
        loop: true, 
        grabCursor: true,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
        }
    });

    const projectSlidesImageWrappers = document.querySelectorAll('.project-card-slide .project-image-wrapper');
    projectSlidesImageWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (event) => {
            if (projectSwiper.isDragging || (projectSwiper.touches && Math.abs(projectSwiper.touches.diff) > 10) ) {
                return; 
            }
            if (event.target.closest('.overlay-link')) return;

            const currentDescription = wrapper.querySelector('.project-short-description');
            const isCurrentlyVisible = currentDescription.classList.contains('visible');

            document.querySelectorAll('.project-short-description.visible').forEach(desc => {
                desc.classList.remove('visible');
            });
            
            if (currentDescription && !isCurrentlyVisible) {
                currentDescription.classList.add('visible');
            }
        });
    });

    const backToTopBtn = document.getElementById('back-to-top');
    if(backToTopBtn){
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { 
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const animatedElements = document.querySelectorAll('.scroll-animate, .skill-card, .timeline-item'); 
    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -50px 0px', 
        threshold: 0.1 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible'); 
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedElements.forEach(el => {
        if (!el.classList.contains('scroll-animate')) {
            el.classList.add('scroll-animate'); 
        }
        scrollObserver.observe(el);
    });
});