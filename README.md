# PWA: NutriApp
Progressive web app (PWA) focused on extracting the nutritional information from a photo.
Through this app, the user can take a photo of a dish and input his/her glucose level.
Then, a AI model build in keras will retrieve the generic name of that dish.
Finally, the USDA National Nutrient Database will retrieve its nutritional value.
From the carbohydrates value, a estimate insuline dose will be calculated.

![](https://github.com/aespogom/NutriMobileApp/blob/main/demo.gif)

### Get started
To run the web app locally, follow these steps. 
Please beware that node.js and npm are installed on your device before running. 
Node v14.18.3
NPM 6.14.15

1. Clone the github repo from your terminal or in your code editor of choice. 
2. Ask the team from the file ```food.json``` from https://drive.google.com/file/d/1J46HhhwQHR5bP6QioLiDq_8BMoMijrXX/view?usp=share_link and place it inside ```/PWANutriApp/src/utils/```
3. Create a virtual enviroment and activate it
4. Navigate to the folder ```/PWANutriApp/``` and run ```npm install```
5. Run ```npm start```, we advice to open an incognito browser if you will run the app multiple times
6. Open localhost:3000 in your browser

### Debug
To debug the app, follow these steps.

1. Create a file .vscode/launch.json with the following content:
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:3000",
            // "runtimeArgs": ["--incognito"],
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```
2. Open the "run and debug" tab from visual studio code
3. Select the debugger called "Launch Chrome against localhost"
4. Play

### Architecture
- PWANutriApp: PWA build with ReactJS
    - public: contains static files such as index.html, javascript library files, icons, model, service workers and other assets, etc which you don't want to be processed by webpack
    - src: contains the logic of the application.
        - utils: contains constants and a local copy of the dabase.
- src: original script in python for the food recognition model
### References
- The basic app was created using code snippets from https://github.com/anil-sidhu/react-pwa-project
- The food recognition model, and code to run the model was copied and adapted from https://github.com/stratospark/food-101-keras
- Code to process the API response was copied and adapted from https://github.com/afogarty85/fooddata_central
- The formula to estimate the insuline dose was extracted from https://www.diabeteseducationandresearchcenter.org/news/type-2-diabetes-how-to-calculate-insulin-doses

