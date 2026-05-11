let counterObj = null;

function createCounter(n) {
    let initialValue = n;
    let currentValue = n;
    let timerId = null;
    const output = document.getElementById("output");

    function print(text) {
        output.innerHTML += text + "\n";
    }

    return {
        start() {
            if (timerId) return;

            print("Старт: " + currentValue);

            timerId = setInterval(() => {
                currentValue--;

                if (currentValue >= 0) {
                    print(currentValue);
                } else {
                    this.stop();
                    print("Время вышло");
                }
            }, 1000);
        },

        pause() {
            clearInterval(timerId);
            timerId = null;
            print("Пауза на значении: " + currentValue);
        },

        stop() {
            clearInterval(timerId);
            timerId = null;
            currentValue = initialValue;
            print("Счётчик остановлен и сброшен");
        }
    };
}

function initCounter() {
    const n = Number(document.getElementById("inputN").value);
    document.getElementById("output").innerHTML = "";
    counterObj = createCounter(n);
}
