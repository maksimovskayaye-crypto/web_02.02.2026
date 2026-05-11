function getFirstRepo(username) {
    return fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Пользователь не найден");
            }
            return response.json();
        })
        .then(repos => {
            if (repos.length === 0) {
                throw new Error("У пользователя нет репозиториев");
            }
            return repos[0].name;
        });
}

function run() {
    const username = document.getElementById("username").value.trim();
    const output = document.getElementById("output");

    output.innerHTML = "Загрузка...";

    getFirstRepo(username)
        .then(repoName => {
            output.innerHTML = `Первый репозиторий пользователя <b>${username}</b>: ${repoName}`;
        })
        .catch(error => {
            output.innerHTML = "Ошибка: " + error.message;
        });
}
