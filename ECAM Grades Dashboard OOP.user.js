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






    // MARK: ———              Grade                ———
    class Grade {





        // MARK: ___________ — contructor — ___________
        /** 
         * Constructs a {@link Grade}.
         * 
         * @param {number}          grade       Value of *this* {@link Grade}, a positive float number below 20.
         * @param {number}          coef        Value of the coefficient of *this* {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
         * @param {number}          semester    Number of the {@link Semester} corresponding to *this* {@link Grade}.
         * @param {string}          subject     Name of the {@link Subject} of *this* {@link Grade}.
         * @param {string}          [module]    Name of the {@link Module} of *this* {@link Grade}. Default value is "\_\_#unclassified#\_\_".
         * @param {string}          [title]     Title of *this* {@link Grade}. Default value is " — ".
         * @param {boolean}         [isSim]     `true` if *this* {@link Grade} is a simulated grade, `false` otherwise.
         * @param {number|" — "}    [classAvg]  Value of the class' average of *this* {@link Grade}, a positive float number below 20. Default value is " — ".
         * @param {string}          [prof]      Name of the teacher.s who published *this* {@link Grade}. Default value is " — ".
         * @param {string}          [date]      Date of publication of *this* {@link Grade} entered by the administration. Default value is " — ".  ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         */
        constructor(grade, coef, semester, subject, module="__#unclassified#__", title=" — ", isSim=false, classAvg=" — ", prof=" — ", date=" — ") {

            /** Value of *this* {@link Grade}, a positive float number below 20 @type {number} */
            if (!isNaN(grade)) {
                this.grade      = grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20

            } else {throw new TypeError("Improper Grade construction: wrong 'grade' parameter type, was expecting a number")}

            /** Number of the semester corresponding to *this* {@link Grade} @type {number} */
            if (!isNaN(semester)) {
                this.semester   = Number(semester)

            } else {throw new TypeError("Improper Grade construction: wrong 'semester' parameter type, was expecting a number")}

            /** Name of the {@link Subject} of *this* {@link Grade} @type {string} */
            if (typeof subject == "string") {
                this.subject    = subject

            } else {throw new TypeError("Improper Grade construction: wrong 'subject' parameter type, was expecting a string")}
            
            /** Value of the coefficient of *this* {@link Grade} in its {@link Subject}, a positive float number below 100, in % @type {number} */
            if (!isNaN(coef)) {
                this.coef       = coef <= 100 ? (coef >= 0 ? Number(coef) : 0) : 100

            } else {throw new TypeError("Improper Grade construction: wrong 'coef' parameter type, was expecting a number")}

            /** Name of the {@link Module} of *this* {@link Grade} @type {string} */
            if (typeof module == "string") {
                this.module     = module

            } else {throw new TypeError("Improper Grade construction: wrong 'module' parameter type, was expecting a string")}

            /** Title of *this* {@link Grade} (default when no title was given: " — ") @type {string} */
            if (typeof title == "string") {
                this.title      = title

            } else {throw new TypeError("Improper Grade construction: wrong 'title' parameter type, was expecting a string")}

            /** `true` if *this* {@link Grade} is a simulated grade, `false` otherwise. */
            if (typeof isSim == "boolean") {
                this.isSim      = isSim

            } else {throw new TypeError("Improper Grade construction: wrong 'isSim' parameter type, was expecting a boolean")}

            /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
            this.classAvg   = (classAvg == " — " || isNaN(classAvg)) ? " — " : ( classAvg <= 20 ? (classAvg >= 0 ? classAvg : 0) : 20 );

            /** Name of the teacher.s who published *this* {@link Grade} (default when no teacher was given: " — ") @type {string} */
            if (typeof prof == "string") {
                this.prof       = prof

            } else {throw new TypeError("Improper Grade construction: wrong 'prof' parameter type, was expecting a string")}

            /** Date of publication of *this* {@link Grade} entered by the administration (default when no date was given: " — ")  
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet* @type {string} */
            if (typeof date == "string") {
                this.date       = date

            } else {throw new TypeError("Improper Grade construction: wrong 'date' parameter type, was expecting a string")}



            /** `true` if *this* {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. */
            this.enabled = true;

            /** `true` if *this* {@link Grade} was marked as read, `false` otherwise. */
            this.markedAsRead = false;
        }



        //#region ____________ — methods — ____________

            /** 
             * Verifies that *this* {@link Grade} has the exact same informations as the given {@link Grade}
             * 
             * @param {Grade} grade The {@link Grade} to compare with *this* {@link Grade}
             * @returns `true` if *this* {@link Grade} has the exact same informations as the given {@link Grade}, `false` otherwise
             */
            equals(grade) {
                if (grade instanceof Grade) {
                    return ( true 
                        && grade.grade 		== this.grade 
                        && grade.classAvg 	== this.classAvg 
                        && grade.coef 		== this.coef 
                        && grade.semester 	== this.semester 
                        && grade.subject 	== this.subject 
                        && grade.title 		== this.title 
                        && grade.prof 		== this.prof 
                        && grade.date 		== this.date 
                        && grade.isSim      == this.isSim
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
                            average += grade.grade * grade.coef;
                            totalCoef += grade.coef;
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
                            average += grade.classAvg * grade.coef;
                            totalCoef += grade.coef;
                        }
                        else validArrayOfGrades = false;
                    })

                    if (!validArrayOfGrades) return " — ";
                    else return Math.round(100*average/totalCoef)/100 || " — ";

                }
                return " — ";
            }

        //#endregion ____________ — methods — ____________





        // MARK: _________________________________________
    }




    // MARK: ———             Subject               ———
    class Subject {





        //#region ___________ — properties — ___________



        /** Name of *this* {@link Subject}. @type {string} */
        name;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
        average;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
        classAvg;

        /** Array of the {@link Grade}s in *this* {@link Subject}. @type {Grade[]} */ 
        grades;

        /** Name of the module of *this* {@link Subject}. @type {string} */
        module;

        /** Number of the semester of *this* {@link Subject}. @type {number} */
        semester;



        /** Array of the simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} */
        simGrades;

        /** Array of the disabled real {@link Grade}s in *this* {@link Subject}. @type {Grade[]} */
        disabledRealGrades;

        /** Array of the disabled simulated {@link Grade}s in *this* {@link Subject}. @type {Grade[]} */
        disabledSimGrades;

        /** Total of the coefficients of all the {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefGrades;

        /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefRealGrades;

        /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefSimGrades;

        /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefEnabledGrades;

        /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefEnabledRealGrades;

        /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Subject}. @type {number} */
        totalCoefEnabledSimGrades;



        //#endregion ___________ — properties — ___________





        // MARK: ___________ — contructor — ___________
        /**
         * Constructs an object of class {@link Subject} from an array of {@link Grade}s and an optional coefficient.
         * 
         * The array of {@link Grade}s may be empty/undefined, in this case, the next parameters `name`, `module` and `semester` **must** be provided. This will create a simulated subject
         * 
         * If `name`, `module` and/or `semester` parameter.s are/is given, every {@link Grade} will have its corresponding property modified to the parameter's value.
         * 
         * Otherwise, the array of {@link Grade}s **MUST** contain {@link Grade}s of same subject `name`, `module` and `semester` property.  
         * For each `name`, `module` and `semester` parameters individually, 
         * throws an error if at least one {@link Grade} doesn't have the same value as the first {@link Grade} of the Array AND the corresponding property missmatched isn't given as parameter.
         * 
         * @example 
         * const grade1 = new Grade(20, 25, 1, "Mathematics for Engineers 1", "Mathematics for Engineers 1", "Midterm 1", false, 20, "Bitar Diala",  date="12/09/2023");
         * const grade2 = new Grade(18, 25, 1, "Mathematics for Engineers 1", "Mathematics for Engineers 1", "Midterm 2", false, 10, "Bitar Diala",  date="13/09/2023");
         * const grade3 = new Grade(20, 50, 1, "Mathematics for Engineers 1", "Mathematics for Engineers 1", "Final",     false, 20, "Bitar Diala",  date="13/10/2023");
         * const grade4 = new Grade(15, 15, 1, "General Mechanics 1",         "Mechanics for Engineers 1",   "Lab",       false, 20, "HAJJAR Ahmad", date="13/11/2023");
         * 
         * const properSubject = new Subject([grade1, grade2, grade3], 60, "Mathematics for Engineers 1", "Mathematics for Engineers 1", 1);
         * // Creates the "Mathematics for Engineers 1" from the "Mathematics for Engineers 1" module of semester 1, 
         * // with a coefficient in the module of 60% and contains the grades contained in an Array of Grades
         * 
         * const properSimSubject = new Subject(undefined, 60, "Mathematics for Engineers 1", "Mathematics for Engineers 1", 1);
         * // Creates the "Mathematics for Engineers 1" from the "Mathematics for Engineers 1" module of semester 1, 
         * // with a coefficient in the module of 60%, containing no grades yet (undefined Array of Grade)
         * 
         * const badSimSubject = new Subject([], 60, "Mathematics for Engineers 1", "Mathematics for Engineers 1");
         * // Throws an Error: "Improper Subject construction: wrong 'semester' argument type, was expecting a number"
         * // Since no semester parameter was given while the Array of Grades is empty
         * 
         * const properShortSubject = new Subject([grade1, grade2, grade3], 60);
         * // Creates the "Mathematics for Engineers 1" from the "Mathematics for Engineers 1" module of semester 1, 
         * // with a coefficient in the module of 60% and contains the grades contained in an Array of Grades,
         * // just like properSubject, as grade1, grade2 and grade3 have the same subject, module and semester respective properties.
         * 
         * const improperShortSubject = new Subject([grade1, grade2, grade3, grade4], 60);
         * // Throws an Error: "Improper Subject construction: the Grades in the Array of Grades don't all have the same subject name"
         * // Since grade4 doesn't have the same module name as the rest, and no module parameter was given
         * 
         * const improperShortSubjectWithFallbackModule = new Subject([grade1, grade2, grade3, grade4], 60, "Mathematics for Engineers 1");
         * // Throws an Error: "Improper Subject construction: the Grades in the Array of Grades don't all have the same subject name"
         * // Since grade4 doesn't have the same subject name as the rest, and no subject parameter was given.
         * // This time, compared to improperShortSubject, it doesn't throw an error on the module's name, 
         * // as every grade are forcibly given the "Mathematics for Engineers 1" module name (useful in case of moving a subject to another module)
         * 
         * 
         * @param {Grade[]} grades      Array of the {@link Grade}s in *this* {@link Subject}. Default value is `[]`. 
         * @param {number}  [coef]      Coefficient of *this* {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
         * @param {string}  [module]    Name of the {@link Module} *this* {@link Subject} will belong to.
         * @param {string}  [name]      Name to give to *this* {@link Subject}.
         * @param {number}  [semester]  Number of the semester *this* {@link Subject} will belong to.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If `name`, `module` and/or `semester` isn't/aren't given, and the corresponding property of at least one {@link Grade} in the Array of {@link Grade}s differs from the first {@link Grade} of the same Array.
         */
        constructor(grades=[], coef=100, module=null, name=null, semester=null) {
            let subjectName = null,
                moduleName = null,
                semesterNumber = null
            ;

            if (grades instanceof Array) {
                subjectName     = name      || grades[0]?.subject;
                moduleName      = module    || grades[0]?.module;
                semesterNumber  = semester  || grades[0]?.semester;

                grades.forEach(grade => {
                    if (grade instanceof Grade) {
                        // If the name of the module of a Grade isn't the same as the one given as parameter (or the one of the first Grade if the parameter isn't given),
                        // gives the module parameter to the module property of the Grade if the parameter was given, otherwise throws an Error
                        // => FALLBACK ALLOWED
                        if (grade.module    != moduleName) {
                            if (module) grade.module = module;
                            else {throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same module name")}
                        }

                        // If the name of the subject of a Grade isn't the same as the one given as parameter (or the one of the first Grade if the parameter isn't given),
                        // throws an Error
                        // => FALLBACK NOT ALLOWED
                        if (grade.subject   != subjectName) {
                            throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same subject name")
                        }

                        // If the number of the semester of a Grade isn't the same as the one given as parameter (or the one of the first Grade if the parameter isn't given),
                        // throws an Error
                        // => FALLBACK NOT ALLOWED
                        if (grade.semester  != semesterNumber)  {
                            throw new Error("Improper Subject construction: the Grades in the Array of Grades don't all have the same semester number")
                        }
                    }
                    else {throw new TypeError("Improper Subject construction: the 'grades' argument is not an Array of GRADES (and ONLY of Grades), was expecting an Array of Grades")}

                });
            }
            else {throw new TypeError("Improper Subject construction: the 'grades' argument is not an ARRAY, was expecting an Array of Grades")}



            this.grades = grades;


            /** Coefficient of *this* {@link Subject} in its {@link Module}. @type {number} */  
            if (!isNaN(coef)) {
                this.coef = coef <= 100 ? (coef >= 0 ? coef : 0) : 100;

            } else {throw new TypeError("Improper Subject construction: wrong 'coef' argument type, was expecting a number")};


            // Constructing from an Array of Grades
            if (this.grades.length > 0) {

                this.name       = subjectName;
                this.module     = moduleName;
                this.semester   = semesterNumber;

            }
            // Constructing a simulated subject, it doesn't have grades (yet)
            else {
                if (typeof name == "string") {
                    this.name = name;

                } else {throw new TypeError("Improper Subject construction: wrong 'name' argument type, was expecting a string")};


                if (typeof module == "string") {
                    this.module = module;

                } else {throw new TypeError("Improper Subject construction: wrong 'module' argument type, was expecting a string")};


                if (!isNaN(semester)) {
                    this.semester = Number(semester);

                } else {throw new TypeError("Improper Subject construction: wrong 'semester' argument type, was expecting a number")};
            }


            this.computeStats();

        }




        //#region ____________ — methods — ____________





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
                
                this.simGrades = simGrades;

                this.disabledRealGrades         = disabledRealGrades;
                this.disabledSimGrades          = disabledSimGrades;
                this.totalCoefGrades            = Math.round(totalCoefGrades);
                this.totalCoefRealGrades        = Math.round(totalCoefRealGrades);
                this.totalCoefSimGrades         = Math.round(totalCoefSimGrades);
                this.totalCoefEnabledGrades     = Math.round((totalCoefGrades-totalCoefDisabledGrades));
                this.totalCoefEnabledRealGrades = Math.round((totalCoefRealGrades-totalCoefDisabledRealGrades));
                this.totalCoefEnabledSimGrades  = Math.round((totalCoefSimGrades-totalCoefDisabledSimGrades));

                this.average = Grade.average(this.grades);
                this.classAvg = Grade.classAverage(this.grades);
            }

        //#endregion ____________ — methods — ____________





        // MARK: _________________________________________
    }




    // MARK: ———             Module               ———
    class Module {





        //#region ___________ — properties — ___________



        /** Name of *this* {@link Module}. @type {string} */
        name;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
        average;

        /** Value of the class' average of *this* {@link Grade}, a positive float number below 20 @type {number} */
        classAvg;

        /** Object of the {@link Subject}s in *this* {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} as value. @type {{string: Subject}} */
        subjects;

        /** Number of the semester of *this* {@link Module}. @type {number} */
        semester;



        /** Array of the {@link Grade}s in *this* {@link Module}. @type {Grade[]} */
        grades;

        /** Array of the simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} */
        simGrades;

        /** Array of the disabled real {@link Grade}s in *this* {@link Module}. @type {Grade[]} */
        disabledRealGrades;

        /** Array of the disabled simulated {@link Grade}s in *this* {@link Module}. @type {Grade[]} */
        disabledSimGrades;



        /** Total of the coefficients of all the {@link Subject}s in *this* {@link Module}. @type {number} */ 
        totalCoefSubjects;

        /** Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in *this* {@link Module}. @type {number} */ 
        totalCoefSubjectsNoGrade;

        /** Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in *this* {@link Module}. @type {number} */ 
        totalCoefSubjectsNoEnabledGrade;



        /** Total of the coefficients of all the {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefGrades;

        /** Total of the coefficients of all the real {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefRealGrades;

        /** Total of the coefficients of all the simulated {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefSimGrades;

        /** Total of the coefficients of all the enabled {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefEnabledGrades;

        /** Total of the coefficients of all the enabled real {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefEnabledRealGrades;

        /** Total of the coefficients of all the enabled simulated {@link Grade}s in *this* {@link Module}. @type {number} */
        totalCoefEnabledSimGrades;



        //#endregion





        // MARK: ___________ — contructor — ___________
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
         * @param {Subject[]}   [subjects]  Array of the {@link Subject}s in *this* {@link Module}. Default value is `[]`. 
         * @param {string}      [name]      Name of *this* {@link Module}.
         * @param {number}      [semester]  Number of the semester of *this* {@link Module}.
         * 
         * @throws {TypeError} If a parameter is of an unexpected type.
         * @throws {Error} If `name` and/or `semester` isn't/aren't given, and the corresponding property of at least one {@link Subject} in the Array of {@link Subject}s differs from the first {@link Subject} of the same Array.
         */
        constructor(subjects=[], name=null, semester=null) {
            let 
                moduleName      = null,
                semesterNumber  = null,

                /** @type {Map<string, Subject>} */ subjectsEntries = new Map();
            ;

            if (subjects instanceof Array) {
                semesterNumber  = semester  || subjects[0]?.semester;
                moduleName      = name      || subjects[0]?.module;

                subjects.forEach(subject => {
                    if (subject instanceof Subjects) {
                        // If the name of the module of a Grade isn't the same as the one given as parameter (or the one of the first Grade if the parameter isn't given),
                        // gives the module parameter to the module property of the Grade if the parameter was given, otherwise throws an Error
                        // => FALLBACK ALLOWED
                        if (subject.module != moduleName) {
                            if (name) {subject.module = name}
                            else {throw new Error("Improper Module construction: the Subjects in the Array of Subjects parameter 'subjectsOrGrades' don't all have the same module name")}
                        }

                        // If the number of the semester of a Grade isn't the same as the one given as parameter (or the one of the first Grade if the parameter isn't given),
                        // throws an Error
                        // => FALLBACK NOT ALLOWED
                        if (subject.semester != semesterNumber) {
                            throw new Error("Improper Module construction: the Subjects in the Array of Subjects parameter 'subjectsOrGrades' don't all have the same semester number")
                        }

                        subjectsEntries.set(subject.name, subject);

                    } else {throw new TypeError("Improper Module construction: the 'subjectsOrGrades' parameter is not an Array of SUBJECTS (and ONLY Subjects), was expecting an Array of Subjects")}
                })
            } else {throw new TypeError("Improper Module construction: the 'subjectsOrGrades' parameter is not an ARRAY, was expecting an Array of Subjects")}



            this.subjects = Object.fromEntries(subjectsEntries);

            const nbSubjects = Object.keys(this.subjects).length;



            // Constructing from an Array of Subjects
            if (nbSubjects > 0) {

                this.name       = moduleName;
                this.semester   = semesterNumber;

            }
            // Constructing a simulated module, it doesn't have subjects (yet)
            else {
                if (typeof name == "string") {
                    this.name = name;

                } else {throw new TypeError("Improper Module construction: wrong 'name' argument type, was expecting a string")}


                if (!isNaN(semester)) {
                    this.semester = Number(semester);

                } else {throw new TypeError("Improper Module construction: wrong 'semester' argument type, was expecting a number")}
            }

            this.computeStats();

        }




        //#region ____________ — methods — ____________





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


                this.grades             = grades;
                this.simGrades          = simGrades;
                this.disabledRealGrades = disabledRealGrades;
                this.disabledSimGrades  = disabledSimGrades;

                this.totalCoefSubjects                 = totalCoefSubjects;
                this.totalCoefSubjectsNoGrade          = totalCoefSubjectsNoGrade;
                this.totalCoefSubjectsNoEnabledGrade   = totalCoefSubjectsNoEnabledGrade;

                this.totalCoefGrades            = Math.round(totalCoefGrades/nbSubjects);
                this.totalCoefRealGrades        = Math.round(totalCoefRealGrades/nbSubjects);
                this.totalCoefSimGrades         = Math.round(totalCoefSimGrades/nbSubjects);
                this.totalCoefEnabledGrades     = Math.round(totalCoefEnabledGrades/nbSubjects);
                this.totalCoefEnabledRealGrades = Math.round(totalCoefEnabledRealGrades/nbSubjects);            
                this.totalCoefEnabledSimGrades  = Math.round(totalCoefEnabledSimGrades/nbSubjects);

                this.average    = Grade.average(this.grades);
                this.classAvg   = Grade.classAverage(this.grades);
            }

        //#endregion ____________ — methods — ____________





        // MARK: _________________________________________
    }





    //MARK: -.
    ;



    // MARK: ———              Setting              ———
    class Setting {}




    // MARK: ———     KeyboardShortcut      ———
    class KeyboardShortcut {}




    //MARK: ——————————————————

//#endregion BACKEND
//#endregion










//#region — FRONTEND —
//MARK: ——————————————————



//#region ========  FRONTEND  ========






    // MARK: ———               Card                 ———
    class Card {





        //#region ___________ — properties — ___________

            /** The ECAM Grades Dashboard. @type {ECAMDashboard|ECAMDash} */
            ecamDash;

            /** CSS Class of *this* {@link Card}, in the HTML Element sense. @type {string} @readonly */
            class;

            /** id of *this* {@link Card}, in the HTML Element sense. @type {string} @readonly */
            id;




        //#endregion ___________ — properties — ___________





        // MARK: ___________ — contructor — ___________
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

        // MARK: _________________________________________
    }



    // MARK: ———         ModuleCard           ———
    class ModuleCard extends Card {

    }






    //MARK: ——————————————————

//#endregion FRONTEND
//#endregion








//MARK: ——————————————————
;




// MARK: ECAMDashboard  =============
class ECAMDashboard {




    // MARK: ___________ — contructor — ___________
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





    //#region -—— Methods





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
