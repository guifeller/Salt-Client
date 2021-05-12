const io = require("socket.io-client");
const logger = require('../Scripts/logger');
const {desktopCapturer} = require('electron');
const fs = require('fs');


const localStorage = window.localStorage;

/*
Setup of the logging system
*/

const {setLog} = logger;

/*
Setup of the socket client
*/

const serverURL = localStorage.getItem('serverURL');
const token = localStorage.getItem('token');
let socketId;

const socket = io(serverURL + "/clients", {
extraHeaders: {
    "auth": token
}
});

socket.on("connect", () => {
    socketId = socket.id;
});

//Notifies the user of any failed attempt at connecting to the socket
socket.on("connect_error", () => {
    setLog('Failed to connect to the server');
})

//Disconnection from the socket
socket.on("disconnect", () => {
    setLog('Disconnected from the server');
});

//When an error is received
socket.on("error", (err) => {
    alert(err);
});

//When a response is received
socket.on("instruction", (inst) => {
  let instruct = JSON.parse(inst)
  if(instruct.ID != socketId) {
    return;
  } 
  else {
    exec("python ./Extensions/" + instruct.Command, (error, stdout, stderr) => {
        if (error) {
          setLog(error);
        }
        else if (stderr){
          setLog(stderr);
        } 
        else {
          setLog(stdout);
        }
    });
  }
});

/*
Business logic of each component
*/

/*
Console
*/
const submit = document.getElementById('subm');
const form = document.getElementById('input');

submit.addEventListener('click', submissionHandler);
form.addEventListener('submit', submissionHandler);

function submissionHandler(e) {
    e.preventDefault();
    let input = document.getElementById('command').value;
    try {
        //The command that will be sent to the server
        const com = "Hey Salt " + input;
        socket.emit("command", {
          "ID": socketId,
          "Command": com  
        });
    
        //Logs the command
        setLog(com);
        
    }
    catch (err) {
        setLog(err);
    }

    //Clears the input field
    document.getElementById('command').value = ''
};


/*
Recorder
*/

const toWav = require('audiobuffer-to-wav');
const { exec } = require("child_process");

let recorder;
let blob = [];

const strtButton = document.getElementById('strt');
const stopButton = document.getElementById('stp');

strtButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

function startRecording() {
  strtButton.style.visibility = "hidden";
  stopButton.style.visibility = "visible";

  desktopCapturer.getSources({types: ['window', 'screen']})
  .then((sources) => {
    for (source of sources) {
      if (source.name == 'Entire Screen') {
        
        navigator.mediaDevices.getUserMedia({
          audio : true,
          video: false
        })
        .then((stream) => {
          
          recorder = new MediaRecorder(stream, {mimeType: 'video/webm;codecs=vp9'});
          recorder.ondataavailable = (e) => {
            //Pushes data into the blob
            blob.push(e.data);
          };
          recorder.start();
        }).catch((err) => alert(err));
      }
    }
  });
};

function stopRecording() {
  stopButton.style.visibility = "hidden";
  strtButton.style.visibility = "visible";
  //The blob is a webm file. Since the speech to text script requires a wav file, it will be necessary to convert the blob into a wav file

  //Turns the webm blob into an audio buffer, then into a wav file
  let createWav = () => {
    toArrayBuffer(new Blob(blob, {type: 'video/webm'}), (err, arrayBuffer) => {
      //Empties the blob array after use so that previous recordings don't appear in the wav file
      blob = [];
      if (err) {
        alert(err);
      }
      else {
        toAudioBuffer(arrayBuffer, (err, audioBuffer) => {
          if (err) {
            alert(err);
          }
          else {
            const wav = toWav(audioBuffer);

            
            fs.writeFile('voice.wav', new DataView(wav), () => {
              if(err) {
                alert(err)
              }
              else {
                //
                exec("python speechtotext.py voice.wav", (error, stdout, stderr) => {
                  fs.unlink('voice.wav', () => {
                    console.log('File deleted.');
                  });
                  if (error) {
                    setLog(error);
                  }
                  else if (stderr){
                    setLog(stderr);
                  } 
                  else {
                    socket.emit("command", {
                      "ID": socketId,
                      "Command": stdout  
                    });
                    setLog(stdout);
                  }
                });
              }
            });
          }
        });
      }
    })
  };

  recorder.onstop = createWav;
  recorder.stop();
};

function toArrayBuffer(blob, callback) {
  
  //Converts a blob into an array buffer
  let fileReader = new FileReader();
  fileReader.onload = () => {
    let arrayBuffer = fileReader.result;
    callback(null, arrayBuffer);
  };
  fileReader.readAsArrayBuffer(blob);
};

function toAudioBuffer(buffer, callback) {
  //Converts an array buffer into an audio buffer
  const audioContext = new AudioContext();
  audioContext.decodeAudioData(buffer, (audioBuffer, err) => {
    if (err) {
      return callback(err, null);
    }
    else {
      callback(null, audioBuffer);
    }
  })

};