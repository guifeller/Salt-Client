#A very simple script that launches a program that is already present in the system's path.
#Compatible with Windows and Linux
#KEYWORD: Launch

import os
import sys

def main():
    app = sys.argv[1]
    try:
        if(os.name == "nt"):
            os.system("start " + app)
        else:
            os.system(app)

        print(app + ' launched succesfully') 
    except:
        print('Impossible to launch ' + app) 
    
if __name__ == "__main__":
    main()