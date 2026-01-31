// ==UserScript==
// @name         ECAM Grades Dashboard
// @description  Enhances the ECAM intranet with a clean, real-time grades dashboard.
// @version      1.0.1
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
        .ecam-dash { font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; margin: 20px auto; max-width: 1400px; color: #1a1a1a; }
        .dash-header { background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; padding: 30px 40px; border-radius: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 3px 5px 5px 0px #00000042; }
        .dash-title { font-size: 28px; font-weight: 700; margin: 0; }
        .dash-subtitle { font-size: 14px; opacity: 0.95; margin-top: 5px; }
        .lang-btn { border: 2px solid; border-radius: 20px; border-color: #000000ff; background: #6f79ff }
        .lang-btn.active { border-color: #ceefffff}
        .header-actions { display: flex; gap: 12px; }
        .main-average-card { background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 2px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s ease; }
        .main-average-card:hover { border-color: #667eea; box-shadow: 3px 5px 5px 0px #00000042; }
        .average-display { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 7px; }
        .average-number { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
        .average-label { font-size: 18px; color: #666; font-weight: 500; }
        .average-stats { display: flex; gap: 30px; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
        .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
        .controls-bar { background: white; border-radius: 16px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #e5e5e5; }
        .filter-title { border: 2px solid #b3bbe7; border-radius: 20px; color: white; font-weight: 700; font-size: 14px; padding: 10px 15px; margin-right: 70%; margin-bottom: -15px; background: linear-gradient(45deg, #446dff 20%, #1222ff12 75%); position: relative; transition: all 0.2s ease; }
        .filter-title:hover { box-shadow: 3px 5px 5px 0px #00000042; }
        .filter-tabs { display: flex; background: #f7f7f7; padding: 4px; border-radius: 12px; gap: 4px; }
        .filter-tab { padding: 10px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: all 0.2s ease; font-size: 14px; }
        .filter-tab:hover { background: #fff; color: #333; transform: scale(1.1); box-shadow: 3px 5px 5px 0px #00000042; }
        .filter-tab.active { background: white; color: #667eea; box-shadow: 3px 5px 5px 0px #00000042; }
        .view-toggle { display: flex; gap: 8px; background: #f7f7f7; padding: 4px; border-radius: 8px; }
        .view-btn { padding: 8px 12px; background: transparent; border: none; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; }
        .view-btn.active { background: white; box-shadow: 3px 5px 5px 0px #00000042; }
        .view-btn:hover  { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
        .content-area { display: grid; gap: 24px; }
        .intranet-collapse { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; }
        .intranet-collapse:hover { background: #f3f4f6; }
        .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
        .intranet-toggle.openLeft { transform: rotate(-180deg); }
        .intranet-toggle.openRight { transform: rotate(180deg); }
        .semester-section { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
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
        .semester-content { padding: 24px; display: none; }
        .semester-content.show { display: block; }
        .ue-grid { display: grid; gap: 20px; margin-bottom: 24px; }
        .ue-card { background: #fafafa; border-radius: 16px; border: 2px solid #e5e5e5; transition: all 0.3s ease; }
        .ue-card.validated { border-color: #10b981; background: #f0fdf4; }
        .ue-card.failed { border-color: #ef4444; background: #fef2f2; }
        .ue-card.unknown { border-color: #6d6d6dff; background: #d1d1d1ff; }
        .ue-header { display: flex; border-radius: 16px; justify-content: space-between; align-items: start; padding: 22px 20px 20px 20px; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px; }
        .ue-header:hover { background: #f3f4f6; }
        .ue-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .ue-moyenne { font-size: 20px; font-weight: 700; display: flex;}
        .ue-moyenne.good { color: #10b981; }
        .ue-moyenne.bad { color: #ef4444; }
        .ue-moyenne.unknown { color: #6d6d6dff; }
        .mat-moyenne { font-weight: 800; }
        .mat-moyenne.good { color: #10b981; }
        .mat-moyenne.bad { color: #ef4444; }
        .ue-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; margin-left: 5px; }
        .ue-toggle.open { transform: rotate(180deg); }
        .notes-table { width: 98%; border-collapse: separate; border-spacing: 0; padding-right: 20px; margin: 12px 20px 20px 20px; }
        .notes-table.compact { margin: -12px 20px 20px 20px; }
        .notes-table th { background: #f9fafb; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e5e5; }
        .notes-table td { padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        .notes-table tr:hover { background: #c9d8e7ff; }
        .note-value { font-weight: 600; font-size: 16px; }
        .note-good { color: #10b981; } .note-medium { color: #f59e0b; } .note-bad { color: #ef4444; }
        .matiere-name { font-weight: 500; color: #1a1a1a; }
        .note-type { font-size: 12px; color: #666; margin-top: 2px; }
        .note-date { font-size: 12px; color: #999; }
        .unclassified-section { background: #fff8f0; border-radius: 16px; padding: 20px; border: 2px dashed #fbbf24; margin-top: 20px; }
        .unclassified-title { font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .config-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px); }
        .config-content { background: white; border-radius: 24px; width: 90%; max-width: 1000px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 3px 5px 5px 0px #00000042; }
        .config-header { padding: 24px 30px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; }
        .config-title { font-size: 22px; font-weight: 700; color: #1a1a1a; }
        .config-close { width: 36px; height: 36px; border-radius: 50%; border: none; background: #f3f4f6; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; font-size: 20px; }
        .config-close:hover { background: #e5e7eb; transform: scale(1.1); }
        .config-body { padding: 30px; overflow-y: auto; flex: 1; }
        .config-layout { display: grid; grid-template-columns: 360px 1fr; gap: 30px; height: 100%; }
        .config-sidebar { border-right: 1px solid #e5e5e5; padding-right: 30px; }
        .config-main { overflow-y: auto; }
        .semester-selector { margin-bottom: 24px; }
        .semester-selector label { display: block; font-size: 14px; font-weight: 600; color: #666; margin-bottom: 8px; }
        .semester-select { width: 100%; padding: 10px 14px; border: 2px solid #e5e5e5; border-radius: 10px; font-size: 14px; font-weight: 500; background: white; cursor: pointer; transition: all 0.2s ease; }
        .semester-select:hover { border-color: #667eea; }
        .semester-select:focus { outline: none; border-color: #667eea; box-shadow: 3px 5px 5px 0px #00000042; }
        .matieres-pool { background: #f9fafb; border-radius: 12px; padding: 16px; min-height: 200px; }
        .pool-title { font-size: 14px; font-weight: 600; color: #666; margin-bottom: 12px; display:flex; align-items:center; justify-content:space-between;}
        .pool-actions { display:flex; gap:8px;}
        .matiere-row { display:flex; align-items:center; gap:10px; padding:8px 10px; background:white; border:2px solid #e5e5e5; border-radius:10px; margin:6px 0; }
        .matiere-row.used { background:#eff6ff; border-color:#667eea; opacity:0.8; }
        .create-ue-section { margin-bottom: 24px; }
        .create-ue-header { display: flex; gap: 12px; margin-bottom: 16px; }
        .ue-name-input { flex: 1; padding: 10px 14px; background: #d3d3d3ff ; border: 2px solid #a7a7a7ff; border-radius: 10px; font-size: 14px; transition: all 0.2s ease; }
        .ue-name-input:focus { outline: none; border-color: #667eea; box-shadow: 3px 5px 5px 0px #00000042; }
        .create-ue-btn { padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
        .create-ue-btn:hover { transform: scale(1.1); box-shadow: 3px 5px 5px 0px #00000042; }
        .create-ue-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .ue-edit-card { background: white; border: 2px solid #e5e5e5; border-radius: 12px; padding: 16px; margin-bottom: 16px; transition: all 0.2s ease; }
        .ue-edit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ue-edit-title { font-size: 16px; font-weight: 600; color: #1a1a1a; }
        .ue-delete-btn { width: 28px; height: 28px; border-radius: 50%; border: none; background: #fee2e2; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
        .ue-delete-btn:hover { background: #ef4444; color: white; transform: scale(1.1); }
        .ue-matieres-container { min-height: 60px; background: #f9fafb; border-radius: 8px; padding: 12px; border: 2px solid #e5e5e5; transition: all 0.2s ease; }
        .matiere-in-ue { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 10px; background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; }
        .matiere-ue-name { font-size: 14px; font-weight: 500; color: #1a1a1a; }
        .percentage-input { width: 70px; padding: 4px 8px; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 14px; text-align: right; }
        .remove-matiere-btn { border:none; background:#f3f4f6; border-radius:6px; padding:6px 8px; cursor:pointer; }
        .percentage-total { margin-top: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
        .percentage-total.valid { background: #f0fdf4; color: #10b981; }
        .percentage-total.invalid { background: #fef2f2; color: #ef4444; }
        .auto-adjust-btn, .add-selected-btn { padding: 4px 12px; background: white; border: 1px solid currentColor; border-radius: 6px; font-size: 12px; cursor: pointer; }
        .btn { padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px; }
        .btn-config { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: grid; }
        .btn-config:hover:not(:disabled) { transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
        .btn-export { background: white; color: #666; border: 2px solid #e5e5e5; display: flex; align-items: center; }
        .btn-export:hover { border-color: #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
        .btn-import { background: white; color: #666; border: 2px solid #e5e5e5; display: flex; align-items: center; }
        .btn-import:hover { border-color: #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
        .btn-icon { font-size: 20px }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .note-simulee-input { border-radius: 10px; border-color: #667eea; padding: 2px 10px}
        .note-checkbox { cursor: pointer; }
        @media (max-width: 768px){ .config-layout { grid-template-columns:1fr; } .config-sidebar { border-right:none; border-bottom:1px solid #e5e5e5; padding-right:0; padding-bottom:20px; } .dash-header { flex-direction:column; align-items:start; gap:16px; } .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } }
        .loading { text-align: center; padding: 40px; color: #999; }
        .loading::after { content: '...'; animation: dots 1.5s steps(4, end) infinite; }
        @keyframes dots { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    class ECAMDashboard {
        constructor() {
            this.notes = [];
            this.semestres = {};
            this.ueConfig = JSON.parse(localStorage.getItem("ECAM_UE_CONFIG_V2")) || {};
            this.sim = JSON.parse(localStorage.getItem("ECAM_SIM_NOTES_V1")) || {}; // simulations
            this.ignoredGrades = JSON.parse(localStorage.getItem("ECAM_IGNORED_GRADES_V1")) || [];
            this.defSem = localStorage.getItem("ECAM_DEFAULT_SEMESTER") || "last";
            this.currentSemester = this.defSem;
            this.defView = localStorage.getItem("ECAM_DEFAULT_VIEW_MODE") || "detailed";
            this.viewMode = this.defView;
            this.lang = localStorage.getItem("ECAM_DEFAULT_LANGUAGE") || "fr";
            this.tempSelection = {}; // { [sem]: Set<matiere> }
            this.init();
        }

        // ===== helpers simulation =====
        saveConfig() { localStorage.setItem('ECAM_UE_CONFIG_V2', JSON.stringify(this.ueConfig)); }
        saveSim(){ localStorage.setItem("ECAM_SIM_NOTES_V1", JSON.stringify(this.sim)); }
        saveignoredGrades(){ localStorage.setItem("ECAM_IGNORED_GRADES_V1", JSON.stringify(this.ignoredGrades)); }
        ensureSimPath(sem, ue, mat){
            if(!this.sim[sem]) this.sim[sem]={};
            if(!this.sim[sem][ue]) this.sim[sem][ue]={};
            if(mat !== undefined && !this.sim[sem][ue][mat]) this.sim[sem][ue][mat]=[];
        }
        getSimNotes(sem, ue, mat){ return (this.sim[sem]&&this.sim[sem][ue]&&this.sim[sem][ue][mat])||[]; }
        getAllMatieresForUE(sem, ueData, ueName){
            const real = ueData.matieres || [];
            const simOnly = Object.keys(((this.sim[sem]||{})[ueName]||{}));
            return Array.from(new Set([...real, ...simOnly]));
        }

        init() {
            this.parseNotes();
            this.createDashboard();
            this.attachEventListeners();
        }

        parseNotes() {
            const rows = document.querySelectorAll("table.greyGridTable tbody tr");
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                    const note = parseFloat(cells[0].textContent.replace("/20", "").replace(",", ".")) || 0;
                    const libelle = cells[1].textContent.trim();
                    const coef = parseFloat(cells[2].textContent.replace("%", "").replace(",", ".")) || 0;
                    const prof = cells[4].textContent.trim();
                    const date = cells[5].textContent.trim();
                    const semMatch = libelle.match(/Semester\s+(\d+)/i);
                    const semestre = semMatch ? semMatch[1] : "?";
                    const parts = libelle.split(" - ").map(p => p.trim());
                    const matiere = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
                    const type = parts.length >= 2 ? parts.at(-1) : "";
                    this.notes.push({ note, coef, semestre, matiere, type, prof, date, libelle });
                }
            });
            this.notes.forEach(n => {
                if (!this.semestres[n.semestre]) this.semestres[n.semestre] = {};
                if (!this.semestres[n.semestre][n.matiere]) this.semestres[n.semestre][n.matiere] = [];
                this.semestres[n.semestre][n.matiere].push(n);
            });
        }

        moyennePonderee(arr) {
            if (!arr || arr.length === 0) return 0;
            let total = 0, coeffs = 0;
            arr.forEach(n => { 
                if (this.ignoredGrades.indexOf([n.semestre, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1) {
                    total += n.note * (n.coef||0); coeffs += (n.coef||0); 
                }
            });
            const v = coeffs ? (total / coeffs) : 0;
            return Number.isFinite(v) ? Number(v.toFixed(2)) : 0;
        }

        getNoteColor(note) { if (note >= 14) return 'good'; if (note >= 10) return 'medium'; return 'bad'; }
        getAverageColor(avg) { if (avg >= 14) return 'average-good'; if (avg >= 10) return 'average-medium'; return 'average-bad'; }

        createDashboard() {
            const container = document.createElement("div");
            container.className = "ecam-dash";
            const moyenneGenerale = this.moyennePonderee(this.notes);
            const totalNotes = this.notes.length;
            const ueStats = this.getUEStats();

            container.innerHTML = `
            <div class="dash-header">
                <div style="display: bloc">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/ECAM-LaSalle-bleu-seul.png" alt="ECAM Logo" style="margin: -136px -444px -121px -43px; height: 141px; width: 148px;">
                    <div style="margin: 0px 40px 0px 100px;">
                        <h1 class="dash-title"></h1>
                        <p class="dash-subtitle"></p>
                        <div style="display: block">
                            <button class="lang-btn ${this.lang == "fr" ? "active" : ""}" id="fr-lang-btn">
                                <image style="width:20px; height:20px" alt="🇫🇷" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACTUExURUdwTAAkjM7Pzs7OzrMGE74QIMPEx4hTeAAkjQARewAagbIFEgAfhc3NzdDQ0M7PzrYMG8zMzbcMG8EXKcUbLQAMd7UKGLUKGMMWJ7OhrcMVJv///+oPIO4bLgAmoOwWKAAZmQArpO8iNgAfnQATlAIyqLUGFAEoksUSIwAYhgANePnCyMbO6djY2NUWJ+7u7sCep4f8c74AAAAbdFJOUwDL+z19ffsVe3qU1jy51pA+bLyNc+Vrnu+m2KjIWToAAALxSURBVFjD7djJcuIwEIDhAAMOxuwTCAnyKgxOxg7v/3SjtraWDJKTUw60K1Vc+OqX5APK09NjHvOLJxDz3a+t9Mcoeg7DgZrDcrkejUZBL2X7NuYfo4gRZ2MmNZvhYjEHz1EYrHab18tl3LaEEonFnOPT5KtWM1zMhReY27DabUG5ABQ8cyXLTnIy9pz+vcN8seFWPRxC32G7Hf+FGW/3m7fXVmkagJ5NpGXYCOjd5Or6ejGmaRpCctJw6HTqOgaEvM8GT07ynP0RXhTbSqcIzWduDWOIgHBRJqmeELkJtQB34v4QUUs7o8MSC4t7FYECkF2UKYW9Sb2KRI8FqVWB06OI4KJSQRnuyXoUiW0mHUj2iPFAJEdOoiGVE/OV+SCxqLxTpI+LT+GGcE8Cj4AypAiqcEDyrPTSFHSS25zxnMIH6W2GnsQsitVGM8sBEf36AAOOASkDHg+EcuyiWLw+TAHGCdk5EqrOKqhQjgfCJ8ahPxxCx1W0K0tdUG4qCJKrAoMXpd4i7BwFpM+rkJNmbijh7w+xIHRanPFAiXx/khuQ7mFM6i9CzFFAlQiSDHPcRQneoCM8uqhA29NOfB/Sr48MUkWF3uY0bVfmgqyF6aIKHVcqgpxFMETlGHtkrMoDdXKYVMqlqRxhUReUmBuNiro9KXVCcllcOaoiq4emlPaAOJMoaCogHdNSXgg7GEqRRL1FR709FqRzKO0PdYt0D6X+IrWqTlGnh9LzPYgk1rIQlKogqqj70NHYZgR9VN0eJ2Ttj1GkT6udygN1BhVR/vQp6m6RUYRzfl5k1lSeItfSOFBVH3KqCfw8vwPZTRddhAgx1+GE3T6GdW2CN4oYU5Y7gITy8jIIwymfMDzM54tJOy1XC86E2G0GlHKzCxjUIoNwGtmXqGA0Wi+X0uPgVd1DhFGWs/0KvjgFhSGOyyl4su9aGjPbcAWglzDqdd9k99L1ennYzMRs9tvdaqW/GkXfvAbL+/NT8PhXwmN+7/wHgdqiCaxyTNQAAAAASUVORK5CYII=">
                            </button>
                            <button class="lang-btn ${this.lang == "en" ? "active" : ""}" id="en-lang-btn">
                                <image style="width:20px; height:20px" alt="🇬🇧" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAECUExURUdwTL6/w7pOXQcmd3aItpsCC7IaMURBdgAKW8rJy7QIJtPS0gIUZgASY7h7hZ4BDgADTwMofAASYxEka8/KywATZby0uQgda6gFGbpoc6QTIgAHVgAdcrC0v56jsszMzKkCFk1djU1Yg32Prv///8sBGNMHJs8CHdQLLAAegwATeNEDIAAujwAKZtYRMgANa9YgPAAoiP79/cQAEeZ9i+vt89Xc6wEKXPn3+N9vfhg/lOmKlwImfPPKzwIZb83U5fvu8AADTdtGXN9YaoydwxcwgfK8w11zrPfV2UNfovnh5Nk0TOycp7jD2t3d3TFLk6iz0fCttqsBEr0OLcy5vMWboL7jb4MAAAAkdFJOUwD+/X39/3kQfoH+/ShvJ4HW15JNuady6j+76b+/7/FQt331fQrzi9EAAAaxSURBVFjD7Zhpe6JYE4bd2mVMJz0TJ1t30t3zIiIkigjIIkoDsrihifn/f+WtOueAmjhz9XybD/1ovEyE26eqTp0lhcIv/dJ/VzXQWY3oX913fr5HnF1+/OPPL78zffnzj/LHy7Pzn+HVbi5uGwz4tdWqWOPxYHys3+9btxfVm5t/4NXOq9/uSjsE1b62muv1urmJrMHgkTxRCJoVm+ZvoLtvt42ry7Ozo4ghCWeXjVbp+bm0azYK51etNUozFGMaWY+HGlhTzXx5QZTZvJ9dX3+BiOvlj6ByHfJwfV3ZIcdZA6haMl8doHCKwnHGJjnAAEhXVKEnCC8v5ro4m+Tq9+HZf5oFu9Jw6MUcAb28yJ4auhyVHlgZBkRBIMFWpla32x2L4h6XrhxPkoCjrB++E5AsL/zlXCEkZZWZgjxlIEGwOd3qDsgjU6SHC8LhuOKsDqEtZLkHLC9DaRVr8EgfWWgZCCmM9BhoW1mSfOAoWjqqFxrN3Vb1ZIQBipAMMEUrR0CCkDnaY7rpyrV7Eu/jHVr0BKD/BStNmW/NBUQg+6FBMxU9Dvah5Y5yzCDSY5+XBNUlHBFB5bGVVFaa4agEZcY0vMA6cCTsHRFZgYbp6dmMw0BQHysJdCMmqMXSpTlPGYhHDn8IiqauDemRlwrj7EFY6YpuOKa8N6VHp0Fgx4GwJM/hMs4RiKDcrYemtgat3mMG4nPQAC5CO4I5p98m7kHjfCyngTa35Z4gq+QqI0gIiOdzULIyQrQjL8l3TRPCEUdHjrBfyYUwFnwH41emGoB4PnOEX6SCHZ5+zK1SkYEm5b0jK4mCYDM1ONdxnNCh44BDkEAdJRDVEoolyaRa0JgW41jRQ4OCoGorHTuXKX9DQCDJ5jTdDX1hb0cLBgjpzqKN3mwiaJAEU+3g3iPtQZxrL4DDhgekuSsO0qSy0Q1OaRavCuVko9HGmMfh1lZVE6Sq9nLrxHNXUVQpAxlzJ9wu6djgtE0F8qDTBLivpSr02lqBa0Lb92AQYT/wPB3MPXnh+aqXOzo2nf/iOrb3/OGi0FivsdOg6LSpiDC/pOoS+YGHH8auYbyJX3HBgNdrDwloZ6IVMnvlKJ5xmKBSPPozMeIQiho7GKUNd/Lt9rDdRhBMbD3G6b2xk7nBJ1Gn05F4AScvCKDTJgwUcVT97YXZEU7akY4FrDZT/uYtKDOUYagb9rrnEB1S2sMD0GF6hKPcvLHDIJ09Bkk56DDLp5Jz6KZ95Idw2h9yUGaGZhIH1InkUDfv/WBoVQIiww+qy4oLtcXiqr4Hw+sYw0hHfoZtufTaQBDY8O0Q+uHNcDNc6BqvwzBYp3dBIQWWxGaRgHw7dt/3fda01IxnYgtJxyQB1ujtnDVttfRKKYY2XW2CDZuHYggyxmsYSEV/dDibPggaG9p6Tm/VHv4qs6bVVkGUWoNuotNG3C6gKRYwgSlqm8SlUrPKu9kG9jBBOvqBK+1a20TpgM7sZEZRYlOAZlhsXZjrTJoZ9eRkpemrSjLrP/1AULFCKV3RCkhc7lKG9Mr2XMPJH0GQlwxkwCwcQ0qN6WYTRMls0n8CIej7bMJW4nRFzDs+2JHVWNuk4myKoDZxpOnk4xAXLN8xNmkfGYRDQOXJhC58ND1gp9Ph8cKkK2Yg4miabNgXQdVh/tej8VOmQ1BE0gNbA7CzdKcwI4sMRCoOoNk4INe4tgDDxwth0zJ+BxoQjgJbA7QDWwi6zlBQm4H6YjQleQo9MCWYobaqzPIclfsIIuUyMCwwPU264mlQn+UREgCDmjcdQw/SydMIQXUEEY6rCh3JC7VgJoqnQZBeGp5CM4WuXLBFxhGCSFxzk+/w5lyPuuLfg2A7S8PDMTvEVoNtnqE9RN8RRDm+1IGdU74MH4GGWWjgqT+jbaTArgRRQ+ja191Vof6UICf2pM5iq1UO7Ij9U47QFGsAJVYpavjhrlqop0X4I9kwO2y3k3MYCKevQ1Afck57W4ltEiDOkN/voWmdBUwUzirts3Exwhe4IQ/tEISfjSt6ttBuTfkZQdC0XAzY0q4yGb3V5H5deibm9yDaFqOUbRkUY717Ld2Rtd8hB5zK9afPcGSp45GlDkeWz58/ja4fiqUPoOdnU1uNn6gbanvUh02Zoa2bRVDrqoYbduS06Cmq8OYUddW4/XaHqFLxAYbdkd0fo78ekHLf+Ir3NXalu29VONnV/vZkd3NTvbhtPVz/eCdANb6yU+jV7cXNT503zy8vP2LEn5ggD3BWrZ061v7s6blGjpK1X/9K+KX/sP4PsW55UIo2Nb0AAAAASUVORK5CYII=">
                            </button>
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="btn btn-import" id="importBtn"></button>
                    <button class="btn btn-config" id="configBtn"></button>
                    <button class="btn btn-export" id="exportBtn"></button>
                </div>
            </div>

            <div class="main-average-card">
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

            <div class="filter-title">${this.lang == "fr" ? "Filtre par semestre" : "Filter by semester"}</div>

            <div class="controls-bar">
                <div class="filter-tabs">
                    <button class="filter-tab" data-filter="all">${this.lang == "fr" ? "Tous les semestres" : "Every semester"}</button>
                    ${Object.keys(this.semestres).sort().map(s => `<button class="filter-tab ${this.currentSemester == "last" && s == Object.keys(this.semestres).sort().at(-1) ? "active" : ""}${s == this.currentSemester ? "active" : ""}" data-filter="${s}">${this.lang == "fr" ? "Semestre" : "Semester"} ${s}</button>`).join('')}
                </div>
                <div class="view-toggle">
                    <button class="view-btn ${this.defView == "detailed" ? "active" : ""}" data-view="detailed"    title="${this.lang == "fr" ? "Vue détaillée" : "Detailed view"}">📊</button>
                    <button class="view-btn ${this.defView == "compact" ? "active" : ""}" data-view="compact"     title="${this.lang == "fr" ? "Vue compacte" : "Compact view"}"  >📋</button>
                </div>
            </div>
            <div class="content-area" id="contentArea"></div>
            <div class="intranet-collapse"><div class="intranet-text"><div class="intranet-toggle">▲</div><div class="semester-name"> <div class="intranet-subtext">${this.lang == "fr" ? "Afficher le tableau des notes d'Espace ECAM" : "Show ECAM Intranet's Grades Table"}</div> </div><div class="intranet-toggle">▲</div></div></div>
            <div id="configModal" style="display: none"></div>
            `;

            const originalTable = document.querySelector("table.greyGridTable");
            if (!originalTable) return;
            originalTable.parentNode.insertBefore(container, originalTable);
            originalTable.style.display = "none";
            this.renderContent();
        }

        renderContent() {
               // Reset all ignored grades if entering compact view mode to ensure all grades are counted
               if (this.viewMode == "compact") {
                   this.ignoredGrades = [];
                   this.saveignoredGrades();
               }

            // Language Sensitive text in the Dashboard Header and Semester filter tab
            const dashTitle = document.querySelector(".dash-title");
            const dashSubtitle = document.querySelector(".dash-subtitle");
            dashTitle.innerHTML = `${this.lang == "fr" ? 'ECAM Notes Dashboard' : "ECAM Grades Dashboard"}`;
            dashSubtitle.innerHTML = `${this.lang == "fr" ? 'Vue complète de vos résultats académiques' : "Complete view of your academic results"}`;

            const importBtn = document.getElementById("importBtn");
            const configBtn = document.getElementById("configBtn");
            const exportBtn = document.getElementById("exportBtn");
            importBtn.innerHTML = `${this.lang == "fr" ? "Importer Config"   : "Import Config"     } <span class="btn-icon">⬇️</span>`;
            configBtn.innerHTML = `<span                 >⚙️</span>${this.lang == "fr" ? "Configurer UE" : "Configurate TU"}`;
            exportBtn.innerHTML = `<span class="btn-icon">⬆️</span> ${this.lang == "fr" ? "Exporter Config"   : "Export Config"     }`;

            const avgLabel = document.querySelector(".average-label");
            avgLabel.innerHTML = `/20 ${this.lang == "fr" ? "Moyenne Générale" : "Global Average"}`;

            const statLabelsArray = document.querySelectorAll(".stat-label");
            statLabelsArray[0].innerHTML = `${this.lang == "fr" ? "Notes" : "Grades"}`;
            statLabelsArray[1].innerHTML = `${this.lang == "fr" ? "Semestres" : "Semesters"}`;
            statLabelsArray[2].innerHTML = `${this.lang == "fr" ? "UE Validées" : "Validated TU"}`;

            let counter = 0;
            document.querySelectorAll(".filter-tab").forEach((e) => {
                switch(counter) {
                    case 0:
                        e.innerHTML = `${this.lang == "fr" ? "Tous les semestres" : "Every semester"}`;
                        e.dataset.filter = "all";
                        break;
                    default:
                        e.innerHTML = `${this.lang == "fr" ? "Semestre" : "Semester"} ${counter}`;
                        e.dataset.filter = `${counter}`;
                }
                counter++
            })

            const viewBtnsArray = document.querySelectorAll(".view-btn");
            viewBtnsArray[0].title = this.lang == "fr" ? "Vue détaillée" : "Detailed view";
            viewBtnsArray[1].title = this.lang == "fr" ? "Vue compacte" : "Compact view";

            const intranetSubtext = document.querySelector(".intranet-subtext");
            intranetSubtext.innerHTML = `${this.lang == "fr" ? "Afficher le tableau des notes d'Espace ECAM" : "Show ECAM Intranet's Grades Table"}`;


            // Content area, refreshing often
            const ueStats = this.getUEStats();
            const validatedEUsStatLabel = document.querySelectorAll(".stat-value")[2];
            validatedEUsStatLabel.innerHTML = `${ueStats.validated}/${ueStats.total}`;

            const contentArea = document.getElementById("contentArea");
            var semesterKeys = [];
            if (this.currentSemester === "all") {
                semesterKeys = Object.keys(this.semestres).sort();
            }
            else if (this.currentSemester === "last") {
                semesterKeys = [Object.keys(this.semestres).sort().at(-1)];
            }
            else {
                semesterKeys = [this.currentSemester];
            }
            contentArea.innerHTML = "";
            semesterKeys.forEach(sem => {
                const section = document.createElement("div");
                section.className = "semester-section fade-in";
                const moyenneSem = this.moyennePonderee([].concat(...Object.values(this.semestres[sem] || {})));
                const avgClass = this.getAverageColor(moyenneSem);
                section.innerHTML = `
                <div class="semester-header" data-semester="${sem}">
                    <div class="semester-info">
                    <div class="semester-name">📚 ${this.lang == "fr" ? 'Semestre' : "Semester"} ${sem}</div>
                    <div class="semester-average ${avgClass}">
                        <span>${moyenneSem >= 10 ? '✅' : '⚠️'}</span><span>${moyenneSem}/20</span>
                    </div>
                    </div>
                    <div class="semester-toggle open">▲</div>
                </div>
                <div class="semester-content show" id="sem-content-${sem}"></div>
                `;
                contentArea.appendChild(section);
                this.renderSemesterContent(sem);
            });
        }

        renderSemesterContent(sem) {
            const container = document.getElementById(`sem-content-${sem}`);
            const ueConfig = this.ueConfig[sem] || {};
            let html = '<div class="ue-grid">';
            Object.keys(ueConfig).forEach(ueName => {
                const ueData = ueConfig[ueName];
                const ueNotes = this.calculateUENotes(sem, ueData, ueName);
                const includedNotes = (ueNotes || []).filter(n => this.ignoredGrades.indexOf([sem, n.matiere, n.type+" "+n.date+" "+n.prof].join("\\")) == -1);
                const moyenne = includedNotes.length ? this.moyennePonderee(includedNotes) : " - ";
                const hasSim = (this.sim[sem] && this.sim[sem][ueName] && Object.values(this.sim[sem][ueName]).some(arr=>arr.length>0)) ? true : false;

                html += `
                <div class="ue-card ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'validated' : 'failed'}`}">
                    <div class="ue-header">
                        <div class="ue-title">${ueName}</div>
                        <div class="ue-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}">${moyenne}/20 <div class="ue-toggle open" style="color: #000000">▲</div></div>
                    </div>
                    ${hasSim ? `<div style="font-size:12px;color:#374151;background:#eef2ff;border:1px solid #c7d2fe;padding:6px 8px;border-radius:8px;margin-bottom:8px;">${this.lang == "fr" ? "Inclut des notes simulées" : "Includes simulated grades"}</div>` : ``}
                    ${this.renderNotesTable(ueNotes, ueData, sem, ueName)}
                </div>
                `;
            });

            html += '</div>';

            const unclassified = this.getUnclassifiedMatieres(sem);
            if (unclassified.length > 0) {
                html += `
                <div class="unclassified-section">
                    <div class="unclassified-title">${this.lang == "fr" ? "Matières non classées dans une UE" : "Subject not classified in a TU"}</div>
                    ${this.renderUnclassifiedNotes(sem, unclassified)}
                </div>
                `;
            }
            container.innerHTML = html;

            // listeners des formulaires de suppression de notes simulées
            container.querySelectorAll('.sim-del-btn').forEach(btn=>{
                btn.addEventListener('click', (e)=>{
                    const semX = e.target.dataset.sem;
                    const ueName = e.target.dataset.uen;
                    const mat = e.target.dataset.mat;
                    this.sim[semX][ueName][mat].pop();
                    this.saveSim();
                    this.renderContent();
                })
            })

            // listeners des formulaires d'activation des notes
            this.attachCheckboxListeners(container, sem);

            // listeners des formulaires d'ajout de notes simulées
            container.querySelectorAll('.sim-add-btn').forEach(btn=>{
                btn.addEventListener('click',(e)=>{
                    const ueName = e.target.dataset.uen;
                    const semX = e.target.dataset.sem;
                    const mat = e.target.dataset.mat;
                    const noteInp = container.querySelector(`.sim-inp-note[data-sem="${semX}"][data-mat="${mat}"]`);
                    const coefInp = container.querySelector(`.sim-inp-coef[data-sem="${semX}"][data-mat="${mat}"]`);
                    const dateInp = container.querySelector(`.sim-inp-date[data-sem="${semX}"][data-mat="${mat}"]`);
                    const typeInp = container.querySelector(`.sim-inp-type[data-sem="${semX}"][data-mat="${mat}"]`);
                    const note = parseFloat(noteInp?.value||'');
                    const coef = parseFloat(coefInp?.value||'');
                    const date = dateInp?.value||'';
                    const type = typeInp?.value||'';
                    if(isNaN(note) || isNaN(coef)){ alert(this.lang == "fr" ? "Note et coef requis" : "Grade and coef required"); return; }
                    this.ensureSimPath(semX, ueName, mat);
                    this.sim[semX][ueName][mat].push({
                        note, coef,
                        type: type||'Simulé',
                        date: date||new Date().toLocaleDateString(),
                        prof: '—',
                        matiere: mat,
                        semestre: semX,
                        libelle: `[SIM] ${mat} - ${type||'Simulé'}`,
                        __sim: true
                    });
                    this.saveSim();
                    this.renderContent();
                });
            });

            if (this.viewMode == "compact") {
                   document.querySelectorAll('.ue-header').forEach(header => {
                    if (header.nextElementSibling) {
                        const toggle = header.querySelector('.ue-toggle');
                        const content = header.nextElementSibling;
                        const sem = header.parentElement.parentElement.parentElement.previousElementSibling.dataset.semester;
                        const ueName = header.children[0].innerText;
                        const ueConfig = this.ueConfig[sem] || {};
                        const ueData = ueConfig[ueName];
                        const notes = this.calculateUENotes(sem, ueData, ueName);

                        header.nextElementSibling.innerHTML = this.renderCompactView(notes, ueData, sem, ueName);
                        content.classList.add('compact');
                        toggle.classList.remove('open');
                    }
                });
            }

        }

        attachCheckboxListeners(container, sem) {
            // Reusable method to attach listeners to note checkboxes
            container.querySelectorAll('.note-checkbox').forEach(chbx => {
                chbx.addEventListener('click', (e) => {
                    const semX = e.target.dataset.sem;
                    const ueName = e.target.dataset.uen;
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
                    this.renderContent();
                });
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

        renderNotesTable(notes, ueData, sem, ueName) {
            const notesByMatiere = {};
            const allMats = this.getAllMatieresForUE(sem, ueData, ueName);
            allMats.forEach(m => { notesByMatiere[m] = []; });
            notes.forEach(n => {
                if(!notesByMatiere[n.matiere]) notesByMatiere[n.matiere]=[];
                notesByMatiere[n.matiere].push(n);
            });

            let html = `
            <table class="notes-table">
                <thead>
                    <tr>
                        <th>${this.lang == "fr" ? "Matière / Titre" : "Subject / Title"}</th>
                        <th>${this.lang == "fr" ? "Note" : "Grade"}</th>
                        <th>${this.lang == "fr" ? "Coef" : "Coef"}</th>
                        <th>${this.lang == "fr" ? "Date" : "Date"}</th>
                        <th>${this.lang == "fr" ? "Prof" : "Teacher"}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
            `;

            Object.keys(notesByMatiere).forEach(matiere => {
                const matNotes = notesByMatiere[matiere];
                const moyMat = this.moyennePonderee(matNotes);
                const pct = ueData?.pourcentages?.[matiere] || 0;
                html += `
                <tr style="background:#f9fafb; font-weight:600;">
                    <td colspan="2">
                        <div class="matiere-name">${matiere}</div>
                        <div class="note-type">${this.lang == "fr" ? "Moyenne" : "Average"}: <span class="mat-moyenne ${moyMat==0 ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}">${moyMat==0 ? " - " : moyMat}/20</span> | ${this.lang == "fr" ? "Poids UE" : "TU Weight"}: <span style="font-weight: 800">${pct}%</span> ${matNotes.length===0 ? `<span style="margin-left:2px;font-size:12px;color:#6b7280">${this.lang == "fr" ? "(aucune note publiée)" : "(no published grade)"}</span>` : ''}</div>
                    </td>
                    <td colspan="4"></td>
                </tr>
                `;
                matNotes.forEach(note => {
                    const noteClass = this.getNoteColor(note.note);
                    html += `
                    <tr style="${note.__sim ? 'background: #eef2ff' : ''}">
                        <td style="padding-left:30px;">
                            <span><input type="checkbox" class="note-checkbox" id="note-checkbox-${note.type}-${note.date}-${note.prof}" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}" data-gradeid="${note.type} ${note.date} ${note.prof}" ${this.ignoredGrades.indexOf([sem, matiere, note.type+" "+note.date+" "+note.prof].join("\\")) == -1 ? "checked" : ""}></input></span><span class="note-type"> <label id="note-type-${note.type}-${note.date}" for="note-checkbox-${note.type}-${note.date}">${note.type || ''}${note.__sim ? ` • ${this.lang == "fr" ? "simulée" : "simulated"}` : ''}</label></span>
                        </td>
                        <td><span class="note-value note-${noteClass}">${note.note}/20</span></td>
                        <td>${note.coefOriginal}%</td>
                        <td class="note-date">${note.date||''}</td>
                        <td style="font-size:12px;color:#999;">${`${note.prof.split(" / ").length <= 3 ? note.prof : note.prof.split(" / ").slice(0,3).join(" / ") + " / ... "}`||''}</td>
                        <td>${note.__sim ? `<button class="sim-del-btn" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}">🗑️</button>` : ''}
                    </tr>
                    `;
                });

                // Formulaire d'ajout de note simulée pour cette matière
                html += `
                <tr>
                    <td style="padding-left:30px;">
                        <div class="note-type">${this.lang == "fr" ? "Ajouter une note simulée" : "Add a simulated grade"}</div>
                    </td>
                    <td>
                        <input class="note-simulee-input sim-inp-note" type="number" step="0.5" min="0" max="20" data-sem="${sem}" data-mat="${matiere}" style="width:80px">
                    </td>
                    <td>
                        <input class="note-simulee-input sim-inp-coef" type="number" step="5" min="0" max="100" data-sem="${sem}" data-mat="${matiere}" style="width:80px" placeholder="%">
                    </td>
                    <td>
                        <input class="note-simulee-input sim-inp-date" type="date" data-sem="${sem}" data-mat="${matiere}" style="width:140px">
                    </td>
                    <td colspan="2">
                        <div style="display:flex;gap:6px;align-items:center;">
                            <input type="text" class="sim-inp-type" data-sem="${sem}" data-mat="${matiere}" placeholder="${this.lang == "fr" ? "Écrire" : "Type"}" style="width:110px">
                            <button class="btn-export sim-add-btn" data-sem="${sem}" data-mat="${matiere}" data-uen="${ueName||''}" style="padding:6px 10px;">${this.lang == "fr" ? "Ajouter" : "Add"}</button>
                        </div>
                    </td>
                </tr>
                `;
            });
            html += '</tbody></table>';
            return html;
        }

        renderCompactView(notes, ueData, sem, ueName) {
            const notesByMatiere = {};
            const allMats = this.getAllMatieresForUE(sem, ueData, ueName);
            allMats.forEach(m => { notesByMatiere[m] = []; });
            notes.forEach(n => {
                if(!notesByMatiere[n.matiere]) notesByMatiere[n.matiere]=[];
                notesByMatiere[n.matiere].push(n);
            });

            let html = '<div style="margin-top:16px;">';
            Object.keys(notesByMatiere).forEach(matiere => {
                const matNotes = notesByMatiere[matiere];
                const moyMat = this.moyennePonderee(matNotes);
                const pct = ueData?.pourcentages?.[matiere] || 0;
                html += `
                <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e5e5;">
                    <div>
                    <div style="font-weight:500;">${matiere}</div>
                    <div style="font-size:12px;color:#666;">${matNotes.length===0 ? `• ${this.lang == "fr" ? "aucune publiée" : "no published grade"}` : `${matNotes.length} ${this.lang == "fr" ? "notes" : "grades"}`} • ${pct}% ${this.lang == "fr" ? "de l'UE" : "of the TU"} </div>
                    </div>
                    <div class="mat-moyenne ${moyMat==0 ? '' : `${moyMat>=10 ? 'good' : 'bad'}`}">${moyMat==0 ? " - " : moyMat}/20</div>
                </div>
                `;
            });
            html += '</div>';
            return html;
        }

        renderUnclassifiedNotes(sem, matieres) {
            let html = `
            <table class="notes-table">
                <thead>
                    <tr>
                        <th>${this.lang == "fr" ? "Matière" : "Subject"}</th>
                        <th>${this.lang == "fr" ? "Titre" : "Title"}</th>
                        <th>${this.lang == "fr" ? "Note" : "Grade"}</th>
                        <th>${this.lang == "fr" ? "Coef" : "Coef"}</th>
                        <th>${this.lang == "fr" ? "Date" : "Date"}</th>
                        <th>${this.lang == "fr" ? "Prof" : "Teacher"}</th>
                    </tr>
                </thead>
            <tbody>`;
            matieres.forEach(matiere => {
                const notes = (this.semestres[sem]||{})[matiere]||[];
                const moy = this.moyennePonderee(notes);
                notes.forEach((note, index) => {
                    if (index === 0) {
                        html += `
                        <tr style="background:#fffbeb;">
                            <td rowspan="${notes.length}" style="font-weight:600; vertical-align: top;">
                                ${matiere}
                                <div style="font-size:12px;color:#666;margin-top:4px;">Moy: ${moy}/20</div>
                            </td>
                            <td>${note.type}</td>
                            <td><span class="note-value note-${this.getNoteColor(note.note)}">${note.note}/20</span></td>
                            <td>${note.coef}%</td>
                            <td class="note-date">${note.date}</td>
                            <td>${note.prof}</td>
                        </tr>
                        `;
                    } else {
                        html += `
                        <tr style="background:#fffbeb;">
                            <td>${note.type}</td>
                            <td><span class="note-value note-${this.getNoteColor(note.note)}">${note.note}/20</span></td>
                            <td>${note.coef}%</td>
                            <td class="note-date">${note.date}</td>
                            <td>${note.prof}</td>
                        </tr>
                        `;
                    }
                });
            });
            html += '</tbody></table>';
            return html;
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
                        coefOriginal: n.coef,
                        coef: (n.coef||0) * (pct/100),
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
                    total++; if (moyenne >= 10) validated++;
                });
            });
            return { validated, total };
        }

        // ======== MODAL CONFIG ========
        openConfigModal() {
            const modal = document.getElementById("configModal");
            modal.className = "config-modal";
            modal.style.display = "flex";
            const firstSem = Object.keys(this.semestres).sort()[0] || "1";
            if (!this.tempSelection[firstSem]) this.tempSelection[firstSem] = new Set();

            modal.innerHTML = `
            <div class="config-content">
                <div class="config-header">
                    <h2 class="config-title">Configuration des Unités d'Enseignement</h2>
                    <button class="config-close" id="closeConfig">✕</button>
                </div>
                <div class="config-body">
                    <div class="config-layout">
                        <div class="config-sidebar">
                            <div class="semester-selector">
                            <label>Semestre à configurer</label>
                            <select class="semester-select" id="configSemSelect">
                                ${Object.keys(this.semestres).sort().map(s => `<option value="${s}"; ${s==this.currentSemester ? `selected` : ``}>Semestre ${s} </option>`).join('')}
                            </select>
                            </div>
                            <div class="matieres-pool">
                            <div class="pool-title">
                                <span>Matières disponibles</span>
                                <div class="pool-actions">
                                <button class="auto-adjust-btn" id="selectAll">Tout</button>
                                <button class="auto-adjust-btn" id="clearAll">Aucun</button>
                                </div>
                            </div>
                            <div id="matieresPool"></div>
                        </div>
                    </div>
                    <div class="config-main">
                        <div class="create-ue-section">
                            <div class="create-ue-header">
                                <input type="text" class="ue-name-input" id="newUEName" placeholder="Nom de l'UE (ex: UE1 - Sciences)">
                                <button class="create-ue-btn" id="seedNewUEBtn">Remplir depuis la sélection</button>
                                <button class="create-ue-btn" id="createUEBtn">Créer l'UE</button>
                            </div>
                            <div class="ue-matieres-container" id="newUEContainer">
                                <div class="empty-ue-message">Sélectionnez des matières à gauche puis « Remplir depuis la sélection »</div>
                            </div>
                            <div class="percentage-total" id="newUETotal" style="display:none;">
                                <span>Total: 0%</span>
                                <button class="auto-adjust-btn" id="newUEAutoAdjust">Ajuster à 100%</button>
                            </div>
                        </div>
                        <div id="existingUEs"></div>
                    </div>
                    </div>
                </div>
            </div>
            `;
            document.getElementById('configSemSelect').value = this.currentSemester;
            this.renderConfigContent(this.currentSemester);
            this.attachConfigListeners();
        }

        renderConfigContent(sem) {
            if (!this.tempSelection[sem]) this.tempSelection[sem] = new Set();

            // Pool matières
            const pool = document.getElementById("matieresPool");
            const matieres = Object.keys(this.semestres[sem] || {}).sort((a,b)=>a.localeCompare(b));
            const ueConfig = this.ueConfig[sem] || {};
            const used = new Set();
            Object.values(ueConfig).forEach(ue => (ue.matieres||[]).forEach(m => used.add(m)));

            pool.innerHTML = matieres.map(m => {
                const isUsed = used.has(m);
                const checked = this.tempSelection[sem].has(m) ? 'checked' : '';
                return `
                <label class="matiere-row ${isUsed ? 'used' : ''}">
                    <input type="checkbox" class="pool-checkbox" data-matiere="${m}" ${checked}>
                    <span>${m}</span>
                    ${isUsed ? `<span style="margin-left:auto; font-size:12px; color:#667eea;">déjà dans une UE</span>` : ''}
                </label>
                `;
            }).join('');

            // UEs existantes
            const existingContainer = document.getElementById("existingUEs");
            existingContainer.innerHTML = '<h3 style="margin-top: 30px; margin-bottom: 16px; font-size: 16px;">UE configurées</h3>';

            Object.keys(ueConfig).forEach(ueName => {
                const ue = ueConfig[ueName];
                const totalPct = Object.values(ue.pourcentages||{}).reduce((sum, pct) => sum + pct, 0);
                const card = document.createElement("div");
                card.className = "ue-edit-card";
                card.innerHTML = `
                <div class="ue-edit-header">
                    <div class="ue-edit-title">${ueName}</div>
                    <div style="display:flex; gap:8px;">
                    <button class="add-selected-btn" data-ue="${ueName}" data-sem="${sem}">+ Ajouter à la sélection</button>
                    <button class="ue-delete-btn" data-ue="${ueName}" data-sem="${sem}">✕</button>
                    </div>
                </div>
                <div class="ue-matieres-container" data-ue="${ueName}">
                    ${(ue.matieres||[]).map(m => `
                    <div class="matiere-in-ue" data-matiere="${m}">
                        <div class="matiere-ue-name">${m}</div>
                        <input type="number" class="percentage-input" value="${ue.pourcentages[m] || 0}" min="0" max="100" data-ue="${ueName}" data-matiere="${m}" data-sem="${sem}">
                        <button class="remove-matiere-btn" data-ue="${ueName}" data-matiere="${m}" data-sem="${sem}">Retirer</button>
                    </div>
                    `).join('')}
                </div>
                <div class="percentage-total ${totalPct === 100 ? 'valid' : 'invalid'}" data-ue-total="${ueName}">
                    <span>Total: ${totalPct}%</span>
                    <button class="auto-adjust-btn" data-ue="${ueName}" data-sem="${sem}">Ajuster à 100%</button>
                </div>
                <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
                    <input type="text" placeholder="Nouvelle matière (fantôme)" class="ue-ghost-name" data-ue="${ueName}" data-sem="${sem}" style="flex:1;padding:8px;border:1px solid #e5e5e5;border-radius:8px;">
                    <button class="auto-adjust-btn ue-ghost-add" data-ue="${ueName}" data-sem="${sem}">Ajouter matière</button>
                </div>
                `;
                existingContainer.appendChild(card);
            });

            // Listeners colonne gauche
            pool.querySelectorAll('.pool-checkbox').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const mat = e.target.dataset.matiere;
                    if (e.target.checked) this.tempSelection[sem].add(mat);
                    else this.tempSelection[sem].delete(mat);
                });
            });

            // Listeners cartes UEs
            this.attachExistingUEListeners();
        }

        // ======== Listeners Config ========
        attachConfigListeners() {
            document.getElementById('closeConfig').addEventListener('click', () => {
                document.getElementById('configModal').style.display = 'none';
                this.renderContent();
            });

            const semSelect = document.getElementById('configSemSelect');
            semSelect.addEventListener('change', (e) => this.renderConfigContent(e.target.value));

            // Sélection tout/aucun
            document.getElementById('selectAll').addEventListener('click', () => {
                const sem = semSelect.value;
                const cbs = document.querySelectorAll('#matieresPool .pool-checkbox');
                cbs.forEach(cb => { cb.checked = true; this.tempSelection[sem].add(cb.dataset.matiere); });
            });
            document.getElementById('clearAll').addEventListener('click', () => {
                const sem = semSelect.value;
                const cbs = document.querySelectorAll('#matieresPool .pool-checkbox');
                cbs.forEach(cb => { cb.checked = false; this.tempSelection[sem].delete(cb.dataset.matiere); });
            });

            // Supprimer la note simulée
            document.getElementById('')

            // Pré-remplir la nouvelle UE avec la sélection
            document.getElementById('seedNewUEBtn').addEventListener('click', () => {
                const sem = semSelect.value;
                const sel = Array.from(this.tempSelection[sem]);
                const container = document.getElementById('newUEContainer');
                if (sel.length === 0) {
                    container.innerHTML = '<div class="empty-ue-message">Aucune matière sélectionnée</div>';
                    document.getElementById('newUETotal').style.display = 'none';
                    return;
                }
                const pct = Math.floor(100 / sel.length);
                container.innerHTML = sel.map((m, i) => `
                <div class="matiere-in-ue" data-matiere="${m}">
                    <div class="matiere-ue-name">${m}</div>
                    <input type="number" class="percentage-input newUE" value="${i === sel.length - 1 ? 100 - pct * (sel.length - 1) : pct}" min="0" max="100">
                    <button class="remove-matiere-btn remove-new" data-matiere="${m}">Retirer</button>
                </div>
                `).join('');
                this.updateNewUETotal();
                document.getElementById('newUETotal').style.display = 'flex';

                container.querySelectorAll('.remove-new').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const row = e.target.closest('.matiere-in-ue');
                        row.remove();
                        this.updateNewUETotal();
                    });
                });
                container.querySelectorAll('.percentage-input.newUE').forEach(inp => {
                    inp.addEventListener('change', () => this.updateNewUETotal());
                });
            });

            // Equalize new UE to 100
            document.getElementById('newUEAutoAdjust').addEventListener('click', () => {
                const inputs = Array.from(document.querySelectorAll('.percentage-input.newUE'));
                if (inputs.length === 0) return;
                const pct = Math.floor(100 / inputs.length);
                inputs.forEach((inp, i) => { inp.value = (i === inputs.length - 1 ? 100 - pct * (inputs.length - 1) : pct); });
                this.updateNewUETotal();
            });

            // Créer l’UE
            document.getElementById('createUEBtn').addEventListener('click', () => {
                const sem = semSelect.value;
                const name = document.getElementById('newUEName').value.trim();
                if (!name) { alert('Nom d’UE requis'); return; }
                const rows = Array.from(document.querySelectorAll('#newUEContainer .matiere-in-ue'));
                if (rows.length === 0) { alert('Ajoutez au moins une matière'); return; }
                const matieres = rows.map(r => r.dataset.matiere);
                const pourcentages = {};
                let total = 0;
                rows.forEach((r, i) => {
                    const val = Math.max(0, Math.min(100, parseInt(r.querySelector('.percentage-input').value)||0));
                    pourcentages[r.dataset.matiere] = val;
                    total += val;
                });
                if (total !== 100) { alert('Le total des pourcentages doit faire 100%'); return; }

                if (!this.ueConfig[sem]) this.ueConfig[sem] = {};
                this.ueConfig[sem][name] = { matieres, pourcentages };
                this.saveConfig();

                document.getElementById('newUEName').value = '';
                document.getElementById('newUEContainer').innerHTML = '<div class="empty-ue-message">Sélectionnez des matières à gauche puis « Remplir depuis la sélection »</div>';
                document.getElementById('newUETotal').style.display = 'none';

                this.renderConfigContent(sem);
            });
        }

        updateNewUETotal() {
            const totalDiv = document.getElementById('newUETotal');
            const inputs = Array.from(document.querySelectorAll('.percentage-input.newUE'));
            const total = inputs.reduce((s, i) => s + (parseInt(i.value)||0), 0);
            totalDiv.className = `percentage-total ${total === 100 ? 'valid' : 'invalid'}`;
            totalDiv.querySelector('span').textContent = `Total: ${total}%`;
        }

        attachExistingUEListeners() {
            // Ajout de la sélection aux UEs
            document.querySelectorAll('.add-selected-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const sem = e.target.dataset.sem;
                    const ue = e.target.dataset.ue;
                    const selected = Array.from(this.tempSelection[sem] || []);
                    if (selected.length === 0) { alert('Sélectionnez des matières à gauche'); return; }

                    if (!this.ueConfig[sem] || !this.ueConfig[sem][ue]) return;
                    const ueObj = this.ueConfig[sem][ue];
                    const toAdd = selected.filter(m => !(ueObj.matieres||[]).includes(m));

                    if (toAdd.length === 0) { alert('Aucune nouvelle matière à ajouter'); return; }

                    ueObj.matieres = [...(ueObj.matieres||[]), ...toAdd];
                    // répartition égale
                    const count = ueObj.matieres.length;
                    const base = Math.floor(100 / count);
                    ueObj.matieres.forEach((m, i) => {
                        ueObj.pourcentages[m] = (i === count - 1) ? 100 - base * (count - 1) : base;
                    });
                    this.saveConfig();
                    this.renderConfigContent(sem);
                });
            });

            // Supprimer UE
            document.querySelectorAll('.ue-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ue = e.target.dataset.ue;
                    const sem = e.target.dataset.sem;
                    if (confirm(`Supprimer l'UE "${ue}" ?`)) {
                        delete this.ueConfig[sem][ue];
                        this.saveConfig();
                        this.renderConfigContent(sem);
                    }
                });
            });

            // Retirer matière d’une UE
            document.querySelectorAll('.remove-matiere-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ue = e.target.dataset.ue;
                    const sem = e.target.dataset.sem;
                    const mat = e.target.dataset.matiere;
                    const obj = this.ueConfig[sem][ue];
                    const idx = (obj.matieres||[]).indexOf(mat);
                    if (idx > -1) {
                        obj.matieres.splice(idx, 1);
                        delete obj.pourcentages[mat];
                        const count = obj.matieres.length;
                        if (count > 0) {
                            const base = Math.floor(100 / count);
                            obj.matieres.forEach((m, i) => {
                                obj.pourcentages[m] = (i === count - 1) ? 100 - base * (count - 1) : base;
                            });
                        }
                        this.saveConfig();
                        this.renderConfigContent(sem);
                    }
                });
            });

            // Modifier pourcentages dans UEs
            document.querySelectorAll('.percentage-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const ue = e.target.dataset.ue;
                    const matiere = e.target.dataset.matiere;
                    const sem = e.target.dataset.sem;
                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                    this.ueConfig[sem][ue].pourcentages[matiere] = val;
                    this.saveConfig();

                    const totalPct = Object.values(this.ueConfig[sem][ue].pourcentages).reduce((s, p) => s + p, 0);
                    const totalDiv = document.querySelector(`.percentage-total[data-ue-total="${ue}"]`);
                    if (totalDiv){
                        totalDiv.className = `percentage-total ${totalPct === 100 ? 'valid' : 'invalid'}`;
                        totalDiv.querySelector('span').textContent = `Total: ${totalPct}%`;
                    }
                });
            });

            // Auto adjust à 100%
            document.querySelectorAll('.auto-adjust-btn[data-ue]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ue = e.target.dataset.ue;
                    const sem = e.target.dataset.sem;
                    const obj = this.ueConfig[sem][ue];
                    const count = (obj.matieres||[]).length;
                    if (count === 0) return;
                    const base = Math.floor(100 / count);
                    obj.matieres.forEach((m, i) => {
                        obj.pourcentages[m] = (i === count - 1) ? 100 - base * (count - 1) : base;
                    });
                    this.saveConfig();
                    this.renderConfigContent(sem);
                });
            });

            // Ajouter matière fantôme
            document.querySelectorAll('.ue-ghost-add').forEach(btn=>{
                btn.addEventListener('click',(e)=>{
                    let sem = e.target.dataset.sem;
                    let ue = e.target.dataset.ue;
                    let inp = e.target.parentElement.querySelector(`.ue-ghost-name[data-ue="${ue}"][data-sem="${sem}"]`);
                    let name = (inp.value||'').trim();
                    if(!name){ alert('Nom requis'); return; }
                    let obj = this.ueConfig[sem][ue];
                    obj.matieres = obj.matieres || [];
                    if(!obj.matieres.includes(name)){
                        obj.matieres.push(name);
                        let count = obj.matieres.length;
                        let base = Math.floor(100 / count);
                        obj.pourcentages = obj.pourcentages || {};
                        obj.matieres.forEach((m,i)=>{ obj.pourcentages[m] = (i===count-1) ? 100 - base*(count-1) : base; });
                        this.saveConfig();
                        this.ensureSimPath(sem, ue, name);
                        this.saveSim();
                        this.renderConfigContent(sem);
                        sem = null; ue = null; inp = null; name = null; obj = null; count = null; base = null;
                    } else {
                        alert('Matière déjà présente');
                    }
                });
            });
        }

        attachEventListeners() {

            // Filtres semestre
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentSemester = e.target.dataset.filter;
                    this.renderContent();
                    localStorage.setItem("ECAM_DEFAULT_SEMESTER", this.currentSemester);
                });
            });

            // Toggle vue
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.viewMode = e.target.dataset.view;
                    localStorage.setItem("ECAM_DEFAULT_VIEW_MODE", this.viewMode);
                    this.renderContent();
                });
            });

            // Toggle semestres
            document.addEventListener('click', (e) => {
                if (e.target.closest('.semester-header')) {
                    const header = e.target.closest('.semester-header');
                    const sem = header.dataset.semester;
                    const content = document.getElementById(`sem-content-${sem}`);
                    const toggle = header.querySelector('.semester-toggle');
                    if (content.classList.contains('show')) {
                        content.classList.remove('show'); toggle.classList.remove('open'); content.style.display = 'none';
                    } else {
                        content.classList.add('show'); toggle.classList.add('open'); content.style.display = 'block';
                    }
                }
            });

            // Toggle UEs
            document.addEventListener('click', (e) => {
                if (e.target.closest('.ue-header')) {
                    const header = e.target.closest('.ue-header');
                    const toggle = header.querySelector('.ue-toggle');
                    const content = header.nextElementSibling;
                    const sem = header.parentElement.parentElement.parentElement.previousElementSibling.dataset.semester;
                    const ueName = header.children[0].innerText;
                    const ueConfig = this.ueConfig[sem] || {};
                    const ueData = ueConfig[ueName];
                    const notes = this.calculateUENotes(sem, ueData, ueName);

                    if (toggle.classList.contains('open')) {
                        // Switching to compact view
                        this.clearIgnoredGradesForUE(sem, ueName);
                        // Recalculate notes with cleared ignored grades
                        const updatedNotes = this.calculateUENotes(sem, ueData, ueName);
                        const moyenne = this.moyennePonderee(updatedNotes);
                        // Update the UE average in the header
                        const moyenneDiv = header.querySelector('.ue-moyenne');
                        moyenneDiv.textContent = `${moyenne}/20 `;
                        moyenneDiv.className = `ue-moyenne ${moyenne == " - " ? "unknown" : `${moyenne >= 10 ? 'good' : 'bad'}`}`;
                        moyenneDiv.appendChild(toggle);
                        header.nextElementSibling.innerHTML = this.renderCompactView(updatedNotes, ueData, sem, ueName);
                        content.classList.add('compact');
                        toggle.classList.remove('open');
                    } else {
                        // Switching back to detailed view
                        header.nextElementSibling.innerHTML = this.renderNotesTable(notes, ueData, sem, ueName);
                        content.classList.remove('compact');
                        toggle.classList.add('open');
                        // Reattach checkbox listeners for the detailed view
                        this.attachCheckboxListeners(content, sem);
                    }
                }
            });

            // Toggle intranet table
            document.addEventListener('click', (e) => {
                if (e.target.closest('.intranet-collapse')) {
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
            });

            // Change language to English
            document.getElementById('en-lang-btn').addEventListener('click', () => {
                if (this.lang == "fr")
                {
                    this.lang = "en";
                    localStorage.setItem("ECAM_DEFAULT_LANGUAGE", this.lang)
                    document.getElementById('fr-lang-btn').classList.remove('active')
                    document.getElementById('en-lang-btn').classList.add('active')
                    this.renderContent();
                }
            });

            // Change language to French
            document.getElementById('fr-lang-btn').addEventListener('click', () => {
                if (this.lang == "en")
                {
                    this.lang = "fr";
                    localStorage.setItem("ECAM_DEFAULT_LANGUAGE", this.lang)
                    document.getElementById('fr-lang-btn').classList.add('active')
                    document.getElementById('en-lang-btn').classList.remove('active')
                    this.renderContent();
                }
            });

            // Import
            document.getElementById('importBtn').addEventListener('click', () => this.importData());

            // Config
            document.getElementById('configBtn').addEventListener('click', () => this.openConfigModal());

            // Export
            document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        }
        
        importData(file) {
            return new Promise((resolve, reject) => {
                const handleText = (text) => {
                    try {
                        const parsed = JSON.parse(text);

                        // If parsed contains ueConfig, apply it to the dashboard and persist
                        if (parsed && parsed.ueConfig) {
                            try {
                                this.ueConfig = parsed.ueConfig || {};
                                localStorage.setItem('ECAM_UE_CONFIG_V2', JSON.stringify(this.ueConfig));
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
                            try { localStorage.setItem('ECAM_SIM_NOTES_V1', JSON.stringify(this.sim)); } catch (e) {}
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
                input.addEventListener('change', (e) => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) { document.body.removeChild(input); reject(new Error('No file selected')); return; }
                    const reader = new FileReader();
                    reader.onload = (ev) => { handleText(ev.target.result); document.body.removeChild(input); };
                    reader.onerror = (ev) => { document.body.removeChild(input); reject(ev); };
                    reader.readAsText(f);
                });
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
                        const ueNotes = this.calculateUENotes(sem, this.ueConfig[sem][ue], ue);
                        data.semestres[sem].ues[ue] = {
                            matieres: this.ueConfig[sem][ue].matieres,
                            pourcentages: this.ueConfig[sem][ue].pourcentages,
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
    }

    window.addEventListener('load', () => { new ECAMDashboard(); });
})();