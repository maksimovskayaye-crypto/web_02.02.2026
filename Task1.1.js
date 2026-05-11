// 1.1 Написать функцию counter(n), которая выводит в консоль раз в секунду числа n, n-1 ... 2, 1, 0 и останавливается.

function counter(n) {
    let current = n;
    const output = document.getElementById("output");
    output.innerHTML = "";

    let intervalId = setInterval(() => {
        output.innerHTML += current + "<br>";
        current--;

        if (current < 0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

function startCounter() {
    const n = Number(document.getElementById("inputN").value);
    counter(n);
}