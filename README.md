# Cards without Code

This is a final year project originally developed by Sean Comerford, Denis Gavrila, and Liam Coffey and further developed by myself, Alex Maxwell.

It's a pedagogical web application to help students develop nice looking CSS cards without having to code.

## Requirements

1. You will firstly need to clone this repository to the machine you wish to run it on with the following command `git clone https://github.com/DenisGavrila/cwc-app.git` or else you can download the zip folder itself through Github itself.
2. The application requires node, I used version 8.11.4 when developing the project, which can be downloaded from [Node.js](https://nodejs.org/en/download/releases/).
3. For storage purposes the application uses [mongoDB Atlas](https://www.mongodb.com/cloud/atlas) which is provided using a token in the back-end code however you can provide your own DB which will be shown further down.

## Running the app

The app is already connected to a database and will be functional upon running the below commands otherwise you can use your own DB which is explanined further down.

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```

## Importing collections to mongoDB Atlas

The folder named `database` contains all the collections import these to provide your atlas instance with default data. 'newcards' provides templates so make sure you import this one. The rest of the tables will create on interaction with the app

## Using your own DB

If you want to provide your own database you will have to change the mongoDB Atlas URI to your own.

1. Create an account at [mongoDB Atlas](https://www.mongodb.com/cloud/atlas) or sign in to your mongoDB Atlas account [here](https://account.mongodb.com/account/login).
2. If you are unaware of how to create a cluster then take a look at the following [guide](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).
3. [Connect to a cluster](https://docs.atlas.mongodb.com/connect-to-cluster/).
4. Whitelist your connection IP address and create a MongoDB User. We will use this later.
5. With your cluster up and running hit connect on your dashboard, choose the second option "Connect Your Application". Set your Driver to "Node.js" and Version to "3.0 or later".
6. Copy the connection string only into the `.env` file after the equals sign `ATLAS_URI=INSERT HERE`.
7. Replace `<password>` with the password for the user you created earlier and then save the `.env` file.
8. There will be a file provided in the repo to be imported to your newly created DB for some default cards and a root user.

## Changes to make the app run in a development enviroment(only if you have the build version of the code)

1. For the ".env" file if it has the {}, I found this didn't work instead use "" and insert your connection string as a string rather than a object.
2. In the index.html, if the Favicon and the manifest have their srcs prepended with /%PUBLIC_URI%/, Remove this for developing but this is needed for when the app is hosted.
