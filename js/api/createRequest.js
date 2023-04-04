/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let url = options.url;
    if (options.data) {
        for (let i=0; i < Object.keys(options.data).length; i++) {
            if (i === 0) {
                url += '?' + Object.entries(options.data)[i][0] + '=' + Object.entries(options.data)[i][1];
            } else {
                const add = Object.entries(options.data)[i][0] + '=' + Object.entries(options.data)[i][1];
                url += '&' + add.replace(/&/g, '%26');
            }
        }
    }
    let error = null;
    try {
        xhr.open(options.method, url);
        if (options.headers) {
            for (let i=0; i < Object.keys(options.headers).length; i++) {
                xhr.setRequestHeader(Object.entries(options.headers)[i][0], Object.entries(options.headers)[i][1]);
            }
        }
        xhr.responseType = 'json';
        xhr.send();
    }
    catch (err) {
        error = err;
    }
    xhr.onloadend = function() {
        options.cb(error, xhr.response);
    };
};
