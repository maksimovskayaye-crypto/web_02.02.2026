// Задача 1 (на таймеры)

// 1.1 Написать функцию counter(n), которая выводит в консоль раз в секунду числа n, n-1 ... 2, 1, 0 и останавливается.

// function counter(n) {
//     let current = n;
//     let intervalId = setInterval(() => {
//         console.log(current);
//         current--;
//         if (current < 0) {
//             clearInterval(intervalId);
//         }
//     }, 1000);
// }

// document.write("Таймер обратного отсчета от 5 до 0 с интервалом 1 секунда:<br>");
// counter(5);

// 1.2 Написать функцию createCounter(n), возвращающую объект с методами:

// start() -- запускает (или возобновляет) счётчик c интервалом 1 секунда: N, N-1.
// pause() -- приостанавливает счёт, но не сбрасывает счётчик.
// stop() -- останавливает счёт, сбрасывает счётчик.

// function createCounter(n) {
//     let initialValue = n;    // Сохраняем начальное значение для сброса
//     let currentValue = n;   // Текущее значение счетчика
//     let timerId = null;     // Переменная для хранения ID интервала

//     return {
//         start() {
//             if (timerId) return;

//             console.log("Счетчик: " + currentValue);

//             timerId = setInterval(() => {
//                 currentValue--;
                
//                 if (currentValue >= 0) {
//                     console.log(currentValue);
//                 } else {
//                     this.stop();
//                     console.log("Время вышло");
//                 }
//             }, 1000);
//         },

//         pause() {
//             clearInterval(timerId);
//             timerId = null;
//             console.log("Пауза на значении: " + currentValue);
//         },

//         stop() {
//             clearInterval(timerId);
//             timerId = null;
//             currentValue = initialValue;
//             console.log("Счетчик остановлен и сброшен");
//         }
//     };
// }


// const counter = createCounter(10);

//  counter.start();
// // setTimeout(() => {
// //     counter.pause();
// // }, 5000);

// setTimeout(() => {
//     counter.stop();
// }, 5000);


// Задача 2

// 2.1 Написать функцию delay(N), возвращающую промис, который сделает resolve() через N секунд.

// function delay(N) {
//     return new Promise(resolve => {
//         setTimeout(resolve, N * 1000);
//     });
// }

// delay(3).then(() => {
//     console.log("Прошло 3 секунды");
// });


// 2.2 Решить задачу со счётчиком N, N-1 ... 2, 1, 0 через функцию delay.

// function delay(N) {
//   return new Promise(resolve => {
//     setTimeout(resolve, N * 1000);
//   });
// }

// // Функция обратного отсчёта
// async function countdown(start) {
//   for (let i = start; i >= 0; i--) {
//     console.log(i);
    
//     if (i > 0) {
//       await delay(1); 
//     }
//   }
// }

// countdown(5);

// 2.3 Написать функцию, возвращающую название первого репозитория на github.com по имени пользователя (2 последовательных запроса: https://api.github.com/users/%USERNAME%).

function getFirstRepo(username) {
    return fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => repos[0].name);
}  

getFirstRepo('goryachkinama')
    .then(repoName => console.log("Первый репозиторий пользователя goryachkinama: " + repoName))
    .catch(error => console.error("Ошибка при получении репозитория: ", error));

// Задача 3.

// Перепишите, используя async/await вместо .then/catch.

//В функции getGithubUser замените рекурсию на цикл, используя async/await.

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
  let response = await fetch(url);

  if (response.status === 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}

// Запрашивается логин, пока GitHub не вернёт существующего пользователя.
async function getGithubUser() {
  while (true) {
    let name = prompt("Введите логин?", "iliakan");

    try {
      let user = await loadJson(`https://api.github.com/users/${name}`);
      alert(`Полное имя: ${user.name}.`);
      return user;
    } catch (err) {
      if (err instanceof HttpError && err.response.status === 404) {
        alert("Такого пользователя не существует, пожалуйста, повторите ввод.");
      } else {
        throw err;
      }
    }
  }
}

getGithubUser();