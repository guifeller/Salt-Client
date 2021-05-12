import subprocess
import sys
import speech_recognition as sr

def SpeechToText(speech):

    r = sr.Recognizer()

    try:
        file = sr.AudioFile(speech)
    except:
        print('Could not process the audio file.')
        return

    with file as data:
        process = r.record(data)

    #Since Speech_Recognition provides a google api key, google web speech API is the speech to text service used by default by Salt.
    #However, since this api key is provided for testing purposes only, I would recommend using another service in production

    output = r.recognize_google(process)
    return output

def main():
    file = sys.argv[1]
    try:
        result = SpeechToText(file)
        print(result)

    except:
        print('Impossible to parse the text.') 

    sys.stdout.flush()
    
if __name__ == "__main__":
    main()