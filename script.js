// Target Date for Sihyeon's 1st Birthday: October 9, 2026, 12:00 PM (KST)
const TARGET_DATE = new Date("2026-10-09T12:00:00+09:00");

// Gallery Image Sources
const GALLERY_IMAGES = [
    "assets/cover.jpg",
    "assets/gallery1.jpg",
    "assets/gallery2.jpg",
    "assets/gallery3.jpg"
];
let currentLightboxIndex = 0;

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
    // 0. Lock scroll if intro overlay is present
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        document.body.classList.add("scroll-locked");
    }

    // 1. Start D-day countdown
    initCountdown();

    // 2. Setup Scroll Animations
    initScrollAnimations();

    // 3. Render Guestbook Messages
    renderGuestbook();

    // 4. Set D-day badge value on cover
    updateDDayBadge();
});

// ==========================================
// 0. WELCOME INTRO OVERLAY TRANSITION
// ==========================================
function enterInvitation() {
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        overlay.classList.add("fade-out");
        document.body.classList.remove("scroll-locked");

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
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}

// ==========================================
// 3. PHOTO GALLERY LIGHTBOX
// ==========================================
function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    lightboxImg.src = GALLERY_IMAGES[currentLightboxIndex];
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeLightbox(event) {
    // Closes lightbox if clicking backdrop, close symbol or backdrop container
    if (event.target.id === "lightbox" || event.target.className === "lightbox-close" || event.type === "submit") {
        const lightbox = document.getElementById("lightbox");
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function navigateLightbox(direction, event) {
    if (event) event.stopPropagation(); // Avoid triggering closeLightbox

    currentLightboxIndex += direction;
    if (currentLightboxIndex >= GALLERY_IMAGES.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = GALLERY_IMAGES.length - 1;
    }

    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = GALLERY_IMAGES[currentLightboxIndex];
}

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

    const goalName = "밀리토피아호텔바이마린";
    const lat = 37.4654;
    const lon = 127.1396;
    const appUrl = `tmap://route?goalname=${encodeURIComponent(goalName)}&goalx=${lon}&goaly=${lat}`;

    window.location.href = appUrl;
}
