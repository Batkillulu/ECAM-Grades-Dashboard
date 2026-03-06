# ECAM Grades Dashboard
Browser userscript that enhances the ECAM intranet with a clean, real-time grades dashboard.

Free for individual student use.  
Institutional use, official deployment, or integration into the ECAM intranet requires a commercial license.
This project is not affiliated with or endorsed by ECAM LaSalle.
All trademarks and logos belong to their respective owners.

[HOW TO USE: Quick start ⤦](#how-to-use-quick-start)

# Installation guide ([Windows and Androids ⤦](#windows-and-androids), [IOS ⤦](#ios))

## Windows and Androids
For Windows, any web browser works, and for Androids, only the [Firefox Nightly ↗](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en&pli=1) web browser manages extension, to my knowledge, so if you want to use the ECAM Grades Dashboard, install [Firefox Nightly ↗](https://play.google.com/store/apps/details?id=org.mozilla.fenix&hl=en&pli=1). For now, there's no proper mobile display, this is coming in the next major update, so for now, you may use the `Desktop version` that you can enabled when taping on the three dots in the top-right corner of the Firefox Nightly.

### Step 1: [Install Tampermonkey ↗](https://www.tampermonkey.net/)
It's a web browser extension that allows to run JavaScript scripts upon loading a specified website. (Please ignore the thousand pop-ups and ads... I swear this is safe...)

### Step 2: Setup Tampermonkey
Open your extensions settings in `Manage extensions`. Enable `Developer Mode`, then find Tampermonkey, and click on `Details`. Make sure that `Allow User Scripts` and `Allow access to file URLs`.

### Step 3: [Install the ECAM Grades Dashboard Script ↗](https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js)
This will redirect you to a Tampermonkey page that will ask you to install the script. Press `Install` to complete the installation.

### Step 4: Enjoy!
Your ECAM Grades Dashboard is fully operational! If you're lucky enough, you may already have configurations prepared, you can go and check on `Import Config`, `Get a configuration online` and browse through the menu. If you don't find it and you're feeling generous, please share with me the details of your modules (specifically what subjects are in what modules, as well as their coefficients in their respective modules, you should have received a mail from ECAM with all the details somewhere, you can just provide me with this) at the following mail address baptiste.jacquin@ecam.fr, or in the message box on which will be redirected when clicking on the flag button, `Share a config`. You can also do the 2nd option if you already configured a semester, and want to share it, after pressing `Export config`. Thank you!

## IOS
(it's a bit less practical, i'm sorry)

### Step 1: [Install Userscripts ↗](https://apps.apple.com/us/app/userscripts/id1463298887)
It's a web browser extension that allows to run JavaScript scripts upon loading a specified website.

### Step 2: Enable the extension
Open `Safari Settings → Extensions`, then turn on `Userscripts`.

### Step 3: Open Extension Page
Once enabled, you'll see the Userscripts icon `</>` to the left of the search bar in Safari. Click on it, then click "Open Extension Page".

### Step 4: Create New Script
In the Extension Page, click the + button, then click "New JS". Keep this page opened

### Step 5: [Get the ECAM Grades Dashboard Script ↗](https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js)
Open the script's page by clicking on the header of this step, select the whole code by pressing `Command + A` and copy it with `Command + C`. Now come back on the previously opened Userscript New JS page, and paste the code with `Command + V`, and click on `Save`.

### Step6: Fewww, that's done! Enjoy!
Your ECAM Grades Dashboard is fully operational! If you're lucky enough, you may already have configurations prepared, you can go and check on `Import Config`, `Get a configuration online` and browse through the menu. If you don't find it and you're feeling generous, please share with me the details of your modules (specifically what subjects are in what modules, as well as their coefficients in their respective modules, you should have received a mail from ECAM with all the details somewhere, you can just provide me with this) at the following mail address baptiste.jacquin@ecam.fr, or in the message box on which will be redirected when clicking on the flag button, `Share a config`. You can also do the 2nd option if you already configured a semester, and want to share it, after pressing `Export config`. Thank you!



# HOW TO USE: QUICK START

## How does this dashboard work?
It simply reads the classic ECAM Grades table (that you can still find all the way down, by clicking on "Show ECAM Intranet's Grades Table"), sort every grades of the same semester in ***semester sections***, and then packs them together in ***subject cards*** corresponding to the subject of the grade. An average of your subject is then calculated and displayed below the name of the subject. ***Subject cards*** may be packed in a ***module card*** when you turn on the ***edit mode*** by clicking on the ***edit mode button***, or by pressing `Shift+E`. For more informations on how to set up your modules, see the section below [Modules configuration](#modules-configuration).

You can filter by semester with the ***semester filter bar*** (you can also collapse the content of a semester by clicking on its header, mainly useful when you're showing ALL the semesters), and you can switch between ***compact view mode*** (showing only the name of the subject and its average) and ***detailed view mode*** (showing the name of the subject and its average, but also the table of all the grades of this subject), by clicking on the appropriate ***view mode buttons*** next to the the ***semester filter bar***, or by pressing `Shift+D`. You may switch between the french and the english language by clicking on their corresponding ***language buttons***, or by pressing `Shift+L`.

# Features:
## Modules configuration!
You can bring subjects together in a module! Start by checking if a module configuration already exists by clicking on `Import Config`, `Get a configuration online` and browsing through the menu to choose the configuration that matches your current section + year + prom + pathway! This requires a connection (I will assume it's the case, I don't quite see how you're gonna access the website otherwise...), as the configs are not in the script itself, it's in this repository (you're reading the README file of this repository), so the script checks in the repository for every config inside. You won't have to update the dashboard every time there's a new configs added!

If the config you're searching for doesn't exist in this menu, you can easily create your own: in the yellow "Subjects not classified in a module", you will find all the ***subject cards*** that aren't in a module. Press `Shift+E` to turn on the edit mode.

From here, multiple things can be done:

### Drag & Drop method
Start ***dragging*** the ***header*** of a ***subject card***, and ***fields*** will appear on both sides of the screen: one to remove a ***subject card*** from its module, one to add a ***subject card*** to a new module.
- Drop the ***subject card*** into either of these fields to apply their respective actions on the said ***subject card***.
- You can drag & drop a ***subject card*** in an ***insertion field***, the fields that appear in-between every ***module cards*** (***module insertion field***) and every ***subject cards*** in a ***module card*** (***subject insertion field***). 
- Dropping a ***subject card*** in a ***module insertion field*** will insert the ***subject card*** in a new module that will be positioned at the place of the ***module insertion field***.
- Dropping a ***subject card*** in a ***subject insertion field*** will reorder the ***subject card*** at the place of the ***subject insertion field***. Use this to reorder your subjects in their module to your liking!
- You can also drag & drop a ***module card*** in the ***deletion field***, to delete the dropped module, or in ***module insertion fields***, to reorder your modules to your liking.

I like how smooth and organic this feels, that's why it's here :D though drag & drop sadly doesn't work on mobile... But don't worry, the next method does!

### Selection method
You can select a ***subject card*** by clicking on the `☰` icon. A `✔` will be shown instead, and a notification will appear in the top left corner of you screen. The notification displays an arrow (clicking on the arrow will have for effect to scroll to the ***subject card*** corresponding to this notification), the name of the selected ***subject card***, and a button to close the notification (this has for effect to unselect its corresponding ***subject card***).

- While you selected at least one ***subject card***, the ***fields*** on both sides of the screen appear. Clicking on them will apply the action they describe on ALL selected ***subject cards***. 
- Clicking on a ***module insertion field*** will insert the selection to a new module which will be positionned at the place of the ***module insertion field*** and will contain all the selected ***subject cards*** in order of selection. 
- Clicking on a ***subject innsertion field*** will insert the selection in the module and the selection will be positioned in order of selection at the place of the ***subject insertion field***

Optimal for mobile use! Also a good alternative to the drag & drop method in general, as you can't drag AND scroll at the same time, so you have to drag and move your mouse close to the top/bottom of the screen to scroll up/down, which can be a bit annoying for extensive use...

## Custom subjects and custom grades!
You can simulate subjects and grades! Creating a custom subject technically means that you're preparing the subject before you have any grade for this subject (since the subjects are automatically created only when you get at least one grade, there are no guesses at all). You can change its name at any time. If a grade is uploaded and its subject name matches that of one of your custom subject, the said subject will no longer be considered custom: you won't be able to change its name anymore, and it won't be saved into your cache anymore either. This will now be a totally normal subject! While being in ***edit mode***, you can create a custom a custom subject by clicking on a ***subject insertion field*** (when you don't have anything selected, they display a `+` sign, showing that clicking on it creates a custom subject) in an existing module. You can also create a module by clicking on a ***module insertion field***, that should also display a `+` sign as long as you don't have anything selected.

Creating a custom grade allows you to simulate a future grade that you can adjust (at any time) so that you can foresee how much you need to score for a final exam in order to pass the semester, for example. When in edit mode, a section at the bottom of each ***grades table*** appears, allowing you to give a name, grade and coefficient, and then pressing `Add` to create the custom grade. 

Custom subjects and grades are saved in your cache, so they will remain in the dashboard as long as you don't clear it.

## Turn off unwanted grades!
Sooometimes, veeeery occasionally, the administration of ECAM Lasalle makes mistakes, and upload twice the same grade. It caaaaan happen. Or, for students who retook a year, you'd have too many grades in your subject, since they are the same as your previous year. Well good news! You can turn off those unwanted grades, so that they no longer count in the calculation of its subject's and module's averages! Turned off grades are saved in your cache, so they will remain turned off as long as you don't clear it.

## A feature you will like: the New Grades Section!
Yes! You read it correctly! A section at the top of the screen, seperated from the rest of the ***semester content***, the "***new grades section***", displays the grades that appeared between the moment you loaded the dashboard (a.k.a. now) and the last time you loaded the dashboard! A notification will also appear at the top of your screen! You can click on it to scroll to the ***new grades section***! You can also click on the ***new grade subject card***, this will make you scroll all the way to the said new grade, this time in its real ***subject card***, even if it's not in the currently filtered semester (it will automatically change the filter to the appropriate semester), so that you can see your grade among the other grades of its subject, among the other subjects of its module. Awesome!

## A report/support section!
You can click on the flag button to open a menu to choose what you want to communicate with me (this will be made through the `issues` tab of this repository): a bug/something not working the way you expect, an idea to improve the dashboard, a configuration you made that you want to share with the rest of your prom... I'll do my best to actively work on the maintenance of the dashboard, so don't hesitate to mention anything! Your dear developer is doing all this for free and for fun, so if you have issues to report, he sincerely thanks you for giving him more stuff to do! :D
