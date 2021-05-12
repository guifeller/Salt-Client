Salt's client

### Setup

Install the required dependencies using npm and pip, then launch the program using npm.

```
$ npm install
$ pip install -r requirements.txt
$ npm start
```

### How to use

Salt is triggered by saying "Hey Salt". Anything that is said after "Hey Salt" will be parsed by the Analyzer.
However, the client automatically adds "Hey Salt" at the beginning of any sentence directly inputed by the user using the "console" form.

### Extensions

Salt is modular, and it is easy to develop one's own scripts (called Extensions).
Extensions are made of one json file and at least one python script. All the files have to be put in the "Extensions" folder.
To be considered valid by the server, the json file must contain the following entries: 
* fileName : An extension's entry point. More concretely, it is the name of the file that will be called by the client to launch the extension.
* commandWord : The word that will be used by the Analyzer to recognize the extension.
* Parameters : An array of parameters. The array can be left empty.
* Options:  An array of options used in conjunction to the parameters. The array can be left empty.

The file that will be called by the client serves as an entry point for the extension. Only one file can be used in such a way. However, it is absolutely possible to call other python scripts from said entry points. For example, parameters and options can be used to determine which script has to be called.

Launch_soft is a simple example of such an extension. It is activated using the word "launch", and will launch the program whose name is pronounced right after "launch".
For example, if a user says "Hey Salt launch chrome", the script will launch Google Chrome.

To be recognized by Salt, an extension's json file has to be sent to the server. It is possible to do so using Salt-Admin.