function delay(N) {
    return new Promise(resolve => {
        setTimeout(resolve, N * 1000);
    });
}

function runDelay() {
    const output = document.getElementById("output");
    const N = Number(document.getElementById("inputN").value);

    output.innerHTML = `Ждём ${N} сек...\n`;

    delay(N).then(() => {
        output.innerHTML += `Прошло ${N} сек.`;
    });
}
