# Local Setup
## Prerequisites
* Docker installed and running. [Download here](https://www.docker.com/products/docker-desktop).
* Locally cloned versions of the folowing repositories:
    * [kidsloop-live-server](https://bitbucket.org/calmisland/kidsloop-live-server)
    * [kidsloop-sfu](https://bitbucket.org/calmisland/kidsloop-sfu)
    * [kidsloop-sfu-gateway](https://bitbucket.org/calmisland/kidsloop-sfu-gateway)

### Mac
Add the following to your `~/.bash_profile` file (or create the file if it doesn't exist)
```bash
export DEV_SECRET='iXtZx1D5AqEB0B9pfn+hRQ=='
```
*If you use a different terminal other than **Bash**, you might need to load the Bash config file into your terminal's config.*
### Zsh
Add the following to `~/.zshenv` (or create the file if it doesn't exist)
```zsh
source ~/.bash_profile
```

## 1. `kidsloop-live-server`
Open up a terminal, and navigate to your local root of `kidsloop-live-server` and enter the following commands:
```
docker run --name some-redis -p 6379:6379 -d redis
docker run --name postgres -e POSTGRES_PASSWORD=PASSWORD -p 5432:5432 -d postgres
npm install
npm start
```

## 2. `kidsloop-sfu-gateway`
Open up a terminal, and navigate to your local root of `kidsloop-sfu-gateway` and enter the following commands:
```
npm install
npm start
```
## 3. `kidsloop-sfu`
Open up a terminal, and navigate to your local root of `kidsloop-sfu` and enter the following commands:
```
npm install
USE_IP=1 npm start
```
## 4. `kidsloop-live-frontend`
1. Add the following redirect config to your computer's `hosts` file
```host
local.alpha.kidsloop.net    localhost
```
2. Navigate to your local root of `kidsloop-live-frontend` and copy the contents of `env.example` (or fill out with the wanted values) and create a new file called `.env` and place it in the same folder:
3. Enter the following commands in the terminal:
```
npm start
```
### Connect to a Local Live Class **with a valid Access Cookie**
#### Generate a **Teacher** token
1. Go to https://hub.alpha.kidsloop.net
2. Sign in with an account that has a Teacher user
3. Navigate to `/schedule`
4. In the left toolbar, under Class Types, check the checkbox for "Live"
5. Click on an ongoing class in the calendar
6. Press the "Go Live"-button in the dialog that pops up
7. Copy the `TOKEN` from the address bar (`.../?token=TOKEN`)
8. Navigate to jwt.io
9. Change the "Algorithm" to "HS256"
10. Paste the `TOKEN` in the "Encoded" section
11. In the "HEADER" section, add `"issuer": "calmid-debug"`
12. In the "VERIFY SIGNATURE" section, insert the `DEV_SECRET` as the `your-256-bit-secret`
13. In the "PAYLOAD" section, change the `"iss"` value to `"calmid-debug"`
14. Copy the newly generated `TOKEN` from the "Encoded" section
15. Open up a new tab and browse to https://local.alpha.kidsloop.net:8082/?token=TOKEN

#### Generate a **Student** token
1. Follow the all same steps in "Generate a **Teacher** token" until and including **Step 13**
2. In the "PAYLOAD" section, change the `"teacher"` value to `false`
3. Copy the newly generated `TOKEN` from the "Encoded" section
4. Open up a new tab and browse to https://local.alpha.kidsloop.net:8082/?token=TOKEN
### Connect to a Local Live Class **and bypass the valid Access Cookie check**
1. In `kidsloop-live-server/src/main.ts` comment out the usage of:
    * `checkToken` (lines ~ 58-64)
    * `checkToken` (lines ~ 138-144)
2. Restart `kidsloop-live-server`
3. In `kidsloop-live-frontend/webpack.config.js` change `module.exports.devServer.https` to `false`
4. Restart `kidsloop-live-frontend`

*NOTE: When joining a class without a valid Access Cookie, you need to use the browser Safari. After you have successfully joined you can copy the web address in Safari and paste it into Chrome or any other browser.*

# FAQ
## Build Issues
**I have trouble building `kidsloop-live-frontend` due to issues cloning `kidsloop-canvas`**

Try adjusting your `.gitconfig` to have the following information:
```
[url "ssh://git@bitbucket.org"]
	insteadOf = https://bitbucket.org
```
This should prevent npm from trying to use https when pulling down repos from bitbucket.

## Live Class Issues
**I have old Users (aka Ghost Users) that never leave my Class**

SSH (attach shell) to the running `redis` docker container, and run the command:
```
redis-cli flushall
```
