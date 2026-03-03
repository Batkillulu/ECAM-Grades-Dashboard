# ECAM Grades Dashboard
Browser userscript that enhances the ECAM intranet with a clean, real-time grades dashboard.

Free for individual student use.  
Institutional use, official deployment, or integration into the ECAM intranet requires a commercial license.
This project is not affiliated with or endorsed by ECAM LaSalle.
All trademarks and logos belong to their respective owners.

# Installation guide ([Windows and Androids](#windows-and-androids) here, [IOS](#ios) there)

## Windows and Androids
For Windows, any web browser works, and for Androids, only the [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en&pli=1) web browser manages extension, to my knowledge, so if you want to use the ECAM Grades Dashboard, install [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en&pli=1).

### Step 1: [Install Tampermonkey](https://www.tampermonkey.net/)
It's a web browser extension that allows to run JavaScript scripts upon loading a specified website. (I'm sorry there are tons of ads...)

### Step 2: Setup Tampermonkey
Open your extensions settings in `Managa extensions`. Enable `Developer Mode`, then find Tampermonkey, and click on `Details`. Make sure that `Allow User Scripts` and `Allow access to file URLs`.

### Step 3: [Install the ECAM Grades Dashboard Script](https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js)
This will redirect you to a Tampermonkey page that will ask you to install the script. Press `Install` to complete the installation.

### Step 4: Enjoy!
Your ECAM Grades Dashboard is fully operational! If you're from the EENG3 class, P2028, you're lucky, you already have configurations prepared, you can go on `Import Config`, `Get a configuration online` and you'll manage the rest. For students from a different class, if you're feeling generous, please share with me the details of your modules (specifically what subjects are in what modules, as well as their coefficients in their respective modules, you should have received a mail with all the details, you can just provide me with this) at the following mail address baptiste.jacquin@ecam.fr. Thank you!

## IOS
(it's a bit less practical, i'm sorry)

### Step 1: [Install Userscripts](https://apps.apple.com/us/app/userscripts/id1463298887)
It's a web browser extension that allows to run JavaScript scripts upon loading a specified website.

### Step 2: Enable the extension
Open `Safari Settings → Extensions`, then turn on `Userscripts`.

### Step 3: Open Extension Page
Once enabled, you'll see the Userscripts icon `</>` to the left of the search bar in Safari. Click on it, then click "Open Extension Page".

### Step 4: Create New Script
In the Extension Page, click the + button, then click "New JS". Keep this page opened

### Step 5: [Get the ECAM Grades Dashboard Script](https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js)
Open the script's page by clicking on the header of this step, select the whole code by pressing `Command + A` and copy it with `Command + C`. Now come back on the previously opened Userscript New JS page, and paste the code with `Command + V`, and click on `Save`.

### Step6: Fewww, that's done! Enjoy!
Your ECAM Grades Dashboard is fully operational! If you're from the EENG3 class, P2028, you're lucky, you already have configurations prepared, you can go on `Import Config`, `Get a configuration online` and you'll manage the rest. For students from a different class, if you're feeling generous, please share with me the details of your modules (specifically what subjects are in what modules, as well as their coefficients in their respective modules, you should have received a mail with all the details, you can just provide me with this) at the following mail address baptiste.jacquin@ecam.fr. Thank you!