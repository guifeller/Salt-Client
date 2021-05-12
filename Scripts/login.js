const axios = require('axios');
const fs = require('fs');
const localStorage = window.localStorage;

const form = document.getElementById('form');
const button = document.getElementById('subm');
const radio = document.getElementById('remember');

let usernameEL = document.getElementById('username');
let serverURLEL = document.getElementById('serverURL');

button.addEventListener('click', submissionHandler);
form.addEventListener('submit', submissionHandler);
let data;
//If the username and the server's url have been recorded, then they are automatically added to the form
try {
    data = require('../conf.json');
    usernameEL.value = data.username;
    serverURLEL.value = data.serverURL;
}
catch (err) {
    console.log("conf.json doesn't exist.")
}

function submissionHandler(e) {
    e.preventDefault();
    const username = usernameEL.value;
    const password = document.getElementById('password').value;
    const serverURL = serverURLEL.value;

    if(radio.checked) {
        const payload = {
            username: username,
            serverURL: serverURL
        };

        fs.writeFile("conf.json", JSON.stringify(payload), (err) => {
            if (err) {
                alert(err);
            }
        });
    }
    else {
        if (data !== null) {
            //Removes the conf.json file
            fs.unlink("conf.json", (err) => {
                console.log(err);
            })
        }
    }

    axios.post(serverURL + '/admin/login', {username: username, password:password})
    .then((res) => {
        const token = res.data.token;
        return token;           
    })
    .then((tok) => {
        localStorage.setItem('username', username);
        localStorage.setItem('token', tok);
        localStorage.setItem('serverURL', serverURL);
        window.location.replace('menu.html');
    })
    .catch((err) => {
        alert(err);
        window.location.reload();
    })
};