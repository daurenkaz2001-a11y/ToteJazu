
const sourceText = document.getElementById("sourceText");
const resultText = document.getElementById("resultText");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resultStatus = document.getElementById("resultStatus");

const forwardBtn = document.getElementById("forward");
const reverseBtn = document.getElementById("reverse");

let mode = "forward";

// =====================================
// ТӨТЕ ЖАЗУ → КИРИЛЛИЦА
// =====================================

const forwardMap = {
    "ا": "А",
    "و": "О",
    "پ": "П",
    "ڭ": "Ң",
    "ت": "Т",
    "ر": "Р",
    "ۋ": "У",
    "چ": "Ч",
    "ف": "Ф",
    "ل": "Л",
    "ك": "К",
    "ق": "Қ",
    "ى": "Ы",
    "ە": "Е",
    "د": "Д",
    "س": "С",
    "ھ": "Һ",
    "ج": "Ж",
    "ح": "Х",
    "گ": "Г",
    "م": "М",
    "ن": "Н",
    "ب": "Б",
    "ۆ": "В",
    "ع": "Ғ",
    "ش": "Ш",
    "ز": "З"
};

// =====================================
// СӨЗДІК
// Арнайы сөздердің дұрыс жазылуы
// =====================================

const wordDictionary = {
    "ۇيا": "ұя",
    "ۇش": "үш",
    "ۇشكىر": "үшкір",
    "ۇمىت": "үміт",
    "ۇл": "ұл",
    "ىلمەك": "ілмек",
    "يمان": "иман",
    "اي": "ай",
    "اياماي": "аямай",
    "ايۋ": "аю"
};

// =====================================
// КЕРІ АУДАРМА КЕСТЕСІ
// =====================================

const reverseMap = {
    "А": "ا",
    "Ә": "ٴا",
    "О": "و",
    "Ө": "ۇ",
    "П": "پ",
    "Ң": "ڭ",
    "И": "ي",
    "Й": "ي",
    "Т": "ت",
    "Р": "ر",
    "У": "ۋ",
    "Ұ": "ۇ",
    "Ү": "ۇ",
    "Ч": "چ",
    "Ф": "ف",
    "Л": "ل",
    "К": "ك",
    "Қ": "ق",
    "Ы": "ى",
    "І": "ى",
    "Е": "ە",
    "Д": "د",
    "С": "س",
    "Һ": "ھ",
    "Ж": "ج",
    "Х": "ح",
    "Г": "گ",
    "М": "م",
    "Н": "ن",
    "Б": "ب",
    "В": "ۆ",
    "Ғ": "ع",
    "Ш": "ش",
    "З": "ز",
    "Я": "يا",
    "Ю": "يۋ"
};

// Кіші әріптер
for (const [key, value] of Object.entries(reverseMap)) {
    reverseMap[key.toLowerCase()] = value;
}

// =====================================
// РЕЖИМ АУЫСТЫРУ
// =====================================

forwardBtn.addEventListener("click", () => {
    mode = "forward";

    forwardBtn.classList.add("active");
    reverseBtn.classList.remove("active");

    sourceText.placeholder =
        "Төте жазудағы мәтінді енгізіңіз...";
});

reverseBtn.addEventListener("click", () => {
    mode = "reverse";

    reverseBtn.classList.add("active");
    forwardBtn.classList.remove("active");

    sourceText.placeholder =
        "Қазақша мәтінді енгізіңіз...";
});

// =====================================
// СӨЗДІ ТӨТЕ ЖАЗУДАН АУДАРУ
// =====================================

function translateWord(word) {

    const lowerWord = word.toLowerCase();

    // Алдымен сөздіктен іздейміз
    if (wordDictionary[lowerWord]) {
        return wordDictionary[lowerWord];
    }

    let result = "";
    let i = 0;

    // Сөздегі жіңішке дауыстыларды тексеру
    const hasFrontVowel =
        /[ەٴۆ]/u.test(word);

    while (i < word.length) {

        // Ә = ٴا
        if (word.startsWith("ٴا", i)) {
            result += "ә";
            i += 2;
            continue;
        }

        // Ю = يۋ
        if (word.startsWith("يۋ", i)) {
            result += "ю";
            i += 2;
            continue;
        }

        // Я = يا
        if (word.startsWith("يا", i)) {
            result += "я";
            i += 2;
            continue;
        }

        const char = word[i];

        // И және Й
        if (char === "ي") {

            if (i === 0) {
                result += "и";
            } else {
                result += "й";
            }

            i++;
            continue;
        }

        // І және Ы
        if (char === "ى") {
            result += hasFrontVowel ? "і" : "ы";
            i++;
            continue;
        }

        // Ұ және Ү
        if (char === "ۇ") {
            result += hasFrontVowel ? "ү" : "ұ";
            i++;
            continue;
        }

        const translated = forwardMap[char];

        result += translated
            ? translated.toLowerCase()
            : char;

        i++;
    }

    return result;
}

// =====================================
// МӘТІНДІ ТОЛЫҚ АУДАРУ
// =====================================

function translateForward(text) {

    // Сөздер мен тыныс белгілерін бөлек сақтау
    const parts = text.match(
        /[\u0600-\u06FF\u0750-\u077F]+|[^\u0600-\u06FF\u0750-\u077F]+/gu
    ) || [];

    let result = "";

    for (const part of parts) {

        if (/^[\u0600-\u06FF\u0750-\u077F]+$/u.test(part)) {
            result += translateWord(part);
        } else {
            result += part;
        }
    }

    // Сөйлемнің бас әріптерін қалпына келтіру
    return result.replace(
        /(^|[.!?؟\n]\s*)([a-zа-яәіңғүұқөһі])/giu,
        (match, prefix, letter) =>
            prefix + letter.toUpperCase()
    );
}

// =====================================
// КИРИЛЛИЦА → ТӨТЕ ЖАЗУ
// =====================================

function translateReverse(text) {

    let result = "";
    let i = 0;

    while (i < text.length) {

        const pair = text.slice(i, i + 2).toUpperCase();

        // Әріптерді жеке өңдеу
        if (pair === "Ә") {
            result += "ٴا";
            i++;
            continue;
        }

        if (pair === "Ю") {
            result += "يۋ";
            i++;
            continue;
        }

        if (pair === "Я") {
            result += "يا";
            i++;
            continue;
        }

        const char = text[i];
        const translated = reverseMap[char];

        result += translated || char;
        i++;
    }

    return result;
}

// =====================================
// НЕГІЗГІ АУДАРУ ФУНКЦИЯСЫ
// =====================================

function translateText(text) {

    if (mode === "forward") {
        return translateForward(text);
    }

    return translateReverse(text);
}

// =====================================
// АУДАРУ БАТЫРМАСЫ
// =====================================

translateBtn.addEventListener("click", () => {

    const text = sourceText.value;

    if (!text.trim()) {
        resultText.textContent = "Алдымен мәтін енгізіңіз!";
        resultStatus.textContent = "Мәтін жоқ";
        return;
    }

    resultText.textContent = translateText(text);

    resultStatus.textContent = "Аударма дайын";
});

// =====================================
// КӨШІРУ
// =====================================

copyBtn.addEventListener("click", async () => {

    const text = resultText.textContent;

    if (!text || text.includes("осында шығады")) return;

    try {
        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "Көшірілді ✓";

        setTimeout(() => {
            copyBtn.textContent = "Көшіру";
        }, 2000);

    } catch {
        resultStatus.textContent =
            "Көшіру мүмкін болмады";
    }
});

// =====================================
// TXT ЖҮКТЕУ
// =====================================

downloadBtn.addEventListener("click", () => {

    const text = resultText.textContent;

    if (!text || text.includes("осында шығады")) return;

    const blob = new Blob(["\uFEFF" + text], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ToteJazu-audarma.txt";

    link.click();

    URL.revokeObjectURL(url);
});

// =====================================
// БАСТАПҚЫ МӘТІН
// =====================================

sourceText.value = "ٴا";
