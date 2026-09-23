const btn = document.getElementById("theme-toggle");
const body = document.body;
const icon = document.getElementById("theme-icon");
const label = document.getElementById("theme-label");

function updateThemeToggle() {
    const isTurquoise = body.classList.contains("turquoise");

    // Show the theme that will be activated by the next click.
    icon.textContent = isTurquoise ? "☀️" : "🌙";
    label.textContent = isTurquoise ? "Switch to Light Theme" : "Switch to Dark Theme";
    btn.setAttribute("aria-label", isTurquoise ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("aria-pressed", String(isTurquoise));
}

btn.addEventListener("click", () => {
    body.classList.toggle("turquoise");
    updateThemeToggle();
});

updateThemeToggle();
