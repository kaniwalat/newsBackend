window.addEventListener("load", () => { const splash =
  document.getElementById("splash-screen")
  const app =
    document.getElementById("app-content")
  setTimeout(() => {
      splash.style.display =
"none"; app.classList.remove("hidden") }, 300) });
