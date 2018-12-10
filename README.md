# [Wallet](https://expressjs.com/)
A simple Node.js express app using TrueLayer's API client library. It illustrates the flow of obtaining a JWT access token from the authorization server, before using this token to query the data api /info endpoint for identity information of the user and streams the results to a page.

## Prerequisites
---
Before you start, you will need:
* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js and Node Package Manager (NPM)](https://nodejs.org/download/)
* You'll need node (at least > v7.6) and npm or yarn to install and run the app

## Install the repo locally
---
```bash
$ git clone https://github.com/wallet.git
```

## Steps to run the App :video_game:

1. Install the dependencies
```bash
$ npm install
```

2. Create the .env file 
```bash
$ touch .env
```

3. Go to https://console.truelayer.com and set up your client account

4. Obtain your client_id and client_secret on the page and store them safely locally

5. Whitelist your app's callback url in the redirect url section

6. Add the credentials obtained in the 3 steps above to `.env` file

7. Start the app
```bash
$ npm run start
```

8. Navigate to `http://localhost:5000` and view the app!
