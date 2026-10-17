// كلمة السر الافتراضية: love — تقدر تغيّرها من هنا.
const PASSWORD = "1632024";

const lockScreen = document.getElementById("lockScreen");
const choiceScreen = document.getElementById("choiceScreen");
const welcomeScreen = document.getElementById("welcomeScreen");
const loveContent = document.getElementById("loveContent");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
    lockScreen.hidden = true;
    choiceScreen.hidden = false;
    passwordError.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    passwordError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// زر "مش بتحبيني؟" يهرب من مكانه على الشاشة.
const noLoveButton = document.getElementById("noLoveButton");
const choiceNote = document.getElementById("choiceNote");
let dodgeCount = 0;
const dodgeEmojis = ["🥹", "😜", "🙈", "😝", "🤭", "😹", "😎", "🥰", "🤪", "🫣", "😏", "😂"];
function dodgeButton() {
  dodgeCount++;
  const emoji = dodgeEmojis[(dodgeCount - 1) % dodgeEmojis.length];
  noLoveButton.querySelector(".choice-emoji").textContent = emoji;
  const maxX = Math.max(12, window.innerWidth - noLoveButton.offsetWidth - 12);
  const maxY = Math.max(100, window.innerHeight - noLoveButton.offsetHeight - 30);
  noLoveButton.style.position = "fixed";
  noLoveButton.style.zIndex = "20";
  noLoveButton.style.left = `${Math.max(12, Math.random() * maxX)}px`;
  noLoveButton.style.top = `${Math.max(80, Math.random() * maxY)}px`;
  noLoveButton.style.right = "auto";
  noLoveButton.style.width = `${Math.min(190, window.innerWidth - 24)}px`;
  choiceNote.textContent = dodgeCount < 4
    ? " مش هسيبك تضغطى ع الزرار  😂💜"
    : "الزرار ده شكله مش عايز الإجابة دي 😂";
}
noLoveButton.addEventListener("pointerenter", dodgeButton);
noLoveButton.addEventListener("touchstart", (event) => {
  event.preventDefault();
  dodgeButton();
}, { passive: false });
noLoveButton.addEventListener("click", dodgeButton);

document.getElementById("loveButton").addEventListener("click", () => {
  choiceScreen.hidden = true;
  welcomeScreen.hidden = false;
  noLoveButton.style.position = "";
  noLoveButton.style.left = "";
  noLoveButton.style.top = "";
  noLoveButton.style.right = "";
  noLoveButton.style.width = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("startJourney").addEventListener("click", () => {
  welcomeScreen.hidden = true;
  loveContent.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  setupScratchCard();
});

// خدش طبقة الكانفس لإظهار رسالة الحب.
const scratchCanvas = document.getElementById("scratchCanvas");
const scratchContext = scratchCanvas.getContext("2d");
let isScratching = false;
let scratchReady = false;

function setupScratchCard() {
  const rect = scratchCanvas.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  scratchCanvas.width = Math.round(rect.width * dpr);
  scratchCanvas.height = Math.round(rect.height * dpr);
  scratchContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  const gradient = scratchContext.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#d7b6ef");
  gradient.addColorStop(0.5, "#bd91df");
  gradient.addColorStop(1, "#a978d0");
  scratchContext.globalCompositeOperation = "source-over";
  scratchContext.fillStyle = gradient;
  scratchContext.fillRect(0, 0, rect.width, rect.height);

  scratchContext.fillStyle = "rgba(255,255,255,.35)";
  for (let i = 0; i < 45; i++) {
    scratchContext.beginPath();
    scratchContext.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
    scratchContext.fill();
  }
  scratchContext.globalCompositeOperation = "destination-out";
  scratchReady = true;
}
function scratchAt(event) {
  if (!scratchReady || !isScratching) return;
  const rect = scratchCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  scratchContext.beginPath();
  scratchContext.arc(x, y, 23, 0, Math.PI * 2);
  scratchContext.fill();
}
scratchCanvas.addEventListener("pointerdown", (event) => {
  isScratching = true;
  scratchCanvas.setPointerCapture?.(event.pointerId);
  scratchAt(event);
});
scratchCanvas.addEventListener("pointermove", scratchAt);
scratchCanvas.addEventListener("pointerup", () => { isScratching = false; });
scratchCanvas.addEventListener("pointercancel", () => { isScratching = false; });
document.getElementById("resetScratch").addEventListener("click", setupScratchCard);
window.addEventListener("resize", () => {
  if (scratchReady && !loveContent.hidden) setupScratchCard();
});

// سبع رسائل مختلفة؛ بعد آخر رسالة تظهر العبارة المطلوبة.
const loveMessages = [
  "بحب ضحكتك اللي بتخلّي يومي اجمل 💜",
  "حتى وإحنا زعلانين، إنتِ غالية عندي.",
  "نفسي دايمًا نعرف نتكلم ونفهم بعض براحه .",
  "وجودك في حياتي له مكانة مش سهل تتوصف.",
  "يا أحلى قشطوطه، أتمنى أشوفك مبسوطة ع طول 🦋",
  "العتاب بينا عشان يقرّبنا، مش عشان يبعدنا.",
  "بحبك، ونفسي نختار الهدوء ونسمع بعض ❤️"
];
let messageIndex = 0;
const messageHeart = document.getElementById("messageHeart");
const counterText = document.getElementById("counterText");
const counterNumber = document.getElementById("counterNumber");
const counterProgress = document.getElementById("counterProgress");

messageHeart.addEventListener("click", () => {
  if (messageIndex < loveMessages.length) {
    counterText.textContent = loveMessages[messageIndex];
    messageIndex++;
    counterNumber.textContent = `${messageIndex} / ${loveMessages.length}`;
    counterProgress.style.width = `${(messageIndex / loveMessages.length) * 100}%`;
    messageHeart.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "ease-out" }
    );
  } else {
    counterText.textContent = "العداد باظ، وحبي ليكي مبيخلصش 💜";
    counterNumber.textContent = "∞";
    counterProgress.style.width = "100%";
    messageHeart.disabled = true;
    messageHeart.setAttribute("aria-label", "حبي ليكي مبيخلصش");
  }
});

// أسطوانة الموسيقى: نحاول تشغيلها عند فتح الصفحة، لكن بعض المتصفحات تمنع الصوت التلقائي.
const audio = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicToggle");
const vinylButton = document.getElementById("vinylButton");
function syncMusicUI() {
  const playing = !audio.paused;
  vinylButton.classList.toggle("playing", playing);
  musicButton.innerHTML = playing ? '♫ <span>إيقاف الموسيقى</span>' : '♫ <span>شغّل الموسيقى</span>';
}
async function toggleMusic() {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      alert("المتصفح منع التشغيل التلقائي أو ملف الأغنية مش موجود. ضيف music.mp3 في assets/audio واضغط على الأسطوانة مرة واحدة.");
    }
  } else {
    audio.pause();
  }
  syncMusicUI();
}
musicButton.addEventListener("click", toggleMusic);
vinylButton.addEventListener("click", toggleMusic);
audio.addEventListener("play", syncMusicUI);
audio.addEventListener("pause", syncMusicUI);
window.addEventListener("load", () => {
  audio.play().then(syncMusicUI).catch(() => syncMusicUI());
});

// عداد بداية الحكاية من 16 مارس 2024.
const relationshipStart = new Date(2024, 2, 16, 0, 0, 0); // الشهر 2 يعني مارس في JavaScript
function updateRelationshipCounter() {
  const now = new Date();
  let diff = Math.max(0, now.getTime() - relationshipStart.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const daysEl = document.getElementById("relationshipDays");
  if (!daysEl) return;
  daysEl.textContent = days.toLocaleString("ar-EG");
  document.getElementById("relationshipHours").textContent = String(hours).padStart(2, "0");
  document.getElementById("relationshipMinutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("relationshipSeconds").textContent = String(seconds).padStart(2, "0");
}
updateRelationshipCounter();
setInterval(updateRelationshipCounter, 1000);

