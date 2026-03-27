# PATCH NOTES
## Features
- Added subject card delete buttons (you don't HAVE to drag and drop them in the "Remove from module" drop field anymore). All selected subject cards are deleted along with the subject card whose deletion button was pressed, if the said subject card is selected

- You can now drag a module card and drop it onto a subject insertion field to insert all the subjects of the dragged module card in the new module card (containing the subject insertion field, in the same order as the subjects were in their old module card)

## Improvements
- "Notes" in the dockbar now always appears on the right of the search bar (wasn't consistently inserted)

- better animations for the insertion fields when starting to drag an element
- better animations for the subject and module cards when dragging one of them
- better subject header display (left/right sides and total coef div)
- improved selected card notifs' texts alignment

## Fixes
- fixed the total coef value of the subject cards not disappearing after reloading when its setting is disabled
- fixed problem of height recovery when unfolding a module card
- fixed a few timing problems in async methods
- fixed a problem where the subjects' coef input box would sometimes not work at all
- fixed the module delete button not working
- fixed the onclick event of the view mode buttons so that they do the same action as pressing Shift+D does
- fixed the drag icon onclick event so that the insertion fields display the right text cues when a selection is initiated/stopped
