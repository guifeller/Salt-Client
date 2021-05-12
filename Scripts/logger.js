/*
Functions related to the centralized logging system
*/

let log = [];

//The Terminal Component
const logList = document.getElementById('list');


function getLog() {
    return log;
}

function getLattestLog() {
    //Returns the latest entry in the log array;
    return log[log.length -1];
}

function setLog(data) {
    log.push(data);
    
    const li = document.createElement('li');
    const text = document.createTextNode(data);
    li.appendChild(text);
    logList.appendChild(li);
}

module.exports = {getLog, getLattestLog, setLog};