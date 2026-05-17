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
// - [OPTIONALLY] enabled "render characters"                   (Settings > Text Editor > Minimap: Render Characters => checked)            (Right click on minimap > Render Characters)
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





//#region — BACKEND —
//MARK: ——————————————————



//#region ========= BACKEND =========




    // MARK: ——————————————————





    // MARK: ———              GRADE               ———
    class Grade {





        //#region .                — properties —


        /** Value of *this* {@link Grade}, a positive float number below 20. @type {number} */
        #grade;

        /** The {@link Subject} of *this* {@link Grade}. @type {Subject} @readonly */
        #subject;

        /** The {@link Module} of *this* {@link Grade}. Has a getter and a setter. @type {Module}  */
        #module;

        /** The {@link Semester} of *this* {@link Grade}. @type {Semester} @readonly */
        #semester;

        /** Value of the coefficient of *this* {@link Grade} in its {@link Subject}, a positive float number below 100, in %. @type {number} */
        #coef;

        /** Title of *this* {@link Grade} (default when no title was given: " — "). @type {string} */
        #title;

        /** `true` if *this* {@link Grade} is a simulated grade, `false` otherwise. @type {boolean} @readonly */
        #isSim;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
        #classAvg;

        /** Name of the teacher.s who published *this* {@link Grade} (default when no teacher was given: " — ") @type {string} @readonly */
        #teacher;

        /** Date of publication of *this* {@link Grade} entered by the administration (default when no date was given: " — ").  
         * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* @type {string} @readonly 
         */
        #date;

        /** `true` if *this* {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. @type {boolean} */
        #enabled;

        /** `true` if *this* {@link Grade} was marked as read, `false` otherwise. @type {boolean} */
        #markedAsRead;


        //#endregion .                — properties —





        // MARK: .                — contructor —
        /** 
         * Constructs a {@link Grade}.
         * 
         * @param {number}          grade               Value of *this* {@link Grade}, a positive float number below 20.
         * @param {number}          coef                Value of the coefficient of *this* {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
         * @param {Subject}         subject             The {@link Subject} *this* {@link Grade} will belong to.
         * @param {string}          [title=" — "]       Title of *this* {@link Grade}. Default value is " — ".
         * @param {boolean}         [isSim=false]       `true` if *this* {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
         * @param {number|" — "}    [classAvg=" — "]    Value of the class' average of *this* {@link Grade}, a positive float number below 20. Default value is " — ".
         * @param {string}          [prof=" — "]        Name of the teacher.s who published *this* {@link Grade}. Default value is " — ".
         * @param {string}          [date=" — "]        Date of publication of *this* {@link Grade} entered by the administration. Default value is " — ". ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         */
        constructor(grade, coef, subject, title=" — ", isSim=false, classAvg=" — ", prof=" — ", date=" — ") {

            if (isNaN(grade))                   { throw new TypeError("Improper Grade construction: wrong '" + "grade"   + "' parameter type, was expecting a number")  }
            if (!(subject instanceof Subject))  { throw new TypeError("Improper Grade construction: wrong '" + "subject" + "' parameter type, was expecting a Subject") } 
            if (isNaN(coef))                    { throw new TypeError("Improper Grade construction: wrong '" + "coef"    + "' parameter type, was expecting a number")  }
            if (typeof title == "string")       { throw new TypeError("Improper Grade construction: wrong '" + "title"   + "' parameter type, was expecting a string")  }
            if (typeof isSim == "boolean")      { throw new TypeError("Improper Grade construction: wrong '" + "isSim"   + "' parameter type, was expecting a boolean") }
            if (typeof prof == "string")        { throw new TypeError("Improper Grade construction: wrong '" + "prof"    + "' parameter type, was expecting a string")  }
            if (typeof date == "string")        { throw new TypeError("Improper Grade construction: wrong '" + "date"    + "' parameter type, was expecting a string")  }


            this.#grade     = grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20;
            this.#coef      = coef <= 100 ? (coef >= 0 ? Number(coef) : 0) : 100;
            
            this.#subject   = subject;
            this.#module    = subject.module;
            this.#semester  = subject.semester;

            this.#title     = title;
            this.#isSim     = isSim;

            this.#classAvg  = (classAvg == " — " || isNaN(classAvg)) ? " — " : ( classAvg <= 20 ? (classAvg >= 0 ? classAvg : 0) : 20 );

            this.#prof      = prof;
            this.#date      = date;


            this.#enabled = true;

            this.#markedAsRead = false;
        }


        //#region .             — encapsulation —


            /** Value of *this* {@link Grade}, a positive float number below 20. @type {number} */
            get grade()     { return this.#grade    }
            set grade(value) {
                if (isNaN(value)) { throw new Error("Invalid Grade.grade setting: tried to set 'grade' to a type other than number") }
                this.#grade = value <= 20 ? (value >= 0 ? Number(value) : 0) : 20;
            }

            /** Value of the coefficient of *this* {@link Grade} in its {@link Subject}, a positive float number below 100, in %. @type {number} */
            get coef()      { return this.#coef     }
            set coef(value) {
                if (isNaN(value)) { throw new Error("Invalid Grade.coef setting: tried to set 'coef' to a type other than number") }
                this.#coef = value <= 100 ? (value >= 0 ? Number(value) : 0) : 100;
            }

            /** The {@link Subject} of *this* {@link Grade}. @type {Subject} @readonly */
            get subject()   { return this.#subject  }

            /** The {@link Module} of *this* {@link Grade}. Has a getter and a setter. @type {Module}  */
            get module()    { return this.#module   }
            set module(value)    {
                if (!(value instanceof Module)) {throw new Error("Invalid Grade.module setting: tried to set 'module' to a type other than Module")}

                this.#module = value;
            }

            /** The {@link Semester} of *this* {@link Grade}. @type {Semester} @readonly */
            get semester()  { return this.#semester }

            /** Title of *this* {@link Grade} (default when no title was given: " — "). @type {string} */
            get title()     { return this.#title    }
            set title(value) {
                if (typeof value != "string") { throw new Error("Invalid Grade.title setting: tried to set 'title' to a type other than string") }
                this.#title = value;
            }

            /** `true` if *this* {@link Grade} is a simulated grade, `false` otherwise. @type {boolean} @readonly */
            get isSim()     { return this.#isSim    }

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
            get classAvg()  { return this.#classAvg }
            set classAvg(value) {
                this.#classAvg = (value == " — " || isNaN(value)) ? " — " : ( value <= 20 ? (value >= 0 ? value : 0) : 20 );
            }

            /** Name of the teacher.s who published *this* {@link Grade} (default when no teacher was given: " — ") @type {string} @readonly */
            get prof()      { return this.#prof      }

            /** Date of publication of *this* {@link Grade} entered by the administration (default when no date was given: " — ").  
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* @type {string} @readonly 
             */
            get date()      { return this.#date      }

            /** `true` if *this* {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. @type {boolean} */
            get enabled()   { return this.#enabled  }
            set enabled(value) {
                if (typeof value != "boolean") { throw new Error("Invalid Grade.enabled setting: tried to set 'enabled' to a type other than boolean") }
                this.#enabled = value;
            }

            /** `true` if *this* {@link Grade} was marked as read, `false` otherwise. @type {boolean} */
            get markedAsRead() { return this.#markedAsRead }
            set markedAsRead(value) {
                if (typeof value != "boolean") { throw new Error("Invalid Grade.markedAsRead setting: tried to set 'markedAsRead' to a type other than boolean") }
                this.#markedAsRead = value;
            }



        //#endregion .             — encapsulation —





        //#region .                 — methods —

            /** 
             * Verifies that *this* {@link Grade} has the exact same informations as the given {@link Grade}
             * 
             * @param {Grade} grade The {@link Grade} to compare with *this* {@link Grade}
             * @returns `true` if *this* {@link Grade} has the exact same informations as the given {@link Grade}, `false` otherwise
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
             * Calculates the weighted average between all the given {@link Grade}s' value, rounded to the nearest hundredth of the average
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
             * Calculates the weighted average between all the given {@link Grade}s' classAvg value, rounded to the nearest hundredth of the average
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

        //#endregion .                 — methods —







        // MARK: ——————————————————
    }



    // MARK: ———             SUBJECT             ———
    class Subject {





        //#region .                — properties —



        /** Name of *this* {@link Subject}. @type {string} */
        #name;

        /** Coefficient of *this* {@link Subject} in its {@link Module}. @type {number} */
        #coef;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
        #average;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
        #classAvg;

        /** Array of the {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */ 
        #grades;

        /** Name of the module of *this* {@link Subject}. @type {Module} */
        #module;

        /** The {@link Semester} of *this* {@link Subject}. @type {Semester} @readonly */
        #semester;



        /** Array of the simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
        #simGrades;

        /** Array of the disabled real {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
        #disabledRealGrades;

        /** Array of the disabled simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
        #disabledSimGrades;

        /** Total of the coefficients of all the {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefGrades;

        /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefRealGrades;

        /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefSimGrades;

        /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefEnabledGrades;

        /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefEnabledRealGrades;

        /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
        #totalCoefEnabledSimGrades;



        //#endregion .                — properties —





        // MARK: .                — contructor —
        /**
         * Constructs an object of class {@link Subject} from an array of {@link Grade}s and an optional coefficient.
         * 
         * The array of {@link Grade}s may be empty/undefined, in this case, the next parameters `name` and `module` **must** be provided. This will create a simulated subject.
         * 
         * 
         * @param {Grade[]} [grades=[]] Array of the {@link Grade}s in *this* {@link Subject}. Default value is `[]`. 
         * @param {number}  [coef=100]  Coefficient of *this* {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
         * @param {string}  [name]      Name to give to *this* {@link Subject}.
         * @param {Module}  [module]    The {@link Module} *this* {@link Subject} will belong to.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If the `subject` and/or `module` property of at least one {@link Grade} in the Array of {@link Grade}s differs from that of the first {@link Grade} of the same Array, or from the corresponding constructor parameter if given instead.
         */
        constructor(grades=[], coef=100, name=undefined, module=undefined) {
            if (!(grades instanceof Array)) { throw new TypeError("Improper Subject construction: the 'grades' argument is not an ARRAY, was expecting an Array of Grades") }
            if (isNaN(coef))                { throw new TypeError("Improper Subject construction: wrong 'coef' argument type, was expecting a number") }
            if (name !== undefined && typeof name !== "string")         { throw new TypeError("Improper Subject construction: wrong 'name' argument type, was expecting a string or undefined") }
            if (module !== undefined && !(module instanceof Module))    { throw new TypeError("Improper Subject construction: wrong 'module' argument type, was expecting a Module or undefined") }


            const
                subjectName = name              || grades[0]?.subject.name,
                moduleObj   = module            || grades[0]?.module
            ;


            grades.forEach(grade => {
                if (!(grade instanceof Grade)) { 
                    throw new TypeError("Improper Subject construction: the 'grades' argument is not an Array of GRADES (and ONLY of Grades), was expecting an Array of Grades");
                }

                if (grade.subject != subjectName) {
                    throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same subject name");
                }

                if (grade.module != moduleObj) {
                    throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same module name");
                }

            });

            this.#coef = coef <= 100 ? (coef >= 0 ? Number(coef) : 0) : 100;
            this.#grades = grades;

            // Constructing from an Array of Grades
            if (this.#grades.length > 0) {
                this.#name      = this.#grades[0].subject;
                this.#module    = this.#grades[0].module;
                this.#semester  = this.#grades[0].semester;
            }
            // Constructing a simulated subject, it doesn't have grades (yet)
            else {
                this.#name      = name;
                this.#module    = module;
                this.#semester  = module.semester;
            }

            this.computeStats();
        }


        //#region .             — encapsulation —

            /** Name of *this* {@link Subject}. @type {string} */
            get name()      { return this.#name     }
            set name(value) {
                if (typeof value != "string") { throw new Error("Invalid Subject.name setting: tried to set 'name' to a type other than string") }
                this.#name = value;
            }

            /** Coefficient of *this* {@link Subject} in its {@link Module}. @type {number} */
            get coef()      { return this.#coef     }
            set coef(value) {
                if (isNaN(value)) { throw new Error("Invalid Subject.coef setting: tried to set 'coef' to a type other than number") }
                this.#coef = value <= 100 ? (value >= 0 ? value : 0) : 100;
            }

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get average()   { return this.#average  }

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get classAvg()  { return this.#classAvg }

            /** Array of the {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
            get grades()    { return this.#grades   }

            /** The {@link Module} of *this* {@link Subject}. @type {Module} */
            get module()    { return this.#module   }
            set module(value)    {
                if (!(value instanceof Module)) {throw new Error("Invalid Subject.module setting: tried to set 'module' to a type other than Module")}
                this.#module = value;
            }

            /** The {@link Semester} of *this* {@link Subject}. @type {Semester} @readonly */
            get semester()  { return this.#semester }

            /** Array of the simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
            get simGrades() { return this.#simGrades }

            /** Array of the disabled real {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /** Array of the disabled simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} @readonly */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /** Total of the coefficients of all the {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefSimGrades() { return this.#totalCoefSimGrades }

            /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Subject}. @type {number} @readonly */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledSimGrades }



        //#endregion .             — encapsulation —





        //#region .                 — methods —





            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of *this* {@link Subject}.
             */
            computeStats() {
                //#region
                let /** @type {Grade[]} */ simGrades=[], 
                    /** @type {Grade[]} */ disabledRealGrades=[], 
                    /** @type {Grade[]} */ disabledSimGrades=[], 

                    /** @type {number} */ totalCoefGrades = 0,
                    /** @type {number} */ totalCoefRealGrades = 0,
                    /** @type {number} */ totalCoefSimGrades = 0,
                    /** @type {number} */ totalCoefDisabledGrades = 0, 
                    /** @type {number} */ totalCoefDisabledRealGrades = 0, 
                    /** @type {number} */ totalCoefDisabledSimGrades = 0
                ;
                //#endregion

                this.grades.forEach(grade => {
                    totalCoefGrades += grade.coef;

                    switch ((grade.enabled ? "enabled " : "disabled ") + (grade.isSim ? "sim " : "real ") + "grade") {

                        case "disabled real grade":
                            disabledRealGrades.push(grade);
                            totalCoefDisabledGrades     += grade.coef;
                            totalCoefDisabledRealGrades += grade.coef;
                        case "enabled real grade":
                            totalCoefRealGrades += grade.coef;
                        break;

                        case "disabled sim grade":
                            disabledSimGrades.push(grade);
                            totalCoefDisabledGrades     += grade.coef;
                            totalCoefDisabledSimGrades  += grade.coef;
                        case "enabled sim grade":
                            simGrades.push(grade);
                            totalCoefSimGrades  += grade.coef;
                        break;

                    }

                });
                
                this.#simGrades = simGrades;

                this.#disabledRealGrades         = disabledRealGrades;
                this.#disabledSimGrades          = disabledSimGrades;
                this.#totalCoefGrades            = Math.round(totalCoefGrades);
                this.#totalCoefRealGrades        = Math.round(totalCoefRealGrades);
                this.#totalCoefSimGrades         = Math.round(totalCoefSimGrades);
                this.#totalCoefEnabledGrades     = Math.round(totalCoefGrades       -totalCoefDisabledGrades);
                this.#totalCoefEnabledRealGrades = Math.round(totalCoefRealGrades   -totalCoefDisabledRealGrades);
                this.#totalCoefEnabledSimGrades  = Math.round(totalCoefSimGrades    -totalCoefDisabledSimGrades);

                this.#average   = Grade.average(this.#grades);
                this.#classAvg  = Grade.classAverage(this.#grades);
            }

        //#endregion .                 — methods —







        // MARK: ——————————————————
    }



    // MARK: ———            MODULE              ———
    class Module {





        //#region .                — properties —



        /** Name of *this* {@link Module}. @type {string} */
        #name;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
        #average;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
        #classAvg;

        /** Object of the {@link Subject}s in *this* {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} as value. @type {{string: Subject}} */
        #subjects;

        /** The {@link Semester} of *this* {@link Module}. @type {Semester} @readonly */
        #semester;



        /** Array of the {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
        #grades;

        /** Array of the simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
        #simGrades;

        /** Array of the disabled real {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
        #disabledRealGrades;

        /** Array of the disabled simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
        #disabledSimGrades;



        /** Total of the coefficients of all the {@link Subject}s in *this* {@link Module}. @type {number} @readonly */ 
        #totalCoefSubjects;

        /** Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in *this* {@link Module}. @type {number} @readonly */ 
        #totalCoefSubjectsNoGrade;

        /** Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in *this* {@link Module}. @type {number} @readonly */ 
        #totalCoefSubjectsNoEnabledGrade;



        /** Total of the coefficients of all the {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefGrades;

        /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefRealGrades;

        /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefSimGrades;

        /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefEnabledGrades;

        /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefEnabledRealGrades;

        /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
        #totalCoefEnabledSimGrades;



        //#endregion





        // MARK: .                — contructor —
        /**
         * Constructs an object of class {@link Module} from an array of {@link Subject}s.
         * 
         * The array of {@link Subject}s may be empty/undefined, in this case, the next parameters `name` and `semester` **must** be provided. This will create a simulated module.
         * 
         * If `name` and/or `semester` parameter.s are/is given, every {@link Subject} will have its corresponding property modified to the parameter's value.
         * 
         * Otherwise, the array of {@link Subject}s **MUST** contain {@link Subject}s of same module `name` and `semester` property.  
         * For each `name` and `semester` parameters individually, 
         * throws an error if at least one {@link Subject} doesn't have the same value as the first {@link Subject} of the Array AND the corresponding property missmatched isn't given as parameter.
         * 
         * @param {Subject[]}   [subjects=[]]  Array of the {@link Subject}s in *this* {@link Module}. Default value is `[]`. 
         * @param {string}      [name]      Name of *this* {@link Module}.
         * @param {Semester}    [semester]  The {@link Semester} *this* {@link Module} will belong to.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If the `name` and/or `semester` property of at least one {@link Subject} in the Array of {@link Subject}s differs from that of the first {@link Subject} of the same Array, or from the corresponding constructor parameter if given instead.
         */
        constructor(subjects=[], name=undefined, semester=undefined) {
            if (!(subjects instanceof Array)) { throw new TypeError("Improper Module construction: the 'subjectsOrGrades' parameter is not an ARRAY, was expecting an Array of Subjects") }
            if (typeof name != "string" && name !== undefined)              { throw new TypeError("Improper Module construction: wrong 'name' argument type, was expecting a string or undefined") }
            if (!(semester instanceof Semester) && semester !== undefined)  { throw new TypeError("Improper Module construction: wrong 'name' argument type, was expecting a Semester or undefined") }


            const 
                moduleName   = name      || subjects[0]?.module.name,
                semesterObj  = semester  || subjects[0]?.semester
            ;

            /** @type {Map<string, Subject>} */
            let subjectsEntries = new Map();


            subjects.forEach(subject => {
                if (!(subject instanceof Subjects)) { 
                    throw new TypeError("Improper Module construction: the 'subjectsOrGrades' parameter is not an Array of SUBJECTS (and ONLY Subjects), was expecting an Array of Subjects") 
                }

                if (subject.module != moduleName) {
                    throw new Error("Improper Module construction: the Subjects in the Array of Subjects parameter 'subjectsOrGrades' don't all have the same module name")
                }

                if (subject.semester != semesterObj) {
                    throw new Error("Improper Module construction: the Subjects in the Array of Subjects parameter 'subjectsOrGrades' don't all have the same semester number")
                }

                subjectsEntries.set(subject.name, subject);

            })



            this.#subjects = Object.fromEntries(subjectsEntries);

            const nbSubjects = Object.keys(this.#subjects).length;



            // Constructing from an Array of Subjects
            if (nbSubjects > 0) {

                this.#name      = moduleName;
                this.#semester  = semesterObj;

            }
            // Constructing a simulated module, it doesn't have subjects (yet)
            else {

                this.#name = name;
                this.#semester = Number(semester);

            }

            this.computeStats();

        }


        //#region .             — encapsulation —

            /** Name of *this* {@link Module}. @type {string} */
            get name()      { return this.#name }
            set name(value) {
                if (typeof value != "string") { throw new Error("Invalid Module.name setting: tried to set 'name' to a type other than string") }
                this.#name = value;
            }

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get average()   { return this.#average }

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} @readonly */
            get classAvg()  { return this.#classAvg }

            /** Object of the {@link Subject}s in *this* {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} as value. @type {{string: Subject}} */
            get subjects()  { return this.#subjects }
            set subjects(value) {
                if (typeof value != "object" || value === null) { throw new Error("Invalid Module.subjects setting: tried to set 'subjects' to a type other than object") }
                this.#subjects = value;
            }

            /** The {@link Semester} of *this* {@link Module}. @type {Semester} @readonly */
            get semester()  { return this.#semester }

            /** Array of the {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
            get grades()    { return this.#grades }

            /** Array of the simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
            get simGrades() { return this.#simGrades }

            /** Array of the disabled real {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /** Array of the disabled simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} @readonly */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /** Total of the coefficients of all the {@link Subject}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefSubjects() { return this.#totalCoefSubjects }

            /** Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefSubjectsNoGrade() { return this.#totalCoefSubjectsNoGrade }

            /** Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefSubjectsNoEnabledGrade() { return this.#totalCoefSubjectsNoEnabledGrade }

            /** Total of the coefficients of all the {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefSimGrades() { return this.#totalCoefSimGrades }

            /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Module}. @type {number} @readonly */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledSimGrades }


        //#endregion .             — encapsulation —





        //#region .                 — methods —





            // MARK: _  fromGrades()
            /**
             * Builds a **new** {@link Module} of given name from a given Array of {@link Grade}s.
             * 
             * @param {Grade[]} grades  Array of the {@link Grade}s to build a {@link Module} from.
             * @param {string}  name    Name of the {@link Module} to build from the given Array of {@link Grade}s.
             * 
             * @returns A **new** {@link Module} of the given name from the given Array of {@link Grade}s.
             * 
             * @throws {TypeError} If a parameter is of an unexpected type.
             */
            static fromGrades(grades, name) {
                if (typeof name != "string") {throw new TypeError("Module.fromGrades() error: the given 'name' parameter isn't a string, was expecting a string")}

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

                        } else {throw new TypeError("Module.fromGrades() error: the given 'grades' parameter isn't an Array of Grades (and ONLY Grades), was expecting an Array of Grades")}
                    });

                    const nbSubjects = Object.keys(subjectsObject).length;
                    let remainingCoef = 100;

                    Object.entries(subjectsObject).forEach((entry, index) => {
                        const coef = Math.round(100/nbSubjects);
                        remainingCoef -= index == nbSubjects-1 ? 0 : coef;
                        
                        subjects.push(new Subject(entry[1], index == nbSubjects-1 ? remainingCoef : coef, entry[0], name));
                    })

                    return new Module(subjects, name);


                } else {throw new TypeError("Module.fromGrades() error: the given 'grades' parameter isn't an Array, was expecting an Array of Grades")}
            }


            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of *this* {@link Module}.
             */
            computeStats() {
                //#region 
                let 
                    /** @type {Grade[]} */ grades               = [],
                    /** @type {Grade[]} */ simGrades            = [],
                    /** @type {Grade[]} */ disabledRealGrades   = [],
                    /** @type {Grade[]} */ disabledSimGrades    = [],

                    /** @type {number} */ totalCoefSubjects                 = 0,
                    /** @type {number} */ totalCoefSubjectsNoGrade          = 0,
                    /** @type {number} */ totalCoefSubjectsNoEnabledGrade   = 0,

                    /** @type {number} */ totalCoefGrades               = 0,
                    /** @type {number} */ totalCoefRealGrades           = 0,
                    /** @type {number} */ totalCoefSimGrades            = 0,
                    /** @type {number} */ totalCoefEnabledGrades        = 0,
                    /** @type {number} */ totalCoefEnabledRealGrades    = 0,
                    /** @type {number} */ totalCoefEnabledSimGrades     = 0,

                    /** @type {Subject[]} */ subjectsBelow100       = [],
                    /** @type {Subject[]} */ subjectsOver100        = [],
                    /** @type {Subject[]} */ subjectsReallyBelow100 = [],
                    /** @type {Subject[]} */ subjectsReallyOver100  = [],
                    /** @type {Subject[]} */ subjectsNoEnabledGrade = [],
                    /** @type {Subject[]} */ subjectsNoGrade        = []
                ;
                //#endregion
                
                Object.values(this.subjects).forEach(subject => {
                    const nbGrades = subject.grades.length;

                    grades.push(...subject.grades);
                    simGrades.push(...subject.simGrades);
                    disabledRealGrades.push(...subject.disabledRealGrades);
                    disabledSimGrades.push(...subject.disabledSimGrades);

                    totalCoefSubjects               += subject.coef;
                    if (nbGrades == 0) {
                        totalCoefSubjectsNoGrade    += subject.coef;
                        subjectsNoGrade++;
                    }
                    if (nbGrades == subject.disabledRealGrades.length + subject.disabledSimGrades.length) {
                        totalCoefSubjectsNoEnabledGrade += subject.coef;
                        subjectsNoEnabledGrade++;
                    }

                    totalCoefGrades             += subject.totalCoefGrades;
                    totalCoefRealGrades         += subject.totalCoefRealGrades;
                    totalCoefSimGrades          += subject.totalCoefSimGrades;
                    totalCoefEnabledGrades      += subject.totalCoefEnabledGrades;
                    totalCoefEnabledRealGrades  += subject.totalCoefEnabledRealGrades;
                    totalCoefEnabledSimGrades   += subject.totalCoefEnabledSimGrades;

                    if      (subject.totalCoefGrades < 100) subjectsBelow100.push(subject);
                    else if (subject.totalCoefGrades > 100) subjectsOver100 .push(subject);

                    if      (subject.totalCoefRealGrades < 100) subjectsReallyBelow100.push(subject);
                    else if (subject.totalCoefRealGrades > 100) subjectsReallyOver100 .push(subject);
                })


                this.#grades             = grades;
                this.#simGrades          = simGrades;
                this.#disabledRealGrades = disabledRealGrades;
                this.#disabledSimGrades  = disabledSimGrades;

                this.#totalCoefSubjects                 = totalCoefSubjects;
                this.#totalCoefSubjectsNoGrade          = totalCoefSubjectsNoGrade;
                this.#totalCoefSubjectsNoEnabledGrade   = totalCoefSubjectsNoEnabledGrade;

                this.#totalCoefGrades            = Math.round(totalCoefGrades/nbSubjects);
                this.#totalCoefRealGrades        = Math.round(totalCoefRealGrades/nbSubjects);
                this.#totalCoefSimGrades         = Math.round(totalCoefSimGrades/nbSubjects);
                this.#totalCoefEnabledGrades     = Math.round(totalCoefEnabledGrades/nbSubjects);
                this.#totalCoefEnabledRealGrades = Math.round(totalCoefEnabledRealGrades/nbSubjects);            
                this.#totalCoefEnabledSimGrades  = Math.round(totalCoefEnabledSimGrades/nbSubjects);

                this.#average    = Grade.average(this.grades);
                this.#classAvg   = Grade.classAverage(this.grades);
            }

        //#endregion .                 — methods —







        // MARK: ——————————————————
    }



    // MARK: ———           SEMESTER            ———
    class Semester {







        // MARK: ——————————————————

    }





    //MARK: -.
    ;



    // MARK: ———             SETTING             ———
    class Setting {







        // MARK: ——————————————————

    }



    // MARK: ———   KEYBOARDSHORTCUT   ———
    class KeyboardShortcut {}




    //MARK: ——————————————————

//#endregion BACKEND
//#endregion










//#region — FRONTEND —
//MARK: ——————————————————



//#region ========  FRONTEND  ========




    // MARK: ——————————————————






    // MARK: ———               CARD               ———
    class Card {





        //#region .                — properties —

            /** The ECAM Grades Dashboard. @type {ECAMDashboard|ECAMDash} */
            ecamDash;

            /** CSS Class of *this* {@link Card}, in the HTML Element sense. @type {string} @readonly */
            class;

            /** id of *this* {@link Card}, in the HTML Element sense. @type {string} @readonly */
            id;




        //#endregion .                — properties —





        // MARK: .                — contructor —
        constructor(ecamDash=window.ecamDash, className, id) {
            if (ecamDash instanceof ECAMDashboard) {
                this.ecamDash = ecamDash;

            } else {throw new TypeError("Improper Card construction: wrong 'ecamDash' argument type, was expecting an ECAMDashboard")}


            if (typeof className == "string") {
                this.class = className;

            } else {throw new TypeError("Improper Card construction: wrong 'className' argument type, was expecting a string")}


            if (typeof id == "string") {
                this.id = id;

            } else {throw new TypeError("Improper Card construction: wrong 'id' argument type, was expecting a string")}
        }

        // MARK: ——————————————————
    }



    // MARK: ———         MODULECARD        ———
    class ModuleCard extends Card {}




    //MARK: ——————————————————

//#endregion FRONTEND
//#endregion








//MARK: ——————————————————
;




// MARK: ECAMDashboard  =============
class ECAMDashboard {




    // MARK: .                — contructor —
    constructor(online) {




        //#region Grades

            this.grades     = [];
            this.semesters  = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};
            this.savedReadGrades        = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES"))             || [];
            this.sim                    = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES"))                    || {};
            this.newGrades = [];
        
            this.disabledGrades         = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES"))               || [];
            this.getGradesData();
        
        //#endregion

    }





    //#region .                 — methods —





        // MARK: _  parseGrades()
        /** 
         * Reads the grades from the intranet's grades table, and prepares the backend grades data.
         */
        parseGrades() {
            if (document.querySelector(".greyGridTable")) {
                const rows = document.querySelectorAll("table.greyGridTable tbody tr");
                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                        const grade     = parseFloat(cells[0].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const classAvg  = parseFloat(cells[3].textContent.replace("/20", "").replace(",", ".")) || 0;
                        const libelle   = cells[1].textContent.trim();
                        const coef      = parseFloat(cells[2].textContent.replace("%", "").replace(",", ".")) || 0;
                        const prof      = cells[4].textContent.trim();
                        const date      = cells[5].textContent.trim();
                        const semMatch  = libelle.match(/Semester\s+(\d+)/i);
                        const semester  = semMatch ? semMatch[1] : "?";
                        const parts     = libelle.split(" - ").map(p => p.trim());
                        const subject   = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
                        const title     = parts.length >= 2 ? parts.at(-1) : "";

                        this.grades.push(new Grade( grade, coef, semester, subject, undefined, title, false, classAvg, prof, date ));
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



        // MARK: _  getGradesData()
        getGradesData() {
            this.gradesData = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}, 6:{}, 7:{}, 8:{}, 9:{}, 10:{}};

            this.grades.forEach(grade => {

            })
        }

    //#endregion
}



//MARK: ——————————————————
;








window.Grade            = Grade;
window.Subject          = Subject;
window.Module           = Module;
window.Setting          = Setting;
window.KeyboardShortcut = KeyboardShortcut;

window.Card             = Card;
window.ModuleCard       = ModuleCard;

window.ECAMDashboard    = ECAMDashboard;
