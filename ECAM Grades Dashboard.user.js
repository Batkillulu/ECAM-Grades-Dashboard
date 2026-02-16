// ==UserScript==
// @name         ECAM Grades Dashboard
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @version      1.1.0
// @run-at       document-end
// @match        https://espace.ecam.fr/group/education/grades*
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
        .ecam-dash          { display: grid; flex-direction: column; justify-content:center; grid-template-columns: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; margin: 20px 1.5% 0px 1.5%; width: 97%; color: #1a1a1a; }
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

        .new-grades-card            { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px; width: 100%; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87; scroll-margin-top: 105px; transition: box-shadow 0.2s ease}
        .new-grades-card.myhighlight  { box-shadow: 0px 0px 20px 20px #322bff87; }
        .new-grades-card.none { border: 2px solid #446dff; background: #f7f9ffff; box-shadow: none; }
        .new-grades-card-title { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 5px; display:flex; align-items:center }
        .new-grades-content { display: flex; flex-direction: column; gap: 20px; }
        .new-grades-subject-card { display: flex; flex-direction: column; border: 2px solid #c1a7ffff; border-radius: 12px; }
        .new-grades-subject-card:hover { cursor:alias }
        .new-grades-subject-card-title { border: 2px solid #c1a7ffff; border-radius: 12px; margin: -2px -2px 5px -2px; font-size: 16px; font-weight: 600; background: #c1ceff; padding: 5px 0px 5px 10px; }
        .new-grades-table {  }
        .new-grades-table-grades {  }
        .new-grades-notif { display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 90%; height: 50px; cursor:pointer; position:fixed; left:5%; right:0px; top:-55px; z-index:299; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
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
        .semester-content.show          { display: flex; flex-direction: row; width: 100%; gap: 0px; transition: gap 0.2s ease, width 0.2s ease; }
        .semester-content.show.dragging { width: 70%; gap: 20px; }

        
        .modules-section                                { display: flex; flex-direction: column; gap: 20px; align-items: center; width: 100%; }

        
        .drop-subject-card                              { display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; mix-blend-mode: multiply; user-select: none; }
        .drop-subject-card.remove-from-ue               { position: fixed; top: 50px; left: 10px; height: calc(100% - 100px); width: 0%; border: 2px dashed #ff7f7f; border-color: #ff7f7f00; background: #ffb8b800; font-size: 50px; font-weight: 800; color: #ff7f7f00; z-index: 301; transition: all 0.2s ease; }
        .drop-subject-card.remove-from-ue.show          { width: 15%; border-width: 2px; border-color: #ff7f7f; color: #ff7f7f; background: #ffb8b83d; }
        .drop-subject-card.create-ue                    { position: fixed; top: 50px; right:10px; height: calc(100% - 100px); width: 0%; border: 2px dashed #7fc2ff; border-color: #7fc2ff00; background: #bdb8ff00; font-size: 50px; font-weight: 800; color: #7fc2ff00; z-index: 301; transition: all 0.2s ease; }
        .drop-subject-card.create-ue.show               { width: 15%; border-width: 2px; border-color: #7fc2ff; color: #7fc2ff; background: #bdb8ff3d; }
        .drop-subject-card.insert-to-new-ue             { height: 50px; width: 100%; color: #9b9b9bff; border: 2px dashed #9b9b9b; background: #bdb8ff3d; font-size: 25px; font-weight: 800; user-select: none; cursor: pointer; transition: all 0.2s ease; }
        .drop-subject-card.insert-to-new-ue:hover       { color: #887bffff; border-color: #7fc2ff; }
        .drop-subject-card.subj-insert-area             { height: 30px; width: 100%; color: #9b9b9bbd; border: 2px dashed #9b9b9b54; background: #bdb8ff1a; font-size: 25px; font-weight: 800; user-select: none; cursor: pointer; transition: all 0.2s ease; }
        .drop-subject-card.subj-insert-area:hover       { color: #887bffff; border-color: #7fc2ff; }
        .drop-subject-card-arrow                        { transform: translate(40%); font-size: 210px; display: flex; align-items: center; overflow: hidden; height: 100%; width: 100%; transition: transform 0.5s cubic-bezier(0, 1, 0.25, 1); }
        .drop-subject-card-arrow:hover                  { transform: translate(44.5%) }
        .drop-subject-card-arrow.hover                  { transform: translate(44.5%) }

        .ue-grid                { display: grid; width: 100%; gap: 20px; transition: gap 0.2s ease; }
        .ue-card                { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fafafa; border-radius: 25px; border: 3px solid #e5e5e5; scroll-margin-top: 70px; transition: all 0.3s ease; }
        .ue-card.validated      { border-color: #10b981; background: #f0fdf4; }
        .ue-card.failed         { border-color: #ef4444; background: #fef2f2; }
        .ue-card.unknown        { border-color: #6d6d6dff; background: #d1d1d1ff; }
        .ue-header              { display: flex; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 22px 22px 0px 0px; width: 100%; cursor: pointer; }
        .ue-header.validated    { border-color: #10b981; background: #e0ffeaff; }
        .ue-header.failed       { border-color: #ef4444; background: #ffd9d9ff; }
        .ue-header.unknown      { border-color: #6d6d6dff; background: #acacacff; }
        .ue-header:hover        { background: #f3f4f6; }
        .ue-delete-btn          { border-radius: 14px; background: transparent; }
        .ue-title                       { font-size: 16px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
        .ue-title.input                 { font-size: 16px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }
        .ue-subject-total-coef-value    { display: flex; gap: 15px; font-weight: 600; }
        .ue-details                     { display: flex; flex-direction: column; align-items: center; width: 98%; margin: 18px 0px; gap: 15px; }
        .ue-details.edit-mode           { gap: 5px; }
        .ue-moyenne                     { font-size: 24px; font-weight: 800; display: flex; align-items: center; gap:10px; width: 180px; }
        .ue-moyenne.good                { color: #10b981; }
        .ue-moyenne.bad                 { color: #ef4444; }
        .ue-moyenne.unknown             { color: #6d6d6dff; }
        .ue-toggle                      { width: 24px; height: 24px; font-size: 18px; color: #000000; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; margin-left: 5px; }
        .ue-toggle.open                 { transform: rotate(180deg); }
        .ue-info                        { display: flex; flex-direction: row; justify-content: space-around;  align-items: center; width:97%; background: #eef2ff; border:1px solid #c7d2fe; padding:6px 8px; border-radius:8px; }
        .ue-info.hasDisabledGrades      { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width:48%; padding:6px 8px; border-radius:8px; }
        .ue-info.hasSim                 { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width:48%; padding:6px 8px; border-radius:8px; }
        .ue-info-sim-clear              { display: flex; align-items: center; justify-content: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 172px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
        .ue-info-sim-clear:hover        { width: 180px; margin-right: 4px; font-size: 11.5px; background: #eef2ff; }
        .ue-info-disabled-clear         { display: flex; align-items: center; justify-content: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 172px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
        .ue-info-disabled-clear:hover   { width: 180px; margin-right: 4px; font-size: 11.5px; background: #eef2ff; }

        .add-a-subject-card         { display: flex; align-items: center; justify-content: space-between; gap: 8px; height: 38px; width: 320px; margin-bottom: 18px; border: 3px dashed #7fc2ff; border-radius: 20px; font-size: 19px; font-weight: 700; color: #7fc2ff; background: aliceblue; cursor: pointer; box-shadow: none; user-select:none; transition: all 0.2s ease }
        .add-a-subject-card:hover   { background: white; font-size: 20px; box-shadow: inset 0px 0px 17px 0px #0400ff38; }
        .add-a-subject-card-plus    { font-size: 40px; font-weight: 900; height: 20px; margin: 0px 8px; transition: transform 0.2s ease; }


        .unclassified-part                              { display: flex; flex-direction: row; gap: 0px; }
        .unclassified-section                           { display: flex; flex-direction: column; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; }
        .unclassified-content                           { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 99%; }
        .unclassified-title                             { font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

        .subject-card               { display: flex; flex-direction: column; align-items: center; border: 4px solid #ffffffff; border-radius: 20px; width: 100%; background: #c5c5c5; transition: width 0.3s ease, box-shadow 0.1s ease; }
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
        .subject-insert-area                        { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
        .subject-insert-area.show                   { height: 50px; margin: 10px 0px; }
        .grades-table-subject-total-coef-value      { display: flex; gap: 15px }
        .subj-moyenne        { font-size: 16px; font-weight: 800; }
        .subj-moyenne.good   { color: #10b981; }
        .subj-moyenne.bad    { color: #ef4444; }
        .selected-subject-card-notif-container          { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; left: calc(99% - 20%); z-index: 302; transition: width 0.3s ease; }
        .selected-subject-card-notif-div                { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
        .selected-subject-card-notif-div.on             { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
        .selected-subject-card-notif-div-del-btn        { color: #640000; font-size: 20px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
        .selected-subject-card-notif-div-del-btn:hover  { color: #ffffff; }

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
            this.grades = [];
            this.semesters = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};

            this.gradesDatas = {};
            this.ueConfig =         JSON.parse( localStorage.getItem("ECAM_DASHBOARD_UE_CONFIG")) || {};
            this.sim =              JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_gradeS")) || {};
            this.ignoredGrades =    JSON.parse( localStorage.getItem("ECAM_DASHBOARD_IGNORED_GRADES")) || [];

            this.savedReadGrades =  JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES")) || [] ;
            this.newGrades = [];

            this.defSem =                       localStorage.getItem("ECAM_DASHBOARD_DEFAULT_SEMESTER") || "all";
            this.currentSemester = this.defSem;

            this.defView =                      /* localStorage.getItem("ECAM_DASHBOARD_DEFAULT_VIEW_MODE") || */ "detailed";
            this.viewMode = this.defView;

            this.lang =                         localStorage.getItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE") || "en";
            this.tempSelection = {};
            this.draggedMatId = "";
            this.today = new Date().toISOString().split('T')[0];
            this.editMode = true;

            this.mobileVer = false;
            this.clientWidth = 1920;

            // this.ueHeaderNoMove = true;
            this.selectedSubjectCards = [];
            this.selectedSubjectCardsSortedByUe = {};
            this.scrollToThisElem = "";

            this.ERROR503 = document.title == '503 Service Unavailable' || document.title == 'ECAM Grades Dashboard - Transform Your Grade Experience';

            this.init();
        }

        //#region -Region: Misc methods

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
            saveSim() { localStorage.setItem("ECAM_DASHBOARD_SIM_gradeS", JSON.stringify(this.sim)); }
            saveIgnoredGrades() { localStorage.setItem("ECAM_DASHBOARD_IGNORED_GRADES", JSON.stringify(this.ignoredGrades)); }
            ensureSimPath(sem, ue, subj) {
                if(!this.sim[sem]) this.sim[sem]={};
                if(!this.sim[sem][ue]) this.sim[sem][ue]={};
                if(subj !== undefined && !this.sim[sem][ue][subj]) this.sim[sem][ue][subj]=[];
            }
            deleteUnusedSimPath(sem, ue, subj) {
                if (this.sim[sem]) {
                    if (this.sim[sem][ue]) {
                        if (this.sim[sem][ue][subj]) {
                            if (this.sim[sem][ue][subj].length == 0) {delete this.sim[sem][ue][subj]}
                        }
                        if (this.sim[sem][ue] == {}) {delete this.sim[sem][ue]}
                    }
                    if (this.sim[sem] == {}) {delete this.sim[sem]}
                }
            }
            getSimGrades(sem, ue, subj){ return (this.sim[sem]&&this.sim[sem][ue]&&this.sim[sem][ue][subj])||[]; }
            getAllSubjectsForUE(sem, ueName){
                const real = this.ueConfig?.[sem]?.[ueName]?.subjects || [];
                const simOnly = Object.keys(((this.sim[sem]||{})[ueName]||{}));
                return Array.from(new Set([...real, ...simOnly]));
            }
            calculateUEGrades(sem, ueName){
                const grades = [];
                const allMats = this.getAllSubjectsForUE(sem, ueName);
                allMats.forEach(subject=>{
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
            getGradeColor(grade) { if (grade >= 12) return 'good'; if (grade >= 10) return 'medium'; return 'bad'; }
            getAverageColor(avg) { if (avg >= 12) return 'average-good'; if (avg >= 10) return 'average-medium'; return 'average-bad'; }
            gradeIsDisabled(n) {
                return this.ignoredGrades.indexOf([n.semester, n.subject, n.type+" "+n.date+" "+n.prof].join("\\")) > -1
            }
            moyennePonderee(arr) {
                if (!arr || arr.length === 0) return 0;
                let total = 0, coeffs = 0;
                arr.forEach(n => { 
                    if (this.ignoredGrades.indexOf([n.semester, n.subject, n.type+" "+n.date+" "+n.prof].join("\\")) == -1) {
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
                const allMats = this.getAllSubjectsForUE(sem, ueName);

                // Keep ignored grades that are NOT part of this UE
                this.ignoredGrades = (this.ignoredGrades || []).filter(ignoredId => {
                    const parts = ignoredId.split("\\");
                    const semX = parts[0];
                    const subj = parts[1];
                    return semX !== sem || !allMats.includes(subj);
                });
                this.saveIgnoredGrades();
                this.getGradesDatas();
            }
            clearSimGradesForUE(sem, ueName) {
                delete this.sim[sem][ueName];
                if (this.sim[sem] == {}) delete this.sim[sem];
                this.saveSim()
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
                    newGradesCard.scrollIntoView();
                    newGradesCard.classList.add("myhighlight");
                    setTimeout(() => {newGradesCard.classList.remove("myhighlight")},200)
                };

            }
            draggableIcon(source="subject-card", {height=25, type="unknown", targetId="none"}={height: 25, type: "unknown", targetId:"none"}) {
                return `<img class="drag-icon for-${source}" data-targetid="${targetId}" data-type="${type}" draggable="false" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/960px-Hamburger_icon.svg.png" alt="☰" style="height:${height}px; ${source.match(/-subject-card/) ? "border: 2px solid; border-radius: 8px;" : ""}">`
            }
            // MARK: Scroll to element
            scrollToClientHighestElemWithClassWithTimeout({className, id="", timeout=50, smooth=false, margin=23}) {
                this.scrollToThisElem = ""; let found = false;
                if (this.editMode) {margin = 93}
                if (document.body.classList.contains("lfr-dockbar-pinned")) {margin += 45}

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
                            scrollToThisElem.style.scrollMarginTop = `${margin}px`;
                            scrollToThisElem.scrollIntoView({behavior: smooth ? "smooth" : "instant", block: "start"});
                        }, timeout)
                    }
                }
                else
                {
                    this.scrollToThisElem = id;
                    
                    setTimeout(() => {
                        const scrollToThisElem = document.getElementById(this.scrollToThisElem); 
                        scrollToThisElem.style.scrollMarginTop = `${margin}px`;
                        scrollToThisElem.scrollIntoView({behavior: smooth ? "smooth" : "instant", block: "start"});
                    }, timeout)
                }

            }
            // MARK: Set total coefs
            setGradesTableTotalCoef() {
                const good="#10b981", meh="#e98c00", bad="#e90000", unknown="#7a7a7a";

                document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoefDiv => {
                    const 
                        sem = totalCoefDiv.dataset.sem,
                        ue = totalCoefDiv.dataset.ue,
                        ueData = this.gradesDatas[sem][ue],
                        nbSubjects = Object.keys(ueData.subjects).length,
                        
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

                    /* 
                    {   // Conditions part

                        if (totalCoefSubjects == 100 && totalCoefEnabledGrades == 100 && nbEnabledSimGrades > 0) {
                            advice = this.lang == `fr` 
                                ? `Tu as ${nbEnabledSimGrades} note${nbEnabledSimGrades>1?"s":""} simulée${nbEnabledSimGrades>1?"s":""} activée${nbEnabledSimGrades>1?"s":""}! Toutes tes notes ne sont pas encore là!` 
                                : `You have ${nbEnabledSimGrades} simulated grade${nbEnabledSimGrades>1?"s":""} enabled! All your grades aren't out yet!`;
                            color = meh;
                        }
                        else if (totalCoefSubjects != 100) {
                            advice = this.lang == `fr` ? `Réajuste le coef des matières` : `Re-adjust the subjects' coef`;
                            color = bad;
                        }
                        else if (totalCoefEnabledGrades == 0 || totalCoefEnabledGrades == " - ") {
                            advice = this.lang == `fr` ? `Pas encore de notes` : `No grades yet`;
                            color = unknown;
                        }
                        else if ((nbSubjectsBelow100 > 0 || nbSubjectsOver100 > 0) && nbEnabledSimGrades > 0) {
                            advice = this.lang == `fr` 
                                ? `Tes grades simulées faussent le total. Ajuste-les` 
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
                        */

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
                        sem = totalCoefDiv.dataset.sem,
                        ue = totalCoefDiv.dataset.ue,
                        subject = totalCoefDiv.dataset.subject,
                        subjectData = this.gradesDatas[sem][ue].subjects[subject],

                        isCustom                    = subjectData.isCustom,
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

                    /* 
                    { // Conditions part
                        if (totalCoefEnabledSimGrades > 0 && totalCoefEnabledGrades == 100) {
                            advice = this.lang == `fr` ? `Toutes tes notes sont là, mais tu devrais désactiver tes notes simulées` : `All your grades are out, but you should disable your simulated grades`;
                            color = bad;
                        }
                        else if (totalCoefEnabledGrades<100) {
                            if (nbDisabledGrades > 1) {
                                advice = this.lang == `fr` ? `${nbDisabledGrades} notes sont désactivées` : `${nbDisabledGrades} grades are disabled`;
                                color = meh;
                            }
                            else if (nbDisabledGrades > 0) {
                                advice = this.lang == `fr` 
                                    ? `Une note est désactivée${nbSimGrades-nbEnabledSimGrades > 0 ? `, mais c'est une note simulée, toutes tes notes ne sont encore pas là !` : ``}` 
                                    : `A grade is disabled${nbSimGrades-nbEnabledSimGrades > 0 ? `, but it's a simulated grade, all your grades aren't out yet!` : ``}`;
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
                        else if (nbEnabledSimGrades > 0) {
                            if (totalCoefSimGrades < 100) {
                                advice = this.lang == `fr` 
                                    ? `${totalCoefSimGrades}% de ta grade est simulée, toutes tes vraies grades ne sont pas encore là !` 
                                    : `${totalCoefSimGrades}% of your grade is simulated, all your actual grades aren't out yet!`
                                ;
                                color = bad;
                            }
                            else if (totalCoefSimGrades == 100) {
                                advice = this.lang == `fr` 
                                    ? `100% de ta grade est simulée, tes vraies grades ne sont pas encore là !` 
                                    : `100% of your grade is simulated, your actual grades aren't out yet!`
                                ;
                                color = bad;
                            }
                            else if (totalCoefSimGrades > 100) {
                                advice = this.lang == `fr` 
                                    ? `${totalCoefSimGrades}% de ta grade est simulée... jsp ce que t'as fait, mais tu l'as mal fait, change ça...` 
                                    : `${totalCoefSimGrades}% of your grade is simulated... idk what you've done, but do smthg, cuz you did it wrong...`
                                ;
                                color = bad;
                            }
                        }
                        else if (totalCoef>100) {
                            advice = this.lang == `fr` ? `Désactivez des notes, svp` : `Please disable some grades`;
                            color = bad;
                            
                        }
                    }
                     */

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
                    else if (totalCoefRealGrades > 100) {
                        advice = this.lang == "fr" ? `Trop de notes (erreur du côté de l'ECAM), désactive les notes en trop !` : `Too many grades (error on ECAM's side), turn off all irrelevant grades!`;
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
                        unclassified: {subjects: {}}
                    };
                    let semData = this.gradesDatas[semX];

                    
                    // FOR EACH UNCLASSIFIED SUBJECT IN SEMESTER
                    const unclassified = this.getUnclassifiedSubjects(semX);
                    if (unclassified.length > 0) {
                        (subj && unclassified.includes(subj) ? [subj] : unclassified).forEach(unclassifiedSubjectName => {

                            semData["unclassified"].subjects[unclassifiedSubjectName] = {};

                            let unclassifiedSubjectData = semData["unclassified"].subjects[unclassifiedSubjectName];
                            
                            unclassifiedSubjectData.subjName                    = unclassifiedSubjectName;
                            unclassifiedSubjectData.grades                      = new Array(...(this.semesters[semX]||{})[unclassifiedSubjectName])||[];
                            unclassifiedSubjectData.disabledRealGrades          = [];
                            unclassifiedSubjectData.simGrades                   = [];
                            unclassifiedSubjectData.disabledSimGrades           = [];
                            unclassifiedSubjectData.average                     = 0;
                            unclassifiedSubjectData.classAvg                    = 0;
                            unclassifiedSubjectData.totalCoefGrades             = 0;
                            unclassifiedSubjectData.totalCoefRealGrades         = 0;
                            unclassifiedSubjectData.totalCoefSimGrades          = 0;
                            unclassifiedSubjectData.totalCoefEnabledGrades      = 0;
                            unclassifiedSubjectData.totalCoefEnabledRealGrades  = 0;
                            unclassifiedSubjectData.totalCoefEnabledSimGrades   = 0;



                            // FOR EACH GRADES IN UNCLASSIFIED SUBJECT
                            unclassifiedSubjectData.grades.forEach(grade => {
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

                                        unclassifiedSubjectData.disabledRealGrades.push(grade);                             // CHANGE THIS LATER (add checkboxes to unclassified grades)
                                    break;

                                    case `enabled sim grade`:                                                               // CHANGE THIS LATER (add sim grades for unclassified subjects)
                                        unclassifiedSubjectData.average                     += gradeValue*coef/100;
                                        unclassifiedSubjectData.simGrades.push(grade);
                                        unclassifiedSubjectData.totalCoefSimGrades          += coef;

                                        unclassifiedSubjectData.totalCoefEnabledGrades      += coef;
                                        unclassifiedSubjectData.totalCoefEnabledSimGrades   += coef;
                                    break;

                                    case `disabled sim grade`:
                                        unclassifiedSubjectData.simGrades.push(grade);
                                        unclassifiedSubjectData.totalCoefSimGrades          += coef;

                                        unclassifiedSubjectData.disabledSimGrades.push(grade);
                                    break;
                                }                                
                            })

                            
                            unclassifiedSubjectData.average                     = Math.round(100*unclassifiedSubjectData.average/(unclassifiedSubjectData.totalCoefGrades/100))/100;
                            unclassifiedSubjectData.classAvg                    = Math.round(100*unclassifiedSubjectData.classAvg/(unclassifiedSubjectData.totalCoefGrades/100))/100;
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
                            const allMats = this.getAllSubjectsForUE(semX, ueName);
                            const ueGrades = this.calculateUEGrades(semX, ueName);

                            semData[ueName] = {};
                            
                            let ueData = semData[ueName];
                            
                            ueData.ueName                       = ueName;
                            ueData.subjects                     = {};
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
                            });

                            

                            // FOR EACH SUBJECT IN UE
                            (subj && this.ueConfig?.[sem]?.[ue]?.subjects?.includes(subj) ? [subj] : allMats).forEach(subjectName => {

                                let subjectData = ueData.subjects[subjectName];

                                subjectData.subjName                    = subjectName;
                                subjectData.coef                        = this.ueConfig[semX][ueName].coefficients[subjectName];
                                subjectData.isCustom                    = this.ueConfig[semX][ueName].custom[subjectName];
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
                                    subjectData.average     =  Math.round(100*subjectData.average /(subjectData.totalCoefGrades/100))/100;
                                    subjectData.classAvg    =  Math.round(100*subjectData.classAvg/(subjectData.totalCoefGrades/100))/100;

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
                                ueData.average                      =  Math.round(100*ueData.average /((ueData.totalCoefSubjects-ueData.coefSubjectsNoGrade)/100))/100;
                                ueData.classAvg                     =  Math.round(100*ueData.classAvg/((ueData.totalCoefSubjects-ueData.coefSubjectsNoGrade)/100))/100;
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






        // MARK: -INIT
        init() {

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
            this.attachEventListeners();
            
        }




        //#region -Region: Render

            // MARK: -createDashboard
            createDashboard() {
                const container = document.createElement("div");
                container.className = "ecam-dash";
                const moyenneGenerale = this.moyennePonderee(this.grades);
                const totalGrades = this.grades.length;
                const ueStats = this.getUEStats();

                document.querySelector(".site-breadcrumbs").remove();
                document.querySelector(".portlet-topper").remove();

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
                
                <div class="main-average-card" id="main-average-card">
                    <div class="average-display">
                        <div class="average-number">${moyenneGenerale}</div>
                        <div class="average-label"></div>
                    </div>
                    <div class="average-stats">
                        <div class="stat-item"><div class="stat-value">${totalGrades                        }</div><div class="stat-label"></div></div>
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
                <div class="content-area" id="contentArea"></div>
                <div class="intranet-collapse"><div class="intranet-text"><div class="intranet-toggle collapse-icon">▲</div><div class="semester-name"> <div class="intranet-subtext"></div> </div><div class="intranet-toggle collapse-icon">▲</div></div></div>
                `;

                const notifContainer = document.createElement("div");
                notifContainer.className = "selected-subject-card-notif-container";

                const originalTable = document.querySelector("table.greyGridTable");
                if (!originalTable) return;
                originalTable.parentNode.insertBefore(notifContainer, originalTable);
                originalTable.parentNode.insertBefore(container, originalTable);
                originalTable.style.display = "none";

                this.renderContent();
            }


            // MARK: renderRecentGrades
            renderRecentGrades() {
                // localStorage.setItem("ECAM_DASHBOARD_SAVED_READ_GRADES",JSON.stringify(this.grades.toSpliced(12,1))); this.savedReadGrades = JSON.parse(localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"));
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

                if (newGradesCard.children.length == 1) {newGradesCard.classList.add("none")}
                else {newGradesCard.classList.remove("none")}
            }

            //MARK: language Sensitive
            languageSensitiveContent(fadeIn=true) {
                // Language Sensitive text in the Dashboard Header and Semester filter tab (which don't refresh on calling the renderContent() method)
                const dashTitle = document.querySelector(".dash-title");
                const dashSubtitle = document.querySelector(".dash-subtitle");
                dashTitle.innerHTML = `${this.lang == "fr" ? 'ECAM Grades Dashboard' : "ECAM Grades Dashboard"}`;
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

                document.querySelector(".filter-title").innerHTML = `${this.lang == "fr" ? "Filtrer par semestre" : "Filter by semester"}`;
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
                            <div class="semester-name">📚 ${this.lang == "fr" ? 'semester' : "Semester"} ${sem}</div>
                                <div class="semester-average ${avgClass}">
                                    <span>${moyenneSem >= 10 ? '✅' : '⚠️'}</span><span>${moyenneSem}/20</span>
                                </div>
                            </div>
                        <div class="semester-toggle open collapse-icon">▲</div>
                    </div>
                    <div class="semester-content show ${fadeIn ? "fade-in" : ""}" id="sem-content-${sem}">
                        <div class="drop-subject-card remove-from-ue">-</div>
                        <div class="ue-grid" ${(unclassified.length == 0 || !this.ueConfig[sem] || Object.keys(this.ueConfig?.[sem])[0] == undefined) ? `style="gap: ${this.editMode ? `20px` : `0px`}"` : ``}>
                            <div class="modules-section">
                                ${this.renderAllUECards(sem)}
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
                        <div class="drop-subject-card create-ue">+</div>
                    </div>
                    `;
                    contentArea.appendChild(section);
                    const container = document.getElementById(`sem-content-${sem}`)

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
                                
                                const ueContent = header.parentElement.querySelector(".ue-details");
                                ueContent.innerHTML = this.renderAllMatCardCompact(sem, ueName);
                                content.classList.add('compact');
                                toggle.classList.remove('open');
                            }
                        });
                    }

                    this.setGradesTableTotalCoef()
                    this.attachEventListeners();

                });
            }



            renderAllUECards(sem) {
                const container = document.getElementById(`sem-content-${sem}`);
                const ueConfig = this.ueConfig?.[sem] || {};

                let html = `${this.editMode ? `<div class="drop-subject-card insert-to-new-ue" data-semester="${sem}" data-index="0">+</div>` :""}`;

                if (ueConfig.__ues__) {
                    ueConfig.__ues__.forEach((ueName, ueIndex) => {
                        if (ueName != "__ues__") {
                            html += this.renderUECard(sem, ueName, ueIndex+1);
                        }
                    });
                }

                return html;
            }
            // MARK: renderUECard
            renderUECard(sem, ueName, insertIndex=-1) {
                const ueGrades = this.calculateUEGrades(sem, ueName);
                const includedGrades = (ueGrades || []).filter(n => this.ignoredGrades.indexOf([sem, n.subject, n.type+" "+n.date+" "+n.prof].join("\\")) == -1);
                let weight = 0; includedGrades.forEach(grade => {weight += grade.coef/100})
                const moyenne = this.gradesDatas[sem][ueName].average;
                const hasSim =      this.gradesDatas[sem][ueName].simGrades.length > 0 ? true : false;
                const hasDisabled = this.gradesDatas[sem][ueName].disabledSimGrades.length + this.gradesDatas[sem][ueName].disabledRealGrades.length > 0 ? true : false;

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
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:47%; gap:4px; padding: 0px 10px; font-size: 13px">
                            <div style="font-size: 14px; font-weight: 700; text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des matières :` : `Total Subjects Coef:`}
                            </div>
                            <div class="ue-subject-total-coef-value" data-sem="${sem}" data-ue="${ueName}"></div>
                        </div>
                        <div class="ue-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}" data-sem="${sem}" data-ue="${ueName}">
                            ${moyenne}/20 
                            <div class="ue-toggle open collapse-icon">▲</div>
                            <button class="ue-delete-btn" ${this.editMode ? `class="display:none"` : ""} id="ue-delete-btn-${ueName}-in-semester-${sem}" title="${this.lang == "fr" ? "Supprimer ce module" : "Delete this module"}" data-semester="${sem}" data-ue="${ueName}">🗑️</button>
                        </div>
                    </div>
                    
                    ${hasSim || hasDisabled ? `
                        <div class="ue-info">
                            ${hasDisabled 
                                ? 
                                `<div class="ue-info hasDisabledGrades">
                                    <div style="font-weight: 700">${this.lang == "fr" ? "Inclus des notes désactivées" : "Includes disabled grades"}</div>
                                    <div class="ue-info-disabled-clear" data-sem="${sem}" data-ue="${ueName}">${this.lang == "fr" ? "Activer toutes ces notes" : "Enable all the grades"}</div>
                                </div>` 
                                : ``
                            }
                            ${hasSim 
                                ? 
                                `<div class="ue-info hasSim">
                                    <div style="font-weight: 700">${this.lang == "fr" ? "Inclus des notes simulées" : "Includes simulated grades"}</div>
                                    <div class="ue-info-sim-clear" data-sem="${sem}" data-ue="${ueName}">${this.lang == "fr" ? "Effacer ces notes simulées" : "Erase the simulated grades"}</div>
                                </div>` 
                                : ``
                            }
                        </div>
                    ` : ""}
                    

                    <div class="ue-details ${this.editMode ? "edit-mode": ""}" id="ue-details-${ueName}-in-semester${sem}">
                        ${this.renderAllMatCardDetailed(sem, ueName)}
                    </div>
                    ${this.editMode ? `
                    <div class="add-a-subject-card" id="add-a-subject-card-for-${ueName}-in-semester-${sem}" data-sem="${sem}" data-ue="${ueName}">
                        <div class="add-a-subject-card-plus left">+</div>
                        <div>${this.lang == "fr" ? `Ajouter une matière` : `Add a subject`}</div>
                        <div class="add-a-subject-card-plus right">+</div>
                    </div>
                    ` : ""
                    }
                </div>
                ${
                    insertIndex > -1 && this.editMode
                    ? `<div class="drop-subject-card insert-to-new-ue" data-semester="${sem}" data-index="${insertIndex}">+</div>`
                    : ``
                }
                `;

                return html
            }
            



            renderAllMatCardDetailed(sem, ueName) {
                const ueData = this.gradesDatas[sem][ueName];

                let html = `${this.editMode ? `<div class="drop-subject-card subj-insert-area" data-index="0"><div class="drop-subject-card-arrow">→</div></div>` : ``}`;

                Object.values(ueData.subjects).forEach((_value, _index) => {
                    html += this.renderMatCardDetailed(sem, ueName, _value.subjName);
                    html += this.editMode
                        ? `<div class="drop-subject-card subj-insert-area" data-index="${_index+1}"><div class="drop-subject-card-arrow">→</div></div>` 
                        : ``
                    ;       
                })

                return html;
            }
            // MARK: renderMatCardDetailed
            renderMatCardDetailed(sem, ueName, subject) {
                const ueData =  this.gradesDatas[sem][ueName];
                const subjectData =     ueData.subjects[subject];
                const subjGrades =      subjectData.grades;
                const ueMoy =           ueData.average;
                const moyMat =          subjectData.average;
                const pct =             subjectData.coef;
                const isCustom =        subjectData.isCustom;
                const totalSimGrades =  subjectData.simGrades.length;
                
                let html = `
                <div class="subject-card ${moyMat == " - " ? `unknown` : `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" ${this.editMode ? `style="user-select: none;"` : ``} id="subject-card-semester-${sem}-subject-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" data-custom="${isCustom}">
                    <div class="subject-card-header ${moyMat == " - " ? `unknown` : `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" ${this.editMode ? `draggable="true"` : ``} style="${this.editMode ? `cursor: grab; ` : `${subjGrades.length > 0 ? `` : `border-radius: 20px; border: none`}`}">
                        <div style="display: flex; width: 42%; padding-left: ${this.editMode ? `10px` : `50px`}">
                            <div style="display: flex; justify-content: flex-start; align-items: center; width: 100%; gap:8px; user-select: text">
                                ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("detailed-subject-card", {type:"detailed", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                                <div style="width: 100%">
                                    ${isCustom 
                                        ? `<input type="text" onmouseover="event.preventDefault()" class="subject-name input any-input" id="subject-name-input-${sem}-${ueName}-${subject}" value="${subject}"/>`
                                        : `<div class="subject-name">${subject}</div>`}
                                    <div class="grade-type">
                                        ${this.lang == "fr" ? "Poids dans l'UE" : "Weight in TU"}: 
                                        ${this.editMode 
                                            ? `<input class="subject-coef-input-box any-input" id="subject-coef-input-box-${sem}-${ueName}-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                            : `<span style="font-weight: 800;">${pct}%</span>`}
                                        | 
                                        ${this.lang == "fr" ? "Moyenne" : "Average"}: 
                                        <span class="subj-moyenne ${moyMat == " - " ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}">${moyMat}/20</span> 
                                        ${subjGrades.length===0 ? `<span style="margin-left:2px;font-size:12px;color:#6b7280">${this.lang == "fr" ? "(aucune note publiée)" : "(no published grade)"}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding: 0px 10px; font-size: 13px">
                            <div style="text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                            </div>
                            <div class="grades-table-subject-total-coef-value" data-sem="${sem}" data-ue="${ueName}" data-subject="${subject}"></div>
                        </div>
                    </div>
                    <table class="grades-table ${moyMat == " - " ? `unknown` : `${moyMat >= 10 ? `${ueMoy < 10 ? `meh` : `good`}` : `${ueMoy >= 10 ? `meh` : `bad`}`}`}" style="${this.editMode ? `user-select: text;` : ``}" id="grades-table-${subject}-semester${sem}" data-subject="${subject}">

                        <thead>
                            ${subjGrades.length > 0 || this.editMode
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
                                    <th class="grades-table-teacher" style="border-right-width: 0px;" colspan="2">
                                        ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                    </th>
                                </tr>`
                                : ``
                            }
                        </thead>
                        <tbody>
                `;

                subjGrades.forEach((grade, index) => {
                    const gradeClass = this.getGradeColor(grade.grade);
                    const gradeIsSim = grade.__sim ? "true" : "false";

                    html += `
                            <tr class="grade-row ${index == subjGrades.length-1 ? `last` : ``} ${grade.__sim ? `sim` : ``}" data-sim="${gradeIsSim}">
                                <td class="grades-table-type" style="display: flex; align-items: center; gap: 6px; width: auto">
                                    <input type="checkbox" class="grade-checkbox any-input" id="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}" data-sem="${sem}" data-subj="${subject}" data-uen="${ueName||''}" data-prof="${grade.prof}" data-gradeid="${grade.type} ${grade.date} ${grade.prof}" ${this.ignoredGrades.indexOf([sem, subject, grade.type+" "+grade.date+" "+grade.prof].join("\\")) == -1 ? "checked" : ""}></input>
                                    ${grade.__sim && this.editMode
                                        ? `<input class="grade-type grade-simulee-input-edit sim-inp-type any-input" style="width: 100%; max-width: 250px;" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" data-modifType="type" data-id="${totalSimGrades-1}" data-sem="${sem}" data-subj="${subject}" data-type="${grade.type}" data-uen="${ueName||''}" value="${grade.type}"/>` 
                                        : `<label class="grade-type" style="width: auto"  id="grade-type-${grade.type}-${grade.date}" for="grade-checkbox-${grade.subject}-${grade.type}-${grade.date}-${grade.prof}">${grade.type || ''}${grade.__sim ? ` • ${this.lang == "fr" ? "Simulée" : "Simulated"}` : ''}</label>`
                                    }
                                </td>
                                <td class="grade-value grade-${gradeClass} grades-table-grade" data-sim="${gradeIsSim}">
                                    ${grade.__sim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-grade any-input" style="width: 100%; max-width: 75px;" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="0.5" min="0" max="20" data-id="${totalSimGrades-1}" data-modifType="grade" data-sem="${sem}" data-subj="${subject}" data-type="${grade.type}" data-uen="${ueName||''}" style="width:75px; height:25px" value="${grade.grade}"> /20`
                                        : `${grade.grade}/20`
                                    }
                                </td>
                                <td class="grades-table-coef" data-sim="${gradeIsSim}">
                                    ${grade.__sim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-coef any-input" style="width: 100%; max-width: 60px;" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="number" step="5" min="0" max="100" data-id="${totalSimGrades-1}" data-modifType="coef" data-sem="${sem}" data-subj="${subject}" data-type="${grade.type}" data-uen="${ueName||''}" style="width:60px; height:25px"value="${grade.coef}"> %`
                                        : `${grade.coef} %`
                                    }
                                </td>
                                <td class="grades-table-classAvg" data-sim="${gradeIsSim}">
                                    ${grade._sim && this.editMode
                                        ? ``
                                        : `${grade.__sim ? "" : grade.classAvg+"/20"}`
                                    }
                                </td>
                                <td class="grades-table-date grade-date" data-sim="${gradeIsSim}">
                                    ${grade.__sim && this.editMode
                                        ? `<input class="grade-simulee-input-edit sim-inp-date any-input" style="width: 100%; max-width: 140px;" id="grade-simulee-input-date-for-${subject}-from-${ueName}-in-semester${sem}-${grade.type}" type="date" data-id="${totalSimGrades-1}" data-sem="${sem}" data-subj="${subject}" data-modifType="date" data-type="${grade.type}" data-uen="${ueName||''}" style="width:140px; height:25px"value="${grade.date||""}">`
                                        : `${`${grade.__sim ? grade.date.split("-").reverse().join("/") : grade.date}`||''}`
                                    }
                                </td>
                                <td class="grades-table-teacher">
                                    <span>${`${grade.prof.split(" / ").length <= 3 ? grade.prof : grade.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</span>
                                </td>
                                <td style="width: 52px; padding: 3px">
                                    ${grade.__sim 
                                        ? `<button class="sim-del-btn" data-sem="${sem}" data-subj="${subject}" data-uen="${ueName||''}" data-type="${grade.type}">🗑️</button>` 
                                        : `<div style="width:32px"></div>`}
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
                                            <input class="grade-simulee-input sim-inp-type any-input" id="grade-simulee-input-type-for-${subject}-from-${ueName}-in-semester${sem}" data-sem="${sem}" data-subj="${subject}" placeholder="${this.lang == "fr" ? "Titre" : "Title"}" />
                                        </div>
                                    </td>
                                    <td class="grades-table-grade">
                                        <input class="grade-simulee-input sim-inp-grade any-input" id="grade-simulee-input-grade-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="0.5" min="0" max="20" data-sem="${sem}" data-subj="${subject}" placeholder="/20"> /20
                                    </td>
                                    <td class="grades-table-coef">
                                        <input class="grade-simulee-input sim-inp-coef any-input" id="grade-simulee-input-coef-for-${subject}-from-${ueName}-in-semester${sem}" type="number" step="5" min="0" max="100" data-sem="${sem}" data-subj="${subject}" placeholder="%"> %
                                    </td>
                                    <td>
                                    </td>
                                    <td class="grades-table-date">
                                        <input class="grade-simulee-input sim-inp-date any-input" id="grade-simulee-input-date-for-${subject}-from-${ueName}-in-semester${sem}" type="date" value="${this.today}" data-sem="${sem}" data-subj="${subject}">
                                    </td>
                                    <td colspan="2">
                                        <button class="btn-export sim-add-btn" data-sem="${sem}" data-subj="${subject}" data-uen="${ueName||''}">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    `;

                return html;
            }




            renderAllMatCardCompact(sem, ueName) {
                return Object.keys(this.gradesDatas[sem][ueName].subjects).map(subject => {
                    if (subject != "average") 
                        {return this.renderMatCardCompact(sem, ueName, subject)}
                }).join("")
            }
            // MARK: renderMatCardCompact
            renderMatCardCompact(sem, ueName, subject) {
                const ueData =  this.gradesDatas[sem][ueName];
                const subjectData =             ueData.subjects[subject];
                const subjGrades =              subjectData.grades;
                const ueMoy =                   ueData.average;
                const moyMat =                  subjectData.average;
                const pct =                     subjectData.coef;
                const isCustom =                subjectData.isCustom;
                const includedGradesLength =    subjGrades.length - subjectData.disabledRealGrades.length - subjectData.disabledSimGrades.length;
                const totalSimGrades =          subjectData.simGrades.length;

                const html = `
                <div class="subject-card compact ${this.editMode ? "" : "edit-mode"} ${moyMat == " - " ? "unknown" : `${moyMat>10 ? `${ueMoy>10 ? `good` : `meh`}` : `bad`}`}" id="subject-card-semester-${sem}-subject-${subject}" style="${this.editMode ? "cursor: grab; user-select: none; " : " "}" ${this.editMode ? `draggable="true"` : ""} data-sem="${sem}" data-ue="${ueName}" data-subject="${subject}" data-custom="${isCustom}">
                    <div style="display:flex; align-items:center; gap:8px; padding-left: 11px; width:43%; min-width: 275px">
                        ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("compact-subject-card", {type:"compact", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                        <div style="width: 87%">
                            ${isCustom 
                                ? `<input type="text" class="subject-name input any-input" id="subject-name-input-${sem}-${ueName}-${subject}" value="${subject}"/>`
                                : `<div class="subject-name">${subject}</div>`
                            }
                            <div style="font-size:13px;color:#666;">
                                ${this.lang == "fr" ? "Poids dans l'UE: " : "Weight in TU: "}
                                ${this.editMode 
                                    ? `<input class="subject-coef-input-box any-input" id="subject-coef-input-box-${sem}-${ueName}-${subject}" data-semester="${sem}" data-ue="${ueName}" data-subject="${subject}" type="number" placeholder="%" step="5" min="0" max="100" value="${pct}"/>%`
                                    : `<span style="font-weight: 800">${pct}%</span>`
                                } • 
                                ${subjGrades.length===0 ? `${this.lang == "fr" ? "aucune note publiée" : "no published grade"}` : `${subjGrades.length} ${this.lang == "fr" ? `note${subjGrades.length>1?"s":""} au total` : `grade${subjGrades.length>1?"s":""} total`}`}
                                ${subjGrades.length>0 
                                    ? ` • <span ${includedGradesLength<subjGrades.length ? `style="color: #df0000"` : ``}>
                                        <span style="font-weight: 700; ">${includedGradesLength}/${subjGrades.length}</span> 
                                        ${this.lang == "fr" ? `note${includedGradesLength>1?"s":""} activée${includedGradesLength>1?"s":""}` : `grade${includedGradesLength>1?"s":""} enabled`}${includedGradesLength<subjGrades.length ? `!` : ``}
                                    </span>` 
                                    : ``}
                                ${totalSimGrades>0 
                                    ? ` • ${totalSimGrades} ${this.lang == "fr" ? `note${totalSimGrades>1?"s":""} simulée${totalSimGrades>1?"s":""}` : `simulated grade${totalSimGrades>1?"s":""}`}`
                                    : ``}
                                
                            </div>
                        </div>
                    </div>
                    <div class="grades-table-coef" style="display:flex; flex-direction: column; width:50%; gap:6px; padding: 0px 10px; font-size: 13px; font-weight: 600">
                        <div style="text-align: left;">
                            ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                        </div>
                        <div class="grades-table-subject-total-coef-value" data-sem="${sem}" data-ue="${ueName}" data-subject="${subject}"></div>
                    </div>
                    <div class="subj-moyenne ${moyMat == " - " ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}" style="display: flex; justify-content: flex-end; width: 80px; padding-right: 20px; font-size: 20px">${moyMat}/20</div>
                </div>
                `;
                return html;
            }




            renderAllUnclassifiedMatCard(sem, subjects) {
                let html = ``;

                subjects.forEach(subject => {
                    html += this.renderUnclassifiedMatCard(sem, subject);
                })
                return html
            }
            // MARK: renderUnclassifiedMatCard
            renderUnclassifiedMatCard(sem, subject) {
                let html = ``;
                let totalCoef = 0;
                let totalClassAvg = 0;

                const grades = (this.semesters[sem]||{})[subject]||[];
                const moyMat = this.moyennePonderee(grades);
                html +=`
                <div class="subject-card unclassified ${moyMat >= 10 ? `good` : `bad`}" id="subject-card-semester-${sem}-subject-${subject}" ${this.editMode ? `style="user-select: none;"` : ""} ${this.editMode ? `draggable="true"` : ""} data-subject="${subject}" data-semester="${sem}">
                    <div class="subject-card-header unclassified  ${moyMat >= 10 ? `good` : `bad`}" style="${this.editMode ? "cursor: grab; padding-left: 10px;" : "padding-left: 50px;"}" data-sem="${sem}" data-subject="${subject}">
                        ${this.editMode ? `<div style="margin: 0px 5px;">${this.draggableIcon("unclassified-subject-card", {type:"unclassified", targetId:`subject-card-semester-${sem}-subject-${subject}`})}</div>` : ""}
                        <div style="width: 40%">
                            ${subject}
                            <div style="font-size:12px;margin-top:4px;">${this.lang == "fr" ? "Moyenne" : "Average"}: <span class="subj-moyenne ${moyMat>=10 ? 'good' : 'bad'}" >${moyMat}/20</span></div>
                        </div>
                        <div class="grades-table-coef" style="display:flex; flex-direction: column; width:58%; gap:4px; padding-left: 10px; font-size: 13px">
                            <div style="text-align: left;">
                                ${this.lang == "fr" ? `Coef Total des notes :` : `Total Grades Coef:`}
                            </div>
                            <div class="grades-table-subject-total-coef-value" data-sem="${sem}" data-ue="unclassified" data-subject="${subject}"></div>
                        </div>
                    </div>

                    <table class="grades-table ${moyMat >= 10 ? "good" : "bad"}" id="grades-table-${subject}-semester${sem}">
                        <thead>
                            ${grades.length > 0 || this.editMode
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
                                    <th class="grades-table-teacher" style="border-right-width: 0px;" colspan="2">
                                        ${this.lang == "fr" ? "Prof(s)" : "Teacher(s)"}
                                    </th>
                                </tr>`
                                : ``
                            }
                        </thead>
                        <tbody>
                `;
                grades.forEach((grade, index) => {
                    this.gradesDatas[sem]["unclassified"].subjects[subject].grades.push(grade);
                    totalCoef += grade.coef;
                    totalClassAvg += grade.classAvg;

                    html += `
                            <tr class="grade-row-unsorted-grades ${index == grades.length-1 ? `last` : ``}">
                                <td class="grades-table-type" style="width: 30%">${grade.type}</td>
                                <td class="grades-table-grade"><span class="grade-value grade-${this.getGradeColor(grade.grade)}">${grade.grade}/20</span></td>
                                <td class="grades-table-coef">${grade.coef}%</td>
                                <td class="grades-table-classAvg">${grade.classAvg}</td>
                                <td class="grades-table-date grade-date">${grade.date}</td>
                                <td class="grades-table-teacher" style="font-size:12px;color:#999;">${grade.prof}</td>
                            </tr>
                    `;
                });

                html +=`</tbody></table></div>`;
                return html;
            }

        //#endregion






        //#region -Region: Ev Listeners

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
                };
                
                    // Collapse/Develop (fold/unfold) UEs
                document.onmousedown = (e) => {
                    if (e.target.closest('.ue-header') && !e.target.closest('.ue-title.input') && !e.target.closest('.ue-delete-btn')) {
                        this.ueHeaderClickEvent(e)
                    }
                    else if (e.target.closest(".subject-card-header")) {
                        const subjectCardHeader = e.target.closest(".subject-card-header");
                        subjectCardHeader.style.cursor = "grabbing";
                        this.clickedSubjectCardHeader = subjectCardHeader;

                        document.onmouseup = (e) => {
                            this.clickedSubjectCardHeader.style.cursor = "grab";
                            document.ondragend = (e) => {this.documentOnDragEndEvent(e)};
                            document.onmouseup = null;
                        };
                        document.ondragend = (e) => {
                            this.clickedSubjectCardHeader.style.cursor = "grab";
                            document.ondragend = (e) => {this.documentOnDragEndEvent(e)};
                            document.onmouseup = null;
                        };
                    }
                    else if (e.target.closest(".subject-card.compact")) {
                        const subjectCardCompact = e.target.closest(".subject-card.compact");
                        subjectCardCompact.style.cursor = "grabbing";
                        this.clickedSubjectCardCompact = subjectCardCompact;

                        document.onmouseup = (e) => {
                            this.clickedSubjectCardCompact.style.cursor = "grab";
                            document.ondragend = (e) => {this.documentOnDragEndEvent(e)};
                            document.onmouseup = null;
                        };
                        document.ondragend = (e) => {
                            this.clickedSubjectCardCompact.style.cursor = "grab";
                            document.ondragend = (e) => {this.documentOnDragEndEvent(e)};
                            document.onmouseup = null;
                        };
                    }
                };

                // this.dragElement(document.getElementById("main-average-card"));
                // this.dragElement(document.querySelector(".new-grades-card"));


                document.querySelectorAll(".any-input").forEach(input => {
                    input.onfocus = () =>       {document.onkeydown = null; document.onkeyup = null}
                    input.onblur = () =>        {this.generalKeyboardEvents()};
                    input.ondrop = (e) =>       {e.preventDefault()};
                    if (input.classList.contains("ue-title")) {   // Change UEs name
                        input.onmouseenter = () => { this.detachOnDragEventListeners(); document.querySelectorAll(".ue-header").forEach(card => {card.draggable = false})}
                        input.onmouseleave = () => { this.attachOnDragEventListeners(); document.querySelectorAll(".ue-header").forEach(card => {card.draggable = true;})}
                        input.onchange = (e) => this.ueTitleInputChangeAction(e);
                    }
                    else {
                        input.onmouseenter = () =>  { this.detachOnDragEventListeners(); };
                        input.onmouseleave = () =>  { this.attachOnDragEventListeners(); };
                    }
                })
                document.ondrop = (e) => {this.draggedElementDroppedInInputArea = true; console.log("document: drop"); this.documentOnDragEndEvent(e)};
                document.ondragend = (e) => {console.log("document: dragend"); this.documentOnDragEndEvent(e); this.draggedElementDroppedInInputArea = false;};
                


                document.querySelector(".new-grades-notif").onclick = () => {
                    const newGradesCard = document.querySelector(".new-grades-card");
                    newGradesCard.scrollIntoView();
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
                        targetElem.scrollIntoView({block: "center"});
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

                
                // const dropAreaAdd = document.querySelector(".drop-subject-card.create-ue");
                // const dropAreaRemove = document.querySelector(".drop-subject-card.remove-from-ue");
                // const ueInsertAreas = document.querySelectorAll(".drop-subject-card.insert-to-new-ue");
                
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


                document.querySelectorAll(".add-a-subject-card").forEach(addDiv => {
                    addDiv.onmouseenter = (e) => {
                        addDiv.querySelector(".add-a-subject-card-plus.left").style.transform =  "rotate(-90deg)";
                        addDiv.querySelector(".add-a-subject-card-plus.right").style.transform = "rotate(90deg)";
                    }
                    addDiv.onmouseleave = (e) => {
                        addDiv.querySelector(".add-a-subject-card-plus.left").style.transform =  "";
                        addDiv.querySelector(".add-a-subject-card-plus.right").style.transform = "";
                    }
                    addDiv.onclick = (e) => {
                        e.preventDefault();
                        const addDivClicked = e.target.closest(".add-a-subject-card");
                        const sem = addDivClicked.dataset.sem;
                        const ue =  addDivClicked.dataset.ue;
                        const ueCard = document.getElementById(`ue-card-${ue}-in-semester-${sem}`);
                        const ueContent = ueCard.querySelector(".ue-details");

                        let newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} 1`; let count = 1;
                        while (this.gradesDatas[sem][ue].subjects[newSubjName]) {
                            count++; newSubjName = `${this.lang == "fr" ? "Nouvelle matière" : "New subject"} ${count}`;
                        }

                        this.ueConfig   [sem][ue].subjects.push(newSubjName);
                        this.ueConfig   [sem][ue].coefficients [newSubjName] = 0;
                        this.ueConfig   [sem][ue].custom       [newSubjName] = true;

                        this.getGradesDatas();
                        
                        if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                            ueContent.innerHTML = this.renderAllMatCardDetailed(sem, ue);
                        }
                        else {
                            ueContent.innerHTML = this.renderAllMatCardCompact(sem, ue);
                        }

                        this.attachEventListeners()
                        this.setGradesTableTotalCoef();
                        this.saveConfig()
                        this.getGradesDatas();
                    }
                })


                document.querySelectorAll(".subject-name.input").forEach(input => {
                    input.onmouseover = (e) => {e.preventDefault()};
                    input.onchange = (e) => {
                        const newSubjName = e.target.value;
                        const matCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                        const ueContent = matCard.parentElement;
                        const sem = matCard.dataset.semester;
                        const ue = matCard.dataset.ue;
                        const oldSubjName = matCard.dataset.subject;
                        let diffName = true;
                        this.ueConfig[sem][ue].subjects.forEach(_mat => {if (_mat == newSubjName) diffName = false});
                            

                        if (diffName) {
                            const oldMatIndex = this.ueConfig[sem][ue].subjects.indexOf(oldSubjName);
                            this.ueConfig[sem][ue].subjects.splice(oldMatIndex, 1);
                            const pct = this.ueConfig[sem][ue].coefficients[oldSubjName];
                            const isCustom = this.ueConfig[sem][ue].custom[oldSubjName];
                            const matDatas = this.gradesDatas[sem][ue].subjects[oldSubjName];

                            delete this.ueConfig[sem][ue].coefficients[oldSubjName];
                            delete this.ueConfig[sem][ue].custom[oldSubjName];
                            delete this.gradesDatas[sem][ue].subjects[oldSubjName];

                            this.ueConfig   [sem][ue].subjects.push(newSubjName);
                            this.ueConfig   [sem][ue].coefficients [newSubjName] = pct;
                            this.ueConfig   [sem][ue].custom       [newSubjName] = false;
                        }
                        
                        this.getGradesDatas();

                        if (this.viewMode == "detailed" || !ueCard.classList.contains("compact")) {
                            ueContent.innerHTML = this.renderAllMatCardDetailed(sem, ue);
                        }
                        else {
                            ueContent.innerHTML = this.renderAllMatCardCompact(sem, ue);
                        }

                        this.attachEventListeners()
                        this.setGradesTableTotalCoef();
                        this.saveConfig()
                        this.getGradesDatas();
                    }
                })

                document.querySelector(".modules-section").querySelectorAll(".ue-delete-btn").forEach(btn => {
                    btn.onclick = e => {
                        const sem = e.target.dataset.semester;
                        const ueName = e.target.dataset.ue;
                        
                        const ueIndex = this.ueConfig[sem].__ues__.indexOf(ueName);

                        this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                        delete this.ueConfig[sem][ueName];

                        if (this.ueConfig[sem] == {}) {delete this.ueConfig[sem]}

                        this.saveConfig();
                        this.getGradesDatas();
                        this.renderContent();
                        this.attachEventListeners();
                    }
                })

                

                // Attach on-click event action for the simulated grade addition button
                document.querySelectorAll('.sim-add-btn').forEach(btn=>{
                    btn.onclick = (e)=>{
                        const ueName = e.target.dataset.uen;
                        const semX = e.target.dataset.sem;
                        const subj = e.target.dataset.subj;
                        this.ensureSimPath(semX, ueName, subj);
                        const id = this.sim[semX][ueName][subj].length;
                        const typeInp = document.querySelector(`.grade-simulee-input.sim-inp-type[data-sem="${semX}"][data-subj="${subj}"]`);
                        const gradeInp = document.querySelector(`.grade-simulee-input.sim-inp-grade[data-sem="${semX}"][data-subj="${subj}"]`);
                        const coefInp = document.querySelector(`.grade-simulee-input.sim-inp-coef[data-sem="${semX}"][data-subj="${subj}"]`);
                        const dateInp = document.querySelector(`.grade-simulee-input.sim-inp-date[data-sem="${semX}"][data-subj="${subj}"]`);
                        const type = typeInp?.value||'';
                        const grade = parseFloat(gradeInp?.value||'');
                        const coef = parseFloat(coefInp?.value||'');
                        const date = dateInp?.value||'';
                        if(isNaN(grade) || isNaN(coef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }
                        this.ensureSimPath(semX, ueName, subj);
                        this.sim[semX][ueName][subj].push({
                            grade, 
                            coef,
                            type: type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`,
                            date: date||new Date().toLocaleDateString(),
                            prof: '—',
                            subject: subj,
                            semester: semX,
                            libelle: `[SIM] ${subj} - ${type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`}`,
                            __sim: true,
                            id
                        });
                        this.saveSim();
                        this.getGradesDatas();
                        this.renderContent();
                    }
                });

                // Attach on-change event action for simulated grades type/grade/coef/date fields
                document.querySelectorAll(".grade-simulee-input-edit").forEach(input => {
                    input.onchange = e => {
                        const ueName = e.target.dataset.uen;
                        const semX = e.target.dataset.sem;
                        const subj = e.target.dataset.subj;
                        const id = e.target.dataset.id;
                        let gradeRow = e.target.parentElement.parentElement;
                        // const typeInp = document.querySelector(`.grade-simulee-input-edit.sim-inp-type[data-sem="${semX}"][data-subj="${subj}"]`);
                        const typeInp = gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-type`)
                        const gradeInp = gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-grade`);
                        const coefInp = gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-coef`);
                        const dateInp = gradeRow.querySelector(`.grade-simulee-input-edit.sim-inp-date`);
                        const type = typeInp?.value||'';
                        const newGrade = parseFloat(gradeInp?.value||'');
                        const newCoef = parseFloat(coefInp?.value||'');
                        const date = dateInp?.value||'';
                        if(isNaN(newGrade) || isNaN(newCoef)){ alert(this.lang == "fr" ? "Grade et coef requis" : "Grade and coef required"); return; }
                        this.sim[semX][ueName][subj].forEach((grade, index) => {
                            if (grade.id == id) {
                                this.sim[semX][ueName][subj][index] = {
                                    grade: newGrade, 
                                    coef: newCoef,
                                    type: type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`,
                                    date: date||new Date().toLocaleDateString(),
                                    prof: '—',
                                    subject: subj,
                                    semester: semX,
                                    libelle: `[SIM] ${subj} - ${type||`${this.lang=="fr"? 'Simulé' : "Simulated"}`}`,
                                    __sim: true,
                                    id
                                }
                            }
                        });

                        this.saveSim();
                        this.getGradesDatas();
                        this.renderContent(false);
                    }
                })

                // Attach on-click event action for the simulated grades' deletion button
                document.querySelectorAll('.sim-del-btn').forEach(btn=>{
                    btn.onclick = (e) => {
                        const semX = e.target.dataset.sem;
                        const ueName = e.target.dataset.uen;
                        const subj = e.target.dataset.subj;
                        const type = e.target.dataset.type;
                        this.sim[semX][ueName][subj].splice(this.sim[semX][ueName][subj].indexOf(type), 1);
                        this.deleteUnusedSimPath(semX, ueName, subj);
                        this.saveSim();
                        this.getGradesDatas();
                        this.renderContent(true);
                    }
                })
                
                document.querySelectorAll(".ue-info-sim-clear").     forEach(simClear => {simClear.onclick = () => {this.clearSimGradesForUE(    simClear.dataset.sem, simClear.dataset.ue);this.renderContent();}});
                document.querySelectorAll(".ue-info-disabled-clear").forEach(disClear => {disClear.onclick = () => {this.clearIgnoredGradesForUE(disClear.dataset.sem, disClear.dataset.ue);this.renderContent();}});

                
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

            documentOnDragEndEvent(e) {
                const subjectCard = this.currentlyDraggedSubjCard;

                if (this.draggedElementDroppedInInputArea && subjectCard) {

                    // checking if the dragged subject card is selected:
                    let draggedSubjectCardIsSelected = false;
                    if (this.selectedSubjectCards.length > 0) {
                        this.selectedSubjectCards.forEach(div => {if (div==subjectCard) {draggedSubjectCardIsSelected=true}});
                    }

                    if (!draggedSubjectCardIsSelected) {
                        const dropAreaAdd = document.querySelector(".drop-subject-card.create-ue");
                        const dropAreaRemove = document.querySelector(".drop-subject-card.remove-from-ue");
                        subjectCard.style.width = "100%";

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
                            dropAreaAdd.classList.remove("show");
                            dropAreaRemove.classList.remove("show");
                            this.removeSubjectCardFromSubjectSelection();
                        }
                        
                    } else {
                        this.selectedSubjectCards.forEach(selectedSubjectCard2 => {
                            selectedSubjectCard2.style.width = "100%";

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
                        const semX = e.target.dataset.sem;
                        const subj = e.target.dataset.subj;
                        const gradeID = e.target.dataset.gradeid;
                        const key = [semX, subj, gradeID].join("\\");
                        if (e.target.checked) {
                            // remove this specific ignored key if present
                            this.ignoredGrades = (this.ignoredGrades || []).filter(id => id !== key);
                        } else {
                            // add ignored key if not already present
                            this.ignoredGrades = this.ignoredGrades || [];
                            if (!this.ignoredGrades.includes(key)) this.ignoredGrades.push(key);
                        }
                        this.saveIgnoredGrades();
                        this.getGradesDatas({semX, ue:undefined, subj});
                        this.renderContent(false);
                    }
                });
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

                    if (toggle.classList.contains('open')) {
                        ueContent.innerHTML = this.renderAllMatCardCompact(sem, ueName);
                        ueContent.classList.add('compact');
                        toggle.classList.remove('open');
                        this.setGradesTableTotalCoef()
                    } else {
                        ueContent.innerHTML = this.renderAllMatCardDetailed(sem, ueName);
                        ueContent.classList.remove('compact');
                        toggle.classList.add('open');
                        this.attachCheckboxListeners(ueContent);
                        this.setGradesTableTotalCoef()
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






        //#region -Region: Drag events
            draggedElementOnDragStartEvent(e, {draggedElement, subjectCard}) {
                this.currentlyDraggedElement = draggedElement;
                this.currentlyDraggedSubjCard = subjectCard;
                if (e.target.classList.contains("any-input")) {return};
                this.currentlyDraggedSubjCard.style.width = "50%";

                if (subjectCard.classList.contains("unclassified")) {
                    this.currentlyDraggedSubjCard.querySelector(".grades-table").style.display = "none";
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").style.border = "none";
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 20px 20px";
                } 
                else if (subjectCard.classList.contains("compact")) {
                    this.currentlyDraggedSubjCard.querySelector(".grades-table-coef").style.display = "none";
                }
                else {
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").children[0].style.width =                         "50%";
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").querySelector(".grades-table-coef").style.width =  "50%";
                    this.currentlyDraggedSubjCard.querySelector(".grades-table").style.display = "none";
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").style.borderBottom = "none";
                    this.currentlyDraggedSubjCard.querySelector(".subject-card-header").style.borderRadius = "20px 20px 20px 20px";
                }
                document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                document.querySelector(".semester-content").classList.add("dragging");
                document.querySelector(".drop-subject-card.create-ue").classList.add("show");
                document.querySelector(".drop-subject-card.remove-from-ue").classList.add("show");
                e.dataTransfer.setData("text", this.currentlyDraggedSubjCard.id)
            };
            draggedElementOnDragEndEvent(e, {draggedElement, subjectCard}) {
                subjectCard.style.width = "100%";
                this.currentlyDraggedElement = undefined;
                this.currentlyDraggedSubjCard = undefined;

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
                    document.querySelector(".drop-subject-card.create-ue").classList.remove("show");
                    document.querySelector(".drop-subject-card.remove-from-ue").classList.remove("show");
                }
            }
            draggedSelectedElementOnDragStartEvent(e, {draggedElement, subjectCard}) {
                this.selectedSubjectCards.forEach(selectedSubjectCard => {
                    selectedSubjectCard.style.width = "50%";

                    if (selectedSubjectCard.classList.contains("unclassified")) {
                        setTimeout(() => {selectedSubjectCard.querySelector(".grades-table").style.display = "none";}, 10)
                        selectedSubjectCard.querySelector(".subject-card-header").style.border = "none";
                        selectedSubjectCard.querySelector(".subject-card-header").style.borderRadius = "20px";
                    
                    } 
                    else if (selectedSubjectCard.classList.contains("compact")) {
                        selectedSubjectCard2.querySelector(".grades-table-coef").style.display = "none";
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
                document.querySelector(".semester-content").classList.add("dragging");
                document.querySelector(".drop-subject-card.create-ue").classList.add("show");
                document.querySelector(".drop-subject-card.remove-from-ue").classList.add("show");

                e.dataTransfer.setData("text", subjectCard.id)
            };
            draggedSelectedElementOnDragEndEvent(e, {draggedElement, subjectCard}) {
                console.log("selection draggedElement: dragend");

                this.selectedSubjectCards.forEach(selectedSubjectCard => {
                    selectedSubjectCard.style.width = "100%";

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



            // MARK: Attach ondrag events
            attachOnDragEventListeners() {   // Add ONDRAG cards event
                const dropAreaAdd =     document.querySelector(     ".drop-subject-card.create-ue");
                const dropAreaRemove =  document.querySelector(     ".drop-subject-card.remove-from-ue");
                const ueInsertAreas =   document.querySelectorAll(  ".drop-subject-card.insert-to-new-ue");
                const subjInsertAreas = document.querySelectorAll(  ".drop-subject-card.subj-insert-area");

                document.querySelectorAll(".subject-card").forEach(subjectCard => {
                    let draggedElement = ``;
                    if (subjectCard.classList.contains("compact")) {draggedElement = subjectCard;}
                    else {draggedElement = subjectCard.querySelector(".subject-card-header");}

                    draggedElement.draggable = true;
                    draggedElement.ondragstart = (e) => {this.draggedElementOnDragStartEvent(e, {draggedElement, subjectCard})};
                    draggedElement.ondragend =   (e) => {this.draggedElementOnDragEndEvent(e, {draggedElement, subjectCard})};
                })

                
                if (this.selectedSubjectCards.length > 0) { 
                    this.selectedSubjectCards.forEach(selectedSubjectCard => {
                        let draggedElement = "";
                        const isUnclassified = selectedSubjectCard.classList.contains("unclassified");
                        if (isUnclassified || selectedSubjectCard.classList.contains("compact")) {draggedElement = selectedSubjectCard;}
                        else {draggedElement = selectedSubjectCard.querySelector(".subject-card-header");}
                        
                        draggedElement.draggable = true;
                        draggedElement.ondragstart = (e) => {this.draggedSelectedElementOnDragStartEvent(e, {draggedElement: draggedElement, subjectCard: selectedSubjectCard})};
                        draggedElement.ondragend =   (e) => {this.draggedSelectedElementOnDragEndEvent(e, {draggedElement: draggedElement, subjectCard: selectedSubjectCard})};
                    })
                }

                dropAreaAdd.style.background = "";
                dropAreaAdd.ondragover =    (e) => {e.preventDefault(); e.target.style.background = "#bdb8ffce";};
                dropAreaAdd.ondragleave =   (e) => {e.preventDefault(); e.target.style.background = "";};
                dropAreaAdd.ondrop =        (e) => {
                    e.target.style.background = ""; 
                    e.preventDefault(); 
                    this.dropAreaToNewAction(e.dataTransfer.getData("text"));
                };
                dropAreaAdd.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {e.preventDefault(); e.target.style.background = "#bdb8ffce";}};
                dropAreaAdd.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {e.preventDefault(); e.target.style.background = "";}};
                dropAreaAdd.onclick =       (e) => {if (e.target.classList.contains("show")) {
                    e.target.style.background = ""; e.preventDefault(); 
                    if (this.selectedSubjectCards.length > 0) {
                        this.dropAreaToNewAction(this.selectedSubjectCards[0].id);
                    }
                }};

                dropAreaRemove.style.background = "";
                dropAreaRemove.ondragover =    (e) => {e.preventDefault(); e.target.style.background = "#ffb8b8ce";};
                dropAreaRemove.ondragleave =   (e) => {e.preventDefault(); e.target.style.background = "";};
                dropAreaRemove.ondrop =        (e) => {
                    e.target.style.background = ""; 
                    e.preventDefault(); 
                    this.dropAreaRemoveAction(e.dataTransfer.getData("text"));
                };
                // Custom :hover event, cuz otherwise it would trigger when the fields are not shown
                dropAreaRemove.onmouseenter =  (e) => {if (e.target.classList.contains("show")) {e.preventDefault(); e.target.style.background = "#ffb8b8ce";}};
                dropAreaRemove.onmouseleave =  (e) => {if (e.target.classList.contains("show")) {e.preventDefault(); e.target.style.background = "";}};
                dropAreaRemove.onclick =       (e) => {if (e.target.classList.contains("show")) {
                    e.target.style.background = ""; e.preventDefault(); 
                    if (this.selectedSubjectCards.length > 0) {
                        this.dropAreaRemoveAction(this.selectedSubjectCards[0].id);
                    }
                }};

                ueInsertAreas.forEach(ueInsertArea => {
                    const insertIndex = ueInsertArea.dataset.index;
                    ueInsertArea.ondragover =     (e) => {e.preventDefault(); e.target.style.background = "#bdb8ffce";};
                    ueInsertArea.ondragleave =    (e) => {e.preventDefault(); e.target.style.background = "";};
                    ueInsertArea.ondrop =         (e) => {
                        e.target.style.background = ""; 
                        e.preventDefault(); 
                        this.dropAreaToNewAction(e.dataTransfer.getData("text"), insertIndex);
                    };
                    ueInsertArea.onclick =        (e) => {
                        e.target.style.background = ""; e.preventDefault(); 
                        if (this.selectedSubjectCards.length > 0) {
                            this.dropAreaToNewAction(this.selectedSubjectCards[0].id, insertIndex);
                        }
                        else {
                            this.dropAreaToNewAction(null, insertIndex);
                        }
                    };
                })

                subjInsertAreas.forEach(subjInsertArea => {
                    const insertIndex = subjInsertArea.dataset.index;
                    subjInsertArea.ondragover =     (e) => {e.preventDefault(); e.target.style.background = "#bdb8ff";};
                    subjInsertArea.ondragleave =    (e) => {e.preventDefault(); e.target.style.background = "";};
                    subjInsertArea.ondrop =         (e) => {
                        e.target.style.background = ""; 
                        e.preventDefault(); 
                        this.dropAreaToNewAction(e.dataTransfer.getData("text"), insertIndex);
                    };
                    subjInsertArea.onclick =        (e) => {
                        e.target.style.background = ""; e.preventDefault(); 
                        if (this.selectedSubjectCards.length > 0) {
                            this.dropAreaToNewAction(this.selectedSubjectCards[0].id, insertIndex);
                        }
                        else {
                            this.dropAreaToNewAction(null, insertIndex)
                        }
                    };
                })

                this.notifDelBtnAttachListeners();
            }


            // MARK: Detach ondrag events
            detachOnDragEventListeners() {   // Remove ONDRAG cards event
                document.querySelectorAll(".subject-card").forEach(subjectCard => {
                    let draggedElement = ``;
                    if (subjectCard.classList.contains("compact")) {draggedElement = subjectCard;}
                    else {draggedElement = subjectCard.querySelector(".subject-card-header");}

                    draggedElement.draggable = false;
                    draggedElement.ondragstart = (e) => null;
                    draggedElement.ondragend = (e) => null;

                })
                if (this.selectedSubjectCards.length > 0) { 
                    this.selectedSubjectCards.forEach(selectedSubjectCard => {
                        let draggedElement = "";
                        if (selectedSubjectCard.classList.contains("unclassified") || selectedSubjectCard.classList.contains("compact")) {draggedElement = selectedSubjectCard;}
                        else {draggedElement = selectedSubjectCard.querySelector(".subject-card-header");}
                        
                        draggedElement.draggable = false;
                        draggedElement.ondragstart = (e) => null;
                        draggedElement.ondragend = (e) => null;
                    })
                }
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


            // MARK: removeSubjectCardFromSubjectSelection
            /** 
            *  Manage all the actions involving the deletion of a subj card from the selection of subj cards (this.selectedSubjectCards)
            * 
            * @param notifDiv: the div of the notif linked to the selected subject card
            * @param elementDroppedInArea: if this method is called from triggering an ondrop event of a drop area, pass the dropped element in this argument
            */
            removeSubjectCardFromSubjectSelection({notifDiv="all", elementDroppedInArea=undefined}={notifDiv:"all", elementDroppedInArea:undefined}) {
                if (notifDiv=="all") {      // clear all subject card selection as well as their respective notif
                    
                    this.selectedSubjectCards.forEach((selectedSubjectCard, index) => {
                        selectedSubjectCard.style.width = "100%";

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
                    })

                    setTimeout(() => {document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "table-cell"})}, 100)
                    setTimeout(() => {document.querySelectorAll(".grades-table-classAvg").forEach(classAvg => {classAvg.style.display = "table-cell"})}, 100)
                    
                    document.querySelector(".semester-content").classList.remove("dragging");
                    document.querySelector(".drop-subject-card.create-ue").classList.remove("show");
                    document.querySelector(".drop-subject-card.remove-from-ue").classList.remove("show");
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
                    let matCard = "";
                    if (!elementDroppedInArea) {
                        matCard = document.getElementById(notifDiv.dataset.targetid);
                    }
                    

                    notifDiv.classList.remove("on");
                    setTimeout(()=>{
                        notifDiv.remove();
                        let highestWidth = 0;
                        const notifDivContainer = document.querySelector(".selected-subject-card-notif-container");
                        notifDivContainer.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                        notifDivContainer.style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;
                    }, 300)

                    this.selectedSubjectCards.forEach((selectedSubjectCard, index) => {
                        if (selectedSubjectCard == matCard) 
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
                        
                        document.querySelector(".semester-content").classList.remove("dragging");
                        document.querySelector(".drop-subject-card.create-ue").classList.remove("show");
                        document.querySelector(".drop-subject-card.remove-from-ue").classList.remove("show");
                        document.querySelectorAll(".ue-title.input").forEach(input => {
                            input.parentElement.style.transition = "";
                            input.parentElement.style.width = "42%";
                        })
                        document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoef => {
                            totalCoef.parentElement.style.transition = "";
                            totalCoef.parentElement.style.width = "47%";
                        })
                    }

                    const tick = matCard.querySelector(".tick-icon");
                    if (tick) {
                        tick.outerHTML = this.draggableIcon(`${notifDiv.dataset.type}-subject-card`, {targetId: `${notifDiv.dataset.targetid}`, type: notifDiv.dataset.type});
                        const dragIcon = matCard.querySelector(".drag-icon");
                        dragIcon.onclick = (e) => {this.dragIconOnClickEvent(e, dragIcon)};
                    }
                }
            }





            // MARK: dragIconOnClickEvent
            dragIconOnClickEvent(e, dragIcon) {
                let subjectCard =  e.target.parentElement.parentElement.parentElement;
                let draggableElement = subjectCard;
                const dropAreaAdd =     document.querySelector(".drop-subject-card.create-ue");
                const dropAreaRemove =  document.querySelector(".drop-subject-card.remove-from-ue");
                const type = dragIcon.dataset.type;
                if (type=="detailed") {
                    subjectCard = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                }
                if (type != "compact") {
                    draggableElement = subjectCard.querySelector(".subject-card-header");
                }
                
                draggableElement.draggable = true;
                draggableElement.ondragstart = (e) => {this.draggedSelectedElementOnDragStartEvent(e, {draggedElement: draggableElement, subjectCard})};
                draggableElement.ondragend = (e) => {this.draggedSelectedElementOnDragEndEvent(e, {draggedElement: draggableElement, subjectCard})};

                // let subjectCardIsAlreadySelected = false;
                // this.selectedSubjectCards.forEach(selectedSubjectCard => {if (selectedSubjectCard == subjectCard) subjectCardIsAlreadySelected = true;})
                // if (!subjectCardIsAlreadySelected) {}
                this.selectedSubjectCards.push(subjectCard);
                if (!this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue]) { this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue] = []; };
                this.selectedSubjectCardsSortedByUe[subjectCard.dataset.ue].push({subjectCard, selectionIndex: this.selectedSubjectCards.length-1});

                document.querySelectorAll(".grades-table-teacher").forEach(teacher =>   {teacher.style.display =  "none"})
                document.querySelectorAll(".ue-title.input").forEach(input => {
                    input.parentElement.style.transition = "width 0.3s ease";
                    input.parentElement.style.width = "30%";
                })
                document.querySelectorAll(".ue-subject-total-coef-value").forEach(totalCoef => {
                    totalCoef.parentElement.style.transition = "width 0.3s ease";
                    totalCoef.parentElement.style.width = "56%";
                })
                dropAreaAdd.classList.add("show");
                dropAreaRemove.classList.add("show");
                document.querySelector(".semester-content").classList.add("dragging");

                dragIcon.outerHTML = `<div class="tick-icon for-${type}-subject-card" data-type="${type}">✔</div>`;
                const tick = subjectCard.querySelector(".tick-icon");
                tick.dataset.targetid = subjectCard.id;
                tick.onclick = (e) => {this.tickIconOnClickEvent(e, tick)};

                const selectionNotifDiv = this.addSelectedCardNotifDiv(subjectCard.dataset.semester, subjectCard.dataset.subject, type, subjectCard.id);

                document.querySelector(".selected-subject-card-notif-container").appendChild(selectionNotifDiv);
                this.notifDelBtnAttachListener(selectionNotifDiv.querySelector(".selected-subject-card-notif-div-del-btn"));

                let highestWidth = 0;
                document.querySelectorAll(".selected-subject-card-notif-div").forEach(notifDiv => {if (highestWidth < notifDiv.clientWidth) highestWidth = notifDiv.clientWidth;})
                document.querySelector(".selected-subject-card-notif-container").style.left = `calc(99% - ${100 * highestWidth/document.body.clientWidth}%`;

                setTimeout(()=>{selectionNotifDiv.classList.add("on")}, 10)
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





            // MARK: dropAreaToNewAction
            dropAreaToNewAction(cardId, index=0) {
                const sem = this.currentSemester;
                let newUeConfig = {subjects: [], coefficients: {}, custom: {}};
                let newUeName = "Module 1"; let count = 1;
                if (!this.ueConfig[sem]) this.ueConfig[sem] = {__ues__: []};
                while (this.ueConfig?.[sem]?.[newUeName]) {count++; newUeName = `Module ${count}`;}

                if (cardId) {
                    const card = document.getElementById(cardId);
                    if (card.classList.contains('subject-card')) {
                        let cardIsSelected = false;
                        this.selectedSubjectCards.forEach(selectedSubjectCard => {if (selectedSubjectCard == card) cardIsSelected = true;});

                        let subject, oldUeName, manageSim = true;
                        if (!this.sim[sem]) manageSim = false;
                        
                        if (!cardIsSelected) {  // 1 unselected subj card dropped in the drop area "add"
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
                                    delete this.ueConfig[sem][oldUeName].custom[subject];


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

                                if (this.ueConfig[sem][oldUeName].subjects.length == 0) {
                                    this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                    delete this.ueConfig[sem][oldUeName];
                                }

                            } 
                            else {
                                newUeConfig = {subjects: [subject], coefficients: {[subject]: 100}, custom: {[subject]: false}};
                            }

                        } else {  // mutliple subj cards dropped through selection in the drop area "add"
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
                                    const subjectCard = selectedSubjectCard.subjectCard;
                                    const selectionIndex = selectedSubjectCard.selectionIndex;
                                    subject = subjectCard.dataset.subject;

                                    if (selectionIndex+1 == this.selectedSubjectCards.length) {
                                        newUeConfig.coefficients[subject] = remainingCoef;
                                    } else {
                                        const coef = Math.round(100/this.selectedSubjectCards.length);
                                        newUeConfig.coefficients[subject] = coef;
                                        remainingCoef -= coef;
                                    }

                                    newUeConfig.custom[subject] = false;
                                    newUeConfig.subjects[selectionIndex] = subject;
                                    

                                    if (!subjectCard.classList.contains("unclassified")) {
                                        newUeConfig.custom[subject] = this.ueConfig[sem][oldUeName].custom[subject];

                                        // removing the subject card from its former UE
                                        const oldUeIndex = this.ueConfig[sem].__ues__.indexOf(oldUeName);                       // get the old ue's index in the ues ordered array of the semester
                                        const subjectIndexInOldUe = this.ueConfig[sem][oldUeName].subjects.indexOf(subject);    // get the subject's index in the subjects ordered array of the old ue
                                        delete  this.ueConfig[sem][oldUeName].coefficients[subject];                            // delete coefficient data
                                        delete  this.ueConfig[sem][oldUeName].custom[subject];                                  // delete custom data
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
                                            this.deleteUnusedSimPath(sem, oldUeName, subject);
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
                    newUeConfig.custom[newSubjName] = true;
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
                this.scrollToClientHighestElemWithClassWithTimeout({id: `ue-card-${newUeName}-in-semester-${sem}`, smooth: true})
            }


            // MARK: dropAreaRemoveAction
            dropAreaRemoveAction(cardId) {
                const card = document.getElementById(cardId);

                let cardIsSelected = false;
                this.selectedSubjectCards.forEach(selectedSubjectCard => {if (selectedSubjectCard.id == card.id) cardIsSelected = true;})

                if (card.classList.contains("subject-card") && !card.classList.contains("unclassified")) {
                    const sem = card.dataset.semester;
                    const ue = card.dataset.ue;
                    const subj = card.dataset.subject;

                    if (!cardIsSelected) {

                        const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                        const subjectIndex = this.ueConfig[sem][ue].subjects.indexOf(subj);
                                this.ueConfig[sem][ue].subjects.splice(subjectIndex,1);
                        delete  this.ueConfig[sem][ue].coefficients[subj];
                        delete  this.ueConfig[sem][ue].custom[subj];

                        if (this.ueConfig[sem][ue].subjects.length == 0) {
                            this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                            delete this.ueConfig[sem][ue];
                        }
                    }
                    else {
                        let subject = "";
                        this.selectedSubjectCards.forEach(selectedSubjectCard => {
                            subject = selectedSubjectCard.dataset.subject;
                            const ueIndex = this.ueConfig[sem].__ues__.indexOf(ue);
                            const subjectIndex = this.ueConfig[sem][ue].subjects.indexOf(subject);
                                    this.ueConfig[sem][ue].subjects.splice(subjectIndex,1);
                            delete  this.ueConfig[sem][ue].coefficients[subject];
                            delete  this.ueConfig[sem][ue].custom[subject];

                            if (this.ueConfig[sem][ue].subjects.length == 0) {
                                this.ueConfig[sem].__ues__.splice(ueIndex, 1);
                                delete this.ueConfig[sem][ue];
                            }
                        })
                    }

                    if (this.ueConfig[sem].__ues__.length == 0) {delete this.ueConfig[sem]}

                    this.removeSubjectCardFromSubjectSelection({elementDroppedInArea:card});
                    this.saveConfig();
                    this.getGradesDatas();
                    this.renderContent();
                    this.attachEventListeners();
                }
                else if (card.classList.contains("subject-card") && card.classList.contains("unclassified") && cardIsSelected) {
                    this.removeSubjectCardFromSubjectSelection({elementDroppedInArea:card});
                }
                else if (card.classList.contains("ue-card")) {}

            }


            // MARK: dropAreaSubjectInsertAction
            dropAreaSubjectInsertAction(cardId, index=-1) {
                const card = document.getElementById(cardId);
                if (card.classList.contains('subject-card')) {
                    let cardIsSelected = false;
                    this.selectedSubjectCards.forEach(selectedSubjectCard => {if (selectedSubjectCard.id == card.id) cardIsSelected = true;})
                    const sem = card.dataset.semester;
                    let subject, oldUeName, manageSim = true;
                    if (!this.ueConfig[sem]) this.ueConfig[sem] = {}; if (!this.sim[sem]) manageSim = false;
                    let newUeName = "Module 1"; let count = 1;
                    while (this.ueConfig[sem][newUeName]) {count++; newUeName = `Module ${count}`;}

                    // Subj card is dropped in the drop area Add
                    /* // Adding a [newUeName] property to this.ueConfig as its first property, so that any new module appears first in the module section
                    this.ueConfig[sem] = {[newUeName]: {subjects: [], coefficients: {}, custom: {}}, ...this.ueConfig[sem]}; */
                    this.ueConfig[sem][newUeName] = {subjects: [], coefficients: {}, custom: {}};

                    if (!cardIsSelected) {
                        subject = card.dataset.subject;
                        if (!card.classList.contains("unclassified")) {
                            // removing the subj card if it was in an ue

                            oldUeName = card.dataset.ue;
                            const subjectIndex = this.ueConfig[sem][oldUeName].subjects.indexOf(subject);
                            this.ueConfig[sem][oldUeName].subjects.splice(subjectIndex,1);
                            delete this.ueConfig[sem][oldUeName].coefficients[subject];
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
                        this.ueConfig[sem][newUeName].subjects.splice(index, 0, subject);
                        this.ueConfig[sem][newUeName].coefficients[subject] = 0;
                        this.ueConfig[sem][newUeName].custom[subject] = false;
                    }
                    else
                    {
                        let remainingCoef = 100;
                        const nbCurrSubjects = this.ueConfig[sem][newUeName].subjects.length;
                        const nbNewSubjects = this.selectedSubjectCards.length;

                        this.selectedSubjectCards.forEach((selectedSubjectCard, index) => {
                            subject = selectedSubjectCard.dataset.subject;

                            if (nbCurrSubjects > 0) {
                                this.ueConfig[sem][newUeName].subjects.forEach(_mat => {
                                    this.ueConfig[sem][newUeName].coefficients[subject]
                                })
                            }

                            this.ueConfig[sem][newUeName].subjects.push(subject);
                            this.ueConfig[sem][newUeName].coefficients[subject] = Math.round(100/this.selectedSubjectCards.length);
                            this.ueConfig[sem][newUeName].custom[subject] = false;

                            if (this.selectedSubjectCards.length == index+1) {
                                this.ueConfig[sem][newUeName].coefficients[subject] = remainingCoef;
                            }
                            remainingCoef -= this.ueConfig[sem][newUeName].coefficients[subject];

                            if (!selectedSubjectCard.classList.contains("unclassified")) {
                                oldUeName = selectedSubjectCard.dataset.ue
                                subject = selectedSubjectCard.dataset.subject
                                const subjectIndex = this.ueConfig[sem][oldUeName].subjects.indexOf(subject);
                                this.ueConfig[sem][oldUeName].subjects.splice(subjectIndex,1);
                                delete this.ueConfig[sem][oldUeName].subjects[subject];
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
                    
                    this.removeSubjectCardFromSubjectSelection({elementDroppedInArea:card});
                    this.saveConfig();
                    this.getGradesDatas();
                    this.renderContent(true);
                    this.attachEventListeners();
                    this.scrollToClientHighestElemWithClassWithTimeout({id: `ue-card-${newUeName}-in-semester-${sem}`, smooth: true})
                }
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
                    
                    document.getElementById("currentGrade").onmouseup = (e) => {closeDragElement(e, elmnt)};
                    // call a function whenever the cursor moves:
                    document.getElementById("currentGrade").onmousemove = elementDrag;
                    
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
                    document.getElementById("currentGrade").onmouseup = null;
                    document.getElementById("currentGrade").onmousemove = null;
                    elmnt.style.position = "static";
                    elmnt.style.zIndex = "";
                }
            }

        //#endregion
        





        //#region -Region: Data ↓Imp/Exp↑

            importData(file) {
                this.sim = {};
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

                            // If parsed contains semesters with simulated grades, apply them to this.sim
                            if (parsed && parsed.semesters) {
                                // Reset current sim and populate from file where available
                                const newSim = {};
                                Object.keys(parsed.semesters).forEach(sem => {
                                    const semObj = parsed.semesters[sem] || {};
                                    const uesObj = semObj.ues || {};
                                    Object.keys(uesObj).forEach(ueName => {
                                        const simulees = uesObj[ueName].simulees || {};
                                        if (!newSim[sem]) newSim[sem] = {};
                                        newSim[sem][ueName] = simulees;
                                    });
                                });
                                // merge with existing sim to preserve structure where file doesn't provide
                                this.sim = Object.assign({}, this.sim || {}, newSim);
                                try { localStorage.setItem('ECAM_DASHBOARD_SIM_gradeS', JSON.stringify(this.sim)); } catch (e) {}
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
                    semesters: {}
                };
                Object.keys(this.semesters).forEach(sem => {
                    if (!data.semesters[sem]) data.semesters[sem] = { ues: {} };
                    if (this.ueConfig[sem]) {
                        Object.keys(this.ueConfig[sem]).forEach(ue => {
                            // const ueGrades = this.calculateUEGrades(sem, ue);
                            data.semesters[sem].ues[ue] = {
                                subjects: this.ueConfig[sem][ue].subjects,
                                coefficients: this.ueConfig[sem][ue].coefficients,
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
                a.download = `ecam_grades_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
            }

        //#endregion






        // MARK: -Keyboard Events
        generalKeyboardEvents() {
            document.onkeydown = (e) => {
                if (e.key === "Shift") {
                    document.onkeydown = (e) => {
                        if (e.key === "E") {
                            this.editMode = !this.editMode;

                            this.removeSubjectCardFromSubjectSelection();
                            this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.subject-card.unclassified"});
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

                            this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.subject-card.unclassified"});
                            this.renderContent();                      
                        }
                        else if (e.key === "L") {
                            if (this.lang == "fr")
                            {
                                this.lang = "en";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.remove('active')
                                document.getElementById('en-lang-btn').classList.add('active')

                                this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.subject-card.unclassified"});
                                this.languageSensitiveContent(true);
                                this.renderContent();
                            }
                            else if (this.lang == "en")
                            {
                                this.lang = "fr";
                                localStorage.setItem("ECAM_DASHBOARD_DEFAULT_LANGUAGE", this.lang)
                                document.getElementById('fr-lang-btn').classList.add('active')
                                document.getElementById('en-lang-btn').classList.remove('active')

                                this.scrollToClientHighestElemWithClassWithTimeout({className: ".ue-card||.subject-card.unclassified"});
                                this.languageSensitiveContent(true);
                                this.renderContent();
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