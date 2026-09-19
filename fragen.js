const fragen = [

    {
        id: 1,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Was ist ein Verwaltungsakt?",

        antwort: "Ein Verwaltungsakt ist jede Verfügung, Entscheidung oder andere hoheitliche Maßnahme, die eine Behörde zur Regelung eines Einzelfalls auf dem Gebiet des öffentlichen Rechts trifft und die auf unmittelbare Rechtswirkung nach außen gerichtet ist."
    },

    {
        id: 2,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was schützt Art. 13 Abs. 1 GG?",

        antwort: "Art. 13 Abs. 1 GG schützt die Unverletzlichkeit der Wohnung."
    },

    {
        id: 3,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Welche drei Stufen umfasst die Grundrechtsprüfung?",

        antwort: "1. Schutzbereich, 2. Eingriff, 3. verfassungsrechtliche Rechtfertigung."
    },

    {
        id: 4,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was ist der persönliche Schutzbereich eines Grundrechts?",

        antwort: "Der persönliche Schutzbereich bestimmt, welche Personen sich auf ein bestimmtes Grundrecht berufen können."
    },

    {
        id: 5,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was ist der sachliche Schutzbereich eines Grundrechts?",

        antwort: "Der sachliche Schutzbereich bestimmt, welches Verhalten, welche Tätigkeit oder welches Rechtsgut durch das jeweilige Grundrecht geschützt wird."
    },

    {
        id: 6,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was versteht man unter einem Eingriff in ein Grundrecht?",

        antwort: "Ein Eingriff liegt vor, wenn staatliches Handeln ein Verhalten, das in den Schutzbereich eines Grundrechts fällt, ganz oder teilweise beeinträchtigt."
    },

    {
        id: 7,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was bedeutet die verfassungsrechtliche Rechtfertigung eines Grundrechtseingriffs?",

        antwort: "Bei der verfassungsrechtlichen Rechtfertigung wird geprüft, ob der Eingriff durch die Schranken des Grundrechts gedeckt ist und die gesetzlichen sowie verfassungsrechtlichen Anforderungen eingehalten wurden."
    },

    {
        id: 8,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Was besagt der Grundsatz der Verhältnismäßigkeit?",

        antwort: "Ein staatlicher Eingriff muss einen legitimen Zweck verfolgen und zur Erreichung dieses Zwecks geeignet, erforderlich und angemessen sein."
    },

    {
        id: 9,
        rechtsgebiet: "Staatsrecht",
        thema: "Grundrechte",

        frage: "Welche vier Prüfungsschritte umfasst die Verhältnismäßigkeitsprüfung?",

        antwort: "1. Legitimer Zweck, 2. Geeignetheit, 3. Erforderlichkeit, 4. Angemessenheit."
    },

    {
        id: 10,
        rechtsgebiet: "Staatsrecht",
        thema: "Staatsstrukturprinzipien",

        frage: "Welche Staatsstrukturprinzipien nennt Art. 20 GG?",

        antwort: "Zu den Staatsstrukturprinzipien gehören insbesondere Demokratie, Rechtsstaat, Republik, Sozialstaat und Bundesstaat."
    },

    {
        id: 11,
        rechtsgebiet: "Staatsrecht",
        thema: "Staatsstrukturprinzipien",

        frage: "Was bedeutet das Demokratieprinzip?",

        antwort: "Das Demokratieprinzip verlangt insbesondere, dass alle Staatsgewalt vom Volke ausgeht und durch Wahlen und Abstimmungen sowie durch besondere Organe der Gesetzgebung, der vollziehenden Gewalt und der Rechtsprechung ausgeübt wird."
    },

    {
        id: 12,
        rechtsgebiet: "Staatsrecht",
        thema: "Staatsstrukturprinzipien",

        frage: "Was bedeutet das Bundesstaatsprinzip?",

        antwort: "Das Bundesstaatsprinzip bedeutet, dass die staatliche Gewalt zwischen dem Bund und den Ländern aufgeteilt ist und sowohl der Bund als auch die Länder eigene staatliche Aufgaben und Kompetenzen besitzen."
    },

    {
        id: 13,
        rechtsgebiet: "Staatsrecht",
        thema: "Staatsorgane",

        frage: "Welche fünf ständigen Verfassungsorgane des Bundes werden üblicherweise unterschieden?",

        antwort: "Bundestag, Bundesrat, Bundespräsident, Bundesregierung und Bundesverfassungsgericht."
    },

    {
        id: 14,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Welche Merkmale hat ein Verwaltungsakt nach § 35 Satz 1 VwVfG?",

        antwort: "Hoheitliche Maßnahme, Behörde, Regelung, Einzelfall, Gebiet des öffentlichen Rechts und unmittelbare Rechtswirkung nach außen."
    },

    {
        id: 15,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Was ist eine hoheitliche Maßnahme im Sinne des § 35 Satz 1 VwVfG?",

        antwort: "Eine hoheitliche Maßnahme ist ein einseitiges Handeln einer Behörde auf Grundlage öffentlich-rechtlicher Befugnisse im Über-Unterordnungsverhältnis."
    },

    {
        id: 16,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Was bedeutet das Merkmal 'Regelung' beim Verwaltungsakt?",

        antwort: "Eine Regelung liegt vor, wenn die Maßnahme unmittelbar auf die Herbeiführung einer Rechtsfolge gerichtet ist, also Rechte oder Pflichten begründet, ändert, aufhebt oder verbindlich feststellt."
    },

    {
        id: 17,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Was bedeutet das Merkmal 'Einzelfall' beim Verwaltungsakt?",

        antwort: "Das Merkmal Einzelfall verlangt grundsätzlich eine konkret-individuelle Regelung. Nach § 35 Satz 2 VwVfG können unter bestimmten Voraussetzungen auch Allgemeinverfügungen Verwaltungsakte sein."
    },

    {
        id: 18,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Was bedeutet die Außenwirkung eines Verwaltungsakts?",

        antwort: "Außenwirkung liegt vor, wenn die Regelung auf eine Rechtswirkung gegenüber einer Person außerhalb des verwaltungsinternen Bereichs gerichtet ist."
    },

    {
        id: 19,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Wann wird ein Verwaltungsakt wirksam?",

        antwort: "Nach § 43 Abs. 1 VwVfG wird ein Verwaltungsakt gegenüber demjenigen, für den er bestimmt ist oder der von ihm betroffen wird, in dem Zeitpunkt wirksam, in dem er ihm bekannt gegeben wird."
    },

    {
        id: 20,
        rechtsgebiet: "Verwaltungsrecht",
        thema: "Verwaltungsakt",

        frage: "Wann ist ein Verwaltungsakt nichtig?",

        antwort: "Nach § 44 Abs. 1 VwVfG ist ein Verwaltungsakt nichtig, soweit er an einem besonders schwerwiegenden Fehler leidet und dies bei verständiger Würdigung aller in Betracht kommenden Umstände offensichtlich ist."
    }

];