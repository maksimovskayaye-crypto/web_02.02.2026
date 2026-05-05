// Часть 1. Массивы

// Задача 1

let arr1 = [5, 2, 9, 1, 7];
let arr2 = [1, 2, 2, 3, 4, 4, 5];
let arr3 = [
    {id: 1, isDone: true},
    {id: 2, isDone: false},
    {id: 3, isDone: true}
];

// 1.1 Максимальная разница между элементами массива.

function maxDifference(arr) {
    return Math.max(...arr) - Math.min(...arr);
}

// 1.2 Вернуть массив без повторяющихся элементов.

function uniqueArray(arr) {
    return [...new Set(arr)];
}

// 1.3 Дан массив объектов, вернуть только те, у которых isDone: true.

function filterDone(arr) {
    return arr.filter(item => item.isDone === true);
}

document.write("Максимальная разница: " + maxDifference(arr1) + "<br><br>");
document.write("Без повторов: " + uniqueArray(arr2) + "<br><br>");
document.write("Объекты с isDone = true:<br>");
let result = filterDone(arr3);
for (let item of result) {
    document.write("id: " + item.id + ", isDone:" + item.isDone + "<br>");
}
document.write("<br><br>")


// Задача 2

let arr4 = [1, 4, 6, 3, 2];
let number = 2;
let arr5 = [1, 4, [34, 1, 20], [6, [6, 12, 8], 6]];

// 2.1 Найти элементы массива, которые больше указанного числа.

function moreThanNumber(arr, num) {
    return arr.filter(function(item) {
        return item > num;
    });
}

//2.2 Дан многомерный массив произвольной вложенности. Написать функцию, делающую из него "плоский" массив.

function flatArray(arr) {
    let result = [];

    for (let item of arr) {
        if (Array.isArray(item)) {
            result = result.concat(flatArray(item));
        } else {
            result.push(item);
        }
    }

    return result;
}

document.write("Элементы массива больше числа " + number + ": ");
document.write(moreThanNumber(arr4, number));
document.write("<br><br>");

document.write("Плоский массив: ");
document.write(flatArray(arr5));
document.write("<br><br>")

// Задача 3

let arr6 = [-7, 12, 4, 6, -4, -12, 0];
let arr7 = [-1, 2, 4, 7, -4, 1, -2];
let arr8 = [-1, 1, 0, 1];

// 3.1 Найти, сколько есть в массиве пар чисел, дающих в сумме 0.

function countPairs(arr) {
    let count = 0;
    let used = new Array(arr.length).fill(false);

    for (let i = 0; i < arr.length; i++) {
        if (used[i]) continue;

        for (let j = i + 1; j < arr.length; j++) {
            if (!used[j] && arr[i] + arr[j] === 0) {
                count++;
                used[i] = true;
                used[j] = true;
                break;
            }
        }
    }
    return count;
}


document.write("Массив: " + arr6 + "<br>");
document.write("Пар с суммой 0:" + countPairs(arr6) + "<br>");
document.write("Массив: " + arr7 + "<br>");
document.write("Пар с суммой 0:" + countPairs(arr7) + "<br>");
document.write("Массив: " + arr8 + "<br>");
document.write("Пар с суммой 0:" + countPairs(arr8) + "<br>");
document.write("<br><br>")

// Часть 2. Генераторы

// Задача 1

// 1.1 Реализовать генератор, бесконечно возвращающий случайное число в заданном диапазоне random(n, m).

function* randomGenerator(n, m) {
    while (true) {
        yield Math.floor(Math.random() * (m - n + 1)) + n;
    }
}

let random = randomGenerator(1, 10);
document.write("Случайные числа (1-10)");
document.write( "<br>" + random.next().value + "<br>");
document.write(random.next().value + "<br>");
document.write(random.next().value + "<br><br>");

// 1.2 Реализовать генератор, бесконечно возвращающий очередное число из последовательности Падована.

function* padovanGenerator() {
    let a = 1, b = 1, c = 1;

    while (true) {
        yield a;
        let next = a + b;
        a = b;
        b = c;
        c = next;
    }
}

 let padovan = padovanGenerator();
 document.write("Последовательность Подавана");
 document.write("<br>" + padovan.next().value + "<br>");
 document.write(padovan.next().value + "<br>");
 document.write(padovan.next().value + "<br>");
 document.write(padovan.next().value + "<br>");
 document.write(padovan.next().value + "<br>");
 document.write(padovan.next().value + "<br><br>");

 // 1.3 Реализовать генератор, бесконечно возвращающий очередное простое число.

 function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
 }

 function* primeGenerator() {
    let num = 2;

    while (true) {
        if (isPrime(num)) {
            yield num;
        }
        num++
    }
 }

 let primes = primeGenerator();

 document.write("Простые числа");
 document.write("<br>" + primes.next().value + "<br>");
 document.write(primes.next().value + "<br>");
 document.write(primes.next().value + "<br>");
 document.write(primes.next().value + "<br><br>");

 // Задача 2.

 // 2.1 Посчитать число вхождений букв (или слов) в строке, используя Map.

 function countCharts(str) {
    let map = new Map();
    for (let char of str) {
        if (char === " ") continue;

        map.set(char, (map.get(char) || 0) + 1);
    }

    return map;
 }

 let text = "hello world";

 let charResult = countCharts(text);

 document.write("Подсчёт букв");
 document.write("<br>")

 for (let [key, value] of charResult) {
    document.write(key + " : " + value + "<br>");
 }

 document.write("<br>");

 // 2.2 Написать функцию getPrime(n), возвращающее n-ное по счёту простое число, используя BigInt.

 function isPrimeBig(n) {
    let bigN = BigInt(n);

    if (bigN < 2n) return false;

    for (let i = 2n; i * i <= bigN; i++) {
        if (bigN % i === 0n) return false;
    }

    return true ;
 }

 function getPrime(n) {
    let count = 0;
    let num = 2n;

    while (true) {
        if (isPrimeBig(num)) {
            count++;
            if (count === n) return num;
        }
        num++
    }
 }

 document.write("n-е простое число");
 document.write("<br>");
 document.write("10-е просто число: " + getPrime(10) + "<br>");
 document.write("20-е просто число: " + getPrime(20) + "<br>");