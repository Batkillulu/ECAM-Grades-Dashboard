// ==UserScript==
// @name         ECAM Grades Dashboard
// @version      2.5.5
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @author       Baptiste JACQUIN
// @match        https://espace.ecam.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecam.fr
// @grant        none
// @run-at       document-end
// @license      AGPL-3.0; Commercial license available
// ==/UserScript==
// 
// 
// 
// 
// 
// ========================================================================= HI, FELLOW CODER! =========================================================================
// 
// If you're trying to get a look at this script and are on VSCode, I suggest you:
// - enable your minimap                                        (Settings > Text Editor > Minimap: Enabled => checked)                      
// - keep your minimap displayed at all time                    (Settings > Text Editor > Minimap: Autohide => none)                        
// - set its max width to 200                                   (Settings > Text Editor > Minimap: Max Column => 200)                       
// - set its font size to 10                                    (Settings > Text Editor > Minimap: Section Header Font Size => 10)          
// - set its letter spacing to 0.5                              (Settings > Text Editor > Minimap: Section Header Letter Spacing => 0.5)    
// - make sure you enabled the mark section headers             (Settings > Text Editor > Minimap: Show Mark Section Headers => checked)    
// - make sure you enabled the region section headers as well   (Settings > Text Editor > Minimap: Show Region Section Headers => checked)  
// - and finally make sure to keep its size proportional        (Settings > Text Editor > Minimap: Size => proportional)                    (Right click on minimap > Vertical Size > Proportional)
// - [OPTIONALLY] enabled "render characters"                   (Settings > Text Editor > Minimap: Render Characters => checked)            (Right click on minimap > Render Characters)
//      (rendering the characters shortens the height of rows in the minimap, I prefer it like that since this script is quite long)
// 
// I've done a bit of styling intended for the minimap with the parameters I gave above, and it should make your reverse-engineering experience much easier!
// Optimal display when the side bar is closed
// 
// 
// Link for backup test: https://espace.ecam.fr/c/portal/login?redirect=%2Fgroup%2Feducation%2Fnotes&p_l_id=0&ticket=ST-113179-sbwjXieT3GLY9T3fXdsmFp9vCro-tomcat03
// (trying to access espace.ecam.fr wields a link of this sort. It doesn't seem to have a "unique" token or a time limited access, so this link should work for anyone)
// 
// =====================================================================================================================================================================
//
// 
// 
// 
// Copyright (C) 2026 Baptiste Jaquin & Maxence Leroux
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, version 3.
//
// Free for individual student use.
// Institutional or official use requires a commercial license.
// 
// Don't hesitate to contact us, at either:
//  - baptiste.jacquin@ecam.fr  [more for the coding part]
//  - maxence.leroux@ecam.fr    [more for the financial and responsibility part]
// 

(function() {

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
				

				.backup-mode-title    { display: flex; justify-content: center; align-items: center; text-align: center; height: 60px; font-size: 50px; letter-spacing: 0.23em; font-family: "Rubik Glitch", system-ui; opacity: 0; transition: all 1s ease; }
				.backup-mode-title.show    { opacity: 1; }
				.backup-mode-subtitle { display: flex; justify-content: center; align-items: center; text-align: center; font-size: 17px; margin-bottom: 30px; opacity: 0; transition: all 1s ease; }
				.backup-mode-subtitle.show { opacity: 1; }

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


			//MARK: help and tutorial
			styles += `
				.tuto-tip-notif-container   { display: flex; justify-content: center; align-items: center; position: relative; width: 0; height: 0; z-index: 10; opacity: 0; transform: scale(110%); --infinite-alternate-scale-up-scale: 100%; transition: all 0.3s ease;}
				.tuto-tip-notif         { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 15px; padding: 20px; background: linear-gradient( #5334ff 0%, #7a62ff 100%); border-radius: 7px; outline: 5px solid; color: white; font-size: 31px; line-height: 31px; text-align: center; --hoveringElem-amp: 10px; animation: focusBlinkAnimation 2s infinite alternate ease-in-out, hoveringElem 2s infinite alternate ease-in-out; transition: all 0.3s ease; }
				.tuto-tip-notif:hover   { animation-play-state: running, paused; }
				@keyframes focusBlinkAnimation  { from { filter: brightness(1); } to { filter: brightness(1.5) } }

				.skip-tuto-btn          { display: flex; justify-content: center; align-items: center; padding: 10px; position: fixed; top: 20px; right: 20px; background: #4c84fde8; border-radius: 10px; color: white; font-size: 20px; text-decoration: underline; cursor: pointer; opacity: 0; z-index: 5000; transition: all 0.5s ease; }
				.skip-tuto-btn::before      { content: "Skip tutorial"; }
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
				.filter-tab:hover   { background: white; color: #333333ff; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(1.1); }
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
				.content-area { display: grid; gap: 24px; width: 100%; }
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

				.semester-grid      { display: grid; width: 100%; gap: 20px; transition: gap 0.2s ease; }
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

				.module-card-header-right-side  { display: flex; justify-content: flex-end; align-items: center; width: 20%; gap: 6px; font-size: 19px; font-weight: 600; }
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

					.subject-card               { display: flex; flex-direction: column; justify-content: space-between; align-items: center; width: 100%; height: 100%; position: relative; border-radius: 20px; outline: 4px solid #ffffffff; opacity: 100%; overflow: clip; transition: outline-color 0.3s ease, transform 0.3s ease, all 0.2s ease; }
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
					.sim-add-btn                { display: flex; align-items: center; justify-content: center; height: 25px; width: 67px; max-width: 140px; padding: 6px 10px; border: 1px solid; border-radius: 15px; user-select: none; }
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





	//MARK: ——————————————————
	;



	//MARK: ECAMDashboard ——————————
	class ECAMDashboard {




		// MARK: ___________ — contructor — ___________
		constructor(error) {
			this.ecamDash = document.createElement("div");

			// IMPORTANT: SCRIPT VERSION, UPDATE IT FOR EVERY UPDATE, SHOULD MATCH THE USERSCRIPT HEADER'S VERSION NUMBER
			this.scriptVersion = "2.5.5";
			this.scriptGitVersion = "1.0.0";
			this.configVersion = 3;
			this.error = error; // test in error mode at this link: https://espace.ecam.fr/c/portal/login?redirect=%2Fgroup%2Feducation%2Fnotes&p_l_id=0&ticket=ST-113179-sbwjXieT3GLY9T3fXdsmFp9vCro-tomcat03


			//#region Settings

				this.settings = {

					displayClassAvg: {
						name: () => !this.langIsEn 
							? "Moyenne de classe de modules et matières" 
							: "Class average for modules and subjects"
						,
						description: () => !this.langIsEn 
							? "Afficher les moyennes de classe pour les matières, modules et semestres, pour les étudiants avec un esprit de compétition :D" 
							: "Display the class averages for subjects, modules and semesters, for students with high competitive spirit :D"
						,
						info: () => !this.langIsEn 
							? "" 
							: ""
						,
						value: JSON.parse( JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SETTINGS"))?.displayClassAvg?.value?.toString() || "true"),
						action: () => {
							document.querySelectorAll(".semester-class-average, .semester-class-average-vs-average, .module-class-average, .module-class-average-vs-average, .subj-class-average,  .subj-class-average-vs-average").forEach(elem => {
								elem.style.display = this.settings.displayClassAvg.value ? "" : "none";
							})
							this.saveSettings(); 
						},
						parents:  [],
						children: [],
					},

					totalCoefValuesEnabled: {
						name: () => !this.langIsEn 
							? "Afficher les coefs totaux" 
							: "Display total coefs"
						,
						description: () => !this.langIsEn 
							? "Afficher les coefficients totaux pour les cartes de matière et de module" 
							: "Display the total coefficients for subject and module cards"
						,
						info: () => !this.langIsEn 
							? "Le.s pourcentage.s apparraissant entre le nom des modules/sujets et leur moyenne" 
							: "The percentage.s showing up between the name of modules/subjects and their average"
						,
						value: JSON.parse( JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SETTINGS"))?.totalCoefValuesEnabled?.value?.toString() || "true"),
						action: () => {
							document.querySelectorAll(".module-subject-total-coef-value, .subject-total-coef-value").forEach(elem => {if (this.settings.totalCoefValuesEnabled.value) {elem.style.display = "";} else {elem.style.display = "none";}});
							this.saveSettings();
						},
						parents:  [],
						children: [],
					},

					totalCoefDebugTextsEnabled: {
						name: () => !this.langIsEn 
							? "Afficher les textes d'aide" 
							: "Display the helper texts"
						,
						description: () => !this.langIsEn 
							? "Afficher les textes d'aide des cartes de sujet et de module" 
							: "Display the helper texts for subject and module cards"
						,
						info: () => !this.langIsEn 
							? "Il s'agit simplement des textes interprétant les nombres des \"Coef Total des Matières\" et \"Coef Total des Notes\"" 
							: "It simply corresponds to the texts interpreting the numbers of \"Total Subjects Coef\" and \"Total Grades Coef\""
						,
						value: JSON.parse( JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SETTINGS"))?.totalCoefDebugTextsEnabled?.value?.toString() || "true"),
						action: () => {
							document.querySelectorAll(".module-subject-total-coef-debug, .subject-total-coef-debug").forEach(elem => {if (this.settings.totalCoefDebugTextsEnabled.value) {elem.style.display = "";} else {elem.style.display = "none";}});
							this.saveSettings();
						},
						parents:  [],
						children: [],
					},

					blurEnabled: {
						name: () => !this.langIsEn 
							? "Activer le flou" 
							: "Enable blur"
						,
						description: () => !this.langIsEn 
							? "Activer le flou qui s'opère sur le fond des fenêtres (activé par défaut parce que je trouve ça joli :D)" 
							: "Enable the blur that operates on the background of the windows (turned on by default because I find it nice :D)"
						,
						info: () => !this.langIsEn 
							? "Non recommendé pour les appareils à basses performances" 
							: "Not recommended for low-end devices"
						,
						value: JSON.parse( JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SETTINGS"))?.blurEnabled?.value?.toString() || "true"),
						action: () => {
							document.querySelectorAll(".modal, .loading-symbol").forEach(elem => {if (this.settings.blurEnabled.value) {elem.classList.add("blur")} else {elem.classList.remove("blur")}});
							this.saveSettings();
						},
						parents:  [],
						children: [],
					},

					scrollHelpersEnabled: {
						name: () => !this.langIsEn 
							? "Aides au défilement" 
							: "Scroll helpers"
						,
						description: () => !this.langIsEn 
							? "Activer l'aide au défilement pour suivre les éléments importants à l'écran lors de changements de verticalité. Désactive-la si tu n'aimes pas avoir ces défilements forcés" 
							: "Enable the scroll helpers to follow the important elements on screen upon verticality changes. Disabled it if you don't like these forced scrolls"
						,
						info: () => !this.langIsEn 
							? "Certaines actions (changement de mode d'édition, changement entre vue détaillée/compacte...) font changer la position verical de certains éléments (cartes de module/matière, entre autres), donc un défilement est prévu pour maintenir certains éléments dans l'affichage" 
							: "Some actions (edit mode change, detailed/compact view mode change...) change the vertical position of some elements (i.e. module/subject cards), so this setting allows to scroll to keep the most important elements on screen"
						,
						value: JSON.parse( JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SETTINGS"))?.scrollHelpersEnabled?.value?.toString() || "true"),
						action: () => { this.saveSettings(); },
						parents:  [],
						children: [],
					},
				};
				this.keybinds = [
					{
						text: () => {return !this.langIsEn ? "Fermer la fenêtre" : "Close the window"}, 
						keys: () => {return !this.langIsEn ? "Échap" : "Escape"},
					},
					{
						text: () => {return !this.langIsEn ? "Plier/Déplier tous les modules (basculer)" : "Fold/Unfold all modules (toggle)"}, 
						keys: () => {return !this.langIsEn ? "Maj + F" : "Shift + F"},
					},
					{
						text: () => {return !this.langIsEn ? "Vue détaillée/compacte pour toutes les matières (basculer)" : "Detailed/Compact view all subjects (toggle)"}, 
						keys: () => {return !this.langIsEn ? "Maj + D" : "Shift + D"},
					},
					{
						text: () => {return !this.langIsEn ? "Mode édition (basculer)" : "Edit mode (toggle)"}, 
						keys: () => {return !this.langIsEn ? "Maj + E" : "Shift + E"},
					},
					{
						text: () => {return !this.langIsEn ? "Langue français/anglais (basculer)" : "Language French/English (toggle)"}, 
						keys: () => {return !this.langIsEn ? "Maj + L" : "Shift + L"},
					},
					{
						text: () => {return !this.langIsEn ? "Changer de semestre (cycle)" : "Change semester (cycle)"}, 
						keys: () => {return !this.langIsEn ? "Maj + ←/→" : "Shift + ←/→"},
					},
				];

				this.moduleConfig           = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_MODULE_CONFIG"))                 || {};

			//#endregion




			//#region Time

				this.today      = new Date().toISOString().split('T')[0];                                                   // Current date in ISO String
				this.now        = () => {return new Date().toISOString().replace(/\.(\d{3})/, "")};                         // Current date and time in ISO String, removing the milliseconds
				this.dateHour   = () => {return new Date().toISOString().replace(/\:\d{2}\:\d{2}\.(\d{3})Z/, ":00:00Z")};   // Current date and time in ISO String, rounded down to the hour
				this.dateTimeOfLastUpdateCheck          = localStorage.getItem("ECAM_DASHBOARD_DATE_TIME_OF_LAST_UPDATE_CHECK") || "2000-00-00T00:00:00Z"; // A day before the date of last update, so that the update check is ran to make sure the correct version is installed
				this.checkForUpdate                     = localStorage.getItem("ECAM_DASHBOARD_CHECK_FOR_UPDATE")               || false;
				this.firstLoad              = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_FIRST_LOAD")                     || "true");
				this.updateFirstLoad        = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_UPDATE_FIRST_LOAD") || JSON.stringify({state: true, v: this.scriptVersion}));
				
			//#endregion




			//#region Grades

				this.grades     = [];
				this.semesters  = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};
				this.savedReadGrades        = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"))             || [];
				this.sim                    = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES"))                    || {};
				this.newGrades = [];
			
				this.disabledGrades         = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES"))               || [];
				this.gradesDatas = {};
			
			//#endregion




			//#region Repo
				
				this.repoUserReportIssue        = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=user-report-issue-template.md";
				this.repoUserSuggestionIssue    = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=feature-improvement-request-template.md";
				this.repoUserConfigShare        = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=share-config-template.md";
				this.repoReadMeHowToUse         = "https://github.com/Batkillulu/ECAM-Grades-Dashboard?tab=readme-ov-file#how-to-use-quick-start"
				this.repoContentsAPI            = "https://api.github.com/repos/Batkillulu/ECAM-Grades-Dashboard/contents";
				this.repoScriptRaw              = "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js";
				this.patchNotes                 = `https://github.com/Batkillulu/ECAM-Grades-Dashboard/blob/v${this.scriptVersion}/CHANGELOG.md`;
			
				this.gitFetchScanDoneArray = [];
				this.tempGitConfigParentDirData = {};
				this.onlineConfigs          = (localStorage.getItem("ECAM_DASHBOARD_ONLINE_CONFIGS") != "[object Object]" ? JSON.parse( localStorage.getItem("ECAM_DASHBOARD_ONLINE_CONFIGS")) : undefined)
				|| {
					Configs: {
						EENG:   {
							EENG1: {},
							EENG2: {},
							EENG3: {
								P2028: {
									Energy:      "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/Configs/EENG/EENG3/P2028/EENG3%20-%20P2028%20-%20Energy.json",
									Mecha:       "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/Configs/EENG/EENG3/P2028/EENG3%20-%20P2028%20-%20Mecha.json",
									Robotics:    "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/Configs/EENG/EENG3/P2028/EENG3%20-%20P2028%20-%20Robotics.json",
									SupplyChain: "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/Configs/EENG/EENG3/P2028/EENG3%20-%20P2028%20-%20SupplyChain.json",
									path: "Configs/EENG/EENG3/P2028",
									nbCfgs: 4, 
								},
								path: "Configs/EENG/EENG3",
								nbCfgs: 4, 
							},
							EENG4: {},
							EENG5: {},
							path: "Configs/EENG",
							nbCfgs: 4, 
						},
						AM:     {}, 
						path: "Configs",
						nbCfgs: 4,
					},
					nbCfgs: 4,
					date: "0000-00-00T00:00:00Z",
				};
			
			//#endregion




			//#region Display

				this.currentSemester                    = localStorage.getItem("ECAM_DASHBOARD_SEMESTER_FILTER")                || "all";

				this.viewMode                           = localStorage.getItem("ECAM_DASHBOARD_VIEW_MODE")                      || "detailed";

				this.lang                   =             localStorage.getItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE")               || "en";
				this.langIsEn               = this.lang == "en";
				this.editMode               = JSON.parse( localStorage.getItem('ECAM_DASHBOARD_DEFAULT_EDIT_MODE')              || "false");
				this.timeouts = {};

				this.mobileVer = this.clientWidth <= 935;
				this.clientWidth = 1920;

			//#endregion




			//#region temp/internal data assessment

				this.selectedSubjectCardsId = [];
				this.selectedSubjectCardsSortedByModule = {};
				this.selectedModuleCardsId = [];

				this.compactSubjCardsId = [];
				this.detailedSubjCardsId = [];

				this.foldedModuleCardsId = [];
				
				this.scrollToThisElem = "";

			//#endregion

			this.init();
		}




		// MARK: _____________ —  INIT  — ______________
		init() {
			if (!error) {
				const notes = document.createElement("li");
				notes.className = "private-community current-site";
				notes.title     = "Notes";
				notes.innerHTML = `<a href="/group/education/notes"><span class="site-name">Notes</span></a>`;

				const shortcutsBar = document.querySelector("#ecam-place-menu");
				const scolarite = shortcutsBar.querySelector(".private-community.current-site");
				scolarite.classList.remove("current-site");
				shortcutsBar.querySelector(".taglib-my-places").appendChild(notes);
			}

			// Run an update check
			this.autoUpdateCheck();

			// Read the grades from the table and detect if there are new grades (compared with the last time the script was ran)
			this.parseGrades();

			// Sort all the grades read from the table into semesters, modules and subjects, and get datas from all levels (module average, subject average etc...)
			this.getGradesDatas();

			// Activate the general keyboard events
			this.generalKeyboardEvents("general");

			// Now that all the datas are acquired, create the dashboard
			this.createDashboard();

			// Trigger the first load notifications to show some help to learn how to use the extension
			this.firstLoadEvent();

			// Trigget the update's first load events
			if (this.updateFirstLoad.state && this.updateFirstLoad.v == this.scriptVersion) {this.updateFirstLoadEvent();}
		}




		//#region _______ — General methods — ________






			//#region General HTML methods





				// MARK: scrollToClientHighestElem
				/**
				* Scroll to an element depending on the target element datas passed as argument under the form of an object. If using the className method and not the id method, please make sure the elements of class className are in column.
				* 
				* Priority order defined by parameter `priority`. Scan through all the given classNames. If no match is found on a className: 
				* - **"first"**:  
				* **moves onto the next one**. The method will scroll to the **first** data matching the conditions, and skip the rest.
				* - **"last"**:  
				* **skip the rest**. The method will scroll to the **last** data matching the conditions, and skip the rest. If no match is found at all, doesn't scroll.
				* 
				* Behavior changes along with **`highestElemInPageHandleType`**'s value. Scan through all target element datas given, and (with X being an int between 0 and 100):
				* - **"none"**:                   
				* scroll to the first      element -                        *out of all the others* - (who's class name matches the `targetElementDatas`'s property `className`) **SUCH THAT** it's the highest        element in the current window view whose center doesn't go out of the screen from the top.
				* - **"first/last above" / "first/last above X%"** (first is default if first/last isn't given):       
				* scroll to the first/last element -                        *out of all the others* - (who's class name matches the `targetElementDatas`'s property `className`) **SUCH THAT** it's the highest/lowest element in the current window view whose center doesn't go out of the screen from the top **AND** its center   is above X% (default 50%) of the screen **IF** the top edge of the **first** element - *and only the first, independantly of the first/last parameter* - of same class is above X% (default 50%) of the screen. *Typically useful to scroll to the first/last element of class className that is in-between the top of the window and the given percentage of the height of the window when there are multiple small elements that could satisfy these conditions*
				* - **"partial" / "partial X%"**:   
				* scroll to the first      element - *and ONLY the first*                           - (who's class name matches the `targetElementDatas`'s property `className`) **SUCH THAT** it's the highest        element in the current window view whose center doesn't go out of the screen from the top **AND** its top edge is above X% (default 50%) of the screen. *Typically useful if you want to scroll to the highest element of class className if its center is in-between the top of the screen and the given percentage of the height of the window*
				* - **"absolute" / "absolute X%"**:   
				* scroll to the first      element - *and ONLY the first*                           - (who's class name matches the `targetElementDatas`'s property `className`) **IFF** its top edge is above X% (default 50%) of the screen. *Typically useful if you want to scroll to the highest element of class className if its top edge is above the given percentage of the height of the window, without any regard whether it's above the top of screen or not*
				* - **"force"**:                       
				* scroll to the first      element - *and ONLY the first*                           - (who's class name matches the `targetElementDatas`'s property `className`). *No condition, just forces the scroll to the top of this element*
				* 
				* In any case, the scroll is executed (after the `timeout` property of the same `targetElementDatas`) with respects to the `margin` property of the same `targetElementDatas` (it will be attributed as `scrollMargin` style property of the element to scroll to)
				* 
				* @returns The element that was scrolled to, or null if no element was scrolled to
				* @param {String} priority             {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard String},  default: "first" — Defines how multiple `targetElementDatas` input are managed. Can be "first" or "last"
				* @param targetElementDatas Any amount of objects. If ommited, uses a default object. Objects should all have the following properties (if any is omitted, they are given their default value):
				* 
				* **`className?`**                     {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard String},  default: ".subject-card" —  
				*  Name of the class to target, if you want to target a category of elements
				* 
				* **`id?`**                            {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard String},  default: "" —              
				*  ID of the element to target, if you want to target a specific element (ensure your element has an ID tho)
				* 
				* **`margin?`**                        {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard Number},  default: 23 (in px) —      
				*  Used to define the scrollMargin CSS styles property of the element targeted
				* 
				* **`timeout?`**                       {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard Number},  default: 50 (in ms) —      
				*  Timer before the scroll action is triggered
				* 
				* **`smooth?`**                        {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard Boolean}, default: false —           
				*  If true, the page will smoothly scroll to the element targeted
				* 
				* **`highestElemInPageHandleType?`**   {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard String},  default: "none" —          
				*  Can be "force", "absolute", "absolute X%", "partial", "partial X%", "above", "above X%" or "none" (with X being an int between 0 and 100). Any other value will be considered as "none"
				* 
				* **`block?`**                         {@link https://github.com/Batkillulu/ECAM-Grades-Dashboard String},  default: "start" —         
				*  Can be "start", "center", "end" or "nearest". Any other value will be considered as "start". Defines what part of the element will be taken as reference to scroll to, taking the margin into account
				*/
				scrollToClientHighestElem(priority="first/setting-compliant", ...{className= "subject-card", id="", margin=this.editMode ? 100 : 25, timeout=20, smooth=false, highestElemInPageHandleType="none", block="start"}) {
					const defaultTargetElementDatas = [
						{className: "modules-section",      margin: 20,                        highestElemInPageHandleType:"partial"}, 
						{className: "module-card",          margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"above"},
						{className: "unclassified-section", margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"partial"},
						{className: "subject-card",         margin: 10,                        highestElemInPageHandleType:"above"},
					];

					// Error-proof for different invalid arguments inputs (no arguments given, targetElementData object given instead of priority, invalid targetElementData objects passed, priority given at the wrong spot...)
					let argumentsArray = []; 
					let effectivePriority, settingCompliance;
					(arguments?.length > 1 
						? Object.values(arguments).splice(1,Object.values(arguments).length) 
						: Object.values(arguments)
					).forEach((_obj, _index) => {
						// In case the first argument is the intendend priority argument:
						if (typeof _obj == "string" && _index == 0) { 
							effectivePriority = _obj;
							settingCompliance = (_obj.match(/setting-compliant|ignore-setting/)?.[0] || "setting-compliant") == "setting-compliant";
						}
						// In case the priority argument isn't given, but the rest of the objects are provided:
						else if (_obj instanceof Object && (_obj?.className || _obj?.id)) { 
							argumentsArray.push(_obj)
						}
					})

					if (argumentsArray.length == 0) {
						argumentsArray = defaultTargetElementDatas;
					}


					if (!effectivePriority) {
						effectivePriority = "first"; // in case priority wasn't given as argument
					}
					else {
						effectivePriority = priority?.split("/")?.[0]?.toLowerCase()?.trim(); // formatting priority correctly if it was given
						settingCompliance = priority?.split("/")?.[1]?.toLowerCase()?.trim() == "setting-compliant";
					}
					
					if (!effectivePriority?.match(/first|last/i)) {
						effectivePriority = "first";
					}


					if (settingCompliance !== true && settingCompliance !== false && !effectivePriority?.split("/")?.[1]?.toLowerCase()?.trim()) {
						settingCompliance = true;
					}
					else {
						settingCompliance = priority?.split("/")?.[1]?.toLowerCase()?.trim() == "setting-compliant";
					}

					if (settingCompliance !== true && settingCompliance !== false) {
						settingCompliance = true;
					}


					// Protecting the execution of the method behind the setting compliance check's state (if the setting is turned on, then it executes the if loop, and doesn't otherwise)
					if (this.settings?.scrollHelpersEnabled?.value || !settingCompliance) {
						const abovePattern    = /(first |last |)above( (\d{1,2}|100)%|)/i;
						const partialPattern  =              /partial( (\d{1,2}|100)%|)/i;
						const absolutePattern =             /absolute( (\d{1,2}|100)%|)/i;
						const highestElemInPageHandleTypePattern = RegExp("none|" + abovePattern.source + "|" + partialPattern.source + "|" + absolutePattern.source, "i");
						
						this.scrollToThisElem = ""; let targetDataIndex = -1;
						
						argumentsArray.forEach((targetElemData, targetIndex) => {
	
							if (    /* ensuring the priority order of the element of the first class className found */
								(//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
									(
										targetDataIndex < 0 
										&& (effectivePriority.toLowerCase()||"first") == "first"
									) 
									|| 
									(
										targetDataIndex == targetIndex-1 
										&& (effectivePriority.toLowerCase()||"first") == "last"
									)
								)//////////////////////////////////////////////////////////////////////////////////////////////////////
							) { 
								// ensuring that highestElemInPageHandleType has an expected value. Take it as "none" if that's not the case
								targetElemData.highestElemInPageHandleType = targetElemData?.highestElemInPageHandleType?.toLowerCase()?.trim() || highestElemInPageHandleType;
								if (targetElemData?.highestElemInPageHandleType?.match(highestElemInPageHandleTypePattern)?.[0] != targetElemData?.highestElemInPageHandleType) {
									targetElemData.highestElemInPageHandleType = "none";
									console.log(`The highestElemInPageHandleType given in the scrollToClientHighestElem method isn't of an expected value. Treating it as "none" instead.`)
								}
	
	
								if (targetElemData?.id=="" || !document.getElementById(targetElemData?.id || id)) { // If no id is given, or if the given id doesn't correspond to any item in the document:
	
									// getting the highest element of class className, as well as its top coordinate in the screen
									const highestElem                   = document.querySelector("." + (targetElemData?.className?.match(/(\.|)(.+)/)?.[2].replace(" ", ".") || className));
									const highestElemCoords             = highestElem?.getBoundingClientRect();
									const highestElemTopCoord           = highestElemCoords?.top;
									const highestElemTopCoordPercent    = 100 * highestElemTopCoord/window.innerHeight;
									const highestElemCenterCoord        = (highestElemCoords?.top + highestElemCoords?.bottom)/2;
									const highestElemCenterCoordPercent = 100 * highestElemCenterCoord/window.innerHeight;
	
									// if highestElemTopCoord < margin, then it means that the top of the highest element of class className has passed the top of the screen
									
									if ( // The highest AND ONLY THE HIGHEST elem case
										(//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
											/* Force case */
											targetElemData?.highestElemInPageHandleType?.toLowerCase() == "force"
											|| 
											( /* First Absolute case */
												targetElemData?.highestElemInPageHandleType?.match(absolutePattern)
												&& /* Checking if highestElemInPageHandleType starts with "last", because if it does, we just pass the highest elem case to scan through all the elem of class className to get the last elem satisfying the condition.s */
												targetElemData?.highestElemInPageHandleType?.match(absolutePattern)?.[1]?.trim() != "last"
	
												&& /* Is the top coordinate of the highest element of class className: */
												/* Above the required height (percentage of the total height)? */
												highestElemTopCoordPercent < (targetElemData?.highestElemInPageHandleType?.match(absolutePattern)?.[3] || 50)
											)
											|| 
											( /* First Partial case */
												targetElemData?.highestElemInPageHandleType?.match(partialPattern)
												&&  /* Checking if highestElemInPageHandleType starts with "last", because if it does, we just pass the highest elem case to scan through all the elem of class className to get the last elem satisfying the condition.s */
												targetElemData?.highestElemInPageHandleType?.match(partialPattern)?.[1]?.trim() != "last"
	
												&&  /* Is the top coordinate of the highest element of class className: */
												/* Above the required height (percentage of the total height)? */
												highestElemTopCoordPercent < (targetElemData?.highestElemInPageHandleType?.match(partialPattern)?.[3] || 50)
												&& 
												/* Below the top of the screen? */
												highestElemTopCoordPercent >= 0
											)
											||
											( /* First Above case */
												targetElemData?.highestElemInPageHandleType?.match(abovePattern)
												&& /* Checking if highestElemInPageHandleType starts with "last", because if it does, we just pass the highest elem case to scan through all the elem of class className to get the last elem satisfying the condition.s */
												targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[1]?.trim() != "last"
	
												&& /* Is the top coordinate of the highest element of class className: */
												/* Above the required height (percentage of the total height)? */
												highestElemTopCoordPercent < (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[3] || 50)
	
												&& /* Is the center coordinate of the highest element of class className: */
												/* Below the top of the screen? */
												highestElemCenterCoordPercent >= 0
											)
										)//////////////////////////////////////////////////////////////////////////////////////////////////////
									) { 
	
										this.scrollToThisElem = highestElem.id;
										targetDataIndex = targetIndex;
	
									}
									else if (   // Get the first elem among all the other elements of class className satisfying the condition.s corresponding to the className's highestElemInPageHandleType prop
										(//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
											/* None case */
											targetElemData?.highestElemInPageHandleType?.toLowerCase() == "none"
											|| 
											( /* Last Above case or Above case if the highest elem isn't in the view */
												targetElemData?.highestElemInPageHandleType?.match(abovePattern)
												
												&& /* Is the top coordinate of the highest element of class className: */
												/* Above the required height (percentage of the total height)? */
												highestElemTopCoordPercent < (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[3] || 50)
											)
										)//////////////////////////////////////////////////////////////////////////////////////////////////////
									) {
	
										let targetElemIndex = -1;
										document.querySelectorAll("." + (targetElemData?.className?.match(/(\.|)(.+)/)?.[2].replace(" ", ".") || className)).forEach((elem, _index) => {
	
											if (    /* ensuring the priority order of the element of the first class className found, but also priority of the first/last element in the above case */
												(//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
													(
														targetDataIndex < 0 
														&& (effectivePriority.toLowerCase()||"first") == "first"
													) 
													|| 
													(
														targetDataIndex == targetIndex-1 
														&& (effectivePriority.toLowerCase()||"first") == "last"
													)
													||
													(   
														targetElemIndex == _index-1
														&&
														targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[1]?.trim() == "last"
													)
												)//////////////////////////////////////////////////////////////////////////////////////////////////////
											) {
	
												const elemCoordsClient          = elem.getBoundingClientRect();
												const elemCenterClient          = (elemCoordsClient.top + elemCoordsClient.bottom)/2;
												const elemCenterClientPercent   = 100 * elemCenterClient/window.innerHeight;
												const elemTopClientPercent      = 100 * elemCoordsClient.top/window.innerHeight;
			
												if (
													(//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
														( /* Checking if the element satisfies the conditions corresponding to its highestElemInPageHandleType */
															( /* None case */
																targetElemData?.highestElemInPageHandleType?.toLowerCase() == "none" 
																&& /* Is the center of the currently observed element of class className: */
																/* Below the top of the screen? */
																elemCenterClientPercent >= 0 
															)
															|| 
															( /* Above case */
																targetElemData?.highestElemInPageHandleType?.match(abovePattern)
																&& /* Is the top of the currently observed element of class className: */
																/* Below the top of the screen or in the "last" case? */
																(
																	elemCenterClientPercent >= 0 
																	||
																	targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[1]?.trim() == "last"
																)
																&&
																/* Above the required height (percentage of the total height) of the screen? */
																elemTopClientPercent < (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[3] || 50)
															)
														)
													)//////////////////////////////////////////////////////////////////////////////////////////////////////
												) {
			
													this.scrollToThisElem = elem.id;
													targetDataIndex = targetIndex;
													targetElemIndex = _index;
																
												}
	
											}
										})
									}
								}
								else {
									this.scrollToThisElem = targetElemData?.id || id;
									targetDataIndex = targetIndex;
								}
							}
						})
	
						if (targetDataIndex >= 0) {
							const targetElemData = argumentsArray[targetDataIndex];
	
							setTimeout(() => {
								const scrollToThisElem = document.getElementById(this.scrollToThisElem) || document.querySelector("."+targetElemData.className.match(/(\.|)(.+)/)?.[2].replace(" ", ".")); 
								scrollToThisElem.style.scrollMargin = (targetElemData?.block || block) == "center" ? "" : `${(targetElemData?.margin || margin) + (document.body.classList.contains("lfr-dockbar-pinned") ? 45 : 0)}px`;
								scrollToThisElem.scrollIntoView({behavior: (targetElemData?.smooth || smooth) ? "smooth" : "instant", block: targetElemData.block});
								this.scrollToThisElem = "";
							}, (targetElemData?.timeout || timeout))
	
							return this.scrollToThisElem || String("."+targetElemData.className);
						}
					}


					return;
				}

				/** Call inside a onkeydown or onkeyup event listener
				*  
				* @param {KeyboardEvent} keyboardEvent Pass the keyboard event trigger onkey event from which this method is called
				* @param {String | Array} keyPressed The key expected to be pressed, an array of keys expected to be pressed or a regular expression to match the key pressed
				* @param {Object} param3 All the modifiers. Each element of this object `alt`, `ctrl`, `shift`, `meta`, and `repeat` take as value on of the following Strings: "required", "allowed", "dont care", 
				* @returns {RegExpMatchArray} A formated RegExpMatchArray result following the key and the modifiers given as parameters
				*/
				keyInputMatch(keyboardEvent, keyExpected="([a-zA-Z])", {alt="whatever", ctrl="whatever", shift="whatever", meta="whatever", repeat="whatever"}={alt:"whatever", ctrl:"whatever", shift:"whatever", meta:"whatever", repeat:"whatever"}) {
					const e = keyboardEvent;

					if      (typeof keyExpected == "string") { keyExpected = (keyExpected.match(/[^a-z]+/i) ? "\\" : "") + keyExpected; } // If the keyExpected is a string, proofing the case where the expected key is not an alphabetical character, making sure that the character doesn't have a special effect in the RegExp by adding a literal backslash in front of it in its string form so that it's turned into a backslash when forming the RegExp ("\\|", "\\_", "\\+", "\\/"...)
					else if (keyExpected instanceof Array)   { keyExpected = keyExpected.map((s) => {if (s.match(/[^a-z]+/i)) {return "\\"+s} else {return s}}).join("|"); } // If the keyExpected is an array, joining them with "|" in-between after applying the same process as above to each of them
					else if (keyExpected instanceof RegExp)  { keyExpected = keyExpected.source; }

					const key = `${e.altKey ? "alt" : "no-alt"} ${e.ctrlKey ? "+ ctrl" : "+ no-ctrl"} ${e.shiftKey ? "+ shift" : "+ no-shift"} ${e.metaKey ? "+ meta" : "+ no-meta"} + ${e.key} (${e.repeat ? "repeat" : "no-repeat"})`;

					let altPattern, ctrlPattern, shiftPattern, metaPattern, repeatPattern;
					if (alt    === "required") {altPattern    = "(alt)"}    else if (alt    === "whatever") {altPattern    = "(alt|no-alt)"}        else if (alt    === "forbidden") {altPattern    = "(no-alt)"}              
					if (ctrl   === "required") {ctrlPattern   = "(ctrl)"}   else if (ctrl   === "whatever") {ctrlPattern   = "(ctrl|no-ctrl)"}      else if (ctrl   === "forbidden") {ctrlPattern   = "(no-ctrl)"}          
					if (shift  === "required") {shiftPattern  = "(shift)"}  else if (shift  === "whatever") {shiftPattern  = "(shift|no-shift)"}    else if (shift  === "forbidden") {shiftPattern  = "(no-shift)"}         
					if (meta   === "required") {metaPattern   = "(meta)"}   else if (meta   === "whatever") {metaPattern   = "(meta|no-meta)"}      else if (meta   === "forbidden") {metaPattern   = "(no-meta)"}          
					if (repeat === "required") {repeatPattern = "(repeat)"} else if (repeat === "whatever") {repeatPattern = "(repeat|no-repeat)"}  else if (repeat === "forbidden") {repeatPattern = "(no-repeat)"}       

					const keyPattern = RegExp(`${altPattern} \\+ ${ctrlPattern} \\+ ${shiftPattern} \\+ ${metaPattern} \\+ ${keyExpected} \\(${repeatPattern}\\)`);
					const match = key.match(keyPattern);

					return match;
				}

				resetFixedUnclassifiedSectionHeight() {
					this.timeouts.resetFixedUnclassifiedSectionHeight = setTimeout(() => {
						const unclassifiedSection = document.querySelector(".unclassified-section");
						unclassifiedSection.style.height = "";
						setTimeout(() => {
							const unclassifiedSection = document.querySelector(".unclassified-section");
							const currentUnclassifiedSectionHeight = Number(unclassifiedSection.clientHeight);
							unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;
						}, 10)
						delete this.timeouts.resetFixedUnclassifiedSectionHeight
					}, 1)
				}


				holdElementHeight(elem, timeout=0, {offset=0, height=null}={offset: 0, height: null}) {
					if (timeout > 0) {
						clearTimeout(this?.timeouts?.holdElementHeight?.[elem.id]);
	
						if (!this.timeouts.holdElementHeight) {this.timeouts.holdElementHeight = {}}
						this.timeouts.holdElementHeight[elem.id] = setTimeout(() => {
							clearTimeout(this?.timeouts?.releaseElementHeight);
	
							const currentHeight = height ? height : Number(elem.clientHeight);
							elem.style.height = `${currentHeight+offset}px`;
							delete this.timeouts.holdElementHeight[elem.id];
						}, timeout);
					}
					else {
						const currentHeight = height ? height : Number(elem.clientHeight);
						elem.style.height = `${currentHeight+offset}px`;
					}
				}

				releaseElementHeight(elem, timeout=0) {
					if (timeout > 0) {
						clearTimeout(this?.timeouts?.releaseElementHeight?.[elem.id]);
						
						if (!this.timeouts.releaseElementHeight) {this.timeouts.releaseElementHeight = {}}
						this.timeouts.releaseElementHeight[elem.id] = setTimeout(() => {
							clearTimeout(this?.timeouts?.holdElementHeight);
	
							elem.style.height = "";
							delete this.timeouts.releaseElementHeight[elem.id];
						}, timeout);
					}
					else {
						elem.style.height = "";
					}
				}


				holdElementWidth(elem, timeout=0, {offset=0, width=null}={offset: 0, width: null}) {
					if (timeout > 0) {
						clearTimeout(this?.timeouts?.holdElementWidth);
	
						if (!this.timeouts.holdElementWidth) {this.timeouts.holdElementWidth = {}}
						this.timeouts.holdElementWidth[elem.id] = setTimeout(() => {
							clearTimeout(this?.timeouts?.releaseElementWidth);
	
							const currentWidth = width ? width : Number(elem.clientWidth);
							elem.style.width = `${currentWidth+offset}px`;
						}, timeout);
					}
					else {
						const currentWidth = width ? width : Number(elem.clientWidth);
						elem.style.width = `${currentWidth+offset}px`;
					}
				}

				releaseElementWidth(elem, timeout=0) {
					if (timeout > 0) {
						clearTimeout(this?.timeouts?.releaseElementWidth);
						
						if (!this.timeouts.releaseElementWidth) {this.timeouts.releaseElementWidth = {}}
						this.timeouts.releaseElementWidth[elem.id] = setTimeout(() => {
							clearTimeout(this?.timeouts?.holdElementWidth);
	
							elem.style.width = ``;
						}, timeout);
					}
					else {
						elem.style.width = ``;
					}
				}

				getElementHeightConsideringChildrenHeight(elem) {
					if (elem instanceof HTMLElement) {
						return Array.from(elem.children).reduce((total, child) => {return parseInt(total?.offsetHeight || total) + parseInt(child.offsetHeight)})
					}
				}

			//#endregion




			//#region Save to cache

				saveSettings() { 
					localStorage.setItem("ECAM_DASHBOARD_SETTINGS", JSON.stringify(this.settings, (key, value) => {
						if (key!="description" && key!="name" && key != "info") {return value}
					})); 
				}

				/** Save the module configuration in the cache */
				saveConfig() { localStorage.setItem('ECAM_DASHBOARD_MODULE_CONFIG', JSON.stringify(this.moduleConfig)); }

				/** Save the online config tree in the cache (to limit the number of request sent to Github to get the online configs) */
				saveOnlineConfig() { localStorage.setItem("ECAM_DASHBOARD_ONLINE_CONFIGS", JSON.stringify(this.onlineConfigs)); }

				/** Save the simulated grades in the cache */
				saveSim() { this.deleteUnusedSimPath(); localStorage.setItem("ECAM_DASHBOARD_SIM_GRADES", JSON.stringify(this.sim)); }

				/** Save the ignored grades in the cache */
				saveIgnoredGrades() { localStorage.setItem("ECAM_DASHBOARD_DISABLED_GRADES", JSON.stringify(this.disabledGrades)); }

				/** Save the read grades in the cache */
				saveReadGrades() { localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades)); }
			
				/** Save the current semester filter in the cache */
				saveSemesterFilter() { localStorage.setItem("ECAM_DASHBOARD_SEMESTER_FILTER", this.currentSemester); }

				/** Save the current view mode in the cache */
				saveViewMode() { localStorage.setItem("ECAM_DASHBOARD_VIEW_MODE", this.viewMode); }

				/** Save to the cache whether an update check should be ran on next load or not */
				saveUpdateCheck() { localStorage.setItem("ECAM_DASHBOARD_CHECK_FOR_UPDATE", this.checkForUpdate); }

				/** Save the date-time of the last update check ran */
				saveDateTimeOfLastUpdateCheck() { localStorage.setItem("ECAM_DASHBOARD_DATE_TIME_OF_LAST_UPDATE_CHECK", this.dateTimeOfLastUpdateCheck); }

				/** Save that the update first load has passed */
				saveUpdateFirstLoad() { localStorage.setItem("ECAM_DASHBOARD_UPDATE_FIRST_LOAD", JSON.stringify({state: false, v: this.scriptVersion})) }

			//#endregion




			//#region Module methods

				getAllSubjectsForModule(sem, moduleName="__#unclassified#__"){
					const real = this.moduleConfig?.[sem]?.[moduleName]?.subjects || [];
					const simOnly = Object.keys(((this.sim[sem]||{})[moduleName]||{}));
					return Array.from(new Set([...real, ...simOnly]));
				}

				calculateModuleGrades(sem, moduleName){
					const grades = [];
					const allSubjs = this.getAllSubjectsForModule(sem, moduleName);
					allSubjs.forEach(subject=>{
						const pct =         this.moduleConfig?.[sem]?.[moduleName]?.coefficients?.[subject] || 0;
						const realGrades =  this.semesters?.[sem]?.[subject] || [];
						const simGrades  =  this.getSimGrades(sem, moduleName, subject).map(n=>({ ...n, __sim:true }));

						const src = [...realGrades, ...simGrades];
						src.forEach(n=>{
							grades.push({
								...n,
								coef: n.coef,
								coefInModule: (n.coef||0) * (pct/100),
								subject
							});
						});
					});
					return grades;
				}

				clearIgnoredGradesForModule(sem, moduleName) {
					// Clear ignored grades only for the specified module
					const allSubjs = this.getAllSubjectsForModule(sem, moduleName);

					// Keep ignored grades that are NOT part of this module
					this.disabledGrades = this.disabledGrades?.filter(ignoredId => {
						const parts = ignoredId.split("\\");
						const semX = parts[0];
						const subj = parts[1];
						return semX !== sem || !allSubjs.includes(subj);
					});
					this.saveIgnoredGrades();
					this.getGradesDatas();
				}
			
				getModuleStats() {
					let validated = 0, total = 0;

					Object.keys(this.moduleConfig).forEach(sem => {
						Object.keys(this.moduleConfig[sem]).forEach(moduleName => {
							const nbGrades = this.gradesDatas[sem]?.[moduleName]?.nbGrades;
							const average = this.gradesDatas[sem]?.[moduleName]?.average;

							if (average != 0 && nbGrades > 0) total++; 
							if (average >= 10) validated++;
						});
					});
					
					return { validated, total };
				}

			//#endregion




			//#region Subject methods

				getUnclassifiedSubjects(sem) {
					const classified = new Set();
					const moduleConfig = this.moduleConfig?.[sem] || {};
					Object.values(moduleConfig).forEach(module => { (module.subjects||[]).forEach(m => classified.add(m)); });
					return Object.keys(this.semesters[sem]||{}).filter(m => !classified.has(m));
				}

			//#endregion




			//#region Grade methods





				// MARK: getGradesDatas
				getGradesDatas({sem=undefined, module=undefined, subj=undefined}={sem: undefined, module: undefined, subj: undefined}) {

					
					
					// MARK: semester section
					// FOR EACH SEMESTER
					(sem && this.moduleConfig?.[sem] ? [sem] : Object.keys(this.semesters)).forEach((semX) => {
						
						this.gradesDatas[semX] = {"__#unclassified#__": {}};
						let semData = this.gradesDatas[semX];
						semData.average                     = 0;
						semData.classAvg                    = 0;
						semData.nbModules                   = 0;
						semData.nbSubjects                  = 0;
						semData.nbGrades                    = 0;
						semData.nbUnclassifiedSubjects      = 0;
						semData.modulesNoGrade              = [];
						semData.modulesNoEnabledGrade       = [];
						semData.totalCoefGrades             = 0;
						semData.totalCoefRealGrades         = 0;
						semData.totalCoefSimGrades          = 0;
						semData.totalCoefEnabledGrades      = 0;
						semData.totalCoefEnabledRealGrades  = 0;
						semData.totalCoefEnabledSimGrades   = 0;

						
						// MARK: Unclassified section
						// If there are unclassified subjects
						const unclassified = this.getUnclassifiedSubjects(semX);
						let unclassifiedData = semData["__#unclassified#__"];

						unclassifiedData.moduleName                     = "__#unclassified#__";
						unclassifiedData.subjects                       = {};
						unclassifiedData.average                        = 0;
						unclassifiedData.classAvg                       = 0;
						unclassifiedData.nbSubjects                     = 0;
						unclassifiedData.nbGrades                       = 0;
						unclassifiedData.grades                         = [];
						unclassifiedData.simGrades                      = [];
						unclassifiedData.disabledRealGrades             = [];
						unclassifiedData.disabledSimGrades              = [];
						unclassifiedData.subjectsBelow100               = [];
						unclassifiedData.subjectsOver100                = [];
						unclassifiedData.subjectsReallyBelow100         = [];
						unclassifiedData.subjectsReallyOver100          = [];
						unclassifiedData.subjectsNoGrade                = [];
						unclassifiedData.subjectsNoEnabledGrade         = [];
						unclassifiedData.totalCoefGrades                = 0;
						unclassifiedData.totalCoefRealGrades            = 0;
						unclassifiedData.totalCoefSimGrades             = 0;
						unclassifiedData.totalCoefEnabledGrades         = 0;
						unclassifiedData.totalCoefEnabledRealGrades     = 0;
						unclassifiedData.totalCoefEnabledSimGrades      = 0;

						if (unclassified.length > 0) {
							++semData.nbModules;

							// MARK: Unclassified subjects
							// FOR EACH UNCLASSIFIED SUBJECT IN SEMESTER
							(subj && unclassified.includes(subj) ? [subj] : unclassified).forEach(unclassifiedSubjectName => {

								++unclassifiedData.nbSubjects;
								++semData.nbSubjects;
								++semData.nbUnclassifiedSubjects;

								unclassifiedData.subjects[unclassifiedSubjectName] = {};
								const realGrades = Array(...(this.semesters[semX]||{})[unclassifiedSubjectName])||[];
								const simGrades = this.sim?.[semX]?.["__#unclassified#__"]?.[unclassifiedSubjectName] || [];

								let unclassifiedSubjectData = unclassifiedData.subjects[unclassifiedSubjectName];

								
								unclassifiedSubjectData.subjName                    = unclassifiedSubjectName;
								unclassifiedSubjectData.average                     = 0;
								unclassifiedSubjectData.classAvg                    = 0;
								unclassifiedSubjectData.grades                      = (realGrades).concat(simGrades);
								unclassifiedSubjectData.simGrades                   = simGrades;
								unclassifiedSubjectData.disabledRealGrades          = [];
								unclassifiedSubjectData.disabledSimGrades           = [];
								unclassifiedSubjectData.totalCoefGrades             = 0;
								unclassifiedSubjectData.totalCoefRealGrades         = 0;
								unclassifiedSubjectData.totalCoefSimGrades          = 0;
								unclassifiedSubjectData.totalCoefEnabledGrades      = 0;
								unclassifiedSubjectData.totalCoefEnabledRealGrades  = 0;
								unclassifiedSubjectData.totalCoefEnabledSimGrades   = 0;



								// MARK: Unclassified grades
								// FOR EACH GRADES AND SIM GRADES IN UNCLASSIFIED SUBJECT
								(unclassifiedSubjectData.grades).forEach(grade => {
									
									const 
										gradeValue = parseFloat(grade.grade),
										classAvg   = parseFloat(grade.classAvg),
										coef       = parseInt(grade.coef)
									;

									unclassifiedSubjectData.totalCoefGrades += grade.coef;
									++unclassifiedData.nbGrades;
									++semData.nbGrades;

									switch (`${this.gradeIsDisabled(grade) ? "disabled" : "enabled"} ${grade.__sim ? "sim" : "real"} grade`) {
										case `enabled real grade`:
											unclassifiedSubjectData.average                     += gradeValue*coef/100;
											unclassifiedSubjectData.classAvg                    += classAvg*coef/100;

											unclassifiedSubjectData.totalCoefRealGrades         += coef;
											unclassifiedSubjectData.totalCoefEnabledGrades      += coef;
											unclassifiedSubjectData.totalCoefEnabledRealGrades  += coef;
										break;

										case `disabled real grade`:
											unclassifiedSubjectData.totalCoefRealGrades         += coef;
											unclassifiedSubjectData.disabledRealGrades.push(grade);
											
										break;

										case `enabled sim grade`:
											unclassifiedSubjectData.average                     += gradeValue*coef/100;

											unclassifiedSubjectData.totalCoefSimGrades          += coef;
											unclassifiedSubjectData.totalCoefEnabledGrades      += coef;
											unclassifiedSubjectData.totalCoefEnabledSimGrades   += coef;
										break;

										case `disabled sim grade`:
											unclassifiedSubjectData.totalCoefSimGrades          += coef;
											unclassifiedSubjectData.disabledSimGrades.push(grade);
										break;
									}                                
								})

								unclassifiedData.grades.push(...unclassifiedSubjectData.grades)
								unclassifiedData.simGrades.push(...unclassifiedSubjectData.simGrades)
								unclassifiedData.disabledRealGrades.push(...unclassifiedSubjectData.disabledRealGrades)
								unclassifiedData.disabledSimGrades.push(...unclassifiedSubjectData.disabledSimGrades)

								unclassifiedData.totalCoefGrades            += unclassifiedSubjectData.totalCoefGrades;
								unclassifiedData.totalCoefRealGrades        += unclassifiedSubjectData.totalCoefRealGrades;
								unclassifiedData.totalCoefSimGrades         += unclassifiedSubjectData.totalCoefSimGrades;
								unclassifiedData.totalCoefEnabledGrades     += unclassifiedSubjectData.totalCoefEnabledGrades;
								unclassifiedData.totalCoefEnabledRealGrades += unclassifiedSubjectData.totalCoefEnabledRealGrades;
								unclassifiedData.totalCoefEnabledSimGrades  += unclassifiedSubjectData.totalCoefEnabledSimGrades;


								// Checking the case where there are no grades in the unclassified subject (not possible tho, but oh well, error-proofing)
								if (unclassifiedSubjectData.totalCoefEnabledGrades == 0 || unclassifiedSubjectData.totalCoefGrades == 0) {
									unclassifiedSubjectData.average  = " - ";
									unclassifiedSubjectData.classAvg = " - ";

									if (unclassifiedSubjectData.totalCoefEnabledGrades == 0) {
										unclassifiedData.subjectsNoEnabledGrade.push(unclassifiedSubjectName);
									}
									if (unclassifiedSubjectData.totalCoefGrades == 0) {
										unclassifiedData.subjectsNoGrade.push(unclassifiedSubjectName);
									}
									
								}
								else {
									unclassifiedSubjectData.average                 =  Math.round(100*unclassifiedSubjectData.average /(unclassifiedSubjectData.totalCoefEnabledGrades/100))/100;
									unclassifiedSubjectData.classAvg                =  Math.round(100*unclassifiedSubjectData.classAvg/(unclassifiedSubjectData.totalCoefEnabledRealGrades/100))/100;

									unclassifiedData.average          += unclassifiedSubjectData.average ;
									unclassifiedData.classAvg         += unclassifiedSubjectData.classAvg;
								}


								// Rounding the coefficients
								unclassifiedSubjectData.totalCoefGrades             = Math.floor(unclassifiedSubjectData.totalCoefGrades);
								unclassifiedSubjectData.totalCoefRealGrades         = Math.floor(unclassifiedSubjectData.totalCoefRealGrades);
								unclassifiedSubjectData.totalCoefSimGrades          = Math.floor(unclassifiedSubjectData.totalCoefSimGrades);
								unclassifiedSubjectData.totalCoefEnabledGrades      = Math.floor(unclassifiedSubjectData.totalCoefEnabledGrades);
								unclassifiedSubjectData.totalCoefEnabledRealGrades  = Math.floor(unclassifiedSubjectData.totalCoefEnabledRealGrades);
								unclassifiedSubjectData.totalCoefEnabledSimGrades   = Math.floor(unclassifiedSubjectData.totalCoefEnabledSimGrades);
							})

							// Checking if the unclassified subjects only has subject that don't have any enabled grades
							if (unclassifiedData.subjectsNoEnabledGrade.length == Object.keys(unclassifiedData.subjects).length || unclassifiedData.subjectsNoGrade.length == Object.keys(unclassifiedData.subjects).length) {
								unclassifiedData.average  = " - ";
								unclassifiedData.classAvg = " - ";

								if (unclassifiedData.subjectsNoGrade.length == Object.keys(unclassifiedData.subjects).length) semData.modulesNoGrade.push(unclassifiedData.moduleName);
								if (unclassifiedData.subjectsNoEnabledGrade.length == Object.keys(unclassifiedData.subjects).length) semData.modulesNoEnabledGrade.push(unclassifiedData.moduleName);
							}
							// Scaling down the average and classAvg
							if (!isNaN(Number(unclassifiedData.average))) {
								unclassifiedData.average  =  Math.round(100*unclassifiedData.average /(Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length))/100;
								unclassifiedData.classAvg =  Math.round(100*unclassifiedData.classAvg/(Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length))/100;
							}
							// Error-proofing the average and classAvg calculations
							if (isNaN(Number(unclassifiedData.average))) {
								unclassifiedData.average  = " - ";
								unclassifiedData.classAvg = " - ";
							} 

							// Scaling down + rounding the total coefs
							unclassifiedData.totalCoefGrades            = Math.floor(unclassifiedData.totalCoefGrades           / (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )
							unclassifiedData.totalCoefRealGrades        = Math.floor(unclassifiedData.totalCoefRealGrades       / (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )
							unclassifiedData.totalCoefSimGrades         = Math.floor(unclassifiedData.totalCoefSimGrades        / (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )
							unclassifiedData.totalCoefEnabledGrades     = Math.floor(unclassifiedData.totalCoefEnabledGrades    / (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )
							unclassifiedData.totalCoefEnabledRealGrades = Math.floor(unclassifiedData.totalCoefEnabledRealGrades/ (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )
							unclassifiedData.totalCoefEnabledSimGrades  = Math.floor(unclassifiedData.totalCoefEnabledSimGrades / (Object.keys(unclassifiedData.subjects).length-unclassifiedData.subjectsNoEnabledGrade.length) )

							semData.average     = unclassifiedData.average ;
							semData.classAvg    = unclassifiedData.classAvg;
						}


						// MARK: Modules
						// FOR EACH MODULE IN SEMESTER (if any)
						if (this.moduleConfig?.[semX]?.__modules__) {
							(module && this.moduleConfig?.[sem]?.__modules__.includes(module) ? [module] : (this.moduleConfig[semX]?.__modules__ || [])).forEach((moduleName) => {
								const allSubjs      = this.getAllSubjectsForModule(semX, moduleName);
								const moduleGrades  = this.calculateModuleGrades(semX, moduleName);

								++semData.nbModules;

								semData[moduleName] = {};
								
								let moduleData = semData[moduleName];
								
								moduleData.moduleName                   = moduleName;
								moduleData.subjects                     = {};
								moduleData.average                      = 0;
								moduleData.classAvg                     = 0;
								moduleData.nbGrades                     = 0;
								moduleData.grades                       = [];
								moduleData.simGrades                    = [];
								moduleData.disabledRealGrades           = [];
								moduleData.disabledSimGrades            = [];
								moduleData.subjectsBelow100             = [];
								moduleData.subjectsOver100              = [];
								moduleData.subjectsReallyBelow100       = [];
								moduleData.subjectsReallyOver100        = [];
								moduleData.subjectsNoGrade              = [];
								moduleData.subjectsNoEnabledGrade       = [];
								moduleData.coefSubjectsNoGrade          = 0;
								moduleData.coefSubjectsNoEnabledGrade   = 0;
								moduleData.totalCoefSubjects            = 0;
								moduleData.totalCoefGrades              = 0;
								moduleData.totalCoefRealGrades          = 0;
								moduleData.totalCoefSimGrades           = 0;
								moduleData.totalCoefEnabledGrades       = 0;
								moduleData.totalCoefEnabledRealGrades   = 0;
								moduleData.totalCoefEnabledSimGrades    = 0;

								(this.moduleConfig?.[semX]?.[moduleName]?.subjects?.length > 0 ? this.moduleConfig[semX][moduleName].subjects : []).forEach(subject => {
									moduleData.subjects[subject] = {grades: []};
								})
								
								moduleGrades.forEach(n => {
									const subjectName = n.subject;
									let subjectData = moduleData.subjects[subjectName];
									
									if (!subjectData) {
										subjectData = {grades: []};
									}

									moduleData.grades.push(n);
									subjectData.grades.push(n);
								});

								

								// MARK: Classified subjects
								// FOR EACH SUBJECT IN MODULE
								(subj && this.moduleConfig?.[sem]?.[module]?.subjects?.includes(subj) ? [subj] : allSubjs).forEach(subjectName => {

									++semData.nbSubjects;

									let subjectData = moduleData.subjects[subjectName];

									subjectData.subjName                    = subjectName;
									subjectData.coef                        = this.moduleConfig[semX][moduleName].coefficients[subjectName];
									subjectData.average                     = 0;
									subjectData.classAvg                    = 0;
									subjectData.disabledRealGrades          = [];
									subjectData.simGrades                   = [];
									subjectData.disabledSimGrades           = [];
									subjectData.isCustom                    = true;
									subjectData.totalCoefGrades             = 0;
									subjectData.totalCoefRealGrades         = 0;
									subjectData.totalCoefSimGrades          = 0;
									subjectData.totalCoefEnabledGrades      = 0;
									subjectData.totalCoefEnabledRealGrades  = 0;
									subjectData.totalCoefEnabledSimGrades   = 0;
									

									moduleData.totalCoefSubjects += parseInt(subjectData.coef);
									
									
									// MARK: Classified grades
									// FOR EACH GRADE IN SUBJECT
									subjectData.grades.forEach(grade => {
										const gradeValue    = parseFloat(grade.grade),
											  classAvg      = parseFloat(grade.classAvg),
											  coef          = parseInt(grade.coef),
											  subjCoef      = parseInt(subjectData.coef)
										;
										
										++semData.nbGrades;
										++moduleData.nbGrades;
										subjectData.totalCoefGrades += grade.coef;
										subjectData.isCustom = false;

										switch (`${this.gradeIsDisabled(grade) ? "disabled" : "enabled"} ${grade.__sim ? "sim" : "real"} grade`) {
											case `enabled real grade`:
												subjectData.average                     += gradeValue*coef/100;
												subjectData.classAvg                    += classAvg*coef/100;
												
												subjectData.totalCoefRealGrades         += coef;
												subjectData.totalCoefEnabledGrades      += coef;
												subjectData.totalCoefEnabledRealGrades  += coef;


												moduleData.totalCoefGrades              += coef*subjCoef/100;
												moduleData.totalCoefRealGrades          += coef*subjCoef/100;

												moduleData.totalCoefEnabledGrades       += coef*subjCoef/100;
												moduleData.totalCoefEnabledRealGrades   += coef*subjCoef/100;


												semData.totalCoefGrades                 += coef*subjCoef/100;
												semData.totalCoefRealGrades             += coef*subjCoef/100;

												semData.totalCoefEnabledGrades          += coef*subjCoef/100;
												semData.totalCoefEnabledRealGrades      += coef*subjCoef/100;
											break;

											case `disabled real grade`:
												// subjectData.classAvg                    += classAvg*coef/100;
												subjectData.totalCoefRealGrades         += coef;

												subjectData.disabledRealGrades.push(grade);
												
												
												moduleData.totalCoefGrades              += coef*subjCoef/100;
												moduleData.totalCoefRealGrades          += coef*subjCoef/100;
												
												moduleData.disabledRealGrades.push(grade);

												
												semData.totalCoefGrades                 += coef*subjCoef/100;
												semData.totalCoefRealGrades             += coef*subjCoef/100;
											break;

											case `enabled sim grade`:
												subjectData.simGrades.push(grade);
												subjectData.totalCoefSimGrades          += coef;

												subjectData.average                     += gradeValue*coef/100;
												subjectData.totalCoefEnabledGrades      += coef;
												subjectData.totalCoefEnabledSimGrades   += coef;


												moduleData.simGrades.push(grade);
												moduleData.totalCoefGrades              += coef*subjCoef/100;
												moduleData.totalCoefSimGrades           += coef*subjCoef/100;
												
												moduleData.totalCoefEnabledGrades       += coef*subjCoef/100;
												moduleData.totalCoefEnabledSimGrades    += coef*subjCoef/100;
												

												semData.totalCoefGrades                 += coef*subjCoef/100;
												semData.totalCoefSimGrades              += coef*subjCoef/100;

												semData.totalCoefEnabledGrades          += coef*subjCoef/100;
												semData.totalCoefEnabledSimGrades       += coef*subjCoef/100;
											break;

											case `disabled sim grade`:
												subjectData.simGrades.push(grade);
												subjectData.disabledSimGrades.push(grade);
												subjectData.totalCoefSimGrades          += coef;

												moduleData.simGrades.push(grade);
												moduleData.totalCoefGrades              += coef*subjCoef/100;
												moduleData.totalCoefSimGrades           += coef*subjCoef/100;

												moduleData.disabledSimGrades.push(grade);

												semData.totalCoefGrades                 += coef*subjCoef/100;
												semData.totalCoefSimGrades              += coef*subjCoef/100;
											break;
										}
									})
									
									
									// "Nullyifing" the subject if no enabled grades (if there are grades) are here
									if (subjectData.totalCoefEnabledGrades == 0 || subjectData.totalCoefGrades == 0) {
										subjectData.average  = " - ";
										subjectData.classAvg = " - ";
										if (subjectData.totalCoefEnabledGrades == 0) {
											moduleData.subjectsNoEnabledGrade.push(subjectName);
											moduleData.coefSubjectsNoEnabledGrade  += parseInt(subjectData.coef);
	
										}
										if (subjectData.totalCoefGrades == 0) {
											moduleData.subjectsNoGrade.push(subjectName);
											moduleData.coefSubjectsNoGrade  += parseInt(subjectData.coef);
										}
										
									}
									else {  // Round the averages to the closest 2-decimals float number
										subjectData.average     =  Math.round(100*subjectData.average /(subjectData.totalCoefEnabledGrades      /100))/100;
										subjectData.classAvg    =  Math.round(100*subjectData.classAvg/(subjectData.totalCoefEnabledRealGrades  /100))/100;

										moduleData.average          += subjectData.average *subjectData.coef/100;
										moduleData.classAvg         += subjectData.classAvg*subjectData.coef/100;
									}

									// Rounding down the total coefs
									subjectData.totalCoefGrades             = Math.floor(subjectData.totalCoefGrades);
									subjectData.totalCoefRealGrades         = Math.floor(subjectData.totalCoefRealGrades);
									subjectData.totalCoefSimGrades          = Math.floor(subjectData.totalCoefSimGrades);
									subjectData.totalCoefEnabledGrades      = Math.floor(subjectData.totalCoefEnabledGrades);
									subjectData.totalCoefEnabledRealGrades  = Math.floor(subjectData.totalCoefEnabledRealGrades);
									subjectData.totalCoefEnabledSimGrades   = Math.floor(subjectData.totalCoefEnabledSimGrades);


									if      (subjectData.totalCoefGrades < 100) moduleData.subjectsBelow100.push(subjectName);
									else if (subjectData.totalCoefGrades > 100) moduleData.subjectsOver100 .push(subjectName);

									if      (subjectData.totalCoefRealGrades < 100) moduleData.subjectsReallyBelow100.push(subjectName);
									else if (subjectData.totalCoefRealGrades > 100) moduleData.subjectsReallyOver100 .push(subjectName);
								});


								// "Nullifying" the module if all its subjects don't have any enabled grade
								if (moduleData.subjectsNoEnabledGrade.length == Object.keys(moduleData.subjects).length || moduleData.subjectsNoGrade.length == Object.keys(moduleData.subjects).length) {
									moduleData.average  = " - ";
									moduleData.classAvg = " - ";

									if (moduleData.subjectsNoGrade.length == Object.keys(moduleData.subjects).length) semData.modulesNoGrade.push(moduleData.moduleName);
									if (moduleData.subjectsNoEnabledGrade.length == Object.keys(moduleData.subjects).length) semData.modulesNoEnabledGrade.push(moduleData.moduleName);
								}
								// Scaling down + rounding the averages
								if (!isNaN(Number(moduleData.average))) {
									moduleData.average  =  Math.round(100*moduleData.average /((moduleData.totalCoefSubjects-moduleData.coefSubjectsNoEnabledGrade)/100))/100;
									moduleData.classAvg =  Math.round(100*moduleData.classAvg/((moduleData.totalCoefSubjects-moduleData.coefSubjectsNoEnabledGrade)/100))/100;
								}
								// Error-proofing the averages
								if (isNaN(Number(moduleData.average))) {
									moduleData.average  = " - ";
									moduleData.classAvg = " - ";
								} 
								else {
									semData.average     += moduleData.average;
									semData.classAvg    += moduleData.classAvg;
								}
								
								// Rounding down the total coefs
								moduleData.totalCoefSubjects            =  Math.floor(moduleData.totalCoefSubjects);
								moduleData.totalCoefGrades              =  Math.floor(moduleData.totalCoefGrades);
								moduleData.totalCoefRealGrades          =  Math.floor(moduleData.totalCoefRealGrades);
								moduleData.totalCoefSimGrades           =  Math.floor(moduleData.totalCoefSimGrades);
								moduleData.totalCoefEnabledGrades       =  Math.floor(moduleData.totalCoefEnabledGrades);
								moduleData.totalCoefEnabledRealGrades   =  Math.floor(moduleData.totalCoefEnabledRealGrades);
								moduleData.totalCoefEnabledSimGrades    =  Math.floor(moduleData.totalCoefEnabledSimGrades);

							})



						}
						
						semData.totalCoefGrades                 = semData.totalCoefGrades               /semData.nbSubjects;
						semData.totalCoefRealGrades             = semData.totalCoefRealGrades           /semData.nbSubjects;
						semData.totalCoefSimGrades              = semData.totalCoefSimGrades            /semData.nbSubjects;
						semData.totalCoefEnabledGrades          = semData.totalCoefEnabledGrades        /semData.nbSubjects;
						semData.totalCoefEnabledRealGrades      = semData.totalCoefEnabledRealGrades    /semData.nbSubjects;
						semData.totalCoefEnabledSimGrades       = semData.totalCoefEnabledSimGrades     /semData.nbSubjects;
						
						// "Nullifying" the semester if every single one of its subjects has all its grades disabled
						if (semData.modulesNoEnabledGrade.length == semData.nbModules) {
							semData.average     = " - ";
							semData.classAvg    = " - ";
						}
						
						if (!isNaN(Number(semData.average)) && Object.keys(semData["__#unclassified#__"].subjects).length < semData.nbSubjects) {
							semData.average  =  Math.round(100*semData.average /(semData.nbModules-semData.modulesNoEnabledGrade.length))/100;
							semData.classAvg =  Math.round(100*semData.classAvg/(semData.nbModules-semData.modulesNoEnabledGrade.length))/100;
						}

						if (isNaN(Number(semData.average))) {
							semData.average     = " - ";
							semData.classAvg    = " - ";
						} 
						
						semData.totalCoefGrades                 = Math.floor(semData.totalCoefGrades);
						semData.totalCoefRealGrades             = Math.floor(semData.totalCoefRealGrades);
						semData.totalCoefSimGrades              = Math.floor(semData.totalCoefSimGrades);
						semData.totalCoefEnabledGrades          = Math.floor(semData.totalCoefEnabledGrades);
						semData.totalCoefEnabledRealGrades      = Math.floor(semData.totalCoefEnabledRealGrades);
						semData.totalCoefEnabledSimGrades       = Math.floor(semData.totalCoefEnabledSimGrades);
					})

					return this.gradesDatas
				}


				// MARK: Set total coefs
				setGradesTableTotalCoef(container=document.body) {
					const good="#10b981", meh="#e98c00", bad="#e90000", unknown="#7a7a7a";

					container.querySelectorAll(".module-subject-total-coef-div").forEach(totalCoefDiv => {
						const 
							totalCoefValue  = totalCoefDiv.querySelector(".module-subject-total-coef-value"),
							totalCoefDebug  = totalCoefDiv.querySelector(".module-subject-total-coef-debug"),
							sem             = totalCoefDiv.dataset.semester,
							module          = totalCoefDiv.dataset.module,
							moduleData      = this.gradesDatas[sem][module],
							nbSubjects      = Object.keys(moduleData.subjects).length,
							
							nbGrades                    = moduleData.nbGrades,
							simGrades                   = moduleData.simGrades, 
							disabledRealGrades          = moduleData.disabledRealGrades, 
							disabledSimGrades           = moduleData.disabledSimGrades, 

							totalCoefSubjects           = moduleData.totalCoefSubjects, 
							totalCoefGrades             = moduleData.totalCoefGrades,  
							totalCoefRealGrades         = moduleData.totalCoefRealGrades, 
							totalCoefSimGrades          = moduleData.totalCoefSimGrades, 
							totalCoefEnabledGrades      = moduleData.totalCoefEnabledGrades, 
							totalCoefEnabledRealGrades  = moduleData.totalCoefEnabledRealGrades, 
							totalCoefEnabledSimGrades   = moduleData.totalCoefEnabledSimGrades, 


							subjectsBelow100            = moduleData.subjectsBelow100, 
							subjectsOver100             = moduleData.subjectsOver100,
							subjectsReallyBelow100      = moduleData.subjectsReallyBelow100, 
							subjectsReallyOver100       = moduleData.subjectsReallyOver100,

							nbSubjectsBelow100          = subjectsBelow100.length, 
							nbSubjectsOver100           = subjectsOver100.length, 
							nbSubjectsReallyBelow100    = subjectsReallyBelow100.length, 
							nbSubjectsReallyOver100     = subjectsReallyOver100.length, 
							nbSubjectsSimBelow100       = nbSubjectsBelow100-nbSubjectsReallyBelow100, 
							nbSubjectsSimOver100        = nbSubjectsOver100-nbSubjectsReallyOver100, 
							nbDisabledRealGrades        = disabledRealGrades.length, 
							nbSimGrades                 = simGrades.length, 
							nbEnabledSimGrades          = nbSimGrades - disabledSimGrades.length
						;


						let advice = !this.langIsEn ? `Toutes tes notes sont là !` : `All your grades are out!`;
						let color = good;

						
						if (totalCoefSubjects != 100) {
							advice = !this.langIsEn ? `Réajuste le coef de tes matières, leur somme n'est pas égale à 100% !` : `Readjust your subjects' coef, their sum isn't equal to 100%!`;
							color = bad;
						}
						else if (totalCoefRealGrades == 0) {
							if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont simulées, tu n'as pas encore de notes !` 
									: `All your grades are simulated, you don't have any grades yet!`
								;
								color = meh;
							}
							else {
								advice = !this.langIsEn ? `Pas encore de notes` : `No grades yet`;
								color = unknown;
							}
						}
						else if (totalCoefRealGrades < 100) {
							if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `${Math.round(10000*totalCoefEnabledSimGrades/totalCoefEnabledGrades)/100}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
									: `${Math.round(10000*totalCoefEnabledSimGrades/totalCoefEnabledGrades)/100}% of your grades is simulated, all your grades aren't out yet!`
								;
								color = meh;
							}
							else if (totalCoefEnabledSimGrades == 0) {
								advice = !this.langIsEn ? `Toutes tes notes ne sont encore pas là !` : `All your grades aren't out yet!`;
								color = meh;
							}
						}
						else if (totalCoefEnabledRealGrades > 100) {
							advice = !this.langIsEn ? `Trop de notes (erreur du côté de l'ECAM), désactive les notes en trop !` : `Too many grades (error on ECAM's side), turn off all irrelevant grades!`;
							color = bad;
						}
						else if ((nbSubjectsBelow100 > 0 || nbSubjectsOver100 > 0) && nbEnabledSimGrades > 0) {
							advice = !this.langIsEn 
								? `Tes notes simulées faussent ta moyenne. Désactive/enlève-les !` 
								: `Your simulated grades falsify your average. Disable/remove them!`
							;
							color = bad;
						}
						else if (totalCoefRealGrades == 100) {
							if (nbSubjectsBelow100 > 0 && nbSubjectsOver100 > 0) {
								advice = !this.langIsEn
									? `Trop de notes dans ${nbSubjectsOver100} matière${nbSubjectsOver100>1?`s`:``}, et notes manquantes dans ${nbSubjectsBelow100} matières${nbSubjectsBelow100>1?`s`:``} !`
									: `Too many grades in ${nbSubjectsOver100} subject${nbSubjectsOver100>1?`s`:``}, and missing grades in ${nbSubjectsBelow100} subject${nbSubjectsBelow100>1?`s`:``}!`
								;
								color = bad;
							}
							if (totalCoefEnabledRealGrades < 100) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là ! Réactive tes ${nbDisabledRealGrades} notes désactivées pour afficher ta vraie moyenne !` 
									: `All your grades are out! Enable your ${nbDisabledRealGrades} disabled grades to display your actual average!`
								;
								color = meh;
							}
							else if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là, mais tu devrais enlever tes ${nbSimGrades} notes simulées !` 
									: `All your grades are out, but you should remove your ${nbSimGrades} simulated grades!`
								;
								color = meh;
							}
							else if (totalCoefSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là ! Tu peux enlever tes ${nbSimGrades} notes simulées !` 
									: `All your grades are out! You may remove your ${nbSimGrades} simulated grades!`
								;
								color = good;
							}
						}

						totalCoefValue.innerHTML = `${!this.langIsEn ? "Coef Total des Matières :" : "Total Subjects Coef:"} <span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}% / ${totalCoefSubjects}%</span>`;
						totalCoefDebug.innerHTML = `${advice}`;
					})
					container.querySelectorAll(".subject-total-coef-div").forEach(totalCoefDiv => {
						const 
							totalCoefValue  = totalCoefDiv.querySelector(".subject-total-coef-value"),
							totalCoefDebug  = totalCoefDiv.querySelector(".subject-total-coef-debug"),
							sem             = totalCoefDiv.dataset.semester,
							module          = totalCoefDiv.dataset.module,
							subject         = totalCoefDiv.dataset.subject,
							subjectData     = this.gradesDatas[sem][module].subjects[subject],

							disabledRealGrades          = subjectData.disabledRealGrades,
							simGrades                   = subjectData.simGrades,
							disabledSimGrades           = subjectData.disabledSimGrades,
							totalCoefGrades             = subjectData.totalCoefGrades,
							totalCoefRealGrades         = subjectData.totalCoefRealGrades,
							totalCoefSimGrades          = subjectData.totalCoefSimGrades,
							totalCoefEnabledGrades      = subjectData.totalCoefEnabledGrades,
							totalCoefEnabledRealGrades  = subjectData.totalCoefEnabledRealGrades,
							totalCoefEnabledSimGrades   = subjectData.totalCoefEnabledSimGrades,
							nbSimGrades                 = simGrades.length,
							nbEnabledSimGrades          = nbSimGrades - disabledSimGrades,
							nbDisabledRealGrades        = disabledRealGrades.length
						;
						
						
						let advice = !this.langIsEn ? `Toutes tes notes sont là !` : `All your grades are out!`;
						let color = ` #10b981`;

						if (totalCoefRealGrades == 0) {
							if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont simulées, tu n'as pas encore de notes !` 
									: `All your grades are simulated, you don't have any grades yet!`
								;
								color = meh;
							}
							else {
								advice = !this.langIsEn ? `Pas encore de notes` : `No grades yet`;
								color = unknown;
							}
						}
						else if (totalCoefRealGrades < 100) {
							if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `${totalCoefEnabledSimGrades}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
									: `${totalCoefEnabledSimGrades}% of your grades is simulated, all your grades aren't out yet!`
								;
								color = meh;
							}
							else if (totalCoefEnabledSimGrades == 0) {
								advice = !this.langIsEn ? `Toutes tes notes ne sont encore pas là !` : `All your grades aren't out yet!`;
								color = meh;
							}
						}
						else if (totalCoefEnabledRealGrades > 100) {
							advice = !this.langIsEn 
								? `Trop de notes (erreur du côté de l'ECAM), désactive les notes en trop !` 
								: `Too many grades (error on ECAM's side), turn off all irrelevant grades!`
							;
							color = bad;
						}
						else if (totalCoefRealGrades == 100) {
							if (totalCoefEnabledRealGrades < 100) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là ! Réactive tes ${nbDisabledRealGrades} notes désactivées pour afficher ta vraie moyenne !` 
									: `All your grades are out! Enable your ${nbDisabledRealGrades} disabled grades to display your actual average!`
								;
								color = meh;
							}
							else if (totalCoefEnabledSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là, mais tu devrais enlever tes ${nbSimGrades} notes simulées !` 
									: `All your grades are out, but you should remove your ${nbSimGrades} simulated grades!`
								;
								color = meh;
							}
							else if (totalCoefSimGrades > 0) {
								advice = !this.langIsEn 
									? `Toutes tes notes sont là ! Tu peux enlever tes ${nbSimGrades} notes simulées !` 
									: `All your grades are out! You may remove your ${nbSimGrades} simulated grades!`
								;
								color = good;
							}
						}
						
						totalCoefValue.innerHTML = `${!this.langIsEn ? "Coef Total des Notes :" : "Total Grades Coef:"} <span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}%</span>`;
						totalCoefDebug.innerHTML = `${advice}`;
					})
				}


				getGradeColor(grade) { if (grade >= 10) return 'good'; return 'bad'; }

				gradeIsDisabled(n) {
					return this.disabledGrades?.includes([n.semester, n.subject, (n?.id || n.type + " " + n.date + " " + n.prof)].join("\\")) || false
				}

				averagePonderee(arr) {
					if (!arr || arr.length === 0) return 0;
					let total = 0, coeffs = 0;
					arr.forEach(n => { 
						if (!this.gradeIsDisabled(n)) {
							total += n.grade * (n.coef||0); 
							coeffs += (n.coef||0); 
						}
					});
					const v = coeffs ? (total / coeffs) : 0;
					return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
				}

				parseGrades() {
					if (!this.error) {
						const rows = document.querySelectorAll("table.greyGridTable tbody tr");
						rows.forEach(row => {
							const cells = row.querySelectorAll("td");
							if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
								const grade = parseFloat(cells[0].textContent.replace("/20", "").replace(",", ".")) || 0;
								const classAvg = parseFloat(cells[3].textContent.replace("/20", "").replace(",", ".")) || 0;
								const libelle = cells[1].textContent.trim();
								const coef = parseFloat(cells[2].textContent.replace("%", "").replace(",", ".")) || 0;
								const prof = cells[4].textContent.trim();
								const date = cells[5].textContent.trim();
								const semMatch = libelle.match(/Semester\s+(\d+)/i);
								const semester = semMatch ? semMatch[1] : "?";
								const parts = libelle.split(" - ").map(p => p.trim());
								const subject = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
								const type = parts.length >= 2 ? parts.at(-1) : "";
								this.grades.push({ grade, classAvg, coef, semester, subject, type, prof, date, libelle });
							}
						});
						this.grades.forEach(n => {
							if (!this.semesters[n.semester]) this.semesters[n.semester] = {};
							if (!this.semesters[n.semester][n.subject]) this.semesters[n.semester][n.subject] = [];
							this.semesters[n.semester][n.subject].push(n);
						});
	
						if (this.savedReadGrades.length == 0) {
							this.newGrades = [];
							this.savedReadGrades = this.grades;
							this.saveReadGrades();
						}
						else {
							this.newGrades = this.compareArraysOfObjects(this.grades, this.savedReadGrades).more;
						}
					}
					else {
						this.newGrades = [];
						this.grades = this.savedReadGrades;
						this.grades.forEach(n => {
							if (!this.semesters[n.semester]) this.semesters[n.semester] = {};
							if (!this.semesters[n.semester][n.subject]) this.semesters[n.semester][n.subject] = [];
							this.semesters[n.semester][n.subject].push(n);
						});
					}
				}


			//#endregion




			//#region Sim grade methods
			
				/** Ensures that a path composed of `sem`, `module` and `subj` exists in this.sim */
				ensureSimPath(sem=undefined, module=undefined, subj=undefined) {
					if (sem)    {if(!this.sim?.[sem])               this.sim[sem]={}; }
					if (module)     {if(!this.sim?.[sem]?.[module])         this.sim[sem][module]={}; }
					if (subj)   {if(!this.sim?.[sem]?.[module]?.[subj]) this.sim[sem][module][subj]=[]; }
				}

				/** Delete every unused simulated grade pathes */
				deleteUnusedSimPath(flex=true, sem=undefined, module=undefined, subj=undefined) {
					(sem ? [sem] : (flex ? Object.keys(this.sim || []) : [])).forEach(_sem => {
						(module ? [module] : (flex ? Object.keys(this.sim?.[_sem] || []) : [])).forEach(_module => {
							(subj ? [subj] : (flex ? Object.keys(this.sim?.[_sem]?.[_module] || []) : [])).forEach(_subj => {
								if (Object.keys(this.sim?.[_sem]?.[_module]?.[_subj])?.length == 0) {delete this.sim[_sem][_module][_subj]}
							})
							if (Object.keys(this.sim?.[_sem]?.[_module])?.length == 0) {delete this.sim[_sem][_module]}
						})
						if (Object.keys(this.sim?.[_sem])?.length == 0) {delete this.sim[_sem]}
					})
				}

				/** Clear all simulated grades in the module if `sem` (semester) and `moduleName` (name of the module to clear) are provided, or in the semester if only `semester` is provided. If no argument is provided, clears all simulated grades */
				clearSimGrades(sem, moduleName) {
					this.ensureSimPath(sem, moduleName);
					if (sem) {
						if (moduleName) {
							delete this.sim[sem][moduleName];
							if (this.sim[sem] == {}) delete this.sim[sem];
						}
						else {
							delete this.sim[sem];
						}
					}
					this.saveSim()
					this.getGradesDatas();
				}

				/** Obtain the list of simulated grades in the `sem`, `module` and `subj` provided.
				 * @param {String|Number} sem semester's number
				 * @param {String} module module's name
				 * @param {String} subj subject's name
				 * @returns {Array<Grade>|Array<undefined>} The list of all simulated grades in function of the given parameters. If none was found, gives an empty array instead
				 */
				getSimGrades(sem, module, subj){ return (this.sim[sem]&&this.sim[sem][module]&&this.sim[sem][module][subj])||[]; }

			//#endregion




			//#region Misc methods

				compareArraysOfObjects(a, b) {
					const out = {common:[], more:[], missing:[]};

					// turning a in an array of strings, for easier comparison in case the elements of a are objects
					const aStringified = [];
					JSON.stringify(a).split("},{").forEach(e => {
						if (e[0]=="[") {
							aStringified.push(e.split("[")[1]+"}")
						}
						else if (e.at(-1)=="]") {
							aStringified.push("{"+e.split("]")[0])
						}
						else
						{
							aStringified.push("{"+e+"}")
						}
					})
					// as a result, "["+aStringified.join(",")+"]" == JSON.stringify(a)


					// turning a in an array of strings, for easier comparison in case the elements of a are objects
					const bStringified = [];
					JSON.stringify(b).split("},{").forEach(e => {
						if (e[0]=="[") {
							bStringified.push(e.split("[")[1]+"}")
						}
						else if (e.at(-1)=="]") {
							bStringified.push("{"+e.split("]")[0])
						}
						else
						{
							bStringified.push("{"+e+"}")
						}
					})
					// as a result, "["+bStringified.join(",")+"]" == JSON.stringify(b)

					const b2 = [];
					b.forEach((e) => {b2.push(e)})

					aStringified.forEach((e, index) => {
						if (bStringified.includes(e)) {
							out.common.push(a[index]);
							b2.pop(bStringified.indexOf(e));
						}
						else
						{
							out.more.push(a[index]);
						}
					})
					
					out.missing = b2;

					return out;
				}

				dateTimeUpperSlice(dateTime=this.now(), offset=5, type="minute") {
					const dateTimeMatch     = dateTime.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d{3})|)Z/);
					const dateTimeIndex     = ["year", "month", "day", "hour", "minute", "second", NaN, "millisecond"].indexOf(type.replace(/s$/, ""));

					const seconds    = parseInt(dateTime.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2})Z/)[1]);
					const minutes    = parseInt(dateTime.match(/\d{4}-\d{2}-\d{2}T\d{2}:(\d{2}):\d{2}Z/)[1]);
					const hours      = parseInt(dateTime.match(/\d{4}-\d{2}-\d{2}T(\d{2}):\d{2}:\d{2}Z/)[1]);
					const days       = parseInt(dateTime.match(/\d{4}-\d{2}-(\d{2})T\d{2}:\d{2}:\d{2}Z/)[1]);
					const months     = parseInt(dateTime.match(/\d{4}-(\d{2})-\d{2}T\d{2}:\d{2}:\d{2}Z/)[1]);
										
					switch(type.replace(/s$/, "")) {
						default:
						case "minute":
							const newMinutes  = minutes + (offset-minutes%offset);
							const newHour     = minutes >= 60 
								? ((hours + 1).toString().length > 1 ? (hours + 1).toString() : "0"+(hours + 1).toString()) 
								: (hours.toString().length > 1 ? hours.toString() : "0"+hours.toString())
							;
		
							const formatedMinutes = (newMinutes%60).toString().length > 1 ? (newMinutes%60).toString() : "0"+(newMinutes%60).toString();
		
							return dateTime.replace(/T\d{2}:\d{2}:\d{2}Z/, `T${newHour}:${formatedMinutes}:00Z`);
						
						case "hours":

					}

					const oldNumber     = dateTimeMatch[dateTimeIndex];
					const newNumber     = oldNumber + (offset-oldNumber%offset);  // round up to the upper slice

					return dateTime

				}

			//#endregion




			//#region methods hidden from user
				

				/** 
				*  Use only in the console: iterating through a long list of objects isn't very optimized. Use it only to obtain the indices pointing at the class you want to change.
				*  Grade for now: the style sheet of this script is located at document.styleSheets[11];
				* 
				* @param _class Name of the class to search for
				* @returns The path in document.styleSheets to to the class of name the param _class (to modify its definition)
				*/
				getCSSClassCoordInStyleSheet(_class="") {
					let styleSheetIndex = -1, ruleIndex = -1;
					Object.keys(document.styleSheets).reverse().forEach(_CSSStyleSheet => {
						Object.keys(document.styleSheets[_CSSStyleSheet].cssRules).forEach(_CSSRule => {
							if (document.styleSheets[_CSSStyleSheet].cssRules[_CSSRule].selectorText == _class) ruleIndex = _CSSRule, styleSheetIndex = _CSSStyleSheet;
						})
					})
					return document.styleSheets[styleSheetIndex].cssRules[ruleIndex]
				}

				removeFirstGradesFromSavedReadGrades(nb=1) {
					localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(JSON.parse(localStorage["ECAM_DASHBOARD_SAVED_READ_GRADES"]).toSpliced(0,nb)))
					window.location.reload();
				}

			//#endregion

		//#endregion






		//#region ________ — Online methods — ________

			/** Shows/Hides/Toggles the loading symbol when called depending on the argument `show`.
			 * Default call: `this.showLoadingSymbol()`
			 * 
			 * @param {Boolean} show Optional, accepts true, false or nothing, to respectively show, hide or toggle the loading symbol
			 */
			showLoadingSymbol(show=undefined) {
				if (show === undefined) {
					document.querySelector(".currently-loading").classList.toggle("show");
					document.querySelectorAll(".loading-symbol").forEach(symbol => {symbol.classList.toggle("show")});
				}
				else if (show) {
					document.querySelector(".currently-loading").classList.add("show");
					document.querySelectorAll(".loading-symbol").forEach(symbol => {symbol.classList.add("show")});
				}
				else {
					document.querySelector(".currently-loading").classList.remove("show");
					document.querySelectorAll(".loading-symbol").forEach(symbol => {symbol.classList.remove("show")});
				}
			}
			/** Send a request to my repo to obtain the configs. The request is allowed to be sent by slices of 5 minutes 
			 * (if a request was sent at 12:43PM, next request is allowed at 12:45PM, and the next at 12:50PM), 
			 * so if this method is called before the validity date and time is passed, runs it from memory instead of from a new request.
			 * 
			 * @param {URL} repoAPIUrl URL of the repo's API to fetch the data to
			 */
			async getConfigsFromRepoAPI(repoAPIUrl) {
				
				// Making sure a request isn't sent everytime the import online config button is clicked by saving in the cache the previous online config fetch, and giving it a validity date and time.
				const dateTimeOfLastConfigFetchValidUntil = this.onlineConfigs.date;
				
				if (dateTimeOfLastConfigFetchValidUntil < this.now()) {
					// Sending a request if the validity date and time is passed
					this.showLoadingSymbol(true);
					const newDateTimeOfLastConfigFetchValidUntil = this.dateTimeUpperSlice(this.now(), 10);
	
					this.onlineConfigs = {Configs: {nbCfgs: 0, path: ""}, nbCfgs: 0, date: newDateTimeOfLastConfigFetchValidUntil};

					// Fetch repo's API data
					const xhttp = new XMLHttpRequest();
					xhttp.open("GET", repoAPIUrl, true);
					xhttp.send();

					xhttp.onload = () => {
						// If couldn't find the repo's API data
						if (xhttp?.status != "200") {
							alert("A problem has occured... this configuration file isn't accessible anymore? Let the devs know!");
							return;
						}
						
						const repoContent = JSON.parse(xhttp.response);
	
	
						repoContent.forEach(elem => {if (elem.name == "Configs" && elem.type == "dir") {
							const configsTreeUrl = repoAPIUrl.replace("/contents", "/git/trees/"+elem.sha+"?recursive=true");
							const configsTreeReq = new XMLHttpRequest();
							configsTreeReq.open("GET", configsTreeUrl, true);
							configsTreeReq.send();
	
							configsTreeReq.onload = () => {
								const configsTree = JSON.parse(configsTreeReq.response).tree;
								configsTree.forEach(dir => {
									if (dir?.type == "blob") {
										const path      = dir.path;
										const pathArray = path.split("/");
	
										this.onlineConfigs.nbCfgs++;
										this.onlineConfigs.Configs.nbCfgs++;
										this.onlineConfigs.Configs.path = "Configs";
										this.tempGitConfigParentDirData = this.onlineConfigs.Configs;
										
										pathArray.forEach((dirName, hierarchyIndex, pathArray) => {
											if (hierarchyIndex == pathArray.length-1) {
												const url = repoAPIUrl.replace("api.github.com/repos", "raw.githubusercontent.com").replace("/contents", "/refs/heads/main/") + (this.tempGitConfigParentDirData.path+"/"+dirName).replace(/ /g, "%20");
												this.tempGitConfigParentDirData[dirName] = url;
											}
											else if (!this.tempGitConfigParentDirData[dirName]) {
												const pathSubArray = Object.values(pathArray).splice(0,hierarchyIndex+1);
												this.tempGitConfigParentDirData[dirName] = {nbCfgs: 1, path: `Configs${pathSubArray.length>0 ? "/" : ""}` + pathSubArray.join("/").replace(/ /g, "%20")}
												this.tempGitConfigParentDirData = this.tempGitConfigParentDirData[dirName];
											}
											else if (this.tempGitConfigParentDirData[dirName]) {
												this.tempGitConfigParentDirData[dirName].nbCfgs++;
												this.tempGitConfigParentDirData = this.tempGitConfigParentDirData[dirName];
											}
	
										})
									}
								})
	
								this.tempGitConfigParentDirData = undefined;
								this.saveOnlineConfig();
								this.showLoadingSymbol(false);
								this.openOnlineCfgPickerModal();
							};
						}})
					}
				}
				else {
					// If the validity date and time isn't passed yet, don't send a request and open the online picker menu using the online configs from memory
					this.openOnlineCfgPickerModal();
				}
				
				
			}

			async autoUpdateCheck() {
				const dateTimeOfLastUpdateValidity = this.dateTimeUpperSlice(this.dateTimeOfLastUpdateCheck, 20);

				if (dateTimeOfLastUpdateValidity < this.now()) {
					this.runUpdateCheck();
				}
			}

			async runUpdateCheck() {
				const xhttp = new XMLHttpRequest(); 
				xhttp.open("GET", this.repoScriptRaw, true); 
				xhttp.send(); 
				xhttp.onload = () => {
					this.scriptGitVersion = xhttp.response.match(/\/\/ @version( +)(\d+(\.\d+|\.|)+)/)[2].trim().split(".");
					let newUpdate = false;
					
					if (this.scriptGitVersion.length > this.scriptVersion.trim().split(".").length) {
						newUpdate = true;
					}
					else {
						this.scriptGitVersion.forEach((versElem, versIndex) => {
							if (!newUpdate && Number(versElem) > Number(this.scriptVersion.trim().split(".")?.[versIndex] || -1)) {
								newUpdate = true;
							}
						})
					}
					

					if (newUpdate) {
						this.updateAvailable();
					}
	
				}
			}

			async updateAvailable() {
				const updateAvailableNotif = document.createElement("div");
				updateAvailableNotif.className = "update-available-notif";
				updateAvailableNotif.id = "updateAvailableNotif";
				updateAvailableNotif.innerHTML = `
					<div class="update-available-notif-header">
						<div class="update-available-notif-text">${!this.langIsEn ? "NOUVELLE MISE À JOUR DU TABLEAU DE BORD DISPONIBLE ! v" + this.scriptVersion + " → v"+this.scriptGitVersion.join(".") : "NEW DASHBOARD UPDATE AVAILABLE! v" + this.scriptVersion + " → v"+this.scriptGitVersion.join(".")}</div>
					</div>`;
				updateAvailableNotif.innerHTML += `
					<div class="update-available-notif-btns">
						<div style="display: flex; justify-content: center; width: 50%">
							<a class="update-btn" id="updateBtn" href="${this.repoScriptRaw}" target="_blank">${!this.langIsEn ? "INSTALLER" : "INSTALL"}</a>
						</div>
						<div style="display: flex; justify-content: center; width: 50%">
							<div class="dismiss-update-btn" id="dismissUpdateBtn" title="${!this.langIsEn ? "Ignorer pour aujourd'hui" : "Ignore for today"}">${!this.langIsEn ? "Ignorer" : "Ignore"}</div>
						</div>
					</div>
				`;

				this.ecamDash.insertBefore(updateAvailableNotif, document.querySelector("#dash-header"));
				setTimeout(() => {updateAvailableNotif.classList.add("on")}, 300);

				updateAvailableNotif.querySelector(".dismiss-update-btn").onclick = () => {
					updateAvailableNotif.classList.remove("on");
					setTimeout(() => {updateAvailableNotif.remove()}, 300)

					this.dateTimeOfLastUpdateCheck = this.today; 
					this.saveDateTimeOfLastUpdateCheck();
				};

				updateAvailableNotif.querySelector(".update-btn").onclick = () => {

					this.dateTimeOfLastUpdateCheck = this.now(); 
					this.saveDateTimeOfLastUpdateCheck();

					this.appendFullScreenNotif();
				};
			}
			
		//#endregion






		//#region ____________ — Render — ______________





			//#region Main Dashboard generation





				// MARK: createDashboard
				createDashboard() {
					this.ecamDash.className = "ecam-dash";
					if (this.error) {
						this.ecamDash.style.width = "94%";
						this.ecamDash.style.margin = "40px 3% 30px";
					}
					const averageGenerale = this.averagePonderee(this.grades);
					const totalGrades = this.grades.length;
					const moduleStats = this.getModuleStats();

					document.querySelector(".site-breadcrumbs")?.remove();
					document.querySelector(".portlet-topper")?.remove();

					// Creating the content of the dashboard that doesn't vary along with the user's actions besides the language selection.
					// Therefore, besides the text that doesn't vary with the language, the text isn't yet created, 
					// but will be in the generateContent() method later on, to regenerate the text in case the language is changed
					this.ecamDash.innerHTML = `
					${this.error ? `
					<div class="backup-mode-title">OFFLINE</div>
					<div class="backup-mode-subtitle jura"></div>
					` : ""}

					<div id="emptyDivToRemoveTheDragImage"></div>
					<div class="currently-loading">
						<div class="loading-symbol" style="--offset-offset: calc(0 * 100% / 6)"></div>
						<div class="loading-symbol" style="--offset-offset: calc(1 * 100% / 6)"></div>
						<div class="loading-symbol" style="--offset-offset: calc(2 * 100% / 6)"></div>
						<div class="loading-symbol" style="--offset-offset: calc(3 * 100% / 6)"></div>
						<div class="loading-symbol" style="--offset-offset: calc(4 * 100% / 6)"></div>
						<div class="loading-symbol" style="--offset-offset: calc(5 * 100% / 6)"></div>
					</div>`
					+
					`<div class="over-header-btns jura">

						<div class="over-header-report-btns">
							<div    class="over-header-btn issue mail-info    ${this.lang}">
								<div class="over-header-btn-mail-info-text"></div>
								<div class="over-header-btn-copied-cue"></div>
							</div>
							<a      class="over-header-btn issue share-config ${this.lang}" href="${this.repoUserConfigShare    }" target="_blank" tabindex="-1"></a>
							<a      class="over-header-btn issue suggest-idea ${this.lang}" href="${this.repoUserSuggestionIssue}" target="_blank" tabindex="-1"></a>
							<a      class="over-header-btn issue report-issue ${this.lang}" href="${this.repoUserReportIssue    }" target="_blank" tabindex="-1"></a>
							<button class="over-header-btn issue issue-btn" id="reportIssueBtn" tabindex="0">🚩</button>
						</div>

						<div class="over-header-help-btns">
							<div class="over-header-btn how-to-use-btn">?</div>
							<div class="over-header-how-to-use-btns" style="display: none">
								<a   class="over-header-btn help doc-btn fr"  href="${this.repoReadMeHowToUse}" target="_blank" >${this.createExternalLinkSymbol({margin: [0,0,0,4]})}</a>
								<div class="over-header-btn help keybinds-btn fr"></div>
								${`<div class="over-header-btn help tuto-btn fr"></div>` + ""}
								<div class="over-header-btn help first-steps-btn fr"></div>
							</div>
						</div>

						<div class="over-header-btn settings-btn">⚙️</div>

					</div>`
					+
					`<div id="dash-header">
						<div style="display: flex;flex-direction: row;" id="aui_3_2_0_1305">
							<img draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/5/51/ECAM-LaSalle-bleu-seul.png" alt="ECAM Logo" style="margin: 0px 0px 0px -10px;height: 141px;width: 148px; user-select: none;" id="aui_3_2_0_1304">
							<div style="margin: 30px 0px 0px 0px;">
								<div class="dash-title">
									<div class="dash-title-text"></div>
									<a class="patch-notes-link" id="patchNotesLink" href="${this.patchNotes}" target="_blank"><div>${this.scriptVersion}</div><div>${this.createExternalLinkSymbol()}</div></a>
								</div>
								<div class="dash-subtitle jura"></div>
								<div style="display: flex; gap: 2px; user-select: none;">
									<div class="lang-btn ${this.langIsEn ? "active" : ""}" id="en-lang-btn">
										<img style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇬🇧" src="${`
												data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAECUExURUdwTL6/w7pOXQcmd3aItpsCC7IaMURBdgAKW8rJy7QIJtPS0gIUZgASY7h7hZ4BDgADTwMofAASYxEka8/KywATZby0uQgda6gFGbpoc6QTIgAHVgAdcrC0v56jsszMzKkCFk1djU1Yg32Prv///8sBGNMHJs8CHdQLLAAegwATeNEDIAAujwAKZtYRMgANa9YgPAAoiP79/cQAEeZ9i+vt89Xc6wEKXPn3+N9vfhg/lOmKlwImfPPKzwIZb83U5fvu8AADTdtGXN9YaoydwxcwgfK8w11zrPfV2UNfovnh5Nk0TOycp7jD2t3d3TFLk6iz0fCttqsBEr0OLcy5vMWboL7jb4MAAAAkdFJOUwD+/X39/3kQfoH+/ShvJ4HW15JNuady6j+76b+/7/FQt331fQrzi9EAAAaxSURBVFjD7Zhpe6JYE4bd2mVMJz0TJ1t30t3zIiIkigjIIkoDsrihifn/f+WtOueAmjhz9XybD/1ovEyE26eqTp0lhcIv/dJ/VzXQWY3oX913fr5HnF1+/OPPL78zffnzj/LHy7Pzn+HVbi5uGwz4tdWqWOPxYHys3+9btxfVm5t/4NXOq9/uSjsE1b62muv1urmJrMHgkTxRCJoVm+ZvoLtvt42ry7Ozo4ghCWeXjVbp+bm0azYK51etNUozFGMaWY+HGlhTzXx5QZTZvJ9dX3+BiOvlj6ByHfJwfV3ZIcdZA6haMl8doHCKwnHGJjnAAEhXVKEnCC8v5ro4m+Tq9+HZf5oFu9Jw6MUcAb28yJ4auhyVHlgZBkRBIMFWpla32x2L4h6XrhxPkoCjrB++E5AsL/zlXCEkZZWZgjxlIEGwOd3qDsgjU6SHC8LhuOKsDqEtZLkHLC9DaRVr8EgfWWgZCCmM9BhoW1mSfOAoWjqqFxrN3Vb1ZIQBipAMMEUrR0CCkDnaY7rpyrV7Eu/jHVr0BKD/BStNmW/NBUQg+6FBMxU9Dvah5Y5yzCDSY5+XBNUlHBFB5bGVVFaa4agEZcY0vMA6cCTsHRFZgYbp6dmMw0BQHysJdCMmqMXSpTlPGYhHDn8IiqauDemRlwrj7EFY6YpuOKa8N6VHp0Fgx4GwJM/hMs4RiKDcrYemtgat3mMG4nPQAC5CO4I5p98m7kHjfCyngTa35Z4gq+QqI0gIiOdzULIyQrQjL8l3TRPCEUdHjrBfyYUwFnwH41emGoB4PnOEX6SCHZ5+zK1SkYEm5b0jK4mCYDM1ONdxnNCh44BDkEAdJRDVEoolyaRa0JgW41jRQ4OCoGorHTuXKX9DQCDJ5jTdDX1hb0cLBgjpzqKN3mwiaJAEU+3g3iPtQZxrL4DDhgekuSsO0qSy0Q1OaRavCuVko9HGmMfh1lZVE6Sq9nLrxHNXUVQpAxlzJ9wu6djgtE0F8qDTBLivpSr02lqBa0Lb92AQYT/wPB3MPXnh+aqXOzo2nf/iOrb3/OGi0FivsdOg6LSpiDC/pOoS+YGHH8auYbyJX3HBgNdrDwloZ6IVMnvlKJ5xmKBSPPozMeIQiho7GKUNd/Lt9rDdRhBMbD3G6b2xk7nBJ1Gn05F4AScvCKDTJgwUcVT97YXZEU7akY4FrDZT/uYtKDOUYagb9rrnEB1S2sMD0GF6hKPcvLHDIJ09Bkk56DDLp5Jz6KZ95Idw2h9yUGaGZhIH1InkUDfv/WBoVQIiww+qy4oLtcXiqr4Hw+sYw0hHfoZtufTaQBDY8O0Q+uHNcDNc6BqvwzBYp3dBIQWWxGaRgHw7dt/3fda01IxnYgtJxyQB1ujtnDVttfRKKYY2XW2CDZuHYggyxmsYSEV/dDibPggaG9p6Tm/VHv4qs6bVVkGUWoNuotNG3C6gKRYwgSlqm8SlUrPKu9kG9jBBOvqBK+1a20TpgM7sZEZRYlOAZlhsXZjrTJoZ9eRkpemrSjLrP/1AULFCKV3RCkhc7lKG9Mr2XMPJH0GQlwxkwCwcQ0qN6WYTRMls0n8CIej7bMJW4nRFzDs+2JHVWNuk4myKoDZxpOnk4xAXLN8xNmkfGYRDQOXJhC58ND1gp9Ph8cKkK2Yg4miabNgXQdVh/tej8VOmQ1BE0gNbA7CzdKcwI4sMRCoOoNk4INe4tgDDxwth0zJ+BxoQjgJbA7QDWwi6zlBQm4H6YjQleQo9MCWYobaqzPIclfsIIuUyMCwwPU264mlQn+UREgCDmjcdQw/SydMIQXUEEY6rCh3JC7VgJoqnQZBeGp5CM4WuXLBFxhGCSFxzk+/w5lyPuuLfg2A7S8PDMTvEVoNtnqE9RN8RRDm+1IGdU74MH4GGWWjgqT+jbaTArgRRQ+ja191Vof6UICf2pM5iq1UO7Ij9U47QFGsAJVYpavjhrlqop0X4I9kwO2y3k3MYCKevQ1Afck57W4ltEiDOkN/voWmdBUwUzirts3Exwhe4IQ/tEISfjSt6ttBuTfkZQdC0XAzY0q4yGb3V5H5deibm9yDaFqOUbRkUY717Ld2Rtd8hB5zK9afPcGSp45GlDkeWz58/ja4fiqUPoOdnU1uNn6gbanvUh02Zoa2bRVDrqoYbduS06Cmq8OYUddW4/XaHqFLxAYbdkd0fo78ekHLf+Ir3NXalu29VONnV/vZkd3NTvbhtPVz/eCdANb6yU+jV7cXNT503zy8vP2LEn5ggD3BWrZ061v7s6blGjpK1X/9K+KX/sP4PsW55UIo2Nb0AAAAASUVORK5CYII=
										`}">
									</div>
									<div class="lang-btn ${!this.langIsEn ? "active" : ""}" id="fr-lang-btn">
										<img style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇫🇷" src="${`
											data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACTUExURUdwTAAkjM7Pzs7OzrMGE74QIMPEx4hTeAAkjQARewAagbIFEgAfhc3NzdDQ0M7PzrYMG8zMzbcMG8EXKcUbLQAMd7UKGLUKGMMWJ7OhrcMVJv///+oPIO4bLgAmoOwWKAAZmQArpO8iNgAfnQATlAIyqLUGFAEoksUSIwAYhgANePnCyMbO6djY2NUWJ+7u7sCep4f8c74AAAAbdFJOUwDL+z19ffsVe3qU1jy51pA+bLyNc+Vrnu+m2KjIWToAAALxSURBVFjD7djJcuIwEIDhAAMOxuwTCAnyKgxOxg7v/3SjtraWDJKTUw60K1Vc+OqX5APK09NjHvOLJxDz3a+t9Mcoeg7DgZrDcrkejUZBL2X7NuYfo4gRZ2MmNZvhYjEHz1EYrHab18tl3LaEEonFnOPT5KtWM1zMhReY27DabUG5ABQ8cyXLTnIy9pz+vcN8seFWPRxC32G7Hf+FGW/3m7fXVmkagJ5NpGXYCOjd5Or6ejGmaRpCctJw6HTqOgaEvM8GT07ynP0RXhTbSqcIzWduDWOIgHBRJqmeELkJtQB34v4QUUs7o8MSC4t7FYECkF2UKYW9Sb2KRI8FqVWB06OI4KJSQRnuyXoUiW0mHUj2iPFAJEdOoiGVE/OV+SCxqLxTpI+LT+GGcE8Cj4AypAiqcEDyrPTSFHSS25zxnMIH6W2GnsQsitVGM8sBEf36AAOOASkDHg+EcuyiWLw+TAHGCdk5EqrOKqhQjgfCJ8ahPxxCx1W0K0tdUG4qCJKrAoMXpd4i7BwFpM+rkJNmbijh7w+xIHRanPFAiXx/khuQ7mFM6i9CzFFAlQiSDHPcRQneoCM8uqhA29NOfB/Sr48MUkWF3uY0bVfmgqyF6aIKHVcqgpxFMETlGHtkrMoDdXKYVMqlqRxhUReUmBuNiro9KXVCcllcOaoiq4emlPaAOJMoaCogHdNSXgg7GEqRRL1FR709FqRzKO0PdYt0D6X+IrWqTlGnh9LzPYgk1rIQlKogqqj70NHYZgR9VN0eJ2Ttj1GkT6udygN1BhVR/vQp6m6RUYRzfl5k1lSeItfSOFBVH3KqCfw8vwPZTRddhAgx1+GE3T6GdW2CN4oYU5Y7gITy8jIIwymfMDzM54tJOy1XC86E2G0GlHKzCxjUIoNwGtmXqGA0Wi+X0uPgVd1DhFGWs/0KvjgFhSGOyyl4su9aGjPbcAWglzDqdd9k99L1ennYzMRs9tvdaqW/GkXfvAbL+/NT8PhXwmN+7/wHgdqiCaxyTNQAAAAASUVORK5CYII=
										`}">
									</div>
								</div>
							</div>
						</div>
						
						<div class="header-actions jura" style="display:flex; align-items:center; user-select: none;">

							<button class="btn btn-edit-mode ${this.editMode ? "on" : "off"}" id="editModeBtn"></button>
							<div class="config-btns-container">
								<div class="btn btn-export" id="exportBtn"></div>
								<div class="btn btn-import" id="importBtn"></div>
								<div class="import-menu" id="importMenu" style="display: none">
									<div class="import-menu-body">
										<div style="position: relative; bottom: 44px; right: -426px; width: 0; height: 0">
											<svg viewBox="0 0 2 1" style="width: 28px; height: 14px;">
												<polyline fill="white" stroke="none" points="0,1 1,0 2,1"></polyline>
											</svg>
										</div>
										<div class="import-menu-btn file">
											<div></div>
											<img src="https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png" style="height: 100%;">
										</div>
										<div class="import-menu-btn clear">
											<div></div>
										</div>
										<div class="import-menu-btn online">
											<img src="https://cdn-icons-png.flaticon.com/512/9205/9205302.png" style="height: 100%;">
											<div></div>
										</div>
									</div>
								</div>
							</div>

						</div>

					</div>`
					+
					`<div class="main-average-card" id="main-average-card">
						<div class="average-display">
							<div class="average-number" ${this.error ? "style=\"padding-top: 0px;\"" : ""}>${averageGenerale}</div>
							<div class="average-label"></div>
						</div>
						<div class="average-stats">
							<div class="stat-item"><div class="stat-value">${totalGrades                       }</div><div class="stat-label"></div></div>
							<div class="stat-item"><div class="stat-value">${Object.keys(this.semesters).length}</div><div class="stat-label"></div></div>
							<div class="stat-item"><div class="stat-value">${moduleStats.validated}/${moduleStats.total}</div><div class="stat-label"></div></div>
						</div>
					</div>


					<div class="new-grades-card ${this.newGrades.length == 0 ? "none" : ""}">
						<div class="new-grades-card-header ${this.newGrades.length == 0 ? "none" : ""}">
							<div class="new-grades-card-title${this.newGrades.length == 0 ? " none" : ""} jura"></div>
							<div style="display:flex; font-size: 15px; font-weight: 600; color: #2A2F72;${this.newGrades.length == 0 ? " display: none;" : ""}" >
								<div class="new-grades-mark-as-read-text" style="display:flex"></div>
								<div class="new-grades-mark-as-read" style="margin-right: 10px; cursor:pointer; font-size:25px; display:flex">✅</div>
							</div>
						</div>
					</div>

					<div class="controls-bar">
						<div class="filter-tabs">
							<button class="filter-tab ${this.currentSemester == "all" ? "active" : ""}" id="filter-tab-all-semesters" data-filter="all"></button>
							${Object.keys(this.semesters).sort((a,b) => a-b).map(s => `<button class="filter-tab ${s == this.currentSemester ? "active" : ""}" id="filter-tab-semester-${s}" data-filter="${s}">S${s}</button>`).join('')}
						</div>
						<div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 8px;">
							<div class="view-toggle">
								<div class="jura" style="padding: 0px 5px 0px 8px; font-size: 14px; font-weight: 500"></div>
								<button class="view-btn ${this.viewMode == "detailed" ? "active" : ""}" id="view-btn-detailed" data-view="detailed">📊</button>
								<button class="view-btn ${this.viewMode == "compact"  ? "active" : ""}" id="view-btn-compact"  data-view="compact" >📋</button>
							</div>
							<div class="fold-toggle jura ${this.lang}"></div>
						</div>
					</div>`
					+
					`<div class="drop-field remove-from-module${this.selectedSubjectCardsId.length > 0 ? " show" : ""}">
						<div class="drop-field-remove-from-module-text top${!this.langIsEn ? " fr" : " en"}"></div>
						<div class="drop-field-remove-from-module-minus">-</div>
						<div class="drop-field-remove-from-module-text bottom${!this.langIsEn ? " fr" : " en"}"></div>
						<div class="drop-field-remove-from-module-hitbox"></div>
					</div>

					<div class="content-area" id="contentArea"></div>

					<div class="drop-field create-module ${this.lang}${this.selectedSubjectCardsId.length > 0 ? " show" : ""}">
						<div class="drop-field-create-module-text top ${this.lang}"></div>
						<div class="drop-field-create-module-plus">+</div>
						<div class="drop-field-create-module-text bottom ${this.lang}"></div>
						<div class="drop-field-create-module-hitbox"></div>
					</div>

					`;

					const notifContainer = document.createElement("div");
					notifContainer.className = "selected-card-notif-container";

					const intranetFold = document.querySelector(".intranet-fold");
					if (intranetFold) {
						intranetFold.parentNode.insertBefore(this.ecamDash, intranetFold);
					}
					else {
						Object.values(document.body.children).forEach(child => {child.remove()});
						document.body.appendChild(this.ecamDash);
					}
					this.ecamDash.insertBefore(notifContainer, this.ecamDash.querySelector("#dash-header"));

					// Create the new grades notification and its associated new grades table if at least one new grade is detected
					this.createNewGradesNotifDiv();

					if (this.error) {
						setTimeout(() => {
							const backupTitle = document.querySelector(".backup-mode-title");
							const backupSubTitle = document.querySelector(".backup-mode-subtitle");
							backupTitle.classList.add("show");
							backupSubTitle.classList.add("show");
						}, 1)
					}

					this.generateContent({manageIndividualCardFolding: false, fadeIn:false});
				}


				
				//MARK: language Sensitive
				async languageSensitiveContent(fadeIn=true) {
					// Language Sensitive text in the Dashboard Header and Semester filter tab (which doesn't refresh on calling the generateContent() method)
					if (this.error) {
						const backupSubTitle = document.querySelector(".backup-mode-subtitle");
						backupSubTitle.innerHTML = !this.langIsEn 
							? `Les serveurs de l'ECAM sont actuellement inaccessibles ! ${this.grades.length > 0
								? "Pour l'instant, tu ne peux pas voir si tu as des nouvelles notes... En attendant, voici le tableau de bord en mode backup, tu as donc accès aux notes que j'ai gentiment sauvegardées dans le cache la dernière fois ! De rien ! <3" 
								: "Pour l'instant, tu ne peux pas voir tes notes... Tu peux quand même commencer à configurer tes modules, reviens quand les serveurs sont opérationnels pour voir tes notes !"
							}` 
							: `ECAM's servers are currently down! ${this.grades.length > 0 
								? "For now, you can't see if you have new grades... While waiting for the servers to be back up, here are the grades I nicely saved in your cache last time, so you can still see them even with the server down! You're welcome! <3" 
								: "For now, you can't see your grades... You can still start by configuring your modules, and come back once the servers are up again to see your grades!"
							}`
						;
					}
					

					const dashTitle             = document.querySelector(".dash-title-text");
					const dashPatchNotesLink    = document.querySelector(".patch-notes-link");
					const dashSubtitle          = document.querySelector(".dash-subtitle");
					dashTitle.innerHTML         = !this.langIsEn ? 'Tableau de Bord des Notes ECAM' : "ECAM Grades Dashboard";
					dashPatchNotesLink.title    = !this.langIsEn ? "Aller voir les notes de cette mise à jour" : "Go see this update's notes";
					dashSubtitle.innerHTML      = !this.langIsEn ? 'Vue complète de vos résultats académiques !' : "Complete view of your academic results!";

					const infoNotif     = document.querySelector(".temp-notif");
					if (infoNotif) {
						infoNotif.classList.toggle("fr");
						infoNotif.classList.toggle("en");
					}

					const frBtn = document.querySelectorAll("#fr-lang-btn");
					const enBtn = document.querySelectorAll("#en-lang-btn");
					frBtn.title = !this.langIsEn ? "Maj+L" : "Shift+L";
					enBtn.title = !this.langIsEn ? "Maj+L" : "Shift+L";

					const reportIssueBtn    = document.querySelector(".issue.issue-btn");
					const mailInfo          = document.querySelector(".issue.mail-info");
					const mailInfoText      = document.querySelector(".over-header-btn-mail-info-text");
					const mailInfoCopied    = document.querySelector(".over-header-btn-copied-cue");
					const shareConfig       = document.querySelector(".issue.share-config");
					const suggestIdea       = document.querySelector(".issue.suggest-idea");
					const reportIssue       = document.querySelector(".issue.report-issue");

					const helpMenu          = document.querySelector(".over-header-btn.how-to-use-btn");
					const docBtn            = document.querySelector(".over-header-btn.doc-btn");
					const keybindsBtn       = document.querySelector(".over-header-btn.keybinds-btn");
					const tutoBtn           = document.querySelector(".over-header-btn.tuto-btn");
					const firstStepsBtn     = document.querySelector(".over-header-btn.first-steps-btn");

					const settingsBtn       = document.querySelector(".over-header-btn.settings-btn");

					const newUserNotif      = document.querySelector(".new-user-notif");
					const newUserNotifText  = document.querySelector(".new-user-notif-text");

					if (!this.langIsEn) {
						reportIssueBtn  .title     = "Signaler...";
						mailInfo        .title     = "Clique pour copier mon adresse email !";
						shareConfig     .title     = "Partage une configuration sur mon GitHub";
						suggestIdea     .title     = "Suggère une idée sur mon GitHub";
						reportIssue     .title     = "Signale un problème sur mon GitHub";

						helpMenu        .title     = "Comment s'en servir?";
						docBtn          .title     = "Aller vers la documentation";
						keybindsBtn     .title     = "Voir les raccourcis clavier";
						tutoBtn         .title     = "Démarrer le tutoriel";
						firstStepsBtn   .title     = "Démarrer le tutoriel pour vos premiers pas";

						settingsBtn     .title     = "Ouvrir les paramètres";

						if (newUserNotif) 
							newUserNotif.title     = "Clique pour fermer";

						shareConfig     .innerHTML = `Partager une config  ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						suggestIdea     .innerHTML = `Suggérer une idée    ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						reportIssue     .innerHTML = `Signaler un problème ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						mailInfoText    .innerHTML = "Par mail: baptiste.jacquin@ecam.fr 📋";
						mailInfoCopied  .innerHTML = "Copié !";

						if (newUserNotif) 
							newUserNotifText.innerHTML = "Bonjour! Première fois? Clique ici pour apprendre à utiliser cette extension! (Clique ici pour fermer)";

						mailInfo   .classList.replace("en", "fr");
						shareConfig.classList.replace("en", "fr");
						suggestIdea.classList.replace("en", "fr");
						reportIssue.classList.replace("en", "fr");

						docBtn       .classList.replace("en", "fr");
						keybindsBtn  .classList.replace("en", "fr");
						tutoBtn      .classList.replace("en", "fr");
						firstStepsBtn.classList.replace("en", "fr");
					}
					else {
						reportIssueBtn  .title     = "Report...";
						mailInfo        .title     = "Click to copy my email adress!";
						shareConfig     .title     = "Share a configuration on my GitHub";
						suggestIdea     .title     = "Suggest an idea on my GitHub";
						reportIssue     .title     = "Report an issue on my GitHub";

						helpMenu        .title     = "How to use?";
						docBtn          .title     = "Go to the documentation";
						keybindsBtn     .title     = "See the keyboard shortcuts";
						tutoBtn         .title     = "Start the tutorial";
						firstStepsBtn   .title     = "Start the tutorial for your first steps";

						settingsBtn     .title     = "Open the settings";
						
						if (newUserNotif) 
							newUserNotif.title     = "Click to dismiss";

						shareConfig     .innerHTML = `Share a config  ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						suggestIdea     .innerHTML = `Suggest an idea ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						reportIssue     .innerHTML = `Report an issue ${this.createExternalLinkSymbol({margin: [0,0,0,4]})}`;
						mailInfoText    .innerHTML = "By mail: baptiste.jacquin@ecam.fr 📋";
						mailInfoCopied  .innerHTML = "Copied!";

						if (newUserNotif) 
							newUserNotifText.innerHTML = "Hey! New here? Click here to find a tutorial on how to use this extension! (Click here to dismiss)";

						mailInfo   .classList.replace("fr", "en");
						shareConfig.classList.replace("fr", "en");
						suggestIdea.classList.replace("fr", "en");
						reportIssue.classList.replace("fr", "en");

						docBtn       .classList.replace("fr", "en");
						keybindsBtn  .classList.replace("fr", "en");
						tutoBtn      .classList.replace("fr", "en");
						firstStepsBtn.classList.replace("fr", "en");
					}
					

					const keybindsTableModalBody = document.querySelector("#keyboardShortcutListModalBody");
					if (keybindsTableModalBody) { this.appendKeyboardShortcutsList(keybindsTableModalBody); }

					const settingsModal = document.querySelector("#settingsModal");
					const settingsModalBody = document.querySelector("#settingsModalBody");
					if (settingsModal) { if (settingsModalBody) {settingsModalBody.remove()} this.appendSettingsModalBody(); }

					
					
					const importBtn     = document.getElementById("importBtn");
					const editModeBtn   = document.getElementById("editModeBtn");
					const exportBtn     = document.getElementById("exportBtn");
					importBtn   .innerHTML  = `${!this.langIsEn ? "Importer Config": "Import Config"}<span class="btn-icon">⬇️</span>`;
					editModeBtn .innerHTML  = `<div style="display:flex; flex-direction:column; gap:3px"><span style="font-size:40px">🖊️</span><div class="jura">${!this.langIsEn ? "Mode Édition" : "Edit Mode"}</div></div>`;
					exportBtn   .innerHTML  = `${!this.langIsEn ? "Exporter Config": "Export Config"}<span class="btn-icon">⬆️</span>`;
					editModeBtn .title      = !this.langIsEn ? "Maj+E" : "Shift+E";
					if (this.editMode) {editModeBtn.classList.add('on')}
					else    {editModeBtn.classList.remove('on')}
					
					const importMenu    = document.getElementById("importMenu");
					const importFile    = importMenu.querySelector(".import-menu-btn.file");
					const importClear   = importMenu.querySelector(".import-menu-btn.clear");
					const importOnline  = importMenu.querySelector(".import-menu-btn.online");

					importFile.children[0].innerHTML   = !this.langIsEn ? "Importer un fichier de configuration .json"   : "Import a .json configuration file";
					importClear.innerHTML              = !this.langIsEn ? "Effacer Config" : "Clear Config";
					importClear.title                  = !this.langIsEn ? "Clique ici pour effacer ta configuration actuelle" : "Click here to clear your current configuration";
					importOnline.children[1].innerHTML = !this.langIsEn ? "Obtenir un fichier de configuration en ligne" : "Get a configuration file online";

					const onlineCfgPickerHeader = document.querySelector(".online-cfg-picker-menu-header");
					if (onlineCfgPickerHeader) {
						onlineCfgPickerHeader.innerHTML = !this.langIsEn 
							? "Note: Choisir une configuration effacera les traces de configuration pré-existante de l'année correspondante, mais pas des autres années" 
							: "Tip: Choosing a configuration will erase all traces of pre-existing configuration of the corresponding year, but not of the other years"
						;
					}

					if (!this.langIsEn) {
						document.querySelectorAll(".drop-module-card-insert-text, .drop-field-remove-from-module-text, .drop-field-create-module-text").forEach(dropFieldText => {
							dropFieldText.classList.replace("en", "fr")
						})
						document.querySelectorAll(".online-cfg-picker-menu-dir-tree-header").forEach(dirTreeHeader => {
							dirTreeHeader.classList.replace("en","fr")
						})
					}
					else {
						document.querySelectorAll(".drop-module-card-insert-text, .drop-field-remove-from-module-text, .drop-field-create-module-text").forEach(dropFieldText => {
							dropFieldText.classList.replace("fr", "en")
						})
						document.querySelectorAll(".online-cfg-picker-menu-dir-tree-header").forEach(dirTreeHeader => {
							dirTreeHeader.classList.replace("fr","en")
						})
					}


					const avgLabel = document.querySelector(".average-label");
					avgLabel.innerHTML  = `/20 ${!this.langIsEn ? "Moyenne Générale" : "Global Average"}`;

					const statLabelsArray = document.querySelectorAll(".stat-label");
					statLabelsArray[0].innerHTML = !this.langIsEn ? "Notes" : "Grades";
					statLabelsArray[1].innerHTML = !this.langIsEn ? "Semestres" : "Semesters";
					statLabelsArray[2].innerHTML = !this.langIsEn ? "Modules Validés" : "Validated module";

					const allFilterTabs = document.querySelectorAll(`.filter-tab`);
					allFilterTabs.forEach(tab => {
						if (tab.dataset.filter == "all") {tab.innerHTML = !this.langIsEn ? `Tous` : `All`}
						tab.title = !this.langIsEn ? `Maj+Flèche Droite/Gauche` : `Shift+Left/Right Arrow`;
					})

					document.querySelector(`.view-toggle`).children[0].innerHTML = !this.langIsEn ? `Basculer le mode d'affichage` : `Toggle display mode`;
					document.querySelector(`.fold-toggle`)            .classList.replace(this.langIsEn ? "fr" : "en", this.lang)
					document.querySelector(`.view-toggle`).children[0].title     = !this.langIsEn ? `Maj+D` : `Shift+D`;
					document.querySelector(`.fold-toggle`)            .title     = !this.langIsEn ? `Maj+F` : `Shift+F`;


					const viewBtnsArray = document.querySelectorAll(".view-btn");
					viewBtnsArray[0].title = !this.langIsEn ? "Vue détaillée" : "Detailed view";
					viewBtnsArray[1].title = !this.langIsEn ? "Vue compacte" : "Compact view";

					const intranetSubtext = document.querySelector(".intranet-subtext");
					if (intranetSubtext) intranetSubtext.innerHTML = !this.langIsEn ? "Afficher le tableau des notes d'Espace ECAM" : "Show ECAM Intranet's Grades Table";

					const updateNotif = document.querySelector(".update-available-notif-header");
					if (updateNotif) {
						updateNotif.querySelector(".update-available-notif-text").innerHTML = !this.langIsEn ? "NOUVELLE MISE À JOUR DU TABLEAU DE BORD DISPONIBLE ! v" + this.scriptVersion + " → v"+this.scriptGitVersion.join(".") : "NEW DASHBOARD UPDATE AVAILABLE! v" + this.scriptVersion + " → v"+this.scriptGitVersion.join(".");
						updateNotif.querySelector(".update-available-notif-btns").children[0].innerHTML = !this.langIsEn ? "INSTALLER" : "INSTALL";
						updateNotif.querySelector(".update-available-notif-btns").children[1].innerHTML = !this.langIsEn ? "Ignorer" : "Ignore";
						updateNotif.querySelector(".update-available-notif-btns").children[1].title     = !this.langIsEn ? "Ignorer pour aujourd'hui" : "Ignore for today";
					}

					if (document.querySelector(".new-grades-card").children.length > 1) {document.querySelector(".new-grades-card").children[1].remove()}
					document.querySelector(".new-grades-card-title").innerHTML = `
						${this.newGrades.length > 0 
							? `${!this.langIsEn 
								? `${this.newGrades.length} Nouvelle${ this.newGrades.length > 1 ? "s" : ""} Note${this.newGrades.length > 1 ? "s" : ""} !` 
								: `${this.newGrades.length} New Grade${this.newGrades.length > 1 ? "s" : ""}!`
							}` 
							: `${!this.langIsEn 
								? `Pas de nouvelle note${this.error ? ", que je sache (mode backup)" : ""}` 
								: `No new grade${this.error ? ", as far as I know (backup mode)" : ""}`
							}` 
						}
					`;
					document.querySelector(".new-grades-mark-as-read-text").innerHTML = !this.langIsEn ? "Marquer comme lu" : "Mark as read";
					document.querySelector(".new-grades-mark-as-read").title = !this.langIsEn ? "Marquer comme lu" : "Mark as read";
					

					document.querySelectorAll(".selected-card-notif-div").forEach(notifDiv => {
						notifDiv.children[2].innerHTML = !this.langIsEn ? `est sélectionné!` : `is selected!`;
					})

					if (fadeIn) {
						this.ecamDash.parentElement.classList.add("fade-in");

						clearTimeout(this?.timeouts?.renderFadeIn);
						this.timeouts.renderFadeIn = setTimeout(() => {this.ecamDash.parentElement.classList.remove("fade-in")}, 300);
					}
				}



				//MARK: create new grades notif
				createNewGradesNotifDiv() {
					let newGradesNotif = document.querySelector(".new-grades-notif");

					if (!newGradesNotif) {
						newGradesNotif = document.createElement("div");
						newGradesNotif.className = "new-grades-notif";
						this.ecamDash.appendChild(newGradesNotif);
						setTimeout(() => {if (this.newGrades.length > 0) {
							document.querySelector(".new-grades-notif").classList.add("on")
						}}, 1)
					}

					newGradesNotif.innerHTML = !this.langIsEn 
						? `${this.newGrades.length} NOUVELLE${ this.newGrades.length>1 ? "S !" : " !"} NOTE${this.newGrades.length>1 ? "S !" : " !"}` 
						: `${this.newGrades.length} NEW GRADE${this.newGrades.length>1 ? "S!"  : "!" }` 
					+ `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌</button>`;
				}



				// MARK: renderRecentGrades
				renderRecentGrades() {
					const newGradesCard = document.querySelector(".new-grades-card");
					const grades = {};
					
					if (this.newGrades.length > 0) {

						// sorting the new grades by subjects
						this.newGrades.forEach((grade => {
							if (!grades[grade.subject]) {
								grades[grade.subject] = [grade];
							}
							else {
								grades[grade.subject].push(grade)
							}
											
						}))
						
						let html = `<div class="new-grades-content">`;
						Object.keys(grades).forEach(subject => {
							html += `
							<div class="new-grades-subject-card" id="new-grades-subject-card-${subject}" data-subject="${subject}" data-module="${grades[subject][0].module}" data-semester="${grades[subject][0].semester}">
								<div class="new-grades-subject-card-title" data-subject="${subject}" data-module="${grades[subject][0].module}" data-semester="${grades[subject][0].semester}">
									${subject}
								</div>
							<table class="new-grades-table">`;
							
							grades[subject].forEach(grade => {
								html +=
									`<tr class="new-grades-table-grades" id="new-grade-${subject}-${grade.type}" data-subject="${subject}" data-type="${grade.type}" data-semester="${grade.semester}">
										<td style="width: 25%;padding: 5px 5px 5px 10px;" data-subject="${subject}" data-semester="${grade.semester}">${grade.type}</td>
										<td style="width: 9%;"><span class="grade-value grade-${this.getGradeColor(grade.grade)}" data-subject="${subject}" data-semester="${grade.semester}">${grade.grade}/20</span></td>
										<td style="width: 8%;" data-subject="${subject}" data-semester="${grade.semester}">${grade.coef}%</td>
										<td style="width: 8%;" data-subject="${subject}" data-semester="${grade.semester}">${grade.classAvg}/20</td>
										<td style="width: 10%;" class="grade-date" data-subject="${subject}" data-semester="${grade.semester}">${grade.date}</td>
										<td style="width: 25%;font-size:12px;color: #999;" data-subject="${subject}" data-semester="${grade.semester}">${grade.prof}</td>
									</tr>`;
							})
							html += `</table></div>`;
						})
						html += `</div>`;
						newGradesCard.innerHTML += html;
					}
				}



				// MARK: — GenerateContent
				generateContent({manageIndividualCardFolding=true, fadeIn=true}={manageIndividualCardFolding: true, fadeIn: true}) {

					if (fadeIn == "big") {this.languageSensitiveContent(true);}
					else {this.languageSensitiveContent(false);}
					
					
					// Call renderRecentGrades to... well... render the recent grades' section
					this.renderRecentGrades()


					if (!manageIndividualCardFolding) {
						this.detailedSubjCardsId = [], this.compactSubjCardsId = [];
					}

					// Content area, refreshing often
					const moduleStats = this.getModuleStats();
					const validatedEUsStatLabel = document.querySelectorAll(".stat-value")[2];
					validatedEUsStatLabel.innerHTML = `${moduleStats.validated}/${moduleStats.total}`;

					let semesterKeys = [];
					if (this.currentSemester === "all") {
						semesterKeys =  Object.keys(this.semesters).sort((a,b) => a-b);
					}
					else if (this.currentSemester === "last") {
						semesterKeys = [Object.keys(this.semesters).sort((a,b) => a-b).at(-1)];
					}
					else {
						semesterKeys = [this.currentSemester];
					}
					
					const contentArea = document.getElementById("contentArea");
					contentArea.innerHTML = "";
					semesterKeys.forEach(sem => {
						const section = document.createElement("div");
						contentArea.appendChild(section);
						section.className   = `semester-section`;

						const semData               = this.gradesDatas[sem];
						const semAvg                = semData.average;
						const semClassAvg           = semData.classAvg;
						const avgColor              = Object.keys(this.semesters[sem]).length > 0 ? (semAvg >= 10 ? "good" : "bad") : "";
						const avgSymbol             = isNaN(semAvg) ? "" : `${semAvg >= 10 ? '✅' : '⚠️'}`;
						const unclassifiedLength    = Object.keys(semData["__#unclassified#__"].subjects).length;
						const moduleConfig          = this.moduleConfig?.[sem] || {};

						section.innerHTML = `
						<div class="semester-header" data-semester="${sem}">
							<div class="semester-info">
								<div class="semester-name jura">📚 ${!this.langIsEn ? 'Semestre' : "Semester"} ${sem}</div>
									<div class="semester-averages ${avgColor}">
										<span class="semester-average-symbol">${avgSymbol}</span>
										<span class="semester-average">${semAvg}/20</span>
										<span class="semester-class-average-vs-average jura" style="color: black${isNaN(semClassAvg) ? `; display: none` : ""}">vs</span>
										<span class="semester-class-average" style="color: black; font-size: 15px${isNaN(semClassAvg) ? `; display: none` : ""}">${semClassAvg}/20</span>
									</div>
								</div>
							<div class="semester-toggle open fold-icon">△</div>
						</div>`;
						section.innerHTML += `
						<div class="semester-content show${this.selectedSubjectCardsId.length > 0 || this.selectedModuleCardsId.length > 0 ? " dragging" : ""}${this.editMode ? " edit" : ""}${fadeIn ? " fade-in" : ""}" id="sem-content-${sem}">
							<div class="semester-grid">
								<div class="modules-section ${this.editMode ? "edit" : ""}" id="modules-section" ${moduleConfig?.__modules__ ? "" : "style=\"display: none\""}>
									${this.createAllModuleCards(sem, manageIndividualCardFolding)}
								</div>
								<div class="unclassified-section" id="unclassified-section" style="${unclassifiedLength > 0 ? `` : `; display: none`}">
									<div class="unclassified-title jura">
										${!this.langIsEn ? `Matière${unclassifiedLength > 1 ?  `s` : ``} non classée${unclassifiedLength > 1 ?  `s` : ``} dans un module` : `Subject${unclassifiedLength > 1 ?  `s` : ``} not classified in a module`}
									</div>
									<div class="unclassified-content">
										${unclassifiedLength > 0 
											? `<div style="margin: -10px 0px"></div>${this.createAllSubjCards(sem, "__#unclassified#__", manageIndividualCardFolding)}<div style="margin: -10px 0px"></div>` 
											: ``
										}
									</div>
								</div>
							</div>
						</div>`;
					});
					
					this.setGradesTableTotalCoef();
					this.attachAllEventListeners();

					if (document.body.clientHeight > document.body.offsetHeight) {
						// Semester has been collapsed, and now the page is tinier than the window, and i want to avoid the slider to offset the page. Only useful in Backup mode
						this.ecamDash.style.paddingRight = "10px";
					}
					else {
						this.ecamDash.style.paddingRight = "";
					}

				}




				// MARK: Create Module Card
				createAllModuleCards(sem, manageIndividualCardFolding=true) {
					const moduleConfig = this.moduleConfig?.[sem] || {};

					let html =  this.editMode ? this.createDropFieldInsertionField("module", {sem, index:0}) : "";

					moduleConfig?.__modules__?.forEach((moduleName, moduleIndex) => {
						html += this.createModuleCard(sem, moduleName, moduleIndex, manageIndividualCardFolding);
						html += this.editMode ? this.createDropFieldInsertionField("module", {sem, index:moduleIndex+1}) : "";
					});

					if (this.gradesDatas[sem]["__#unclassified#__"].length == 0 && !moduleConfig?.__modules__) {
						html = this.editMode 
							? `<div style="font-size: 23px;">Rien à voir ici pour l'instant...</div>` 
							: `<div style="font-size: 23px;">Nothing to see here yet...</div>`;
					}

					return html;
				}
				createModuleCard(sem, moduleName, moduleIndex=-1, manageIndividualCardFolding=true) {
					const average           = this.gradesDatas[sem][moduleName].average;
					const classAvg          = this.gradesDatas[sem][moduleName].classAvg;
					const hasSim            = this.gradesDatas[sem][moduleName].simGrades.length > 0 ? true : false;
					const hasDisabled       = this.gradesDatas[sem][moduleName].disabledSimGrades.length + this.gradesDatas[sem][moduleName].disabledRealGrades.length > 0 ? true : false;
					const folded            = manageIndividualCardFolding && this.foldedModuleCardsId.includes(`module-card-${moduleName}-in-semester-${sem}`);
					const cardIsSelected    = this.selectedModuleCardsId.includes(`module-card-${moduleName}-in-semester-${sem}`);

					let html = `
					<div class="module-card ${isNaN(average) ? "unknown" : `${average >= 10 ? 'validated' : 'failed'}`} ${folded ? "fold" : ""}" id="module-card-${moduleName}-in-semester-${sem}" data-semester="${sem}" data-module="${moduleName}" data-index="${moduleIndex}" ${folded ? `style="height: 77px"` : ""}>
					
						<div class="module-card-header ${this.editMode ? "edit-mode" : ""} ${isNaN(average) ? "unknown" : `${average >= 10 ? 'validated' : 'failed'}`}" id="module-card-header-${moduleName}-in-semester${sem}" data-semester="${sem}" data-module="${moduleName}" ${this.editMode ? `draggable="true"` : ""}>
							${this.editMode 
								? 
								`<div class="module-card-header-left-side">
									<div style="margin-right: 5px; margin-bottom: 3px;">
									${cardIsSelected 
										? `<div class="tick-icon module" data-targetid="module-card-${moduleName}-in-semester-${sem}" data-semester="${sem}" data-module="${moduleName}" data-subject="">✔</div>`
										: this.createDraggableIcon("module", {targetId: `module-card-${moduleName}-in-semester-${sem}`})
									}</div>
									<input type="text" class="module-title input any-input" id="module-title-input-${sem}-${moduleName}" value="${moduleName}" data-semester="${sem}" data-module="${moduleName}" draggable="false"/>
									<div class="module-title-state">
									</div>
								</div>` 
								: 
								`<div class="module-title">${moduleName}</div>`
							}
							<div class="module-subject-total-coef-div" data-semester="${sem}" data-module="${moduleName}">
								<div class="module-subject-total-coef-value" ${this.settings.totalCoefValuesEnabled.value     ? "" : "style=\"display: none\""}>${!this.langIsEn ? `Coef Total des matières :` : `Total Subjects Coef:`}</div>
								<div class="module-subject-total-coef-debug" ${this.settings.totalCoefDebugTextsEnabled.value ? "" : "style=\"display: none\""}></div>
							</div>
							<div class="module-card-header-right-side">
								<div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 6px;">
									<div class="module-class-average" ${isNaN(average) ? `style="display: none"` : ""}>${classAvg}/20</div>
									<div class="module-class-average-vs-average jura" ${isNaN(average) ? `style="display: none"` : ""}>vs</div>
									<div class="module-average ${isNaN(average) ? "unknown" : `${average >= 10 ? 'good' : 'bad'}`}" data-semester="${sem}" data-module="${moduleName}">${average}/20</div>
								</div>
								<div class="module-toggle fold-icon open">△</div>
								<button class="module-delete-btn" id="module-delete-btn-${moduleName}-in-semester-${sem}" title="${!this.langIsEn ? "Supprimer ce module" : "Delete this module"}" data-semester="${sem}" data-module="${moduleName}" style="border-width: 3px;${this.editMode ? "" : " display: none;"}">🗑️</button>
							</div>
						</div>
						
						<div class="module-card-content" data-module="${moduleName}">
						
							<div class="module-info">
								${hasDisabled 
									? 
									`<div class="module-info-bar">
										<div style="font-weight: 700; font-size: 15px;">${!this.langIsEn ? "Inclus des notes désactivées" : "Includes disabled grades"}</div>
										<div class="module-info-clear disabled" data-semester="${sem}" data-module="${moduleName}">${!this.langIsEn ? "Activer toutes ces notes" : "Enable all the grades"}</div>
									</div>` 
									: ``
								}
								${hasSim 
									? 
									`<div class="module-info-bar">
										<div style="font-weight: 700; font-size: 15px;">${!this.langIsEn ? "Inclus des notes simulées" : "Includes simulated grades"}</div>
										<div class="module-info-clear sim" data-semester="${sem}" data-module="${moduleName}">${!this.langIsEn ? "Effacer toutes ces notes simulées" : "Erase all the simulated grades"}</div>
									</div>` 
									: ``
								}
							</div>

							<div class="module-details ${this.editMode ? "edit-mode": ""}${this.viewMode == "detailed" ? " detailed" :  " compact"}" id="module-details-${moduleName}-in-semester${sem}" data-module="${moduleName}">
								${this.createAllSubjCards(sem, moduleName, manageIndividualCardFolding)}
							</div>
						</div>
						
					</div>
					`;
						
					return html
				}
				

				
				// MARK: Create Subject Card
				/** 
				* Call this method to create the outer HTML of all subject cards of a module.
				* 
				* Detects automatically from the name of the moduleName and from `this.gradesDatas` (as a safe guard, also from `this.moduleConfig`) if the card is classified or unclassified, 
				* and detects automatically from this.compactSubjCardsId if the card is detailed or compact.
				* 
				* @param {number | string} sem Number of the semester of the subject
				* @param {string} moduleName Name of the subject's module
				* @return {string} The outer HTML of all the subject cards of a module, in a single string
				*/
				createAllSubjCards(sem, moduleName, manageIndividualCardFolding=true) {
					const moduleData = this.gradesDatas[sem][moduleName];
					
					let html  = this.editMode && moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined 
							? this.createDropFieldInsertionField("subject", {sem, moduleName, index:0}) 
							: ""
					;

					Object.values(moduleData.subjects).forEach((_value, _index) => {
						html += this.createSubjCard(sem, moduleName, _value.subjName, _index, manageIndividualCardFolding);
						html += this.editMode && moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined 
							? this.createDropFieldInsertionField("subject", {sem, moduleName, index:_index+1}) 
							: ""
						;
					})

					return html;
				}
				/** 
				* Call this method to create the outer HTML of a subject card. 
				* 
				* Detects automatically from the name of the moduleName and from `this.gradesDatas` (to error-proof the moduleName, also from `this.moduleConfig`) if the card is classified or unclassified, 
				* and detects automatically from this.compactSubjCardsId if the card is detailed or compact.
				* 
				* @param {number | string} sem Number of the semester of the subject
				* @param {string} moduleName Name of the subject's module
				* @param {string} subject Name of the subject
				* @param {number} [index=-1] Default: -1 — Index of the subject in its module, necessary if the subject is classified, useless if the subject is unclassified
				* @return {string} The outer HTML of the subject card
				*/
				createSubjCard(sem, moduleName, subject, index=-1, manageIndividualCardFolding=true) {
					const moduleData            = this.gradesDatas[sem][moduleName];
					const subjectData           = moduleData.subjects[subject];
					const subjectGrades         = subjectData.grades;
					const moduleMoy             = moduleData.average;
					const subjAvg               = subjectData?.average >= 0 ? subjectData.average : " - ";
					const subjClassAvg          = subjectData?.classAvg >= 0 && !isNaN(subjectData?.classAvg) ? subjectData.classAvg : " - ";
					const pct                   = subjectData.coef;
					const isCustom              = subjectData.isCustom;
					const nbGrades              = subjectGrades.length;
					const includedGradesLength  = nbGrades - subjectData.disabledRealGrades.length - subjectData.disabledSimGrades.length;
					const nbSimGrades           = subjectData.simGrades.length;
					const nbRealGrades          = nbGrades - nbSimGrades;
					const classified            = moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined;
					const subjectCardId         = `subject-card-semester-${sem}-subject-${subject}`;
					const cardIsSelected        = this.selectedSubjectCardsId.includes(`subject-card-semester-${sem}-subject-${subject}`);
					const detailed              = 
						(this.detailedSubjCardsId.includes(subjectCardId) && !this.compactSubjCardsId.includes(subjectCardId) && manageIndividualCardFolding) 
						|| 
						(this.viewMode == "detailed" && !manageIndividualCardFolding)
					;
					
					if (!manageIndividualCardFolding) {
						if (detailed)   {this.detailedSubjCardsId.push(subjectCardId); this.compactSubjCardsId.splice(this.compactSubjCardsId.indexOf(subjectCardId), 1)} 
						else            {this.compactSubjCardsId.push(subjectCardId); this.detailedSubjCardsId.splice(this.detailedSubjCardsId.indexOf(subjectCardId), 1)}
					}

					let html = `
					<div class="subject-card ${classified ? "classified" : "unclassified"} ${detailed ? "detailed" : "compact"} ${this.editMode ? "" : "edit-mode"} ${isNaN(subjAvg) ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`}" id="${subjectCardId}" style="${this.editMode ? `user-select: none;` : ""}${detailed ? "" : " height: 70px;"}" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}" data-custom="${isCustom}" data-index="${index}">
						<div class="subject-card-header ${detailed ? "detailed" : "compact"} ${isNaN(subjAvg) ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`} ${classified ? "classified" : "unclassified"}" ${this.editMode ? `style="cursor: grab;" draggable="true"` : ``} data-module="${moduleName}">
							<div class="subject-card-header-left-side">
								${this.editMode
									? `<div style="margin: 0px 5px; margin-bottom: 3px;">
									${cardIsSelected
										? `<div class="tick-icon subject" data-targetid="${subjectCardId}" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}">✔</div>`
										: this.createDraggableIcon(`subject`, {targetId: subjectCardId}) 
									}</div>`
									: ""
								}
								<div  style="display: flex; justify-content: space-between; align-items: center; width: 80%;">
									<div class="subject-card-header-left-side-text ${this.editMode ? "edit" : ""}">
										${isCustom 
											? `<input type="text" class="subject-name input any-input" id="subject-name-input-semester-${sem}-subject-${subject}" value="${subject}"/>`
											: `<div class="subject-name">${subject}</div>`
										}
										<div style="font-size: 13px; color: #666; text-wrap-mode: nowrap;">
											${classified 
												? ` ${!this.langIsEn 
														? "Poids dans module: " 
														: "Weight in module: "
													}
													${this.editMode 
														? `<span><input class="subject-coef-input-box any-input" id="subject-coef-input-box-semester-${sem}-subject-${subject}" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%</span>`
														: `<span style="font-weight: 800">${pct}%</span>`
													}
												` 
												: ""
											}
											<span class="subject-card-header-grades-details ${detailed ? "" : "show"}">
												${classified ? "• " : ""}
												${nbGrades===0 
													? `<span>${!this.langIsEn ? "aucune note publiée" : "no published grade"}</span>` 
													: `<span>${nbGrades} ${!this.langIsEn ? `note${nbGrades>1?"s":""} au total` : `grade${nbGrades>1?"s":""} total</span>`}`
												}
												${nbGrades>0 
													? ` • <span ${includedGradesLength<nbGrades ? `style="color: #df0000"` : ``}>
														<span style="font-weight: 700; ">${includedGradesLength}/${nbGrades}</span> 
														${!this.langIsEn ? `note${includedGradesLength>1?"s":""} activée${includedGradesLength>1?"s":""}` : `grade${includedGradesLength>1?"s":""} enabled`}${includedGradesLength<nbGrades ? `!` : ``}
													</span>` 
													: ``
												}
												${nbSimGrades>0 
													? `<span> • ${nbSimGrades} ${!this.langIsEn ? `note${nbSimGrades>1?"s":""} simulée${nbSimGrades>1?"s":""}` : `simulated grade${nbSimGrades>1?"s":""}</span>`}`
													: ``
												}
											</span>
										</div>
									</div>
									<div class="subject-total-coef-div" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}">
										<div class="subject-total-coef-value" ${this.settings.totalCoefValuesEnabled.value     ? "" : "style=\"display: none\""}></div>
										<div class="subject-total-coef-debug" ${this.settings.totalCoefDebugTextsEnabled.value ? "" : "style=\"display: none\""}>${!this.langIsEn ? `Coef Total des notes :` : `Total Grades Coef:`}</div>
									</div>
								</div>
							</div>
							<div class="subject-card-header-right-side">
								<div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 4px;">
									<div class="subj-class-average" ${isNaN(subjClassAvg) ? `style="display: none"` : ""}>${subjClassAvg}</div>
									<div class="subj-class-average-vs-average jura" ${isNaN(subjClassAvg) ? `style="display: none"` : ""}>vs</div>
									<div class="subj-average ${isNaN(subjAvg) ? '' : `${subjAvg>=10 ? 'good' : 'bad'}`}">${subjAvg}/20</div>
								</div>
								<button class="subject-delete-btn" id="subject-delete-btn-${subject}-${moduleName}-in-semester-${sem}" title="${!this.langIsEn ? "Enlever cette matière" : "Remove this subject"}" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}" data-targetid="${subjectCardId}" style="border-width: 3px;${this.editMode && classified ? "" : " display: none;"}">🗑️</button>
							</div>
						</div>

					`;


					html += `

					<table class="grades-table ${isNaN(subjAvg) ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`}" style="${this.editMode ? `user-select: text;` : ``}" id="grades-table-${subject}-semester${sem}" data-subject="${subject}">

						<thead>
							<tr>
								<th class="grades-table-header-type" style="padding-left: 30px; border-left-width: 0px;">
									${!this.langIsEn ? "Intitulé" : "Title"}
								</th>
								<th class="grades-table-header-grade">
									${!this.langIsEn ? "Note" : "Grade"}
								</th>
								<th class="grades-table-header-coef">
									${!this.langIsEn ? "Coef" : "Coef"}
								</th>
								<th class="grades-table-header-classAvg">
									${!this.langIsEn ? "Moy. Classe" : "Class Avg"}
								</th>
								<th class="grades-table-header-date">
									${!this.langIsEn ? "Date" : "Date"}
								</th>
								<th class="grades-table-header-teacher" style="border-right-width: 0px;${this.selectedSubjectCardsId.length > 0 ? " display: none;" : ""}">
									${!this.langIsEn ? "Prof(s)" : "Teacher(s)"}
								</th>
								<th class="grades-table-header-add-sim-cell" style="border-right-width: 0px; border-left-width: 0px;">
								</th>
							</tr>
						</thead>
						<tbody>
					`;

					subjectGrades.forEach((grade, index) => {
						const gradeClass = this.getGradeColor(grade.grade);
						const gradeIsSim = grade.__sim ? true : false;

						html += `
							<tr class="grade-row ${index == nbGrades-1 ? `last` : ``} ${gradeIsSim ? `sim` : ``}" data-sim="${gradeIsSim}">
								<td class="grades-table-type" style="display: flex; align-items: stretch; gap: 6px">
									<input type="checkbox" class="grade-checkbox any-input" id="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}" data-semester="${sem}" data-subj="${subject}" data-module="${moduleName||''}" data-prof="${grade.prof}" data-gradeid="${grade.type + " " + grade.date + " " + grade.prof}" ${gradeIsSim ? `data-simtimestamp="${grade.id}"` : ""} ${!this.gradeIsDisabled(grade) ? "checked" : ""}></input>
									${gradeIsSim
										? `<input class="grade-type simulated-grade-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="simulated-grade-input-type-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" data-modifType="type" data-simid="${index-nbRealGrades}" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" value="${grade.type}"/>` 
										: `<label class="grade-type" style="width: auto"  id="grade-type-${grade.type}-${grade.date}" for="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}">${grade.type || ''}${gradeIsSim ? ` • ${!this.langIsEn ? "Simulée" : "Simulated"}` : ''}</label>`
									}
								</td>
								<td class="grade-value grade-${gradeClass} grades-table-grade" data-sim="${gradeIsSim}">
									${gradeIsSim
										? `<input class="simulated-grade-input-edit sim-inp-grade any-input" style="width: 100%; max-width: 75px;" id="simulated-grade-input-grade-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" type="number" step="0.5" min="0" max="20" data-simid="${index-nbRealGrades}" data-modifType="grade" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" style="width:75px; height:25px" value="${grade.grade}"> /20`
										: `${grade.grade}/20`
									}
								</td>
								<td class="grades-table-coef" data-sim="${gradeIsSim}">
									${gradeIsSim
										? `<input class="simulated-grade-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="simulated-grade-input-coef-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" type="number" step="5" min="0" max="100" data-simid="${index-nbRealGrades}" data-modifType="coef" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" style="width:60px; height:25px"value="${grade.coef}"> %`
										: `${grade.coef} %`
									}
								</td>
								<td class="grades-table-classAvg" data-sim="${gradeIsSim}">
									${gradeIsSim
										? `<span style="width: 100%; display: flex; justify-content: center;"> — </span>`
										: `${grade.classAvg}/20`
									}
								</td>
								<td class="grades-table-date grade-date" data-sim="${gradeIsSim}">
									${gradeIsSim
										? `<span style="width: 100%; display: flex; justify-content: center;"> — </span>`
										: `${grade.date}`
									}
								</td>
								<td class="grades-table-teacher" ${this.selectedSubjectCardsId.length > 0 ? `style="display: none;"` : ""}>
									${gradeIsSim
										? `<span style="width: 100%; display: flex; justify-content: center;"> — </span>`
										: `<span>${`${grade.prof.split(" / ").length <= 3 ? grade.prof : grade.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</span>`
									}
								</td>
								<td class="grades-table-add-sim-cell" style="${gradeIsSim ? `width: 52px; padding: 3px; text-align: center;` : ``}">
									${
										gradeIsSim 
										? `<button class="sim-del-btn" data-semester="${sem}" data-subj="${subject}" data-module="${moduleName||''}" data-type="${grade.type}" data-simid="${index-nbRealGrades}">🗑️</button>` 
										: `<div style="width:32px"></div>`
									}
								</td>
							</tr>
						`;
					});

					html += `
							<tr>
								<td class="grades-table-type">
									<div class="grade-type" style="display:flex; align-items:center; justify-content: flex-start">
										<div class="jura" style="width: 140px">${!this.langIsEn ? "Ajouter une note simulée: " : "Add a simulated grade: "}</div>
										<input class="simulated-grade-input sim-inp-type any-input" id="simulated-grade-input-type-for-${subject}-from-${moduleName}-in-semester${sem}" data-semester="${sem}" data-subj="${subject}" placeholder="${!this.langIsEn ? "Titre" : "Title"}" />
									</div>
								</td>
								<td class="grades-table-grade">
									<input class="simulated-grade-input sim-inp-grade any-input" id="simulated-grade-input-grade-for-${subject}-from-${moduleName}-in-semester${sem}" type="number" step="0.5" min="0" max="20" data-semester="${sem}" data-subj="${subject}" placeholder="/20"> /20
								</td>
								<td class="grades-table-coef">
									<input class="simulated-grade-input sim-inp-coef any-input" id="simulated-grade-input-coef-for-${subject}-from-${moduleName}-in-semester${sem}" type="number" step="5" min="0" max="100" data-semester="${sem}" data-subj="${subject}" placeholder="%"> %
								</td>
								<td colspan="3">
								</td>
								<td class="grades-table-add-sim-cell" style="border-right-width: 0px; border-left-width: 0px;">
									<button class="btn-export sim-add-btn" data-semester="${sem}" data-subj="${subject}" data-module="${moduleName||''}">${!this.langIsEn ? "Ajouter" : "Add"}</button>
								</td>
							</tr>
						</tbody>
					</table>
					`;


					html += `
					</div>
					`;

					return html;
				}



				updateFirstLoadEvent() {
					const dashPatchNotesLink = document.querySelector(".patch-notes-link");
					const newIndicatorContainer = document.createElement("div");
					newIndicatorContainer.className = "new-indicator-container";
					newIndicatorContainer.style.top = "-14px";
					newIndicatorContainer.style.right = "31px";
					newIndicatorContainer.dataset.attached = dashPatchNotesLink.id;
					newIndicatorContainer.innerHTML = `<div class="new-indicator"></div>`;
					dashPatchNotesLink.appendChild(newIndicatorContainer);

					dashPatchNotesLink.onclick = () => {
						newIndicatorContainer.remove();
						this.saveUpdateFirstLoad();
					};
				}

			//#endregion





			//#region -Icons

				createDraggableIcon(source="subject", {size=undefined, width=undefined, height=undefined, fontSize=undefined, targetId="none"}={targetId:"none"}) {
					return `
						<div 
							class="drag-icon ${source}" 
							data-targetid="${targetId}" 
							style="${height || size ? `height:${height || size}px;` : ""} ${width || size ? `width:${width || size}px;` : ""} ${fontSize ? `font-size: ${fontSize || Math.floor((width || size)*0.75)}px` : ""}" 
							draggable="false"
						>☰</div>
					`;
				}
				createExternalLinkSymbol({fillColor="white", strokeColor="none", size=15, margin=0}={fillColor:"white", strokeColor:"none", size:15, margin:0}) {
					return `<svg 
						xmlns="http://www.w3.org/2000/svg" 
						style="
							width: ${size}px; 
							height: ${size}px; 
							margin: ${(margin instanceof Array ? margin : [margin]).map(value => {if (value instanceof Number || !isNaN(Number(value))) {return `${value}px`}}).join(" ")};
							fill: ${fillColor};
							stroke: ${strokeColor};
							stroke-linecap: round;
							stroke-linejoin: round; 
							stroke-width: 2;
						" 
						viewBox="0 0 513 513"
					>
						<path style="d:path('M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z')""/>
					</svg>`;
					// viewBox="0 0 24 24" <path style="d:path('M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')"/>
				}
				appendCloseModalIcon(container,
					//#region
					{
						size="28px",
						sizeTransformScaleHover="28px",

						borderColor="black", 
						borderThickness="6px", 
						borderRadius="50px", 
						crossColor="#b70000", 
						crossThickness="13px", 
						crossLength="100", 
						crossStrokeLinecap="round",

						borderColorHover="black", 
						borderThicknessHover="6px", 
						borderRadiusHover="45px", 
						crossColorHover="#dd5454", 
						crossThicknessHover="17px", 
						crossLengthHover="110", 
						crossStrokeLinecapHover="round",

						transitionTime="0.2s",

						additionalCSS="position: absolute; right: 4px; top: 4px;"
					}
					=
					{
						size:"28px",
						sizeTransformScaleHover:"28px",

						borderColor:"black", 
						borderThickness:"6px", 
						borderRadius:"50px", 
						crossColor:"#b70000", 
						crossThickness:"13px", 
						crossLength:"100", 
						crossStrokeLinecap:"round",

						borderColorHover:"black", 
						borderThicknessHover:"6px", 
						borderRadiusHover:"45px", 
						crossColorHover:"#dd5454", 
						crossThicknessHover:"17px", 
						crossLengthHover:"110", 
						crossStrokeLinecapHover:"round",

						transitionTime: "0.2s",

						additionalCSS:"position: absolute; right: 4px; top: 4px;"
					}
					//#endregion
				) {
					//#region 
					const additionalCSSPropList = additionalCSS.split(";").map(elem => {
						if (elem.length > 0) {
							const styleSeparation = elem.trim().split(":");
							if (styleSeparation[0].trim().split("-").length > 1 && !styleSeparation[0].trim().split("-")[0]) {
								const formatedStyleName = styleSeparation[0].trim();
								return {style: "custom property", name: formatedStyleName, value: styleSeparation[1].trim()}
							}
							else if (styleSeparation[0].trim().split("-").length > 1) {
								const formatedStyleName = styleSeparation[0].trim().split("-").map((sub, index) => {
									if (index>0)    {return sub[0].toUpperCase() + sub.slice(1)} 
									else            {return sub}
								}).join("");
								return {style: "property", name: formatedStyleName, value: styleSeparation[1].trim()}
							}
							else {
								const formatedStyleName = styleSeparation[0].trim();
								return {style: "property", name: formatedStyleName, value: styleSeparation[1].trim()}
							}
						}
					})

					const closeModalIconId = document.querySelectorAll(".modal-close-btn").length;
					const closeModalIconContainer = document.createElement("div");
					closeModalIconContainer.className = "modal-close-btn-container";
					closeModalIconContainer.innerHTML = `
					<svg class="modal-close-btn" viewBox="0 0 100 100" data-id="${closeModalIconId}">
						<circle class="modal-close-btn-circle" style="--border-color: ${borderColor}; --border-thickness: ${borderThickness}; --border-radius: ${borderRadius}; --border-color-hover: ${borderColorHover}; --border-thickness-hover: ${borderThicknessHover}; --border-radius-hover: ${borderRadiusHover}; cx: 50; cy: 50; transition: all ${transitionTime} ease;"/>
						<path class="modal-close-btn-cross"    style="--cross-color:  ${crossColor};  --cross-thickness:  ${crossThickness};  --cross-length:  ${crossLength};  --cross-color-hover:  ${crossColorHover};  --cross-thickness-hover:  ${crossThicknessHover};  --cross-length-hover:  ${crossLengthHover}; --cross-stroke-linecap: ${crossStrokeLinecap}; --cross-stroke-linecap-hover: ${crossStrokeLinecapHover}; --cross-path: 'M 50,50 l ${(crossLength/2)*Math.cos(1*Math.PI/4)},${(crossLength/2)*Math.sin(1*Math.PI/4)} M 50,50 l ${(crossLength/2)*Math.cos(3*Math.PI/4)},${(crossLength/2)*Math.sin(3*Math.PI/4)} M 50,50 l ${(crossLength/2)*Math.cos(5*Math.PI/4)},${(crossLength/2)*Math.sin(5*Math.PI/4)} M 50,50 l ${(crossLength/2)*Math.cos(7*Math.PI/4)},${(crossLength/2)*Math.sin(7*Math.PI/4)}'; --cross-path-hover: 'M 50,50 l ${(crossLengthHover/2)*Math.cos(1*Math.PI/4)},${(crossLengthHover/2)*Math.sin(1*Math.PI/4)} M 50,50 l ${(crossLengthHover/2)*Math.cos(3*Math.PI/4)},${(crossLengthHover/2)*Math.sin(3*Math.PI/4)} M 50,50 l ${(crossLengthHover/2)*Math.cos(5*Math.PI/4)},${(crossLengthHover/2)*Math.sin(5*Math.PI/4)} M 50,50 l ${(crossLengthHover/2)*Math.cos(7*Math.PI/4)},${(crossLengthHover/2)*Math.sin(7*Math.PI/4)}'; transition: all ${transitionTime} ease; /* transform: rotate(45deg) translate(20px, -50px); */"/>
					</svg>
					`;

					container.appendChild(closeModalIconContainer);
					closeModalIconContainer.style.setProperty("--modal-close-btn-container-size", size);
					closeModalIconContainer.style.setProperty("--modal-close-btn-container-transform-scale-hover", sizeTransformScaleHover);
					additionalCSSPropList.forEach(prop => {
						if (prop instanceof Object) {
							if (prop.style == "custom property") {
								closeModalIconContainer.style.setProperty(prop.name, prop.value);
							}
							else if (prop.style == "property") {
								closeModalIconContainer.style[prop.name] = prop.value;
							}
						}
					})
					const closeModalIcon   = closeModalIconContainer.querySelector(`.modal-close-btn`);
					const closeModalCross  = closeModalIcon.querySelector(".modal-close-btn-cross");
					const closeModalCircle = closeModalIcon.querySelector(".modal-close-btn-circle");

					closeModalIcon.onmouseenter = () => {
						if (!document.querySelector(".focus-notif-fullscreen-effect.focus")) {
							closeModalIconContainer .classList.add("hover");
							closeModalIcon          .classList.add("hover");
							closeModalCross         .classList.add("hover");
							closeModalCircle        .classList.add("hover");
						}
					};
					closeModalIcon.onmouseleave = () => {
						if (!document.querySelector(".focus-notif-fullscreen-effect.focus")) {
							closeModalIconContainer .classList.remove("hover");
							closeModalIcon          .classList.remove("hover");
							closeModalCross         .classList.remove("hover");
							closeModalCircle        .classList.remove("hover");
						}
					};
					//#endregion
				}

			//#endregion





			//#region -Modals

				appendKeyboardShortcutsList(container=document.querySelector("#keyboardShortcutListModalBody")) {
					if (container instanceof HTMLElement) {
						let html = `
						<table style="font-size: 20px; --row-height: 30px;">
							<thead>
								<tr>
									<td style="width: 580px;"></td>   <td style="width: 160px;"></td>
								</tr>
							</thead>
							<tbody>
						`;

						this.keybinds.forEach((keybind, _index) => {
							html += `
								<tr class="keybinds-table-row" ${_index == 0 ? `style="border: none;"` : ``}>
									<td class="keybinds-table-cell text">${keybind.text()}</td>
									<td class="keybinds-table-cell keys">${keybind.keys()}</td>
								</tr>
							`;
						})

						html += `
							</tbody>
						</table>
						`
		
						container.innerHTML = html;
					}
				}

				appendFullScreenNotif(container=document.body, text) {
					if (!text) {
						text = !this.langIsEn 
							? `<div>Clique sur l'écran pour rafraichir la page et appliquer la mise à jour !</div><div>Utilisateurs de MAC, copiez le script qui s'est ouvert et collez-le dans votre extension à la place de l'ancien script</div>`
							: `<div>Click on the screen to reload the page and apply the update!</div><div>MAC users, copy the script that opened up and paste it in your extension to replace the old script</div>
						`;
					}

					document.body.style.height = "290px";
					document.body.style.overflow = "hidden";

					const fullScreenNotif = document.createElement("div");
					container.appendChild(fullScreenNotif);

					fullScreenNotif.outerHTML = `
						<div 
							class="modal${this.settings.blurEnabled.value ? " blur" : ""}" 
							id="fullScreeNotif" 
							style="display: flex; flex-direction: column; justify-content: space-evenly; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; text-align: center; font-size: 50px; font-weight: 100; text-emphasis-style: ' '; cursor: pointer; z-index: 1000"
						>
							${text}
						</div>
					`;

					const newFullScreenNotif = document.querySelector("#fullScreeNotif");
					newFullScreenNotif.title = !this.langIsEn ? "Rafraichir" : "Reload";
					setTimeout(() => {newFullScreenNotif.classList.add("show");}, 100)
					newFullScreenNotif.onclick = () => {window.location.reload();};
				}

				appendSettingsModalBody(container=document.querySelector("#settingsModal")) {
					if (container instanceof HTMLElement) {
						const settingsModalBody = document.createElement("div");
						settingsModalBody.className = "settings-modal-body";
						settingsModalBody.id = "settingsModalBody";
						container.appendChild(settingsModalBody);
						
						Object.keys(this.settings).forEach((settingId, _index, settingsIdArray) => {
							const settingChildren = this.settings[settingId].children;


							if (settingChildren.length > 0) {
								const settingValue = this.settings[settingId].value;
								let html = ``;
								html += `<div class="settings-row-family${settingValue ? "" : " disabled"}" id="settings-row-family-${settingId}">`;
								html += this.createSettingRow(settingId, _index);

								settingChildren.forEach((settingChildData) => {
									html += this.createSettingRow(settingChildData.childName, _index);
									settingsIdArray.splice(settingsIdArray.indexOf(settingChildData.childName), 1);
								})

								settingsModalBody.innerHTML += html + `</div>`;
							}
							else {
								settingsModalBody.innerHTML += this.createSettingRow(settingId, _index);
							}

						})
					}
				}

				createSettingRow(settingId, index) {
					const settingName       = this.settings[settingId].name();
					const settingDesc       = this.settings[settingId].description();
					const settingInfo       = this.settings[settingId].info();
					const settingValue      = this.settings[settingId].value;
					const settingParents    = this.settings[settingId].parents;
					const settingChildren   = this.settings[settingId].children;

					let html = ``;

					let settingParentsValidValue = true;
					let settingTotalParentsCount = 0;
					let settingInvalidPartialParentsCount = 0;

					settingParents.forEach(parentData => {
						if (parentData.controlType == "total") {
							settingTotalParentsCount++;
						}

						if (this.settings[parentData.parentName].value !== true) {
							if (parentData.controlType == "total") {
								settingParentsValidValue = false;
							}
							else if (parentData.controlType == "partial") {
								settingInvalidPartialParentsCount++;
							}
						}
					});

					if (settingParentsValidValue == true && settingInvalidPartialParentsCount > 0 && settingInvalidPartialParentsCount == settingParents.length - settingTotalParentsCount) {
						settingParentsValidValue = false;
					}

					html += `
					<div 
						class="settings-row${settingParents.length > 0 ? ` child` : ""}${settingChildren.length > 0 ? " parent": ""}${settingParentsValidValue && settingValue ? "" : " disabled"}" 
						id="settings-row-${settingId}" 
						${index > 0 && settingParents.length==0 ? `style="border-top: 1px solid"` : ``} 
						data-setting="${settingId}" 
						data-parent="${settingParents.length > 0 ? settingParents[0].parentName : ""}"
					>
						<div class="settings-text">
							<span class="jura" style="font-size: 22px; font-weight: 800; padding-left: 10px;">${settingName}</span>
							<div style="display: flex; flex-direction: column;">
								<span class="jura" style="font-size: 15px; font-weight: 600">${settingDesc}</span>
								<span style="font-size: 13px; font-weight: 400; font-style: italic;">${settingInfo}</span>
							</div>
						</div>
						<input 
							type="checkbox" 
							class="settings-checkbox" 
							id="settings-checkbox-${settingId}" 
							data-setting="${settingId}" 
							${settingParents.length>0 ? `data-parent="${settingParents[0].parentName}"` : ""}
							${settingParentsValidValue ? "" : "disabled"} 
							${settingValue ? "checked" : ""}
						></input>
					</div>
					`;

					return html;
				}

			//#endregion





			//#region Tutos

				firstLoadEvent() {

					if (this.firstLoad) {
						const overHeaderBtns = document.querySelector(".over-header-help-btns");
	
						const newUserNotif  = document.createElement("div");
						newUserNotif.className = "new-user-notif";
						newUserNotif.title = !this.langIsEn ? "Clique pour fermer" : "Click to dismiss";
						newUserNotif.innerHTML = `
							<div class="new-user-notif-arrow" style="right: -322px; bottom: ${this.error ? "-8px" : "-4px"};">
								<svg class="new-user-notif-arrow-svg" viewBox="0 0 100 100" style="z-index: 9;">
									<path class="new-user-notif-arrow-path outside"></path>
								</svg>
								<svg class="new-user-notif-arrow-svg" viewBox="0 0 100 100" style="position: relative; bottom: ${this.error ? "70px" : "75px"}; z-index: 11;">
									<path class="new-user-notif-arrow-path inside"></path>
								</svg>
							</div>
							<div class="new-user-notif-text">${
								!this.langIsEn 
									? "Bonjour! Première fois? Clique ici pour apprendre à utiliser cette extension! (Clique ici pour fermer)" 
									: "Hey! New here? Click here to find a tutorial on how to use this extension! (Click here to dismiss)"
								}
							</div>
						`;
						overHeaderBtns.appendChild(newUserNotif);
	
						const newUserNotifFullScreen        = document.createElement("div");
						const helpMenuBtn                   = document.querySelector(".over-header-btn.how-to-use-btn");
						const firstStepsBtn                 = document.querySelector(".first-steps-btn");
						firstStepsBtn.classList.add("infinite-alternate-scale-up");
						helpMenuBtn.style.zIndex = 302;

						newUserNotifFullScreen.className    = "focus-notif-fullscreen-effect";
						this.ecamDash.appendChild(newUserNotifFullScreen);
						setTimeout(() => {newUserNotifFullScreen?.classList?.add("focus");}, 10);
	
						newUserNotif.onclick = () => {this.dismissFirstTimeNotif();}
					}
					
				}

				startTuto() {
					const newUserNotifFullScreen     = document.createElement("div");
					newUserNotifFullScreen.className = "focus-notif-fullscreen-effect";
					this.ecamDash.appendChild(newUserNotifFullScreen);
					setTimeout(() => {newUserNotifFullScreen?.classList?.add("focus");}, 10);

					const skipTuto = document.createElement("div");
					skipTuto.className = "skip-tuto-btn jura";
					this.ecamDash.appendChild(skipTuto);
					setTimeout(() => {skipTuto.style.opacity = "1";}, 1)
					skipTuto.onclick = () => {
						this.stopTuto();
					}
				}

				// MARK: start first steps tuto
				startFirstStepsTutorial() {
					this.generalKeyboardEvents("tuto");

					localStorage.setItem("ECAM_DASHBOARD_FIRST_LOAD", false);
					this.firstLoad = false;
					
					const firstStepsBtn = document.querySelector(".first-steps-btn");
					firstStepsBtn.classList.remove("infinite-alternate-scale-up");

					this.onGoingTutoTipNotifDivs = [
						new TutoTipNotif(this,
							".config-btns-container",
							"#importBtn", 
							!this.langIsEn ? "Clique ici pour importer une configuration de modules" : "Click here to import a module configuration"
							, {
								appearanceDelay: 400,
								containerStyle: {top: "-25px", right: "200px"}, 
								notifStyle: {minWidth: "330px"}, 
								containerElemStyle: {}
							}
						),
						new TutoTipNotif(this,
							"#importMenu",
							".import-menu-btn.online", 
							!this.langIsEn ? "Clique ici pour obtenir une configuration déjà disponible en ligne" : "Click here to obtain a configuration already available online"
							, {
								appearanceDelay: 400,
								containerStyle: {top: "175px", right: "110px"}, 
								notifStyle: {minWidth: "260px"}, 
								containerElemStyle: {zIndex: "unset"}
							}
						),
						new TutoTipNotif(this,
							"#pickerMenu",
							".online-cfg-picker-menu-dir-card.config",
							!this.langIsEn ? "Navigue dans le menu pour trouver la configuration qui correspond à ta section → année → promo [→ fillière, si besoin] actuelle" : "Navigate through the menu to find the configuration that corresponds to your current section → year → prom [→ pathway, if needed]"
							, {
								appearanceDelay: 550, 
								containerStyle: {position: "absolute", width: "100%", top: "-76px", right: "0"}, 
								notifStyle: {minWidth: "1040px"}, 
								targetElemStyle: {}, 
								containerElemStyle: {}
							}
						),
						new TutoTipNotif(this,
							document.body,
							".tuto-tip-notif-container",
							!this.langIsEn 
								? `Ta configuration est chargée ! Tu peux filtrer l'affichage des notes par semestres en sélectionnant le semestre désiré dans la barre de filtre.
									Tu peux également refaire la manipulation pour obtenir la configuration des années précédentes si elles sont disponibles.
									<div>[ Clique pour fermer le tuto ]</div>`
								: `Your configuration is loaded! You can filter the grades' display by semester, by selecting the desired semester in the filter bar.
									You can also do the manipulation again to obtain the configuration of previous years if they are available.
									<div>[ Click to close the tuto ]</div>`
							, {
								appearanceDelay: 1, 
								containerStyle: {position: "fixed", width: "100%", height: "100%", top: "0"}, 
								notifStyle: {maxWidth: "60%"}, 
								targetElemStyle: {}, 
								containerElemStyle: {}
							}
						),
					]

					this.nextTipNotif();
				}


				

				// MARK: start complete tuto
				startCompleteTutorial() {
					this.generalKeyboardEvents("tuto");

					this.startTuto();

					this.onGoingTutoTipNotifDivs = [
						new TutoTipNotif(this,
							document.body,
							".tuto-tip-notif-container", 
							!this.langIsEn ? "Bienvenu dans le tutoriel complet de ce tableau de bord ! :D" : "Welcome in the complete tutorial of this dashboard! :D", 
							{
								appearanceDelay: 400,
								containerStyle: {position: "fixed", top: "50%", left: "50%"}, 
								notifStyle: {minWidth: "1000px"}, 
								containerElemStyle: {}
							}
						),
					]

					this.nextTipNotif();
				}



				// MARK: nextTipNotif()
				/** Pops the first element of the array of {@link TutoTipNotif TutoTipNotif}s and create its tip notif by calling its {@link TutoTipNotif.createTipNotifDiv createTipNotifDiv} method.
				 * 
				 * If no element is left, uses the endCallback function instead.
				 */
				nextTipNotif(endCallback = this.stopTuto) {
					if (this.onGoingTutoTipNotifDivs.length > 0) this.currentTutoTipNotif = this.onGoingTutoTipNotifDivs.shift().createTipNotifDiv();
					else endCallback()
				}


				// MARK: stopTuto()
				/** Stops the currently on-going tuto, removing every tuto tip notif divs */
				stopTuto() {
					if ((this?.onGoingTutoTipNotifDivs?.length || 0) > 0) this.onGoingTutoTipNotifDivs = null;

					document.querySelectorAll(".tuto-tip-notif-container").forEach(tutoTipNotifContainer => {
						tutoTipNotifContainer.style.opacity = "0";
						tutoTipNotifContainer.style.transform = "scale(100%)";
						setTimeout(() => {tutoTipNotifContainer.remove()}, 300);
					})

					document.querySelectorAll(".infinite-alternate-scale-up.tuto-animation-effect").forEach(elem => {
						elem.classList.remove("infinite-alternate-scale-up", "tuto-animation-effect")
					})

					document.querySelector(".focus-notif-fullscreen-effect").classList.remove("focus");
					setTimeout(() => {document.querySelector(".focus-notif-fullscreen-effect").remove()}, 500)

					document.querySelector(".skip-tuto-btn").style.opacity = "0";
					document.querySelector(".skip-tuto-btn").style.animationPlayState = "paused";
					setTimeout(() => {document.querySelector(".skip-tuto-btn").remove()}, 500)

					document.body.onclick = null;

					this.generalKeyboardEvents();
				}

			//#endregion Tutos
			




			// MARK: Regenerate subject and module averages and total coef debug texts
			regenAveragesAndTotalCoefs(sem, moduleName="__#unclassified#__", subject) {

				document.querySelector(".average-number").innerHTML = this.averagePonderee(this.grades);

				
				if (sem?.classList?.contains("module-card")) {
					subject = undefined;
					moduleName = sem.dataset.module;
					sem = sem.dataset.semester;
				}
				else if (sem?.classList?.contains("subject-card")) {
					subject = sem.dataset.subject;
					moduleName = sem.dataset.module;
					sem = sem.dataset.semester;
				}
				
				// subject average modification
				if (subject) {
					const subjCard          = document.querySelector(`.subject-card[data-subject="${subject}"]`);
					const subjAvgDiv        = subjCard.querySelector(".subj-average");
					const subjAvgVsClassAvg = subjCard.querySelector(".subj-class-average-vs-average");
					const subjClassAvgDiv   = subjCard.querySelector(".subj-class-average");
					const subjHeader        = subjCard.querySelector(".subject-card-header");
					const gradesTable       = subjCard.querySelector(".grades-table");
					const subjAvg           = this.gradesDatas[sem][moduleName||"__#unclassified#__"].subjects[subject].average;
					const subjClassAvg      = this.gradesDatas[sem][moduleName||"__#unclassified#__"].subjects[subject].classAvg;
					const moduleAvg         = this.gradesDatas[sem][moduleName||"__#unclassified#__"].average;
					
					subjAvgDiv.innerHTML = subjAvg + "/20";
					if (!isNaN(subjClassAvg)) {
						subjClassAvgDiv.innerHTML = subjClassAvg + "/20";
					}
					else {
						subjClassAvgDiv.style.display = "none";
						subjAvgVsClassAvg.style.display = "none";
					}
					
					subjCard   .classList.remove("good"); subjCard   .classList.remove("meh"); subjCard   .classList.remove("bad"); subjCard   .classList.remove("unknown");
					subjAvgDiv .classList.remove("good"); subjAvgDiv .classList.remove("meh"); subjAvgDiv .classList.remove("bad"); subjAvgDiv .classList.remove("unknown");
					subjHeader .classList.remove("good"); subjHeader .classList.remove("meh"); subjHeader .classList.remove("bad"); subjHeader .classList.remove("unknown");
					gradesTable.classList.remove("good"); gradesTable.classList.remove("meh"); gradesTable.classList.remove("bad"); gradesTable.classList.remove("unknown");
					
					if (isNaN(subjAvg)) {
						subjCard   .classList.add("unknown");
						subjAvgDiv .classList.add("unknown");
						subjHeader .classList.add("unknown");
						// gradesTable.classList.add("unknown");
					}
					else if (moduleAvg >= 10 && subjAvg < 10 || moduleAvg < 10 && subjAvg >= 10) {
						subjCard   .classList.add("meh"); 
						subjAvgDiv .classList.add("bad"); 
						subjHeader .classList.add("meh"); 
						gradesTable.classList.add("meh"); 
					}
					else if (subjAvg >= 10) {
						subjCard   .classList.add("good"); 
						subjAvgDiv .classList.add("good"); 
						subjHeader .classList.add("good"); 
						gradesTable.classList.add("good"); 
					}
					else {
						subjCard   .classList.add("bad");
						subjAvgDiv .classList.add("bad");
						subjHeader .classList.add("bad");
						gradesTable.classList.add("bad");
					}
				}
				
				// module average modification
				if (moduleName != "__#unclassified#__") {
					const moduleCard            = document.querySelector(`.module-card[data-module="${moduleName}"]`);
					const moduleCardHeader      = moduleCard.querySelector(`.module-card-header`);
					const moduleClassAvgDiv     = moduleCardHeader.querySelector(`.module-class-average`);
					const moduleClassAvgVsAvg   = moduleCardHeader.querySelector(`.module-class-average-vs-average`);
					const moduleAvgDiv          = moduleCardHeader.querySelector(`.module-average`);
					const moduleAvg             = this.gradesDatas[sem][moduleName].average;
					const moduleClassAvg        = this.gradesDatas[sem][moduleName||"__#unclassified#__"].classAvg;
					
					moduleAvgDiv.innerHTML      = moduleAvg + "/20";
					if (!isNaN(moduleClassAvg)) {
						moduleClassAvgDiv.innerHTML = moduleClassAvg + "/20";
					}
					else {
						moduleClassAvgDiv.style.display = "none";
						moduleClassAvgVsAvg.style.display = "none";
					}
					
					moduleCard      .classList.remove("validated");     moduleCard      .classList.remove("failed");    moduleCard      .classList.remove("unknown");
					moduleCardHeader.classList.remove("validated");     moduleCardHeader.classList.remove("failed");    moduleCardHeader.classList.remove("unknown");
					moduleAvgDiv    .classList.remove("good");          moduleAvgDiv    .classList.remove("bad");       moduleAvgDiv    .classList.remove("unknown");

					if (isNaN(moduleAvg)) {
						moduleCard  .classList.add("unknown");
						moduleAvgDiv.classList.add("unknown");
					}
					else if (moduleAvg >= 10) {
						moduleCard      .classList.add("validated");
						moduleCardHeader.classList.add("validated");
						moduleAvgDiv    .classList.add("good");
					}
					else {
						moduleCard      .classList.add("failed");
						moduleCardHeader.classList.add("failed");
						moduleAvgDiv    .classList.add("bad");
					}

					this.setGradesTableTotalCoef(moduleCard);
				}
				else if (subject) {
					const subjCard = document.querySelector(`.subject-card[data-semester="${sem}"][data-subject="${subject}"]`);
					this.setGradesTableTotalCoef(subjCard);
				}

				// semester average modification
				if (sem) {

					const semAvgsDiv            = document.querySelector(".semester-averages");
					const semAvgDiv             = semAvgsDiv.querySelector(".semester-average");
					const semAvgSymbolDiv       = semAvgsDiv.querySelector(".semester-average-symbol");
					const semClassAvgVsAvgDiv   = semAvgsDiv.querySelector(".semester-class-average-vs-average");
					const semClassAvgDiv        = semAvgsDiv.querySelector(".semester-class-average");

					const semData       = this.gradesDatas[sem];
					const semAvg        = semData.average;
					const semClassAvg   = semData.classAvg;
					const semAvgSymbol  = isNaN(semAvg) ? "" : `${semAvg >= 10 ? '✅' : '⚠️'}`;

					semAvgsDiv.classList.remove("bad"); semAvgsDiv.classList.remove("good");

					semAvgDiv.innerHTML = semAvg + "/20";
					semAvgSymbolDiv.innerHTML = semAvgSymbol;
					if (!isNaN(semClassAvg)) {
						if (semAvg >= 10) {
							semAvgsDiv.classList.add("good");
						}
						else {
							semAvgsDiv.classList.add("bad");
						}

						semClassAvgDiv.innerHTML = semClassAvg + "/20";
					}
					else {
						semClassAvgDiv.style.display = "none";
						semClassAvgVsAvgDiv.style.display = "none";
					}

				}

			}

		//#endregion ____________ — Render — ______________






		//#region ________ — General  Events — _________

			attachAllEventListeners() {
				this.attachDocumentMouseListeners();
				this.attachEcamDashMouseListeners();
				this.attachAllAnyInputsListeners();
				
				this.attachLangBtnsListener();
				this.attachOverHeaderBtnsMouseListeners();
				this.attachEditModeListener();
				this.attachImportBtnListener();
				this.attachExportBtnListener();
				
				this.attachNewGradesNotifListener();
				this.attachNewGradesMarkAsReadBtnListener();
				this.attachAllNewGradesSubjectCardsListener();
				
				this.attachFilterSemesterListener();
				this.attachViewModeBtnsListener();
				this.attachFoldToggleBtnListener();
				
				this.attachAllSubjectCardRelatedEventListenersForEverySubjectCard();

				this.attachModuleInfoClearBtns();
				this.attachAllModuleCardDeleteBtnsListener();

				if (this.editMode) { this.attachDropFieldsEventListeners(); }
			}





			//#region -—Attach Event Listeners





				//#region Document listeners

					attachDocumentMouseListeners() {
						this.ecamDash.onclick = (e) => {

							if (document.getElementById("importMenu").classList.contains("show") && !document.querySelector(".focus-notif-fullscreen-effect.focus") && !e.target.closest(".import-menu")) {
								document.getElementById("importMenu").classList.remove("show");

								clearTimeout(this?.timeouts?.closeImportMenu);
								this.timeouts.closeImportMenu = setTimeout(() => {document.getElementById("importMenu").style.display = "none"}, 300);
							}

							if (!e.target.closest(".over-header-btn.issue.issue-btn, .over-header-btn.issue.mail-info, .over-header-btn.how-to-use-btn")) {
								this.dismissAllOverHeaderBtns();
							}

							if (e.target.classList.contains("any-input")) {
								this.generalKeyboardEvents("edit sim grade", e.target.closest(".any-input"));
							}
						};
					}

					attachAllAnyInputsListeners(container=document) {
						if (container instanceof HTMLElement || container == document) {
							container.querySelectorAll(".any-input").forEach(input => {
								this.attachAnyInputListeners(input)
							})
						}
					}
					attachAnyInputListeners(input) {
						input.onfocus    = ()  => {this.generalKeyboardEvents("edit sim grade", input)}
						input.onblur     = ()  => {this.generalKeyboardEvents("general")};
						input.ondragover = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "none";}
						input.ondrop     = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "link";};

						if (input.classList.contains("module-title")) {   // Change modules name
							input.onfocus   = ()  => { 
								this.generalKeyboardEvents("edit sim grade", input); 

								if (this.editMode) {
									this.detachAllCardsOnDragEventListeners(); 
									document.querySelectorAll(".module-card-header").forEach(card => {card.draggable = false});
								} 
							};
							input.onblur    = ()  => { 
								this.generalKeyboardEvents("general"); 

								if (this.editMode) {
									this.attachAllCardsOnDragEventListeners(); 
									document.querySelectorAll(".module-card-header").forEach(card => {card.draggable = true;});
								} 
							};
							input.onchange  = (e) => { this.moduleTitleInputChangeAction(e.target) };
						}
						else {
							input.onfocus   = ( ) => { 
								this.generalKeyboardEvents("edit sim grade", input); 
								if (this.editMode) this.detachAllCardsOnDragEventListeners(); 
							};
							input.onblur    = ( ) => { 
								this.generalKeyboardEvents("general"); 
								if (this.editMode) this.attachAllCardsOnDragEventListeners(); 
							};
						}
					}

				//#endregion




				//#region Dashboard listeners
					

					attachEcamDashMouseListeners() {
						
						this.ecamDash.onmousedown = (e) => {
							// Toggle semesters
							if (e.target.closest('.semester-header')) {
								this.semesterHeaderMouseUpNoMoveAction();
							}
							// Fold/Unfold modules
							else if (e.target.closest('.module-card-header') && !e.target.closest('.module-title.input, .module-delete-btn, .drag-icon, .tick-icon')) {
								this.moduleHeaderMouseUpNoMoveAction(e)
							}
							// Fold/unfold modules
							else if (e.target.closest('.subject-card-header, .subject-card.compact') && !e.target.closest('.any-input, .drag-icon, .tick-icon, .subject-delete-btn')) {
								this.subjectHeaderMouseUpNoMoveAction(e)
							}
						};

					}


					attachLangBtnsListener() {
						// Change to English
						document.getElementById('en-lang-btn').onclick = () => {
							if (!this.langIsEn) {
								this.lang       = "en";
								this.langIsEn   = true;
								localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
								document.getElementById('fr-lang-btn').classList.remove('active')
								document.getElementById('en-lang-btn').classList.add('active')
								this.generateContent({fadeIn: false});
							}
						};

						// Change to French
						document.getElementById('fr-lang-btn').onclick = () => {
							if (this.langIsEn) {
								this.lang       = "fr";
								this.langIsEn   = false;
								localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
								document.getElementById('fr-lang-btn').classList.add('active')
								document.getElementById('en-lang-btn').classList.remove('active')
								this.generateContent({fadeIn: false});
							}
						};
					}


					attachOverHeaderBtnsMouseListeners() {
						const issueBtn      = document.querySelector(".issue.issue-btn");
						const mailInfo      = document.querySelector(".issue.mail-info");

						const helpBtn       = document.querySelector(".over-header-btn.how-to-use-btn");
						const keybindsBtn   = document.querySelector(".over-header-btn.keybinds-btn");
						const tutoBtn       = document.querySelector(".over-header-btn.tuto-btn");
						const firstStepsBtn = document.querySelector(".over-header-btn.first-steps-btn");

						const settingsBtn   = document.querySelector(".over-header-btn.settings-btn");

						issueBtn.onclick    = () => {if (issueBtn.classList.contains("open")) { this.dismissIssuesOverHeaderBtns(); } else { this.openIssuesOverHeaderBtns(); }};
						mailInfo.onclick    = () => {
							navigator.clipboard.writeText("baptiste.jacquin@ecam.fr");

							const mailInfoText = document.querySelector(".over-header-btn-mail-info-text");
							const mailInfoCopied = document.querySelector(".over-header-btn-copied-cue");
							mailInfoText  .classList.add("lighten");
							mailInfoCopied.classList.add("show");

							mailInfoCopied.onanimationend = (e) => {
								mailInfoText  .classList.remove("lighten");
								mailInfoCopied.classList.remove("show");
							}
						};

						helpBtn.onclick         = () => {if (helpBtn.classList.contains("open")) { this.dismissHelpOverHeaderBtns(); } else { this.openHelpOverHeaderBtns(); }};
						keybindsBtn.onclick     = () => { this.openKeybindsModal(); };
						tutoBtn.onclick         = () => { this.startCompleteTutorial(); };
						firstStepsBtn.onclick   = () => { this.startFirstStepsTutorial(); };

						settingsBtn.onclick = () => { this.openSettingsModal(); };
					}

					attachEditModeListener() {
						document.getElementById('editModeBtn').onclick = () => {
							this.editMode = !this.editMode;
							localStorage.setItem("ECAM_DASHBOARD_DEFAULT_EDIT_MODE", this.editMode);
							this.generateContent();
						};
					}

					attachImportBtnListener() {
						document.getElementById('importBtn').onclick = () => this.toggleImportMenu();
					}
					attachExportBtnListener() {
						document.getElementById('exportBtn').onclick = () => this.exportData();
					}
					
				//#endregion

				

				
				//#region Modals

					attachSettingsModalContainerListeners(container=document.querySelector("#settingsModalContainer")) {

						container.onmousedown = (e) => {
							if ((e.target.closest(".modal-close-btn") || !e.target.closest(".settings-modal")) && !document.querySelector(".focus-notif-fullscreen-effect.focus")) { 
								container.onmouseup = (e) => {
									if ((e.target.closest(".modal-close-btn") || !e.target.closest(".settings-modal")) && !document.querySelector(".focus-notif-fullscreen-effect.focus")) {
										this.closeSettingsModal();
									}
									container.onmouseup = null;
								}
							}
							else if (e.target.closest(".settings-checkbox")) {
								container.onmouseup = (e) => {
									if (e.target.closest(".settings-checkbox")) {
										const chbx = e.target.closest(".settings-checkbox");
										const settingId = chbx.dataset.setting;
										const settingRow        = container.querySelector(`#settings-row-${settingId}`);
										const settingRowFamily  = container.querySelector(`#settings-row-family-${settingId}`);
										this.settings[settingId].value = !chbx.checked; // The event is fired before the checkbox is actually checked, so we reverse the value of the checkbox
										this.settings[settingId].action();
										const settingChildren = this.settings[settingId].children.map(settingChildData => {return settingChildData.childName});

										if (chbx.checked) {
											settingRow.classList.add("disabled");
											settingRowFamily?.classList?.add("disabled");
										}
										else {
											settingRow.classList.remove("disabled");
											settingRowFamily?.classList?.remove("disabled");
										}

										settingChildren.forEach(settingChildId => {
											const childSettingRow = container.querySelector(`#settings-row-${settingChildId}`);
											const childChbx = childSettingRow.querySelector(".settings-checkbox");

											if (chbx.checked) {
												childSettingRow.querySelector(".settings-checkbox").disabled = true;
												childSettingRow.classList.add("disabled");
											}
											else {
												childSettingRow.querySelector(".settings-checkbox").disabled = false;
												if (childChbx.checked) childSettingRow.classList.remove("disabled");
											}
										})

										
										container.onmouseup = null;
									}
								}
							}
						};
					}

				//#endregion




				//#region New grades listeners

					attachNewGradesNotifListener() {
						const newGradesNotif = document.querySelector(".new-grades-notif");
						if (newGradesNotif) {
							document.querySelector(".new-grades-notif").onclick = (e) => {
								if (!e.target.closest("#closeNewGradesNotif")) {
									const newGradesCard = document.querySelector(".new-grades-card");
									newGradesCard.scrollIntoView({behavior: "instant"});
									newGradesCard.classList.add("myhighlight");
									setTimeout(() => {newGradesCard.classList.remove("myhighlight")},300)
								}
								else {
									document.querySelector(".new-grades-notif").classList.remove("on");
									setTimeout(() => {document.querySelector(".new-grades-notif").remove();}, 500)
								}
							};
						}
					}

					attachNewGradesMarkAsReadBtnListener() {
						document.querySelector(".new-grades-mark-as-read").onclick = () => {
							this.newGrades = [];
							this.savedReadGrades = Array(...this.grades);
							this.saveReadGrades();

							if (document.querySelector(".new-grades-card").children.length > 1) {
								document.querySelector(".new-grades-card").children[1].remove()
							}
							document.querySelector(".new-grades-card").classList.add("none");
							document.querySelector(".new-grades-card-header").classList.add("none");
							document.querySelector(".new-grades-card-title").innerHTML = !this.langIsEn 
								? `Pas de nouvelle note${this.error ? ", que je sache (mode backup)" : ""}` 
								: `No new grade${this.error ? ", as far as I know (backup mode)" : ""}`
							;
							document.querySelector(".new-grades-card-title").classList.add("none");
							document.querySelector(".new-grades-mark-as-read").parentElement.disabled = true;
							document.querySelector(".new-grades-mark-as-read").parentElement.style.display = "none";
							document.querySelector(".new-grades-notif")?.classList?.remove("on");
							setTimeout(() => {
								document.querySelector(".new-grades-notif")?.remove();
							}, 500)

							this.renderRecentGrades()
						};
					}

					attachAllNewGradesSubjectCardsListener(container=document) {
						if (container instanceof HTMLElement || container instanceof HTMLDocument) {
							container.querySelectorAll(".new-grades-subject-card").forEach(card => {   // Scroll to the corresponding subject/grade on which the user clicked
								this.attachNewGradesSubjectCardsListener(card);
							})
						}
					}

					attachNewGradesSubjectCardsListener(card) {
						if (card instanceof HTMLElement && card.classList.contains("new-grades-subject-card")) {
							card.onclick = (e) => {
								if (e.target.dataset.semester) {
									this.currentSemester = e.target.dataset.semester;
									document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
									document.getElementById('filter-tab-semester-'+this.currentSemester).classList.add('active');
									this.generateContent({fadeIn: false});
									this.saveSemesterFilter();
								}

								
								const targetElem = document.getElementById(`subject-card-semester-${e.target.dataset.semester}-subject-${e.target.dataset.subject}`);
								this.unfoldSubjCard(targetElem);
								this.scrollToClientHighestElem({id:targetElem.id, smooth: true, block: "center", margin:0})
								targetElem.classList.add("scroll-to");
								targetElem.onmouseenter = () => {targetElem.classList.remove("scroll-to")};
								
							}
							card.onmouseenter = (e) => {
								card.classList.add("hover");
								card.querySelector(".new-grades-subject-card-title").classList.add("hover");
							}
							card.onmouseleave = (e) => {
								card.classList.remove("hover");
								card.querySelector(".new-grades-subject-card-title").classList.remove("hover");
							}
						}
					}

				//#endregion




				//#region filter/view mode listeners

					attachFilterSemesterListener() {
						document.querySelectorAll('.filter-tab').forEach(tab => {
							tab.onclick = (e) => {
								if (!e.target.classList.contains('active'))
								{
									document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
									e.target.classList.add('active');
									this.currentSemester = e.target.dataset.filter;
									this.saveSemesterFilter();

									this.foldedModuleCardsId = []; document.querySelector(".fold-toggle").classList.remove("active");
									this.removeCardFromSelection();
									this.generateContent({manageIndividualCardFolding: false});
								}
							};
						});
					}

					attachViewModeBtnsListener() {
						document.querySelectorAll('.view-btn').forEach(btn => {
							btn.onclick = (e) => {
								
								const unclassifiedSection = document.querySelector(".unclassified-section");
								this.releaseElementHeight(unclassifiedSection);

								document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
								e.target.classList.add('active');

								this.viewMode = e.target.dataset.view;

								this.toggleFoldAllSubjCards();

								this.saveViewMode();
								this.holdElementHeight(unclassifiedSection, 1000);
							};
						});
					}

					attachFoldToggleBtnListener() {
						document.querySelector(".fold-toggle").onclick = (e) => {
							e.target.classList.toggle("active");
							if (e.target.classList.contains("active")) {
								this.foldAllModuleCards();
							}
							else {
								this.unfoldAllModuleCards();
							}
						}
					}

				//#endregion




				//#region Selection Notifs listeners

					attachNotifBtnsListener(notifDiv=document) {
						if (notifDiv?.classList?.contains("selected-card-notif-div")) {
							this.attachNotifDelBtnListener(notifDiv.querySelector(".selected-card-notif-div-del-btn"));
							this.attachNotifScrollBtnListener(notifDiv.querySelector(".selected-card-notif-div-scroll-btn"));
						}
						else {
							const validContainer = notifDiv instanceof HTMLElement || notifDiv instanceof HTMLDocument ? notifDiv : document;
							validContainer.querySelectorAll(".selected-card-notif-div-del-btn").forEach(delBtn => {
								this.attachNotifDelBtnListener(delBtn);
							})
							validContainer.querySelectorAll(".selected-card-notif-div-scroll-btn").forEach(scrollBtn => {
								this.attachNotifScrollBtnListener(scrollBtn);
							})
						}
					}

					attachNotifDelBtnListener(delBtn) {
						delBtn.onclick = (e) => {
							const notifDiv = e.target.closest(".selected-card-notif-div");
							this.removeCardFromSelection(notifDiv);
						};
					}

					attachNotifScrollBtnListener(scrollBtn) {
						scrollBtn.onclick = (e) => {
							this.scrollToClientHighestElem({id: e.target.dataset.targetid, smooth: true, block: "center"})
						}
					}

				//#endregion




				//#region Module cards listeners

					attachModuleInfoClearBtns() {
						document.querySelectorAll(".module-info-clear.sim").     forEach(simClear => {
							simClear.onclick = () => {
								this.clearSimGrades(simClear.dataset.semester, simClear.dataset.module);
								this.generateContent();
							}
						});
						document.querySelectorAll(".module-info-clear.disabled").forEach(disClear => {
							disClear.onclick = () => {
								this.clearIgnoredGradesForModule(disClear.dataset.semester, disClear.dataset.module);
								this.generateContent();
							}
						});
					}

					attachAllModuleCardDeleteBtnsListener(container=document.body) {
						container.querySelectorAll(".module-delete-btn").forEach(btn => {
							this.attachModuleCardDeleteBtnListener(btn);
						})
					}

					attachModuleCardDeleteBtnListener(btn) {
						btn.onclick = (e) => {this.moduleCardDeleteBtnAction(e)};
					}

				//#endregion




				//#region Subject cards listeners

					attachAllSubjectCardRelatedEventListenersForEverySubjectCard(container=document.body) {

						this.attachAllDragOrTickIconsListener(container);

						this.attachAllSubjectNameInputsListener(container);
						this.attachAllSubjectCoefInputBoxesListener(container);
						this.attachAllSubjectDeleteBtnsListener(container);

						this.attachAllGradesCheckboxListeners(container);

						this.attachAllSimGradeAddBtnsListener(container);
						this.attachAllSimGradeInputEditsListener(container);
						this.attachAllSimGradeDelBtnsListener(container);

						if (this.editMode)  {this.attachAllCardsOnDragEventListeners(container);} else {this.detachAllCardsOnDragEventListeners(container)};
					}

					attachAllSubjectCardRelatedEventListeners(subjCard) {
						const nameInputBox  = subjCard.querySelector(".subject-name.input");
						const coefInputBox  = subjCard.querySelector(".subject-coef-input-box");
						const subjectDelBtn = subjCard.querySelector(".subject-delete-btn");

						this.attachDragOrTickIconListener(subjCard);

						if (nameInputBox)   { this.attachSubjectNameInputListener(nameInputBox); }
						if (coefInputBox)   { this.attachSubjectCoefInputBoxListener(coefInputBox); }
						if (subjectDelBtn)  { this.attachSubjectDeleteBtnListener(subjectDelBtn); }
						
						this.attachAllGradesCheckboxListeners(subjCard);

						this.attachAllSimGradeAddBtnsListener(subjCard);
						this.attachAllSimGradeInputEditsListener(subjCard);
						this.attachAllSimGradeDelBtnsListener(subjCard);

						this.attachDragOrTickIconListener(subjCard)

						if (this.editMode)  {this.attachSubjectCardOnDragEventListeners(subjCard);} else {this.detachAllCardsOnDragEventListeners(subjCard)};
					}

					/** Ensures all selected Subject Cards have a tick icon with their assigned event listeners instead of the default drag icon, and attach them the correct event listener */
					attachAllDragOrTickIconsListener(container=document.body) {
						container.querySelectorAll(".subject-card, .module-card").forEach(card => {
							this.attachDragOrTickIconListener(card);
						})
					}
					attachDragOrTickIconListener(card) {
						const type = card?.classList?.contains("subject-card") ? "subject" : (card?.classList?.contains("module-card") ?  "module" : undefined) ;
						if (type) {
							if (card.querySelector(`.drag-icon.${type}`)) {
								const dragIcon = card.querySelector(`.drag-icon.${type}`);
								dragIcon.onclick = (e) => { this.dragIconOnClickEvent(e) };
							}
							else 
							if (card.querySelector(`.tick-icon.${type}`)) {
								const tick = card.querySelector(`.tick-icon.${type}`);
								tick.onclick = (e) => { this.tickIconOnClickEvent(e, tick) };
							}
						}
					}

					attachAllSubjectCoefInputBoxesListener(container=document.body) {
						container.querySelectorAll(".subject-coef-input-box").forEach(inputBox => {
							this.attachSubjectCoefInputBoxListener(inputBox);
						})
					}
					attachSubjectCoefInputBoxListener(inputBox) {
						inputBox.onchange = (e) => {
							const semX          = e.target.dataset.semester;
							const moduleName    = e.target.dataset.module;
							const subject       = e.target.dataset.subject;
							const newCoef       = e.target.value;
							this.moduleConfig[semX][moduleName].coefficients[subject] = newCoef;

							this.saveConfig();
							this.getGradesDatas();
							this.regenAveragesAndTotalCoefs(semX, moduleName, subject);
						};
					}

					
					attachAllSubjectDeleteBtnsListener(container=document.body) {
						container.querySelectorAll(".subject-delete-btn").forEach(btn => {
							this.attachSubjectDeleteBtnListener(btn);
						})
					}
					attachSubjectDeleteBtnListener(btn) {
						btn.onclick = (e) => {this.subjectCardDeleteBtnAction(e.target)};
					}

					attachAllSubjectNameInputsListener(container=document.body) {
						container.querySelectorAll(".subject-name.input").forEach(input => {
							this.attachSubjectNameInputListener(input);
						})
					}
					attachSubjectNameInputListener(input) {
						input.onchange = (e) => {this.subjectCardNameInputAction(e.target)};
					}
					
				//#endregion




				//#region grades listeners

					attachAllGradesCheckboxListeners(container=document.body) {
						container.querySelectorAll('.grade-checkbox').forEach(chbx => {
							this.attachGradeCheckboxListener(chbx)
						});
					}
					attachGradeCheckboxListener(chbx) {
						chbx.onclick = (e) => {
							this.gradeCheckboxAction(e.target)
						}
					}

					attachAllSimGradeAddBtnsListener(container=document.body) {
						container.querySelectorAll('.sim-add-btn').forEach(btn=>{
							this.attachSimGradeAddBtnListener(btn);
						});
					}
					attachSimGradeAddBtnListener(btn) {
						btn.onclick = (e) => {this.simGradeAddBtnAction(e.target)};
					}

					attachAllSimGradeDelBtnsListener(container=document.body) {
						container.querySelectorAll('.sim-del-btn').forEach(btn=>{
							this.attachSimGradeDelBtnListener(btn)
						})
					}
					attachSimGradeDelBtnListener(btn) {
						btn.onclick = (e) => {this.simGradeDelBtnAction(e.target)};
					}

					attachAllSimGradeInputEditsListener(container=document.body) {
						container.querySelectorAll(".simulated-grade-input-edit").forEach(input => {
							this.attachSimGradeInputEditListener(input)
						})
					}
					attachSimGradeInputEditListener(input) {
						input.onchange = (e) => {this.simGradeInputEditAction(e.target)};
					}

				//#endregion


			//#endregion





			//#region -—Events Action





				//#region Over header btns

					dismissAllOverHeaderBtns() {
						this.dismissHelpOverHeaderBtns();
						this.dismissIssuesOverHeaderBtns();
					}

					openIssuesOverHeaderBtns() {
						const issueBtn      = document.querySelector(".issue.issue-btn");
						const mailInfo      = document.querySelector(".issue.mail-info");
						const shareConfig   = document.querySelector(".issue.share-config");
						const suggestIdea   = document.querySelector(".issue.suggest-idea");
						const reportIssue   = document.querySelector(".issue.report-issue");


						issueBtn   .classList.add("open");
						mailInfo   .classList.add("open"); mailInfo   .tabIndex = "0";
						shareConfig.classList.add("open"); shareConfig.tabIndex = "0";
						suggestIdea.classList.add("open"); suggestIdea.tabIndex = "0";
						reportIssue.classList.add("open"); reportIssue.tabIndex = "0";
					}

					dismissIssuesOverHeaderBtns() {
						const issueBtn      = document.querySelector(".issue.issue-btn");
						const mailInfo      = document.querySelector(".issue.mail-info");
						const shareConfig   = document.querySelector(".issue.share-config");
						const suggestIdea   = document.querySelector(".issue.suggest-idea");
						const reportIssue   = document.querySelector(".issue.report-issue");


						issueBtn   .classList.remove("open");
						mailInfo   .classList.remove("open"); mailInfo   .tabIndex = "-1";
						shareConfig.classList.remove("open"); shareConfig.tabIndex = "-1";
						suggestIdea.classList.remove("open"); suggestIdea.tabIndex = "-1";
						reportIssue.classList.remove("open"); reportIssue.tabIndex = "-1";
					}

					openHelpOverHeaderBtns() {
						const helpBtn       = document.querySelector(".over-header-btn.how-to-use-btn");
						const helpMenu      = document.querySelector(".over-header-how-to-use-btns");
						const docBtn        = document.querySelector(".over-header-btn.doc-btn");
						const tutoBtn       = document.querySelector(".over-header-btn.tuto-btn");


						helpBtn .classList.add("open");
						helpMenu.style.display = "";
						clearTimeout(this.timeouts?.openHelpMenu);
						this.timeouts.openHelpMenu = setTimeout(()=>{helpMenu.classList.add("open");}, 10);
						docBtn  .tabIndex = "0";
						tutoBtn .tabIndex = "0";

						this.dismissFirstTimeNotif();
					}

					dismissHelpOverHeaderBtns() {
						const helpBtn       = document.querySelector(".over-header-btn.how-to-use-btn");
						const helpMenu      = document.querySelector(".over-header-how-to-use-btns");
						const docBtn        = document.querySelector(".over-header-btn.doc-btn");
						const tutoBtn       = document.querySelector(".over-header-btn.tuto-btn");
						
						
						helpBtn    .classList.remove("open");
						helpMenu   .classList.remove("open");
						clearTimeout(this.timeouts?.openHelpMenu);
						this.timeouts.openHelpMenu = setTimeout(()=>{helpMenu.style.display = "none";}, 200);
						docBtn     .tabIndex = "-1";
						tutoBtn    .tabIndex = "-1";
					}

					dismissFirstTimeNotif() {
						const newUserNotif  = document.querySelector(".new-user-notif");

						if (newUserNotif) {
							const helpOverHeaderBtn = document.querySelector(".over-header-btn.how-to-use-btn");
							const newUserNotifFullScreen = document.querySelector(".focus-notif-fullscreen-effect");
							const newUserNotifArrows = document.querySelectorAll(".new-user-notif-arrow-path");
							
							newUserNotifFullScreen.classList.remove("focus");
							setTimeout(() => {helpOverHeaderBtn.style.zIndex = ""; newUserNotifFullScreen.style.display = "none";}, 500);

							newUserNotif.style.animationPlayState = "paused";
							newUserNotifArrows.forEach(arrow => {arrow.style.animationPlayState = "paused";})
							newUserNotif.style.top = `-40px`;
							newUserNotif.style.opacity = "0%";
							newUserNotif.style.cursor = "default";
							newUserNotif.onclick = null;
							setTimeout(() => {newUserNotif.style.display = "none"}, 300);
							
							localStorage.setItem("ECAM_DASHBOARD_FIRST_LOAD", false);
							this.firstLoad = false;
							setTimeout(() => {newUserNotifFullScreen.remove(); newUserNotif.remove()}, 500);
						}
					}

				//#endregion




				//#region Modals


					closeEveryModal() {
						this.closeKeybindsModal();
						this.closeOnlineCfgPickerModal();
						this.closeSettingsModal();
					}


					
					openKeybindsModal(closeOtherModals=true) {
						if (closeOtherModals) { this.closeEveryModal() }

						const keybindsMenu = document.createElement("div");
						keybindsMenu.className = "keyboard-shortcut-list-container";
						keybindsMenu.id = "keyboardShortcutListContainer";
						keybindsMenu.innerHTML = `
							<div class="keyboard-shortcut-list-modal modal${this.settings.blurEnabled.value ? " blur" : ""} jura" id="keyboardShortcutListModal">
								<div class="keyboard-shortcut-list-modal-body" id="keyboardShortcutListModalBody"></div>
							</div>
						`;

						this.ecamDash.appendChild(keybindsMenu);
						this.appendCloseModalIcon(document.querySelector("#keyboardShortcutListModal"))
						this.appendKeyboardShortcutsList(keybindsMenu.querySelector("#keyboardShortcutListModalBody"));
						setTimeout(() => {keybindsMenu.querySelector("#keyboardShortcutListModal").classList.add("show");}, 5);
						
						keybindsMenu.onmousedown = (e) => {
							if ((e.target.closest(".modal-close-btn") || !e.target.closest("#keyboardShortcutListModal")) && !document.querySelector(".focus-notif-fullscreen-effect.focus")) {
								keybindsMenu.onmouseup = (e) => {
									if ((e.target.closest(".modal-close-btn") || !e.target.closest("#keyboardShortcutListModal") && !document.querySelector(".focus-notif-fullscreen-effect.focus"))) {
										this.closeKeybindsModal()
									}
									keybindsMenu.onmouseup = null;
								}
							}
						}
					}

					closeKeybindsModal() {
						const keybindsMenu = document.querySelector("#keyboardShortcutListContainer");
						if (keybindsMenu) {
							keybindsMenu.querySelector(".keyboard-shortcut-list-modal").classList.remove("show");
							setTimeout(() => {keybindsMenu.remove()}, 300);
						}
					}

					openSettingsModal(closeOtherModals=true) {
						if (closeOtherModals) { this.closeEveryModal() }
						
						const settingsModalContainer = document.createElement("div");
						settingsModalContainer.className = "settings-modal-container";
						settingsModalContainer.id = "settingsModalContainer";
						settingsModalContainer.innerHTML = `<div class="settings-modal modal${this.settings.blurEnabled.value ? " blur" : ""}" id="settingsModal"></div>`;
						
						this.ecamDash.appendChild(settingsModalContainer);
						const settingsModal = settingsModalContainer.querySelector("#settingsModal");

						this.appendCloseModalIcon(settingsModal)
						this.appendSettingsModalBody();

						setTimeout(() => {settingsModal.classList.add("show")}, 5);

						this.attachSettingsModalContainerListeners();
					}

					closeSettingsModal() {
						const settingsModal = document.querySelector("#settingsModal");
						if (settingsModal) {
							settingsModal.classList.remove("show"); 
							setTimeout(() => {settingsModal.parentElement.remove()}, 300); 
						}
					}


				//#endregion




				//#region Semester


					semesterHeaderMouseUpNoMoveAction() {
						document.body.onmousemove = (e) => {
							e.preventDefault();
							document.body.onmouseup = null;
							document.body.onmousemove = null;
						}
						document.body.onmouseup = (e) => {
							const header = e.target.closest('.semester-header');
							const sem = header.dataset.semester;
							const content = document.getElementById(`sem-content-${sem}`);
							const toggle = header.querySelector('.semester-toggle');

							if (content.classList.contains('show')) {
								content.classList.remove('show'); toggle.classList.remove('open'); content.style.display = 'none';
							} else {
								content.classList.add('show'); toggle.classList.add('open'); content.style.display = 'flex';
							}

							if (document.body.clientHeight > document.body.offsetHeight) {
								// Semester has been collapsed, and now the page is tinier than the window, and i want to avoid the slider to offset the page. Only useful in Backup mode
								this.ecamDash.style.paddingRight = "10px";
							}
							else {
								this.ecamDash.style.paddingRight = "";
							}
							
							document.body.onmouseup = null;
							document.body.onmousemove = null;
						}
					}

					releaseUnclassifiedSection() {
						
						const unclassifiedSection = document.querySelector(".unclassified-section");
						unclassifiedSection.style.height = "";
					}

				//#endregion




				//#region Module







					
					// MARK: - module header mouse action
					/** Method temporarily attaching an onmousemove and an onmouseup event listener to the document's body.
					 * 
					 * Meant to be invoked when the mouse down event is triggered if the target is or is contained in a module header.
					 * 
					 * In practice, when the onmousedown event of the document is triggered on a module card, call this method to:
					 * - attach an onmousemove event listener to the document's body that will clear the onmousemove and onmouseup events of the document's body in order to "cancel" the action (safe guard for when the edit mode is off and the user attempts to drag the module header, it will not do anything instead of triggering an onclick event)
					 * - attach an onmouseup event listener to the document's body that will make the action intended to happen when the user clicks on the module header (folding the module card) WITHOUT moving the mouse (so if it wasn't an attempt to drag the module header). Both the onmousemove and onmouseup event listeners of the document's body will then be cleared.
					 */
					moduleHeaderMouseUpNoMoveAction() {
						document.body.onmousemove = (e) => {
							e.preventDefault();
							document.body.onmouseup     = null;
							document.body.onmousemove   = null;
						};
						document.body.onmouseup = (e) => {
							const moduleCard    = e.target.closest('.module-card');
							const moduleDetails = moduleCard.querySelector(".module-details");
							
							// moduleDetails.querySelectorAll(".subject-card").forEach(subjCard => { 
							//     if (this.selectedSubjectCardsId.includes(subjCard.id)) {
							//         this.changeDragIconToTickIcon(subjCard);
							//     } 
							// })

							this.toggleFoldModuleCard(moduleCard);
							
							this.attachDropFieldsEventListeners("insert", moduleDetails);
							document.body.onmousemove   = null;
							document.body.onmouseup     = null;
						}
					}



				
					// MARK: -toggle module card folding
					/** Call this method to switch all Module cards' state between folded and unfolded 
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the folded module card ID's addition to/deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					toggleFoldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						document.querySelectorAll(".module-card").forEach(moduleCard => {
							this.toggleFoldModuleCard(moduleCard, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
						})
					}
					/** Call this method to switch a module card's state between folded and unfolded 
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the folded module card ID's addition to/deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					toggleFoldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						if (trigger?.classList?.contains("module-card") || (trigger?.target?.classList?.contains("module-card"))) {
							const moduleCard = trigger?.target || trigger;
							if (moduleCard.classList.contains("fold")) {
								this.unfoldModuleCard(moduleCard, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
							}
							else {
								this.foldModuleCard(moduleCard, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
							}
						}
					}

					// MARK: -fold module card
					/** Call this method to fold all module cards 
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the folded module card ID's addition to this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					foldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						document.querySelectorAll(".module-card").forEach(moduleCard => {
							this.foldModuleCard(moduleCard, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
						})
					}
					/** Call this method to fold a module card
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the folded module card ID's addition to this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					async foldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						// testing if the trigger argument is an HTML of class module-card or an Event triggered by a module card or one of its elements

						if (trigger?.classList?.contains("module-card") || (trigger?.target?.classList?.contains("module-card"))) {
							// Identifying the moduleCard depending on whether the trigger argument is a module card or an event triggered by a module card
							const moduleCard        = trigger?.target || trigger;
							const moduleHeader      = moduleCard.querySelector(".module-card-header");
							const toggle            = moduleCard.querySelector('.module-toggle');
							const sem               = moduleCard.dataset.semester;
							const module            = moduleCard.dataset.module;
							const index             = moduleCard.dataset.index;

							if (hideAdjacentModuleInsertionFields != "only") {

								if (!bypassFoldedModuleCardsId) {
									this.foldedModuleCardsId.push(moduleCard.id);
								}
								
								toggle.classList.remove("open");
								
								const subjectInsertFields = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]${hideOtherSubjectInsertionFields ? "" : `[data-module="${module}"]`}`)
								const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});

								subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {
									this.detachInsertFieldHitboxEventListeners(subjInsFieldHitbox);
								})

								moduleCard.style.height = this.getElementHeightConsideringChildrenHeight(moduleCard) + "px";
								moduleHeader.classList.add("fold");
								moduleCard.classList.add("fold");
								setTimeout(() => {
									moduleCard.style.height = "77px";
								}, 1)
							}

							let upperInsertField = "";
							let lowerInsertField = "";

							if (hideAdjacentModuleInsertionFields) {
								upperInsertField = document.querySelector(`.drop-field.insert-field.module[data-semester="${sem}"][data-index="${parseInt(index)+0}"]`)
								const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-module-card-insert-hitbox");

								lowerInsertField = document.querySelector(`.drop-field.insert-field.module[data-semester="${sem}"][data-index="${parseInt(index)+1}"]`)
								const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-module-card-insert-hitbox");
								
								this.detachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
								this.detachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
								upperInsertField.classList.remove("show");
								lowerInsertField.classList.remove("show");
							}


							clearTimeout(this.timeouts.upperInsertFieldUnfoldTimeout);
							clearTimeout(this.timeouts.lowerInsertFieldUnfoldTimeout);
							clearTimeout(this.timeouts.subjectInsertFieldUnfoldTimeout);
							clearTimeout(this.timeouts.subjectCardsUnfoldTimeout);
							clearTimeout(this.timeouts.moduleCardElemsUnfoldTimeout);
							clearTimeout(this.timeouts.moduleCardUnfoldTimeout);

							if (this.foldedModuleCardsId.length == document.querySelectorAll(".module-card").length) {
								document.querySelector(".fold-toggle").classList.add("active")
							}
						}
						
					}

					// MARK: -unfold module card
					/** Call this method to unfold all module cards
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be shown (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the unfolded module card ID's deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					unfoldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						document.querySelectorAll(".module-card").forEach(moduleCard => {
							this.unfoldModuleCard(moduleCard, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
						})
					}
					/** Call this method to unfold a module card
					 * 
					 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module card HTML Element or an event triggered by a module card
					 * @param {Boolean} [hideOtherSubjectInsertionFields = false] Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be shown (if true) or not (if false)
					 * @param {Boolean} [hideAdjacentModuleInsertionFields = false] Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
					 * @param {Boolean} [bypassFoldedModuleCardsId = false] Default: false — Destined to control whether the unfolded module card ID's deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
					 */
					async unfoldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
						// testing if the trigger argument is an HTML of class module-card or an Event triggered by a module card or one of its elements

						if (trigger?.classList?.contains("module-card") || (trigger?.target?.classList?.contains("module-card"))) {
							// Identifying the moduleCard depending on whether the trigger argument is a module card or an event triggered by a module card
							const moduleCard        = trigger?.target || trigger;
							const moduleHeader      = moduleCard.querySelector(".module-card-header");
							const toggle            = moduleCard.querySelector('.module-toggle');
							const sem               = moduleCard.dataset.semester;
							const module            = moduleCard.dataset.module;
							const index             = moduleCard.dataset.index;


							clearTimeout(this.timeouts.foldModuleCardTimeout);


							if (hideAdjacentModuleInsertionFields) {
								const upperInsertField = document.querySelector(   `.drop-field.insert-field.module[data-semester="${sem}"][data-index="${parseInt(index)+0}"]`);
								const lowerInsertField = document.querySelector(   `.drop-field.insert-field.module[data-semester="${sem}"][data-index="${parseInt(index)+1}"]`);

								if (upperInsertField) {
									upperInsertField.classList.add("show");
									const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-module-card-insert-hitbox");
									this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
								}
								
								if (lowerInsertField) {
									lowerInsertField.classList.add("show");
									const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-module-card-insert-hitbox");
									this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
								}
							}



							if (hideAdjacentModuleInsertionFields != "only") {
								toggle.classList.add("open");

								const subjectInsertFields = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]${hideOtherSubjectInsertionFields ? `[data-module="${module}"]` : ""}`);
								if (subjectInsertFields.length > 0) {
									this.timeouts.subjectInsertFieldUnfoldTimeout = setTimeout(() => {
										const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});
										subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {this.attachInsertFieldHitboxEventListeners(subjInsFieldHitbox)})
									}, 1)
								}
								
								if (moduleHeader) {
									setTimeout(() => {
										moduleHeader.classList.remove("fold");
									}, 1)
								}
								
								if (moduleCard) {
									setTimeout(() => {
										moduleCard.style.height = this.getElementHeightConsideringChildrenHeight(moduleCard) + "px";
										moduleCard.classList.remove("fold");
										this.timeouts.moduleCardUnfoldTimeout = setTimeout(() => {moduleCard.style.height = ""}, 300)
									}, 1)
								}

								if (!bypassFoldedModuleCardsId) {
									setTimeout(() => {
										this.foldedModuleCardsId.splice(this.foldedModuleCardsId.indexOf(moduleCard.id), 1);
									}, 2)
								}
							}

							if (this.foldedModuleCardsId.length == 0) {
								document.querySelector(".fold-toggle").classList.remove("active")
							}
							
						}
					}

					ensureAllModuleCardsFoldingState(container=document.body) {
						if (container instanceof HTMLElement || container instanceof HTMLDocument) {
							container.querySelectorAll(".module-card").forEach(moduleCard => {
								this.ensureModuleCardFoldingState(moduleCard);
							})
						}
					}
					ensureModuleCardFoldingState(moduleCard) {
						if (moduleCard?.classList?.contains(".module-card")) {
							if (this.foldedModuleCardsId.contains(moduleCard)) {
								this.foldModuleCard(moduleCard);
							}
							else {
								this.unfoldModuleCard(moduleCard);
							}
						}
					}




					moduleTitleInputChangeAction(target) {
						const sem               = target.dataset.semester;
						const newModuleName     = target.value;
						const oldModuleName     = target.dataset.module; 
						const oldModuleIndex    = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);

						let diffName = true;
						if (newModuleName == "__#unclassified#__") {
							alert(!this.langIsEn 
								? "Ce nom n'est pas autorisé ! C'est le nom utilisé en interne pour les matières non-classifiées... Choisis-en un autre!" 
								: "This name isn't allowed! That's the name used internally for unclassified subjects... Choose another one!"
							)
							return;
						}
						else {
							Object.keys(this.moduleConfig[sem]).forEach(_moduleName => {
								if (_moduleName == newModuleName && _moduleName != oldModuleName) {
									alert(!this.langIsEn 
										? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
										: "This subject already exists! Please choose a different name"
									)
									diffName = false;
									this.scrollToClientHighestElem({id: target.id, smooth: true, block: "center"})
									target.focus();
									target.style.background = "#ff7979";
								}
							});
						}
						
						if (diffName) {
							this.moduleConfig[sem][newModuleName] = this.moduleConfig[sem][oldModuleName];
							delete this.moduleConfig[sem][oldModuleName];
							this.moduleConfig[sem].__modules__[oldModuleIndex] = newModuleName;
	
							this.saveConfig()
							this.getGradesDatas();
							this.generateContent({fadeIn: false});
	
							this.foldedModuleCardsId.forEach(foldedModuleCardId => {
								if (foldedModuleCardId == `module-card-${oldModuleName}-in-semester-${sem}`) {
									const moduleCardToFold = document.getElementById(foldedModuleCardId);
									if (!moduleCardToFold) {
										const newModuleCardToFold = document.getElementById(`module-card-${newModuleName}-in-semester-${sem}`);
										this.foldModuleCard(newModuleCardToFold.querySelector(`.module-card-header`));
									}
								}
							})
							
							this.attachAllCardsOnDragEventListeners();
							this.scrollToClientHighestElem({id: `module-card-${newModuleName}-in-semester-${sem}`, smooth: true})
						}
					}

					moduleCardDeleteBtnAction(e) {
						const moduleCard    = e instanceof Event ? e.target.closest(".module-card") : (e instanceof HTMLElement ? e : undefined);
						let sem             = moduleCard.dataset.semester; 
						let moduleName      = moduleCard.dataset.module;

						if (this.selectedModuleCardsId.includes(moduleCard.id)) {
							this.selectedModuleCardsId.forEach(selectedModuleCardId => {
								const selectedModuleCard = document.getElementById(selectedModuleCardId);
								sem         = selectedModuleCard.dataset.semester;
								moduleName  = selectedModuleCard.dataset.module;
								
								const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(moduleName);
								this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
								delete this.moduleConfig[sem][moduleName];
								
								if (this.moduleConfig[sem].__modules__.length == 0) {delete this.moduleConfig[sem]}

								this.removeCardFromSelection()
							})
						}
						else {
							const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(moduleName);
	
							this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
							delete this.moduleConfig[sem][moduleName];
	
							if (this.moduleConfig[sem].__modules__.length == 0) {delete this.moduleConfig[sem]}
						}
						
						
						this.clearSimGrades(sem, moduleName);
						this.saveConfig();
						this.getGradesDatas();
						this.generateContent();
					}
					
				//#endregion




				//#region Subject

					/** Method temporarily attaching an onmousemove and an onmouseup event listener to the document's body.
					 * 
					 * Meant to be invoked when the mouse down event is triggered if the target is or is contained in a card header.
					 * 
					 * In practice, when the onmousedown event of the document is triggered on a card header, call this method to:
					 * - attach an onmousemove event listener to the document's body that will clear the onmousemove and onmouseup events of the document's body in order to "cancel" the action (safe guard for when the edit mode is off and the user attempts to drag the card header, it will not do anything instead of triggering an onclick event)
					 * - attach an onmouseup event listener to the document's body that will make the action intended to happen when the user clicks on the card header (switching the card card between detailed and comapct view modes) WITHOUT moving the mouse (so if it wasn't an attempt to drag the card header). Both the onmousemove and onmouseup event listeners of the document's body will then be cleared.
					 */
					subjectHeaderMouseUpNoMoveAction() {

						document.body.onmousemove = (e) => {
							e.preventDefault();
							document.body.onmouseup = null;
							document.body.onmousemove = null;
						};
						document.body.onmouseup = (e) => {
							const subjCard  = e.target.closest('.subject-card');
							const unclassifiedSection = document.querySelector(".unclassified-section");

							if (subjCard) {
								if (subjCard.classList.contains("unclassified")) {
									this.releaseElementHeight(unclassifiedSection);
								}

								this.toggleFoldSubjCard(subjCard);
							
								this.setGradesTableTotalCoef(subjCard);
								this.attachAllSubjectCardRelatedEventListeners(subjCard);

								if (subjCard.classList.contains("unclassified")) {
									this.holdElementHeight(unclassifiedSection, 200, {offset: 4});
								}
							}
							
							document.body.onmousemove = null;
							document.body.onmouseup = null;
						}
						
					}



					/** Toggles the folding of all the subject cards inside the given container
					 * @param {HTMLElement} [container=document.body] Default: document.body — The HTML element containing the subject cards whose fold mode will be toggled
					 * @param {boolean} [smart=true] Default: true — If true, takes into consideration the current view mode to know if the subject card should be folded of unfolded. If false, simply toggle the folding mode.
					 */
					async toggleFoldAllSubjCards(container=document.body, smart=true, bypassFoldedSubjectCardId=false) {
						if (container instanceof HTMLElement) {
							if (smart) {
								if (this.viewMode == "detailed") {
									this.unfoldAllSubjCards(container, bypassFoldedSubjectCardId);
								}
								else if (this.viewMode == "compact") {
									this.foldAllSubjCards(container, bypassFoldedSubjectCardId);
								}
							}
							else {
								(container.querySelectorAll(".subject-card") || []).forEach(subjCard => {
									if (subjCard?.classList?.contains("detailed")) {
										this.foldSubjCard(subjCard, bypassFoldedSubjectCardId);
									}
									else if (subjCard?.classList?.contains("compact")) {
										this.unfoldSubjCard(subjCard, bypassFoldedSubjectCardId);
									}
								})
							}
						}
					}
					/** Toggles the folding of the given subject card
					 * @param {HTMLElement} subjCard The subject cards whose fold mode will be toggled
					 */
					async toggleFoldSubjCard(subjCard, bypassFoldedSubjectCardId=false) {
						if (subjCard?.classList?.contains("detailed")) {
							this.foldSubjCard(subjCard, bypassFoldedSubjectCardId);
						}
						else if (subjCard?.classList?.contains("compact")) {
							this.unfoldSubjCard(subjCard, bypassFoldedSubjectCardId);
						}
					}

					// MARK: fold subject card
					/** Folds all the subject cards inside the given container
					 * @param {HTMLElement} [container=document.body] The HTML element containing the subject cards to fold
					 */
					async foldAllSubjCards(container=document.body, bypassFoldedSubjectCardId=false) {
						if (container instanceof HTMLElement) {
							(container.querySelectorAll(".subject-card.detailed") || []).forEach(detailedSubjCard => {
								this.foldSubjCard(detailedSubjCard, bypassFoldedSubjectCardId);
							})
						}
					}
					/** Folds the given subject card
					 * @param {HTMLElement} [subjCard] The subject card to fold
					 */
					async foldSubjCard(subjCard, bypassFoldedSubjectCardId=false) {
						if (subjCard?.classList?.contains("subject-card")) {
							const subjCardHeader = subjCard.querySelector(".subject-card-header");
							subjCardHeader.classList.add("fold");
							subjCardHeader.classList.replace("detailed", "compact");
							
							// setting the proper height to the subject card so that only the header is visible
							subjCard.style.height = "70px";
							subjCard.classList.replace("detailed", "compact");
							subjCard.querySelector(".subject-card-header-grades-details").classList.add("show");
							
							if (!bypassFoldedSubjectCardId) this.compactSubjCardsId.push(subjCard.id);
							this.detailedSubjCardsId.splice(this.detailedSubjCardsId.indexOf(subjCard.id), 1);
						}
					}

					// MARK: unfold subject card
					/** Unfolds all the subject cards inside the given container
					 * @param {HTMLElement} [container=document.body] The HTML element containing the subject cards to unfold
					 * @param {Boolean} [bypassFoldedSubjectCardId=false] Default: false — If true, allows to bypass saving the unfolded subject card's id upon unfolding it
					 */
					async unfoldAllSubjCards(container=document.body, bypassFoldedSubjectCardId=false) {
						if (container instanceof HTMLElement) {
							(container.querySelectorAll(".subject-card.compact") || []).forEach(compactSubjCard => {
								this.unfoldSubjCard(compactSubjCard, bypassFoldedSubjectCardId);
							})
						}
					}
					/** Unfolds the given subject card
					 * @param {HTMLElement} [subjCard] The subject card to unfold
					 * @param {Boolean} [bypassFoldedSubjectCardId=false] Default: false — If true, allows to bypass removing the unfolded subject card's id from the saved folded subject cards' id upon unfolding it
					 */
					async unfoldSubjCard(subjCard, bypassFoldedSubjectCardId=false) {
						if (subjCard?.classList?.contains("subject-card")) {
							const subjCardHeader = subjCard.querySelector(".subject-card-header");
							subjCardHeader.classList.remove("fold");
							subjCardHeader.classList.replace("compact", "detailed");
							
							// setting the proper height to the subject card so that its whole content is visible
							subjCard.style.height = this.getElementHeightConsideringChildrenHeight(subjCard) + "px";
							subjCard.classList.replace("compact", "detailed");
							subjCard.querySelector(".subject-card-header-grades-details").classList.remove("show");

							if (!bypassFoldedSubjectCardId) this.compactSubjCardsId.splice(this.compactSubjCardsId.indexOf(subjCard.id), 1);
							this.detailedSubjCardsId.push(subjCard.id);
						}
					}



					subjectCardDeleteBtnAction(target) {
						const subjectCard    = document.getElementById(target.dataset.targetid);

						if (this.selectedSubjectCardsId.includes(subjectCard.id)) {
							this.selectedSubjectCardsId.forEach(selectedSubjCardId => {
								const selectedSubjectCard = document.getElementById(selectedSubjCardId);
								const sem           = selectedSubjectCard.dataset.semester;
								const moduleName    = selectedSubjectCard.dataset.module;
								const subject       = selectedSubjectCard.dataset.subject;
		
								const semData       = this.moduleConfig[sem];
								const moduleData    = semData[moduleName];
								const moduleIndex   = semData.__modules__.indexOf(moduleName);
								const subjectIndex  = moduleData.subjects.indexOf(subject);
		
								moduleData.subjects.splice(subjectIndex, 1);
								delete moduleData.coefficients[subject];
		
								if (moduleData.subjects.length == 0) {semData.__modules__.splice(moduleIndex, 1); delete semData[moduleName];}
								if (semData.__modules__.length == 0) {delete this.moduleConfig[sem]}

								this.removeCardFromSelection()
								this.clearSimGrades(sem, moduleName, subject);
							})
						}
						else {
							const sem           = target.dataset.semester;
							const moduleName    = target.dataset.module;
							const subject       = target.dataset.subject;
	
							const semData       = this.moduleConfig[sem];
							const moduleData    = semData[moduleName];
							
							const moduleIndex   = semData.__modules__.indexOf(moduleName);
							const subjectIndex  = moduleData.subjects.indexOf(subject);
	
							moduleData.subjects.splice(subjectIndex, 1);
							delete moduleData.coefficients[subject];
	
							if (moduleData.subjects.length == 0) {semData.__modules__.splice(moduleIndex, 1); delete semData[moduleName];}
							if (semData.__modules__.length == 0) {delete this.moduleConfig[sem]}
							
							this.clearSimGrades(sem, moduleName, subject);
						}

						
						this.saveConfig();
						this.getGradesDatas();
						this.generateContent();
					}

					subjectCardNameInputAction(target) {
						const subjNewName   = target.value;
						const subjectCardId = target.id.replace(/\bsubject-name-input/, "subject-card");
						const subjectCard   = document.getElementById(subjectCardId);
						const sem           = subjectCard.dataset.semester;
						const moduleName    = subjectCard.dataset.module;
						const subjOldName   = subjectCard.dataset.subject;
						const moduleDetails = subjectCard.parentElement;
						const moduleCard    = moduleDetails.parentElement;


						let diffName = true;
						if (subjNewName == "__#unclassified#__") {
							alert(!this.langIsEn 
								? "Ce nom n'est pas autorisé ! C'est le nom utilisé en interne pour les matières non-classifiées... Choisis-en un autre!" 
								: "This name isn't allowed! That's the name used internally for unclassified subjects... Choose another one!"
							)
							return;
						}
						else {
							this.moduleConfig[sem][moduleName].subjects.forEach(_subj => {
								if (_subj == subjNewName && _subj != subjOldName) {
									alert(!this.langIsEn 
										? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
										: "This subject already exists! Please choose a different name"
									)
									diffName = false;
									this.scrollToClientHighestElem({id: target.id, smooth: true, block: "center"})
									target.focus();
									target.style.background = "#ff7979";
									return;
								}
							});
						}


						if (diffName) {
							this.moduleConfig[sem].__modules__.forEach(moduleName => {
								this.moduleConfig[sem][moduleName].subjects.forEach(_subj => {
									if (_subj == subjNewName && _subj != subjOldName) {
										alert(!this.langIsEn 
											? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
											: "This subject already exists! Please choose a different name"
										)
										diffName = false;
										this.scrollToClientHighestElem({id: subjectCardId, smooth: true, block: "center"})
									}
								})
							})


							const oldSubjIndex = this.moduleConfig[sem][moduleName].subjects.indexOf(subjOldName);
							const pct   = Number(this.moduleConfig[sem][moduleName].coefficients    [subjOldName]);

							this.moduleConfig[sem][moduleName].subjects[oldSubjIndex]=subjNewName ;    // Replace the subject's old name by the subject's new name
							delete this.moduleConfig[sem][moduleName].coefficients [subjOldName];
							this.moduleConfig[sem][moduleName].coefficients [subjNewName] = pct;
										
							this.getGradesDatas();

							moduleDetails.innerHTML = this.createSubjCard(sem, moduleName, subjNewName);

							const unclassifiedSection = document.querySelector(".unclassified-section");
							const unclassifiedContent = unclassifiedSection.querySelector(".unclassified-content");
							unclassifiedSection.style.height = "";
							unclassifiedContent.innerHTML = this.createAllSubjCards(sem, "__#unclassified#__");
							
							this.resetFixedUnclassifiedSectionHeight();
							this.attachAllSubjectCardRelatedEventListenersForEverySubjectCard();
							this.setGradesTableTotalCoef();
							this.saveConfig()
							this.getGradesDatas();
						}
					}

				//#endregion




				//#region Grades

					gradeCheckboxAction(target) {
						if (target instanceof HTMLElement || target instanceof Event) {
							const realTarget    = target instanceof Event ? target.target : target;
							const semX          = realTarget.dataset.semester;
							const moduleName    = realTarget.dataset.module;
							const subj          = realTarget.dataset.subj;
							const simTimeStamp  = realTarget.dataset.simtimestamp;
							const gradeId       = realTarget.dataset.gradeid;
							const ignoredKey    = [semX, subj, simTimeStamp || gradeId].join("\\");

							if (realTarget.checked) {
								// remove this specific ignored key if present
								this.disabledGrades = this.disabledGrades?.filter(id => id !== ignoredKey);
							} else {
								// add ignored key if not already present
								if (!this.disabledGrades?.includes(ignoredKey)) this.disabledGrades.push(ignoredKey);
							}

							this.saveIgnoredGrades();
							this.getGradesDatas();
							// this.getGradesDatas({sem: semX, module: moduleName, subj});
							this.regenAveragesAndTotalCoefs(semX, moduleName, subj)
						}
					}
					
					simGradeAddBtnAction(target) {
						const moduleName    = target.dataset.module;
						const semX          = target.dataset.semester;
						const subj          = target.dataset.subj;
						this.ensureSimPath(semX, moduleName, subj);

						const typeInp   = document.querySelector(`.simulated-grade-input.sim-inp-type[data-semester="${ semX}"][data-subj="${subj}"]`);
						const gradeInp  = document.querySelector(`.simulated-grade-input.sim-inp-grade[data-semester="${semX}"][data-subj="${subj}"]`);
						const coefInp   = document.querySelector(`.simulated-grade-input.sim-inp-coef[data-semester="${ semX}"][data-subj="${subj}"]`);
						const dateInp   = document.querySelector(`.simulated-grade-input.sim-inp-date[data-semester="${ semX}"][data-subj="${subj}"]`);
						const type      = typeInp?.value||`${!this.langIsEn? 'Simulé' : "Simulated"}`;
						const grade     = parseFloat(gradeInp?.value||'');
						const coef      = parseFloat(coefInp?.value||'');
						const date      = dateInp?.value||'';
						if(isNaN(grade) || isNaN(coef)){ alert(!this.langIsEn ? "Note et coef requis" : "Grade and coef required"); return; }

						this.ensureSimPath(semX, moduleName, subj);

						// Making sure the automatically generated name (if the user didn't input any type name) isn't the same as one that already exists 
						// (incrementing an index every time it's the case and add it at the end of the new sim grade's name)
						let newName = type, validNewName = newName != type, count = 2;

						while (!validNewName && this.sim[semX][moduleName][subj].length > 0) {
							validNewName = true;
							this.sim[semX][moduleName][subj].forEach((_grade, _index) => {
								if (_grade.type == newName && validNewName) {
									validNewName = false;
									newName = type + ` (${count})`;
									count++;
								}
							})
						}

						this.sim[semX][moduleName][subj].push({
							grade, 
							coef,
							classAvg: '—',
							type: newName,
							date: '—',
							prof: '—',
							subject: subj,
							semester: semX,
							libelle: `[SIM] ${subj} - ${type}`,
							__sim: true,
							id: new Date().getYear() + "" + new Date().getMonth() + "" + new Date().getDay() + "" + new Date().getHours() + "" + new Date().getMinutes() + "" + new Date().getSeconds() + "" + new Date().getMilliseconds()
						});

						this.saveSim();
						this.getGradesDatas();
						this.generateContent();
					}

					simGradeInputEditAction(target) {
						const moduleName    = target.dataset.module;
						const semX          = target.dataset.semester;
						const subj          = target.dataset.subj;
						const id            = target.dataset.simid;
						const gradeRow      = target.parentElement.parentElement;
						const modifType     = target.dataset.modiftype;
						const value         = target.value;

						const gradeInp      = gradeRow.querySelector(`.simulated-grade-input-edit.sim-inp-grade`);
						const coefInp       = gradeRow.querySelector(`.simulated-grade-input-edit.sim-inp-coef `);
						const newGrade      = parseFloat(gradeInp?.value||'');
						const newCoef       = parseFloat(coefInp?.value||'');

						if(isNaN(newGrade) || isNaN(newCoef)){ alert(!this.langIsEn ? "Grade et coef requis" : "Grade and coef required"); return; }
						this.sim[semX][moduleName][subj][id][modifType] = value;

						this.saveSim();
						this.getGradesDatas();
						this.regenAveragesAndTotalCoefs(semX, moduleName, subj);

					}

					simGradeDelBtnAction(target) {
						const semX          = target.dataset.semester;
						const moduleName    = target.dataset.module;
						const subj          = target.dataset.subj;
						const id            = target.dataset.simid;
						this.sim[semX][moduleName][subj].splice(id, 1);

						this.deleteUnusedSimPath(false, semX, moduleName, subj);
						this.saveSim();
						this.getGradesDatas();
						// this.generateContent({fadeIn: false});

						const moduleCard = document.querySelector(`.module-card[data-module="${moduleName}"]`);
						const moduleIndex = moduleCard.dataset.index;
						moduleCard.outerHTML = this.createModuleCard(semX, moduleName, moduleIndex, true);

						const newModuleCard = document.querySelector(`.module-card[data-module="${moduleName}"]`);
						this.attachAllSubjectCardRelatedEventListenersForEverySubjectCard(newModuleCard);
						this.regenAveragesAndTotalCoefs(newModuleCard);
					}

				//#endregion




				//#region Drag/Tick icon

					changeDragIconToTickIcon(card) {
						const dragIcon = card.querySelector(".drag-icon");
						if (dragIcon) {
							const type = dragIcon.classList.contains("subject") ? "subject" : "module";
							dragIcon.outerHTML = `<div class="tick-icon ${type}" data-targetid="${card.id}" data-semester="${card.dataset.sem}" data-module="${card.dataset.moduleName}" data-subject="${card.dataset.subject}">✔</div>`;
							
							this.attachDragOrTickIconListener(card);
						}
					}

					changeTickIconToDragIcon(card) {
						const tickIcon = card.querySelector(".tick-icon");
						if (tickIcon) {
							const type = tickIcon.classList.contains("subject") ? "subject" : "module";
							tickIcon.outerHTML = this.createDraggableIcon(type, {targetId: card.id});

							this.attachDragOrTickIconListener(card);
						}
					}

					switchBetweenDragAndTickIcon(card) {
						const dragIcon = card.querySelector(".drag-icon");
						if (dragIcon) {
							this.changeDragIconToTickIcon(card);
						}
						else {
							this.changeTickIconToDragIcon(card);
						}
					}

					// MARK: dragIconOnClickEvent
					dragIconOnClickEvent(e, dontAddToSelection=false) {
						const card                  = e?.target instanceof HTMLElement ? document.getElementById(e.target.dataset.targetid) : (e instanceof HTMLElement ? e : undefined);
						const type                  = card.classList.contains("subject-card") ? "subject" : "module";
						const dropFieldAdd          = document.querySelector(".drop-field.create-module");
						const dropFieldAddHitbox    = document.querySelector(".drop-field-create-module-hitbox");
						const dropFieldRemove       = document.querySelector(".drop-field.remove-from-module");
						const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-module-hitbox");
						const sem                   = card.dataset.semester;
						const moduleName            = card.dataset.module;
						const subject               = card.dataset.subject;
						
						card.draggable = true;

						if (!dontAddToSelection) {
							if ((type == "subject" && this.selectedModuleCardsId.length > 0) || (type == "module" && this.selectedSubjectCardsId.length > 0)) {
								const oldInfoNotif = document.querySelector(".temp-notif");
								if (oldInfoNotif) {
									clearTimeout(this?.timeouts?.dragIconOnClickEvent?.hideInfoNotif);
									clearTimeout(this?.timeouts?.dragIconOnClickEvent?.removeInfoNotif);
									oldInfoNotif.remove();
								}
								const infoNotif = document.createElement("div");
								infoNotif.className = `temp-notif ${this.lang}`;
								this.ecamDash.appendChild(infoNotif);
								setTimeout(() => {infoNotif.classList.add("show")}, 1);
								
								
								if (!this?.timeouts?.dragIconOnClickEvent) {this.timeouts.dragIconOnClickEvent = {}}
								this.timeouts.dragIconOnClickEvent.hideInfoNotif = setTimeout(() => {
									infoNotif.classList.remove("show");
									this.timeouts.dragIconOnClickEvent.removeInfoNotif = setTimeout(() => {oldInfoNotif.remove()}, 1000);
								}, 4000);
	
								card.classList.add("slight-horiz-shake");
								card.onanimationend = (e) => {e.target.classList.remove("slight-horiz-shake");};
								return
							}
							else if (type == "subject") {
								this.selectedSubjectCardsId.push(card.id);
								
								if (!this.selectedSubjectCardsSortedByModule[card.dataset.module]) { this.selectedSubjectCardsSortedByModule[card.dataset.module] = []; };
								this.selectedSubjectCardsSortedByModule[card.dataset.module].push({cardId: card.id, selectionIndex: this.selectedSubjectCardsId.length-1});
							}
							else if (type == "module") {
								this.selectedModuleCardsId.push(card.id);
							}

							const selectionNotifDiv = this.createSelectedCardNotifDiv(card);

							document.querySelector(".selected-card-notif-container").appendChild(selectionNotifDiv);
							this.attachNotifBtnsListener(selectionNotifDiv);

							setTimeout(()=>{selectionNotifDiv.classList.add("on")}, 10)

							// Ensure the subject insertion drop fields are showing the right text
							document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
								if (this.selectedSubjectCardsId.length > 0 || this.selectedModuleCardsId.length > 0)  {
									subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
									subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
									subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").classList.replace("add", "insert");
									subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("add", "insert");
								}
							});
						}

						
						dropFieldAdd.classList.add("show");
						dropFieldAddHitbox.classList.add("show");
						dropFieldRemove.classList.add("show");
						dropFieldRemoveHitbox.classList.add("show");
						document.querySelector(".semester-content").classList.add("dragging");

						this.changeDragIconToTickIcon(card);
					}


					// MARK: tickIconOnClickEvent
					tickIconOnClickEvent(e, tick) {
						e.preventDefault();
						const targetId      = tick.dataset.targetid;
						const notifDiv      = document.querySelector(`.selected-card-notif-div.on[data-targetid="${targetId}"]`);
						
						this.removeCardFromSelection(notifDiv);
					}

				//#endregion

			//#endregion

		//#endregion






		//#region __________ — Drag  Events — __________








			//#region -— Event listeners  _____________________





				// MARK: attach ondrag events

				/** Attach the ondrag event listeners to the children/whole descendance of the given container
				 * 
				 * @example this.attachAllCardsOnDragEventListeners(document.querySelector("#container"))
				 * @example this.attachAllCardsOnDragEventListeners(document.querySelector("#container"), false)
				 * 
				 * @param {HTMLElement} [container=document] Default: document — The container of the HTML Elements to attach the ondrag event listeners to
				 * @param {Boolean} [descendants=true] Default: true — If true, also attaches the ondrag event listeners to all the descendance of the container. Otherwise, attaches the ondrag event listeners only to the direct children of the container
				 */
				attachAllCardsOnDragEventListeners(container=document, descendants=true) {
					if (container instanceof HTMLElement || container == document) {

						if (container?.classList?.contains("module-card-content") || container?.classList?.contains("module-details") || container?.classList?.contains("subject-card")) {
							(container?.classList?.contains("subject-card") ? [container] : container.querySelectorAll(".subject-card") || []).forEach(subjectCard => {
								this.attachSubjectCardOnDragEventListeners(subjectCard);
							})
						}
						else if (container?.classList?.contains("semester-content") || container?.classList?.contains("semester-grid") || container?.classList?.contains("modules-section") || container?.classList?.contains("semester-section") || container?.classList?.contains("module-card") || container == document.body|| container == document) {
							(container?.classList?.contains("module-card") ? [container] : container.querySelectorAll(".module-card") || []).forEach(moduleCard => {
								this.attachModuleCardOnDragEventListeners(moduleCard);
								
								if (descendants) {
									moduleCard.querySelectorAll(`.subject-card`).forEach(subjectCard => {
										this.attachSubjectCardOnDragEventListeners(subjectCard);
									})
									
								}
							})

							container.querySelectorAll(`.subject-card.unclassified`).forEach(subjectCard => {
								this.attachSubjectCardOnDragEventListeners(subjectCard);
							})
						}

					}

					this.attachNotifBtnsListener();
				}
				attachSubjectCardOnDragEventListeners(subjectCard) {
					const draggableElement = subjectCard.querySelector(".subject-card-header");
					
					draggableElement.draggable = true;

					draggableElement.ondragstart = (e) => {this.draggedElementOnDragStartAction( e, subjectCard)};
					draggableElement.ondragend   = (e) => {this.draggedElementOnDragEndAction(   e, subjectCard)};

				}
				attachModuleCardOnDragEventListeners(moduleCard) {
					const moduleHeader = moduleCard.querySelector(".module-card-header");
					moduleHeader.draggable = true;
					moduleHeader.ondragstart = (e) => {this.draggedElementOnDragStartAction(e, moduleCard)}
					moduleHeader.ondragend   = (e) => {this.draggedElementOnDragEndAction(  e, moduleCard)}
				}


				// MARK: detach ondrag events

				/** Detach the ondrag event listeners from the children/whole descendance of the given container
				 * 
				 * @example this.detachAllCardsOnDragEventListeners(document.querySelector("#container"))
				 * @example this.detachAllCardsOnDragEventListeners(document.querySelector("#container"), false)
				 * 
				 * @param {HTMLElement} [container=document] Default: document — The container of the HTML Elements to attach the ondrag event listeners to
				 * @param {Boolean} [descendants=true] Default: true — If true, also attaches the ondrag event listeners to all the descendance of the container. Otherwise, attaches the ondrag event listeners only to the direct children of the container
				 */
				detachAllCardsOnDragEventListeners(container=document, descendants=true) {
					if (container instanceof HTMLElement || container == document) {

						if (container?.classList?.contains("module-card-content") || container?.classList?.contains("module-details") || container?.classList?.contains("subject-card")) {
							(container?.classList?.contains("subject-card") ? [container] : container.querySelectorAll(".subject-card") || []).forEach(subjectCard => {
								this.detachSubjectCardOnDragEventListeners(subjectCard);
							})
						}
						else if (container?.classList?.contains("semester-content") || container?.classList?.contains("semester-grid") || container?.classList?.contains("modules-section") || container?.classList?.contains("semester-section") || container?.classList?.contains("module-card") || container == document.body|| container == document) {
							(container?.classList?.contains("module-card") ? [container] : container.querySelectorAll(".module-card") || []).forEach(moduleCard => {
								this.detachModuleCardOnDragEventListeners(moduleCard);
								
								if (descendants) {
									moduleCard.querySelectorAll(`.subject-card`).forEach(subjectCard => {
										this.detachSubjectCardOnDragEventListeners(subjectCard);
									})
									
								}
							})

							container.querySelectorAll(`.subject-card.unclassified`).forEach(subjectCard => {
								this.detachSubjectCardOnDragEventListeners(subjectCard);
							})
						}

					}
				}

				detachModuleCardOnDragEventListeners(moduleCard) {
					if (moduleCard?.classList?.contains("module-card")) {
						const draggableElement = moduleCard.querySelector(".module-card-header");
						
						draggableElement.draggable   = false;
						draggableElement.ondragstart = null;
						draggableElement.ondragend   = null;
					}
				}
				detachSubjectCardOnDragEventListeners(subjectCard) {
					if (subjectCard?.classList?.contains("subject-card")) {
						const draggableElement = subjectCard.querySelector(".subject-card-header");
						
						draggableElement.draggable   = false;
						draggableElement.ondragstart = null;
						draggableElement.ondragend   = null;
					}
				}


				//#region insertion fields ________________________

					insertFieldHitboxOnDragOverEvent(e) {
						const type              = e.target.dataset.type;
						const insertField       = e.target.closest(`.drop-field.insert-field.${type}`);
						const insertFieldArrow  = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
						const insertFieldPlus   = insertField.querySelector(`.drop-${type}-card-insert-plus`);
						const insertFieldText   = insertField.querySelector(`.drop-${type}-card-insert-text`);
						const insertFieldHitbox = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);

						e.preventDefault(); 
						e.dataTransfer.dropEffect = "link";
						insertField.classList.add("hover");
						insertFieldArrow?.classList?.add("hover"); 
						insertFieldPlus?.classList?.add("hover");
						insertFieldText.classList.add("hover");
					}
					insertFieldHitboxOnDragLeaveEvent(e) {
						const type              = e.target.dataset.type;
						const insertField       = e.target.closest(`.drop-field.insert-field.${type}`);
						const insertFieldArrow  = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
						const insertFieldPlus   = insertField.querySelector(`.drop-${type}-card-insert-plus`);
						const insertFieldText   = insertField.querySelector(`.drop-${type}-card-insert-text`);
						const insertFieldHitbox = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);

						e.preventDefault(); 
						insertField.classList.remove("hover");
						insertFieldArrow?.classList?.remove("hover"); 
						insertFieldPlus?.classList?.remove("hover");
						insertFieldText?.classList?.remove("hover");
					}
					insertFieldHitboxOnDropEvent(e) {
						const type              = e.target.dataset.type;
						const index             = e.target.dataset.index;
						const insertField       = e.target.closest(`.drop-field.insert-field.${type}`);
						const insertFieldHitbox = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);
						const dataTransfer      = e.dataTransfer.getData("text");
						const dataTransferMatch = dataTransfer.match(/module-card|subject-card/);
						const sourceType        = dataTransferMatch?.[0] ? dataTransferMatch[0] : "errr... something wrong, probably?";

						e.preventDefault(); 

						insertFieldHitbox.ondragover = (e) => {this.insertFieldHitboxOnDragOverEvent(e)};

						switch (`${sourceType} dropped in a ${type} insertion field`) {
							case "module-card dropped in a module insertion field":
								this.dropFieldSubjectInsertAction(dataTransfer, insertField);
							break;
							case "module-card dropped in a subject insertion field":
								this.dropFieldSubjectInsertAction(dataTransfer, insertField);
							break;
							case "subject-card dropped in a module insertion field":
								this.dropFieldToNewModuleAction(dataTransfer, index);
							break;
							case "subject-card dropped in a subject insertion field":
								this.dropFieldSubjectInsertAction(dataTransfer, insertField);
							break;
						}
					}
					insertFieldHitboxOnMouseEnterEvent(e) {
						const type              = e.target.dataset.type;
						const insertField       = e.target.closest(        `.drop-field.insert-field.${type}`);
						const insertFieldArrow  = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
						const insertFieldPlus   = insertField.querySelector(`.drop-${type}-card-insert-plus`);
						const insertFieldText   = insertField.querySelector(`.drop-${type}-card-insert-text`);

						insertField.classList.add("hover");
						insertFieldArrow?.classList?.add("hover"); 
						insertFieldPlus?.classList?.add("hover");
						insertFieldText?.classList?.add("hover");
					}
					insertFieldHitboxOnMouseLeaveEvent(e) {
						const type              = e.target.dataset.type;
						const insertField       = e.target.closest(        `.drop-field.insert-field.${type}`);
						const insertFieldArrow  = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
						const insertFieldPlus   = insertField.querySelector(`.drop-${type}-card-insert-plus`);
						const insertFieldText   = insertField.querySelector(`.drop-${type}-card-insert-text`);
						
						insertField.classList.remove("hover");
						insertFieldArrow?.classList?.remove("hover");
						insertFieldPlus?.classList?.remove("hover");
						insertFieldText?.classList?.remove("hover");

					}
					insertFieldHitboxOnClickEvent(e) {
						const type              = e.target.dataset.type;
						const insertField       = e.target.closest(        `.drop-field.insert-field.${type}`);
						const insertFieldArrow  = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
						const insertFieldPlus   = insertField.querySelector(`.drop-${type}-card-insert-plus`);
						const insertFieldText   = insertField.querySelector(`.drop-${type}-card-insert-text`);
						
						e.preventDefault(); 

						if (this.selectedSubjectCardsId.length == 0) {
							this.dropFieldSubjectInsertAction(null, insertField)
						}
						else {
							this.dropFieldSubjectInsertAction(this.selectedSubjectCardsId[0], insertField);
						}
					}

					async attachInsertFieldHitboxEventListeners(insertFieldHitbox) {
						insertFieldHitbox.ondragover     = (e) => {this.insertFieldHitboxOnDragOverEvent(e)};
						insertFieldHitbox.ondragleave    = (e) => {this.insertFieldHitboxOnDragLeaveEvent(e)};
						insertFieldHitbox.ondrop         = (e) => {
							e.preventDefault();
							e.dataTransfer.dropEffect = "link";
							
							const data = e.target.dataset;
							if (data.type.match(/subject|module/)) {
								this.insertFieldHitboxOnDropEvent(e);
							}
							else {
								this.dropFieldToNewModuleAction(e.dataTransfer.getData("text"), data.index);
							}
						};

						insertFieldHitbox.onmouseenter   = (e) => {this.insertFieldHitboxOnMouseEnterEvent(e)};
						insertFieldHitbox.onmouseleave   = (e) => {this.insertFieldHitboxOnMouseLeaveEvent(e)};
						insertFieldHitbox.onclick        = (e) => {
							const data = e.target.dataset;
							if      (data.type == "subject") {
								this.insertFieldHitboxOnClickEvent(e);
							}
							else if (data.type == "module") {
								if (this.selectedSubjectCardsId.length > 0) {
									this.dropFieldToNewModuleAction(this.selectedSubjectCardsId[0], data.index);
								}
								else {
									this.dropFieldToNewModuleAction(null, data.index);
								}
							}
						};
					}
					detachInsertFieldHitboxEventListeners(insertFieldHitbox) {
						insertFieldHitbox.ondragover     = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "none";};
						insertFieldHitbox.ondragleave    = (e) => {e.preventDefault()};
						insertFieldHitbox.ondrop         = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "none";};

						insertFieldHitbox.onmouseenter   = (e) => {e.preventDefault()};
						insertFieldHitbox.onmouseleave   = (e) => {e.preventDefault()};
						insertFieldHitbox.onclick        = (e) => {e.preventDefault()};
					}

				//#endregion

			//#endregion






			//#region -— Dragged element actions __________






				// MARK: ON DRAG START
				async draggedElementOnDragStartAction(e, card) {

					if (e instanceof Event) {
						if (e?.target?.classList?.contains("any-input")) {return}

						e.dataTransfer.effectAllowed = "link";
						e.dataTransfer.setDragImage(document.getElementById("emptyDivToRemoveTheDragImage"), 0, 0);
						e.dataTransfer.setData("text", card.id);
					}

					const type = card.classList.contains("subject-card") ? "subject" : "module";

					let selectionGoingOn = false, draggedCardIsSelected = false;
					if (this.selectedModuleCardsId.length > 0 || this.selectedSubjectCardsId.length > 0) {
						selectionGoingOn = true;
					}
					if (this.selectedSubjectCardsId.includes(card.id) || this.selectedModuleCardsId.includes(card.id)) {
						draggedCardIsSelected = true;
					}


					if (type == "subject") {

						(draggedCardIsSelected ? this.selectedSubjectCardsId : [card.id]).forEach(subjectCardId => {
							const subjectCard       = document.getElementById(subjectCardId);
							const subjectTotalCoef  = subjectCard.querySelector(".subject-total-coef-div");
							
							subjectCard.style.width = "50%";
							subjectTotalCoef.style.opacity = "0"; 
							

							if (!this.compactSubjCardsId.includes(subjectCardId) || this.detailedSubjCardsId.includes(subjectCardId)) {
								this.foldSubjCard(subjectCard, true);
							}

						})

						clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
						clearTimeout(this?.timeouts?.draggedElementOnDragEndAction?.showTeacherTable);
						if (!this.timeouts?.draggedElementOnDragStartAction) {this.timeouts.draggedElementOnDragStartAction = {};}

						this.timeouts.draggedElementOnDragStartAction.hideTeacherTable = setTimeout(() => {
							document.querySelectorAll(".grades-table-header-teacher").forEach(teacher => {teacher.style.display = "none";})
						}, 50);

						
						if (!card.classList.contains("unclassified") && !draggedCardIsSelected) {

							const sem           = card.dataset.semester;
							const moduleName    = card.dataset.module;
							const index         = card.dataset.index;
						
							const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${moduleName}"][data-index="${parseInt(index)+0}"]`)
							const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");
	
							const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${moduleName}"][data-index="${parseInt(index)+1}"]`)
							const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");
	
							this.detachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
							this.detachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
							upperInsertField.classList.remove("show");
							lowerInsertField.classList.remove("show");
		
						}
					}
					else if (type == "module") {

						(draggedCardIsSelected ? this.selectedModuleCardsId : [card.id]).forEach(moduleCardId => {
							const moduleCard            = document.getElementById(moduleCardId);
							const moduleTotalCoef       = moduleCard.querySelector(".module-subject-total-coef-div");
							const moduleHeaderLeftSize  = moduleCard.querySelector(".module-card-header-left-side");

							moduleCard.style.width = "50%";
							moduleTotalCoef.style.display = "none"; 
							moduleHeaderLeftSize.style.width = "50%";

							if (!draggedCardIsSelected) {
								// A non-selected module card has been dragged: if it was already folded, we only remove its adjacent module insertion fields, but fold it as well otherwise
								this.foldModuleCard(moduleCard, false, this.foldedModuleCardsId.includes(moduleCardId) ? "only" : true, true);
							}
							else if (!this.foldedModuleCardsId.includes(moduleCardId)) {
								// A selected unfolded module card has been dragged: we fold it while leaving its adjacent module insertion fields displayed
								this.foldModuleCard(moduleCard, false, false, true);
							}
							// A selected folded module card doesn't need to do anything other then changing its width
						})
						
					}

					if (!selectionGoingOn) {
						document.querySelector(".semester-content")                     .classList.add("dragging");
						document.querySelector(".drop-field.create-module")             .classList.add("show");
						document.querySelector(".drop-field.remove-from-module")        .classList.add("show");
						document.querySelector(".drop-field-create-module-hitbox")      .classList.add("show");
						document.querySelector(".drop-field-remove-from-module-hitbox") .classList.add("show");
						// Making sure there's no remaining hover class
						document.querySelector(".drop-field.create-module")             .classList.remove("hover");
						document.querySelector(".drop-field-create-module-text.top")    .classList.remove("hover");
						document.querySelector(".drop-field-create-module-text.bottom") .classList.remove("hover");
						document.querySelector(".drop-field-create-module-plus")        .classList.remove("hover");
						document.querySelector(".drop-field.remove-from-module")             .classList.remove("hover");
						document.querySelector(".drop-field-remove-from-module-text.top")    .classList.remove("hover");
						document.querySelector(".drop-field-remove-from-module-text.bottom") .classList.remove("hover");
						document.querySelector(".drop-field-remove-from-module-minus")       .classList.remove("hover");

						// Select all the shown drop fields. 
						// Since it occurs after folding the subject card is being dragged, it won't select the 2 subject insertion fields adjacent to this subject card.
						document.querySelectorAll(".drop-field.insert-field.show").forEach(insertField  => {
							const type = insertField.classList.contains("subject") ? "subject" : "module";

							insertField.querySelector(`.drop-${type}-card-insert-plus`) .classList.remove("show");
							insertField.querySelector(`.drop-${type}-card-insert-arrow`).classList.add("show");
							insertField.querySelector(`.drop-${type}-card-insert-text`) .classList.replace("add", "insert");
							insertField.querySelector(`.drop-${type}-card-insert-text`) .parentElement.classList.replace("add", "insert");
						})
					}

				}



				// MARK: ON DRAG END
				async draggedElementOnDragEndAction(e, card) {
					if (e?.target?.classList?.contains("any-input")) {return}

					let selectionGoingOn = false, draggedCardIsSelected = false;
					if (this.selectedModuleCardsId.length > 0 || this.selectedSubjectCardsId.length > 0) {
						selectionGoingOn = true;
					}
					if (this.selectedSubjectCardsId.includes(card.id) || this.selectedModuleCardsId.includes(card.id)) {
						draggedCardIsSelected = true;
					}


					if (card.classList.contains("subject-card")) {

						(draggedCardIsSelected ? this.selectedSubjectCardsId : [card.id]).forEach(subjectCardId => {
							const subjectCard = document.getElementById(subjectCardId);
							
							if (subjectCard) {
								const subjectTotalCoef  = subjectCard.querySelector(".subject-total-coef-div");
								subjectCard.style.width = "";
								subjectTotalCoef.style.opacity = ""; 
								
	
								if (card.classList.contains("compact") && !this.compactSubjCardsId.includes(subjectCardId) && !this.detailedSubjCardsId.includes(subjectCardId)) {
									this.unfoldSubjCard(subjectCard);
								}
							}

						})

						clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
						clearTimeout(this?.timeouts?.draggedElementOnDragStartAction?.hideTeacherTable);
						if (!this?.timeouts?.draggedElementOnDragEndAction) {this.timeouts.draggedElementOnDragEndAction = {};}

						this.timeouts.draggedElementOnDragEndAction.showTeacherTable = setTimeout(() => {
							document.querySelectorAll(".grades-table-header-teacher").forEach(teacher => {teacher.style.display = "table-cell"})
						}, 50);

						
						if (!card.classList.contains("unclassified") && !draggedCardIsSelected) {

							const sem           = card.dataset.semester;
							const moduleName    = card.dataset.module;
							const index         = card.dataset.index;
						
							const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${moduleName}"][data-index="${parseInt(index)+0}"]`)
							const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");
	
							const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${moduleName}"][data-index="${parseInt(index)+1}"]`)
							const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");
	
							this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
							this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
							upperInsertField.classList.add("show");
							lowerInsertField.classList.add("show");
		
						}
					}
					else if (card.classList.contains("module-card")) {

						(draggedCardIsSelected ? this.selectedModuleCardsId : [card.id]).forEach(moduleCardId => {
							const moduleCard            = document.getElementById(moduleCardId);
							const moduleTotalCoef       = moduleCard.querySelector(".module-subject-total-coef-div");
							const moduleHeaderLeftSize  = moduleCard.querySelector(".module-card-header-left-side");

							if (moduleCard) {
								moduleCard.style.width = "";
								moduleTotalCoef.style.display = "";
								moduleHeaderLeftSize.style.width = "";
	
								if (!draggedCardIsSelected) {
									// A non-selected module card has been dropped: if it was already folded before being dragged, we only show its adjacent module insertion fields, but unfold it as well otherwise
									this.unfoldModuleCard(moduleCard, false, this.foldedModuleCardsId.includes(moduleCardId) ? "only" : true, true);
								}
								else if (!this.foldedModuleCardsId.includes(moduleCardId)) {
									// A selected unfolded module card has been dropped: we unfold it while leaving its adjacent module insertion fields displayed, since it wasn't folded before being dragged
									this.unfoldModuleCard(moduleCard, false, false, true);
								}
							}
						})
						
					}

					if (!selectionGoingOn) {
						document.querySelector(".semester-content")                     .classList.remove("dragging");
						document.querySelector(".drop-field.create-module")             .classList.remove("show");
						document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
						document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
						document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");

						// Select all the shown drop fields. 
						// Since it occurs after unfolding the subject card is being dragged, it WILL also select the 2 subject insertion fields adjacent to this subject card.
						// Though in this case, nothing will change for the 2 adjacent subject insertion fields.
						document.querySelectorAll(".drop-field.insert-field.show").forEach(insertField  => {
							const type = insertField.classList.contains("subject") ? "subject" : "module";

							insertField.querySelector(`.drop-${type}-card-insert-plus`) .classList.add("show");
							insertField.querySelector(`.drop-${type}-card-insert-arrow`).classList.remove("show");
							insertField.querySelector(`.drop-${type}-card-insert-text`) .classList.replace("insert", "add");
							insertField.querySelector(`.drop-${type}-card-insert-text`) .parentElement.classList.replace("insert", "add");
						})
					}

				}

			// #endregion
			





			//#region -— Card selection ______________________
			




				// MARK: createSelectedCardNotifDiv
				createSelectedCardNotifDiv(card) {
					const semester  = card.dataset.semester;
					const isSubject = card.classList.contains("subject-card");
					const target    = isSubject ? card.dataset.subject : card.dataset.module;
					const targetId  = card.id;
					const selectionNotifDiv = document.createElement("div");
					selectionNotifDiv.className = `selected-card-notif-div ${target}`;
					selectionNotifDiv.id = `selected-card-notif-div-for-${target}-from-semester-${semester}`;
					selectionNotifDiv.dataset.type = isSubject ? "subject" : "module";
					selectionNotifDiv.dataset.target = target;
					selectionNotifDiv.dataset.semester = semester;
					selectionNotifDiv.dataset.targetid = targetId;
					selectionNotifDiv.innerHTML = `
						<div class="selected-card-notif-div-scroll-btn" id="selected-card-notif-div-del-btn-for-${target}-from-semester-${semester}" data-targetId="${targetId}">\></div>
						<span style="font-weight: 600; font-size: 14px; color: white">${target}${!isSubject ? ` Module` : ""}</span>
						<span>${!this.langIsEn ? `est sélectionné!` : `is selected!`}</span>
						<div class="selected-card-notif-div-del-btn" id="selected-card-notif-div-del-btn-for-${target}-from-semester-${semester}" data-targetId="${targetId}">x</div>
					`;

					return selectionNotifDiv;
				}


				// MARK: remove from subject selection
				/** 
				*  Manage all the actions involving the deletion of a card from the selection of cards
				* 
				* @param {String} notifDiv the div of the notif linked to the selected subject card
				*/
				removeCardFromSelection(notifDiv="all") {
					if (notifDiv=="all") {      // clear all subject card selection as well as their respective notif
						const selectedCardsId   = this.selectedSubjectCardsId.length > 0 ? this.selectedSubjectCardsId : this.selectedModuleCardsId;
						
						selectedCardsId.forEach(selectedCardId => {
							const correspNotifDiv = document.querySelector(`.selected-card-notif-div[data-targetid="${selectedCardId}"]`);
							correspNotifDiv.classList.remove("on");
							setTimeout(() => {correspNotifDiv.remove();}, 300);

							this.changeTickIconToDragIcon(document.getElementById(selectedCardId));
						})

						
						clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
						if (!this?.timeouts?.removeCardFromSelection) { this.timeouts.removeCardFromSelection = {} }
						this.timeouts.removeCardFromSelection.hideTeacherTable = setTimeout(() => {document.querySelectorAll(".grades-table-header-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100);

						document.querySelector(".semester-content")                 .classList.remove("dragging");
						document.querySelector(".drop-field.create-module")             .classList.remove("show");
						document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
						document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
						document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");

						this.selectedSubjectCardsId = [];
						this.selectedModuleCardsId  = [];
						this.selectedSubjectCardsSortedByModule = {};

					} 
					else if (notifDiv?.classList?.contains("selected-card-notif-div")) {      // clear the specifically given notifDiv from the selection
						const card = document.getElementById(notifDiv.dataset.targetid);
						const type = notifDiv.dataset.type;
						

						notifDiv.classList.remove("on");
						setTimeout(()=>{notifDiv.remove()}, 300);

						if (type == "subject") {

							if (this.selectedSubjectCardsId.includes(card.id))  this.selectedSubjectCardsId.splice(this.selectedSubjectCardsId.indexOf(card.id), 1);
							
							Object.keys(this.selectedSubjectCardsSortedByModule).forEach(moduleName => {
								this.selectedSubjectCardsSortedByModule[moduleName].forEach((selectedSubjectCard, subjIndex) => {
									this.selectedSubjectCardsSortedByModule[moduleName].splice(subjIndex, 1);
								})
								if (this.selectedSubjectCardsSortedByModule[moduleName].length == 0) {
									delete this.selectedSubjectCardsSortedByModule[moduleName];
								}
							})
						
							if (this.selectedSubjectCardsId.length == 0)  this.draggedElementOnDragEndAction(null, card); 
						}
						else if (type == "module") {

							if (this.selectedModuleCardsId.includes(card.id)) this.selectedModuleCardsId.splice(this.selectedModuleCardsId.indexOf(card.id), 1);

							if (this.selectedModuleCardsId.length == 0)  this.draggedElementOnDragEndAction(null, card); 
						}

						this.changeTickIconToDragIcon(card);
					}
					
					
					// Ensure the subject insertion drop fields are displaying the right text
					document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
						if (this.selectedSubjectCardsId.length == 0 && this.selectedModuleCardsId.length == 0) {
							subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.add("show");
							subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.remove("show");
							subjInsertField.querySelector(".drop-module-card-insert-text,  .drop-subject-card-insert-text" ).classList.replace("insert", "add");
							subjInsertField.querySelector(".drop-module-card-insert-text,  .drop-subject-card-insert-text" ).parentElement.classList.replace("insert", "add");
						}
						else {
							subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
							subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
							subjInsertField.querySelector(".drop-module-card-insert-text,  .drop-subject-card-insert-text" ).classList.replace("add", "insert");
							subjInsertField.querySelector(".drop-module-card-insert-text,  .drop-subject-card-insert-text" ).parentElement.classList.replace("add", "insert");
						}
					});
				}

			//#endregion






			//#region -— Drop fields  _________________________






				// MARK: attach dropFields listeners
				attachDropFieldsEventListeners(target="all", insertFieldsContainer="") {
					const dropFieldAdd          = document.querySelector(".drop-field.create-module");
					const dropFieldAddHitbox    = document.querySelector(".drop-field-create-module-hitbox");
					const dropFieldRemove       = document.querySelector(".drop-field.remove-from-module");
					const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-module-hitbox");
					const insertFieldHitboxes   = (insertFieldsContainer || document).querySelectorAll(".drop-subject-card-insert-hitbox, .drop-module-card-insert-hitbox");
					
					if (target == "add" || target == "all") {
						dropFieldAdd.style.background = "";
						dropFieldAddHitbox.ondragover =    (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldAdd.classList.add("hover");
							dropFieldAdd.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.add("hover");})
						}};
						dropFieldAddHitbox.ondragleave =   (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldAdd.classList.remove("hover");
							dropFieldAdd.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.remove("hover");})
						}};
						dropFieldAddHitbox.ondrop =        (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							e.dataTransfer.dropEffect = "link";
							dropFieldAdd.classList.remove("hover");
							dropFieldAdd.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.remove("hover");})
							this.dropFieldToNewModuleAction(e.dataTransfer.getData("text"));
						}};
						// Custom :hover event, cuz otherwise it would trigger when the fields are not shown
						dropFieldAddHitbox.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldAdd.classList.add("hover");
							dropFieldAdd.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.add("hover");})
						}};
						dropFieldAddHitbox.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldAdd.classList.remove("hover");
							dropFieldAdd.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.remove("hover");})
						}};
						dropFieldAddHitbox.onclick =       (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							e.target.classList.remove("hover");
							e.target.querySelectorAll(".drop-field-create-module-text, .drop-field-create-module-plus").forEach(text => {text.classList.remove("hover");})
							if (this.selectedSubjectCardsId.length > 0) {
								this.dropFieldToNewModuleAction(this.selectedSubjectCardsId[0]);
							}
						}};
					}
					
					if (target == "remove" || target == "all") {
						dropFieldRemove.style.background = "";
						dropFieldRemoveHitbox.ondragover =    (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldRemove.classList.add("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.add("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.add("hover", "slight-horiz-shake"); text.onanimationend = () => {text.classList.remove("slight-horiz-shake"); text.onanimationend = null;}})
						}};
						dropFieldRemoveHitbox.ondragleave =   (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldRemove.classList.remove("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.remove("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover", "slight-horiz-shake"); text.onanimationend = null;})
						}};
						dropFieldRemoveHitbox.ondrop =        (e) => {if (e.target.classList.contains("show")){
							e.preventDefault(); 
							e.dataTransfer.dropEffect = "link";
							dropFieldRemove.classList.remove("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.remove("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover", "slight-horiz-shake"); text.onanimationend = null;})
							this.dropFieldRemoveAction(e.dataTransfer.getData("text"));
						}};
						// Custom :hover event, cuz otherwise it would trigger when the fields are not shown
						dropFieldRemoveHitbox.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldRemove.classList.add("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.add("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.add("hover", "slight-horiz-shake"); text.onanimationend = () => {text.classList.remove("slight-horiz-shake"); text.onanimationend = null;}})
						}};
						dropFieldRemoveHitbox.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldRemove.classList.remove("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.remove("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover", "slight-horiz-shake"); text.onanimationend = null;})
						}};
						dropFieldRemoveHitbox.onclick =       (e) => {if (e.target.classList.contains("show")) {
							e.preventDefault(); 
							dropFieldRemove.classList.remove("hover");
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text").forEach(text => {text.classList.remove("hover");})
							dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover", "slight-horiz-shake"); text.onanimationend = null;})
							if (this.selectedSubjectCardsId.length > 0) {
								this.dropFieldRemoveAction(this.selectedSubjectCardsId[0]);
							}
						}};
					}

					if (target == "insert" || target == "all") {
						insertFieldHitboxes.forEach(insertFieldHitbox => {
							this.attachInsertFieldHitboxEventListeners(insertFieldHitbox)
						})
					}
				}



				// MARK: dropFieldToNewModuleAction
				dropFieldToNewModuleAction(cardId, index=0) {
					const sem = this.currentSemester;
					let bypasseReplacement = false;
					let newModuleConfig = {subjects: [], coefficients: {}};
					let newModuleName = "Module 1"; let count = 1;
					if (!this.moduleConfig[sem]) this.moduleConfig[sem] = {__modules__: []};
					while (this.moduleConfig?.[sem]?.[newModuleName]) {count++; newModuleName = `Module ${count}`;}

					if (cardId) {
						const card = document.getElementById(cardId);

						if (card.classList.contains('subject-card')) {
							let cardIsSelected = false;
							this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;});

							let subject, oldModuleName, manageSim = true;
							if (!this.sim[sem]) manageSim = false;
							
							if (!cardIsSelected) {  // 1 unselected subj card dropped in the drop field "add"
								subject = card.dataset.subject;
								oldModuleName = card.dataset.module;
								const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);

								if (!card.classList.contains("unclassified")) { // If the subj card doesn't come from the unclassified container:
									// We get its index in its module configured in moduleConfig
									const subjectIndex = this.moduleConfig[sem][oldModuleName].subjects.indexOf(subject);

									if (this.moduleConfig[sem][oldModuleName].subjects.toSpliced(subjectIndex,1).length == 0 && oldModuleName.match(/Module (\d)/)) {
										// If the action of removing the subject's name from the list of subject names of the module empties the list, then we don't delete anything at all:
										// the subj card was the only subj card of its previous module card, therefore we don't need to create nor make a new one, we just set the subject's coef to 100%.
										// This case is only to avoid taking a subj card from a module named "Module [X]", putting it in a new module named "Module [X+1]", deleting "Module [X]",
										// and realizing that it was pointless lol
										// newModuleName = oldModuleName;
										// newModuleConfig.coefficients[subject] = 100;
										bypasseReplacement = true;
									} 
									else {
										newModuleConfig = {subjects: [subject], coefficients: {[subject]: 100}};

										this.moduleConfig[sem][oldModuleName].subjects.splice(subjectIndex,1);
										delete this.moduleConfig[sem][oldModuleName].coefficients[subject];


										if (manageSim) {if (!this.sim[sem][oldModuleName]) manageSim = false;}
										if (manageSim) {
											this.sim[sem] = {[newModuleName]: {}, ...this.sim[sem]}
											this.sim[sem][newModuleName][subject] = [];
											this.sim[sem][oldModuleName][subject].forEach((_, index) => {
												this.sim[sem][newModuleName][subject].push(this.sim[sem][oldModuleName][subject][index].shift())
											})
											this.deleteUnusedSimPath(false, sem, oldModuleName, subject);
											this.saveSim();
										}
									}

									if (this.moduleConfig[sem][oldModuleName].subjects.length == 0) {
										this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
										delete this.moduleConfig[sem][oldModuleName];
									}

								} 
								else {
									newModuleConfig = {subjects: [subject], coefficients: {[subject]: 100}};
								}

							} else {  // multiple subj cards dropped through selection in the drop field "add"
								let remainingCoef = 100;
								
								// Scanning through all the modules of the selected matiere cards to get the name of the module of name "Module [x]", so that instead of creating a new Module,
								// we replace the module with the lowest x that would have been deleted
								let lowestModuleIndexNameToReplace = -1;
								Object.keys(this.selectedSubjectCardsSortedByModule).forEach((_moduleName, _moduleIndex) => {
									const _moduleSelection = this.selectedSubjectCardsSortedByModule[_moduleName];
									const match = _moduleName.match(/Module (\d+)/);

									// if the name matches "Module [x]" (1st condition) 
									// and if the selection of subj cards of same module that will be removed from their module matches the number of subj in the said module (cond 2): 
									// we save the number of the module
									if (match && _moduleSelection.length == this.moduleConfig[sem][_moduleName].subjects.length) {
										lowestModuleIndexNameToReplace = match[1];
									}
								})

								if (lowestModuleIndexNameToReplace > -1) {
									newModuleName = "Module "+lowestModuleIndexNameToReplace;
								}

								Object.keys(this.selectedSubjectCardsSortedByModule).forEach((_moduleName, _moduleIndex) => {
									oldModuleName = _moduleName;
									const _moduleSelection = this.selectedSubjectCardsSortedByModule[oldModuleName];


									_moduleSelection.forEach((selectedSubjectCard, _subjIndex) => {
										const subjectCard = document.getElementById(selectedSubjectCard.cardId);
										const selectionIndex = selectedSubjectCard.selectionIndex;
										subject = subjectCard.dataset.subject;

										if (selectionIndex+1 == this.selectedSubjectCardsId.length) {
											newModuleConfig.coefficients[subject] = remainingCoef;
										} else {
											const coef = Math.round(100/this.selectedSubjectCardsId.length);
											newModuleConfig.coefficients[subject] = coef;
											remainingCoef -= coef;
										}

										newModuleConfig.subjects[selectionIndex] = subject;
										

										if (!subjectCard.classList.contains("unclassified")) {

											// removing the subject card from its former module
											const oldModuleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);                       // get the old module's index in the modules ordered array of the semester
											const subjectIndexInOldModule = this.moduleConfig[sem][oldModuleName].subjects.indexOf(subject);    // get the subject's index in the subjects ordered array of the old module
											delete  this.moduleConfig[sem][oldModuleName].coefficients[subject];                            // delete coefficient data
													this.moduleConfig[sem][oldModuleName].subjects.splice(subjectIndexInOldModule,1);           // remove the subject from the subjects ordered array of the old module

											if (this.moduleConfig[sem][oldModuleName].subjects.length == 0) {
												// If, after removing the subject card from its former module, the said module is empty, we remove it
												delete this.moduleConfig[sem][oldModuleName];
												this.moduleConfig[sem].__modules__.splice(oldModuleIndex, 1);
											}

											if (manageSim) {if (!this.sim[sem][oldModuleName][subject]) manageSim = false} // checking if the subject card had sim grades
											if (manageSim) {
												// if the subject card had sim grades, change their path in this.sim to match the module change
												this.sim[sem][newModuleName][subject] = [];
												this.sim[sem][oldModuleName][subject].forEach((_, index) => {
													this.sim[sem][newModuleName][subject].push(this.sim[sem][oldModuleName][subject][index].shift())
												})
												this.deleteUnusedSimPath(false, sem, oldModuleName, subject);
												this.saveSim();
											}
										}
									})
								})

								// this the last step, so that if the new module has the same same as an old module that gets deleted (in order to replace it, "Module [x]" case), we don't remove the wrong one
								this.moduleConfig[sem][newModuleName] = newModuleConfig;
								this.moduleConfig[sem].__modules__.splice(index, 0, newModuleName);
							}
						}
						else if (card.classList.contains('module-card')) {
							let cardIsSelected = false;
							this.selectedModuleCardsId.forEach(selectedModuleCardId => {if (selectedModuleCardId == card.id) cardIsSelected = true;});

							let oldModuleName, manageSim = true;
							if (!this.sim[sem]) manageSim = false;
							
							if (!cardIsSelected) {  // 1 unselected module card dropped in the "add" drop field
								oldModuleName = card.dataset.module;
								newModuleName = oldModuleName;
								const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);

								// reordering the dropped module card first in the list of modules
								this.moduleConfig[sem].__modules__.splice(moduleIndex,1);
								this.moduleConfig[sem].__modules__.splice(0,0,oldModuleName);

							} else {  // multiple module cards dropped through selection in the "add" drop field
								let remainingCoef = 100;
								
								// Scanning through all the selected module cards to get their name if they match "Module [x]", so that instead of creating a new module name,
								// we replace the module with the lowest x that would have been deleted
								let lowestModuleIndexNameToReplace = count;
								Object.keys(this.selectedModuleCardsId).forEach(_moduleName => {
									const match = _moduleName.match(/Module (\d+)/);

									// if the name matches "Module [x]" (1st condition) 
									// and if the selection of subj cards of same module that will be removed from their module matches the number of subj in the said module (2nd condition): 
									// we save the number of the module
									if (parseInt(match?.[1] || lowestModuleIndexNameToReplace) < lowestModuleIndexNameToReplace) {
										lowestModuleIndexNameToReplace = parseInt(match[1]);
									}
								})

								// correcting the the name of the new module in case it should inherit the name of one of the selected module card 
								// because the later had a lower index than the new module's name anticipated
								if (lowestModuleIndexNameToReplace < count) {
									newModuleName = "Module "+lowestModuleIndexNameToReplace;
								}


								// Initiating the new module's data
								newModuleConfig = {subjects: [], coefficients: {}};
								
								// scanning through all the selected modules
								this.selectedModuleCardsId.forEach(_moduleCardId => {
									const selectedModuleCard = document.getElementById(_moduleCardId);
									const selectedModuleName = selectedModuleCard.dataset.module;

									// scanning through all the currently scanned selected module's subjects
									this.moduleConfig[sem][selectedModuleName].subjects.forEach(_subjectName => {
										const coef = this.moduleConfig[sem][selectedModuleName].coefficients[_subjectName];

										// adding the info of the subject in the new module
										newModuleConfig.subjects.push(_subjectName);
										newModuleConfig.coefficients[_subjectName] = coef;

									})

									// deleting the selected module once all its informations have been transfered to the new module
									delete this.moduleConfig[sem][selectedModuleName]
								})

								// this the last step, so that if the new module has the same same as an old module that gets deleted (in order to replace it, "Module [x]" case), we don't remove the wrong one
								this.moduleConfig[sem][newModuleName] = newModuleConfig;
								this.moduleConfig[sem].__modules__.splice(index, 0, newModuleName);
							}

						}
					}
					else {
						const newSubjName = !this.langIsEn ? "Nouvelle matière" : "New subject";
						newModuleConfig.subjects.push(newSubjName);
						newModuleConfig.coefficients[newSubjName] = 100;
					}

					if (!document.getElementById(cardId)?.classList?.contains('module-card') && !bypasseReplacement) {
						// Editing the module config
						this.moduleConfig[sem][newModuleName] = newModuleConfig;
						const newModuleIndexInSem = this.moduleConfig[sem].__modules__.indexOf(newModuleName);
						if (newModuleIndexInSem > -1) {
							this.moduleConfig[sem].__modules__.splice(newModuleIndexInSem, 1, newModuleName)
						}
						else {
							this.moduleConfig[sem].__modules__.splice(index, 0, newModuleName)
						}                
					}
					
					this.removeCardFromSelection();
					this.saveConfig();
					this.getGradesDatas();
					this.generateContent();
					this.scrollToClientHighestElem("first/ignore-setting", {id: `module-card-${newModuleName}-in-semester-${sem}`, smooth: true})
				}



				// MARK: dropFieldRemoveAction
				dropFieldRemoveAction(cardId) {
					const card = document.getElementById(cardId);

					let cardIsSelected = false;
					this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;})

					if (card?.classList?.contains("subject-card") && !card?.classList?.contains("unclassified")) {
						const sem = card.dataset.semester;
						const module = card.dataset.module;
						const subj = card.dataset.subject;

						if (!cardIsSelected) {

							const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(module);
							const subjectIndex = this.moduleConfig[sem][module].subjects.indexOf(subj);
									this.moduleConfig[sem][module].subjects.splice(subjectIndex,1);
							delete  this.moduleConfig[sem][module].coefficients[subj];

							if (this.moduleConfig[sem][module].subjects.length == 0) {
								this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
								delete this.moduleConfig[sem][module];
							}
						}
						else {
							let subject = "";
							this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {
								const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

								subject = selectedSubjectCard.dataset.subject;
								const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(module);
								const subjectIndex = this.moduleConfig[sem][module].subjects.indexOf(subject);
										this.moduleConfig[sem][module].subjects.splice(subjectIndex,1);
								delete  this.moduleConfig[sem][module].coefficients[subject];

								if (this.moduleConfig[sem][module].subjects.length == 0) {
									this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
									delete this.moduleConfig[sem][module];
								}

								if (this.compactSubjCardsId.includes(selectedSubjectCard)) {
									this.compactSubjCardsId.splice(this.compactSubjCardsId.indexOf(selectedSubjectCard), 1);
								}

								if (this.detailedSubjCardsId.includes(selectedSubjectCard)) {
									this.detailedSubjCardsId.splice(this.detailedSubjCardsId.indexOf(selectedSubjectCard), 1);
								}
							})
						}

						if (this.moduleConfig[sem].__modules__.length == 0) {delete this.moduleConfig[sem]}

						this.removeCardFromSelection();
						this.saveConfig();
						this.getGradesDatas();
						this.generateContent();
					}
					else if (card?.classList?.contains("subject-card") && card?.classList?.contains("unclassified") && cardIsSelected) {
						this.removeCardFromSelection();
					}
					else if (card?.classList?.contains("module-card")) {
						if (cardIsSelected) {
							this.selectedModuleCardsId.forEach(cardId => {
								const moduleCard = document.getElementById(cardId);
								if (moduleCard) {
									this.moduleCardDeleteBtnAction(moduleCard);
								}
								this.removeCardFromSelection();
							})
						}
						else {
							this.moduleCardDeleteBtnAction(card);
						}
					}

				}



				// MARK: dropFieldSubjectInsertAction
				dropFieldSubjectInsertAction(cardId=null, methodCaller=null) {
					const sem = this.currentSemester;
					
					if (cardId) {   // When dropping a ".drop-field.insert-field.subject" class div
						const card = document.getElementById(cardId);

						if (card?.classList?.contains('subject-card')) {
							let cardIsSelected = false;
							this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;});

							const targetModuleName = methodCaller.dataset.module;
							const insertionIndex = methodCaller.dataset.index;
							
							// The same thing happens whether this method is triggered from a selection or a single subject card, we just have to choose the right card id
							(cardIsSelected ? this.selectedSubjectCardsId : [card.id]).forEach(subjectCardId => {
								const subjectCard = document.getElementById(subjectCardId);

								const subject           = subjectCard.dataset.subject;
								const oldModuleName     = subjectCard.dataset.module;
								const oldModuleIndex    = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);
								const subjectOldIndex   = this.moduleConfig?.[sem]?.[oldModuleName]?.subjects?.indexOf(subject);
							
								// CASE 1: subject card comes from unclassified section to a module                 -> (default/easy case)
								// CASE 2: subject card comes from a module to another module                       -> (moving case)
								// CASE 3: subject card comes from a module to the same module at a different index -> (reordering case)
								// CASE 4: subject card comes from a module to the same module at the same index    -> (it's no-use, so nothing happens. It shouldn't be reached though, since the adjacent insertion fields disappear when dragging a card)

								switch (`
									subject card comes from ${oldModuleName 
										? `a module and is ${targetModuleName==oldModuleName 
											? `reorganized to ${subjectOldIndex == insertionIndex || subjectOldIndex+1 == insertionIndex 
												? "the same index" 
												: "a different index"}`
											: "moved to a different module"}`
										: "the unclassified section"}
								`.trim()) {
									case "subject card comes from the unclassified section":
										// Just set the unclassified subject in the moduleConfig
										this.moduleConfig[sem][targetModuleName].subjects.splice(insertionIndex, 0, subject);
										this.moduleConfig[sem][targetModuleName].coefficients[subject] = this.gradesDatas[sem][targetModuleName].totalCoefSubjects <= 100 ? (100 - this.gradesDatas[sem][targetModuleName].totalCoefSubjects) : 0;
									break;

									case "subject card comes from a module and is moved to a different module":
										// We move the datas from the old module to the new module // may be coming from the unclassified section, so it's taken into account
										this.moduleConfig[sem][targetModuleName].subjects.splice(insertionIndex, 0, subject);
										this.moduleConfig[sem][targetModuleName].coefficients[subject]  = Number (this.moduleConfig[sem]?.[oldModuleName]?.coefficients?.[subject] || 0);

										this.moduleConfig[sem]?.[oldModuleName]?.subjects?.splice(subjectOldIndex, 1);
										delete this.moduleConfig[sem]?.[oldModuleName]?.coefficients?.[subject];
									break;

									case "subject card comes from a module and is reorganized to a different index":
										// We move the datas while paying attention to at which index was the original subject before moving it (in order to not mess up with the insertion index)
										this.moduleConfig[sem][targetModuleName].subjects.splice(insertionIndex, 0, subject);
										this.moduleConfig[sem][targetModuleName].coefficients[subject]  = Number (this.moduleConfig[sem][oldModuleName].coefficients[subject]);

										const subjectCorrectOldIndex = subjectOldIndex + (insertionIndex<=subjectOldIndex && this.moduleConfig[sem][targetModuleName].subjects.includes(subject) ? 1 : 0);
										this.moduleConfig[sem][oldModuleName].subjects.splice(subjectCorrectOldIndex, 1);
									break;

									case "subject card comes from a module and is reorganized to the same index":
										"Alas, nothing happens... This case is never reached!";
									break;
								}

								if (this.moduleConfig[sem]?.[oldModuleIndex]?.subjects?.length == 0) {
									this.moduleConfig[sem]?.__modules__?.splice(oldModuleIndex, 1);
									delete this.moduleConfig[sem][oldModuleIndex];

									if (this.moduleConfig?.[sem]?.__modules__?.length == 0) {
										delete this.moduleConfig[sem]
									}
								}
								
							})

							this.removeCardFromSelection();
							this.saveConfig();
							this.getGradesDatas();
							this.generateContent();
							this.setGradesTableTotalCoef();
						}
						else if (card?.classList?.contains('module-card')) {    // Inserting all selected module cards at the place of the insertion field, in order of selection
							let cardIsSelected = false;
							this.selectedModuleCardsId.forEach(selectedModuleCardId => {if (selectedModuleCardId == card.id) cardIsSelected = true;});

							const targetModuleName = methodCaller.dataset.module;
							const insertionIndex   = parseInt(methodCaller.dataset.index);

							if (targetModuleName) {
								// reversing the list of selected module cards so that the insertion index can remain constant
								(cardIsSelected ? this.selectedModuleCardsId.reverse() : [card.id]).forEach(moduleCardId => {
									const moduleCard     = document.getElementById(moduleCardId);
									const oldModuleName  = moduleCard.dataset.module;
									const oldModuleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);
									const subjectCards = Array.from(moduleCard.querySelectorAll(".subject-card"));
	
									// reversing the list of subject cards so that the insertion index can remain constant
									subjectCards.reverse().forEach((subjectCard, _index) => {
										const subject = subjectCard.dataset.subject;
	
										this.moduleConfig[sem][targetModuleName].subjects.splice(insertionIndex, 0, subject);
										this.moduleConfig[sem][targetModuleName].coefficients[subject] = Number(this.moduleConfig[sem][oldModuleName].coefficients[subject]);
	
										this.moduleConfig[sem][oldModuleName].subjects.splice(this.moduleConfig[sem][oldModuleName].subjects.length-1,1);
										delete this.moduleConfig[sem][oldModuleName].coefficients[subject];
										
									})
	
									this.moduleConfig[sem].__modules__.splice(oldModuleIndex, 1)
									delete this.moduleConfig[sem][oldModuleName];

									if (this.moduleConfig?.[sem]?.__modules__?.length == 0) {
										delete this.moduleConfig[sem]
									}
								})
							} 
							else {
								(cardIsSelected ? this.selectedModuleCardsId : [card.id]).forEach((moduleCardId, _index) => {
									const moduleCard     = document.getElementById(moduleCardId);
									const oldModuleName  = moduleCard.dataset.module;
									const oldModuleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);
									const correctedInsertionIndex = insertionIndex < oldModuleIndex ? insertionIndex + _index : insertionIndex;
									const correctedOldModuleIndex = correctedInsertionIndex < oldModuleIndex ? oldModuleIndex + 1 : oldModuleIndex;

									// Insert the module at the right place, 
									this.moduleConfig[sem].__modules__.splice(correctedInsertionIndex, 0, oldModuleName)
									this.moduleConfig[sem].__modules__.splice(correctedOldModuleIndex, 1)
								})
							}


							this.removeCardFromSelection();
							this.saveConfig();
							this.getGradesDatas();
							this.generateContent();
							this.setGradesTableTotalCoef();
						}
					}
					else {          // When clicking on a ".drop-field.insert-field.subject" class div
						const addDivClicked = methodCaller;
						const sem = addDivClicked.dataset.semester;
						const module =  addDivClicked.dataset.module;
						const moduleCard = document.getElementById(`module-card-${module}-in-semester-${sem}`);
						const moduleDetails = moduleCard.querySelector(".module-details");

						let newSubjName = `${!this.langIsEn ? "Nouvelle matière" : "New subject"} 1`; let count = 1;
						while (this.gradesDatas[sem][module].subjects[newSubjName]) {
							count++; newSubjName = `${!this.langIsEn ? "Nouvelle matière" : "New subject"} ${count}`;
						}

						const insertionIndex = methodCaller ? methodCaller.dataset.index : this.moduleConfig[sem][module].subjects.length;

						this.moduleConfig   [sem][module].subjects.splice(insertionIndex, 0, newSubjName);
						this.moduleConfig   [sem][module].coefficients [newSubjName] = 0;

						this.saveConfig();
						this.getGradesDatas();
						
						moduleDetails.innerHTML = this.createAllSubjCards(sem, module);

						this.attachAllSubjectCardRelatedEventListenersForEverySubjectCard();
						this.setGradesTableTotalCoef();
					}
				}



				// MARK: dropFieldModuleInsertAction
				dropFieldModuleInsertAction(cardId=null, methodCaller=null) {
					const sem = this.currentSemester;
					if (cardId) {
						const card = document.getElementById(cardId);

						if (card?.classList?.contains("module-card")) {
							const oldModuleIndex = card.dataset.index;
							const newModuleIndex = methodCaller?.dataset?.index || 0;
							const compensatedNewModuleIndex = oldModuleIndex > newModuleIndex ? newModuleIndex : newModuleIndex - 1;
							const moduleName = this.moduleConfig[sem].__modules__.splice(oldModuleIndex, 1)[0];

							this.moduleConfig[sem].__modules__.splice(compensatedNewModuleIndex,0,moduleName);
							this.saveConfig();
							this.getGradesDatas();
							this.generateContent();
							this.setGradesTableTotalCoef();
							this.scrollToClientHighestElem({id: card.id, smooth: true})
						}
					}
				}


				
				// MARK: createDropFieldInsertionField
				createDropFieldInsertionField(type="subject", {sem=0, moduleName="", index=-1}={sem:0, moduleName:"", index:-1}) {
					const thereIsSelection = this.selectedSubjectCardsId.length > 0;
					return `
						<div class="drop-field insert-field ${type} show" data-semester="${sem}" ${type=="module" ? `` : `data-module="${moduleName}" `}data-index="${index}">
							<div class="drop-${type}-card-insert-content plus">
								<div class="drop-${type}-card-insert-plus${thereIsSelection ? "" : " show"}">+</div>
							</div>
							<div class="drop-${type}-card-insert-content arrow">
								<div class="drop-${type}-card-insert-arrow${thereIsSelection ?  " show" : ""}">→</div>
							</div>
							<div class="drop-${type}-card-insert-content text ${thereIsSelection ? "insert" : "add"}" data-type="${type}">
								<div class="drop-${type}-card-insert-text ${thereIsSelection ? "insert" : "add"} ${this.lang}"></div>
							</div>
							<div class="drop-${type}-card-insert-hitbox" data-type="${type}" data-index="${index}"></div>
						</div>`
					;
				}

			//#endregion


		//#endregion
		





		//#region _______ — Config  ↓Imp/Exp↑ — _______

			toggleImportMenu(open=undefined) {
				const importMenu    = document.querySelector("#importMenu");
				const importFile    = importMenu.querySelector(".import-menu-btn.file");
				const importClear   = importMenu.querySelector(".import-menu-btn.clear");
				const importOnline  = importMenu.querySelector(".import-menu-btn.online");

				importFile.children[0].innerHTML   = !this.langIsEn ? "Importer fichier de configuration .json"   : "Import a .json configuration file";
				importClear.innerHTML = !this.langIsEn ? "Effacer Config"   : "Clear Config";
				importClear.title     = !this.langIsEn ? "Clique ici pour effacer ta configuration actuelle" : "Click here to clear your current configuration";
				importOnline.children[1].innerHTML = !this.langIsEn ? "Obtenir fichier de configuration en ligne" : "Get a configuration file online";
				
				if (!importMenu.classList.contains("show") || open == true) {
					clearTimeout(this.timeouts?.closeImportMenu);
					importMenu.style.display = "";
					setTimeout(() => {importMenu.classList.add("show")}, 10)
					importFile.onclick   = () => this.importData();
					importClear.onclick  = () => {
						this.moduleConfig = {}; 
						this.compactSubjCardsId = []; 
						this.detailedSubjCardsId = [];
						this.foldedModuleCardsId = []; 
						this.getGradesDatas(); 
						this.saveConfig(); 
						this.generateContent({fadeIn: false});
					};
					importOnline.onclick = () => {
						if (this.onlineConfigs)
						this.getConfigsFromRepoAPI(this.repoContentsAPI)
					};
				}
				else if (importMenu.classList.contains("show") || open == false) {
					importMenu.classList.remove("show");
					importFile.onclick   = null;
					importClear.onclick  = null;
					importOnline.onclick = null;
					this.timeouts.closeImportMenu = setTimeout(() => {importMenu.style.display = "none"}, 300);
				}
			}

			openOnlineCfgPickerModal(closeOtherModals=true) {
				if (closeOtherModals) { this.closeEveryModal() }
				
				document.getElementById("importMenu").classList.remove("show");
				this.timeouts.closeImportMenu = setTimeout(() => {importMenu.style.display = "none"}, 300);

				const pickerMenuContainer        = document.createElement("div");
				this.ecamDash.appendChild(pickerMenuContainer);
				pickerMenuContainer.className    = `online-cfg-picker-menu-container`;
				const sectionsHTML      = this.generateOnlineCfgPickerMenuDirTree("section");
				const yearsHTML         = this.generateOnlineCfgPickerMenuDirTree("year");
				const promsHTML         = this.generateOnlineCfgPickerMenuDirTree("prom");
				const configsHTML       = this.generateOnlineCfgPickerMenuDirTree("config");

				pickerMenuContainer.innerHTML = `
					<div class="online-cfg-picker-menu modal${this.settings.blurEnabled.value ? " blur" : ""}" id="pickerMenu">
						<div class="online-cfg-picker-menu-header jura">${!this.langIsEn 
							? "Note: Choisir une configuration effacera les traces de configuration pré-existante de l'année correspondante, mais pas des autres années" 
							: "Tip: Choosing a configuration will erase all traces of pre-existing configuration of the corresponding year, but not of the other years"
						}</div>
						<div class="online-cfg-picker-menu-body">
							<div class="online-cfg-picker-menu-body-content">
								${sectionsHTML}
								${yearsHTML}
								${promsHTML}
								${configsHTML}
							</div>
						</div>
					</div>
				`;

				const pickerMenu = document.querySelector("#pickerMenu");
				
				this.appendCloseModalIcon(pickerMenu)

				clearTimeout(this.timeouts?.closePickerMenu)
				setTimeout(() => {pickerMenu.classList.add("show");}, 10)
				
				pickerMenuContainer.onmousedown = (e) => {
					if ((e.target.closest(".modal-close-btn") || !e.target.closest("#pickerMenu")) && !document.querySelector(".focus-notif-fullscreen-effect.focus")) {
						pickerMenuContainer.onmouseup = (e) => {
							if ((e.target.closest(".modal-close-btn") || !e.target.closest("#pickerMenu")) && !document.querySelector(".focus-notif-fullscreen-effect.focus")) {
								this.closeOnlineCfgPickerModal()
							}
							pickerMenuContainer.onmouseup = null;
						}
					}
				}
				
				
				pickerMenu.onclick = (e) => {
					const dirCard = e.target.closest(".online-cfg-picker-menu-dir-card");

					if (dirCard) {
						const addOnToDirCard = dirCard.classList.contains("on");
						const path = dirCard.dataset.path;

						// Start by removing all "show" and "on" classes to all descendant dirTrees and descendant/sibling dirCards
						if (dirCard.classList.contains("prom") || dirCard.classList.contains("year") || dirCard.classList.contains("section")) {
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-tree.config.show`).forEach(dirTree  => { dirTree.classList.remove("show")})
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-card.prom.on`)    .forEach(_dirCard => {_dirCard.classList.remove("on")})
						}
						if (dirCard.classList.contains("year") || dirCard.classList.contains("section")) {
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-tree.prom.show`)  .forEach(dirTree  => { dirTree.classList.remove("show")})
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-card.year.on`)    .forEach(_dirCard => {_dirCard.classList.remove("on")})
						}
						if (dirCard.classList.contains("section")) {
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-tree.year.show`)  .forEach(dirTree  => { dirTree.classList.remove("show")})
							pickerMenu.querySelectorAll(`.online-cfg-picker-menu-dir-card.section.on`) .forEach(_dirCard => {_dirCard.classList.remove("on")})
						}

						// Then, adding the "on" class to the clicked dirCard and the "show" class to the target dirTree associated to the dirCard clicked
						if (!addOnToDirCard) {
							dirCard.classList.add("on");
						}
						if (dirCard.classList.contains("on") && !dirCard.classList.contains("config")) {
							pickerMenu.querySelector(`.online-cfg-picker-menu-dir-tree[data-path="${path}"]`).classList.add("show");
						}

						// Import that data of the url dataset of the dir card clicked if it's a config dir card
						if (dirCard.classList.contains("config")) {
							this.importData(dirCard.dataset.url);
						}
					}
				}

				const modalCloseBtnContainer = pickerMenu.querySelector(".modal-close-btn-container");

				modalCloseBtnContainer.onmouseenter = (e) => {
					if (document.querySelector(".focus-notif-fullscreen-effect.focus")) {
						modalCloseBtnContainer.style.cursor = "not-allowed";
					}
				};
				modalCloseBtnContainer.onmouseleave = (e) => {
					if (document.querySelector(".focus-notif-fullscreen-effect.focus")) {
						modalCloseBtnContainer.style.cursor = "";
					}
				};
			}

			closeOnlineCfgPickerModal() {
				const pickerMenu = document.querySelector("#pickerMenu");
				if (pickerMenu) {
					pickerMenu.classList.remove("show");
					this.timeouts.closePickerMenu = setTimeout(() => {
						pickerMenu.parentElement.remove(); 
						this.attachDocumentMouseListeners();
						this.attachEcamDashMouseListeners();
					}, 300);
				}
			}

			generateOnlineCfgPickerMenuDirTree(type="section") {
				// Creating an array containing all the properties' value of this.onlineConfigs.Configs that are objects (so that have a descendance) with at least one property: they are the data of the section folders
				const sectionsData = this.onlineConfigs.Configs;
				const sectionsArray = Object.values(sectionsData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});


				let html = type == "section" ? `
				<div class="online-cfg-picker-menu-dir-tree ${type} show" data-path="${sectionsData.path}">
					<div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang}"></div>
					<div class="online-cfg-picker-menu-dir-tree-nb-cfgs jura">${sectionsData.nbCfgs} config${sectionsData.nbCfgs>1?"s":""}</div>
					<div class="online-cfg-picker-menu-dir-tree-body">
				` : "";

				html += sectionsArray.map(sectionDirData => {       // Dir: Section
					// Creating an array containing all the properties' value of sectionDirData that are objects (so that have a descendance) with at least one property: they are the data of the year folders
					const yearsArray = Object.values(sectionDirData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});
					
					const name = sectionDirData.path.split("/").at(-1);
					
					
					let out = type == "year" ? `
					<div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${sectionDirData.path}">
						<div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang}"></div>
						<div class="online-cfg-picker-menu-dir-tree-nb-cfgs jura">${sectionDirData.nbCfgs} config${sectionDirData.nbCfgs>1?"s":""}</div>
						<div class="online-cfg-picker-menu-dir-tree-body">
					` : "";
					
					out += type == "section"
					? `
					<div class="online-cfg-picker-menu-dir-card ${type} jura" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${sectionDirData.path}">${name}</div>
					`
					: yearsArray.map(yearDirData => {               // Dir: Year
						// Creating an array containing all the properties' value of yearDirData that are objects (so that have a descendance) with at least one property: they are the data of the prom folders
						const promsArray = Object.values(yearDirData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});
						const name = yearDirData.path.split("/").at(-1);
						let out = type == "prom" ? `
						<div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${yearDirData.path}">
							<div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang}"></div>
							<div class="online-cfg-picker-menu-dir-tree-nb-cfgs jura">${yearDirData.nbCfgs} config${yearDirData.nbCfgs>1?"s":""}</div>
							<div class="online-cfg-picker-menu-dir-tree-body">
						` : "";
						
						out += type == "year"
						? `
						<div class="online-cfg-picker-menu-dir-card ${type} jura" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${yearDirData.path}">${name}</div>
						`
						: promsArray.map(promDirData => {           // Dir: Prom
							// Creating an array containing all the properties' value of promDirData that are objects (so that have a descendance) with at least one property: they are the data of the configs
							const configsArray = Object.keys(promDirData).map(key => {if (key != "nbCfgs" && key!= "path") {return key}}).filter(value => {return value});
							const name = promDirData.path.split("/").at(-1);
							this.tempGitConfigParentDirData = promDirData;
							let out = type == "config" ? `
							<div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${promDirData.path}">
								<div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang}"></div>
								<div class="online-cfg-picker-menu-dir-tree-nb-cfgs jura">${promDirData.nbCfgs} config${promDirData.nbCfgs>1?"s":""}</div>
								<div class="online-cfg-picker-menu-dir-tree-body">
							` : "";
							
							out += type == "prom" ? `
								<div class="online-cfg-picker-menu-dir-card ${type} jura" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${promDirData.path}">${name}</div>
							`
							: configsArray.map(configName => {      // Dir: Config
								const path = this.tempGitConfigParentDirData.path+"/"+configName, name = configName.match(/.+ - (.+)\.json/)[1];
								return `
									<div class="online-cfg-picker-menu-dir-card config jura" id="online-cfg-picker-menu-dir-card-config-${name}" data-path="${path}" data-url="${this.tempGitConfigParentDirData[configName]}">${name}</div>
								`
							}).join("");
							
							out += type == "config" ? `
								</div>
							</div>
							`: "";

							this.tempGitConfigParentDirData = undefined;

							return out;
						}).join("");

						out += type == "prom" 
						? `
							</div>
						</div>
						` : "";

						return out;
					}).join("")
					
					out += type == "year" 
					? `
						</div>
					</div>
					` : ""

					return out;
				}).join("");

				html += type == "section" ? `
					</div>
				</div>
				` : "";

				return html;
			}



			importData(file) {
				this.sim = {};
				return new Promise((resolve, reject) => {
					const handleText = (text) => {
						try {
							const parsed = JSON.parse(text);

							// If parsed contains moduleConfig, apply it to the dashboard and persist
							if (parsed?.version != this.configVersion) {
								alert(!this.langIsEn 
									? `Ce fichier de configuration n'est pas de la bonne version ! Assure-toi de télécharger la dernière version ! (Ce fichier est de version "${parsed?.version}", alors qmodule la version de fichier attendmodule est "${this.configVersion}")`
									: `This configuration file isn't of the right version! Make sure you download the latest version! (This file's version is "${parsed?.version}", whereas the file's version expected is "${this.configVersion}")`
								)
							}
							else if (parsed?.version == this.configVersion && parsed?.moduleConfig) {
								try {
									Object.keys(parsed.moduleConfig).sort((a,b) => a-b).forEach(semX => {
										this.currentSemester = parseInt(semX);
										this.moduleConfig[semX] = parsed.moduleConfig[semX];
									})
									document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
									document.getElementById('filter-tab-semester-'+this.currentSemester).classList.add('active');
									this.saveSemesterFilter();
									this.saveConfig();
								} catch (e) {
									// ignore storage errors
								}
							}
							else {
								console.log(parsed);
								alert(!this.langIsEn 
									? `Ce fichier de configuration est invalide ! Je ne trouve pas les données attendmodules !`
									: `This configuration file is invalid! I don't find the expected datas!`
								)
							}

							// Re-render dashboard to reflect imported config
							try { 
								this.closeOnlineCfgPickerModal();
								
								this.timeouts.closePickerMenu = setTimeout(() => {
									this.removeCardFromSelection(); 
									this.getGradesDatas();
									this.generateContent({fadeIn: false}); 
									this.scrollToClientHighestElem("", {id: "dash-header", margin: 10, smooth: true});
								}, 300); 
							} catch (e) {}

							this.showLoadingSymbol(false);
							resolve(parsed);
						} catch (err) {
							reject(err);
						}
					};

					// If a File object was passed, read it
					if (file instanceof File) {
						this.showLoadingSymbol(true)
						const reader = new FileReader();
						reader.onload = (e) => handleText(e.target.result);
						reader.onerror = (e) => reject(e);
						reader.readAsText(file);
						return;
					}

					// If a JSON string was passed, try to parse directly
					if (typeof file === 'string') {
						if (file.match(RegExp("https://raw.githubusercontent.com/(.+).json"))) {
							// send a request at the url provided in the file parameter
							const xhttp = new XMLHttpRequest();
							xhttp.open("GET", file, true);
							xhttp.send();

							xhttp.onload = () => {
								try { handleText(xhttp.response); } catch (err) { reject(err); }
							}
							return;
						}
						else {
							// treat as raw JSON string
							try { handleText(file); } catch (err) { reject(err); }
						}
						return;
					}

					// No argument: open a file picker so user can choose a .json file
					const input = document.createElement('input');
					input.type = 'file';
					input.accept = 'application/json,.json';
					input.style.cssText = 'display: none';
					document.body.appendChild(input);
					input.onchange = (e) => {
						const f = e.target.files && e.target.files[0];
						if (!f) { document.body.removeChild(input); reject(new Error('No file selected')); return; }
						const reader = new FileReader();
						reader.onload = (ev) => { handleText(ev.target.result); document.body.removeChild(input); };
						reader.onerror = (ev) => { document.body.removeChild(input); reject(ev); };
						reader.readAsText(f);
					};
					input.click();
				});
			}

			exportData() {
				const data = {
					date: new Date().toISOString().split('T')[0],
					version: this.configVersion,
					moduleConfig: this.moduleConfig
				};
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `ecam_grades_${new Date().toISOString().split('T')[0]}.json`;
				a.click();
				URL.revokeObjectURL(url);
			}

		//#endregion






		// MARK: ________ — Keyboard Events — ________
		generalKeyboardEvents(mode="general", target=undefined) {
			const noModifierAllowed = {alt:"forbidden", ctrl:"forbidden", shift:"forbidden", meta:"forbidden", repeat:"forbidden"};
			const shiftRequired     = {alt:"forbidden", ctrl:"forbidden", shift:"required",  meta:"forbidden", repeat:"forbidden"};
			if (mode == "general") {
				document.onkeydown = (e) => {
					if      (this.keyInputMatch(e, "Escape")) {
						this.closeEveryModal();
					}
					else if (this.keyInputMatch(e, "E", shiftRequired)) {
						
						this.editMode = !this.editMode;
						localStorage.setItem("ECAM_DASHBOARD_DEFAULT_EDIT_MODE", this.editMode);

						this.foldedModuleCardsId = []; document.querySelector(".fold-toggle").classList.remove("active");
						this.removeCardFromSelection();
						this.scrollToClientHighestElem();
						this.generateContent({manageIndividualCardFolding: false});
					}
					else if (this.keyInputMatch(e, "D", shiftRequired)) {
						const unclassifiedSection = document.querySelector(".unclassified-section");
						this.releaseElementHeight(unclassifiedSection);

						this.viewMode = this.viewMode == "detailed" ? "compact" : "detailed";
						if (this.viewMode == "detailed") {
							document.querySelector("#view-btn-detailed").classList.add("active");
							document.querySelector("#view-btn-compact").classList.remove("active");
						}
						else {
							document.querySelector("#view-btn-detailed").classList.remove("active");
							document.querySelector("#view-btn-compact").classList.add("active");
						}


						this.toggleFoldAllSubjCards();

						this.saveViewMode();
						this.scrollToClientHighestElem("first",
							{className: "modules-section",      timeout: 101, smooth: false, margin: 20,                        highestElemInPageHandleType:"partial"}, 
							{className: "module-card",          timeout: 101, smooth: false, margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"above"},
							{className: "unclassified-section", timeout: 101, smooth: false, margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"partial"},
							{className: "subject-card",         timeout: 101, smooth: false, margin: 10,                        highestElemInPageHandleType:"above"},
						);

						this.holdElementHeight(unclassifiedSection, 1000);
					}
					else if (this.keyInputMatch(e, "L", shiftRequired)) {
						
						this.langIsEn = !this.langIsEn;
						this.lang     = this.langIsEn ? "en" : "fr";
						localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)

						if (!this.langIsEn) {
							document.getElementById('fr-lang-btn').classList.add('active')
							document.getElementById('en-lang-btn').classList.remove('active')
						}
						else {
							document.getElementById('fr-lang-btn').classList.remove('active')
							document.getElementById('en-lang-btn').classList.add('active')
						}
						
						this.scrollToClientHighestElem();
						this.generateContent({fadeIn: false});
					}
					else if (this.keyInputMatch(e, "F", shiftRequired)) {
						const className = "module-card-header", timeout = 210, highestElemInPageHandleType = "last above", smooth = true;

						if (this.foldedModuleCardsId.length == 0) {
							this.scrollToClientHighestElem("first", {className, timeout, highestElemInPageHandleType, smooth, block: "center"});
							document.querySelector(".fold-toggle").classList.add("active");
							this.foldAllModuleCards();
						}
						else {
							this.scrollToClientHighestElem("first", {className, timeout, highestElemInPageHandleType, smooth, block: "start"});
							document.querySelector(".fold-toggle").classList.remove("active");
							this.unfoldAllModuleCards();
						}
						
					}
					else if (this.keyInputMatch(e, "R", shiftRequired)) {
						debugger;
					}
					else if (this.keyInputMatch(e, ["ArrowLeft", "ArrowRight"], shiftRequired)) {
						const increment = e.key == "ArrowLeft" ? -1 : 1;
						
						document.querySelectorAll('.filter-tab').forEach((t, _index) => {
							if (t.classList.contains("active")) {this.currentSemester = _index}; 
							t.classList.remove('active');
						})

						const newSem = (this.currentSemester + increment)%11;
						const newActiveSemFilterTab = document.querySelector(".filter-tabs").children[newSem >= 0 ? newSem : 10];
						newActiveSemFilterTab.classList.add("active");
						this.currentSemester = newActiveSemFilterTab.dataset.filter;

						this.foldedModuleCardsId = []; document.querySelector(".fold-toggle").classList.remove("active");
						this.saveSemesterFilter();
						this.removeCardFromSelection();
						this.generateContent({fadeIn: false, manageIndividualCardFolding: false});
					}
				};
			}
			else if (mode == "edit sim grade") {
				document.onkeydown = (e) => {
					if (this.keyInputMatch(e, "Enter", noModifierAllowed)) {
						if (e.target.classList.contains("simulated-grade-input")) {

							if      (e.target.classList.contains("sim-inp-type")) {
								const simInpGrade = document.querySelector(`.simulated-grade-input.sim-inp-grade[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
								simInpGrade.focus({preventScroll: true, focusVisible: true});
								const simInpGradeCoord = simInpGrade.getBoundingClientRect().top;
								
								if (simInpGradeCoord < 0 || simInpGradeCoord > window.innerHeight) {
									simInpGrade.scrollIntoView({block: "center", smooth: true});
								}
							}
							else if (e.target.classList.contains("sim-inp-grade")) {
								const simInpCoef = document.querySelector(`.simulated-grade-input.sim-inp-coef[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
								// Prevents the instant scroll if the text field is out of the screen
								simInpCoef.focus({preventScroll: true, focusVisible: true});
								const simInpCoefTopCoord = simInpCoef.getBoundingClientRect().top;
								
								// Smoothly scrolls to the text field if it's out of the screen
								if (simInpCoefTopCoord < 0 || simInpCoefTopCoord > window.innerHeight) {
									simInpCoef.scrollIntoView({block: "center", smooth: true});
								}
							}
							else if (e.target.classList.contains("sim-inp-coef")) {
								const simAddBtn = document.querySelector(`.sim-add-btn[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
								
								this.simGradeAddBtnAction(simAddBtn);
								this.attachAllAnyInputsListeners();
								this.generalKeyboardEvents("general");


							}

						}
					}
				}
			}
			else if (mode == "tuto") {
				document.onkeydown = null;
			}
		};

	}


	//MARK: ——————————————————








	//MARK: ——————————————————
	;



	//MARK: TutoTipNotif   ———————————
	class TutoTipNotif {

		/**
		 * @param {ECAMDashboard} ecamDash
		 * The ecam dashboard
		 * @param {HTMLElement | String} containerElem 
		 * The element (or its query selector) that will contain this {@link TutoTipNotif TutoTipNotif}
		 * @param {HTMLElement | String} targetElem 
		 * The element (or its query selector) that is the target of this {@link TutoTipNotif TutoTipNotif} (clicking on it will move to the next {@link TutoTipNotif TutoTipNotif})
		 * @param {{"fr": String; "en": String;}} tipNotifTexts 
		 * An object with properties *fr* of value "theFrenchTextOfThis{@link TutoTipNotif TutoTipNotif}", and *en* of value "theEnglishTextOfThis{@link TutoTipNotif TutoTipNotif}"
		 * @param {{ appearanceDelay: number; containerStyle: {}; notifStyle: {}; targetElemStyle: { zIndex: string; }; containerElemStyle: {}; buttonsContainer: { style: {}; texts: {fr: String; en: String}; buttons: [{style: {}; texts: {fr: String; en: String}; actionCallback: () => {}}] } }} optionalData
		 * Optional data containing:
		 * - containerStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the container of the tip notif `tipNotifContainer`
		 * - notifStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the tip notif `tipNotif`
		 * - targetElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the target element `targetElem` 
		 * - containerElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the container `containerElem`
		 */
		constructor(ecamDash, containerElem, targetElem, tipNotifTexts={fr: "", en: ""}, optionalData=
			//#region 
			{
				appearanceDelay: 320, 
				containerStyle: {}, 
				notifStyle: {}, 
				targetElemStyle: {zIndex: "12"}, 
				containerElemStyle: {}
			}
			//#endregion
		) {
			this.ecamDash 		= ecamDash;
			this.containerElem 	= containerElem;
			this.targetElem    	= targetElem;
			this.tipNotifTexts 	= tipNotifTexts;
			this.optionalData  	= optionalData;
		}


		// MARK: async createTipNotifDiv()
		/** Method allowing to attach a tip notif to an element `targetElem` inside of a container `containerElem`, handling specific styling for the different elements involved and a callback action `nextAction` to execute after clicking on the `nextActionTriggerElem`
		 * 
		 * Structure of the tip notif attached:
		 * 
		 * \<div`containerElem`\>
		 * 
		 * ............\<div`targetElem`\>\</div\>
		 * 
		 * ............\<div`tipNotifContainer`\> // used for the placement of the tip notif, as its position is set to relative and both its width and height are 0 by default, so it doesn't displace the display of containerElem)
		 * 
		 * ........................\<div`tipNotif`\> **`tipNotifText`** \</div\>
		 * 
		 * ............\</div\>
		 * 
		 * \</div\>
		 * 
		 * @example 
		 * this.createTipNotif(document.querySelector("#containerId"), document.querySelector("#targetId"), "Test tip notif")
		 * this.createTipNotif("#containerId", ".target(s)Class", "Test tip notif")
		 * this.createTipNotif("#containerId", ".target(s)Class", "Test tip notif", {nextAction: () => {`Something to happen next`}, containerStyle: {right: "10px", top: "10px"}, targetElementStyle: {zIndex: "9"}, containerElemStyle: {zIndex:"0", background: white}})
		 * 
		 * @param {HTMLElement | String} containerElem The container or its CSS Selector to place the tip notif in (if CSS Selector is a class, take the first element matching the selector)
		 * @param {HTMLElement | String} targetElem The element or the CSS Selector of the element.s that the tip notif is highlighting
		 * @param {String} tipNotifText The text displayed by the tip notif
		 * @param {{ appearanceDelay: number; containerStyle: {}; notifStyle: {}; targetElemStyle: { zIndex: string; }; containerElemStyle: {}; }} [optionalData={appearanceDelay: 320, containerStyle: {}, notifStyle: {}, targetElemStyle: {zIndex: "12"}, containerElemStyle: {}}]
		 * Optional data containing:
		 * - containerStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the container of the tip notif `tipNotifContainer`
		 * - notifStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the tip notif `tipNotif`
		 * - targetElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the target element `targetElem` 
		 * - containerElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the container `containerElem`
		 */
		async createTipNotifDiv(containerElem=this.containerElem, targetElem=this.targetElem, tipNotifText=this.ecamDash.langIsEn ? this.tipNotifTexts.en : this.tipNotifTexts.fr, optionalData=this.optionalData) {
			if (targetElem instanceof HTMLElement || typeof targetElem == "string") { setTimeout(() => {

				this.tutoTipNotifContainer = document.createElement("div");
				(typeof containerElem == "string" ? document.querySelector(containerElem) : containerElem).appendChild(this.tutoTipNotifContainer);
				this.tutoTipNotifContainer.className = "tuto-tip-notif-container";
				this.tutoTipNotifContainer.id        = `this.tutoTipNotifContainer-for-${typeof targetElem == "string" ? `${targetElem}` : (targetElem.id ? "#"+targetElem.id : "."+targetElem.className)}`;
				this.tutoTipNotifContainer.innerHTML = `
					<div class="tuto-tip-notif jura" id="tutoTipNotif-for-${typeof targetElem == "string" ? `${targetElem}` : (targetElem.id ? "#"+targetElem.id : "."+targetElem.className)}">
						${tipNotifText}
					</div>
				`;
				const tutoTipNotif = this.tutoTipNotifContainer.querySelector(`.tuto-tip-notif`);


				Object.assign(this.tutoTipNotifContainer.style, {...(optionalData.containerStyle || {})});
				Object.assign(tutoTipNotif.style, {...(optionalData.notifStyle || {})});
				(typeof targetElem == "string" ? document.querySelectorAll(`${targetElem}`) : [targetElem]).forEach(elem => {
					Object.assign(elem.style, {...(optionalData.targetElemStyle || {zIndex: "12"})});
					elem.classList.add("infinite-alternate-scale-up", "tuto-animation-effect");
				})
				Object.assign((typeof containerElem == "string" ? document.querySelector(containerElem) : containerElem).style, {...(optionalData.containerElemStyle || {})});

				this.createButtons();

				setTimeout(() => {
					this.tutoTipNotifContainer.style.opacity = "1";
					this.tutoTipNotifContainer.style.transform = "scale(100%)";
				}, 10)

				if ((optionalData.nextActionTriggerElem || targetElem) instanceof HTMLElement || typeof (optionalData.nextActionTriggerElem || targetElem) == "string") {
					document.body.onclick = (e) => {
						if (
							e.target.closest(
								`${typeof (optionalData.nextActionTriggerElem || targetElem) == "string" 
									? `${optionalData.nextActionTriggerElem || targetElem}` 
									: (
										(optionalData.nextActionTriggerElem || targetElem).id 
										? "#"+(optionalData.nextActionTriggerElem || targetElem).id 
										: "."+(optionalData.nextActionTriggerElem || targetElem).className
									)
								}`
							)
						) {
							this.dismissTipNotifDiv(containerElem, targetElem, optionalData); 
							this.ecamDash.nextTipNotif();
							document.body.onclick = null;
						}
					};
				}

			}, this.optionalData.appearanceDelay || 0); }
		}


		// MARK: async dismissTipNotifDiv()
		/** Method allowing to detach a tip notif for an element `targetElem` and delete it from of a container `containerElem`, handling specific styling for the different elements involved.
		 * Typically called from inside of the {@link createTipNotifDiv} method, getting its argument from the corresponding arguments of {@link createTipNotifDiv}
		 * 
		 * Structure of the tip notif attached:
		 * 
		 * \<div`containerElem`\>
		 * 
		 * ............\<div`targetElem`\>\</div\>
		 * 
		 * ............\<div`tipNotifContainer`\> \/\* used for the placement of the tip notif, as its position is set to relative and both its width and height are 0 by default, 
		 * so it doesn't displace the display of containerElem \*\/
		 * 
		 * ........................\<div`tipNotif`\> **`tipNotifText`** \</div\>
		 * 
		 * ............\</div\>
		 * 
		 * \</div\>
		 * 
		 * @example 
		 * this.dismissTipNotifDiv(document.querySelector("#targetId"), document.querySelector("#containerId"))
		 * this.dismissTipNotifDiv(".target(s)Class", "#containerId")
		 * this.dismissTipNotifDiv(".target(s)Class", "#containerId", {targetElemStyle: {zIndex: "2"}, containerElemStyle: {zIndex:"1", background: transparent}})
		 * 
		 * @param {HTMLElement | String} containerElem The container or its CSS Selector to place the tip notif in (if CSS Selector is a class, take the first element matching the selector)
		 * @param {HTMLElement | String} targetElem The element or the CSS Selector of the element.s that the tip notif is highlighting
		 * @param {{ targetElemStyle: { zIndex: string; }; containerElemStyle: {}; }} [optionalData={targetElemStyle: {zIndex: "12"}, containerElemStyle: {}}]
		 * Optional data containing:
		 * - targetElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the target element `targetElem` 
		 * - containerElemStyle — An object containing any number of entries in the format `stylePropName: "stylePropValue"`, to pass CSS Style attributes to the container `containerElem`
		 */
		async dismissTipNotifDiv(containerElem=this.containerElem, targetElem=this.targetElem, optionalData=this.optionalData) {
			if (targetElem instanceof HTMLElement || typeof targetElem == "string") {
				// undoing the style changes that occured when the tip text appeared, by taking the same style properties and removing its value by passing it an empty string
				const undoStyleChanges = (styleObj) => {
					return Object.fromEntries(Object.entries(styleObj).map(entry => {return [entry[0], ""]}))
				}
				
				(typeof targetElem == "string" ? document.querySelectorAll(`${targetElem}`) : [targetElem]).forEach(elem => {
					Object.assign(elem.style, {...undoStyleChanges(optionalData.targetElemStyle || {zIndex: ""})});
					elem.classList.remove("infinite-alternate-scale-up", "tuto-animation-effect");
				})
				Object.assign((typeof containerElem == "string" ? document.querySelector(containerElem) : containerElem).style, {...undoStyleChanges(optionalData.containerElemStyle || {})});

				// hiding the tip notif
				this.tutoTipNotifContainer.style.opacity = "";
				this.tutoTipNotifContainer.style.transform = "";
				
				// removing the tip notif after its hide effect occured
				setTimeout(() => {
					this.tutoTipNotifContainer.remove();
				}, 300);

			}
		}


		// MARK: createButton()
		createButtons(containerElem=this.tutoTipNotifContainer, buttonsContainerData=this.optionalData.buttonsContainer || {}) {
			this.buttonsContainer = document.createElement("div");
			this.buttonsContainer.className = ".tuto-tip-btns-container";
			this.buttonsContainer.innerHTML = buttonsContainerData.texts[this.ecamDash.lang];
			Object.assign(this.buttonsContainer.style, {...(buttonsContainerData.style || {})});

			(buttonsContainerData.buttons || []).forEach((btnData, _index) => {
				const btn = document.createElement("div");
				this.buttonsContainer.appendChild(btn);
				btn.className = "tuto-tip-btn jura";
				btn.id = `tutoTipButton-number-${_index}`;
				btn.innerHTML = btnData.texts[this.ecamDash.lang];
				Object.assign(btn.style, {...(btnData.style || {})});
				btn.onclick = btnData.actionCallback;
			})

			containerElem.appendChild(this.buttonsContainer);
		}


		regenerateTexts(containerTuto=this.tutoTipNotifContainer) {
			containerTuto.querySelector(".tuto-tip-notif").innerHTML = this.tipNotifTexts[this.ecamDash.lang];
			if (containerTuto.querySelector(".tuto-tip-btns-container")?.nodeValue) {
				containerTuto.querySelector(".tuto-tip-btns-container" ).nodeValue = this.optionalData?.buttonsContainer?.texts?.[this.ecamDash.lang] || null;
			}

			(this.optionalData?.buttonsContainer?.buttons || []).forEach((btnData, _index) => {
				const btn = containerTuto.querySelector(`#tutoTipButton-number-${_index}`);
				btn.innerHTML = btnData.texts[this.ecamDash.lang];
			})
		}

	}


	//MARK: ——————————————————







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
	
})();