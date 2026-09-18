/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO SCRIPT — Comprehensive Animations
   ═══════════════════════════════════════════════════════════════════ */

// ── 1. NAV SCROLL SHADOW ─────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});


// ── 2. HERO MOUSE PARALLAX ───────────────────────────────────────
const hero = document.getElementById("hero");
const heroContent = hero.querySelector(".hero-content");
const starsContainer = hero.querySelector(".stars-container");

hero.addEventListener("mousemove", (e) => {
  const rect = hero.getBoundingClientRect();
  const cx = (e.clientX - rect.left) / rect.width - 0.5;
  const cy = (e.clientY - rect.top) / rect.height - 0.5;

  heroContent.style.transform = `translate(${cx * 12}px, ${cy * 8}px)`;
  starsContainer.style.transform = `translate(${cx * -18}px, ${cy * -12}px)`;
});
hero.addEventListener("mouseleave", () => {
  heroContent.style.transform = "";
  starsContainer.style.transform = "";
});


// ── 3. COUNT-UP ANIMATION FOR STATS ─────────────────────────────
function countUp(el, target, duration = 1500) {
  const suffix = target.replace(/[0-9]/g, "").trim(); // e.g. "+" or "k"
  const num = parseFloat(target);
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * num);
    el.textContent = current + suffix;
    el.classList.add("counting");
    setTimeout(() => el.classList.remove("counting"), 300);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target; // ensure exact final value
  };
  requestAnimationFrame(tick);
}


// ── 4. INTERSECTION OBSERVER FACTORY ────────────────────────────
function makeObserver(callback, options = {}) {
  return new IntersectionObserver(callback, {
    threshold: options.threshold ?? 0.15,
    rootMargin: options.rootMargin ?? "0px",
  });
}


// ── 5. ABOUT SECTION ─────────────────────────────────────────────
const aboutObserver = makeObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const section = entry.target;

    // Photo wrap slide-in-left
    const avatar = section.querySelector(".about-photo-wrap");
    if (avatar && !avatar.classList.contains("anim-in")) {
      avatar.classList.add("anim-in");
    }

    // Text slide-in-right
    const text = section.querySelector(".about-text");
    if (text && !text.classList.contains("anim-in")) {
      text.classList.add("anim-in");
    }

    // Section label reveal
    section.querySelectorAll(".section-label").forEach((el) => {
      el.classList.add("anim-in");
    });

    // Count-up stats
    section.querySelectorAll(".stat-num").forEach((el, i) => {
      const raw = el.textContent.trim();
      el.textContent = "0";
      setTimeout(() => countUp(el, raw, 1200), 400 + i * 150);
    });

    aboutObserver.unobserve(section);
  });
});
const aboutSection = document.getElementById("about");
if (aboutSection) aboutObserver.observe(aboutSection);


// ── 6. SKILLS SECTION ────────────────────────────────────────────
const skillsObserver = makeObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Header fade up
    const header = entry.target.querySelector(".skills-header");
    if (header) header.classList.add("visible");

    // Stagger cards
    const cards = entry.target.querySelectorAll(".skill-card");
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add("anim-in");
        // Animate skill bar
        const bar = card.querySelector(".skill-bar");
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + "%";
          }, 300);
        }
      }, i * 100);
    });

    skillsObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
const skillsSection = document.getElementById("skills");
if (skillsSection) skillsObserver.observe(skillsSection);


// ── 7. PROJECTS SECTION ──────────────────────────────────────────
const projectsObserver = makeObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Header
    const header = entry.target.querySelector(".projects-header");
    if (header) header.classList.add("visible");

    // Stagger cards
    const cards = entry.target.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add("anim-in");
      }, i * 150);
    });

    projectsObserver.unobserve(entry.target);
  });
}, { threshold: 0.08 });
const projectsSection = document.getElementById("projects");
if (projectsSection) projectsObserver.observe(projectsSection);


// ── 8. CONTACT SECTION ───────────────────────────────────────────
const contactObserver = makeObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const section = entry.target;

    // Left column: info items slide in
    const infoItems = section.querySelectorAll(".contact-info-item");
    infoItems.forEach((item, i) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-30px)";
      item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, 200 + i * 120);
    });

    // Title animate
    const h2 = section.querySelector("h2.section-title");
    if (h2) setTimeout(() => h2.classList.add("anim-in"), 100);

    // Form card slides in from right
    const formWrap = section.querySelector(".contact-form-wrap");
    if (formWrap) {
      formWrap.style.opacity = "0";
      formWrap.style.transform = "translateX(40px)";
      formWrap.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      setTimeout(() => {
        formWrap.style.opacity = "1";
        formWrap.style.transform = "translateX(0)";
      }, 250);
    }

    // Form fields stagger (skip .anim-in on form itself to prevent button hide)
    const form = section.querySelector(".contact-form");
    if (form) {
      const fields = form.querySelectorAll(".form-field");
      fields.forEach((field, i) => {
        setTimeout(() => field.classList.add("anim-in"), 450 + i * 110);
      });
    }

    // Social buttons bounce
    const socials = section.querySelectorAll(".social-btn");
    socials.forEach((btn, i) => {
      setTimeout(() => btn.classList.add("anim-in"), 500 + i * 90);
    });

    contactObserver.unobserve(section);
  });
}, { threshold: 0.08 });
const contactSection = document.getElementById("contact");
if (contactSection) contactObserver.observe(contactSection);


// ── 9. CONTACT FORM SUBMIT ───────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type='submit']");
  const icon = btn.querySelector(".material-symbols-outlined");
  const originalText = "Send Message";

  btn.disabled = true;
  btn.style.background = "linear-gradient(135deg, #059669, #047857)";
  btn.childNodes[0].textContent = " Sent! ";
  if (icon) icon.textContent = "check_circle";

  setTimeout(() => {
    btn.style.background = "";
    btn.disabled = false;
    btn.childNodes[0].textContent = " " + originalText + " ";
    if (icon) icon.textContent = "send";
    e.target.reset();
  }, 3500);
}


// ── 10. SKILL CARD RIPPLE ON CLICK ──────────────────────────────
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(217,119,6,0.15);
      top:${e.clientY - rect.top - size/2}px;
      left:${e.clientX - rect.left - size/2}px;
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

// Inject ripple keyframe
const style = document.createElement("style");
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);


// ── 11. SMOOTH ACTIVE NAV LINK ───────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.style.color = "";
        if (link.getAttribute("href") === "#" + entry.target.id) {
          link.style.color = "var(--amber)";
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach((s) => activeObserver.observe(s));


// ── 12. HAMBURGER MENU ───────────────────────────────────────────
const hamburger   = document.getElementById("hamburger");
const navLinksEl  = document.getElementById("navLinks");
const navOverlay  = document.getElementById("navOverlay");

function openMenu() {
  hamburger.classList.add("open");
  navLinksEl.classList.add("open");
  navOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  hamburger.classList.remove("open");
  navLinksEl.classList.remove("open");
  navOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  hamburger.classList.contains("open") ? closeMenu() : openMenu();
});
navOverlay.addEventListener("click", closeMenu);

// Close when any nav link is clicked
document.querySelectorAll(".nav-item").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Close if window resized back to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMenu();
});
