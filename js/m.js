document.addEventListener("DOMContentLoaded", () => {
    
    const body = document.body;
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("theme-toggle-checkbox");
    const musicToggle = document.getElementById("music-toggle");
    const musicIcon = document.getElementById("music-icon");
    const audio = document.getElementById("bgm");
    const backToTopBtn = document.getElementById("back-to-top");

    // ✨ JSON কন্টেইনার ভেরিয়েবল আবার যোগ করা হয়েছে
    const jsonContainer = document.getElementById("json-data");

    const toggleMenu = () => {
        body.classList.toggle("menu-open");
    };
    menuToggle.addEventListener("click", toggleMenu);

    const smoothScrollTo = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            let elementPosition = targetElement.getBoundingClientRect().top;
            let offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            if (targetId === '#home') {
                offsetPosition = 0;
            }

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            smoothScrollTo(targetId);
            toggleMenu();
        });
    });
    
    document.querySelector('.header-logo').addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#home');
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo('#home');
    });

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            themeToggle.checked = false;
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            themeToggle.checked = true;
        }
    };

    const currentTheme = localStorage.getItem("theme") || 'dark';
    applyTheme(currentTheme);

    themeToggle.addEventListener("change", () => {
        let theme = themeToggle.checked ? "light" : "dark";
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    });

    const musicState = localStorage.getItem("music") === "on";
    if (musicState) {
    }
    musicToggle.addEventListener("click", () => {
        if (audio.paused) {
            audio.play().catch(e => console.log("Audio play failed."));
            musicToggle.classList.add("playing");
            musicIcon.classList.replace("fa-music", "fa-pause");
            localStorage.setItem("music", "on");
        } else {
            audio.pause();
            musicToggle.classList.remove("playing");
            musicIcon.classList.replace("fa-pause", "fa-music");
            localStorage.setItem("music", "off");
        }
    });


    const userData = {
        "username": "jubairbro",
        "name": "Jubair Ahmad",
        "age": 20,
        "profession": "Student",
        "location": { "city": "Netrokona", "country": "Bangladesh" },
        "interests": ["Tech", "Programming", "Gaming", "Photography"],
        "contact": { "telegram": "@Jubairbro_bot", "email": "mdjubair6460@gmail.com" }
    };
    if (jsonContainer) {
        jsonContainer.textContent = JSON.stringify(userData, null, 2);
    }

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
});
