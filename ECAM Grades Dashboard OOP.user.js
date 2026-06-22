// ==UserScript==
// @name         ECAM Grades Dashboard OOP
// @version      2.6.0
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
// - [OPTIONALLY] enable "render characters"                    (Settings > Text Editor > Minimap: Render Characters => checked)            (Right click on minimap > Render Characters)
//      (rendering the characters shortens the height of rows in the minimap, I prefer it like that since this script is quite long)
// 
// I've done a bit of styling intended for the minimap with the parameters I gave above, and it should make your reverse-engineering experience much easier!
// Optimal display when the side bar is closed
// 
// 
// Link for offline test: https://espace.ecam.fr/c/portal/login?redirect=%2Fgroup%2Feducation%2Fnotes&p_l_id=0&ticket=ST-113179-sbwjXieT3GLY9T3fXdsmFp9vCro-tomcat03
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
//  - baptiste.jacquin@ecam.fr  [for the coding part]
//  - maxence.leroux@ecam.fr    [for the financial and responsibility part]
// 





//#region General functions





    // MARK: ———              STRING              ———
    /** Replaces every whitespace character in ***this*** string by a single dash. @returns {string} ***This*** string after replacing every whitespace by a single dash. */
    String.prototype.replaceSpacesWithDashes = function () {
        return String(this).replaceAll(/\s/ig, "-")
    };

    /** 
     * Replaces every whitespace character in ***this*** string by a single dash. 
     * @param {Object[]} a The base Array of Objects of the comparison.
     * @param {Object[]} b The Array of Object to which the base Array of Objects will be compared to.
     * @returns {string} ***This*** string after replacing every whitespace by a single dash. 
     */
    function compareArraysOfObjects(a, b) {
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


//#endregion General functions





//#region — BACKEND —
//MARK: ——————————————————





//#region ========= BACKEND =========




    // MARK: ——————————————————
    ;




    // MARK: ———              GRADE               ———
    class Grade {





        //#region .                — properties —


            /** Value of ***this*** {@link Grade}, a positive float number below 20. @type {number} */
            #grade;

            /** The {@link Subject} (or its name) of ***this*** {@link Grade}. @type {Subject|string} @readonly */
            #subject;

            /** The {@link Module} (or its name) of ***this*** {@link Grade}. Has a getter and a setter. @type {Module|string}  */
            #module;

            /** The {@link Semester} (or its number) of ***this*** {@link Grade}. @type {Semester|number} @readonly */
            #semester;

            /** Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, in %. @type {number} */
            #coef;

            /** Title of ***this*** {@link Grade} (default when no title was given: " — "). @type {string} */
            #title;

            /** `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. @type {boolean} @readonly */
            #isSim;

            /** Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 @type {number} */
            #classAvg;

            /** Name of the teacher.s who published ***this*** {@link Grade} (default when no teacher was given: " — ") @type {string} @readonly */
            #prof;

            /** Date of publication of ***this*** {@link Grade} entered by the administration (default when no date was given: " — ").  
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* @type {string} @readonly 
             */
            #date;

            /** `true` if ***this*** {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. @type {boolean} */
            #enabled;

            /** `true` if ***this*** {@link Grade} was marked as read, `false` otherwise. @type {boolean} */
            #markedAsRead;


        //#endregion — properties —





        // MARK: .               — constructor —
        /** 
         * Constructs a {@link Grade}.
         * 
         * @param {number}          grade                   Value of ***this*** {@link Grade}, a positive float number below 20.
         * @param {number}          coef                    Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
         * @param {Subject|string}  subject                 The {@link Subject} ***this*** {@link Grade} will belong to.
         * @param {string}          [title=" — "]           Title of ***this*** {@link Grade}. Default value is " — ".
         * @param {boolean}         [isSim=false]           `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
         * @param {number|" — "}    [classAvg=" — "]        Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. Default value is " — ".
         * @param {string}          [prof=" — "]            Name of the teacher.s who published ***this*** {@link Grade}. Default value is " — ".
         * @param {string}          [date=" — "]            Date of publication of ***this*** {@link Grade} entered by the administration. Default value is " — ". 
         *                                                  ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
         * @param {Semester|number} [semester=undefined]    The {@link Semester} (or its number) of ***this*** {@link Grade}. Default is undefined.
         * @param {Module|string}   [module=undefined]      The {@link Module} (or its name) of ***this*** {@link Grade}. Default is undefined.
         * 
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         */
        constructor(grade, coef, subject, title=" — ", isSim=false, classAvg=" — ", prof=" — ", date=" — ", semester=undefined, module=undefined) {



            //#region parameters type verification
            if (isNaN(grade))                   { throw new TypeError("Improper Grade construction: wrong '" + "grade"   + "' parameter type, was expecting a number") }
            if (!(subject instanceof Subject))  { throw new TypeError("Improper Grade construction: wrong '" + "subject" + "' parameter type, was expecting a Subject or a number") } 
            if (isNaN(coef))                    { throw new TypeError("Improper Grade construction: wrong '" + "coef"    + "' parameter type, was expecting a number") }
            if (typeof title != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "title"   + "' parameter type, was expecting a string") }
            if (typeof isSim != "boolean")      { throw new TypeError("Improper Grade construction: wrong '" + "isSim"   + "' parameter type, was expecting a boolean") }
            if (typeof prof  != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "prof"    + "' parameter type, was expecting a string") }
            if (typeof date  != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "date"    + "' parameter type, was expecting a string") }
            if (!(typeof semester == "string" || semester instanceof Semester))    {
                throw new TypeError("Improper Grade construction: wrong '" + "semester"+ "' parameter type, was expecting a Semester or a string")
            }
            if (!(typeof module == "string" || module instanceof Module)) {
                throw new TypeError("Improper Grade construction: wrong '" + "module"  + "' parameter type, was expecting a Module or a string")
            }
            //#endregion


            this.#grade     = grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20;
            this.#coef      = coef <= 100 ? (coef  >= 0 ? Number(coef)  : 0) : 100;
            
            this.#subject   = subject;
            this.#module    = module ? module : (subject instanceof Subject ? subject.module : "__#unclassified#__");
            this.#semester  = semester ? semester : (subject instanceof Subject ? subject.semester : 0);

            this.#title     = title;
            this.#isSim     = isSim;

            this.#classAvg  = (classAvg == " — " || isNaN(classAvg)) ? " — " : ( classAvg <= 20 ? (classAvg >= 0 ? classAvg : 0) : 20 );

            this.#prof      = prof;
            this.#date      = date;


            this.#enabled = true;

            this.#markedAsRead = false;
        }


        //#region .             — encapsulation —


            /** Value of ***this*** {@link Grade}, a positive float number below 20. @type {number} */
            get grade()     { return this.#grade    }
            set grade(value) {
                if (isNaN(value)) { throw new Error("Invalid Grade.grade setting: tried to set 'grade' to a type other than number") }
                this.#grade = value <= 20 ? (value >= 0 ? Number(value) : 0) : 20;
            }

            /** Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, in %. @type {number} */
            get coef()      { return this.#coef     }
            set coef(value) {
                if (isNaN(value)) { throw new Error("Invalid Grade.coef setting: tried to set 'coef' to a type other than number") }
                this.#coef = value <= 100 ? (value >= 0 ? Number(value) : 0) : 100;
            }

            /** The {@link Subject} (or its name) of ***this*** {@link Grade}. @type {Subject|string} @readonly */
            get subject()   { return this.#subject  }

            /** The {@link Module} of ***this*** {@link Grade}. Has a getter and a setter. @type {Module}  */
            get module()    { return this.#module   }
            set module(value)    {
                if (!(value instanceof Module)) {throw new Error("Invalid Grade.module setting: tried to set 'module' to a type other than Module")}

                this.#module = value;
            }

            /** The {@link Semester} of ***this*** {@link Grade}. @type {Semester} @readonly */
            get semester()  { return this.#semester }

            /** Title of ***this*** {@link Grade} (default when no title was given: " — "). @type {string} */
            get title()     { return this.#title    }
            set title(value) {
                if (typeof value != "string") { throw new Error("Invalid Grade.title setting: tried to set 'title' to a type other than string") }
                this.#title = value;
            }

            /** `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. @type {boolean} @readonly */
            get isSim()     { return this.#isSim    }

            /** Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 @type {number} */
            get classAvg()  { return this.#classAvg }
            set classAvg(value) {
                this.#classAvg = (value == " — " || isNaN(value)) ? " — " : ( value <= 20 ? (value >= 0 ? value : 0) : 20 );
            }

            /** Name of the teacher.s who published ***this*** {@link Grade} (default when no teacher was given: " — ") @type {string} @readonly */
            get prof()      { return this.#prof      }

            /** Date of publication of ***this*** {@link Grade} entered by the administration (default when no date was given: " — ").  
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* @type {string} @readonly 
             */
            get date()      { return this.#date      }

            /** `true` if ***this*** {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. @type {boolean} */
            get enabled()   { return this.#enabled  }
            set enabled(value) {
                if (typeof value != "boolean") { throw new Error("Invalid Grade.enabled setting: tried to set 'enabled' to a type other than boolean") }
                this.#enabled = value;
            }

            /** `true` if ***this*** {@link Grade} was marked as read, `false` otherwise. @type {boolean} */
            get markedAsRead() { return this.#markedAsRead }
            set markedAsRead(value) {
                if (typeof value != "boolean") { throw new Error("Invalid Grade.markedAsRead setting: tried to set 'markedAsRead' to a type other than boolean") }
                this.#markedAsRead = value;
            }



        //#endregion — encapsulation —





        //#region .                 — methods —


            toString() { return this.#semester + ">" + this.#module + ">" + this.#subject + ">" + this.#title + " : " + this.#grade + "/20" }



            /** 
             * Verifies that ***this*** {@link Grade} has the exact same informations as the given {@link Grade}
             * 
             * @param {Grade} grade The {@link Grade} to compare with ***this*** {@link Grade}
             * @returns `true` if ***this*** {@link Grade} has the exact same informations as the given {@link Grade}, `false` otherwise
             */
            equals(grade) {
                if (grade instanceof Grade) {
                    return ( true 
                        && grade.#grade 	== this.#grade 
                        && grade.#classAvg 	== this.#classAvg 
                        && grade.#coef 		== this.#coef 
                        && grade.#semester 	== this.#semester 
                        && grade.#subject 	== this.#subject 
                        && grade.#title 	== this.#title 
                        && grade.#prof 		== this.#prof 
                        && grade.#date 		== this.#date 
                        && grade.#isSim     == this.#isSim
                    );
                }
                else return false;
            }


            /** 
             * The `Grade.average()` static method calculates the weighted average between all the given {@link Grade}s' value, rounded to the nearest hundredth of the average
             * 
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted average from.
             */
            static average(grades) {
                if (grades instanceof Array) {
                    let validArrayOfGrades = true, average = 0, totalCoef = 0;

                    grades.forEach(grade => {
                        if (grade instanceof Grade) {
                            average += grade.#grade * grade.#coef;
                            totalCoef += grade.#coef;
                        }
                        else validArrayOfGrades = false;
                    })

                    if (!validArrayOfGrades) return " — ";
                    else return Math.round(100*average/totalCoef)/100 || " — ";

                }
                return " — ";
            }

            /** 
             * The `Grade.average()` static method calculates the weighted average between all the given {@link Grade}s' classAvg value, 
             * rounded to the nearest hundredth of the average
             * 
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted class average from.
             */
            static classAverage(grades) {
                if (grades instanceof Array) {
                    let validArrayOfGrades = true, average = 0, totalCoef = 0;

                    grades.forEach(grade => {
                        if (grade instanceof Grade) {
                            average += grade.#classAvg * grade.#coef;
                            totalCoef += grade.#coef;
                        }
                        else validArrayOfGrades = false;
                    })

                    if (!validArrayOfGrades) return " — ";
                    else return Math.round(100*average/totalCoef)/100 || " — ";

                }
                return " — ";
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



    // MARK: ———             SUBJECT             ———
    class Subject {





        //#region .                — properties —



            /** Name of ***this*** {@link Subject}. @type {string} */
            #name;

            /** Coefficient of ***this*** {@link Subject} in its {@link Module}. @type {number} */
            #coef;

            /** Average of the user for ***this*** {@link Subject}, a positive float number below 20 @type {number} @readonly */
            #average;

            /** Value of the class' average for ***this*** {@link Subject}, a positive float number below 20 @type {number} @readonly */
            #classAvg;

            /** Array of the {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */ 
            #grades = [];

            /** Name of the module of ***this*** {@link Subject}. @type {Module} */
            #module;

            /** The {@link Semester} (or its number) of ***this*** {@link Subject}. @type {Semester|number} @readonly */
            #semester;



            /** Array of the real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #realGrades = [];

            /** Array of the simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #simGrades = [];

            /** Array of the enabled {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #enabledGrades = [];

            /** Array of the disabled {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #disabledGrades = [];

            /** Array of the enabled real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #enabledRealGrades = [];

            /** Array of the disabled real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #disabledRealGrades = [];

            /** Array of the enabled simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #enabledSimGrades = [];

            /** Array of the disabled simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            #disabledSimGrades = [];

            /** Total of the coefficients of all the {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            #totalCoefGrades;

            /** Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            #totalCoefRealGrades;

            /** Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            #totalCoefEnabledGrades;

            /** Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            #totalCoefEnabledRealGrades;



            /** The {@link SubjectCard} corresponding to ***this*** {@link Subject}. @type {SubjectCard} */
            #subjectCard;



        //#endregion — properties —





        // MARK: .               — constructor —
        /**
         * Constructs an object of class {@link Subject} from an array of {@link Grade}s and an optional coefficient.
         * 
         * The array of {@link Grade}s may be empty/undefined, in this case, the next parameters `name` and `module` **must** be provided. This will create a simulated subject.
         * 
         * 
         * @param {string}  name        Name to give to ***this*** {@link Subject}.
         * @param {number}  [coef=100]  Coefficient of ***this*** {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
         * @param {Grade[]} [grades=[]] Array of the {@link Grade}s in ***this*** {@link Subject}. Default value is `[]`. 
         * @param {Module}  [module]    The {@link Module} ***this*** {@link Subject} will belong to.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If the `subject` and/or `module` property of at least one {@link Grade} in the Array of {@link Grade}s differs from that of the first {@link Grade} of the same Array, or from the corresponding constructor parameter if given instead.
         */
        constructor(name, coef=100, grades=[], module=undefined) {



            //#region parameters type verification
            if (typeof name !== "string")   { throw new TypeError("Improper Subject construction: wrong 'name' argument type, was expecting a string") }
            if (isNaN(coef))                { throw new TypeError("Improper Subject construction: wrong 'coef' optional argument type, was expecting a number") }
            if (!(grades instanceof Array)) { throw new TypeError("Improper Subject construction: the 'grades' optional argument is not an ARRAY, was expecting an Array of Grades") }
            if (module !== undefined && !(module instanceof Module))    { throw new TypeError("Improper Subject construction: wrong 'module' optional argument type, was expecting a Module") }


            const moduleObj   = module            || grades[0]?.module;

            grades.forEach(grade => {
                if (!(grade instanceof Grade)) { 
                    throw new TypeError("Improper Subject construction: the 'grades' argument is not an Array of GRADES (and ONLY of Grades), was expecting an Array of Grades");
                }

                if (grade.subject != name) {
                    throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same subject name");
                }

                if (grade.module != moduleObj) {
                    throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same module name");
                }

            });
            //#endregion
            
            this.#name      = name;
            this.#coef      = coef <= 100 ? (coef >= 0 ? Number(coef) : 0) : 100;
            this.#grades    = grades;

            // Constructing from an Array of Grades
            if (this.#grades.length > 0) {
                this.#module    = this.#grades[0].module;
                this.#semester  = this.#grades[0].semester;
            }
            else {
                this.#module    = module;
                this.#semester  = module?.semester || 0;

                if (module instanceof Module) {
                    module.addSubject(this);
                }
            }

            this.computeStats();
        }


        //#region .             — encapsulation —

            /** 
             * Name of ***this*** {@link Subject}. @type {string} */
            get name()      { return this.#name     }
            set name(value) {
                if (typeof value != "string") { throw new TypeError("Invalid Subject.name setting: tried to set 'name' to a type other than string") }
                this.#name = value;
            }

            /** 
             * Coefficient of ***this*** {@link Subject} in its {@link Module}. @type {number} */
            get coef()      { return this.#coef     }
            set coef(value) {
                if (isNaN(value)) { throw new TypeError("Invalid Subject.coef setting: tried to set 'coef' to a type other than number") }
                this.#coef = value <= 100 ? (value >= 0 ? value : 0) : 100;
            }

            /** 
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get average()   { return this.#average  }

            /** 
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get classAvg()  { return this.#classAvg }

            /** 
             * Array of the {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get grades()    { return this.#grades   }

            /** 
             * The {@link Module} of ***this*** {@link Subject}. @type {Module} */
            get module()    { return this.#module   }
            set module(value)    {
                if (!(value instanceof Module)) {throw new TypeError("Invalid Subject.module setting: tried to set 'module' to a type other than Module")}
                this.#module = value;
            }

            /** 
             * The {@link Semester} (or its number) of ***this*** {@link Subject}. @type {Semester|number} @readonly */
            get semester()  { return this.#semester }

            /** 
             * Array of the real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get realGrades() { return this.#realGrades }

            /** 
             * Array of the simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get simGrades() { return this.#simGrades }

            /** 
             * Array of the enabled {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get enabledGrades() { return this.#enabledGrades }

            /** 
             * Array of the disabled {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get disabledGrades() { return this.#disabledGrades }

            /** 
             * Array of the enabled real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get enabledRealGrades() { return this.#enabledRealGrades }

            /** 
             * Array of the disabled real {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /** 
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get enabledSimGrades() { return this.#enabledSimGrades }

            /** 
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Subject}. @type {Grade[]} @readonly */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /** 
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /** 
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefSimGrades() { return this.#totalCoefGrades - this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /** 
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /** 
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades }



        //#endregion — encapsulation —





        //#region .                 — methods —


            toString() { return this.#name }





            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Subject}.
             */
            computeStats() {
                //#region
                let /** @type {Grade[]} */ realGrades=[], 
                    /** @type {Grade[]} */ simGrades=[], 
                    /** @type {Grade[]} */ enabledGrades=[], 
                    /** @type {Grade[]} */ disabledGrades=[], 
                    /** @type {Grade[]} */ enabledRealGrades=[], 
                    /** @type {Grade[]} */ disabledRealGrades=[], 
                    /** @type {Grade[]} */ enabledSimGrades=[], 
                    /** @type {Grade[]} */ disabledSimGrades=[], 

                    /** @type {number}  */ totalCoefGrades = 0,
                    /** @type {number}  */ totalCoefRealGrades = 0,
                    /** @type {number}  */ totalCoefEnabledGrades = 0, 
                    /** @type {number}  */ totalCoefEnabledRealGrades = 0
                ;
                //#endregion

                this.grades.forEach(grade => {

                    totalCoefGrades += grade.coef;

                    switch ((grade.enabled ? "enabled " : "disabled ") + (grade.isSim ? "sim " : "real ") + "grade") {

                        case "disabled real grade":
                            disabledGrades.push(grade);
                            realGrades.push(grade);
                            disabledRealGrades.push(grade);

                            totalCoefRealGrades         += grade.coef;
                        break;

                        case "enabled real grade":
                            enabledGrades.push(grade);
                            realGrades.push(grade);
                            enabledRealGrades.push(grade);

                            totalCoefRealGrades         += grade.coef;
                            totalCoefEnabledGrades      += grade.coef;
                            totalCoefEnabledRealGrades  += grade.coef;
                        break;

                        case "disabled sim grade":
                            disabledGrades.push(grade);
                            simGrades.push(grade);
                            disabledSimGrades.push(grade);
                        break;

                        case "enabled sim grade":
                            enabledGrades.push(grade);
                            simGrades.push(grade);
                            enabledSimGrades.push(grade);

                            totalCoefEnabledGrades      += grade.coef;
                        break;

                    }

                });
                
                this.#realGrades = realGrades;
                this.#simGrades = simGrades;

                this.#enabledRealGrades          = enabledRealGrades;
                this.#disabledRealGrades         = disabledRealGrades;
                
                this.#enabledSimGrades           = enabledSimGrades;
                this.#disabledSimGrades          = disabledSimGrades;

                this.#totalCoefGrades            = Math.round(totalCoefGrades);
                this.#totalCoefRealGrades        = Math.round(totalCoefRealGrades);
                this.#totalCoefEnabledGrades     = Math.round(totalCoefEnabledGrades);
                this.#totalCoefEnabledRealGrades = Math.round(totalCoefEnabledRealGrades);

                this.#average   = Grade.average(this.#grades);
                this.#classAvg  = Grade.classAverage(this.#grades);
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



    // MARK: ———             MODULE             ———
    class Module {





        //#region .                — properties —



            /** Name of ***this*** {@link Module}. @type {string} */
            #name;

            /** Average of the user for ***this*** {@link Module}, a positive float number below 20 @type {number} @readonly */
            #average;

            /** Value of the class' average for ***this*** {@link Module}, a positive float number below 20 @type {number} @readonly */
            #classAvg;

            /** Object of all the {@link Subject}s (or their name) in ***this*** {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} itself as value (or its name). @type {Object.<string, Subject|string>} @readonly */
            #subjects = {};

            /** The {@link Semester} of ***this*** {@link Module}, or its number. @type {Semester|number} @readonly */
            #semester;



            /** Array of the {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #grades = [];

            /** Array of the real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #realGrades = [];

            /** Array of the simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #simGrades = [];

            /** Array of the enabled real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #enabledRealGrades = [];

            /** Array of the disabled real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #disabledRealGrades = [];

            /** Array of the enabled simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #enabledSimGrades = [];

            /** Array of the disabled simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            #disabledSimGrades = [];



            /** Total of the coefficients of all the {@link Subject}s in ***this*** {@link Module}. @type {number} @readonly */ 
            #totalCoefSubjects;

            /** Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */ 
            #totalCoefSubjectsNoGrade;

            /** Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */ 
            #totalCoefSubjectsNoEnabledGrade;



            /** Total of the coefficients of all the {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            #totalCoefGrades;

            /** Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            #totalCoefRealGrades;

            /** Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            #totalCoefEnabledGrades;

            /** Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            #totalCoefEnabledRealGrades;



            /** All the {@link Subject}s in ***this*** {@link Module} that have an average *below 100*. @type {Subject[]} @readonly */
            #subjectsBelow100;

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average *above 100*. @type {Subject[]} @readonly */
            #subjectsAbove100;

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *below 100*. @type {Subject[]} @readonly */
            #subjectsReallyBelow100;

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *above 100*. @type {Subject[]} @readonly */
            #subjectsReallyAbove100;

            /** All the {@link Subject}s in ***this*** {@link Module} that don't have any grade. @type {Subject[]} @readonly */
            #subjectsNoGrade;

            /** All the {@link Subject}s in ***this*** {@link Module} that don't have any enabled grade. @type {Subject[]} @readonly */
            #subjectsNoEnabledGrade;



            /** The {@link ModuleCard} corresponding to ***this*** {@link Module}. @type {ModuleCard} */
            #moduleCard;



        //#endregion — properties —





        // MARK: .               — constructor —
        /**
         * Constructs an object of class {@link Module} from an array of {@link Subject}s.
         * 
         * @param {string}          name            Name of ***this*** {@link Module}.
         * @param {Semester|number} [semester]      The {@link Semester} ***this*** {@link Module} will belong to, or its number.
         * @param {Subject[]}       [subjects=[]]   Array of the {@link Subject}s in ***this*** {@link Module}. Default value is `[]`. 
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If the `name` and/or `semester` property of at least one {@link Subject} in the Array of {@link Subject}s differs from that of the first {@link Subject} of the same Array, or from the corresponding constructor parameter if given instead.
         */
        constructor(name=undefined, semester=undefined, subjects=[]) {



            //#region parameters type verification
            if (typeof name != "string")      { throw new TypeError("Improper Module construction: wrong 'name' argument type, was expecting a string.") }
            if (!(semester instanceof Semester || !isNaN(semester)) && semester !== undefined)  { throw new TypeError("Improper Module construction: wrong 'semester' optional argument type, was expecting a Semester, a number, or undefined.") }
            if (!(subjects instanceof Array)) { throw new TypeError("Improper Module construction: the 'subjects' optional parameter is not an ARRAY, was expecting an Array of Subjects or of strings.") }

            /** @type {Map<string, Subject>} */
            let subjectsEntries = new Map();
            const semesterObj  = semester  || subjects[0]?.semester;

            subjects.forEach(subject => {
                if (!(subject instanceof Subjects || typeof subject == "string")) {
                    throw new TypeError("Improper Module construction: the 'subjects' optional parameter is not an Array of SUBJECTS or STRINGS (and ONLY Subjects OR strings), was expecting an Array of Subjects or of strings.") 
                }

                if (subject instanceof Subjects) {
                    if (subject.module != name) {
                        throw new Error("Improper Module construction: the Subjects in the optional Array of Subjects parameter 'subjects' don't all have the same module name.")
                    }
    
                    if (subject.semester != semesterObj) {
                        throw new Error("Improper Module construction: the Subjects in the optional Array of Subjects parameter 'subjects' don't all have the same semester number.")
                    }
                }

                
            })
            //#endregion
            
            this.addSubjects(...subjects);


            this.#name      = name;
            this.#subjects  = Object.fromEntries(subjectsEntries);

            const nbSubjects = Object.keys(this.#subjects).length;

            // Constructing from an Array of Subjects
            if (nbSubjects > 0) { this.#semester  = semesterObj; }

            // Constructing a simulated module, it doesn't have subjects (yet)
            else {
                this.#semester = semester;

                if (semester instanceof Semester) {
                    semester.addModules(this);
                }
            }

            this.computeStats(false);

        }


        //#region .             — encapsulation —

            /** 
             * Name of ***this*** {@link Module}. @type {string} */
            get name()      { return this.#name }
            set name(value) {
                if (typeof value != "string") { throw new Error("Invalid Module.name setting: tried to set 'name' to a type other than string") }
                this.#name = value;
            }



            /** 
             * Value of the class' average of ***this*** {@link Module}, a positive float number below 20 @type {number} @readonly */
            get average()   { return this.#average }

            /** 
             * Value of the class' average of ***this*** {@link Module}, a positive float number below 20 @type {number} @readonly */
            get classAvg()  { return this.#classAvg }



            /** 
             * Object of the {@link Subject}s (or their name) in ***this*** {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} as value (or its name). @type {Object.<string, Subject|string>} @readonly */
            get subjects()  { return this.#subjects }

            /**
             * Adds a {@link Subject} (or its name) to ***this*** {@link Module}.
             * @param {Subject|string} subject The {@link Subject} (or its name) to add to ***this*** {@link Module}.
             * 
             * @returns {Subject|string} The {@link Subject} (or its name) added to ***this*** {@link Module}.
             */
            addSubject(subject) {
                if (!(subject instanceof Subject || typeof subject == "string")) {
                    throw new TypeError("Invalid Module.addSubject() call: wrong type for the 'subject' parameter, was expecting a Subject or a string")
                }

                return this.#subjects[subject.name] = subject;
            }
            /**
             * Adds {@link Subject}s (or their name) to ***this*** {@link Module}.
             * @param {Subject[]|string[]} subjects The {@link Subject}s (or their name) to add to ***this*** {@link Module}.
             * 
             * @returns {Subject[]|string[]} The {@link Subject}s (or their name) added to ***this*** {@link Module}.
             */
            addSubjects(...subjects) {
                subjects = subjects.flat();

                subjects.forEach(subject => {
                    if (!(subject instanceof Subject || typeof subject == "string")) {
                        throw new TypeError("Invalid Module.addSubjects() call: wrong type for the 'subjects' parameter.s, was expecting Subjects")
                    }

                    this.#subjects[subject.name] = subject;
                })

                return subjects;
            }

            /**
             * Removes a {@link Subject} from ***this*** {@link Module}.
             * @param {Subject|string} subject The {@link Subject} (or its name) to remove from ***this*** {@link Module}.
             * 
             * @returns {Subject} The {@link Subject} removed from ***this*** {@link Module}.
             */
            removeSubject(subject) {
                if (!(subject instanceof Subject || typeof subject == "string")) { throw new TypeError("Invalid Module.removeSubject() call: wrong type for the 'subject' parameter, was expecting a Subject or a string") }
                const name = subject instanceof Subject ? subject.name : subject;
                const out = this.#subjects[name];
                delete this.#subjects[name];

                return out;
            }
            /**
             * Removes {@link Subject}s from ***this*** {@link Module}.
             * @param {Subject[]|string[]} subjects The {@link Subject}s (or their name) to remove from ***this*** {@link Module}.
             * 
             * @returns {Subject[]} The {@link Subject}s removed from ***this*** {@link Module}.
             */
            removeSubjects(...subjects) {
                subjects = subjects.flat();
                let out = [];

                subjects.forEach(subject => {
                    if (!(subject instanceof Subject || typeof subject == "string")) {
                        throw new TypeError("Invalid Module.removeSubjects() call: wrong type for the 'subject' parameter, was expecting Subjects or strings")
                    }

                    const name = subject instanceof Subject ? subject.name : subject;
                    out.push(this.#subjects[name]);

                    delete this.#subjects[name];
                })

                return out;
            }



            /** 
             * The {@link Semester} of ***this*** {@link Module}. @type {Semester} @readonly */
            get semester()  { return this.#semester }

            /** 
             * Array of the {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get grades()    { return this.#grades }

            /** 
             * Array of the real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get realGrades() { return this.#realGrades }

            /** 
             * Array of the simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get simGrades() { return this.#simGrades }

            /** 
             * Array of the enabled real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get enabledRealGrades() { return this.#enabledRealGrades }

            /** 
             * Array of the disabled real {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /** 
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get enabledSimGrades() { return this.#enabledSimGrades }

            /** 
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Module}. @type {Grade[]} @readonly */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /** 
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefSubjects() { return this.#totalCoefSubjects }

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefSubjectsNoGrade() { return this.#totalCoefSubjectsNoGrade }

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefSubjectsNoEnabledGrade() { return this.#totalCoefSubjectsNoEnabledGrade }

            /** 
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /** 
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefSimGrades() { return this.#totalCoefGrades - this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /** 
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /** 
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Module}. @type {number} @readonly */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *below 100*. @type {Subject[]} @readonly */
            get subjectsBelow100() { return this.#subjectsBelow100; }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *above 100*. @type {Subject[]} @readonly */
            get subjectsAbove100() { return this.#subjectsAbove100; }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *below 100*. @type {Subject[]} @readonly */
            get subjectsReallyBelow100() { return this.#subjectsReallyBelow100; }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *above 100*. @type {Subject[]} @readonly */
            get subjectsReallyAbove100() { return this.#subjectsReallyAbove100; }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any grade. @type {Subject[]} @readonly */
            get subjectsNoGrade() { return this.#subjectsNoGrade; }

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any enabled grade. @type {Subject[]} @readonly */
            get subjectsNoEnabledGrade() { return this.#subjectsNoEnabledGrade; }


        //#endregion — encapsulation —





        //#region .                 — methods —


            toString() { return this.#name }





            // MARK: _  fromGrades()
            /**
             * The `Module.average()` static method builds a **new** {@link Module} of given name from a given Array of {@link Grade}s.
             * 
             * @param {Grade[]} grades  Array of the {@link Grade}s to build a {@link Module} from.
             * @param {string}  name    Name of the {@link Module} to build from the given Array of {@link Grade}s.
             * 
             * @returns A **new** {@link Module} of the given name from the given Array of {@link Grade}s.
             * 
             * @throws {TypeError} If a parameter is of an unexpected type.
             */
            static fromGrades(grades, name) {
                if (typeof name != "string") { throw new TypeError("Module.fromGrades() error: the given 'name' parameter isn't a string, was expecting a string") }

                if (grades instanceof Array) {

                    let 
                        /** @type {{string: Grade[]}} */ subjectsObject = {},
                        /** @type {Subject[]} */ subjects = []
                    ;

                    grades.forEach(grade => {
                        if (grade instanceof Grade) {

                            if (!subjectsObject?.[grade.subject]) {
                                subjectsObject[grade.subject] = [grade];
                            }
                            else {
                                subjectsObject[grade.subject].push(grade);
                            }

                        } else { throw new TypeError("Module.fromGrades() error: the given 'grades' parameter isn't an Array of Grades (and ONLY Grades), was expecting an Array of Grades") }
                    });

                    const nbSubjects = Object.keys(subjectsObject).length;
                    let remainingCoef = 100;

                    Object.entries(subjectsObject).forEach((entry, index) => {
                        const coef = Math.round(100/nbSubjects);
                        remainingCoef -= index == nbSubjects-1 ? 0 : coef;
                        
                        subjects.push(new Subject(entry[1], index == nbSubjects-1 ? remainingCoef : coef, entry[0], name));
                    })

                    return new Module(subjects, name);


                } else { throw new TypeError("Module.fromGrades() error: the given 'grades' parameter isn't an Array, was expecting an Array of Grades") }
            }


            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Module}.
             * @param {boolean} [recomputeSubjects=true] `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed, `false` otherwise.
             */
            computeStats(recomputeSubjects=true) {
                //#region 
                let 
                    /** @type {Grade[]} */ grades               = [],
                    /** @type {Grade[]} */ realGrades           = [],
                    /** @type {Grade[]} */ simGrades            = [],
                    /** @type {Grade[]} */ enabledRealGrades    = [],
                    /** @type {Grade[]} */ disabledRealGrades   = [],
                    /** @type {Grade[]} */ enabledSimGrades     = [],
                    /** @type {Grade[]} */ disabledSimGrades    = [],

                    /** @type {number} */ totalCoefSubjects                 = 0,
                    /** @type {number} */ totalCoefSubjectsNoGrade          = 0,
                    /** @type {number} */ totalCoefSubjectsNoEnabledGrade   = 0,

                    /** @type {number} */ totalCoefGrades               = 0,
                    /** @type {number} */ totalCoefRealGrades           = 0,
                    /** @type {number} */ totalCoefEnabledGrades        = 0,
                    /** @type {number} */ totalCoefEnabledRealGrades    = 0,

                    /** @type {Subject[]} */ subjectsBelow100       = [],
                    /** @type {Subject[]} */ subjectsAbove100       = [],
                    /** @type {Subject[]} */ subjectsReallyBelow100 = [],
                    /** @type {Subject[]} */ subjectsReallyAbove100 = [],
                    /** @type {Subject[]} */ subjectsNoEnabledGrade = [],
                    /** @type {Subject[]} */ subjectsNoGrade        = []
                ;
                //#endregion

                // Pre-emptively compute all the subjects' stats
                if (recomputeSubjects) Object.values(this.#subjects).forEach(subject => {
                    subject.computeStats();
                })
                
                Object.values(this.#subjects).forEach(subject => {
                    const nbGrades = subject.grades.length;

                    grades              .push(...subject.grades);
                    realGrades          .push(...subject.realGrades);
                    simGrades           .push(...subject.simGrades);
                    enabledRealGrades   .push(...subject.enabledRealGrades);
                    disabledRealGrades  .push(...subject.disabledRealGrades);
                    enabledSimGrades    .push(...subject.enabledSimGrades);
                    disabledSimGrades   .push(...subject.disabledSimGrades);

                    totalCoefSubjects               += subject.coef;

                    if (nbGrades == 0) {
                        totalCoefSubjectsNoGrade    += subject.coef;
                        subjectsNoGrade.push(subject);
                    }
                    if (nbGrades == subject.disabledGrades.length) {
                        totalCoefSubjectsNoEnabledGrade += subject.coef;
                        subjectsNoEnabledGrade.push(subject);
                    }

                    totalCoefGrades             += subject.totalCoefGrades;
                    totalCoefRealGrades         += subject.totalCoefRealGrades;
                    totalCoefEnabledGrades      += subject.totalCoefEnabledGrades;
                    totalCoefEnabledRealGrades  += subject.totalCoefEnabledRealGrades;

                    if      (subject.totalCoefGrades < 100) subjectsBelow100.push(subject);
                    else if (subject.totalCoefGrades > 100) subjectsAbove100.push(subject);

                    if      (subject.totalCoefRealGrades < 100) subjectsReallyBelow100.push(subject);
                    else if (subject.totalCoefRealGrades > 100) subjectsReallyAbove100.push(subject);
                })
                
                const nbSubjects = this.#subjects.length;

                this.#grades             = grades;
                this.#simGrades          = simGrades;
                this.#disabledRealGrades = disabledRealGrades;
                this.#disabledSimGrades  = disabledSimGrades;

                this.#totalCoefSubjects                 = totalCoefSubjects;
                this.#totalCoefSubjectsNoGrade          = totalCoefSubjectsNoGrade;
                this.#totalCoefSubjectsNoEnabledGrade   = totalCoefSubjectsNoEnabledGrade;

                this.#totalCoefGrades            = Math.round(totalCoefGrades/nbSubjects);
                this.#totalCoefRealGrades        = Math.round(totalCoefRealGrades/nbSubjects);
                this.#totalCoefEnabledGrades     = Math.round(totalCoefEnabledGrades/nbSubjects);
                this.#totalCoefEnabledRealGrades = Math.round(totalCoefEnabledRealGrades/nbSubjects);            

                this.#subjectsBelow100 = subjectsBelow100;
                this.#subjectsAbove100 = subjectsAbove100;
                this.#subjectsReallyBelow100 = subjectsReallyBelow100;
                this.#subjectsReallyAbove100 = subjectsReallyAbove100;

                this.#average    = Grade.average(this.grades);
                this.#classAvg   = Grade.classAverage(this.grades);
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



    // MARK: ———            SEMESTER           ———
    class Semester {





        //#region .                — properties —


            /** Number of ***this*** {@link Semester}. @type {number} */
            #number;

            /** Average of the user for ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly */
            #average;

            /** Value of the class' average for ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly */
            #classAvg;



            /** Object of all the {@link Module}s in ***this*** {@link Semester}, with the {@link Module}'s name as key and the {@link Module} itself as value. @type {Object.<string, Module>} @readonly */
            #modules = {};


            /** The undefined {@link Module} of ***this*** {@link Semester}. @type {Module} @readonly */
            #undefinedModule;


            /** Array of all the {@link Modules}s in ***this*** {@link Semester}. @type {Object.<string, Module>} @readonly */
            #modulesNoEnabledGrade = [];

            /** Array of the {@link Modules}s in ***this*** {@link Semester}. @type {Object.<string, Module>} @readonly */
            #modulesNoGrade = [];




            /** Array of the {@link Subject}s in ***this*** {@link Semester}. @type {Object.<string, Subject>} */
            #subjects = [];


            /** Total of the coefficients of all the {@link Subject}s in ***this*** {@link Semester}. @type {number} @readonly */ 
            #totalCoefSubjects;

            /** Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */ 
            #totalCoefSubjectsNoGrade;

            /** Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */ 
            #totalCoefSubjectsNoEnabledGrade;




            /** Array of the {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            #grades = [];


            /** Array of the simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            #simGrades = [];

            /** Array of the disabled real {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            #disabledRealGrades = [];

            /** Array of the disabled simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            #disabledSimGrades = [];



            /** Total of the coefficients of all the {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            #totalCoefGrades;

            /** Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            #totalCoefRealGrades;

            /** Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            #totalCoefEnabledGrades;

            /** Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            #totalCoefEnabledRealGrades;



            /** The {@link SemesterCard} corresponding to ***this*** {@link Semester}. @type {SemesterCard} */
            #semesterCard;


        //#endregion — properties —





        // MARK: .               — constructor —
        /**
         * 
         * @param {number} number 
         * @param {Module[]} modules 
         */
        constructor(number, modules=[]) {



            //#region parameters type verification
            if (isNaN(number))      { throw new TypeError("Improper Semester construction: wrong 'number' argument type, was expecting a number or something that isn't NaN.") }
            if (!(modules instanceof Array))  { throw new TypeError("Improper Semester construction: the 'modules' optional parameter is not an ARRAY, was expecting an Array of Modules.") }

            let hasUnclassifiedModule = false;
            modules.forEach(module => {
                if (!(module instanceof Module)) { throw new TypeError("Improper Semester construction: the 'modules' optional parameter is not an Array of MODULES, was expecting an Array of Modules") }

                if (module.semester != number) {
                    throw new Error("Improper Semester construction: the Subjects in the optional Array of Modules parameter 'modules' don't all have the same semester number")
                }
            })
            //#endregion


            this.#number = parseInt(number);

            this.#undefinedModule = new Module("__#unclassified#__", this);
            this.addModules(this.#undefinedModule);
            this.addModules(...modules);

            Object.values(this.#modules).forEach(module => {
                this.#subjects = module.subjects;
                this.#grades   = module.grades;
            })

            this.#semesterCard = new SemesterCard(this);

            this.computeStats(false, false);
        }


        //#region .             — encapsulation —


            /** 
             * Number of ***this*** {@link Semester}. @type {number} 
             */
            get number()      { return this.#number }
            set number(value) {
                if (isNaN(value)) { throw new Error("Invalid Semester.name setting: tried to set 'number' to a type other than a number") }
                this.#number = Number(value);
            }


            /** 
             * Value of the class' average of ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly 
             */
            get average()   { return this.#average }

            /** 
             * Value of the class' average of ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly 
             */
            get classAvg()  { return this.#classAvg }



            /** 
             * Object of the {@link Module}s in ***this*** {@link Semester}, with the {@link Module}'s name as key and the {@link Module} as value. @type {Object.<string, Module>} @readonly 
             */
            get modules()  { return this.#modules }

            /**
             * Adds the {@link Module}.s to ***this*** {@link Semester}.
             * @param {Module[]|string[]} modules The {@link Module}.s (or its/their name) to add to ***this*** {@link Semester}.
             * 
             * @returns {Module[]} The {@link Module}s added to ***this*** {@link Semester}.
             */
            addModules(...modules) {
                modules = modules.flat();

                modules.forEach(module => {
                    if (!(module instanceof Module) && typeof module != "string") {
                        throw new TypeError("Invalid Semester.addModules() call: wrong type for the 'modules' parameter.s, was expecting Modules")
                    }

                    this.#modules[module.name]  = module;
                })

                this.computeStats();
                return modules;
            }

            /**
             * Removes the {@link Module}.s from ***this*** {@link Semester}.
             * @param {Module[]|string[]} modules The {@link Module}.s (or its/their name) to remove from ***this*** {@link Semester}.
             * 
             * @returns {Module[]} The {@link Module}s removed from ***this*** {@link Semester}.
             */
            removeModules(...modules) {
                modules = modules.flat();
                /** @type {string[]} */ let names = [];
                /** @type {Module[]} */ let out = [];

                modules.forEach(module => {
                    if (!(module instanceof Module) && typeof module != "string") {
                        throw new TypeError("Invalid Semester.removeModules() call: wrong type for the 'modules' parameter.s, was expecting Modules")
                    }

                    if (module == this.#modules["__#unclassified#__"] || module == "__#unclassified#__") {
                        throw new TypeError("Invalid Semester.removeModules() call: can't remove the '__#unclassified#__' Module")
                    }

                    const name = module instanceof Module ? module.name : module;

                    names.push(module.name);
                    out.push(this.#modules[name]);

                    delete this.#modules[name];
                })

                this.computeStats();
                return out;
            }

            /** 
             * The undefined {@link Module} of ***this*** {@link Semester}. @type {Module} @readonly
             */
            get undefinedModule()  { return this.#undefinedModule }


            /** 
             * Array of the {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly 
             */
            get grades()    { return this.#grades }

            get subjects()    { return this.#subjects }
            set subjects(value) {
                if (!(value instanceof Object)) { throw new TypeError("Invalid Semester.subjects setting: tried to set 'subjects' to a type other than an object of entries with a string key and a Subject value.") }
                Object.values(value).forEach(elem => {
                    if (!(elem instanceof Subject)) {
                        throw new TypeError("Invalid Semester.subjects setting: tried to set 'subjects' to a type other than an object of entries with a string key and a Subject value.")
                    }
                })

                this.#subjects = value;
            }
            /**
             * 
             * @param {Subject | string} subject 
             * @returns 
             */
            addSubject(subject) {
                if (!(subject instanceof Subject)) { throw new TypeError("Invalid Semester.addSubject() call: wrong type for the 'subject' parameter, was expecting a Subject") }

                // Add the subject to the Map-like Object of Subjects of this Semester
                this.#subjects[subject.name] = subject;

                // Add the grades of the added subject to the Array of Grades of this Semester
                Object.values(this.#modules).forEach(module => {
                    this.#grades = module.grades;
                })

                this.computeStats();
                return this;
            }
            addSubjects(...subjects) {
                subjects = subjects.flat();
                subjects.forEach(subject => {
                    if (!(subject instanceof Array)) { throw new TypeError("Invalid Semester.addSubject() call: wrong type for the 'subject' parameter, was expecting a Subject") }
                    
                    this.#subjects[subject.name] = subject;
                })
                
                this.computeStats();
                return this;
            }
            removeSubject(subject) {
                if (!(subject instanceof Subject)) { throw new TypeError("Invalid Semester.addSubject() call: wrong type for the 'subject' parameter, was expecting a Subject") }

                this.computeStats();
                this.#subjects[subject.name] = subject;
                return this;
            }
            /**
             * 
             * @param {Subject} subject The {@link Subject} to check if it's in the 
             */
            hasSubject(subject) {
                
            }

            /** 
             * Array of the simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            get simGrades() { return this.#simGrades }

            /** 
             * Array of the disabled real {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /** 
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /** 
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefSubjects() { return this.#totalCoefSubjects }

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefSubjectsNoGrade() { return this.#totalCoefSubjectsNoGrade }

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefSubjectsNoEnabledGrade() { return this.#totalCoefSubjectsNoEnabledGrade }

            /** 
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /** 
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefSimGrades() { return this.#totalCoefGrades - this.#totalCoefRealGrades }

            /** 
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /** 
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /** 
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades }



        //#endregion — encapsulation —





        //#region .                 — methods —


            toString() { return this.#number }





            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Semester}.
             * @param {boolean} [recomputeSubjects=true] `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed, `false` otherwise.
             * @param {boolean} [recomputeModules=true] `true` if the stats of the {@link Module}s of ***this*** {@link Semester} has to be computed, `false` otherwise.
             */
            computeStats(recomputeSubjects=true, recomputeModules=true) {
                //#region 
                let 
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjects                  = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsBelow100          = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsAbove100          = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsReallyBelow100    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsReallyAbove100    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsNoEnabledGrade    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsNoGrade           = {},

                    /** @type {number} */ totalCoefSubjects                 = 0,
                    /** @type {number} */ totalCoefSubjectsNoGrade          = 0,
                    /** @type {number} */ totalCoefSubjectsNoEnabledGrade   = 0,


                    /** @type {Grade[]} */ grades               = [],
                    /** @type {Grade[]} */ simGrades            = [],
                    /** @type {Grade[]} */ disabledRealGrades   = [],
                    /** @type {Grade[]} */ disabledSimGrades    = [],

                    /** @type {number} */ totalCoefGrades               = 0,
                    /** @type {number} */ totalCoefRealGrades           = 0,
                    /** @type {number} */ totalCoefEnabledGrades        = 0,
                    /** @type {number} */ totalCoefEnabledRealGrades    = 0

                ;
                //#endregion

                // Pre-emptively compute all the subjects' stats
                if (recomputeSubjects) Object.values(this.#subjects).forEach(subject => {
                    subject.computeStats();
                })

                // Pre-emptively compute all the modules' stats
                if (recomputeModules) Object.values(this.#modules).forEach(module => {
                    module.computeStats();
                })
                
                Object.values(this.#modules || {}).forEach(module => {

                    Object.values(module.subjects || {}).forEach(subject => {

                        grades.push(...subject.grades);
                        simGrades.push(...subject.simGrades);
                        disabledRealGrades.push(...subject.disabledRealGrades);
                        disabledSimGrades.push(...subject.disabledSimGrades);

                        totalCoefSubjects           += subject.coef;
                        if (subject.grades.length == 0) {
                            totalCoefSubjectsNoGrade    += subject.coef;
                            subjectsNoGrade[subject.name] = subject;
                        }
                        if (subject.enabledGrades.length == 0) {
                            totalCoefSubjectsNoEnabledGrade += subject.coef;
                            subjectsNoEnabledGrade[subject.name] = subject;
                        }

                        totalCoefGrades             += subject.totalCoefGrades;
                        totalCoefRealGrades         += subject.totalCoefRealGrades;
                        totalCoefEnabledGrades      += subject.totalCoefEnabledGrades;
                        totalCoefEnabledRealGrades  += subject.totalCoefEnabledRealGrades;

                        if      (subject.totalCoefGrades < 100) subjectsBelow100[subject.name] = subject;
                        else if (subject.totalCoefGrades > 100) subjectsAbove100[subject.name] = subject;

                        if      (subject.totalCoefRealGrades < 100) subjectsReallyBelow100[subject.name] = subject;
                        else if (subject.totalCoefRealGrades > 100) subjectsReallyAbove100[subject.name] = subject;

                    })

                })

                const nbSubjects = this.#subjects.length;

                this.#grades             = grades;
                this.#simGrades          = simGrades;
                this.#disabledRealGrades = disabledRealGrades;
                this.#disabledSimGrades  = disabledSimGrades;

                this.#totalCoefSubjects                 = Math.round(totalCoefSubjects/nbSubjects);
                this.#totalCoefSubjectsNoGrade          = Math.round(totalCoefSubjectsNoGrade/nbSubjects);
                this.#totalCoefSubjectsNoEnabledGrade   = Math.round(totalCoefSubjectsNoEnabledGrade/nbSubjects);
                this.#totalCoefGrades                   = Math.round(totalCoefGrades/nbSubjects);
                this.#totalCoefRealGrades               = Math.round(totalCoefRealGrades/nbSubjects);
                this.#totalCoefEnabledGrades            = Math.round(totalCoefEnabledGrades/nbSubjects);
                this.#totalCoefEnabledRealGrades        = Math.round(totalCoefEnabledRealGrades/nbSubjects);
                // debugger;

                this.#average    = Grade.average(this.grades);
                this.#classAvg   = Grade.classAverage(this.grades);
            }

        //#endregion — methods —





        // MARK: _________________________________________

    }








    //-MARK: 
    ;




    // MARK: ———             SETTING             ———
    class Setting {







        // MARK: _________________________________________

    }



    // MARK: ———            SETTINGS            ———
    class Settings {







        // MARK: _________________________________________

    }






    // MARK: ———   KEYBOARDSHORTCUT   ———
    class KeyboardShortcut {







        // MARK: _________________________________________

    }



    // MARK: ———  KEYBOARDSHORTCUTS  ———
    class KeyboardShortcuts {







        // MARK: _________________________________________

    }

//#endregion BACKEND





//MARK: ——————————————————
//#endregion















//#region — FRONTEND —
//MARK: ——————————————————





//#region ========  FRONTEND  ========




    // MARK: ——————————————————






    // MARK: ———               CARD               ———
    class Card {





        //#region .                — properties —

            /** The {@link HTMLElement} linked to ***this*** {@link Card}. @type {HTMLElement} */
            #html;


        //#endregion .                — properties —





        // MARK: .               — constructor —
        /**
         * 
         * @param {string} className Name of the class of ***this*** {@link Card}.
         * @param {string} id Id of ***this*** {@link Card}.
         * @param {HTMLElement|Card|undefined} parent Parent 
         */
        constructor(className, id, parent=undefined) {
            if (typeof className != "string") { throw new TypeError("Improper Card construction: wrong 'className' argument type, was expecting a string.") }
            if (typeof id != "string") { throw new TypeError("Improper Card construction: wrong 'id' argument type, was expecting a string.") }
            if (!(parent instanceof HTMLElement || parent instanceof Card || parent == undefined)) { throw new TypeError("Improper Card construction: wrong 'parent' argument type, was expecting an HTMLElement, a Card, or left undefined.") }


            this.#html = document.createElement("div");
            this.#html.className = className;
            this.#html.id = id;

            if (parent instanceof HTMLElement)  parent.appendChild(this.#html);
            else if (parent instanceof Card)    parent.html.appendChild(this.#html);
        }



        //#region .             — encapsulation —

            /** The {@link HTMLElement} linked to ***this*** {@link Card}. @type {HTMLElement} @readonly Outside of its class methods */
            get html() { return this.#html; }


        //#endregion .             — encapsulation —





        //#region .                 — methods —

            render() {
                
            }


        //#endregion




        // MARK: ——————————————————
    }



    // MARK: ———         SUBJECTCARD        ———
    class SubjectCard extends Card {





        //#region .                — properties —


            /** The {@link Subject} corresponding to ***this*** {@link SubjectCard}. @type {Subject} @readonly */
            #subject;


            /** The {@link Module} corresponding to ***this*** {@link SubjectCard}. @type {Module} @readonly */
            #module;


            /** The {@link Semester} corresponding to ***this*** {@link SubjectCard}. @type {Semester} @readonly */
            #semester;


        //#endregion .                — properties —





        // MARK: .               — constructor —
        /**
         * @param {Subject} subject The {@link Subject} to create a {@link SubjectCard} from.
         * @throws {TypeError} if a parameter isn't of the expected type.
         */
        constructor(subject) {
            if (!(subject instanceof Subject)) { throw new TypeError("Improper SubjectCard construction: wrong 'subject' argument type, was expecting a Subject") }
            super("subject-card", "subject-card-"+subject.name.replaceSpacesWithDashes()+"-from-"+subject.module.name.replaceSpacesWithDashes()+"-in-semester-"+subject.semester.number);

            this.#subject = subject;
            this.#module = subject.module;
            this.#semester = subject.semester;
        }


        //#region .             — encapsulation —


            /** 
             * The {@link Subject} corresponding to ***this*** {@link SubjectCard}. @type {Subject} @readonly */
            get subject() { return this.#subject }

            /** 
             * The {@link Module} corresponding to ***this*** {@link SubjectCard}. @type {Module} @readonly */
            get module() { return this.#module }

            /** 
             * The {@link Semester} corresponding to ***this*** {@link SubjectCard}. @type {Semester} @readonly */
            get semester() { return this.#semester }


        //#endregion .             — encapsulation —



        // MARK: ——————————————————
    }



    // MARK: ———         MODULECARD        ———
    class ModuleCard extends Card {





        //#region .                — properties —


            /** The {@link Module} corresponding to ***this*** {@link ModuleCard}. @type {Module} @readonly */
            #module;

            /** The {@link Semester} corresponding to ***this*** {@link ModuleCard}. @type {Semester} @readonly */
            #semester;


        //#endregion .                — properties —





        // MARK: .               — constructor —
        /**
         * @param {Module} module The {@link Module} to create a {@link ModuleCard} from.
         * @throws {TypeError} if a parameter isn't of the expected type.
         */
        constructor(module) {
            if (!(module instanceof Module)) { throw new TypeError("Improper ModuleCard construction: wrong 'module' argument type, was expecting a Module") }
            super("module-card", "module-card-"+module.name.replaceSpacesWithDashes()+"-in-semester-"+module.semester.number);

            this.#module = module;
            this.#semester = module.semester;
        }


        //#region .             — encapsulation —


            /** 
             * The {@link Module} corresponding to ***this*** {@link ModuleCard}. @type {Module} @readonly */
            get module() { return this.#module }

            /** 
             * The {@link Semester} corresponding to ***this*** {@link ModuleCard}. @type {Semester} @readonly */
            get semester() { return this.#semester }


        //#endregion .             — encapsulation —


        // MARK: ——————————————————
    }



    // MARK: ———        SEMESTERCARD       ———
    class SemesterCard extends Card {





        //#region .                — properties —


            /** The {@link Semester} corresponding to ***this*** {@link SemesterCard}. @type {Semester} @readonly */
            #semester;


        //#endregion .                — properties —





        // MARK: .               — constructor —
        /**
         * @param {Semester} semester The {@link Semester} to create a {@link SemesterCard} from.
         * @throws {TypeError} if a parameter isn't of the expected type.
         */
        constructor(semester) {
            if (!(semester instanceof Semester)) { throw new TypeError("Improper SemesterCard construction: wrong 'semester' argument type, was expecting a Semester") }
            super("semester-card", "semester-card-"+semester.number);

            this.#semester = semester;
        }


        //#region .             — encapsulation —


            /** 
             * The {@link Semester} corresponding to ***this*** {@link SemesterCard}. @type {Semester} @readonly */
            get semester() { return this.#semester }


        //#endregion .             — encapsulation —
    }




    //MARK: ——————————————————

//#endregion FRONTEND





//MARK: ——————————————————
//#endregion













//MARK: ——————————————————
;




// MARK: ======= ECAMDashboard ======
class ECAMDashboard {




    // MARK: .               — constructor —
    constructor() {




        //#region Backend

            /** Array of all the {@link Grade}s of the user. @type {Grade[]} */
            this.grades     = [];

            /** Array of all the {@link Subject}s of the user. @type {Subject[]} */
            this.subjects   = [];

            /** Array of all the {@link Module}s of the user. @type {Module[]} */
            this.modules    = [];

            /** Array of all the {@link Semester}s of the user. @type {Semester[]} */
            this.semesters  = [];

            /** Array of all the non-read {@link Grade}s of the user. @type {Grade[]} */
            this.newGrades = [];

            /** Array of the string representation of all the read {@link Grade}s of the user. @type {string[]} */
            this.savedReadGrades        = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES") )            || [];

            /** Array of the string representation of all the {@link Grade}s disabled by the user. @type {string[]} */
            this.disabledGrades         = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES") )              || [];

            /** Arrary of the string representation of all the simulated {@link Grade}s created by the user. @type {string[]} */
            this.sim                    = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES") )                   || [];


            /**
             * Object representing a convenient structure to access all the backend data, in a "*JavaScript Object-access style*".
             * @type {Object.< number, { "__object__": Semester, "__modules__": string[], "module": Object.< string, { "__object__": Module, "__subjects__": string[], "subject": Object.< string, { "__object__": Subject, "grades": Grade[] } > } > } >} 
             */
            this.gradesData = {};

            /** 
             * Object representing the configuration of the modules for the user. 
             * @type {Object.< number, { "__object__": Semester, "__modules__": string[], "module": Object.< string, { "__object__": Module, "__subjects__": string[], "subject": Object.< string, { "__object__": Subject, "coefficient": number } > } > } >} 
             */
            this.moduleConfig = {};


            this.parseGrades(); 

        //#endregion Backend

    }





    //#region .                 — methods —


        /**
         * 
         */
        retrieveCachedModuleConfig() {

            let valid = true;
            const moduleConfigStringified = localStorage.getItem("ECAM-DASHBOARD-module-config-v3");
            try {
                this.moduleConfig = JSON.parse(moduleConfigStringified);
            }
            catch (e) {
                this.moduleConfig = {};
                valid = false;
            }

            if (valid) {

                Object.keys(this.moduleConfig).forEach(_sem => {
                    const sem = parseInt(_sem);
                    const semesterObj = new Semester(sem);
                    this.semesters.push(semesterObj);
                    this.moduleConfig[sem].__object__ = semesterObj;

                    Object.keys(this.moduleConfig[sem].module).forEach(module => {
                        const moduleObj = new Module(module, semesterObj);
                        this.modules.push(moduleObj);
                        this.moduleConfig[sem].module[module].__object__ = moduleObj;

                        Object.entries(this.moduleConfig[sem].module[module].subject).forEach(subjectEntry => {
                            const subjectObj = new Subject(subjectEntry[0], subjectEntry[1].coefficient, [], moduleObj);
                            this.subjects.push(subjectObj);
                            this.moduleConfig[sem].module[module].subject[subjectEntry[0]].__object__ = subjectObj;
                        })
                    })
                })
            }
            else {
                const oldModuleConfigStringified = localStorage.getItem("ECAM_DASHBOARD_MODULE_CONFIG");

                if (oldModuleConfigStringified) {
                    const oldModuleConfig = JSON.parse(oldModuleConfigStringified);

                    Object.keys(oldModuleConfig).forEach(_sem => {
                        const sem = parseInt(_sem);
                        const semesterObj = new Semester(sem);

                        this.semesters.push(semesterObj);
                        this.moduleConfig[sem] = {"__object__": semesterObj, "module": {}};

                        Object.entries(oldModuleConfig[sem]).forEach(moduleEntry => {
    
                            if (moduleEntry[0] == "__modules__") this.moduleConfig[sem].__modules__ = moduleEntry[1];
                            else {
                                const moduleObj = new Module(moduleEntry[0], semesterObj);

                                this.modules.push(moduleObj);
                                this.moduleConfig[sem].module[moduleEntry[0]] = {"__object__": moduleObj, "subject": {}};

                                Object.entries(moduleEntry[1]).forEach(subjectEntry => {
    
                                    if (subjectEntry[0] == "subjects") this.moduleConfig[sem].module[moduleEntry[0]].__subjects__ = subjectEntry[1];
                                    else if (subjectEntry[0] == "coefficients") {
                                        Object.entries(subjectEntry[1]).forEach(entry => {
                                            const subjectObj = new Subject(entry[0], entry[1], [], moduleObj);

                                            this.subjects.push(subjectObj);
                                            this.moduleConfig[sem].module[moduleEntry[0]].subject[entry[0]] = {
                                                "__object__": subjectObj,
                                                "coefficient": entry[1]
                                            };
                                        })
                                    }
                                })
                            }
                        })
                    })
                }

                this.cacheModuleConfig();
            }

            return this.moduleConfig;
        }



        cacheModuleConfig() {
            localStorage.setItem("ECAM-DASHBOARD-module-config-v3", JSON.stringify(this.moduleConfig, (key, value) => { if (key == "__object__") return undefined; else return value; }))
        }





        // MARK: _  parseGrades()
        parseGrades() {
            if (document.querySelector(".greyGridTable")) {
                const rows = document.querySelectorAll("table.greyGridTable tbody tr");

                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                        const grade     = parseFloat(cells[0].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const libelle   = cells[1].textContent.trim();
                        const coef      = parseFloat(cells[2].textContent.replace("%", "").replace(",", "."))   || 0;
                        const classAvg  = parseFloat(cells[3].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const prof      = cells[4].textContent.trim();
                        const date      = cells[5].textContent.trim();
                        const semMatch  = libelle.match(/Semester\s+(\d+)/i);
                        const semester  = semMatch ? semMatch[1] : "?";
                        const sem       = parseInt(semester);
                        const parts     = libelle.split(" - ").map(p => p.trim());
                        const subject   = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
                        const title     = parts.length >= 2 ? parts.at(-1) : "";

                        // Create a semester
                        // const semesterObj = new Semester(sem);
                        // if (!this.semesters.includes(semesterObj)) {
                        //     this.gradesData[sem] = semesterObj;
                        // }
                        
                        // if (this.moduleConfig[parseInt(semester)]) {
                        //     this.moduleConfig[parseInt(semester)].semester = semesterObj;
                        //     Object.entries(this.moduleConfig[parseInt(semester)].modules)
                        // }

                        // const subjectObj = new Subject(subject);
                        // if (!this.gradesData[sem]) {
                        //     this.subjects.push(subjectObj);
                        //     this.semesters[sem].addSubject(subjectObj);
                        //     this.semesters[sem].undefinedModule.addSubject(subjectObj);
                        // }


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
                    // this.saveReadGrades();
                }
                else {
                    this.newGrades = compareArraysOfObjects(this.grades, this.savedReadGrades).more;
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


    //#endregion — methods —

}



//MARK: ——————————————————
;







//#region Globalize classes
window.Grade            = Grade;
window.Subject          = Subject;
window.Module           = Module;
window.Semester         = Semester;

window.Setting          = Setting;
window.Settings         = Settings;
window.KeyboardShortcut = KeyboardShortcut;
window.KeyboardShortcuts= KeyboardShortcuts;


window.Card             = Card;
window.SubjectCard      = SubjectCard;
window.ModuleCard       = ModuleCard;
window.SemesterCard     = SemesterCard;


window.ECAMDashboard    = ECAMDashboard;
//#endregion


ecamDash = new ECAMDashboard();