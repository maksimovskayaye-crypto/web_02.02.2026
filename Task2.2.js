function delay(N) {
    return new Promise(resolve => {
        setTimeout(resolve, N * 1000);
    });
}

async function countdown(start) {
    const output = document.getElementById("output");
    output.innerHTML = "";

    for (let i = start; i >= 0; i--) {
        output.innerHTML += i + "\n";

        if (i > 0) {
            await delay(1);
        }
    }

    output.innerHTML += "Готово";
}

function startCountdown() {
    const n = Number(document.getElementById("inputN").value);
    countdown(n);
}
