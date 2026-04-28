// 1.1 Вернуть число в обратном порядке 123 -> 321.

function reverseNumber(n) {
    let result = 0;
    while (n > 0) {
        result = result * 10 + n % 10;
        n = Math.floor(n / 10);
    }
    return result;
}

alert(reverseNumber(123));

// 1.2 Вернуть число без повторяющихся цифр 111333456 -> 13456.

function removeDuplicates(n) {
    let result = 0;
    let seenDigits = new Set(); // множество для хранения уже встреченных цифр
    let multiplier = 1; // множитель для правильного расположения цифр в результате
    while (n > 0) {
        let digit = n % 10;
        if (!seenDigits.has(digit)) {
            seenDigits.add(digit);
            result = digit * multiplier + result;
            multiplier *= 10;
        }
        n = Math.floor(n / 10);
    }
    return result;
}

alert(removeDuplicates(111333456));

// 1.3 Посчитать, сколько раз в данном числе встречается данная цифра (1355567, 5) -> 3.

function countDigit(n, digitToCount) {
    let count = 0;
    while (n > 0) {
        let digit = n % 10;
        if (digit === digitToCount) {
            count++;
        }
        n = Math.floor(n / 10);
    } 
    return count;
}

alert(countDigit(1355567, 5));

// 1.4 Посчитать самую длинную последовательность нулей/единиц в двоичной записи данного числа.

let n = 29; // 29 в двоичной записи - 11101

function longestBinarySequence(n) {
    let binary = n.toString(2);
    let maxZeroSeq = 0;
    let maxOneSeq = 0;
    let currentZeroSeq = 0;
    let currentOneSeq = 0;
    for (let char of binary) {
        if (char === '0') {
            currentZeroSeq++;
            maxZeroSeq = Math.max(maxZeroSeq, currentZeroSeq);
            currentOneSeq = 0; // сбрасывает счетчик единиц
        }
        else {
            currentOneSeq++;
            maxOneSeq = Math.max(maxOneSeq, currentOneSeq);
            currentZeroSeq = 0; // сбрасывает счетчик нулей
        }
    }
    return { maxZeroSeq, maxOneSeq };
}

let result = longestBinarySequence(n);
alert("Нули: " + result.maxZeroSeq + "\nЕдиницы: " + result.maxOneSeq);

// 2.1 Найти самый первый неповторяющийся символ в строке: 'фывфавыапрс' -> 'п'.

function firstUniqueChar(str) {
    let charCount = {};
    for (let char of str) {
        charCount[char] = (charCount[char] || 0) + 1; // считает количество вхождений каждого символа
    }
    for (let char of str) {
        if (charCount[char] === 1) {
            return char;
        }
    }
    return null;
}

alert(firstUniqueChar('фывфавыапрс'));

// 2.2 Cгенерировать строку заданной длины из случайных символов, взятых из набора английскийх букв и цифр: (5) -> '2fvg6'.

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length)); // выбирает случайный символ из набора и добавляем его к результату
    }
    return result;
}

alert(generateRandomString(5));

// 2.3 Вернуть только уникальные символы строки: 'позволяеткопироватьтекстиз' -> 'позвляеткираьс'.

function uniqueChars(str) {
    let seenChars = new Set();
    let result = '';
    for (let char of str) {
        if (!seenChars.has(char)) {
            seenChars.add(char);
            result += char; // добавляет символ к результату, если он еще не встречался
        }
    }
    return result;
}

alert(uniqueChars('позволяеткопироватьтекстиз'));