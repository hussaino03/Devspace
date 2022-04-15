# ReactJS Project Structure
This is a project structure I love using in my projects and since several of you asked to upload it to GitHub meanwhile you were doing my tutorials, here it is!

# How to use it?
Easy! In assets folder just place the assets of your project, like images, fonts (you will need to create the fonts folder), sass and so on.

In components just create a folder for each component and if a component has subcomponents, just create a component's folder inside.

For styling the components I also use SCSS but you could use CSS if you prefer it!

We have another folder called routes, where you will add all the routes of your app (in the project, the route's files are empty since this app has no routes).

Utils folder is just for general functions you want to use in several places.

And finally in the root folder (src) I only place the index.js file, the serviceWorker.js and the tests.

# How to install it?
Just run this code:
``` bash
git clone https://github.com/NauCode/ReactJS-Project-Structure.git your_project_name
```

After that, enter in the folder using:
``` bash
cd .\your_project_name\
```

And install the dependencies:
``` bash
npm install
```

Run it:
``` bash
npm start
```

And done! You can code your app now using this template!