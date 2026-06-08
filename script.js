        /* ----------------- impostazione cursore ----------------- */
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.pageX}px`;
            cursor.style.top = `${e.pageY}px`;
        });

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
        let marks = null;

        /* ----------------- animazioni iniziali (typing) ----------------- */
        const words = ["Dai identità", "Al tuo brand"];
        const changingText = document.getElementById("changing-text");
        const finalText = document.getElementById("final-text");
        const subheadline = document.getElementById("subheadline");
        const transazione = document.getElementById('transazione');
        const foto = document.getElementById('foto');
        const mano = document.getElementById('mano');
        const biglietto = document.getElementById('biglietto');
        const bloccomano = document.getElementById('bloccomano');
        const titolo = document.getElementById('titolo');

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
                    showStriscia();
                    showmano();
                    showbiglietto();
                    showbloccomano(); 
                    showtitolo();
                    showBook();
                    

                    striscia = document.querySelector("#striscia");
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

        function showbloccomano() {
            if (bloccomano) bloccomano.classList.add('visible');
        }

        function showmano() {
            if (mano) mano.classList.add('visible');
        }

        function showbiglietto() {
            if (biglietto) biglietto.classList.add('visible');
        }

        function showtitolo() {
            if (titolo) titolo.classList.add('visible');
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

        const shape = document.querySelector(".shape");

        window.addEventListener("scroll", () => {

        const scroll = window.scrollY;

        const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        let p = scroll / maxScroll;

        const start = 0.46;
        const end = 0.66;

        // -------------------------
        // FASE 1: espansione
        // -------------------------
        let expandProgress = Math.min(
            Math.max((p - start) / (end - start), 0),
            1
        );

        // -------------------------
        // FASE 2: restringimento dopo end
        // -------------------------
        let shrinkProgress = 0;

        if (p > end) {
            const shrinkRangeStart = end;
            const shrinkRangeEnd = 1;

            shrinkProgress = Math.min(
            Math.max((p - shrinkRangeStart) / (shrinkRangeEnd - shrinkRangeStart), 0),
            1
            );
        }

        // -------------------------
        // combinazione effetti
        // -------------------------

        // la shape NON sparisce mai
        shape.style.opacity = expandProgress;

        // espansione prima, poi compressione
        let scaleY = 1;

        if (p <= end) {
            // fase espansione
            scaleY = 1 + expandProgress * 8;
        } else {
            // fase restringimento progressivo
            scaleY = (1 + 8) - shrinkProgress * 18;
        }

        shape.style.transform =
            `translate(-50%, -50%) scaleY(${scaleY})`;
        });

        const letters = document.querySelectorAll(".curved-text span");

        letters.forEach((el, i) => {
        const angle = (i - letters.length / 2) * 10; // curva
        const radius = 80;

        el.style.transform = `
            rotate(${angle}deg)
            translateY(-${Math.abs(angle) * 0.8}px)
        `;
        });

        function apriPDF() {
            document.getElementById("popupPDF").style.display = "flex";
        
            // blocca lo scroll del sito
            document.body.style.overflow = "hidden";
        }
        
        function chiudiPDF() {
            document.getElementById("popupPDF").style.display = "none";
        
            // riattiva lo scroll
            document.body.style.overflow = "auto";
        }

        function showBook() {
            const book = document.querySelector(".book");
            if (!book) return;

            setTimeout(() => {
                book.classList.add("apri");
            }, 200); // piccolo delay per effetto più naturale
        }

        function initBigliettoAnimazione() {

            if (!mano || !biglietto) return;
        
            function attivaBiglietto() {
                biglietto.classList.add("attivo");
            }
        
            function disattivaBiglietto() {
                biglietto.classList.remove("attivo");
            }
        
            // hover
            mano.addEventListener("mouseenter", attivaBiglietto);
            mano.addEventListener("mouseleave", disattivaBiglietto);
        
            // click
            mano.addEventListener("click", () => {
                biglietto.classList.toggle("attivo");
            });
        }
        
        document.addEventListener("DOMContentLoaded", initBigliettoAnimazione);

        const btn = document.querySelector(".btn");
const contactPopup = document.getElementById("contactPopup");
const closeContact = document.querySelector(".close-contact");
const joinTrigger = document.getElementById("joinTrigger");

btn.addEventListener("click", () => {
  contactPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
});

closeContact.addEventListener("click", () => {
  contactPopup.style.display = "none";
  document.body.style.overflow = "auto";
});

contactPopup.addEventListener("click", (e) => {
  if (e.target === contactPopup) {
    contactPopup.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

joinTrigger.addEventListener("click", () => {
    contactPopup.style.display = "flex";
    document.body.style.overflow = "hidden";
  });
