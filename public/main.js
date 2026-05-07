// Copy link to clipboard
function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2200);
    }
  });
}

// Animate cards on scroll
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".featured-card, .post-card, .tag-item, .stat-card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 40}ms`;
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );
  cards.forEach((card) => observer.observe(card));

  // Active nav link
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.style.color = "var(--accent)";
    }
  });
});
