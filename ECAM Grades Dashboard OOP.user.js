// ==UserScript==
// @name         ECAM Grades Dashboard
// @version      2.5.3
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


class Grade {
    constructor(grade, classAvg, coef, semester, moduleName, subjectName, title, teacher, date, libelle) {
        this.grade          = grade;
        this.classAvg       = classAvg;
        this.coef           = coef;
        this.semester       = semester;
        this.moduleName     = moduleName;
        this.subjectName    = subjectName;
        this.title          = title;
        this.teacher        = teacher;
        this.date           = date;
        this.libelle        = libelle;
    }
    
}

class Card extends Dashboard {
    constructor(sem, moduleName, subject, index=-1, manageIndividualSubjectCardFolding=true) {
        this.sem = sem;
        this.moduleName = moduleName;
        this.subject = subject;
        this.index = index;
        this.manageIndividualSubjectCardFolding = manageIndividualSubjectCardFolding;

        this.html = "";
    }

}

class SubjectCard extends Card {
    constructor(sem, moduleName, subject, index=-1) {
        super();

        this.html = "";
    }
    
    createSubjCard(sem, moduleName, subject, index=-1, manageIndividualSubjectCardFolding=true) {
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
            (this.detailedSubjCardsId.includes(subjectCardId) && !this.compactSubjCardsId.includes(subjectCardId) && manageIndividualSubjectCardFolding) 
            || 
            (this.viewMode == "detailed" && !manageIndividualSubjectCardFolding)
        ;
        
        if (!manageIndividualSubjectCardFolding) {
            if (detailed)   {this.detailedSubjCardsId.push(subjectCardId); this.compactSubjCardsId.splice(this.compactSubjCardsId.indexOf(subjectCardId), 1)} 
            else            {this.compactSubjCardsId.push(subjectCardId); this.detailedSubjCardsId.splice(this.detailedSubjCardsId.indexOf(subjectCardId), 1)}
        }

        this.html = `
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


        this.html += `

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

            this.html += `
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

        this.html += `
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


        this.html += `
        </div>
        `;

        return this.html;
    }
}