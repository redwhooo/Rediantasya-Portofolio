document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav-link");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const heroImg = document.querySelector(".hero-right img");
    const typingSpan = document.getElementById("typing-text");
    const carousels = document.querySelectorAll(".carousel");
    const contactForm = document.querySelector("form");
    const clickableCards = document.querySelectorAll(".clickable-card");
    const sections = document.querySelectorAll("section");
    const aboutCards = document.querySelectorAll(".about-card");

    let aboutRevealedByScroll = false;

    function init() {
        resetScrollOnRefresh();
        setupEventListeners();
        initTypingEffect();
        initCarousels();
        initScrollAnimations();
        initModal();
    }

    function resetScrollOnRefresh() {
        if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
        }
        setTimeout(() => window.scrollTo(0, 0), 50);
    }

    function setupEventListeners() {
        navLinks.forEach(link => link.addEventListener("click", handleNavClick));

        if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));
        }

        if (heroImg) {
        heroImg.addEventListener("mousemove", followCursor);
        heroImg.addEventListener("mouseleave", () => {
            heroImg.style.transform = "translate(0, 0) scale(1)";
        });
        }

        if (contactForm) {
        contactForm.addEventListener("submit", handleFormSubmit);
        }
    }

    function handleNavClick(e) {
        if (this.hasAttribute("download")) return; 

        e.preventDefault();
        const href = this.getAttribute("href");
        const target = document.querySelector(href);

        if (target) {
        const offsetTop = target.offsetTop - 70; 
        window.scrollTo({ top: offsetTop, behavior: "smooth" });

        if (href === "#about") {
            revealAboutCards(true);
        }
        }

        if (navMenu && navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        }
    }

    function initTypingEffect() {
        if (!typingSpan) return;

        const texts = [
        "Informatics Student, Faculty of Computer Science UNEJ",
        "Publishing Division of UKM-P Binary"
        ];
        const typingSpeed = 80;
        const pauseTime = 1500;
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeLoop() {
        const currentText = texts[textIndex];
        let delay = typingSpeed;

        if (isDeleting) {
            typingSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            delay = pauseTime;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(typeLoop, delay);
        }
        typeLoop();
    }

    function initCarousels() {
        carousels.forEach(carousel => {
        const parent = carousel.parentElement;
        const btnLeft = parent?.querySelector(".carousel-btn.left");
        const btnRight = parent?.querySelector(".carousel-btn.right");
        if (!btnLeft || !btnRight) return;

        const getScrollAmount = () => {
            const card = carousel.querySelector(".card");
            return card ? card.offsetWidth + 20 : carousel.clientWidth; 
        };

        btnRight.addEventListener("click", () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });

        btnLeft.addEventListener("click", () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });
        });
    }

    function initScrollAnimations() {
        window.revealAboutCards = function(force = false) {
        if (!aboutCards.length || (aboutRevealedByScroll && !force)) return;

        aboutCards.forEach((card, i) => {
            setTimeout(() => card.classList.add("show-about-card"), i * 150);
        });

        aboutRevealedByScroll = true;
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            entry.target.classList.add("show-section");
            if (entry.target.id === "about") {
                revealAboutCards();
            }
            } else {
            entry.target.classList.remove("show-section"); 
            }
        });
        }, { rootMargin: "0px", threshold: 0.15 });

        sections.forEach(section => sectionObserver.observe(section));
    }

    function followCursor(e) {
        const rect = heroImg.getBoundingClientRect();
        const moveX = (e.clientX - rect.left - rect.width / 2) * 0.05;
        const moveY = (e.clientY - rect.top - rect.height / 2) * 0.05;
        heroImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        let status = form.querySelector(".form-status");
        if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        form.appendChild(status);
        }

        try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { "Accept": "application/json" },
        });

        if (response.ok) {
            status.textContent = "Message sent successfully!";
            status.style.color = "green";
            form.reset();
        } else {
            throw new Error("Gagal mengirim pesan.");
        }
        } catch (error) {
        status.textContent = "Oops, terjadi kesalahan. ❌";
        status.style.color = "red";
        }
    }

    function initModal() {
        const modalOverlay = document.getElementById("projectModalOverlay");
        if (!modalOverlay) return;

        const modalContent = {
        title: document.getElementById("modalTitle"),
        image: document.getElementById("modalImage"),
        description: document.getElementById("modalDescription"),
        github: {
            container: document.getElementById("modalGithubContainer"),
            link: document.getElementById("modalGithubLink"),
        },
        live: {
            container: document.getElementById("modalLiveContainer"),
            link: document.getElementById("modalLiveLink"),
        },
        };

        const closeModalButton = document.querySelector(".modal-close");

        const openModal = (card) => {
        const data = {
            title: card.dataset.title,
            description: card.dataset.description,
            image: card.dataset.image,
            githubUrl: card.dataset.githubUrl,
            liveUrl: card.dataset.liveUrl,
        };

        modalContent.title.textContent = data.title;
        modalContent.image.src = data.image;
        modalContent.description.textContent = data.description;

        if (data.githubUrl) {
            modalContent.github.link.href = data.githubUrl;
            modalContent.github.link.textContent = data.githubUrl.replace('https://', '');
            modalContent.github.container.style.display = "block";
        } else {
            modalContent.github.container.style.display = "none";
        }

        if (data.liveUrl) {
            modalContent.live.link.href = data.liveUrl;
            modalContent.live.link.textContent = "Website Compiler";
            modalContent.live.container.style.display = "block";
        } else {
            modalContent.live.container.style.display = "none";
        }

        modalOverlay.style.display = "flex";
        };

        const closeModal = () => {
        modalOverlay.style.display = "none";
        };

        clickableCards.forEach(card => card.addEventListener("click", () => openModal(card)));
        closeModalButton.addEventListener("click", closeModal);
        modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
        });
    }

    init();
    });