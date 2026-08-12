// Target Date for Sihyeon's 1st Birthday: October 9, 2026, 12:00 PM (KST)
const TARGET_DATE = new Date("2026-10-09T12:00:00+09:00");

// Timeline Image Sources
const TIMELINE_IMAGES = {
    '1days': [
        'assets/cover.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '50days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '100days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '150days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '200days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '250days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '300days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
    '350days': [
        'assets/gallery1.jpg',
        'assets/gallery2.jpg',
        'assets/gallery3.jpg'
    ],
};
let currentCategory = '';
let currentLightboxIndex = 0;

// 인앱 브라우저 스크롤 완전 차단을 위한 이벤트 방지 함수
function preventDefaultScroll(e) {
    e.preventDefault();
}

// 스크롤 잠금 함수 (터치 및 휠 이벤트 차단)
function lockScroll() {
    document.body.classList.add("scroll-locked");
    // 모바일 터치 이동 및 마우스 휠 스크롤 강제 차단
    window.addEventListener("touchmove", preventDefaultScroll, { passive: false });
    window.addEventListener("wheel", preventDefaultScroll, { passive: false });
}

// 스크롤 해제 함수
function unlockScroll() {
    document.body.classList.remove("scroll-locked");
    // 이벤트 리스너 제거하여 스크롤 복구
    window.removeEventListener("touchmove", preventDefaultScroll);
    window.removeEventListener("wheel", preventDefaultScroll);
}

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
    // 0. Lock scroll if intro overlay is present and schedule auto-exit
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        lockScroll(); // 강화된 스크롤 잠금 실행

        setTimeout(() => {
            enterInvitation();
        }, 2000); // 인트로 대기 시간
    }

    // 1. Setup dynamic scroll-fade elements
    setupScrollFadeElements();

    // 2. Start D-day countdown
    initCountdown();

    // 3. Setup Scroll Animations
    initScrollAnimations();

    // 4. Render Guestbook Messages
    renderGuestbook();

    // 5. Set D-day badge value on cover
    updateDDayBadge();
});

// ==========================================
// 0. WELCOME INTRO OVERLAY TRANSITION
// ==========================================
function enterInvitation() {
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        overlay.classList.add("fade-out");

        unlockScroll(); // 스크롤 잠금 해제

        // Trigger the elegant confetti/petal entrance effect
        triggerEntranceConfetti();

        // Let it fade out completely before display: none
        setTimeout(() => {
            overlay.style.display = "none";
        }, 800); // matches CSS transition duration
    }
}

// ==========================================
// 1. D-DAY COUNTDOWN TIMER
// ==========================================
function updateDDayBadge() {
    const now = new Date();
    const timeDiff = TARGET_DATE - now;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const badge = document.getElementById("dday-badge");

    if (badge) {
        if (days > 0) {
            badge.innerText = `D-${days}`;
        } else if (days === 0) {
            badge.innerText = `D-Day`;
        } else {
            badge.innerText = `D+${Math.abs(days)}`;
        }
    }
}

function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateTimer() {
        const now = new Date();
        const difference = TARGET_DATE - now;

        if (difference <= 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = d.toString().padStart(2, "0");
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, "0");
        if (minutesEl) minutesEl.innerText = m.toString().padStart(2, "0");
        if (secondsEl) secondsEl.innerText = s.toString().padStart(2, "0");
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// ==========================================
// 2. SCROLL REVEAL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".scroll-fade");

    const observerOptions = {
        root: null,
        rootMargin: "-8% 0px -8% 0px", // Triggers when the section is slightly inside the viewport
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Keep visible permanently once revealed
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}

// ==========================================
// 3. PHOTO GALLERY LIGHTBOX
// ==========================================
function openLightbox(category, index = 0) {
    if (!GALLERY_IMAGES[category] || GALLERY_IMAGES[category].length === 0) return;

    currentCategory = category;
    currentLightboxIndex = index;

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightboxImg.src = GALLERY_IMAGES[currentCategory][currentLightboxIndex];
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeLightbox(event) {
    // Closes lightbox if clicking backdrop, close symbol or backdrop container
    if (!event || event.target.id === "lightbox" || event.target.className === "lightbox-close" || event.type === "submit") {
        const lightbox = document.getElementById("lightbox");
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function navigateLightbox(direction, event) {
    if (event) event.stopPropagation(); // Avoid triggering closeLightbox

    const images = GALLERY_IMAGES[currentCategory];
    if (!images) return;

    currentLightboxIndex += direction;
    if (currentLightboxIndex >= images.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = images.length - 1;
    }

    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = images[currentLightboxIndex];
}

document.addEventListener('DOMContentLoaded', function () {
    const timelineSwipers = document.querySelectorAll('.timelineSwiper');

    timelineSwipers.forEach(function (swiperContainer) {
        // HTML의 data-category 속성값 읽기 (예: '1days', '50days')
        const category = swiperContainer.getAttribute('data-category');
        const wrapper = swiperContainer.querySelector('.swiper-wrapper');

        // 해당 카테고리의 이미지 배열이 존재할 경우 슬라이드 HTML 자동 생성
        if (TIMELINE_IMAGES[category] && wrapper) {
            TIMELINE_IMAGES[category].forEach(function (imgSrc, index) {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                slide.innerHTML = `<img src="${imgSrc}" alt="${category} 사진 ${index + 1}">`;
                wrapper.appendChild(slide);
            });
        }

        // 이미지 생성이 끝난 후 Swiper 슬라이더 초기화
        new Swiper(swiperContainer, {
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: swiperContainer.querySelector('.swiper-pagination'),
                clickable: true,
            },
            speed: 500,
        });
    });
});

// ==========================================
// 4. ACCORDION (ACCOUNT INFO)
// ==========================================
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const item = content.parentElement;

    // Close other items (optional, but makes layout cleaner)
    const allItems = document.querySelectorAll(".accordion-item");
    allItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherContent = otherItem.querySelector(".accordion-content");
            otherContent.style.maxHeight = null;
        }
    });

    if (item.classList.contains("active")) {
        item.classList.remove("active");
        content.style.maxHeight = null;
    } else {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// ==========================================
// 5. RSVP FORM MODAL
// ==========================================
function openRSVPModal() {
    const modal = document.getElementById("rsvp-modal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeRSVPModal(event) {
    if (event.target.id === "rsvp-modal" || event.target.className === "modal-close") {
        const modal = document.getElementById("rsvp-modal");
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById("rsvp-name").value.trim();
    const status = document.querySelector('input[name="rsvp-status"]:checked').value;
    const count = document.getElementById("rsvp-count").value;
    const memo = document.getElementById("rsvp-memo").value.trim();

    if (!name) {
        showToast("성함을 입력해주세요.");
        return;
    }

    // Mock save RSVP to localStorage
    const rsvpData = {
        name,
        status,
        count,
        memo,
        date: new Date().toISOString()
    };

    let rsvps = JSON.parse(localStorage.getItem("sihyeon_rsvps") || "[]");
    rsvps.push(rsvpData);
    localStorage.setItem("sihyeon_rsvps", JSON.stringify(rsvps));

    // UI response
    showToast(`${name}님의 참석 정보가 등록되었습니다. 감사합니다!`);

    // Clear and close
    document.getElementById("rsvp-form").reset();
    const modal = document.getElementById("rsvp-modal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// ==========================================
// RSVP FORM MODAL (Google Forms 연동)
// ==========================================
function openRSVPModal() {
    const modal = document.getElementById("rsvp-modal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeRSVPModal(event) {
    if (event.target.id === "rsvp-modal" || event.target.className === "modal-close") {
        const modal = document.getElementById("rsvp-modal");
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function submitRSVP(event) {
    event.preventDefault();

    const name = document.getElementById("rsvp-name").value.trim();
    const statusObj = document.querySelector('input[name="rsvp-status"]:checked');
    const status = statusObj ? statusObj.value : "참석";
    const count = document.getElementById("rsvp-count").value;
    const memo = document.getElementById("rsvp-memo").value.trim();

    if (!name) {
        if (typeof showToast === "function") showToast("성함을 입력해주세요.");
        else alert("성함을 입력해주세요.");
        return;
    }

    // -------------------------------------------------------------
    // [설정 영역] 본인의 Google Form 정보로 수정해주세요!
    // -------------------------------------------------------------
    // 1. Google Form Response URL (끝이 /formResponse 로 끝나야 합니다)
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1E1OXrw63VHU9F03waQBtLyfNZM5z90rQgJWZWBJzb1s/formResponse";

    // 2. Google Form 각 필드의 entry ID
    const formData = new FormData();
    formData.append("entry.580033275", name);   // 성함 질문 entry ID
    formData.append("entry.2002034326", status); // 참석여부 질문 entry ID
    formData.append("entry.1910724404", count);  // 동반인원 질문 entry ID
    formData.append("entry.1171485198", memo);   // 메모 질문 entry ID
    // -------------------------------------------------------------

    const submitBtn = document.getElementById("rsvp-submit-btn");
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "전송 중...";
    }

    // Google Form 백그라운드 무응답 전송 (CORS 우회)
    fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    })
        .then(() => {
            if (typeof showToast === "function") {
                showToast(`${name}님의 참석 정보가 등록되었습니다. 감사합니다!`);
            } else {
                alert(`${name}님의 참석 정보가 등록되었습니다. 감사합니다!`);
            }

            // 폼 초기화 및 모달 닫기
            document.getElementById("rsvp-form").reset();
            const modal = document.getElementById("rsvp-modal");
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        })
        .catch((error) => {
            console.error("RSVP 전송 에러:", error);
            alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = "전송하기";
            }
        });
}

// ==========================================
// 6. GUESTBOOK SYSTEM (LOCALSTORAGE)
// ==========================================
function submitGuestbook(event) {
    event.preventDefault();

    const nameEl = document.getElementById("gb-name");
    const messageEl = document.getElementById("gb-message");

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();

    if (!name || !message) {
        showToast("모든 항목을 입력해주세요.");
        return;
    }

    const newMsg = {
        id: Date.now().toString(),
        name,
        message,
        date: new Date().toLocaleString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    };

    let messages = JSON.parse(localStorage.getItem("sihyeon_guestbook") || "[]");
    messages.unshift(newMsg); // Add new message to the top
    localStorage.setItem("sihyeon_guestbook", JSON.stringify(messages));

    // Reset Form
    nameEl.value = "";
    messageEl.value = "";

    showToast("축하 메시지가 등록되었습니다.");
    renderGuestbook();
}

function renderGuestbook() {
    const listContainer = document.getElementById("guestbook-list");
    if (!listContainer) return;

    let messages = JSON.parse(localStorage.getItem("sihyeon_guestbook") || "[]");

    if (messages.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-guestbook" style="text-align: center; padding: 30px; color: var(--text-sub); font-size: 0.85rem;">
                첫 번째 축하 메시지를 남겨보세요 🌸
            </div>
        `;
        return;
    }

    listContainer.innerHTML = messages.map(msg => `
        <div class="gb-item" id="gb-item-${msg.id}">
            <div class="gb-item-header">
                <span class="gb-item-name">${escapeHTML(msg.name)}</span>
                <span class="gb-item-date">${msg.date}</span>
            </div>
            <div class="gb-item-message">${escapeHTML(msg.message)}</div>
            <button class="gb-delete-btn" onclick="deleteGuestbook('${msg.id}')">삭제</button>
        </div>
    `).join("");
}

function deleteGuestbook(id) {
    let messages = JSON.parse(localStorage.getItem("sihyeon_guestbook") || "[]");
    const targetMsg = messages.find(msg => msg.id === id);

    if (!targetMsg) return;

    if (confirm("이 방명록 글을 삭제하시겠습니까?")) {
        messages = messages.filter(msg => msg.id !== id);
        localStorage.setItem("sihyeon_guestbook", JSON.stringify(messages));
        showToast("메시지가 삭제되었습니다.");
        renderGuestbook();
    }
}

// Helper: Escape HTML strings to prevent XSS
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// 7. HELPER: CLIPBOARD COPY
// ==========================================
function copyText(elementId, successMessage) {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;

    const textToCopy = textElement.innerText || textElement.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(successMessage || "복사되었습니다!");
    }).catch(err => {
        console.error("복사 실패:", err);
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast(successMessage || "복사되었습니다!");
        } catch (e) {
            showToast("복사에 실패했습니다.");
        }
        document.body.removeChild(textarea);
    });
}

// ==========================================
// 8. TOAST NOTIFICATION UTILITY
// ==========================================
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

// ==========================================
// 9. TMAP NAVIGATION
// ==========================================
function openTmap() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
        showToast("티맵 길안내는 모바일 기기에서만 지원됩니다.");
        return;
    }

    const goalName = "밀리토피아호텔 바이마린";
    const encodedName = encodeURIComponent(goalName);
    const appUrl = `tmap://search?name=${encodedName}`;

    // Web Fallback: If app not installed
    const webUrl = `https://m.tmap.co.kr/search.do?keyword=${encodedName}`;

    const startTime = Date.now();
    window.location.href = appUrl;

    setTimeout(() => {
        // If app not installed
        if (Date.now() - startTime < 2000) {
            window.location.href = webUrl;
        }
    }, 1500);
}

// ==========================================
// 10. ELEGANT ENTRANCE CONFETTI & PETAL EFFECT
// ==========================================
function triggerEntranceConfetti() {
    const canvas = document.createElement("canvas");
    canvas.className = "entrance-confetti-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const colors = {
        pink: ["#FFF1F2", "#FFE4E6", "#FECDD3", "#FDA4AF", "#F472B6"], // Soft pinks
        peach: ["#FFF7ED", "#FFEDD5", "#FED7AA", "#FDBA74", "#FB923C"], // Soft peaches
        gold: ["#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B"], // Elegant golds
        white: ["#FFFFFF", "#FAFAFA", "#F4F4F5"]
    };

    class Particle {
        constructor(x, y, angle, speed, type) {
            this.x = x;
            this.y = y;
            this.type = type; // 'petal', 'glitter', 'star'

            // Velocity
            const rad = (angle * Math.PI) / 180;
            this.vx = Math.cos(rad) * speed;
            this.vy = -Math.sin(rad) * speed; // Shoot upwards

            this.gravity = 0.05 + Math.random() * 0.04;
            this.wind = (Math.random() - 0.5) * 0.15;

            // Appearance
            this.scale = 0.5 + Math.random() * 0.8;
            this.opacity = 1;
            this.fadeSpeed = 0.003 + Math.random() * 0.003;

            // Color
            const colorGroups = [colors.pink, colors.peach, colors.gold, colors.white];
            const group = colorGroups[Math.floor(Math.random() * colorGroups.length)];
            this.color = group[Math.floor(Math.random() * group.length)];

            // Rotation & Wiggle
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 3;
            this.wiggle = Math.random() * 100;
            this.wiggleSpeed = 0.02 + Math.random() * 0.03;

            // Dimension ratio for 3D flip
            this.flip = Math.random();
            this.flipSpeed = 0.05 + Math.random() * 0.05;
        }

        update() {
            this.vy += this.gravity;
            this.vx += this.wind;

            // Lateral drift
            this.x += this.vx + Math.sin(this.wiggle) * 0.5;
            this.y += this.vy;

            this.wiggle += this.wiggleSpeed;
            this.rotation += this.rotationSpeed;
            this.flip += this.flipSpeed;

            // Start fading out when falling down or after some time
            if (this.vy > 0) {
                this.opacity -= this.fadeSpeed;
            }
        }

        draw() {
            if (this.opacity <= 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.scale(this.scale * Math.cos(this.flip), this.scale);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.type === 'petal') {
                // Draw elegant curved petal
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(8, -10, 12, -2, 4, 10);
                ctx.bezierCurveTo(-4, 10, -12, -2, 0, 0);
                ctx.fill();
            } else if (this.type === 'star') {
                // Draw tiny sparkling 4-point star
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, -6);
                    ctx.quadraticCurveTo(0, 0, 6, 0);
                    ctx.quadraticCurveTo(0, 0, 0, 6);
                    ctx.quadraticCurveTo(0, 0, -6, 0);
                    ctx.quadraticCurveTo(0, 0, 0, -6);
                }
                ctx.fill();
            } else {
                // Classic gold glitter rectangle
                ctx.fillRect(-5, -3, 10, 6);
            }

            ctx.restore();
        }
    }

    // Spawn initial burst from left and right middle sides
    const burstCount = 55;
    for (let i = 0; i < burstCount; i++) {
        // Left side popper
        particles.push(new Particle(
            -20,
            canvas.height * 0.5,
            35 + Math.random() * 30, // 35 to 65 deg
            6 + Math.random() * 8,
            Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'glitter' : 'star')
        ));

        // Right side popper
        particles.push(new Particle(
            canvas.width + 20,
            canvas.height * 0.5,
            115 + Math.random() * 30, // 115 to 145 deg
            6 + Math.random() * 8,
            Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'glitter' : 'star')
        ));
    }

    // Spawn some gentle falling petals from the top to continue the effect
    let spawnTimer = 0;
    const maxDuration = 9000; // Stop after 9 seconds
    const startTime = Date.now();

    function loop() {
        const elapsed = Date.now() - startTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn additional particles from top during the first 5 seconds
        if (elapsed < 5000) {
            spawnTimer++;
            if (spawnTimer % 6 === 0) {
                particles.push(new Particle(
                    Math.random() * canvas.width,
                    -10,
                    270 + (Math.random() - 0.5) * 40, // falling mainly down
                    0.5 + Math.random() * 1.5,
                    Math.random() > 0.5 ? 'petal' : 'glitter'
                ));
            }
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            // Remove faded out particles or offscreen particles
            if (p.opacity <= 0 || p.y > canvas.height + 50 || p.x < -50 || p.x > canvas.width + 50) {
                particles.splice(i, 1);
            }
        }

        // Keep animating if we have particles and haven't exceeded duration
        if (particles.length > 0 && elapsed < maxDuration) {
            animationFrameId = requestAnimationFrame(loop);
        } else {
            cleanup();
        }
    }

    function cleanup() {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeCanvas);
        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    }

    // Start animation
    loop();

    // Safety auto-cleanup
    setTimeout(cleanup, maxDuration + 1000);
}

// ==========================================
// 11. DYNAMIC SCROLL-FADE ELEMENT SETUP
// ==========================================
function setupScrollFadeElements() {
    // Remove scroll-fade from sections to avoid double-animation
    document.querySelectorAll("section.scroll-fade").forEach(sec => {
        sec.classList.remove("scroll-fade");
    });

    // Sub-elements to animate individually
    const selectors = [
        //".badge-dday",
        //".cover-subtitle",
        //".cover-title",
        //".cover-image-container",
        ".cover-info",
        ".section-title",
        ".section-divider",
        //".intro-message p",
        ".parent-relation",
        //".venue-info",
        //".map-container",
        //".map-links .map-btn",
        //".traffic-row",
        ".timeline-item",
        //".gallery-item",
        ".countdown-timer .timer-box",
        ".parent-card",
        ".invitation-footer p"
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add("scroll-fade");
        });
    });
}

var player;
var isPlaying = true;

// YouTube API 로드
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        videoId: 'SYHfOvTmpO4',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'loop': 1,
            'playlist': 'SYHfOvTmpO4',
            'playsinline': 1 // 모바일 브라우저 인라인 재생 필수 옵션
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // 자동 재생 시도
    tryPlay();

    // 터치 및 클릭 시 재생 시도 (모바일 Chrome 대응)
    function enableAudio() {
        if (player && isPlaying) {
            tryPlay();
        }
        // 재생 성공 여부와 상관없이 이벤트 리스너 제거
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
        document.removeEventListener('touchend', enableAudio);
    }

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('touchend', enableAudio);
}

function tryPlay() {
    if (!player) return;

    // playVideo() 실행 시 모바일 차단 오류를 잡아내는 예외 처리
    try {
        var promise = player.playVideo();
        if (promise !== undefined) {
            promise.catch(function (error) {
                // 모바일 크롬이 제스처 부족으로 차단한 경우
                console.log("Autoplay prevented by mobile browser policy.");
            });
        }
    } catch (e) {
        console.log(e);
    }
}

// 상단 BGM 버튼 클릭 시 켜고 끄는 기능
function toggleBGM() {
    var btn = document.getElementById('bgmToggleBtn');
    if (!player) return;

    if (isPlaying) {
        player.pauseVideo();
        isPlaying = false;
        btn.innerText = '🎵 BGM Off';
    } else {
        player.playVideo();
        isPlaying = true;
        btn.innerText = '🔊 BGM On';
    }
}