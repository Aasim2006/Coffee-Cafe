document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById("navbar");

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // ==========================================
    // 2. MOBILE MENU DRAWER
    // ==========================================
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        navLinksContainer.classList.toggle("open");

        if (navLinksContainer.classList.contains("open")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });

    // Close mobile menu on clicking links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburgerBtn.classList.remove("active");
            navLinksContainer.classList.remove("open");
            document.body.style.overflow = "";
        });
    });

    // ==========================================
    // 3. ACTIVE NAV LINK ON SCROLL (OBSERVER)
    // ==========================================
    const sections = document.querySelectorAll("section");

    const activeLinkObserverOptions = {
        root: null,
        rootMargin: "-25% 0px -55% 0px", // Focus on center viewport
        threshold: 0
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute("id");

                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, activeLinkObserverOptions);

    sections.forEach(section => {
        if (section.id) activeLinkObserver.observe(section);
    });

    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS (OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

    const revealObserverOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. ANIMATED STATS COUNTERS
    // ==========================================
    const counters = document.querySelectorAll(".counter");

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute("data-target"));
            const decimals = parseInt(counter.getAttribute("data-decimals")) || 0;
            const duration = 2000; // 2 seconds
            let startTime = null;

            const countStep = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quad formula
                const easeProgress = progress * (2 - progress);

                const currentVal = easeProgress * target;
                counter.textContent = currentVal.toFixed(decimals);

                if (progress < 1) {
                    requestAnimationFrame(countStep);
                } else {
                    counter.textContent = target.toFixed(decimals);
                }
            };
            requestAnimationFrame(countStep);
        });
    };

    // Animate stats either on load or via Intersection Observer
    const statsContainer = document.querySelector(".badge-wrap");
    if (statsContainer) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsContainer);
    } else {
        // Fallback
        animateCounters();
    }

    // ==========================================
    // 6. CUSTOMER REVIEWS SLIDER CAROUSEL
    // ==========================================
    const track = document.getElementById("reviews-track");
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("slider-prev-btn");
    const nextBtn = document.getElementById("slider-next-btn");
    const dotsContainer = document.getElementById("reviews-dots");
    const dots = Array.from(dotsContainer.children);

    let currentSlideIndex = 0;
    let autoPlayTimer;

    const updateSlider = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentSlideIndex = index;
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentSlideIndex].classList.add("active");
    };

    const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
            updateSlider(currentSlideIndex + 1);
        }, 5000); // 5 seconds autoplay
    };

    const stopAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    nextBtn.addEventListener("click", () => {
        updateSlider(currentSlideIndex + 1);
        stopAutoPlay();
        startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
        updateSlider(currentSlideIndex - 1);
        stopAutoPlay();
        startAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            updateSlider(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    if (slides.length > 0) {
        startAutoPlay();
    }

    // ==========================================
    // 7. TOAST NOTIFICATION HELPERS
    // ==========================================
    const toast = document.getElementById("toast-notification");
    const toastTitle = document.getElementById("toast-title");
    const toastMessage = document.getElementById("toast-message");
    let toastTimer;

    const showToast = (title, message) => {
        toast.classList.remove("show");
        clearTimeout(toastTimer);

        setTimeout(() => {
            toastTitle.textContent = title;
            toastMessage.textContent = message;
            toast.classList.add("show");

            toastTimer = setTimeout(() => {
                toast.classList.remove("show");
            }, 4000);
        }, 100);
    };

    // ==========================================
    // 8. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("contact-name").value.trim();

            // Trigger toast success
            showToast(
                "Message Sent!",
                `Thank you, ${name}! Your inquiry has been sent successfully. We'll contact you soon!`
            );

            contactForm.reset();
        });
    }

    // ==========================================
    // 9. FLOATING BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById("back-to-top-btn");

    const handleScrollToTopBtn = () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    };

    window.addEventListener("scroll", handleScrollToTopBtn);

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});