// ==UserScript==
// @name         ECAM Grades Dashboard
// @version      2.2.6
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @author       Baptiste JACQUIN
// @match        https://espace.ecam.fr/group/education/notes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecam.fr
// @grant        none
// @run-at       document-end
// @license      AGPL-3.0; Commercial license available
// ==/UserScript==
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
//  - baptiste.jacquin@ecam.fr
//  - maxence.leroux@ecam.fr


(function() {
    'use strict';

    //#region -======= STYLES  CSS ========

        let styles = ``;





        //#region -DASHBOARD

            styles += `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                .ecam-dash { display: grid; flex-direction: column; justify-content:center; width: 97%; grid-template-columns: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; margin: 20px 1.5% 0px 1.5%; color: #1a1a1a; }

                .dash-header { background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; padding: 30px 40px; border-radius: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 3px 5px 5px 0px #00000042; }
                .dash-title { font-size: 24px; font-weight: 700; margin: 0; }
                .dash-subtitle { font-size: 14px; opacity: 95%; margin-top: 5px; }
                
                .currently-loading      { display: flex; justify-content: center; align-items: center; height: 100px; width: 100px; min-height: 100px; min-width: 100px; position: fixed; bottom: 30px; right: -100px; opacity: 0%; z-index: 1500; transition: opacity 0.2s ease; }
                .currently-loading.show { right: 30px; opacity: 100%; }
                .loading-symbol         { position: absolute; top: 100px; right: 100px; height: 100px; width: 100px; clip-path: circle(20px); background: #594a8fe0; offset-path: circle(50px); backdrop-filter: blur(2px); offset-distance: var(--offset-offset); }
                .loading-symbol.show    { animation: loading 1s infinite; }
                @keyframes loading  { from {offset-distance: var(--offset-offset)} to {offset-distance: calc(var(--offset-offset) + 100%)} }

                .new-user-notif     { display: flex; justify-content: center; align-items: center; padding: 10px; position: absolute; width: 250px; font-size: 15px; text-wrap-mode: wrap; background: #00037b; border-radius: 20px; outline: 2px solid; text-align: center; z-index: 10; transition: all 0.3s ease; } 
                @keyframes hoveringElem { 0% { transform: translateY(0px); } 50% { transform: translateY(var(--hoverAmp)); } 100% { transform: translateY(0px); } }
            `;
            
            
            // MARK: buttons
            styles += `
                .lang-btn           { border: 2px solid #000000ff; background: #6f79ff; border-radius: 18px; width: 36px; height: 36px; }
                .lang-btn.active    { border: 2px solid #ceefffff; }
                .lang-btn:hover     { border: 2px solid #afe4ffff; background: #a6acff; }


                .over-header-btns                   { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; position: absolute; top: 59px; right: 2.4%; gap: 8px; }
                .over-header-report-btns                { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; }
                .over-header-help-btns                  { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
                
                .over-header-btn                            { display: flex; justify-content: center; align-items: center; border-radius: 20px; position: relative; transition: all 0.2s ease; height: 40px; cursor: pointer; user-select: none; text-decoration: none; text-wrap-mode: nowrap; overflow: clip; }
                .over-header-btn.how-to-use-btn                 { justify-content: center;  background: #0059ad; width: 40px; padding-left: 0px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; z-index: 5; }
                .over-header-btn.how-to-use-btn:hover           { outline-color: white; background: #2888e2; }
                .over-header-btn.how-to-use-btn.open            { outline-color: white; }
                .over-header-how-to-use-btns                        { display: flex; justify-content: center; align-items: center; gap: 9px; position: absolute; top: 30px; right: 0px; opacity: 0%; z-index: 6; transition: all 0.2s ease; }
                .over-header-how-to-use-btns.open                   { top: 50px; opacity: 100%; }
                .over-header-btn.issue.doc-btn                          { background: #0059ad; outline: 2px solid #c022ff; box-shadow: 5px 7px 6px 0px black; padding: 0px 10px; font-size: 15px; border: none; color: inherit; }
                .over-header-btn.issue.tuto-btn                         { background: #0059ad; outline: 2px solid #c022ff; box-shadow: 5px 7px 6px 0px black; padding: 0px 10px; font-size: 15px; border: none; color: inherit; }
                .over-header-btn.issue.doc-btn:hover                    { background: #1672c9; outline-color: #ffffff;     box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.tuto-btn:hover                   { background: #1672c9; outline-color: #ffffff;     box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.doc-btn:focus                    { background: #1672c9; outline-color: #ffffff;     box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.tuto-btn:focus                   { background: #1672c9; outline-color: #ffffff;     box-shadow: 7px 9px 6px 2px black; }

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
                
                .over-header-btn.issue.mail-info.fr.open            { width: 330px; right: -685px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.share-config.fr.open         { width: 550px; right: -640px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.suggest-idea.fr.open         { width: 380px; right: -261px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.report-issue.fr.open         { width: 220px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.mail-info.en.open            { width: 330px; right: -580px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.share-config.en.open         { width: 445px; right: -530px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.suggest-idea.en.open         { width: 315px; right: -215px; box-shadow: 5px 7px 6px 0px black; }
                .over-header-btn.issue.report-issue.en.open         { width: 175px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }

                .over-header-btn.issue.mail-info.open:hover          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.share-config.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.suggest-idea.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.report-issue.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.mail-info.open:focus          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.share-config.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.suggest-idea.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                .over-header-btn.issue.report-issue.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                

                .header-actions                 { display: flex; gap: 12px; }
                .btn                                { display: flex; justify-content: center; align-items: center; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px; }
                .btn-edit-mode:hover:not(:disabled) { transform: scale(0.95); background: linear-gradient(135deg, #7d92eeff 0%, #8e5ebeff 100%); }
                .btn-edit-mode                      { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: grid; width: 126px; height: 108px; transition: all 0.2s ease }
                .btn-edit-mode.on                   { transform: scale(0.95); box-shadow: inset 0px 0px 6px 4px #ffffff; }
                .btn-export                         { background: white; color: #666; width: 140px; height: 50px; }
                .btn-import                         { background: white; color: #666; width: 140px; height: 50px; z-index: 1; }
                .btn-export:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                .btn-import:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                .btn-icon                           { font-size: 20px; margin-bottom: 2px }
                .btn:disabled                       { opacity: 50%; cursor: not-allowed; }
            `;


            // MARK: import menu
            styles += `

                .import-menu        { display: flex; justify-content: space-around; position: absolute; right: 4%; top: 220px; background: white; color: black; box-shadow: 5px 4px 20px 0px #00000066; font-size: 15px; border-radius: 13px; min-height: 60px; width: 35%; align-items: center; opacity: 0%; z-index: 0; transition: all 0.2s ease; }
                .import-menu.show   { top: 245px; opacity: 100%; }
                .import-menu-btn        { display: flex; justify-content: center; align-items: center; text-align: center; user-select: none; cursor: pointer; border-radius: 12px; border: 2px solid; height: 40px; width: 40%; padding: 5px; transition: all 0.2s ease; }
                .import-menu-btn:hover  { background: #dddddd; }
                .import-menu-btn.file   {  }
                .import-menu-btn.clear  { width: 15%; }
                .import-menu-btn.online {  }
                

                .online-cfg-picker-menu         { --bg-end-color: white; --bg-start-color: #ffffff61; --bg-start-gradient: 20%; display: flex; flex-direction: column; justify-content: flex-start; position: fixed; width: 750px; height: 500px; left: calc(50% - 750px / 2); top: calc(50% - 500px / 2); transform: translateZ(0) scale(110%); z-index: 1000; border-radius: 20px; border: 0px solid #ffffff; background: radial-gradient(closest-corner, var(--bg-start-color) var(--bg-start-gradient), var(--bg-end-color)); opacity: 0%; backdrop-filter: blur(1.4px); transition: opacity 0.3s ease, border-width 0.3s ease, transform 0.3s ease; }
                .online-cfg-picker-menu.show    { border-width: 8px; transform: translateZ(0) scale(100%); opacity: 100%; }
                .online-cfg-picker-menu-header          { display: flex; justify-content: flex-end; height: 40px; align-items: center; z-index: 1010; }
                .online-cfg-picker-menu-close-btn           { display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; border-radius: 15px; border: 2px solid; font-size: 20px; user-select: none; cursor: pointer; margin-right: 3px; transition: all 0.2s ease; }
                .online-cfg-picker-menu-close-btn:hover     { width: 40px; height: 40px; border-radius: 20px; font-size: 30px; margin-right: -2px; gap: 5px; }

                .online-cfg-picker-menu-body            { display: flex; flex-direction: row; justify-content: center; align-items: center; height: 500px; width: 100%; position: fixed; top: -8px; gap: 5px; overflow: clip; }
                .online-cfg-picker-menu-body-container  { display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 640px; }
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
                .main-average-card { display: flex; align-items: center; justify-content: space-between; height: 104px; background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 15px; border: 2px solid #f0f0f0; transition: box-shadow 0.3s ease, border-color 0.3s ease; }

                .average-display { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 7px; }
                .average-number     { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
                .average-label      { font-size: 18px; color: #666; font-weight: 500; }
                .average-stats { display: flex; gap: 30px; }
                .stat-item { text-align: center; }
                .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
                .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
            `;


            // MARK: new grades
            styles += `
                .new-grades-card                { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px; width: 100%; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87; scroll-margin: 105px; transition: box-shadow 0.2s ease}
                .new-grades-card.myhighlight    { box-shadow: 0px 0px 20px 20px #322bff87; }
                .new-grades-card.none           { border: 1px solid #446dff; background: #f7f9ffff; box-shadow: none; opacity: 80%; }
                .new-grades-card-header         { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px; }
                .new-grades-card-header.none    { justify-content: center; }
                .new-grades-card-title          { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 5px; display:flex; align-items:center }
                .new-grades-card-title.none     { font-size: 18px; font-weight: 700; }
                .new-grades-content             { display: flex; flex-direction: column; gap: 20px; }
                .new-grades-subject-card        { display: flex; flex-direction: column; border: 2px solid #c1a7ffff; border-radius: 12px; }
                .new-grades-subject-card:hover  { cursor:alias }
                .new-grades-subject-card-title  { border: 2px solid #c1a7ffff; border-radius: 12px; margin: -2px -2px 5px -2px; font-size: 16px; font-weight: 600; background: #c1ceff; padding: 5px 0px 5px 10px; }
                .new-grades-table               {  }
                .new-grades-table-grades        {  }
            `;


            // MARK: notifs
            styles += `
                .update-available-notif     { display: flex; align-items: center; justify-content: space-evenly; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 95%; height: 70px; position:fixed; left:2.5%; right:0px; top:-75px; z-index:301; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                .update-available-notif.on  { top: 2px }
                .update-available-notif-header  { display: flex; justify-content: center; width: 80%; font-size: 25px; }
                .update-available-notif-btns    { display: flex; justify-content: space-between; align-items: center; flex-direction: row; width: 20%; }
                .update-btn                     { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #007cffff; transition: all 0.3s ease; text-decoration: none; outline: none; color: inherit; }
                .update-btn:focus               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                .update-btn:hover               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                .dismiss-update-btn             { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #ff00218f; transition: all 0.3s ease; }
                .dismiss-update-btn:hover       { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }

                .new-grades-notif           { display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 90%; height: 50px; cursor:pointer; position:fixed; left:5%; right:0px; top:-55px; z-index:299; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                .new-grades-notif.on        { top:50px }
            `;


            // MARK: semester filter
            styles += `
                .controls-bar       { background: white; border-radius: 16px; padding: 16px 20px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e5e5; }
                .filter-title       { border-radius: 20px; color: white; font-weight: 700; font-size: 14px; padding: 10px 15px; margin-right: 70%; margin-bottom: -15px; background: linear-gradient(45deg, #446dff 20%, #1222ff12 60%, #ffffff00 89%); position: relative; transition: all 0.2s ease; }
                .filter-tabs        { display: flex; background: #f7f7f7; padding: 4px; border-radius: 12px; gap: 4px; height: 44px; }
                .filter-tab         { display: flex; justify-content: center; padding: 10px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: all 0.2s ease; font-size: 14px; width: 57px; }
                .filter-tab:hover   { background: white; color: #333333ff; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(1.1); }
                .filter-tab.active  { background: white; color: #667eeaff; box-shadow: 3px 5px 5px 0px #00000042; }
            `;


            // MARK: view mode buttons
            styles += `
                .view-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 4px; background: #f7f7f7; border-radius: 8px; }
                .fold-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; height: 40px; width: 250px; background: #f7f7f7; outline: 1px solid; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; user-select: none; transition: all 0.3s ease; }
                .fold-toggle:hover  { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                .fold-toggle.active { background: white; box-shadow: 3px 5px 5px 0px #00000042; }
                .view-btn           { background: transparent; padding: 8px 12px; border: none; outline: 1px solid; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; width: 48px; height: 40px; }
                .view-btn:hover     { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                .view-btn.active    { background: white; box-shadow: 3px 5px 5px 0px #00000042; }
            `;

        //#endregion
        
        



        //#region -DROP FIELDS REGION
            styles += `
                .drop-field     { display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; overflow: clip; user-select: none; }
                `;

            // MARK: scroll fields
            styles += `
                .scroll-field           { --scroll-field-height: 100px; display: flex; flex-direction: column; mix-blend-mode: multiply; position: fixed; left: 0px; user-select: none; width: 100%; height: var(--scroll-field-height); z-index: 299; transition: all 0.3s ease; }
                .scroll-field.up        { top:    calc(-1*var(--scroll-field-height) - 45px); background: linear-gradient(  0deg, #b6d0ff00 0%, #5c95ff 100%); }
                .scroll-field.down      { bottom: calc(-1*var(--scroll-field-height) - 45px); background: linear-gradient(180deg, #b6d0ff00 0%, #5c95ff 100%); }
                .scroll-field.up.show   { top:    0px; opacity: 50%; }
                .scroll-field.down.show { bottom: 0px; opacity: 50%; }
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
                .drop-field-remove-from-module-minus.hover               { font-size: 90px; animation: 0.3s slightHorizShake ease; }
                .drop-field-remove-from-module-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-remove-from-module-text.top                  { bottom:  10px; left: 0px; }
                .drop-field-remove-from-module-text.bottom               { top:     10px; right:0px; }
                .drop-field-remove-from-module-text.top.hover            { bottom:  30px; left: 20px; font-size: 30px; }
                .drop-field-remove-from-module-text.bottom.hover         { top:     30px; right:20px; font-size: 30px; }

                .drop-field-remove-from-module-text.top.fr::before       { content: "Enlever"; }
                .drop-field-remove-from-module-text.bottom.fr::after     { content: "du module"; }
                .drop-field-remove-from-module-text.top.en::before       { content: "Remove"; }
                .drop-field-remove-from-module-text.bottom.en::after     { content: "from module"; }
                @keyframes slightHorizShake { 0% {left: 0px} 25% {left: 3px} 50% {left: -3px} 75% {left: 3px} 100% {left: 0px} }

                .drop-field-remove-from-module-hitbox                    { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border-radius: 0px 20px 20px 0px; transition: all 0.2s ease; }
                .drop-field-remove-from-module-hitbox.show               { width: 15%; border-width: 2px 2px 2px 0px; cursor: pointer; z-index: 298; }
            `;
                

            // MARK: drop insert fields
            styles += `

                .drop-field.insert-field.module                      { justify-content: flex-start; height: 0px; width: 98%; color: #9b9b9b00; border: 2px dashed #9b9b9b00; background: #bdb8ff00; font-size: 25px; font-weight: 800; user-select: none; margin: -12px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.module.show                 { color: #9b9b9bff; border-color: #9b9b9bff; opacity: 50%; border-width: 2px 0px; border-radius: 0px;   height: 50px; background: #bdb8ff3d; margin: 0px; }
                .drop-field.insert-field.module.show.hover           { color: #887bffff; border-color: #7fc2ffff; opacity: 100%;   border-width: 2px 2px; border-radius: 20px; }

                .drop-field.insert-field.subject                 { justify-content: flex-start; height: 0px; width: 98%; color: #9b9b9b00; border: 2px dashed #9b9b9b00; background: #bdb8ff00; font-size: 25px; font-weight: 800; user-select: none; margin: -6px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.subject.show            { color: #9b9b9bff; border-color: #9b9b9b54; opacity: 50%; border-width: 2px 0px; border-radius: 0px;  height: 30px; background: #bdb8ff1a; margin: 0px; }
                .drop-field.insert-field.subject.show.hover      { color: #887bffff; border-color: #7fc2ffff; opacity: 100%;   border-width: 2px 2px; border-radius: 20px; }
                
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





        //#region -CONTENT AREA
            styles += `
                .content-area { display: grid; gap: 24px; }
            `;




            // MARK: Intranet table
            styles += `
                .intranet-fold { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .intranet-fold:hover { background: #f3f4f6; }
                .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
                .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
                .intranet-toggle.openLeft { transform: rotate(-180deg); }
                .intranet-toggle.openRight { transform: rotate(180deg); }
            `;


            // MARK: semester section
            styles += `
                .semester-section   { display: flex; flex-direction: column; align-items: center; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
                .semester-header        { display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f9fafb; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; cursor: pointer; }
                .semester-header:hover  { background: #f3f4f6; }
                .semester-info              { display: flex; align-items: center; gap: 12px; }
                .semester-name              { font-size: 18px; font-weight: 600; color: #1a1a1a; }
                .semester-average           { padding: 6px 12px; background: white; border-radius: 8px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
                .average-good                   { color: #10b981; border: 1px solid #10b98130; }
                .average-medium                 { color: #f59e0b; border: 1px solid #f59e0b30; }
                .average-bad                    { color: #ef4444; border: 1px solid #ef444430; }
                .semester-toggle                { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
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
                .modules-section.edit                           { gap: 25px; }
            `;
                





            // MARK: -MODULE CARDS
            styles += `

                .module-card                { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fafafa; border-radius: 25px; border: 3px solid #e5e5e5; scroll-margin: 70px; transition: border-radius 0.2s ease, margin 0.2s ease; }
                .module-card.fold           { border-radius: 25px; border-width: 0px; }
                .module-card.validated      { border-color: #10b981ff; background: radial-gradient(transparent 0%, #f0fdf4ff 75%); }
                .module-card.failed         { border-color: #ef4444ff; background: radial-gradient(transparent 0%, #fef2f2ff 75%); }
                .module-card.unknown        { border-color: #6d6d6dff; background: radial-gradient(transparent 0%, #d1d1d1ff 75%); }

                .module-header                  { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 25px 25px 0px 0px; width: 100%; cursor: pointer; z-index: 1; transition: border-radius 0.3s ease, border-color 0.3s ease, opacity 0.3s ease, filter 0.3s ease; }
                .module-header.fold             { border-width: 3px; border-style: solid; border-radius: 25px; }
                .module-header.validated        { border-color: #10b981ff; background: linear-gradient(300deg, #e0ffeaff 30%, transparent); }
                .module-header.failed           { border-color: #ef4444ff; background: linear-gradient(300deg, #ffd9d9ff 30%, transparent); }
                .module-header.unknown          { border-color: #6d6d6dff; background: linear-gradient(300deg, #acacacff 30%, transparent); }
                .module-header:hover            { filter: brightness(calc(0.01 * 105)); opacity: 90%; }
                .module-delete-btn                  { border-radius: 14px; background: transparent; }
                .module-title                    { font-size: 16px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
                .module-title.input              { font-size: 16px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }

                .module-subject-total-coef-div   { display: flex; flex-direction: column; text-align: left; width:47%; gap:4px; padding: 0px 10px; font-size: 14px; }
                .module-subject-total-coef-value { display: flex; text-align: left; font-size: 13px; font-weight: 600; gap: 8px; }
                .module-subject-total-coef-debug { display: flex; text-align: left; font-size: 13px; }


                .module-card-content            { display: flex; flex-direction: row; width: 98%; height: 100%; align-items: center; gap: 0px; margin: 8px 0px 18px 0px; opacity: 100%; transition: all 0.2s ease; }
                .module-card-content.fold   { height: 0%; margin: 0px; opacity: 0%; }
                .module-card-content.edit-mode  { gap: 1% }

                .module-info                        { display: flex; flex-direction: row; justify-content: space-around; align-items: center; width:97%; background: #eef2ff00; border:1px solid #c7d2fe00; padding: 0px 8px 3px 8px; border-radius: 0px 0px 8px 8px; margin-top: -1px; height: 36px; opacity: 100%; transition: all 0.2s ease; }
                .module-info.fold               { height: 0px; padding: 0px; opacity: 0%; }
                .module-info-bar                    { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width:48%; background: #eef2ff; border:1px solid #c7d2fe; padding: 3px 15px; border-radius: 0px 0px 8px 8px; }
                .module-info-clear                  { display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 220px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
                .module-info-clear:hover            { width: 240px; font-size: 11.5px; margin-right: 0px; background: #eef2ff; }
                .module-info-clear.disabled         {  }
                .module-info-clear.sim              {  }

                .module-details                     { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 30px; opacity: 100%; transition: all 0.2s ease; }
                .module-details.edit-mode           { gap: 8px; }
                .module-details.fold                { gap: 0px; opacity: 0%; }
                .module-moyenne                     { display: flex; align-items: center; justify-content: flex-end; font-size: 24px; font-weight: 800; gap:10px; width: 193px; }
                .module-moyenne.good                { color: #10b981; }
                .module-moyenne.bad                 { color: #ef4444; }
                .module-moyenne.unknown             { color: #6d6d6dff; }
                .module-toggle                      { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; margin-left: 5px; font-size: 18px; color: #000000; transition: transform 0.3s ease; }
                .module-toggle.open                 { transform: rotate(180deg); }

            `;
                



            // MARK: -UNCLASSIFIED SECTION
            styles += `

                .unclassified-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; transition: height 0.2s ease; }
                .unclassified-content   { display: flex; flex-direction: column; align-items: center; gap: 25px; width: 99%; height: 100%; }
                .unclassified-title     { display: flex; align-items: center; gap: 8px; width: 97%; font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; }
            `;
                



            //#region -SUBJECT CARDS
                styles += `

                    .subject-card               { display: flex; flex-direction: column; justify-content: space-between; align-items: center; width: 100%; border-radius: 20px; outline: 4px solid #ffffffff; opacity: 100%; transition: all 0.2s ease; }
                    .subject-card.good                  { box-shadow: 0px 0px 0px 0px #39ff8f; background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                    .subject-card.good:hover            { box-shadow: 0px 0px 7px 0px #39ff8f; }
                    .subject-card.meh                   { box-shadow: 0px 0px 0px 0px #fff27b; background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                    .subject-card.meh:hover             { box-shadow: 0px 0px 7px 0px #fff27b; }
                    .subject-card.bad                   { box-shadow: 0px 0px 0px 0px #ff7b7b; background: linear-gradient(300deg, #fef2f2 30%, transparent); }
                    .subject-card.bad:hover             { box-shadow: 0px 0px 7px 0px #ff7b7b; }
                    .subject-card.unknown               { box-shadow: 0px 0px 0px 0px #6d6d6d; background: linear-gradient(300deg, #c5c5c5 30%, transparent); }
                    .subject-card.unknown:hover         { box-shadow: 0px 0px 7px 0px #6d6d6d; }
                    
                    .subject-card-header        { display: flex; flex-direction: row;    justify-content: space-between; align-items: center; width: 100%; height: 64px; border-radius: 20px 20px 0px 0px; border-bottom: 4px solid white; padding: 5px 0px; font-weight:700; font-size: 15px; vertical-align: top; }
                    .subject-card-header.compact    { border-radius: 20px; border-bottom: none; padding: 5px 0px 7px 0px; }
                    .subject-card-header.good       { background: linear-gradient(300deg, #e3ffeb 30%, transparent); }
                    .subject-card-header.meh        { background: linear-gradient(300deg, #ffe8d0 30%, transparent); }
                    .subject-card-header.bad        { background: linear-gradient(300deg, #ffe0e0 30%, transparent); }
                    .subject-card-header.unknown    { background: linear-gradient(300deg, #b8b8b8 30%, transparent); }
                    .subject-name                   { font-weight: 800; color: #1a1a1a; font-size: 14px }
                    .subject-name.input             { font-weight: 800; color: #1a1a1a; font-size: 14px; border: 2px solid #797979; border-radius: 15px; padding-left: 8px; width: 100%; height: 25px;}
                    .subject-coef-input-box         { padding-left: 5px; width: 48px; border-radius: 8px; }
                    
                    .subject-card.fold      { height: 0px; border-width: 0px; padding: 0px; opacity: 0%; }

                    .subj-moyenne        { font-size: 16px; font-weight: 800; }
                    .subj-moyenne.good   { color: #10b981; }
                    .subj-moyenne.bad    { color: #ef4444; }

                    .subject-total-coef-div        { display: flex; flex-direction: column; gap: 4px; text-align: left; width:58%; padding: 0px 10px; font-size: 13px}
                    .subject-total-coef-value      { display: flex; gap: 15px; text-align: left; font-weight: 600; gap: 8px; }
                    .subject-total-coef-debug      { display: flex; gap: 15px; text-align: left; font-weight: 400; }
                    .subject-insert-field                           { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
                    .subject-insert-field.show                      { height: 50px; margin: 10px 0px; }

                    .selected-subject-card-notif-container              { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; right: 10px; z-index: 301; transition: width 0.3s ease; }
                    .selected-subject-card-notif-div                    { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
                    .selected-subject-card-notif-div.on                 { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
                    .selected-subject-card-notif-div-scroll-btn         { font-size: 20px; height: 20px; user-select: none; cursor: alias; transition: color 0.2s ease; }
                    .selected-subject-card-notif-div-scroll-btn:hover   { color: white; }
                    .selected-subject-card-notif-div-del-btn            { color: #640000; font-size: 20px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
                    .selected-subject-card-notif-div-del-btn:hover      { color: #ffffff; }
                `;
                    

                // MARK: grades table
                styles += `

                    .grade-row                           { border-bottom: 1px solid white /* #e4e4e4 */; height: 39px; transition: background 0.3s ease; }
                    .grade-row.last                      { vertical-align: baseline; border-bottom: none; height: 41px; }
                    .grade-row.sim                       { background: #e9efff9a; }
                    .grade-row:hover                     { background: #eeedfd; }
                    .grades-table                        { background: linear-gradient(300deg, #c5c5c5 30%, transparent); width: 98%; }
                    .grades-table.compact                { margin: -12px 20px 20px 20px; }
                    .grades-table.good                   { background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                    .grades-table.meh                    { background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                    .grades-table.bad                    { background: linear-gradient(300deg, #fef2f2 30%, transparent); }
                    .grades-table th                     { padding: 10px 12px; height: 39px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border: 3px solid white; border-right-width: 2px; border-left-width: 2px; border-top-width: 0px; text-align: center; text-wrap-mode: nowrap; }
                    .grades-table td                     { padding: 10px; font-size: 14px; text-wrap-mode: nowrap; }
                    .grades-table-type                   { width: 30%; padding-left:30px; transition: all 0.2s ease; }
                    .grades-table-type.dragging          { width: 30%; }
                    .grades-table-grade                  { width: 13%; text-align: right; transition: all 0.2s ease; }
                    .grades-table-grade.dragging         { width: 15%; }
                    .grades-table-coef                   { width: 10%; text-align: right; transition: all 0.2s ease; }
                    .grades-table-coef.dragging          { width: 15%; }
                    .grades-table-classAvg               { width: 10%; text-align: right; transition: all 0.2s ease; }
                    .grades-table-classAvg.dragging      { width: 15%; }
                    .grades-table-date                   { width: 10%; text-align: right; transition: all 0.2s ease; }
                    .grades-table-date.dragging          { width: 15%; }
                    .grades-table-teacher                { width: 32%; text-align: end;   transition: all 0.2s ease; display: table-cell; font-size:12px;color: #999; }
                    .grades-table-teacher.dragging       { width: 0%; color: transparent; border-right-width: 0px; }
                    .grades-table-add-sim-cell           { width: 0%; transition: all 0.2s ease; }
                    .grades-table-add-sim-cell.dragging  { width: 0%; }
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
                    .simulated-grade-input         { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
                    .simulated-grade-input.sim-inp-type    { width: 55%;  max-width:250px; height:25px }
                    .simulated-grade-input.sim-inp-grade    { width: 100%; max-width:75px;  height:25px }
                    .simulated-grade-input.sim-inp-coef    { width: 100%; max-width:60px;  height:25px }
                    .simulated-grade-input.sim-inp-date    { width: 100%; max-width:140px; height:25px }
                    .simulated-grade-input-edit    { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
                    .grade-sim-del-btn           { border: none; border-radius: 6px; cursor: pointer; }
                    .grade-checkbox  { cursor: pointer; }
                `;
                

                // MARK: icons
                styles += `

                    .fold-icon  { cursor: pointer; user-select: none; }

                    .drag-icon                              { display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; }
                    .drag-icon.for-detailed-subject-card        { border: 2px solid; border-radius: 8px; }
                    .drag-icon.for-compact-subject-card         { border: 2px solid; border-radius: 8px; }
                    .drag-icon.for-unclassified-subject-card    { border: 2px solid; border-radius: 8px; }

                    .tick-icon      { height: 23px; width: 23px; font-size: 35px; color: #004cff; cursor:pointer; user-select:none; }
                `;
            
            //#endregion
            
        //#endregion
            




        // MARK: Animations
        styles += `

            /* @media (max-width: 768px)   {
                .dash-header { flex-direction:column; align-items:start; gap:16px; } 
                .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } 
            } */
            .loading            { text-align: center; padding: 40px; color: #999; }
            @keyframes dots     { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
            .loading::after     { content: '...'; animation: dots 1.5s steps(4, end) infinite; }

            @keyframes fadeIn   { from { opacity: 0%; transform: translateY(10px); } to { opacity: 100%; transform: translateY(0); } }
            .fade-in            { animation: fadeIn 0.3s ease; }
            @keyframes scrollTo { 15% {transform: scale(100%);} 100% {transform: scale(105%); outline-color: #5f77ff} }
            .scroll-to          { animation: 0.3s 2 alternate scrollTo ease }
        `;



    //#endregion
    
    
    
    
    
    // MARK: -========================






    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    //MARK: -
    class ECAMDashboard {

        constructor() {
            // IMPORTANT: SCRIPT VERSION, UPDATE IT FOR EVERY UPDATE, SHOULD MATCH THE USERSCRIPT HEADER'S VERSION NUMBER
            this.scriptVersion = "2.2.6";
            this.configVersion = 3;

            this.now        = () => {return new Date().toISOString().replace(/\.(\d{3})/, "")};                         // Current date and time in ISO String, removing the milliseconds
            this.dateHour   = () => {return new Date().toISOString().replace(/\:\d{2}\:\d{2}\.(\d{3})Z/, ":00:00Z")};   // Current date and time in ISO String, rounded down to the hour
            this.today  = new Date().toISOString().split('T')[0];                                                       // Current date in ISO String
            this.dateTimeOfLastUpdateCheck          = localStorage.getItem("ECAM_DASHBOARD_DATE_TIME_OF_LAST_UPDATE_CHECK") || "2000-00-00T00:00:00Z"; // A day before the date of last update, so that the update check is ran to make sure the correct version is installed
            this.isUpdateAvailable                  = localStorage.getItem("ECAM_DASHBOARD_IS_UPDATE_AVAILABLE")            || false;
            this.firstLoad                          = localStorage.getItem("ECAM_DASHBOARD_FIRST_LOAD")                     || true;

            this.grades     = [];
            this.semesters  = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};
            this.savedReadGrades        = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"))             || [];
            this.sim                    = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES"))                    || {};
            this.newGrades = [];
            
            this.repoUserReportIssue        = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=user-report-issue-template.md";
            this.repoUserSuggestionIssue    = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=feature-improvement-request-template.md";
            this.repoUserConfigShare        = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/issues/new?template=share-config-template.md";
            this.repoReadMeHowToUse         = "https://github.com/Batkillulu/ECAM-Grades-Dashboard?tab=readme-ov-file#how-to-use-quick-start"
            this.repoContentsAPI            = "https://api.github.com/repos/Batkillulu/ECAM-Grades-Dashboard/contents";
            this.repoScriptRaw              = "https://raw.githubusercontent.com/Batkillulu/ECAM-Grades-Dashboard/refs/heads/main/ECAM%20Grades%20Dashboard.user.js";
            
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
            
            this.moduleConfig           = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_MODULE_CONFIG"))                 || {};
            this.disabledGrades         = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES"))               || [];
            this.gradesDatas = {};


            this.defSem                             = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_SEMESTER")               || "all";
            this.currentSemester = this.defSem;

            this.defView                            = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE")              || "detailed";
            this.viewMode = this.defView;

            this.lang                               = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE")               || "en";
            this.tempSelection = {};
            this.draggedSubjId = "";
            this.editMode               = JSON.parse( localStorage.getItem('ECAM_DASHBOARD_DEFAULT_EDIT_MODE'))             || false;
            this.pinDockbar = false;
            this.timeouts = {};

            this.mobileVer = this.clientWidth <= 935;
            this.clientWidth = 1920;

            this.selectedSubjectCardsId = [];
            this.selectedSubjectCardsSortedByModule = {};
            this.compactSubjCardsId = [];
            this.foldedModuleCardsId = [];
            this.scrollToThisElem = "";

            this.init();
        }




        // MARK: -INIT
        init() {
            // Run an update check
            this.autoUpdateCheck();

            // Read the grades from the table and detect if there are new grades (compared with the last time the script was ran)
            this.parseGrades();

            // Sort all the grades read from the table into semesters, modules and subjects, and get datas from all levels (module average, subject average etc...)
            this.getGradesDatas();

            // Activate the general keyboard events
            this.generalKeyboardEvents("general");

            // Create the new grades notification and its associated new grades table if at least one new grade is detected
            this.createNewGradesNotifDiv();

            // Now that all the datas are acquired, create the dashboard
            this.createDashboard();

            // Trigger the first load notifications to show some help to learn how to use the extension
            this.firstLoadEvent();
        }




        //#region -REGION: Misc methods



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
            scrollToClientHighestElem(priority="first", ...{className= "subject-card", id="", margin=this.editMode ? 100 : 25, timeout=20, smooth=false, highestElemInPageHandleType="none", block="start"}) {
                const defaultTargetElementDatas = [
                    {className: "modules-section",         margin: 20,                        highestElemInPageHandleType:"partial"}, 
                    {className: "module-card",             margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"above"},
                    {className: "unclassified-section",    margin: this.editMode ? 100 : 25,  highestElemInPageHandleType:"partial"},
                    {className: "subject-card",            margin: 10,                        highestElemInPageHandleType:"above"},
                ];

                // Error-proof for different invalid arguments inputs (no arguments given, targetElementData object give instead of priority, invalid targetElementData objects passed, priority given at the wrong spot...)
                let argumentsArray = []; 
                let effectivePriority;
                (arguments?.length > 1 
                    ? Object.values(arguments).splice(1,Object.values(arguments).length) 
                    : Object.values(arguments)
                ).forEach((_obj, _index) => {
                    if (_obj instanceof String && _index == 0) {
                        effectivePriority = _obj;
                    }
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
                    effectivePriority = priority?.toLowerCase()?.trim(); // formatting priority correctly if it was given
                }
                
                if (!effectivePriority?.match(/first|last/i)) {
                    effectivePriority = "first";
                }

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
                        scrollToThisElem.style.scrollMargin = targetElemData.block == "center" ? "" : `${(targetElemData?.margin || margin) + (document.body.classList.contains("lfr-dockbar-pinned") ? 45 : 0)}px`;
                        scrollToThisElem.scrollIntoView({behavior: (targetElemData?.smooth || smooth) ? "smooth" : "instant", block: targetElemData.block});
                        this.scrollToThisElem = "";
                    }, (targetElemData?.timeout || timeout))

                    return this.scrollToThisElem || String("."+targetElemData.className);
                }

                return;
            }

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
            /** Save the module configuration in the cache */
            saveConfig() { localStorage.setItem('ECAM_DASHBOARD_MODULE_CONFIG', JSON.stringify(this.moduleConfig)); }
            /** Save the simulated grades in the cache */
            saveSim() { this.deleteUnusedSimPath(); localStorage.setItem("ECAM_DASHBOARD_SIM_GRADES", JSON.stringify(this.sim)); }
            /** Save the ignored grades in the cache */
            saveIgnoredGrades() { localStorage.setItem("ECAM_DASHBOARD_DISABLED_GRADES", JSON.stringify(this.disabledGrades)); }
            /** Save the read grades in the cache */
            saveReadGrades() { localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades)); }
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
            getAllSubjectsForModule(sem, moduleName){
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
            getGradeColor(grade) { if (grade >= 10) return 'good'; return 'bad'; }
            getAverageColor(avg) { if (avg >= 12) return 'average-good'; if (avg >= 10) return 'average-medium'; return 'average-bad'; }
            gradeIsDisabled(n) {
                return this.disabledGrades?.includes([n.semester, n.subject, (n?.id || n.type + " " + n.date + " " + n.prof)].join("\\"))
            }
            moyennePonderee(arr) {
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
            getUnclassifiedSubjects(sem) {
                const classified = new Set();
                const moduleConfig = this.moduleConfig?.[sem] || {};
                Object.values(moduleConfig).forEach(module => { (module.subjects||[]).forEach(m => classified.add(m)); });
                return Object.keys(this.semesters[sem]||{}).filter(m => !classified.has(m));
            }
            getModuleStats() {
                let validated = 0, total = 0;
                Object.keys(this.moduleConfig).forEach(sem => {
                    Object.keys(this.moduleConfig[sem]).forEach(moduleName => {
                        const moduleGrades = this.calculateModuleGrades(sem, moduleName);
                        const moyenne = this.moyennePonderee(moduleGrades);
                        if (moyenne != 0 && moduleGrades.length > 0) total++; if (moyenne >= 10) validated++;
                    });
                });
                return { validated, total };
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
            createNewGradesNotifDiv() {
                if (document.querySelector(".new-grades-notif") == null) {
                    const notifDiv = document.createElement("div");
                    notifDiv.className = "new-grades-notif";
                    notifDiv.innerHTML = this.lang == "fr" ? `NOUVELLE NOTE${this.newGrades.length>1 ? "S !" : " !"}` : `NEW GRADE${this.newGrades.length>1 ? "S!" : "!"}`;
                    notifDiv.innerHTML += `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌</button>`;
                    document.querySelector(".portlet-boundary").appendChild(notifDiv);
                    setTimeout(() => {if (this.newGrades.length > 0) {document.querySelector(".new-grades-notif").classList.add("on")}}, 10)
                }
                else
                {
                    document.querySelector(".new-grades-notif").innerHTML = this.lang == "fr" ? `NOUVELLE NOTE${this.newGrades.length>1 ? "S !" : " !"}` : `NEW GRADE${this.newGrades.length>1 ? "S!" : "!"}` +
                    `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌</button>`;
                }
            }
            draggableIcon(source="subject-card", {height=25, type="unknown", targetId="none"}={height: 25, type: "unknown", targetId:"none"}) {
                return `<div class="drag-icon for-${source}" data-targetid="${targetId}" data-type="${type}" draggable="false" style="height:${height}px; width:${height}px; font-size: ${height*0.75}px">☰</div>`
            }
            dateTimeSlice(dateTime=this.now(), minutesOffset=5) {
                const minutes    = parseInt(dateTime.match(/T\d{2}:(\d{2}):\d{2}Z/)[1]);
                const hour       = parseInt(dateTime.match(/T(\d{2}):\d{2}:\d{2}Z/)[1]);
                
                const newMinutes  = minutes + (minutesOffset-minutes%minutesOffset);
                const newHour     = minutes >= 60 
                ? ((hour + 1).toString().length > 1 ? (hour + 1).toString() : "0"+(hour + 1).toString()) 
                : (hour.toString().length > 1 ? hour.toString() : "0"+hour.toString())
                ;

                const formatedMinutes = (newMinutes%60).toString().length > 1 ? (newMinutes%60).toString() : "0"+(newMinutes%60).toString();

                return dateTime.replace(/T\d{2}:\d{2}:\d{2}Z/, `T${newHour}:${formatedMinutes}:00Z`);
            }
            /** Call inside a onkeydown or onkeyup event listener
             *  
             * @param {KeyboardEvent} keyboardEvent Pass the keyboard event trigger onkey event from which this method is called
             * @param {String | Array} keyPressed The key expected to be pressed, an array of keys expected to be pressed or a regular expression to match the key pressed
             * @param {Object} param3 All the modifiers. Each element of this object `alt`, `ctrl`, `shift`, `meta`, and `repeat` take as value on of the following Strings: "required", "allowed", "dont care", 
             * @returns {RegExpMatchArray} A formated RegExpMatchArray result following the key and the modifiers given as parameters
             */
            keyInputMatch(keyboardEvent, keyPressed="([a-zA-Z])", {alt="whatever", ctrl="whatever", shift="whatever", meta="whatever", repeat="whatever"}={alt:"whatever", ctrl:"whatever", shift:"whatever", meta:"whatever", repeat:"whatever"}) {
                const e = keyboardEvent;

                let keyExpected = keyPressed;
                if      (keyPressed instanceof Array)   { keyExpected = keyPressed.map((s) => {if (s.match(/[^a-z]+/i)) {return "\\"+s} else {return s}}).join("|"); }
                else if (keyPressed instanceof String)  { keyExpected = "\\"+ keyPressed; }
                else if (keyPressed instanceof RegExp)  { keyExpected = keyPressed.source; }

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
            resizeUnclassifiedSection() {
                this.timeouts.resizeUnclassifiedSection = setTimeout(() => {
                    const unclassifiedSection = document.querySelector(".unclassified-section");
                    unclassifiedSection.style.height = "";
                    setTimeout(() => {
                        const unclassifiedSection = document.querySelector(".unclassified-section");
                        const currentUnclassifiedSectionHeight = Number(unclassifiedSection.clientHeight);
                        unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;
                    }, 1)
                }, 1)
            }

            // MARK: Set total coefs
            setGradesTableTotalCoef(container=document) {
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


                    let advice = this.lang == `fr` ? `Toutes tes notes sont là !` : `All your grades are out!`;
                    let color = good;

                    
                    if (totalCoefSubjects != 100) {
                        advice = this.lang == "fr" ? `Réajuste le coef de tes matières, leur somme n'est pas égale à 100% !` : `Readjust your subjects' coef, their sum isn't equal to 100%!`;
                        color = bad;
                    }
                    else if (totalCoefRealGrades == 0) {
                        if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont simulées, tu n'as pas encore de notes !` 
                                : `All your grades are simulated, you don't have any grades yet!`
                            ;
                            color = meh;
                        }
                        else {
                            advice = this.lang == "fr" ? `Pas encore de notes` : `No grades yet`;
                            color = unknown;
                        }
                    }
                    else if (totalCoefRealGrades < 100) {
                        if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `${Math.round(10000*totalCoefEnabledSimGrades/totalCoefEnabledGrades)/100}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
                                : `${Math.round(10000*totalCoefEnabledSimGrades/totalCoefEnabledGrades)/100}% of your grades is simulated, all your grades aren't out yet!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefEnabledSimGrades == 0) {
                            advice = this.lang == "fr" ? `Toutes tes notes ne sont encore pas là !` : `All your grades aren't out yet!`;
                            color = meh;
                        }
                    }
                    else if (totalCoefEnabledRealGrades > 100) {
                        advice = this.lang == "fr" ? `Trop de notes (erreur du côté de l'ECAM), désactive les notes en trop !` : `Too many grades (error on ECAM's side), turn off all irrelevant grades!`;
                        color = bad;
                    }
                    else if ((nbSubjectsBelow100 > 0 || nbSubjectsOver100 > 0) && nbEnabledSimGrades > 0) {
                        advice = this.lang == "fr" 
                            ? `Tes notes simulées faussent ta moyenne. Désactive/enlève-les !` 
                            : `Your simulated grades falsify your average. Disable/remove them!`
                        ;
                        color = bad;
                    }
                    else if (totalCoefRealGrades == 100) {
                        if (nbSubjectsBelow100 > 0 && nbSubjectsOver100 > 0) {
                            advice = this.lang == "fr"
                                ? `Trop de notes dans ${nbSubjectsOver100} matière${nbSubjectsOver100>1?`s`:``}, et notes manquantes dans ${nbSubjectsBelow100} matières${nbSubjectsBelow100>1?`s`:``} !`
                                : `Too many grades in ${nbSubjectsOver100} subject${nbSubjectsOver100>1?`s`:``}, and missing grades in ${nbSubjectsBelow100} subject${nbSubjectsBelow100>1?`s`:``}!`
                            ;
                            color = bad;
                        }
                        if (totalCoefEnabledRealGrades < 100) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là ! Réactive tes ${nbDisabledRealGrades} notes désactivées pour afficher ta vraie moyenne !` 
                                : `All your grades are out! Enable your ${nbDisabledRealGrades} disabled grades to display your actual average!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là, mais tu devrais enlever tes ${nbSimGrades} notes simulées !` 
                                : `All your grades are out, but you should remove your ${nbSimGrades} simulated grades!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là ! Tu peux enlever tes ${nbSimGrades} notes simulées !` 
                                : `All your grades are out! You may remove your ${nbSimGrades} simulated grades!`
                            ;
                            color = good;
                        }
                    }

                    totalCoefValue.innerHTML = `${this.lang == "fr" ? "Coef Total des Matières :" : "Total Subjects Coef:"} <span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}% / ${totalCoefSubjects}%</span>`;
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
                    
                    
                    let advice = this.lang == `fr` ? `Toutes tes notes sont là !` : `All your grades are out!`;
                    let color = ` #10b981`;

                    if (totalCoefRealGrades == 0) {
                        if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont simulées, tu n'as pas encore de notes !` 
                                : `All your grades are simulated, you don't have any grades yet!`
                            ;
                            color = meh;
                        }
                        else {
                            advice = this.lang == "fr" ? `Pas encore de notes` : `No grades yet`;
                            color = unknown;
                        }
                    }
                    else if (totalCoefRealGrades < 100) {
                        if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `${totalCoefEnabledSimGrades}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
                                : `${totalCoefEnabledSimGrades}% of your grades is simulated, all your grades aren't out yet!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefEnabledSimGrades == 0) {
                            advice = this.lang == "fr" ? `Toutes tes notes ne sont encore pas là !` : `All your grades aren't out yet!`;
                            color = meh;
                        }
                    }
                    else if (totalCoefEnabledRealGrades > 100) {
                        advice = this.lang == "fr" 
                            ? `Trop de notes (erreur du côté de l'ECAM), désactive les notes en trop !` 
                            : `Too many grades (error on ECAM's side), turn off all irrelevant grades!`
                        ;
                        color = bad;
                    }
                    else if (totalCoefRealGrades == 100) {
                        if (totalCoefEnabledRealGrades < 100) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là ! Réactive tes ${nbDisabledRealGrades} notes désactivées pour afficher ta vraie moyenne !` 
                                : `All your grades are out! Enable your ${nbDisabledRealGrades} disabled grades to display your actual average!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefEnabledSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là, mais tu devrais enlever tes ${nbSimGrades} notes simulées !` 
                                : `All your grades are out, but you should remove your ${nbSimGrades} simulated grades!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefSimGrades > 0) {
                            advice = this.lang == "fr" 
                                ? `Toutes tes notes sont là ! Tu peux enlever tes ${nbSimGrades} notes simulées !` 
                                : `All your grades are out! You may remove your ${nbSimGrades} simulated grades!`
                            ;
                            color = good;
                        }
                    }
                    
                    totalCoefValue.innerHTML = `${this.lang == "fr" ? "Coef Total des Notes :" : "Total Grades Coef:"} <span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}%</span>`;
                    totalCoefDebug.innerHTML = `${advice}`;
                })
            }


            // MARK: getGradesDatas
            getGradesDatas({sem=undefined, module=undefined, subj=undefined}={sem: undefined, module: undefined, subj: undefined}) {
                // FOR EACH SEMESTER
                (sem && this.moduleConfig[sem] ? [sem] : Object.keys(this.semesters)).forEach((semX) => {
                    this.gradesDatas[semX] = {
                        "__#unclassified#__": {subjects: {}}
                    };
                    let semData = this.gradesDatas[semX];

                    
                    // FOR EACH UNCLASSIFIED SUBJECT IN SEMESTER
                    const unclassified = this.getUnclassifiedSubjects(semX);
                    if (unclassified.length > 0) {
                        (subj && unclassified.includes(subj) ? [subj] : unclassified).forEach(unclassifiedSubjectName => {

                            semData["__#unclassified#__"].subjects[unclassifiedSubjectName] = {};
                            const realGrades = Array(...(this.semesters[semX]||{})[unclassifiedSubjectName])||[];
                            const simGrades = this.sim?.[semX]?.["__#unclassified#__"]?.[unclassifiedSubjectName] || [];

                            let unclassifiedSubjectData = semData["__#unclassified#__"].subjects[unclassifiedSubjectName];
                            
                            unclassifiedSubjectData.subjName                    = unclassifiedSubjectName;
                            unclassifiedSubjectData.grades                      = (realGrades).concat(simGrades);
                            unclassifiedSubjectData.disabledRealGrades          = [];
                            unclassifiedSubjectData.simGrades                   = simGrades;
                            unclassifiedSubjectData.disabledSimGrades           = [];
                            unclassifiedSubjectData.average                     = 0;
                            unclassifiedSubjectData.classAvg                    = 0;
                            unclassifiedSubjectData.totalCoefGrades             = 0;
                            unclassifiedSubjectData.totalCoefRealGrades         = 0;
                            unclassifiedSubjectData.totalCoefSimGrades          = 0;
                            unclassifiedSubjectData.totalCoefEnabledGrades      = 0;
                            unclassifiedSubjectData.totalCoefEnabledRealGrades  = 0;
                            unclassifiedSubjectData.totalCoefEnabledSimGrades   = 0;



                            // FOR EACH GRADES AND SIM GRADES IN UNCLASSIFIED SUBJECT
                            (unclassifiedSubjectData.grades).forEach(grade => {
                                const gradeValue = parseFloat(grade.grade),
                                    classAvg = parseFloat(grade.classAvg),
                                    coef = parseInt(grade.coef)
                                ;

                                unclassifiedSubjectData.totalCoefGrades += grade.coef;

                                switch (`${this.gradeIsDisabled(grade) ? "disabled" : "enabled"} ${grade.__sim ? "sim" : "real"} grade`) {
                                    case `enabled real grade`:
                                        unclassifiedSubjectData.average                     += gradeValue*coef/100;
                                        unclassifiedSubjectData.classAvg                    += classAvg*coef/100;
                                        unclassifiedSubjectData.totalCoefRealGrades         += coef;

                                        unclassifiedSubjectData.totalCoefEnabledGrades      += coef;
                                        unclassifiedSubjectData.totalCoefEnabledRealGrades  += coef;
                                    break;

                                    case `disabled real grade`:
                                        unclassifiedSubjectData.classAvg                    += classAvg*coef/100;
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

                            
                            unclassifiedSubjectData.average                     = Math.round(100*unclassifiedSubjectData.average /(unclassifiedSubjectData.totalCoefEnabledGrades/100))/100;
                            unclassifiedSubjectData.classAvg                    = Math.round(100*unclassifiedSubjectData.classAvg/(unclassifiedSubjectData.totalCoefEnabledGrades/100))/100;
                            unclassifiedSubjectData.totalCoefGrades             = Math.round(unclassifiedSubjectData.totalCoefGrades);
                            unclassifiedSubjectData.totalCoefRealGrades         = Math.round(unclassifiedSubjectData.totalCoefRealGrades);
                            unclassifiedSubjectData.totalCoefSimGrades          = Math.round(unclassifiedSubjectData.totalCoefSimGrades);
                            unclassifiedSubjectData.totalCoefEnabledGrades      = Math.round(unclassifiedSubjectData.totalCoefEnabledGrades);
                            unclassifiedSubjectData.totalCoefEnabledRealGrades  = Math.round(unclassifiedSubjectData.totalCoefEnabledRealGrades);
                            unclassifiedSubjectData.totalCoefEnabledSimGrades   = Math.round(unclassifiedSubjectData.totalCoefEnabledSimGrades);
                        })
                    }


                    // FOR EACH MODULE IN SEMESTER (if any)
                    if (this.moduleConfig?.[semX]?.__modules__) {
                        (module && this.moduleConfig?.[sem]?.__modules__.includes(module) ? [module] : this.moduleConfig[semX].__modules__).forEach((moduleName) => {
                            const allSubjs = this.getAllSubjectsForModule(semX, moduleName);
                            const moduleGrades = this.calculateModuleGrades(semX, moduleName);

                            semData[moduleName] = {};
                            
                            let moduleData = semData[moduleName];
                            
                            moduleData.moduleName                   = moduleName;
                            moduleData.subjects                     = {};
                            moduleData.nbGrades                     = 0;
                            moduleData.simGrades                    = [];
                            moduleData.disabledRealGrades           = [];
                            moduleData.disabledSimGrades            = [];
                            moduleData.subjectsBelow100             = [];
                            moduleData.subjectsOver100              = [];
                            moduleData.subjectsReallyBelow100       = [];
                            moduleData.subjectsReallyOver100        = [];
                            moduleData.subjectsNoGrade              = [];
                            moduleData.coefSubjectsNoGrade          = 0;
                            moduleData.average                      = 0;
                            moduleData.classAvg                     = 0;
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
                                subjectData.grades.push(n);
                                moduleData.nbGrades++;
                            });

                            

                            // FOR EACH SUBJECT IN MODULE
                            (subj && this.moduleConfig?.[sem]?.[module]?.subjects?.includes(subj) ? [subj] : allSubjs).forEach(subjectName => {

                                let subjectData = moduleData.subjects[subjectName];

                                subjectData.subjName                    = subjectName;
                                subjectData.coef                        = this.moduleConfig[semX][moduleName].coefficients[subjectName];
                                subjectData.isCustom                    = true;
                                subjectData.disabledRealGrades          = [];
                                subjectData.simGrades                   = [];
                                subjectData.disabledSimGrades           = [];
                                subjectData.average                     = 0;
                                subjectData.classAvg                    = 0;
                                subjectData.totalCoefGrades             = 0;
                                subjectData.totalCoefRealGrades         = 0;
                                subjectData.totalCoefSimGrades          = 0;
                                subjectData.totalCoefEnabledGrades      = 0;
                                subjectData.totalCoefEnabledRealGrades  = 0;
                                subjectData.totalCoefEnabledSimGrades   = 0;
                                

                                moduleData.totalCoefSubjects += parseInt(subjectData.coef);
                                
                                
                                // FOR EACH GRADE IN SUBJECT
                                subjectData.grades.forEach(grade => {
                                    const gradeValue = parseFloat(grade.grade),
                                        classAvg = parseFloat(grade.classAvg),
                                        coef = parseInt(grade.coef),
                                        subjCoef = parseInt(subjectData.coef)
                                    ;
                                    
                                    subjectData.totalCoefGrades += grade.coef;
                                    subjectData.isCustom = false;

                                    switch (`${this.gradeIsDisabled(grade) ? "disabled" : "enabled"} ${grade.__sim ? "sim" : "real"} grade`) {
                                        case `enabled real grade`:
                                            subjectData.classAvg                    += classAvg*coef/100;
                                            subjectData.totalCoefRealGrades         += coef;

                                            subjectData.average                     += gradeValue*coef/100;
                                            subjectData.totalCoefEnabledGrades      += coef;
                                            subjectData.totalCoefEnabledRealGrades  += coef;


                                            moduleData.totalCoefGrades              += coef*subjCoef/100;
                                            moduleData.totalCoefRealGrades          += coef*subjCoef/100;

                                            moduleData.totalCoefEnabledGrades       += coef*subjCoef/100;
                                            moduleData.totalCoefEnabledRealGrades   += coef*subjCoef/100;
                                        break;

                                        case `disabled real grade`:
                                            subjectData.classAvg                    += classAvg*coef/100;
                                            subjectData.totalCoefRealGrades         += coef;
                                            subjectData.disabledRealGrades.push(grade);

                                            moduleData.totalCoefGrades              += coef*subjCoef/100;
                                            moduleData.totalCoefRealGrades          += coef*subjCoef/100;

                                            moduleData.disabledRealGrades.push(grade);
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
                                        break;

                                        case `disabled sim grade`:
                                            subjectData.simGrades.push(grade);
                                            subjectData.totalCoefSimGrades          += coef;
                                            subjectData.disabledSimGrades.push(grade);

                                            moduleData.simGrades.push(grade);
                                            moduleData.totalCoefGrades              += coef*subjCoef/100;
                                            moduleData.totalCoefSimGrades           += coef*subjCoef/100;

                                            moduleData.disabledSimGrades.push(grade);
                                        break;
                                    }
                                })
                                
                                
                                
                                if (subjectData.totalCoefEnabledGrades == 0) {
                                    subjectData.average  = " - ";
                                    subjectData.classAvg = " - ";
                                    moduleData.subjectsNoGrade.push(subjectName);
                                    moduleData.coefSubjectsNoGrade += parseInt(subjectData.coef);
                                }
                                else {
                                    subjectData.average     =  Math.round(100*subjectData.average /(subjectData.totalCoefEnabledGrades/100))/100;
                                    subjectData.classAvg    =  Math.round(100*subjectData.classAvg/(subjectData.totalCoefEnabledGrades/100))/100;

                                    moduleData.average          += subjectData.average *subjectData.coef/100;
                                    moduleData.classAvg         += subjectData.classAvg*subjectData.coef/100;
                                }

                                subjectData.totalCoefGrades             = Math.round(subjectData.totalCoefGrades);
                                subjectData.totalCoefRealGrades         = Math.round(subjectData.totalCoefRealGrades);
                                subjectData.totalCoefSimGrades          = Math.round(subjectData.totalCoefSimGrades);
                                subjectData.totalCoefEnabledGrades      = Math.round(subjectData.totalCoefEnabledGrades);
                                subjectData.totalCoefEnabledRealGrades  = Math.round(subjectData.totalCoefEnabledRealGrades);
                                subjectData.totalCoefEnabledSimGrades   = Math.round(subjectData.totalCoefEnabledSimGrades);


                                if      (subjectData.totalCoefGrades < 100) moduleData.subjectsBelow100.push(subjectName);
                                else if (subjectData.totalCoefGrades > 100) moduleData.subjectsOver100 .push(subjectName);

                                if      (subjectData.totalCoefRealGrades < 100) moduleData.subjectsReallyBelow100.push(subjectName);
                                else if (subjectData.totalCoefRealGrades > 100) moduleData.subjectsReallyOver100 .push(subjectName);
                            });


                            if (moduleData.subjectsNoGrade.length == Object.keys(moduleData.subjects).length) {
                                moduleData.average  = " - ";
                                moduleData.classAvg = " - ";
                            }

                            if (!isNaN(Number(moduleData.average))) {
                                moduleData.average  =  Math.round(100*moduleData.average /((moduleData.totalCoefSubjects-moduleData.coefSubjectsNoGrade)/100))/100;
                                moduleData.classAvg =  Math.round(100*moduleData.classAvg/((moduleData.totalCoefSubjects-moduleData.coefSubjectsNoGrade)/100))/100;
                            }

                            if (isNaN(Number(moduleData.average))) {
                                moduleData.average  = " - ";
                                moduleData.classAvg = " - ";
                            } 
                            

                            moduleData.totalCoefSubjects                =  Math.round(moduleData.totalCoefSubjects);
                            moduleData.totalCoefGrades                  =  Math.round(moduleData.totalCoefGrades);
                            moduleData.totalCoefRealGrades              =  Math.round(moduleData.totalCoefRealGrades);
                            moduleData.totalCoefSimGrades               =  Math.round(moduleData.totalCoefSimGrades);
                            moduleData.totalCoefEnabledGrades           =  Math.round(moduleData.totalCoefEnabledGrades);
                            moduleData.totalCoefEnabledRealGrades       =  Math.round(moduleData.totalCoefEnabledRealGrades);
                            moduleData.totalCoefEnabledSimGrades        =  Math.round(moduleData.totalCoefEnabledSimGrades);
                            
                        })
                    }
                    
                })
            }

        //#endregion






        //#region -REGION: Online methods

            /** Shows/Hides/Toggles the loading symbol when called depending on the argument `show`.
             * Default call: `this.showLoadingSymbol()`
             * 
             * @param {Boolean} show Optional, accepts true, false or nothing, to respectively show, hide or toggle the loading symbol
             */
            async showLoadingSymbol(show=undefined) {
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
                    const newDateTimeOfLastConfigFetchValidUntil = this.dateTimeSlice(dateTimeOfLastConfigFetchValidUntil, 10);
    
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
                                localStorage.setItem("ECAM_DASHBOARD_ONLINE_CONFIGS", JSON.stringify(this.onlineConfigs));
                                this.showLoadingSymbol(false);
                                this.openOnlineCfgPicker();
                            };
                        }})
                    }
                }
                else {
                    // If the validity date and time isn't passed yet, don't send a request and open the online picker menu using the online configs from memory
                    this.openOnlineCfgPicker();
                }
                
                
            }

            async autoUpdateCheck() {
                const dateTimeOfLastUpdate = this.dateTimeOfLastUpdateCheck;
                const dateTimeOfLastUpdateValidity = this.dateTimeSlice(dateTimeOfLastUpdate, 20);

                if (dateTimeOfLastUpdateValidity < this.now() || this.isUpdateAvailable) {
                    this.runUpdateCheck();
                    this.isUpdateAvailable = true;
                    localStorage.setItem("ECAM_DASHBOARD_IS_UPDATE_AVAILABLE", this.isUpdateAvailable);
                }
            }

            async runUpdateCheck() {
                const xhttp = new XMLHttpRequest(); 
                xhttp.open("GET", this.repoScriptRaw, true); 
                xhttp.send(); 
                xhttp.onload = () => {
                    const scriptGitVersion = xhttp.response.match(/\/\/ @version( +)(\d+(\.\d+|\.|)+)/)[2];
                    
                    if (scriptGitVersion > this.scriptVersion) {
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
                        ${this.lang == "fr" ? "NOUVELLE MISE À JOUR DU DASHBOARD DISPONIBLE !" : "NEW DASHBOARD UPDATE AVAILABLE!"}
                    </div>
                    <div class="update-available-notif-btns">
                        <div style="display: flex; justify-content: center; width: 50%">
                            <a class="update-btn" id="updateBtn" href="${this.repoScriptRaw}" target="_blank">${this.lang == "fr" ? "INSTALLER" : "INSTALL"}</a>
                        </div>
                        <div style="display: flex; justify-content: center; width: 50%">
                            <div class="dismiss-update-btn" id="dismissUpdateBtn" title="${this.lang == "fr" ? "Ignorer pour aujourd'hui" : "Ignore for today"}">${this.lang == "fr" ? "Ignorer" : "Ignore"}</div>
                        </div>
                    </div>
                `;

                document.querySelector(".ecam-dash").insertBefore(updateAvailableNotif, document.querySelector(".dash-header"));
                setTimeout(() => {updateAvailableNotif.classList.add("on")}, 300);
                updateAvailableNotif.querySelector(".dismiss-update-btn").onclick = () => {
                    this.dateTimeOfLastUpdateCheck = this.now(); 
                    localStorage.setItem("ECAM_DASHBOARD_DATE_TIME_OF_LAST_UPDATE_CHECK", this.dateTimeOfLastUpdateCheck);
                    this.isUpdateAvailable = false;

                    updateAvailableNotif.classList.remove("on");
                    setTimeout(() => {updateAvailableNotif.remove()}, 300)
                };
                updateAvailableNotif.querySelector(".update-btn").onclick = () => {
                    const reloadRequest = document.createElement("div");
                    reloadRequest.className = "online-cfg-picker-menu";
                    reloadRequest.style.cursor = "pointer";
                    reloadRequest.style.justifyContent = "space-evenly";
                    reloadRequest.style.textAlign = "center";
                    reloadRequest.style.fontSize = "50px";
                    reloadRequest.style.fontWeight = "100";
                    reloadRequest.style.textEmphasisStyle = '" "';
                    reloadRequest.style.width  = "100%";
                    reloadRequest.style.height = "100%";
                    reloadRequest.style.outline = '60px solid white';
                    reloadRequest.title = this.lang == "fr" ? "Rafraichir" : "Reload";
                    reloadRequest.innerHTML = this.lang == "fr" 
                        ? `<div>Clique sur l'écran pour rafraichir la page et appliquer la mise à jour !</div>
                        <div>Utilisateurs de MAC, copiez le script qui s'est ouvert et collez-le dans votre extension à la place de l'ancien script</div>`
                        : `<div>Click on the screen to reload the page and apply the update!</div>
                        <div>MAC users, copy the script that opened up and paste it in your extension to replace the old script</div>`;
                    document.querySelector(".ecam-dash").appendChild(reloadRequest);
                    setTimeout(() => {reloadRequest.classList.add("show");}, 10)
                    reloadRequest.onclick = () => {window.location.reload();};
                };
            }
            
        //#endregion






        //#region -REGION: Render




        
            // MARK: -createDashboard
            createDashboard() {
                const container = document.createElement("div");
                container.className = "ecam-dash";
                const moyenneGenerale = this.moyennePonderee(this.grades);
                const totalGrades = this.grades.length;
                const moduleStats = this.getModuleStats();

                document.querySelector(".site-breadcrumbs").remove();
                document.querySelector(".portlet-topper").remove();

                // Creating the content of the dashboard that doesn't vary along with the user's actions besides the language selection.
                // Therefore, besides the text that doesn't vary with the language, the text isn't yet created, 
                // but will be in the generateContent() method later on, to regenerate the text in case the language is changed
                container.innerHTML = `
                <div id="emptyDiv"></div>
                <div class="currently-loading">
                    <div class="loading-symbol" style="--offset-offset: calc(0 * 100% / 6)"></div>
                    <div class="loading-symbol" style="--offset-offset: calc(1 * 100% / 6)"></div>
                    <div class="loading-symbol" style="--offset-offset: calc(2 * 100% / 6)"></div>
                    <div class="loading-symbol" style="--offset-offset: calc(3 * 100% / 6)"></div>
                    <div class="loading-symbol" style="--offset-offset: calc(4 * 100% / 6)"></div>
                    <div class="loading-symbol" style="--offset-offset: calc(5 * 100% / 6)"></div>
                </div>
                <div class="dash-header">
                    <div style="display: flex;flex-direction: row;" id="aui_3_2_0_1305">
                        <img draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/5/51/ECAM-LaSalle-bleu-seul.png" alt="ECAM Logo" style="margin: 0px 0px 0px -10px;height: 141px;width: 148px;" id="aui_3_2_0_1304">
                        <div style="margin: 30px 0px 0px 0px;">
                            <div class="dash-title"></div>
                            <p class="dash-subtitle"></p>
                            <div style="display: flex; gap: 2px">
                                <div class="lang-btn active" id="fr-lang-btn">
                                    <img style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇫🇷" src="${`
                                        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACTUExURUdwTAAkjM7Pzs7OzrMGE74QIMPEx4hTeAAkjQARewAagbIFEgAfhc3NzdDQ0M7PzrYMG8zMzbcMG8EXKcUbLQAMd7UKGLUKGMMWJ7OhrcMVJv///+oPIO4bLgAmoOwWKAAZmQArpO8iNgAfnQATlAIyqLUGFAEoksUSIwAYhgANePnCyMbO6djY2NUWJ+7u7sCep4f8c74AAAAbdFJOUwDL+z19ffsVe3qU1jy51pA+bLyNc+Vrnu+m2KjIWToAAALxSURBVFjD7djJcuIwEIDhAAMOxuwTCAnyKgxOxg7v/3SjtraWDJKTUw60K1Vc+OqX5APK09NjHvOLJxDz3a+t9Mcoeg7DgZrDcrkejUZBL2X7NuYfo4gRZ2MmNZvhYjEHz1EYrHab18tl3LaEEonFnOPT5KtWM1zMhReY27DabUG5ABQ8cyXLTnIy9pz+vcN8seFWPRxC32G7Hf+FGW/3m7fXVmkagJ5NpGXYCOjd5Or6ejGmaRpCctJw6HTqOgaEvM8GT07ynP0RXhTbSqcIzWduDWOIgHBRJqmeELkJtQB34v4QUUs7o8MSC4t7FYECkF2UKYW9Sb2KRI8FqVWB06OI4KJSQRnuyXoUiW0mHUj2iPFAJEdOoiGVE/OV+SCxqLxTpI+LT+GGcE8Cj4AypAiqcEDyrPTSFHSS25zxnMIH6W2GnsQsitVGM8sBEf36AAOOASkDHg+EcuyiWLw+TAHGCdk5EqrOKqhQjgfCJ8ahPxxCx1W0K0tdUG4qCJKrAoMXpd4i7BwFpM+rkJNmbijh7w+xIHRanPFAiXx/khuQ7mFM6i9CzFFAlQiSDHPcRQneoCM8uqhA29NOfB/Sr48MUkWF3uY0bVfmgqyF6aIKHVcqgpxFMETlGHtkrMoDdXKYVMqlqRxhUReUmBuNiro9KXVCcllcOaoiq4emlPaAOJMoaCogHdNSXgg7GEqRRL1FR709FqRzKO0PdYt0D6X+IrWqTlGnh9LzPYgk1rIQlKogqqj70NHYZgR9VN0eJ2Ttj1GkT6udygN1BhVR/vQp6m6RUYRzfl5k1lSeItfSOFBVH3KqCfw8vwPZTRddhAgx1+GE3T6GdW2CN4oYU5Y7gITy8jIIwymfMDzM54tJOy1XC86E2G0GlHKzCxjUIoNwGtmXqGA0Wi+X0uPgVd1DhFGWs/0KvjgFhSGOyyl4su9aGjPbcAWglzDqdd9k99L1ennYzMRs9tvdaqW/GkXfvAbL+/NT8PhXwmN+7/wHgdqiCaxyTNQAAAAASUVORK5CYII=
                                    `}">
                                </div>
                                <div class="lang-btn " id="en-lang-btn">
                                    <img style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇬🇧" src="${`
                                            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAECUExURUdwTL6/w7pOXQcmd3aItpsCC7IaMURBdgAKW8rJy7QIJtPS0gIUZgASY7h7hZ4BDgADTwMofAASYxEka8/KywATZby0uQgda6gFGbpoc6QTIgAHVgAdcrC0v56jsszMzKkCFk1djU1Yg32Prv///8sBGNMHJs8CHdQLLAAegwATeNEDIAAujwAKZtYRMgANa9YgPAAoiP79/cQAEeZ9i+vt89Xc6wEKXPn3+N9vfhg/lOmKlwImfPPKzwIZb83U5fvu8AADTdtGXN9YaoydwxcwgfK8w11zrPfV2UNfovnh5Nk0TOycp7jD2t3d3TFLk6iz0fCttqsBEr0OLcy5vMWboL7jb4MAAAAkdFJOUwD+/X39/3kQfoH+/ShvJ4HW15JNuady6j+76b+/7/FQt331fQrzi9EAAAaxSURBVFjD7Zhpe6JYE4bd2mVMJz0TJ1t30t3zIiIkigjIIkoDsrihifn/f+WtOueAmjhz9XybD/1ovEyE26eqTp0lhcIv/dJ/VzXQWY3oX913fr5HnF1+/OPPL78zffnzj/LHy7Pzn+HVbi5uGwz4tdWqWOPxYHys3+9btxfVm5t/4NXOq9/uSjsE1b62muv1urmJrMHgkTxRCJoVm+ZvoLtvt42ry7Ozo4ghCWeXjVbp+bm0azYK51etNUozFGMaWY+HGlhTzXx5QZTZvJ9dX3+BiOvlj6ByHfJwfV3ZIcdZA6haMl8doHCKwnHGJjnAAEhXVKEnCC8v5ro4m+Tq9+HZf5oFu9Jw6MUcAb28yJ4auhyVHlgZBkRBIMFWpla32x2L4h6XrhxPkoCjrB++E5AsL/zlXCEkZZWZgjxlIEGwOd3qDsgjU6SHC8LhuOKsDqEtZLkHLC9DaRVr8EgfWWgZCCmM9BhoW1mSfOAoWjqqFxrN3Vb1ZIQBipAMMEUrR0CCkDnaY7rpyrV7Eu/jHVr0BKD/BStNmW/NBUQg+6FBMxU9Dvah5Y5yzCDSY5+XBNUlHBFB5bGVVFaa4agEZcY0vMA6cCTsHRFZgYbp6dmMw0BQHysJdCMmqMXSpTlPGYhHDn8IiqauDemRlwrj7EFY6YpuOKa8N6VHp0Fgx4GwJM/hMs4RiKDcrYemtgat3mMG4nPQAC5CO4I5p98m7kHjfCyngTa35Z4gq+QqI0gIiOdzULIyQrQjL8l3TRPCEUdHjrBfyYUwFnwH41emGoB4PnOEX6SCHZ5+zK1SkYEm5b0jK4mCYDM1ONdxnNCh44BDkEAdJRDVEoolyaRa0JgW41jRQ4OCoGorHTuXKX9DQCDJ5jTdDX1hb0cLBgjpzqKN3mwiaJAEU+3g3iPtQZxrL4DDhgekuSsO0qSy0Q1OaRavCuVko9HGmMfh1lZVE6Sq9nLrxHNXUVQpAxlzJ9wu6djgtE0F8qDTBLivpSr02lqBa0Lb92AQYT/wPB3MPXnh+aqXOzo2nf/iOrb3/OGi0FivsdOg6LSpiDC/pOoS+YGHH8auYbyJX3HBgNdrDwloZ6IVMnvlKJ5xmKBSPPozMeIQiho7GKUNd/Lt9rDdRhBMbD3G6b2xk7nBJ1Gn05F4AScvCKDTJgwUcVT97YXZEU7akY4FrDZT/uYtKDOUYagb9rrnEB1S2sMD0GF6hKPcvLHDIJ09Bkk56DDLp5Jz6KZ95Idw2h9yUGaGZhIH1InkUDfv/WBoVQIiww+qy4oLtcXiqr4Hw+sYw0hHfoZtufTaQBDY8O0Q+uHNcDNc6BqvwzBYp3dBIQWWxGaRgHw7dt/3fda01IxnYgtJxyQB1ujtnDVttfRKKYY2XW2CDZuHYggyxmsYSEV/dDibPggaG9p6Tm/VHv4qs6bVVkGUWoNuotNG3C6gKRYwgSlqm8SlUrPKu9kG9jBBOvqBK+1a20TpgM7sZEZRYlOAZlhsXZjrTJoZ9eRkpemrSjLrP/1AULFCKV3RCkhc7lKG9Mr2XMPJH0GQlwxkwCwcQ0qN6WYTRMls0n8CIej7bMJW4nRFzDs+2JHVWNuk4myKoDZxpOnk4xAXLN8xNmkfGYRDQOXJhC58ND1gp9Ph8cKkK2Yg4miabNgXQdVh/tej8VOmQ1BE0gNbA7CzdKcwI4sMRCoOoNk4INe4tgDDxwth0zJ+BxoQjgJbA7QDWwi6zlBQm4H6YjQleQo9MCWYobaqzPIclfsIIuUyMCwwPU264mlQn+UREgCDmjcdQw/SydMIQXUEEY6rCh3JC7VgJoqnQZBeGp5CM4WuXLBFxhGCSFxzk+/w5lyPuuLfg2A7S8PDMTvEVoNtnqE9RN8RRDm+1IGdU74MH4GGWWjgqT+jbaTArgRRQ+ja191Vof6UICf2pM5iq1UO7Ij9U47QFGsAJVYpavjhrlqop0X4I9kwO2y3k3MYCKevQ1Afck57W4ltEiDOkN/voWmdBUwUzirts3Exwhe4IQ/tEISfjSt6ttBuTfkZQdC0XAzY0q4yGb3V5H5deibm9yDaFqOUbRkUY717Ld2Rtd8hB5zK9afPcGSp45GlDkeWz58/ja4fiqUPoOdnU1uNn6gbanvUh02Zoa2bRVDrqoYbduS06Cmq8OYUddW4/XaHqFLxAYbdkd0fo78ekHLf+Ir3NXalu29VONnV/vZkd3NTvbhtPVz/eCdANb6yU+jV7cXNT503zy8vP2LEn5ggD3BWrZ061v7s6blGjpK1X/9K+KX/sP4PsW55UIo2Nb0AAAAASUVORK5CYII=
                                    `}">
                                </div>
                                <div id="langShortcut" style="display: flex; align-content: center; justify-content: center; align-items: center; padding-left: 9px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="header-actions" style="display:flex; align-items:center">

                        <div class="over-header-btns">
                            <div class="over-header-report-btns">
                                <div    class="over-header-btn issue mail-info    ${this.lang == "fr" ? "fr" : "en"}">
                                    <div class="over-header-btn-mail-info-text"></div>
                                    <div class="over-header-btn-copied-cue"></div>
                                </div>
                                <a      class="over-header-btn issue share-config ${this.lang == "fr" ? "fr" : "en"}" href="${this.repoUserConfigShare    }" target="_blank" tabindex="-1"></a>
                                <a      class="over-header-btn issue suggest-idea ${this.lang == "fr" ? "fr" : "en"}" href="${this.repoUserSuggestionIssue}" target="_blank" tabindex="-1"></a>
                                <a      class="over-header-btn issue report-issue ${this.lang == "fr" ? "fr" : "en"}" href="${this.repoUserReportIssue    }" target="_blank" tabindex="-1"></a>
                                <button class="over-header-btn issue issue-btn" id="reportIssueBtn" tabindex="0">🚩</button>
                            </div>
                            <div class="over-header-help-btns">
                                <div class="over-header-btn how-to-use-btn">?</div>
                                <div class="over-header-how-to-use-btns">
                                    <a   class="over-header-btn issue doc-btn"  href="${this.repoReadMeHowToUse}" target="_blank" ></a>
                                    <div class="over-header-btn issue tuto-btn"></div>
                                </div>
                                <div class="new-user-notif" style="top: 60px; right: -7px; --hoverAmp: 15px; animation: hoveringElem 3s infinite ease-in-out;" hidden>
                                    <svg viewBox="0 0 2 1" style="position: absolute; bottom: 69px; right: 14px; width: 28px; height: 14px;">
                                        <polyline fill="white" stroke="none" points="0,1 1,0 2,1"></polyline>
                                    </svg>
                                    <svg viewBox="0 0 2 1" style="position: absolute; bottom: 69px; right: 14px; width: 28px; height: 14px;">
                                        <polyline fill="#00037b" stroke="none" points="0.2,1 1,0.2 1.8,1"></polyline>
                                    </svg>
                                    <div class="new-user-notif-text"></div>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-edit-mode ${this.editMode ? "on" : "off"}" id="editModeBtn"></button>
                        <div style="display: flex; flex-direction: column; gap: 8px">
                            <div class="btn btn-export" id="exportBtn"></div>
                            <div class="btn btn-import" id="importBtn"></div>
                            <div class="import-menu" id="importMenu" style="display: none">
                                <svg viewBox="0 0 2 1" style="position: absolute; bottom: 60px; right: 11px; width: 28px; height: 14px;">
                                    <polyline fill="white" stroke="none" points="0,1 1,0 2,1"></polyline>
                                </svg>
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
                
                <div class="main-average-card" id="main-average-card">
                    <div class="average-display">
                        <div class="average-number">${moyenneGenerale}</div>
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
                        <div class="new-grades-card-title ${this.newGrades.length == 0 ? "none" : ""}"></div>
                        <div style="display:flex; font-size: 15px; font-weight: 600; color: #2A2F72" ${this.newGrades.length == 0 ? "hidden='true' disabled='true'" : ""}>
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
                            <div style="padding: 0px 5px 0px 8px; font-size: 14px; font-weight: 500"></div>
                            <button class="view-btn ${this.defView == "detailed" ? "active" : ""}" id="view-btn-detailed" data-view="detailed">📊</button>
                            <button class="view-btn ${this.defView == "compact"  ? "active" : ""}" id="view-btn-compact"  data-view="compact" >📋</button>
                        </div>
                        <div class="fold-toggle"></div>
                    </div>
                </div>

                <div class="scroll-field up${this.selectedSubjectCardsId.length > 0 ? " show" : ""}"${document.body.classList.contains("lfr-dockbar-pinned") ? ` style="transform: translateY(45px)"` : ""}></div>

                <div class="drop-field remove-from-module${this.selectedSubjectCardsId.length > 0 ? " show" : ""}">
                    <div class="drop-field-remove-from-module-text top${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-remove-from-module-minus">-</div>
                    <div class="drop-field-remove-from-module-text bottom${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-remove-from-module-hitbox"></div>
                </div>

                <div class="content-area" id="contentArea"></div>

                <div class="drop-field create-module ${this.lang == "fr" ? "fr" : "en"}${this.selectedSubjectCardsId.length > 0 ? " show" : ""}">
                    <div class="drop-field-create-module-text top ${this.lang == "fr" ? "fr" : "en"}"></div>
                    <div class="drop-field-create-module-plus">+</div>
                    <div class="drop-field-create-module-text bottom ${this.lang == "fr" ? "fr" : "en"}"></div>
                    <div class="drop-field-create-module-hitbox"></div>
                </div>

                <div class="scroll-field down${this.selectedSubjectCardsId.length > 0 ? " show" : ""}"></div>

                <div class="intranet-fold">
                    <div class="intranet-text">
                        <div class="intranet-toggle fold-icon">△</div>
                        <div class="semester-name"> 
                            <div class="intranet-subtext"></div>
                        </div>
                        <div class="intranet-toggle fold-icon">△</div>
                    </div>
                </div>
                `;

                const notifContainer = document.createElement("div");
                notifContainer.className = "selected-subject-card-notif-container";

                const originalTable = document.querySelector("table.greyGridTable");
                if (!originalTable) return;
                originalTable.parentNode.insertBefore(container, originalTable);
                container.insertBefore(notifContainer, container.querySelector("dash-header"));
                originalTable.style.display = "none";

                this.generateContent();
            }


            // MARK: renderRecentGrades
            renderRecentGrades() {
                const newGradesCard = document.querySelector(".new-grades-card");
                const grades = {};
                
                if (this.newGrades.length > 0) {

                    // ordering the new grades per subjects
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


            //MARK: language Sensitive
            languageSensitiveContent(fadeIn=true) {
                // Language Sensitive text in the Dashboard Header and Semester filter tab (which don't refresh on calling the generateContent() method)
                const dashTitle = document.querySelector(".dash-title");
                const dashSubtitle = document.querySelector(".dash-subtitle");
                dashTitle.innerHTML = this.lang == "fr" ? 'Tableau de Bord des Notes ECAM ' + this.scriptVersion : "ECAM Grades Dashboard " + this.scriptVersion;
                dashSubtitle.innerHTML = this.lang == "fr" ? 'Vue complète de vos résultats académiques !' : "Complete view of your academic results!";

                const langShortcutText = document.getElementById("langShortcut");
                langShortcutText.innerHTML = this.lang == "fr" ? "(Maj+L)" : "(Shift+L)";

                const reportIssueBtn    = document.querySelector(".issue.issue-btn");
                const mailInfo          = document.querySelector(".issue.mail-info");
                const mailInfoText      = document.querySelector(".over-header-btn-mail-info-text");
                const mailInfoCopied    = document.querySelector(".over-header-btn-copied-cue");
                const shareConfig       = document.querySelector(".issue.share-config");
                const suggestIdea       = document.querySelector(".issue.suggest-idea");
                const reportIssue       = document.querySelector(".issue.report-issue");
                const helpMenu          = document.querySelector(".over-header-btn.how-to-use-btn");
                const docBtn            = document.querySelector(".over-header-btn.doc-btn");
                const tutoBtn           = document.querySelector(".over-header-btn.tuto-btn");
                const newUserNotif      = document.querySelector(".new-user-notif");
                const newUserNotifText  = document.querySelector(".new-user-notif-text");
                if (this.lang == "fr") {
                    reportIssueBtn  .title     = "Signaler...";
                    mailInfo        .title     = "Clique pour copier l'adresse email";
                    shareConfig     .title     = "Partage une configuration sur mon GitHub";
                    suggestIdea     .title     = "Suggère une idée sur mon GitHub";
                    reportIssue     .title     = "Signale un problème sur mon GitHub";
                    helpMenu        .title     = "Comment s'en servir?";
                    docBtn          .title     = "Aller vers la documentation";
                    tutoBtn         .title     = "Démarrer le tutoriel";
                    newUserNotif    .title     = "Clique pour fermer";
                    shareConfig     .innerHTML = "Partager une config\u2197";
                    suggestIdea     .innerHTML = "Suggérer une idée\u2197";
                    reportIssue     .innerHTML = "Signaler un problème\u2197";
                    mailInfoText    .innerHTML = "Par mail: baptiste.jacquin@ecam.fr 📋";
                    mailInfoCopied  .innerHTML = "Copié !";
                    docBtn          .innerHTML = "Voir documentation\u2197";
                    tutoBtn         .innerHTML = "Démarrer tutoriel ▶︎";
                    newUserNotifText.innerHTML = "Bonjour! Nouveau ici? Clique ici pour apprendre à utiliser cette extension!";
                    mailInfo   .classList.replace("en", "fr");
                    shareConfig.classList.replace("en", "fr");
                    suggestIdea.classList.replace("en", "fr");
                    reportIssue.classList.replace("en", "fr");
                }
                else {
                    reportIssueBtn  .title     = "Report...";
                    mailInfo        .title     = "Click to copy the email adress";
                    shareConfig     .title     = "Share a configuration on my GitHub";
                    suggestIdea     .title     = "Suggest an idea on my GitHub";
                    reportIssue     .title     = "Report an issue on my GitHub";
                    helpMenu        .title     = "How to use?";
                    docBtn          .title     = "Go to the documentation";
                    tutoBtn         .title     = "Start the tutorial";
                    newUserNotif    .title     = "Click to dismiss";
                    shareConfig     .innerHTML = "Share a config\u2197";
                    suggestIdea     .innerHTML = "Suggest an idea\u2197";
                    reportIssue     .innerHTML = "Report an issue\u2197";
                    mailInfoText    .innerHTML = "By mail: baptiste.jacquin@ecam.fr 📋";
                    mailInfoCopied  .innerHTML = "Copied!";
                    docBtn          .innerHTML = "See documentation\u2197";
                    tutoBtn         .innerHTML = "Start tutorial ▶︎";
                    newUserNotifText.innerHTML = "Hey! New here? Click here to find a tutorial on how to use this extension!";
                    mailInfo   .classList.replace("fr", "en");
                    shareConfig.classList.replace("fr", "en");
                    suggestIdea.classList.replace("fr", "en");
                    reportIssue.classList.replace("fr", "en");
                }
                
                const importBtn = document.getElementById("importBtn");
                const editModeBtn = document.getElementById("editModeBtn");
                const exportBtn = document.getElementById("exportBtn");
                importBtn.innerHTML =   `${this.lang == "fr" ? "Importer Config": "Import Config"}<span class="btn-icon">⬇️</span>`;
                editModeBtn.innerHTML = `<div style="display:flex; flex-direction:column; gap:3px"><span style="font-size:40px">🖊️</span><div>${this.lang == "fr" ? "Mode Édition" : "Edit Mode"}</div><div>${this.lang == "fr" ? "(Maj+E)" : "(Shift+E)"}</div></div>`;
                if (this.editMode) {editModeBtn.classList.add('on')}
                else    {editModeBtn.classList.remove('on')}
                exportBtn.innerHTML =   `${this.lang == "fr" ? "Exporter Config": "Export Config"}<span class="btn-icon">⬆️</span>`;
                
                const importMenu    = document.getElementById("importMenu");
                const importFile    = importMenu.querySelector(".import-menu-btn.file");
                const importClear  = importMenu.querySelector(".import-menu-btn.clear");
                const importOnline  = importMenu.querySelector(".import-menu-btn.online");

                importFile.children[0].innerHTML   = this.lang == "fr" ? "Importer un fichier de configuration .json"   : "Import a .json configuration file";
                importClear.innerHTML              = this.lang == "fr" ? "Effacer Config" : "Clear Config";
                importClear.title                  = this.lang == "fr" ? "Clique ici pour effacer ta configuration actuelle" : "Click here to clear your current configuration";
                importOnline.children[1].innerHTML = this.lang == "fr" ? "Obtenir un fichier de configuration en ligne" : "Get a configuration file online";


                if (this.lang == "fr") {
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
                const avgLabel   = document.querySelector(".average-label");
                avgLabel.innerHTML   = `/20 ${this.lang == "fr" ? "Moyenne Générale" : "Global Average"}`;

                const statLabelsArray = document.querySelectorAll(".stat-label");
                statLabelsArray[0].innerHTML = this.lang == "fr" ? "Notes" : "Grades";
                statLabelsArray[1].innerHTML = this.lang == "fr" ? "Semestres" : "Semesters";
                statLabelsArray[2].innerHTML = this.lang == "fr" ? "Modules Validés" : "Validated module";

                const allFilterTabs = document.querySelectorAll(`.filter-tab`);
                allFilterTabs.forEach(tab => {
                    if (tab.dataset.filter == "all") {tab.innerHTML = this.lang == "fr" ? `Tous` : `All`}
                    tab.title = this.lang == "fr" ? `Appuye sur Maj+Flèche Droite/Gauche` : `Press Shift+Left/Right Arrow`;
                })

                document.querySelector(`.view-toggle`).children[0].innerHTML = this.lang == "fr" ? `Basculer le mode d'affichage (Maj+D)` : `Toggle display mode (Shift+D)`;
                document.querySelector(`.fold-toggle`).innerHTML = this.lang == "fr" ? `Plier tous les modules (Maj+F)` : `Fold every module (Shift+F)`;
                const viewBtnsArray = document.querySelectorAll(".view-btn");
                viewBtnsArray[0].title = this.lang == "fr" ? "Vue détaillée" : "Detailed view";
                viewBtnsArray[1].title = this.lang == "fr" ? "Vue compacte" : "Compact view";

                const intranetSubtext = document.querySelector(".intranet-subtext");
                intranetSubtext.innerHTML = this.lang == "fr" ? "Afficher le tableau des notes d'Espace ECAM" : "Show ECAM Intranet's Grades Table";

                const updateNotif = document.querySelector(".update-available-notif-header");
                if (updateNotif) {
                    updateNotif.innerHTML = this.lang == "fr" ? "NOUVELLE MISE À JOUR DU DASHBOARD DISPONIBLE !" : "NEW DASHBOARD UPDATE AVAILABLE!";
                    updateNotif.querySelector(".update-available-notif-btns").children[0].innerHTML = this.lang == "fr" ? "INSTALLER" : "INSTALL";
                    updateNotif.querySelector(".update-available-notif-btns").children[1].innerHTML = this.lang == "fr" ? "Ignorer" : "Ignore";
                    updateNotif.querySelector(".update-available-notif-btns").children[1].title     = this.lang == "fr" ? "Ignorer pour aujourd'hui" : "Ignore for today";
                }

                if (document.querySelector(".new-grades-card").children.length > 1) {document.querySelector(".new-grades-card").children[1].remove()}
                document.querySelector(".new-grades-card-title").innerHTML = `
                    ${this.newGrades.length > 0 
                        ? `${this.lang == "fr" 
                            ? `Nouvelle${this.newGrades.length > 1 ? "s" : ""} Note${this.newGrades.length > 1 ? "s" : ""} !` 
                            : `New Grade${this.newGrades.length > 1 ? "s" : ""}!`
                        }` 
                        : `${this.lang == "fr" 
                            ? `Pas de nouvelle note` 
                            : `No new grade`
                        }` 
                    }
                `;
                document.querySelector(".new-grades-mark-as-read-text").innerHTML = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";
                document.querySelector(".new-grades-mark-as-read").title = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";
                

                let highestWidth = 0;
                document.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {
                    notifDiv.childNodes[4].data = this.lang == "fr" ? `est sélectionné!` : `is selected!`;
                })

                if (fadeIn) {
                    document.querySelector(".ecam-dash").parentElement.classList.add("fade-in");

                    clearTimeout(this?.timeouts?.renderFadeIn);
                    this.timeouts.renderFadeIn = setTimeout(() => {document.querySelector(".ecam-dash").parentElement.classList.remove("fade-in")}, 300);
                }

                this.attachAllEventListeners();
            }


            // MARK: generateContent
            generateContent(fadeIn=true) {

                if (fadeIn == "big") {this.languageSensitiveContent(true);}
                else {this.languageSensitiveContent(false);}
                
                
                // Call renderRecentGrades to... well... render the recent grades' card
                this.renderRecentGrades()


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
                    section.className = `semester-section`;
                    const moyenneSem    = Object.keys(this.semesters[sem]).length > 0 ? this.moyennePonderee([].concat(...Object.values(this.semesters[sem] || {}))) : " - ";
                    const avgClass      = Object.keys(this.semesters[sem]).length > 0 ? this.getAverageColor(moyenneSem) : "";
                    const unclassified  = this.getUnclassifiedSubjects(sem);
                    section.innerHTML = `
                    <div class="semester-header" data-semester="${sem}">
                        <div class="semester-info">
                            <div class="semester-name">📚 ${this.lang == "fr" ? 'Semestre' : "Semester"} ${sem}</div>
                                <div class="semester-average ${avgClass}">
                                    <span>${moyenneSem==" - " ? "" : `${moyenneSem >= 10 ? '✅' : '⚠️'}`}</span>
                                    <span>${moyenneSem}/20</span>
                                </div>
                            </div>
                        <div class="semester-toggle open fold-icon">△</div>
                    </div>`;
                    section.innerHTML += `
                    <div class="semester-content show${this.selectedSubjectCardsId.length > 0 ? " dragging" : ""}${this.editMode ? " edit" : ""}${fadeIn ? " fade-in" : ""}" id="sem-content-${sem}">
                        <div class="semester-grid">
                            <div class="modules-section ${this.editMode ? "edit" : ""}" id="modules-section">
                                ${this.createAllModuleCards(sem)}
                            </div>
                            <div class="unclassified-section" id="unclassified-section" style="height: 100%${unclassified.length > 0 ? `` : `; display: none`}">
                                <div class="unclassified-title">
                                    ${this.lang == "fr" ? `Matière${unclassified.length > 1 ?  `s` : ``} non classée${unclassified.length > 1 ?  `s` : ``} dans un module` : `Subject${unclassified.length > 1 ?  `s` : ``} not classified in a module`}
                                </div>
                                <div class="unclassified-content">
                                    ${unclassified.length > 0 
                                        ? `<div style="margin: -10px 0px"></div>${this.createAllSubjCards(sem, "__#unclassified#__")}<div style="margin: -10px 0px"></div>` 
                                        : ``
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    contentArea.appendChild(section);

                    this.resizeUnclassifiedSection();

                    this.foldedModuleCardsId.forEach(foldedModuleCardId => {
                        const moduleCardToFold = document.getElementById(foldedModuleCardId);
                        if (moduleCardToFold) {
                            this.foldModuleCard(moduleCardToFold.querySelector(`.module-header`));
                        }
                    })

                    this.setGradesTableTotalCoef();
                    this.attachAllEventListeners();
                });
            }




            // MARK: createModuleCard
            createAllModuleCards(sem) {
                const moduleConfig = this.moduleConfig?.[sem] || {};

                let html =  this.editMode ? this.createDropFieldInsertionField("module", {sem, index:0}) : "";

                moduleConfig?.__modules__?.forEach((moduleName, moduleIndex) => {
                    html += this.createModuleCard(sem, moduleName, moduleIndex);
                    html += this.editMode ? this.createDropFieldInsertionField("module", {sem, index:moduleIndex+1}) : "";
                });

                return html;
            }
            createModuleCard(sem, moduleName, moduleIndex=-1) {
                const moduleGrades = this.calculateModuleGrades(sem, moduleName);
                const includedGrades = (moduleGrades || []).filter(n => !this.gradeIsDisabled(n));
                let weight = 0; includedGrades.forEach(grade => {weight += grade.coef/100})
                const moyenne       = this.gradesDatas[sem][moduleName].average;
                const hasSim        = this.gradesDatas[sem][moduleName].simGrades.length > 0 ? true : false;
                const hasDisabled   = this.gradesDatas[sem][moduleName].disabledSimGrades.length + this.gradesDatas[sem][moduleName].disabledRealGrades.length > 0 ? true : false;

                let html = `
                <div class="module-card ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}" id="module-card-${moduleName}-in-semester-${sem}" data-semester="${sem}" data-module="${moduleName}" data-index="${moduleIndex}">
                
                    <div class="module-header ${this.editMode ? "edit-mode" : ""} ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}" id="module-header-${moduleName}-in-semester${sem}" data-semester="${sem}" data-module="${moduleName}" ${this.editMode ? `draggable="true"` : ""}>
                        ${this.editMode 
                            ? 
                            `<div style="display: flex; align-items: center; justify-content: flex-start; width: 42%;">
                                <div style="margin-right: 5px; margin-bottom: 3px;">${this.draggableIcon("module-card", {height: 29, type: "module", targetId: `module-card-${moduleName}-in-semester-${sem}`})}</div>
                                <input type="text" class="module-title input any-input" id="module-title-input-${sem}-${moduleName}" value="${moduleName}" data-semester="${sem}" data-module="${moduleName}" draggable="false"/>
                                <div class="module-title-state">
                                </div>
                            </div>` 
                            : 
                            `<div class="module-title">${moduleName}</div>`
                        }
                        <div class="module-subject-total-coef-div" data-semester="${sem}" data-module="${moduleName}">
                            <div class="module-subject-total-coef-value">${this.lang == "fr" ? `Coef Total des matières :` : `Total Subjects Coef:`}</div>
                            <div class="module-subject-total-coef-debug"></div>
                        </div>
                        <div class="module-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}" data-semester="${sem}" data-module="${moduleName}" ${this.editMode ? "" : 'style="width:151px"'}>
                            ${moyenne}/20 
                            <div class="module-toggle fold-icon open">△</div>
                            <button class="module-delete-btn" ${this.editMode ? `class="display:none"` : ""} id="module-delete-btn-${moduleName}-in-semester-${sem}" title="${this.lang == "fr" ? "Supprimer ce module" : "Delete this module"}" data-semester="${sem}" data-module="${moduleName}"${this.editMode? "" : " hidden"}>🗑️</button>
                        </div>
                    </div>
                    
                    <div class="module-info">
                        ${hasDisabled 
                            ? 
                            `<div class="module-info-bar">
                                <div style="font-weight: 700; font-size: 15px;">${this.lang == "fr" ? "Inclus des notes désactivées" : "Includes disabled grades"}</div>
                                <div class="module-info-clear disabled" data-semester="${sem}" data-module="${moduleName}">${this.lang == "fr" ? "Activer toutes ces notes" : "Enable all the grades"}</div>
                            </div>` 
                            : ``
                        }
                        ${hasSim 
                            ? 
                            `<div class="module-info-bar">
                                <div style="font-weight: 700; font-size: 15px;">${this.lang == "fr" ? "Inclus des notes simulées" : "Includes simulated grades"}</div>
                                <div class="module-info-clear sim" data-semester="${sem}" data-module="${moduleName}">${this.lang == "fr" ? "Effacer toutes ces notes simulées" : "Erase all the simulated grades"}</div>
                            </div>` 
                            : ``
                        }
                    </div>
                    
                    <div class="module-card-content ${this.editMode ? "edit-mode": ""}">
                    <div class="module-details ${this.editMode ? "edit-mode": ""}${this.viewMode == "detailed" ? " detailed" :  " compact"}" id="module-details-${moduleName}-in-semester${sem}">
                        ${this.createAllSubjCards(sem, moduleName)}
                    </div>
                    </div>
                    
                    </div>
                `;
                    
                return html
            }
            

            
            // MARK: Create Subject Card
            /** 
             * Call this method to create all subject cards of a module.
             * 
             * Detects automatically from the name of the moduleName and from `this.gradesDatas` (as a safe guard, also from `this.moduleConfig`) if the card is classified or unclassified, 
             * and detects automatically from this.compactSubjCardsId if the card is detailed or compact.
             * 
             * @param {number | string} sem Number of the semester of the subject
             * @param {string} moduleName Name of the subject's module
             */
            createAllSubjCards(sem, moduleName) {
                const moduleData = this.gradesDatas[sem][moduleName];
                
                let html  = this.editMode && moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined 
                        ? this.createDropFieldInsertionField("subject", {sem, moduleName, index:0}) 
                        : ""
                ;

                Object.values(moduleData.subjects).forEach((_value, _index) => {
                    html += this.createSubjCard(sem, moduleName, _value.subjName, _index);
                    html += this.editMode && moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined 
                        ? this.createDropFieldInsertionField("subject", {sem, moduleName, index:_index+1}) 
                        : ""
                    ;
                })

                return html;
            }
            /** 
             * Call this method to create a subject card. 
             * 
             * Detects automatically from the name of the moduleName and from `this.gradesDatas` (to error-proof the moduleName, also from `this.moduleConfig`) if the card is classified or unclassified, 
             * and detects automatically from this.compactSubjCardsId if the card is detailed or compact.
             * 
             * @param {number | string} sem Number of the semester of the subject
             * @param {string} moduleName Name of the subject's module
             * @param {string} subject Name of the subject
             * @param {number} [index=-1] Default: -1 — Index of the subject in its module, necessary if the subject is classified, useless if the subject is unclassified
             */
            createSubjCard(sem, moduleName, subject, index=-1) {
                const moduleData            = this.gradesDatas[sem][moduleName];
                const subjectData           = moduleData.subjects[subject];
                const subjectGrades         = subjectData.grades;
                const moduleMoy             = moduleData.average;
                const subjAvg               = subjectData?.average >= 0 ? subjectData.average : " - ";
                const pct                   = subjectData.coef;
                const isCustom              = subjectData.isCustom;
                const nbGrades              = subjectGrades.length;
                const includedGradesLength  = nbGrades - subjectData.disabledRealGrades.length - subjectData.disabledSimGrades.length;
                const nbSimGrades           = subjectData.simGrades.length;
                const nbRealGrades          = nbGrades - nbSimGrades;
                const classified            = moduleName != "__#unclassified#__" && this.moduleConfig[sem]?.[moduleName] != undefined;
                const detailed              = !this.compactSubjCardsId.includes(`subject-card-semester-${sem}-subject-${subject}`);
                
                let html = `
                <div class="subject-card ${classified ? "classified" : "unclassified"} ${detailed ? "detailed" : "compact"} ${this.editMode ? "" : "edit-mode"} ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`}" id="subject-card-semester-${sem}-subject-${subject}" ${this.editMode ? `style="cursor: grab; user-select: none;"` : ""} data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}" data-custom="${isCustom}" data-index="${index}">
                    <div class="subject-card-header${detailed ? "" : " compact"} ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`} ${classified ? "classified" : "unclassified"}" ${this.editMode ? `style="cursor: grab;" draggable="true"` : `${nbGrades > 0 ? `` : `style="border-radius: 20px; border: none"`}`} data-module="${moduleName}">
                        <div style="display:flex; align-items:center; gap:8px; padding-left: ${this.editMode ? "11px" : "53px"}; width:38.8%; min-width: 275px">
                            ${this.editMode
                                ? `<div style="margin: 0px 5px; margin-bottom: 3px;">
                                ${this.selectedSubjectCardsId.includes(`subject-card-semester-${sem}-subject-${subject}`) 
                                    ? `<div class="tick-icon for-${detailed ? "detailed" : "compact"}-subject-card" data-type="${detailed ? "detailed" : "compact"}" data-targetid="subject-card-semester-${sem}-subject-${subject}">✔</div>`
                                    : this.draggableIcon(`${detailed ? "detailed" : "compact"}-subject-card`, {type:`${detailed ? "detailed" : "compact"}`, targetId:`subject-card-semester-${sem}-subject-${subject}`}) 
                                }</div>`
                                : ""
                            }
                            <div style="width: 87%">
                                ${isCustom 
                                    ? `<input type="text" class="subject-name input any-input" id="subject-name-input-semester-${sem}-subject-${subject}" value="${subject}"/>`
                                    : `<div class="subject-name">${subject}</div>`
                                }
                                <div style="font-size: 13px; color: #666;">
                                    ${classified 
                                        ? ` ${this.lang == "fr" 
                                                ? "Poids dans module: " 
                                                : "Weight in module: "
                                            }
                                            ${this.editMode 
                                                ? `<input class="subject-coef-input-box any-input" id="subject-coef-input-box-semester-${sem}-subject-${subject}" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                                : `<span style="font-weight: 800">${pct}%</span>`
                                            }
                                        ` 
                                        : ""
                                    }
                                    ${!detailed 
                                        ? ` ${classified ? "• " : ""}
                                            ${nbGrades===0 
                                                ? `${this.lang == "fr" ? "aucune note publiée" : "no published grade"}` 
                                                : `${nbGrades} ${this.lang == "fr" ? `note${nbGrades>1?"s":""} au total` : `grade${nbGrades>1?"s":""} total`}`
                                            }
                                            ${nbGrades>0 
                                                ? ` • <span ${includedGradesLength<nbGrades ? `style="color: #df0000"` : ``}>
                                                    <span style="font-weight: 700; ">${includedGradesLength}/${nbGrades}</span> 
                                                    ${this.lang == "fr" ? `note${includedGradesLength>1?"s":""} activée${includedGradesLength>1?"s":""}` : `grade${includedGradesLength>1?"s":""} enabled`}${includedGradesLength<nbGrades ? `!` : ``}
                                                </span>` 
                                                : ``
                                            }
                                            ${nbSimGrades>0 
                                                ? ` • ${nbSimGrades} ${this.lang == "fr" ? `note${nbSimGrades>1?"s":""} simulée${nbSimGrades>1?"s":""}` : `simulated grade${nbSimGrades>1?"s":""}`}`
                                                : ``
                                            }
                                        `
                                        : ""
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="subject-total-coef-div" data-semester="${sem}" data-module="${moduleName}" data-subject="${subject}">
                            <div class="subject-total-coef-value"></div>
                            <div class="subject-total-coef-debug">${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}</div>
                        </div>
                        <div class="subj-moyenne ${subjAvg == " - " ? '' : `${subjAvg>=10 ? 'good' : 'bad'}`}" style="display: flex; justify-content: flex-end; width: 80px; padding-right: 20px; font-size: 20px">
                            ${subjAvg}/20
                        </div>
                    </div>

                `;
                
                if (detailed) {
                    html += `

                    <table class="grades-table ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${moduleMoy < 10 ? `meh` : `good`}` : `${moduleMoy >= 10 ? `meh` : `bad`}`}`}" style="${this.editMode ? `user-select: text;` : ``}" id="grades-table-${subject}-semester${sem}" data-subject="${subject}">

                        <thead>
                            <tr>
                                <th class="grades-table-type" style="padding-left: 30px; border-left-width: 0px;">
                                    ${this.lang == "fr" ? "Intitulé" : "Title"}
                                </th>
                                <th class="grades-table-grade">
                                    ${this.lang == "fr" ? "Note" : "Grade"}
                                </th>
                                <th class="grades-table-coef">
                                    ${this.lang == "fr" ? "Coef" : "Coef"}
                                </th>
                                <th class="grades-table-classAvg">
                                    ${this.lang == "fr" ? "Moy. Classe" : "Class Avg"}
                                </th>
                                <th class="grades-table-date">
                                    ${this.lang == "fr" ? "Date" : "Date"}
                                </th>
                                <th class="grades-table-teacher" style="border-right-width: 0px;${this.selectedSubjectCardsId.length > 0 ? " display: none;" : ""}">
                                    ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                </th>
                                <th class="grades-table-add-sim-cell" style="border-right-width: 0px; border-left-width: 0px;">
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
                                <td class="grades-table-type" style="display: flex; align-items: center; gap: 6px; width: auto">
                                    <input type="checkbox" class="grade-checkbox any-input" id="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}" data-semester="${sem}" data-subj="${subject}" data-module="${moduleName||''}" data-prof="${grade.prof}" data-gradeid="${grade.type + " " + grade.date + " " + grade.prof}" ${gradeIsSim ? `data-simtimestamp="${grade.id}"` : ""} ${!this.gradeIsDisabled(grade) ? "checked" : ""}></input>
                                    ${gradeIsSim
                                        ? `<input class="grade-type simulated-grade-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="simulated-grade-input-type-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" data-modifType="type" data-simid="${nbSimGrades-1}" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" value="${grade.type}"/>` 
                                        : `<label class="grade-type" style="width: auto"  id="grade-type-${grade.type}-${grade.date}" for="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}">${grade.type || ''}${gradeIsSim ? ` • ${this.lang == "fr" ? "Simulée" : "Simulated"}` : ''}</label>`
                                    }
                                </td>
                                <td class="grade-value grade-${gradeClass} grades-table-grade" data-sim="${gradeIsSim}">
                                    ${gradeIsSim
                                        ? `<input class="simulated-grade-input-edit sim-inp-grade any-input" style="width: 100%; max-width: 75px;" id="simulated-grade-input-grade-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" type="number" step="0.5" min="0" max="20" data-simid="${nbSimGrades-1}" data-modifType="grade" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" style="width:75px; height:25px" value="${grade.grade}"> /20`
                                        : `${grade.grade}/20`
                                    }
                                </td>
                                <td class="grades-table-coef" data-sim="${gradeIsSim}">
                                    ${gradeIsSim
                                        ? `<input class="simulated-grade-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="simulated-grade-input-coef-for-${subject}-from-${moduleName}-in-semester${sem}-${grade.type}" type="number" step="5" min="0" max="100" data-simid="${nbSimGrades-1}" data-modifType="coef" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-module="${moduleName||''}" style="width:60px; height:25px"value="${grade.coef}"> %`
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
                                        <div style="width: 140px">${this.lang == "fr" ? "Ajouter une note simulée: " : "Add a simulated grade: "}</div>
                                        <input class="simulated-grade-input sim-inp-type any-input" id="simulated-grade-input-type-for-${subject}-from-${moduleName}-in-semester${sem}" data-semester="${sem}" data-subj="${subject}" placeholder="${this.lang == "fr" ? "Titre" : "Title"}" />
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
                                    <button class="btn-export sim-add-btn" data-semester="${sem}" data-subj="${subject}" data-module="${moduleName||''}">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    `;
                }

                html += `
                </div>
                `;

                return html;
            }


            // MARK: Regenerate subject and module averages and total coef debug texts
            regenAveragesAndTotalCoefs(sem, moduleName, subject) {

                // subject average modification
                if (subject) {
                    const subjAvg = this.gradesDatas[sem][moduleName||"__#unclassified#__"].subjects[subject].average;
                    const subjAvgSpan = document.querySelector(`.subject-card[data-subject="${subject}"]`).querySelector(".subj-moyenne");
                    subjAvgSpan.innerHTML = subjAvg + "/20";
                    subjAvgSpan.classList.remove("good"); subjAvgSpan.classList.remove("bad");
                    if (subjAvg >= 10) {
                        subjAvgSpan.classList.add("good"); 
                    }
                    else {
                        subjAvgSpan.classList.add("bad");
                    }
                }
                
                // module average modification
                if (moduleName != "__#unclassified#__") {
                    const moduleAvg     = this.gradesDatas[sem][moduleName].average;
                    const moduleCard    = document.querySelector(`.module-card[data-module="${moduleName}"]`);
                    const moduleAvgDiv  = moduleCard.querySelector(`.module-moyenne[data-module="${moduleName}"]`);
                    moduleAvgDiv.childNodes[0].data = moduleAvg + "/20";
                    moduleAvgDiv.classList.remove("good"); moduleAvgDiv.classList.remove("bad"); moduleAvgDiv.classList.remove("unknown");
                    if (moduleAvg == " - ") {
                        moduleAvgDiv.classList.add("unknown");
                    }
                    else if (moduleAvg >= 10) {
                        moduleAvgDiv.classList.add("good");
                    }
                    else {
                        moduleAvgDiv.classList.add("bad");
                    }

                    this.setGradesTableTotalCoef(moduleCard);
                }
                else if (subject) {
                    const subjCard = document.querySelector(`.subject-card[data-semester="${sem}"][data-subject="${subject}"]`);
                    this.setGradesTableTotalCoef(subjCard);
                }

            }


            firstLoadEvent() {
                if (this.firstLoad) {
                    const newUserNotif = document.querySelector(".new-user-notif");
                    newUserNotif.hidden = false;
                    newUserNotif.onclick = () => {
                        newUserNotif.style.animationPlayState = "paused";
                        newUserNotif.style.top = `${newUserNotif.getBoundingClientRect().top - newUserNotif.getBoundingClientRect().height - 10}px`;
                        newUserNotif.style.opacity = "0%";
                        setTimeout(() => {newUserNotif.remove();}, 300);
                    }
                }
            }

            startTutorial() {

            }
            

        //#endregion






        //#region -REGION: General Events

            attachAllEventListeners() {
                this.attachDocumentMouseListeners();
                this.attachAllAnyInputsListeners();
                
                this.attachLangBtnsListener();
                this.attachIssuesBtnsMouseListeners();
                this.attachEditModeListener();
                this.attachImportBtnListener();
                this.attachExportBtnListener();
                
                this.attachNewGradesNotifListener();
                this.attachNewGradesMarkAsReadBtnListener();
                this.attachNewGradesSubjectCardsListener();
                
                this.attachFilterSemesterListener();
                this.attachViewModeBtnsListener();
                this.attachFoldToggleBtnListener();
                
                this.attachAllSubjectCardRelatedEvenListenersForEverySubjectCard();

                this.attachModuleInfoClearBtns();
                this.attachAllModuleDeleteBtnsListener();

                if (this.editMode) {this.attachAllOnDragEventListeners();} else {this.detachOnDragEventListeners();}
            }



            //#region -Attach Event Listeners





                //#region Document listeners
                    attachDocumentMouseListeners(eventName="all") {
                        if (eventName == "onclick" || eventName == "all") {
                            document.onclick = (e) => {
                                // Toggle semesters
                                if (e.target.closest('.semester-header')) {
                                    const header = e.target.closest('.semester-header');
                                    const sem = header.dataset.semester;
                                    const content = document.getElementById(`sem-content-${sem}`);
                                    const toggle = header.querySelector('.semester-toggle');
                                    if (content.classList.contains('show')) {
                                        content.classList.remove('show'); toggle.classList.remove('open'); content.style.display = 'none';
                                    } else {
                                        content.classList.add('show'); toggle.classList.add('open'); content.style.display = 'flex';
                                    }
                                }

                                // Toggle intranet table
                                else if (e.target.closest('.intranet-fold')) {
                                    const header = e.target.closest('.intranet-fold');
                                    const intranetTable = document.querySelector('.greyGridTable');
                                    const intranetToggle = header.querySelectorAll('.intranet-toggle');
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

                                if (!e.target.closest(".import-menu") && document.getElementById("importMenu").classList.contains("show")) {
                                    document.getElementById("importMenu").classList.remove("show");

                                    clearTimeout(this?.timeouts?.closeImportMenu);
                                    this.timeouts.closeImportMenu = setTimeout(() => {document.getElementById("importMenu").style.display = "none"}, 300);
                                }

                                if (!e.target.closest(".over-header-btn")) {
                                    const issueBtn      = document.querySelector(".issue.issue-btn");
                                    const mailInfo      = document.querySelector(".issue.mail-info");
                                    const shareConfig   = document.querySelector(".issue.share-config");
                                    const suggestIdea   = document.querySelector(".issue.suggest-idea");
                                    const reportIssue   = document.querySelector(".issue.report-issue");
                                    const helpBtn       = document.querySelector(".over-header-btn.how-to-use-btn");
                                    const helpMenu      = document.querySelector(".over-header-how-to-use-btns");
                                    const docBtn        = document.querySelector(".over-header-btn.doc-btn");
                                    const tutoBtn       = document.querySelector(".over-header-btn.tuto-btn");

                                    issueBtn   .classList.remove("open");
                                    mailInfo   .classList.remove("open"); mailInfo   .tabIndex = "-1";
                                    shareConfig.classList.remove("open"); shareConfig.tabIndex = "-1";
                                    suggestIdea.classList.remove("open"); suggestIdea.tabIndex = "-1";
                                    reportIssue.classList.remove("open"); reportIssue.tabIndex = "-1";
                                    helpBtn    .classList.remove("open");
                                    helpMenu   .classList.remove("open");
                                    clearTimeout(this.timeouts?.openHelpMenu);
                                    this.timeouts.openHelpMenu = setTimeout(()=>{helpMenu.hidden = true;}, 200);
                                    docBtn     .tabIndex = "-1";
                                    tutoBtn    .tabIndex = "-1";
                                }
                            };
                        }
                        
                        if (eventName == "onmousedown" || eventName == "all") {
                            // Fold/Unfold modules
                            document.onmousedown = (e) => {
                                if (e.target.closest('.module-header') && !e.target.closest('.module-title.input, .module-delete-btn')) {
                                    this.moduleHeaderMouseUpNoMoveAction(e)
                                }
                                else if (e.target.closest('.subject-card-header, .subject-card.compact') && !e.target.closest('.any-input, .drag-icon, .tick-icon')) {
                                    this.subjHeaderMouseUpNoMoveAction(e)
                                }
                                else if (e.target.closest('.subject-card-header, .subject-card.compact') && !e.target.closest('.any-input, .drag-icon, .tick-icon')) {
                                    this.subjHeaderClickAction(e)
                                }
                            };
                        }

                    }
                    attachAllAnyInputsListeners() {
                        document.querySelectorAll(".any-input").forEach(input => {
                            this.attachAnyInputListeners(input)
                        })
                    }
                    attachAnyInputListeners(input) {
                        input.onfocus    = () =>  {this.generalKeyboardEvents("edit sim grade", input)}
                        input.onblur     = () =>  {this.generalKeyboardEvents("general")};
                        input.ondragover = (e) => {if (e.target.closest(".any-input")) {e.preventDefault(); e.dataTransfer.dropEffect = "none";}}
                        input.ondrop     = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "link";};
                        if (input.classList.contains("module-title")) {   // Change modules name
                            input.onmouseenter  = ( ) => { if (this.editMode) {this.detachOnDragEventListeners(); document.querySelectorAll(".module-header").forEach(card => {card.draggable = false});} }
                            input.onmouseleave  = ( ) => { if (this.editMode) {this.attachOnDragEventListeners(); document.querySelectorAll(".module-header").forEach(card => {card.draggable = true;});} }
                            input.onchange      = (e) => { this.moduleTitleInputChangeAction(e.target) };
                        }
                        else {
                            input.onmouseenter  = ( ) => { if (this.editMode) {this.detachOnDragEventListeners();} };
                            input.onmouseleave  = ( ) => { if (this.editMode) {this.attachOnDragEventListeners();} };
                        }
                    }
                //#endregion




                //#region Dashboard listeners
                    attachPinDockbarListener() {
                        document.querySelector(".pin-dockbar").children[0].children[0].onclick = () => {
                            // when clicking on the button to unpin the dockbar, this event listener is triggered before the action of unpinning the dockbar is actually done, 
                            // so the order might seem reverse logical but that's how it works
                            if (!document.body.classList.contains("lfr-dockbar-pinned")) {
                                this.pinDockbar = true;
                                document.querySelector(".scroll-field.up").style.transform = "translateY(45px)";
                            }
                            else {
                                this.pinDockbar = false;
                                document.querySelector(".scroll-field.up").style.transform = "";
                            }
                        }
                    }
                    

                    attachLangBtnsListener() {
                        // Change to English
                        document.getElementById('en-lang-btn').onclick = () => {
                            if (this.lang == "fr") {
                                this.lang = "en";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.remove('active')
                                document.getElementById('en-lang-btn').classList.add('active')
                                this.generateContent(false);
                            }
                        };

                        // Change to French
                        document.getElementById('fr-lang-btn').onclick = () => {
                            if (this.lang == "en") {
                                this.lang = "fr";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.add('active')
                                document.getElementById('en-lang-btn').classList.remove('active')
                                this.generateContent(false);
                            }
                        };
                    }


                    attachIssuesBtnsMouseListeners() {
                        const issueBtn      = document.querySelector(".issue.issue-btn");
                        const mailInfo      = document.querySelector(".issue.mail-info");
                        const shareConfig   = document.querySelector(".issue.share-config");
                        const suggestIdea   = document.querySelector(".issue.suggest-idea");
                        const reportIssue   = document.querySelector(".issue.report-issue");

                        const helpBtn       = document.querySelector(".over-header-btn.how-to-use-btn");
                        const helpMenu      = document.querySelector(".over-header-how-to-use-btns");
                        const docBtn        = document.querySelector(".over-header-btn.doc-btn");
                        const tutoBtn       = document.querySelector(".over-header-btn.tuto-btn");

                        issueBtn.onclick = () => {
                            if (reportIssue.classList.contains("open")) {
                                issueBtn   .classList.remove("open");
                                mailInfo   .classList.remove("open"); mailInfo   .tabIndex = "-1";
                                shareConfig.classList.remove("open"); shareConfig.tabIndex = "-1";
                                suggestIdea.classList.remove("open"); suggestIdea.tabIndex = "-1";
                                reportIssue.classList.remove("open"); reportIssue.tabIndex = "-1";
                            }
                            else {
                                issueBtn   .classList.add("open");
                                mailInfo   .classList.add("open"); mailInfo   .tabIndex = "0";
                                shareConfig.classList.add("open"); shareConfig.tabIndex = "0";
                                suggestIdea.classList.add("open"); suggestIdea.tabIndex = "0";
                                reportIssue.classList.add("open"); reportIssue.tabIndex = "0";
                            }
                        };

                        mailInfo.onclick = () => {
                            navigator.clipboard.writeText("baptiste.jacquin@ecam.fr");

                            const mailInfoText = document.querySelector(".over-header-btn-mail-info-text");
                            const mailInfoCopied = document.querySelector(".over-header-btn-copied-cue");
                            mailInfoText  .classList.add("lighten");
                            mailInfoCopied.classList.add("show");

                            mailInfoCopied.onanimationend = (e) => {
                                mailInfoText  .classList.remove("lighten");
                                mailInfoCopied.classList.remove("show");
                            }
                        }

                        helpBtn.onclick = () => {
                            if (helpBtn.classList.contains("open")) {
                                helpBtn .classList.remove("open");
                                helpMenu.classList.remove("open");
                                clearTimeout(this.timeouts?.openHelpMenu);
                                this.timeouts.openHelpMenu = setTimeout(()=>{helpMenu.hidden = true;}, 200);
                                docBtn  .tabIndex = "-1";
                                tutoBtn .tabIndex = "-1";
                            }
                            else {
                                helpBtn .classList.add("open");
                                helpMenu.hidden = false;
                                clearTimeout(this.timeouts?.openHelpMenu);
                                this.timeouts.openHelpMenu = setTimeout(()=>{helpMenu.classList.add("open");}, 10);
                                docBtn  .tabIndex = "0";
                                tutoBtn .tabIndex = "0";
                            }
                        }

                        tutoBtn.onclick = () => {
                            this.startTutorial();
                        }
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




                //#region New grades listeners
                    attachNewGradesNotifListener() {
                        document.querySelector(".new-grades-notif").onclick = (e) => {
                            if (!e.target.closest("#closeNewGradesNotif")) {
                                const newGradesCard = document.querySelector(".new-grades-card");
                                newGradesCard.scrollIntoView({behavior: "instant"});
                                newGradesCard.classList.add("myhighlight");
                                setTimeout(() => {newGradesCard.classList.remove("myhighlight")},200)
                            }
                            else {
                                document.querySelector(".new-grades-notif").classList.remove("on");
                                setTimeout(() => {document.querySelector(".new-grades-notif").remove();}, 500)
                            }
                        };
                    }
                    attachNewGradesMarkAsReadBtnListener() {
                        document.querySelector(".new-grades-mark-as-read").onclick = () => {
                            this.newGrades = [];
                            this.savedReadGrades = Array(...this.grades);
                            // this.grades.forEach(e => {this.savedReadGrades.push(e)})
                            this.saveReadGrades();

                            if (document.querySelector(".new-grades-card").children.length > 1) {
                                document.querySelector(".new-grades-card").children[1].remove()
                            }
                            document.querySelector(".new-grades-card").classList.add("none");
                            document.querySelector(".new-grades-card-header").classList.add("none");
                            document.querySelector(".new-grades-card-title").innerHTML = this.lang == "fr" ? `Pas de nouvelle note` : `No new grade`;
                            document.querySelector(".new-grades-card-title").classList.add("none");
                            document.querySelector(".new-grades-mark-as-read").parentElement.disabled = true;
                            document.querySelector(".new-grades-mark-as-read").parentElement.hidden = true;
                            document.querySelector(".new-grades-notif").classList.remove("on");
                            setTimeout(() => {document.querySelector(".new-grades-notif").remove();}, 500)

                            this.renderRecentGrades()
                            this.attachAllEventListeners()
                        };
                    }
                    attachNewGradesSubjectCardsListener() {
                        document.querySelectorAll(".new-grades-subject-card").forEach(card => {   // Scroll to the corresponding subject/grade on which the user clicked
                            card.onclick = e => {
                                this.currentSemester = e.target.dataset.semester;
                                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                                document.getElementById('filter-tab-semester-'+this.currentSemester).classList.add('active');
                                this.generateContent(false);
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);

                                const targetElem = document.getElementById(`subject-card-semester-${e.target.dataset.semester}-subject-${e.target.dataset.subject}`);
                                targetElem.scrollIntoView({behavior: "instant", block: "center"});
                                targetElem.onscrollend = ((elem) => {
                                    elem.classList.add("scroll-to");
                                    elem.onanimationend = () => {targetElem.classList.remove("scroll-to")}
                                })(targetElem);
                                
                            }
                        });
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
                                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);
                                    
                                    this.removeSubjectCardFromSubjectSelection();
                                    this.generateContent();
                                }
                            };
                        });
                    }
                    attachViewModeBtnsListener() {
                        document.querySelectorAll('.view-btn').forEach(btn => {
                            btn.onclick = (e) => {
                                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                                e.target.classList.add('active');
                                this.viewMode = e.target.dataset.view;
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE", this.viewMode);

                                this.foldedModuleCardsId = [];
                                document.querySelector(".fold-toggle").classList.remove("active");

                                this.generateContent();
                            };
                        });
                    }
                    attachFoldToggleBtnListener() {
                        document.querySelector(".fold-toggle").onclick = (e) => {
                            e.target.classList.toggle("active");
                            this.toggleFoldAllModuleCards();
                        }
                    }
                //#endregion




                //#region Selection Notifs listeners
                    attachNotifBtnsListener(notifDiv) {
                        if (notifDiv instanceof HTMLElement) {
                            this.attachNotifDelBtnListener(notifDiv.querySelector(".selected-subject-card-notif-div-del-btn"));
                            this.attachNotifScrollBtnListener(notifDiv.querySelector(".selected-subject-card-notif-div-scroll-btn"));
                        }
                        else {
                            document.querySelectorAll(".selected-subject-card-notif-div-del-btn").forEach(delBtn => {
                                this.attachNotifDelBtnListener(delBtn);
                            })
                            document.querySelectorAll(".selected-subject-card-notif-div-scroll-btn").forEach(scrollBtn => {
                                this.attachNotifScrollBtnListener(scrollBtn);
                            })
                        }
                    }
                    attachNotifDelBtnListener(delBtn) {
                        delBtn.onclick = (e) => {
                            const notifDiv = e.target.parentElement;
                            this.removeSubjectCardFromSubjectSelection({notifDiv});
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
                            simClear.onclick = () => {this.clearSimGrades(    simClear.dataset.semester, simClear.dataset.module);this.generateContent();}
                        });
                        document.querySelectorAll(".module-info-clear.disabled").forEach(disClear => {
                            disClear.onclick = () => {this.clearIgnoredGradesForModule(disClear.dataset.semester, disClear.dataset.module);this.generateContent();}
                        });
                    }
                    attachAllModuleDeleteBtnsListener() {
                        document.querySelectorAll(".module-delete-btn").forEach(btn => {
                            this.attachModuleDeleteBtnListener(btn);
                        })
                    }
                    attachModuleDeleteBtnListener(btn) {
                        btn.onclick = (e) => {this.moduleDeleteBtnAction(e.target)};
                    }
                //#endregion




                //#region Subject cards listeners

                    attachAllSubjectCardRelatedEvenListenersForEverySubjectCard(container=document) {
                        this.attachAndManageAllDragOrTickIconsListener(container);
                        this.attachAllSubjectCoefInputBoxesListeners(container);
                        this.attachCheckboxesListeners(container);
                        this.attachAllSubjectNameInputsListener(container);
                        this.attachAllSubjectSimAddBtnsListener(container);
                        this.attachAllSubjectSimDelBtnsListener(container);
                        this.attachAllSubjectSimInputEditsListener(container);
                    }

                    attachAllSubjectCardRelatedEventListeners(subjCard) {
                        const isClassified  = subjCard.classList.contains("classified");
                        const isDetailed    = subjCard.classList.contains("detailed");
                        const coefInputBox  = subjCard.querySelector(".subject-coef-input-box");
                        const nameInputBox  = subjCard.querySelector(".subject-name.input");
                        const simAddBtn     = subjCard.querySelector(".sim-add-btn");
                        const simDelBtn     = subjCard.querySelector(".sim-del-btn");

                        if (isClassified)   {this.attachCheckboxesListeners(subjCard);}
                        if (isDetailed)     {this.attachAllSubjectSimInputEditsListener(subjCard);}
                        if (coefInputBox)   {this.attachSubjectCoefInputBoxListeners(coefInputBox);}
                        if (nameInputBox)   {this.attachSubjectNameInputListener(nameInputBox);}
                        if (simAddBtn)      {this.attachSubjectSimAddBtnListener(simAddBtn);}
                        if (simDelBtn)      {this.attachSubjectSimDelBtnListener(simDelBtn);}
                        
                        this.attachDragOrTickIconsListener(subjCard);
                        this.attachSubjectCardOnDragEventListeners(subjCard);
                    }

                    /** Ensures all selected Subject Cards have a tick icon with their assigned event listeners instead of the default drag icon, and attach them the correct event listener */
                    attachAndManageAllDragOrTickIconsListener(container=document) {
                        // this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {
                        //     const subjectCard = container.getElementById(selectedSubjectCardId);
                        //     this.changeDragIconToTickIcon(subjectCard);
                        // })

                        container.querySelectorAll(".subject-card").forEach(subjCard => {
                            this.attachDragOrTickIconsListener(subjCard);
                        })
                    }
                    attachDragOrTickIconsListener(subjCard) {
                        if (subjCard.querySelector(".drag-icon")) {
                            const dragIcon = subjCard.querySelector(".drag-icon");
                            dragIcon.onclick = (e) => { this.dragIconOnClickEvent(e, dragIcon) };
                        }
                        else if (subjCard.querySelector(".tick-icon")) {
                            const tick = subjCard.querySelector(".tick-icon");
                            tick.onclick = (e) => { this.tickIconOnClickEvent(e, tick) };
                        }
                    }

                    attachAllSubjectCoefInputBoxesListeners(container=document) {
                        container.querySelectorAll(".subject-coef-input-box").forEach(inputBox => {
                            this.attachSubjectCoefInputBoxListeners(inputBox);
                        })
                    }
                    attachSubjectCoefInputBoxListeners(inputBox) {
                        inputBox.onchange = e => {
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

                    attachCheckboxesListeners(container=document) {
                        // Reusable method to attach listeners to grade checkboxes
                        container.querySelectorAll('.grade-checkbox').forEach(chbx => {
                            chbx.onclick = (e) => {
                                const semX = e.target.dataset.semester;
                                const module = e.target.dataset.module;
                                const subj = e.target.dataset.subj;
                                const simTimeStamp = e.target.dataset.simtimestamp;
                                const gradeId = e.target.dataset.gradeid;
                                const ignoredKey = [semX, subj, simTimeStamp || gradeId].join("\\");
                                if (e.target.checked) {
                                    // remove this specific ignored key if present
                                    this.disabledGrades = this.disabledGrades?.filter(id => id !== ignoredKey);
                                } else {
                                    // add ignored key if not already present
                                    if (!this.disabledGrades?.includes(ignoredKey)) this.disabledGrades.push(ignoredKey);
                                }
                                this.saveIgnoredGrades();
                                this.getGradesDatas();
                                document.querySelector(".average-number").innerHTML = this.moyennePonderee(this.grades);
                                // this.getGradesDatas({semX, module:undefined, subj});
                                // this.generateContent(false);
                                this.regenAveragesAndTotalCoefs(semX, module, subj)
                            }
                        });
                    }

                    attachAllSubjectNameInputsListener(container=document) {
                        container.querySelectorAll(".subject-name.input").forEach(input => {
                            this.attachSubjectNameInputListener(input);
                        })
                    }
                    attachSubjectNameInputListener(input) {
                        input.onchange = (e) => {this.subjectNameInputAction(e.target)};
                    }

                    attachAllSubjectSimAddBtnsListener(container=document) {
                        container.querySelectorAll('.sim-add-btn').forEach(btn=>{
                            this.attachSubjectSimAddBtnListener(btn);
                        });
                    }
                    attachSubjectSimAddBtnListener(btn) {
                        btn.onclick = (e) => {this.subjectSimAddBtnAction(e.target)};
                    }

                    attachAllSubjectSimDelBtnsListener(container=document) {
                        container.querySelectorAll('.sim-del-btn').forEach(btn=>{
                            this.attachSubjectSimDelBtnListener(btn)
                        })
                    }
                    attachSubjectSimDelBtnListener(btn) {
                        btn.onclick = (e) => {this.subjectSimDelBtnAction(e.target)};
                    }

                    attachAllSubjectSimInputEditsListener(container=document) {
                        container.querySelectorAll(".simulated-grade-input-edit").forEach(input => {
                            this.attachSubjectSimInputEditListener(input)
                        })
                    }
                    attachSubjectSimInputEditListener(input) {
                        input.onchange = (e) => {this.subjectSimInputEditAction(e.target)};
                    }
                    
                //#endregion


            //#endregion





            //#region -Events Action

                // MARK: -toggle module card folding
                /** Call this method to switch all Module cards' state between folded and unfolded 
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the folded module card ID's addition to/deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                toggleFoldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    document.querySelectorAll(".module-header").forEach(moduleHeader => {
                        this.toggleFoldModuleCard(moduleHeader, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
                    })
                }
                /** Call this method to switch a module card's state between folded and unfolded 
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the folded module card ID's addition to/deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                toggleFoldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    if (trigger?.classList?.contains("module-header") || (trigger?.target?.classList?.contains("module-header"))) {
                        const moduleHeader = trigger?.target || trigger;
                        if (moduleHeader.classList.contains("fold")) {
                            this.unfoldModuleCard(moduleHeader, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
                        }
                        else {
                            this.foldModuleCard(moduleHeader, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
                        }
                    }
                }


                // MARK: -fold module card
                /** Call this method to fold all module cards 
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the folded module card ID's addition to this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                foldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    document.querySelectorAll(".module-header").forEach(moduleHeader => {
                        this.foldModuleCard(moduleHeader, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
                    })
                }
                /** Call this method to fold a module card
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be hidden (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the folded module card ID's addition to this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                foldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    // testing if the trigger argument is an HTML of class module-card or an Event triggered by a module header or one of its elements
                    if (trigger?.classList?.contains("module-header") || (trigger?.target?.classList?.contains("module-header"))) {
                        // Identifying the moduleCard depending on whether the trigger argument is a module header or an event triggered by a module header
                        const moduleCard        = trigger?.target?.parentElement || trigger.parentElement;
                        const sem               = moduleCard.dataset.semester;
                        const module            = moduleCard.dataset.module;
                        const index             = moduleCard.dataset.index;
                        const moduleCardElems   = moduleCard.querySelectorAll(".module-card, .module-header, .module-info, .module-card-content, .module-details");
                        const toggle            = moduleCard.querySelector('.module-toggle');
                        let subjectCards        = [];

                        if (hideAdjacentModuleInsertionFields != "only") {
                            toggle.classList.remove("open");
                            
                            const subjectInsertFields = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]${hideOtherSubjectInsertionFields ? "" : `[data-module="${module}"]`}`)
                            const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});

                            subjectCards = document.querySelectorAll(`.subject-card[data-semester="${sem}"][data-module="${module}"]`);


                            subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {
                                this.detachInsertFieldHitboxEventListeners(subjInsFieldHitbox);
                            })
                            subjectInsertFields.forEach(subjInsField => {
                                subjInsField.classList.remove("show");
                            })
                            subjectCards.forEach(subjCard => {
                                subjCard.classList.add("fold");
                            })
                            moduleCardElems.forEach(elem => {elem.classList.add("fold")})
                            moduleCard.classList.add("fold");
                        }

                        let upperInsertField = "";
                        let lowerInsertField = "";

                        if (hideAdjacentModuleInsertionFields) {
                            upperInsertField = document.querySelector(`.drop-field.insert-field.module[data-semester="${sem}"][data-index="${index}"]`)
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
                        this.timeouts.foldModuleCardTimeout = setTimeout(() => {
                            if (hideAdjacentModuleInsertionFields) {
                                upperInsertField.style.display = "none";
                                lowerInsertField.style.display = "none";
                            }

                            if (hideAdjacentModuleInsertionFields != "only") {
                                subjectCards.forEach(subjCard => {
                                    subjCard.style.display = "none";
                                })
                                moduleCardElems.forEach(elem => {
                                    if (!elem.classList.contains("module-header")) {elem.style.display = "none";}
                                })
                            }
                        }, 200)

                        if (!bypassFoldedModuleCardsId) {
                            this.foldedModuleCardsId.push(moduleCard.id);
                        }
                    }
                    
                }


                // MARK: -unfold module card
                /** Call this method to unfold all module cards
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be shown (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the unfolded module card ID's deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                unfoldAllModuleCards(hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    document.querySelectorAll(".module-header").forEach(moduleHeader => {
                        this.unfoldModuleCard(moduleHeader, hideOtherSubjectInsertionFields, hideAdjacentModuleInsertionFields, bypassFoldedModuleCardsId)
                    })
                }
                /** Call this method to unfold a module card
                 * 
                 * @param {HTMLElement | Event} trigger The trigger of the folding action. Can be a module header HTML Element or an event triggered by a module header
                 * @param {Boolean} hideOtherSubjectInsertionFields Default: false — Destined to control whether all the subject insertion fields of all the other modules are to be shown (if true) or not (if false)
                 * @param {Boolean} hideAdjacentModuleInsertionFields Default: false — Destined to control whether the upper and lower module insertion fields are to be hidden (if true) or not (if false). Makes this method ONLY hide the said insertion fields if its value is "only"
                 * @param {Boolean} bypassFoldedModuleCardsId Default: false — Destined to control whether the unfolded module card ID's deletion from this.foldedModuleCardsId will be bypassed (if true) or not (if false)
                 */
                unfoldModuleCard(trigger, hideOtherSubjectInsertionFields=false, hideAdjacentModuleInsertionFields=false, bypassFoldedModuleCardsId=false) {
                    // testing if the trigger argument is an HTML of class module-card or an Event triggered by a module header or one of its elements
                    if (trigger?.classList?.contains("module-header") || (trigger?.target?.classList?.contains("module-header"))) {
                        // Identifying the moduleCard depending on whether the trigger argument is a module header or an event triggered by a module header
                        const moduleCard        = trigger?.target?.parentElement || trigger.parentElement;
                        const sem               = moduleCard.dataset.semester;
                        const module            = moduleCard.dataset.module;
                        const index             = moduleCard.dataset.index;
                        const moduleCardElems   = moduleCard.querySelectorAll(".module-card, .module-header, .module-info, .module-card-content, .module-details");
                        const toggle            = moduleCard.querySelector('.module-toggle');
                        let subjectCards        = [];
                        let upperInsertField    = "";
                        let lowerInsertField    = "";


                        clearTimeout(this.foldModuleCardTimeout);


                        if (hideAdjacentModuleInsertionFields) {
                            upperInsertField = document.querySelector(   `.drop-field.insert-field.module[data-semester="${sem}"][data-index="${index}"]`);
                            lowerInsertField = document.querySelector(   `.drop-field.insert-field.module[data-semester="${sem}"][data-index="${parseInt(index)+1}"]`);
                        }

                        if (upperInsertField) {
                            upperInsertField.style.display = "";
                            this.timeouts.upperInsertFieldUnfoldTimeout = setTimeout(() => {
                                upperInsertField.classList.add("show");

                                const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-module-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                            }, 10);
                        }
                        
                        if (lowerInsertField) {
                            lowerInsertField.style.display = "";
                            this.timeouts.lowerInsertFieldUnfoldTimeout = setTimeout(() => {
                                lowerInsertField.classList.add("show");
                                
                                const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-module-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                            }, 10)
                        }


                        if (hideAdjacentModuleInsertionFields != "only") {
                            toggle.classList.add("open");
                            
                            subjectCards = document.querySelectorAll(`.subject-card[data-semester="${sem}"][data-module="${module}"]`);

                            const subjectInsertFields   = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]${hideOtherSubjectInsertionFields ? `[data-module="${module}"]` : ""}`);
                            if (subjectInsertFields.length > 0) {
                                subjectInsertFields.forEach(subjInsField => {
                                    subjInsField.classList.display = "";
                                })
                                this.timeouts.subjectInsertFieldUnfoldTimeout = setTimeout(() => {
                                    subjectInsertFields.forEach(subjInsField => {
                                        subjInsField.classList.add("show");
                                    })
                                
                                    const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});
                                    subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {this.attachInsertFieldHitboxEventListeners(subjInsFieldHitbox)})
                                }, 10)
                            }

                            if (subjectCards.length > 0) {
                                subjectCards.forEach(subjCard => {
                                    subjCard.style.display = "";
                                })
                                this.timeouts.subjectCardsUnfoldTimeout = setTimeout(() => {
                                    subjectCards.forEach(subjCard => {
                                        subjCard.classList.remove("fold");
                                    })
                                }, 10)
                            }

                            if (moduleCardElems.length > 0) {
                                moduleCardElems.forEach(elem => {
                                    if (!elem.classList.contains("module-header")) {elem.style.display = "";}
                                })
                                this.timeouts.moduleCardElemsUnfoldTimeout = setTimeout(() => {
                                    moduleCardElems.forEach(elem => {elem.classList.remove("fold")})
                                }, 10)
                            }
                            
                            if (moduleCard) {
                                moduleCard.style.display = "";
                                this.timeouts.moduleCardUnfoldTimeout = setTimeout(() => {
                                    moduleCard.classList.remove("fold");
                                }, 10)
                            }

                            if (!bypassFoldedModuleCardsId) {
                                this.foldedModuleCardsId.splice(this.foldedModuleCardsId.indexOf(moduleCard.id), 1);
                            }
                        }
                    }
                }

                /** Method temporarily attaching an onmousemove and an onmouseup event listener to the document's body.
                 * 
                 * Meant to be invoked when the mouse down event is triggered if the target is or is contained in a module header.
                 * 
                 * In practice, when the onmousedown event of the document is triggered on a module header, call this method to:
                 * - attach an onmousemove event listener to the document's body that will clear the onmousemove and onmouseup events of the document's body in order to "cancel" the action (safe guard for when the edit mode is off and the user attempts to drag the module header, it will not do anything instead of triggering an onclick event)
                 * - attach an onmouseup event listener to the document's body that will make the action intended to happen when the user clicks on the module header (folding the module card) WITHOUT moving the mouse (so if it wasn't an attempt to drag the module header). Both the onmousemove and onmouseup event listeners of the document's body will then be cleared.
                 */
                moduleHeaderMouseUpNoMoveAction() {
                    document.body.onmousemove = (e) => {
                        e.preventDefault();
                        document.body.onmouseup = null;
                        document.body.onmousemove = null;
                    };
                    document.body.onmouseup = (e) => {
                        const header        = e.target.closest('.module-header');
                        const moduleDetails = header.parentElement.querySelector(".module-details");
                        
                        moduleDetails.querySelectorAll(".subject-card").forEach( subjCard => { if (this.selectedSubjectCardsId.includes(subjCard.id)) {this.changeDragIconToTickIcon(subjCard);} } )

                        this.toggleFoldModuleCard(header);
                        
                        this.attachDropFieldsEventListeners("insert", moduleDetails);
                        document.body.onmousemove = null;
                        document.body.onmouseup = null;
                    }
                }

                /** Method temporarily attaching an onmousemove and an onmouseup event listener to the document's body.
                 * 
                 * Meant to be invoked when the mouse down event is triggered if the target is or is contained in a card header.
                 * 
                 * In practice, when the onmousedown event of the document is triggered on a card header, call this method to:
                 * - attach an onmousemove event listener to the document's body that will clear the onmousemove and onmouseup events of the document's body in order to "cancel" the action (safe guard for when the edit mode is off and the user attempts to drag the card header, it will not do anything instead of triggering an onclick event)
                 * - attach an onmouseup event listener to the document's body that will make the action intended to happen when the user clicks on the card header (switching the card card between detailed and comapct view modes) WITHOUT moving the mouse (so if it wasn't an attempt to drag the card header). Both the onmousemove and onmouseup event listeners of the document's body will then be cleared.
                 */
                subjHeaderMouseUpNoMoveAction() {

                    document.body.onmousemove = (e) => {
                        e.preventDefault();
                        document.body.onmouseup = null;
                        document.body.onmousemove = null;
                    };
                    document.body.onmouseup = (e) => {
                        const subjCard  = e.target.closest('.subject-card');
                        if (subjCard) {
                            const sem           = subjCard.dataset.semester;
                            const moduleName    = subjCard.dataset.module || "__#unclassified#__";
                            const subjName      = subjCard.dataset.subject;
                            const index         = subjCard.dataset.index;
                            let newSubjCard     = "";
                            this.viewMode       = "mixed";

                            const unclassifiedSection = document.querySelector(".unclassified-section");
                            unclassifiedSection.style.height = "";
                            
                            
                            if (subjCard.classList.contains("compact")) {
                                this.compactSubjCardsId.splice(this.compactSubjCardsId.indexOf(subjCard.id), 1);
                            }
                            else {
                                this.compactSubjCardsId.push(subjCard.id);
                            }
                            
                            subjCard.outerHTML = this.createSubjCard(sem, moduleName, subjName, index);



                            newSubjCard = document.getElementById(subjCard.id);
                            this.setGradesTableTotalCoef(newSubjCard);
                            this.attachAllSubjectCardRelatedEventListeners(newSubjCard);

                            const currentUnclassifiedSectionHeight = Number(unclassifiedSection.clientHeight);
                            unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;
                        }
                        
                        document.body.onmousemove = null;
                        document.body.onmouseup = null;
                    }
                }
                
                moduleTitleInputChangeAction(target) {
                    const sem               = target.dataset.semester;
                    const newModuleName     = target.value;
                    const oldModuleName     = target.dataset.module; 
                    const oldModuleIndex    = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);
                    
                    this.moduleConfig[sem][newModuleName] = this.moduleConfig[sem][oldModuleName];
                    delete this.moduleConfig[sem][oldModuleName];
                    this.moduleConfig[sem].__modules__[oldModuleIndex] = newModuleName;

                    this.saveConfig()
                    this.getGradesDatas();
                    this.generateContent(false);

                    this.foldedModuleCardsId.forEach(foldedModuleCardId => {
                        if (foldedModuleCardId == `module-card-${oldModuleName}-in-semester-${sem}`) {
                            const moduleCardToFold = document.getElementById(foldedModuleCardId);
                            if (!moduleCardToFold) {
                                const newModuleCardToFold = document.getElementById(`module-card-${newModuleName}-in-semester-${sem}`);
                                this.foldModuleCard(newModuleCardToFold.querySelector(`.module-header`));
                            }
                        }
                    })
                    
                    this.attachOnDragEventListeners();
                    this.scrollToClientHighestElem({id: `module-card-${newModuleName}-in-semester-${sem}`, smooth: true})
                }

                moduleDeleteBtnAction(target) {
                    const sem           = target.dataset.semester;
                    const moduleName    = target.dataset.module;
                    
                    const moduleIndex = this.moduleConfig[sem].__modules__.indexOf(moduleName);

                    this.moduleConfig[sem].__modules__.splice(moduleIndex, 1);
                    delete this.moduleConfig[sem][moduleName];

                    if (this.moduleConfig[sem].__modules__.length == 0) {delete this.moduleConfig[sem]}
                    
                    this.clearSimGrades(sem, moduleName);
                    this.saveConfig();
                    this.getGradesDatas();
                    this.generateContent();
                }

                subjectNameInputAction(target) {
                    const subjNewName   = target.value;
                    const subjectCardId = target.id.replace(/\bsubject-name-input/, "subject-card");
                    const subjectCard   = document.getElementById(subjectCardId);
                    const sem           = subjectCard.dataset.semester;
                    const module        = subjectCard.dataset.module;
                    const subjOldName   = subjectCard.dataset.subject;
                    const moduleDetails = subjectCard.parentElement;
                    const moduleCard    = moduleDetails.parentElement;


                    let diffName = true;
                    this.moduleConfig[sem][module].subjects.forEach(_subj => {
                        if (_subj == subjNewName && _subj != subjOldName) {
                            alert(this.lang == "fr" 
                                ? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
                                : "This subject already exists! Please choose a different name"
                            )
                            diffName = false;
                            this.scrollToClientHighestElem({id: subjectCardId, smooth: true, block: "center"})
                        }
                    });

                    if (diffName) {
                        this.moduleConfig[sem].__modules__.forEach(moduleName => {
                            this.moduleConfig[sem][moduleName].subjects.forEach(_subj => {
                                if (_subj == subjNewName && _subj != subjOldName) {
                                    alert(this.lang == "fr" 
                                        ? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
                                        : "This subject already exists! Please choose a different name"
                                    )
                                    diffName = false;
                                    this.scrollToClientHighestElem({id: subjectCardId, smooth: true, block: "center"})
                                }
                            })
                        })
                    }
                        

                    if (diffName) {
                        const oldSubjIndex = this.moduleConfig[sem][module].subjects.indexOf(subjOldName);
                        const pct   = Number(this.moduleConfig[sem][module].coefficients    [subjOldName]);

                        this.moduleConfig[sem][module].subjects[oldSubjIndex]=subjNewName ;    // Replace the subject's old name by the subject's new name
                        delete this.moduleConfig[sem][module].coefficients [subjOldName];
                        this.moduleConfig[sem][module].coefficients [subjNewName] = pct;
                                    
                        this.getGradesDatas();

                        if (this.compactSubjCardsId.includes(subjectCardId)) {
                            moduleDetails.innerHTML = this.createAllCompactClassifiedSubjCards(sem, module);
                        }
                        else {
                            moduleDetails.innerHTML = this.createAllDetailedClassifiedSubjCards(sem, module);
                        }

                        const unclassifiedSection = document.querySelector(".unclassified-section");
                        const unclassifiedContent = unclassifiedSection.querySelector(".unclassified-content");
                        unclassifiedSection.style.height = "100%";
                        unclassifiedContent.innerHTML = this.createAllDetailedUnclassifiedSubjCards(sem);
                        
                        this.resizeUnclassifiedSection();
                        this.attachAllEventListeners()
                        this.setGradesTableTotalCoef();
                        this.saveConfig()
                        this.getGradesDatas();
                    }
                    else {
                        target.focus();
                        target.style.background = "#ff7979";
                    }
                }

                subjectSimAddBtnAction(target) {
                    const moduleName = target.dataset.module;
                    const semX = target.dataset.semester;
                    const subj = target.dataset.subj;
                    this.ensureSimPath(semX, moduleName, subj);
                    const typeInp =  document.querySelector(`.simulated-grade-input.sim-inp-type[data-semester="${semX}"][data-subj="${subj}"]`);
                    const gradeInp = document.querySelector(`.simulated-grade-input.sim-inp-grade[data-semester="${semX}"][data-subj="${subj}"]`);
                    const coefInp =  document.querySelector(`.simulated-grade-input.sim-inp-coef[data-semester="${semX}"][data-subj="${subj}"]`);
                    const dateInp =  document.querySelector(`.simulated-grade-input.sim-inp-date[data-semester="${semX}"][data-subj="${subj}"]`);
                    const type = typeInp?.value||`${this.lang=="fr"? 'Simulé' : "Simulated"}`;
                    const grade = parseFloat(gradeInp?.value||'');
                    const coef = parseFloat(coefInp?.value||'');
                    const date = dateInp?.value||'';
                    if(isNaN(grade) || isNaN(coef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }

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

                subjectSimDelBtnAction(target) {
                    const semX          = target.dataset.semester;
                    const moduleName    = target.dataset.module;
                    const subj          = target.dataset.subj;
                    const id            = target.dataset.simid;
                    this.sim[semX][moduleName][subj].splice(id, 1);

                    this.deleteUnusedSimPath(false, semX, moduleName, subj);
                    this.saveSim();
                    this.getGradesDatas();
                    this.generateContent(false);
                }

                subjectSimInputEditAction(target) {
                    const moduleName    = target.dataset.module;
                    const semX          = target.dataset.semester;
                    const subj          = target.dataset.subj;
                    const id            = target.dataset.simid;
                    const gradeRow      = target.parentElement.parentElement;
                    const gradeInp      = gradeRow.querySelector(`.simulated-grade-input-edit.sim-inp-grade`);
                    const coefInp       = gradeRow.querySelector(`.simulated-grade-input-edit.sim-inp-coef `);
                    const newGrade      = parseFloat(gradeInp?.value||'');
                    const newCoef       = parseFloat(coefInp?.value||'');

                    if(isNaN(newGrade) || isNaN(newCoef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }
                    this.sim[semX][moduleName][subj][id][target.dataset.modiftype] = target.value;

                    this.saveSim();
                    this.getGradesDatas();
                    this.regenAveragesAndTotalCoefs(semX, moduleName, subj);

                }
            //#endregion

        //#endregion






        //#region -REGION: Drag Events





            // MARK: attach ondrag events
            attachAllOnDragEventListeners() {
                this.attachOnDragEventListeners();
                this.attachDropFieldsEventListeners();
            }
            attachOnDragEventListeners(target="all") {   // Add ONDRAG cards event

                if (target == "subject" || target == "all") {
                    const targetModule = target.match(/subject (.+)/)?.[1];
                    document.querySelectorAll(`.subject-card${targetModule ? `[data-module:"${targetModule}"]` : ""}`).forEach(subjectCard => {
                        this.attachSubjectCardOnDragEventListeners(subjectCard);
                    })
                }

                if (target == "module" || target == "all") {
                    document.querySelectorAll(".module-card").forEach(moduleCard => {
                        this.attachModuleCardOnDragEventListeners(moduleCard);
                    })
                }

                this.attachNotifBtnsListener();
            }
            attachSubjectCardOnDragEventListeners(subjectCard) {
                let draggableElement = "";
                const isCompact = subjectCard.classList.contains("compact");
                if (isCompact) {draggableElement = subjectCard;}
                else {draggableElement = subjectCard.querySelector(".subject-card-header");}
                
                draggableElement.draggable = true;

                if (!this.selectedSubjectCardsId.includes(subjectCard.id)) {
                    draggableElement.ondragstart = (e) => {this.draggedElementOnDragStartEvent( e, {draggableElement, card: subjectCard})};
                    draggableElement.ondragend   = (e) => {this.draggedElementOnDragEndEvent(   e, {draggableElement, card: subjectCard})};
                }
                else {
                    draggableElement.ondragstart = (e) => {this.draggedSelectedElementOnDragStartEvent( e, {draggedElement: draggableElement, card: subjectCard})};
                    draggableElement.ondragend   = (e) => {this.draggedSelectedElementOnDragEndEvent(   e, {draggedElement: draggableElement, card: subjectCard})};
                }
            }
            attachModuleCardOnDragEventListeners(moduleCard) {
                const moduleHeader = moduleCard.querySelector(".module-header");
                moduleHeader.draggable = true;
                moduleHeader.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {moduleHeader, card: moduleCard})}
                moduleHeader.ondragend   = (e) => {this.draggedElementOnDragEndEvent(  e, {moduleHeader, card: moduleCard})}
            }


            // MARK: detach ondrag events
            detachOnDragEventListeners() {   // Remove ONDRAG cards event
                document.querySelectorAll(".subject-card").forEach(subjectCard => {
                    let draggableElement = "";
                    const isCompact = subjectCard.classList.contains("compact");
                    if (isCompact) {draggableElement = subjectCard;}
                    else {draggableElement = subjectCard.querySelector(".subject-card-header");}
                    
                    draggableElement.draggable   = false;
                    draggableElement.ondragstart = null;
                    draggableElement.ondragend   = null;
                })

                document.querySelectorAll(".module-header").forEach(moduleHeader => {
                    moduleHeader.draggable   = false;
                    moduleHeader.ondragstart = null;
                    moduleHeader.ondragend   = null;
                })
            }





            //#region Dragged element events

            async draggedElementOnDragStartEvent(e, {draggedElement, card}) {
                if (e.target.classList.contains("any-input")) {return}

                if (card.classList.contains("subject-card")) {
                    this.currentlyDraggedElement = draggedElement;
                    this.currentlyDraggedCard = card;
                    this.currentlyDraggedCard.style.width = "50%";
                    
                    if (card.classList.contains("classified") && card.classList.contains("compact")) {
                        this.currentlyDraggedCard.style.margin = "38px 0px";
                        this.currentlyDraggedCard.querySelector(".subject-total-coef-div").style.display = "none";
                    }
                    else if (card.classList.contains("classified") && card.classList.contains("detailed")) {
                        this.currentlyDraggedCard.style.margin = "38px 0px";
                        this.currentlyDraggedCard.querySelector(".grades-table")        .style.display = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header") .style.borderBottom = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header") .style.borderRadius = "20px 20px 20px 20px";

                        this.currentlyDraggedCard.querySelector(".subject-card-header") .children[0].style.width =    "50%";
                        this.currentlyDraggedCard.querySelector(".subject-total-coef-div").style.display = "none";
                    }
                    else if (card.classList.contains("unclassified") && card.classList.contains("compact")) {
                        this.currentlyDraggedCard.querySelector(".subject-total-coef-div").style.display = "none";
                    }
                    else if (card.classList.contains("unclassified") && card.classList.contains("detailed")) {
                        this.currentlyDraggedCard.querySelector(".grades-table")        .style.display = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header") .style.borderBottom = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header") .style.borderRadius = "20px 20px 20px 20px";

                        this.currentlyDraggedCard.querySelector(".subject-card-header") .children[1].style.width =    "50%";
                        this.currentlyDraggedCard.querySelector(".subject-total-coef-div").style.display = "none";
                    }

                    clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
                    clearTimeout(this?.timeouts?.draggedElementOnDragEndEvent?.showTeacherTable);
                    if (!this.timeouts?.draggedElementOnDragStartEvent) {this.timeouts.draggedElementOnDragStartEvent = {};}

                    this.timeouts.draggedElementOnDragStartEvent.hideTeacherTable = setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher => {teacher.style.display = "none";})}, 50);
                    // document.querySelectorAll(".grades-table-add-sim-cell, .grades-table-teacher, .grades-table-date, .grades-table-classAvg, .grades-table-coef, .grades-table-grade, .grades-table-type").forEach(cell => {cell.classList.add("dragging")})
                    document.querySelector(".semester-content")                 .classList.add("dragging");
                    document.querySelector(".drop-field.create-module")             .classList.add("show");
                    document.querySelector(".drop-field-create-module-hitbox")      .classList.add("show");
                    document.querySelector(".drop-field.remove-from-module")        .classList.add("show");
                    document.querySelector(".drop-field-remove-from-module-hitbox") .classList.add("show");

                    document.querySelectorAll(".drop-module-card-insert-plus,  .drop-subject-card-insert-plus ").forEach(plus  => {plus.classList.remove("show");})
                    document.querySelectorAll(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").forEach(arrow => {arrow.classList.add("show");})

                    const insertFieldTexts = document.querySelectorAll(".drop-module-card-insert-text,  .drop-subject-card-insert-text");
                    insertFieldTexts.forEach(insertFieldText => {
                        insertFieldText.classList.replace("add", "insert");
                        insertFieldText.parentElement.classList.replace("add", "insert");
                    })


                    if (!this.currentlyDraggedCard.classList.contains("unclassified")) {
                        const sem       = this.currentlyDraggedCard.dataset.semester;
                        const module    = this.currentlyDraggedCard.dataset.module;
                        const index     = this.currentlyDraggedCard.dataset.index;

                        const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${module}"][data-index="${index}"]`)
                        const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");

                        const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${module}"][data-index="${parseInt(index)+1}"]`)
                        const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");

                        this.detachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
                        this.detachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
                        upperInsertField.classList.remove("show");
                        lowerInsertField.classList.remove("show");

                        if (!this?.timeouts?.draggedElementOnDragStartEvent) {this.timeouts.draggedElementOnDragStartEvent = {};}
                        this.timeouts.draggedElementOnDragStartEvent.collapseSubjectCardAdjacentInsertFields = setTimeout(() => {
                            upperInsertField.style.display = "none";
                            lowerInsertField.style.display = "none";
                        }, 200)
                    }
                }
                else if (card.classList.contains("module-card")) {
                    this.currentlyDraggedElement = draggedElement;
                    this.currentlyDraggedCard = card;
                    document.querySelector(".drop-field.create-module")             .classList.add("show");
                    document.querySelector(".drop-field-create-module-hitbox")      .classList.add("show");
                    document.querySelector(".drop-field.remove-from-module")        .classList.add("show");
                    document.querySelector(".drop-field-remove-from-module-hitbox") .classList.add("show");
                    
                    if (!this.foldedModuleCardsId.includes(card.id)) {
                        this.foldModuleCard(e, true, true, true);
                    }
                    else {
                        this.foldModuleCard(e, true, "only", true);
                    }
                    
                    document.querySelector(".semester-content").classList.add("dragging");
                    this.currentlyDraggedCard.style.margin = "75px 0px";
                }

                e.dataTransfer.effectAllowed = "link";
                e.dataTransfer.setDragImage(document.getElementById("emptyDiv"), 0, 0);
                e.dataTransfer.setData("text", this.currentlyDraggedCard.id);
            };
            async draggedElementOnDragEndEvent(e, {draggedElement, card}) {
                card.style.width = "";
                card.style.margin = "";
                this.currentlyDraggedElement = undefined;
                this.currentlyDraggedCard    = undefined;

                if (card.classList.contains("subject-card")) {
                    if (card.classList.contains("classified") && card.classList.contains("compact")) {
                        card.querySelector(".subject-total-coef-div").style.display = "";
                    }
                    else if (card.classList.contains("classified") && card.classList.contains("detailed")) {
                        card.querySelector(".grades-table").style.display = "table";
                        card.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                        card.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";

                        card.querySelector(".subject-card-header").children[0].style.width =     "42%";
                        card.querySelector(".subject-total-coef-div").style.display = "";
                    }
                    else if (card.classList.contains("unclassified") && card.classList.contains("compact")) {
                        card.querySelector(".subject-total-coef-div").style.display = "";
                    }
                    else if (card.classList.contains("unclassified") && card.classList.contains("detailed")) {
                        card.querySelector(".grades-table").style.display = "table";
                        card.querySelector(".subject-card-header").style.border = "none";
                        card.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";

                        card.querySelector(".subject-card-header").children[1].style.width =     "40%";
                        card.querySelector(".subject-total-coef-div").style.display = "";
                    }
                    
                    if (this.selectedSubjectCardsId.length == 0) {
                        clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
                        clearTimeout(this?.timeouts?.draggedElementOnDragStartEvent?.hideTeacherTable);
                        if (!this?.timeouts?.draggedElementOnDragEndEvent) {this.timeouts.draggedElementOnDragEndEvent = {};}

                        this.timeouts.draggedElementOnDragEndEvent.showTeacherTable = setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher => {teacher.style.display = "table-cell"})}, 50);
                        document.querySelector(".semester-content")                 .classList.remove("dragging");
                        document.querySelector(".drop-field.create-module")             .classList.remove("show");
                        document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
                        document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
                        document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");

                        document.querySelectorAll(".drop-module-card-insert-plus,  .drop-subject-card-insert-plus ").forEach(plus  => {plus.classList.add("show");})
                        document.querySelectorAll(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").forEach(arrow => {arrow.classList.remove("show");})

                        const insertFieldTexts = document.querySelectorAll(".drop-module-card-insert-text,  .drop-subject-card-insert-text");
                        insertFieldTexts.forEach(insertFieldText => {
                            insertFieldText.classList.replace("insert", "add");
                            insertFieldText.parentElement.classList.replace("insert", "add");
                        })
                    }

                    this.resizeUnclassifiedSection();

                    if (!card.classList.contains("unclassified")) {
                        const sem       = card.dataset.semester;
                        const module    = card.dataset.module;
                        const index     = card.dataset.index;
                        const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${module}"][data-index="${index}"]`)
                        const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-module="${module}"][data-index="${parseInt(index)+1}"]`)

                        clearTimeout(this?.timeouts?.draggedElementOnDragStartEvent?.collapseSubjectCardAdjacentInsertFields);
                        setTimeout(() => {
                            if (upperInsertField) {
                                upperInsertField.style.display = "";
                                upperInsertField.classList.add("show");

                                const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                            }
                                
                            if (lowerInsertField) {
                                lowerInsertField.style.display = "";
                                lowerInsertField.classList.add("show");
                                
                                const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                            }
                        }, 10);
                    }
                }
                else if (card.classList.contains("module-card")) {
                    document.querySelector(".drop-field.create-module")             .classList.remove("show");
                    document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
                    document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
                    document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");

                    if (!this.foldedModuleCardsId.includes(card.id)) {
                        this.unfoldModuleCard(e, true, true, true);
                    }
                    else {
                        this.unfoldModuleCard(e, true, "only", true);
                    }

                    document.querySelector(".semester-content").classList.remove("dragging");
                }
            }
            async draggedSelectedElementOnDragStartEvent(e, {draggedElement, card}) {
                this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {
                    const selectedSubjectCard = document.getElementById(selectedSubjectCardId);
                    selectedSubjectCard.style.width = "50%";

                    if (selectedSubjectCard.classList.contains("unclassified")) {
                        setTimeout(() => {selectedSubjectCard.querySelector(".grades-table").style.display = "none";}, 10)
                        selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px";
                    
                    } 
                    else if (selectedSubjectCard.classList.contains("compact")) {
                        selectedSubjectCard.querySelector(".subject-total-coef-div").style.display = "none";
                    }
                    else {
                        selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width =     "50%";
                        selectedSubjectCard.querySelector(".subject-total-coef-div").style.width = "50%";
                        setTimeout(() => {selectedSubjectCard.querySelector(".grades-table").style.display = "none";}, 10)
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px";
                    }
                })

                clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
                document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                document.querySelector(".semester-content")                 .classList.add("dragging");
                document.querySelector(".drop-field.create-module")             .classList.add("show");
                document.querySelector(".drop-field-create-module-hitbox")      .classList.add("show");
                document.querySelector(".drop-field.remove-from-module")        .classList.add("show");
                document.querySelector(".drop-field-remove-from-module-hitbox") .classList.add("show");

                e.dataTransfer.effectAllowed = "link";
                e.dataTransfer.setDragImage(document.getElementById("emptyDiv"), 0, 0);
                e.dataTransfer.setData("text", card.id)
            };
            async draggedSelectedElementOnDragEndEvent(e, {draggedElement, card}) {

                this.selectedSubjectCardsId.forEach(selectedSubjectCardId => {
                    const selectedSubjectCard = document.getElementById(selectedSubjectCardId);
                    selectedSubjectCard.style.width = "";

                    if (selectedSubjectCard.classList.contains("unclassified")) {
                        selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                        selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    
                    } 
                    else if (selectedSubjectCard.classList.contains("compact")) {
                        selectedSubjectCard.querySelector(".subject-total-coef-div").style.display = "flex";
                    }
                    else {
                        selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width =     "42%";
                        selectedSubjectCard.querySelector(".subject-total-coef-div").style.width = "58%";
                        selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                })
            }

            // #endregion
            




            //#region Subject insertion events

            insertFieldHitboxOnDragOverEvent(e) {
                const type               = e.target.dataset.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldArrow   = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
                const insertFieldPlus    = insertField.querySelector(`.drop-${type}-card-insert-plus`);
                const insertFieldText    = insertField.querySelector(`.drop-${type}-card-insert-text`);
                const insertFieldHitbox  = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);

                e.preventDefault(); 
                insertField.classList.add("hover");
                insertFieldArrow?.classList?.add("hover"); 
                insertFieldPlus?.classList?.add("hover");
                insertFieldText.classList.add("hover");
            }
            insertFieldHitboxOnDragLeaveEvent(e) {
                const type = e.target.dataset.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldArrow   = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
                const insertFieldPlus    = insertField.querySelector(`.drop-${type}-card-insert-plus`);
                const insertFieldText    = insertField.querySelector(`.drop-${type}-card-insert-text`);
                const insertFieldHitbox  = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);

                e.preventDefault(); 
                insertField.classList.remove("hover");
                insertFieldArrow?.classList?.remove("hover"); 
                insertFieldPlus?.classList?.remove("hover");
                insertFieldText?.classList?.remove("hover");
            }
            insertFieldHitboxOnDropEvent(e) {
                const data               = e.target.dataset;
                const type               = data.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldHitbox  = insertField.querySelector(`.drop-${type}-card-insert-hitbox`);
                const dataTransfer       = e.dataTransfer.getData("text");
                const dataTransferMatch  = dataTransfer.match(/module-card|subject-card/);
                const eventCallerMatch   = e.target.className.match(/drop-(module|subject)-card/);

                e.preventDefault(); 

                insertFieldHitbox.ondragover = (e) => {this.insertFieldHitboxOnDragOverEvent(e)};

                switch (`${dataTransferMatch?.[0] ? dataTransferMatch?.[0] : "errr... somthing"} dropped in ${eventCallerMatch?.[1] ? "a " + eventCallerMatch?.[1] + " insertion field" : "errr... somthing?"}`) {
                    case "module-card dropped in a module insertion field":
                        this.dropFieldModuleInsertAction(dataTransfer, insertField);
                    break;
                    case "subject-card dropped in a module insertion field":
                        this.dropFieldToNewModuleAction(dataTransfer, e.target.dataset.index);
                    break;
                    case "subject-card dropped in a subject insertion field":
                        this.dropFieldSubjectInsertAction(dataTransfer, insertField);
                    break;
                }
            }
            insertFieldHitboxOnMouseEnterEvent(e) {
                const type              = e.target.dataset.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldArrow   = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
                const insertFieldPlus    = insertField.querySelector(`.drop-${type}-card-insert-plus`);
                const insertFieldText    = insertField.querySelector(`.drop-${type}-card-insert-text`);

                insertField.classList.add("hover");
                insertFieldArrow?.classList?.add("hover"); 
                insertFieldPlus?.classList?.add("hover");
                insertFieldText?.classList?.add("hover");
            }
            insertFieldHitboxOnMouseLeaveEvent(e) {
                const type = e.target.dataset.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldArrow   = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
                const insertFieldPlus    = insertField.querySelector(`.drop-${type}-card-insert-plus`);
                const insertFieldText    = insertField.querySelector(`.drop-${type}-card-insert-text`);
                
                insertField.classList.remove("hover");
                insertFieldArrow?.classList?.remove("hover");
                insertFieldPlus?.classList?.remove("hover");
                insertFieldText?.classList?.remove("hover");

            }
            insertFieldHitboxOnClickEvent(e) {
                const type = e.target.dataset.type;
                const insertField        = e.target.closest(        `.drop-field.insert-field.${type}`);
                const insertFieldArrow   = insertField.querySelector(`.drop-${type}-card-insert-arrow`);
                const insertFieldPlus    = insertField.querySelector(`.drop-${type}-card-insert-plus`);
                const insertFieldText    = insertField.querySelector(`.drop-${type}-card-insert-text`);
                
                e.preventDefault(); 

                if (this.selectedSubjectCardsId.length == 0) {
                    this.dropFieldSubjectInsertAction(null, insertField)
                }
                else {
                    this.dropFieldSubjectInsertAction(this.selectedSubjectCardsId[0], insertField);
                }
            }

            attachInsertFieldHitboxEventListeners(insertFieldHitbox) {
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
                    if (data.type == "subject") {
                        this.insertFieldHitboxOnClickEvent(e);
                    }
                    else {
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
                insertFieldHitbox.ondragover     = (e) => {e.preventDefault()};
                insertFieldHitbox.ondragleave    = (e) => {e.preventDefault()};
                insertFieldHitbox.ondrop         = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "link";};

                insertFieldHitbox.onmouseenter   = (e) => {e.preventDefault()};
                insertFieldHitbox.onmouseleave   = (e) => {e.preventDefault()};
                insertFieldHitbox.onclick        = (e) => {e.preventDefault()};
            }

            // #endregion





            //#region -card selection
            
                // MARK: createSelectedCardNotifDiv
                createSelectedCardNotifDiv(subjectCard) {
                    const semester = subjectCard.dataset.semester;
                    const subject  = subjectCard.dataset.subject;
                    const targetId = subjectCard.id;
                    const selectionNotifDiv = document.createElement("div");
                    selectionNotifDiv.className = `selected-subject-card-notif-div`;
                    selectionNotifDiv.id = `selected-subject-card-notif-div-for-${subject}-from-semester-${semester}`;
                    selectionNotifDiv.dataset.subject = subject;
                    selectionNotifDiv.dataset.semester = semester;
                    selectionNotifDiv.dataset.targetid = targetId;
                    selectionNotifDiv.innerHTML = `
                        <div class="selected-subject-card-notif-div-scroll-btn" id="selected-subject-card-notif-div-del-btn-for-${subject}-from-semester-${semester}" data-targetId="${targetId}">${">"}</div>
                        <span style="font-weight: 600; font-size: 14px; color: white">${subject}</span>
                        ${this.lang == "fr" ? `est sélectionné!` : `is selected!`}
                        <div class="selected-subject-card-notif-div-del-btn" id="selected-subject-card-notif-div-del-btn-for-${subject}-from-semester-${semester}" data-targetId="${targetId}">x</div>
                    `;

                    return selectionNotifDiv;
                }


                // MARK: remove from subject selection
                /** 
                *  Manage all the actions involving the deletion of a subj card from the selection of subj cards (this.selectedSubjectCardsId)
                * 
                * @param {String} notifDiv the div of the notif linked to the selected subject card
                * @param {HTMLElement} elementDroppedInField if this method is called from triggering an ondrop event of a drop field, pass the dropped element in this argument
                */
                removeSubjectCardFromSubjectSelection({notifDiv="all", elementDroppedInField=undefined}={notifDiv:"all", elementDroppedInField:undefined}) {
                    if (notifDiv=="all") {      // clear all subject card selection as well as their respective notif
                        
                        this.selectedSubjectCardsId.forEach((selectedSubjectCardId, index) => {
                            const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

                            selectedSubjectCard.style.width = "";

                            if (selectedSubjectCard.classList.contains("unclassified")) {
                                selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                                selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                                selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                            }
                            else if (selectedSubjectCard.classList.contains("compact")) {
                                selectedSubjectCard.querySelector(".subject-total-coef-div").style.display = "flex";
                            }
                            else {
                                selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width = "42%";
                                selectedSubjectCard.querySelector(".subject-total-coef-div").style.width = "58%";
                                selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                                selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                                selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                            }
                            
                            this.changeTickIconToDragIcon(selectedSubjectCard);

                            const correspNotifDiv = document.querySelector(`.selected-subject-card-notif-div[data-targetid="${selectedSubjectCard.id}"]`);
                            correspNotifDiv.classList.remove("on");
                            setTimeout(() => {correspNotifDiv.remove();}, 300)

                            selectedSubjectCard.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {card: selectedSubjectCard})};
                            selectedSubjectCard.ondragend   = (e) => {this.draggedElementOnDragEndEvent  (e, {card: selectedSubjectCard})};
                        })

                        clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
                        setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
                        
                        document.querySelector(".semester-content")                 .classList.remove("dragging");
                        document.querySelector(".drop-field.create-module")             .classList.remove("show");
                        document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
                        document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
                        document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");

                        document.querySelectorAll(".module-title.input").forEach(input => {
                            input.parentElement.style.transition = "";
                            input.parentElement.style.width = "42%";
                        })
                        document.querySelectorAll(".subject-total-coef-div").forEach(totalCoefDiv => {
                            totalCoefDiv.style.transition = "";
                            totalCoefDiv.style.width = "47%";
                        })

                        this.selectedSubjectCardsId = [];
                        this.selectedSubjectCardsSortedByModule = {};
                    } 
                    else {      // clear the specifically given notifDiv from the selection
                        let subjectCard = "";
                        if (!elementDroppedInField) {
                            subjectCard = document.getElementById(notifDiv.dataset.targetid);
                        }
                        

                        notifDiv.classList.remove("on");
                        setTimeout(()=>{
                            notifDiv.remove();
                        }, 300)

                        this.selectedSubjectCardsId.forEach((selectedSubjectCardId, index) => {
                            const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

                            if (selectedSubjectCard == subjectCard) 
                                this.selectedSubjectCardsId.splice(index, 1)
                            }
                        )
                        Object.keys(this.selectedSubjectCardsSortedByModule).forEach((moduleName, moduleIndex) => {
                            this.selectedSubjectCardsSortedByModule[moduleName].forEach((selectedSubjectCard, subjIndex) => {
                                this.selectedSubjectCardsSortedByModule[moduleName].splice(subjIndex, 1);
                            })
                            if (this.selectedSubjectCardsSortedByModule[moduleName].length == 0) {
                                delete this.selectedSubjectCardsSortedByModule[moduleName];
                            }
                        })
                    
                        if (this.selectedSubjectCardsId.length == 0) {
                            clearTimeout(this?.timeouts?.documentOnDragEnd?.hideTeacherTable);
                            setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
                            
                            document.querySelector(".semester-content")                 .classList.remove("dragging");
                            document.querySelector(".drop-field.create-module")             .classList.remove("show");
                            document.querySelector(".drop-field-create-module-hitbox")      .classList.remove("show");
                            document.querySelector(".drop-field.remove-from-module")        .classList.remove("show");
                            document.querySelector(".drop-field-remove-from-module-hitbox") .classList.remove("show");
                            document.querySelectorAll(".module-title.input").forEach(input => {
                                input.parentElement.style.transition = "";
                                input.parentElement.style.width = "42%";
                            })
                            document.querySelectorAll(".subject-total-coef-div").forEach(totalCoefDiv => {
                                totalCoefDiv.style.transition = "";
                                totalCoefDiv.style.width = "47%";
                            })
                        }

                        this.changeTickIconToDragIcon(subjectCard)

                        subjectCard.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {card:subjectCard})};
                        subjectCard.ondragend   = (e) => {this.draggedElementOnDragEndEvent  (e, {card:subjectCard})};
                    }
                    
                    
                    // Ensure the subject insertion drop fields are displaying the right text
                    document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
                        if (this.selectedSubjectCardsId.length == 0) {
                            subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.add("show");
                            subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.remove("show");
                            subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").classList.replace("insert", "add");
                            subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("insert", "add");
                        }
                        else {
                            subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
                            subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
                            subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").classList.replace("add", "insert");
                            subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("add", "insert");
                        }
                    });
                }

            //#endregion





            //#region -drag/tick icon

                changeDragIconToTickIcon(subjectCard) {
                    const dragIcon = subjectCard.querySelector(".drag-icon");
                    if (dragIcon) {
                        const type = subjectCard.classList.contains("compact") ? "compact" : "detailed";
                        dragIcon.outerHTML = `<div class="tick-icon for-${type}-subject-card" data-type="${type}" data-targetid="${subjectCard.id}">✔</div>`;
                        const tickIcon = subjectCard.querySelector(".tick-icon");
                        tickIcon.onclick = (e) => {this.tickIconOnClickEvent(e, tickIcon)};
                    }
                }

                changeTickIconToDragIcon(subjectCard) {
                    const tickIcon = subjectCard.querySelector(".tick-icon");
                    if (tickIcon) {
                        const type = subjectCard.classList.contains("compact") ? "compact" : "detailed";
                        tickIcon.outerHTML = this.draggableIcon(`${type}-subject-card`, {targetId: subjectCard.id, type});
                        const dragIcon = subjectCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};
                    }
                }

                switchBetweenDragAndTickIcon(subjectCard) {
                    const dragIcon = subjectCard.querySelector(".drag-icon");
                    if (dragIcon) {
                        this.changeDragIconToTickIcon(subjectCard);
                    }
                    else {
                        this.changeTickIconToDragIcon(subjectCard);
                    }
                }



                // MARK: dragIconOnClickEvent
                dragIconOnClickEvent(e, dragIcon, dontAddToSelection=false) {
                    let subjectCard = e?.target ? document.getElementById(e.target.dataset.targetid) : e;
                    let draggableElement = subjectCard;
                    const dropFieldAdd          = document.querySelector(".drop-field.create-module");
                    const dropFieldAddHitbox    = document.querySelector(".drop-field-create-module-hitbox");
                    const dropFieldRemove       = document.querySelector(".drop-field.remove-from-module");
                    const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-module-hitbox");
                    const type = dragIcon.dataset.type;
                    
                    draggableElement.draggable = true;
                    draggableElement.ondragstart = (e) =>   {this.draggedSelectedElementOnDragStartEvent(e, {draggedElement: draggableElement, card:subjectCard})};
                    draggableElement.ondragend   = (e) =>   {this.draggedSelectedElementOnDragEndEvent(  e, {draggedElement: draggableElement, card:subjectCard})};

                    if (!dontAddToSelection) {
                        this.selectedSubjectCardsId.push(subjectCard.id);
                        if (!this.selectedSubjectCardsSortedByModule[subjectCard.dataset.module]) { this.selectedSubjectCardsSortedByModule[subjectCard.dataset.module] = []; };
                        this.selectedSubjectCardsSortedByModule[subjectCard.dataset.module].push({subjectCardId: subjectCard.id, selectionIndex: this.selectedSubjectCardsId.length-1});

                        const selectionNotifDiv = this.createSelectedCardNotifDiv(subjectCard);

                        document.querySelector(".selected-subject-card-notif-container").appendChild(selectionNotifDiv);
                        this.attachNotifBtnsListener(selectionNotifDiv);

                        setTimeout(()=>{selectionNotifDiv.classList.add("on")}, 10)

                        // Ensure the subject insertion drop fields are showing the right text
                        document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
                            if (this.selectedSubjectCardsId.length == 0) {
                                // shouldn't be reached, normally
                                subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.add("show");
                                subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.remove("show");
                                subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").classList.replace("insert", "add");
                                subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("insert", "add");
                            }
                            else {
                                subjInsertField.querySelector(".drop-module-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
                                subjInsertField.querySelector(".drop-module-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
                                subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").classList.replace("add", "insert");
                                subjInsertField.querySelector(".drop-module-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("add", "insert");
                            }
                        });
                    }

                    document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                    document.querySelectorAll(".module-title.input").forEach(input => {
                        input.parentElement.style.transition = "width 0.3s ease";
                        input.parentElement.style.width = "30%";
                    })
                    document.querySelectorAll(".subject-total-coef-div").forEach(totalCoefDiv => {
                        totalCoefDiv.style.transition = "width 0.3s ease";
                        totalCoefDiv.style.width = "56%";
                    })
                    dropFieldAdd.classList.add("show");
                    dropFieldAddHitbox.classList.add("show");
                    dropFieldRemove.classList.add("show");
                    dropFieldRemoveHitbox.classList.add("show");
                    document.querySelector(".semester-content").classList.add("dragging");

                    dragIcon.outerHTML = `<div class="tick-icon for-${type}-subject-card" data-type="${type}">✔</div>`;
                    const tick = subjectCard.querySelector(".tick-icon");
                    tick.dataset.targetid = subjectCard.id;
                    tick.onclick = (e) => {this.tickIconOnClickEvent(e, tick)};
                }


                // MARK: tickIconOnClickEvent
                tickIconOnClickEvent(e, tick) {
                    e.preventDefault();
                    const type = e.target.dataset.type;
                    let subjectCard = e.target.parentElement.parentElement.parentElement;
                    if (type=="detailed") {subjectCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement}

                    
                    const sem = subjectCard.dataset.semester;
                    const subject = subjectCard.dataset.subject;
                    const notifDiv = document.getElementById(`selected-subject-card-notif-div-for-${type}-${subject}-from-semester-${sem}`);
                    
                    this.removeSubjectCardFromSubjectSelection({notifDiv});
                }

            //#endregion





            //#region -Drop fields actions






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
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldRemoveHitbox.ondragleave =   (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldRemoveHitbox.ondrop =        (e) => {if (e.target.classList.contains("show")){
                            e.preventDefault(); 
                            e.dataTransfer.dropEffect = "link";
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover");})
                            this.dropFieldRemoveAction(e.dataTransfer.getData("text"));
                        }};
                        // Custom :hover event, cuz otherwise it would trigger when the fields are not shown
                        dropFieldRemoveHitbox.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.add("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldRemoveHitbox.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldRemoveHitbox.onclick =       (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-module-text, .drop-field-remove-from-module-minus").forEach(text => {text.classList.remove("hover");})
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
                                        newModuleName = oldModuleName;
                                        newModuleConfig.coefficients[subject] = 100;
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

                            } else {  // mutliple subj cards dropped through selection in the drop field "add"
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
                                        const subjectCard = document.getElementById(selectedSubjectCard.subjectCardId);
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
                    }
                    else {
                        const newSubjName = this.lang == "fr" ? "Nouvelle matière" : "New subject";
                        newModuleConfig.subjects.push(newSubjName);
                        newModuleConfig.coefficients[newSubjName] = 100;
                    }

                    this.moduleConfig[sem][newModuleName] = newModuleConfig;
                    const newModuleIndexInSem = this.moduleConfig[sem].__modules__.indexOf(newModuleName);
                    if (newModuleIndexInSem > -1) {
                        this.moduleConfig[sem].__modules__.splice(newModuleIndexInSem, 1, newModuleName)
                    }
                    else {
                        this.moduleConfig[sem].__modules__.splice(index, 0, newModuleName)
                    }                

                    this.removeSubjectCardFromSubjectSelection();
                    this.saveConfig();
                    this.getGradesDatas();
                    this.generateContent();
                    this.scrollToClientHighestElem({id: `module-card-${newModuleName}-in-semester-${sem}`, smooth: true})
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
                            })
                        }

                        if (this.moduleConfig[sem].__modules__.length == 0) {delete this.moduleConfig[sem]}

                        this.removeSubjectCardFromSubjectSelection({elementDroppedInField:card});
                        this.saveConfig();
                        this.getGradesDatas();
                        this.generateContent();
                    }
                    else if (card?.classList?.contains("subject-card") && card?.classList?.contains("unclassified") && cardIsSelected) {
                        this.removeSubjectCardFromSubjectSelection({elementDroppedInField:card});
                    }
                    else if (card?.classList?.contains("module-card")) {}

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

                                const subject = subjectCard.dataset.subject;
                                const oldModuleName = subjectCard.dataset.module;
                                const oldModuleIndex = this.moduleConfig[sem].__modules__.indexOf(oldModuleName);
                                const subjectOldIndex = this.moduleConfig?.[sem]?.[oldModuleName]?.subjects?.indexOf(subject);
                            
                                // CASE 1: subject card comes from unclassified section to a module             -> (default/easy case)
                                // CASE 2: subject card comes from a module to another module                       -> (moving case)
                                // CASE 3: subject card comes from a module to the same module at a different index -> (reordering case)
                                // CASE 4: subject card comes from a module to the same module at the same index    -> (a no-use case, so nothing happens)

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
                                        // We move the datas from the old module to the new module
                                        this.moduleConfig[sem][targetModuleName].subjects.splice(insertionIndex, 0, subject);
                                        this.moduleConfig[sem][targetModuleName].coefficients[subject]  = Number (this.moduleConfig[sem][oldModuleName].coefficients[subject]);

                                        this.moduleConfig[sem][oldModuleName].subjects.splice(subjectOldIndex, 1);
                                        delete this.moduleConfig[sem][oldModuleName].coefficients[subject];
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

                            this.removeSubjectCardFromSubjectSelection();
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

                        let newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} 1`; let count = 1;
                        while (this.gradesDatas[sem][module].subjects[newSubjName]) {
                            count++; newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} ${count}`;
                        }

                        const insertionIndex = methodCaller ? methodCaller.dataset.index : this.moduleConfig[sem][module].subjects.length;

                        this.moduleConfig   [sem][module].subjects.splice(insertionIndex, 0, newSubjName);
                        this.moduleConfig   [sem][module].coefficients [newSubjName] = 0;

                        this.saveConfig();
                        this.getGradesDatas();
                        
                        if (this.viewMode == "detailed" || !moduleDetails.classList.contains("compact")) {
                            moduleDetails.innerHTML = this.createAllDetailedClassifiedSubjCards(sem, module);
                        }
                        else {
                            moduleDetails.innerHTML = this.createAllCompactClassifiedSubjCards(sem, module);
                        }

                        this.attachAllEventListeners()
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
        





        //#region -REGION: Config ↓Imp/Exp↑

            toggleImportMenu(open=undefined) {
                const importMenu    = document.getElementById("importMenu");
                const importFile    = importMenu.querySelector(".import-menu-btn.file");
                const importClear   = importMenu.querySelector(".import-menu-btn.clear");
                const importOnline  = importMenu.querySelector(".import-menu-btn.online");

                importFile.children[0].innerHTML   = this.lang == "fr" ? "Importer fichier de configuration .json"   : "Import a .json configuration file";
                importClear.innerHTML = this.lang == "fr" ? "Effacer Config"   : "Clear Config";
                importClear.title     = this.lang == "fr" ? "Clique ici pour effacer ta configuration actuelle" : "Click here to clear your current configuration";
                importOnline.children[1].innerHTML = this.lang == "fr" ? "Obtenir fichier de configuration en ligne" : "Get a configuration file online";
                
                if (!importMenu.classList.contains("show") || open == true) {
                    clearTimeout(this.timeouts?.closeImportMenu);
                    importMenu.style.display = "";
                    setTimeout(() => {importMenu.classList.add("show")}, 10)
                    importFile.onclick   = () => this.importData();
                    importClear.onclick  = () => {this.moduleConfig = {}; this.compactSubjCardsId = []; this.foldedModuleCardsId = []; this.getGradesDatas(); this.saveConfig(); this.generateContent(true)};
                    importOnline.onclick = () => {
                        if (this.onlineConfigs)
                        this.getConfigsFromRepoAPI(this.repoContentsAPI)
                    };
                }
                else if (importMenu.classList.contains("show") || open == false) {
                    importMenu.classList.remove("show");
                    importFile.onclick   = null;
                    importOnline.onclick = null;
                    this.timeouts.closeImportMenu = setTimeout(() => {importMenu.style.display = "none"}, 300);
                }
            }

            openOnlineCfgPicker() {
                document.getElementById("importMenu").classList.remove("show");
                this.timeouts.closeImportMenu = setTimeout(() => {importMenu.style.display = "none"}, 300);

                const pickerMenu        = document.createElement("div");
                pickerMenu.id           = "pickerMenu";
                pickerMenu.className    = "online-cfg-picker-menu";
                const sectionsHTML      = this.generateOnlineCfgPickerMenuDirTree("section");
                const yearsHTML         = this.generateOnlineCfgPickerMenuDirTree("year");
                const promsHTML         = this.generateOnlineCfgPickerMenuDirTree("prom");
                const configsHTML       = this.generateOnlineCfgPickerMenuDirTree("config");

                pickerMenu.innerHTML = `
                    <div class="online-cfg-picker-menu-header">
                        <div class="online-cfg-picker-menu-close-btn">❌</div>
                    </div>
                    <div class="online-cfg-picker-menu-body">
                        <div class="online-cfg-picker-menu-body-container">
                            ${sectionsHTML}
                            ${yearsHTML}
                            ${promsHTML}
                            ${configsHTML}
                        </div>
                    </div>
                `;

                document.querySelector(".ecam-dash").appendChild(pickerMenu);
                clearTimeout(this.timeouts?.closePickerMenu)
                setTimeout(() => {pickerMenu.classList.add("show");}, 10)

                const closePickerMenuFunc = () => {
                    pickerMenu.classList.remove("show"); 
                    this.timeouts.closePickerMenu = setTimeout(() => {pickerMenu.remove(); this.attachDocumentMouseListeners()}, 300);
                };
                
                document.onclick = (e) => {if (!e.target.closest(".online-cfg-picker-menu")) {closePickerMenuFunc()}}
                document.onmousedown = null;
                pickerMenu.querySelector(".online-cfg-picker-menu-close-btn").onclick = closePickerMenuFunc;
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
            }

            generateOnlineCfgPickerMenuDirTree(type="section") {
                // Creating an array containing all the properties' value of this.onlineConfigs.Configs that are objects (so that have a descendance) with at least one property: they are the data of the section folders
                const sectionsData = this.onlineConfigs.Configs;
                const sectionsArray = Object.values(sectionsData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});


                let html = type == "section" ? `
                    <div class="online-cfg-picker-menu-dir-tree ${type} show" data-path="${sectionsData.path}">
                        <div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang == "fr" ? "fr" : "en"}"></div>
                        <div class="online-cfg-picker-menu-dir-tree-nb-cfgs">${sectionsData.nbCfgs} config${sectionsData.nbCfgs>1?"s":""}</div>
                        <div class="online-cfg-picker-menu-dir-tree-body">
                ` : "";

                html += sectionsArray.map(sectionDirData => {       // Dir: Section
                    // Creating an array containing all the properties' value of sectionDirData that are objects (so that have a descendance) with at least one property: they are the data of the year folders
                    const yearsArray = Object.values(sectionDirData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});
                    
                    const name = sectionDirData.path.split("/").at(-1);
                    
                    
                    let out = type == "year" ? `
                    <div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${sectionDirData.path}">
                        <div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang == "fr" ? "fr" : "en"}"></div>
                        <div class="online-cfg-picker-menu-dir-tree-nb-cfgs">${sectionDirData.nbCfgs} config${sectionDirData.nbCfgs>1?"s":""}</div>
                        <div class="online-cfg-picker-menu-dir-tree-body">
                    ` : "";
                    
                    out += type == "section"
                    ? `
                    <div class="online-cfg-picker-menu-dir-card ${type}" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${sectionDirData.path}">${name}</div>
                    `
                    : yearsArray.map(yearDirData => {               // Dir: Year
                        // Creating an array containing all the properties' value of yearDirData that are objects (so that have a descendance) with at least one property: they are the data of the prom folders
                        const promsArray = Object.values(yearDirData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});
                        const name = yearDirData.path.split("/").at(-1);
                        let out = type == "prom" ? `
                        <div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${yearDirData.path}">
                            <div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang == "fr" ? "fr" : "en"}"></div>
                            <div class="online-cfg-picker-menu-dir-tree-nb-cfgs">${yearDirData.nbCfgs} config${yearDirData.nbCfgs>1?"s":""}</div>
                            <div class="online-cfg-picker-menu-dir-tree-body">
                        ` : "";
                        
                        out += type == "year"
                        ? `
                        <div class="online-cfg-picker-menu-dir-card ${type}" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${yearDirData.path}">${name}</div>
                        `
                        : promsArray.map(promDirData => {           // Dir: Prom
                            // Creating an array containing all the properties' value of promDirData that are objects (so that have a descendance) with at least one property: they are the data of the configs
                            const configsArray = Object.keys(promDirData).map(key => {if (key != "nbCfgs" && key!= "path") {return key}}).filter(value => {return value});
                            const name = promDirData.path.split("/").at(-1);
                            this.tempGitConfigParentDirData = promDirData;
                            let out = type == "config" ? `
                            <div class="online-cfg-picker-menu-dir-tree ${type}" data-path="${promDirData.path}">
                                <div class="online-cfg-picker-menu-dir-tree-header ${type} ${this.lang == "fr" ? "fr" : "en"}"></div>
                                <div class="online-cfg-picker-menu-dir-tree-nb-cfgs">${promDirData.nbCfgs} config${promDirData.nbCfgs>1?"s":""}</div>
                                <div class="online-cfg-picker-menu-dir-tree-body">
                            ` : "";
                            
                            out += type == "prom" ? `
                                <div class="online-cfg-picker-menu-dir-card ${type}" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${promDirData.path}">${name}</div>
                            `
                            : configsArray.map(configName => {      // Dir: Config
                                const path = this.tempGitConfigParentDirData.path+"/"+configName, name = configName.match(/.+ - (.+)\.json/)[1];
                                return `
                                    <div class="online-cfg-picker-menu-dir-card config" id="online-cfg-picker-menu-dir-card-config-${name}" data-path="${path}" data-url="${this.tempGitConfigParentDirData[configName]}">${name}</div>
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
                                alert(this.lang == "fr" 
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
                                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);
                                    this.saveConfig();
                                } catch (e) {
                                    // ignore storage errors
                                }
                            }
                            else {
                                console.log(parsed);
                                debugger;
                                alert(this.lang == "fr" 
                                    ? `Ce fichier de configuration est invalide ! Je ne trouve pas les données attendmodules !`
                                    : `This configuration file is invalid! I don't find the expected datas!`
                                )
                            }

                            // Re-render dashboard to reflect imported config
                            try { 
                                const pickerMenu = document.getElementById("pickerMenu"); 
                                pickerMenu?.classList?.remove("show");
                                this.timeouts.closePickerMenu = setTimeout(() => {
                                    pickerMenu?.remove()
                                    this.removeSubjectCardFromSubjectSelection(); 
                                    this.getGradesDatas();
                                    this.generateContent(); 
                                    this.scrollToClientHighestElem("", {id: "main-average-card", margin: 10, smooth: true});
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
                    input.style.display = 'none';
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






        // MARK: -Keyboard Events
        generalKeyboardEvents(mode="general", target=undefined) {
            const noModifierAllowed = {alt:"forbidden", ctrl:"forbidden", shift:"forbidden", meta:"forbidden", repeat:"forbidden"};
            const shiftRequired = {alt:"forbidden", ctrl:"forbidden", shift:"required", meta:"forbidden", repeat:"forbidden"};
            if (mode == "general") {
                document.onkeydown = (e) => {
                    if      (this.keyInputMatch(e, "E", shiftRequired)) {
                        
                        this.editMode = !this.editMode;
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_EDIT_MODE", this.editMode);

                        this.removeSubjectCardFromSubjectSelection();
                        this.scrollToClientHighestElem();
                        this.generateContent();
                    }
                    else if (this.keyInputMatch(e, "D", shiftRequired)) {
                        const subjectCards            = document.querySelectorAll(".subject-card");
                        const nbSubjectCards          = subjectCards.length;
                        const nbCompactSubjectCards   = document.querySelectorAll(".subject-card.compact").length;
                        const detailedBtn             = document.getElementById('view-btn-detailed');
                        const compactBtn              = document.getElementById('view-btn-compact');

                        this.compactSubjCardsId = [];

                        if (detailedBtn.classList.contains("active")) {
                            if (nbCompactSubjectCards == nbSubjectCards) {
                                this.viewMode = "detailed";
                                detailedBtn.classList.add("active")
                                compactBtn.classList.remove("active")
                            }
                            else {
                                this.viewMode = "compact";
                                subjectCards.forEach(subjCard => {this.compactSubjCardsId.push(subjCard.id)})
                                detailedBtn.classList.remove("active")
                                compactBtn.classList.add("active")
                            }
                        }
                        else {
                            if (nbCompactSubjectCards == 0) {
                                this.viewMode = "compact";
                                subjectCards.forEach(subjCard => {this.compactSubjCardsId.push(subjCard.id)})
                                detailedBtn.classList.remove("active")
                                compactBtn.classList.add("active")
                            }
                            else {
                                this.viewMode = "detailed";
                                detailedBtn.classList.add("active")
                                compactBtn.classList.remove("active")
                            }
                        }

                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE", this.viewMode);
                        this.scrollToClientHighestElem();
                        this.generateContent();
                    }
                    else if (this.keyInputMatch(e, "L", shiftRequired)) {
                        
                        this.lang = this.lang == "fr" ? "en" : "fr";
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)

                        if (this.lang == "fr") {
                            document.getElementById('fr-lang-btn').classList.add('active')
                            document.getElementById('en-lang-btn').classList.remove('active')
                        }
                        else {
                            document.getElementById('fr-lang-btn').classList.remove('active')
                            document.getElementById('en-lang-btn').classList.add('active')
                        }
                        
                        this.scrollToClientHighestElem();
                        this.generateContent(false);
                    }
                    else if (this.keyInputMatch(e, "F", shiftRequired)) {
                        const className = "module-header", timeout = 210, highestElemInPageHandleType = "last above", smooth = true;

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
                    else if (this.keyInputMatch(e, ["ArrowLeft", "ArrowRight", "/"], shiftRequired)) {
                        const increment = e.key == "ArrowLeft" ? -1 : 1;
                        document.querySelectorAll('.filter-tab').forEach((t, _index) => {if (t.classList.contains("active")) {this.currentSemester = _index}; t.classList.remove('active')});

                        const newSem = (this.currentSemester + increment)%11;
                        const newActiveSemFilterTab = document.querySelector(".filter-tabs").children[newSem >= 0 ? newSem : 10];
                        newActiveSemFilterTab.classList.add("active");
                        this.currentSemester = newActiveSemFilterTab.dataset.filter;
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);
                        
                        this.removeSubjectCardFromSubjectSelection();
                        this.generateContent();
                    }
                };
            }
            if (mode == "edit sim grade") {
                document.onkeydown = (e) => {
                    if (this.keyInputMatch(e, "Enter", noModifierAllowed)) {
                        if (target.classList.contains("simulated-grade-input")) {

                            if      (target.classList.contains("sim-inp-type")) {
                                const simInpGrade = document.querySelector(`.simulated-grade-input.sim-inp-grade[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
                                simInpGrade.focus({preventScroll: true, focusVisible: true});
                                const simInpGradeCoord = simInpGrade.getBoundingClientRect().top;
                                
                                if (simInpGradeCoord < 0 || simInpGradeCoord > window.innerHeight) {
                                    simInpGrade.scrollIntoView({block: "center", smooth: true});
                                }
                            }
                            else if (target.classList.contains("sim-inp-grade")) {
                                const simInpCoef = document.querySelector(`.simulated-grade-input.sim-inp-coef[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
                                simInpCoef.focus({preventScroll: true, focusVisible: true});
                                const simInpCoefTopCoord = simInpCoef.getBoundingClientRect().top;
                                
                                if (simInpCoefTopCoord < 0 || simInpCoefTopCoord > window.innerHeight) {
                                    simInpCoef.scrollIntoView({block: "center", smooth: true});
                                }
                            }
                            else if (target.classList.contains("sim-inp-coef")) {
                                const simAddBtn = document.querySelector(`.sim-add-btn[data-subj="${target.dataset.subj}"][data-semester="${target.dataset.semester}"]`);
                                this.subjectSimAddBtnAction(simAddBtn);
                            }

                        }
                    }
                }
            }
        };

    }

    window.onload = () => { new ECAMDashboard(); };
    
})();