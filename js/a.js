document.addEventListener('preloaderFinished', () => {
    
    gsap.registerPlugin(ScrollTrigger);

    const revealLeft = document.querySelectorAll(".gsap-reveal-left");
    revealLeft.forEach((elem) => {
        gsap.from(elem, {
            opacity: 0,
            x: -100,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }
        });
    });

    const revealRight = document.querySelectorAll(".gsap-reveal-right");
    revealRight.forEach((elem) => {
        gsap.from(elem, {
            opacity: 0,
            x: 100,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }
        });
    });

    const revealUp = document.querySelectorAll(".gsap-reveal-up");
    revealUp.forEach((elem) => {
        gsap.from(elem, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: parseFloat(elem.dataset.delay) || 0,
            ease: "power2.out",
            scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" }
        });
    });

    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
    });
});
