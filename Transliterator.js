var text;
var pron;
var ipanl;
var ipaen;
var ipa;
var output;
var language;
// var pinyin = require("pinyin");
var input = document.getElementById("input");

function capApoHyp(str) {
    return str.replace(/'([a-zA-Z, \u00c0-\u00ff, \u0100-\u017f]+)-/g, function (match, p1) {
        return "'" + p1.toUpperCase() + "-";
    });
}

function toTitleCase(str) {
    return str.replace(
      /\p{L}\p{M}*\S*/gu,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

/* function insertApostrophe(str) {
    return str.split(/[\s\n]+/).map(word => {
        if (word.includes("'")) {
            let lastApostropheIndex = word.lastIndexOf("'")
            word = word.slice(0, lastApostropheIndex) + "`" + word.slice(lastApostropheIndex);
            word = word.replace(/'/g, "");
            word = word.replace(/`/g, "'");
            return word;  // Return the word unchanged if it already contains an apostrophe
        }

        let syllables = word.split('-');

        if (syllables.length >= 3) {
            syllables[syllables.length - 3] = "'" + syllables[syllables.length - 3];
        } else if (syllables.length == 2) {
            syllables[0] = "'" + syllables[0];
        }

        return syllables.join('-');
    }).join(' ');
} */

function syllabify(str, vowels, consonants, ends) {
    let vcv = new RegExp(vowels + consonants + vowels, "g");
    let vcc = new RegExp(vowels + consonants + consonants, "g");
    let cce = new RegExp(consonants + "-" + consonants + ends, "g");
    let ccn = new RegExp(consonants + "-" + consonants + "$", "gm");
    let vv = new RegExp(vowels + vowels, "g");

    str = str.replace(vcv, "$1-$2$3");
    str = str.replace(vcv, "$1-$2$3");
    str = str.replace(vcc, "$1$2-$3");
    str = str.replace(vcc, "$1$2-$3");
    str = str.replace(cce, "$1$2$3");
    str = str.replace(ccn, "$1$2");
    str = str.replace(vv, "$1-$2");
    str = str.replace(vv, "$1-$2");

    return str;
}

function apostrophize(str, heavyvowels, lightvowels, consonants, breaks) {
    let hv = new RegExp(breaks + heavyvowels, "g");
        let hcv = new RegExp(breaks + consonants + heavyvowels, "g");
        let hccv = new RegExp(breaks + consonants + consonants + heavyvowels, "g");
        let hcccv = new RegExp(breaks + consonants + consonants + consonants + heavyvowels, "g");
        let lvc = new RegExp(breaks + lightvowels + consonants, "g");
        let lcvc = new RegExp(breaks + consonants + lightvowels + consonants, "g");
        let lccvc = new RegExp(breaks + consonants + consonants + lightvowels + consonants, "g");
        let lcccvc = new RegExp(breaks + consonants + consonants + consonants + lightvowels + consonants, "g");

        str = str.replace(hv, "$1'$2");
        str = str.replace(hcv, "$1'$2$3");
        str = str.replace(hccv, "$1'$2$3$4");
        str = str.replace(hcccv, "$1'$2$3$4$5");
        str = str.replace(hv, "$1'$2");
        str = str.replace(hcv, "$1'$2$3");
        str = str.replace(hccv, "$1'$2$3$4");
        str = str.replace(hcccv, "$1'$2$3$4$5");
        str = str.replace(lvc, "$1'$2$3");
        str = str.replace(lcvc, "$1'$2$3$4");
        str = str.replace(lccvc, "$1'$2$3$4$5");
        str = str.replace(lcccvc, "$1'$2$3$4$5$6");
        str = str.replace(lvc, "$1'$2$3");
        str = str.replace(lcvc, "$1'$2$3$4");
        str = str.replace(lccvc, "$1'$2$3$4$5");
        str = str.replace(lcccvc, "$1'$2$3$4$5$6");
        str = str.replace(/(\.|\,)/, "");

        return str;
}

function insertApostrophe(str) {
    return str.split(/[\s\n]+/).map(word => {
        if (word.includes("-")) {
            let syllables = word.split('-');
            if (syllables.length >= 2) {
                if (syllables[syllables.length - 2].includes("'")) {
                    let word = syllables.join('-')
                    let lastApostropheIndex = word.lastIndexOf("'")
                    word = word.slice(0, lastApostropheIndex) + "`" + word.slice(lastApostropheIndex);
                    word = word.replace(/'/g, "");
                    word = word.replace(/`/g, "'");
                    return word;
                } else if (syllables.length == 2) {
                    syllables[0] = "'" + syllables[0];
                    let word = syllables.join('-');
                    return word;
                } else if (syllables[syllables.length - 3].includes("'")) {
                    let word = syllables.join('-')
                    let lastApostropheIndex = word.lastIndexOf("'")
                    word = word.slice(0, lastApostropheIndex) + "`" + word.slice(lastApostropheIndex);
                    word = word.replace(/'/g, "");
                    word = word.replace(/`/g, "'");
                    return word;
                } else if (syllables.length >= 3) {
                    syllables[syllables.length - 3] = "`" + syllables[syllables.length - 3];
                    let word = syllables.join('-')
                    word = word.replace(/'/g, "");
                    word = word.replace(/`/g, "'");
                    return word;
                }
            }
        } else {
            return word;
        }
    }).join(' ');
}

function IPAtoPG(str) {
    let pron = str;
    pron = pron.replace(/ɡ/g, "g");
    pron = pron.replace(/j/g, "y");
    pron = pron.replace(/ŋg/g, "ng");
    pron = pron.replace(/ŋk/g, "nk");
    pron = pron.replace(/ŋ/g, "ng");
    pron = pron.replace(/ɲ-'(tʃ|dʒ)/g, "n-'$1");
    pron = pron.replace(/ɲ-(tʃ|dʒ)/g, "n-$1");
    pron = pron.replace(/ɲ(tʃ|dʒ)/g, "n$1");
    pron = pron.replace(/ɲ/g, "ny");
    pron = pron.replace(/q/g, "k");
    pron = pron.replace(/ɹ/g, "r");
    pron = pron.replace(/eɪ(-| |\,|\.)/g, "ay$1");
    pron = pron.replace(/eɪ$/gm, "ay");
    pron = pron.replace(/eɪ([kgtdpbyrlvshnmz])(-| |\,|\.)/g, "a$1e$2");
    pron = pron.replace(/eɪ([kgtdpbyrlvshnmz])$/gm, "a$1e");
    pron = pron.replace(/eɪ([kgtdpbyrlvshnmz])d/gm, "a$1ed");
    pron = pron.replace(/eɪʃ(-| |\,|\.)/g, "aysh$1");
    pron = pron.replace(/eɪʃ$/gm, "aysh");
    pron = pron.replace(/oʊ(-| |\,|\.)/g, "oh$1");
    pron = pron.replace(/oʊ$/gm, "oh");
    pron = pron.replace(/oʊ([ktdpbrlvsʃhnmz])(-| |\,|\.)/g, "o$1e$2");
    pron = pron.replace(/oʊ([ktdpbrlvsʃhnmz])$/gm, "o$1e");
    pron = pron.replace(/oʊg(-| |\,|\.)/g, "oag$1");
    pron = pron.replace(/oʊg$/gm, "oag");
    pron = pron.replace(/oʊy(-| |\,|\.)/g, "oy$1");
    pron = pron.replace(/oʊy$/gm, "oy");
    pron = pron.replace(/iː/g, "ee");
    pron = pron.replace(/i/g, "ee");
    pron = pron.replace(/əʊ/g, "ow");
    pron = pron.replace(/əɪ(-| |\,|\.)/g, "y$1");
    pron = pron.replace(/əɪ$/gm, "y");
    pron = pron.replace(/əɪ([kgtdpbyrlvsʃnm])(-| |\,|\.)/g, "i$1e$2");
    pron = pron.replace(/ɑː/g, "ah");
    pron = pron.replace(/ɪ-'([kgtdpbrlvsʃnmz])/g, "i$1-'$1");
    pron = pron.replace(/ɪ-([kgtdpbrlvsʃnmz])/g, "i$1-$1");
    pron = pron.replace(/ɪ-y/g, "ee-y");
    pron = pron.replace(/ɪ-'y/g, "ee-'y");
    pron = pron.replace(/ɪ-([hr])/g, "ih-$1");
    pron = pron.replace(/ɪ-'([hr])/g, "ih-'$1");
    pron = pron.replace(/ɪ([kgtdpbyrlvsʃhnmz])(-| |\,|\.)/g, "i$1$2");
    pron = pron.replace(/ɪ([kgtdpbyrlvsʃhnmz])$/gm, "i$1");
    pron = pron.replace(/ɪng/g, "ing");
    pron = pron.replace(/ʊ/g, "oo");
    pron = pron.replace(/uː/g, "oo");
    pron = pron.replace(/u/g, "oo");
    pron = pron.replace(/ə(-| |\.|\,)/g, "uh$1");
    pron = pron.replace(/ə$/gm, "uh");
    pron = pron.replace(/ək/g, "uck");
    pron = pron.replace(/ətʃ/g, "utch");
    pron = pron.replace(/ədʒ/g, "udge");
    pron = pron.replace(/əy/g, "y");
    pron = pron.replace(/ə([gtdpbsʃnmh])/g, "u$1");
    pron = pron.replace(/ə([rlv])/g, "uh$1");
    pron = pron.replace(/tʃ/g, "ch");
    pron = pron.replace(/dʒ/g, "j");
    pron = pron.replace(/ʃ/g, "sh");
    pron = pron.replace(/x/g, "kh");
    pron = pron.replace(/ɔː/g, "aw");
    pron = capApoHyp(pron);
    pron = pron.replace(/'/g, "");
    return pron;
}

document.getElementById("ipacheckbox").addEventListener('change', function () {
    // Toggle the display of the div based on the checkbox's checked state
    if (document.getElementById("ipacheckbox").checked) {
        document.getElementById("nl").style.display = 'inline';
        document.getElementById("en").style.display = 'inline';
        document.getElementById("nlc").style.display = 'inline';
        document.getElementById("enc").style.display = 'inline';
    } else {
        document.getElementById("nl").style.display = 'none';
        document.getElementById("en").style.display = 'none';
        document.getElementById("nlc").style.display = 'none';
        document.getElementById("enc").style.display = 'none';
    }
});

function translit() {
    text = input.value;
    // text = text.toLowerCase();
    language = document.getElementById("language").value;

    if (language == "hi" || language == "sa") {
        input.style.fontFamily = "Noto Sans Devanagari, sans-serif";
        input.style.fontWeight = 300;
    } else if (language == "ta") {
        input.style.fontFamily = "Noto Sans Tamil, sans-serif";
        input.style.fontWeight = 350;
    } else if (language == "grc" || language == "null") {
        input.style.fontFamily = "Source Sans 3, sans-serif";
        input.style.fontWeight = 350;
    }

    if (language == "hi" || language == "sa") {
        /* text = text.replace(/्/g, "\u200b");
        text = text.replace(/अ/g, "a");
        text = text.replace(/आ/g, "A");
        text = text.replace(/ा/g, "A");
        text = text.replace(/इ/g, "i");
        text = text.replace(/ि/g, "i");
        text = text.replace(/ई/g, "I");
        text = text.replace(/ी/g, "I");
        text = text.replace(/उ/g, "u");
        text = text.replace(/ु/g, "u");
        text = text.replace(/ऊ/g, "U");
        text = text.replace(/ू/g, "U");
        text = text.replace(/ऋ/g, "V");
        text = text.replace(/ृ/g, "V");
        text = text.replace(/ए/g, "E");
        text = text.replace(/े/g, "E");
        text = text.replace(/ऐ/g, "ai");
        text = text.replace(/ै/g, "ai");
        text = text.replace(/ओ/g, "O");
        text = text.replace(/ो/g, "O");
        text = text.replace(/औ/g, "au");
        text = text.replace(/ौ/g, "au");
        text = text.replace(/क/g, "kX");
        text = text.replace(/क़/g, "qX");
        text = text.replace(/ख/g, "khX");
        text = text.replace(/ख़/g, "khX");
        text = text.replace(/ग/g, "gX");
        text = text.replace(/ग़/g, "ghX");
        text = text.replace(/घ/g, "ghX");
        text = text.replace(/ङ/g, "GX");
        text = text.replace(/च/g, "chX");
        text = text.replace(/छ/g, "chhX");
        text = text.replace(/ज/g, "jX");
        text = text.replace(/ज़/g, "zX");
        text = text.replace(/झ/g, "jhX");
        text = text.replace(/़झ/g, "zhX");
        text = text.replace(/ञ/g, "JX");
        text = text.replace(/ट/g, "TX");
        text = text.replace(/ठ/g, "ThX");
        text = text.replace(/ड/g, "DX");
        text = text.replace(/ड़/g, "RX");
        text = text.replace(/ढ/g, "DhX");
        text = text.replace(/ढ़/g, "RhX");
        text = text.replace(/ण/g, "NX");
        text = text.replace(/त/g, "tX");
        text = text.replace(/थ/g, "thX");
        text = text.replace(/द/g, "dX");
        text = text.replace(/ध/g, "dhX");
        text = text.replace(/न/g, "nX");
        text = text.replace(/प/g, "pX");
        text = text.replace(/फ/g, "phX");
        text = text.replace(/फ़/g, "fX");
        text = text.replace(/ब/g, "bX");
        text = text.replace(/भ/g, "bhX");
        text = text.replace(/म/g, "mX");
        text = text.replace(/य/g, "yX");
        text = text.replace(/र/g, "rX");
        text = text.replace(/ल/g, "lX");
        text = text.replace(/व/g, "vX");
        text = text.replace(/श/g, "shX");
        text = text.replace(/ष/g, "SX");
        text = text.replace(/स/g, "sX");
        text = text.replace(/ह/g, "hX");
        text = text.replace(/ळ/g, "LX");
        text = text.replace(/ऴ/g, "ZX");
        text = text.replace(/ॐ/g, "oM");
        text = text.replace(/ऽ/g, "");
        text = text.replace(/।/g, ".");
        text = text.replace(/॥/g, ".");

        text = text.replace(/kX़/g, "qX");
        text = text.replace(/khX़/g, "khX");
        text = text.replace(/gX़/g, "ghX");
        text = text.replace(/jX़/g, "zX");
        text = text.replace(/jhX़/g, "zhX");
        text = text.replace(/DX़/g, "RX");
        text = text.replace(/DhX़/g, "RhX");
        text = text.replace(/phX़/g, "fX");
        text = text.replace(/LX़/g, "ZX");

        text = text.replace(/X\u200b/g, "");
        text = text.replace(/XA/g, "A");
        text = text.replace(/Xai/g, "ai");
        text = text.replace(/Xau/g, "au");
        text = text.replace(/Xi/g, "i");
        text = text.replace(/Xu/g, "u");
        text = text.replace(/XE/g, "E");
        text = text.replace(/XO/g, "O");
        text = text.replace(/XI/g, "I");
        text = text.replace(/XU/g, "U");
        text = text.replace(/XV/g, "V");
        text = text.replace(/X/g, "a");
        // text = text.replace(/(?<=(a|A|i|I|u|U|E|ai|O|au|V|M|H))a/g, "");	

        text = text.replace(/ं/g, "M");
        text = text.replace(/ँ/g, "M");
        text = text.replace(/ः/g, "H");

        text = text.replace(/Mk/g, "nk");
        text = text.replace(/Mg/g, "ng");
        text = text.replace(/Mq/g, "nq");
        text = text.replace(/Mch/g, "nch");
        text = text.replace(/Mj/g, "nj");
        text = text.replace(/Mz/g, "nz");
        text = text.replace(/MT/g, "NT");
        text = text.replace(/MD/g, "ND");
        text = text.replace(/Mt/g, "nt");
        text = text.replace(/Md/g, "nd");
        text = text.replace(/Mp/g, "mp");
        text = text.replace(/Mb/g, "mb");
        text = text.replace(/Gk/g, "nk");
        text = text.replace(/Gg/g, "ng");
        text = text.replace(/Gq/g, "nq");
        text = text.replace(/Jch/g, "nch");
        text = text.replace(/Jj/g, "nj");
        text = text.replace(/Jz/g, "nz");

        if (language == "hi") {
            text = text.replace(/(?<=((a|A|i|I|u|U|E|ai|O|au|V|M|H)(nk|ng|nq|nch|nj|nz|NT|ND|nt|nd|mp|mb|k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)))a\b/g, "");
            if (/(?<=((a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)(k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)a(k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)))a(?=((k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)(a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)))/.test(text)) {
                text = text.replace(/(?<=((a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)(k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)a(k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)))a(?=((k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)(a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)))/g, "");
            } else {
                text = text.replace(/(?<=((a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)(k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)))a(?=((k|kh|q|g|gh|G|ch|chh|j|z|jh|zh|J|T|Th|D|Dh|R|Rh|N|t|th|d|dh|n|p|ph|f|b|bh|m|y|r|l|v|s|sh|S|h|L|Z)(a|A|i|I|u|U|E|ai|O|au|V|M|H|n|N|m)))/g, "");
            }
        } else { }

        // text = text.replace(/Q/g, "");

        text = text.replace(/A/g, "ā");
        text = text.replace(/D/g, "ḍ");
        text = text.replace(/E/g, "ē");
        text = text.replace(/G/g, "ṅ");
        text = text.replace(/H/g, "ḥ");
        text = text.replace(/I/g, "ī");
        text = text.replace(/J/g, "ñ");
        text = text.replace(/L/g, "ḷ");
        text = text.replace(/M/g, "ṃ");
        text = text.replace(/N/g, "ṇ");
        text = text.replace(/O/g, "ō");
        text = text.replace(/R/g, "ṛ");
        text = text.replace(/T/g, "ṭ");
        text = text.replace(/U/g, "ū");
        text = text.replace(/Z/g, "ḻ");

        pron = text;
        ipa = text;

        ipa = ipa.replace(/ḥ /g, " ");
        ipa = ipa.replace(/([aeiouāēīōū])ḥ(\.|,|$)* /gm, "$1ɦ$1$2");
        ipa = ipa.replace(/ḥ/g, "");
        ipa = ipa.replace(/kh/g, "kʰ");
        ipa = ipa.replace(/gh/g, "ɡʱ");
        ipa = ipa.replace(/g/g, "ɡ");
        ipa = ipa.replace(/ṅ/g, "ŋ");
        ipa = ipa.replace(/nk/g, "ŋk");
        ipa = ipa.replace(/nɡ/g, "ŋɡ");
        ipa = ipa.replace(/chh/g, "tɕʰ");
        ipa = ipa.replace(/ch/g, "tɕ");
        ipa = ipa.replace(/jh/g, "dʑʱ");
        ipa = ipa.replace(/j/g, "dʑ");
        ipa = ipa.replace(/ñ/g, "ɲ");
        ipa = ipa.replace(/ndʑ/g, "ɲdʑ");
        ipa = ipa.replace(/ntɕ/g, "ɲtɕ");
        ipa = ipa.replace(/ṭh/g, "ʈʰ");
        ipa = ipa.replace(/ṭ/g, "ʈ");
        ipa = ipa.replace(/ḍh/g, "ɖʱ");
        ipa = ipa.replace(/ḍ/g, "ɖ");
        ipa = ipa.replace(/ṛh/g, "ɽʱ");
        ipa = ipa.replace(/ṛ/g, "ɽ");
        ipa = ipa.replace(/ṇ/g, "ɳ");
        ipa = ipa.replace(/th/g, "tʰ");
        // ipa = ipa.replace(/t/g, "t̪");
        ipa = ipa.replace(/dh/g, "dʱ");
        // ipa = ipa.replace(/d/g, "d̪");
        // ipa = ipa.replace(/n/g, "n̪");
        ipa = ipa.replace(/ph/g, "pʰ");
        ipa = ipa.replace(/bh/g, "bʱ");
        ipa = ipa.replace(/y/g, "j");
        ipa = ipa.replace(/r/g, "ɾ");
        ipa = ipa.replace(/v/g, "ʋ");
        ipa = ipa.replace(/h/g, "ɦ");
        ipa = ipa.replace(/([aeiouāēīōū])ṃ(\.|,| |$)* /gm, "$1m$2");
        ipa = ipa.replace(/ai/g, "ɐɪ̯");
        ipa = ipa.replace(/au/g, "ɐʊ̯");
        ipa = ipa.replace(/a/g, "ɐ");
        ipa = ipa.replace(/ā/g, "ɑː");
        ipa = ipa.replace(/i/g, "ɪ");
        // ipa = ipa.replace(/ɪ(\.|,| |$)* /gm, "i$1");
        ipa = ipa.replace(/ī/g, "iː");
        ipa = ipa.replace(/u/g, "ʊ");
        ipa = ipa.replace(/ū/g, "uː");
        ipa = ipa.replace(/ē/g, "eː");
        ipa = ipa.replace(/ō/g, "oː");
        ipa = ipa.replace(/V/g, "r̩");
        ipa = ipa.replace(/S/g, "ʂ");
        ipa = ipa.replace(/sɦ/g, "ɕ");
        ipa = ipa.replace(/ṃ/g, "m");

        //var vow = new RegExp("(ɐɪ̯|ɐʊ̯|ɐ|ɑː|ɪ|i|iː|ʊ|u|uː|eː|oː|r̩)", "g");
        //var cons = new RegExp("(k)")

        //if (vow.test(ipa)) {
            //ipa = ipa.replace(vow, "aaaaa");
        //}

        pron = pron.replace(/kh/g, "k");
        pron = pron.replace(/gh/g, "g");
        pron = pron.replace(/chh/g, "ch");
        pron = pron.replace(/jh/g, "j");
        pron = pron.replace(/ṭh/g, "ṭ");
        pron = pron.replace(/ṛh/g, "ṛ");
        pron = pron.replace(/ḍh/g, "ḍ");
        pron = pron.replace(/th/g, "t");
        pron = pron.replace(/dh/g, "d");
        pron = pron.replace(/ph/g, "p");
        pron = pron.replace(/bh/g, "b");
        pron = pron.replace(/ñ/g, "J");
        pron = pron.replace(/ṅ/g, "G");
        pron = pron.replace(/ḷ/g, "l");
        pron = pron.replace(/ḍ/g, "d");
        pron = pron.replace(/ṭ/g, "t");
        pron = pron.replace(/ṛ/g, "r");
        pron = pron.replace(/ṃ/g, "m");
        pron = pron.replace(/ṇ/g, "n");
        pron = pron.replace(/sh/g, "S");
        pron = pron.replace(/ch/g, "C");
        pron = pron.replace(/zh/g, "Z");
        pron = pron.replace(/ā/g, "A");
        pron = pron.replace(/ē/g, "E");
        pron = pron.replace(/ī/g, "I");
        pron = pron.replace(/ō/g, "O");
        pron = pron.replace(/ū/g, "U");
        // pron = pron.replace(/./g, "");
        pron = pron.replace(/([aeiouAEIOU])ḥ(\.|,| )*$/gm, "$1h$1$2");
        pron = pron.replace(/ḥ/g, "");
        pron = pron.replace(/,/g, " ,");
        pron = pron.replace(/\./g, " .");
        pron = pron.replace(/V/g, "ri");

        pron = pron.replace(/hm/g, "mh");

        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4$5$6");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4$5");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1-$2$3");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4$5$6");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4$5");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1$2-$3$4");
        pron = pron.replace(/([aeiouAEIOU])([kgCjtdpbyrlvsShGJnm])([aeiouAEIOU])/g, "$1-$2$3");

        pron = pron.replace(/([kgtdpb])-r/g, "-$1r");
        pron = pron.replace(/s-([kgtdpbv])/g, "-s$1");

        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])(A|E|I|O|U|au|ai)/g, "$1'$2$3$4$5");
        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiou])([kgCjtdpbyrlvsShGJnm])/g, "$1'$2$3$4$5$6");
        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])(A|E|I|O|U|au|ai)/g, "$1'$2$3$4");
        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])([kgCjtdpbyrlvsShGJnm])([aeiou])([kgCjtdpbyrlvsShGJnm])/g, "$1'$2$3$4$5");
        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])(A|E|I|O|U|au|ai)/g, "$1'$2$3");
        pron = pron.replace(/(-|\b)([kgCjtdpbyrlvsShGJnm])([aeiou])([kgCjtdpbyrlvsShGJnm])/g, "$1'$2$3$4");
        pron = pron.replace(/(-|\b)(A|E|I|O|U|au|ai)/g, "$1'$2");
        pron = pron.replace(/(-|\b)([aeiou])([kgCjtdpbyrlvsShGJnm])/g, "$1'$2$3");

        pron = pron.replace(/'(?=([a-zA-Z]+ ))/g, "");
        pron = pron.replace(/'(?=([a-zA-Z]+$))/mg, "");

        pron = pron.replace(/^(?!nlnl)/gm, 'newline ');
        pron = insertApostrophe(pron);
        pron = pron.replace(/newline /gm, '\n');
        pron = pron.replace(/\n/, '');

        pron = pron.replace(/au/g, "ow");
        pron = pron.replace(/ai(-|\b)/g, "y$1");
        pron = pron.replace(/ai([kgCjtdpbyrlvsShGJnm])(-|\b)/g, "i$1e$2");
        pron = pron.replace(/a/g, "ə");
        pron = pron.replace(/A/g, "ah");
        pron = pron.replace(/i-'([kgCjtdpbrlvsSnm])/g, "i$1-'$1");
        pron = pron.replace(/i-([kgCjtdpbrlvsSnm])/g, "i$1-$1");
        pron = pron.replace(/i-y/g, "ee-y");
        pron = pron.replace(/i-'y/g, "ee-'y");
        pron = pron.replace(/i-([hr])/g, "ih-$1");
        pron = pron.replace(/i-'([hr])/g, "ih-'$1");
        pron = pron.replace(/i\b/g, "ee");
        pron = pron.replace(/i([kgCjtdpbyrlvsShGJnm])(-|\b)/g, "i$1$2");
        pron = pron.replace(/I/g, "ee");
        pron = pron.replace(/u/g, "oo");
        pron = pron.replace(/U/g, "oo");
        pron = pron.replace(/E(-|\b)/g, "ay$1");
        pron = pron.replace(/E([kgCjtdpbyrlvshGJnm])(-|\b)/g, "a$1e$2");
        pron = pron.replace(/ES(-|\b)/g, "aysh$1");
        pron = pron.replace(/O(-|\b)/g, "oh$1");
        pron = pron.replace(/O([kCjtdpbrlvsShGJnm])(-|\b)/g, "o$1e$2");
        pron = pron.replace(/Og(-|\b)/g, "oag$1");
        pron = pron.replace(/Oy(-|\b)/g, "oy$1");
        pron = pron.replace(/ə-/g, "uh-");
        pron = pron.replace(/ə /g, "uh ");
        pron = pron.replace(/ə$/gm, "uh");
        pron = pron.replace(/ək/g, "uck");
        pron = pron.replace(/əC/g, "utch");
        pron = pron.replace(/əj/g, "udge");
        pron = pron.replace(/əy/g, "y");
        pron = pron.replace(/ə([gtdpbsSnm])/g, "u$1");
        pron = pron.replace(/ə([rlv])/g, "uh$1");

        pron = pron.replace(/S/g, "sh");
        pron = pron.replace(/C/g, "ch");
        pron = pron.replace(/Z/g, "zh");
        pron = pron.replace(/A/g, "ā");
        pron = pron.replace(/E/g, "ē");
        pron = pron.replace(/I/g, "ī");
        pron = pron.replace(/O/g, "ō");
        pron = pron.replace(/U/g, "ū");
        pron = pron.replace(/J/g, "ny");
        pron = pron.replace(/G/g, "ng");
        pron = pron.replace(/jny/g, "gy");
        pron = pron.replace(/-s([gdbv])/g, "s-$1");

        pron = capApoHyp(pron);
        pron = pron.replace(/'/g, "");
        pron = pron.replace(/\s+\./g, ".");
        pron = pron.replace(/\s+,/g, ",");

        text = text.replace(/S/g, "sh");
        text = text.replace(/V/g, "ri");

        document.getElementById("output").value = text;
        document.getElementById("pronunciation").value = pron;
        document.getElementById("ipa").value = ipa; */

        output = text;
        output = output.toLowerCase();
        output = output.replace(/्/g, "\u200b");
        output = output.replace(/अ/g, "a");
        output = output.replace(/आ/g, "ā");
        output = output.replace(/ा/g, "ā");
        output = output.replace(/इ/g, "i");
        output = output.replace(/ि/g, "i");
        output = output.replace(/ई/g, "ī");
        output = output.replace(/ी/g, "ī");
        output = output.replace(/उ/g, "u");
        output = output.replace(/ु/g, "u");
        output = output.replace(/ऊ/g, "ū");
        output = output.replace(/ू/g, "ū");
        output = output.replace(/ऋ/g, "r̥");
        output = output.replace(/ृ/g, "r̥");
        output = output.replace(/ऎ/g, "e");
        output = output.replace(/ॆ/g, "e");
        output = output.replace(/ए/g, "ē");
        output = output.replace(/े/g, "ē");
        output = output.replace(/ऍ/g, "ê");
        output = output.replace(/ॅ/g, "ê");
        output = output.replace(/ऐ/g, "ai");
        output = output.replace(/ै/g, "ai");
        output = output.replace(/ऒ/g, "o");
        output = output.replace(/ॊ/g, "o");
        output = output.replace(/ओ/g, "ō");
        output = output.replace(/ो/g, "ō");
        output = output.replace(/ॉ/g, "ô");
        output = output.replace(/ो/g, "ô");
        output = output.replace(/औ/g, "au");
        output = output.replace(/ौ/g, "au");
        output = output.replace(/क/g, "kX");
        output = output.replace(/क़/g, "qX");
        output = output.replace(/ख/g, "khX");
        output = output.replace(/ख़/g, "xX");
        output = output.replace(/ग/g, "gX");
        output = output.replace(/ग़/g, "ġX");
        output = output.replace(/घ/g, "ghX");
        output = output.replace(/ङ/g, "ṅX");
        output = output.replace(/च/g, "cX");
        output = output.replace(/छ/g, "chX");
        output = output.replace(/ज/g, "jX");
        output = output.replace(/ज़/g, "zX");
        output = output.replace(/झ/g, "jhX");
        output = output.replace(/़झ/g, "žX");
        output = output.replace(/ञ/g, "ñX");
        output = output.replace(/ट/g, "ṭX");
        output = output.replace(/ठ/g, "ṭhX");
        output = output.replace(/ड/g, "ḍX");
        output = output.replace(/ड़/g, "ṛX");
        output = output.replace(/ढ/g, "ḍhX");
        output = output.replace(/ढ़/g, "ṛhX");
        output = output.replace(/ण/g, "ṇX");
        output = output.replace(/त/g, "tX");
        output = output.replace(/थ/g, "thX");
        output = output.replace(/द/g, "dX");
        output = output.replace(/ध/g, "dhX");
        output = output.replace(/न/g, "nX");
        output = output.replace(/प/g, "pX");
        output = output.replace(/फ/g, "phX");
        output = output.replace(/फ़/g, "fX");
        output = output.replace(/ब/g, "bX");
        output = output.replace(/भ/g, "bhX");
        output = output.replace(/म/g, "mX");
        output = output.replace(/ऱ/g, "ṟX");
        output = output.replace(/ऩ/g, "ṉX");
        output = output.replace(/ऴ/g, "ḻX");
        output = output.replace(/य/g, "yX");
        output = output.replace(/य़/g, "yhX");
        output = output.replace(/र/g, "rX");
        output = output.replace(/ल/g, "lX");
        output = output.replace(/ळ/g, "ḷX");
        output = output.replace(/व/g, "vX");
        output = output.replace(/व़/g, "wX");
        output = output.replace(/श/g, "śX");
        output = output.replace(/ष/g, "ṣX");
        output = output.replace(/स/g, "sX");
        output = output.replace(/ह/g, "hX");
        output = output.replace(/ॐ/g, "ōṁ");
        output = output.replace(/ऽ/g, "");
        output = output.replace(/।/g, ".");
        output = output.replace(/॥/g, ".");
        output = output.replace(/ं/g, "ṃ");
        output = output.replace(/ँ/g, "ṁ");
        output = output.replace(/ः/g, "ḥ");
        output = output.replace(/\u0951/g, "");
        output = output.replace(/\u0952/g, "");

        output = output.replace(/X\u200b/g, "");
        output = output.replace(/Xā/g, "ā");
        output = output.replace(/Xi/g, "i");
        output = output.replace(/Xī/g, "ī");
        output = output.replace(/Xu/g, "u");
        output = output.replace(/Xū/g, "ū");
        output = output.replace(/Xr̥/g, "r̥");
        output = output.replace(/Xe/g, "e");
        output = output.replace(/Xē/g, "ē");
        output = output.replace(/Xê/g, "ê");
        output = output.replace(/Xai/g, "ai");
        output = output.replace(/Xo/g, "o");
        output = output.replace(/Xō/g, "ō");
        output = output.replace(/Xô/g, "ô");
        output = output.replace(/Xau/g, "au");
        output = output.replace(/X/g, "a");

        output = output.replace(/०/g, "0");
        output = output.replace(/१/g, "1");
        output = output.replace(/२/g, "2");
        output = output.replace(/३/g, "3");
        output = output.replace(/४/g, "4");
        output = output.replace(/५/g, "5");
        output = output.replace(/६/g, "6");
        output = output.replace(/७/g, "7");
        output = output.replace(/८/g, "8");
        output = output.replace(/९/g, "9");

        output = output.replace(/\s+\./g, ".");
        output = output.replace(/\s+,/g, ",");

        ipanl = output

        ipanl = ipanl.replace(/hm/g, "mh");
        ipanl = ipanl.replace(/\u0028/g, "");
        ipanl = ipanl.replace(/(\.|\,|\?|\!|\"|\')/g, "");
        ipanl = ipanl.replace(/\u0029/g, "");

        var consonants = "(kh|gh|ch|jh|ṭh|ḍh|ṛh|th|dh|ph|bh|k|q|x|g|ġ|ṅ|c|j|z|ž|ñ|ṭ|ḍ|ṛ|ṇ|t|d|n|p|f|b|m|ṟ|ṉ|ḻ|y|ẏ|r|l|ḷ|v|w|ś|ṣ|s|h)";
        var vowels = "(āṃ|iṃ|īṃ|uṃ|ūṃ|r̥ṃ|eṃ|ēṃ|êṃ|aiṃ|oṃ|ōṃ|ôṃ|auṃ|aṃ|āṁ|iṁ|īṁ|uṁ|ūṁ|r̥ṁ|eṁ|ēṁ|êṁ|aiṁ|oṁ|ōṁ|ôṁ|auṁ|aṁ|āḥ|iḥ|īḥ|uḥ|ūḥ|r̥ḥ|eḥ|ēḥ|êḥ|aiḥ|oḥ|ōḥ|ôḥ|auḥ|aḥ|ā|i|ī|u|ū|r̥|e|ē|ê|ai|o|ō|ô|au|a)";
        // var ends = "( |,|\.|\)|\?|\!|\")";
        var ends = "( )";

        ipanl = syllabify(ipanl, vowels, consonants, ends);
        ipanl = ipanl.replace(/t-r/g, "-tr");
        ipanl = ipanl.replace(/ś-r/g, "-śr");
        ipanl = ipanl.replace(/k-h/g, "kh");
        ipanl = ipanl.replace(/g-h/g, "gh");
        ipanl = ipanl.replace(/p-h/g, "ph");
        ipanl = ipanl.replace(/b-h/g, "bh");
        ipanl = ipanl.replace(/a-i/g, "ai");
        ipanl = ipanl.replace(/a-u/g, "au");

        var heavyvowels = "(āṃ|iṃ|īṃ|uṃ|ūṃ|r̥ṃ|eṃ|ēṃ|êṃ|aiṃ|oṃ|ōṃ|ôṃ|auṃ|aṃ|āṁ|iṁ|īṁ|uṁ|ūṁ|r̥ṁ|eṁ|ēṁ|êṁ|aiṁ|oṁ|ōṁ|ôṁ|auṁ|aṁ|āḥ|iḥ|īḥ|uḥ|ūḥ|r̥ḥ|eḥ|ēḥ|êḥ|aiḥ|oḥ|ōḥ|ôḥ|auḥ|aḥ|ā|ī|ū|ō|ē|ai|au)";
        var lightvowels = "(i|u|r̥|e|ê|o|ô|a)";
        // var breaks = "( |\-|\(|\.|\,|\!|\?|\)|\—)";
        var breaks = "( |-|\")";
        ipanl = apostrophize(ipanl, heavyvowels, lightvowels, consonants, breaks);

        ipanl = ipanl.replace(/'(?=([kqhxgġṅcjzžñṭḍṛṇtdnpfbmṟṉḻyẏrlvḷwśṣsāṃiueoīūr̥ēêōôṃḥa]+ ))/g, "");
        ipanl = ipanl.replace(/'(?=([kqhxgġṅcjzžñṭḍṛṇtdnpfbmṟṉḻyẏrlvḷwśṣsāṃiueoīūr̥ēêōôṃḥa]+$))/mg, "");

        ipanl = ipanl.replace(/^(?!nlnl)/gm, 'newline ');
        ipanl = insertApostrophe(ipanl);
        ipanl = ipanl.replace(/newline /gm, '\n');
        ipanl = ipanl.replace(/\n/, '');

        ipanl = ipanl.replace(/([aeiouāēīōū])ḥ(\.|,)/g, "$1-ɦ$1$2");
        ipanl = ipanl.replace(/([aeiouāēīōū])ḥ $/gm, "$1-ɦ$1");
        ipanl = ipanl.replace(/([aeiouāēīōū])ḥ$/gm, "$1-ɦ$1");
        ipanl = ipanl.replace(/ḥ /g, " ");
        ipanl = ipanl.replace(/ḥ/g, "");
        ipanl = ipanl.replace(/kh/g, "kʰ");
        ipanl = ipanl.replace(/gh/g, "ɡʱ");
        ipanl = ipanl.replace(/g/g, "ɡ");
        ipanl = ipanl.replace(/ġ/g, "ɣ");
        ipanl = ipanl.replace(/ṅ/g, "ŋ");
        ipanl = ipanl.replace(/ṃk/g, "ŋk");
        ipanl = ipanl.replace(/ṃɡ/g, "ŋɡ");
        ipanl = ipanl.replace(/ṃ-k/g, "ŋ-k");
        ipanl = ipanl.replace(/ṃ-ɡ/g, "ŋ-ɡ");
        ipanl = ipanl.replace(/ch/g, "tɕʰ");
        ipanl = ipanl.replace(/c/g, "tɕ");
        ipanl = ipanl.replace(/jh/g, "dʑʱ");
        ipanl = ipanl.replace(/j/g, "dʑ");
        ipanl = ipanl.replace(/ñ/g, "ɲ");
        ipanl = ipanl.replace(/ṃdʑ/g, "ɲdʑ");
        ipanl = ipanl.replace(/ṃtɕ/g, "ɲtɕ");
        ipanl = ipanl.replace(/ṃ-dʑ/g, "ɲ-dʑ");
        ipanl = ipanl.replace(/ṃ-tɕ/g, "ɲ-tɕ");
        ipanl = ipanl.replace(/ṭh/g, "ʈʰ");
        ipanl = ipanl.replace(/ṭ/g, "ʈ");
        ipanl = ipanl.replace(/ḍh/g, "ɖʱ");
        ipanl = ipanl.replace(/ḍ/g, "ɖ");
        ipanl = ipanl.replace(/ṛh/g, "ɽʱ");
        ipanl = ipanl.replace(/ṛ/g, "ɽ");
        ipanl = ipanl.replace(/ṇ/g, "ɳ");
        ipanl = ipanl.replace(/ṉ/g, "n");
        ipanl = ipanl.replace(/ṃʈ/g, "ɳʈ");
        ipanl = ipanl.replace(/ṃɖ/g, "ɳɖ");
        ipanl = ipanl.replace(/ṃ-ʈ/g, "ɳ-ʈ");
        ipanl = ipanl.replace(/ṃ-ɖ/g, "ɳ-ɖ");
        ipanl = ipanl.replace(/th/g, "tʰ");
        // ipa = ipa.replace(/t/g, "t̪");
        ipanl = ipanl.replace(/dh/g, "dʱ");
        // ipa = ipa.replace(/d/g, "d̪");
        // ipa = ipa.replace(/n/g, "n̪");
        ipanl = ipanl.replace(/ṃt/g, "nt");
        ipanl = ipanl.replace(/ṃd/g, "nd");
        ipanl = ipanl.replace(/ph/g, "pʰ");
        ipanl = ipanl.replace(/bh/g, "bʱ");
        ipanl = ipanl.replace(/yh/g, "jʱ");
        ipanl = ipanl.replace(/y/g, "j");
        ipanl = ipanl.replace(/r/g, "ɾ");
        ipanl = ipanl.replace(/ṟ/g, "r");
        ipanl = ipanl.replace(/v/g, "ʋ");
        ipanl = ipanl.replace(/ḷ/g, "ɭ");
        ipanl = ipanl.replace(/ḻ/g, "ɻ");
        ipanl = ipanl.replace(/h/g, "ɦ");
        ipanl = ipanl.replace(/ai/g, "ɐɪ̯");
        ipanl = ipanl.replace(/au/g, "ɐʊ̯");
        ipanl = ipanl.replace(/a/g, "ɐ");
        ipanl = ipanl.replace(/ā/g, "ɑː");
        ipanl = ipanl.replace(/i/g, "ɪ");
        ipanl = ipanl.replace(/ɪ(\.|,| )*$/gm, "i$1");
        ipanl = ipanl.replace(/ɪ(\.|,| )/g, "i$1");
        ipanl = ipanl.replace(/ɪ$/gm, "i");
        ipanl = ipanl.replace(/ī/g, "iː");
        ipanl = ipanl.replace(/u/g, "ʊ");
        ipanl = ipanl.replace(/ʊ(\.|,| )*$/gm, "u$1");
        ipanl = ipanl.replace(/ʊ(\.|,| )/g, "u$1");
        ipanl = ipanl.replace(/ʊ$/gm, "u");
        ipanl = ipanl.replace(/ū/g, "uː");
        ipanl = ipanl.replace(/e/g, "ɛ");
        ipanl = ipanl.replace(/ē/g, "eː");
        ipanl = ipanl.replace(/ê/g, "æ");
        ipanl = ipanl.replace(/o/g, "ɔ");
        ipanl = ipanl.replace(/ō/g, "oː");
        ipanl = ipanl.replace(/ô/g, "ɒ");
        ipanl = ipanl.replace(/ɾ̥/g, "r̩");
        ipanl = ipanl.replace(/ṣ/g, "ʂ");
        ipanl = ipanl.replace(/ś/g, "ɕ");
        ipanl = ipanl.replace(/ṃ/g, "m");
        ipanl = ipanl.replace(/dʑɲ/g, "ɟɲ");
        ipanl = ipanl.replace(/dʑ-ɲ/g, "ɟ-ɲ");

        ipaen = ipanl;

        ipaen = ipaen.replace(/(ʰ|ʱ)/g, "");
        ipaen = ipaen.replace(/(ʂ|ɕ)/g, "ʃ");
        ipaen = ipaen.replace(/ʈ/g, "t");
        ipaen = ipaen.replace(/ɖ/g, "d");
        ipaen = ipaen.replace(/ɳ/g, "n");
        ipaen = ipaen.replace(/ɽ/g, "ɾ");
        ipaen = ipaen.replace(/ʑ/g, "ʒ");
        ipaen = ipaen.replace(/ɾ/g, "ɹ");
        ipaen = ipaen.replace(/ɦ/g, "h");
        ipaen = ipaen.replace(/ʋ/g, "v");
        ipaen = ipaen.replace(/ɐ/g, "ə");
        ipaen = ipaen.replace(/r̩/g, "ɹɪ");
        ipaen = ipaen.replace(/ɪ(\.|,| )*$/gm, "i$1");
        ipaen = ipaen.replace(/ɪ(\.|,| )/g, "i$1");
        ipaen = ipaen.replace(/ɟɲ/g, "ɡj");
        ipaen = ipaen.replace(/ɟ-ɲ/g, "ɡ-j");
        ipaen = ipaen.replace(/oː/g, "oʊ");
        ipaen = ipaen.replace(/eː/g, "eɪ");
        ipaen = ipaen.replace(/ɪ̯/g, "ɪ");
        ipaen = ipaen.replace(/ʊ̯/g, "ʊ");
        ipaen = ipaen.replace(/ɒ/g, "ɑː");
        ipaen = ipaen.replace(/ɔ/g, "ɔː");
        ipaen = ipaen.replace(/ɭ/g, "l");
        ipaen = ipaen.replace(/r/g, "ɹ");
        ipaen = ipaen.replace(/ṁ/g, "m");
        ipaen = ipaen.replace(/ɣ/g, "ɡ");

        /* pron = ipaen;

        pron = pron.replace(/ɡ/g, "g");
        pron = pron.replace(/j/g, "y");
        pron = pron.replace(/q/g, "k");
        pron = pron.replace(/ɹ/g, "r");
        pron = pron.replace(/eɪ(-| |\,|\.)/g, "ay$1");
        pron = pron.replace(/eɪ$/gm, "ay");
        pron = pron.replace(/eɪ([kgtdpbyrlvshnmz])(-| |\,|\.)/g, "a$1e$2");
        pron = pron.replace(/eɪ([kgtdpbyrlvshnmz])$/gm, "a$1e");
        pron = pron.replace(/eɪʃ(-| |\,|\.)/g, "aysh$1");
        pron = pron.replace(/eɪʃ$/gm, "aysh");
        pron = pron.replace(/oʊ(-| |\,|\.)/g, "oh$1");
        pron = pron.replace(/oʊ$/gm, "oh");
        pron = pron.replace(/oʊ([ktdpbrlvsʃhnmz])(-| |\,|\.)/g, "o$1e$2");
        pron = pron.replace(/oʊ([ktdpbrlvsʃhnmz])$/gm, "o$1e");
        pron = pron.replace(/oʊg(-| |\,|\.)/g, "oag$1");
        pron = pron.replace(/oʊg$/gm, "oag");
        pron = pron.replace(/oʊy(-| |\,|\.)/g, "oy$1");
        pron = pron.replace(/oʊy$/gm, "oy");
        pron = pron.replace(/iː/g, "ee");
        pron = pron.replace(/i/g, "ee");
        pron = pron.replace(/əʊ/g, "ow");
        pron = pron.replace(/əɪ(-| |\,|\.)/g, "y$1");
        pron = pron.replace(/əɪ$/gm, "y");
        pron = pron.replace(/əɪ([kgtdpbyrlvsʃnm])(-| |\,|\.)/g, "i$1e$2");
        pron = pron.replace(/ɑː/g, "ah");
        pron = pron.replace(/ɪ-'([kgtdpbrlvsʃnmz])/g, "i$1-'$1");
        pron = pron.replace(/ɪ-([kgtdpbrlvsʃnmz])/g, "i$1-$1");
        pron = pron.replace(/ɪ-y/g, "ee-y");
        pron = pron.replace(/ɪ-'y/g, "ee-'y");
        pron = pron.replace(/ɪ-([hr])/g, "ih-$1");
        pron = pron.replace(/ɪ-'([hr])/g, "ih-'$1");
        pron = pron.replace(/ɪ([kgtdpbyrlvsʃhnmz])(-| |\,|\.)/g, "i$1$2");
        pron = pron.replace(/ɪ([kgtdpbyrlvsʃhnmz])$/gm, "i$1");
        pron = pron.replace(/ʊ/g, "oo");
        pron = pron.replace(/uː/g, "oo");
        pron = pron.replace(/u/g, "oo");
        pron = pron.replace(/ə(-| |\.|\,)/g, "uh$1");
        pron = pron.replace(/ə$/gm, "uh");
        pron = pron.replace(/ək/g, "uck");
        pron = pron.replace(/ətʃ/g, "utch");
        pron = pron.replace(/ədʒ/g, "udge");
        pron = pron.replace(/əy/g, "y");
        pron = pron.replace(/ə([gtdpbsʃnmh])/g, "u$1");
        pron = pron.replace(/ə([rlv])/g, "uh$1");
        pron = pron.replace(/tʃ/g, "ch");
        pron = pron.replace(/dʒ/g, "j");
        pron = pron.replace(/ʃ/g, "sh");
        pron = pron.replace(/x/g, "kh");
        pron = pron.replace(/ɔː/g, "aw");
        pron = capApoHyp(pron);
        pron = pron.replace(/'/g, ""); */

        pron = IPAtoPG(ipaen);

        ipanl = ipanl.replace(/-/g, ".");
        ipanl = ipanl.replace(/\'/g, "ˈ");
        ipanl = ipanl.replace(/\.ˈ/g, "ˈ");
        ipanl = ipanl.replace(/ːṁ/g, "̃ː");
        ipanl = ipanl.replace(/ṁ/g, "̃");

        ipaen = ipaen.replace(/-/g, ".");
        ipaen = ipaen.replace(/\'/g, "ˈ");
        ipaen = ipaen.replace(/\.ˈ/g, "ˈ");

        // output = output.replace(/ch/g, "chh");
        output = output.replace(/c/g, "ch");
        output = output.replace(/r̥/g, "ri");
        output = output.replace(/ġ/g, "gh");
        output = output.replace(/x/g, "kh");
        output = output.replace(/ž/g, "zh");
        output = output.replace(/ś/g, "sh");
        output = output.replace(/ṣ/g, "sh");
        output = output.replace(/ṃ(k|g|c|j|t|d)/g, "n$1");
        output = output.replace(/ṃ(p|b)/g, "m$1");
        output = output.replace(/ṃ(ṭ|ḍ|ṛ)/g, "ṇ$1");
        output = output.replace(/ṅk/g, "nk");
        output = output.replace(/ṅg/g, "ng");
        output = output.replace(/ṅq/g, "nq");
        output = output.replace(/ñc/g, "nc");
        output = output.replace(/ñj/g, "nj");
        output = output.replace(/ñz/g, "nz");
        output = output.replace(/ṟ/g, "r");
        output = output.replace(/ṉ/g, "n");
        output = output.replace(/ō/g, "o");
        output = output.replace(/ē/g, "e");
    } else if (language == "ru" || language == "uk") {
        text = text.replace(/а/g, "a");
        text = text.replace(/б/g, "b");
        text = text.replace(/в/g, "v");
        if (language == "uk") {
            text = text.replace(/г/g, "h");
        } else { text = text.replace(/г/g, "g"); }
        text = text.replace(/ґ/g, "g");
        text = text.replace(/д/g, "d");
        if (language == "ru") {
            text = text.replace(/е/g, "ye");
        } else { text = text.replace(/е/g, "e"); }
        text = text.replace(/є/g, "ye");
        text = text.replace(/ё/g, "yo");
        text = text.replace(/ж/g, "zh");
        text = text.replace(/з/g, "z");
        if (language == "uk") {
            text = text.replace(/и/g, "y");
        } else { text = text.replace(/и/g, "i"); }
        text = text.replace(/і/g, "i");
        text = text.replace(/ї/g, "yi");
        text = text.replace(/й/g, "y");
        text = text.replace(/к/g, "k");
        text = text.replace(/л/g, "l");
        text = text.replace(/м/g, "m");
        text = text.replace(/н/g, "n");
        text = text.replace(/о/g, "o");
        text = text.replace(/п/g, "p");
        text = text.replace(/р/g, "r");
        text = text.replace(/с/g, "s");
        text = text.replace(/т/g, "t");
        text = text.replace(/у/g, "u");
        text = text.replace(/ф/g, "f");
        text = text.replace(/х/g, "kh");
        text = text.replace(/ц/g, "ts");
        text = text.replace(/ч/g, "ch");
        text = text.replace(/ш/g, "sh");
        text = text.replace(/щ/g, "shch");
        text = text.replace(/ь/g, "'");
        text = text.replace(/ы/g, "y");
        text = text.replace(/ъ/g, "");
        text = text.replace(/э/g, "e");
        text = text.replace(/ю/g, "yu");
        text = text.replace(/я/g, "ya");

        if (language == "ru") {
            if (/(?<=(b|v|g|d|h|z|k|l|m|n|p|r|s|t|f))ye/.test(text)) {
                text = text.replace(/(?<=(b|v|g|d|h|z|k|l|m|n|p|r|s|t|f))ye/g, "e");
            }
        }

        document.getElementById("output").value = text;
    } else if (language == "ta") {
        text = text.replace(/்/g, "\u200b");
        text = text.replace(/அ/g, "a");
        text = text.replace(/ஆ/g, "A");
        text = text.replace(/ா/g, "A");
        text = text.replace(/இ/g, "i");
        text = text.replace(/ி/g, "i");
        text = text.replace(/ஈ/g, "I");
        text = text.replace(/ீ/g, "I");
        text = text.replace(/உ/g, "u");
        text = text.replace(/ு/g, "u");
        text = text.replace(/ஊ/g, "U");
        text = text.replace(/ூ/g, "U");
        text = text.replace(/எ/g, "e");
        text = text.replace(/ெ/g, "e");
        text = text.replace(/ஏ/g, "E");
        text = text.replace(/ே/g, "E");
        text = text.replace(/ஐ/g, "ai");
        text = text.replace(/ை/g, "ai");
        text = text.replace(/ஒ/g, "o");
        text = text.replace(/ொ/g, "o");
        text = text.replace(/ஓ/g, "O");
        text = text.replace(/ோ/g, "O");
        text = text.replace(/ஔ/g, "au");
        text = text.replace(/ௌ/g, "au");

        text = text.replace(/க/g, "kX");
        text = text.replace(/ங/g, "GX");
        text = text.replace(/ச/g, "chX");
        text = text.replace(/ஞ/g, "JX");
        text = text.replace(/ட/g, "TX");
        text = text.replace(/ண/g, "NX");
        text = text.replace(/த/g, "tX");
        text = text.replace(/ந/g, "nX");
        text = text.replace(/ப/g, "pX");
        text = text.replace(/ம/g, "mX");
        text = text.replace(/ய/g, "yX");
        text = text.replace(/ர/g, "rX");
        text = text.replace(/ல/g, "lX");
        text = text.replace(/வ/g, "vX");
        text = text.replace(/ழ/g, "ZX");
        text = text.replace(/ள/g, "LX");
        text = text.replace(/ற/g, "RX");
        text = text.replace(/ன/g, "nX");

        text = text.replace(/ஜ/g, "jX");
        text = text.replace(/ஷ/g, "shX");
        text = text.replace(/ஶ/g, "shX");
        text = text.replace(/ஸ/g, "sX");
        text = text.replace(/ஹ/g, "hX");
        text = text.replace(/க்ஷ/g, "kshX");

        text = text.replace(/X\u200b/g, "");
        text = text.replace(/XA/g, "A");
        text = text.replace(/Xai/g, "ai");
        text = text.replace(/Xau/g, "au");
        text = text.replace(/Xi/g, "i");
        text = text.replace(/Xu/g, "u");
        text = text.replace(/Xe/g, "e");
        text = text.replace(/Xo/g, "o");
        text = text.replace(/XE/g, "E");
        text = text.replace(/XO/g, "O");
        text = text.replace(/XI/g, "I");
        text = text.replace(/XU/g, "U");
        text = text.replace(/X/g, "a");

        text = text.replace(/(?<=(G|J|N|n|m|y|r|l|v))k/g, "g");
        text = text.replace(/(?<=(G|J|N|n|m|y|r|l|v))ch/g, "j");
        text = text.replace(/(?<=(G|J|N|n|m|y|r|l|v))T/g, "D");
        text = text.replace(/(?<=(G|J|N|n|m|y|r|l|v))t/g, "d");
        text = text.replace(/(?<=(G|J|N|n|m|y|r|l|v))p/g, "b");

        text = text.replace(/Gg/g, "ng");
        text = text.replace(/Jj/g, "nj");

        // text = text.replace(/\bch/g, "s");

        text = text.replace(/(?<=(a|A|i|I|u|U|e|E|ai|o|O|au))k(?=(a|A|i|I|u|U|e|E|ai|o|O|au))/g, "g");
        text = text.replace(/(?<=(a|A|i|I|u|U|e|E|ai|o|O|au))ch(?=(a|A|i|I|u|U|e|E|ai|o|O|au))/g, "s");
        text = text.replace(/(?<=(a|A|i|I|u|U|e|E|ai|o|O|au))T(?=(a|A|i|I|u|U|e|E|ai|o|O|au))/g, "D");
        text = text.replace(/(?<=(a|A|i|I|u|U|e|E|ai|o|O|au))t(?=(a|A|i|I|u|U|e|E|ai|o|O|au))/g, "d");
        text = text.replace(/(?<=(a|A|i|I|u|U|e|E|ai|o|O|au))p(?=(a|A|i|I|u|U|e|E|ai|o|O|au))/g, "b");

        text = text.replace(/gk/g, "kk");
        text = text.replace(/jch/g, "cch");
        text = text.replace(/sch/g, "cch");
        text = text.replace(/chch/g, "cch");
        text = text.replace(/DT/g, "TT");
        text = text.replace(/dt/g, "tt");
        text = text.replace(/bp/g, "pp");

        text = text.replace(/A/g, "ā");
        text = text.replace(/D/g, "ḍ");
        text = text.replace(/E/g, "ē");
        text = text.replace(/G/g, "ṅ");
        text = text.replace(/I/g, "ī");
        text = text.replace(/J/g, "ñ");
        text = text.replace(/L/g, "ḷ");
        text = text.replace(/N/g, "ṇ");
        text = text.replace(/O/g, "ō");
        text = text.replace(/R/g, "ṟ");
        text = text.replace(/T/g, "ṭ");
        text = text.replace(/U/g, "ū");
        text = text.replace(/Z/g, "ḻ");

        document.getElementById("output").value = text;
    } else if (language == "el") {
        text = text.replace(/α/g, "a");
        text = text.replace(/ά/g, "A");
        text = text.replace(/β/g, "v");
        text = text.replace(/γ/g, "gh");
        text = text.replace(/δ/g, "dh");
        text = text.replace(/ε/g, "e");
        text = text.replace(/έ/g, "E");
        text = text.replace(/ζ/g, "z");
        text = text.replace(/η/g, "j");
        text = text.replace(/ή/g, "J");
        text = text.replace(/θ/g, "th");
        text = text.replace(/ι/g, "i");
        text = text.replace(/ί/g, "I");
        text = text.replace(/ϊ/g, "q");
        text = text.replace(/ΐ/g, "Q");
        text = text.replace(/κ/g, "k");
        text = text.replace(/λ/g, "l");
        text = text.replace(/μ/g, "m");
        text = text.replace(/ν/g, "n");
        text = text.replace(/ξ/g, "x");
        text = text.replace(/ο/g, "o");
        text = text.replace(/ό/g, "O");
        text = text.replace(/π/g, "p");
        text = text.replace(/ρ/g, "r");
        text = text.replace(/σ/g, "s");
        text = text.replace(/ς/g, "s");
        text = text.replace(/τ/g, "t");
        text = text.replace(/υ/g, "y");
        text = text.replace(/ύ/g, "Y");
        text = text.replace(/ϋ/g, "c");
        text = text.replace(/ΰ/g, "C");
        text = text.replace(/φ/g, "f");
        text = text.replace(/χ/g, "kh");
        text = text.replace(/ψ/g, "ps");
        text = text.replace(/ω/g, "w");
        text = text.replace(/ώ/g, "W");

        text = text.replace(/ay(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "av");
        text = text.replace(/aY(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "Av");
        text = text.replace(/ey(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "ev");
        text = text.replace(/eY(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "Ev");
        text = text.replace(/jy(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "jv");
        text = text.replace(/jY(?=(a|A|e|E|i|I|o|O|u|U|y|Y|j|J|c|C|w|W|v|g|d|q|Q|z|m|n|r|b|l))/g, "Jv");
        text = text.replace(/ay/g, "af");
        text = text.replace(/aY/g, "Af");
        text = text.replace(/ey/g, "ef");
        text = text.replace(/eY/g, "Ef");
        text = text.replace(/jy/g, "jf");
        text = text.replace(/jY/g, "Jf");

        output = text;
        pron = text;

        output = output.replace(/oy/g, "ou");
        output = output.replace(/oY/g, "oU");

        output = output.replace(/ghgh/g, "ng");
        output = output.replace(/\bmp/g, "b");
        output = output.replace(/mp\b/g, "b");

        output = output.replace(/A/g, "á");
        output = output.replace(/E/g, "é");
        output = output.replace(/I/g, "í");
        output = output.replace(/O/g, "ó");
        output = output.replace(/U/g, "ú");
        output = output.replace(/E/g, "é");
        output = output.replace(/j/g, "i");
        output = output.replace(/J/g, "í");
        output = output.replace(/y/g, "y");
        output = output.replace(/Y/g, "ý");
        output = output.replace(/w/g, "o");
        output = output.replace(/W/g, "ó");
        output = output.replace(/q/g, "ï");
        output = output.replace(/Q/g, "ḯ");
        output = output.replace(/c/g, "ÿ");
        output = output.replace(/C/g, "ÿ́");

        output = output.replace(/gh/g, "g");
        output = output.replace(/dh/g, "d");
        output = output.replace(/kh/g, "ch");

        pron = pron.replace(/ai/g, "e");
        pron = pron.replace(/aI/g, "E");
        pron = pron.replace(/ei/g, "i");
        pron = pron.replace(/eI/g, "I");
        pron = pron.replace(/ji/g, "i");
        pron = pron.replace(/jI/g, "I");
        pron = pron.replace(/oi/g, "i");
        pron = pron.replace(/oI/g, "I");
        pron = pron.replace(/yi/g, "i");
        pron = pron.replace(/yI/g, "I");
        pron = pron.replace(/wi/g, "o");
        pron = pron.replace(/wI/g, "W");
        pron = pron.replace(/oy/g, "u");
        pron = pron.replace(/oY/g, "U");
        pron = pron.replace(/wy/g, "wi");
        pron = pron.replace(/wY/g, "Wi");

        pron = pron.replace(/A/g, "á");
        pron = pron.replace(/E/g, "é");
        pron = pron.replace(/I/g, "í");
        pron = pron.replace(/O/g, "ó");
        pron = pron.replace(/U/g, "ú");
        pron = pron.replace(/E/g, "é");
        pron = pron.replace(/j/g, "i");
        pron = pron.replace(/J/g, "í");
        pron = pron.replace(/y/g, "i");
        pron = pron.replace(/Y/g, "í");
        pron = pron.replace(/w/g, "o");
        pron = pron.replace(/W/g, "ó");
        pron = pron.replace(/q/g, "i");
        pron = pron.replace(/Q/g, "í");
        pron = pron.replace(/c/g, "i");
        pron = pron.replace(/C/g, "í");

        pron = pron.replace(/ghgh/g, "ng");
        pron = pron.replace(/\bghk/g, "g");
        pron = pron.replace(/\Bghk/g, "ng");
        pron = pron.replace(/ghx/g, "nx");
        pron = pron.replace(/ghkh/g, "nkh");
        pron = pron.replace(/\bmp/g, "b");
        pron = pron.replace(/\Bmp/g, "mb");
        pron = pron.replace(/\bnt^h/g, "d");
        pron = pron.replace(/\Bnt^h/g, "nd");
        pron = pron.replace(/tz/g, "dz");

        pron = pron.replace(/(?<=(v|gh|dh|z|th|k|l|m|n|x|p|r|s|t|f|kh|ps|b|d|g|dz|ng|nx|nkh))\1/g, "")

        pron = pron.replace(/th/g, "θ");
        pron = pron.replace(/dh/g, "ð");
        pron = pron.replace(/gh/g, "ɣ");
        pron = pron.replace(/x/g, "ks");
        pron = pron.replace(/kh/g, "x");

        if (/(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/.test(pron)) {
            pron = pron.replace(/(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/g, "'$1$2$3");
        }
        if (/\b(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/.test(pron)) {
            pron = pron.replace(/\b(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/g, "'$1$2");
        }
        if (/(a|e|i|o|u)(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/.test(pron)) {
            pron = pron.replace(/(a|e|i|o|u)(v|ɣ|ð|z|θ|k|l|m|n|p|r|s|t|f|x|b|d|g)(á|é|í|ó|ú)/g, "$1'$2$3");
        }
        if (/\b(á|é|í|ó|ú)/.test(pron)) {
            pron = pron.replace(/ (á|é|í|ó|ú)/g, " '$1");
        }
        if (/(a|e|i|o|u)(á|é|í|ó|ú)/.test(pron)) {
            pron = pron.replace(/(a|e|i|o|u)(á|é|í|ó|ú)/g, "$1'$2");
        }

        document.getElementById("output").value = output;
        document.getElementById("pronunciation").value = pron;
    } else if (language == "zh") {
        if (text.match(/[\u3400-\u9FBF]/)) {
            document.getElementById("output").value = "Sorry, converting Chinese characters to pīnyīn is not supported yet! To create a pronunciation guide, please first convert your input to pīnyīn with a service like Google Translate.";
        } else {
            document.getElementById("output").value = "";
        }
        text = text.replace(/(à|á|ǎ|ā)/g, "a");
        text = text.replace(/(ò|ó|ō|ǒ)/g, "o");
        text = text.replace(/(è|é|ě|ē)/g, "e");
        text = text.replace(/(ì|í|ǐ|ī)/g, "i");
        text = text.replace(/(ū|ù|ú|ǔ)/g, "u");
        text = text.replace(/(ǖ|ǘ|ǚ|ǜ)/g, "ü");

        document.getElementById("pronunciation").value = text;
    } else if (language == "grc") {
        output = text;
        output = output.replace(/ἀ/g, "a");
        output = output.replace(/ἁ/g, "ha");
        output = output.replace(/ἂ/g, "a");
        output = output.replace(/ἃ/g, "ha");
        output = output.replace(/ἄ/g, "a");
        output = output.replace(/ἅ/g, "ha");
        output = output.replace(/ἆ/g, "a");
        output = output.replace(/ἇ/g, "ha");
        output = output.replace(/Ἀ/g, "A");
        output = output.replace(/Ἁ/g, "Ha");
        output = output.replace(/Ἂ/g, "A");
        output = output.replace(/Ἃ/g, "Ha");
        output = output.replace(/Ἄ/g, "A");
        output = output.replace(/Ἅ/g, "Ha");
        output = output.replace(/Ἆ/g, "A");
        output = output.replace(/Ἇ/g, "Ha");
        output = output.replace(/ἐ/g, 'e');
        output = output.replace(/ἑ/g, 'he');
        output = output.replace(/ἒ/g, 'e');
        output = output.replace(/ἓ/g, 'he');
        output = output.replace(/ἔ/g, 'e');
        output = output.replace(/ἕ/g, 'he');
        output = output.replace(/Ἐ/g, 'E');
        output = output.replace(/Ἑ/g, 'He');
        output = output.replace(/Ἒ/g, 'E');
        output = output.replace(/Ἓ/g, 'He');
        output = output.replace(/Ἔ/g, 'E');
        output = output.replace(/Ἕ/g, 'He');
        output = output.replace(/ἠ/g, 'ē');
        output = output.replace(/ἡ/g, 'hē');
        output = output.replace(/ἢ/g, 'ē');
        output = output.replace(/ἣ/g, 'hē');
        output = output.replace(/ἤ/g, 'ē');
        output = output.replace(/ἥ/g, 'hē');
        output = output.replace(/ἦ/g, 'ē');
        output = output.replace(/ἧ/g, 'hē');
        output = output.replace(/Ἠ/g, 'Ē');
        output = output.replace(/Ἡ/g, 'Hē');
        output = output.replace(/Ἢ/g, 'Ē');
        output = output.replace(/Ἣ/g, 'Hē');
        output = output.replace(/Ἤ/g, 'Ē');
        output = output.replace(/Ἥ/g, 'Hē');
        output = output.replace(/Ἦ/g, 'Ē');
        output = output.replace(/Ἧ/g, 'Hē');
        output = output.replace(/ἰ/g, 'i');
        output = output.replace(/ἱ/g, 'hi');
        output = output.replace(/ἲ/g, 'i');
        output = output.replace(/ἳ/g, 'hi');
        output = output.replace(/ἴ/g, 'i');
        output = output.replace(/ἵ/g, 'hi');
        output = output.replace(/ἶ/g, 'i');
        output = output.replace(/ἷ/g, 'hi');
        output = output.replace(/Ἰ/g, 'I');
        output = output.replace(/Ἱ/g, 'Hi');
        output = output.replace(/Ἲ/g, 'I');
        output = output.replace(/Ἳ/g, 'Hi');
        output = output.replace(/Ἴ/g, 'I');
        output = output.replace(/Ἵ/g, 'Hi');
        output = output.replace(/Ἶ/g, 'I');
        output = output.replace(/Ἷ/g, 'Hi');
        output = output.replace(/ὀ/g, 'o');
        output = output.replace(/ὁ/g, 'ho');
        output = output.replace(/ὂ/g, 'o');
        output = output.replace(/ὃ/g, 'ho');
        output = output.replace(/ὄ/g, 'o');
        output = output.replace(/ὅ/g, 'ho');
        output = output.replace(/Ὀ/g, 'O');
        output = output.replace(/Ὁ/g, 'Ho');
        output = output.replace(/Ὂ/g, 'O');
        output = output.replace(/Ὃ/g, 'Ho');
        output = output.replace(/Ὄ/g, 'O');
        output = output.replace(/Ὅ/g, 'Ho');
        output = output.replace(/ὐ/g, 'y');
        output = output.replace(/ὑ/g, 'hy');
        output = output.replace(/ὒ/g, 'y');
        output = output.replace(/ὓ/g, 'hy');
        output = output.replace(/ὔ/g, 'y');
        output = output.replace(/ὕ/g, 'hy');
        output = output.replace(/ὖ/g, 'y');
        output = output.replace(/ὗ/g, 'hy');
        output = output.replace(/Ὑ/g, 'Hy');
        output = output.replace(/Ὓ/g, 'Hy');
        output = output.replace(/Ὕ/g, 'Hy');
        output = output.replace(/Ὗ/g, 'Hy');
        output = output.replace(/ὠ/g, 'ō');
        output = output.replace(/ὡ/g, 'hō');
        output = output.replace(/ὢ/g, 'ō');
        output = output.replace(/ὣ/g, 'hō');
        output = output.replace(/ὤ/g, 'ō');
        output = output.replace(/ὥ/g, 'hō');
        output = output.replace(/ὦ/g, 'ō');
        output = output.replace(/ὧ/g, 'hō');
        output = output.replace(/Ὠ/g, 'Ō');
        output = output.replace(/Ὡ/g, 'Hō');
        output = output.replace(/Ὢ/g, 'Ō');
        output = output.replace(/Ὣ/g, 'Hō');
        output = output.replace(/Ὤ/g, 'Ō');
        output = output.replace(/Ὥ/g, 'Hō');
        output = output.replace(/Ὦ/g, 'Ō');
        output = output.replace(/Ὧ/g, 'Hō');
        output = output.replace(/ὰ/g, 'a');
        output = output.replace(/ά/g, 'a');
        output = output.replace(/ὲ/g, 'e');
        output = output.replace(/έ/g, 'e');
        output = output.replace(/ὴ/g, 'ē');
        output = output.replace(/ή/g, 'ē');
        output = output.replace(/ὶ/g, 'i');
        output = output.replace(/ί/g, 'i');
        output = output.replace(/ὸ/g, 'o');
        output = output.replace(/ό/g, 'o');
        output = output.replace(/ὺ/g, 'y');
        output = output.replace(/ύ/g, 'y');
        output = output.replace(/ὼ/g, 'ō');
        output = output.replace(/ώ/g, 'ō');
        output = output.replace(/ᾀ/g, 'ā');
        output = output.replace(/ᾁ/g, 'hā');
        output = output.replace(/ᾂ/g, 'ā');
        output = output.replace(/ᾃ/g, 'hā');
        output = output.replace(/ᾄ/g, 'ā');
        output = output.replace(/ᾅ/g, 'hā');
        output = output.replace(/ᾆ/g, 'ā');
        output = output.replace(/ᾇ/g, 'hā');
        output = output.replace(/ᾈ/g, 'Ā');
        output = output.replace(/ᾉ/g, 'Hā');
        output = output.replace(/ᾊ/g, 'Ā');
        output = output.replace(/ᾋ/g, 'Hā');
        output = output.replace(/ᾌ/g, 'Ā');
        output = output.replace(/ᾍ/g, 'Hā');
        output = output.replace(/ᾎ/g, 'Ā');
        output = output.replace(/ᾏ/g, 'Hā');
        output = output.replace(/ᾐ/g, 'ē');
        output = output.replace(/ᾑ/g, 'hē');
        output = output.replace(/ᾒ/g, 'ē');
        output = output.replace(/ᾓ/g, 'hē');
        output = output.replace(/ᾔ/g, 'ē');
        output = output.replace(/ᾕ/g, 'hē');
        output = output.replace(/ᾖ/g, 'ē');
        output = output.replace(/ᾗ/g, 'hē');
        output = output.replace(/ᾘ/g, 'Ē');
        output = output.replace(/ᾙ/g, 'Hē');
        output = output.replace(/ᾚ/g, 'Ē');
        output = output.replace(/ᾛ/g, 'Hē');
        output = output.replace(/ᾜ/g, 'Ē');
        output = output.replace(/ᾝ/g, 'Hē');
        output = output.replace(/ᾞ/g, 'Ē');
        output = output.replace(/ᾟ/g, 'Hē');
        output = output.replace(/ᾠ/g, 'ō');
        output = output.replace(/ᾡ/g, 'hō');
        output = output.replace(/ᾢ/g, 'ō');
        output = output.replace(/ᾣ/g, 'hō');
        output = output.replace(/ᾤ/g, 'ō');
        output = output.replace(/ᾥ/g, 'hō');
        output = output.replace(/ᾦ/g, 'ō');
        output = output.replace(/ᾧ/g, 'hō');
        output = output.replace(/ᾨ/g, 'Ō');
        output = output.replace(/ᾩ/g, 'Hō');
        output = output.replace(/ᾪ/g, 'Ō');
        output = output.replace(/ᾫ/g, 'Hō');
        output = output.replace(/ᾬ/g, 'Ō');
        output = output.replace(/ᾭ/g, 'Hō');
        output = output.replace(/ᾮ/g, 'Ō');
        output = output.replace(/ᾯ/g, 'Hō');
        output = output.replace(/ᾰ/g, 'a');
        output = output.replace(/ᾱ/g, 'ā');
        output = output.replace(/ᾲ/g, 'ā');
        output = output.replace(/ᾳ/g, 'ā');
        output = output.replace(/ᾴ/g, 'ā');
        output = output.replace(/ᾶ/g, 'ā');
        output = output.replace(/ᾷ/g, 'ā');
        output = output.replace(/Ᾰ/g, 'A');
        output = output.replace(/Ᾱ/g, 'Ā');
        output = output.replace(/Ὰ/g, 'A');
        output = output.replace(/Ά/g, 'A');
        output = output.replace(/ᾼ/g, 'Ā');
        output = output.replace(/᾽/g, '');
        output = output.replace(/ι/g, '');
        output = output.replace(/᾿/g, '');
        output = output.replace(/῀/g, '');
        output = output.replace(/῁/g, '');
        output = output.replace(/ῂ/g, 'ē');
        output = output.replace(/ῃ/g, 'ē');
        output = output.replace(/ῄ/g, 'ē');
        output = output.replace(/ῆ/g, 'ē');
        output = output.replace(/ῇ/g, 'ē');
        output = output.replace(/Ὲ/g, 'Ē');
        output = output.replace(/Έ/g, 'Ē');
        output = output.replace(/Ὴ/g, 'Ē');
        output = output.replace(/Ή/g, 'Ē');
        output = output.replace(/ῌ/g, 'Ē');
        output = output.replace(/῍/g, '');
        output = output.replace(/῎/g, '');
        output = output.replace(/῏/g, '');
        output = output.replace(/ῐ/g, 'i');
        output = output.replace(/ῑ/g, 'ī');
        output = output.replace(/ῒ/g, 'ï');
        output = output.replace(/ΐ/g, 'ï');
        output = output.replace(/ῖ/g, 'ī');
        output = output.replace(/ῗ/g, 'ï');
        output = output.replace(/Ῐ/g, 'I');
        output = output.replace(/Ῑ/g, 'Ī');
        output = output.replace(/Ὶ/g, 'I');
        output = output.replace(/Ί/g, 'I');
        output = output.replace(/῝/g, '');
        output = output.replace(/῞/g, '');
        output = output.replace(/῟/g, '');
        output = output.replace(/ῠ/g, 'y');
        output = output.replace(/ῡ/g, 'ȳ');
        output = output.replace(/ῢ/g, 'ÿ');
        output = output.replace(/ΰ/g, 'ÿ');
        output = output.replace(/ῦ/g, 'ȳ');
        output = output.replace(/ῧ/g, 'ÿ');
        output = output.replace(/Ῠ/g, 'Y');
        output = output.replace(/Ῡ/g, 'Ȳ');
        output = output.replace(/Ὺ/g, 'Y');
        output = output.replace(/Ύ/g, 'Y');
        output = output.replace(/῭/g, '');
        output = output.replace(/΅/g, '');
        output = output.replace(/`/g, '');
        output = output.replace(/ῲ/g, 'ō');
        output = output.replace(/ῳ/g, 'ō');
        output = output.replace(/ῴ/g, 'ō');
        output = output.replace(/ῶ/g, 'ō');
        output = output.replace(/ῷ/g, 'ō');
        output = output.replace(/Ὸ/g, 'O');
        output = output.replace(/Ό/g, 'O');
        output = output.replace(/Ὼ/g, 'Ō');
        output = output.replace(/Ώ/g, 'Ō');
        output = output.replace(/ῼ/g, 'Ō');
        output = output.replace(/´/g, '');
        output = output.replace(/῾/g, '');
        output = output.replace(/Α/g, 'A');
        output = output.replace(/α/g, 'a');
        output = output.replace(/Ε/g, 'E');
        output = output.replace(/ε/g, 'e');
        output = output.replace(/Η/g, 'Ē');
        output = output.replace(/η/g, 'ē');
        output = output.replace(/Ι/g, 'I');
        output = output.replace(/ι/g, 'i');
        output = output.replace(/Ο/g, 'O');
        output = output.replace(/ο/g, 'o');
        output = output.replace(/Υ/g, 'Y');
        output = output.replace(/υ/g, 'y');
        output = output.replace(/Ω/g, 'Ō');
        output = output.replace(/ω/g, 'ō');
        output = output.replace(/΄/g, '');
        output = output.replace(/΅/g, '');
        output = output.replace(/ΐ/g, 'ï');
        output = output.replace(/ΰ/g, 'ÿ');
        output = output.replace(/Ϊ/g, 'Ï');
        output = output.replace(/Ϋ/g, 'Ÿ');
        output = output.replace(/ϊ/g, 'ï');
        output = output.replace(/ϋ/g, 'ÿ');
        output = output.replace(/Ά/g, 'A');
        output = output.replace(/ά/g, 'a');
        output = output.replace(/Έ/g, 'E');
        output = output.replace(/έ/g, 'e');
        output = output.replace(/Ή/g, 'Ē');
        output = output.replace(/ή/g, 'ē');
        output = output.replace(/Ί/g, 'I');
        output = output.replace(/ί/g, 'i');
        output = output.replace(/Ό/g, 'O');
        output = output.replace(/ό/g, 'o');
        output = output.replace(/Ύ/g, 'Y');
        output = output.replace(/ύ/g, 'y');
        output = output.replace(/Ώ/g, 'Ō');
        output = output.replace(/ώ/g, 'ō');
        output = output.replace(/Ay/g, 'Au');
        output = output.replace(/Āy/g, 'Āu');
        output = output.replace(/ay/g, 'au');
        output = output.replace(/āy/g, 'āu');
        output = output.replace(/Aȳ/g, 'Āu');
        output = output.replace(/aȳ/g, 'āu');
        output = output.replace(/Ey/g, 'Eu');
        output = output.replace(/Ēy/g, 'Ēu');
        output = output.replace(/ey/g, 'eu');
        output = output.replace(/ēy/g, 'ēu');
        output = output.replace(/Eȳ/g, 'Ēu');
        output = output.replace(/eȳ/g, 'ēu');
        output = output.replace(/Oy/g, 'Ū');
        output = output.replace(/Ōy/g, 'Ū');
        output = output.replace(/oy/g, 'ū');
        output = output.replace(/ōy/g, 'ū');
        output = output.replace(/Oȳ/g, 'Ū');
        output = output.replace(/oȳ/g, 'ū');
        output = output.replace(/\u0313/g, '');
        output = output.replace(/\u0301/g, '');
        output = output.replace(/Β/g, "B");
        output = output.replace(/β/g, "b");
        output = output.replace(/γγ/g, "ng");
        output = output.replace(/γκ/g, "nc");
        output = output.replace(/γξ/g, "nx");
        output = output.replace(/γχ/g, "nch");
        output = output.replace(/Γ/g, "G");
        output = output.replace(/γ/g, "g");
        output = output.replace(/Δ/g, "D");
        output = output.replace(/δ/g, "d");
        output = output.replace(/Ζ/g, "Z");
        output = output.replace(/ζ/g, "z");
        output = output.replace(/Θ/g, "Th");
        output = output.replace(/θ/g, "th");
        output = output.replace(/Κ/g, "C");
        output = output.replace(/κ/g, "c");
        output = output.replace(/Λ/g, "L");
        output = output.replace(/λ/g, "l");
        output = output.replace(/Μ/g, "M");
        output = output.replace(/μ/g, "m");
        output = output.replace(/Ν/g, "N");
        output = output.replace(/ν/g, "n");
        output = output.replace(/Ξ/g, "X");
        output = output.replace(/ξ/g, "x");
        output = output.replace(/Π/g, "P");
        output = output.replace(/π/g, "p");
        output = output.replace(/Ῥ/g, "Rh");
        output = output.replace(/Ρ/g, "Rh");
        output = output.replace(/ῤῥ/g, "rrh");
        output = output.replace(/ρρ/g, "rrh");
        output = output.replace(/ῥ/g, "rh");
        output = output.replace(/ῤ/g, "r");
        output = output.replace(/ρ/g, "r");
        output = output.replace(/Σ/g, "S");
        output = output.replace(/σ/g, "s");
        output = output.replace(/oς/g, 'osq');
        output = output.replace(/ς/g, "s");
        output = output.replace(/Τ/g, "T");
        output = output.replace(/τ/g, "t");
        output = output.replace(/Φ/g, "Ph");
        output = output.replace(/φ/g, "ph");
        output = output.replace(/Χ/g, "Ch");
        output = output.replace(/χ/g, "ch");
        output = output.replace(/Ψ/g, "Ps");
        output = output.replace(/ψ/g, "ps");

        ipanl = output.toLowerCase();
        ipanl = ipanl.replace(/x/g, "ks");
        ipanl = ipanl.replace(/\u0028/g, "");
        ipanl = ipanl.replace(/(\.|\,|\?|\!|\"|\')/g, "");
        ipanl = ipanl.replace(/\u0029/g, "");
        ipanl = ipanl.replace(/nɡ/g, "ŋɡ");
        ipanl = ipanl.replace(/nk/g, "ŋk");

        var consonants = "(ch|th|ph|c|t|p|g|d|b|s|z|l|m|n|rh|r|ŋ|cl|cr|pl|pr|tl|tr|k)";
        var vowels = "(a|e|i|o|u|y|ā|ē|ī|ō|ū|ȳ|yi|ei|eu|oi|ou|ai|au|ēi|ēu|ōi|ōu|āi|āu|ï|ÿ)";
        var ends = "( )";
        var notadiph = "(a|ã|o|ō|e|ē|ï|ÿ)";
        ipanl = syllabify(ipanl, vowels, consonants, ends);

        let vv = new RegExp(vowels + notadiph, "g");
        ipanl = ipanl.replace(vv, "$1-$2");
        ipanl = ipanl.replace(vv, "$1-$2");

        ipanl = ipanl.replace(/ï/, "i");
        ipanl = ipanl.replace(/ÿ/, "y");

        var heavyvowels = "(ā|ē|ī|ō|ū|ȳ|yi|ei|eu|oi|ou|ai|au|ēi|ēu|ōi|ōu|āi|āu)";
        var lightvowels = "(a|e|i|o|u|y)";
        var breaks = "( |-|\")";
        ipanl = apostrophize(ipanl, heavyvowels, lightvowels, consonants, breaks);

        ipanl = ipanl.replace(/'(?=([aeiouyāēīōūȳbcdfghlmnprstzŋÿïq]+ ))/g, "");
        ipanl = ipanl.replace(/'(?=([aeiouyāēīōūȳbcdfghlmnprstzŋÿïq]+$))/mg, "");

        ipanl = ipanl.replace(/^(?!nlnl)/gm, 'newline ');
        ipanl = insertApostrophe(ipanl);
        ipanl = ipanl.replace(/newline /gm, '\n');
        ipanl = ipanl.replace(/\n/, '');

        ipaen = ipanl;

        ipaen = ipaen.replace(/-/g, "x");
        ipaen = ipaen.replace(/\'/g, "j");

        ipaen = ipaen.replace(/ā/g, "a");
        ipaen = ipaen.replace(/ē/g, "e");
        ipaen = ipaen.replace(/ī/g, "i");
        ipaen = ipaen.replace(/ō/g, "o");
        ipaen = ipaen.replace(/ū/g, "u");
        ipaen = ipaen.replace(/ȳ/g, "y");
        ipaen = ipaen.replace(/y/g, "i");
        ipaen = ipaen.replace(/ai/g, "e");
        ipaen = ipaen.replace(/oi/g, "e");
        
        ipaen = ipaen.toUpperCase(ipaen);

        // Type 1 Short Vowels
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(A)([BCDEFGHKLMNPQSTVWYZ]+)\b/gm, "$1æ$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(AR)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1ɑːr$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(E)([BCDEFGHKLMNPQSTVWYZ]+)\b/gm, "$1ɛ$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(I)([BCDEFGHKLMNPQSTVWYZ]+)\b/gm, "$1ɪ$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(ER)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1ɜːr$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(IR)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1ɜːr$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(O)([BCDEFGHKLMNPQSTVWYZ]+)\b/gm, "$1ɒ$3");
        ipaen = ipaen.replace(/\b([BCDEFGHKLMNPQRSTVWYZ]*)(OR)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1ɔːr$3");

        // Type 2 Short Vowels
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(A)([BCDEFGHKLMNPQSTVWYZ]+)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2æ$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(AR)([BCDEFGHKLMNPQSTVWYZ]*)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɑːr$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(E)([BCDEFGHKLMNPQSTVWYZ]+)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɛ$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(I)([BCDEFGHKLMNPQSTVWYZ]+)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɪ$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(ER)([BCDEFGHKLMNPQSTVWYZ]*)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɜːr$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(O)([BCDEFGHKLMNPQSTVWYZ]+)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɒ$4$5$6$7$8");
        ipaen = ipaen.replace(/(J)([BCDEFGHKLMNPQRSTVWYZ]*)(OR)([BCDEFGHKLMNPQSTVWYZ]*)(X)([BCDEFGHKLMNPQRSTVWYZ]*)([AEIOU]+)([BCDEFGHKLMNPQSTVWYZ]*)\b/gm, "$1$2ɔːr$4$5$6$7$8");

        ipaen = ipaen.replace(/P-PH/g, "f-f");
        ipaen = ipaen.replace(/PH/g, "f");
        ipaen = ipaen.replace(/T-TH/g, "θ-θ");
        ipaen = ipaen.replace(/TH/g, "θ");
        ipaen = ipaen.replace(/C-CH/g, "k-k");
        ipaen = ipaen.replace(/CH/g, "k");
        ipaen = ipaen.replace(/C/g, "k");
        ipaen = ipaen.replace(/RH/g, "r");
        ipaen = ipaen.replace(/G/g, "ɡ");
        ipaen = ipaen.replace(/\bBD/g, "d");
        ipaen = ipaen.replace(/\bTM/g, "m");
        ipaen = ipaen.replace(/\bkN/g, "n");
        ipaen = ipaen.replace(/\bɡN/g, "n");
        ipaen = ipaen.replace(/\bGN/g, "n");
        ipaen = ipaen.replace(/\bMN/g, "n");
        ipaen = ipaen.replace(/\bPN/g, "n");
        ipaen = ipaen.replace(/\bPS/g, "s");
        ipaen = ipaen.replace(/\bkT/g, "t");
        ipaen = ipaen.replace(/\bPT/g, "t");
        ipaen = ipaen.replace(/\bkθ/g, "θ");
        ipaen = ipaen.replace(/\bfθ/g, "θ");
        ipaen = ipaen.replace(/\bKS/g, "z");

        ipanl = ipanl.replace(/ph/g, "pʰ");
        ipanl = ipanl.replace(/th/g, "tʰ");
        ipanl = ipanl.replace(/ch/g, "kʰ");
        ipanl = ipanl.replace(/c/g, "k");
        ipanl = ipanl.replace(/rh/g, "r̥");
        ipanl = ipanl.replace(/g/g, "ɡ");
        ipanl = ipanl.replace(/ā/g, "aː");
        ipanl = ipanl.replace(/ē/g, "ɛː");
        ipanl = ipanl.replace(/ei/g, "eː");
        ipanl = ipanl.replace(/ī/g, "iː");
        ipanl = ipanl.replace(/ō/g, "ɔː");
        ipanl = ipanl.replace(/ū/g, "uː");
        ipanl = ipanl.replace(/osq/g, "os");
        ipanl = ipanl.replace(/u/g, "w");
        ipanl = ipanl.replace(/ȳ/g, "yː");

        output = output.replace(/Ai/g, 'Ae');
        output = output.replace(/ai/g, 'ae');
        output = output.replace(/Aī/g, 'Ae');
        output = output.replace(/aī/g, 'ae');
        output = output.replace(/Oi/g, 'Oe');
        output = output.replace(/oi/g, 'oe');
        output = output.replace(/Oī/g, 'Oe');
        output = output.replace(/oī/g, 'oe');
        output = output.replace(/drosq/g, 'der');
        output = output.replace(/trosq/g, 'ter');
        output = output.replace(/brosq/g, 'ber');
        output = output.replace(/prosq/g, 'per');
        output = output.replace(/crosq/g, 'cer');
        output = output.replace(/grosq/g, 'ger');
        output = output.replace(/chrosq/g, 'cher');
        output = output.replace(/throsq/g, 'ther');
        output = output.replace(/phrosq/g, 'pher');
        output = output.replace(/osq/g, 'us');

        pron = IPAtoPG(ipaen);

        ipanl = ipanl.replace(/-/g, ".");
        ipanl = ipanl.replace(/\'/g, "ˈ");
        ipanl = ipanl.replace(/\.ˈ/g, "ˈ");

        ipaen = ipaen.replace(/X/g, ".");
        ipaen = ipaen.replace(/J/g, "ˈ");
        ipaen = ipaen.replace(/\.J/g, "ˈ");
    }
    if (language == "sa") {
        document.getElementById("notes").innerHTML = "All output is experimental and may be erroneous. For best practices:<br><ol><li>Ensure you are pasting in Sanskrit or Pali text in the <a href='https://en.wikipedia.org/wiki/Devanagari' target='_blank' rel='noopener noreferrer'>Devanagari script</a>. Double-check that both the text and the desired output are not actually Hindi, Marathi, Bhojpuri, Nepali, and so on. If Sanskrit-language text is unavailable on a term's Wikipedia page, check for a Sanskrit-language version of the page and copy-paste the title of the page. If Devanagari-script Pali-language text is unavailable on a term's Wikipedia page, try looking the term up on Wiktionary. If all else fails, try translating the term from English to Sanskrit on <a href='https://translate.google.com/?sl=en&tl=sa&op=translate' target='_blank' rel='noopener noreferrer'>Google Translate</a>.</li><br><li>Compare the pronunciation output with the romanized output and compare both with the expected output; if there is a mismatch (receiving 'kriṇsha' or (\"KRAHSH-nuh\") for expected 'krishṇa' and (\"KRISH-nuh\"), for example), then there is an error in the input or code.</li><br><li>Edit the pronunciation guides to make sense for you and potential readers. While the output should mostly be ready for use, my code cannot anticipate all possible combinations of sounds or the intricacies of English phonotactics.</li><br><li>Words over five syllables or compound words may require chunking in order to manually determine secondary stress.</li><br><li>Have your pronunciation guides double-checked during proofreading.</li></ol><br>The romanization convention used here is in line with common use and the Indian government's Hunterian system rather than the scholarly International Alphabet of Sanskrit Transliteration. Among the changes made to IAST to improve readability and recognition are ‹ṛ› to ‹ri›, ‹c› to ‹ch› and ‹ch› to ‹chh›, ‹ś› and ‹ṣ› to ‹sh›, the removal of diacritics on the homorganic nasals ‹ṅ› and ‹ñ›, and the addition of macrons to the long vowels ‹ē› and ‹ō›. As such, Krishna is romanized Krishṇa instead of Kṛṣṇa. Stress placement is based on scholarly Western tradition based on Latin and may not align with Sanskrit pronunciation for words longer than three syllables.";
        document.getElementById("input").placeholder = "Paste Devanagari-script Sanskrit or Pali text here";
        document.getElementById("output").placeholder = "Romanized text will appear here";
        document.getElementById("input").readOnly = false;
    } else if (language == "grc") {
        document.getElementById("notes").innerHTML = "All output is experimental and may be erroneous. For best practices:<br><ol><li>Ensure you are pasting in Ancient Greek text; double-check that both the text and the desired output are not actually Modern Greek. If Ancient Greek-language text is unavailable on a term's Wikipedia page, try looking the term up on Wiktionary or another dictionary.</li><br><li>Compare the pronunciation output with the romanized output and compare both with the expected output; if there is a mismatch, then there is an error in the input or code.</li><br><li>Use diacritics, and especially macrons to indicate long vowels, to result in the most accurate pronunciation; otherwise, inputting 'Αφροδιτη' for 'Αφροδῑτη' may lead to the pronunciation (\"uh-FRAW-dit-tee\") instead of (\"af-ruh-DY-tee\") for 'Aphrodite,' and inputting 'Αιδης' for 'ᾉδης' may lead to the pronunciation (\"EE-deez\") instead of (\"HAY-deez\") for 'Hades' (although Wikipedia provides the rough breathing mark and adscript iota for the latter).</li><br><li>Edit the pronunciation guides to make sense for you and potential readers. While the output should mostly be ready for use, my code cannot anticipate all possible combinations of sounds or the intricacies of English phonotactics.</li><br><li>Have your pronunciation guides double-checked during proofreading.</li></ol><br>The romanization and pronunciation conventions used here are those for Ancient Greek words which have entered English through Latin and will not match actual Ancient Greek pronunciation. There are a large number of inconsistencies in the romanization and pronunciation of Ancient Greek; for example, κ may be romanized ‹k› or ‹c› and -ος may be romanized ‹-os› or ‹-us›, while ει ‹ei› is pronounced /iː/ (\"ee\") in 'Pleiades' (Lat. Plēiadēs, merging with ηι) but /aɪ/ (\"eye\") in 'Poseidon' (Lat. Posīdōn) and can also be romanized ‹i› as in 'Deianira' (Lat. Dēianīra). I have selected for the most common variants, but make sure to double-check the output.";
        document.getElementById("input").placeholder = "Paste Greek-script Ancient Greek text here";
        document.getElementById("output").placeholder = "Romanized text will appear here";
        document.getElementById("input").readOnly = false;
    } else if (language == "null") {
        document.getElementById("notes").innerHTML = "This is a tool to romanize and provide rudimentary pronunciation guides for a number of common languages in a quizbowl-friendly format. Note that this tool is meant to ease and automate certain parts of proofreading, but this cannot substitute for human input and the output must be double-checked.<br><br>To use this, first select a language from the dropdown menu in the top left. Then, paste text into the first text area in the language's original script. The remaining text areas should automatically populate as makes sense.<br><br>Some languages are not present or lack full functionality due to difficulties present in their sound-spelling correspondences. For example, unvocalized Arabic cannot be adequately romanized while unaccented Russian can be romanized but not adequately transcribed to pronunciation.";
        document.getElementById("input").placeholder = "";
        document.getElementById("output").placeholder = "";
        document.getElementById("input").readOnly = true;
    }

    document.getElementById("output").value = output;

    output1 = output;

    if (document.getElementById("capcheckbox").checked) {
        output = toTitleCase(output);
        document.getElementById("output").value = output;
    } else if (!document.getElementById("capcheckbox").checked) {
        output = output1;
        document.getElementById("output").value = output;
    }

    document.getElementById("capcheckbox").addEventListener('change', function () {
        if (this.checked) {
            output = toTitleCase(output);
            document.getElementById("output").value = output;
        } else if (!this.checked) {
            output = output1;
            document.getElementById("output").value = output;
        }
    });

    if (output.length > 0) {
        document.getElementById("copyrom").disabled = false;
        document.getElementById("capcheckbox").disabled = false;
    } else if (output.length == 0) {
        document.getElementById("copyrom").disabled = true;
        document.getElementById("capcheckbox").disabled = true;
        document.getElementById("capcheckbox").checked = false;
    }

    if (ipaen.length == 0) {
        document.getElementById("ipacheckbox").disabled = true;
        document.getElementById("ipacheckbox").checked = false;
        document.getElementById("nl").style.display = 'none';
        document.getElementById("en").style.display = 'none';
        document.getElementById("nlc").style.display = 'none';
        document.getElementById("enc").style.display = 'none';
        document.getElementById("copyipa").disabled = true;
    } else if (ipaen.length > 0) {
        document.getElementById("ipacheckbox").disabled = false;
        document.getElementById("copyipa").disabled = false;
    }

    if (pron.length == 0) {
        document.getElementById("copypg").disabled = true;
        document.getElementById("pgcheckbox").disabled = true;
        document.getElementById("pgcheckbox").checked = false;
    } else if (pron.length > 0) {
        document.getElementById("copypg").disabled = false;
        document.getElementById("pgcheckbox").disabled = false;
    }

    if (pron.length > 0 && output.length > 0) {
        document.getElementById("copyboth").disabled = false;
    } else {
        document.getElementById("copyboth").disabled = true;
    }

    if (document.getElementById("pgcheckbox").checked) {
        document.getElementById("pronunciation").innerHTML = "\(\“" + pron + "\”\)";
    } else {
        document.getElementById("pronunciation").innerHTML = "";
    }

    if (document.getElementById("ipacheckbox").checked) {
        if (document.getElementById("nl").checked) {
            document.getElementById("ipa").innerHTML = "/" + ipanl + "/";
        } else if (document.getElementById("en").checked) {
            document.getElementById("ipa").innerHTML = "/" + ipaen + "/";
        } else {
            document.getElementById("ipa").innerHTML = "";
        }
    } else {
        document.getElementById("ipa").innerHTML = "";
    }
}

function copyRom() {
    if (output.length > 0) {
        navigator.clipboard.writeText(output);
    } else if (output.length == 0) {
        document.getElementById("copyrom").disabled = true;
    }
}
function copyIPA() {
    if (ipanl.length > 0) {
        if (document.getElementById("nl").checked) {
            navigator.clipboard.writeText("/" + ipanl + "/");
        } else if (document.getElementById("en").checked) {
            navigator.clipboard.writeText("/" + ipaen + "/");
        }
    } else if (ipanl.length == 0) {
        document.getElementById("copyipa").disabled = true;
    }
}
function copyPG() {
    if (pron.length > 0) {
        navigator.clipboard.writeText("\(\“" + pron + "\”\)");
    } else if (pron.length == 0) {
        document.getElementById("copypg").disabled = true;
    }
}
function copyBoth() {
    if (pron.length > 0 && output.length > 0) {
        navigator.clipboard.writeText(output + " \(\“" + pron + "\”\)");
    } else {
        document.getElementById("copyboth").disabled = true;
    }
}

document.getElementById("language").addEventListener('change', function handleChange(event) {
    if (event.target.value === "sa") {
        document.getElementById("inandout").style.display = 'flex';
        document.getElementById("copyrom").style.display = 'inline';
        document.getElementById("copyipa").style.display = 'inline';
        document.getElementById("copypg").style.display = 'inline';
        document.getElementById("copyboth").style.display = 'inline';
        document.getElementById("ipacheckbox").style.display = 'inline';
        document.getElementById("pgcheckbox").style.display = 'inline';
        document.getElementById("ipacheckboxc").style.display = 'inline';
        document.getElementById("pgcheckboxc").style.display = 'inline';
        document.getElementById("capcheckboxc").style.display = 'inline';
        document.getElementById("langspan").innerHTML = 'Sanskrit / Pali';
    } else if (event.target.value === "grc") {
        document.getElementById("inandout").style.display = 'flex';
        document.getElementById("copyrom").style.display = 'inline';
        document.getElementById("copyipa").style.display = 'inline';
        document.getElementById("copypg").style.display = 'inline';
        document.getElementById("copyboth").style.display = 'inline';
        document.getElementById("ipacheckbox").style.display = 'inline';
        document.getElementById("pgcheckbox").style.display = 'inline';
        document.getElementById("ipacheckboxc").style.display = 'inline';
        document.getElementById("pgcheckboxc").style.display = 'inline';
        document.getElementById("capcheckboxc").style.display = 'inline';
        document.getElementById("langspan").innerHTML = 'Ancient Greek';
    } else if (event.target.value === "null") {
        document.getElementById("inandout").style.display = 'none';
        document.getElementById("copyrom").style.display = 'none';
        document.getElementById("copyipa").style.display = 'none';
        document.getElementById("copypg").style.display = 'none';
        document.getElementById("copyboth").style.display = 'none';
        document.getElementById("ipacheckbox").style.display = 'none';
        document.getElementById("pgcheckbox").style.display = 'none';
        document.getElementById("ipacheckboxc").style.display = 'none';
        document.getElementById("pgcheckboxc").style.display = 'none';
        document.getElementById("capcheckboxc").style.display = 'none';
        document.getElementById("enc").style.display = 'none';
        document.getElementById("nlc").style.display = 'none';
    } else { }
});

document.getElementById("en").addEventListener('change', function () {
    if (this.checked) {
        translit();
    } else {
        translit();
    }
});
document.getElementById("nl").addEventListener('change', function () {
    if (this.checked) {
        translit();
    } else {
        translit();
    }
});
document.getElementById("ipacheckbox").addEventListener('change', function () {
    if (this.checked) {
        translit();
    } else {
        translit();
    }
});
document.getElementById("pgcheckbox").addEventListener('change', function () {
    if (this.checked) {
        translit();
    } else {
        translit();
    }
});