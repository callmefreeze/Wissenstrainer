// =====================================================
// 1. VARIABLEN
// =====================================================

// Statistik der aktuellen Lernsitzung

let anzahlRichtig = 0;

let anzahlFalsch = 0;


// Index der zuletzt angezeigten Frage

let letzteFrage = -1;


// Aktuell angezeigte Frage

let aktuelleFrage;


// Fragen, die momentan durch die Filter zugelassen sind

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


    // Alle vorhandenen Rechtsgebiete sammeln

    const rechtsgebiete =
        [...new Set(

            fragen.map(function(frage) {

                return frage.rechtsgebiet;

            })

        )];


    // Alphabetisch sortieren

    rechtsgebiete.sort();


    // Rechtsgebiete in das Auswahlmenü eintragen

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


    // Vorhandene Themen löschen

    themaFilter.innerHTML = "";


    // "Alle Themen" wieder hinzufügen

    const alleOption =
        document.createElement("option");


    alleOption.value =
        "alle";


    alleOption.textContent =
        "Alle Themen";


    themaFilter.appendChild(alleOption);


    // -------------------------------------------------
    // Bei "Alle Rechtsgebiete" werden keine einzelnen
    // Themen angeboten.
    // -------------------------------------------------

    if (rechtsgebiet === "alle") {

        themaFilter.value =
            "alle";


        return;

    }


    // -------------------------------------------------
    // Themen des ausgewählten Rechtsgebiets sammeln
    // -------------------------------------------------

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


    // Alphabetisch sortieren

    themen.sort();


    // -------------------------------------------------
    // Themen in das Auswahlmenü eintragen
    // -------------------------------------------------

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


    // Singular oder Plural bestimmen

    const text =
        anzahl === 1
            ? "Frage ausgewählt"
            : "Fragen ausgewählt";


    // Anzahl anzeigen

    document.getElementById("anzahlFragen").textContent =
        anzahl;


    // Text anzeigen

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


    // -------------------------------------------------
    // Alle Fragen prüfen
    // -------------------------------------------------

    gefilterteFragen =
        fragen.filter(function(frage) {


            // =========================================
            // RECHTSGEBIET PRÜFEN
            // =========================================

            const rechtsgebietPasst =

                rechtsgebiet === "alle" ||

                frage.rechtsgebiet === rechtsgebiet;


            // =========================================
            // THEMA PRÜFEN
            // =========================================

            const themaPasst =

                thema === "alle" ||

                frage.thema === thema;


            // =========================================
            // LERNMODUS PRÜFEN
            // =========================================

            let lernmodusPasst = true;


            // Im Fehlerfragen-Modus dürfen nur Fragen
            // erscheinen, die aktuell auf der
            // Fehlerliste stehen.

            if (lernmodus === "fehler") {

                const statistik =
                    lernstand[frage.id];


                lernmodusPasst =

                    statistik &&

                    statistik.fehlerfrage === true;

            }


            // =========================================
            // ERGEBNIS DER FILTERUNG
            // =========================================

            return (
                rechtsgebietPasst &&
                themaPasst &&
                lernmodusPasst
            );

        });


    // -------------------------------------------------
    // Fragenzähler aktualisieren
    // -------------------------------------------------

    fragenzahlAktualisieren();


    // -------------------------------------------------
    // Letzte Frage zurücksetzen
    // -------------------------------------------------

    letzteFrage = -1;


    // -------------------------------------------------
    // Neue Frage anzeigen
    // -------------------------------------------------

    neueFrage();

}


// =====================================================
// 8. GEWICHT EINER FRAGE BERECHNEN
// =====================================================

function gewichtBerechnen(frage) {

    const statistik =
        lernstand[frage.id];


    // -------------------------------------------------
    // Frage wurde noch nie beantwortet
    // -------------------------------------------------

    if (!statistik) {

        return 5;

    }


    const richtig =
        statistik.richtig;


    const falsch =
        statistik.falsch;


    // -------------------------------------------------
    // Mehr falsche als richtige Antworten
    // -------------------------------------------------

    if (falsch > richtig) {

        return 5;

    }


    // -------------------------------------------------
    // Gleich viele richtige und falsche Antworten
    // -------------------------------------------------

    if (falsch === richtig) {

        return 4;

    }


    // -------------------------------------------------
    // Mindestens fünf mehr richtige als falsche
    // Antworten
    // -------------------------------------------------

    if (richtig - falsch >= 5) {

        return 1;

    }


    // -------------------------------------------------
    // Sonst mittlere Wahrscheinlichkeit
    // -------------------------------------------------

    return 2;

}


// =====================================================
// 9. GEWICHTETE FRAGE AUSWÄHLEN
// =====================================================

function gewichteteFrageAuswaehlen() {

    let lostopf = [];


    // -------------------------------------------------
    // Alle aktuell zugelassenen Fragen durchgehen
    // -------------------------------------------------

    gefilterteFragen.forEach(function(frage, index) {

        const gewicht =
            gewichtBerechnen(frage);


        // Die Frage wird entsprechend ihrem Gewicht
        // mehrfach in den Lostopf gelegt.

        for (let i = 0; i < gewicht; i++) {

            lostopf.push(index);

        }

    });


    // -------------------------------------------------
    // Zufällige Stelle im Lostopf auswählen
    // -------------------------------------------------

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


        // -------------------------------------------------
        // Unterschiedlicher Hinweis je nach Lernmodus
        // -------------------------------------------------

        if (lernmodus === "fehler") {

            document.getElementById("frage").textContent =
                "Keine offenen Fehlerfragen vorhanden.";

        }

        else {

            document.getElementById("frage").textContent =
                "Für diese Auswahl sind keine Fragen vorhanden.";

        }


        // -------------------------------------------------
        // Rechtsgebiet und Thema ausblenden
        // -------------------------------------------------

        document.getElementById("rechtsgebiet").textContent =
            "";


        document.getElementById("thema").textContent =
            "";


        document.querySelector(".trenner").style.display =
            "none";


        // -------------------------------------------------
        // Statistik der einzelnen Frage zurücksetzen
        // -------------------------------------------------

        document.getElementById("frageRichtig").textContent =
            0;


        document.getElementById("frageFalsch").textContent =
            0;


        document.getElementById("frageQuote").textContent =
            0;


        document.querySelector(".fragen-statistik").style.display =
            "none";


        // -------------------------------------------------
        // Antwort und Buttons ausblenden
        // -------------------------------------------------

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
    //
    // Das ist wichtig, wenn vorher z. B. keine
    // Fehlerfragen vorhanden waren.
    // -------------------------------------------------

    document.querySelector(".trenner").style.display =
        "inline";


    document.querySelector(".fragen-statistik").style.display =
        "block";


    let zufallszahl;


    // -------------------------------------------------
    // GEWICHTETE FRAGE AUSWÄHLEN
    // -------------------------------------------------

    do {

        zufallszahl =
            gewichteteFrageAuswaehlen();

    } while (

        zufallszahl === letzteFrage &&

        gefilterteFragen.length > 1

    );


    // -------------------------------------------------
    // Ausgewählte Frage merken
    // -------------------------------------------------

    letzteFrage =
        zufallszahl;


    aktuelleFrage =
        gefilterteFragen[zufallszahl];


    // -------------------------------------------------
    // RECHTSGEBIET ANZEIGEN
    // -------------------------------------------------

    document.getElementById("rechtsgebiet").textContent =
        aktuelleFrage.rechtsgebiet;


    // -------------------------------------------------
    // THEMA ANZEIGEN
    // -------------------------------------------------

    document.getElementById("thema").textContent =
        aktuelleFrage.thema;


    // -------------------------------------------------
    // FRAGE ANZEIGEN
    // -------------------------------------------------

    document.getElementById("frage").textContent =
        aktuelleFrage.frage;


    // -------------------------------------------------
    // ANTWORT VORBEREITEN
    // -------------------------------------------------

    document.getElementById("antwort").textContent =
        aktuelleFrage.antwort;


    // -------------------------------------------------
    // BISHERIGEN LERNSTAND DIESER FRAGE ANZEIGEN
    // -------------------------------------------------

    const statistikDerFrage =
        lernstand[aktuelleFrage.id];


    if (statistikDerFrage) {

        const richtig =
            statistikDerFrage.richtig;


        const falsch =
            statistikDerFrage.falsch;


        const insgesamt =
            richtig + falsch;


        let frageQuote = 0;


        // Trefferquote berechnen

        if (insgesamt > 0) {

            frageQuote =
                Math.round(
                    (richtig / insgesamt) * 100
                );

        }


        // Werte anzeigen

        document.getElementById("frageRichtig").textContent =
            richtig;


        document.getElementById("frageFalsch").textContent =
            falsch;


        document.getElementById("frageQuote").textContent =
            frageQuote;

    }

    else {

        document.getElementById("frageRichtig").textContent =
            0;


        document.getElementById("frageFalsch").textContent =
            0;


        document.getElementById("frageQuote").textContent =
            0;

    }


    // -------------------------------------------------
    // OBERFLÄCHE FÜR DIE NEUE FRAGE ZURÜCKSETZEN
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


    // -------------------------------------------------
    // Division durch 0 vermeiden
    // -------------------------------------------------

    if (bearbeitet > 0) {

        quote =
            Math.round(
                (anzahlRichtig / bearbeitet) * 100
            );

    }


    // -------------------------------------------------
    // Werte anzeigen
    // -------------------------------------------------

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


        // Fragen entsprechend dem Lernmodus
        // neu filtern.

        fragenFiltern();

    });


// =====================================================
// 13. RECHTSGEBIET WIRD GEÄNDERT
// =====================================================

document.getElementById("rechtsgebietFilter")
    .addEventListener("change", function() {


        // Themenmenü passend zum Rechtsgebiet
        // neu aufbauen.

        themenAktualisieren();


        // Fragen neu filtern.

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


        // Antwort anzeigen

        document.getElementById("antwort").style.display =
            "block";


        // Bewertungsbuttons anzeigen

        document.getElementById("bewertung").style.display =
            "flex";


        // Antwort-Button ausblenden

        document.getElementById("antwortButton").style.display =
            "none";

    });


// =====================================================
// 16. RICHTIG
// =====================================================

document.getElementById("richtigButton")
    .addEventListener("click", function() {


        // -------------------------------------------------
        // Sicherheitsprüfung
        // -------------------------------------------------

        if (!aktuelleFrage) {

            return;

        }


        // -------------------------------------------------
        // Sitzungsstatistik erhöhen
        // -------------------------------------------------

        anzahlRichtig++;


        // -------------------------------------------------
        // Lernstand anlegen, falls für diese Frage
        // noch keiner vorhanden ist.
        // -------------------------------------------------

        if (!lernstand[aktuelleFrage.id]) {

            lernstand[aktuelleFrage.id] = {

                richtig: 0,

                falsch: 0,

                fehlerfrage: false

            };

        }


        // -------------------------------------------------
        // Richtige Antwort zählen
        // -------------------------------------------------

        lernstand[aktuelleFrage.id].richtig++;


        // -------------------------------------------------
        // Aktuellen Lernmodus bestimmen
        // -------------------------------------------------

        const lernmodus =
            document.getElementById("lernmodusFilter").value;


        // -------------------------------------------------
        // FEHLERFRAGEN-MODUS
        //
        // Nur wenn die Frage im Fehlerfragen-Modus
        // richtig beantwortet wurde, wird sie von
        // der Fehlerliste entfernt.
        // -------------------------------------------------

        if (lernmodus === "fehler") {

            lernstand[aktuelleFrage.id].fehlerfrage =
                false;

        }


        // -------------------------------------------------
        // Lernstand speichern
        // -------------------------------------------------

        lernstandSpeichern();


        // -------------------------------------------------
        // Sitzungsstatistik aktualisieren
        // -------------------------------------------------

        statistikAktualisieren();


        // -------------------------------------------------
        // NÄCHSTE FRAGE
        //
        // Im Fehlerfragen-Modus muss neu gefiltert
        // werden, weil die richtig beantwortete Frage
        // gerade aus der Fehlerliste entfernt wurde.
        // -------------------------------------------------

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


        // -------------------------------------------------
        // Sicherheitsprüfung
        // -------------------------------------------------

        if (!aktuelleFrage) {

            return;

        }


        // -------------------------------------------------
        // Sitzungsstatistik erhöhen
        // -------------------------------------------------

        anzahlFalsch++;


        // -------------------------------------------------
        // Lernstand anlegen, falls für diese Frage
        // noch keiner vorhanden ist.
        // -------------------------------------------------

        if (!lernstand[aktuelleFrage.id]) {

            lernstand[aktuelleFrage.id] = {

                richtig: 0,

                falsch: 0,

                fehlerfrage: false

            };

        }


        // -------------------------------------------------
        // Falsche Antwort zählen
        // -------------------------------------------------

        lernstand[aktuelleFrage.id].falsch++;


        // -------------------------------------------------
        // Frage auf die Fehlerliste setzen
        // -------------------------------------------------

        lernstand[aktuelleFrage.id].fehlerfrage =
            true;


        // -------------------------------------------------
        // Lernstand speichern
        // -------------------------------------------------

        lernstandSpeichern();


        // -------------------------------------------------
        // Sitzungsstatistik aktualisieren
        // -------------------------------------------------

        statistikAktualisieren();


        // -------------------------------------------------
        // Nächste Frage anzeigen
        // -------------------------------------------------

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


        // -------------------------------------------------
        // Sitzungsstatistik aktualisieren
        // -------------------------------------------------

        statistikAktualisieren();


        // -------------------------------------------------
        // Fragen neu filtern und neue Frage anzeigen
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


// Rechtsgebiete aus fragen.js einlesen

filterInitialisieren();


// Themenmenü aufbauen

themenAktualisieren();


// Sitzungsstatistik anzeigen

statistikAktualisieren();


// Fragen anhand der aktuellen Auswahl filtern.
//
// Dadurch wird gleichzeitig:
// 1. der Fragenzähler aktualisiert
// 2. die erste Frage angezeigt

fragenFiltern();