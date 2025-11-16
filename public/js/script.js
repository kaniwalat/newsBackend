const buttons = document.querySelectorAll(".tab-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-pane")
      .forEach((tab) => tab.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(swReg => console.log("Service Worker kayıtlı", swReg))
    .catch(err => console.error("Service Worker hatası", err));
}

document.getElementById("subscribe-btn").addEventListener("click", async () => {
  if (!("PushManager" in window)) {
    alert("Tarayıcınız push bildirimlerini desteklemiyor!");
    return;
  }

  const swReg = await navigator.serviceWorker.ready;
  let subscription = await swReg.pushManager.getSubscription();

  if (!subscription) {
    const convertedKey = urlBase64ToUint8Array(publicVapidKey);
    subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });
  }

   console.log("Subscription:", subscription);
  // Sunucuya kaydet
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { "Content-Type": "application/json" },
  });

  alert("Abone olundu! 10 saniye sonra bildirim gelecek.");

  setTimeout(() => {
    fetch("/send-test", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });
  }, 10000);
});

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}



