# PATCH NOTES v2.4
## What's new in v2.4.0 ?
### Features
- Added subject card deletion buttons (you don't HAVE to drag and drop them in the "Remove from module" drop field anymore). All selected subject cards are deleted along with the subject card whose deletion button was pressed, if the said subject card is selected

- Added module card selection: you can now select multiple module cards the same way you already could with the subject cards. Dropping a selection of module cards in a field applies the effect of the field on each module selected

- You can now drag a module card and drop it onto a subject insertion field to insert all the subjects of the dragged module card in the new module card (containing the subject insertion field, in the same order as the subjects were in their old module card)

- A patch note will now be available for every update. You may visit it at any time by clicking on the number of the version, at the very top of the dashboard, next to the dashboard's title

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
