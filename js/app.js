document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Dynamic Particle background rendering ---
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.8 + 0.2;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.isHeart = Math.random() > 0.6; 
        }
        update() {
            this.y -= this.speedY;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(214, 175, 55, ${this.opacity})`;
            if (this.isHeart) {
                ctx.fillStyle = `rgba(239, 68, 68, ${this.opacity * 0.6})`;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- 2. Ambient Audio Toggle Mechanics ---
    const musicToggle = document.getElementById("music-toggle");
    const audioTrack = document.getElementById("bg-music");
    let isPlaying = false;

    musicToggle.addEventListener("click", () => {
        if (!isPlaying) {
            audioTrack.play().catch(e => console.log("Audio play deferred setup: ", e));
            musicToggle.querySelector("i").classList.remove("fa-music");
            musicToggle.querySelector("i").classList.add("fa-pause");
        } else {
            audioTrack.pause();
            musicToggle.querySelector("i").classList.remove("fa-pause");
            musicToggle.querySelector("i").classList.add("fa-music");
        }
        isPlaying = !isPlaying;
    });

    // --- 3. Scroll spy highlighting for floating nav and trigger animations ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const scrollObserverOptions = { threshold: 0.25 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
                });
                
                // Active special mosaic trigger if last panel is reached
                if (targetId === "final-farewell") {
                    assembleHeartMosaic();
                }
            }
        });
    }, scrollObserverOptions);

    sections.forEach(section => scrollObserver.observe(section));

    // Element reveal animation on scroll entering view
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Lightbox implementation for Gallery (Zoom Mode) ---
    const galleryModal = document.getElementById("gallery-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeGallery = document.querySelector(".modal-close");

    document.querySelectorAll(".masonry-item img").forEach(img => {
        img.addEventListener("click", (e) => {
            galleryModal.style.display = "flex";
            modalImg.src = e.target.src;
            const captionText = e.target.parentElement.querySelector(".caption");
            modalCaption.innerText = captionText ? captionText.innerText : "";
        });
    });

    closeGallery.addEventListener("click", () => {
        galleryModal.style.display = "none";
    });

    // --- 5. Lightbox implementation for Videos ---
    const videoModal = document.getElementById("video-modal");
    const lightboxVideo = document.getElementById("lightbox-video");
    const closeVideo = document.getElementById("video-close");

    document.querySelectorAll(".video-card").forEach(card => {
        card.addEventListener("click", () => {
            const videoUrl = card.getAttribute("data-video-url");
            if (videoUrl) {
                lightboxVideo.src = videoUrl;
                videoModal.style.display = "flex";
                lightboxVideo.play();
            }
        });
    });

    closeVideo.addEventListener("click", () => {
        videoModal.style.display = "none";
        lightboxVideo.pause();
        lightboxVideo.src = "";
    });

    // Close Modals when clicking outside of contents automatically
    window.addEventListener("click", (e) => {
        if (e.target === galleryModal) galleryModal.style.display = "none";
        if (e.target === videoModal) {
            videoModal.style.display = "none";
            lightboxVideo.pause();
            lightboxVideo.src = "";
        }
    });

    // --- 6. "Extra Special Touch" Heart Mosaic Assembly ---
    const mosaicZone = document.getElementById("mosaic-zone");
    let mosaicBuilt = false;

    // Standard high definition equations sampling to form mathematical coordinates matching a heart shape
    function getHeartPoints(numberOfPoints) {
        let points = [];
        for (let i = 0; i < numberOfPoints; i++) {
            let t = (i / numberOfPoints) * 2 * Math.PI;
            // Parametric Heart formula scales
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            points.push({ x: x * 12, y: -y * 12 }); // Inverted Y coordinates tracking browser coordinate direction orientation
        }
        return points;
    }

    function assembleHeartMosaic() {
        if (mosaicBuilt) return; // Build exactly once per pipeline interaction cycle
        mosaicBuilt = true;

        const structuralSampleImages = [
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=150",
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=150",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=150",
            "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=150",
            "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=150"
        ];

        const targetCoordinates = getHeartPoints(35);
        const centerZoneX = mosaicZone.offsetWidth / 2 - 20;
        const centerZoneY = mosaicZone.offsetHeight / 2 - 20;

        targetCoordinates.forEach((coord, index) => {
            const tile = document.createElement("div");
            tile.className = "mosaic-dot";
            tile.style.backgroundImage = `url('${structuralSampleImages[index % structuralSampleImages.length]}')`;
            
            // Scatter pieces across the viewport to begin with
            tile.style.left = `${Math.random() * 100}%`;
            tile.style.top = `${Math.random() * 100}%`;
            tile.style.transform = `rotate(${Math.random() * 360}deg) scale(0.5)`;
            
            mosaicZone.appendChild(tile);

            // Execute delayed transformation step grid alignment to produce the transition sequence loop
            setTimeout(() => {
                tile.style.left = `${centerZoneX + coord.x}px`;
                tile.style.top = `${centerZoneY + coord.y}px`;
                tile.style.transform = `rotate(0deg) scale(1)`;
            }, 300 + (index * 25));
        });
    }
});