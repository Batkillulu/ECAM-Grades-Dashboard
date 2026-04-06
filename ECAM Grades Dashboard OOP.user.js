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

class Card {
    constructor() {

    }
}

class SubjectCard extends Card {
    constructor() {
        super();
    }
}