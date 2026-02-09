// ==UserScript==
// @name         ECAM Grades Dashboard
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @version      1.1.0
// @run-at       document-end
// @match        https://espace.ecam.fr/group/education/notes*
// @grant        none
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

    // ============= STYLES CSS =============
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ecam-dash { display: grid; flex-direction: column; justify-content:center; grid-template-columns: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; margin: 0% 1.5%; color: #1a1a1a; }
        .dash-header { background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; padding: 30px 40px; border-radius: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 3px 5px 5px 0px #00000042; }
        .dash-title { font-size: 28px; font-weight: 700; margin: 0; }
        .dash-subtitle { font-size: 14px; opacity: 0.95; margin-top: 5px; }
        .lang-btn           { border: 2px solid #000000ff; background: #6f79ff; border-radius: 18px; width: 36px; height: 36px; }
        .lang-btn.active    { border: 2px solid #ceefffff; }
        .lang-btn:hover     { border: 2px solid #afe4ffff; background: #a6acff; }
        .header-actions         { display: flex; gap: 12px; }

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

        .main-average-card { background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 15px; border: 2px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; transition: box-shadow 0.3s ease, border-color 0.3s ease; user-select: none }
        .main-average-card:hover { border-color: #667eea; box-shadow: 3px 5px 5px 0px #00000042; }

        .average-display { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 7px; }
        .average-number { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
        .average-label { font-size: 18px; color: #666; font-weight: 500; }
        .average-stats { display: flex; gap: 30px; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
        .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

        .new-grades-card      { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px ; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87;}
        .new-grades-card.none { border: 2px solid #446dff; background: #f7f9ffff; box-shadow: none; }
        .new-grades-card-title { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 5px; display:flex; align-items:center }
        .new-grades-content { display: flex; flex-direction: column; gap: 20px; }
        .new-grades-matiere-card { display: flex; flex-direction: column; border: 2px solid #c1a7ffff; border-radius: 12px; }
        .new-grades-matiere-card:hover { cursor:alias }
        .new-grades-matiere-card-title { border: 2px solid #c1a7ffff; border-radius: 12px; margin: -2px -2px 5px -2px; font-size: 16px; font-weight: 600; background: #c1ceff; padding: 5px 0px 5px 10px; }
        .new-grades-table {  }
        .new-grades-table-notes {  }
        .new-grades-notif { display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 90%; height: 50px; cursor:pointer; position:fixed; left:5%; right:0px; top:-55px; z-index:299; box-shadow: 0 0 5px rgba(0,0,0,0.5);  transition: all 0.5s ease; }
        .new-grades-notif.on { top:50px }

        .controls-bar { background: white; border-radius: 16px; padding: 16px 20px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e5e5; }
        .filter-title { border-radius: 20px; color: white; font-weight: 700; font-size: 14px; padding: 10px 15px; margin-right: 70%; margin-bottom: -15px; background: linear-gradient(45deg, #446dff 20%, #1222ff12 60%, #ffffff00 89%); position: relative; transition: all 0.2s ease; }
        .filter-title:hover { background: linear-gradient(45deg, #446dff 20%, #1222ff12 70%, #ffffff00 95%); }
        .filter-tabs { display: flex; background: #f7f7f7; padding: 4px; border-radius: 12px; gap: 4px; height: 44px; }
        .filter-tab { display: flex; justify-content: center; padding: 10px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: all 0.2s ease; font-size: 14px; width: 57px; }
        .filter-tab:hover  { background: white; color: #333333ff; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(1.1); }
        .filter-tab.active { background: white; color: #667eeaff; box-shadow: 3px 5px 5px 0px #00000042; }

        .view-toggle { display: flex; background: #f7f7f7; padding: 4px; border-radius: 8px; gap: 8px; align-items: center; }
        .view-btn { background: transparent; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; width: 48px; height: 40px; }
        .view-btn:hover  { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
        .view-btn.active { background: white; box-shadow: 3px 5px 5px 0px #00000042; }

        .content-area { display: grid; gap: 24px; }

        .intranet-collapse { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .intranet-collapse:hover { background: #f3f4f6; }
        .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        .intranet-toggle.openLeft { transform: rotate(-180deg); }
        .intranet-toggle.openRight { transform: rotate(180deg); }

        .semester-section { background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
        .semester-header { background: #f9fafb; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .semester-header:hover { background: #f3f4f6; }
        .semester-info { display: flex; align-items: center; gap: 12px; }
        .semester-name { font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .semester-average { padding: 6px 12px; background: white; border-radius: 8px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
        .average-good { color: #10b981; border: 1px solid #10b98130; }
        .average-medium { color: #f59e0b; border: 1px solid #f59e0b30; }
        .average-bad { color: #ef4444; border: 1px solid #ef444430; }
        .semester-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        .semester-toggle.open { transform: rotate(180deg); }
        .semester-content       { padding: 24px; display: none; }
        .semester-content.show  { display: flex; flex-direction: row; gap: 0px; transition: gap 0.2s ease; }

        
        .drop-matiere-card-to-remove-from-eu        { display: flex; flex-direction: column; border-radius: 20px; border: 2px dashed #ff7f7f; border-color: #ff7f7f00;width: 0%; transition: width 0.2s ease, border-color 0.2s ease; }
        .drop-matiere-card-to-remove-from-eu.show   { width: 15%; border-width: 2px; border-color: #ff7f7f; }
        .drop-matiere-card-to-create-eu             { display: flex; flex-direction: column; border-radius: 20px; border: 2px dashed #7fc2ff; border-color: #7fc2ff00;width: 0%; transition: width 0.2s ease, border-color 0.2s ease; }
        .drop-matiere-card-to-create-eu.show        { width: 15%; border-width: 2px; border-color: #7fc2ff; }
        .ue-insert-area             { display: none; flex-direction: column; justify-content: center; align-items: center; color: #6f5fff00; height: 0px; width: 100%; border-radius: 20px; border: 2px dashed #9b9b9b00; border-width: 0px; font-size: 25px; font-weight: 800; user-select: none; cursor: pointer; transition: all 0.2s ease; }
        .ue-insert-area.show        { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 50px; color: #9b9b9bff; border-color: #9b9b9b; border-width: 2px; }
        .ue-insert-area.show:hover  { color: #887bffff; border-color: #7fc2ff; }

        .ue-grid                { display: grid; width: 100%; gap: 20px; transition: gap 0.2s ease; }
        .ue-card                { display: flex; flex-direction: column; align-items: center; background: #fafafa; border-radius: 16px; border: 3px solid #e5e5e5; gap: 10px; scroll-margin-top: 70px; transition: all 0.3s ease; }
        .ue-card.validated      { border-color: #10b981; background: #f0fdf4; }
        .ue-card.failed         { border-color: #ef4444; background: #fef2f2; }
        .ue-card.unknown        { border-color: #6d6d6dff; background: #d1d1d1ff; }
        .ue-header              { display: flex; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 16px 16px 0px 0px; width: 100%; cursor: pointer; }
        .ue-header.validated    { border-color: #10b981; background: #e0ffeaff; }
        .ue-header.failed       { border-color: #ef4444; background: #ffd9d9ff; }
        .ue-header.unknown      { border-color: #6d6d6dff; background: #acacacff; }
        .ue-header:hover        { background: #f3f4f6; }
        .ue-delete-btn          { border-radius: 14px; background: transparent; }
        .ue-title                       { font-size: 16px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
        .ue-title.input                 { font-size: 16px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }
        .ue-matiere-total-coef-value    { display: flex; gap: 15px; font-weight: 600; }
        .ue-details                     { display: flex; flex-direction: column; align-items: center; width: 98%; margin-top: 10px; gap: 5px; }
        .ue-moyenne                     { font-size: 24px; font-weight: 800; display: flex; align-items: center; gap:10px; width: 180px; }
        .ue-moyenne.good                { color: #10b981; }
        .ue-moyenne.bad                 { color: #ef4444; }
        .ue-moyenne.unknown             { color: #6d6d6dff; }
        .ue-toggle                      { width: 24px; height: 24px; font-size: 18px; color: #000000; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; margin-left: 5px; }
        .ue-toggle.open                 { transform: rotate(180deg); }

        .add-a-matiere-card         { display: flex; align-items: center; justify-content: center; gap: 8px; height: 38px; width: 230px; margin-bottom: 19px; border: 3px dashed #7fc2ff; border-radius: 20px; font-size: 19px; font-weight: 700; color: #7fc2ff; background: aliceblue; cursor: pointer; box-shadow: none; user-select:none; transition: all 0.2s ease }
        .add-a-matiere-card:hover   { background: white; font-size: 20px; box-shadow: inset 0px 0px 17px 0px #0400ff38; }
        .add-a-matiere-card-plus    { font-size: 40px; font-weight: 900; height: 20px; transition: transform 0.2s ease; }


        .modules-section                                { display: flex; flex-direction: row; gap: 0px; align-items: center; width: 100% }
        .modules-content                                { display: grid; gap: 20px; width: 100%; }

        .unclassified-part                              { display: flex; flex-direction: row; gap: 0px; }
        .unclassified-section                           { display: flex; flex-direction: column; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; }
        .unclassified-content                           { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 99%; }
        .unclassified-title                             { font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

        .matiere-card               { display: flex; flex-direction: column; align-items: center; border: 4px solid #ffffffff; border-radius: 20px; width: 100%; background: #c5c5c5; transition: width 0.3s ease; }
        .matiere-card.good          { background: #f0fdf4; }
        .matiere-card.meh           { background: #fff2e4; }
        .matiere-card.bad           { background: #fef2f2; }
        .matiere-card-header        { display: flex; align-items: center; height: 62px; width: 100%; padding: 5px 0px; border-radius: 20px 20px 0px 0px; background: #b8b8b8; font-weight:600; border-bottom: 4px solid white; }
        .matiere-card-header.good   { background: #e3ffeb; }
        .matiere-card-header.meh    { background: #ffe8d0; }
        .matiere-card-header.bad    { background: #ffe0e0; }
        .matiere-name               { font-weight: 800; color: #1a1a1a; font-size: 14px }
        .matiere-name.input         { font-weight: 800; color: #1a1a1a; font-size: 14px; border: 2px solid #797979; border-radius: 15px; padding-left: 8px; width: 100%; height: 25px;}
        .matiere-coef-input-box     { padding-left: 5px; width: 48px; border-radius: 8px; }
        .matiere-card.compact                   { display:flex; flex-direction: row; justify-content:space-between; align-items:center; padding: 7px 0px; border-radius: 16px; border: 3px solid #ffffff; height: 68px; width: 100%; min-width: 380px; transition: all 0.2s ease; background: none; }
        .matiere-card.compact.edit-mode         {  }
        .matiere-card.compact.good              { background: #f0fdf4; }
        .matiere-card.compact.meh               { background: #fff2e4; }
        .matiere-card.compact.bad               { background: #fef2f2; }
        .matiere-card.compact.unknown           { background: #c5c5c5; }
        .matiere-card.compact:hover             { background: #f3f4f6; box-shadow: inset 0px 0px 8px 1px #0032ff42; transform: scale(0.995); }
        .matiere-card.compact.edit-mode:hover   { transform: scale(1); }
        .matiere-card.unclassified              { display: flex; flex-direction: column; align-items: center; border: 2px solid #ffe4cd; border-radius: 20px; width:100%; background: white; user-select: none; margin: 0px; transition: width 0.3s ease }
        .matiere-card.unclassified.good         { background: #f0fdf4; }
        .matiere-card.unclassified.bad          { background: #fef2f2; }
        .matiere-card-header.unclassified       { display:flex; flex-direction: row; align-items:center; border-radius: 20px 20px 0px 0px; border-bottom: 2px solid #ffe4cd; gap:8px; font-weight:700; height: 60px; width: 100%; vertical-align:top; font-size:15px }
        .matiere-card-header.unclassified.good  { background: #e3ffeb; }
        .matiere-card-header.unclassified.bad   { background: #ffe0e0; }
        .matiere-insert-area                    { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
        .matiere-insert-area.show               { height: 50px; margin: 10px 0px; }
        .notes-table-matiere-total-coef-value   { display: flex; gap: 15px }
        .mat-moyenne        { font-size: 16px; font-weight: 800; }
        .mat-moyenne.good   { color: #10b981; }
        .mat-moyenne.bad    { color: #ef4444; }
        .selected-matiere-card-notif-container          { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; left: calc(99% - 20%); z-index: 100; transition: width 0.3s ease; }
        .selected-matiere-card-notif-div                { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
        .selected-matiere-card-notif-div.on             { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
        .selected-matiere-card-notif-div-del-btn        { color: #640000; font-size: 20px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
        .selected-matiere-card-notif-div-del-btn:hover  { color: #ffffff; }

        .note-row                           { border-bottom: 1px solid white /* #e4e4e4 */; height: 39px; transition: background 0.3s ease; }
        .note-row.last                      { vertical-align: baseline; border-bottom: none; height: 41px; }
        .note-row.sim                       { background: #e9efff9a; }
        .note-row:hover                     { background: #eeedfd; }
        .notes-table                        { width: 98%; background: #c5c5c5; }
        .notes-table.compact                { margin: -12px 20px 20px 20px; }
        .notes-table.good                   { background: #f0fdf4}
        .notes-table.meh                    { background: #fff2e4}
        .notes-table.bad                    { background: #fef2f2}
        .notes-table th                     { padding: 10px 12px; height: 39px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 3px solid white /* #e5e5e5 */; }
        .notes-table td                     { padding: 10px; font-size: 14px; }
        .notes-table-type                   { padding-left:30px; width: 30%; }
        .notes-table-note                   { width: 13% }
        .notes-table-coef                   { width: 10% }
        .notes-table-classAvg               { width: 10% }
        .notes-table-date                   { width: 10% }
        .notes-table-teacher                { display: table-cell; font-size:12px;color: #999; text-align: end; width: 32%; }
        .note-row-unsorted-grades           { background: unset; border-bottom: 1px solid white; transition: background 0.3s ease; height: 39px; }
        .note-row-unsorted-grades:hover     { background: #c9d8e7ff; }
        .note-row-unsorted-grades.last      { border-bottom: none; height: 41px; }
        .note-type      { font-size: 12px; color: #666; margin-top: 2px; }
        .note-value     { font-weight: 600; font-size: 16px; }
        .note-good      { color: #10b981; }
        .note-medium    { color: #f59e0b; }
        .note-bad       { color: #ef4444; }
        .note-date      { font-size: 12px; color: #999; }
		.subject-sim-del-btn        { border: 1px solid #A7CEDF; border-radius: 6px; cursor: pointer; }
        .sim-add-btn                { width: 67px; max-width: 140px; justify-content: center; border-radius: 15px; border: 1px solid; padding: 6px 10px; height: 25px; user-select: none; }
        .note-simulee-input         { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
        .note-simulee-input.sim-inp-type    { width: 55%;  max-width:250px; height:25px }
        .note-simulee-input.sim-inp-note    { width: 100%; max-width:75px;  height:25px }
        .note-simulee-input.sim-inp-coef    { width: 100%; max-width:60px;  height:25px }
        .note-simulee-input.sim-inp-date    { width: 100%; max-width:140px; height:25px }
        .note-simulee-input-edit    { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
		.note-sim-del-btn           { border: none; border-radius: 6px; cursor: pointer; }
        .note-checkbox  { cursor: pointer; }

        .collapse-icon  { cursor: pointer; user-select: none; }
        .drag-icon      { cursor: pointer; user-select: none; }
        .tick-icon      { height: 23px; width: 23px; font-size: 35px; color: #004cff; cursor:pointer; user-select:none; }

        /* Animations part */
            @media (max-width: 768px){ .config-layout { grid-template-columns:1fr; } .config-sidebar { border-right:none; border-bottom:1px solid #e5e5e5; padding-right:0; padding-bottom:20px; } .dash-header { flex-direction:column; align-items:start; gap:16px; } .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } }
            .loading { text-align: center; padding: 40px; color: #999; }
            @keyframes dots { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
            .loading::after { content: '...'; animation: dots 1.5s steps(4, end) infinite; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .fade-in { animation: fadeIn 0.3s ease; }
            @keyframes scrollTo { 15% {scale: 100% 100%;} 100% {scale: 105% 105%; border: 5px solid #5f77ff} }
            .scroll-to { animation: 0.3s 2 alternate scrollTo ease }
    `;
    const ERROR503 = document.title == '503 Service Unavailable' || document.title == 'ECAM Grades Dashboard - Transform Your Grade Experience';
    
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    class ECAMDashboard {
        constructor() {
            this.notes = [];
            this.semestres = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};

            this.gradesDatas = {};
            this.ueConfig =         JSON.parse( localStorage.getItem("ECAM_DASHBOARD_UE_CONFIG")) || {};
            this.sim =              JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_NOTES")) || {};
            this.ignoredGrades =    JSON.parse( localStorage.getItem("ECAM_DASHBOARD_IGNORED_GRADES")) || [];

            this.savedReadGrades =  JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES")) || [] ;
            this.newGrades = [];

            this.defSem =                       localStorage.getItem("ECAM_DASHBOARD_DEFAULT_SEMESTER") || "all";
            this.currentSemester = this.defSem;

            this.defView =                      /* localStorage.getItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE") || */ "detailed";
            this.viewMode = this.defView;

            this.lang =                         localStorage.getItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE") || "en";
            this.tempSelection = {}; // { [sem]: Set<matiere> }
            this.draggedMatId = "";
            this.today = new Date().toISOString().split('T')[0];
            this.editMode = true;

            this.mobileVer = false;
            this.clientWidth = 1920;

            // this.ueHeaderNoMove = true;
            this.selectedMatiereCards = [];
            this.scrollToThisElem = "";

            this.ERROR503 = document.title == '503 Service Unavailable' || document.title == 'ECAM Grades Dashboard - Transform Your Grade Experience';

            this.init();
        }


        /** 
        *  Use only in the console: iterating through a long list of objects isn't very optimized. Use it only to obtain the indices pointing at the class you want to change.
        *  Note for now: the style sheet of this script is located at document.styleSheets[11];
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
        saveSim() { localStorage.setItem("ECAM_DASHBOARD_SIM_NOTES", JSON.stringify(this.sim)); }
        saveignoredGrades() { localStorage.setItem("ECAM_DASHBOARD_IGNORED_GRADES", JSON.stringify(this.ignoredGrades)); }
        ensureSimPath(sem, ue, mat) {
            if(!this.sim[sem]) this.sim[sem]={};
            if(!this.sim[sem][ue]) this.sim[sem][ue]={};
            if(mat !== undefined && !this.sim[sem][ue][mat]) this.sim[sem][ue][mat]=[];
        }
        deleteUnusedSimPath(sem, ue, mat) {
            if (this.sim[sem]) {
                if (this.sim[sem][ue]) {
                    if (this.sim[sem][ue][mat]) {
                        if (this.sim[sem][ue][mat].length == 0) {delete this.sim[sem][ue][mat]}
                    }
                    if (this.sim[sem][ue] == {}) {delete this.sim[sem][ue]}
                }
                if (this.sim[sem] == {}) {delete this.sim[sem]}
            }
        }
        getSimNotes(sem, ue, mat){ return (this.sim[sem]&&this.sim[sem][ue]&&this.sim[sem][ue][mat])||[]; }
        getAllMatieresForUE(sem, ueData, ueName){
            const real = ueData.matieres || [];
            const simOnly = Object.keys(((this.sim[sem]||{})[ueName]||{}));
            return Array.from(new Set([...real, ...simOnly]));
        }
        getNoteColor(note) { if (note >= 12) return 'good'; if (note >= 10) return 'medium'; return 'bad'; }
        getAverageColor(avg) { if (avg >= 12) return 'average-good'; if (avg >= 10) return 'average-medium'; return 'average-bad'; }
        gradeIsDisabled(n) {
            return this.ignoredGrades.indexOf([n.semestre, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1
        }
        moyennePonderee(arr) {
            if (!arr || arr.length === 0) return 0;
            let total = 0, coeffs = 0;
            arr.forEach(n => { 
                if (this.ignoredGrades.indexOf([n.semestre, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1) {
                    total += n.note * (n.coef||0); 
                    coeffs += (n.coef||0); 
                }
            });
            const v = coeffs ? (total / coeffs) : 0;
            return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
        }
        parseNotes() {
            if (!this.ERROR503) {
                const rows = document.querySelectorAll("table.greyGridTable tbody tr");
                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                        const note = parseFloat(cells[0].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const classAvg = parseFloat(cells[3].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const libelle = cells[1].textContent.trim();
                        const coef = parseFloat(cells[2].textContent.replace("%", "").replace(",", ".")) || 0;
                        const prof = cells[4].textContent.trim();
                        const date = cells[5].textContent.trim();
                        const semMatch = libelle.match(/Semester\s+(\d+)/i);
                        const semestre = semMatch ? semMatch[1] : "?";
                        const parts = libelle.split(" - ").map(p => p.trim());
                        const matiere = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
                        const type = parts.length >= 2 ? parts.at(-1) : "";
                        this.notes.push({ note, classAvg, coef, semestre, matiere, type, prof, date, libelle });
                    }
                });
                this.notes.forEach(n => {
                    if (!this.semestres[n.semestre]) this.semestres[n.semestre] = {};
                    if (!this.semestres[n.semestre][n.matiere]) this.semestres[n.semestre][n.matiere] = [];
                    this.semestres[n.semestre][n.matiere].push(n);
                });
            }
            else {
                this.notes = new Array(this.savedReadGrades);
            }
        }


        // MARK: init
        init() {

            this.parseNotes();
            if (this.savedReadGrades.length == 0) {
                this.newGrades = [];
                this.notes.forEach(e => {this.savedReadGrades.push(e)})
                localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades));
            }
            if (this.clientWidth <= 935) {
                this.clientWidth = 935;
                this.mobileVer = true;
            }
            
            this.generalKeyboardEvents();

            this.newGrades = this.compareArraysofObjects(this.notes, this.savedReadGrades).more;
            this.createNewGradesNotifDiv();
            this.createDashboard();
            this.attachEventListeners();
            
        }


        // MARK: -createDashboard
        createDashboard() {
            const container = document.createElement("div");
            container.className = "ecam-dash";
            const moyenneGenerale = this.moyennePonderee(this.notes);
            const totalNotes = this.notes.length;
            const ueStats = this.getUEStats();

            // Creating the content of the dashboard that don't vary along with the user's actions besides the language selection.
            // Therefore, the text isn't yet created, but will be in the renderContent() method later on, to regenerate the text in case the language is changed
            container.innerHTML = `
            <div class="dash-header">
                <div style="display: bloc">
                    <img draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/5/51/ECAM-LaSalle-bleu-seul.png" alt="ECAM Logo" style="margin: -136px -444px -121px -43px; height: 141px; width: 148px;">
                    <div style="margin: 0px 40px 0px 100px;">
                        <h1 class="dash-title"></h1>
                        <p class="dash-subtitle"></p>
                        <div style="display: flex; gap: 2px">
                            <div class="lang-btn ${this.lang == "fr" ? "active" : ""}" id="fr-lang-btn">
                                <image style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇫🇷" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACTUExURUdwTAAkjM7Pzs7OzrMGE74QIMPEx4hTeAAkjQARewAagbIFEgAfhc3NzdDQ0M7PzrYMG8zMzbcMG8EXKcUbLQAMd7UKGLUKGMMWJ7OhrcMVJv///+oPIO4bLgAmoOwWKAAZmQArpO8iNgAfnQATlAIyqLUGFAEoksUSIwAYhgANePnCyMbO6djY2NUWJ+7u7sCep4f8c74AAAAbdFJOUwDL+z19ffsVe3qU1jy51pA+bLyNc+Vrnu+m2KjIWToAAALxSURBVFjD7djJcuIwEIDhAAMOxuwTCAnyKgxOxg7v/3SjtraWDJKTUw60K1Vc+OqX5APK09NjHvOLJxDz3a+t9Mcoeg7DgZrDcrkejUZBL2X7NuYfo4gRZ2MmNZvhYjEHz1EYrHab18tl3LaEEonFnOPT5KtWM1zMhReY27DabUG5ABQ8cyXLTnIy9pz+vcN8seFWPRxC32G7Hf+FGW/3m7fXVmkagJ5NpGXYCOjd5Or6ejGmaRpCctJw6HTqOgaEvM8GT07ynP0RXhTbSqcIzWduDWOIgHBRJqmeELkJtQB34v4QUUs7o8MSC4t7FYECkF2UKYW9Sb2KRI8FqVWB06OI4KJSQRnuyXoUiW0mHUj2iPFAJEdOoiGVE/OV+SCxqLxTpI+LT+GGcE8Cj4AypAiqcEDyrPTSFHSS25zxnMIH6W2GnsQsitVGM8sBEf36AAOOASkDHg+EcuyiWLw+TAHGCdk5EqrOKqhQjgfCJ8ahPxxCx1W0K0tdUG4qCJKrAoMXpd4i7BwFpM+rkJNmbijh7w+xIHRanPFAiXx/khuQ7mFM6i9CzFFAlQiSDHPcRQneoCM8uqhA29NOfB/Sr48MUkWF3uY0bVfmgqyF6aIKHVcqgpxFMETlGHtkrMoDdXKYVMqlqRxhUReUmBuNiro9KXVCcllcOaoiq4emlPaAOJMoaCogHdNSXgg7GEqRRL1FR709FqRzKO0PdYt0D6X+IrWqTlGnh9LzPYgk1rIQlKogqqj70NHYZgR9VN0eJ2Ttj1GkT6udygN1BhVR/vQp6m6RUYRzfl5k1lSeItfSOFBVH3KqCfw8vwPZTRddhAgx1+GE3T6GdW2CN4oYU5Y7gITy8jIIwymfMDzM54tJOy1XC86E2G0GlHKzCxjUIoNwGtmXqGA0Wi+X0uPgVd1DhFGWs/0KvjgFhSGOyyl4su9aGjPbcAWglzDqdd9k99L1ennYzMRs9tvdaqW/GkXfvAbL+/NT8PhXwmN+7/wHgdqiCaxyTNQAAAAASUVORK5CYII=">
                            </div>
                            <div class="lang-btn ${this.lang == "en" ? "active" : ""}" id="en-lang-btn">
                                <image style="display: flex; margin: 6px 0px 0px 6px; width:20px; height:20px" alt="🇬🇧" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAECUExURUdwTL6/w7pOXQcmd3aItpsCC7IaMURBdgAKW8rJy7QIJtPS0gIUZgASY7h7hZ4BDgADTwMofAASYxEka8/KywATZby0uQgda6gFGbpoc6QTIgAHVgAdcrC0v56jsszMzKkCFk1djU1Yg32Prv///8sBGNMHJs8CHdQLLAAegwATeNEDIAAujwAKZtYRMgANa9YgPAAoiP79/cQAEeZ9i+vt89Xc6wEKXPn3+N9vfhg/lOmKlwImfPPKzwIZb83U5fvu8AADTdtGXN9YaoydwxcwgfK8w11zrPfV2UNfovnh5Nk0TOycp7jD2t3d3TFLk6iz0fCttqsBEr0OLcy5vMWboL7jb4MAAAAkdFJOUwD+/X39/3kQfoH+/ShvJ4HW15JNuady6j+76b+/7/FQt331fQrzi9EAAAaxSURBVFjD7Zhpe6JYE4bd2mVMJz0TJ1t30t3zIiIkigjIIkoDsrihifn/f+WtOueAmjhz9XybD/1ovEyE26eqTp0lhcIv/dJ/VzXQWY3oX913fr5HnF1+/OPPL78zffnzj/LHy7Pzn+HVbi5uGwz4tdWqWOPxYHys3+9btxfVm5t/4NXOq9/uSjsE1b62muv1urmJrMHgkTxRCJoVm+ZvoLtvt42ry7Ozo4ghCWeXjVbp+bm0azYK51etNUozFGMaWY+HGlhTzXx5QZTZvJ9dX3+BiOvlj6ByHfJwfV3ZIcdZA6haMl8doHCKwnHGJjnAAEhXVKEnCC8v5ro4m+Tq9+HZf5oFu9Jw6MUcAb28yJ4auhyVHlgZBkRBIMFWpla32x2L4h6XrhxPkoCjrB++E5AsL/zlXCEkZZWZgjxlIEGwOd3qDsgjU6SHC8LhuOKsDqEtZLkHLC9DaRVr8EgfWWgZCCmM9BhoW1mSfOAoWjqqFxrN3Vb1ZIQBipAMMEUrR0CCkDnaY7rpyrV7Eu/jHVr0BKD/BStNmW/NBUQg+6FBMxU9Dvah5Y5yzCDSY5+XBNUlHBFB5bGVVFaa4agEZcY0vMA6cCTsHRFZgYbp6dmMw0BQHysJdCMmqMXSpTlPGYhHDn8IiqauDemRlwrj7EFY6YpuOKa8N6VHp0Fgx4GwJM/hMs4RiKDcrYemtgat3mMG4nPQAC5CO4I5p98m7kHjfCyngTa35Z4gq+QqI0gIiOdzULIyQrQjL8l3TRPCEUdHjrBfyYUwFnwH41emGoB4PnOEX6SCHZ5+zK1SkYEm5b0jK4mCYDM1ONdxnNCh44BDkEAdJRDVEoolyaRa0JgW41jRQ4OCoGorHTuXKX9DQCDJ5jTdDX1hb0cLBgjpzqKN3mwiaJAEU+3g3iPtQZxrL4DDhgekuSsO0qSy0Q1OaRavCuVko9HGmMfh1lZVE6Sq9nLrxHNXUVQpAxlzJ9wu6djgtE0F8qDTBLivpSr02lqBa0Lb92AQYT/wPB3MPXnh+aqXOzo2nf/iOrb3/OGi0FivsdOg6LSpiDC/pOoS+YGHH8auYbyJX3HBgNdrDwloZ6IVMnvlKJ5xmKBSPPozMeIQiho7GKUNd/Lt9rDdRhBMbD3G6b2xk7nBJ1Gn05F4AScvCKDTJgwUcVT97YXZEU7akY4FrDZT/uYtKDOUYagb9rrnEB1S2sMD0GF6hKPcvLHDIJ09Bkk56DDLp5Jz6KZ95Idw2h9yUGaGZhIH1InkUDfv/WBoVQIiww+qy4oLtcXiqr4Hw+sYw0hHfoZtufTaQBDY8O0Q+uHNcDNc6BqvwzBYp3dBIQWWxGaRgHw7dt/3fda01IxnYgtJxyQB1ujtnDVttfRKKYY2XW2CDZuHYggyxmsYSEV/dDibPggaG9p6Tm/VHv4qs6bVVkGUWoNuotNG3C6gKRYwgSlqm8SlUrPKu9kG9jBBOvqBK+1a20TpgM7sZEZRYlOAZlhsXZjrTJoZ9eRkpemrSjLrP/1AULFCKV3RCkhc7lKG9Mr2XMPJH0GQlwxkwCwcQ0qN6WYTRMls0n8CIej7bMJW4nRFzDs+2JHVWNuk4myKoDZxpOnk4xAXLN8xNmkfGYRDQOXJhC58ND1gp9Ph8cKkK2Yg4miabNgXQdVh/tej8VOmQ1BE0gNbA7CzdKcwI4sMRCoOoNk4INe4tgDDxwth0zJ+BxoQjgJbA7QDWwi6zlBQm4H6YjQleQo9MCWYobaqzPIclfsIIuUyMCwwPU264mlQn+UREgCDmjcdQw/SydMIQXUEEY6rCh3JC7VgJoqnQZBeGp5CM4WuXLBFxhGCSFxzk+/w5lyPuuLfg2A7S8PDMTvEVoNtnqE9RN8RRDm+1IGdU74MH4GGWWjgqT+jbaTArgRRQ+ja191Vof6UICf2pM5iq1UO7Ij9U47QFGsAJVYpavjhrlqop0X4I9kwO2y3k3MYCKevQ1Afck57W4ltEiDOkN/voWmdBUwUzirts3Exwhe4IQ/tEISfjSt6ttBuTfkZQdC0XAzY0q4yGb3V5H5deibm9yDaFqOUbRkUY717Ld2Rtd8hB5zK9afPcGSp45GlDkeWz58/ja4fiqUPoOdnU1uNn6gbanvUh02Zoa2bRVDrqoYbduS06Cmq8OYUddW4/XaHqFLxAYbdkd0fo78ekHLf+Ir3NXalu29VONnV/vZkd3NTvbhtPVz/eCdANb6yU+jV7cXNT503zy8vP2LEn5ggD3BWrZ061v7s6blGjpK1X/9K+KX/sP4PsW55UIo2Nb0AAAAASUVORK5CYII=">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="header-actions" style="display:flex; align-items:center">
                    <button class="btn btn-edit-mode ${this.editMode ? "on" : "off"}" id="editModeBtn"></button>
                    <div style="display: flex; flex-direction: column; gap: 8px">
                        <button class="btn btn-import" id="importBtn"></button>
                        <button class="btn btn-export" id="exportBtn"></button>
                    </div>
                </div>
            </div>

            <div class="main-average-card" id="main-average-card" ${this.editMode ? 'style="cursor:move"' : ""}>
                <div class="average-display">
                    <div class="average-number">${moyenneGenerale}</div>
                    <div class="average-label"></div>
                </div>
                <div class="average-stats">
                    <div class="stat-item"><div class="stat-value">${totalNotes                        }</div><div class="stat-label"></div></div>
                    <div class="stat-item"><div class="stat-value">${Object.keys(this.semestres).length}</div><div class="stat-label"></div></div>
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
                    ${Object.keys(this.semestres).sort((a,b) => a-b).map(s => `<button class="filter-tab ${s == this.currentSemester ? "active" : ""}" id="filter-tab-semester-${s}" data-filter="${s}">S${s}</button>`).join('')}
                </div>
                <div class="view-toggle">
                    <div style="padding: 0px 5px 0px 8px; font-size: 14px; font-weight: 500"></div>
                    <button class="view-btn ${this.defView == "detailed" ? "active" : ""}" id="view-btn-detailed" data-view="detailed">📊</button>
                    <button class="view-btn ${this.defView == "compact" ? "active" :  ""}" id="view-btn-compact"  data-view="compact" >📋</button>
                </div>
            </div>
            <div class="content-area" id="contentArea"></div>
            <div class="intranet-collapse"><div class="intranet-text"><div class="intranet-toggle collapse-icon">▲</div><div class="semester-name"> <div class="intranet-subtext"></div> </div><div class="intranet-toggle collapse-icon">▲</div></div></div>
            `;

            const notifContainer = document.createElement("div");
            notifContainer.className = "selected-matiere-card-notif-container";

            const originalTable = document.querySelector("table.greyGridTable");
            if (!originalTable) return;
            originalTable.parentNode.insertBefore(notifContainer, originalTable);
            originalTable.parentNode.insertBefore(container, originalTable);
            originalTable.style.display = "none";

            this.renderContent();
        }


        // MARK: renderRecentGrades
        renderRecentGrades() {
            // localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES",JSON.stringify(this.notes.toSpliced(12,1))); this.savedReadGrades = JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"));
            const newGradesCard = document.querySelector(".new-grades-card");
            const grades = {};
            
            if (this.newGrades.length > 0) {

                // ordering grades per subjects
                this.newGrades.forEach((note => {
                    if (!grades[note.matiere]) {
                        grades[note.matiere] = [note];
                    }
                    else {
                        grades[note.matiere].push(note)
                    }
                                    
                }))
                
                let html = `<div class="new-grades-content">`;
                Object.keys(grades).forEach(subject => {
                    html += `
                    <div class="new-grades-matiere-card" id="new-grades-matiere-card-${subject}" data-subject="${subject}" data-ue="${grades[subject][0].ue}" data-semestre="${grades[subject][0].semestre}">
                        <div class="new-grades-matiere-card-title" data-subject="${subject}" data-ue="${grades[subject][0].ue}" data-semestre="${grades[subject][0].semestre}">
                            ${subject}
                        </div>
                    <table class="new-grades-table">`;
                    
                    grades[subject].forEach(grade => {
                        html +=
                            `<tr class="new-grades-table-notes" id="new-grade-${subject}-${grade.type}" data-subject="${subject}" data-type="${grade.type}" data-semestre="${grade.semestre}">
                                <td style="width: 25%;padding: 5px 5px 5px 10px;" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.type}</td>
                                <td style="width: 9%;"><span class="note-value note-${this.getNoteColor(grade.note)}" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.note}/20</span></td>
                                <td style="width: 8%;" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.coef}%</td>
                                <td style="width: 8%;" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.classAvg}/20</td>
                                <td style="width: 10%;" class="note-date" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.date}</td>
                                <td style="width: 25%;font-size:12px;color: #999;" data-subject="${subject}" data-semestre="${grade.semestre}">${grade.prof}</td>
                            </tr>`;
                    })
                    html += `</table></div>`;
                })
                html += `</div>`;
                newGradesCard.innerHTML += html;
            }

            if (newGradesCard.children.length == 1) {newGradesCard.classList.add("none")}
            else {newGradesCard.classList.remove("none")}
        }

        languageSensitiveContent(fadeIn=true) {
            // Language Sensitive text in the Dashboard Header and Semester filter tab (which don't refresh on calling the renderContent() method)
            const dashTitle = document.querySelector(".dash-title");
            const dashSubtitle = document.querySelector(".dash-subtitle");
            dashTitle.innerHTML = `${this.lang == "fr" ? 'ECAM Notes Dashboard' : "ECAM Grades Dashboard"}`;
            dashSubtitle.innerHTML = `${this.lang == "fr" ? 'Vue complète de vos résultats académiques' : "Complete view of your academic results"}`;

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
            statLabelsArray[0].innerHTML = `${this.lang == "fr" ? "Notes" : "Grades"}`;
            statLabelsArray[1].innerHTML = `${this.lang == "fr" ? "Semestres" : "Semesters"}`;
            statLabelsArray[2].innerHTML = `${this.lang == "fr" ? "UE Validées" : "Validated TU"}`;

            document.querySelector(".filter-title").innerHTML = `${this.lang == "fr" ? "Filtre par semestre" : "Filter by semester"}`;
            document.querySelector(".filter-tab").innerHTML = `${this.lang == "fr" ? "Tous" : "All"}`;

            document.querySelector(".view-toggle").children[0].innerHTML = this.lang == "fr" ? `Basculer le mode d'affichage (Maj+D)` : `Display mode toggle (Shift+D)`;
            const viewBtnsArray = document.querySelectorAll(".view-btn");
            viewBtnsArray[0].title = this.lang == "fr" ? "Vue détaillée" : "Detailed view";
            viewBtnsArray[1].title = this.lang == "fr" ? "Vue compacte" : "Compact view";

            const intranetSubtext = document.querySelector(".intranet-subtext");
            intranetSubtext.innerHTML = `${this.lang == "fr" ? "Afficher le tableau des notes d'Espace ECAM" : "Show ECAM Intranet's Grades Table"}`;

            if (document.querySelector(".new-grades-card").children.length > 1) {document.querySelector(".new-grades-card").children[1].remove()}
            document.querySelector(".new-grades-card-title").innerHTML = `${this.newGrades.length > 0 ? `${this.lang == "fr" ? `Nouvelle Note${this.newGrades.length > 1 ? "s" : ""} !` : `New Grade${this.newGrades.length > 1 ? "s" : ""}!`}` : `${this.lang == "fr" ? `Pas de nouvelle note` : `No new grade`}` }`;
            document.querySelector(".new-grades-mark-as-read-text").innerHTML = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";
            document.querySelector(".new-grades-mark-as-read").title = this.lang == "fr" ? "Marquer comme lu" : "Mark as read";

            let highestWidth = 0;
            document.querySelectorAll(".selected-matiere-card-notif-div").forEach(notifDiv => {
                notifDiv.childNodes[4].data = this.lang == "fr" ? `est sélectionné!` : `is selected!`;
                if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;
            })
            document.querySelector(".selected-matiere-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

            if (fadeIn) {
                document.querySelector(".ecam-dash").parentElement.classList.add("fade-in");
                setTimeout(() => {document.querySelector(".ecam-dash").parentElement.classList.remove("fade-in")}, 300);
            }
            
        }

        // MARK: renderContent
        renderContent(fadeIn=true) {

            this.languageSensitiveContent(fadeIn);
            
            // Call renderRecentGrades to... well... render the recent grades' card
            this.renderRecentGrades()


            // Content area, refreshing often
            const ueStats = this.getUEStats();
            const validatedEUsStatLabel = document.querySelectorAll(".stat-value")[2];
            validatedEUsStatLabel.innerHTML = `${ueStats.validated}/${ueStats.total}`;

            let semesterKeys = [];
            if (this.currentSemester === "all") {
                semesterKeys = Object.keys(this.semestres).sort();
            }
            else if (this.currentSemester === "last") {
                semesterKeys = [Object.keys(this.semestres).sort().at(-1)];
            }
            else {
                semesterKeys = [this.currentSemester];
            }
            this.gradesDatas = {};
            const contentArea = document.getElementById("contentArea");
            contentArea.innerHTML = "";
            semesterKeys.forEach(sem => {
                const section = document.createElement("div");
                section.className = `semester-section`;
                const moyenneSem = this.moyennePonderee([].concat(...Object.values(this.semestres[sem] || {})));
                const avgClass = this.getAverageColor(moyenneSem);
                const unclassified = this.getUnclassifiedMatieres(sem);
                if (unclassified.length > 0) {
                    if (!this.gradesDatas[sem]) this.gradesDatas[sem] = {};
                    this.gradesDatas[sem]["unclassified"] = {matieres:{}};
                }
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
                <div class="semester-content show" id="sem-content-${sem}">
                    <div class="drop-matiere-card-to-remove-from-eu">
                    </div>
                    <div class="ue-grid" ${(unclassified.length == 0 || !this.ueConfig[sem] || Object.keys(this.ueConfig[sem])[0] == undefined) ? `style="gap: ${this.editMode ? `20px` : `0px`}"` : ``}>
                        <div class="modules-section">
                            <div class="modules-content">
                                ${this.renderAllUECards(sem)}
                            </div>
                        </div>
                        <div class="unclassified-part" ${unclassified.length > 0 ? `` : `style="display: none"`}>
                            <div class="unclassified-section">
                                <div class="unclassified-title">
                                    ${this.lang == "fr" ? `Matière${unclassified.length > 1 ?  `s` : ``} non classée${unclassified.length > 1 ?  `s` : ``} dans une UE` : `Subject${unclassified.length > 1 ?  `s` : ``} not classified in a TU`}
                                </div>
                                <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 8px;">
                                    <div class="unclassified-content">
                                        ${unclassified.length > 0 ?  `${this.renderAllUnclassifiedMatCard(sem, unclassified)}` : ``}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="drop-matiere-card-to-create-eu">
                    </div>
                </div>
                `;
                contentArea.appendChild(section);
                const container = document.getElementById(`sem-content-${sem}`)

                // Set the all ue cards' moyenne
                document.querySelectorAll(".ue-card").forEach(ueCard => {
                    const ueHead = ueCard.querySelector(".ue-header");
                    const ueMoy = ueCard.querySelector(".ue-moyenne");

                    let newMoy = 0;
                    let totalCoef = 0;
                    let ignoredMatieres = 0;
                    const sem = ueMoy.dataset.sem;
                    const ue = ueMoy.dataset.ue;

                    Object.keys(this.gradesDatas[sem][ue].matieres).forEach(matiereName => {
                        const matiere = this.gradesDatas[sem][ue].matieres[matiereName];
                        if (matiere.totalDisabledGrades != matiere.grades.length) {
                            newMoy += matiere.average * parseInt(matiere.coef);
                            totalCoef += parseInt(matiere.coef);
                        }
                        else {ignoredMatieres++}
                    })

                    newMoy = Math.round(newMoy/totalCoef*100)/100;
                    
                    this.gradesDatas[sem][ue].average = newMoy;
                    ueMoy.childNodes[0].data = `${newMoy}/20`;

                    if (ignoredMatieres == Object.keys(this.gradesDatas[sem][ue].matieres).length) {
                        ueMoy.classList.remove('bad'); ueMoy.classList.remove('good'); ueMoy.classList.add("unknown"); ueMoy.childNodes[0].data = " - /20";
                        ueCard.classList.remove('failed'); ueCard.classList.remove('validated'); ueCard.classList.add("unknown");
                        ueHead.classList.remove('failed'); ueHead.classList.remove('validated'); ueHead.classList.add("unknown");
                    }
                    else if (newMoy >= 10) {
                        ueMoy.classList.remove('bad'); ueMoy.classList.add('good'); ueMoy.classList.remove("unknown");
                        ueCard.classList.remove('failed'); ueCard.classList.add('validated'); ueCard.classList.remove("unknown");
                        ueHead.classList.remove('failed'); ueHead.classList.add('validated'); ueHead.classList.remove("unknown");
                    }
                    else {
                        ueMoy.classList.add('bad'); ueMoy.classList.remove('good'); ueMoy.classList.remove("unknown");
                        ueCard.classList.add('failed'); ueCard.classList.remove('validated'); ueCard.classList.remove("unknown");
                        ueHead.classList.add('failed'); ueHead.classList.remove('validated'); ueHead.classList.remove("unknown");
                    }
                })
                

                // Attach on-click event action for the grades' checkbox
                this.attachCheckboxListeners(container);

                // After rendering the UE card's content in detailed view, check if the view mode is set to "compact" and if so, render the UE card's content in compact view
                if (this.viewMode == "compact") {
                    document.querySelectorAll('.ue-header').forEach(header => {
                        if (header.nextElementSibling) {
                            const toggle = header.querySelector('.ue-toggle');
                            const content = header.nextElementSibling;
                            const sem = header.dataset.semester;
                            const ueName = this.editMode ? header.children[0].children[1].value : header.children[0].innerText;
                            const ueConfig = this.ueConfig[sem] || {};
                            const ueData = ueConfig[ueName];
                            
                            const ueContent = header.parentElement.querySelector(".ue-details");
                            ueContent.innerHTML = this.renderAllMatCardCompact(ueData, sem, ueName);
                            content.classList.add('compact');
                            toggle.classList.remove('open');
                        }
                    });
                }

                this.setNotesTableTotalCoef()
                this.attachEventListeners();

            });
        }




        renderAllUECards(sem) {
            const container = document.getElementById(`sem-content-${sem}`);
            const ueConfig = this.ueConfig[sem] || {};
            if(!Object.keys(this.gradesDatas).includes(sem)) this.gradesDatas[sem] = {};

            let html = `<div class="ue-insert-area ${this.editMode ? `show` :""}" data-semester="${sem}" data-index="0">+</div>`;

            if (ueConfig.__ues__) {
                ueConfig.__ues__.forEach((ueName, ueIndex) => {
                    if (ueName != "__ues__") {
                        html += this.renderUECard(sem, ueName, ueIndex);
                    }
                });
            }

            return html;
        }
        // MARK: renderUECard
        renderUECard(sem, ueName, insertCount=-1) {
            const ueConfig = this.ueConfig[sem] || {};
            const ueData = ueConfig[ueName];
            const ueNotes = this.calculateUENotes(sem, ueData, ueName);
            const includedNotes = (ueNotes || []).filter(n => this.ignoredGrades.indexOf([sem, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1);
            let weight = 0; includedNotes.forEach(note => {weight += note.coef/100})
            const moyenne = includedNotes.length ? this.moyennePonderee(includedNotes) : " - ";
            const hasSim = (this.sim[sem] && this.sim[sem][ueName] && Object.values(this.sim[sem][ueName]).some(arr=>arr.length>0)) ? true : false;

            if (!Object.keys(this.gradesDatas[sem]).includes(ueName)) this.gradesDatas[sem][ueName] = {average: moyenne, matieres:{}};
            const allMats = this.getAllMatieresForUE(sem, ueData, ueName);
            allMats.forEach(m => { 
                if (!Object.keys(this.gradesDatas[sem][ueName].matieres).includes(m)) {
                    this.gradesDatas[sem][ueName].matieres[m] = {grades: []};
                } else {
                    this.gradesDatas[sem][ueName].matieres[m].grades = [];
                }
            });
            ueNotes.forEach(n => {
                this.gradesDatas[sem][ueName].matieres[n.matiere].grades.push(n);
            });
            
                /* <svg style="border-radius: 20px; width: 100%; height: 100%;">
                    <path class="ue-insert-path" fill="none" stroke="#9097ff" stroke-width="1px" stroke-dasharray="25 5" d="M 0 0 l 20 15 h 1050 M 0 45 l 20 -15 h 1050"/>
                </svg> */
            let html = `
            <div class="ue-card ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}" id="ue-card-${ueName}-in-semester-${sem}" data-semester="${sem}" data-ue="${ueName}">
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
                    <div class="notes-table-coef" style="display:flex; flex-direction: column; width:47%; gap:4px; padding: 0px 10px; font-size: 13px">
                        <div style="font-size: 14px; font-weight: 700">
                            ${this.lang == "fr" ? `Coef Total de matieres :` : `Total Subjects Coef:`}
                        </div>
                        <div class="ue-matiere-total-coef-value" data-sem="${sem}" data-ue="${ueName}"></div>
                    </div>
                    <div class="ue-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}" data-sem="${sem}" data-ue="${ueName}">
                         - /20 
                        <div class="ue-toggle open collapse-icon">▲</div>
                        <button class="ue-delete-btn" ${this.editMode ? `class="display:none"` : ""} id="ue-delete-btn-${ueName}-in-semester-${sem}" data-semester="${sem}" data-ue="${ueName}">🗑️</button>
                    </div>
                </div>
                ${hasSim 
                    ? 
                    `<div style="width:97%;font-size:12px;color:#374151;background:#eef2ff;border:1px solid #c7d2fe;padding:6px 8px;border-radius:8px; margin:8px 0px;">
                        ${this.lang == "fr" ? "Inclut des notes simulées" : "Includes simulated grades"}
                    </div>` 
                    : ``}
                <div class="ue-details" id="ue-details-${ueName}-in-semester${sem}">
                    ${this.renderAllMatCardDetailed(ueData, sem, ueName)}
                </div>
                ${this.editMode ? `
                <div class="add-a-matiere-card" id="add-a-matiere-card-for-${ueName}-in-semester-${sem}" data-sem="${sem}" data-ue="${ueName}">
                    <div class="add-a-matiere-card-plus left">+</div>
                    <div>${this.lang == "fr" ? `Ajouter une matière` : `Add a subject`}</div>
                    <div class="add-a-matiere-card-plus right">+</div>
                </div>
                ` : ""
                }
            </div>
            ${
                insertCount > -1
                ? `<div class="ue-insert-area ${this.editMode ? `show` :""}" data-semester="${sem}" data-index="${insertCount}">+</div>`
                : ``
            }
            `;

            return html
        }
        



        renderAllMatCardDetailed(ueData, sem, ueName) {
            return Object.keys(this.gradesDatas[sem][ueName].matieres).map(matiere => {
                if (matiere != "average") 
                    {return this.renderMatCardDetailed(ueData, sem, ueName, matiere)}
            }).join("")
        }
        // MARK: renderMatCardDetailed
        renderMatCardDetailed(ueData, sem, ueName, matiere) {
            const matNotes = this.gradesDatas[sem][ueName].matieres[matiere].grades;
            const ueMoy = this.gradesDatas[sem][ueName].average;
            const moyMat = this.moyennePonderee(matNotes);
            const pct = ueData?.pourcentages?.[matiere] || 0;
            const isCustom = ueData?.custom?.[matiere] || false;
            this.gradesDatas[sem][ueName].matieres[matiere].average = matNotes.length != 0 ? moyMat : " - ";
            this.gradesDatas[sem][ueName].matieres[matiere].coef = parseInt(pct);
            this.gradesDatas[sem][ueName].matieres[matiere].custom = isCustom;
            
                let html = `
                <div class="matiere-card ${ueMoy != " - " && moyMat != 0 ? `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}` : ``}" ${this.editMode ? `style="user-select: none;"` : ``} id="mat-card-semester-${sem}-matiere-${matiere}" data-semester="${sem}" data-ue="${ueName}" data-subject="${matiere}" data-custom="${isCustom}">
                    <div class="matiere-card-header ${ueMoy != " - " && moyMat != 0 ? `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}` : ``}" ${this.editMode ? `draggable="true"` : ``} style="${this.editMode ? `cursor:move; ` : `${matNotes.length > 0 ? `` : `border-radius: 20px; border: none`}`}">
                        <div style="display: flex; width: 42%; padding-left: ${this.editMode ? `10px` : `50px`}">
                            <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; gap:8px; user-select: text">
                                ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("detailed-matiere-card", {type:"detailed", targetId:`mat-card-semester-${sem}-matiere-${matiere}`})}</div>` : ""}
                                <div style="width: 100%">
                                    ${isCustom 
                                        ? `<input type="text" class="matiere-name input any-input" id="matiere-name-input-${sem}-${ueName}-${matiere}" value="${matiere}"/>`
                                        : `<div class="matiere-name">${matiere}</div>`}
                                    <div class="note-type">
                                        ${this.lang == "fr" ? "Poids UE" : "TU Weight"}: 
                                        ${this.editMode 
                                            ? `<input class="matiere-coef-input-box any-input" id="matiere-coef-input-box-${sem}-${ueName}-${matiere}" data-semestre="${sem}" data-ue="${ueName}" data-subject="${matiere}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                            : `<span style="font-weight: 800;">${pct}%</span>`}
                                        | 
                                        ${this.lang == "fr" ? "Moyenne" : "Average"}: 
                                        <span class="mat-moyenne ${moyMat==0 ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}">${moyMat==0 ? " - " : moyMat}/20</span> 
                                        ${matNotes.length===0 ? `<span style="margin-left:2px;font-size:12px;color:#6b7280">${this.lang == "fr" ? "(aucune note publiée)" : "(no published grade)"}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="notes-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding: 0px 10px; font-size: 13px">
                            <div>
                                ${this.lang == "fr" ? `Coef Total de notes :` : `Total Grades Coef:`}
                            </div>
                            <div class="notes-table-matiere-total-coef-value" data-sem="${sem}" data-ue="${ueName}" data-subject="${matiere}"></div>
                        </div>
                    </div>
                    <table class="notes-table ${ueMoy != " - " && moyMat != 0 ? `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}` : ``}" style="${this.editMode ? `user-select: text;` : ``}" id="notes-table-${matiere}-semester${sem}" data-subject="${matiere}">

                        <thead>
                            ${matNotes.length > 0 || this.editMode
                                ? `<tr>
                                    <th class="notes-table-type" style="padding-left: 30px">
                                        ${this.lang == "fr" ? "Intitulé" : "Title"}
                                    </th>
                                    <th class="notes-table-note">
                                        ${this.lang == "fr" ? "Note" : "Grade"}
                                    </th>
                                    <th class="notes-table-coef">
                                        ${this.lang == "fr" ? "Coef" : "Coef"}
                                    </th>
                                    <th class="notes-table-classAvg">
                                        ${this.lang == "fr" ? "Moy. Classe" : "Class Avg"}
                                    </th>
                                    <th class="notes-table-date">
                                        ${this.lang == "fr" ? "Date" : "Date"}
                                    </th>
                                    <th class="notes-table-teacher">
                                        ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                    </th>
                                    <th style="width: 1px"></th>
                                </tr>`
                                : ``
                            }
                        </thead>
                        <tbody>
                `;

            let totalCoef = 0;
            let totalDisabledGrades = 0;
            let totalSimGrades = 0;
            matNotes.forEach((note, index) => {
                const noteClass = this.getNoteColor(note.note);
                if (note.__sim) totalSimGrades++;
                const noteIsSim = note.__sim ? "true" : "false";
                if (this.ignoredGrades.indexOf([sem, matiere, note.type+" "+note.date+" "+note.prof].join("\\")) == -1) {
                    totalCoef += note.coef;
                }
                else
                {
                    totalDisabledGrades++
                }

                html += `
                        <tr class="note-row ${index == matNotes.length-1 ? `last` : ``} ${note.__sim ? `sim` : ``}" data-sim="${noteIsSim}">
                            <td class="notes-table-type" style="display: flex; align-items: center; gap: 6px; width: auto">
                                <input type="checkbox" class="note-checkbox any-input" id="note-checkbox-${note.matiere}-${note.type}-${note.date}-${note.prof}" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}" data-prof="${note.prof}" data-gradeid="${note.type} ${note.date} ${note.prof}" ${this.ignoredGrades.indexOf([sem, matiere, note.type+" "+note.date+" "+note.prof].join("\\")) == -1 ? "checked" : ""}></input>
                                ${note.__sim && this.editMode
                                    ? `<input class="note-type note-simulee-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="note-simulee-input-type-for-${matiere}-from-${ueName}-in-semester${sem}-${note.type}" data-modifType="type" data-id="${totalSimGrades-1}" data-sem="${sem}" data-mat="${matiere}" data-type="${note.type}" data-uen="${ueName||''}" value="${note.type}"/>` 
                                    : `<label class="note-type" style="width: auto"  id="note-type-${note.type}-${note.date}" for="note-checkbox-${note.matiere}-${note.type}-${note.date}-${note.prof}">${note.type || ''}${note.__sim ? ` • ${this.lang == "fr" ? "Simulée" : "Simulated"}` : ''}</label>`
                                }
                            </td>
                            <td class="note-value note-${noteClass} notes-table-note" data-sim="${noteIsSim}">
                                ${note.__sim && this.editMode
                                    ? `<input class="note-simulee-input-edit sim-inp-note any-input" style="width: 100%; max-width: 75px;" id="note-simulee-input-note-for-${matiere}-from-${ueName}-in-semester${sem}-${note.type}" type="number" step="0.5" min="0" max="20" data-id="${totalSimGrades-1}" data-modifType="note" data-sem="${sem}" data-mat="${matiere}" data-type="${note.type}" data-uen="${ueName||''}" style="width:75px; height:25px" value="${note.note}"> /20`
                                    : `${note.note}/20`
                                }
                            </td>
                            <td class="notes-table-coef" data-sim="${noteIsSim}">
                                ${note.__sim && this.editMode
                                    ? `<input class="note-simulee-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="note-simulee-input-coef-for-${matiere}-from-${ueName}-in-semester${sem}-${note.type}" type="number" step="5" min="0" max="100" data-id="${totalSimGrades-1}" data-modifType="coef" data-sem="${sem}" data-mat="${matiere}" data-type="${note.type}" data-uen="${ueName||''}" style="width:60px; height:25px"value="${note.coef}"> %`
                                    : `${note.coef} %`
                                }
                            </td>
                            <td class="notes-table-classAvg" data-sim="${noteIsSim}">
                                ${note._sim && this.editMode
                                    ? ``
                                    : `${note.__sim ? "" : note.classAvg+"/20"}`
                                }
                            </td>
                            <td class="notes-table-date note-date" data-sim="${noteIsSim}">
                                ${note.__sim && this.editMode
                                    ? `<input class="note-simulee-input-edit sim-inp-date any-input" style="width: 100%; max-width: 140px;" id="note-simulee-input-date-for-${matiere}-from-${ueName}-in-semester${sem}-${note.type}" type="date" data-id="${totalSimGrades-1}" data-sem="${sem}" data-mat="${matiere}" data-modifType="date" data-type="${note.type}" data-uen="${ueName||''}" style="width:140px; height:25px"value="${note.date||""}">`
                                    : `${`${note.__sim ? note.date.split("-").reverse().join("/") : note.date}`||''}`
                                }
                            </td>
                            <td class="notes-table-teacher">
                                <span>${`${note.prof.split(" / ").length <= 3 ? note.prof : note.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</span>
                            </td>
                            <td style="width: 52px; padding: 3px">
                                ${note.__sim 
                                    ? `<button class="sim-del-btn" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}" data-type="${note.type}">🗑️</button>` 
                                    : `<div style="width:32px"></div>`}
                            </td>
                        </tr>
                `;
            });
            this.gradesDatas[sem][ueName].matieres[matiere].totalCoef = totalCoef;
            this.gradesDatas[sem][ueName].matieres[matiere].totalDisabledGrades = totalDisabledGrades;
            this.gradesDatas[sem][ueName].matieres[matiere].totalSimGrades = totalSimGrades;

            // Formulaire d'ajout de note simulée pour cette matière
                html += `
                            <tr ${this.editMode ? "" : "hidden=true"}>
                                <td class="notes-table-type">
                                    <div class="note-type" style="display:flex; align-items:center; justify-content: flex-start">
                                        <div style="width: 120px">${this.lang == "fr" ? "Ajouter une note simulée: " : "Add a simulated grade: "}</div>
                                        <input class="note-simulee-input sim-inp-type any-input" id="note-simulee-input-type-for-${matiere}-from-${ueName}-in-semester${sem}" data-sem="${sem}" data-mat="${matiere}" placeholder="${this.lang == "fr" ? "Titre" : "Title"}" />
                                    </div>
                                </td>
                                <td class="notes-table-note">
                                    <input class="note-simulee-input sim-inp-note any-input" id="note-simulee-input-note-for-${matiere}-from-${ueName}-in-semester${sem}" type="number" step="0.5" min="0" max="20" data-sem="${sem}" data-mat="${matiere}" placeholder="/20"> /20
                                </td>
                                <td class="notes-table-coef">
                                    <input class="note-simulee-input sim-inp-coef any-input" id="note-simulee-input-coef-for-${matiere}-from-${ueName}-in-semester${sem}" type="number" step="5" min="0" max="100" data-sem="${sem}" data-mat="${matiere}" placeholder="%"> %
                                </td>
                                <td>
                                </td>
                                <td class="notes-table-date">
                                    <input class="note-simulee-input sim-inp-date any-input" id="note-simulee-input-date-for-${matiere}-from-${ueName}-in-semester${sem}" type="date" value="${this.today}" data-sem="${sem}" data-mat="${matiere}">
                                </td>
                                <td colspan="2">
                                    <button class="btn-export sim-add-btn" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                `;

            return html;
        }




        renderAllMatCardCompact(ueData, sem, ueName) {
            return Object.keys(this.gradesDatas[sem][ueName].matieres).map(matiere => {
                if (matiere != "average") 
                    {return this.renderMatCardCompact(ueData, sem, ueName, matiere)}
            }).join("")
        }
        // MARK: renderMatCardCompact
        renderMatCardCompact(ueData, sem, ueName, matiere) {
            const matNotes = this.gradesDatas[sem][ueName].matieres[matiere].grades;
            const moyMat = this.moyennePonderee(matNotes);
            const ueMoy = this.gradesDatas[sem][ueName].average;
            const pct = ueData?.pourcentages?.[matiere] || 0;
            const isCustom = ueData?.custom?.[matiere] || false;
            const includedNotesLength = (matNotes || []).filter(n => this.ignoredGrades.indexOf([sem, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1).length;
            const simGradesLength = (matNotes || []).filter(n => n.__sim).length;
            this.gradesDatas[sem][ueName].matieres[matiere].average = matNotes.length != 0 ? moyMat : " - ";
            this.gradesDatas[sem][ueName].matieres[matiere].coef = parseInt(pct);
            this.gradesDatas[sem][ueName].matieres[matiere].custom = isCustom;

            const html = `
            <div class="matiere-card compact ${this.editMode ? "" : "edit-mode"} ${moyMat == 0 && matNotes.length==0 ? "unknown" : `${moyMat>10 ? `${ueMoy>10 ? `good` : `meh`}` : `bad`}`}" id="mat-card-semester-${sem}-matiere-${matiere}" style="${this.editMode ? "cursor:move; user-select: none; " : " "}" ${this.editMode ? `draggable="true"` : ""} data-sem="${sem}" data-ue="${ueName}" data-subject="${matiere}" data-custom="${isCustom}">
                <div style="display:flex; align-items:center; gap:8px; padding-left: 11px; width:43%; min-width: 275px">
                    ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("compact-matiere-card", {type:"compact", targetId:`mat-card-semester-${sem}-matiere-${matiere}`})}</div>` : ""}
                    <div>
                        ${isCustom 
                            ? `<input type="text" class="matiere-name input any-input" value="${matiere}"/>`
                            : `<div class="matiere-name">${matiere}</div>`
                        }
                        <div style="font-size:13px;color:#666;">
                            ${this.editMode 
                                ? `<input class="matiere-coef-input-box any-input" id="matiere-coef-input-box-${sem}-${ueName}-${matiere}" data-semestre="${sem}" data-ue="${ueName}" data-subject="${matiere}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                : `<span style="font-weight: 800">${pct}%</span>`} ${this.lang == "fr" ? "de l'UE" : "of the TU"} • 
                            ${matNotes.length===0 ? `${this.lang == "fr" ? "aucune publiée" : "no published grade"}` : `${matNotes.length} ${this.lang == "fr" ? `note${matNotes.length>1?"s":""} au total` : `grade${matNotes.length>1?"s":""} total`}`}
                            ${matNotes.length>0 
                                ? ` • <span ${includedNotesLength<matNotes.length ? `style="color: #df0000"` : ``}>
                                    <span style="font-weight: 700; ">${includedNotesLength}/${matNotes.length}</span> 
                                    ${this.lang == "fr" ? `note${includedNotesLength>1?"s":""} activée${includedNotesLength>1?"s":""}` : `grade${includedNotesLength>1?"s":""} activated`}${includedNotesLength<matNotes.length ? `!` : ``}
                                </span>` 
                                : ``}
                            ${simGradesLength>0 
                                ? ` • ${simGradesLength} ${this.lang == "fr" ? `note${simGradesLength>1?"s":""} simulée${simGradesLength>1?"s":""}` : `simulated grade${simGradesLength>1?"s":""}`}`
                                : ``}
                            
                        </div>
                    </div>
                </div>
                <div class="notes-table-coef" style="display:flex; flex-direction: column; width:50%; gap:6px; padding: 0px 10px; font-size: 13px; font-weight: 600">
                    <div>
                        ${this.lang == "fr" ? `Coef Total de notes :` : `Total Grades Coef:`}
                    </div>
                    <div class="notes-table-matiere-total-coef-value" data-sem="${sem}" data-ue="${ueName}" data-subject="${matiere}"></div>
                </div>
                <div class="mat-moyenne ${moyMat==0 ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}" style="display: flex; justify-content: flex-end; width: 80px; padding-right: 20px; font-size: 20px">${moyMat==0 ? " - " : moyMat}/20</div>
            </div>
            `;
            return html;
        }




        renderAllUnclassifiedMatCard(sem, matieres) {
            let html = ``;

            matieres.forEach(matiere => {
                const notes = (this.semestres[sem]||{})[matiere]||[];
                const moyenne = this.moyennePonderee(notes);
                this.gradesDatas[sem]["unclassified"].average = moyenne;
                this.gradesDatas[sem]["unclassified"].matieres[matiere] = {grades: []};
                html += this.renderUnclassifiedMatCard(sem, matiere);
            })
            return html
        }
        // MARK: renderUnclassifiedMatCard
        renderUnclassifiedMatCard(sem, matiere) {
            let html = ``;
            let totalCoef = 0;
            let totalClassAvg = 0;

            const notes = (this.semestres[sem]||{})[matiere]||[];
            const moyMat = this.moyennePonderee(notes);
            html +=`
            <div class="matiere-card unclassified ${moyMat >= 10 ? `good` : `bad`}" id="matiere-card-semester-${sem}-matiere-${matiere}" ${this.editMode ? `style="user-select: none;"` : ""} ${this.editMode ? `draggable="true"` : ""} data-subject="${matiere}" data-semester="${sem}">
                <div class="matiere-card-header unclassified  ${moyMat >= 10 ? `good` : `bad`}" style="${this.editMode ? "cursor: move; padding-left: 10px;" : "padding-left: 50px;"}" data-sem="${sem}" data-subject="${matiere}">
                    ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("unclassified-matiere-card", {type:"unclassified", targetId:`matiere-card-semester-${sem}-matiere-${matiere}`})}</div>` : ""}
                    <div style="width: 40%">
                        ${matiere}
                        <div style="font-size:12px;margin-top:4px;">${this.lang == "fr" ? "Moyenne" : "Average"}: <span class="mat-moyenne ${moyMat>=10 ? 'good' : 'bad'}" >${moyMat}/20</span></div>
                    </div>
                    <div class="notes-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding-left: 10px; font-size: 13px">
                        <div>
                            ${this.lang == "fr" ? `Coef Total de notes :` : `Total Grades Coef:`}
                        </div>
                        <div class="notes-table-matiere-total-coef-value" data-sem="${sem}" data-ue="unclassified" data-subject="${matiere}"></div>
                    </div>
                </div>

                <table class="notes-table ${moyMat >= 10 ? "good" : "bad"}" id="notes-table-${matiere}-semester${sem}">
                    <thead>
                        ${notes.length > 0 || this.editMode
                            ? `<tr style="/* border-bottom: 2px solid #d5d5d5; */">
                                <th class="notes-table-type" style="padding-left: 30px">
                                    ${this.lang == "fr" ? "Intitulé" : "Title"}
                                </th>
                                <th class="notes-table-note">
                                    ${this.lang == "fr" ? "Note" : "Grade"}
                                </th>
                                <th class="notes-table-coef">
                                    ${this.lang == "fr" ? "Coef" : "Coef"}
                                </th>
                                <th class="notes-table-classAvg">
                                    ${this.lang == "fr" ? "Moy. Classe" : "Class Avg"}
                                </th>
                                <th class="notes-table-date">
                                    ${this.lang == "fr" ? "Date" : "Date"}
                                </th>
                                <th class="notes-table-teacher">
                                    ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                </th>
                            </tr>`
                            : ``
                        }
                    </thead>
                    <tbody>
            `;
            notes.forEach((note, index) => {
                this.gradesDatas[sem]["unclassified"].matieres[matiere].grades.push(note);
                totalCoef += note.coef;
                totalClassAvg += note.classAvg;

                html += `
                        <tr class="note-row-unsorted-grades ${index == notes.length-1 ? `last` : ``}">
                            <td class="notes-table-type" style="width: 30%">${note.type}</td>
                            <td class="notes-table-note"><span class="note-value note-${this.getNoteColor(note.note)}">${note.note}/20</span></td>
                            <td class="notes-table-coef">${note.coef}%</td>
                            <td class="notes-table-classAvg">${note.classAvg}</td>
                            <td class="notes-table-date note-date">${note.date}</td>
                            <td class="notes-table-teacher" style="font-size:12px;color:#999;">${note.prof}</td>
                        </tr>
                `;
            });
            this.gradesDatas[sem]["unclassified"].matieres[matiere].average = moyMat;
            this.gradesDatas[sem]["unclassified"].matieres[matiere].totalCoef = totalCoef;
            this.gradesDatas[sem]["unclassified"].matieres[matiere].totalDisabledGrades = 0;

            html +=`</tbody></table></div>`;
            return html;
        }




        // MARK: -Set total coefs
        setNotesTableTotalCoef() {
            const good="#10b981", meh="#e98c00", bad="#e90000", unknown="#7a7a7a";

            document.querySelectorAll(".notes-table-matiere-total-coef-value").forEach(totalCoefDiv => {
                const sem = totalCoefDiv.dataset.sem;
                const ue = totalCoefDiv.dataset.ue;
                const subject = totalCoefDiv.dataset.subject;
                const totalCoef =           this.gradesDatas[sem][ue].matieres[subject].totalCoef;
                const nbDisabledGrades =    this.gradesDatas[sem][ue].matieres[subject].totalDisabledGrades;
                const nbSimGrades =         this.gradesDatas[sem][ue].matieres[subject].totalSimGrades;
                // const realGrades =          this.gradesDatas[sem][ue].matieres[subject].grades.map(grade => {if(!grade.__sim) return grade});
                // let totalRealGradesCoef = 0; realGrades.forEach(grade => {totalRealGradesCoef += grade.coef});
                // let enabledRealGrades = []; realGrades.filter(n => {if (n) {return this.gradeIsDisabled(n)} else {return false}});
                // let totalEnabledRealGradesCoef = 0; enabledRealGrades.forEach(grade => {totalRealGradesCoef += grade.coef});
                const simulatedGrades =     this.gradesDatas[sem][ue].matieres[subject].grades.map(grade => {if(grade.__sim) return grade});
                let enabledSimulatedGrades = [];
                if (nbSimGrades > 0) enabledSimulatedGrades = simulatedGrades.filter(n => {if (n) {return this.gradeIsDisabled(n)} else {return false}})
                let totalSimGradesCoef = 0; enabledSimulatedGrades.forEach(grade => {totalSimGradesCoef+=grade.coef});
                const nbEnabledSimGrades = enabledSimulatedGrades.length;
                
                this.gradesDatas[sem][ue].matieres[subject].simulatedGrades = simulatedGrades;
                this.gradesDatas[sem][ue].matieres[subject].enabledSimulatedGrades = enabledSimulatedGrades;
                this.gradesDatas[sem][ue].matieres[subject].totalSimGradesCoef = totalSimGradesCoef;

                
                let advice = this.lang == `fr` ? `Toutes tes notes sont là !` : `All your grades are out!`;
                let color = ` #10b981`;

                {
                    if (totalSimGradesCoef > 0 && totalCoef-totalSimGradesCoef == 100) {
                        advice = this.lang == `fr` ? `Toutes tes notes sont là, mais tu devrais désactiver tes notes simulées` : `All your grades are out, but you should disable your simulated grades`;
                        color = bad;
                    }
                    else if (totalCoef<100) {
                        if (nbDisabledGrades > 1) {
                            advice = this.lang == `fr` ? `${nbDisabledGrades} notes sont désactivées` : `${nbDisabledGrades} grades are disabled`;
                            color = meh;
                        }
                        else if (nbDisabledGrades > 0) {
                            advice = this.lang == `fr` 
                                ? `Une note est désactivée${simulatedGrades.length-nbEnabledSimGrades > 0 ? `, mais c'est une note simulée, toutes tes notes ne sont encore pas là !` : ``}` 
                                : `A grade is disabled${simulatedGrades.length-nbEnabledSimGrades > 0 ? `, but it's a simulated grade, all your grades aren't out yet!` : ``}`;
                            color = meh;
                        }
                        else if (totalCoef == 0) {
                            advice = this.lang == `fr` ? `Pas de notes pour l'instant` : `No grades yet`;
                            color = unknown;
                        }
                        else {
                            advice = this.lang == `fr` ? `Notes manquantes` : `Missing grades`;
                            color = bad;
                        }
                    }
                    else if (enabledSimulatedGrades.length > 0) {
                        if (totalSimGradesCoef < 100) {
                            advice = this.lang == `fr` 
                                ? `${totalSimGradesCoef}% de ta note est simulée, toutes tes vraies notes ne sont pas encore là !` 
                                : `${totalSimGradesCoef}% of your grade is simulated, all your actual grades aren't out yet!`
                            ;
                            color = bad;
                        }
                        else if (totalSimGradesCoef == 100) {
                            advice = this.lang == `fr` 
                                ? `100% de ta note est simulée, tes vraies notes ne sont pas encore là !` 
                                : `100% of your grade is simulated, your actual grades aren't out yet!`
                            ;
                            color = bad;

                        }
                        else if (totalSimGradesCoef > 100) {
                            advice = this.lang == `fr` 
                                ? `${totalSimGradesCoef}% de ta note est simulée... jsp ce que t'as fait, mais tu l'as mal fait, change moi ça...` 
                                : `${totalSimGradesCoef}% of your grade is simulated... idk what you've done, but do smthg, cuz you did it wrong...`
                            ;
                            color = bad;
                        }
                    }
                    else if (totalCoef>100) {
                        advice = this.lang == `fr` ? `Désactivez des notes, svp` : `Please disable some grades`;
                        color = bad;
                        
                    }
                }
                
                {
                    {/* 
                        Total Subjects Coef != 100                      -> BAD: Wrong Subjects coef setup
                        Total Grades Coef = 0                           -> UNKNOWN: no grades yet
                        nbSubjectsBelow100 > 0, nbSubjectsOver100 > 0     -> BAD: nbSubjectsBelow100 subjects are too low, nbSubjectsOver100 subjects are too high
                        nbSubjectsBelow100 > 0,                          -> BAD: nbSubjectsBelow100 subjects are too low
                        nbSubjectsOver100 > 0,                           -> BAD: nbSubjectsOver100 subjects are too high
                        Total Grades Coef = 100, nbSimGrades > 0        -> BAD: Right Grades coef, but it's counting at least one simulated grade: not all grades are out
                        Total Grades Coef > 100, nbSimGrades > 0        -> BAD: Too low sim grades coef setup, all grades aren't all out either
                        Total Grades Coef < 100, nbSimGrades > 0        -> BAD: Too high sim grades coef setup
                    
                    */}
                    /* 
                    if (totalCoef == 100 && nbEnabledSimGrades > 0) {
                        advice = this.lang == `fr` 
                            ? `Tu as ${nbEnabledSimGrades} note${nbEnabledSimGrades>1?"s":""} simulée${nbEnabledSimGrades>1?"s":""} activée${nbEnabledSimGrades>1?"s":""}! Toutes tes notes ne sont pas encore là!` 
                            : `You have ${nbEnabledSimGrades} simulated grade${nbEnabledSimGrades>1?"s":""} enabled! All your grades aren't out yet!`;
                        color = meh;
                    }
                    else if (totalCoef == 0) {
                        advice = this.lang == `fr` ? `Pas encore de notes` : `No grades yet`;
                        color = unknown;
                    }
                    else if (totalCoef != 100 && nbEnabledSimGrades > 0) {
                        advice = this.lang == `fr` 
                            ? `Tes notes simulées faussent le total. Ajuste-les` 
                            : `Your simulated grades falsify the total. Adjust them`;
                        color = bad;
                    } */
                }
                totalCoefDiv.innerHTML = `<span style="color:${color}; font-weight: 900">${totalCoef}%</span>${advice}`;
            })
            document.querySelectorAll(".ue-card").forEach(ueCard => {
                ueCard.querySelectorAll(".ue-matiere-total-coef-value").forEach(totalCoefDiv => {
                    const sem = totalCoefDiv.dataset.sem;
                    const ue = totalCoefDiv.dataset.ue;
                    const nbSubjects = Object.keys(this.gradesDatas[sem][ue].matieres).length;
                    let totalCoefSubjects = 0, 
                        totalCoefGrades = 0, 
                        disabledGrades = [], 
                        simulatedGrades = [], 
                        enabledSimulatedGrades = [], 
                        totalSimGradesCoef = 0, 
                        subjectsBelow100=[], 
                        subjectsOver100=[]
                    ;

                    Object.keys(this.gradesDatas[sem][ue].matieres).forEach(subjectName => {
                        const subject = this.gradesDatas[sem][ue].matieres[subjectName];
                        totalCoefSubjects += subject.coef;
                        totalCoefGrades += subject.totalCoef*subject.coef/100;
                        subject.grades.forEach(n => {if (!this.gradeIsDisabled(n)) {disabledGrades.push(n);}})
                        subject.simulatedGrades.forEach(simGrade => {simulatedGrades.push(simGrade)})
                        subject.enabledSimulatedGrades.forEach(enabledSimGrade => {enabledSimulatedGrades.push(enabledSimGrade)});
                        totalSimGradesCoef += subject.totalSimGradesCoef;
                        if (subject.totalCoef < 100) subjectsBelow100.push(subject);
                        else if (subject.totalCoef > 100) subjectsOver100.push(subject);
                    })
                    const nbSubjectsBelow100 = subjectsBelow100.length, 
                        nbSubjectsOver100 = subjectsOver100.length, 
                        nbDisabledGrades = disabledGrades.length, 
                        nbEnabledSimGrades = enabledSimulatedGrades.length, 
                        nbSimGrades = simulatedGrades.length
                    ;

                    totalCoefGrades = Math.round(totalCoefGrades*100)/100;


                    let advice = this.lang == `fr` ? `Toutes tes notes sont là !` : `All your grades are out!`;
                    let color = good;

                    {

                        if (totalCoefSubjects == 100 && totalCoefGrades == 100 && nbEnabledSimGrades > 0) {
                            advice = this.lang == `fr` 
                                ? `Tu as ${nbEnabledSimGrades} note${nbEnabledSimGrades>1?"s":""} simulée${nbEnabledSimGrades>1?"s":""} activée${nbEnabledSimGrades>1?"s":""}! Toutes tes notes ne sont pas encore là!` 
                                : `You have ${nbEnabledSimGrades} simulated grade${nbEnabledSimGrades>1?"s":""} enabled! All your grades aren't out yet!`;
                            color = meh;
                        }
                        else if (totalCoefSubjects != 100) {
                            advice = this.lang == `fr` ? `Réajuste le coef des matières` : `Re-adjust the subjects' coef`;
                            color = bad;
                        }
                        else if (totalCoefGrades == 0) {
                            advice = this.lang == `fr` ? `Pas encore de notes` : `No grades yet`;
                            color = unknown;
                        }
                        else if ((nbSubjectsBelow100 > 0 || nbSubjectsOver100 > 0) && nbEnabledSimGrades > 0) {
                            advice = this.lang == `fr` 
                                ? `Tes notes simulées faussent le total. Ajuste-les` 
                                : `Your simulated grades falsify the total. Adjust them`;
                            color = bad;
                        }
                        else if (nbSubjectsBelow100 > 0 && nbSubjectsOver100 > 0) {
                            advice = this.lang == `fr` 
                                ? `Notes manquantes dans ${  nbSubjectsBelow100 > 1 ? nbSubjectsBelow100 : `une`} matière${nbSubjectsBelow100 > 1 ?  `s` : ``}, 
                                    et trop de notes dans ${ nbSubjectsOver100  > 1 ? nbSubjectsOver100  : `une`} matière${nbSubjectsOver100  > 1 ?  `s` : ``}` 
                                : `Missing grades in ${      nbSubjectsBelow100 > 1 ? nbSubjectsBelow100 : `a`  } subject${nbSubjectsBelow100 > 1 ? `'s` : ``}, 
                                    and too many grades in ${nbSubjectsOver100  > 1 ? nbSubjectsOver100  : `a`  } subject${nbSubjectsOver100  > 1 ? `'s` : ``}`;
                            color = bad;
                        }
                        else if (nbSubjectsBelow100 > 0) {
                            advice = this.lang == `fr` 
                                ? `Notes manquantes dans ${nbSubjectsBelow100 > 1 ? nbSubjectsBelow100 : `${nbSubjectsBelow100==nbSubjects ? "toutes tes" : "une"}`} matière${nbSubjectsBelow100 > 1 ? `s`  : ``}` 
                                : `Missing grades in ${    nbSubjectsBelow100 > 1 ? nbSubjectsBelow100 : `${nbSubjectsBelow100==nbSubjects ? "all your" : "a"    }`} subject${nbSubjectsBelow100 > 1 ? `'s` : ``}`;
                            color = bad;
                        }
                        else if (nbSubjectsOver100 > 0) {
                            advice = this.lang == `fr` 
                                ? `Trop de notes dans ${nbSubjectsOver100 > 1 ? nbSubjectsOver100 : `${nbSubjectsOver100==nbSubjects ? "toutes tes" : "une"}`} matière${nbSubjectsOver100 > 1 ? `s`  : ``}` 
                                : `Too many grades in ${nbSubjectsOver100 > 1 ? nbSubjectsOver100 : `${nbSubjectsOver100==nbSubjects ? "all your" : "a"    }`} subject${nbSubjectsOver100 > 1 ? `'s` : ``}`;
                            color = bad;
                        }
                    }

                    totalCoefDiv.innerHTML = `<span style="color:${color}; font-weight: 900">${totalCoefGrades}% / ${totalCoefSubjects}%</span>${advice}`;
                })
            })
        }




        attachCheckboxListeners(container) {
            // Reusable method to attach listeners to note checkboxes
            container.querySelectorAll('.note-checkbox').forEach(chbx => {
                chbx.onclick = (e) => {
                    const semX = e.target.dataset.sem;
                    const mat = e.target.dataset.mat;
                    const gradeID = e.target.dataset.gradeid;
                    const key = [semX, mat, gradeID].join("\\");
                    if (e.target.checked) {
                        // remove this specific ignored key if present
                        this.ignoredGrades = (this.ignoredGrades || []).filter(id => id !== key);
                    } else {
                        // add ignored key if not already present
                        this.ignoredGrades = this.ignoredGrades || [];
                        if (!this.ignoredGrades.includes(key)) this.ignoredGrades.push(key);
                    }
                    this.saveignoredGrades();
                    this.renderContent(false);
                }
            });
        }

        clearIgnoredGradesForUE(sem, ueName) {
            // Clear ignored grades only for the specified UE
            const ueConfig = this.ueConfig[sem] || {};
            const ueData = ueConfig[ueName];
            const allMats = this.getAllMatieresForUE(sem, ueData, ueName);

            // Keep ignored grades that are NOT part of this UE
            this.ignoredGrades = (this.ignoredGrades || []).filter(ignoredId => {
                const parts = ignoredId.split("\\");
                const semX = parts[0];
                const mat = parts[1];
                return semX !== sem || !allMats.includes(mat);
            });
            this.saveignoredGrades();
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
                document.querySelector(".new-grades-card").scrollIntoView({block: "center"})
            };

        }

        calculateUENotes(sem, ueData, ueName){
            const notes = [];
            const allMats = this.getAllMatieresForUE(sem, ueData, ueName);
            allMats.forEach(matiere=>{
                const pct = ueData.pourcentages[matiere] || 0;
                const realNotes = (this.semestres[sem]&&this.semestres[sem][matiere]) ? this.semestres[sem][matiere] : [];
                const simNotes  = this.getSimNotes(sem, ueName, matiere).map(n=>({ ...n, __sim:true }));

                const src = [...realNotes, ...simNotes];
                src.forEach(n=>{
                    notes.push({
                        ...n,
                        coef: n.coef,
                        coefInUE: (n.coef||0) * (pct/100),
                        matiere
                    });
                });
            });
            return notes;
        }

        getUnclassifiedMatieres(sem) {
            const classified = new Set();
            const ueConfig = this.ueConfig[sem] || {};
            Object.values(ueConfig).forEach(ue => { (ue.matieres||[]).forEach(m => classified.add(m)); });
            return Object.keys(this.semestres[sem]||{}).filter(m => !classified.has(m));
        }

        getUEStats() {
            let validated = 0, total = 0;
            Object.keys(this.ueConfig).forEach(sem => {
                Object.keys(this.ueConfig[sem]).forEach(ueName => {
                    const ueNotes = this.calculateUENotes(sem, this.ueConfig[sem][ueName], ueName);
                    const moyenne = this.moyennePonderee(ueNotes);
                    if (moyenne != 0 && ueNotes.length > 0) total++; if (moyenne >= 10) validated++;
                });
            });
            return { validated, total };
        }



        // MARK:-EVENT LISTENERS
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
            /* document.body.onresize = (e) => {   // NOTE FOR THE FUTURE: DONT RE-RENDER THE CONTENT ON RESIZE, IT MESSES UP WITH THE SELECTED MATIERE CARDS
                
                if (document.body.clientWidth <= 1530) {
                    if (this.clientWidth > 1530) {
                        this.clientWidth = 1530;
                        document.querySelectorAll(".ue-matiere-total-coef-value").forEach(ueTotalCoef => {
                            ueTotalCoef.style.flexDirection = "column"; ueTotalCoef.style.gap = "2px";
                        })
                    }
                }
                else
                {
                    if (this.clientWidth <= 1470) {
                        this.clientWidth = 1920;
                        document.querySelectorAll(".ue-matiere-total-coef-value").forEach(ueTotalCoef => {
                            ueTotalCoef.style.flexDirection = ""; ueTotalCoef.style.gap = "15px";
                        })
                    }
                }

                if (document.body.clientWidth <= 1470) {
                    if (this.clientWidth > 1470) {
                        this.clientWidth = 1470;
                    }
                    // this.getCSSClassCoordInStyleSheet(".note-simulee-input")
                    // this.getCSSClassCoordInStyleSheet(".note-simulee-input.sim-inp-type")
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
                        // document.querySelectorAll(".notes-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                        // this.getCSSClassCoordInStyleSheet(".notes-table-teacher").style.display = "none";
                    }
                }
                else
                {
                    if (this.mobileVer == true) {
                        this.clientWidth = 1470;
                        this.mobileVer = false;
                        this.renderContent(false)
                        // this.getCSSClassCoordInStyleSheet(".notes-table-teacher").style.display = "table-cell";
                    }
                }
            }; 
            */

            document.onclick = (e) => {
                // Toggle semestres
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
            };
            
                // Collapse/Develop (fold/unfold) UEs
            document.onmousedown = (e) => {
                if (e.target.closest('.ue-header') && !e.target.closest('.ue-title.input') && !e.target.closest('.ue-delete-btn')) {
                    this.ueHeaderClickEvent(e)
                }
            };

            this.dragElement(document.getElementById("main-average-card"));
            // this.dragElement(document.querySelector(".new-grades-card"));


            document.querySelectorAll(".any-input").forEach(input => {
                input.onfocus = () =>       {document.onkeydown = null; document.onkeyup = null}
                input.onblur = () =>        {this.generalKeyboardEvents()};
                input.onmouseenter = () =>  {this.detachOnDragEventListeners();};
                input.onmouseleave = () =>  {this.attachOnDragEventListeners();};
                input.ondrop = (e) =>       {e.preventDefault()};
            })
            

            document.querySelector(".new-grades-notif").onclick = () => {
                document.querySelector(".new-grades-card").scrollIntoView({block: "center"})
            };
            document.getElementById("closeNewGradesNotif").onmousedown = () => {    // otherwise, clicking the close button of the notif card also clicks on the card itself (behind the button)
                document.querySelector(".new-grades-notif").onclick = () => {};
            };
            document.getElementById("closeNewGradesNotif").onclick = () => {
                document.querySelector(".new-grades-notif").classList.remove("on");
            };
            document.querySelector(".new-grades-mark-as-read").onclick = () => {
                this.newGrades = [];
                this.savedReadGrades = [];
                this.notes.forEach(e => {this.savedReadGrades.push(e)})
                localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES", JSON.stringify(this.savedReadGrades))

                if (document.querySelector(".new-grades-card").children.length > 1) {document.querySelector(".new-grades-card").children[1].remove()}
                document.querySelector(".new-grades-card-title").innerHTML = this.lang == "fr" ? `Pas de nouvelle note` : `No new grade`;
                document.querySelector(".new-grades-mark-as-read").parentElement.disabled = true;
                document.querySelector(".new-grades-mark-as-read").parentElement.hidden = true;
                document.querySelector(".new-grades-notif").classList.remove("on");

                this.renderRecentGrades()
                this.attachEventListeners()
            };
            document.querySelectorAll(".new-grades-matiere-card").forEach(card => {   // Scroll to the corresponding subject/grade on which the user clicked
                card.onclick = e => {
                    this.currentSemester = e.target.dataset.semestre;
                    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                    document.getElementById('filter-tab-semester-'+this.currentSemester).classList.add('active');
                    this.renderContent(false);
                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_SEMESTER", this.currentSemester);

                    const targetElem = document.getElementById(`mat-card-semester-${e.target.dataset.semestre}-matiere-${e.target.dataset.subject}`);
                    targetElem.scrollIntoView({block: "center"});
                    targetElem.onscrollend = ((elem) => {
                        elem.classList.add("scroll-to");
                        elem.onanimationend = () => {targetElem.classList.remove("scroll-to")}
                    })(targetElem);
                    
                }
            });

            
            // Filtres semestre
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

            document.querySelectorAll('.matiere-coef-input-box').forEach(inputBox => {
                inputBox.onchange = e => {
                    const sem = e.target.dataset.semestre;
                    const ueName = e.target.dataset.ue;
                    const matiere = e.target.dataset.subject;
                    const newCoef = e.target.value;
                    this.ueConfig[sem][ueName].pourcentages[matiere] = newCoef;
                    this.gradesDatas[sem][ueName].matieres[matiere].coef = newCoef;
                    this.saveConfig();
                    this.renderContent(false);
                    this.attachEventListeners();
                };
            })

            
            // const dropAreaAdd = document.querySelector(".drop-matiere-card-to-create-eu");
            // const dropAreaRemove = document.querySelector(".drop-matiere-card-to-remove-from-eu");
            // const ueInsertAreas = document.querySelectorAll(".ue-insert-area");
            
            document.querySelectorAll(".drag-icon").forEach(dragIcon => {
                dragIcon.onclick = (e) => {
                    this.dragIconOnClickEvent(e, dragIcon)
                };
            });
            document.querySelectorAll(".tick-icon").forEach(tick => {
                tick.onclick = (e) => {
                    this.tickIconOnClickEvent(e, tick)
                };
            });


            document.querySelectorAll(".add-a-matiere-card").forEach(addDiv => {
                addDiv.onmouseenter = (e) => {
                    addDiv.querySelector(".add-a-matiere-card-plus.left").style.transform =  "rotate(-90deg)";
                    addDiv.querySelector(".add-a-matiere-card-plus.right").style.transform = "rotate(90deg)";
                }
                addDiv.onmouseleave = (e) => {
                    addDiv.querySelector(".add-a-matiere-card-plus.left").style.transform =  "";
                    addDiv.querySelector(".add-a-matiere-card-plus.right").style.transform = "";
                }
                addDiv.onclick = (e) => {
                    e.preventDefault();
                    const addDivClicked = e.target.closest(".add-a-matiere-card");
                    const sem = addDivClicked.dataset.sem;
                    const ue =  addDivClicked.dataset.ue;
                    const ueCard = document.getElementById(`ue-card-${ue}-in-semester-${sem}`);
                    const ueContent = ueCard.querySelector(".ue-details");

                    let newMatName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} 1`; let count = 1;
                    while (this.gradesDatas[sem][ue].matieres[newMatName]) {
                        count++; newMatName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} ${count}`;
                    }

                    this.ueConfig   [sem][ue].matieres.push(newMatName);
                    this.ueConfig   [sem][ue].pourcentages [newMatName] = 0;
                    this.ueConfig   [sem][ue].custom       [newMatName] = true;
                    this.gradesDatas[sem][ue].matieres     [newMatName] = {grades: [], custom: true};

                    const ueData = this.ueConfig[sem][ue];
                    if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                        ueContent.innerHTML = this.renderAllMatCardDetailed(ueData, sem, ue);
                    }
                    else {
                        ueContent.innerHTML = this.renderAllMatCardCompact(ueData, sem, ue);
                    }

                    this.attachEventListeners()
                    this.setNotesTableTotalCoef();
                    this.saveConfig()
                }
            })


            document.querySelectorAll(".matiere-name.input").forEach(input => {
                input.onmouseover = (e) => {e.preventDefault()};
                input.onchange = (e) => {
                    const newMatName = e.target.value;
                    const matCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                    const ueContent = matCard.parentElement;
                    const sem = matCard.dataset.semester;
                    const ue = matCard.dataset.ue;
                    const oldMat = matCard.dataset.subject;
                    let diffName = true;
                    this.ueConfig[sem][ue].matieres.forEach(_mat => {if (_mat == newMatName) diffName = false});
                        
                    const oldMatIndex = this.ueConfig[sem][ue].matieres.indexOf(oldMat);
                    this.ueConfig[sem][ue].matieres.splice(oldMatIndex, 1);
                    const pct = this.ueConfig[sem][ue].pourcentages[oldMat];
                    const isCustom = this.ueConfig[sem][ue].custom[oldMat];
                    const matDatas = this.gradesDatas[sem][ue].matieres[oldMat];

                    delete this.ueConfig[sem][ue].pourcentages[oldMat];
                    delete this.ueConfig[sem][ue].custom[oldMat];
                    delete this.gradesDatas[sem][ue].matieres[oldMat];
                    
                    if (diffName) {
                        this.ueConfig   [sem][ue].matieres.push(newMatName);
                        this.ueConfig   [sem][ue].pourcentages [newMatName] = pct;
                        this.ueConfig   [sem][ue].custom       [newMatName] = false;
                        this.gradesDatas[sem][ue].matieres     [newMatName] = matDatas;
                    }
                    
                    const ueData = this.ueConfig[sem][ue];
                    if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                        ueContent.innerHTML = this.renderAllMatCardDetailed(ueData, sem, ue);
                    }
                    else {
                        ueContent.innerHTML = this.renderAllMatCardCompact(ueData, sem, ue);
                    }

                    this.attachEventListeners()
                    this.setNotesTableTotalCoef();
                    this.saveConfig()
                }
            })

            document.querySelector(".modules-content").querySelectorAll(".ue-delete-btn").forEach(btn => {
                btn.onclick = e => {
                    const sem = e.target.dataset.semester;
                    const ueName = e.target.dataset.ue;
                    
                    const ueIndex = this.ueConfig[sem].__ues__.indexOf(ueName);

                    this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                    delete this.ueConfig[sem][ueName];

                    if (this.ueConfig[sem] == {}) {delete this.ueConfig[sem]}

                    this.saveConfig()
                    this.renderContent()
                    this.attachEventListeners();
                }
            })

            

            // Attach on-click event action for the simulated grade addition button
            document.querySelectorAll('.sim-add-btn').forEach(btn=>{
                btn.onclick = (e)=>{
                    const ueName = e.target.dataset.uen;
                    const semX = e.target.dataset.sem;
                    const mat = e.target.dataset.mat;
                    this.ensureSimPath(semX, ueName, mat);
                    const id = this.sim[semX][ueName][mat].length;
                    const typeInp = document.querySelector(`.note-simulee-input.sim-inp-type[data-sem="${semX}"][data-mat="${mat}"]`);
                    const noteInp = document.querySelector(`.note-simulee-input.sim-inp-note[data-sem="${semX}"][data-mat="${mat}"]`);
                    const coefInp = document.querySelector(`.note-simulee-input.sim-inp-coef[data-sem="${semX}"][data-mat="${mat}"]`);
                    const dateInp = document.querySelector(`.note-simulee-input.sim-inp-date[data-sem="${semX}"][data-mat="${mat}"]`);
                    const type = typeInp?.value||'';
                    const note = parseFloat(noteInp?.value||'');
                    const coef = parseFloat(coefInp?.value||'');
                    const date = dateInp?.value||'';
                    if(isNaN(note) || isNaN(coef)){ alert(this.lang == "fr" ? "Note et coef requis" : "Grade and coef required"); return; }
                    this.ensureSimPath(semX, ueName, mat);
                    this.sim[semX][ueName][mat].push({
                        note, 
                        coef,
                        type: type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`,
                        date: date||new Date().toLocaleDateString(),
                        prof: '—',
                        matiere: mat,
                        semestre: semX,
                        libelle: `[SIM] ${mat} - ${type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`}`,
                        __sim: true,
                        id
                    });
                    this.saveSim();
                    this.renderContent();
                }
            });

            // Attach on-change event action for simulated grades type/grade/coef/date fields
            document.querySelectorAll(".note-simulee-input-edit").forEach(input => {
                input.onchange = e => {
                    const ueName = e.target.dataset.uen;
                    const semX = e.target.dataset.sem;
                    const mat = e.target.dataset.mat;
                    const id = e.target.dataset.id;
                    let noteRow = e.target.parentElement.parentElement;
                    // const typeInp = document.querySelector(`.note-simulee-input-edit.sim-inp-type[data-sem="${semX}"][data-mat="${mat}"]`);
                    const typeInp = noteRow.querySelector(`.note-simulee-input-edit.sim-inp-type`)
                    const noteInp = noteRow.querySelector(`.note-simulee-input-edit.sim-inp-note`);
                    const coefInp = noteRow.querySelector(`.note-simulee-input-edit.sim-inp-coef`);
                    const dateInp = noteRow.querySelector(`.note-simulee-input-edit.sim-inp-date`);
                    const type = typeInp?.value||'';
                    const newNote = parseFloat(noteInp?.value||'');
                    const newCoef = parseFloat(coefInp?.value||'');
                    const date = dateInp?.value||'';
                    if(isNaN(newNote) || isNaN(newCoef)){ alert(this.lang == "fr" ? "Note et coef requis" : "Grade and coef required"); return; }
                    this.sim[semX][ueName][mat].forEach((note, index) => {
                        if (note.id == id) {
                            this.sim[semX][ueName][mat][index] = {
                                note: newNote, 
                                coef: newCoef,
                                type: type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`,
                                date: date||new Date().toLocaleDateString(),
                                prof: '—',
                                matiere: mat,
                                semestre: semX,
                                libelle: `[SIM] ${mat} - ${type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`}`,
                                __sim: true,
                                id
                            }
                        }
                    });

                    this.saveSim();
                    this.renderContent(false);
                }
            })

            // Attach on-click event action for the simulated grades' deletion button
            document.querySelectorAll('.sim-del-btn').forEach(btn=>{
                btn.onclick = (e) => {
                    const semX = e.target.dataset.sem;
                    const ueName = e.target.dataset.uen;
                    const mat = e.target.dataset.mat;
                    const type = e.target.dataset.type;
                    this.sim[semX][ueName][mat].splice(this.sim[semX][ueName][mat].indexOf(type), 1);
                    this.deleteUnusedSimPath(semX, ueName, mat);
                    this.saveSim();
                    this.renderContent(true);
                }
            })

            
            document.querySelector(".unclassified-content").querySelectorAll(".notes-table").forEach(table => {
                table.onmouseenter = () => {
                    if (this.editMode) document.querySelectorAll(".matiere-card.unclassified").forEach(card => {card.draggable = false;})
                }
                table.onmouseleave = () => {
                    if (this.editMode) document.querySelectorAll(".matiere-card.unclassified").forEach(card => {card.draggable = true;})
                }
            })


            // Change UEs name
            document.querySelectorAll(".ue-title.input").forEach(input => {
                input.onmouseenter = () => {document.querySelectorAll(".ue-header").forEach(card => {card.draggable = false})}
                input.onmouseleave = () => {document.querySelectorAll(".ue-header").forEach(card => {card.draggable = true;})}
                input.onchange = (e) => this.ueTitleInputChangeAction(e);
            });

            // Change to English
            document.getElementById('en-lang-btn').onclick = () => {
                if (this.lang == "fr") {
                    this.lang = "en";
                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                    document.getElementById('fr-lang-btn').classList.remove('active')
                    document.getElementById('en-lang-btn').classList.add('active')
                    this.languageSensitiveContent();
                }
            };

            // Change to French
            document.getElementById('fr-lang-btn').onclick = () => {
                if (this.lang == "en") {
                    this.lang = "fr";
                    localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                    document.getElementById('fr-lang-btn').classList.add('active')
                    document.getElementById('en-lang-btn').classList.remove('active')
                    this.languageSensitiveContent();
                }
            };

            // Import
            document.getElementById('importBtn').onclick = () => this.importData();

            // Edit mode
            document.getElementById('editModeBtn').onclick = () => {
                this.editMode = !this.editMode;
                this.renderContent();
                this.attachEventListeners();
            };

            // Export
            document.getElementById('exportBtn').onclick = () => this.exportData();

            if (this.editMode) {this.attachOnDragEventListeners();} else {this.detachOnDragEventListeners();}

        }

        notifDelBtnAttachListeners() {
            document.querySelectorAll(".selected-matiere-card-notif-div-del-btn").forEach(delBtn => {
                notifDelBtnAttachListener(delBtn);
            })
        }

        notifDelBtnAttachListener(delBtn) {
            delBtn.onclick = (e) => {
                const notifDiv = e.target.parentElement;
                this.removeSelectedCardNotifDiv(notifDiv);
            };
        }
        

        ueHeaderClickEvent(e) {
            document.body.onmousemove = (e) => {
                e.preventDefault();
                document.body.onmouseup = null;
                this.attachEventListeners();
            };
            document.body.onmouseup = (e) => {
                const header = e.target.closest('.ue-header');
                const toggle = header.querySelector('.ue-toggle');
                const sem = header.dataset.semester;
                const ueName = header.dataset.ue;
                const ueContent = header.parentElement.querySelector(".ue-details");
                const ueConfig = this.ueConfig[sem] || {};
                const ueData = ueConfig[ueName];

                if (toggle.classList.contains('open')) {
                    ueContent.innerHTML = this.renderAllMatCardCompact(ueData, sem, ueName);
                    ueContent.classList.add('compact');
                    toggle.classList.remove('open');
                    this.setNotesTableTotalCoef()
                } else {
                    ueContent.innerHTML = this.renderAllMatCardDetailed(ueData, sem, ueName);
                    ueContent.classList.remove('compact');
                    toggle.classList.add('open');
                    this.attachCheckboxListeners(ueContent);
                    this.setNotesTableTotalCoef()
                }
            }
        }
        
        ueTitleInputChangeAction(e) {
            const sem = e.target.dataset.semester;
            const oldUeName = e.target.dataset.ue; 
            const oldUeIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);
            const newUeName = e.target.value;
            // const regExpExec = RegExp(`${oldUeName}`, "ig").exec(JSON.stringify(this.ueConfig[sem])); 
            // this.ueConfig[sem] = JSON.parse('{"'+e.target.value+ regExpExec.input.slice(regExpExec.index+regExpExec[0].length,regExpExec.input.length));
            this.ueConfig[sem][newUeName] = this.ueConfig[sem][oldUeName];
            delete this.ueConfig[sem][oldUeName];
            this.ueConfig[sem].__ues__[oldUeIndex] = newUeName;

            this.saveConfig()
            this.renderContent(false)
        }


        // MARK: -Drag events
        attachOnDragEventListeners() {   // ONDRAG cards event
            const dropAreaAdd = document.querySelector(".drop-matiere-card-to-create-eu");
            const dropAreaRemove = document.querySelector(".drop-matiere-card-to-remove-from-eu");
            const ueInsertAreas = document.querySelectorAll(".ue-insert-area");
            document.querySelectorAll(".matiere-card").forEach(matiereCard => {
                let draggedElement = ``;
                const isUnclassified = matiereCard.classList.contains("unclassified");
                if (matiereCard.classList.contains("unclassified") || matiereCard.classList.contains("compact")) {draggedElement = matiereCard;}
                else {draggedElement = matiereCard.querySelector(".matiere-card-header");}

                draggedElement.draggable = true;
                draggedElement.ondragstart = (e) => {
                    if (e.target.classList.contains("any-input")) {return};
                    matiereCard.style.width = "50%";

                    if (isUnclassified) {
                        matiereCard.querySelector(".notes-table").style.display = "none";
                        matiereCard.querySelector(".matiere-card-header").style.border = "none";
                        matiereCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 20px 20px";
                    } 
                    else if (matiereCard.classList.contains("compact")) {
                        matiereCard.querySelector(".notes-table-coef").style.display = "none";
                    }
                    else {
                        matiereCard.querySelector(".matiere-card-header").children[0].style.width =                         "50%";
                        matiereCard.querySelector(".matiere-card-header").querySelector(".notes-table-coef").style.width =  "50%";
                        matiereCard.querySelector(".notes-table").style.display = "none";
                        matiereCard.querySelector(".matiere-card-header").style.borderBottom = "none";
                        matiereCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 20px 20px";
                    }
                    document.querySelectorAll(".notes-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                    document.querySelector(".semester-content").style.gap = "20px";
                    dropAreaAdd.classList.add("show");
                    dropAreaRemove.classList.add("show");
                    this.selectedMatiereCards = [];
                    e.dataTransfer.setData("text", isUnclassified ? draggedElement.id : matiereCard.id)
                };
                draggedElement.ondragend = (e) => {
                    matiereCard.style.width = "100%";

                    if (matiereCard.classList.contains("unclassified")) {
                        matiereCard.querySelector(".notes-table").style.display = "table";
                        matiereCard.querySelector(".matiere-card-header").style.border = "none";
                        matiereCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                    else if (matiereCard.classList.contains("compact")) {
                        matiereCard.querySelector(".notes-table-coef").style.display = "flex";
                    }
                    else {
                        matiereCard.querySelector(".matiere-card-header").children[0].style.width =                         "42%";
                        matiereCard.querySelector(".matiere-card-header").querySelector(".notes-table-coef").style.width =  "58%";
                        matiereCard.querySelector(".notes-table").style.display = "table";
                        matiereCard.querySelector(".matiere-card-header").style.borderBottom = "4px solid white";
                        matiereCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                    
                    if (this.selectedMatiereCards.length == 0) {
                        setTimeout(() => {document.querySelectorAll(".notes-table-teacher").forEach(teacher => {teacher.style.display = "table-cell"})}, 100)
                        document.querySelector(".semester-content").style.gap = "0px";
                        dropAreaAdd.classList.remove("show");
                        dropAreaRemove.classList.remove("show");
                        this.emptyMatCardSelection();
                    }
                };

            })
            if (this.selectedMatiereCards.length > 0) { 
                this.selectedMatiereCards.forEach(selectedMatiereCard => {
                    let draggedElement = "";
                    const isUnclassified = selectedMatiereCard.classList.contains("unclassified");
                    if (isUnclassified || selectedMatiereCard.classList.contains("compact")) {draggedElement = selectedMatiereCard;}
                    else {draggedElement = selectedMatiereCard.querySelector(".matiere-card-header");}
                    
                    draggedElement.draggable = true;
                    draggedElement.ondragstart = (e) => {
                        this.selectedMatiereCards.forEach(selectedMatiereCard2 => {
                            selectedMatiereCard2.style.width = "50%";

                            if (selectedMatiereCard2.classList.contains("unclassified")) {
                                setTimeout(() => {selectedMatiereCard2.querySelector(".notes-table").style.display = "none";}, 10)
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.border = "none";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderRadius = "20px";
                            
                            } 
                            else if (selectedMatiereCard2.classList.contains("compact")) {
                                selectedMatiereCard2.querySelector(".notes-table-coef").style.display = "none";
                            }
                            else {
                                selectedMatiereCard2.querySelector(".matiere-card-header").children[0].style.width =                         "50%";
                                selectedMatiereCard2.querySelector(".matiere-card-header").querySelector(".notes-table-coef").style.width =  "50%";
                                setTimeout(() => {selectedMatiereCard2.querySelector(".notes-table").style.display = "none";}, 10)
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderBottom = "none";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderRadius = "20px";
                            }
                        })
                        document.querySelectorAll(".notes-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                        document.querySelector(".semester-content").style.gap = "20px";
                        dropAreaAdd.classList.add("show");
                        dropAreaRemove.classList.add("show");

                        e.dataTransfer.setData("text", isUnclassified ? draggedElement.id : selectedMatiereCard.id)
                    }
                    draggedElement.ondragend = (e) => {
                        this.selectedMatiereCards.forEach(selectedMatiereCard2 => {
                            selectedMatiereCard2.style.width = "100%";

                            if (selectedMatiereCard2.classList.contains("unclassified")) {
                                selectedMatiereCard2.querySelector(".notes-table").style.display = "table";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.border = "none";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                            
                            } 
                            else if (selectedMatiereCard2.classList.contains("compact")) {
                                selectedMatiereCard2.querySelector(".notes-table-coef").style.display = "flex";
                            }
                            else {
                                selectedMatiereCard2.querySelector(".matiere-card-header").children[0].style.width =                         "42%";
                                selectedMatiereCard2.querySelector(".matiere-card-header").querySelector(".notes-table-coef").style.width =  "58%";
                                selectedMatiereCard2.querySelector(".notes-table").style.display = "table";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderBottom = "4px solid white";
                                selectedMatiereCard2.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                            }
                        })
                    }
                })
            }

            dropAreaAdd.style.background = "";
            dropAreaAdd.ondragover = (e) => {
                e.preventDefault();
                e.target.style.background = "#bdb8ff";
            }
            dropAreaAdd.ondragleave = (e) => {
                e.preventDefault();
                e.target.style.background = "";
            }
            dropAreaAdd.ondrop = (e) => {
                e.target.style.background = "";
                e.preventDefault(); 
                this.dropAreaAddAction(e.dataTransfer.getData("text"));
            }

            dropAreaRemove.style.background = "";
            dropAreaRemove.ondragover = (e) => {
                e.preventDefault();
                e.target.style.background = "#ffb8b8";
            }
            dropAreaRemove.ondragleave = (e) => {
                e.preventDefault();
                e.target.style.background = "";
            }
            dropAreaRemove.ondrop = (e) => {
                e.target.style.background = "";
                e.preventDefault(); 
                this.dropAreaRemoveAction(e.dataTransfer.getData("text"));
            }

            ueInsertAreas.forEach(ueInsertArea => {
                ueInsertArea.style.background = "";
                ueInsertArea.ondragover = (e) => {
                    e.preventDefault();
                    e.target.style.background = "#bdb8ff";
                }
                ueInsertArea.ondragleave = (e) => {
                    e.preventDefault();
                    e.target.style.background = "";
                }
                ueInsertArea.ondrop = (e) => {
                    e.target.style.background = "";
                    e.preventDefault(); 
                    this.dropAreaInsertAction(e.dataTransfer.getData("text"));
                }
            })
        }
        detachOnDragEventListeners() {   // ONDRAG cards event
            document.querySelectorAll(".matiere-card").forEach(matiereCard => {
                let draggedElement = ``;
                if (matiereCard.classList.contains("unclassified") || matiereCard.classList.contains("compact")) {draggedElement = matiereCard;}
                else {draggedElement = matiereCard.querySelector(".matiere-card-header");}

                draggedElement.draggable = false;
                draggedElement.ondragstart = (e) => null;
                draggedElement.ondragend = (e) => null;

            })
            if (this.selectedMatiereCards.length > 0) { 
                this.selectedMatiereCards.forEach(selectedMatiereCard => {
                    let draggedElement = "";
                    if (selectedMatiereCard.classList.contains("unclassified") || selectedMatiereCard.classList.contains("compact")) {draggedElement = selectedMatiereCard;}
                    else {draggedElement = selectedMatiereCard.querySelector(".matiere-card-header");}
                    
                    draggedElement.draggable = false;
                    draggedElement.ondragstart = (e) => null;
                    draggedElement.ondragend = (e) => null;
                })
            }
        }

        // MARK: addSelectedCardNotifDiv
        addSelectedCardNotifDiv(semester, subject, type, targetId="none") {
            const selectionNotifDiv = document.createElement("div");
            selectionNotifDiv.className = `selected-matiere-card-notif-div`;
            selectionNotifDiv.id = `selected-matiere-card-notif-div-for-${type}-${subject}-from-semester-${semester}`;
            selectionNotifDiv.dataset.type = type;
            selectionNotifDiv.dataset.subject = subject;
            selectionNotifDiv.dataset.semester = semester;
            selectionNotifDiv.dataset.targetid = targetId;
            selectionNotifDiv.innerHTML = `
                <span style="font-size: 20px; height: 20px; user-select: none">${">"}</span>
                <span style="font-weight: 600; font-size: 14px; color: white">${subject}</span>
                ${this.lang == "fr" ? `est sélectionné!` : `is selected!`}
                <div class="selected-matiere-card-notif-div-del-btn" id="selected-matiere-card-notif-div-del-btn-for-${type}-${subject}-from-semester-${semester}" data-targetId="${targetId}">x</div>
            `;

            return selectionNotifDiv;
        }


        // MARK: removeSelectedCardNotifDiv
        removeSelectedCardNotifDiv(notifDiv="all") {
            if (notifDiv=="all") {
                document.querySelectorAll(".selected-matiere-card-notif-div").forEach(notifDiv => {
                    const matCard = document.getElementById(notifDiv.dataset.targetid);
                    notifDiv.classList.remove("on");
                    const notifDivId = notifDiv.id;
                    setTimeout(() => {document.getElementById(notifDivId).remove()})

                    this.selectedMatiereCards.forEach((selectedMatiereCard, index) => {
                        if (selectedMatiereCard == matCard) 
                            this.selectedMatiereCards.splice(index, 1)
                        }
                    )
            
                    if (this.selectedMatiereCards.length == 0) {
                        this.emptyMatCardSelection();
                    }
                    else {
                        const tick = matCard.querySelector(".tick-icon");
                        tick.outerHTML = this.draggableIcon(`${notifDiv.dataset.type}-matiere-card`, {targetId: `${notifDiv.dataset.targetid}`, type: notifDiv.dataset.type});
                        const dragIcon = matCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};
                    }
                })
            }
            else {
                const matCard = document.getElementById(notifDiv.dataset.targetid);

                notifDiv.classList.remove("on");
                setTimeout(()=>{
                    notifDiv.remove();
                    let highestWidth = 0;
                    const notifDivContainer = document.querySelector(".selected-matiere-card-notif-container");
                    notifDivContainer.querySelectorAll(".selected-matiere-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                    notifDivContainer.style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;
                }, 300)

                this.selectedMatiereCards.forEach((selectedMatiereCard, index) => {
                    if (selectedMatiereCard == matCard) 
                        this.selectedMatiereCards.splice(index, 1)
                    }
                )
            
                if (this.selectedMatiereCards.length == 0) {
                    this.emptyMatCardSelection();
                }
                else {
                    const tick = matCard.querySelector(".tick-icon");
                    tick.outerHTML = this.draggableIcon(`${notifDiv.dataset.type}-matiere-card`, {targetId: `${notifDiv.dataset.targetid}`, type: notifDiv.dataset.type});
                    const dragIcon = matCard.querySelector(".drag-icon");
                    dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};
                }
            }
        }


        // MARK: dragIconOnClickEvent
        dragIconOnClickEvent(e, dragIcon) {
            let matiereCard =  e.target.parentElement.parentElement.parentElement;
            const dropAreaAdd = document.querySelector(".drop-matiere-card-to-create-eu");
            const dropAreaRemove = document.querySelector(".drop-matiere-card-to-remove-from-eu");
            const type = dragIcon.dataset.type;
            if (type=="detailed") {
                matiereCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
            }

            let matiereCardIsAlreadySelected = false;
            this.selectedMatiereCards.forEach(selectedMatiereCard => {if (selectedMatiereCard == matiereCard) matiereCardIsAlreadySelected = true;})
            if (!matiereCardIsAlreadySelected) {this.selectedMatiereCards.push(matiereCard)}

            document.querySelectorAll(".notes-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
            document.querySelectorAll(".ue-title.input").forEach(input => {
                input.parentElement.style.transition = "width 0.3s ease";
                input.parentElement.style.width = "30%";
            })
            document.querySelectorAll(".ue-matiere-total-coef-value").forEach(totalCoef => {
                totalCoef.parentElement.style.transition = "width 0.3s ease";
                totalCoef.parentElement.style.width = "56%";
            })
            document.querySelector(".semester-content").style.gap = "20px";
            dropAreaAdd.classList.add("show");
            dropAreaRemove.classList.add("show");

            dragIcon.outerHTML = `<div class="tick-icon for-${type}-matiere-card" data-type="${type}">✔</div>`;
            const tick = matiereCard.querySelector(".tick-icon");
            tick.dataset.targetid = matiereCard.id;
            tick.onclick = (e) => {this.tickIconOnClickEvent(e, tick)};

            const selectionNotifDiv = this.addSelectedCardNotifDiv(matiereCard.dataset.semester, matiereCard.dataset.subject, type, matiereCard.id);

            let highestWidth = 0;
            document.querySelector(".selected-matiere-card-notif-container").appendChild(selectionNotifDiv);
            this.notifDelBtnAttachListener(selectionNotifDiv.querySelector(".selected-matiere-card-notif-div-del-btn"));
            document.querySelectorAll(".selected-matiere-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
            document.querySelector(".selected-matiere-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

            setTimeout(()=>{selectionNotifDiv.classList.add("on")}, 10)
        }


        // MARK: tickIconOnClickEvent
        tickIconOnClickEvent(e, tick) {
            e.preventDefault();
            const type = e.target.dataset.type;
            let matiereCard = e.target.parentElement.parentElement.parentElement;
            if (type=="detailed") {matiereCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement}
            
            const sem = matiereCard.dataset.semester;
            const subject = matiereCard.dataset.subject;
            const notifDiv = document.getElementById(`selected-matiere-card-notif-div-for-${type}-${subject}-from-semester-${sem}`);
            this.removeSelectedCardNotifDiv(notifDiv);
        }


        // MARK: emptyMatCardSelection
        emptyMatCardSelection() {            
            setTimeout(() => {document.querySelectorAll(".notes-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
            setTimeout(() => {document.querySelectorAll(".notes-table-classAvg").forEach(classAvg => {classAvg.style.display = "table-cell"})}, 100)
            document.querySelector(".semester-content").style.gap = "0px";
            document.querySelector(".drop-matiere-card-to-create-eu").classList.remove("show");
            document.querySelector(".drop-matiere-card-to-remove-from-eu").classList.remove("show");
            document.querySelectorAll(".ue-title.input").forEach(input => {
                input.parentElement.style.transition = "";
                input.parentElement.style.width = "42%";
            })
            document.querySelectorAll(".ue-matiere-total-coef-value").forEach(totalCoef => {
                totalCoef.parentElement.style.transition = "";
                totalCoef.parentElement.style.width = "47%";
            })

            if (this.selectedMatiereCards.length > 0) {
                this.selectedMatiereCards.forEach(selectedMatCard => {
                    selectedMatCard.style.width = "100%";

                    if (selectedMatCard.classList.contains("unclassified")) {
                        selectedMatCard.querySelector(".notes-table").style.display = "table";
                        selectedMatCard.querySelector(".matiere-card-header").style.border = "none";
                        selectedMatCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                    else if (selectedMatCard.classList.contains("compact")) {
                        selectedMatCard.querySelector(".notes-table-coef").style.display = "flex";
                    }
                    else {
                        selectedMatCard.querySelector(".matiere-card-header").children[0].style.width = "42%";
                        selectedMatCard.querySelector(".matiere-card-header").querySelector(".notes-table-coef").style.width =  "58%";
                        selectedMatCard.querySelector(".notes-table").style.display = "table";
                        selectedMatCard.querySelector(".matiere-card-header").style.borderBottom = "4px solid white";
                        selectedMatCard.querySelector(".matiere-card-header").style.borderRadius = "20px 20px 0px 0px";
                    }
                })

                this.removeSelectedCardNotifDiv();
            }

            this.selectedMatiereCards = [];
        }


        // MARK: dropAreaInsertAction
        dropAreaInsertAction(cardId, index=-1) {
            const card = document.getElementById(cardId);
            let cardIsSelected = false;
            this.selectedMatiereCards.forEach(selectedMatiereCard => {if (selectedMatiereCard.id == card.id) cardIsSelected = true;})
            const sem = card.dataset.semester;
            let subject, oldUeName, manageSim = true;
            if (!this.ueConfig[sem]) this.ueConfig[sem] = {}; if (!this.sim[sem]) manageSim = false;
            let newUeName = "Module 1"; let count = 1;
            while (this.ueConfig[sem][newUeName]) {count++; newUeName = `Module ${count}`;}

            // Mat card is dropped in the drop area Add
            /* // Adding a [newUeName] property to this.ueConfig as its first property, so that any new module appears first in the module section
            this.ueConfig[sem] = {[newUeName]: {matieres: [], pourcentages: {}, custom: {}}, ...this.ueConfig[sem]}; */
            this.ueConfig[sem][newUeName] = {matieres: [], pourcentages: {}, custom: {}};

            if (!cardIsSelected) {
                subject = card.dataset.subject;
                if (!card.classList.contains("unclassified")) {
                    // removing the mat card if it was in an ue

                    oldUeName = card.dataset.ue;
                    const subjectIndex = this.ueConfig[sem][oldUeName].matieres.indexOf(subject);
                    this.ueConfig[sem][oldUeName].matieres.splice(subjectIndex,1);
                    delete this.ueConfig[sem][oldUeName].pourcentages[subject];
                    if (manageSim) {if (!this.sim[sem][oldUeName]) manageSim = false;}
                    if (manageSim) {
                        this.sim[sem] = {[newUeName]: {}, ...this.sim[sem]}
                        this.sim[sem][newUeName][subject] = [];
                        this.sim[sem][oldUeName][subject].forEach((_, index) => {
                            this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                        })
                    }
                    this.deleteUnusedSimPath(sem, oldUeName, subject);
                    this.saveSim();
                }

                this.ueConfig[sem].__ues__.splice(index, 0, newUeName);
                this.ueConfig[sem][newUeName].matieres.splice(index, 0, subject);
                this.ueConfig[sem][newUeName].pourcentages[subject] = 0;
                this.ueConfig[sem][newUeName].custom[subject] = false;
            }
            else
            {
                let remainingCoef = 100;
                const nbCurrSubjects = this.ueConfig[sem][newUeName].matieres.length;
                const nbNewSubjects = this.selectedMatiereCards.length;

                this.selectedMatiereCards.forEach((selectedMatiereCard, index) => {
                    subject = selectedMatiereCard.dataset.subject;

                    if (nbCurrSubjects > 0) {
                        this.ueConfig[sem][newUeName].matieres.forEach(_mat => {
                            this.ueConfig[sem][newUeName].pourcentages[subject]
                        })
                    }

                    this.ueConfig[sem][newUeName].matieres.push(subject);
                    this.ueConfig[sem][newUeName].pourcentages[subject] = Math.round(100/this.selectedMatiereCards.length);
                    this.ueConfig[sem][newUeName].custom[subject] = false;

                    if (this.selectedMatiereCards.length == index+1) {
                        this.ueConfig[sem][newUeName].pourcentages[subject] = remainingCoef;
                    }
                    remainingCoef -= this.ueConfig[sem][newUeName].pourcentages[subject];

                    if (!selectedMatiereCard.classList.contains("unclassified")) {
                        oldUeName = selectedMatiereCard.dataset.ue
                        subject = selectedMatiereCard.dataset.subject
                        const subjectIndex = this.ueConfig[sem][oldUeName].matieres.indexOf(subject);
                        this.ueConfig[sem][oldUeName].matieres.splice(subjectIndex,1);
                        delete this.ueConfig[sem][oldUeName].pourcentages[subject];
                        if (manageSim) {if (!this.sim[sem][oldUeName][subject]) manageSim = false}
                        if (manageSim) {
                            this.sim[sem][newUeName][subject] = [];
                            this.sim[sem][oldUeName][subject].forEach((_, index) => {
                                this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                            })
                            this.deleteUnusedSimPath(sem, oldUeName, subject);
                            this.saveSim();
                        }
                    }
                })
            }
            
            this.emptyMatCardSelection();
                
        }


        // MARK: dropAreaAddAction
        dropAreaAddAction(cardId) {
            const card = document.getElementById(cardId);
            if (card.classList.contains('matiere-card')) {
                let cardIsSelected = false;
                this.selectedMatiereCards.forEach(selectedMatiereCard => {if (selectedMatiereCard.id == card.id) cardIsSelected = true;})
                const sem = card.dataset.semester;
                let subject, oldUeName, manageSim = true;
                if (!this.ueConfig[sem]) this.ueConfig[sem] = {}; if (!this.sim[sem]) manageSim = false;
                let newUeName = "Module 1"; let count = 1;
                while (this.ueConfig[sem][newUeName]) {count++; newUeName = `Module ${count}`;}

                // Mat card is dropped in the drop area Add
                /* // Adding a [newUeName] property to this.ueConfig as its first property, so that any new module appears first in the module section
                this.ueConfig[sem] = {[newUeName]: {matieres: [], pourcentages: {}, custom: {}}, ...this.ueConfig[sem]}; */
                this.ueConfig[sem][newUeName] = {matieres: [], pourcentages: {}, custom: {}};
                this.ueConfig[sem].__ues__.unshift(newUeName);
                
                if (!cardIsSelected) {
                    subject = card.dataset.subject;
                    this.ueConfig[sem][newUeName].matieres.push(subject);
                    this.ueConfig[sem][newUeName].pourcentages[subject] = 100;
                    this.ueConfig[sem][newUeName].custom[subject] = false;

                    if (!card.classList.contains("unclassified")) {
                        oldUeName = card.dataset.ue;
                        subject = card.dataset.subject;
                        const ueIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);
                        const subjectIndex = this.ueConfig[sem][oldUeName].matieres.indexOf(subject);
                                this.ueConfig[sem][oldUeName].matieres.splice(subjectIndex,1);
                        delete  this.ueConfig[sem][oldUeName].pourcentages[subject];
                        delete  this.ueConfig[sem][oldUeName].custom[subject];

                        if (this.ueConfig[sem][oldUeName].matieres.length == 0) {
                            this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                            delete this.ueConfig[sem][oldUeName];
                        }
                        
                        if (manageSim) {if (!this.sim[sem][oldUeName]) manageSim = false;}
                        if (manageSim) {
                            this.sim[sem] = {[newUeName]: {}, ...this.sim[sem]}
                            this.sim[sem][newUeName][subject] = [];
                            this.sim[sem][oldUeName][subject].forEach((_, index) => {
                                this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                            })
                            this.deleteUnusedSimPath(sem, oldUeName, subject);
                            this.saveSim();
                        }
                    }
                }
                else
                {
                    let remainingCoef = 100;
                    this.selectedMatiereCards.forEach((selectedMatiereCard, index) => {
                        subject = selectedMatiereCard.dataset.subject;

                        this.ueConfig[sem][newUeName].matieres.push(subject);
                        this.ueConfig[sem][newUeName].pourcentages[subject] = Math.round(100/this.selectedMatiereCards.length);
                        this.ueConfig[sem][newUeName].custom[subject] = false;

                        if (this.selectedMatiereCards.length == index+1) {
                            this.ueConfig[sem][newUeName].pourcentages[subject] = remainingCoef;
                        }
                        remainingCoef -= this.ueConfig[sem][newUeName].pourcentages[subject];

                        if (!selectedMatiereCard.classList.contains("unclassified")) {
                            oldUeName = selectedMatiereCard.dataset.ue
                            subject = selectedMatiereCard.dataset.subject
                            const ueIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);
                            const subjectIndex = this.ueConfig[sem][oldUeName].matieres.indexOf(subject);
                                    this.ueConfig[sem][oldUeName].matieres.splice(subjectIndex,1);
                            delete  this.ueConfig[sem][oldUeName].pourcentages[subject];
                            delete  this.ueConfig[sem][oldUeName].custom[subject];

                            if (this.ueConfig[sem][oldUeName].matieres.length == 0) {
                                this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                delete this.ueConfig[sem][oldUeName];
                            }

                            if (manageSim) {if (!this.sim[sem][oldUeName][subject]) manageSim = false}
                            if (manageSim) {
                                this.sim[sem][newUeName][subject] = [];
                                this.sim[sem][oldUeName][subject].forEach((_, index) => {
                                    this.sim[sem][newUeName][subject].push(this.sim[sem][oldUeName][subject][index].shift())
                                })
                                this.deleteUnusedSimPath(sem, oldUeName, subject);
                                this.saveSim();
                            }
                        }
                    })
                }

                this.emptyMatCardSelection();
                this.saveConfig();
                this.renderContent();
                this.attachEventListeners();
                // document.getElementById(`ue-card-${newUeName}-in-semester-${sem}`).scrollIntoView();
                this.scrollToClientHighestElemWithClassWithTimeout({id: `ue-card-${newUeName}-in-semester-${sem}`})
                
            }
        }


        // MARK: dropAreaRemoveAction
        dropAreaRemoveAction(cardId) {
            const card = document.getElementById(cardId);

            if (card.classList.contains("matiere-card") && !card.classList.contains("unclassified"))
            {
                let cardIsSelected = false;
                this.selectedMatiereCards.forEach(selectedMatiereCard => {if (selectedMatiereCard.id == card.id) cardIsSelected = true;})
                const sem = card.dataset.semester;
                const ue = card.dataset.ue;
                const mat = card.dataset.subject;

                if (!cardIsSelected) {

                    const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                    const subjectIndex = this.ueConfig[sem][ue].matieres.indexOf(mat);
                            this.ueConfig[sem][ue].matieres.splice(subjectIndex,1);
                    delete  this.ueConfig[sem][ue].pourcentages[mat];
                    delete  this.ueConfig[sem][ue].custom[mat];

                    if (this.ueConfig[sem][ue].matieres.length == 0) {
                        this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                        delete this.ueConfig[sem][ue];
                    }
                }
                else
                {
                    let subject = "";
                    this.selectedMatiereCards.forEach(selectedMatiereCard => {
                        subject = selectedMatiereCard.dataset.subject;
                        const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                        const subjectIndex = this.ueConfig[sem][ue].matieres.indexOf(subject);
                                this.ueConfig[sem][ue].matieres.splice(subjectIndex,1);
                        delete  this.ueConfig[sem][ue].pourcentages[subject];
                        delete  this.ueConfig[sem][ue].custom[subject];

                        if (this.ueConfig[sem][ue].matieres.length == 0) {
                            this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                            delete this.ueConfig[sem][ue];
                        }
                    })
                }

                if (this.ueConfig[sem].__ues__.length == 0) {delete this.ueConfig[sem]}

                this.emptyMatCardSelection();
                this.saveConfig();
                this.renderContent();
                this.attachEventListeners();
            }
            else if (card.classList.contains("unclassified")) {
                this.emptyMatCardSelection();
            }
            else if (card.classList.contains("ue-card")) {}

        }


        // MARK: dragElement
        dragElement(elmnt) {

            Element.prototype.leftTopScreen = function (parentId) {
                var x = this.offsetLeft;
                var y = this.offsetTop;

                var element = this;
                if (element.localName === "html") {return new Array (x, y)}

                while (element.localName !== "body" && element.localName !== "html") {
                    if (element.id == parentId) {
                        element = document.body;
                    }
                    else
                    {
                        x = parseInt (x) + parseInt (element.offsetLeft);
                        y = parseInt (y) + parseInt (element.offsetTop);

                        element = element.offsetParent;
                    }
                }

                return new Array (x, y);
            }
            
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
                /* if present, the header is where you move the DIV from:*/
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            } else {
                /* otherwise, move the DIV from anywhere inside the DIV:*/
                elmnt.onmousedown = (e) => {dragMouseDown(e, elmnt)};
            }

            function dragMouseDown(e, elmnt) {
                let leftTopScreen = e.target.leftTopScreen("main-average-card");
                e = e || window.event;
                e.preventDefault();
                elmnt.style.position = "fixed";
                elmnt.style.zIndex = "100";
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                // elmnt.style.top =  (elmnt.offsetTop  - pos2) + "px";
                elmnt.style.left = (leftTopScreen[0] + e.offsetX) + "px";
                elmnt.style.top  = (leftTopScreen[1] + e.offsetY) + "px";
                
                document.getElementById("currentNote").onmouseup = (e) => {closeDragElement(e, elmnt)};
                // call a function whenever the cursor moves:
                document.getElementById("currentNote").onmousemove = elementDrag;
                
            }

            function elementDrag(e, elmt) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                elmnt.style.top =  (elmnt.offsetTop  - pos2) + "px";
            }

            function closeDragElement(e, elmt) {
                /* stop moving when mouse button is released:*/
                document.getElementById("currentNote").onmouseup = null;
                document.getElementById("currentNote").onmousemove = null;
                elmnt.style.position = "static";
                elmnt.style.zIndex = "";
            }
        }
        


        // MARK: -Data Import/Export
        importData(file) {
            return new Promise((resolve, reject) => {
                const handleText = (text) => {
                    try {
                        const parsed = JSON.parse(text);

                        // If parsed contains ueConfig, apply it to the dashboard and persist
                        if (parsed && parsed.ueConfig) {
                            try {
                                this.ueConfig = parsed.ueConfig || {};
                                localStorage.setItem('ECAM_DASHBOARD_UE_CONFIG', JSON.stringify(this.ueConfig));
                            } catch (e) {
                                // ignore storage errors
                            }
                        }

                        // If parsed contains semestres with simulated notes, apply them to this.sim
                        if (parsed && parsed.semestres) {
                            // Reset current sim and populate from file where available
                            const newSim = {};
                            Object.keys(parsed.semestres).forEach(sem => {
                                const semObj = parsed.semestres[sem] || {};
                                const uesObj = semObj.ues || {};
                                Object.keys(uesObj).forEach(ueName => {
                                    const simulees = uesObj[ueName].simulees || {};
                                    if (!newSim[sem]) newSim[sem] = {};
                                    newSim[sem][ueName] = simulees;
                                });
                            });
                            // merge with existing sim to preserve structure where file doesn't provide
                            this.sim = Object.assign({}, this.sim || {}, newSim);
                            try { localStorage.setItem('ECAM_DASHBOARD_SIM_NOTES', JSON.stringify(this.sim)); } catch (e) {}
                        }

                        // Re-render dashboard to reflect imported config
                        try { this.renderContent(); } catch (e) {}

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
                    // treat as raw JSON string
                    try { handleText(file); } catch (err) { reject(err); }
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
                date: new Date().toISOString(),
                ueConfig: this.ueConfig,
                semestres: {}
            };
            Object.keys(this.semestres).forEach(sem => {
                if (!data.semestres[sem]) data.semestres[sem] = { ues: {} };
                if (this.ueConfig[sem]) {
                    Object.keys(this.ueConfig[sem]).forEach(ue => {
                        // const ueNotes = this.calculateUENotes(sem, this.ueConfig[sem][ue], ue);
                        data.semestres[sem].ues[ue] = {
                            matieres: this.ueConfig[sem][ue].matieres,
                            pourcentages: this.ueConfig[sem][ue].pourcentages,
                            custom: this.ueConfig[sem][ue].custom,
                            simulees: (this.sim[sem]&&this.sim[sem][ue]) || {}
                        };
                    });
                }
            });
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ecam_notes_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }



        // MARK: -General KBoardEvents
        generalKeyboardEvents() {
            document.onkeydown = (e) => {
                if (e.key === "Shift") {
                    document.onkeydown = (e) => {
                        if (e.key === "E") {
                            this.editMode = !this.editMode;

                            this.emptyMatCardSelection();
                            this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.matiere-card.unclassified"});
                            this.renderContent();
                            this.attachEventListeners();
                        }
                        else if (e.key === "D") {
                            this.viewMode = this.viewMode == "detailed" ? "compact" : "detailed";
                            if (this.viewMode == "detailed") {
                                document.getElementById('view-btn-detailed').classList.add("active")
                                document.getElementById('view-btn-compact').classList.remove("active")
                            }
                            else
                            {
                                document.getElementById('view-btn-detailed').classList.remove("active")
                                document.getElementById('view-btn-compact').classList.add("active")
                            }                            
                            localStorage.setItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE", this.viewMode);

                            this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.matiere-card.unclassified"});
                            this.renderContent();                      
                        }
                        else if (e.key === "L") {
                            if (this.lang == "fr")
                            {
                                this.lang = "en";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.remove('active')
                                document.getElementById('en-lang-btn').classList.add('active')

                                this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.matiere-card.unclassified"});
                                this.languageSensitiveContent();
                            }
                            else if (this.lang == "en")
                            {
                                this.lang = "fr";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.add('active')
                                document.getElementById('en-lang-btn').classList.remove('active')

                                this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.matiere-card.unclassified"});
                                this.languageSensitiveContent();
                            }
                        }
                        else if (e.key === "R") {
                            console.warn("You fell into my breakpoint trap!!"); debugger;
                        }
                    };
                }
            };

            document.onkeyup = (e) => {
                if (e.key === "Shift") this.generalKeyboardEvents();
            };
        };
        
        scrollToClientHighestElemWithClassWithTimeout({className, id="", timeout=50, smooth=false, margin="35px"}) {
            this.scrollToThisElem = ""; let found = false;
            if (this.editMode) {margin = "107px"}

            if (id=="") {
                className.split("||").forEach(_className => {
                    document.querySelectorAll(`${_className}`).forEach(elem => {
                        const coords = elem.getBoundingClientRect();
                        const meanClientTop = (coords.top + coords.bottom)/2;
                        if ((meanClientTop > 0) && !found) {
                            this.scrollToThisElem = elem.id;
                            found = true;
                        }
                    })
                })

                if (found) {
                    setTimeout(() => {
                        const scrollToThisElem = document.getElementById(this.scrollToThisElem); 
                        scrollToThisElem.style.scrollMarginTop = margin;
                        scrollToThisElem.scrollIntoView({behavior: smooth ? "smooth" : "instant", block: "start"});
                    }, timeout)
                }
            }
            else
            {
                this.scrollToThisElem = id;
                
                setTimeout(() => {
                    const scrollToThisElem = document.getElementById(this.scrollToThisElem); 
                    scrollToThisElem.style.scrollMarginTop = margin;
                    scrollToThisElem.scrollIntoView({behavior: smooth ? "smooth" : "instant", block: "start"});
                }, timeout)
            }

        }

        draggableIcon(source="matiere-card", {height=25, type="unknown", targetId="none"}={height: 25, type: "unknown", targetId:"none"}) {
            return `<img class="drag-icon for-${source}" data-targetid="${targetId}" data-type="${type}" draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/960px-Hamburger_icon.svg.png" alt="☰" style="height:${height}px; ${source.match(/-matiere-card/ig) ? "border: 2px solid; border-radius: 8px;" : ""}">`
        }
    }

    if (ERROR503) {
        document.body.children[0].remove(); document.body.children[0].remove(); document.body.children[0].remove(); 
        new ECAMDashboard();
    }
    else
    {
        window.onload = () => { new ECAMDashboard(); };
    }
    
})();