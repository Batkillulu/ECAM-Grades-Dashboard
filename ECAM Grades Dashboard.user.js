// ==UserScript==
// @name         ECAM Grades Dashboard
// @version      2.0
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @author       Baptiste JACQUIN
// @match        https://espace.ecam.fr/group/education/notes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ecam.fr
// @grant        none
// @run-at       document-end
// @license      AGPL-3.0; Commercial license available
// ==/UserScript==
//
// Copyright (C) 2025 Maxence Leroux & Baptiste Jaquin
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, version 3.
//
// Free for individual student use.
// Institutional or official use requires a commercial license.


(function() {
    'use strict';

    //#region -======= STYLES CSS =======

        let styles = ``;


        // MARK: -DASHBOARD
        styles += `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            * { box-sizing: border-box; }
            .ecam-dash { 
                display: grid; 
                flex-direction: column; 
                justify-content:center; 
                width: 97%; 
                grid-template-columns: 100%; 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; 
                margin: 20px 1.5% 0px 1.5%; 
                color: #1a1a1a; 
            }

            .dash-header { background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; padding: 30px 40px; border-radius: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 3px 5px 5px 0px #00000042; }
            .dash-title { font-size: 24px; font-weight: 700; margin: 0; }
            .dash-subtitle { font-size: 14px; opacity: 0.95; margin-top: 5px; }
        `;
        
        
        // MARK: buttons
        styles += `
            .lang-btn           { border: 2px solid #000000ff; background: #6f79ff; border-radius: 18px; width: 36px; height: 36px; }
            .lang-btn.active    { border: 2px solid #ceefffff; }
            .lang-btn:hover     { border: 2px solid #afe4ffff; background: #a6acff; }

            .import-menu        { display: flex; justify-content: space-around; position: absolute; right: 4%; top: 220px; background: transparent; color: transparent; box-shadow: 0px 0px 20px 0px #00000000; font-size: 15px; border-radius: 13px; min-height: 60px; width: 30%; align-items: center; transition: all 0.2s ease; }
            .import-menu.show   { background: white; color: black; top: 230px; box-shadow: 5px 4px 20px 0px #00000066; }
            .import-menu-btn        { display: flex; justify-content: center; align-items: center; text-align: center; user-select: none; cursor: pointer; border-radius: 12px; border: 2px solid; height: 30px; width: 45%; padding: 5px; }
            .import-menu-btn.file   {  }
            .import-menu-btn.online {  }
            

            .online-cfg-picker-menu         { --bg-end-color: white; --bg-start-color: #ffffff61; --bg-start-gradient: 20%; display: flex; flex-direction: column; justify-content: flex-start; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; z-index: 1000; border-radius: 20px; border: 0px solid #ffffff; background: radial-gradient(closest-corner, var(--bg-start-color) var(--bg-start-gradient), var(--bg-end-color)); opacity: 0; transition: all 0.3s ease; }
            .online-cfg-picker-menu.show    { 
                height: calc(100% - 60px); width: calc(100% - 60px); 
                top: 30px; left: 30px; 
                border: 8px solid #ffffff; 
                opacity: 1;
            }
            .online-cfg-picker-menu-header          { display: flex; justify-content: flex-end; height: 40px; align-items: center; }
            .online-cfg-picker-menu-close-btn           { display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; border-radius: 15px; border: 2px solid; font-size: 20px; user-select: none; cursor: pointer; margin-right: 3px; transition: all 0.2s ease; }
            .online-cfg-picker-menu-close-btn:hover     { width: 40px; height: 40px; border-radius: 20px; font-size: 30px; margin-right: -2px; gap: 5px; }

            .online-cfg-picker-menu-body            { display: flex; flex-direction: row; justify-content: center; align-items: center; height: calc(100% - 40px); width: 100%; gap: 5px; }
            .online-cfg-picker-menu-dir-tree            { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 0px; position: relative; color: transparent; border-radius: 16px; border: 2px solid; background: white; overflow: clip; opacity: 0; transition: all 0.3s ease; }
            .online-cfg-picker-menu-dir-tree.show       { width: 150px; left: 0px; color: black; opacity: 1; }
            .online-cfg-picker-menu-dir-tree.section    { z-index: 1004; }
            .online-cfg-picker-menu-dir-tree.year       { z-index: 1003; }
            .online-cfg-picker-menu-dir-tree.prom       { z-index: 1002; }
            .online-cfg-picker-menu-dir-tree.config     { z-index: 1001; }
            .online-cfg-picker-menu-dir-tree-header     { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 20px; width: 100%; font-size: 15px; padding: 5px; }
            .online-cfg-picker-menu-dir-tree-body       { display: flex; flex-direction: column; justify-content: center; align-items: center; height: calc(100% - 20px); width: 95%; }

            .online-cfg-picker-menu-dir-card                { display: flex; justify-content: center; align-items: center; height: 40px; width: 90%; position: relative; border-radius: 16px; border: 2px solid; background: white; cursor: pointer; overflow: clip; padding: 5px; margin: 5px 0px; user-select: none; transition: all 0.3s ease; }
            .online-cfg-picker-menu-dir-card.on             { width: 100%; border-radius: 16px; background: #7c85ff; }

            
            .header-actions                 { display: flex; gap: 12px; }
            .btn                                { display: flex; justify-content: center; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px; }
            .btn-edit-mode:hover:not(:disabled) { transform: scale(0.95); background: linear-gradient(135deg, #7d92eeff 0%, #8e5ebeff 100%); }
            .btn-edit-mode                      { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: grid; width: 126px; height: 108px; transition: all 0.2s ease }
            .btn-edit-mode.on                   { transform: scale(0.95); box-shadow: inset 0px 0px 6px 4px #ffffff; }
            .btn-export                         { background: white; color: #666; display: flex; align-items: center; width: 140px; height: 50px; }
            .btn-import                         { background: white; color: #666; display: flex; align-items: center; width: 140px; height: 50px; }
            .btn-export:hover                   { border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
            .btn-import:hover                   { border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
            .btn-icon                           { font-size: 20px; margin-bottom: 2px }
            .btn:disabled                       { opacity: 0.5; cursor: not-allowed; }
        `;


        // MARK: main average card
        styles += `
            .main-average-card { background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 15px; border: 2px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; transition: box-shadow 0.3s ease, border-color 0.3s ease; user-select: none }

            .average-display { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 7px; }
            .average-number { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
            .average-label { font-size: 18px; color: #666; font-weight: 500; }
            .average-stats { display: flex; gap: 30px; }
            .stat-item { text-align: center; }
            .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
            .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
        `;


        // MARK: new grades
        styles += `
            .new-grades-card                { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px; width: 100%; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87; scroll-margin-top: 105px; transition: box-shadow 0.2s ease}
            .new-grades-card.myhighlight    { box-shadow: 0px 0px 20px 20px #322bff87; }
            .new-grades-card.none           { border: 2px solid #446dff; background: #f7f9ffff; box-shadow: none; }
            .new-grades-card-title          { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 5px; display:flex; align-items:center }
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
            .view-toggle        { display: flex; background: #f7f7f7; padding: 4px; border-radius: 8px; gap: 8px; align-items: center; }
            .view-btn           { background: transparent; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; width: 48px; height: 40px; }
            .view-btn:hover     { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
            .view-btn.active    { background: white; box-shadow: 3px 5px 5px 0px #00000042; }
        `;



        // MARK: -CONTENT AREA
        styles += `
            .content-area { display: grid; gap: 24px; }
        `;




        // MARK: Intranet table
        styles += `
            .intranet-collapse { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; }
            .intranet-collapse:hover { background: #f3f4f6; }
            .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
            .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
            .intranet-toggle.openLeft { transform: rotate(-180deg); }
            .intranet-toggle.openRight { transform: rotate(180deg); }
        `;


        // MARK: semester section
        styles += `
            .semester-section { display: flex; flex-direction: column; align-items: center; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
            .semester-header { display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f9fafb; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; cursor: pointer; }
            .semester-header:hover { background: #f3f4f6; }
            .semester-info { display: flex; align-items: center; gap: 12px; }
            .semester-name { font-size: 18px; font-weight: 600; color: #1a1a1a; }
            .semester-average { padding: 6px 12px; background: white; border-radius: 8px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
            .average-good { color: #10b981; border: 1px solid #10b98130; }
            .average-medium { color: #f59e0b; border: 1px solid #f59e0b30; }
            .average-bad { color: #ef4444; border: 1px solid #ef444430; }
            .semester-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
            .semester-toggle.open { transform: rotate(180deg); }
            .semester-content               { padding: 24px; display: none; }
            .semester-content.show          { display: flex; flex-direction: row; width: 100%; gap: 0px; transition: width 0.2s ease, gap 0.2s ease; }
            .semester-content.show.dragging { width: 73%; gap: 20px; }
        `;
            


        // MARK: -MODULES SECTION
        styles += `

            .modules-section                                { display: flex; flex-direction: column; gap: 20px; align-items: center; width: 100%; }
        `;
            

        //#region: -DROP FIELDS REGION
            styles += `
                .drop-field     { display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; mix-blend-mode: multiply; overflow: clip; user-select: none; }
                `;
                

            // MARK: drop create fields
            styles += `
                .drop-field.create-ue                           { position: fixed; top: 50px; right:0px; height: calc(100% - 100px); width: 0%; border: 2px dashed #7fc2ff; border-radius: 20px 0px 0px 20px; border-color: #7fc2ff00; background: #bdb8ff00; font-weight: 800; color: #7fc2ff00; z-index: 301; transition: all 0.2s ease; }
                .drop-field.create-ue.show                      { width: 15%; border-width: 2px 0px 2px 2px; border-color: #7fc2ff; color: #7fc2ff; background: #bdb8ff3d; }
                .drop-field.create-ue.hover                     { background: #d3d0ffce; }
                .drop-field-create-ue-plus                      { position: relative; font-size: 50px; transform: rotate( 0deg); transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-create-ue-plus.hover                { right: 4px; font-size: 90px; transform: rotate(-90deg); }
                .drop-field-create-ue-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-create-ue-text.top                  { bottom:  10px; right:0px; }
                .drop-field-create-ue-text.bottom               { top:     10px; left: 0px; }
                .drop-field-create-ue-text.top.hover            { bottom:  30px; right:20px; font-size: 30px; }
                .drop-field-create-ue-text.bottom.hover         { top:     30px; left: 20px; font-size: 30px; }

                .drop-field-create-ue-text.top.fr::before       { content: "Créer un"; }
                .drop-field-create-ue-text.bottom.fr::after     { content: "nouveau module"; }
                .drop-field-create-ue-text.top.en::before       { content: "Create a"; }
                .drop-field-create-ue-text.bottom.en::after     { content: "new module"; }

                .drop-field-create-ue-hitbox                    { position: fixed; top: 50px; right:0px; height: calc(100% - 100px); width: 0%; border-radius: 20px 0px 0px 20px; transition: all 0.2s ease; }
                .drop-field-create-ue-hitbox.show               { width: 15%; border-width: 2px 0px 2px 2px; cursor: pointer; z-index: 302; }
                `;
                

            // MARK: drop remove fields
            styles += `

                
                .drop-field.remove-from-ue                      { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border: 2px dashed #ff7f7f; border-radius: 0px 20px 20px 0px; border-color: #ff7f7f00; background: #ffb8b800; font-weight: 800; color: #ff7f7f00; z-index: 301; transition: all 0.2s ease; }
                .drop-field.remove-from-ue.show                 { width: 15%; border-width: 2px 2px 2px 0px; border-color: #ff7f7f; color: #ff7f7f; background: #ffb8b83d; cursor: pointer; }
                .drop-field.remove-from-ue.hover                     { background: #ffb8b8ce; }
                .drop-field-remove-from-ue-minus                     { position: relative; font-size: 50px; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-remove-from-ue-minus.hover               { font-size: 90px; animation: 0.3s slightHorizShake ease; }
                .drop-field-remove-from-ue-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-field-remove-from-ue-text.top                  { bottom:  10px; left: 0px; }
                .drop-field-remove-from-ue-text.bottom               { top:     10px; right:0px; }
                .drop-field-remove-from-ue-text.top.hover            { bottom:  30px; left: 20px; font-size: 30px; }
                .drop-field-remove-from-ue-text.bottom.hover         { top:     30px; right:20px; font-size: 30px; }

                .drop-field-remove-from-ue-text.top.fr::before       { content: "Enlever"; }
                .drop-field-remove-from-ue-text.bottom.fr::after     { content: "du module"; }
                .drop-field-remove-from-ue-text.top.en::before       { content: "Remove"; }
                .drop-field-remove-from-ue-text.bottom.en::after     { content: "from module"; }
                @keyframes slightHorizShake { 0% {left: 0px} 25% {left: 3px} 50% {left: -3px} 75% {left: 3px} 100% {left: 0px} }

                .drop-field-remove-from-ue-hitbox                    { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border-radius: 0px 20px 20px 0px; transition: all 0.2s ease; }
                .drop-field-remove-from-ue-hitbox.show               { width: 15%; border-width: 2px 2px 2px 0px; cursor: pointer; z-index: 302; }
                `;
                

            // MARK: drop insert fields
            styles += `

                .drop-field.insert-field.ue                      { justify-content: flex-start; height: 0px; width: 100%; color: #9b9b9b00; border: 2px dashed #9b9b9b00; background: #bdb8ff00; font-size: 25px; font-weight: 800; user-select: none; margin: -12px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.ue.show                 { color: #9b9b9bff; border-color: #9b9b9bff; opacity: 0.5; border-width: 2px 0px; border-radius: 0px;   height: 50px; background: #bdb8ff3d; margin: 0px; }
                .drop-field.insert-field.ue.show.hover           { color: #887bffff; border-color: #7fc2ffff; opacity: 1;   border-width: 2px 2px; border-radius: 20px; }

                .drop-field.insert-field.subject                 { justify-content: flex-start; height: 0px; width: 100%; color: #9b9b9b00; border: 2px dashed #9b9b9b00; background: #bdb8ff00; font-size: 25px; font-weight: 800; user-select: none; margin: -6px 0px; transition: all 0.2s ease; }
                .drop-field.insert-field.subject.show            { color: #9b9b9bff; border-color: #9b9b9b54; opacity: 0.5; border-width: 2px 0px; border-radius: 0px;  height: 30px; background: #bdb8ff1a; margin: 0px; }
                .drop-field.insert-field.subject.show.hover      { color: #887bffff; border-color: #7fc2ffff; opacity: 1;   border-width: 2px 2px; border-radius: 20px; }
                
                .drop-ue-card-insert-content                        { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; height: 50px; overflow: clip; top:-2px; }
                .drop-ue-card-insert-content.plus                   {  }
                .drop-ue-card-insert-content.arrow                  { top: -52px; }
                .drop-ue-card-insert-content.text                   { overflow: visible; top: -102px }
                .drop-ue-card-insert-content.text.add               { justify-content: center; }
                .drop-ue-card-insert-content.text.insert            { justify-content: flex-start; }

                .drop-ue-card-insert-arrow                          { transform: translate(70px,  5px); font-size: 500px; display: flex; align-items: flex-start; justify-content: center; height: 50px; width: 100%; background: transparent; opacity: 0;                         transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-ue-card-insert-arrow.show                     { opacity: 0.5; }
                .drop-ue-card-insert-arrow.show.hover               { transform: translate(170px, 5px); opacity: 1; }

                .drop-ue-card-insert-plus                           { transform: translate(  0px, 14px) rotate(  0deg); font-size: 50px ;  position: relative; left: 0px; display: flex; justify-content: center; height: 50px; width: 100%; background: transparent; opacity: 0;   transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-ue-card-insert-plus.show                      { opacity: 0.5; }
                .drop-ue-card-insert-plus.show.hover                { transform: translate(130px, 30px) rotate(180deg); font-size: 280px; opacity: 1; }

                .drop-ue-card-insert-text                           { display: flex; justify-content: flex-start; align-items: center; position: relative; overflow-x: clip; text-wrap: nowrap; width: 0px; height: 50px; background: transparent; opacity: 0.5;                transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }

                .drop-ue-card-insert-text.add.fr                { --width: 263px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-ue-card-insert-text.add.en                { --width: 230px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-ue-card-insert-text.insert.fr             { --width: 150px; --x-translation:  50px; }
                .drop-ue-card-insert-text.insert.en             { --width: 150px; --x-translation:  50px; }

                .drop-ue-card-insert-text.add.fr::before            { content: "Ajouter un module ici";}
                .drop-ue-card-insert-text.add.en::before            { content: "Add a module here";}
                .drop-ue-card-insert-text.add                       { width: 0px; right: 0px; }
                .drop-ue-card-insert-text.add.hover                 { width: var(--width); right: var(--x-translation); opacity: 1; }
                
                .drop-ue-card-insert-text.insert.fr::before         { content: "Insérer ici"; }
                .drop-ue-card-insert-text.insert.en::before         { content: "Insert here"; }
                .drop-ue-card-insert-text.insert                    { width: 0px; right: calc(var(--x-translation) + var(--width) - 50%); }
                .drop-ue-card-insert-text.insert.hover              { width: var(--width); right: calc(var(--width) - 50%); opacity: 1; }

                .drop-ue-card-insert-hitbox                     { display: flex; position: relative; top: -152px; width: calc(100% - -4px); min-height: 50px; border-radius: 20px; cursor: pointer; }
                

                .drop-subject-card-insert-content                   { position: relative; display: flex; align-items: center; width: 100%; height: 30px; overflow: clip; top:-2px; }
                .drop-subject-card-insert-content.plus              {  }
                .drop-subject-card-insert-content.arrow             { top: -32px; }
                .drop-subject-card-insert-content.text              { overflow: visible; top: -62px }
                .drop-subject-card-insert-content.text.add          { justify-content: center; }
                .drop-subject-card-insert-content.text.insert       { justify-content: flex-start; }
                
                .drop-subject-card-insert-arrow                     { transform: translate(0%, 0px); font-size: 280px; display: flex; align-items: flex-start; justify-content: center; height: 30px; width: 100%; background: transparent; opacity: 0;                        transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-subject-card-insert-arrow.show                { opacity: 0.5; }
                .drop-subject-card-insert-arrow.show.hover          { transform: translate(9%, 0px); opacity: 1; }

                .drop-subject-card-insert-plus                      { transform: translate(0%, 4px) rotate(0deg)   ; font-size: 50px;  position: relative; left: 0px; display: flex; justify-content: center; height: 30px; width: 100%; background: transparent; opacity: 0;  transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                .drop-subject-card-insert-plus.show                 { opacity: 0.5; }
                .drop-subject-card-insert-plus.show.hover           { transform: translate(9%, 80%) rotate(180deg); opacity: 1; font-size: 200px; }

                .drop-subject-card-insert-text                      { display: flex; justify-content: flex-start; align-items: center; position: relative; overflow-x: clip; text-wrap: nowrap; width: 0px; height: 50px; background: transparent;  opacity: 0.5;               transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }

                .drop-subject-card-insert-text.add.fr           { --width: 280px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-subject-card-insert-text.add.en           { --width: 230px; --x-translation: calc(0.5*var(--width) - 20px); }
                .drop-subject-card-insert-text.insert.fr        { --width: 123px; --x-translation:  50px; }
                .drop-subject-card-insert-text.insert.en        { --width: 135px; --x-translation:  50px; }

                .drop-subject-card-insert-text.add.fr::before       { content: "Ajouter une matière ici";}
                .drop-subject-card-insert-text.add.en::before       { content: "Add a subject here";}
                .drop-subject-card-insert-text.add                  { width: 0px; right: 0px; }
                .drop-subject-card-insert-text.add.hover            { width: var(--width); right: var(--x-translation); opacity: 1; }
                
                .drop-subject-card-insert-text.insert.fr::before    { content: "Insérer ici"; }
                .drop-subject-card-insert-text.insert.en::before    { content: "Insert here"; }
                .drop-subject-card-insert-text.insert               { width: 0px; right: calc(var(--x-translation) + var(--width) - 50%); }
                .drop-subject-card-insert-text.insert.hover         { width: var(--width); right: calc(var(--width) - 50%); opacity: 1; }

                .drop-subject-card-insert-hitbox                { display: flex; position: relative; top: -92px; width: calc(100% - -4px); min-height: 30px; border-radius: 20px; cursor: pointer; }
                
            `;
        //#endregion
            


        // MARK: -UE CARDS
        styles += `

            .semester-grid      { display: grid; width: 100%; gap: 20px; transition: gap 0.2s ease; }
            .ue-card                { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fafafa; border-radius: 25px; border: 3px solid #e5e5e5; scroll-margin-top: 70px; transition: all 0.2s ease; }
            .ue-card.collapse       { border-radius: 25px; border: 0px solid #e5e5e5; }
            .ue-card.validated      { border-color: #10b981ff; background: #f0fdf4ff; }
            .ue-card.failed         { border-color: #ef4444ff; background: #fef2f2ff; }
            .ue-card.unknown        { border-color: #6d6d6dff; background: #d1d1d1ff; }

            .ue-header                  { display: flex; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 22px 22px 0px 0px; width: 100%; cursor: pointer; z-index: 1; }
            .ue-header.collapse         { border-width: 3px; border-style: solid; border-radius: 22px 22px 22px 22px; }
            .ue-header.validated        { border-color: #10b981ff; background: #e0ffeaff; }
            .ue-header.failed           { border-color: #ef4444ff; background: #ffd9d9ff; }
            .ue-header.unknown          { border-color: #6d6d6dff; background: #acacacff; }
            .ue-header:hover            { background: #f3f4f6; }
            .ue-delete-btn                  { border-radius: 14px; background: transparent; }
            .ue-title                    { font-size: 16px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
            .ue-title.input              { font-size: 16px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }
            .ue-subject-total-coef-value { display: flex; gap: 15px; font-weight: 600; }

            .ue-card-content            { display: flex; flex-direction: row; width: 98%; height: 100%; align-items: center; gap: 0px; margin: 8px 0px 18px 0px; transition: all 0.2s ease; }
            .ue-card-content.collapse   { height: 0%; margin: 0px; }
            .ue-card-content.edit-mode  { gap: 1% }

            .ue-info                        { display: flex; flex-direction: row; justify-content: space-around; align-items: center; width:97%; background: #eef2ff00; border:1px solid #c7d2fe00; padding: 0px 8px 3px 8px; border-radius: 0px 0px 8px 8px; margin-top: -1px; height: 36px; transition: all 0.2s ease; }
            .ue-info.collapse               { height: 0px; padding: 0px; }
            .ue-info-bar                    { display: flex; flex-direction: row; justify-content: space-around; align-items: center; width:48%; background: #eef2ff;   border:1px solid #c7d2fe;   padding: 3px 8px 3px 8px; border-radius: 0px 0px 8px 8px; }
            .ue-info-clear                  { display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 220px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
            .ue-info-clear:hover            { width: 240px; margin-right: 4px; font-size: 11.5px; background: #eef2ff; }
            .ue-info-clear.disabled         {  }
            .ue-info-clear.sim              {  }

            .ue-details                     { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 15px; transition: all 0.2s ease; }
            .ue-details.edit-mode           { gap: 8px; }
            .ue-details.collapse            { gap: 0px; }
            .ue-moyenne                     { font-size: 24px; font-weight: 800; display: flex; align-items: center; gap:10px; width: 193px; }
            .ue-moyenne.good                { color: #10b981; }
            .ue-moyenne.bad                 { color: #ef4444; }
            .ue-moyenne.unknown             { color: #6d6d6dff; }
            .ue-toggle                      { width: 24px; height: 24px; font-size: 18px; color: #000000; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; margin-left: 5px; }
            .ue-toggle.open                 { transform: rotate(180deg); }

        `;
            


        // MARK: -UNCLASSIFIED SECTION
        styles += `

            .unclassified-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; transition: height 0.2s ease; }
            .unclassified-content   { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 99%; height: 100%; }
            .unclassified-title     { display: flex; align-items: center; gap: 8px; width: 97%; font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; }
        `;
            


        // MARK: -SUBJECT CARDS
        styles += `

            .subject-card               { display: flex; flex-direction: column; align-items: center; border: 4px solid #ffffffff; border-radius: 20px; width: 100%; background: #c5c5c5; transition: width 0.3s ease, box-shadow 0.1s ease, opacity 0.2s ease, height 0.2s ease, padding 0.2s ease, border-width 0.2s ease; }
            .subject-card.good          { box-shadow: 0px 0px 0px 0px #39ff8f; background: #f0fdf4; }
            .subject-card.good:hover    { box-shadow: 0px 0px 7px 0px #39ff8f; }
            .subject-card.meh           { box-shadow: 0px 0px 0px 0px #fff27b; background: #fff2e4; }
            .subject-card.meh:hover     { box-shadow: 0px 0px 7px 0px #fff27b; }
            .subject-card.bad           { box-shadow: 0px 0px 0px 0px #ff7b7b; background: #fef2f2; }
            .subject-card.bad:hover     { box-shadow: 0px 0px 7px 0px #ff7b7b; }
            .subject-card.unknown       { box-shadow: 0px 0px 0px 0px #6d6d6d; background: #c5c5c5; }
            .subject-card.unknown:hover { box-shadow: 0px 0px 7px 0px #6d6d6d; }
            
            .subject-card-header        { display: flex; align-items: center; height: 62px; width: 100%; padding: 5px 0px; border-radius: 20px 20px 0px 0px; background: #b8b8b8; font-weight:600; border-bottom: 4px solid white; }
            .subject-card-header.good   { background: #e3ffeb; }
            .subject-card-header.meh    { background: #ffe8d0; }
            .subject-card-header.bad    { background: #ffe0e0; }
            .subject-name               { font-weight: 800; color: #1a1a1a; font-size: 14px }
            .subject-name.input         { font-weight: 800; color: #1a1a1a; font-size: 14px; border: 2px solid #797979; border-radius: 15px; padding-left: 8px; width: 100%; height: 25px;}
            .subject-coef-input-box     { padding-left: 5px; width: 48px; border-radius: 8px; }
            .subject-card.compact                       { display:flex; flex-direction: row; justify-content:space-between; align-items:center; padding: 7px 0px; border-radius: 16px; border: 3px solid #ffffff; height: 68px; width: 100%; min-width: 380px; transition: all 0.2s ease; background: none; }
            .subject-card.compact.edit-mode             {  }
            .subject-card.compact.good                  { background: #e3ffeb; }
            .subject-card.compact.meh                   { background: #ffe8d0; }
            .subject-card.compact.bad                   { background: #ffe0e0; }
            .subject-card.compact.unknown               { background: #c5c5c5; }
            .subject-card.compact:hover                 { background: #f3f4f6; box-shadow: inset 0px 0px 8px 1px #0032ff42; }
            .subject-card.compact.edit-mode:hover       { transform: scale(0.995); }
            .subject-card.unclassified                  { display: flex; flex-direction: column; align-items: center; border: 2px solid #ffe4cd; border-radius: 20px; width:100%; background: white; user-select: none; margin: 0px; transition: width 0.3s ease, box-shadow 0.1s ease; }
            .subject-card.unclassified.good             { box-shadow: 0px 0px 0px 0px #39ff8f; background: #f0fdf4; }
            .subject-card.unclassified.good:hover       { box-shadow: 0px 0px 5px 0px #39ff8f; }
            .subject-card.unclassified.bad              { box-shadow: 0px 0px 0px 0px #ff7b7b; background: #fef2f2; }
            .subject-card.unclassified.bad:hover        { box-shadow: 0px 0px 5px 0px #ff7b7b; }
            .subject-card-header.unclassified           { display:flex; flex-direction: row; align-items:center; border-radius: 20px 20px 0px 0px; border-bottom: 2px solid #ffe4cd; gap:8px; font-weight:700; height: 60px; width: 100%; vertical-align:top; font-size:15px }
            .subject-card-header.unclassified.good      { background: #e3ffeb; }
            .subject-card-header.unclassified.bad       { background: #ffe0e0; }
            
            .subject-card.collapse      { opacity: 0; height: 0px; border-width: 0px; padding: 0px; }


            .subject-insert-field                        { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
            .subject-insert-field.show                   { height: 50px; margin: 10px 0px; }
            .grades-table-subject-total-coef-value      { display: flex; gap: 15px }
            .subj-moyenne        { font-size: 16px; font-weight: 800; }
            .subj-moyenne.good   { color: #10b981; }
            .subj-moyenne.bad    { color: #ef4444; }
            .selected-subject-card-notif-container          { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; left: calc(99% - 20%); z-index: 302; transition: width 0.3s ease; }
            .selected-subject-card-notif-div                { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
            .selected-subject-card-notif-div.on             { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
            .selected-subject-card-notif-div-del-btn        { color: #640000; font-size: 20px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
            .selected-subject-card-notif-div-del-btn:hover  { color: #ffffff; }
        `;
            

        // MARK: grades table
        styles += `

            .grade-row                           { border-bottom: 1px solid white /* #e4e4e4 */; height: 39px; transition: background 0.3s ease; }
            .grade-row.last                      { vertical-align: baseline; border-bottom: none; height: 41px; }
            .grade-row.sim                       { background: #e9efff9a; }
            .grade-row:hover                     { background: #eeedfd; }
            .grades-table                        { width: 98%; background: #c5c5c5; }
            .grades-table.compact                { margin: -12px 20px 20px 20px; }
            .grades-table.good                   { background: #f0fdf4}
            .grades-table.meh                    { background: #fff2e4}
            .grades-table.bad                    { background: #fef2f2}
            .grades-table th                     { padding: 10px 12px; height: 39px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border: 3px solid white; border-right-width: 2px; border-left-width: 2px; border-top-width: 0px; text-align: center; }
            .grades-table td                     { padding: 10px; font-size: 14px; }
            .grades-table-type                   { padding-left:30px; width: 30%; }
            .grades-table-grade                   { width: 13%; text-align: right; }
            .grades-table-coef                   { width: 10%; text-align: right; }
            .grades-table-classAvg               { width: 10%; text-align: right; }
            .grades-table-date                   { width: 10%; text-align: right; }
            .grades-table-teacher                { display: table-cell; font-size:12px;color: #999; text-align: end; width: 32%; }
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
            .sim-add-btn                { width: 67px; max-width: 140px; justify-content: center; border-radius: 15px; border: 1px solid; padding: 6px 10px; height: 25px; user-select: none; }
            .grade-simulee-input         { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
            .grade-simulee-input.sim-inp-type    { width: 55%;  max-width:250px; height:25px }
            .grade-simulee-input.sim-inp-grade    { width: 100%; max-width:75px;  height:25px }
            .grade-simulee-input.sim-inp-coef    { width: 100%; max-width:60px;  height:25px }
            .grade-simulee-input.sim-inp-date    { width: 100%; max-width:140px; height:25px }
            .grade-simulee-input-edit    { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
            .grade-sim-del-btn           { border: none; border-radius: 6px; cursor: pointer; }
            .grade-checkbox  { cursor: pointer; }
        `;
            

        // MARK: icons
        styles += `

            .collapse-icon  { cursor: pointer; user-select: none; }
            .drag-icon      { cursor: pointer; user-select: none; }
            .tick-icon      { height: 23px; width: 23px; font-size: 35px; color: #004cff; cursor:pointer; user-select:none; }
        `;
            

        // MARK: Animations
        styles += `

            @media (max-width: 768px)   { 
                .config-layout { grid-template-columns:1fr; } 
                .config-sidebar { border-right:none; border-bottom:1px solid #e5e5e5; padding-right:0; padding-bottom:20px; } 
                .dash-header { flex-direction:column; align-items:start; gap:16px; } 
                .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } 
            }
            .loading            { text-align: center; padding: 40px; color: #999; }
            @keyframes dots     { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
            .loading::after     { content: '...'; animation: dots 1.5s steps(4, end) infinite; }

            @keyframes fadeIn   { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .fade-in            { animation: fadeIn 0.3s ease; }
            @keyframes scrollTo { 15% {scale: 100% 100%;} 100% {scale: 105% 105%; border: 5px solid #5f77ff} }
            .scroll-to          { animation: 0.3s 2 alternate scrollTo ease }
        `;



    //#endregion
    
    
    
    
    
    // MARK: -=======================







    const ERROR503 = document.title == '503 Service Unavailable' || document.title == 'ECAM Grades Dashboard - Transform Your Grade Experience';
    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    if (ERROR503) { document.body.children[0].remove(); document.body.children[0].remove(); }

    //MARK: -
    class ECAMDashboard {

        constructor() {
            this.now    = () => {return new Date().toISOString().replace(/\.(\d{3})/, "")};                         // Current date and time in ISO String, removing the milliseconds
            this.hour   = () => {return new Date().toISOString().replace(/\:\d{2}\:\d{2}\.(\d{3})Z/, ":00:00Z")};   // Current date and time in ISO String, rounded down to the hour
            this.today  = new Date().toISOString().split('T')[0];                                                   // Current date in ISO String
            this.ISOTimeOfLastUpdate            = localStorage.getItem("ECAM_DASHBOARD_ISO_TIME_OF_LAST_UPDATE")    || this.now();
            this.dateOfLastLoad                 = localStorage.getItem("ECAM_DASHBOARD_DATE_OF_LAST_LOAD")          || this.today;

            this.grades     = [];
            this.semesters  = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};
            this.savedReadGrades    = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"))         || [] ;
            this.sim                = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES"))                || {};
            this.newGrades = [];
            
            this.repo               = "https://github.com/Batkillulu/ECAM-Grades-Dashboard";
            this.repoAPI            = "https://api.github.com/repos/Batkillulu/ECAM-Grades-Dashboard";
            this.repoContentsAPI    = "https://api.github.com/repos/Batkillulu/ECAM-Grades-Dashboard/contents";
            this.repoMainBranchAPI  = "https://api.github.com/repos/Batkillulu/ECAM-Grades-Dashboard/branches/main";
            this.repoScriptRaw      = "https://github.com/Batkillulu/ECAM-Grades-Dashboard/raw/refs/heads/main/ECAM%20Grades%20Dashboard.user.js";
            this.fallbackRepoApi    = "https://api.github.com/repos/Batkillulu/Miscelleneous_Tempermonkey_UserScripts/contents";
            
            this.lastGitFetchState = -1;
            this.getLastGitFetchState = (state, fallback) => {
                this.lastGitFetchState = state;
                if (state == 404) {     // Shouldn't reach this, since now the ECAM-Grades-Dashboard repo is public and its github API is accessible
                    this.getConfigsFromRepo(this.repoContentsAPI, this.getLastGitFetchState, fallback)
                }
            };
            this.gitFetchScanDoneArray = [];
            this.tempGitConfigParentDirData = {};
            this.onlineConfigs                  = localStorage.getItem("ECAM_DASHBOARD_ONLINE_CONFIGS")             || {
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
                date: this.today,
            };
            
            this.configVersion = 2;
            this.ueConfig           = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_UE_CONFIG"))                 || {};
            this.ignoredGrades      = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_IGNORED_GRADES"))            || [];
            this.gradesDatas = {};


            this.defSem                         = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_SEMESTER")           || "all";
            this.currentSemester = this.defSem;

            this.defView                        = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE")          || "detailed";
            this.viewMode = this.defView;

            this.lang                           = localStorage.getItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE")           || "en";
            this.tempSelection = {};
            this.draggedSubjId = "";
            this.editMode = false;

            this.mobileVer = false;
            this.clientWidth = 1920;

            this.selectedSubjectCards = [];
            this.selectedSubjectCardsSortedByUe = {};
            this.scrollToThisElem = "";

            this.ERROR503 = document.title == '503 Service Unavailable' || document.title == 'ECAM Grades Dashboard - Transform Your Grade Experience';

            this.init();
        }


        //#region -REGION: Misc methods

            // MARK: scrollToClientHighestElem
            /**
             * Scroll to an element depending on the target element datas passed as argument under the form of an object. If using the className method and not the id method, please make sure the elements of class className are in column.
             * 
             * Priority order defined by parameter `priority`. Scan through all the given classNames. If no match is found on a className: 
             * - **"first"**: **moves onto the next one**. The method will scroll to the **first** data matching the conditions, and skip the rest.
             * - **"last"**:  **skip the rest**. The method will scroll to the **last** data matching the conditions, and skip the rest. If no match is found at all, doesn't scroll.
             * 
             * Behavior changes along with **`highestElemInPageHandleType`**'s value. Scan through all target element datas given, and (with X being an int between 0 and 100):
             * - **"none"**:                   scroll to the top of the first element - *out of all the others* - (who's class name matches the `targetElementDatas`'s property `className`) **SUCH THAT** it's the highest element in the current window view who's center doesn't go out of the screen from the top
             * - **"above"/"above X%"**:       scroll to the top of the first element - *out of all the others* - (who's class name matches the `targetElementDatas`'s property `className`) **SUCH THAT** it's the highest element in the current window view who's center doesn't go out of the screen from the top **IFF** the first - *and only the first, so the highest* - element of same class is above X% (default 50%) of the screen
             * - **"partial"/"partial X%"**:   scroll to the top of the first - *and only the first*    - element (who's class name matches the `targetElementDatas`'s property `className`) **IF** its top edge is above X% (default 50%) of the screen **AND** still in the view
             * - **"absolute"/"absolute X%"**: scroll to the top of the first - *and only the first*    - element (who's class name matches the `targetElementDatas`'s property `className`) **IF** its top edge is above X% (default 50%) of the screen
             * - **"force"**:                  scroll to the top of the first - *and only the first*    - element (who's class name matches the `targetElementDatas`'s property `className`). No condition, just forces the scroll to the top of this element
             * 
             * In any case, the scroll is executed (after the `timeout` property of the same `targetElementDatas`) with respects to the `margin` property of the same `targetElementDatas` (it will be attributed as `marginScrollTop` style property of the element to scroll to)
             * 
             * @returns The element that was scrolled to, or null if no element was scrolled to
             * @param {String} priority             {@link https://github.com String},  default: "first" — Defines how multiple `targetElementDatas` input are managed. Can be "first" or "last"
             * @param targetElementDatas Any amount of objects. If ommited, uses a default object. Objects should all have the following properties (if any is omitted, they are given their default value):
             * 
             * **`className?`**                     {@link https://github.com String},  default: ".subject-card" — name of the class to target, if you want to target a category of elements
             * 
             * **`id?`**                            {@link https://github.com String},  default: "" —              ID of the element to target, if you want to target a specific element (ensure your element has an ID tho)
             * 
             * **`margin?`**                        {@link https://github.com Number},  default: 23 (in px) —      used for define the marginScrollTop CSS style property of the element targeted
             * 
             * **`timeout?`**                       {@link https://github.com Number},  default: 50 (in ms) —      timer before the scroll action is triggered
             * 
             * **`smooth?`**                        {@link https://github.com Boolean}, default: false —           if true, the page will smoothly scroll to the element targeted
             * 
             * **`highestElemInPageHandleType?`**   {@link https://github.com String},  default: "none" —          can be "force", "absolute", "absolute X%", "partial", "partial X%", "above", "above X%" or "none" (with X being an int between 0 and 100). Any other value will be considered as "none"
             */
            scrollToClientHighestElem(priority="first", ...{className= ".subject-card", id="", margin=this.editMode ? 90 : 20, timeout=20, smooth=false, highestElemInPageHandleType="none"}) {
                const defaultTargetElementDatas = [
                    {className: ".modules-section",         margin: 20,                        highestElemInPageHandleType:"partial"}, 
                    {className: ".ue-card",                 margin: this.editMode ? 90 : 20,   highestElemInPageHandleType:"above"},
                    {className: ".unclassified-section",    margin: this.editMode ? 90 : 20,   highestElemInPageHandleType:"partial"},
                    {className: ".subject-card",            margin: 10,                        highestElemInPageHandleType:"above"},
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

                const abovePattern  =      /above( (100)%| (\d{1,2})%|)/;
                const partialPattern  =  /partial( (100)%| (\d{1,2})%|)/;
                const absolutePattern = /absolute( (100)%| (\d{1,2})%|)/;
                const highestElemInPageHandleTypePattern = RegExp("none|" + abovePattern.source + "|" + partialPattern.source + "|" + absolutePattern.source);
                
                this.scrollToThisElem = ""; let targetDataIndex = -1;
                
                argumentsArray.forEach((targetElemData, targetIndex) => {

                    if (
                        ( //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                            /* ensuring the priority to the first element of the first class className found */
                            (
                                targetDataIndex < 0 
                                && (effectivePriority.toLowerCase()||"first") == "first"
                            ) 
                            || 
                            (
                                targetDataIndex == targetIndex-1 
                                && (effectivePriority.toLowerCase()||"last") == "last"
                            )
                        )//////////////////////////////////////////////////////////////////////////////////////////////////////
                    ) { // ensuring the priority to the first element of the first class className found
                        
                        targetElemData.highestElemInPageHandleType = targetElemData?.highestElemInPageHandleType?.toLowerCase()?.trim() || highestElemInPageHandleType;
                        if (!targetElemData?.highestElemInPageHandleType?.match(highestElemInPageHandleTypePattern)) {
                            targetElemData.highestElemInPageHandleType = "none";
                        }


                        if (targetElemData?.id=="" || !document.getElementById(targetElemData?.id || id)) { // If no id is given, or if the given id doesn't correspond to any item in the document:

                            // getting the highest element of class className, as well as its top coordinate in the screen
                            const highestElem = document.querySelector(targetElemData?.className || className);
                            const highestElemCoords = highestElem?.getBoundingClientRect();
                            const highestElemTopCoord = highestElemCoords?.top;
                            const highestElemCenterCoord = (highestElemCoords?.top + highestElemCoords?.bottom)/2;

                            // if highestElemTopCoord < margin, then it means that the top of the highest element of class className has passed the top of the screen
                            
                            if ( // The highest elem case
                                (//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                                    /* Force case */
                                    targetElemData?.highestElemInPageHandleType?.toLowerCase() == "force"
                                    || 
                                    ( /* Partial case */
                                        targetElemData?.highestElemInPageHandleType?.match(partialPattern)

                                        &&  /* Is the top coordinate of the highest element of class className: */
                                        /* Above the required height (percentage of the total height)? */
                                        highestElemTopCoord < window.innerHeight* (targetElemData?.highestElemInPageHandleType?.match(partialPattern)?.[2] || 0.5)
                                        && 
                                        /* Below the top of the screen? */
                                        highestElemTopCoord >= 0
                                    )
                                    || 
                                    ( /* Absolute case */
                                        targetElemData?.highestElemInPageHandleType?.match(absolutePattern) 

                                        && /* Is the top coordinate of the highest element of class className: */
                                        /* Above the required height (percentage of the total height)? */
                                        highestElemTopCoord < window.innerHeight* (targetElemData?.highestElemInPageHandleType?.match(absolutePattern)?.[2] || 0.5)
                                    )
                                    ||
                                    ( /* Above case */
                                        targetElemData?.highestElemInPageHandleType?.match(abovePattern)

                                        && /* Is the top coordinate of the highest element of class className: */
                                        /* Above the required height (percentage of the total height)? */
                                        highestElemTopCoord < window.innerHeight* (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[2] || 0.5)

                                        && /* Is the center coordinate of the highest element of class className: */
                                        /* Below the top of the screen? */
                                        highestElemCenterCoord >= 0
                                    )
                                )//////////////////////////////////////////////////////////////////////////////////////////////////////
                            ) { 

                                this.scrollToThisElem = highestElem.id;
                                targetDataIndex = targetIndex;

                            }
                            else if (   // Get the first elem satisfying the condition.s corresponding to the className's highestElemInPageHandleType prop
                                (//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                                    /* None case */
                                    targetElemData?.highestElemInPageHandleType?.toLowerCase() == "none"
                                    || 
                                    ( /* Above case */
                                        targetElemData?.highestElemInPageHandleType?.match(abovePattern)
                                        
                                        && /* Is the top coordinate of the highest element of class className: */
                                        /* Below the top of the screen, taking into account the margin? */
                                        highestElemTopCoord < window.innerHeight* (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[2] || 0.5)
                                    )
                                )//////////////////////////////////////////////////////////////////////////////////////////////////////
                            ) {

                                document.querySelectorAll(targetElemData?.className || className).forEach((elem, _index) => {
                                    if (
                                        ( //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                                            /* ensuring the priority to the first element of the first class className found */
                                            (
                                                targetDataIndex < 0 
                                                && (effectivePriority.toLowerCase()||"first") == "first"
                                            ) 
                                            || 
                                            (
                                                targetDataIndex == targetIndex-1 
                                                && (effectivePriority.toLowerCase()||"last") == "last"
                                            )
                                        )//////////////////////////////////////////////////////////////////////////////////////////////////////
                                    ) {

                                        const elemCoordsClient = elem.getBoundingClientRect();
                                        const elemCenterClient = (elemCoordsClient.top + elemCoordsClient.bottom)/2;
    
                                        if (
                                            (//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                                                ( /* Checking if the element satisfies the conditions corresponding to its highestElemInPageHandleType */
                                                    ( /* None case */
                                                        targetElemData?.highestElemInPageHandleType?.toLowerCase() == "none" 
                                                        && /* Is the center of the currently observed element of class className: */
                                                        /* Below the top of the screen? */
                                                        elemCenterClient >= 0 
                                                    )
                                                    || 
                                                    ( /* Above case */
                                                        targetElemData?.highestElemInPageHandleType?.match(abovePattern)
                                                        && /* Is the top of the currently observed element of class className: */
                                                        /* Below the top of the screen? */
                                                        elemCenterClient >= 0 
                                                        &&
                                                        /* Above the required height (percentage of the total height) of the screen? */
                                                        elemCoordsClient.top < window.innerHeight* (targetElemData?.highestElemInPageHandleType?.match(abovePattern)?.[2] || 0.5)
                                                    )
                                                )
                                            )//////////////////////////////////////////////////////////////////////////////////////////////////////
                                        ) {
    
                                            this.scrollToThisElem = elem.id;
                                            targetDataIndex = targetIndex;
                                                        
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
                        const scrollToThisElem = document.getElementById(this.scrollToThisElem) || document.querySelector(targetElemData.className); 
                        scrollToThisElem.style.scrollMarginTop = `${(targetElemData?.margin || margin) + (document.body.classList.contains("lfr-dockbar-pinned") ? 45 : 0)}px`;
                        scrollToThisElem.scrollIntoView({behavior: (targetElemData?.smooth || smooth) ? "smooth" : "instant", block: "start"});
                        this.scrollToThisElem = "";
                    }, (targetElemData?.timeout || timeout))

                    return this.scrollToThisElem || String(targetElemData.className);
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
            saveConfig() { localStorage.setItem('ECAM_DASHBOARD_UE_CONFIG', JSON.stringify(this.ueConfig)); }
            saveSim() { this.deleteUnusedSimPath(); localStorage.setItem("ECAM_DASHBOARD_SIM_GRADES", JSON.stringify(this.sim)); }
            saveIgnoredGrades() { localStorage.setItem("ECAM_DASHBOARD_IGNORED_GRADES", JSON.stringify(this.ignoredGrades)); }
            ensureSimPath(sem=undefined, ue=undefined, subj=undefined) {
                if (sem)    {if(!this.sim?.[sem])               this.sim[sem]={}; }
                if (ue)     {if(!this.sim?.[sem]?.[ue])         this.sim[sem][ue]={}; }
                if (subj)   {if(!this.sim?.[sem]?.[ue]?.[subj]) this.sim[sem][ue][subj]=[]; }
            }
            deleteUnusedSimPath(flex=true, sem=undefined, ue=undefined, subj=undefined) {
                (sem ? [sem] : (flex ? Object.keys(this.sim || []) : [])).forEach(_sem => {
                    (ue ? [ue] : (flex ? Object.keys(this.sim?.[_sem] || []) : [])).forEach(_ue => {
                        (subj ? [subj] : (flex ? Object.keys(this.sim?.[_sem]?.[_ue] || []) : [])).forEach(_subj => {
                            if (Object.keys(this.sim?.[_sem]?.[_ue]?.[_subj])?.length == 0) {delete this.sim[_sem][_ue][_subj]}
                        })
                        if (Object.keys(this.sim?.[_sem]?.[_ue])?.length == 0) {delete this.sim[_sem][_ue]}
                    })
                    if (Object.keys(this.sim?.[_sem])?.length == 0) {delete this.sim[_sem]}
                })
            }
            clearSimGradesForUE(sem, ueName) {
                this.ensureSimPath(sem, ueName);
                delete this.sim[sem][ueName];
                if (this.sim[sem] == {}) delete this.sim[sem];
                this.saveSim()
                this.getGradesDatas();
            }
            getSimGrades(sem, ue, subj){ return (this.sim[sem]&&this.sim[sem][ue]&&this.sim[sem][ue][subj])||[]; }
            getAllSubjectsForUE(sem, ueName){
                const real = this.ueConfig?.[sem]?.[ueName]?.subjects || [];
                const simOnly = Object.keys(((this.sim[sem]||{})[ueName]||{}));
                return Array.from(new Set([...real, ...simOnly]));
            }
            calculateUEGrades(sem, ueName){
                const grades = [];
                const allSubjs = this.getAllSubjectsForUE(sem, ueName);
                allSubjs.forEach(subject=>{
                    const pct =         this.ueConfig?.[sem]?.[ueName]?.coefficients?.[subject] || 0;
                    const realGrades =  this.semesters?.[sem]?.[subject] || [];
                    const simGrades  =  this.getSimGrades(sem, ueName, subject).map(n=>({ ...n, __sim:true }));

                    const src = [...realGrades, ...simGrades];
                    src.forEach(n=>{
                        grades.push({
                            ...n,
                            coef: n.coef,
                            coefInUE: (n.coef||0) * (pct/100),
                            subject
                        });
                    });
                });
                return grades;
            }
            getGradeColor(grade) { if (grade >= 10) return 'good'; return 'bad'; }
            getAverageColor(avg) { if (avg >= 12) return 'average-good'; if (avg >= 10) return 'average-medium'; return 'average-bad'; }
            gradeIsDisabled(n) {
                return this.ignoredGrades?.includes([n.semester, n.subject, (n?.id || n.type + " " + n.date + " " + n.prof)].join("\\"))
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
                if (!this.ERROR503) {
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
                }
                else {
                    this.grades = new Array(this.savedReadGrades);
                }
            }
            getUnclassifiedSubjects(sem) {
                const classified = new Set();
                const ueConfig = this.ueConfig?.[sem] || {};
                Object.values(ueConfig).forEach(ue => { (ue.subjects||[]).forEach(m => classified.add(m)); });
                return Object.keys(this.semesters[sem]||{}).filter(m => !classified.has(m));
            }
            getUEStats() {
                let validated = 0, total = 0;
                Object.keys(this.ueConfig).forEach(sem => {
                    Object.keys(this.ueConfig[sem]).forEach(ueName => {
                        const ueGrades = this.calculateUEGrades(sem, ueName);
                        const moyenne = this.moyennePonderee(ueGrades);
                        if (moyenne != 0 && ueGrades.length > 0) total++; if (moyenne >= 10) validated++;
                    });
                });
                return { validated, total };
            }
            clearIgnoredGradesForUE(sem, ueName) {
                // Clear ignored grades only for the specified UE
                const allSubjs = this.getAllSubjectsForUE(sem, ueName);

                // Keep ignored grades that are NOT part of this UE
                this.ignoredGrades = this.ignoredGrades?.filter(ignoredId => {
                    const parts = ignoredId.split("\\");
                    const semX = parts[0];
                    const subj = parts[1];
                    return semX !== sem || !allSubjs.includes(subj);
                });
                this.saveIgnoredGrades();
                this.getGradesDatas();
            }
            compareArraysofObjects(a, b) {
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
                if (document.querySelector(".new-grades-notif") == null && !this.ERROR503) 
                {
                    const notifDiv = document.createElement("div");
                    notifDiv.className = "new-grades-notif";
                    notifDiv.innerHTML = this.lang == "fr" ? `NOUVELLE NOTE${this.newGrades.length>1 ? "S !" : " !"}` : `NEW GRADE${this.newGrades.length>1 ? "S!" : "!"}`;
                    notifDiv.innerHTML += `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌
                    </button>`;
                    document.querySelector(".portlet-boundary").appendChild(notifDiv);
                    setTimeout(() => {if (this.newGrades.length > 0) {document.querySelector(".new-grades-notif").classList.add("on")}}, 10)
                }
                else if (this.ERROR503) {
                    const notifDiv = document.createElement("div");
                    notifDiv.className = "new-grades-notif";
                    notifDiv.innerHTML = `Debug mode: Service is unavailable`;
                    notifDiv.innerHTML += `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌
                    </button>`;
                    document.body.appendChild(notifDiv);
                    setTimeout(() => {document.querySelector(".new-grades-notif").classList.add("on")}, 10)
                }
                else
                {
                    document.querySelector(".new-grades-notif").innerHTML = this.lang == "fr" ? `NOUVELLE NOTE${this.newGrades.length>1 ? "S !" : " !"}` : `NEW GRADE${this.newGrades.length>1 ? "S!" : "!"}` +
                    `<button id="closeNewGradesNotif" style="padding-bottom: 3px;font-size: 10px;display: flex;width: 21px;height: 21px;position: fixed;right: calc(5% - -15px);border-radius: 5px;border: 3px solid #e0e6ff;justify-content: center;align-items: center;align-content: center;">❌
                    </button>`;
                }

                document.querySelector(".new-grades-notif").onclick = () => {
                    const newGradesCard = document.querySelector(".new-grades-card");
                    newGradesCard.scrollIntoView({behavior: "instant"});
                    newGradesCard.classList.add("myhighlight");
                    setTimeout(() => {newGradesCard.classList.remove("myhighlight")},200)
                };

            }
            draggableIcon(source="subject-card", {height=25, type="unknown", targetId="none"}={height: 25, type: "unknown", targetId:"none"}) {
                return `<img class="drag-icon for-${source}" data-targetid="${targetId}" data-type="${type}" draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/960px-Hamburger_icon.svg.png" alt="☰" style="height:${height}px; ${source.match(/-subject-card/) ? "border: 2px solid; border-radius: 8px;" : ""}">`
            }
            /** Call inside a onkeydown or onkeyup event listener
             *  
             * @param {KeyboardEvent} keyboardEvent Pass the keyboard event trigger onkey event from which this method is called
             * @param {String} keyPressed The key expected to be pressed
             * @param {Object} param2 All the modifiers. Each element of this object `alt`, `ctrl`, `shift`, `meta`, and `repeat` take as value on of the following Strings: "required", "allowed", "dont care", 
             * @returns {RegExpMatchArray} A formated RegExpMatchArray result following the key and the modifiers given as parameters
             */
            keyMatch(keyboardEvent, keyPressed="(.+)", {alt="whatever", ctrl="whatever", shift="whatever", meta="whatever", repeat="whatever"}={alt:"whatever", ctrl:"whatever", shift:"whatever", meta:"whatever", repeat:"whatever"}) {
                const e = keyboardEvent;
                const key = `${e.altKey ? "alt" : "no-alt"} ${e.ctrlKey ? "+ ctrl" : "+ no-ctrl"} ${e.shiftKey ? "+ shift" : "+ no-shift"} ${e.metaKey ? "+ meta" : "+ no-meta"} + ${e.key} (${e.repeat ? "repeat" : "no-repeat"})`;

                let altPattern, ctrlPattern, shiftPattern, metaPattern, repeatPattern;
                if (alt    === "required") {altPattern    = "(alt)"}    else if (alt    === "whatever") {altPattern    = "(alt|no-alt)"}        else if (alt    === "forbidden") {altPattern    = "(no-alt)"}              
                if (ctrl   === "required") {ctrlPattern   = "(ctrl)"}   else if (ctrl   === "whatever") {ctrlPattern   = "(ctrl|no-ctrl)"}      else if (ctrl   === "forbidden") {ctrlPattern   = "(no-ctrl)"}          
                if (shift  === "required") {shiftPattern  = "(shift)"}  else if (shift  === "whatever") {shiftPattern  = "(shift|no-shift)"}    else if (shift  === "forbidden") {shiftPattern  = "(no-shift)"}         
                if (meta   === "required") {metaPattern   = "(meta)"}   else if (meta   === "whatever") {metaPattern   = "(meta|no-meta)"}      else if (meta   === "forbidden") {metaPattern   = "(no-meta)"}          
                if (repeat === "required") {repeatPattern = "(repeat)"} else if (repeat === "whatever") {repeatPattern = "(repeat|no-repeat)"}  else if (repeat === "forbidden") {repeatPattern = "(no-repeat)"}       

                const keyPattern = RegExp(`${altPattern} \\+ ${ctrlPattern} \\+ ${shiftPattern} \\+ ${metaPattern} \\+ ${keyPressed} \\(${repeatPattern}\\)`);
                const match = key.match(keyPattern);
                return match;
            }

            // MARK: Set total coefs
            setGradesTableTotalCoef() {
                const good="#10b981", meh="#e98c00", bad="#e90000", unknown="#7a7a7a";

                document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoefDiv => {
                    const 
                        sem = totalCoefDiv.dataset.semester,
                        ue = totalCoefDiv.dataset.ue,
                        ueData = this.gradesDatas[sem][ue],
                        nbSubjects = Object.keys(ueData.subjects).length,
                        
                        nbGrades =                      ueData.nbGrades,
                        simGrades =                     ueData.simGrades, 
                        disabledRealGrades =            ueData.disabledRealGrades, 
                        disabledSimGrades =             ueData.disabledSimGrades, 

                        totalCoefSubjects =             ueData.totalCoefSubjects, 
                        totalCoefGrades =               ueData.totalCoefGrades,  
                        totalCoefRealGrades =           ueData.totalCoefRealGrades, 
                        totalCoefSimGrades =            ueData.totalCoefSimGrades, 
                        totalCoefEnabledGrades =        ueData.totalCoefEnabledGrades, 
                        totalCoefEnabledRealGrades =    ueData.totalCoefEnabledRealGrades, 
                        totalCoefEnabledSimGrades =     ueData.totalCoefEnabledSimGrades, 


                        subjectsBelow100 =              ueData.subjectsBelow100, 
                        subjectsOver100 =               ueData.subjectsOver100,
                        subjectsReallyBelow100 =        ueData.subjectsReallyBelow100, 
                        subjectsReallyOver100 =         ueData.subjectsReallyOver100,
                            
                        nbSubjectsBelow100 =            subjectsBelow100.length, 
                        nbSubjectsOver100 =             subjectsOver100.length, 
                        nbSubjectsReallyBelow100 =      subjectsReallyBelow100.length, 
                        nbSubjectsReallyOver100 =       subjectsReallyOver100.length, 
                        nbSubjectsSimBelow100 =         nbSubjectsBelow100-nbSubjectsReallyBelow100, 
                        nbSubjectsSimOver100 =          nbSubjectsOver100-nbSubjectsReallyOver100, 
                        nbDisabledRealGrades =          disabledRealGrades.length, 
                        nbSimGrades =                   simGrades.length, 
                        nbEnabledSimGrades =            nbSimGrades - disabledSimGrades.length
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
                                ? `${100*totalCoefEnabledSimGrades/totalCoefEnabledGrades}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
                                : `${100*totalCoefEnabledSimGrades/totalCoefEnabledGrades}% of your grades is simulated, all your grades aren't out yet!`
                            ;
                            color = meh;
                        }
                        else if (totalCoefEnabledSimGrades == 0) {
                            advice = this.lang == "fr" ? `Toutes tes notes ne sont encore pas là !` : `All your grades aren't out yet!`;
                            color = meh;
                        }
                    }
                    else if (totalCoefRealGrades > 100) {
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

                    totalCoefDiv.innerHTML = `<span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}% / ${totalCoefSubjects}%</span>${advice}`;
                })
                document.querySelectorAll(".grades-table-subject-total-coef-value").forEach(totalCoefDiv => {
                    const 
                        sem = totalCoefDiv.dataset.semester,
                        ue = totalCoefDiv.dataset.ue,
                        subject = totalCoefDiv.dataset.subject,
                        subjectData = this.gradesDatas[sem][ue].subjects[subject],

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
                                ? `${nbEnabledSimGrades}% de tes notes est simulé, toutes tes notes ne sont encore pas là !` 
                                : `${nbEnabledSimGrades}% of your grades is simulated, all your grades aren't out yet!`
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
                    
                    totalCoefDiv.innerHTML = `<span style="color:${color}; font-weight: 900">${totalCoefEnabledGrades}%</span>${advice}`;
                })
            }
            // MARK: getGradesDatas
            getGradesDatas({sem=undefined, ue=undefined, subj=undefined}={sem: undefined, ue: undefined, subj: undefined}) {
                // FOR EACH SEMESTER
                (sem && this.ueConfig[sem] ? [sem] : Object.keys(this.semesters)).forEach((semX) => {
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


                    // FOR EACH UE IN SEMESTER (if any)
                    if (this.ueConfig?.[semX]?.__ues__) {
                        (ue && this.ueConfig?.[sem]?.__ues__.includes(ue) ? [ue] : this.ueConfig[semX].__ues__).forEach((ueName) => {
                            const allSubjs = this.getAllSubjectsForUE(semX, ueName);
                            const ueGrades = this.calculateUEGrades(semX, ueName);

                            semData[ueName] = {};
                            
                            let ueData = semData[ueName];
                            
                            ueData.ueName                       = ueName;
                            ueData.subjects                     = {};
                            ueData.nbGrades                     = 0;
                            ueData.simGrades                    = [];
                            ueData.disabledRealGrades           = [];
                            ueData.disabledSimGrades            = [];
                            ueData.subjectsBelow100             = [];
                            ueData.subjectsOver100              = [];
                            ueData.subjectsReallyBelow100       = [];
                            ueData.subjectsReallyOver100        = [];
                            ueData.subjectsNoGrade              = [];
                            ueData.coefSubjectsNoGrade          = 0;
                            ueData.average                      = 0;
                            ueData.classAvg                     = 0;
                            ueData.totalCoefSubjects            = 0;
                            ueData.totalCoefGrades              = 0;
                            ueData.totalCoefRealGrades          = 0;
                            ueData.totalCoefSimGrades           = 0;
                            ueData.totalCoefEnabledGrades       = 0;
                            ueData.totalCoefEnabledRealGrades   = 0;
                            ueData.totalCoefEnabledSimGrades    = 0;

                            (this.ueConfig?.[semX]?.[ueName]?.subjects?.length > 0 ? this.ueConfig[semX][ueName].subjects : []).forEach(subject => {
                                ueData.subjects[subject] = {grades: []};
                            })
                            
                            ueGrades.forEach(n => {
                                const subjectName = n.subject;
                                let subjectData = ueData.subjects[subjectName];
                                
                                if (!subjectData) {
                                    subjectData = {grades: []};
                                }
                                subjectData.grades.push(n);
                                ueData.nbGrades++;
                            });

                            

                            // FOR EACH SUBJECT IN UE
                            (subj && this.ueConfig?.[sem]?.[ue]?.subjects?.includes(subj) ? [subj] : allSubjs).forEach(subjectName => {

                                let subjectData = ueData.subjects[subjectName];

                                subjectData.subjName                    = subjectName;
                                subjectData.coef                        = this.ueConfig[semX][ueName].coefficients[subjectName];
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
                                

                                ueData.totalCoefSubjects += parseInt(subjectData.coef);
                                
                                
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


                                            ueData.totalCoefGrades                  += coef*subjCoef/100;
                                            ueData.totalCoefRealGrades              += coef*subjCoef/100;

                                            ueData.totalCoefEnabledGrades           += coef*subjCoef/100;
                                            ueData.totalCoefEnabledRealGrades       += coef*subjCoef/100;
                                        break;

                                        case `disabled real grade`:
                                            subjectData.classAvg                    += classAvg*coef/100;
                                            subjectData.totalCoefRealGrades         += coef;
                                            subjectData.disabledRealGrades.push(grade);

                                            ueData.totalCoefGrades                  += coef*subjCoef/100;
                                            ueData.totalCoefRealGrades              += coef*subjCoef/100;

                                            ueData.disabledRealGrades.push(grade);
                                        break;

                                        case `enabled sim grade`:
                                            subjectData.simGrades.push(grade);
                                            subjectData.totalCoefSimGrades          += coef;

                                            subjectData.average                     += gradeValue*coef/100;
                                            subjectData.totalCoefEnabledGrades      += coef;
                                            subjectData.totalCoefEnabledSimGrades   += coef;


                                            ueData.simGrades.push(grade);
                                            ueData.totalCoefGrades                  += coef*subjCoef/100;
                                            ueData.totalCoefSimGrades               += coef*subjCoef/100;

                                            ueData.totalCoefEnabledGrades           += coef*subjCoef/100;
                                            ueData.totalCoefEnabledSimGrades        += coef*subjCoef/100;
                                        break;

                                        case `disabled sim grade`:
                                            subjectData.simGrades.push(grade);
                                            subjectData.totalCoefSimGrades          += coef;
                                            subjectData.disabledSimGrades.push(grade);

                                            ueData.simGrades.push(grade);
                                            ueData.totalCoefGrades                  += coef*subjCoef/100;
                                            ueData.totalCoefSimGrades               += coef*subjCoef/100;

                                            ueData.disabledSimGrades.push(grade);
                                        break;
                                    }
                                })
                                
                                
                                
                                if (subjectData.totalCoefEnabledGrades == 0) {
                                    subjectData.average  = " - ";
                                    subjectData.classAvg = " - ";
                                    ueData.subjectsNoGrade.push(subjectName);
                                    ueData.coefSubjectsNoGrade += subjectData.coef;
                                }
                                else {
                                    subjectData.average     =  Math.round(100*subjectData.average /(subjectData.totalCoefEnabledGrades/100))/100;
                                    subjectData.classAvg    =  Math.round(100*subjectData.classAvg/(subjectData.totalCoefEnabledGrades/100))/100;

                                    ueData.average          += subjectData.average *subjectData.coef/100;
                                    ueData.classAvg         += subjectData.classAvg*subjectData.coef/100;
                                }

                                subjectData.totalCoefGrades             = Math.round(subjectData.totalCoefGrades);
                                subjectData.totalCoefRealGrades         = Math.round(subjectData.totalCoefRealGrades);
                                subjectData.totalCoefSimGrades          = Math.round(subjectData.totalCoefSimGrades);
                                subjectData.totalCoefEnabledGrades      = Math.round(subjectData.totalCoefEnabledGrades);
                                subjectData.totalCoefEnabledRealGrades  = Math.round(subjectData.totalCoefEnabledRealGrades);
                                subjectData.totalCoefEnabledSimGrades   = Math.round(subjectData.totalCoefEnabledSimGrades);


                                if      (subjectData.totalCoefGrades < 100) ueData.subjectsBelow100.push(subjectName);
                                else if (subjectData.totalCoefGrades > 100) ueData.subjectsOver100 .push(subjectName);

                                if      (subjectData.totalCoefRealGrades < 100) ueData.subjectsReallyBelow100.push(subjectName);
                                else if (subjectData.totalCoefRealGrades > 100) ueData.subjectsReallyOver100 .push(subjectName);
                            });


                            if (ueData.subjectsNoGrade.length == Object.keys(ueData.subjects).length) {
                                ueData.average  = " - ";
                                ueData.classAvg = " - ";
                            }

                            if (!isNaN(Number(ueData.average))) {
                                ueData.average  =  Math.round(100*ueData.average /((ueData.totalCoefSubjects-ueData.coefSubjectsNoGrade)/100))/100;
                                ueData.classAvg =  Math.round(100*ueData.classAvg/((ueData.totalCoefSubjects-ueData.coefSubjectsNoGrade)/100))/100;
                            }

                            if (isNaN(Number(ueData.average))) {
                                ueData.average  = " - ";
                                ueData.classAvg = " - ";
                            } 
                            

                            ueData.totalCoefSubjects                =  Math.round(ueData.totalCoefSubjects);
                            ueData.totalCoefGrades                  =  Math.round(ueData.totalCoefGrades);
                            ueData.totalCoefRealGrades              =  Math.round(ueData.totalCoefRealGrades);
                            ueData.totalCoefSimGrades               =  Math.round(ueData.totalCoefSimGrades);
                            ueData.totalCoefEnabledGrades           =  Math.round(ueData.totalCoefEnabledGrades);
                            ueData.totalCoefEnabledRealGrades       =  Math.round(ueData.totalCoefEnabledRealGrades);
                            ueData.totalCoefEnabledSimGrades        =  Math.round(ueData.totalCoefEnabledSimGrades);
                            
                        })
                    }
                    
                })
            }

        //#endregion





        //#region -REGION: Online methods
            
            getConfigsFromRepo(repoAPIUrl, callback, endActionCallback) {

                
                this.onlineConfigs = {Configs: {nbCfgs: 0, path: ""}, nbCfgs: 0, date: this.today};
                
                // Fetch repo's API data
                const xhttp = new XMLHttpRequest();
                xhttp.open("GET", repoAPIUrl, true);
                xhttp.send();

                xhttp.onload = () => {
                    // If couldn't find the repo's API data, try again with the test repo Miscelleneous_Tempermonkey_UserScripts
                    if (xhttp?.status == "404") {
                        callback(xhttp?.status, endActionCallback);
                        return;
                    }
                    else {
                        this.lastGitFetchState = xhttp?.status;
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
                            localStorage.setItem("ECAM_DASHBOARD_ONLINE_CONFIGS", this.onlineConfigs);
                            endActionCallback();
                        };
                    }})
                }
                
            }

            async autoUpdateCheck() {
                if (this.dateOfLastLoad < this.today) {
                    this.runUpdateCheck();
                }
            }

            async runUpdateCheck() {
                const xhttp = new XMLHttpRequest(); 
                xhttp.open("GET", this.repoMainBranchAPI, true); 
                xhttp.send(); 
                xhttp.onload = () => {
                    const resp = JSON.parse(xhttp.response);
                    
                    if (resp.commit.commit.committer.date > this.ISOTimeOfLastUpdate) {
                        this.ISOTimeOfLastUpdate = resp.commit.commit.committer.date;
                        localStorage.setItem("ECAM_DASHBOARD_ISO_TIME_OF_LAST_UPDATE", this.ISOTimeOfLastUpdate)

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
                            <a class="update-btn" id="updateBtn" href="${this.repoScriptRaw}" target="_blank">${this.lang == "fr" ? "Installer" : "Install"}</a>
                        </div>
                        <div style="display: flex; justify-content: center; width: 50%">
                            <div class="dismiss-update-btn" id="dismissUpdateBtn" title="${this.lang == "fr" ? "Ignorer pour aujourd'hui" : "Ignore for today"}">${this.lang == "fr" ? "Ignorer" : "Ignore"}</div>
                        </div>
                    </div>
                `;

                document.querySelector(".ecam-dash").insertBefore(updateAvailableNotif, document.querySelector(".dash-header"));
                setTimeout(() => {updateAvailableNotif.classList.add("on")}, 500);
                updateAvailableNotif.querySelector(".dismiss-update-btn").onclick = () => {
                    this.dateOfLastLoad = this.today; 
                    localStorage.setItem("ECAM_DASHBOARD_DATE_OF_LAST_LOAD", this.dateOfLastLoad);

                    updateAvailableNotif.classList.remove("on");
                    setTimeout(() => {updateAvailableNotif.remove()}, 300)
                };
            }
            
        //#endregion




        // MARK: -INIT
        init() {
            this.autoUpdateCheck();
            this.parseGrades();
            this.getGradesDatas();

            if (this.savedReadGrades.length == 0) {
                this.newGrades = [];
                this.grades.forEach(e => {this.savedReadGrades.push(e)})
                localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades));
            }
            if (this.clientWidth <= 935) {
                this.clientWidth = 935;
                this.mobileVer = true;
            }
            
            this.generalKeyboardEvents();

            this.newGrades = this.compareArraysofObjects(this.grades, this.savedReadGrades).more;
            this.createNewGradesNotifDiv();
            this.createDashboard();
            
            this.dateOfLastLoad = this.today;
            localStorage.setItem("ECAM_DASHBOARD_DATE_OF_LAST_LOAD", this.dateOfLastLoad);
        }




        //#region -REGION: Render




        
            // MARK: -createDashboard
            createDashboard() {
                const container = document.createElement("div");
                container.className = "ecam-dash";
                const moyenneGenerale = this.moyennePonderee(this.grades);
                const totalGrades = this.grades.length;
                const ueStats = this.getUEStats();

                document.querySelector(".site-breadcrumbs").remove();
                document.querySelector(".portlet-topper").remove();

                // Creating the content of the dashboard that doesn't vary along with the user's actions besides the language selection.
                // Therefore, the text isn't yet created, but will be in the renderContent() method later on, to regenerate the text in case the language is changed
                container.innerHTML = `
                <div id="emptyDiv"></div>
                <div class="dash-header">
                    <div style="display: bloc">
                        <img draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/5/51/ECAM-LaSalle-bleu-seul.png" alt="ECAM Logo" style="margin: -136px -444px -121px -43px; height: 141px; width: 148px;">
                        <div style="margin: 0px 40px 0px 100px;">
                            <div class="dash-title"></div>
                            <p class="dash-subtitle"></p>
                            <div style="display: flex; gap: 2px">
                                <div class="lang-btn ${this.lang == "fr" ? "active" : ""}" id="fr-lang-btn">
                                    <image style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇫🇷" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACTUExURUdwTAAkjM7Pzs7OzrMGE74QIMPEx4hTeAAkjQARewAagbIFEgAfhc3NzdDQ0M7PzrYMG8zMzbcMG8EXKcUbLQAMd7UKGLUKGMMWJ7OhrcMVJv///+oPIO4bLgAmoOwWKAAZmQArpO8iNgAfnQATlAIyqLUGFAEoksUSIwAYhgANePnCyMbO6djY2NUWJ+7u7sCep4f8c74AAAAbdFJOUwDL+z19ffsVe3qU1jy51pA+bLyNc+Vrnu+m2KjIWToAAALxSURBVFjD7djJcuIwEIDhAAMOxuwTCAnyKgxOxg7v/3SjtraWDJKTUw60K1Vc+OqX5APK09NjHvOLJxDz3a+t9Mcoeg7DgZrDcrkejUZBL2X7NuYfo4gRZ2MmNZvhYjEHz1EYrHab18tl3LaEEonFnOPT5KtWM1zMhReY27DabUG5ABQ8cyXLTnIy9pz+vcN8seFWPRxC32G7Hf+FGW/3m7fXVmkagJ5NpGXYCOjd5Or6ejGmaRpCctJw6HTqOgaEvM8GT07ynP0RXhTbSqcIzWduDWOIgHBRJqmeELkJtQB34v4QUUs7o8MSC4t7FYECkF2UKYW9Sb2KRI8FqVWB06OI4KJSQRnuyXoUiW0mHUj2iPFAJEdOoiGVE/OV+SCxqLxTpI+LT+GGcE8Cj4AypAiqcEDyrPTSFHSS25zxnMIH6W2GnsQsitVGM8sBEf36AAOOASkDHg+EcuyiWLw+TAHGCdk5EqrOKqhQjgfCJ8ahPxxCx1W0K0tdUG4qCJKrAoMXpd4i7BwFpM+rkJNmbijh7w+xIHRanPFAiXx/khuQ7mFM6i9CzFFAlQiSDHPcRQneoCM8uqhA29NOfB/Sr48MUkWF3uY0bVfmgqyF6aIKHVcqgpxFMETlGHtkrMoDdXKYVMqlqRxhUReUmBuNiro9KXVCcllcOaoiq4emlPaAOJMoaCogHdNSXgg7GEqRRL1FR709FqRzKO0PdYt0D6X+IrWqTlGnh9LzPYgk1rIQlKogqqj70NHYZgR9VN0eJ2Ttj1GkT6udygN1BhVR/vQp6m6RUYRzfl5k1lSeItfSOFBVH3KqCfw8vwPZTRddhAgx1+GE3T6GdW2CN4oYU5Y7gITy8jIIwymfMDzM54tJOy1XC86E2G0GlHKzCxjUIoNwGtmXqGA0Wi+X0uPgVd1DhFGWs/0KvjgFhSGOyyl4su9aGjPbcAWglzDqdd9k99L1ennYzMRs9tvdaqW/GkXfvAbL+/NT8PhXwmN+7/wHgdqiCaxyTNQAAAAASUVORK5CYII=">
                                </div>
                                <div class="lang-btn ${this.lang == "fr" ? "" : "active"}" id="en-lang-btn">
                                    <image style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇬🇧" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAECUExURUdwTL6/w7pOXQcmd3aItpsCC7IaMURBdgAKW8rJy7QIJtPS0gIUZgASY7h7hZ4BDgADTwMofAASYxEka8/KywATZby0uQgda6gFGbpoc6QTIgAHVgAdcrC0v56jsszMzKkCFk1djU1Yg32Prv///8sBGNMHJs8CHdQLLAAegwATeNEDIAAujwAKZtYRMgANa9YgPAAoiP79/cQAEeZ9i+vt89Xc6wEKXPn3+N9vfhg/lOmKlwImfPPKzwIZb83U5fvu8AADTdtGXN9YaoydwxcwgfK8w11zrPfV2UNfovnh5Nk0TOycp7jD2t3d3TFLk6iz0fCttqsBEr0OLcy5vMWboL7jb4MAAAAkdFJOUwD+/X39/3kQfoH+/ShvJ4HW15JNuady6j+76b+/7/FQt331fQrzi9EAAAaxSURBVFjD7Zhpe6JYE4bd2mVMJz0TJ1t30t3zIiIkigjIIkoDsrihifn/f+WtOueAmjhz9XybD/1ovEyE26eqTp0lhcIv/dJ/VzXQWY3oX913fr5HnF1+/OPPL78zffnzj/LHy7Pzn+HVbi5uGwz4tdWqWOPxYHys3+9btxfVm5t/4NXOq9/uSjsE1b62muv1urmJrMHgkTxRCJoVm+ZvoLtvt42ry7Ozo4ghCWeXjVbp+bm0azYK51etNUozFGMaWY+HGlhTzXx5QZTZvJ9dX3+BiOvlj6ByHfJwfV3ZIcdZA6haMl8doHCKwnHGJjnAAEhXVKEnCC8v5ro4m+Tq9+HZf5oFu9Jw6MUcAb28yJ4auhyVHlgZBkRBIMFWpla32x2L4h6XrhxPkoCjrB++E5AsL/zlXCEkZZWZgjxlIEGwOd3qDsgjU6SHC8LhuOKsDqEtZLkHLC9DaRVr8EgfWWgZCCmM9BhoW1mSfOAoWjqqFxrN3Vb1ZIQBipAMMEUrR0CCkDnaY7rpyrV7Eu/jHVr0BKD/BStNmW/NBUQg+6FBMxU9Dvah5Y5yzCDSY5+XBNUlHBFB5bGVVFaa4agEZcY0vMA6cCTsHRFZgYbp6dmMw0BQHysJdCMmqMXSpTlPGYhHDn8IiqauDemRlwrj7EFY6YpuOKa8N6VHp0Fgx4GwJM/hMs4RiKDcrYemtgat3mMG4nPQAC5CO4I5p98m7kHjfCyngTa35Z4gq+QqI0gIiOdzULIyQrQjL8l3TRPCEUdHjrBfyYUwFnwH41emGoB4PnOEX6SCHZ5+zK1SkYEm5b0jK4mCYDM1ONdxnNCh44BDkEAdJRDVEoolyaRa0JgW41jRQ4OCoGorHTuXKX9DQCDJ5jTdDX1hb0cLBgjpzqKN3mwiaJAEU+3g3iPtQZxrL4DDhgekuSsO0qSy0Q1OaRavCuVko9HGmMfh1lZVE6Sq9nLrxHNXUVQpAxlzJ9wu6djgtE0F8qDTBLivpSr02lqBa0Lb92AQYT/wPB3MPXnh+aqXOzo2nf/iOrb3/OGi0FivsdOg6LSpiDC/pOoS+YGHH8auYbyJX3HBgNdrDwloZ6IVMnvlKJ5xmKBSPPozMeIQiho7GKUNd/Lt9rDdRhBMbD3G6b2xk7nBJ1Gn05F4AScvCKDTJgwUcVT97YXZEU7akY4FrDZT/uYtKDOUYagb9rrnEB1S2sMD0GF6hKPcvLHDIJ09Bkk56DDLp5Jz6KZ95Idw2h9yUGaGZhIH1InkUDfv/WBoVQIiww+qy4oLtcXiqr4Hw+sYw0hHfoZtufTaQBDY8O0Q+uHNcDNc6BqvwzBYp3dBIQWWxGaRgHw7dt/3fda01IxnYgtJxyQB1ujtnDVttfRKKYY2XW2CDZuHYggyxmsYSEV/dDibPggaG9p6Tm/VHv4qs6bVVkGUWoNuotNG3C6gKRYwgSlqm8SlUrPKu9kG9jBBOvqBK+1a20TpgM7sZEZRYlOAZlhsXZjrTJoZ9eRkpemrSjLrP/1AULFCKV3RCkhc7lKG9Mr2XMPJH0GQlwxkwCwcQ0qN6WYTRMls0n8CIej7bMJW4nRFzDs+2JHVWNuk4myKoDZxpOnk4xAXLN8xNmkfGYRDQOXJhC58ND1gp9Ph8cKkK2Yg4miabNgXQdVh/tej8VOmQ1BE0gNbA7CzdKcwI4sMRCoOoNk4INe4tgDDxwth0zJ+BxoQjgJbA7QDWwi6zlBQm4H6YjQleQo9MCWYobaqzPIclfsIIuUyMCwwPU264mlQn+UREgCDmjcdQw/SydMIQXUEEY6rCh3JC7VgJoqnQZBeGp5CM4WuXLBFxhGCSFxzk+/w5lyPuuLfg2A7S8PDMTvEVoNtnqE9RN8RRDm+1IGdU74MH4GGWWjgqT+jbaTArgRRQ+ja191Vof6UICf2pM5iq1UO7Ij9U47QFGsAJVYpavjhrlqop0X4I9kwO2y3k3MYCKevQ1Afck57W4ltEiDOkN/voWmdBUwUzirts3Exwhe4IQ/tEISfjSt6ttBuTfkZQdC0XAzY0q4yGb3V5H5deibm9yDaFqOUbRkUY717Ld2Rtd8hB5zK9afPcGSp45GlDkeWz58/ja4fiqUPoOdnU1uNn6gbanvUh02Zoa2bRVDrqoYbduS06Cmq8OYUddW4/XaHqFLxAYbdkd0fo78ekHLf+Ir3NXalu29VONnV/vZkd3NTvbhtPVz/eCdANb6yU+jV7cXNT503zy8vP2LEn5ggD3BWrZ061v7s6blGjpK1X/9K+KX/sP4PsW55UIo2Nb0AAAAASUVORK5CYII=">
                                </div>
                                <div id="langShortcut" style="display: flex; align-content: center; justify-content: center; align-items: center; padding-left: 9px;">${this.lang == "fr" ? "(Ctrl+L)" : "(Shift+L)"}</div>
                            </div>
                        </div>
                    </div>
                    <div class="header-actions" style="display:flex; align-items:center">
                        <button class="btn btn-edit-mode ${this.editMode ? "on" : "off"}" id="editModeBtn"></button>
                        <div style="display: flex; flex-direction: column; gap: 8px">
                            <button class="btn btn-export" id="exportBtn"></button>
                            <button class="btn btn-import" id="importBtn"></button>
                            <div class="import-menu" id="importMenu" style="display: none">
                                <div class="import-menu-btn file"></div>
                                <div class="import-menu-btn online"></div>
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
                        <div class="stat-item"><div class="stat-value">${ueStats.validated}/${ueStats.total}</div><div class="stat-label"></div></div>
                    </div>
                </div>


                <div class="new-grades-card">
                    <div style="display:flex; justify-content: space-between; align-items: center; margin: 5px 0px">
                        <div class="new-grades-card-title"></div>
                        <div style="display:flex; font-size: 15px; font-weight: 600; color: #2A2F72" ${this.newGrades.length == 0 ? "hidden='true' disabled='true'" : ""}>
                            <div class="new-grades-mark-as-read-text" style="display:flex"></div>
                            <div class="new-grades-mark-as-read" style="margin-right: 10px; cursor:pointer; font-size:25px; display:flex">✅</div>
                        </div>
                    </div>
                </div>


                <div class="filter-title"></div>

                <div class="controls-bar">
                    <div class="filter-tabs">
                        <button class="filter-tab ${this.currentSemester == "all" ? "active" : ""}" id="filter-tab-all-semesters" data-filter="all"></button>
                        ${Object.keys(this.semesters).sort((a,b) => a-b).map(s => `<button class="filter-tab ${s == this.currentSemester ? "active" : ""}" id="filter-tab-semester-${s}" data-filter="${s}">S${s}</button>`).join('')}
                    </div>
                    <div class="view-toggle">
                        <div style="padding: 0px 5px 0px 8px; font-size: 14px; font-weight: 500"></div>
                        <button class="view-btn ${this.defView == "detailed" ? "active" : ""}" id="view-btn-detailed" data-view="detailed">📊</button>
                        <button class="view-btn ${this.defView == "compact" ? "active" :  ""}" id="view-btn-compact"  data-view="compact" >📋</button>
                    </div>
                </div>

                <div class="drop-field remove-from-ue${this.selectedSubjectCards.length > 0 ? " show" : ""}">
                    <div class="drop-field-remove-from-ue-text top${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-remove-from-ue-minus">-</div>
                    <div class="drop-field-remove-from-ue-text bottom${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-remove-from-ue-hitbox"></div>
                </div>

                <div class="content-area" id="contentArea"></div>

                <div class="drop-field create-ue${this.lang == "fr" ? " fr" : " en"}${this.selectedSubjectCards.length > 0 ? " show" : ""}">
                    <div class="drop-field-create-ue-text top${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-create-ue-plus">+</div>
                    <div class="drop-field-create-ue-text bottom${this.lang == "fr" ? " fr" : " en"}"></div>
                    <div class="drop-field-create-ue-hitbox"></div>
                </div>
                <div class="intranet-collapse"><div class="intranet-text"><div class="intranet-toggle collapse-icon">▲</div><div class="semester-name"> <div class="intranet-subtext"></div> </div><div class="intranet-toggle collapse-icon">▲</div></div></div>
                `;

                const notifContainer = document.createElement("div");
                notifContainer.className = "selected-subject-card-notif-container";

                const originalTable = document.querySelector("table.greyGridTable");
                if (!originalTable) return;
                originalTable.parentNode.insertBefore(container, originalTable);
                container.insertBefore(notifContainer, container.querySelector("dash-header"));
                originalTable.style.display = "none";

                this.renderContent();
            }


            // MARK: renderRecentGrades
            renderRecentGrades() {
                const newGradesCard = document.querySelector(".new-grades-card");
                const grades = {};
                
                if (this.newGrades.length > 0) {

                    // ordering grades per subjects
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
                        <div class="new-grades-subject-card" id="new-grades-subject-card-${subject}" data-subject="${subject}" data-ue="${grades[subject][0].ue}" data-semester="${grades[subject][0].semester}">
                            <div class="new-grades-subject-card-title" data-subject="${subject}" data-ue="${grades[subject][0].ue}" data-semester="${grades[subject][0].semester}">
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

                if (newGradesCard.children.length == 1) {
                    newGradesCard.classList.add("none")
                }
                else {
                    newGradesCard.classList.remove("none")
                }
            }


            //MARK: language Sensitive
            languageSensitiveContent(fadeIn=true) {
                // Language Sensitive text in the Dashboard Header and Semester filter tab (which don't refresh on calling the renderContent() method)
                const dashTitle = document.querySelector(".dash-title");
                const dashSubtitle = document.querySelector(".dash-subtitle");
                dashTitle.innerHTML = this.lang == "fr" ? 'ECAM Grades Dashboard' : "ECAM Grades Dashboard";
                dashSubtitle.innerHTML = this.lang == "fr" ? 'Vue complète de vos résultats académiques' : "Complete view of your academic results";

                const langShortcutText = document.getElementById("langShortcut");
                langShortcutText.innerHTML = this.lang == "fr" ? "(Ctrl+L)" : "(Shift+L)";

                const importBtn = document.getElementById("importBtn");
                const editModeBtn = document.getElementById("editModeBtn");
                const exportBtn = document.getElementById("exportBtn");
                importBtn.innerHTML =   `${this.lang == "fr" ? "Importer Config": "Import Config"}<span class="btn-icon">⬇️</span>`;
                editModeBtn.innerHTML = `<div style="display:flex; flex-direction:column; gap:3px"><span style="font-size:40px">🖊️</span><div>${this.lang == "fr" ? "Mode Édition" : "Edit Mode"}</div><div>${this.lang == "fr" ? "(Maj+E)" : "(Shift+E)"}</div></div>`;
                if (this.editMode)
                        {editModeBtn.classList.add('on')}
                else    {editModeBtn.classList.remove('on')}
                exportBtn.innerHTML =   `${this.lang == "fr" ? "Exporter Config": "Export Config"}<span class="btn-icon">⬆️</span>`;

                const avgLabel = document.querySelector(".average-label");
                avgLabel.innerHTML = `/20 ${this.lang == "fr" ? "Moyenne Générale" : "Global Average"}`;

                const statLabelsArray = document.querySelectorAll(".stat-label");
                statLabelsArray[0].innerHTML = this.lang == "fr" ? "Notes" : "Grades";
                statLabelsArray[1].innerHTML = this.lang == "fr" ? "Semestres" : "Semesters";
                statLabelsArray[2].innerHTML = this.lang == "fr" ? "Modules Validés" : "Validated module";

                document.querySelector(".filter-title").innerHTML = this.lang == "fr" ? "Filtrer par semestre" : "Filter by semester";
                document.querySelector(".filter-tab").innerHTML = this.lang == "fr" ? "Tous" : "All";

                document.querySelector(".view-toggle").children[0].innerHTML = this.lang == "fr" ? `Basculer le mode d'affichage (Maj+D)` : `Display mode toggle (Shift+D)`;
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
                document.querySelector(".new-grades-card-title").innerHTML = `${this.newGrades.length > 0 ? `${this.lang == "fr" ? `Nouvelle Note${this.newGrades.length > 1 ? "s" : ""} !` : `New Grade${this.newGrades.length > 1 ? "s" : ""}!`}` : `${this.lang == "fr" ? `Pas de nouvelle note` : `No new grade`}` }`;
                document.querySelector(".new-grades-mark-as-read-text").innerHTML = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";
                document.querySelector(".new-grades-mark-as-read").title = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";
                

                let highestWidth = 0;
                document.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {
                    notifDiv.childNodes[4].data = this.lang == "fr" ? `est sélectionné!` : `is selected!`;
                    if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;
                })
                document.querySelector(".selected-subject-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

                if (fadeIn) {
                    document.querySelector(".ecam-dash").parentElement.classList.add("fade-in");
                    setTimeout(() => {document.querySelector(".ecam-dash").parentElement.classList.remove("fade-in")}, 300);
                }
            }


            // MARK: renderContent
            renderContent(fadeIn=true) {

                if (fadeIn == "big") {this.languageSensitiveContent(true);}
                else {this.languageSensitiveContent(false);}
                
                
                // Call renderRecentGrades to... well... render the recent grades' card
                this.renderRecentGrades()


                // Content area, refreshing often
                const ueStats = this.getUEStats();
                const validatedEUsStatLabel = document.querySelectorAll(".stat-value")[2];
                validatedEUsStatLabel.innerHTML = `${ueStats.validated}/${ueStats.total}`;

                let semesterKeys = [];
                if (this.currentSemester === "all") {
                    semesterKeys = Object.keys(this.semesters).sort();
                }
                else if (this.currentSemester === "last") {
                    semesterKeys = [Object.keys(this.semesters).sort().at(-1)];
                }
                else {
                    semesterKeys = [this.currentSemester];
                }
                
                const contentArea = document.getElementById("contentArea");
                contentArea.innerHTML = "";
                semesterKeys.forEach(sem => {
                    const section = document.createElement("div");
                    section.className = `semester-section`;
                    const moyenneSem = this.moyennePonderee([].concat(...Object.values(this.semesters[sem] || {})));
                    const avgClass = this.getAverageColor(moyenneSem);
                    const unclassified = this.getUnclassifiedSubjects(sem);
                    section.innerHTML = `
                    <div class="semester-header" data-semester="${sem}">
                        <div class="semester-info">
                            <div class="semester-name">📚 ${this.lang == "fr" ? 'Semestre' : "Semester"} ${sem}</div>
                                <div class="semester-average ${avgClass}">
                                    <span>${moyenneSem >= 10 ? '✅' : '⚠️'}</span><span>${moyenneSem}/20</span>
                                </div>
                            </div>
                        <div class="semester-toggle open collapse-icon">▲</div>
                    </div>
                    <div class="semester-content show${this.selectedSubjectCards.length > 0 ? " dragging" : ""}${fadeIn ? " fade-in" : ""}" id="sem-content-${sem}">
                        <div class="semester-grid" ${(unclassified.length == 0 || !this.ueConfig[sem] || Object.keys(this.ueConfig?.[sem])[0] == undefined) ? `style="gap: ${this.editMode ? `20px` : `0px`}"` : ``}>
                            <div class="modules-section" id="modules-section">
                                ${this.createAllUECards(sem)}
                            </div>
                            <div class="unclassified-section" id="unclassified-section" style="height: 100%${unclassified.length > 0 ? `` : `; display: none`}">
                                <div class="unclassified-title">
                                    ${this.lang == "fr" ? `Matière${unclassified.length > 1 ?  `s` : ``} non classée${unclassified.length > 1 ?  `s` : ``} dans un module` : `Subject${unclassified.length > 1 ?  `s` : ``} not classified in a module`}
                                </div>
                                <div class="unclassified-content">
                                    ${unclassified.length > 0 ?  `${this.createAllUnclassifiedSubjCard(sem)}` : ``}
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    contentArea.appendChild(section);

                    // Set a fixed height for the unclassified section, so that when dragging a subject card, the unclassified section doesn't change height upon the grades tables disappearing
                    const unclassifiedSection = document.querySelector(".unclassified-section");
                    setTimeout(() => {
                        const currentUnclassifiedSectionHeight = new Number(unclassifiedSection.clientHeight); 
                        unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;
                    }, 100)

                    const container = document.getElementById(`sem-content-${sem}`)

                    // Attach on-click event action for the grades' checkbox
                    this.attachCheckboxListeners(container);

                    this.setGradesTableTotalCoef();
                    this.attachEventListeners();
                });
            }




            // MARK: createUECard
            createAllUECards(sem) {
                const ueConfig = this.ueConfig?.[sem] || {};

                let html =  this.editMode ? this.createDropFieldInsertionField("ue", {sem, index:0}) : "";

                ueConfig?.__ues__?.forEach((ueName, ueIndex) => {
                    html += this.createUECard(sem, ueName, ueIndex);
                    html += this.editMode ? this.createDropFieldInsertionField("ue", {sem, index:ueIndex+1}) : "";
                });

                return html;
            }
            createUECard(sem, ueName, ueIndex=-1) {
                const ueGrades = this.calculateUEGrades(sem, ueName);
                const includedGrades = (ueGrades || []).filter(n => !this.gradeIsDisabled(n));
                let weight = 0; includedGrades.forEach(grade => {weight += grade.coef/100})
                const moyenne = this.gradesDatas[sem][ueName].average;
                const hasSim =      this.gradesDatas[sem][ueName].simGrades.length > 0 ? true : false;
                const hasDisabled = this.gradesDatas[sem][ueName].disabledSimGrades.length + this.gradesDatas[sem][ueName].disabledRealGrades.length > 0 ? true : false;

                let html = `
                <div class="ue-card ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}" id="ue-card-${ueName}-in-semester-${sem}" data-semester="${sem}" data-ue="${ueName}" data-index="${ueIndex}">
                
                    <div class="ue-header ${this.editMode ? "edit-mode" : ""} ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}" id="ue-header-${ueName}-in-semester${sem}" data-semester="${sem}" data-ue="${ueName}" ${this.editMode ? `draggable="true"` : ""}>
                        ${this.editMode 
                            ? 
                            `<div style="display: flex; align-items: center; justify-content: flex-start; width: 42%;">
                                <div style="margin-right: 5px;">${this.draggableIcon("ue-card", {height: 29, type: "ue", targetId: `ue-card-${ueName}-in-semester-${sem}`})}</div>
                                <input type="text" class="ue-title input any-input" id="ue-title-input-${sem}-${ueName}" value="${ueName}" data-semester="${sem}" data-ue="${ueName}" draggable="false"/>
                                <div class="ue-title-state">
                                </div>
                            </div>` 
                            : 
                            `<div class="ue-title">${ueName}</div>`
                        }
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:47%; gap:4px; padding: 0px 10px; font-size: 13px">
                            <div style="font-size: 14px; font-weight: 700; text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des matières :` : `Total Subjects Coef:`}
                            </div>
                            <div class="ue-subject-total-coef-value" data-semester="${sem}" data-ue="${ueName}"></div>
                        </div>
                        <div class="ue-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}" data-semester="${sem}" data-ue="${ueName}">
                            ${moyenne}/20 
                            <div class="ue-toggle collapse-icon ${this.viewMode == "compact" ? "" : "open"}">▲</div>
                            <button class="ue-delete-btn" ${this.editMode ? `class="display:none"` : ""} id="ue-delete-btn-${ueName}-in-semester-${sem}" title="${this.lang == "fr" ? "Supprimer ce module" : "Delete this module"}" data-semester="${sem}" data-ue="${ueName}">🗑️</button>
                        </div>
                    </div>
                    
                    <div class="ue-info">
                        ${hasDisabled 
                            ? 
                            `<div class="ue-info-bar">
                                <div style="font-weight: 700; font-size: 15px;">${this.lang == "fr" ? "Inclus des notes désactivées" : "Includes disabled grades"}</div>
                                <div class="ue-info-clear disabled" data-semester="${sem}" data-ue="${ueName}">${this.lang == "fr" ? "Activer toutes ces notes" : "Enable all the grades"}</div>
                            </div>` 
                            : ``
                        }
                        ${hasSim 
                            ? 
                            `<div class="ue-info-bar">
                                <div style="font-weight: 700; font-size: 15px;">${this.lang == "fr" ? "Inclus des notes simulées" : "Includes simulated grades"}</div>
                                <div class="ue-info-clear sim" data-semester="${sem}" data-ue="${ueName}">${this.lang == "fr" ? "Effacer toutes ces notes simulées" : "Erase all the simulated grades"}</div>
                            </div>` 
                            : ``
                        }
                    </div>
                    
                    <div class="ue-card-content ${this.editMode ? "edit-mode": ""}">
                    <div class="ue-details ${this.editMode ? "edit-mode": ""}" id="ue-details-${ueName}-in-semester${sem}">
                    ${this.viewMode == "detailed" ? this.createAllSubjCardDetailed(sem, ueName) : this.createAllSubjCardCompact(sem, ueName)}
                    </div>
                    </div>
                    
                    </div>
                `;
                    
                return html
            }
            



            // MARK: createSubjCardDetailed
            createAllSubjCardDetailed(sem, ueName) {
                const ueData = this.gradesDatas[sem][ueName];
                const select = this.selectedSubjectCards.length == 0;

                let html =  this.editMode ? this.createDropFieldInsertionField("subject", {sem, ueName, index:0}) : "";

                Object.values(ueData.subjects).forEach((_value, _index) => {
                    html += this.createSubjCardDetailed(sem, ueName, _value.subjName, _index);
                    html += this.editMode ? this.createDropFieldInsertionField("subject", {sem, ueName, index:_index+1}) : "";
                })

                return html;
            }
            createSubjCardDetailed(sem, ueName, subject, index=-1) {
                const ueData =          this.gradesDatas[sem][ueName];
                const subjectData =     ueData.subjects[subject];
                const subjGrades =      subjectData.grades;
                const ueMoy =           ueData.average;
                const subjAvg =          subjectData.average;
                const pct =             subjectData.coef;
                const isCustom =        subjectData.isCustom;
                const nbGrades =        subjGrades.length;
                const nbSimGrades =     subjectData.simGrades.length;
                
                let html = `
                <div class="subject-card ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" ${this.editMode ? `style="user-select: none;"` : ``} id="subject-card-semester-${sem}-subject-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" data-custom="${isCustom}" data-index="${index}">
                    <div class="subject-card-header ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" ${this.editMode ? `draggable="true"` : ``} style="${this.editMode ? `cursor: grab; ` : `${nbGrades > 0 ? `` : `border-radius: 20px; border: none`}`}">
                        <div style="display: flex; width: 42%; padding-left: ${this.editMode ? `10px` : `50px`}">
                            <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; gap:8px; user-select: text">
                                ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("detailed-subject-card", {type:"detailed", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                                <div style="width: 100%">
                                    ${isCustom 
                                        ? `<input type="text" onmouseover="event.preventDefault()" class="subject-name input any-input" id="subject-name-input-${sem}-${ueName}-${subject}" value="${subject}"/>`
                                        : `<div class="subject-name">${subject}</div>`}
                                    <div class="grade-type">
                                        ${this.lang == "fr" ? "Poids dans module" : "Weight in module"}: 
                                        ${this.editMode 
                                            ? `<input class="subject-coef-input-box any-input" id="subject-coef-input-box-${sem}-${ueName}-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                            : `<span style="font-weight: 800;">${pct}%</span>`}
                                        | 
                                        ${this.lang == "fr" ? "Moyenne" : "Average"}: 
                                        <span class="subj-moyenne ${subjAvg == " - " ? '' : `${subjAvg>=10 ? 'good' : 'bad'}`}">${subjAvg}/20</span> 
                                        ${nbGrades===0 ? `<span style="margin-left:2px;font-size:12px;color:#6b7280">${this.lang == "fr" ? "(aucune note publiée)" : "(no published grade)"}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding: 0px 10px; font-size: 13px">
                            <div style="text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                            </div>
                            <div class="grades-table-subject-total-coef-value" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}"></div>
                        </div>
                    </div>
                    <table class="grades-table ${subjAvg == " - " ? `unknown` : `${subjAvg >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" style="${this.editMode ? `user-select: text;` : ``}" id="grades-table-${subject}-semester${sem}" data-subject="${subject}">

                        <thead>
                            ${nbGrades > 0 || this.editMode
                                ? `<tr>
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
                                    <th class="grades-table-teacher" style="border-right-width: 0px;${this.selectedSubjectCards.length > 0 ? " display: none;" : ""}">
                                        ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                    </th>
                                    <th style="border-right-width: 0px; border-left-width: 0px;">
                                    </th>
                                </tr>`
                                : ``
                            }
                        </thead>
                        <tbody>
                `;

                subjGrades.forEach((grade, index) => {
                    const gradeClass = this.getGradeColor(grade.grade);
                    const gradeIsSim = grade.__sim ? true : false;

                    html += `
                            <tr class="grade-row ${index == nbGrades-1 ? `last` : ``} ${gradeIsSim ? `sim` : ``}" data-sim="${gradeIsSim}">
                                <td class="grades-table-type" style="display: flex; align-items: center; gap: 6px; width: auto">
                                    <input type="checkbox" class="grade-checkbox any-input" id="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}" data-prof="${grade.prof}" data-gradeid="${grade.type + " " + grade.date + " " + grade.prof}" ${gradeIsSim ? `data-simtimestamp="${grade.id}"` : ""} ${!this.gradeIsDisabled(grade) ? "checked" : ""}></input>
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-type grade-simulee-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" data-modifType="type" data-simid="${nbSimGrades-1}" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" value="${grade.type}"/>` 
                                        : `<label class="grade-type" style="width: auto"  id="grade-type-${grade.type}-${grade.date}" for="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}">${grade.type || ''}${gradeIsSim ? ` • ${this.lang == "fr" ? "Simulée" : "Simulated"}` : ''}</label>`
                                    }
                                </td>
                                <td class="grade-value grade-${gradeClass} grades-table-grade" data-sim="${gradeIsSim}">
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-grade any-input" style="width: 100%; max-width: 75px;" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="0.5" min="0" max="20" data-simid="${nbSimGrades-1}" data-modifType="grade" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" style="width:75px; height:25px" value="${grade.grade}"> /20`
                                        : `${grade.grade}/20`
                                    }
                                </td>
                                <td class="grades-table-coef" data-sim="${gradeIsSim}">
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="5" min="0" max="100" data-simid="${nbSimGrades-1}" data-modifType="coef" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" style="width:60px; height:25px"value="${grade.coef}"> %`
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
                                <td class="grades-table-teacher" ${this.selectedSubjectCards.length > 0 ? `style="display: none;"` : ""}>
                                    ${gradeIsSim
                                        ? `<span style="width: 100%; display: flex; justify-content: center;"> — </span>`
                                        : `<span>${`${grade.prof.split(" / ").length <= 3 ? grade.prof : grade.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</span>`
                                    }
                                </td>
                                <td class="grades-table-add-sim-cell" style="${gradeIsSim ? `width: 52px; padding: 3px; text-align: center;` : ``}">
                                    ${
                                        gradeIsSim 
                                        ? `<button class="sim-del-btn" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}" data-type="${grade.type}">🗑️</button>` 
                                        : `<div style="width:32px"></div>`
                                    }
                                </td>
                            </tr>
                    `;
                });

                // Formulaire d'ajout de grade simulée pour cette matière
                html += `
                            <tr ${this.editMode ? "" : "hidden=true"}>
                                <td class="grades-table-type">
                                    <div class="grade-type" style="display:flex; align-items:center; justify-content: flex-start">
                                        <div style="width: 120px">${this.lang == "fr" ? "Ajouter une note simulée: " : "Add a simulated grade: "}</div>
                                        <input class="grade-simulee-input sim-inp-type any-input" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}" data-semester="${sem}" data-subj="${subject}" placeholder="${this.lang == "fr" ? "Titre" : "Title"}" />
                                    </div>
                                </td>
                                <td class="grades-table-grade">
                                    <input class="grade-simulee-input sim-inp-grade any-input" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="0.5" min="0" max="20" data-semester="${sem}" data-subj="${subject}" placeholder="/20"> /20
                                </td>
                                <td class="grades-table-coef">
                                    <input class="grade-simulee-input sim-inp-coef any-input" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="5" min="0" max="100" data-semester="${sem}" data-subj="${subject}" placeholder="%"> %
                                </td>
                                <td colspan="3">
                                </td>
                                <td>
                                    <button class="btn-export sim-add-btn" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;

                return html;
            }




            // MARK: createSubjCardCompact
            createAllSubjCardCompact(sem, ueName) {
                const ueData = this.gradesDatas[sem][ueName];
                const select = this.selectedSubjectCards.length == 0;

                let html =  this.editMode ? this.createDropFieldInsertionField("subject", {sem, ueName, index:0}) : "";

                Object.values(ueData.subjects).forEach((_value, _index) => {
                    html += this.createSubjCardCompact(sem, ueName, _value.subjName, _index);
                    html += this.editMode ? this.createDropFieldInsertionField("subject", {sem, ueName, index:_index+1}) : "";
                })

                return html;
            }
            createSubjCardCompact(sem, ueName, subject, index=-1) {
                const ueData =  this.gradesDatas[sem][ueName];
                const subjectData =             ueData.subjects[subject];
                const subjGrades =              subjectData.grades;
                const ueMoy =                   ueData.average;
                const subjAvg =                  subjectData.average;
                const pct =                     subjectData.coef;
                const isCustom =                subjectData.isCustom;
                const nbGrades =                subjGrades.length;
                const includedGradesLength =    nbGrades - subjectData.disabledRealGrades.length - subjectData.disabledSimGrades.length;
                const nbSimGrades =          subjectData.simGrades.length;

                const html = `
                <div class="subject-card compact ${this.editMode ? "" : "edit-mode"} ${subjAvg == " - " ? "unknown" : `${subjAvg>10 ? `${ueMoy>10 ? `good` : `meh`}` : `bad`}`}" id="subject-card-semester-${sem}-subject-${subject}" style="${this.editMode ? "cursor: grab; user-select: none; " : " "}" ${this.editMode ? `draggable="true"` : ""} data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" data-custom="${isCustom}" data-index="${index}">
                    <div style="display:flex; align-items:center; gap:8px; padding-left: 11px; width:43%; min-width: 275px">
                        ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("compact-subject-card", {type:"compact", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                        <div style="width: 87%">
                            ${isCustom 
                                ? `<input type="text" class="subject-name input any-input" id="subject-name-input-${sem}-${ueName}-${subject}" value="${subject}"/>`
                                : `<div class="subject-name">${subject}</div>`
                            }
                            <div style="font-size:13px;color:#666;">
                                ${this.lang == "fr" ? "Poids dans module: " : "Weight in module: "}
                                ${this.editMode 
                                    ? `<input class="subject-coef-input-box any-input" id="subject-coef-input-box-${sem}-${ueName}-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                    : `<span style="font-weight: 800">${pct}%</span>`
                                } • 
                                ${nbGrades===0 ? `${this.lang == "fr" ? "aucune note publiée" : "no published grade"}` : `${nbGrades} ${this.lang == "fr" ? `note${nbGrades>1?"s":""} au total` : `grade${nbGrades>1?"s":""} total`}`}
                                ${nbGrades>0 
                                    ? ` • <span ${includedGradesLength<nbGrades ? `style="color: #df0000"` : ``}>
                                        <span style="font-weight: 700; ">${includedGradesLength}/${subjGrades.length}</span> 
                                        ${this.lang == "fr" ? `note${includedGradesLength>1?"s":""} activée${includedGradesLength>1?"s":""}` : `grade${includedGradesLength>1?"s":""} enabled`}${includedGradesLength<subjGrades.length ? `!` : ``}
                                    </span>` 
                                    : ``}
                                ${nbSimGrades>0 
                                    ? ` • ${nbSimGrades} ${this.lang == "fr" ? `note${nbSimGrades>1?"s":""} simulée${nbSimGrades>1?"s":""}` : `simulated grade${nbSimGrades>1?"s":""}`}`
                                    : ``}
                                
                            </div>
                        </div>
                    </div>
                    <div class="grades-table-coef" style="display:flex; flex-direction: column; width:50%; gap:6px; padding: 0px 10px; font-size: 13px; font-weight: 600">
                        <div style="text-align: left;">
                            ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                        </div>
                        <div class="grades-table-subject-total-coef-value" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}"></div>
                    </div>
                    <div class="subj-moyenne ${subjAvg == " - " ? '' : `${subjAvg>=10 ? 'good' : 'bad'}`}" style="display: flex; justify-content: flex-end; width: 80px; padding-right: 20px; font-size: 20px">${subjAvg}/20</div>
                </div>
                `;
                return html;
            }




            // MARK: createUnclassifiedSubjCard
            createAllUnclassifiedSubjCard(sem) {
                const unclassified = this.getUnclassifiedSubjects(sem);
                let html = ``;

                unclassified.forEach(subject => {
                    html += this.createUnclassifiedSubjCard(sem, subject);
                })
                return html
            }
            createUnclassifiedSubjCard(sem, subject) {
                let html = ``;
                let totalCoef = 0;
                let totalClassAvg = 0;
                const ueName = "__#unclassified#__";
                const subjData =    this.gradesDatas?.[sem]?.[ueName]?.subjects?.[subject] || {};
                const grades =          subjData?.grades || [];
                const simGrades =       subjData?.simGrades || [];
                const subjAvg =          subjData?.average || " - ";
                const nbGrades =        grades.length;
                const nbSimGrades =     simGrades.length;
                const nbRealGrades =    nbGrades - nbSimGrades;

                html +=`
                <div class="subject-card unclassified ${subjAvg >= 10 ? `good` : `bad`}" id="subject-card-semester-${sem}-subject-${subject}" ${this.editMode ? `style="user-select: none;"` : ""} ${this.editMode ? `draggable="true"` : ""} data-subject="${subject}" data-semester="${sem}">
                    <div class="subject-card-header unclassified  ${subjAvg >= 10 ? `good` : `bad`}" style="${this.editMode ? "cursor: grab; padding-left: 10px;" : "padding-left: 50px;"}" data-semester="${sem}" data-subject="${subject}">
                        ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("unclassified-subject-card", {type:"unclassified", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                        <div style="width: 40%">
                            ${subject}
                            <div style="font-size:12px;margin-top:4px;">${this.lang == "fr" ? "Moyenne" : "Average"}: <span class="subj-moyenne ${subjAvg>=10 ? 'good' : 'bad'}" >${subjAvg}/20</span></div>
                        </div>
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding-left: 10px; font-size: 13px">
                            <div style="text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                            </div>
                            <div class="grades-table-subject-total-coef-value" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}"></div>
                        </div>
                    </div>

                    <table class="grades-table ${subjAvg >= 10 ? "good" : "bad"}" id="grades-table-${subject}-semester${sem}">
                        <thead>
                            ${nbGrades > 0 || this.editMode
                                ? `<tr style="/* border-bottom: 2px solid #d5d5d5; */">
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
                                    <th class="grades-table-teacher" style="border-right-width: 0px;${this.selectedSubjectCards.length > 0 ? " display: none;" : ""}">
                                        ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                    </th>
                                    <th style="border-right-width: 0px; border-left-width: 0px;">
                                    </th>
                                </tr>`
                                : ``
                            }
                        </thead>
                        <tbody>
                `;
                grades.forEach((grade, index) => {
                    totalCoef += grade.coef;
                    totalClassAvg += grade.classAvg;

                    const gradeClass = this.getGradeColor(grade.grade);
                    const gradeIsSim = grade.__sim ? true : false;

                    html += `
                            <tr class="grade-row-unsorted-grades ${index == nbRealGrades-1 ? `last` : ``} ${gradeIsSim ? `sim` : ``}" data-sim="${gradeIsSim}">
                                <td class="grades-table-type" style="display: flex; align-items: center; gap: 6px; width: auto">
                                    <input type="checkbox" class="grade-checkbox any-input" id="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}-${index-nbRealGrades}" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}" data-prof="${grade.prof}" data-gradeid="${grade.type + " " + grade.date + " " + grade.prof}" ${gradeIsSim ? `data-simtimestamp="${grade.id}"` : ""} ${!this.gradeIsDisabled(grade) ? "checked" : ""}></input>
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-type grade-simulee-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" data-modifType="type" data-simid="${index-nbRealGrades}" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" value="${grade.type}"/>` 
                                        : `<label class="grade-type" style="width: auto"  id="grade-type-${grade.type}-${grade.date}" for="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}-${index-nbRealGrades}">${grade.type || ''}${gradeIsSim ? ` • ${this.lang == "fr" ? "Simulée" : "Simulated"}` : ''}</label>`
                                    }
                                </td>
                                <td class="grade-value grade-${gradeClass} grades-table-grade" data-sim="${gradeIsSim}">
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-grade any-input" style="width: 100%; max-width: 75px;" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="0.5" min="0" max="20" data-simid="${index-nbRealGrades}" data-modifType="grade" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" style="width:75px; height:25px" value="${grade.grade}"> /20`
                                        : `${grade.grade}/20`
                                    }
                                </td>
                                <td class="grades-table-coef" data-sim="${gradeIsSim}">
                                    ${gradeIsSim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="5" min="0" max="100" data-simid="${index-nbRealGrades}" data-modifType="coef" data-semester="${sem}" data-subj="${subject}" data-type="${grade.type}" data-ue="${ueName||''}" style="width:60px; height:25px"value="${grade.coef}"> %`
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
                                <td class="grades-table-teacher" ${this.selectedSubjectCards.length > 0 ? `style="display: none;"` : ""}>
                                    ${gradeIsSim
                                        ? `<span style="width: 100%; display: flex; justify-content: center;"> — </span>`
                                        : `<span>${`${grade.prof.split(" / ").length <= 3 ? grade.prof : grade.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</span>`
                                    }
                                </td>
                                <td class="grades-table-add-sim-cell" style="${gradeIsSim ? `width: 52px; padding: 3px; text-align: center;` : ``}">
                                    ${
                                        gradeIsSim 
                                        ? `<button class="sim-del-btn" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}" data-type="${grade.type}" data-simid="${index-nbRealGrades}">🗑️</button>` 
                                        : `<div style="width:32px"></div>`
                                    }
                                </td>
                            </tr>
                    `
                });

                html += `
                            <tr ${this.editMode ? "" : "hidden=true"}>
                                <td class="grades-table-type">
                                    <div class="grade-type" style="display:flex; align-items:center; justify-content: flex-start">
                                        <div style="width: 120px">${this.lang == "fr" ? "Ajouter une note simulée: " : "Add a simulated grade: "}</div>
                                        <input class="grade-simulee-input sim-inp-type any-input" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}" data-semester="${sem}" data-subj="${subject}" placeholder="${this.lang == "fr" ? "Titre" : "Title"}" />
                                    </div>
                                </td>
                                <td class="grades-table-grade">
                                    <input class="grade-simulee-input sim-inp-grade any-input" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="0.5" min="0" max="20" data-semester="${sem}" data-subj="${subject}" placeholder="/20"> /20
                                </td>
                                <td class="grades-table-coef">
                                    <input class="grade-simulee-input sim-inp-coef any-input" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="5" min="0" max="100" data-semester="${sem}" data-subj="${subject}" placeholder="%"> %
                                </td>
                                <td colspan="3">
                                </td>
                                <td>
                                    <button class="btn-export sim-add-btn" data-semester="${sem}" data-subj="${subject}" data-ue="${ueName||''}">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;
                
                return html;
            }

        //#endregion






        //#region -REGION: Ev Listeners

            attachEventListeners() {

                /* document.onwheel = (e) => {
                    console.log(
                        "ONWHEEL EVENT\n" + 
                        "Offset X: " + e.offsetX +      " | Offset Y: " + e.offsetY +       " | over " + e.target.className + "\n" + 
                        "Delta X:  " + e.deltaX +       " | Delta Y:  " + e.deltaY +        "\n" + 
                        "WDelta X: " + e.wheelDeltaX +  " | WDelta Y:   " + e.wheelDeltaY + "\n" + 
                        "The mouse is at the following position:\n" + 
                        "Client X: " + e.clientX +    " | Client Y: " + e.clientY 
                    )
                } */
                /* document.onmousemove = (e) => {
                    const leftTopScreen = e.target.leftTopScreen("main-average-card");
                    console.log("lefTopScreen|\tclientCoord \t|\t offsetCoord \t|\t TOTAL");
                    console.log("X: " + leftTopScreen[0] + "\t|\t" + e.clientX + "\t|\t" + e.offsetX + "\t|\t" + (leftTopScreen[0]+e.offsetX));
                    console.log("Y: " + leftTopScreen[1] + "\t|\t" + e.clientY + "\t|\t" + e.offsetY + "\t|\t" + (leftTopScreen[1]+e.offsetY));
                }; */
                document.body.onresize = (e) => {   // grade FOR THE FUTURE: DONT RE-RENDER THE CONTENT ON RESIZE, IT MESSES UP WITH THE SELECTED subject CARDS
                    
                    let highestWidth = 0;
                    document.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                    document.querySelector(".selected-subject-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

                    /* if (document.body.clientWidth <= 1530) {
                        if (this.clientWidth > 1530) {
                            this.clientWidth = 1530;
                            document.querySelectorAll(".ue-subject-total-coef-value").forEach(ueTotalCoef => {
                                ueTotalCoef.style.flexDirection = "column"; ueTotalCoef.style.gap = "2px";
                            })
                        }
                    }
                    else
                    {
                        if (this.clientWidth <= 1470) {
                            this.clientWidth = 1920;
                            document.querySelectorAll(".ue-subject-total-coef-value").forEach(ueTotalCoef => {
                                ueTotalCoef.style.flexDirection = ""; ueTotalCoef.style.gap = "15px";
                            })
                        }
                    }

                    if (document.body.clientWidth <= 1470) {
                        if (this.clientWidth > 1470) {
                            this.clientWidth = 1470;
                        }
                        // this.getCSSClassCoordInStyleSheet(".grade-simulee-input")
                        // this.getCSSClassCoordInStyleSheet(".grade-simulee-input.sim-inp-type")
                    }
                    else
                    {
                        if (this.clientWidth <= 1470) {
                            this.clientWidth = 1530;
                        }
                    }

                    if (document.body.clientWidth <= 935) {
                        if (this.mobileVer == false) {
                            this.clientWidth = 935;
                            this.mobileVer = true;
                            this.renderContent(false)
                            // document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                            // this.getCSSClassCoordInStyleSheet(".grades-table-teacher").style.display = "none";
                        }
                    }
                    else
                    {
                        if (this.mobileVer == true) {
                            this.clientWidth = 1470;
                            this.mobileVer = false;
                            this.renderContent(false)
                            // this.getCSSClassCoordInStyleSheet(".grades-table-teacher").style.display = "table-cell";
                        }
                    } 
                    */
                }; 
                
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
                    else if (e.target.closest('.intranet-collapse')) {
                        const header = e.target.closest('.intranet-collapse');
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
                        setTimeout(() => {document.getElementById("importMenu").style.display = "none"}, 300);
                    }
                };
                
                // Collapse/Develop (fold/unfold) UEs
                document.onmousedown = (e) => {
                    if (e.target.closest('.ue-header') && !e.target.closest('.ue-title.input') && !e.target.closest('.ue-delete-btn')) {
                        this.ueHeaderClickEvent(e)
                    }
                };

                


                document.querySelector(".new-grades-notif").onclick = () => {
                    const newGradesCard = document.querySelector(".new-grades-card");
                    newGradesCard.scrollIntoView({behavior: "instant"});
                    newGradesCard.classList.add("myhighlight");
                    setTimeout(() => {newGradesCard.classList.remove("myhighlight")},200)
                };
                document.getElementById("closeNewGradesNotif").onmousedown = () => {    // otherwise, clicking the close button of the notif card also clicks on the card itself (behind the button)
                    document.querySelector(".new-grades-notif").onclick = null;
                };
                document.getElementById("closeNewGradesNotif").onclick = () => {
                    document.querySelector(".new-grades-notif").classList.remove("on");
                };
                document.querySelector(".new-grades-mark-as-read").onclick = () => {
                    this.newGrades = [];
                    this.savedReadGrades = [];
                    this.grades.forEach(e => {this.savedReadGrades.push(e)})
                    localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades))

                    if (document.querySelector(".new-grades-card").children.length > 1) {document.querySelector(".new-grades-card").children[1].remove()}
                    document.querySelector(".new-grades-card-title").innerHTML = this.lang == "fr" ? `Pas de nouvelle grade` : `No new grade`;
                    document.querySelector(".new-grades-mark-as-read").parentElement.disabled = true;
                    document.querySelector(".new-grades-mark-as-read").parentElement.hidden = true;
                    document.querySelector(".new-grades-notif").classList.remove("on");

                    this.renderRecentGrades()
                    this.attachEventListeners()
                };
                document.querySelectorAll(".new-grades-subject-card").forEach(card => {   // Scroll to the corresponding subject/grade on which the user clicked
                    card.onclick = e => {
                        this.currentSemester = e.target.dataset.semester;
                        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                        document.getElementById('filter-tab-semester-'+this.currentSemester).classList.add('active');
                        this.renderContent(false);
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);

                        const targetElem = document.getElementById(`subject-card-semester-${e.target.dataset.semester}-subject-${e.target.dataset.subject}`);
                        targetElem.scrollIntoView({behavior: "instant",block: "center"});
                        targetElem.onscrollend = ((elem) => {
                            elem.classList.add("scroll-to");
                            elem.onanimationend = () => {targetElem.classList.remove("scroll-to")}
                        })(targetElem);
                        
                    }
                });

                
                // Filtres semester
                document.querySelectorAll('.filter-tab').forEach(tab => {
                    tab.onclick = (e) => {
                        if (!e.target.classList.contains('active'))
                        {
                            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                            e.target.classList.add('active');
                            this.currentSemester = e.target.dataset.filter;
                            this.renderContent();
                            this.attachEventListeners();
                            localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);
                        }
                    };
                });

                // Toggle view mode
                document.querySelectorAll('.view-btn').forEach(btn => {
                    btn.onclick = (e) => {
                        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.viewMode = e.target.dataset.view;
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE", this.viewMode);
                        this.renderContent();
                    };
                });

                document.querySelectorAll('.subject-coef-input-box').forEach(inputBox => {
                    inputBox.onchange = e => {
                        const sem = e.target.dataset.semester;
                        const ueName = e.target.dataset.ue;
                        const subject = e.target.dataset.subject;
                        const newCoef = e.target.value;
                        this.ueConfig[sem][ueName].coefficients[subject] = newCoef;
                        this.saveConfig();
                        this.getGradesDatas({sem, ueName, subject});
                        this.renderContent(false);
                        this.attachEventListeners();
                    };
                })


                // Ensures all selected Subject Cards have a tick icon with their assigned event listeners instead of the default drag icon
                this.selectedSubjectCards.forEach(selectedSubjectCardId => {
                    const subjectCard = document.getElementById(selectedSubjectCardId);
                    const dragIcon = subjectCard.querySelector(".drag-icon");
                    this.dragIconOnClickEvent(subjectCard, dragIcon, true); // Trigger the dragIcon onClick event to simulate the default drag icon being clicked
                })
                document.querySelectorAll(".subject-card").forEach(subjCard => {
                    if (subjCard.querySelector(".drag-icon")) {
                        const dragIcon = subjCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => { this.dragIconOnClickEvent(e, dragIcon) };
                    }
                    else if (subjCard.querySelector(".tick-icon")) {
                        const tick = subjCard.querySelector(".tick-icon");
                        tick.onclick = (e) => { this.tickIconOnClickEvent(e, tick) };
                    }
                })


                // Attach listeners for every input of class ".any-input"
                document.querySelectorAll(".any-input").forEach(input => {
                    input.onfocus    = () =>  {document.onkeydown = null; document.onkeyup = null}
                    input.onblur     = () =>  {this.generalKeyboardEvents()};
                    input.ondragover = (e) => {if (e.target.closest(".any-input")) {e.dataTransfer.dropEffect = "none";}}
                    input.ondrop     = (e) => {e.preventDefault(); e.dataTransfer.dropEffect = "link";};
                    if (input.classList.contains("ue-title")) {   // Change UEs name
                        input.onmouseenter  = ( ) => { this.detachOnDragEventListeners(); document.querySelectorAll(".ue-header").forEach(card => {card.draggable = false}); }
                        input.onmouseleave  = ( ) => { this.attachOnDragEventListeners(); document.querySelectorAll(".ue-header").forEach(card => {card.draggable = true;}); }
                        input.onchange      = (e) => { this.ueTitleInputChangeAction(e) };
                    }
                    else {
                        input.onmouseenter  = ( ) => { this.detachOnDragEventListeners(); };
                        input.onmouseleave  = ( ) => { this.attachOnDragEventListeners(); };
                    }
                })


                // Change custom subject name
                document.querySelectorAll(".subject-name.input").forEach(input => {
                    input.onchange = (e) => {
                        
                        const subjNewName   = e.target.value;
                        const subjectCard   = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                        const sem           = subjectCard.dataset.semester;
                        const ue            = subjectCard.dataset.ue;
                        const subjOldName   = subjectCard.dataset.subject;
                        const ueContent     = subjectCard.parentElement;
                        const ueCard        = ueContent.parentElement;


                        let diffName = true;
                        this.ueConfig[sem][ue].subjects.forEach(_subj => {if (_subj == subjNewName) diffName = false});

                        this.ueConfig[sem].__ues__.forEach(ueName => {
                            this.ueConfig[sem][ueName].subjects.forEach(_subj => {
                                if (_subj == subjNewName && _subj != subjOldName) {
                                    alert(this.lang == "fr" 
                                        ? "Cette matière existe déjà! Choisis un autre nom, s'il te plait" 
                                        : "This subject already exists! Please choose a different name"
                                    )
                                    diffName = false;
                                }
                            })
                        })
                            

                        if (diffName) {
                            const oldSubjIndex =    this.ueConfig[sem][ue].subjects.indexOf(subjOldName);
                            const pct = new Number(this.ueConfig[sem][ue].coefficients    [subjOldName]);

                            this.ueConfig[sem][ue].subjects[oldSubjIndex]=subjNewName ;    // Replace the subject's old name by the subject's new name
                            delete  this.ueConfig[sem][ue].coefficients [subjOldName];

                                    this.ueConfig[sem][ue].coefficients [subjNewName] = pct;
                                        
                            this.getGradesDatas();

                            if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                                ueContent.innerHTML = this.createAllSubjCardDetailed(sem, ue);
                            }
                            else {
                                ueContent.innerHTML = this.createAllSubjCardCompact(sem, ue);
                            }

                            const unclassifiedSection = document.querySelector(".unclassified-section");
                            const unclassifiedContent = unclassifiedSection.querySelector(".unclassified-content");
                            unclassifiedSection.style.height = "100%";
                            unclassifiedContent.innerHTML = this.createAllUnclassifiedSubjCard(sem);

                            setTimeout(() => {
                                const currentUnclassifiedSectionHeight = new Number(unclassifiedSection.clientHeight);
                                unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;}
                            , 100)
                            

                            this.attachEventListeners()
                            this.setGradesTableTotalCoef();
                            this.saveConfig()
                            this.getGradesDatas();
                        }
                        else {
                            e.target.focus();
                            e.target.style.background = "#ff7979";
                        }                     
                    }
                })

                document.querySelectorAll(".ue-delete-btn").forEach(btn => {
                    btn.onclick = e => {
                        const sem = e.target.dataset.semester;
                        const ueName = e.target.dataset.ue;
                        
                        const ueIndex = this.ueConfig[sem].__ues__.indexOf(ueName);

                        this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                        delete this.ueConfig[sem][ueName];

                        if (this.ueConfig[sem].__ues__.length == 0) {delete this.ueConfig[sem]}
                        
                        this.clearSimGradesForUE(sem, ueName);
                        this.saveConfig();
                        this.getGradesDatas();
                        this.renderContent();
                        this.attachEventListeners();
                    }
                })

                

                // Attach on-click event action for the simulated grade addition button
                document.querySelectorAll('.sim-add-btn').forEach(btn=>{
                    btn.onclick = (e)=>{
                        const ueName = e.target.dataset.ue;
                        const semX = e.target.dataset.semester;
                        const subj = e.target.dataset.subj;
                        this.ensureSimPath(semX, ueName, subj);
                        const typeInp =  document.querySelector(`.grade-simulee-input.sim-inp-type[data-semester="${semX}"][data-subj="${subj}"]`);
                        const gradeInp = document.querySelector(`.grade-simulee-input.sim-inp-grade[data-semester="${semX}"][data-subj="${subj}"]`);
                        const coefInp =  document.querySelector(`.grade-simulee-input.sim-inp-coef[data-semester="${semX}"][data-subj="${subj}"]`);
                        const dateInp =  document.querySelector(`.grade-simulee-input.sim-inp-date[data-semester="${semX}"][data-subj="${subj}"]`);
                        const type = typeInp?.value||`${this.lang=="fr"? 'Simulé' : "Simulated"}`;
                        const grade = parseFloat(gradeInp?.value||'');
                        const coef = parseFloat(coefInp?.value||'');
                        const date = dateInp?.value||'';
                        if(isNaN(grade) || isNaN(coef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }

                        this.ensureSimPath(semX, ueName, subj);

                        // Making sure the automatically generated name (if the user didn't input any type name) isn't the same as one that already exists 
                        // (incrementing an index every time it's the case and add it at the end of the new sim grade's name)
                        let newName = type, validNewName = newName != type, count = 2;

                        while (!validNewName && this.sim[semX][ueName][subj].length > 0) {
                            validNewName = true;
                            this.sim[semX][ueName][subj].forEach((_grade, _index) => {
                                if (_grade.type == newName && validNewName) {
                                    validNewName = false;
                                    newName = type + ` (${count})`;
                                    count++;
                                }
                            })
                        }

                        this.sim[semX][ueName][subj].push({
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
                        this.renderContent();
                    }
                });

                // Attach on-click event action for the simulated grades' deletion button
                document.querySelectorAll('.sim-del-btn').forEach(btn=>{
                    btn.onclick = (e) => {
                        const semX = e.target.dataset.semester;
                        const ueName = e.target.dataset.ue;
                        const subj = e.target.dataset.subj;
                        const id = e.target.dataset.simid;
                        this.sim[semX][ueName][subj].splice(id, 1);

                        this.deleteUnusedSimPath(false, semX, ueName, subj);
                        this.saveSim();
                        this.getGradesDatas();
                        this.renderContent(false);
                    }
                })

                // Attach on-change event action for simulated grades type/grade/coef/date fields
                document.querySelectorAll(".grade-simulee-input-edit").forEach(input => {
                    input.onchange = e => {
                        const ueName = e.target.dataset.ue;
                        const semX = e.target.dataset.semester;
                        const subj = e.target.dataset.subj;
                        const id = e.target.dataset.simid;
                        const gradeRow = e.target.parentElement.parentElement;
                        const gradeInp = gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-grade`);
                        const coefInp =  gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-coef `);
                        const newGrade = parseFloat(gradeInp?.value||'');
                        const newCoef = parseFloat(coefInp?.value||'');

                        if(isNaN(newGrade) || isNaN(newCoef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }
                        this.sim[semX][ueName][subj][id][e.target.dataset.modiftype] = e.target.value;

                        this.saveSim();
                        this.getGradesDatas();
                        this.renderContent(false);
                    }
                })

                
                document.querySelectorAll(".ue-info-clear.sim").     forEach(simClear => {
                    simClear.onclick = () => {this.clearSimGradesForUE(    simClear.dataset.semester, simClear.dataset.ue);this.renderContent();}
                });
                document.querySelectorAll(".ue-info-clear.disabled").forEach(disClear => {
                    disClear.onclick = () => {this.clearIgnoredGradesForUE(disClear.dataset.semester, disClear.dataset.ue);this.renderContent();}
                });

                
                document.querySelector(".unclassified-content").querySelectorAll(".grades-table").forEach(table => {
                    table.onmouseenter = () => {
                        if (this.editMode) document.querySelectorAll(".subject-card.unclassified").forEach(card => {card.draggable = false;})
                    }
                    table.onmouseleave = () => {
                        if (this.editMode) document.querySelectorAll(".subject-card.unclassified").forEach(card => {card.draggable = true;})
                    }
                })


                // Change to English
                document.getElementById('en-lang-btn').onclick = () => {
                    if (this.lang == "fr") {
                        this.lang = "en";
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                        document.getElementById('fr-lang-btn').classList.remove('active')
                        document.getElementById('en-lang-btn').classList.add('active')
                        this.renderContent(false);
                    }
                };

                // Change to French
                document.getElementById('fr-lang-btn').onclick = () => {
                    if (this.lang == "en") {
                        this.lang = "fr";
                        localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                        document.getElementById('fr-lang-btn').classList.add('active')
                        document.getElementById('en-lang-btn').classList.remove('active')
                        this.renderContent(false);
                    }
                };
                
                // Edit mode
                document.getElementById('editModeBtn').onclick = () => {
                    this.editMode = !this.editMode;
                    this.renderContent();
                    this.attachEventListeners();
                };
                
                // Import
                document.getElementById('importBtn').onclick = () => this.toggleImportMenu();

                // Export
                document.getElementById('exportBtn').onclick = () => this.exportData();

                if (this.editMode) {this.attachAllOnDragEventListeners();} else {this.detachOnDragEventListeners();}
            }

            /** Ensures that the dragend event of the document results in resetting the display if the dragged element is a subject card that is not selected */
            documentOnDragEndEvent() {
                const subjectCard = this.currentlyDraggedCard;

                if (this.draggedElementDroppedInInputField && subjectCard) {

                    // checking if the dragged subject card is selected:
                    let draggedSubjectCardIsSelected = false;
                    if (this.selectedSubjectCards.length > 0) {
                        this.selectedSubjectCards.forEach(divId => {if (divId==subjectCard.id) {draggedSubjectCardIsSelected=true}});
                    }

                    if (!draggedSubjectCardIsSelected) {
                        const dropFieldAdd          = document.querySelector(".drop-field.create-ue");
                        const dropFieldAddHitbox    = document.querySelector(".drop-field-create-ue-hitbox");
                        const dropFieldRemove       = document.querySelector(".drop-field.remove-from-ue");
                        const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-ue-hitbox");
                        subjectCard.style.width = "";

                        if (subjectCard.classList.contains("unclassified")) {
                            subjectCard.querySelector(".grades-table").style.display = "table";
                            subjectCard.querySelector(".subject-card-header").style.border = "none";
                            subjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                        }
                        else if (subjectCard.classList.contains("compact")) {
                            subjectCard.querySelector(".grades-table-coef").style.display = "flex";
                        }
                        else {
                            subjectCard.querySelector(".subject-card-header").children[0].style.width =                         "42%";
                            subjectCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "58%";
                            subjectCard.querySelector(".grades-table").style.display = "table";
                            subjectCard.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                            subjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                        }

                        if (this.selectedSubjectCards.length == 0) {
                            setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher => {teacher.style.display = "table-cell"})}, 100)
                            document.querySelector(".semester-content").classList.remove("dragging");
                            dropFieldAdd.classList.remove("show");
                            dropFieldAddHitbox.classList.remove("show");
                            dropFieldRemove.classList.remove("show");
                            dropFieldRemoveHitbox.classList.remove("show");
                            this.removeSubjectCardFromSubjectSelection();
                        }
                        
                    } else {
                        this.selectedSubjectCards.forEach(selectedSubjectCardId2 => {
                            const selectedSubjectCard2 = document.getElementById(selectedSubjectCardId2);
                            selectedSubjectCard2.style.width = "";

                            if (selectedSubjectCard2.classList.contains("unclassified")) {
                                selectedSubjectCard2.querySelector(".grades-table").style.display = "table";
                                selectedSubjectCard2.querySelector(".subject-card-header").style.border = "none";
                                selectedSubjectCard2.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                            
                            } 
                            else if (selectedSubjectCard2.classList.contains("compact")) {
                                selectedSubjectCard2.querySelector(".grades-table-coef").style.display = "flex";
                            }
                            else {
                                selectedSubjectCard2.querySelector(".subject-card-header").children[0].style.width =                         "42%";
                                selectedSubjectCard2.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "58%";
                                selectedSubjectCard2.querySelector(".grades-table").style.display = "table";
                                selectedSubjectCard2.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                                selectedSubjectCard2.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                            }
                        })
                    }
                }
            }
            
            attachCheckboxListeners(container) {
                // Reusable method to attach listeners to grade checkboxes
                container.querySelectorAll('.grade-checkbox').forEach(chbx => {
                    chbx.onclick = (e) => {
                        const semX = e.target.dataset.semester;
                        const subj = e.target.dataset.subj;
                        const simTimeStamp = e.target.dataset?.simtimestamp;
                        const gradeId = e.target.dataset?.gradeid;
                        const ignoredKey = [semX, subj, simTimeStamp || gradeId].join("\\");
                        if (e.target.checked) {
                            // remove this specific ignored key if present
                            this.ignoredGrades = this.ignoredGrades?.filter(id => id !== ignoredKey);
                        } else {
                            // add ignored key if not already present
                            if (!this.ignoredGrades?.includes(ignoredKey)) this.ignoredGrades.push(ignoredKey);
                        }
                        this.saveIgnoredGrades();
                        // this.getGradesDatas({semX, ue:undefined, subj});
                        this.getGradesDatas();
                        this.renderContent(false);
                    }
                });
            }

            ueHeaderClickEvent(e) {
                document.body.onmousemove = (e) => {
                    e.preventDefault();
                    document.body.onmouseup = null;
                    document.body.onmousemove = null;
                };
                document.body.onmouseup = (e) => {
                    const header = e.target.closest('.ue-header');
                    const toggle = header.querySelector('.ue-toggle');
                    const sem = header.dataset.semester;
                    const ueName = header.dataset.ue;
                    const ueContent = header.parentElement.querySelector(".ue-details");

                    if (toggle.classList.contains('open')) {
                        ueContent.innerHTML = this.createAllSubjCardCompact(sem, ueName);
                        ueContent.classList.add('compact');
                        toggle.classList.remove('open');
                        this.setGradesTableTotalCoef()
                    } else {
                        ueContent.innerHTML = this.createAllSubjCardDetailed(sem, ueName);
                        ueContent.classList.remove('compact');
                        toggle.classList.add('open');
                        this.attachCheckboxListeners(ueContent);
                        this.setGradesTableTotalCoef()
                    }
                    
                    this.attachDropFieldsEventListeners("insert", ueContent.parentElement)
                    document.body.onmousemove = null;
                    document.body.onmouseup = null;
                }
            }
            
            ueTitleInputChangeAction(e) {
                const sem = e.target.dataset.semester;
                const oldUeName = e.target.dataset.ue; 
                const oldUeIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);
                const newUeName = e.target.value;
                
                this.ueConfig[sem][newUeName] = this.ueConfig[sem][oldUeName];
                delete this.ueConfig[sem][oldUeName];
                this.ueConfig[sem].__ues__[oldUeIndex] = newUeName;

                this.saveConfig()
                this.getGradesDatas();
                this.renderContent(false)
            }

            notifDelBtnAttachListeners() {
                document.querySelectorAll(".selected-subject-card-notif-div-del-btn").forEach(delBtn => {
                    this.notifDelBtnAttachListener(delBtn);
                })
            }

            notifDelBtnAttachListener(delBtn) {
                delBtn.onclick = (e) => {
                    const notifDiv = e.target.parentElement;
                    this.removeSubjectCardFromSubjectSelection({notifDiv});
                };
            }

        //#endregion






        //#region -REGION: Drag events





            // #region Dragged element events

            draggedElementOnDragStartEvent(e, {draggedElement, card}) {
                if (card.classList.contains("subject-card")) {
                    this.currentlyDraggedElement = draggedElement;
                    this.currentlyDraggedCard = card;
                    if (e.target.classList.contains("any-input")) {return};
                    this.currentlyDraggedCard.style.width = "50%";

                    if (this.currentlyDraggedCard.classList.contains("unclassified")) {
                        this.currentlyDraggedCard.querySelector(".grades-table").style.display = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header").style.border = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 20px 20px";
                        
                    } 
                    else if (this.currentlyDraggedCard.classList.contains("compact")) {
                        this.currentlyDraggedCard.querySelector(".grades-table-coef").style.display = "none";
                    }
                    else {
                        this.currentlyDraggedCard.querySelector(".subject-card-header").children[0].style.width =                           "50%";
                        this.currentlyDraggedCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =   "50%";
                        this.currentlyDraggedCard.querySelector(".grades-table").style.display = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header").style.borderBottom = "none";
                        this.currentlyDraggedCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 20px 20px";
                    }

                    document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                    document.querySelector(".semester-content")                 .classList.add("dragging");
                    document.querySelector(".drop-field.create-ue")             .classList.add("show");
                    document.querySelector(".drop-field-create-ue-hitbox")      .classList.add("show");
                    document.querySelector(".drop-field.remove-from-ue")        .classList.add("show");
                    document.querySelector(".drop-field-remove-from-ue-hitbox") .classList.add("show");

                    document.querySelectorAll(".drop-ue-card-insert-plus,  .drop-subject-card-insert-plus ").forEach(plus  => {plus.classList.remove("show");})
                    document.querySelectorAll(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").forEach(arrow => {arrow.classList.add("show");})

                    const insertFieldTexts = document.querySelectorAll(".drop-ue-card-insert-text,  .drop-subject-card-insert-text");
                    insertFieldTexts.forEach(insertFieldText => {
                        insertFieldText.classList.replace("add", "insert");
                        insertFieldText.parentElement.classList.replace("add", "insert");
                    })


                    if (!this.currentlyDraggedCard.classList.contains("unclassified")) {
                        const sem = this.currentlyDraggedCard.dataset.semester;
                        const ue = this.currentlyDraggedCard.dataset.ue;
                        const index = this.currentlyDraggedCard.dataset.index;

                        const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-ue="${ue}"][data-index="${index}"]`)
                        const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");

                        const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-ue="${ue}"][data-index="${parseInt(index)+1}"]`)
                        const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");

                        this.detachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
                        this.detachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
                        upperInsertField.classList.remove("show");
                        lowerInsertField.classList.remove("show");

                        this.waitingForLastTimeoutToFinish = true;
                        setTimeout(() => {
                            upperInsertField.style.display = "none";
                            lowerInsertField.style.display = "none";
                            this.waitingForLastTimeoutToFinish = false;
                        }, 200)
                    }
                }
                else if (card.classList.contains("ue-card")) {
                    this.currentlyDraggedElement = draggedElement;
                    this.currentlyDraggedCard = card;

                    const sem =     this.currentlyDraggedCard.dataset.semester;
                    const ue =      this.currentlyDraggedCard.dataset.ue;
                    const index =   this.currentlyDraggedCard.dataset.index;
                    const ueCardElems = this.currentlyDraggedCard.querySelectorAll(".ue-card, .ue-header, .ue-info, .ue-card-content, .ue-details");

                    const upperInsertField = document.querySelector(`.drop-field.insert-field.ue[data-semester="${sem}"][data-index="${index}"]`)
                    const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-ue-card-insert-hitbox");

                    const lowerInsertField = document.querySelector(`.drop-field.insert-field.ue[data-semester="${sem}"][data-index="${parseInt(index)+1}"]`)
                    const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-ue-card-insert-hitbox");

                    const subjectInsertFields = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]`)
                    const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});

                    const subjectCards = document.querySelectorAll(`.subject-card[data-semester="${sem}"][data-ue="${ue}"]`);

                    this.detachInsertFieldHitboxEventListeners(upperInsertFieldHitbox);
                    this.detachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox);
                    upperInsertField.classList.remove("show");
                    lowerInsertField.classList.remove("show");

                    subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {
                        this.detachInsertFieldHitboxEventListeners(subjInsFieldHitbox);
                    })
                    subjectInsertFields.forEach(subjInsField => {
                        subjInsField.classList.remove("show");
                    })
                    subjectCards.forEach(subjCard => {
                        subjCard.classList.add("collapse");
                    })
                    ueCardElems.forEach(elem => {elem.classList.add("collapse")})
                    this.currentlyDraggedCard.classList.add("collapse");

                    this.waitingForLastTimeoutToFinish = true;
                    setTimeout(() => {
                        upperInsertField.style.display = "none";
                        lowerInsertField.style.display = "none";
                        subjectInsertFields.forEach(subjInsField => {
                            subjInsField.style.display = "none";
                        })
                        subjectCards.forEach(subjCard => {
                            subjCard.style.display = "none";
                        })
                        ueCardElems.forEach(elem => {
                            if (!elem.classList.contains("ue-header")) {elem.style.display = "none";}
                        })
                        this.waitingForLastTimeoutToFinish = false;
                    }, 200)
                }

                e.dataTransfer.effectAllowed = "link";
                e.dataTransfer.setDragImage(document.getElementById("emptyDiv"), 0, 0);
                e.dataTransfer.setData("text", this.currentlyDraggedCard.id)
            };
            draggedElementOnDragEndEvent(e, {draggedElement, card}) {
                card.style.width = "";
                this.currentlyDraggedElement = undefined;
                this.currentlyDraggedCard    = undefined;

                if (card.classList.contains("subject-card")) {
                        if (card.classList.contains("unclassified")) {
                        card.querySelector(".grades-table").style.display = "table";
                        card.querySelector(".subject-card-header").style.border = "none";
                        card.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                    else if (card.classList.contains("compact")) {
                        card.querySelector(".grades-table-coef").style.display = "flex";
                    }
                    else {
                        card.querySelector(".subject-card-header").children[0].style.width =                         "42%";
                        card.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "58%";
                        card.querySelector(".grades-table").style.display = "table";
                        card.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                        card.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                    
                    if (this.selectedSubjectCards.length == 0) {
                        setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher => {teacher.style.display = "table-cell"})}, 100)
                        document.querySelector(".semester-content")                 .classList.remove("dragging");
                        document.querySelector(".drop-field.create-ue")             .classList.remove("show");
                        document.querySelector(".drop-field-create-ue-hitbox")      .classList.remove("show");
                        document.querySelector(".drop-field.remove-from-ue")        .classList.remove("show");
                        document.querySelector(".drop-field-remove-from-ue-hitbox") .classList.remove("show");

                        document.querySelectorAll(".drop-ue-card-insert-plus,  .drop-subject-card-insert-plus ").forEach(plus  => {plus.classList.add("show");})
                        document.querySelectorAll(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").forEach(arrow => {arrow.classList.remove("show");})

                        const insertFieldTexts = document.querySelectorAll(".drop-ue-card-insert-text,  .drop-subject-card-insert-text");
                        insertFieldTexts.forEach(insertFieldText => {
                            insertFieldText.classList.replace("insert", "add");
                            insertFieldText.parentElement.classList.replace("insert", "add");
                        })
                    }
                    
                    const unclassifiedSection = document.querySelector(".unclassified-section");

                    setTimeout(() => {
                        unclassifiedSection.style.height = "100%";
                        const currentUnclassifiedSectionHeight = new Number(unclassifiedSection.clientHeight);
                        unclassifiedSection.style.height = `${currentUnclassifiedSectionHeight+4}px`;}
                    , 100)

                    if (!card.classList.contains("unclassified")) {
                        const sem   = card.dataset.semester;
                        const ue    = card.dataset.ue;
                        const index = card.dataset.index;
                        const upperInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-ue="${ue}"][data-index="${index}"]`)
                        const lowerInsertField = document.querySelector(`.drop-field.insert-field.subject[data-semester="${sem}"][data-ue="${ue}"][data-index="${parseInt(index)+1}"]`)

                        if (upperInsertField) {
                            if (this.waitingForLastTimeoutToFinish) {
                                setTimeout(() => {
                                    upperInsertField.style.display = "";
                                    setTimeout(() => {
                                        upperInsertField.classList.add("show");
                                        
                                        const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                        this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                                    }, 10);
                                }, 200)
                            }
                            else {
                                upperInsertField.style.display = "";
                                setTimeout(() => {
                                    upperInsertField.classList.add("show");

                                    const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                    this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                                }, 10);
                                
                            }
                        }
                        
                        if (lowerInsertField) {
                            if (this.waitingForLastTimeoutToFinish) {
                                setTimeout(() => {
                                    lowerInsertField.style.display = "";
                                    setTimeout(() => {
                                        lowerInsertField.classList.add("show");

                                        const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                        this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                                    }, 10)
                                }, 200)
                            }
                            else {
                                lowerInsertField.style.display = "";
                                setTimeout(() => {
                                    lowerInsertField.classList.add("show");
                                    
                                    const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-subject-card-insert-hitbox");
                                    this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                                }, 10)
                            }
                        }
                    }
                }
                else if (card.classList.contains("ue-card")) {
                    const sem   = card.dataset.semester;
                    const ue    = card.dataset.ue;
                    const index = card.dataset.index;
                    const ueCardElems = card.querySelectorAll(".ue-card, .ue-header, .ue-info, .ue-card-content, .ue-details");

                    const upperInsertField = document.querySelector(`.drop-field.insert-field.ue[data-semester="${sem}"][data-index="${index}"]`)
                    const lowerInsertField = document.querySelector(`.drop-field.insert-field.ue[data-semester="${sem}"][data-index="${parseInt(index)+1}"]`)
                    const subjectInsertFields = document.querySelectorAll(`.drop-field.insert-field.subject[data-semester="${sem}"]`)
                    const subjectCards = document.querySelectorAll(`.subject-card[data-semester="${sem}"][data-ue="${ue}"]`);

                    if (upperInsertField) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                upperInsertField.style.display = "";
                                setTimeout(() => {
                                    upperInsertField.classList.add("show");
                                    
                                    const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-ue-card-insert-hitbox");
                                    this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                                }, 10);
                            }, 200)
                        }
                        else {
                            upperInsertField.style.display = "";
                            setTimeout(() => {
                                upperInsertField.classList.add("show");

                                const upperInsertFieldHitbox = upperInsertField.querySelector(".drop-ue-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(upperInsertFieldHitbox)
                            }, 10);
                            
                        }
                    }
                    
                    if (lowerInsertField) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                lowerInsertField.style.display = "";
                                setTimeout(() => {
                                    lowerInsertField.classList.add("show");

                                    const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-ue-card-insert-hitbox");
                                    this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                                }, 10)
                            }, 200)
                        }
                        else {
                            lowerInsertField.style.display = "";
                            setTimeout(() => {
                                lowerInsertField.classList.add("show");
                                
                                const lowerInsertFieldHitbox = lowerInsertField.querySelector(".drop-ue-card-insert-hitbox");
                                this.attachInsertFieldHitboxEventListeners(lowerInsertFieldHitbox)
                            }, 10)
                        }
                    }

                    if (subjectInsertFields.length > 0) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                subjectInsertFields.forEach(subjInsField => {
                                    subjInsField.classList.display = "";
                                })
                                
                                setTimeout(() => {
                                    subjectInsertFields.forEach(subjInsField => {
                                        subjInsField.classList.add("show");
                                    })

                                    const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});
                                    subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {this.attachInsertFieldHitboxEventListeners(subjInsFieldHitbox)})
                                }, 10)
                            }, 200)
                        }
                        else {
                            subjectInsertFields.forEach(subjInsField => {
                                subjInsField.classList.display = "";
                            })
                            setTimeout(() => {
                                subjectInsertFields.forEach(subjInsField => {
                                    subjInsField.classList.add("show");
                                })
                            
                                const subjectInsertFieldHitboxes = Object.values(subjectInsertFields).map(elem => {return elem.querySelector(".drop-subject-card-insert-hitbox")});
                                subjectInsertFieldHitboxes.forEach(subjInsFieldHitbox => {this.attachInsertFieldHitboxEventListeners(subjInsFieldHitbox)})
                            }, 10)
                        }
                    }

                    if (subjectCards.length > 0) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                subjectCards.forEach(subjCard => {
                                    subjCard.style.display = "";
                                })                                
                                setTimeout(() => {
                                    subjectCards.forEach(subjCard => {
                                        subjCard.classList.remove("collapse");
                                    })
                                }, 10)
                            }, 200)
                        }
                        else {
                            subjectCards.forEach(subjCard => {
                                subjCard.style.display = "";
                            })
                            setTimeout(() => {
                                subjectCards.forEach(subjCard => {
                                    subjCard.classList.remove("collapse");
                                })
                            }, 10)
                        }
                    }

                    if (ueCardElems.length > 0) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                ueCardElems.forEach(elem => {
                                    if (!elem.classList.contains("ue-header")) {elem.style.display = "";}
                                })                                
                                setTimeout(() => {
                                    ueCardElems.forEach(elem => {elem.classList.remove("collapse")})
                                }, 10)
                            }, 200)
                        }
                        else {
                            ueCardElems.forEach(elem => {
                                if (!elem.classList.contains("ue-header")) {elem.style.display = "";}
                            })
                            setTimeout(() => {
                                ueCardElems.forEach(elem => {elem.classList.remove("collapse")})
                            }, 10)
                        }
                    }
                    
                    if (card) {
                        if (this.waitingForLastTimeoutToFinish) {
                            setTimeout(() => {
                                card.style.display = "";
                                setTimeout(() => {
                                    card.classList.remove("collapse");
                                }, 10)
                            }, 200)
                        }
                        else {
                            card.style.display = "";
                            setTimeout(() => {
                                card.classList.remove("collapse");
                            }, 10)
                        }
                    }
                }
            }
            draggedSelectedElementOnDragStartEvent(e, {draggedElement, card}) {
                this.selectedSubjectCards.forEach(selectedSubjectCardId => {
                    const selectedSubjectCard = document.getElementById(selectedSubjectCardId);
                    selectedSubjectCard.style.width = "50%";

                    if (selectedSubjectCard.classList.contains("unclassified")) {
                        setTimeout(() => {selectedSubjectCard.querySelector(".grades-table").style.display = "none";}, 10)
                        selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px";
                    
                    } 
                    else if (selectedSubjectCard.classList.contains("compact")) {
                        selectedSubjectCard.querySelector(".grades-table-coef").style.display = "none";
                    }
                    else {
                        selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width =                         "50%";
                        selectedSubjectCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "50%";
                        setTimeout(() => {selectedSubjectCard.querySelector(".grades-table").style.display = "none";}, 10)
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px";
                    }
                })
                document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                document.querySelector(".semester-content")                 .classList.add("dragging");
                document.querySelector(".drop-field.create-ue")             .classList.add("show");
                document.querySelector(".drop-field-create-ue-hitbox")      .classList.add("show");
                document.querySelector(".drop-field.remove-from-ue")        .classList.add("show");
                document.querySelector(".drop-field-remove-from-ue-hitbox") .classList.add("show");

                e.dataTransfer.effectAllowed = "link";
                e.dataTransfer.setDragImage(document.getElementById("emptyDiv"), 0, 0);
                e.dataTransfer.setData("text", card.id)
            };
            draggedSelectedElementOnDragEndEvent(e, {draggedElement, card}) {

                this.selectedSubjectCards.forEach(selectedSubjectCardId => {
                    const selectedSubjectCard = document.getElementById(selectedSubjectCardId);
                    selectedSubjectCard.style.width = "";

                    if (selectedSubjectCard.classList.contains("unclassified")) {
                        selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                        selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    
                    } 
                    else if (selectedSubjectCard.classList.contains("compact")) {
                        selectedSubjectCard.querySelector(".grades-table-coef").style.display = "flex";
                    }
                    else {
                        selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width =                         "42%";
                        selectedSubjectCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "58%";
                        selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                })
            }

            // #endregion
            



            // #region Subject insertion events

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
                const dataTransferMatch  = dataTransfer.match(/ue-card|subject-card/);


                e.preventDefault(); 

                insertFieldHitbox.ondragover = (e) => {this.insertFieldHitboxOnDragOverEvent(e)};

                if (dataTransferMatch?.[0] == "subject-card") {
                    this.dropFieldSubjectInsertAction(dataTransfer, insertField);
                }
                else if (dataTransferMatch?.[0] == "ue-card") {
                    this.dropFieldUEInsertAction(dataTransfer, insertField);
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

                if (this.selectedSubjectCards.length == 0) {
                    this.dropFieldSubjectInsertAction(null, insertField)
                }
                else {
                    this.dropFieldSubjectInsertAction(this.selectedSubjectCards[0], insertField);
                }
            }

            attachInsertFieldHitboxEventListeners(insertFieldHitbox) {
                insertFieldHitbox.ondragover     = (e) => {this.insertFieldHitboxOnDragOverEvent(e)};
                insertFieldHitbox.ondragleave    = (e) => {this.insertFieldHitboxOnDragLeaveEvent(e)};
                insertFieldHitbox.ondrop         = (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "link";
                    const data = e.target.dataset;
                    if (data.type.match(/subject|ue/)) {
                        this.insertFieldHitboxOnDropEvent(e);
                    }
                    else {
                        this.dropFieldToNewUEAction(e.dataTransfer.getData("text"), data.index);
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
                        if (this.selectedSubjectCards.length > 0) {
                            this.dropFieldToNewUEAction(this.selectedSubjectCards[0], data.index);
                        }
                        else {
                            this.dropFieldToNewUEAction(null, data.index);
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





            attachAllOnDragEventListeners() {
                this.attachOnDragEventListeners();
                this.attachDropFieldsEventListeners();
            }
            // MARK: attach ondrag events
            attachOnDragEventListeners() {   // Add ONDRAG cards event

                document.querySelectorAll(".subject-card").forEach(subjectCard => {
                    let draggableElement = "";
                    const isCompact = subjectCard.classList.contains("compact");
                    if (isCompact) {draggableElement = subjectCard;}
                    else {draggableElement = subjectCard.querySelector(".subject-card-header");}
                    
                    draggableElement.draggable = true;

                    if (!this.selectedSubjectCards.includes(subjectCard.id)) {
                        draggableElement.ondragstart = (e) => {this.draggedElementOnDragStartEvent( e, {draggableElement, card: subjectCard})};
                        draggableElement.ondragend   = (e) => {this.draggedElementOnDragEndEvent(   e, {draggableElement, card: subjectCard})};
                    }
                    else {
                        draggableElement.ondragstart = (e) => {this.draggedSelectedElementOnDragStartEvent( e, {draggedElement: draggableElement, card: subjectCard})};
                        draggableElement.ondragend   = (e) => {this.draggedSelectedElementOnDragEndEvent(   e, {draggedElement: draggableElement, card: subjectCard})};
                    }
                })

                document.querySelectorAll(".ue-header").forEach(ueHeader => {
                    const ueCard = ueHeader.parentElement;
                    ueHeader.draggable = true;
                    ueHeader.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {ueHeader, card: ueCard})}
                    ueHeader.ondragend   = (e) => {this.draggedElementOnDragEndEvent(  e, {ueHeader, card: ueCard})}
                })

                this.notifDelBtnAttachListeners();
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

                document.querySelectorAll(".ue-header").forEach(ueHeader => {
                    ueHeader.draggable   = false;
                    ueHeader.ondragstart = null;
                    ueHeader.ondragend   = null;
                })
            }




            
            // MARK: addSelectedCardNotifDiv
            addSelectedCardNotifDiv(semester, subject, type, targetId="none") {
                const selectionNotifDiv = document.createElement("div");
                selectionNotifDiv.className = `selected-subject-card-notif-div`;
                selectionNotifDiv.id = `selected-subject-card-notif-div-for-${type}-${subject}-from-semester-${semester}`;
                selectionNotifDiv.dataset.type = type;
                selectionNotifDiv.dataset.subject = subject;
                selectionNotifDiv.dataset.semester = semester;
                selectionNotifDiv.dataset.targetid = targetId;
                selectionNotifDiv.innerHTML = `
                    <span style="font-size: 20px; height: 20px; user-select: none">${">"}</span>
                    <span style="font-weight: 600; font-size: 14px; color: white">${subject}</span>
                    ${this.lang == "fr" ? `est sélectionné!` : `is selected!`}
                    <div class="selected-subject-card-notif-div-del-btn" id="selected-subject-card-notif-div-del-btn-for-${type}-${subject}-from-semester-${semester}" data-targetId="${targetId}">x</div>
                `;

                return selectionNotifDiv;
            }


            // MARK: remove from subject selection
            /** 
            *  Manage all the actions involving the deletion of a subj card from the selection of subj cards (this.selectedSubjectCards)
            * 
            * @param notifDiv: the div of the notif linked to the selected subject card
            * @param elementDroppedInField: if this method is called from triggering an ondrop event of a drop field, pass the dropped element in this argument
            */
            removeSubjectCardFromSubjectSelection({notifDiv="all", elementDroppedInField=undefined}={notifDiv:"all", elementDroppedInField:undefined}) {
                if (notifDiv=="all") {      // clear all subject card selection as well as their respective notif
                    
                    this.selectedSubjectCards.forEach((selectedSubjectCardId, index) => {
                        const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

                        selectedSubjectCard.style.width = "";

                        if (selectedSubjectCard.classList.contains("unclassified")) {
                            selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                            selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                            selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                        }
                        else if (selectedSubjectCard.classList.contains("compact")) {
                            selectedSubjectCard.querySelector(".grades-table-coef").style.display = "flex";
                        }
                        else {
                            selectedSubjectCard.querySelector(".subject-card-header").children[0].style.width = "42%";
                            selectedSubjectCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "58%";
                            selectedSubjectCard.querySelector(".grades-table").style.display = "table";
                            selectedSubjectCard.querySelector(".subject-card-header").style.borderBottom = "4px solid white";
                            selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 0px 0px";
                        }
                        
                        const tick = selectedSubjectCard.querySelector(".tick-icon");
                        tick.outerHTML = this.draggableIcon(`${selectedSubjectCard.dataset.type}-subject-card`, {targetId: `${selectedSubjectCard.dataset.targetid}`, type: selectedSubjectCard.dataset.type});
                        const dragIcon = selectedSubjectCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};

                        const correspNotifDiv = document.querySelector(`.selected-subject-card-notif-div[data-targetid="${selectedSubjectCard.id}"]`);
                        correspNotifDiv.classList.remove("on");
                        setTimeout(()=>{
                            correspNotifDiv.remove();
                        }, 300)

                        selectedSubjectCard.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {card: selectedSubjectCard})};
                        selectedSubjectCard.ondragend   = (e) => {this.draggedElementOnDragEndEvent  (e, {card: selectedSubjectCard})};
                    })

                    setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
                    setTimeout(() => {document.querySelectorAll(".grades-table-classAvg").forEach(classAvg => {classAvg.style.display = "table-cell"})}, 100)
                    
                    document.querySelector(".semester-content")                 .classList.remove("dragging");
                    document.querySelector(".drop-field.create-ue")             .classList.remove("show");
                    document.querySelector(".drop-field-create-ue-hitbox")      .classList.remove("show");
                    document.querySelector(".drop-field.remove-from-ue")        .classList.remove("show");
                    document.querySelector(".drop-field-remove-from-ue-hitbox") .classList.remove("show");

                    document.querySelectorAll(".ue-title.input").forEach(input => {
                        input.parentElement.style.transition = "";
                        input.parentElement.style.width = "42%";
                    })
                    document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoef => {
                        totalCoef.parentElement.style.transition = "";
                        totalCoef.parentElement.style.width = "47%";
                    })

                    this.selectedSubjectCards = [];
                    this.selectedSubjectCardsSortedByUe = {};
                } 
                else {      // clear the specifically given notifDiv from the selection
                    let subjectCard = "";
                    if (!elementDroppedInField) {
                        subjectCard = document.getElementById(notifDiv.dataset.targetid);
                    }
                    

                    notifDiv.classList.remove("on");
                    setTimeout(()=>{
                        notifDiv.remove();
                        let highestWidth = 0;
                        const notifDivContainer = document.querySelector(".selected-subject-card-notif-container");
                        notifDivContainer.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                        notifDivContainer.style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;
                    }, 300)

                    this.selectedSubjectCards.forEach((selectedSubjectCardId, index) => {
                        const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

                        if (selectedSubjectCard == subjectCard) 
                            this.selectedSubjectCards.splice(index, 1)
                        }
                    )
                    Object.keys(this.selectedSubjectCardsSortedByUe).forEach((ueName, ueIndex) => {
                        this.selectedSubjectCardsSortedByUe[ueName].forEach((selectedSubjectCard, subjIndex) => {
                            this.selectedSubjectCardsSortedByUe[ueName].splice(subjIndex, 1);
                        })
                        if (this.selectedSubjectCardsSortedByUe[ueName].length == 0) {
                            delete this.selectedSubjectCardsSortedByUe[ueName];
                        }
                    })
                
                    if (this.selectedSubjectCards.length == 0) {
                        setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
                        setTimeout(() => {document.querySelectorAll(".grades-table-classAvg").forEach(classAvg => {classAvg.style.display = "table-cell"})}, 100)
                        
                        document.querySelector(".semester-content")                 .classList.remove("dragging");
                        document.querySelector(".drop-field.create-ue")             .classList.remove("show");
                        document.querySelector(".drop-field-create-ue-hitbox")      .classList.remove("show");
                        document.querySelector(".drop-field.remove-from-ue")        .classList.remove("show");
                        document.querySelector(".drop-field-remove-from-ue-hitbox") .classList.remove("show");
                        document.querySelectorAll(".ue-title.input").forEach(input => {
                            input.parentElement.style.transition = "";
                            input.parentElement.style.width = "42%";
                        })
                        document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoef => {
                            totalCoef.parentElement.style.transition = "";
                            totalCoef.parentElement.style.width = "47%";
                        })
                    }

                    const tick = subjectCard.querySelector(".tick-icon");
                    if (tick) {
                        tick.outerHTML = this.draggableIcon(`${notifDiv.dataset.type}-subject-card`, {targetId: `${notifDiv.dataset.targetid}`, type: notifDiv.dataset.type});
                        const dragIcon = subjectCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};
                    }

                    subjectCard.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {card:subjectCard})};
                    subjectCard.ondragend   = (e) => {this.draggedElementOnDragEndEvent  (e, {card:subjectCard})};
                }
                
                
                // Ensure the subject insertion drop fields are displaying the right text
                document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
                    if (this.selectedSubjectCards.length == 0) {
                        subjInsertField.querySelector(".drop-ue-card-insert-plus , .drop-subject-card-insert-plus ").classList.add("show");
                        subjInsertField.querySelector(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").classList.remove("show");
                        subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").classList.replace("insert", "add");
                        subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("insert", "add");
                    }
                    else {
                        subjInsertField.querySelector(".drop-ue-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
                        subjInsertField.querySelector(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
                        subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").classList.replace("add", "insert");
                        subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("add", "insert");
                    }
                });
            }





            // MARK: dragIconOnClickEvent
            dragIconOnClickEvent(e, dragIcon, dontAddToSelection=false) {
                let subjectCard = e?.target ? e.target.parentElement.parentElement.parentElement : e;
                let draggableElement = subjectCard;
                const dropFieldAdd          = document.querySelector(".drop-field.create-ue");
                const dropFieldAddHitbox    = document.querySelector(".drop-field-create-ue-hitbox");
                const dropFieldRemove       = document.querySelector(".drop-field.remove-from-ue");
                const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-ue-hitbox");
                const type = dragIcon.dataset.type;
                if (type=="detailed" && e?.target) {
                    subjectCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                }
                if (type != "compact") {
                    draggableElement = subjectCard.querySelector(".subject-card-header");
                }
                
                draggableElement.draggable = true;
                draggableElement.ondragstart = (e) =>   {this.draggedSelectedElementOnDragStartEvent(e, {draggedElement: draggableElement, card:subjectCard})};
                draggableElement.ondragend = (e) =>     {this.draggedSelectedElementOnDragEndEvent(  e, {draggedElement: draggableElement, card:subjectCard})};

                if (!dontAddToSelection) {
                    this.selectedSubjectCards.push(subjectCard.id);
                    if (!this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue]) { this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue] = []; };
                    this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue].push({subjectCardId: subjectCard.id, selectionIndex: this.selectedSubjectCards.length-1});

                    const selectionNotifDiv = this.addSelectedCardNotifDiv(subjectCard.dataset.semester, subjectCard.dataset.subject, type, subjectCard.id);

                    document.querySelector(".selected-subject-card-notif-container").appendChild(selectionNotifDiv);
                    this.notifDelBtnAttachListener(selectionNotifDiv.querySelector(".selected-subject-card-notif-div-del-btn"));

                    let highestWidth = 0;
                    document.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                    document.querySelector(".selected-subject-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

                    setTimeout(()=>{selectionNotifDiv.classList.add("on")}, 10)

                    // Ensure the subject insertion drop fields are showing the right text
                    document.querySelectorAll(".drop-field.insert-field").forEach(subjInsertField => {
                        if (this.selectedSubjectCards.length == 0) {
                            // shouldn't be reached, normally
                            subjInsertField.querySelector(".drop-ue-card-insert-plus , .drop-subject-card-insert-plus ").classList.add("show");
                            subjInsertField.querySelector(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").classList.remove("show");
                            subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").classList.replace("insert", "add");
                            subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("insert", "add");
                        }
                        else {
                            subjInsertField.querySelector(".drop-ue-card-insert-plus , .drop-subject-card-insert-plus ").classList.remove("show");
                            subjInsertField.querySelector(".drop-ue-card-insert-arrow, .drop-subject-card-insert-arrow").classList.add("show");
                            subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").classList.replace("add", "insert");
                            subjInsertField.querySelector(".drop-ue-card-insert-text, .drop-subject-card-insert-text").parentElement.classList.replace("add", "insert");
                        }
                    });
                }

                document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                document.querySelectorAll(".ue-title.input").forEach(input => {
                    input.parentElement.style.transition = "width 0.3s ease";
                    input.parentElement.style.width = "30%";
                })
                document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoef => {
                    totalCoef.parentElement.style.transition = "width 0.3s ease";
                    totalCoef.parentElement.style.width = "56%";
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




            // #region -Drop fields actions






                // MARK: attach dropFields events
                attachDropFieldsEventListeners(target="all", id="") {
                    const dropFieldAdd          = document.querySelector(".drop-field.create-ue");
                    const dropFieldAddHitbox    = document.querySelector(".drop-field-create-ue-hitbox");
                    const dropFieldRemove       = document.querySelector(".drop-field.remove-from-ue");
                    const dropFieldRemoveHitbox = document.querySelector(".drop-field-remove-from-ue-hitbox");
                    const insertFieldHitboxes   = (document?.getElementById(id) || document).querySelectorAll(".drop-subject-card-insert-hitbox, .drop-ue-card-insert-hitbox");
                    
                    if (target == "add" || target == "all") {
                        dropFieldAdd.style.background = "";
                        dropFieldAddHitbox.ondragover =    (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldAdd.classList.add("hover");
                            dropFieldAdd.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldAddHitbox.ondragleave =   (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldAdd.classList.remove("hover");
                            dropFieldAdd.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldAddHitbox.ondrop =        (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            e.dataTransfer.dropEffect = "link";
                            dropFieldAdd.classList.remove("hover");
                            dropFieldAdd.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.remove("hover");})
                            this.dropFieldToNewUEAction(e.dataTransfer.getData("text"));
                        }};
                        // Custom :hover event, cuz otherwise it would trigger when the fields are not shown
                        dropFieldAddHitbox.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldAdd.classList.add("hover");
                            dropFieldAdd.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldAddHitbox.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldAdd.classList.remove("hover");
                            dropFieldAdd.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldAddHitbox.onclick =       (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            e.target.classList.remove("hover");
                            e.target.querySelectorAll(".drop-field-create-ue-text, .drop-field-create-ue-plus").forEach(text => {text.classList.remove("hover");})
                            if (this.selectedSubjectCards.length > 0) {
                                this.dropFieldToNewUEAction(this.selectedSubjectCards[0]);
                            }
                        }};
                    }
                    
                    if (target == "remove" || target == "all") {
                        dropFieldRemove.style.background = "";
                        dropFieldRemoveHitbox.ondragover =    (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.add("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldRemoveHitbox.ondragleave =   (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldRemoveHitbox.ondrop =        (e) => {if (e.target.classList.contains("show")){
                            e.preventDefault(); 
                            e.dataTransfer.dropEffect = "link";
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.remove("hover");})
                            this.dropFieldRemoveAction(e.dataTransfer.getData("text"));
                        }};
                        // Custom :hover event, cuz otherwise it would trigger when the fields are not shown
                        dropFieldRemoveHitbox.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.add("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.add("hover");})
                        }};
                        dropFieldRemoveHitbox.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.remove("hover");})
                        }};
                        dropFieldRemoveHitbox.onclick =       (e) => {if (e.target.classList.contains("show")) {
                            e.preventDefault(); 
                            dropFieldRemove.classList.remove("hover");
                            dropFieldRemove.querySelectorAll(".drop-field-remove-from-ue-text, .drop-field-remove-from-ue-minus").forEach(text => {text.classList.remove("hover");})
                            if (this.selectedSubjectCards.length > 0) {
                                this.dropFieldRemoveAction(this.selectedSubjectCards[0]);
                            }
                        }};
                    }

                    if (target == "insert" || target == "all") {
                        insertFieldHitboxes.forEach(insertFieldHitbox => {
                            this.attachInsertFieldHitboxEventListeners(insertFieldHitbox)
                        })
                    }
                }



                // MARK: dropFieldToNewUEAction
                dropFieldToNewUEAction(cardId, index=0) {
                    const sem = this.currentSemester;
                    let newUeConfig = {subjects: [], coefficients: {}, custom: {}};
                    let newUeName = "Module 1"; let count = 1;
                    if (!this.ueConfig[sem]) this.ueConfig[sem] = {__ues__: []};
                    while (this.ueConfig?.[sem]?.[newUeName]) {count++; newUeName = `Module ${count}`;}

                    if (cardId) {
                        const card = document.getElementById(cardId);
                        if (card.classList.contains('subject-card')) {
                            let cardIsSelected = false;
                            this.selectedSubjectCards.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;});

                            let subject, oldUeName, manageSim = true;
                            if (!this.sim[sem]) manageSim = false;
                            
                            if (!cardIsSelected) {  // 1 unselected subj card dropped in the drop field "add"
                                subject = card.dataset.subject;
                                oldUeName = card.dataset.ue;
                                const ueIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);

                                if (!card.classList.contains("unclassified")) { // If the subj card doesn't come from the unclassified container:
                                    // We get its index in its UE configured in ueConfig
                                    const subjectIndex = this.ueConfig[sem][oldUeName].subjects.indexOf(subject);

                                    if (this.ueConfig[sem][oldUeName].subjects.toSpliced(subjectIndex,1).length == 0 && oldUeName.match(/Module (\d)/)) {
                                        // If the action of removing the subject's name from the list of subject names of the ue empties the list, then we don't delete anything at all:
                                        // the subj card was the only subj card of its previous ue card, therefore we don't need to create nor make a new one, we just set the subject's coef to 100%.
                                        // This case is only to avoid taking a subj card from a UE named "Module [X]", putting it in a new UE named "Module [X+1]", deleting "Module [X]",
                                        // and realizing that it was pointless lol
                                        newUeName = oldUeName;
                                        newUeConfig.coefficients[subject] = 100;
                                    } 
                                    else {
                                        newUeConfig = {subjects: [subject], coefficients: {[subject]: 100}, custom: {[subject]: false}};

                                        this.ueConfig[sem][oldUeName].subjects.splice(subjectIndex,1);
                                        delete this.ueConfig[sem][oldUeName].coefficients[subject];


                                        if (manageSim) {if (!this.sim[sem][oldUeName]) manageSim = false;}
                                        if (manageSim) {
                                            this.sim[sem] = {[newUeName]: {}, ...this.sim[sem]}
                                            this.sim[sem][newUeName][subject] = [];
                                            this.sim[sem][oldUeName][subject].forEach((_, index) => {
                                                this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                                            })
                                            this.deleteUnusedSimPath(false, sem, oldUeName, subject);
                                            this.saveSim();
                                        }
                                    }

                                    if (this.ueConfig[sem][oldUeName].subjects.length == 0) {
                                        this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                        delete this.ueConfig[sem][oldUeName];
                                    }

                                } 
                                else {
                                    newUeConfig = {subjects: [subject], coefficients: {[subject]: 100}, custom: {[subject]: false}};
                                }

                            } else {  // mutliple subj cards dropped through selection in the drop field "add"
                                let remainingCoef = 100;
                                
                                // Scanning through all the ues of the selected matiere cards to get the name of the ue of name "Module [x]", so that instead of creating a new Module,
                                // we replace the ue with the lowest x that would have been deleted
                                let lowestModuleIndexNameToReplace = -1;
                                Object.keys(this.selectedSubjectCardsSortedByUe).forEach((_ueName, _ueIndex) => {
                                    const _ueSelection = this.selectedSubjectCardsSortedByUe[_ueName];
                                    const match = _ueName.match(/Module (\d+)/);

                                    // if the name matches "Module [x]" (1st condition) 
                                    // and if the selection of subj cards of same ue that will be removed from their ue matches the number of subj in the said ue (cond 2): 
                                    // we save the number of the module
                                    if (match && _ueSelection.length == this.ueConfig[sem][_ueName].subjects.length) {
                                        lowestModuleIndexNameToReplace = match[1];
                                    }
                                })

                                if (lowestModuleIndexNameToReplace > -1) {
                                    newUeName = "Module "+lowestModuleIndexNameToReplace;
                                }

                                Object.keys(this.selectedSubjectCardsSortedByUe).forEach((_ueName, _ueIndex) => {
                                    oldUeName = _ueName;
                                    const _ueSelection = this.selectedSubjectCardsSortedByUe[oldUeName];


                                    _ueSelection.forEach((selectedSubjectCard, _subjIndex) => {
                                        const subjectCard = document.getElementById(selectedSubjectCard.subjectCardId);
                                        const selectionIndex = selectedSubjectCard.selectionIndex;
                                        subject = subjectCard.dataset.subject;

                                        if (selectionIndex+1 == this.selectedSubjectCards.length) {
                                            newUeConfig.coefficients[subject] = remainingCoef;
                                        } else {
                                            const coef = Math.round(100/this.selectedSubjectCards.length);
                                            newUeConfig.coefficients[subject] = coef;
                                            remainingCoef -= coef;
                                        }

                                        newUeConfig.subjects[selectionIndex] = subject;
                                        

                                        if (!subjectCard.classList.contains("unclassified")) {

                                            // removing the subject card from its former UE
                                            const oldUeIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);                       // get the old ue's index in the ues ordered array of the semester
                                            const subjectIndexInOldUe = this.ueConfig[sem][oldUeName].subjects.indexOf(subject);    // get the subject's index in the subjects ordered array of the old ue
                                            delete  this.ueConfig[sem][oldUeName].coefficients[subject];                            // delete coefficient data
                                                    this.ueConfig[sem][oldUeName].subjects.splice(subjectIndexInOldUe,1);           // remove the subject from the subjects ordered array of the old ue

                                            if (this.ueConfig[sem][oldUeName].subjects.length == 0) {
                                                // If, after removing the subject card from its former UE, the said UE is empty, we remove it
                                                delete this.ueConfig[sem][oldUeName];
                                                this.ueConfig[sem].__ues__.splice(oldUeIndex, 1);
                                            }

                                            if (manageSim) {if (!this.sim[sem][oldUeName][subject]) manageSim = false} // checking if the subject card had sim grades
                                            if (manageSim) {
                                                // if the subject card had sim grades, change their path in this.sim to match the ue change
                                                this.sim[sem][newUeName][subject] = [];
                                                this.sim[sem][oldUeName][subject].forEach((_, index) => {
                                                    this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                                                })
                                                this.deleteUnusedSimPath(false, sem, oldUeName, subject);
                                                this.saveSim();
                                            }
                                        }
                                    })
                                })

                                // this the last step, so that if the new module has the same same as an old module that gets deleted (in order to replace it, "Module [x]" case), we don't remove the wrong one
                                this.ueConfig[sem][newUeName] = newUeConfig;
                                this.ueConfig[sem].__ues__.splice(index, 0, newUeName);
                            }
                        }
                    }
                    else {
                        const newSubjName = this.lang == "fr" ? "Nouvelle matière" : "New subject";
                        newUeConfig.subjects.push(newSubjName);
                        newUeConfig.coefficients[newSubjName] = 100;
                    }

                    this.ueConfig[sem][newUeName] = newUeConfig;
                    const newUeIndexInSem = this.ueConfig[sem].__ues__.indexOf(newUeName);
                    if (newUeIndexInSem > -1) {
                        this.ueConfig[sem].__ues__.splice(newUeIndexInSem, 1, newUeName)
                    }
                    else {
                        this.ueConfig[sem].__ues__.splice(index, 0, newUeName)
                    }                

                    this.removeSubjectCardFromSubjectSelection();
                    this.saveConfig();
                    this.getGradesDatas();
                    this.renderContent();
                    this.attachEventListeners();
                    this.scrollToClientHighestElem({id: `ue-card-${newUeName}-in-semester-${sem}`, smooth: true})
                }



                // MARK: dropFieldRemoveAction
                dropFieldRemoveAction(cardId) {
                    const card = document.getElementById(cardId);

                    let cardIsSelected = false;
                    this.selectedSubjectCards.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;})

                    if (card?.classList?.contains("subject-card") && !card?.classList?.contains("unclassified")) {
                        const sem = card.dataset.semester;
                        const ue = card.dataset.ue;
                        const subj = card.dataset.subject;

                        if (!cardIsSelected) {

                            const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                            const subjectIndex = this.ueConfig[sem][ue].subjects.indexOf(subj);
                                    this.ueConfig[sem][ue].subjects.splice(subjectIndex,1);
                            delete  this.ueConfig[sem][ue].coefficients[subj];

                            if (this.ueConfig[sem][ue].subjects.length == 0) {
                                this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                delete this.ueConfig[sem][ue];
                            }
                        }
                        else {
                            let subject = "";
                            this.selectedSubjectCards.forEach(selectedSubjectCardId => {
                                const selectedSubjectCard = document.getElementById(selectedSubjectCardId);

                                subject = selectedSubjectCard.dataset.subject;
                                const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                                const subjectIndex = this.ueConfig[sem][ue].subjects.indexOf(subject);
                                        this.ueConfig[sem][ue].subjects.splice(subjectIndex,1);
                                delete  this.ueConfig[sem][ue].coefficients[subject];

                                if (this.ueConfig[sem][ue].subjects.length == 0) {
                                    this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                    delete this.ueConfig[sem][ue];
                                }
                            })
                        }

                        if (this.ueConfig[sem].__ues__.length == 0) {delete this.ueConfig[sem]}

                        this.removeSubjectCardFromSubjectSelection({elementDroppedInField:card});
                        this.saveConfig();
                        this.getGradesDatas();
                        this.renderContent();
                        this.attachEventListeners();
                    }
                    else if (card?.classList?.contains("subject-card") && card?.classList?.contains("unclassified") && cardIsSelected) {
                        this.removeSubjectCardFromSubjectSelection({elementDroppedInField:card});
                    }
                    else if (card?.classList?.contains("ue-card")) {}

                }



                // MARK: dropFieldSubjectInsertAction
                dropFieldSubjectInsertAction(cardId=null, methodCaller=null) {
                    const sem = this.currentSemester;
                    
                    if (cardId) {   // When dropping a ".drop-field.insert-field.subject" class div
                        const card = document.getElementById(cardId);

                        if (card?.classList?.contains('subject-card')) {
                            let cardIsSelected = false;
                            this.selectedSubjectCards.forEach(selectedSubjectCardId => {if (selectedSubjectCardId == card.id) cardIsSelected = true;});

                            const targetUeName = methodCaller.dataset.ue;
                            const insertionIndex = methodCaller.dataset.index;
                            
                            // The same thing happens whether this method is triggered from a selection or a single subject card, we just have to choose the right card id
                            (cardIsSelected ? this.selectedSubjectCards : [card.id]).forEach(subjectCardId => {
                                const subjectCard = document.getElementById(subjectCardId);

                                const subject = subjectCard.dataset.subject;
                                const oldUeName = subjectCard.dataset.ue;
                                const oldUeIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);
                                const subjectOldIndex = this.ueConfig?.[sem]?.[oldUeName]?.subjects?.indexOf(subject);
                            
                                // CASE 1: subject card comes from unclassified section to a UE             -> (default/easy case)
                                // CASE 2: subject card comes from a UE to another UE                       -> (moving case)
                                // CASE 3: subject card comes from a UE to the same UE at a different index -> (reordering case)
                                // CASE 4: subject card comes from a UE to the same UE at the same index    -> (a no-use case, so nothing happens)

                                switch (`
                                    subject card comes from ${oldUeName 
                                        ? `a UE and is ${targetUeName==oldUeName 
                                            ? `reorganized to ${subjectOldIndex == insertionIndex || subjectOldIndex+1 == insertionIndex 
                                                ? "the same index" 
                                                : "a different index"}` 
                                            : "moved to a different UE"}` 
                                        : "the unclassified section"}
                                `.trim()) {
                                    case "subject card comes from the unclassified section":
                                        // Just set the unclassified subject in the ueConfig
                                        this.ueConfig[sem][targetUeName].subjects.splice(insertionIndex, 0, subject);
                                        this.ueConfig[sem][targetUeName].coefficients[subject] = this.gradesDatas[sem][targetUeName].totalCoefSubjects <= 100 ? (100 - this.gradesDatas[sem][targetUeName].totalCoefSubjects) : 0;
                                    break;

                                    case "subject card comes from a UE and is moved to a different UE":
                                        // We move the datas from the old UE to the new UE
                                        this.ueConfig[sem][targetUeName].subjects.splice(insertionIndex, 0, subject);
                                        this.ueConfig[sem][targetUeName].coefficients[subject]  = Number (this.ueConfig[sem][oldUeName].coefficients[subject]);

                                        this.ueConfig[sem][oldUeName].subjects.splice(subjectOldIndex, 1);
                                        delete this.ueConfig[sem][oldUeName].coefficients[subject];
                                    break;

                                    case "subject card comes from a UE and is reorganized to a different index":
                                        // We move the datas while paying attention to at which index was the original subject before moving it (in order to not mess up with the insertion index)
                                        this.ueConfig[sem][targetUeName].subjects.splice(insertionIndex, 0, subject);
                                        this.ueConfig[sem][targetUeName].coefficients[subject]  = Number (this.ueConfig[sem][oldUeName].coefficients[subject]);

                                        const subjectCorrectOldIndex = subjectOldIndex + (insertionIndex<=subjectOldIndex && this.ueConfig[sem][targetUeName].subjects.includes(subject) ? 1 : 0);
                                        this.ueConfig[sem][oldUeName].subjects.splice(subjectCorrectOldIndex, 1);
                                    break;

                                    case "subject card comes from a UE and is reorganized to the same index":
                                        "Alas, nothing happens... This case is never reached!";
                                    break;
                                }

                                if (this.ueConfig[sem]?.[oldUeIndex]?.subjects?.length == 0) {
                                    this.ueConfig[sem]?.__ues__?.splice(oldUeIndex, 1);
                                    delete this.ueConfig[sem][oldUeIndex];

                                    if (this.ueConfig?.[sem]?.__ues__?.length == 0) {
                                        delete this.ueConfig[sem]
                                    }
                                }
                                
                            })

                            this.removeSubjectCardFromSubjectSelection();
                            this.saveConfig();
                            this.getGradesDatas();
                            this.renderContent();
                            this.attachEventListeners();
                            this.setGradesTableTotalCoef();
                        }
                    }
                    else {          // When clicking on a ".drop-field.insert-field.subject" class div
                        const addDivClicked = methodCaller;
                        const sem = addDivClicked.dataset.semester;
                        const ue =  addDivClicked.dataset.ue;
                        const ueCard = document.getElementById(`ue-card-${ue}-in-semester-${sem}`);
                        const ueContent = ueCard.querySelector(".ue-details");

                        let newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} 1`; let count = 1;
                        while (this.gradesDatas[sem][ue].subjects[newSubjName]) {
                            count++; newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} ${count}`;
                        }

                        const insertionIndex = methodCaller ? methodCaller.dataset.index : this.ueConfig[sem][ue].subjects.length;

                        this.ueConfig   [sem][ue].subjects.splice(insertionIndex, 0, newSubjName);
                        this.ueConfig   [sem][ue].coefficients [newSubjName] = 0;

                        this.saveConfig();
                        this.getGradesDatas();
                        
                        if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                            ueContent.innerHTML = this.createAllSubjCardDetailed(sem, ue);
                        }
                        else {
                            ueContent.innerHTML = this.createAllSubjCardCompact(sem, ue);
                        }

                        this.attachEventListeners()
                        this.setGradesTableTotalCoef();
                    }
                }



                // MARK: dropFieldUEInsertAction
                dropFieldUEInsertAction(cardId=null, methodCaller=null) {
                    const sem = this.currentSemester;

                    if (cardId) {
                        const card = document.getElementById(cardId);

                        if (card?.classList?.contains("ue-card")) {
                            const oldUEIndex = card.dataset.index;
                            const newUEIndex = methodCaller?.dataset?.index || 0;
                            const compensatedNewUEIndex = oldUEIndex > newUEIndex ? newUEIndex : newUEIndex - 1;
                            const ueName = this.ueConfig[sem].__ues__.splice(oldUEIndex, 1)[0];

                            this.ueConfig[sem].__ues__.splice(compensatedNewUEIndex,0,ueName);
                            this.saveConfig();
                            this.getGradesDatas();
                            this.renderContent();
                            this.attachEventListeners();
                            this.setGradesTableTotalCoef();
                            this.scrollToClientHighestElem({id: card.id, smooth: true})
                        }
                    }
                }


                
                // MARK: createDropFieldInsertionField
                createDropFieldInsertionField(type="subject", {sem=0, ueName="", index=-1}={sem:0, ueName:"", index:-1}) {
                    const thereIsSelection = this.selectedSubjectCards.length > 0;
                    return `
                        <div class="drop-field insert-field ${type} show" data-semester="${sem}" ${type=="ue" ? `` : `data-ue="${ueName}" `}data-index="${index}">
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
                const importOnline  = importMenu.querySelector(".import-menu-btn.online");

                importFile.innerHTML   = this.lang == "fr" ? "Importer fichier de configuration .json"   : "Import .json configuration file";
                importOnline.innerHTML = this.lang == "fr" ? "Obtenir fichier de configuration en ligne" : "Fetch online configuration file";
                
                if (!importMenu.classList.contains("show") || open == true) {
                    importMenu.style.display = "";
                    setTimeout(() => {importMenu.classList.add("show")}, 10)
                    importFile.onclick   = () => this.importData();
                    importOnline.onclick = () => {
                        if (this.onlineConfigs)
                        this.getConfigsFromRepo(this.repoContentsAPI, this.getLastGitFetchState, () => this.openOnlineCfgPicker())
                    };
                }
                else if (importMenu.classList.contains("show") || open == false) {
                    importMenu.classList.remove("show");
                    importFile.onclick   = null;
                    importOnline.onclick = null;
                    setTimeout(() => {importMenu.style.display = "none"}, 300);
                }
            }

            openOnlineCfgPicker() {
                document.getElementById("importMenu").classList.remove("show");
                document.getElementById("importMenu").hidden
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
                        ${sectionsHTML}
                        ${yearsHTML}
                        ${promsHTML}
                        ${configsHTML}
                    </div>
                `;

                document.querySelector(".ecam-dash").appendChild(pickerMenu);
                setTimeout(() => {pickerMenu.classList.add("show");}, 10)

                const closePickerMenuFunc = () => {pickerMenu.classList.remove("show"); setTimeout(() => {pickerMenu.remove()}, 300);};
                
                pickerMenu.querySelector(".online-cfg-picker-menu-close-btn").onclick = closePickerMenuFunc;
                pickerMenu.querySelectorAll(".online-cfg-picker-menu-dir-card").forEach(dirCard => {
                    dirCard.onclick = (e) => {
                        const path = e.target.dataset.path;
                        const url = e.target.dataset.url;
                        const targetTree = pickerMenu.querySelector(`.online-cfg-picker-menu-dir-tree[data-path="${path}"]`);
                        e.target.classList.toggle("on");

                        if (!e.target.classList.contains("on") && !url) {
                            pickerMenu.querySelectorAll(".online-cfg-picker-menu-dir-tree.show").forEach(tree => {
                                const childTreePath = tree.dataset.path.match(RegExp("\\b"+ path + "(\\b|/(.+)\\b)"));
                                const childTree = pickerMenu.querySelector(`.online-cfg-picker-menu-dir-tree.show[data-path="${childTreePath?.input}"]`);
                                childTree?.querySelectorAll(".online-cfg-picker-menu-dir-card").forEach(dirCard => {
                                    dirCard?.classList?.remove("on");
                                })
                                childTree?.classList?.remove("show");
                            })
                            setTimeout(() => {
                                pickerMenu.querySelectorAll(".online-cfg-picker-menu-dir-tree.show").forEach(tree => {
                                    const childTreePath = tree.dataset.path.match(RegExp("\\b"+ path + "(\\b|/(.+)\\b)"));
                                    const childTree = pickerMenu.querySelector(`.online-cfg-picker-menu-dir-tree.show[data-path="${childTreePath?.input}"]`);
                                    if (childTree) {childTree.style.display = "none"}
                                })
                            }, 300);
                        }
                        else if (e.target.classList.contains("on") && !url) {
                            targetTree.style.display = "";
                            setTimeout(() => {targetTree.classList.add("show")}, 10)
                        }
                        else if (e.target.classList.contains("on") && url) {
                            this.importData(url)
                        }
                    };
                })
            }

            generateOnlineCfgPickerMenuDirTree(type="section") {
                // Creating an array containing all the properties' value of this.onlineConfigs.Configs that are objects (so that have a descendance) with at least one property: they are the data of the section folders
                const sectionsArray = Object.values(this.onlineConfigs.Configs).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});


                let html = type == "section" ? `
                    <div class="online-cfg-picker-menu-dir-tree ${type} show" data-path="${this.onlineConfigs.Configs.path}">
                        <div class="online-cfg-picker-menu-dir-tree-header">Nb configs: ${this.onlineConfigs.Configs.nbCfgs}</div>
                        <div class="online-cfg-picker-menu-dir-tree-body">
                ` : "";

                html += sectionsArray.map(sectionDirData => {       // Dir: Section
                    // Creating an array containing all the properties' value of sectionDirData that are objects (so that have a descendance) with at least one property: they are the data of the year folders
                    const yearsArray = Object.values(sectionDirData).map(value => {if (value instanceof Object && Object.keys(value).length>0) {return value}}).filter(value => {return value});
                    
                    const name = sectionDirData.path.split("/").at(-1);
                    
                    
                    let out = type == "year" ? `
                    <div class="online-cfg-picker-menu-dir-tree ${type}" style="display: none" data-path="${sectionDirData.path}">
                    <div class="online-cfg-picker-menu-dir-tree-header">Nb configs: ${sectionDirData.nbCfgs}</div>
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
                        <div class="online-cfg-picker-menu-dir-tree ${type}" style="display: none" data-path="${yearDirData.path}">
                        <div class="online-cfg-picker-menu-dir-tree-header">Nb configs: ${yearDirData.nbCfgs}</div>
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
                            <div class="online-cfg-picker-menu-dir-tree ${type}" style="display: none" data-path="${promDirData.path}">
                                <div class="online-cfg-picker-menu-dir-tree-header">Nb configs: ${promDirData.nbCfgs}</div>
                                <div class="online-cfg-picker-menu-dir-tree-body">
                            ` : "";
                            
                            out += type == "prom" ? `
                                <div class="online-cfg-picker-menu-dir-card ${type}" id="online-cfg-picker-menu-dir-card-section-${name}" data-path="${promDirData.path}">${name}</div>
                            `
                            : configsArray.map(configName => {   // Dir: Config
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

                            // If parsed contains ueConfig, apply it to the dashboard and persist
                            if (parsed?.version != this.configVersion) {
                                alert(this.lang == "fr" 
                                    ? `Ce fichier de configuration n'est pas de la bonne version ! Assure-toi de télécharger la dernière version ! (Ce fichier est de version "${parsed?.version}", alors que la version de fichier attendue est "${this.configVersion}")`
                                    : `This configuration file isn't of the right version! Make sure you download the latest version! (This file's version is "${parsed?.version}", whereas the file's version expected is "${this.configVersion}")`
                                )
                            }
                            else if (parsed?.ueConfig && parsed?.version == this.configVersion) {
                                try {
                                    this.ueConfig = parsed.ueConfig || {};
                                    this.saveConfig();
                                } catch (e) {
                                    // ignore storage errors
                                }
                            }                            

                            // Re-render dashboard to reflect imported config
                            try { 
                                const pickerMenu = document.getElementById("pickerMenu"); 
                                pickerMenu?.classList?.remove("show");
                                setTimeout(() => {
                                    pickerMenu?.remove()
                                    this.removeSubjectCardFromSubjectSelection(); 
                                    this.getGradesDatas();
                                    this.renderContent(); 
                                    this.scrollToClientHighestElem("", {id: "main-average-card", margin: 10, smooth: true});
                                }, 300); 
                            } catch (e) {}

                            resolve(parsed);
                        } catch (err) {
                            reject(err);
                        }
                    };

                    // If a File object was passed, read it
                    if (file instanceof File) {
                        const reader = new FileReader();
                        reader.onload = (e) => handleText(e.target.result);
                        reader.onerror = (e) => reject(e);
                        reader.readAsText(file);
                        return;
                    }

                    // If a JSON string was passed, try to parse directly
                    if (typeof file === 'string') {
                        if (file.match(RegExp("https://raw.githubusercontent.com/(.+).json"))) {
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
                    ueConfig: this.ueConfig
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
        generalKeyboardEvents() {
            document.onkeydown = (e) => {
                if (this.keyMatch(e, "E", {alt:"forbidden", ctrl:"forbidden", shift:"required", meta:"forbidden", repeat:"forbidden"}) /* key === "no-alt + no-ctrl + shift + no-meta + E (no-repeat)" */) {
                    
                    this.editMode = !this.editMode;
                    
                    this.removeSubjectCardFromSubjectSelection();
                    this.scrollToClientHighestElem();
                    this.renderContent();
                    this.attachEventListeners();
                }
                else if (this.keyMatch(e, "D", {alt:"forbidden", ctrl:"forbidden", shift:"required", meta:"forbidden", repeat:"forbidden"})) {

                    this.viewMode = this.viewMode == "detailed" ? "compact" : "detailed";
                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE", this.viewMode);
                    if (this.viewMode == "detailed") {
                        document.getElementById('view-btn-detailed').classList.add("active")
                        document.getElementById('view-btn-compact').classList.remove("active")
                    }
                    else
                    {
                        document.getElementById('view-btn-detailed').classList.remove("active")
                        document.getElementById('view-btn-compact').classList.add("active")
                    }

                    this.scrollToClientHighestElem();
                    this.renderContent();
                    this.attachEventListeners();
                }
                else if (this.keyMatch(e, "L", {alt:"forbidden", ctrl:"forbidden", shift:"required", meta:"forbidden", repeat:"forbidden"})) {
                    
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
                    this.renderContent(false);
                    this.attachEventListeners();
                }
                else if (this.keyMatch(e, "R", {alt:"forbidden", ctrl:"forbidden", shift:"required", meta:"forbidden", repeat:"forbidden"})) {
                    console.warn("You fell into my breakpoint trap!!"); debugger;
                }
            };
        };
    }

    window.onload = () => { new ECAMDashboard(); };
    
})();