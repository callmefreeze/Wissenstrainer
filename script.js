// =====================================================
// 1. VARIABLEN
// =====================================================

let anzahlRichtig = 0;

let anzahlFalsch = 0;

let letzteFrage = -1;

let aktuelleFrage;

let gefilterteFragen = fragen;


// =====================================================
// 2. GESPEICHERTEN LERNSTAND LADEN
// =====================================================

let lernstand =
    JSON.parse(localStorage.getItem("lernstand")) || {};


// =====================================================
// 3. LERNSTAND SPEICHERN
// =====================================================

function lernstandSpeichern() {

    localStorage.setItem(
        "lernstand",
        JSON.stringify(lernstand)
    );

}


// =====================================================
// 4. RECHTSGEBIETSFILTER INITIALISIEREN
// =====================================================

function filterInitialisieren() {

    const rechtsgebietFilter =
        document.getElementById("rechtsgebietFilter");


    const rechtsgebiete =
        [...new Set(

            fragen.map(function(frage) {

                return frage.rechtsgebiet;

            })

        )];


    rechtsgebiete.sort();


    rechtsgebiete.forEach(function(rechtsgebiet) {

        const option =
            document.createElement("option");


        option.value =
            rechtsgebiet;


        option.textContent =
            rechtsgebiet;


        rechtsgebietFilter.appendChild(option);

    });

}


// =====================================================
// 5. THEMENMENÜ AKTUALISIEREN
// =====================================================

function themenAktualisieren() {

    const rechtsgebiet =
        document.getElementById("rechtsgebietFilter").value;


    const themaFilter =
        document.getElementById("themaFilter");


    themaFilter.innerHTML = "";


    const alleOption =
        document.createElement("option");


    alleOption.value =
        "alle";


    alleOption.textContent =
        "Alle Themen";


    themaFilter.appendChild(alleOption);


    if (rechtsgebiet === "alle") {

        themaFilter.value =
            "alle";


        return;

    }


    const themen =
        [...new Set(

            fragen

                .filter(function(frage) {

                    return frage.rechtsgebiet === rechtsgebiet;

                })

                .map(function(frage) {

                    return frage.thema;

                })

        )];


    themen.sort();


    themen.forEach(function(thema) {

        const option =
            document.createElement("option");


        option.value =
            thema;


        option.textContent =
            thema;


        themaFilter.appendChild(option);

    });

}


// =====================================================
// 6. FRAGENZAHL AKTUALISIEREN
// =====================================================

function fragenzahlAktualisieren() {

    const anzahl =
        gefilterteFragen.length;


    const text =
        anzahl === 1
            ? "Frage ausgewählt"
            : "Fragen ausgewählt";


    document.getElementById("anzahlFragen").textContent =
        anzahl;


    document.getElementById("fragenText").textContent =
        text;

}


// =====================================================
// 7. FRAGEN FILTERN
// =====================================================

function fragenFiltern() {

    const lernmodus =
        document.getElementById("lernmodusFilter").value;


    const rechtsgebiet =
        document.getElementById("rechtsgebietFilter").value;


    const thema =
        document.getElementById("themaFilter").value;


    gefilterteFragen =
        fragen.filter(function(frage) {


            // Rechtsgebiet prüfen

            const rechtsgebietPasst =

                rechtsgebiet === "alle" ||

                frage.rechtsgebiet === rechtsgebiet;


            // Thema prüfen

            const themaPasst =

                thema === "alle" ||

                frage.thema === thema;


            // Lernmodus prüfen

            let lernmodusPasst = true;


            if (lernmodus === "fehler") {

                const statistik =
                    lernstand[frage.id];


                lernmodusPasst =

                    statistik &&

                    statistik.fehlerfrage === true;

            }


            return (
                rechtsgebietPasst &&
                themaPasst &&
                lernmodusPasst
            );

        });


    fragenzahlAktualisieren();


    letzteFrage = -1;


    neueFrage();

}


// =====================================================
// 8. GEWICHT EINER FRAGE BERECHNEN
// =====================================================

function gewichtBerechnen(frage) {

    const statistik =
        lernstand[frage.id];


    // Noch nie beantwortet

    if (!statistik) {

        return 5;

    }


    const richtig =
        statistik.richtig;


    const falsch =
        statistik.falsch;


    // Mehr falsch als richtig

    if (falsch > richtig) {

        return 5;

    }


    // Gleich viele richtige und falsche Antworten

    if (falsch === richtig) {

        return 4;

    }


    // Mindestens fünf mehr richtige als falsche Antworten

    if (richtig - falsch >= 5) {

        return 1;

    }


    // Sonst mittlere Gewichtung

    return 2;

}


// =====================================================
// 9. GEWICHTETE FRAGE AUSWÄHLEN
// =====================================================

function gewichteteFrageAuswaehlen() {

    let lostopf = [];


    gefilterteFragen.forEach(function(frage, index) {

        const gewicht =
            gewichtBerechnen(frage);


        for (let i = 0; i < gewicht; i++) {

            lostopf.push(index);

        }

    });


    const zufallszahl =
        Math.floor(
            Math.random() * lostopf.length
        );


    return lostopf[zufallszahl];

}


// =====================================================
// 10. NEUE FRAGE ANZEIGEN
// =====================================================

function neueFrage() {


    // -------------------------------------------------
    // KEINE FRAGEN VORHANDEN
    // -------------------------------------------------

    if (gefilterteFragen.length === 0) {

        aktuelleFrage = null;


        const lernmodus =
            document.getElementById("lernmodusFilter").value;


        if (lernmodus === "fehler") {

            document.getElementById("frage").textContent =
                "Keine offenen Fehlerfragen vorhanden.";

        }

        else {

            document.getElementById("frage").textContent =
                "Für diese Auswahl sind keine Fragen vorhanden.";

        }


        document.getElementById("rechtsgebiet").textContent =
            "";


        document.getElementById("thema").textContent =
            "";


        document.querySelector(".trenner").style.display =
            "none";


        document.getElementById("frageRichtig").textContent =
            0;


        document.getElementById("frageFalsch").textContent =
            0;


        document.querySelector(".fragen-statistik").style.display =
            "none";


        document.getElementById("antwort").style.display =
            "none";


        document.getElementById("antwortButton").style.display =
            "none";


        document.getElementById("bewertung").style.display =
            "none";


        return;

    }


    // -------------------------------------------------
    // Elemente wieder einblenden
    // -------------------------------------------------

    document.querySelector(".trenner").style.display =
        "inline";


    document.querySelector(".fragen-statistik").style.display =
        "block";


    let zufallszahl;


    // -------------------------------------------------
    // Gewichtete Frage auswählen
    // -------------------------------------------------

    do {

        zufallszahl =
            gewichteteFrageAuswaehlen();

    } while (

        zufallszahl === letzteFrage &&

        gefilterteFragen.length > 1

    );


    letzteFrage =
        zufallszahl;


    aktuelleFrage =
        gefilterteFragen[zufallszahl];


    // -------------------------------------------------
    // Rechtsgebiet
    // -------------------------------------------------

    document.getElementById("rechtsgebiet").textContent =
        aktuelleFrage.rechtsgebiet;


    // -------------------------------------------------
    // Thema
    // -------------------------------------------------

    document.getElementById("thema").textContent =
        aktuelleFrage.thema;


    // -------------------------------------------------
    // Frage
    // -------------------------------------------------

    document.getElementById("frage").textContent =
        aktuelleFrage.frage;


    // -------------------------------------------------
    // Antwort
    // -------------------------------------------------

    document.getElementById("antwort").textContent =
        aktuelleFrage.antwort;


    // -------------------------------------------------
    // Bisheriger Lernstand
    // -------------------------------------------------

    const statistikDerFrage =
        lernstand[aktuelleFrage.id];


    if (statistikDerFrage) {

        document.getElementById("frageRichtig").textContent =
            statistikDerFrage.richtig;


        document.getElementById("frageFalsch").textContent =
            statistikDerFrage.falsch;

    }

    else {

        document.getElementById("frageRichtig").textContent =
            0;


        document.getElementById("frageFalsch").textContent =
            0;

    }


    // -------------------------------------------------
    // Oberfläche zurücksetzen
    // -------------------------------------------------

    document.getElementById("antwort").style.display =
        "none";


    document.getElementById("bewertung").style.display =
        "none";


    document.getElementById("antwortButton").style.display =
        "block";

}


// =====================================================
// 11. SITZUNGSSTATISTIK AKTUALISIEREN
// =====================================================

function statistikAktualisieren() {

    const bearbeitet =
        anzahlRichtig + anzahlFalsch;


    let quote = 0;


    if (bearbeitet > 0) {

        quote =
            Math.round(
                (anzahlRichtig / bearbeitet) * 100
            );

    }


    document.getElementById("bearbeitet").textContent =
        bearbeitet;


    document.getElementById("richtig").textContent =
        anzahlRichtig;


    document.getElementById("falsch").textContent =
        anzahlFalsch;


    document.getElementById("quote").textContent =
        quote;

}


// =====================================================
// 12. LERNMODUS WIRD GEÄNDERT
// =====================================================

document.getElementById("lernmodusFilter")
    .addEventListener("change", function() {

        fragenFiltern();

    });


// =====================================================
// 13. RECHTSGEBIET WIRD GEÄNDERT
// =====================================================

document.getElementById("rechtsgebietFilter")
    .addEventListener("change", function() {

        themenAktualisieren();

        fragenFiltern();

    });


// =====================================================
// 14. THEMA WIRD GEÄNDERT
// =====================================================

document.getElementById("themaFilter")
    .addEventListener("change", function() {

        fragenFiltern();

    });


// =====================================================
// 15. ANTWORT ANZEIGEN
// =====================================================

document.getElementById("antwortButton")
    .addEventListener("click", function() {

        document.getElementById("antwort").style.display =
            "block";


        document.getElementById("bewertung").style.display =
            "flex";


        document.getElementById("antwortButton").style.display =
            "none";

    });


// =====================================================
// 16. RICHTIG
// =====================================================

document.getElementById("richtigButton")
    .addEventListener("click", function() {


        if (!aktuelleFrage) {

            return;

        }


        // Sitzungsstatistik

        anzahlRichtig++;


        // Lernstand anlegen

        if (!lernstand[aktuelleFrage.id]) {

            lernstand[aktuelleFrage.id] = {

                richtig: 0,

                falsch: 0,

                fehlerfrage: false

            };

        }


        // Richtige Antwort zählen

        lernstand[aktuelleFrage.id].richtig++;


        const lernmodus =
            document.getElementById("lernmodusFilter").value;


        // -------------------------------------------------
        // Nur im Fehlerfragen-Modus wird die Frage nach
        // einer richtigen Antwort von der Fehlerliste
        // entfernt.
        // -------------------------------------------------

        if (lernmodus === "fehler") {

            lernstand[aktuelleFrage.id].fehlerfrage =
                false;

        }


        lernstandSpeichern();


        statistikAktualisieren();


        // Im Fehlerfragen-Modus neu filtern,
        // weil die Frage gerade entfernt wurde.

        if (lernmodus === "fehler") {

            fragenFiltern();

        }

        else {

            neueFrage();

        }

    });


// =====================================================
// 17. FALSCH
// =====================================================

document.getElementById("falschButton")
    .addEventListener("click", function() {


        if (!aktuelleFrage) {

            return;

        }


        // Sitzungsstatistik

        anzahlFalsch++;


        // Lernstand anlegen

        if (!lernstand[aktuelleFrage.id]) {

            lernstand[aktuelleFrage.id] = {

                richtig: 0,

                falsch: 0,

                fehlerfrage: false

            };

        }


        // Falsche Antwort zählen

        lernstand[aktuelleFrage.id].falsch++;


        // -------------------------------------------------
        // Frage auf die Fehlerliste setzen
        // -------------------------------------------------

        lernstand[aktuelleFrage.id].fehlerfrage =
            true;


        lernstandSpeichern();


        statistikAktualisieren();


        neueFrage();

    });


// =====================================================
// 18. LERNSTAND ZURÜCKSETZEN
// =====================================================

document.getElementById("resetButton")
    .addEventListener("click", function() {


        // -------------------------------------------------
        // Sicherheitsabfrage
        // -------------------------------------------------

        const wirklichLoeschen =
            confirm(
                "Möchtest du deinen gesamten Lernstand wirklich zurücksetzen?\n\n" +
                "Dabei werden alle bisherigen richtigen und falschen Antworten " +
                "sowie alle Fehlerfragen gelöscht."
            );


        // Bei "Abbrechen" nichts tun

        if (!wirklichLoeschen) {

            return;

        }


        // -------------------------------------------------
        // Gespeicherten Lernstand löschen
        // -------------------------------------------------

        localStorage.removeItem("lernstand");


        // -------------------------------------------------
        // Lernstand im laufenden Programm leeren
        // -------------------------------------------------

        lernstand = {};


        // -------------------------------------------------
        // Sitzungsstatistik zurücksetzen
        // -------------------------------------------------

        anzahlRichtig = 0;

        anzahlFalsch = 0;


        statistikAktualisieren();


        // -------------------------------------------------
        // Fragen neu laden
        // -------------------------------------------------

        fragenFiltern();


        // -------------------------------------------------
        // Bestätigung
        // -------------------------------------------------

        alert(
            "Der Lernstand wurde vollständig zurückgesetzt."
        );

    });


// =====================================================
// 19. PROGRAMM STARTEN
// =====================================================

filterInitialisieren();

themenAktualisieren();

statistikAktualisieren();

fragenFiltern();