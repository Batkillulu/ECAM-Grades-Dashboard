(function () {


    //#region — CSS Style —
    //MARK: ——————————————————





    //#region =======  STYLES  CSS  ========

        let styles = ``;





        //#region -DASHBOARD   _________________________

            styles += `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap');
                
                * { 
                    box-sizing: border-box; 
                }
                
                html {
                    font-family: sans-serif;
                    -ms-text-size-adjust: 100%;
                    -moz-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }

                body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea, p, blockquote, th, td {
                    margin: 0;
                    padding: 0;
                }
                
                .ecam-dash { 
                    display: flex; 
                    flex-direction: column; 
                    justify-content:center; 
                    align-items: center; 
                    width: 97%; 
                    margin: 20px 1.5% 0px 1.5%; 
                    color: #1a1a1a;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; 
                    /* font-family: "Jura", sans-serif;
                    font-optical-sizing: auto;
                    font-style: normal; */
                }

                table {
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                

                .offline-mode-title    { display: flex; justify-content: center; align-items: center; text-align: center; height: 60px; font-size: 50px; letter-spacing: 0.23em; font-family: "Rubik Glitch", system-ui; opacity: 0; transition: all 1s ease; }
                .offline-mode-title.show    { opacity: 1; }
                .offline-mode-subtitle { display: flex; justify-content: center; align-items: center; text-align: center; font-size: 17px; margin-bottom: 30px; opacity: 0; transition: all 1s ease; }
                .offline-mode-subtitle.show { opacity: 1; }

                #dash-header { display: flex; justify-content: space-between; align-items: center; padding: 30px 40px; margin-bottom: 15px; width: 100%; background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; border-radius: 20px; box-shadow: 3px 5px 5px 0px #00000042; }
                .dash-title { display: flex; justify-content: center; align-items: center; gap: 5px; font-size: 28px; font-weight: 700; margin: 0; }
                .dash-title-text  {  }
                .patch-notes-link { display: flex; justify-content: center; align-items: center; gap: 5px; cursor: pointer; color: inherit; }
                .dash-subtitle { font-size: 16px; opacity: 95%; padding: 5px 0px; background: transparent; color: white; }
                
                .currently-loading      { display: flex; justify-content: center; align-items: center; height: 100px; width: 100px; min-height: 100px; min-width: 100px; position: fixed; bottom: 30px; right: -100px; opacity: 0%; z-index: 1500; transition: opacity 0.2s ease; }
                .currently-loading.show { right: 30px; opacity: 100%; }
                .loading-symbol         { position: absolute; top: 100px; right: 100px; height: 100px; width: 100px; clip-path: circle(20px); background: #594a8fe0; offset-path: circle(50px); offset-distance: var(--offset-offset); }
                .loading-symbol.blur    { backdrop-filter: blur(2px); }
                .loading-symbol.show    { animation: loading 1s infinite; }
                @keyframes loading  { from {offset-distance: var(--offset-offset)} to {offset-distance: calc(var(--offset-offset) + 100%)} }

                .new-user-notif     { display: flex; justify-content: center; align-items: center; width: 0; height: 0; position: relative; right: 296px; top: -22px; border-radius: 20px; text-align: center; cursor: pointer; user-select: none; z-index: 301; transition: all 0.3s ease; --hoveringElem-amp: 5px; animation: hoveringElem 2s infinite alternate ease-in-out; --arrow-join: round; } 
                .new-user-notif-text    { min-width: 450px; min-height: 53px; padding: 10px; background: #00037b; outline: 3px solid; border-radius: 20px; font-size: 23px; text-wrap-mode: wrap; line-height: 24px; z-index: 10; }
                .new-user-notif-arrow       { width: 0px; height: 0px; position: relative; transition: all 0.5s ease }
                .new-user-notif-arrow-svg        { width: 0; height: 0; min-width: 210px; min-height: 70px; }
                .new-user-notif-arrow-path       { animation: hoveringArrow 2s infinite alternate ease-in-out; }
                .new-user-notif-arrow-path.outside   { fill: none; stroke: #ffffff; stroke-width: 15px; stroke-linejoin: var(--arrow-join); }
                .new-user-notif-arrow-path.inside    { fill: none; stroke: #00037b; stroke-width: 8px;  stroke-linejoin: var(--arrow-join); }
                @keyframes hoveringArrow { from { d: path('M 0 30 c 10,59, 134,90, 165,16 m -19,3 l 21,-6 l 8,18'); } to { d: path('M 0 30 c 23,67, 156,87, 178,0 m -23,8 l 25,-15 l 13,22'); } }

                .focus-notif-fullscreen-effect   { position: fixed; width: 100%; height: 100%; right: 0px; top: 0px; background: black; overflow: clip; opacity: 0%; z-index: 8; transition: all 0.5s ease; }
                .focus-notif-fullscreen-effect.focus { opacity: 60%; }
            `;
            
            
            //#region -Buttons
                styles += `
                    .lang-btn           { border: 2px solid #000000ff; background: #6f79ff; border-radius: 18px; width: 36px; height: 36px; }
                    .lang-btn.active    { border: 2px solid #ceefffff; }
                    .lang-btn:hover     { border: 2px solid #afe4ffff; background: #a6acff; }
                `;
            
            
                //#region -over header buttons
                
                    styles += `

                        .over-header-btns                   { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; position: relative; height: 0px; width: 95%; top: 0px; gap: 8px; color: white; }                        
                        .over-header-btn                            { display: flex; justify-content: center; align-items: center; border-radius: 20px; position: relative; transition: all 0.2s ease; height: 40px; cursor: pointer; user-select: none; text-decoration: none; text-wrap-mode: nowrap; overflow: clip; }
                    `;


                    // MARK: help buttons
                    styles += `
                        .over-header-help-btns                  { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; /* z-index: 301; */ }


                        .over-header-btn.how-to-use-btn                 { justify-content: center;  background: #0059ad; width: 40px; padding-left: 0px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; }
                        .over-header-btn.how-to-use-btn:hover           { outline-color: white; background: #2888e2; }
                        .over-header-btn.how-to-use-btn.open            { outline-color: white; }

                        .over-header-how-to-use-btns                        { display: flex; justify-content: flex-end; align-items: center; gap: 9px; width: 0; height: 0; position: relative; top: 20px; right: -70px; opacity: 0%; z-index: 6; transition: all 0.2s ease; }
                        .over-header-how-to-use-btns.open                   { top: 35px; opacity: 100%; }

                        .over-header-btn.help                                   { background: #0059ad; outline: 2px solid #c022ff; box-shadow: 5px 7px 6px 0px black; padding: 0px 10px; font-size: 15px; border: none; color: inherit; }
                        .over-header-btn.help:hover                             { background: #1672c9; outline-color:     #ffffff; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.help:focus                             { background: #1672c9; outline-color:     #ffffff; box-shadow: 7px 9px 6px 2px black; }

                        .over-header-btn.help.doc-btn                               {  }
                        .over-header-btn.help.doc-btn.fr                            { width: 180px; }
                        .over-header-btn.help.doc-btn.fr::before                    { content: "Voir documentation"; }
                        .over-header-btn.help.doc-btn.en                            { width: 180px; }
                        .over-header-btn.help.doc-btn.en::before                    { content: "See documentation"; }
                        
                        .over-header-btn.help.keybinds-btn                          {  }
                        .over-header-btn.help.keybinds-btn.fr                       { width: 180px; }
                        .over-header-btn.help.keybinds-btn.fr::before               { content: "Raccourcis clavier ⌨️"; }
                        .over-header-btn.help.keybinds-btn.en                       { width: 190px; }
                        .over-header-btn.help.keybinds-btn.en::before               { content: "Keyboard shortcuts ⌨️"; }

                        .over-header-btn.help.tuto-btn                              { font-weight: 700; }
                        .over-header-btn.help.tuto-btn.fr                           { width: 168px; }
                        .over-header-btn.help.tuto-btn.fr::before                   { content: "Démarrer tutoriel ▶︎"; }
                        .over-header-btn.help.tuto-btn.en                           { width: 135px; }
                        .over-header-btn.help.tuto-btn.en::before                   { content: "Start tutorial ▶︎"; }

                        .over-header-btn.help.first-steps-btn                       { font-weight: 700; }
                        .over-header-btn.help.first-steps-btn.fr                    { width: 168px; }
                        .over-header-btn.help.first-steps-btn.fr::before            { content: "► Premiers pas ◄"; }
                        .over-header-btn.help.first-steps-btn.en                    { width: 135px; }
                        .over-header-btn.help.first-steps-btn.en::before            { content: "► First steps ◄"; }
                    `;



                    // MARK: settings button
                    styles += `
                        .over-header-btn.settings-btn           { justify-content: center;  background: #0059ad; width: 40px; padding-left: 0px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; z-index: 5; }
                        .over-header-btn.settings-btn:hover     { outline-color: white; background: #2888e2; }
                        .over-header-btn.settings-btn.open      { outline-color: white; }
                    `;



                    // MARK: issues buttons
                    styles += `
                        .over-header-report-btns                { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; }


                        .over-header-btn.issue.issue-btn                { justify-content: center;     background: #6e00ad; width: 40px;                padding-left: 6px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; z-index: 5; }
                        .over-header-btn.issue.issue-btn:focus          { outline: 3px solid white; }
                        .over-header-btn.issue.issue-btn:hover          { outline: 3px solid white;    background: #8b15cf; }
                        .over-header-btn.issue.issue-btn.open           { outline: 3px solid white; }
                        .over-header-btn.issue.mail-info                { justify-content: flex-start; background: #005f10; width: 39px; right: -156px; padding-left: 10px; font-size: 15px; outline: 2px solid #ffffff; border: none; color: white;   z-index: 1; }
                        .over-header-btn.issue.share-config             { justify-content: flex-start; background: #00569d; width: 39px; right: -117px; padding-left: 10px; font-size: 15px; outline: 2px solid #ffffff; border: none; color: white;   z-index: 2; }
                        .over-header-btn.issue.suggest-idea             { justify-content: flex-start; background: #009d40; width: 39px; right: -78px;  padding-left: 10px; font-size: 15px; outline: 2px solid #ffffff; border: none; color: white;   z-index: 3; }
                        .over-header-btn.issue.report-issue             { justify-content: flex-start; background: #ad0000; width: 39px; right: -40px;  padding-left: 10px; font-size: 15px; outline: 2px solid #ffffff; border: none; color: white;   z-index: 4; }
                        
                        .over-header-btn-mail-info-text             { color: white; transition: all 0.5s ease; }
                        .over-header-btn-mail-info-text.lighten     { animation: overHeaderBtnMailInfoText 1.5s ease; }
                        .over-header-btn-copied-cue                 { background: #555555; color: white; font-size: 17px; position: relative; left: -158px; top: -20px; opacity: 0%; }
                        .over-header-btn-copied-cue.show            { animation: overHeaderBtnCopiedCue 1.5s ease; }
                        @keyframes overHeaderBtnCopiedCue           { 0% {top: -20px; opacity: 0%;} 20% {top: 0px; opacity: 100%;} 50% {top: 0px; opacity: 100%} 100% {top: 20px; opacity: 0%;} }
                        @keyframes overHeaderBtnMailInfoText        { 0% {color: white;} 20% {color: #ffffff75;} 50% {color: #ffffff75;} 100% {color: white;} }
                        
                        .over-header-btn.issue.mail-info.fr.open            { width: 337px; right: -685px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.share-config.fr.open         { width: 557px; right: -640px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.suggest-idea.fr.open         { width: 391px; right: -261px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.report-issue.fr.open         { width: 234px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }

                        .over-header-btn.issue.mail-info.en.open            { width: 330px; right: -580px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.share-config.en.open         { width: 455px; right: -530px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.suggest-idea.en.open         { width: 329px; right: -215px; box-shadow: 5px 7px 6px 0px black; }
                        .over-header-btn.issue.report-issue.en.open         { width: 191px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }
                        

                        .over-header-btn.issue.mail-info.open:hover          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.share-config.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.suggest-idea.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.report-issue.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }

                        .over-header-btn.issue.mail-info.open:focus          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.share-config.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.suggest-idea.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                        .over-header-btn.issue.report-issue.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                    `;

                //#endregion

                


                // MARK: -other buttons
                styles += `
                
                    .header-actions                 { display: flex; gap: 12px; }
                    .config-btns-container          { display: flex; flex-direction: column; }
                    .btn                                { display: flex; justify-content: center; align-items: center; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px; }
                    .btn-edit-mode:hover:not(:disabled) { transform: scale(0.95); background: linear-gradient(135deg, #7d92eeff 0%, #8e5ebeff 100%); }
                    .btn-edit-mode                      { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: grid; width: 126px; height: 108px; transition: all 0.2s ease }
                    .btn-edit-mode.on                   { transform: scale(0.95); box-shadow: inset 0px 0px 6px 4px #ffffff; }
                    .btn-export                         { background: white; color: #666; width: 140px; height: 50px; margin-bottom: 8px; }
                    .btn-import                         { background: white; color: #666; width: 140px; height: 50px; z-index: 1; }
                    .btn-export:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                    .btn-import:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                    .btn-icon                           { font-size: 20px; margin-bottom: 2px }
                    .btn:disabled                       { opacity: 50%; cursor: not-allowed; }
                `;

            //#endregion





            //MARK: -settings
            styles += `

                .settings-modal-container   { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 1000; }
                .settings-modal                 { display: flex; padding: 40px 30px; --modal-max-width: 1000px; --modal-max-height: 500px; overflow: auto; }
                .settings-modal-body                { display: flex; flex-direction: column; width: 100%; }
                .settings-row-family                    { display: flex; flex-direction: column; width: 100%; background: linear-gradient(90deg, #5c5c5c38 0%, transparent 50%); background-size: 200% 200%; background-position: 100% 100%; transition: all 0.3s ease; }
                .settings-row-family.disabled           { background-position: 0% 100%; }
                .settings-row                               { --padding-left: 0px; display: flex; justify-content: space-between; align-items: center; gap: 20px; background: linear-gradient(90deg, #5c5c5c5c 0%, transparent 50%); background-size: 200% 200%; background-position: 100% 100%; transition: all 0.3s ease; }
                .settings-row.parent                        { --padding-left: 0px; background: none; }
                .settings-row.child                         { --padding-left: 5px; margin-left: 20px; padding-left: var(--padding-left); border-left: 1px solid #80808073; border-top: 1px solid #80808073; border-top-left-radius: 15px; }
                .settings-row.disabled                      { background-position: 0% 100%; opacity: 80%; padding-left: calc(5px + var(--padding-left)); }
                .settings-text                                  { display: flex; flex-direction: column; gap: 8px; padding: 13px 0px; }
                .settings-checkbox                              { zoom: 130%; }
            
            `;


            //MARK: keybinds
            styles += `

                .keyboard-shortcut-list-container   { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 900; }
                .keyboard-shortcut-list-modal           { display: flex; padding: 30px; overflow: auto; }

                .keybinds-table-row     { height: var(--row-height); border-top: 1px solid black; }
                .keybinds-table-cell        { padding: 15px 0px 15px 15px; }
                .keybinds-table-cell.text       { border-right: 1px solid black; }

            `;


            //MARK: TUTOS
            styles += `
                .tuto-tip-notif-container   { display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; width: 0; height: 0; z-index: 10; opacity: 0; transform: scale(110%); --infinite-alternate-scale-up-scale: 100%; user-select: text; transition: all 0.3s ease;}
                .tuto-tip-notif         { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 15px; padding: 20px; background: linear-gradient( #5334ff 0%, #7a62ff 100%); border-radius: 7px; outline: 5px solid; color: white; font-size: 31px; line-height: 31px; text-align: center; --hoveringElem-amp: 10px; animation: focusBlinkAnimation 2s infinite alternate ease-in-out, hoveringElem 2s infinite alternate ease-in-out; transition: all 0.3s ease; }
                .tuto-tip-notif:hover   { animation-play-state: running, paused; }

                .tuto-tip-btns-container 	{ display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; font-size: 28px; font-weight: 700; text-wrap-mode: nowrap; }
                .tuto-tip-btns-container-header	{ display: flex; flex-direction: column; justify-content: center; align-items: center; text-wrap-mode: nowrap; width: 0; height: 0; }	
                .tuto-tip-btns-body				{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 10px; gap: 20px; overflow-x: visible; overflow-y: auto; }	
                .tuto-tip-btn						{ display: flex; justify-content: center; align-items: center; padding: 15px; outline: 2px solid white; border-radius: 10px; background: linear-gradient( #5334ff75 0%, #7a62ff75 100%); color: white; font-size: 26px; font-weight: 700; text-wrap-mode: nowrap; cursor: pointer; animation: none; animation-play-state: paused; transition: all 0.2s ease; }
                .tuto-tip-btn:hover 				{ animation: focusBlinkAnimation 1s infinite alternate ease-in-out; transform: scale(101%); }

                @keyframes focusBlinkAnimation  { from { filter: brightness(1); } to { filter: brightness(1.5) } }

                .skip-tuto-btn          { display: flex; justify-content: center; align-items: center; padding: 10px; position: fixed; top: 45px; right: 20px; background: #4c84fde8; border-radius: 10px; color: white; font-size: 20px; text-decoration: underline; cursor: pointer; opacity: 0; z-index: 5000; transition: all 0.5s ease; }
                .skip-tuto-btn::before      { content: "Skip tutorial"; }

                .tuto-lang-btn-toggle-container	{ display: flex; justify-content: center; align-items: center; position: fixed; top: 48px; right: 200px; outline: 2px solid white; border-radius: 20px; width: 100px; height: 31px; overflow: clip; z-index: 12; opacity: 0; cursor: pointer; transition: all 0.5s ease; }
                .tuto-lang-btn-toggle		{ display: flex; justify-content: space-evenly; align-items: center; padding: 10px; position: relative; min-width: 170px; height: 31px; background: linear-gradient(90deg, #3636ffc5 20%, #8e38ffc5 80%); transform: translateX(0px); transition: all 0.2s ease; }
                .tuto-lang-btn-toggle.fr	{ transform: translateX(35px);  }
                .tuto-lang-btn-toggle.en	{ transform: translateX(-35px); }
            `;


            // MARK: import menu
            styles += `

                .import-menu        { display: flex; justify-content: space-around; position: relative; right: 375px; top: 0; color: black; font-size: 15px; border-radius: 13px; height: 0; width: 0; opacity: 0%; z-index: 0; transition: all 0.2s ease; }
                .import-menu.show   { top: 16px; opacity: 100%; }
                .import-menu-body   { display: flex; justify-content: space-around; align-items: center; border-radius: 13px; background: white; box-shadow: 5px 4px 20px 0px #00000066; min-height: 60px; min-width: 540px; transition: all 0.2s ease; }
                .import-menu-btn        { display: flex; justify-content: center; align-items: center; text-align: center; user-select: none; cursor: pointer; background: white; border-radius: 12px; border: 2px solid; height: 40px; width: 40%; padding: 5px; transition: all 0.2s ease; }
                .import-menu-btn:hover  { background: #dddddd; }
                .import-menu-btn.file   {  }
                .import-menu-btn.clear  { width: 15%; }
                .import-menu-btn.online {  }
                

                .online-cfg-picker-menu-container   { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 999; }
                .online-cfg-picker-menu                 { display: flex; flex-direction: column; justify-content: flex-start; padding: 20px 35px; z-index: 1000; }
                .online-cfg-picker-menu-header              { display: flex; justify-content: center; align-items: center; padding: 6px 0px; font-size: 15px; z-index: 1010; }

                .online-cfg-picker-menu-body            { display: flex; flex-direction: row; overflow: auto; }
                .online-cfg-picker-menu-body-content  { display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 100%; height: 100%; min-width: 640px; min-height: 263px; padding: 5px 0px; }
                .online-cfg-picker-menu-dir-tree            { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 0px; color: black; margin: 0px 0px; border-radius: 16px; outline: 2px solid; background: white; overflow: clip; opacity: 0%; user-select: none; transition: all 0.2s ease; }
                .online-cfg-picker-menu-dir-tree.show       { width: 150px; opacity: 100%; margin: 0px 5px; user-select: text; }
                .online-cfg-picker-menu-dir-tree.section    { z-index: 1004; }
                .online-cfg-picker-menu-dir-tree.year       { z-index: 1003; }
                .online-cfg-picker-menu-dir-tree.prom       { z-index: 1002; }
                .online-cfg-picker-menu-dir-tree.config     { z-index: 1001; }
                .online-cfg-picker-menu-dir-tree-header         { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; overflow: clip; text-wrap-mode: nowrap; font-size: 20px; font-weight: 800; border-bottom-width: 2px; border-bottom-style: solid; padding: 5px; }
                .online-cfg-picker-menu-dir-tree-header.section.fr::before  { content: "SECTION";   }
                .online-cfg-picker-menu-dir-tree-header.prom.fr::before     { content: "PROMO";     }
                .online-cfg-picker-menu-dir-tree-header.year.fr::before     { content: "ANNÉE";     }
                .online-cfg-picker-menu-dir-tree-header.config.fr::before   { content: "CONFIG";    }
                .online-cfg-picker-menu-dir-tree-header.section.en::before  { content: "SECTION";   }
                .online-cfg-picker-menu-dir-tree-header.prom.en::before     { content: "PROM";      }
                .online-cfg-picker-menu-dir-tree-header.year.en::before     { content: "YEAR";      }
                .online-cfg-picker-menu-dir-tree-header.config.en::before   { content: "CONFIG";    }
                .online-cfg-picker-menu-dir-tree-nb-cfgs        { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; overflow: clip; text-wrap-mode: nowrap; font-size: 15px; padding: 5px; }
                .online-cfg-picker-menu-dir-tree-body           { display: flex; flex-direction: column; justify-content: center; align-items: center; height: calc(100% - 20px); width: 95%; }

                .online-cfg-picker-menu-dir-card            { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 40px; width: 90%; position: relative; border-radius: 16px; border: 2px solid; background: white; cursor: pointer; overflow: clip; padding: 5px; margin: 5px 0px; user-select: none; transition: all 0.3s ease; }
                .online-cfg-picker-menu-dir-card.on         { width: 100%; border-radius: 16px; background: #b9beff; }
                .online-cfg-picker-menu-dir-card:hover      { transform: scale(95%); background: #dddddd; }
                .online-cfg-picker-menu-dir-card.on:hover   { transform: scale(95%); background: #dbddff; }

            `;


            // MARK: main average card
            styles += `
                .main-average-card { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 104px; background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 15px; }

                .average-display { display: flex; align-items: baseline; gap: 10px; }
                .average-number     { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
                .average-label      { font-size: 18px; color: #666; font-weight: 500; }
                .average-stats { display: flex; gap: 30px; }
                .stat-item { text-align: center; }
                .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
                .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
            `;


            // MARK: new grades
            styles += `
                .new-grades-card                { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px; width: 100%; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87; scroll-margin: 105px; transition: box-shadow 0.3s ease}
                .new-grades-card.myhighlight    { box-shadow: 0px 0px 20px 20px #322bff87; }
                .new-grades-card.none           { border: 1px solid #446dff; background: #f7f9ffff; box-shadow: none; opacity: 80%; }
                .new-grades-card-header         { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px; }
                .new-grades-card-header.none    { justify-content: center; }
                .new-grades-card-title          { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 25px; display:flex; align-items:center }
                .new-grades-card-title.none     { font-size: 18px; font-weight: 700; }
                .new-grades-content             { display: flex; flex-direction: column; gap: 20px; }
                .new-grades-subject-card        { display: flex; flex-direction: column; border: 2px solid #c1a7ffff; border-radius: 12px; transition: border 0.3s ease; }
                .new-grades-subject-card-title  { border: 2px solid #c1a7ffff; border-radius: 12px; margin: -2px -2px 5px -2px; font-size: 16px; font-weight: 600; background: #c1ceff; padding: 5px 0px 5px 10px; transition: border 0.3s ease, background 0.3s ease; }
                .new-grades-subject-card.hover          { cursor: alias; border: 2px solid #dcccff; }
                .new-grades-subject-card-title.hover    { cursor: alias; border: 2px solid #dcccff; background: #d7dfff; }
                .new-grades-table               {  }
                .new-grades-table-grades        {  }
            `;


            // MARK: notifs
            styles += `

                .update-available-notif     { display: flex; align-items: center; justify-content: space-evenly; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 95%; height: 70px; position:fixed; left:2.5%; right:0px; top:-75px; z-index: 400; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                .update-available-notif.on  { top: 2px }
                .update-available-notif-header  { display: flex; justify-content: center; align-items: center; width: 80%; font-size: 25px; gap: 15px; }
                .update-available-notif-text        { display: flex; justify-content: center; align-items: center; }
                .update-available-notif-patch-notes { display: flex; justify-content: center; align-items: center; padding: 5px; border: 2px solid; border-radius: 20px; }
                .update-available-notif-btns    { display: flex; justify-content: space-between; align-items: center; flex-direction: row; width: 20%; }
                .update-btn                     { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #007cffff; transition: all 0.3s ease; text-decoration: none; outline: none; color: inherit; }
                .update-btn:focus               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                .update-btn:hover               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                .dismiss-update-btn             { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #ff00218f; transition: all 0.3s ease; }
                .dismiss-update-btn:hover       { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }

                .new-grades-notif           { display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 90%; height: 50px; cursor:pointer; position:fixed; left:5%; right:0px; top:-55px; z-index:299; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                .new-grades-notif.on        { top:50px }

                .temp-notif         { display: flex; justify-content: center; align-items: center; position: fixed; top: 0px; background: linear-gradient(180deg, #432eff 0%, #7060ff5d 100%); padding: 10px 30px; border-radius: 0px 0px 20px 20px; color: black; font-size: 20px; font-weight: 500; text-align: center; opacity: 0%; z-index: 2000; transition: all 1s ease; }
                .temp-notif.show        { color: white; opacity: 100%; }
                .temp-notif.fr::before      { content: "Tu ne peux pas sélectionner une carte de module ET une carte de sujet ! Ne mélange pas les sélections !" }
                .temp-notif.en::before      { content: "You can't select a module card AND a subject card! Don't mix up the selections!" }

                .new-indicator-container    { display: flex; width: 0; height: 0; position: relative; }
                .new-indicator                  { --new-indicator-base-color: #008cff; --new-indicator-highlight-color: #81c6ff; display: flex; min-width: 10px; min-height: 10px; border-radius: 5px; background: var(--new-indicator-base-color); animation: newIndicator 1s alternate infinite ease; }
                @keyframes newIndicator { from { background: var(--new-indicator-base-color); } to {background: var(--new-indicator-highlight-color);} }

            `;


            // MARK: semester filter
            styles += `
                .controls-bar       { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 16px 20px; width: 100%; background: white; border-radius: 16px; border: 1px solid #e5e5e5; }
                .filter-title       { border-radius: 20px; color: white; font-weight: 700; font-size: 14px; padding: 10px 15px; margin-right: 70%; margin-bottom: -15px; background: linear-gradient(45deg, #446dff 20%, #1222ff12 60%, #ffffff00 89%); position: relative; transition: all 0.2s ease; }
                .filter-tabs        { display: flex; background: #f7f7f7; padding: 4px; border-radius: 12px; gap: 4px; height: 44px; }
                .filter-tab         { display: flex; justify-content: center; padding: 10px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: all 0.2s ease; font-size: 14px; width: 57px; }
                .filter-tab:hover   { background: white; color: #333333ff; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(110%); }
                .filter-tab.active  { background: white; color: #667eeaff; box-shadow: 3px 5px 5px 0px #00000042; }
            `;


            // MARK: view mode buttons
            styles += `
                .view-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 4px; background: #f7f7f7; border-radius: 8px; }
                .fold-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; height: 40px; width: 180px; background: #f7f7f7; outline: 1px solid; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; user-select: none; transition: all 0.3s ease; }
                .fold-toggle:hover  { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                .fold-toggle.active { background: white; box-shadow: 3px 5px 5px 0px #00000042, inset 0px 0px 5px 2px #00000042; }
                .fold-toggle.fr::after  { content: "Plier tous les modules" }
                .fold-toggle.en::after  { content: "Fold all modules" }
                .view-btn           { background: transparent; padding: 8px 12px; border: none; outline: 1px solid #adadad; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; width: 48px; height: 40px; }
                .view-btn:hover     { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                .view-btn.active    { background: white; box-shadow: 3px 5px 5px 0px #00000042; outline-color: black; }
            `;

        //#endregion
        
        



        //#region -DROP FIELDS __________________________
            styles += `
                .drop-field     { display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; overflow: clip; user-select: none; }
            `;
                

            // MARK: drop create fields
            styles += `
                .drop-field.create-module                           { position: fixed; top: 50px; right:0px; height: calc(100% - 100px); width: 0%; border: 2px dashed #7fc2ff; border-radius: 20px 0px 0px 20px; border-color: #7fc2ff00; background: #bdb8ff00; font-weight: 800; color: #7fc2ff00; z-index: 297; transition: all 0.2s ease; }
                .drop-field.create-module.show                      { width: 15%; border-width: 2px 0px 2px 2px; border-color: #7fc2ff; color: #7fc2ff; background: #bdb8ff3d; }
                .drop-field.create-module.hover                     { background: #d3d0ffce; }
                .drop-field-create-module-plus                      { position: relative; font-size: 50px; transform: rotate( 0deg); transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-create-module-plus.hover                { right: 4px; font-size: 90px; transform: rotate(-90deg); }
                .drop-field-create-module-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-create-module-text.top                  { bottom:  10px; right:0px; }
                .drop-field-create-module-text.bottom               { top:     10px; left: 0px; }
                .drop-field-create-module-text.top.hover            { bottom:  30px; right:20px; font-size: 30px; }
                .drop-field-create-module-text.bottom.hover         { top:     30px; left: 20px; font-size: 30px; }

                .drop-field-create-module-text.top.fr::before       { content: "Créer un"; }
                .drop-field-create-module-text.bottom.fr::after     { content: "nouveau module"; }
                .drop-field-create-module-text.top.en::before       { content: "Create a"; }
                .drop-field-create-module-text.bottom.en::after     { content: "new module"; }

                .drop-field-create-module-hitbox                    { position: fixed; top: 50px; right:0px; height: calc(100% - 100px); width: 0%; border-radius: 20px 0px 0px 20px; transition: all 0.2s ease; }
                .drop-field-create-module-hitbox.show               { width: 15%; border-width: 2px 0px 2px 2px; cursor: pointer; z-index: 298; }
            `;
                

            // MARK: drop remove fields
            styles += `

                
                .drop-field.remove-from-module                      { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border: 2px dashed #ff7f7f; border-radius: 0px 20px 20px 0px; border-color: #ff7f7f00; background: #ffb8b800; font-weight: 800; color: #ff7f7f00; z-index: 297; transition: all 0.2s ease; }
                .drop-field.remove-from-module.show                 { width: 15%; border-width: 2px 2px 2px 0px; border-color: #ff7f7f; color: #ff7f7f; background: #ffb8b83d; cursor: pointer; }
                .drop-field.remove-from-module.hover                     { background: #ffb8b8ce; }
                .drop-field-remove-from-module-minus                     { position: relative; font-size: 50px; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-remove-from-module-minus.hover               { font-size: 90px; }
                .drop-field-remove-from-module-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-remove-from-module-text.top                  { bottom:  10px; left: 0px; }
                .drop-field-remove-from-module-text.bottom               { top:     10px; right:0px; }
                .drop-field-remove-from-module-text.top.hover            { bottom:  30px; left: 20px; font-size: 30px; }
                .drop-field-remove-from-module-text.bottom.hover         { top:     30px; right:20px; font-size: 30px; }

                .drop-field-remove-from-module-text.top.fr::before       { content: "Enlever"; }
                .drop-field-remove-from-module-text.bottom.fr::after     { content: "du module"; }
                .drop-field-remove-from-module-text.top.en::before       { content: "Remove"; }
                .drop-field-remove-from-module-text.bottom.en::after     { content: "from module"; }

                .drop-field-remove-from-module-hitbox                    { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border-radius: 0px 20px 20px 0px; transition: all 0.2s ease; }
                .drop-field-remove-from-module-hitbox.show               { width: 15%; border-width: 2px 2px 2px 0px; cursor: pointer; z-index: 298; }
            `;
                

            // MARK: drop insert fields
            styles += `

                .drop-field.insert-field.module                     { justify-content: flex-start; width: 98%; height: 4px; color: #9b9b9b00; opacity: 0%; border: 2px dashed #9b9b9bff; background: #bdb8ff3d; font-size: 25px; font-weight: 800; user-select: none; margin: 48px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.module.show                { color: #9b9b9bff; border-color: #9b9b9bff; opacity: 50%;  border-width: 2px 0px; border-radius: 0px; height: 50px; margin: 25px 0px; }
                .drop-field.insert-field.module.show.hover          { color: #887bffff; border-color: #7fc2ffff; opacity: 100%; border-width: 2px 2px; border-radius: 20px; }

                .drop-field.insert-field.subject                    { justify-content: flex-start; width: 98%; height: 4px; color: #9b9b9bff; opacity: 0%; border: 2px dashed #9b9b9b54; background: #bdb8ff1a; font-size: 25px; font-weight: 800; user-select: none; margin: 30px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.subject.show               { color: #9b9b9bff; border-color: #9b9b9b54; opacity: 50%;  border-width: 2px 0px; border-radius: 0px; height: 30px; margin: 17px 0px; }
                .drop-field.insert-field.subject.show.hover         { color: #887bffff; border-color: #7fc2ffff; opacity: 100%; border-width: 2px 2px; border-radius: 20px; }
                
                .drop-module-card-insert-content                        { position: relative; display: flex; align-items: center; width: 100%; height: 50px; overflow: clip; top:-2px; }
                .drop-module-card-insert-content.plus                   {  }
                .drop-module-card-insert-content.arrow                  { top: -52px; }
                .drop-module-card-insert-content.text                   { overflow: visible; top: -102px }
                .drop-module-card-insert-content.text.add               { justify-content: center; }
                .drop-module-card-insert-content.text.insert            { justify-content: flex-start; }

                .drop-module-card-insert-arrow                          { font-size: 500px; display: flex; align-items: flex-start; justify-content: center; height: 50px; position: relative; left: calc(50% - 145px); background: transparent; opacity: 0%;                          transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); line-height: 5%; }
                .drop-module-card-insert-arrow.show                     { opacity: 50%; }
                .drop-module-card-insert-arrow.show.hover               { left: 50%; opacity: 100%; }

                .drop-module-card-insert-plus                           { transform: translate(  0px, 14px) rotate(  0deg); font-size: 50px ;  position: relative; left: 0px; display: flex; justify-content: center; height: 50px; width: 100%; background: transparent; opacity: 0%; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); line-height: 39%; }
                .drop-module-card-insert-plus.show                      { opacity: 50%; }
                .drop-module-card-insert-plus.show.hover                { transform: translate(130px, 30px) rotate(180deg); font-size: 280px; opacity: 100%; line-height: 10%; }

                .drop-module-card-insert-text                           { display: flex; justify-content: flex-start; align-items: center; position: relative; overflow-x: clip; text-wrap: nowrap; width: 0px; height: 50px; background: transparent; opacity: 50%;                   transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }

                .drop-module-card-insert-text.add.fr                { --width: 263px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-module-card-insert-text.add.en                { --width: 230px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-module-card-insert-text.insert.fr             { --width: 150px; --x-translation:  50px; }
                .drop-module-card-insert-text.insert.en             { --width: 150px; --x-translation:  50px; }

                .drop-module-card-insert-text.add.fr::before            { content: "Ajouter un module ici";}
                .drop-module-card-insert-text.add.en::before            { content: "Add a module here";}
                .drop-module-card-insert-text.add                       { width: 0px; right: 0px; }
                .drop-module-card-insert-text.add.hover                 { width: var(--width); right: var(--x-translation); opacity: 100%; }
                
                .drop-module-card-insert-text.insert.fr::before         { content: "Insérer ici"; }
                .drop-module-card-insert-text.insert.en::before         { content: "Insert here"; }
                .drop-module-card-insert-text.insert                    { width: 0px; right: calc(var(--x-translation) + var(--width) - 50%); }
                .drop-module-card-insert-text.insert.hover              { width: var(--width); right: calc(var(--width) - 50%); opacity: 100%; }

                .drop-module-card-insert-hitbox                     { display: flex; position: relative; top: -152px; width: calc(100% - -4px); min-height: 50px; border-radius: 20px; cursor: pointer; }
                

                .drop-subject-card-insert-content                   { position: relative; display: flex; align-items: center; width: 100%; height: 30px; overflow: clip; top:-2px; }
                .drop-subject-card-insert-content.plus              {  }
                .drop-subject-card-insert-content.arrow             { top: -32px; }
                .drop-subject-card-insert-content.text              { overflow: visible; top: -62px }
                .drop-subject-card-insert-content.text.add          { justify-content: center; }
                .drop-subject-card-insert-content.text.insert       { justify-content: flex-start; }
                
                .drop-subject-card-insert-arrow                     { font-size: 280px; display: flex; align-items: flex-start; justify-content: center; height: 30px; position: relative; left: calc(50% - 120px); background: transparent; opacity: 0%;                       transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); line-height: 7%; }
                .drop-subject-card-insert-arrow.show                { opacity: 50%; }
                .drop-subject-card-insert-arrow.show.hover          { left: 50%; opacity: 100%; }

                .drop-subject-card-insert-plus                      { transform: translate(0%, 4px) rotate(0deg)   ; font-size: 50px;  position: relative; left: 0px; display: flex; justify-content: center; height: 30px; width: 100%; background: transparent; opacity: 0%;  transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); line-height: 33%; }
                .drop-subject-card-insert-plus.show                 { opacity: 50%; }
                .drop-subject-card-insert-plus.show.hover           { transform: translate(9%, 80%) rotate(180deg); opacity: 100%; font-size: 200px; line-height: 10%; }

                .drop-subject-card-insert-text                      { display: flex; justify-content: flex-start; align-items: center; position: relative; overflow-x: clip; text-wrap: nowrap; width: 0px; height: 50px; background: transparent;  opacity: 50%;              transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }

                .drop-subject-card-insert-text.add.fr           { --width: 280px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-subject-card-insert-text.add.en           { --width: 230px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-subject-card-insert-text.insert.fr        { --width: 123px; --x-translation:  50px; }
                .drop-subject-card-insert-text.insert.en        { --width: 135px; --x-translation:  50px; }

                .drop-subject-card-insert-text.add.fr::before       { content: "Ajouter une matière ici";}
                .drop-subject-card-insert-text.add.en::before       { content: "Add a subject here";}
                .drop-subject-card-insert-text.add                  { width: 0px; right: 0px; }
                .drop-subject-card-insert-text.add.hover            { width: var(--width); right: var(--x-translation); opacity: 100%; }
                
                .drop-subject-card-insert-text.insert.fr::before    { content: "Insérer ici"; }
                .drop-subject-card-insert-text.insert.en::before    { content: "Insert here"; }
                .drop-subject-card-insert-text.insert               { width: 0px; right: calc(var(--x-translation) + var(--width) - 50%); }
                .drop-subject-card-insert-text.insert.hover         { width: var(--width); right: calc(var(--width) - 50%); opacity: 100%; }

                .drop-subject-card-insert-hitbox                { display: flex; position: relative; top: -92px; width: calc(100% - -4px); min-height: 30px; border-radius: 20px; cursor: pointer; }
                
            `;
        //#endregion





        //#region -CONTENT AREA _______________________
            styles += `
                .content-area { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
            `;




            // MARK: Intranet table
            styles += `
                .intranet-fold { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: #1a1a1a; }
                .intranet-fold:hover { background: #f3f4f6; }
                .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
                .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
                .intranet-toggle.openLeft { transform: rotate(-180deg); }
                .intranet-toggle.openRight { transform: rotate(180deg); }
            `;


            // MARK: semester section
            styles += `
                .semester-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
                .semester-header        { display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f9fafb; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; cursor: pointer; }
                .semester-header:hover  { background: #f3f4f6; }
                .semester-info              { display: flex; align-items: center; gap: 12px; }
                .semester-name              { font-size: 24px; font-weight: 600; color: #1a1a1a; }
                .semester-averages          { display: flex; align-items: baseline; gap: 6px; padding: 6px 12px; background: white; border: 1px solid #575757; border-radius: 8px; font-size: 19px; font-weight: 600; transition: all 0.2s ease; }
                .semester-averages.good         { color: #10b981; border-color: #10b98130; }
                .semester-averages.bad          { color: #ef4444; border-color: #ef444430; }

                .semester-toggle                { display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; font-size: 18px; transition: transform 0.3s ease; }
                .semester-toggle.open           { transform: rotate(180deg); }

                .semester-content               { padding: 50px 24px; display: none; }
                .semester-content.show          { display: flex; flex-direction: row; width: 100%; gap: 0px; transition: all 0.2s ease; }
                .semester-content.show.edit     { padding: 24px; }
                .semester-content.show.dragging { width: 73%; gap: 20px; }

                .semester-body      { display: flex; flex-direction: column; width: 100%; gap: 20px; transition: gap 0.2s ease; }
            `;
                


            

            // MARK: -MODULES SECTION
            styles += `

                .modules-section                                { display: flex; flex-direction: column; gap: 50px; align-items: center; width: 100%; transition: all 0.3s ease; }
                .modules-section.edit                           { gap: 12.5px; }
            `;
                





            // MARK: -MODULE CARDS
            styles += `

                .module-card                { display: flex; flex-direction: column; align-items: center; width: 100%; position: relative; background: #fafafa; border-radius: 25px; outline: 3px solid #e5e5e5; scroll-margin: 70px; overflow: clip; transition: all 0.2s ease; }
                .module-card.validated      { outline-color: #10b981ff; background: radial-gradient(transparent 0%, #f0fdf4ff 75%); }
                .module-card.failed         { outline-color: #ef4444ff; background: radial-gradient(transparent 0%, #fef2f2ff 75%); }
                .module-card.unknown        { outline-color: #6d6d6dff; background: radial-gradient(transparent 0%, #d1d1d1ff 75%); }

                .module-card-header                  { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 22px 22px 0px 0px; width: 100%; min-height: 80px; max-height: 80px; cursor: pointer; z-index: 2; transition: all 0.1s ease; }
                .module-card-header.fold             { border-radius: 25px; }
                .module-card-header.validated        { border-color: #10b981ff; background: linear-gradient(300deg, #e0ffeaff 30%, transparent); }
                .module-card-header.failed           { border-color: #ef4444ff; background: linear-gradient(300deg, #ffd9d9ff 30%, transparent); }
                .module-card-header.unknown          { border-color: #6d6d6dff; background: linear-gradient(300deg, #acacacff 30%, transparent); }
                .module-card-header:hover            { filter: brightness(calc(0.01 * 105)); opacity: 90%; }
                .module-delete-btn                  { border-radius: 14px; background: transparent; margin: 0; text-transform: none; -webkit-appearance: button; font: 1em Arial,Helvetica,Verdana,sans-serif; width: auto; padding: 5px; overflow: visible; cursor: pointer; color: #34404F; text-shadow: none; font-weight: normal; border: 3px solid; border-color: white; transition: all 0.2s ease; } 

                .module-card-header-left-side        { display: flex; align-items: center; justify-content: flex-start; width: 35%; }
                .module-title                    { font-size: 20px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
                .module-title.input              { font-size: 20px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }


                .module-subject-total-coef-div   { display: flex; flex-direction: column; text-align: left; width:47%; gap:4px; padding: 0px 10px; font-size: 14px; opacity: 100%; transition: all 0.1s ease; }
                .module-subject-total-coef-value { display: flex; text-align: left; font-size: 13px; font-weight: 600; gap: 8px; }
                .module-subject-total-coef-debug { display: flex; text-align: left; font-size: 13px; }


                .module-card-content            { display: flex; flex-direction: column; width: 100%; align-items: center; gap: 0px; padding: 8px 0px 18px 0px; opacity: 100%; transition: all 0.2s ease; }
                .module-card-content.edit-mode  { gap: 5px; }

                .module-info                        { display: flex; flex-direction: row; justify-content: space-around; align-items: center; position: relative; top: -10px; width:97%; min-height: 36px; background: #eef2ff00; border:1px solid #c7d2fe00; padding: 0px 8px 3px 8px; border-radius: 0px 0px 8px 8px; margin-top: -1px; opacity: 100%; transition: all 0.2s ease; }
                .module-info-bar                    { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width:48%; background: #eef2ff; border:1px solid #c7d2fe; padding: 3px 15px; border-radius: 0px 0px 8px 8px; }
                .module-info-clear                  { display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 220px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
                .module-info-clear:hover            { width: 240px; font-size: 11.5px; margin-right: 0px; background: #eef2ff; }
                .module-info-clear.disabled         {  }
                .module-info-clear.sim              {  }

                .module-card-header-right-side  { display: flex; justify-content: flex-end; align-items: center; width: 20%; gap: 6px; font-size: 19px; font-weight: 600; text-wrap-mode: nowrap; }
                .module-class-average               { display: flex; justify-content: flex-end; align-items: center; width: 80px; font-size: 17px; }
                .module-average                     { display: flex; justify-content: flex-end; align-items: center; font-size: 26px; font-weight: 800; }
                .module-average.good                { color: #10b981; }
                .module-average.bad                 { color: #ef4444; }
                .module-average.unknown             { color: #6d6d6dff; }
                .module-toggle                      { display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; line-height: 1px; margin-left: 5px; font-size: 18px; color: #000000; transition: transform 0.3s ease; }
                .module-toggle.open                 { transform: rotate(180deg); }


                .module-details                     { display: flex; flex-direction: column; align-items: center; width: 97%; gap: 30px; opacity: 100%; transition: all 0.2s ease; }
                .module-details.edit-mode           { gap: 0px; }

            `;
                



            // MARK: -UNCLASSIFIED SECTION
            styles += `

                .unclassified-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; transition: height 0.2s ease; }
                .unclassified-content   { display: flex; flex-direction: column; align-items: center; gap: 25px; width: 99%; height: 100%; }
                .unclassified-title     { display: flex; align-items: center; gap: 8px; width: 97%; font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; }
            `;
                



            //#region -SUBJECT CARDS .....................................
                styles += `

                    .subject-card               { display: flex; flex-direction: column; justify-content: space-between; align-items: center; width: 100%; height: 100%; min-height: 70px; position: relative; border-radius: 20px; outline: 4px solid #ffffffff; opacity: 100%; overflow: clip; transition: outline-color 0.3s ease, transform 0.3s ease, all 0.2s ease; }
                    .subject-card.detailed      { }
                    .subject-card.compact       { }
                    .subject-card.scroll-to     { transform: scale(102%); outline-color: #5f77ff; border-color: #5f77ff; }

                    .subject-card.good                  { box-shadow: 0px 0px 0px 0px  #39ff8f; background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                    .subject-card.good:hover            { box-shadow: 0px 0px 13px 5px #39ff8f; }
                    .subject-card.meh                   { box-shadow: 0px 0px 0px 0px  #fff27b; background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                    .subject-card.meh:hover             { box-shadow: 0px 0px 13px 5px #fff27b; }
                    .subject-card.bad                   { box-shadow: 0px 0px 0px 0px  #ff7b7b; background: linear-gradient(300deg, #fef2f2 30%, transparent); }
                    .subject-card.bad:hover             { box-shadow: 0px 0px 13px 5px #ff7b7b; }
                    .subject-card.unknown               { box-shadow: 0px 0px 0px 0px  #6d6d6d; background: linear-gradient(300deg, #c5c5c5 30%, transparent); }
                    .subject-card.unknown:hover         { box-shadow: 0px 0px 13px 5px #6d6d6d; }
                    
                    .subject-card-header        { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; min-height: 70px; border-radius: 20px 20px 0px 0px; outline: 4px solid white; padding: 5px 11px; font-weight:700; font-size: 15px; vertical-align: top; cursor: pointer; z-index: 1; transition: all 0.2s ease; }
                    .subject-card-header.compact    { border-radius: 20px; }
                    .subject-card-header.good       { background: linear-gradient(300deg, #e3ffeb 30%, transparent); }
                    .subject-card-header.meh        { background: linear-gradient(300deg, #ffe8d0 30%, transparent); }
                    .subject-card-header.bad        { background: linear-gradient(300deg, #ffe0e0 30%, transparent); }
                    .subject-card-header.unknown    { background: linear-gradient(300deg, #b8b8b8 30%, transparent); }

                    .subject-card-header-left-side          { display: flex; justify-content: flex-start; align-items: center; gap: 8px; width: 50%; height: 100%; text-wrap-mode: nowrap; }
                    .subject-card-header-left-side-text     { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; padding-left: 20px; width: 95%; height: 100%; text-wrap-mode: nowrap; }
                    .subject-card-header-left-side-text.edit    { padding-left: 0; }
                    .subject-card-header-grades-details         { opacity: 0%; transition: all 0.2s ease; }
                    .subject-card-header-grades-details.show    { opacity: 100%; }
                    .subject-name                   { font-weight: 800; color: #1a1a1a; font-size: 16px }
                    .subject-name.input             { font-weight: 800; color: #1a1a1a; font-size: 16px; border: 2px solid #797979; border-radius: 15px; padding-left: 8px; width: calc(100% + 10px); height: 25px;}
                    .subject-coef-input-box         { padding-left: 5px; width: 48px; border-radius: 8px; }

                    .subject-total-coef-div        { display: flex; flex-direction: column; gap: 4px; text-align: left; width: 0; font-size: 13px; text-wrap-mode: nowrap; opacity: 100%; transition: all 0.1s ease; }
                    .subject-total-coef-value      { display: flex; gap: 15px; text-align: left; font-weight: 600; gap: 8px; }
                    .subject-total-coef-debug      { display: flex; gap: 15px; text-align: left; font-weight: 400; }
                    .subject-insert-field                           { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
                    .subject-insert-field.show                      { height: 50px; margin: 10px 0px; }
                    
                    .subject-card-header-right-side    { display: flex; justify-content: flex-end; align-items: center; width: 0; height: 100%; gap: 4px; font-size: 17px; text-wrap-mode: nowrap; }
                    .subj-average           { display: flex; justify-content: flex-end; padding-right: 20px; font-size: 24px; font-weight: 800; text-wrap-mode: nowrap; transition: all 0.2s ease; }
                    .subj-average.good      { color: #10b981; }
                    .subj-average.bad       { color: #ef4444; }
                    .subject-delete-btn     { border-radius: 14px; background: transparent; margin: 0; text-transform: none; -webkit-appearance: button; font: 1em Arial,Helvetica,Verdana,sans-serif; width: auto; padding: 5px; overflow: visible; cursor: pointer; color: #34404F; text-shadow: none; font-weight: normal; border: 3px solid; border-color: white; transition: all 0.2s ease; } 


                    .selected-card-notif-container              { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; right: 10px; z-index: 301; transition: width 0.3s ease; }
                    .selected-card-notif-div                    { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
                    .selected-card-notif-div.on                 { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
                    .selected-card-notif-div-scroll-btn         { font-size: 20px; line-height: 21px; height: 20px; user-select: none; cursor: alias; transition: color 0.2s ease; }
                    .selected-card-notif-div-scroll-btn:hover   { color: white; }
                    .selected-card-notif-div-del-btn            { color: #640000; font-size: 20px; line-height: 17px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
                    .selected-card-notif-div-del-btn:hover      { color: #ffffff; }
                `;
                    



                // MARK: grades table
                styles += `

                    .grades-table                        { background: linear-gradient(300deg, #c5c5c5 30%, transparent); width: 98%; margin-top: 4px; transition: all 0.2s ease; }
                    .grades-table.good                   { background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                    .grades-table.meh                    { background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                    .grades-table.bad                    { background: linear-gradient(300deg, #fef2f2 30%, transparent); }

                    .grade-row                           { border-bottom: 1px solid white /* #e4e4e4 */; height: 40px; transition: background 0.3s ease; }
                    .grade-row.last                      { border-bottom: none; }
                    .grade-row.sim                       { background: #e9efff9a; }
                    .grade-row:hover                     { background: #eeedfd; }


                    .grades-table th                     { padding: 10px 12px; height: 39px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border: 3px solid white; border-right-width: 2px; border-left-width: 2px; border-top-width: 0px; text-align: center; text-wrap-mode: nowrap; }
                    .grades-table td                     { padding: 10px; font-size: 14px; max-height: 45px; min-height: 40px; text-wrap-mode: nowrap; }

                    .grades-table-header-type               { width: 30%; }
                    .grades-table-header-type.dragging      { width: 30%; }
                    .grades-table-type                   { padding-left:30px; transition: all 0.2s ease; }

                    .grades-table-header-grade              { width: 13%; }
                    .grades-table-header-grade.dragging     { width: 15%; }
                    .grades-table-grade                  { text-align: right; transition: all 0.2s ease; }

                    .grades-table-header-coef               { width: 10%; }
                    .grades-table-header-coef.dragging      { width: 15%; }
                    .grades-table-coef                   { text-align: right; transition: all 0.2s ease; }

                    .grades-table-header-classAvg           { width: 10%; }
                    .grades-table-header-classAvg.dragging  { width: 15%; }
                    .grades-table-classAvg               { text-align: right; transition: all 0.2s ease; }

                    .grades-table-header-date               { width: 10%; }
                    .grades-table-header-date.dragging      {  }
                    .grades-table-date                   { text-align: right; transition: all 0.2s ease; }

                    .grades-table-header-teacher            { width: 32%; }
                    .grades-table-header-teacher.dragging   { color: transparent; border-right-width: 0px; }
                    .grades-table-teacher                { text-align: end;   transition: all 0.2s ease; display: table-cell; font-size:12px;color: #999; }

                    .grades-table-header-add-sim-cell       { width: 0%; }
                    .grades-table-add-sim-cell           { transition: all 0.2s ease; }


                    .grade-row-unsorted-grades           { background: unset; border-bottom: 1px solid white; transition: background 0.3s ease; height: 39px; }
                    .grade-row-unsorted-grades:hover     { background: #c9d8e7ff; }
                    .grade-row-unsorted-grades.last      { border-bottom: none; height: 41px; }

                    .grade-type      { font-size: 12px; color: #666; margin-top: 2px; }
                    .grade-value     { font-weight: 600; font-size: 16px; }
                    .grade-good      { color: #10b981; }
                    .grade-medium    { color: #f59e0b; }
                    .grade-bad       { color: #ef4444; }
                    .grade-date      { font-size: 12px; color: #999; }

                    .subject-sim-del-btn        { border: 1px solid #A7CEDF; border-radius: 6px; cursor: pointer; }
                    .sim-add-btn                { display: flex; align-items: center; justify-content: center; height: 25px; width: 67px; max-width: 140px; margin-bottom: 0; padding: 6px 10px; border: 1px solid; border-radius: 15px; user-select: none; }
                    .simulated-grade-input         { border-radius: 10px; border: 1px outset #667eea; padding: 2px 10px}
                    .simulated-grade-input.sim-inp-type    { width: 55%;  max-width:250px; height:25px }
                    .simulated-grade-input.sim-inp-grade    { width: 100%; max-width:75px;  height:25px }
                    .simulated-grade-input.sim-inp-coef    { width: 100%; max-width:60px;  height:25px }
                    .simulated-grade-input.sim-inp-date    { width: 100%; max-width:140px; height:25px }
                    .simulated-grade-input-edit    { border-radius: 10px; border-color: #667eea; padding: 2px 10px; color: inherit; }
                    .grade-sim-del-btn           { border: none; border-radius: 6px; cursor: pointer; }
                    .grade-checkbox  { cursor: pointer; }
                `;
                


                // MARK: icons
                styles += `

                    .fold-icon  { cursor: pointer; user-select: none; }

                    .drag-icon                  { display: flex; justify-content: center; align-items: center; border: 2px solid; color: black; border-radius: 8px; line-height: 0px; cursor: pointer; user-select: none; transition: all 0.2s ease; }
                    .drag-icon:hover            { color: #a1a1a1; }
                    .drag-icon.subject              { width: 25px; height: 25px; font-size: 17px; }
                    .drag-icon.module               { width: 30px; height: 30px; font-size: 26px; font-weight: 600; }

                    .tick-icon          { height: 30px; width: 30px; font-size: 35px; line-height: 28px; color: #004cff; cursor:pointer; user-select:none; transition: all 0.2s ease; }
                    .tick-icon.subject  { height: 27px; width: 27px; }
                    .tick-icon.module   {  }
                    .tick-icon:hover    { color: #89adff; }
                `;
            

                // MARK: .................................................................
            //#endregion
            




            
            // MARK: _________________________________________
        //#endregion
            

            





        //#region -_____ HIGHEST INSTANCE STYLES _____




        
            // MARK: Animations
            styles += `

                /* @media (max-width: 768px)   {
                    #dash-header { flex-direction:column; align-items:start; gap:16px; } 
                    .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } 
                } */

                .loading            { text-align: center; padding: 40px; color: #999; }
                @keyframes dots     { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
                .loading::after     { content: '...'; animation: dots 1.5s steps(4, end) infinite; }

                @keyframes fadeIn   { from { opacity: 0%; transform: translateY(10px); } to { opacity: 100%; transform: translateY(0); } }
                .fade-in            { animation: fadeIn 0.3s ease; }

                @keyframes scrollTo { 15% {transform: scale(100%);} 100% {transform: scale(102%); outline-color: #5f77ff; border-color: #5f77ff} }

                @keyframes slightHorizShake { 0% {left: 0px} 25% {left: 3px} 50% {left: -3px} 75% {left: 3px} 100% {left: 0px} }
                .slight-horiz-shake { animation: var(--slight-horiz-shake-duration, 0.3s) slightHorizShake ease; }

                @keyframes infiniteAlternateScaleUp     { from {transform: scale(100%)} to {transform: scale(var(--infinite-alternate-scale-up-scale, 110%))} }
                .infinite-alternate-scale-up    { animation: infiniteAlternateScaleUp var(--infinite-alternate-scale-up-duration, 1s) alternate infinite ease-in-out; }

                @keyframes hoveringElem  { from { transform: translateY(0px); } to { transform: translateY(var(--hoveringElem-amp, 20px)); } }
            `;


            // MARK: Modal
            styles += `
            
                .modal  { --bg-end-color: white; --bg-start-color: #ffffff61; --bg-start-gradient: 20%; --scrollbar-thumb-color: #888; --scrollbar-thumb-color-hover: #555; max-width: min(var(--modal-max-width, 100%), 100%); max-height: min(var(--modal-max-height, 100%), 100%); transform: translateZ(0) scale(110%); border-radius: 20px; border: 0px solid #ffffff; background: radial-gradient(closest-corner, var(--bg-start-color) var(--bg-start-gradient), var(--bg-end-color)); opacity: 0%; transition: all 0.3s ease; }
                .modal.blur { backdrop-filter: blur(calc(250px / 100)); }
                .modal.show { border-width: 8px; transform: translateZ(0) scale(100%); opacity: 100%; }

                .modal-close-btn-container { width: var(--modal-close-btn-container-size); height: var(--modal-close-btn-container-size); font-size: 20px; user-select: none; cursor: pointer; transition: all 0.2s ease; }
                .modal-close-btn-container:hover { transform: scale(var(--modal-close-btn-container-transform-scale-hover)) }
                .modal-close-btn           { display: flex; justify-content: center; align-items: center; transition: all 0.2s ease; }
                .modal-close-btn.hover      { font-size: 30px; }
                .modal-close-btn-cross          { stroke: var(--cross-color);        stroke-width: var(--cross-thickness);        stroke-linecap: var(--cross-stroke-linecap); d: path(var(--cross-path)); fill: none; }
                .modal-close-btn-cross.hover    { stroke: var(--cross-color-hover);  stroke-width: var(--cross-thickness-hover);  stroke-linecap: var(--cross-stroke-linecap-hover); d: path(var(--cross-path-hover)); }
                .modal-close-btn-circle         { stroke: var(--border-color);       stroke-width: var(--border-thickness);       r: calc(var(--border-radius) - var(--border-thickness)); fill: none; }
                .modal-close-btn-circle.hover   { stroke: var(--border-color-hover); stroke-width: var(--border-thickness-hover); r: calc(var(--border-radius-hover) - var(--border-thickness-hover)); }

            `;


            // MARK: Fonts
            styles += `
                .jura {
                    font-family: "Jura", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 500;
                    font-style: normal;
                }

            `;


            // MARK: Scroll bar
            styles += `
                /* width */
                ::-webkit-scrollbar {
                    width: var(--scrollbar-width, 10px);
                }

                /* Track */
                ::-webkit-scrollbar-track {
                    background: var(--scrollbar-track-color, #ddcdff);
                    border-radius: 170px;
                }

                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background: var(--scrollbar-thumb-color, #616bff);
                    border-radius: 100px;
                }

                /* Handle on hover */
                ::-webkit-scrollbar-thumb:hover {
                    background: var(--scrollbar-thumb-color-hover, #9fa6ff);
                }
            `;

        //#endregion



    //#endregion
    
    
    
    
    
    // MARK:  ——————————————————
    //#endregion






    //#region init css
        // Initializing the CSS style and checking for error before creating the dashboard
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        
        document.head.appendChild(styleSheet);
        
        const error = 
        (window.location.pathname == "/c/portal/login" && window.location.search.match(/redirect/) ? "servers are down" : undefined) 
        || 
        (window.location.pathname != "/group/education/notes" ? "not in grades" : undefined) 
        || 
        false
        ;

    //#endregion





    //#region Dashboard launch

        if (!error) {
            window.onload = () => { 

                const greyGridTable = document.querySelector(".greyGridTable");
                const intranetFold = document.createElement("div");
                intranetFold.className = "intranet-fold";
                intranetFold.innerHTML = `
                    <div class="intranet-text">
                        <div class="intranet-toggle fold-icon">△</div>
                        <div class="semester-name jura"> 
                            <div class="intranet-subtext"></div>
                        </div>
                        <div class="intranet-toggle fold-icon">△</div>
                    </div>
                `;
                document.querySelector("#currentNote").insertBefore(intranetFold, greyGridTable);

                intranetFold.onclick = (e) => {
                    const header            = e.target.closest('.intranet-fold');
                    const intranetTable     = document.querySelector('.greyGridTable');
                    const intranetToggle    = header.querySelectorAll('.intranet-toggle');

                    intranetToggle.forEach(t => {
                        if (t.previousElementSibling == null){
                            t.classList.toggle('openLeft')
                        } else {
                            t.classList.toggle('openRight');
                        }
                    });

                    if (intranetTable.style.display == 'none') {
                        intranetTable.style.display = 'block';
                    } else {
                        intranetTable.style.display = 'none';
                    }
                }

                greyGridTable.style.display = "none";
                
                ecamDash = new ECAMDashboard(error); 
            };
        }
        else if (error == "servers are down") {
            document.body.style.background = "#a1a1a1";
            
            ecamDash = new ECAMDashboard(error);
        }
        else {
            console.log("Looking somewhere else than in the grades: only showing the \"Notes\" button in the dockbar");
            window.onload = () => {
                const notes = document.createElement("li");
                notes.className = "private-community";
                notes.title     = "Notes";
                notes.innerHTML = `<a href="/group/education/notes"><span class="site-name">Notes</span></a>`;

                const shortcutsBar = document.querySelector("#ecam-place-menu");
                shortcutsBar.querySelector(".taglib-my-places").appendChild(notes);
            }
        }

    //#endregion


}) //()