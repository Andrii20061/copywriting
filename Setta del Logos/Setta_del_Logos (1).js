/* ----------------- impostazione cursore ----------------- */
const cursor = document.createElement('div');
cursor.classList.add('cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.pageX}px`;
    cursor.style.top = `${e.pageY}px`;
});

/* ---------------- no scroll --------------------*/
function scaleCanvas() {
    const canvas = document.getElementById("canvas");
    const baseWidth = 1440;
    let scale = window.innerWidth / baseWidth;
    // limite minimo per mobile
    scale = Math.max(scale, 0.35);
    canvas.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", scaleCanvas);
scaleCanvas();

/* ----------------- scroll to top IIFE ----------------- */
(function() {
    function scrollToTopInstant() {
        window.scrollTo(0, 0);
    }

    if ('scrollRestoration' in history) {
        try {
            history.scrollRestoration = 'manual';
        } catch (e) {}
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(scrollToTopInstant, 20);
    });

    window.addEventListener('load', () => {
        setTimeout(scrollToTopInstant, 20);
    });

    window.addEventListener('pageshow', (event) => {
        setTimeout(scrollToTopInstant, 20);
    });

    window.addEventListener('beforeunload', () => {
        try {
            window.scrollTo(0, 0);
        } catch(e) {}
    });
})();

/* ----------------- blocco scroll ----------------- */
function disableScroll() {
    document.body.style.overflow = "hidden";
}

function enableScroll() {
    document.body.style.overflow = "";
}

/* ----------------- variabili globali ----------------- */
let striscia = null;
let dels = null;

/* ----------------- animazioni iniziali (typing) ----------------- */
const words = ["Dai identità", "Al tuo brand"];
const changingText = document.getElementById("changing-text");
const finalText = document.getElementById("final-text");
const subheadline = document.getElementById("subheadline");
const transazione = document.getElementById('transazione');
const foto = document.getElementById('foto');
const mano = document.getElementById('mano');
const biglietto = document.getElementById('biglietto');

let currentWord = 0;
let letterIndex = 0;
let typingSpeed = 100;
let erasingSpeed = 80;
let delayBetweenWords = 500;
let scrollEffectEnabled = false;

function typeWord() {
    if (letterIndex < words[currentWord].length) {
        changingText.textContent += words[currentWord][letterIndex];
        letterIndex++;
        setTimeout(typeWord, typingSpeed);
    } else {
        setTimeout(eraseWord, delayBetweenWords);
    }
}

function eraseWord() {
    if (letterIndex > 0) {
        if (currentWord === words.length - 1 && letterIndex === Math.floor(words[currentWord].length * 0.6)) {
            fadeOutPenna();
        }
        changingText.textContent = changingText.textContent.slice(0, -1);
        letterIndex--;
        setTimeout(eraseWord, erasingSpeed);
    } else {
        currentWord++;
        changingText.innerHTML = "&nbsp;";
        if (currentWord < words.length) {
            setTimeout(typeWord, typingSpeed);
        } else {
            enableScroll();
            showFinal();
            showsubheadline();
            showtransazione();
            showfoto();
            showmano();
            showbiglietto();
            initBigliettoAnimazioni()
            

            striscia = document.querySelector("#striscia");
            if (typeof window.checkScrollEffects === 'function') {
                window.checkScrollEffects();
            }
        }
    }
}

function showStriscia() {
    if (!striscia) striscia = document.querySelector('#striscia');
    if (striscia) {
        striscia.classList.add('visible');
    }
}

function showFinal() {
    if (!finalText) return;
    finalText.style.opacity = "1";
    finalText.style.transform = "translateY(0)";
    const linea = document.querySelector(".linea");
    if (linea) {
        linea.classList.add("expand");
    }
    setTimeout(() => {
        scrollEffectEnabled = true;
    }, 1000);
}

function showtransazione() {
    if (transazione) transazione.classList.add("visible");
}

function showsubheadline() {
    if (subheadline) subheadline.classList.add("visible");
}

function showfoto() {
    if (foto) foto.classList.add("visible");
}

function showmano() {
    if (mano) mano.classList.add('visible');
}

function showbiglietto() {
    if (biglietto) biglietto.classList.add('visible');
}

/* ----------------- effetti di scroll (marks, del, striscia) ----------------- */
function checkScrollEffects() {
    if (!marks) marks = document.querySelectorAll("mark");
    if (!dels) dels = document.querySelectorAll("del");

    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.7;

    // Effetto mark
    marks.forEach(mark => {
        const rect = mark.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
            mark.classList.add("attivo");
        }
    });

    // Effetto del
    dels.forEach(del => {
        const rect = del.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
            del.classList.add("cancellato");
        }
    });

    // Effetto striscia
    if (striscia) {
        const rect = striscia.getBoundingClientRect();
        const offset = 180;
        const visibleAmount = Math.min(1, Math.max(0, (triggerPoint + offset - rect.top) / (rect.height / 1.3)));

        if (rect.top <= triggerPoint + offset) {
            striscia.style.opacity = visibleAmount;
            striscia.style.transform = `translateY(${50 - visibleAmount * 100}px)`;
        } else {
            striscia.style.opacity = 0;
            striscia.style.transform = 'translateY(50px)';
        }
    }
}

window.checkScrollEffects = checkScrollEffects;

document.addEventListener("DOMContentLoaded", () => {
    // inizializzo marks/dels qui
    marks = document.querySelectorAll("mark");
    dels = document.querySelectorAll("del");

    // inizializzo typing
    disableScroll();
    typeWord();

    // listener scroll per effetti
    window.addEventListener("scroll", checkScrollEffects);

    // chiamata iniziale checkScrollEffects();
    checkScrollEffects();
});

/* ----------------- effetto scroll fade out per finalText ----------------- */
window.addEventListener("scroll", () => {
    if (!scrollEffectEnabled) return;
    let scrollY = window.scrollY;
    let windowHeight = window.innerHeight;
    let opacity = 1 - (scrollY / (windowHeight / 2));
    opacity = Math.max(0, Math.min(1, opacity));

    if (finalText) {
        finalText.style.opacity = opacity;
        finalText.style.transform = `translateY(${scrollY * 0.02}px)`;
    }
});

/* ------------------ effetto fade out per penna ----------------- */
function fadeOutPenna() {
    const penna = document.getElementById("penna");
    if (!penna) return;
    penna.style.opacity = "0";
    penna.style.filter = "blur(1px)";
}

/* ----------------- blocco laterale ----------------- */
window.addEventListener('scroll', function() {
    window.scrollTo({ top: window.scrollY, left: 0, behavior: 'auto' });
});

/* ----------------- testo a comparsa (problema) ----------------- */
document.addEventListener("DOMContentLoaded", () => {
    const problema = document.getElementById("problema");
    if (!problema) return;

    const fullText = problema.textContent;
    problema.textContent = "";
    let typed = false;

    function typeProblema() {
        if (typed) return;
        const rect = problema.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.8;
        if (rect.top <= triggerPoint) {
            typed = true;
            let index = 0;
            const speed = 40;
            function typeLetter() {
                if (index < fullText.length) {
                    problema.textContent += fullText[index];
                    index++;
                    setTimeout(typeLetter, speed);
                }
            }
            typeLetter();
        }
    }

    window.addEventListener("scroll", typeProblema);
    typeProblema();
});

function initBigliettoAnimazioni() {
  const biglietto = document.getElementById("biglietto");
  const mano = document.getElementById("mano");

  if (!biglietto) return;

  function attivaBiglietto() {
      biglietto.classList.add("attivo");
  }

  function disattivaBiglietto() {
      biglietto.classList.remove("attivo");
  }

  // Hover sul biglietto
  //biglietto.addEventListener("mouseenter", attivaBiglietto);
  //biglietto.addEventListener("mouseleave", disattivaBiglietto);

  // Click sul biglietto
  //biglietto.addEventListener("click", attivaBiglietto);

  // Opzionale: hover sulla mano
  if (mano) {
      mano.addEventListener("mouseenter", attivaBiglietto);
      mano.addEventListener("mouseleave", disattivaBiglietto);
  }
}
