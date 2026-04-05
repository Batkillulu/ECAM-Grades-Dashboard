# PATCH NOTES v2.5


## What's new in v2.5.0 ?

### Features
- **First steps tutorial**:<br> 
When you launch the extension for the first time since this update, you will be notified to click on the help menu button to access to the first steps tutorial. It will guide you through the dashboard for your first time, filing you in with the most basic informations. Honestly, following this SUPER LONG (4 steps) tutorial just the required amount of info to know how to use the extension. It doesn't cover all the features, just the bare minimum ones.<br>
If you want more info... well wait for update v2.5.1 lol, I'll make a more complete tutorial to cover all the features of the dashboard, I'm procrastinating a bit on that one, it's been planned for a while, but yeah I'll get to it

- **Class average**: <br>
The class average for each subject, module and semester are now displayed. You can turn it off in the settings if you don't want to see them.


### Improvements
- Yet again more improvements for subject cards and module cards animations lol

- Your semester average is now refreshed if you disable a grade, add or delete a simulated grade

### Fixes
- Fixed inconsistency with the switch between detailed and compact (and the other way around) on certain actions, and fixed the view mode not being saved for the next time you visit the dashboard
- Fixed the issue with some actions not working after deleting a simulated grade





<br>                    <br>                    <br>                    <br>





# PATCH NOTES v2.4






## What's new in v2.4.1 ?
### Features
- **New setting: Scroll Helpers (enabled by default)**: <br>
some actions change the vertical size of the page (switching detailed/compact view mode, switching edit mode...). A scroll occurs to make sure the important elements (module/subject card, for instance) remain on screen, to follow this change of vertical size. You may not like being forced to scroll, I can understand, so I leave you the choice to turn it off. Though a few scroll helpers bypass this setting, but those are purely esthetic scrolls

### Improvements
- Slight improvement for folded module cards

- Hiding total coefficients for BOTH module and subject cards when they are being dragged

### Fixes
- Fixed problem with alone subjects when dragged in the addition drop field getting unclassified unintendedly

- Fixed the automatic scroll to the dash header when importing a config (it wasn't selecting the dash header and was using a fallback instead)
- Fixed the side drop fields not removing their hover attribute when dropping a card inside (the next time a card was dragged, the said fields kept having their hover attribute)




<br>        <br>


## What's new in v2.4.0 ?
### Features

- **Patch note**: <br>
A patch note will now be available for every update. You may visit it at any time by clicking on the number of the version, at the very top of the dashboard, next to the dashboard's title

- **Subject card deletion buttons**: <br> 
Added subject card deletion buttons (you don't HAVE to drag and drop them in the "Remove from module" drop field anymore). All selected subject cards are deleted along with the subject card whose deletion button was pressed, if the said subject card is selected

- **Added module card selection**: <br>
You can now select multiple module cards the same way you already could with the subject cards. Dropping a selection of module cards in a field applies the effect of the field on each module selected

- **Module card dropped in subject insertion field**: <br>
You can now drag a module card and drop it onto a subject insertion field to insert all the subjects of the dragged module card in the new module card (containing the subject insertion field, in the same order as the subjects were in their old module card)


### Improvements
- "Notes" in the dockbar now always appears on the right of the search bar (wasn't consistently inserted)

- better animations for the insertion fields when starting to drag an element
- better animations for the subject and module cards when dragging one of them
- better subject header display (left/right sides and total coef div)
- increased the size of important texts, such that the module names and their average
- refreshing the content (by switching edit mode, view mode, or editing the name of a module) doesn't reset the individual folding state of a card, meaning that a folded card will remain folded even after refreshing the content
- improved selected card notifs' texts alignment
- proper handling of the subject card header grades details (indicating the number of grades in the subject and more) when un.folding a subject card


### Fixes
- fixed the total coef value of the subject cards not disappearing after reloading when its setting is disabled
- fixed problem of height recovery when unfolding a module card
- fixed a few timing problems in async methods
- fixed a problem where the subjects' coef input box would sometimes not work at all
- fixed the module delete button not working
- fixed module cards deletion buttons for a selection of module cards
- fixed the onclick event of the view mode buttons so that they do the same action as pressing Shift+D does
- fixed the drag icon onclick event so that the insertion fields display the right text cues when a selection is initiated/stopped
- fixed the online config validity timeout that wasn't working
- fixed the semester content not retrieving its "dragging" display state after a content refresh





<br>                    <br>                    <br>                    <br>





# PATCH NOTES v2.3
## What's new in v2.3.0 ?
### Features
- Offline/Backup Mode! You can now access to the dashboard even if the servers are down! No magic behind it, you need to have launched the dashboard once before being in offline mode for your grades to appear, since the dashboard saves them to your browser's cache.

- The extension now runs on espace.ecam.fr instead of espace.ecam.fr/group/education/notes, and creates a "Notes" button in the top dockbar to access the grades quickly

- Settings: You now have access to settings by clicking on the settings button at the top right corner of the dashboard to enabled/disable the blur of the windows, and enabled/disable the value/text helpers for your module and subject total coefficients

- Keyboard Shortcuts: You may have a look at all the available shortcuts by clicking on the help button ? at the top of the page, and on Keyboard shortcuts

### Improvement
- Improved overall folding and dragging animations' smoothness
- Added a new font: Jura
- Custom scroll bars

- added a little tip in the online cfg picker menu

### Fixes
- fixed an error in the version reading when checking for an update
- fixed an error where the subject cards would unintentionally recover their drag & drop actions when clicking on the subject card's header to fold it when the edit mode was off