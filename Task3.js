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

async function getGithubUser() {
    const output = document.getElementById("output");
    let name = document.getElementById("username").value.trim();

    if (!name) {
        output.innerHTML = "Введите логин!";
        return;
    }

    while (true) {
        try {
            output.innerHTML = `Ищем пользователя <b>${name}</b>...`;

            let user = await loadJson(`https://api.github.com/users/${name}`);

            output.innerHTML =
                `Пользователь найден\n` +
                `Полное имя: ${user.name}\n` +
                `Профиль: ${user.html_url}`;

            return user;

        } catch (err) {
            if (err instanceof HttpError && err.response.status === 404) {
                output.innerHTML = `Пользователь <b>${name}</b> не найден. Попробуйте другой логин.`;
                return;
            } else {
                output.innerHTML = "Ошибка: " + err.message;
                return;
            }
        }
    }
}
