const platno = document.getElementById('canvas');
const ctx = platno.getContext('2d');

const souborSTexty = "planety.txt"; 

// Proměnná si pamatuje vybranou planetu nebo slovo "Slunce"
let oznacenaPlaneta = null;

function zmenVelikostPlatna() {
    platno.width = window.innerWidth;
    platno.height = window.innerHeight;
}
window.addEventListener('resize', zmenVelikostPlatna);
zmenVelikostPlatna();

function ziskajStred() {
    return {
        x: platno.width / 2,
        y: platno.height / 2
    };
}

const meritkoDrah = 0.45;       
const meritkoVelikosti = 0.7;  

const sunImg = document.getElementById('sun');
const zakladniVelikostSlunce = 250; 
const meritkoSlunce = 0.35; 
const finalniVelikostSlunce = zakladniVelikostSlunce * meritkoSlunce;
sunImg.style.width = finalniVelikostSlunce + "px";
sunImg.style.height = finalniVelikostSlunce + "px";

const inputRychlost = document.getElementById('rychlostCasu');
const sliderRychlost = document.getElementById('rychlostCasuSlider');
const chkDrahy = document.getElementById('zobrazitDráhy');
const chkZastavit = document.getElementById('zastavit_čas');
const infoPanel = document.getElementById('infoOKliknutePLaneteNeboSlunci');
const kontejnerNaTlacitka = document.getElementById('vesmirneElementy');

function zobrazInformace(nazev, text, objektOznaceni = null) {
    infoPanel.innerHTML = `<h2>${nazev}</h2><p>${text || "K tomuto tělesu nebyl nalezen žádný popisek..."}</p>`;
    infoPanel.style.display = "block"; 
    oznacenaPlaneta = objektOznaceni; // Uložíme planetu nebo "Slunce"
}

// Kliknutí na Slunce (OPRAVENO: Předáváme slovo "Slunce" pro označení)
sunImg.style.pointerEvents = "auto"; 
sunImg.onclick = (e) => {
    e.stopPropagation(); 
    zobrazInformace("Slunce", "Naše mateřská hvězda. Tvoří 99,8 % hmotnosti celé Sluneční soustavy.", "Slunce");
};

// Zamezení prokliknutí na pozadí
document.getElementById('ovladani').onclick = (e) => { e.stopPropagation(); };
infoPanel.onclick = (e) => { e.stopPropagation(); };

window.onclick = function() {
    infoPanel.style.display = "none";
    oznacenaPlaneta = null;
};

sliderRychlost.oninput = function() { inputRychlost.value = this.value; };
inputRychlost.oninput = function() { sliderRychlost.value = this.value; };

const SEKUNDY_ZA_DAY = 86400;
const FPS = 60;
const KOEFICIENT_REALTIME = (Math.PI * 2) / (SEKUNDY_ZA_DAY * FPS);

const planety = [
    { jmeno: 'Merkur', src: 'merkur.jpg', velikost: 13, pomerStran: 1.0, osaA: 140, osaB: 130, excentricita: 30, rychlostOběhu: KOEFICIENT_REALTIME / 87.97, rychlostRotace: KOEFICIENT_REALTIME / 58.65, uhel: 0, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Venuše', src: 'venuše.jpg', velikost: 39, pomerStran: 1.0, osaA: 220, osaB: 218, excentricita: 5, rychlostOběhu: KOEFICIENT_REALTIME / 224.7, rychlostRotace: -KOEFICIENT_REALTIME / 243.02, uhel: 1.5, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Země', src: 'země.jpg', velikost: 40, pomerStran: 1.0, osaA: 320, osaB: 318, excentricita: 8, rychlostOběhu: KOEFICIENT_REALTIME / 365.25, rychlostRotace: KOEFICIENT_REALTIME / 1.0, uhel: 3.1, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Mars', src: 'mars.jpg', velikost: 21, pomerStran: 1.0, osaA: 440, osaB: 435, excentricita: 40, rychlostOběhu: KOEFICIENT_REALTIME / 686.98, rychlostRotace: KOEFICIENT_REALTIME / 1.03, uhel: 4.7, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Jupiter', src: 'jupiter.jpg', velikost: 100, pomerStran: 1.0, osaA: 620, osaB: 616, excentricita: 30, rychlostOběhu: KOEFICIENT_REALTIME / 4332.59, rychlostRotace: KOEFICIENT_REALTIME / 0.41, uhel: 0.8, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Saturn', src: 'saturn.jpg', velikost: 85, pomerStran: 2.2, osaA: 820, osaB: 812, excentricita: 45, rychlostOběhu: KOEFICIENT_REALTIME / 10759.22, rychlostRotace: KOEFICIENT_REALTIME / 0.44, uhel: 2.3, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Uran', src: 'uran.jpg', velikost: 48, pomerStran: 1.0, osaA: 1020, osaB: 1015, excentricita: 47, rychlostOběhu: KOEFICIENT_REALTIME / 30685.4, rychlostRotace: -KOEFICIENT_REALTIME / 0.71, uhel: 5.5, rotace: 0, infoText: "", btnElement: null, imgObjekt: null },
    { jmeno: 'Neptun', src: 'neptun.jpg', velikost: 46, pomerStran: 1.3, osaA: 1220, osaB: 1218, excentricita: 10, rychlostOběhu: KOEFICIENT_REALTIME / 60189.0, rychlostRotace: KOEFICIENT_REALTIME / 0.67, uhel: 4.0, rotace: 0, infoText: "", btnElement: null, imgObjekt: null }
];

async function nactiTextyZSouboru() {
    try {
        const response = await fetch(souborSTexty);
        const celyText = await response.text();
        planety.forEach(p => {
            const znackaZacatku = `[${p.jmeno}]`;
            const indexZacatku = celyText.indexOf(znackaZacatku);
            if (indexZacatku !== -1) {
                const startPos = indexZacatku + znackaZacatku.length;
                let celyZbytekTextu = celyText.substring(startPos);
                let endPos = celyZbytekTextu.length;
                const dalsiZnackaIndex = celyZbytekTextu.indexOf('[');
                if (dalsiZnackaIndex !== -1) { endPos = dalsiZnackaIndex; }
                p.infoText = celyZbytekTextu.substring(0, endPos).trim();
            }
        });
    } catch (error) { console.error("Chyba textu:", error); }
    nactiObrazkyAPreloader();
}

let nacteneObrazkyCount = 0;
function nactiObrazkyAPreloader() {
    planety.forEach(p => {
        p.imgObjekt = new Image();
        p.imgObjekt.onload = function() {
            nacteneObrazkyCount++;
            if (nacteneObrazkyCount === planety.length) { spustVesmir(); }
        };
        p.imgObjekt.onerror = function() {
            nacteneObrazkyCount++;
            if (nacteneObrazkyCount === planety.length) { spustVesmir(); }
        };
        p.imgObjekt.src = p.src; 
    });
}

function spustVesmir() {
    planety.forEach(p => {
        const finalniVelikostVyska = p.velikost * meritkoVelikosti;
        const finalniVelikostSirka = finalniVelikostVyska * p.pomerStran;
        const btn = document.createElement('button');
        btn.className = 'planetBtn';
        btn.style.width = finalniVelikostSirka + "px";
        btn.style.height = finalniVelikostVyska + "px";
        btn.onclick = (e) => {
            e.stopPropagation();
            zobrazInformace(p.jmeno, p.infoText, p);
        };
        kontejnerNaTlacitka.appendChild(btn);
        p.btnElement = btn;
    });
    pohyb();
}

function aktualizujAPohybujPlanety(nasobitel) {
    const stred = ziskajStred();

    // --- NOVÉ VYKRESLENÍ: Označení samotného Slunce ---
    if (oznacenaPlaneta === "Slunce") {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.beginPath();
        // Kruh se přizpůsobí aktuální velikosti zmenšeného Slunce
        const polomerSlunceOznaceni = (finalniVelikostSlunce / 2) + 6;
        ctx.arc(stred.x, stred.y, polomerSlunceOznaceni, 0, Math.PI * 2);
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    planety.forEach(p => {
        const dynamickaOsaA = p.osaA * meritkoDrah;
        const dynamickaOsaB = p.osaB * meritkoDrah;
        const dynamickaExcentricita = p.excentricita * meritkoDrah;
        const dynamickaVyska = p.velikost * meritkoVelikosti;
        const dynamickaSirka = dynamickaVyska * p.pomerStran;

        const elipsaStredX = stred.x - dynamickaExcentricita;
        const elipsaStredY = stred.y;

        if (chkDrahy.checked) {
            ctx.beginPath();
            ctx.ellipse(elipsaStredX, elipsaStredY, dynamickaOsaA, dynamickaOsaB, 0, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        const x = elipsaStredX + Math.cos(p.uhel) * dynamickaOsaA;
        const y = elipsaStredY + Math.sin(p.uhel) * dynamickaOsaB;

        if (p.btnElement) {
            p.btnElement.style.left = x + "px";
            p.btnElement.style.top = y + "px";
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (oznacenaPlaneta === p) {
            ctx.save();
            ctx.beginPath();
            const polomerOznaceni = (Math.max(dynamickaSirka, dynamickaVyska) / 2) + 6;
            ctx.arc(x, y, polomerOznaceni, 0, Math.PI * 2);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.rotace);
        ctx.drawImage(p.imgObjekt, -dynamickaSirka / 2, -dynamickaVyska / 2, dynamickaSirka, dynamickaVyska);
        ctx.restore();

        p.uhel += p.rychlostOběhu * nasobitel;
        p.rotace += p.rychlostRotace * nasobitel;
    });
}

function pohyb(){
    let nasobitelCasu = 0;
    if (!chkZastavit.checked) {
        nasobitelCasu = parseFloat(inputRychlost.value) || 0;
    }
    ctx.clearRect(0, 0, platno.width, platno.height); 
    aktualizujAPohybujPlanety(nasobitelCasu);
    requestAnimationFrame(pohyb);
}

nactiTextyZSouboru();
