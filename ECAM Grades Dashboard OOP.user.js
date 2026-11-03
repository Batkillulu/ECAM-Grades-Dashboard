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

//@ts-check



//#region — General functions —





    // MARK: ——————————————————
    ;



    //#region === Add methods to prototypes ===




        // MARK: ——————————————————
        ;








        //#region ———              STRING              ———
        String.prototype.replaceSpacesWithDashes = function () {
            return String(this).replaceAll(/\s/ig, "-")
        };
        //#endregion 





        //#region ———            FUNCTION           ———




        // MARK: _  getArguments()
        // @ts-ignore
        Function.prototype.getArguments = function (args = undefined, allowedTypes = undefined) {
            
            const hasArgs = args !== undefined && isArguments(args);
            const hasAllowedTypes = allowedTypes !== undefined && isWellFormedAllowedTypes(allowedTypes);
            const argNames = getFunctionParamNames(this);

            if (!hasArgs && !hasAllowedTypes) {
                return argNames;
            }

            /**
             * @type {{[name: string]: { value?: any; allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]; }}}
             */
            const out = {};
            argNames.forEach((name, i) => {
                /**
                 * @type {{ value?: any; allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]; }}
                 */
                const entry = {};
                if (hasArgs) entry.value = args[i];
                if (hasAllowedTypes) entry.allowedTypes = allowedTypes[i];
                out[name] = entry;
            });

            return out;
        };


        // MARK: _  getArgument()
        Function.prototype.getArgument = function (
            /** @type {number} */ index, 
            /** @type {IArguments|undefined} */ args = undefined
        ) {
            const getArgs = this.getArguments();

            return (args !== undefined && isArguments(args))
                ? Object.entries(getArgs)[index]
                // @ts-ignore
                : getArgs[index];
        };


        // MARK: _  getArgumentfromValue()
        Function.prototype.getArgumentFromValue = function (
            /** @type {IArguments} */ args, 
            /** @type {any} */ value, 
            /** @type {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]|undefined} */ allowedTypes=undefined
        ) {
            const argsObj = this.getArguments(args, allowedTypes);
            const found = Object.entries(argsObj).find(([, info]) => info.value === value);
            if (!found) {
                throw new Error(`Couldn't find the given value "${value}" from this function's given args.`);
            }
            return found;
        };





    //#endregion 




    // MARK: ——————————————————
    ;


    /**
     * Checks whether the given value is a function that can be used to construct an Object.
     * @param {Function} value The Function to verify.
     * @returns `true` if the given value is a function that can be used to construct an Object, `false` otherwise.
     */
    function isConstructible(value) {
        if (typeof value !== "function") return false;
        try {
            Reflect.construct(String, [], value); // "value" as newTarget, doesn't actually run value's body meaningfully but validates [[Construct]]
            return true;
        } catch {
            return false;
        }
    }


    /**
     * Checks whether the given value is a class.
     * @param {Function} value The Function to verify.
     * @returns `true` if the given value is a class, `false` otherwise.
     */
    function isClass(value) {
        if (typeof value !== "function") return false;
        return /^class[\s{]/.test(Function.prototype.toString.call(value));
    }



    /**
     * Checks whether the given value is an {@link IArguments}.
     * @param {IArguments} value Value to check.
     * @returns `true` if args is an {@link IArguments}, `false` otherwise.
     */
    function isArguments(value) {
        return Object.prototype.toString.call(value) === "[object Arguments]";
    }



    // MARK:                 — internals —
    //#region

        /**
         * Finds the parameter-list source between the first `(` at `openIndex` and its matching `)`.
         * @param {string} src 
         * @param {number} openIndex
         */
        function extractBalancedParens(src, openIndex) {
            let depth = 0;
            for (let i = openIndex; i < src.length; i++) {
                if (src[i] === "(") depth++;
                else if (src[i] === ")") {
                    depth--;
                    if (depth === 0) return src.slice(openIndex + 1, i);
                }
            }
            return null; // unbalanced source, shouldn't happen for a real function
        }

        /**
         * Splits `str` on `separator`, ignoring occurrences nested inside (), [], or {}.
         * @param {string} str 
         * @param {string} separator
         */
        function splitTopLevel(str, separator) {
            const parts = [];
            let depth = 0;
            let current = "";
            for (const c of str) {
                if ("([{".includes(c)) depth++;
                else if (")]}".includes(c)) depth--;

                if (c === separator && depth === 0) {
                    parts.push(current);
                    current = "";
                } else {
                    current += c;
                }
            }
            parts.push(current);
            return parts;
        }

        /**
         * Cuts a single parameter's source off at its top-level default-value `=`, if any.
         * @param {string} paramStr 
         */
        function stripDefaultValue(paramStr) {
            let depth = 0;
            for (let i = 0; i < paramStr.length; i++) {
                const c = paramStr[i];
                if ("([{".includes(c)) depth++;
                else if (")]}".includes(c)) depth--;
                else if (
                    c === "=" && depth === 0 &&
                    paramStr[i + 1] !== ">" &&                                   // not "=>"
                    !["=", "!", "<", ">"].includes(paramStr[i - 1] ?? "")        // not "==", "!=", "<=", ">="
                ) {
                    return paramStr.slice(0, i).trim();
                }
            }
            return paramStr.trim();
        }

        /**
         * Extracts the parameter names of a function, in declaration order.
         * Handles: normal functions, methods, arrow functions with parens,
         * single-param arrow functions WITHOUT parens (`x => ...`), default
         * values — including ones containing nested calls/arrays/objects
         * (`b = compute(1, 2)`, `b = [1, 2, 3]`) — and rest parameters (`...rest`).
         *
         * @param {Function} func
         * @returns {string[]}
         */
        function getFunctionParamNames(func) {
            if (typeof func !== "function") return [];

            const src = Function.prototype.toString.call(func);
            const openIndex = src.indexOf("(");

            let paramsStr;
            if (openIndex === -1) {
                // Parenless single-param arrow: `x => ...` (optionally `async x => ...`)
                const arrowMatch = src.match(/^\s*(?:async\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*=>/);
                paramsStr = arrowMatch ? arrowMatch[1] : "";
            } else {
                paramsStr = extractBalancedParens(src, openIndex) ?? "";
            }

            if (paramsStr.trim() === "") return [];

            return splitTopLevel(paramsStr, ",")
                .map(p => stripDefaultValue(p).replace(/^\.\.\./, "").trim())
                .filter(Boolean);
        }

        /**
         * Loose structural check for "is this a plausible allowedTypes array" —
         * an array whose entries are each a string, a function, or (recursively)
         * another such array of alternatives.
         *
         * @param {any} allowedTypes
         * @returns {boolean}
         */
        function isWellFormedAllowedTypes(allowedTypes) {
            if (!Array.isArray(allowedTypes)) return false;
            const isValidEntry = (/** @type {Function|string|(Function|string)[]} */ entry) =>
                typeof entry === "string" ||
                typeof entry === "function" ||
                (Array.isArray(entry) && entry.every(isValidEntry));
            return allowedTypes.every(isValidEntry);
        }

    //#endregion




//#endregion General functions




    // MARK: ——————————————————
//#endregion 















//#region — BACKEND —
// MARK: ——————————————————





//#region ========= BACKEND =========




    // MARK: _________________________________________
    ;




    // MARK: ———              GRADE               ———
    class Grade {





        // MARK:                  — properties —
        //#region


            /** 
             * Value of ***this*** {@link Grade}, a positive float number below 20. 
             * @type {number}
             */
            #grade;

            /** 
             * Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, in %. 
             * @type {number}
             */
            #coef;

            /** 
             * Title of ***this*** {@link Grade}. 
             * @type {string}
             */
            #title = " — ";

            /** 
             * Date of publication of ***this*** {@link Grade} entered by the administration (default when no date was given: " — ").
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* 
             * @type {string}
             */
            #date;

            /** 
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 
             * @type {number}
             */
            #classAvg = NaN;

            /** 
             * The {@link Subject} of ***this*** {@link Grade}. 
             * @type {Subject}
             */
            #subject;

            /** 
             * The {@link Module} of ***this*** {@link Grade}. 
             * @type {Module}
             */
            #module;

            /** 
             * The {@link Semester} of ***this*** {@link Grade}. 
             * @type {Semester}
             */
            #semester;

            /** 
             * `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. 
             * @type {boolean} 
             * @readonly
             */
            #isSim;

            /** 
             * A 17-digits *wannabe unique* id number for a simulated grade, built from the time stamp of its creation. 
             * @type {number|undefined} 
             * @readonly
             */
            #id;

            /** 
             * Name of the teacher.s who published ***this*** {@link Grade} (default when no teacher was given: " — ") 
             * @type {string}
             */
            #prof;

            /** 
             * `true` if ***this*** {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise. 
             * @type {boolean}
             */
            #enabled = true;

            /** 
             * `true` if ***this*** {@link Grade} was marked as read, `false` otherwise. 
             * @type {boolean}
             */
            #markedAsRead = false;



            /**
             * Separator used to separate the semester, the module, the subject and the title of a grade in its string representation.
             * @type {"\/\/\\"}
             * @readonly
             */
            static gradePathSeparator = "\/\/\\";



            /**
             * Separator used to separate the string representation of multiple grades.
             * @type {"|"}
             * @readonly
             */
            static gradesSeparator = "|";





        //#endregion — properties —




        // MARK:                 — constructor —
        /**
         * Constructs a {@link Grade}.
         *
         * @param {number|string}                       grade       Value of ***this*** {@link Grade}, a positive float number below 20.
         * @param {number|string}                       coef        Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
         * @param {Subject}                             subject     The {@link Subject} ***this*** {@link Grade} will belong to.
         * @param {string|undefined}                    title       Title of ***this*** {@link Grade}. Default value is " — ".
         * @param {boolean|undefined}                   isSim       `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
         * @param {number|string|undefined}             classAvg    Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. Default value is " — ".
         * @param {string|undefined}                    prof        Name of the teacher.s who published ***this*** {@link Grade}. Default value is " — ".
         * @param {string|undefined}                    date        Date of publication of ***this*** {@link Grade} entered by the administration. Default value is " — ". ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
         * @param {number|undefined}                    id          An id number for a simulated grade, built from the time stamp of its creation. The id is guaranted to be unique.
         * @param {boolean}                             [enabled=false]
         */
        constructor(grade, coef, subject, title=" — ", isSim=false, classAvg=undefined, prof=" — ", date=" — ", id=undefined, enabled=true) {
            this.#grade = typeof grade === "number" ? (grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20) : parseFloat(grade);
            this.#coef  = typeof coef === "number" ? (coef <= 100 ? (coef  >= 0 ? Number(coef)  : 0) : 100) : parseFloat(coef);


            this.#subject   = subject;
            this.#module    = subject.module;
            this.#semester  = subject.semester;


            this.#title = title;
            this.#isSim = isSim;

            if (isSim) {
                if (id) {
                    this.#id = id;
                }
                else {
                    const t = new Date();
                    this.#id = parseInt(""
                        + t.getFullYear()
                        + String(t.getMonth())          .padStart(2, "0")
                        + String(t.getDate())           .padStart(2, "0")
                        + String(t.getHours())          .padStart(2, "0")
                        + String(t.getMinutes())        .padStart(2, "0")
                        + String(t.getSeconds())        .padStart(2, "0")
                        + String(t.getMilliseconds())   .padStart(3, "0")
                    );
                }
            }
            else {
                this.#id = undefined;
            }


            if (classAvg) {
                if (typeof classAvg === "number") {
                    this.#classAvg = classAvg <= 20 ? (classAvg >= 0 ? classAvg : 0) : 20;
                }
                else if (!isNaN(parseFloat(classAvg))) {
                    this.#classAvg = parseFloat(classAvg) <= 20 ? (parseFloat(classAvg) >= 0 ? parseFloat(classAvg) : 0) : 20;
                }
            }

            this.#prof      = prof;
            this.#date      = date;

            this.#enabled       = enabled;
            this.#markedAsRead  = false;

            this.#subject.grades.push(this);
        }


        // MARK:               — encapsulation —
        //#region


            /** 
             * Value of ***this*** {@link Grade}, a positive float number below 20.
             */
            get grade()     { return this.#grade }
            set grade(value) {
                this.#grade = value <= 20 ? (value >= 0 ? Number(value) : 0) : 20;
                this.updateUpHierarchyStats()
            }

            /** 
             * Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, in %.
             * @type {number}
             */
            get coef()      { return this.#coef }
            /**
             * @param {string | number} value
             */
            set coef(value) {
                if (typeof value === "string") { value = parseFloat(value); }

                this.#coef = value <= 100 ? (value >= 0 ? Number(value) : 0) : 100;
                this.updateUpHierarchyStats()
            }

            /** 
             * The {@link Subject} of ***this*** {@link Grade}.
             */
            get subject()   { return this.#subject }
            set subject(value)    {
                this.#subject = value;
            }


            /** 
             * The {@link Module} of ***this*** {@link Grade}.
             */
            get module()    { return this.#module }
            set module(value)    {
                this.#module = value;
            }

            /** 
             * The {@link Semester} of ***this*** {@link Grade}.
             */
            get semester()  { return this.#semester }
            set semester(value) {
                const oldSem = this.#semester;
                this.#semester = value;
                oldSem.computeStats(true, true);
                this.updateUpHierarchyStats()
            }

            /** 
             * Title of ***this*** {@link Grade} (default when no title was given: " — ").
             */
            get title()     { return this.#title    }
            set title(value) {
                this.#title = value;
            }

            /** 
             * `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise.
             * @readonly
             */
            get isSim()     { return this.#isSim    }

            /** 
             * A 17-digits *wannabe unique* id number for a simulated grade, built from the time stamp of its creation.
             * @readonly
             */
            get id()        { return this.#id }

            /** 
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20.
             * @type {number}
             */
            get classAvg()  { return this.#classAvg }
            /**
             * @param {number|string|undefined} value 
             */
            set classAvg(value) {
                if (typeof value === "string") { value = parseInt(value); }

                this.#classAvg = (!value || isNaN(value)) ? NaN : ( (value) <= 20 ? (value >= 0 ? value : 0) : 20 );
                this.updateUpHierarchyStats()
            }

            /** 
             * Name of the teacher.s who published ***this*** {@link Grade} (default when no teacher was given: " — ") 
             */
            get prof()      { return this.#prof      }
            set prof(value) {
                this.#prof = value
            }

            /**
             * Date of publication of ***this*** {@link Grade} entered by the administration (default when no date was given: " — ").
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* 
             */
            get date()      { return this.#date      }
            set date(value) {
                this.#date = value;
            }

            /** 
             * `true` if ***this*** {@link Grade} is enabled (so it counts in the calculation of the averages), `false` otherwise.
             */
            get enabled()   { return this.#enabled  }
            set enabled(value) {
                this.#enabled = value;
                this.updateUpHierarchyStats()
            }

            /** 
             * `true` if ***this*** {@link Grade} was marked as read, `false` otherwise.
             */
            get markedAsRead() { return this.#markedAsRead }
            set markedAsRead(value) {
                this.#markedAsRead = value;
            }



        //#endregion — encapsulation —




        // MARK:                   — methods —
        //#region

        



            // MARK: _  toString()
            /**
             * Gives the full string representation of ***this*** {@link Grade}.
             * The returned string representation is can be used as a unique identifier of a grade,
             * but also conveys all the data to know abou the grade (enabled or not, read or not, id if simulated, classAverage, grade, coef).
             * Looks like:
             * ```
             * `${semesterNumber}\\${moduleName}\\${subjectName}\\${title} : ${grade}/20 vs ${classAvg}/20, ${coef}% ${""|`(${id})`} [${"ON"|"OFF"}${""|", UNREAD"}]`
             * ```
             * @returns The string representation of ***this*** {@link Grade}.
             */
            toString() {
                return "" +
                    this.#semester + Grade.gradePathSeparator +
                    this.#module + Grade.gradePathSeparator +
                    this.#subject + Grade.gradePathSeparator +
                    this.#title + " : " +
                    this.#grade + "/20 vs " +
                    this.#classAvg + "/20, " +
                    this.#coef + "% " +
                    ( this.#isSim ? "("+this.#id+") " : "" ) +
                    ( this.#isSim ? "("+this.#prof+") " : "")+
                    "("+this.#date+") "+
                    "["+(this.#enabled ? "ON" : "OFF")+( this.#isSim ? "" : ( this.#markedAsRead ? "" : ", UNREAD") )+"]"
                ;
            }



            // MARK: _  uniqueIdentifier()
            /**
             * Gives a short string representation of ***this*** {@link Grade}, 
             * shorter than {@link Grade#toString()}.
             * The returned string representation is the smallest string representation 
             * that can be used as a unique identifier of a grade.
             * Looks like:
             * ```
             * `${semesterNumber}\\${moduleName}\\${subjectName}\\${title}`
             * ```
             * @returns A short string representation of ***this*** {@link Grade}. Guaranted to be unique for the ***this*** {@link Grade}.
             */
            getUniqueIdentifier() {
                return "" +
                    this.#semester + "\\" +
                    this.#module + "\\" +
                    this.#subject + "\\" +
                    this.#title
                ;
            }




            // MARK: _  equals()
            /**
             * Verifies that ***this*** {@link Grade} has the exact same informations as the given {@link Grade}
             *
             * @param {Grade} grade The {@link Grade} to compare with ***this*** {@link Grade}
             * @returns `true` if ***this*** {@link Grade} has the exact same informations as the given {@link Grade}, `false` otherwise
             */
            equals(grade) {
                if (grade instanceof Grade) {
                    return ( true
                        && grade.#grade 	    == this.#grade
                        && grade.#classAvg 	    == this.#classAvg
                        && grade.#coef 		    == this.#coef
                        && grade.#semester 	    == this.#semester
                        && grade.#subject 	    == this.#subject
                        && grade.#title 	    == this.#title
                        && grade.#prof 		    == this.#prof
                        && grade.#date 		    == this.#date
                        && grade.#isSim         == this.#isSim
                        && grade.#id            == this.#id
                        && grade.#enabled       == this.#enabled
                        && grade.#markedAsRead  == this.#markedAsRead
                    );
                }
                else return false;
            }



            // MARK:_  correspondsTo()
            /**
             * Checks whether the given Grade's unique descriptor (or the given Grade unique descriptor directly) 
             * is equal to ***this*** {@link Grade}'s unique descriptor.
             * 
             * @param {Grade | string} grade The {@link Grade} (or its unique descriptor string) ***this*** {@link Grade} should correspond to.
             */
            correspondsTo(grade) {
                var out = false;

                if (grade instanceof Grade) out = this.getUniqueIdentifier() === grade.getUniqueIdentifier();
                else out = this.getUniqueIdentifier() === grade;

                return out;
            }





            // MARK: _  static average()
            /**
             * This static method calculates the weighted average between all the given {@link Grade}s' value, rounded to the nearest hundredth of the average.
             *
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted average from.
             */
            static average(...grades) {
                let avg = 0, totalCoef = 0;

                for (const grade of grades) {
                    if (grade.enabled && !isNaN(grade.grade)) {
                        avg += grade.#grade * grade.#coef;
                        totalCoef += grade.#coef;
                    }
                }

                return Math.round(100*avg/totalCoef)/100;
            }


            // MARK: _  static classAverage()
            /**
             * This static method calculates the weighted average between all the given {@link Grade}s' classAvg value,
             * rounded to the nearest hundredth of the average.
             *
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted class average from.
             */
            static classAverage(...grades) {
                let avg = 0, totalCoef = 0;

                for (const grade of grades) {
                    if (grade.#enabled && !isNaN(grade.#classAvg)) {
                        avg += grade.#classAvg * grade.#coef;
                        totalCoef += grade.#coef;
                    }
                }

                return Math.round(100*avg/totalCoef)/100;
            }



            // MARK: _  updateUpHierarchyStats()
            updateUpHierarchyStats() {
                this.#semester.computeStats(this.#module, this.#subject)
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Grade = Grade;



    // MARK: ———             SUBJECT             ———
    class Subject {





        // MARK:                  — properties —
        //#region 



            /**
             * Name of ***this*** {@link Subject}. 
             * @type {string}
             */
            #name;

            /** 
             * Coefficient of ***this*** {@link Subject} in its {@link Module}. 
             * @type {number} 
             */
            #coef;

            /** 
             * Average of the user for ***this*** {@link Subject}, a positive float number below 20. 
             * @type {number} 
             */
            #average = NaN;

            /** 
             * Value of the class' average for ***this*** {@link Subject}, a positive float number below 20. 
             * @type {number} 
             */
            #classAvg = NaN;

            /** 
             * Array of the {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             * @readonly 
             */
            #grades = [];

            /** 
             * Name of the module of ***this*** {@link Subject}. 
             * @type {Module} 
             */
            #module;

            /**
             * The {@link Semester} (or its number) of ***this*** {@link Subject}. 
             * @type {Semester} 
             */
            #semester;



            /** 
             * Array of the real {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #realGrades = [];

            /** 
             * Array of the simulated {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #simGrades = [];

            /** 
             * Array of the enabled {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #enabledGrades = [];

            /** 
             * Array of the disabled {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #disabledGrades = [];

            /** 
             * Array of the enabled real {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #enabledRealGrades = [];

            /** 
             * Array of the disabled real {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #disabledRealGrades = [];

            /** 
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #enabledSimGrades = [];

            /** 
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Subject}. 
             * @type {Grade[]} 
             */
            #disabledSimGrades = [];

            /** 
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Subject}. 
             * @type {number} 
             */
            #totalCoefGrades = NaN;

            /** 
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Subject}. 
             * @type {number} 
             */
            #totalCoefRealGrades = NaN;

            /** 
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Subject}. 
             * @type {number} 
             */
            #totalCoefEnabledGrades = NaN;

            /** 
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Subject}. 
             * @type {number} 
             */
            #totalCoefEnabledRealGrades = NaN;



            /** 
             * The {@link SubjectCard} corresponding to ***this*** {@link Subject}. 
             * @type {SubjectCard}
             * @readonly
             */
            #subjectCard;



        //#endregion — properties —





        // MARK:                 — constructor —
        /**
         * Constructs an object of class {@link Subject}.
         *
         * @param {string}              name                Name to give to ***this*** {@link Subject}.
         * @param {Module|Semester}     moduleOrSemester    The {@link Module} ***this*** {@link Subject} will belong to, or the {@link Semester} whose undefined {@link Module} ***this*** {@link Subject} will belong to.
         * @param {number}              [coef=100]          Coefficient of ***this*** {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
         */
        constructor(name, moduleOrSemester, coef=100) {
            this.#name      = name;
            this.#coef      = coef <= 100 ? (coef >= 0 ? coef : 0) : 100;

            if (moduleOrSemester instanceof Module) {
                const module = moduleOrSemester;
                this.#semester  = module.semester;
                this.#module    = module;
            }
            else {
                const semester = moduleOrSemester;
                this.#semester  = semester;
                this.#module    = semester.undefinedModule;
            }
            this.#module.addSubjects(this);

            this.#subjectCard = new SubjectCard(this);
        }


        // MARK:               — encapsulation —
        //#region 

            /**
             * Name of ***this*** {@link Subject}.
             */
            get name()      { return this.#name     }
            set name(value) {
                this.#name = value;
            }

            /**
             * Coefficient of ***this*** {@link Subject} in its {@link Module}.
             */
            get coef()      { return this.#coef     }
            set coef(value) {
                this.#coef = value <= 100 ? (value >= 0 ? value : 0) : 100;
                this.updateUpHierarchyStats()
            }

            /**
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. @readonly
             */
            get average()   { return this.#average  }

            /**
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. @readonly
             */
            get classAvg()  { return this.#classAvg }

            /**
             * Array of the {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get grades()    { return this.#grades   }

            /**
             * The {@link Module} of ***this*** {@link Subject}.
             */
            get module()    { return this.#module }
            set module(value)    {
                const oldMod = this.#module;
                this.#module = value;
                this.updateUpHierarchyStats()
                oldMod.updateUpHierarchyStats()
            }

            /**
             * The {@link Semester} (or its number) of ***this*** {@link Subject}.
             * @readonly
             */
            get semester()  { return this.#semester }

            /**
             * Array of the real {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get realGrades() { return this.#realGrades }

            /**
             * Array of the simulated {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get simGrades() { return this.#simGrades }

            /**
             * Array of the enabled {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get enabledGrades() { return this.#enabledGrades }

            /**
             * Array of the disabled {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get disabledGrades() { return this.#disabledGrades }

            /**
             * Array of the enabled real {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get enabledRealGrades() { return this.#enabledRealGrades }

            /**
             * Array of the disabled real {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /**
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get enabledSimGrades() { return this.#enabledSimGrades }

            /**
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /**
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /**
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /**
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefSimGrades() { return this.#totalCoefGrades && this.#totalCoefRealGrades ? (this.#totalCoefGrades - this.#totalCoefRealGrades) : undefined }

            /**
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /**
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /**
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Subject}. @readonly
             */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades && this.#totalCoefEnabledRealGrades ? (this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades) : undefined }



        //#endregion — encapsulation —





        // MARK:                   — methods —
        //#region 




            // MARK: _  toString()
            toString() {
                return ""+this.#semester + "\\" + this.#module + "\\" + this.#name
            }




            // MARK: _  equals()
            /**
             *
             * @param {any} subject
             * @returns {boolean}
             */
            equals(subject) {
                if (!(subject instanceof Subject)) {
                    return false;
                }

                if (true
                    && this.#name == subject.#name
                    && this.#module.equals(subject.#module)
                    && this.#semester.equals(subject.#semester)
                ) {
                    return true;
                }

                return false;
            }



            // MARK: _  static average()
            /**
             * 
             * @param  {...Subject} subjects 
             */
            static average(...subjects) {
                let avg = 0, totalSubjCoef = 0;

                for (const subject of subjects) {
                    if (!isNaN(subject.#average)) {
                        avg += subject.#average * subject.#coef
                        totalSubjCoef += subject.#coef;
                    }
                }

                return Math.round(100*avg/totalSubjCoef)/100;
            }



            // MARK: _  static classAverage()
            /**
             * 
             * @param  {...Subject} subjects 
             */
            static classAverage(...subjects) {
                let avg = 0, totalSubjCoef = 0;

                for (const subject of subjects) {
                    if (!isNaN(subject.#classAvg)) {
                        avg += subject.#classAvg * subject.#coef
                        totalSubjCoef += subject.#coef;
                    }
                }

                return Math.round(100*avg/totalSubjCoef)/100;
            }




            
            // MARK: _  addGrades()
            /**
             * Adds a {@link Grade} to ***this*** {@link Subject}.
             * @param {...Grade} grades The {@link Grade} to add to ***this*** {@link Subject}.
             * @returns {Subject} ***this*** {@link Subject}.
             */
            addGrade(...grades) {
                for (const grade of grades) {
                    grade.subject = this;
                    grade.module = this.#module;
                    grade.semester = this.#semester;

                    this.#grades.push(grade);
                }

                return this;
            }




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

                for (const grade of this.grades) {

                    totalCoefGrades += grade.coef;

                    switch ((grade.enabled ? "enabled " : "disabled ") + (grade.isSim ? "sim " : "real ") + "grade") {

                        case "disabled real grade":
                            disabledGrades      .push(grade);
                            realGrades          .push(grade);
                            disabledRealGrades  .push(grade);

                            totalCoefRealGrades         += grade.coef;
                        break;

                        case "enabled real grade":
                            enabledGrades       .push(grade);
                            realGrades          .push(grade);
                            enabledRealGrades   .push(grade);

                            totalCoefRealGrades         += grade.coef;
                            totalCoefEnabledGrades      += grade.coef;
                            totalCoefEnabledRealGrades  += grade.coef;
                        break;

                        case "disabled sim grade":
                            disabledGrades      .push(grade);
                            simGrades           .push(grade);
                            disabledSimGrades   .push(grade);
                        break;

                        case "enabled sim grade":
                            enabledGrades       .push(grade);
                            simGrades           .push(grade);
                            enabledSimGrades    .push(grade);

                            totalCoefEnabledGrades      += grade.coef;
                        break;

                    }

                }

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

                this.#average   = Grade.average(...this.#grades);
                this.#classAvg  = Grade.classAverage(...this.#grades);

                return this;
            }



            // MARK: _  updateUpHierarchyStats()
            updateUpHierarchyStats() {
                this.#semester.computeStats(this.#module, this)
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Subject = Subject;


    // MARK: ———             MODULE             ———
    class Module {





        // MARK:                 — properties —
        //#region 



            /**
             * Name of ***this*** {@link Module}. 
             * @type {string}
             */
            #name;

            /** 
             * The {@link Semester} of ***this*** {@link Module}, or its number. 
             * @type {Semester} 
             */
            #semester;

            /** 
             * Average of the user for ***this*** {@link Module}, a positive float number below 20.
             * @type {number} 
             */
            #average = NaN;

            /** 
             * Value of the class' average for ***this*** {@link Module}, a positive float number below 20.
             * @type {number}
             */
            #classAvg = NaN;

            /** 
             * Object of all the {@link Subject}s in ***this*** {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} itself as value. 
             * @type {Object.<string, Subject>} 
             */
            #subjects = {};



            /** 
             * Array of the {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #grades = [];

            /** 
             * Array of the real {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #realGrades = [];

            /** 
             * Array of the simulated {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #simGrades = [];

            /** 
             * Array of the enabled real {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #enabledRealGrades = [];

            /** 
             * Array of the disabled real {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #disabledRealGrades = [];

            /** 
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #enabledSimGrades = [];

            /** 
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Module}. 
             * @type {Grade[]}
             */
            #disabledSimGrades = [];



            /** 
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefSubjects = NaN;

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefSubjectsNoGrade = NaN;

            /** 
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefSubjectsNoEnabledGrade = NaN;



            /** 
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefGrades = NaN;

            /** 
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefRealGrades = NaN;

            /** 
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefEnabledGrades = NaN;

            /** 
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Module}. 
             * @type {number}
             */
            #totalCoefEnabledRealGrades = NaN;



            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *below 100*. 
             * @type {Subject[]}
             */
            #subjectsBelow100 = [];

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *above 100*. 
             * @type {Subject[]}
             */
            #subjectsAbove100 = [];

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *below 100*. 
             * @type {Subject[]}
             */
            #subjectsReallyBelow100 = [];

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *above 100*. 
             * @type {Subject[]}
             */
            #subjectsReallyAbove100 = [];

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any grade. 
             * @type {Subject[]}
             */
            #subjectsNoGrade = [];

            /** 
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any enabled grade. 
             * @type {Subject[]}
             */
            #subjectsNoEnabledGrade = [];



            /**
             * The {@link ModuleCard} corresponding to ***this*** {@link Module}. 
             * @type {ModuleCard} 
             * @readonly 
             */
            #moduleCard;


            /** 
             * Name given to the unclassified module of a semester.
             * @type {"\_\_#unclassified#\_\_"}
             * @readonly
             */
            static unclassified = "__#unclassified#__";


        //#endregion — properties —





        // MARK:                 — constructor —
        /**
         * Constructs an object of class {@link Module} from its given name.
         * Automatically adds the constructed {@link Module} to its {@link Semester}'s {@link Semester.modules}.
         *
         * @param {string}      name        Name of ***this*** {@link Module}.
         * @param {Semester}    semester    The {@link Semester} ***this*** {@link Module} will belong to.
         */
        constructor(name, semester) {
            this.#name = name;

            this.#semester = semester;
            semester.addModules(this);

            this.#moduleCard = new ModuleCard(this);
        }


        // MARK:               — encapsulation —
        //#region 

            /**
             * Name of ***this*** {@link Module}. @type {string}
             */
            get name()      { return this.#name }
            set name(value) {
                this.#name = value;
            }



            /**
             * Value of the class' average of ***this*** {@link Module}, a positive float number below 20. 
             * @readonly
             */
            get average()   { return this.#average }

            /**
             * Value of the class' average of ***this*** {@link Module}, a positive float number below 20. 
             * @readonly
             */
            get classAvg()  { return this.#classAvg }



            /**
             * Object of the {@link Subject}s (or their name) in ***this*** {@link Module}, with the {@link Subject}'s name as key and the {@link Subject} as value (or its name). 
             * @readonly
             */
            get subjects()  { return this.#subjects }

            /**
             * The {@link Semester} of ***this*** {@link Module}.
             * @readonly
             */
            get semester()  { return this.#semester }

            /**
             * Array of the {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get grades()    { return this.#grades }

            /**
             * Array of the real {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get realGrades() { return this.#realGrades }

            /**
             * Array of the simulated {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get simGrades() { return this.#simGrades }

            /**
             * Array of the enabled real {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get enabledRealGrades() { return this.#enabledRealGrades }

            /**
             * Array of the disabled real {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /**
             * Array of the enabled simulated {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get enabledSimGrades() { return this.#enabledSimGrades }

            /**
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /**
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefSubjects() { return this.#totalCoefSubjects }

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefSubjectsNoGrade() { return this.#totalCoefSubjectsNoGrade }

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefSubjectsNoEnabledGrade() { return this.#totalCoefSubjectsNoEnabledGrade }

            /**
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /**
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /**
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefSimGrades() { return this.#totalCoefGrades && this.#totalCoefRealGrades ? (this.#totalCoefGrades - this.#totalCoefRealGrades) : undefined }

            /**
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /**
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /**
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Module}. 
             * @readonly
             */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades && this.#totalCoefEnabledRealGrades ? (this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades) : undefined }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *below 100*. 
             * @readonly
             */
            get subjectsBelow100() { return this.#subjectsBelow100; }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that have an average *above 100*. 
             * @readonly
             */
            get subjectsAbove100() { return this.#subjectsAbove100; }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *below 100*. 
             * @readonly
             */
            get subjectsReallyBelow100() { return this.#subjectsReallyBelow100; }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *above 100*. 
             * @readonly
             */
            get subjectsReallyAbove100() { return this.#subjectsReallyAbove100; }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any grade. 
             * @readonly
             */
            get subjectsNoGrade() { return this.#subjectsNoGrade; }

            /**
             * All the {@link Subject}s in ***this*** {@link Module} that don't have any enabled grade. 
             * @readonly
             */
            get subjectsNoEnabledGrade() { return this.#subjectsNoEnabledGrade; }


        //#endregion — encapsulation —





        // MARK:                  — methods —
        //#region 





            // MARK: _  toString()
            toString() {
                return ""+ this.#semester +"\\"+ this.#name
            }



            // MARK: _  equals()
            /**
             * Checks whether the given {@link Module} is the same as ***this*** {@link Module}.
             * 
             * @param {any} module
             * @returns {boolean}
             */
            equals(module) {
                if (!(module instanceof Module)) return false;

                if (true
                    && this.#name == module.#name
                    && this.#semester.equals(module.#semester)
                ) {
                    return true;
                }

                return false;
            }



            // MARK: _  static average()
            /**
             * 
             * @param  {...Module} modules 
             */
            static average(...modules) {
                let avg = 0, totalModCoef = 0;

                for (const module of modules) {
                    if (!isNaN(module.#average)) {
                        avg += module.#average;
                        totalModCoef += 1;
                    }
                }

                return Math.round(100*avg/totalModCoef)/100;
            }



            // MARK: _  static classAverage()
            /**
             * 
             * @param  {...Module} modules 
             */
            static classAverage(...modules) {
                let avg = 0, totalModCoef = 0;

                for (const module of modules) {
                    if (!isNaN(module.#classAvg)) {
                        avg += module.#classAvg;
                        totalModCoef += 1;
                    }
                }

                return Math.round(100*avg/totalModCoef)/100;
            }





            // MARK: _  getSubject()
            /**
             * Gets the given {@link Subject} (or the {@link Subject} whose name corresponds to the given string)
             * from ***this*** {@link Module}.
             * 
             * @param {Subject|string} subject The {@link Subject} (or its name) belonging to ***this*** {@link Module}.
             * 
             * @throws {Error} If the {@link Subject} doesn't exist in ***this*** {@link Module}.
             * @returns {Subject} The subject of ***this*** {@link Module}.
             */
            getSubject(subject) {
                for (const subj of Object.values(this.#subjects)) {
                    if (subject instanceof Subject && subject.equals(subj)) return subj;
                    else if (typeof subject === "string" && subject == subj.name) return subj;
                }

                throw new Error("Subject of name \""+ (subject instanceof Subject ? subject.name : subject) + "\" does not exists in the Module of name \""+ this.#name+ "\".");
            }


            // MARK: _  getSubjects()
            /**
             * Gets the given {@link Subject} (or the {@link Subject} whose name corresponds to the given string)
             * from ***this*** {@link Module}.
             * 
             * @param {(Subject|string)[]} subjects The {@link Subject} (or its name) belonging to ***this*** {@link Module}.
             * 
             * @throws {Error} If the {@link Subject} doesn't exist in ***this*** {@link Module}.
             */
            getSubjects(...subjects) {
                /** @type {Object.<string, Subject>} */ const out = {};

                for (const subject of subjects) {
                    const subj = this.getSubject(subject);
                    out[subj.name] = subj;
                }

                return out;
            }



            // MARK: _  hasSubject()
            /**
             * Checks whether the given {@link Subject} (or the {@link Subject} whose name corresponds to the given string)
             * exists in ***this*** {@link Module}.
             * 
             * @param {Subject|string} subject The {@link Subject} (or its name) belonging to ***this*** {@link Module}.
             */
            hasSubject(subject) {
                try {
                    this.getSubject(subject);
                    return true;
                }
                catch(e) { return false; }
            }



            // MARK: _  hasSubjects()
            /**
             * Checks whether the given {@link Subject}s (or the {@link Subject}s whose name correspond to the given strings)
             * all exist in ***this*** {@link Module}.
             * 
             * @param {(Subject|string)[]} subjects The {@link Subject}s (or their name) belonging to ***this*** {@link Module}.
             */
            hasSubjects(subjects) {
                try {
                    this.getSubjects(...subjects);
                    return true;
                }
                catch(e) { return false; }
            }








            // MARK: _  addSubjects()
            /**
             * Adds {@link Subject}s (or their name) to ***this*** {@link Module}.
             * @param {Subject[]} subjects The {@link Subject}s (or their name) to add to ***this*** {@link Module}.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            addSubjects(...subjects) {
                subjects = subjects.flat();


                for (const subject of subjects) {
                    if (this.hasSubject(subject)) {
                        throw new Error(
                            "This Module \""+this.#name+"\" already has a Subject called \""+subject.name+"\"."
                            + (subjects.length > 1 ? " Aborting the process without adding any of the given Subjects." : "")
                        )
                    }
                }

                for (const subject of subjects) {
                    this.#subjects[subject.name] = subject;
                    this.#semester.subjects[subject.name] = subject;
                }

                return this;
            }



            // MARK: _  removeSubjects()
            /**
             * Removes {@link Subject}s from ***this*** {@link Module}.
             * @param {(Subject|string)[]} subjects The {@link Subject}s (or their name) to remove from ***this*** {@link Module}.
             *
             * @throws {Error} If trying to remove a subject that can't be found in ***this*** {@link Module}.
             * @returns {Module} ***this*** {@link Module}.
             */
            removeSubjects(...subjects) {
                subjects = subjects.flat();


                for (const subject of subjects) {
                    if (!this.hasSubject(subject)) {
                        throw new Error(
                            "This Module \""+this.#name+"\" does not have a Subject called \""+(subject instanceof Subject ? subject.name : subject)+"\"."
                            + (subjects.length > 1 ? " Aborting the process without removing any of the given Subjects." : "")
                        )
                    }
                }

                for (const subject of subjects) {
                    const name = subject instanceof Subject ? subject.name : subject;
                    delete this.#subjects[name];
                }

                return this;
            }






            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Module}.
             * @param {boolean|string|Subject|(string|Subject)[]} [computeSubjects=true] 
             * `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed **before** computing ***this*** {@link Semester}'s stats, `false` otherwise. 
             * If you give a string or a Subject, only the specified Subject will be updated as well. 
             * You may give an array of strings and/or Subjects to update the stats of multiple Subjects as well.
             */
            computeStats(computeSubjects=true) {
                //#region
                let
                    /** @type {Grade[]} */      grades                          = [],
                    /** @type {Grade[]} */      realGrades                      = [],
                    /** @type {Grade[]} */      simGrades                       = [],
                    /** @type {Grade[]} */      enabledRealGrades               = [],
                    /** @type {Grade[]} */      disabledRealGrades              = [],
                    /** @type {Grade[]} */      enabledSimGrades                = [],
                    /** @type {Grade[]} */      disabledSimGrades               = [],

                    /** @type {number} */       totalCoefSubjects               = 0,
                    /** @type {number} */       totalCoefSubjectsNoGrade        = 0,
                    /** @type {number} */       totalCoefSubjectsNoEnabledGrade = 0,

                    /** @type {number} */       totalCoefGrades                 = 0,
                    /** @type {number} */       totalCoefRealGrades             = 0,
                    /** @type {number} */       totalCoefEnabledGrades          = 0,
                    /** @type {number} */       totalCoefEnabledRealGrades      = 0,

                    /** @type {Subject[]} */    subjectsBelow100                = [],
                    /** @type {Subject[]} */    subjectsAbove100                = [],
                    /** @type {Subject[]} */    subjectsReallyBelow100          = [],
                    /** @type {Subject[]} */    subjectsReallyAbove100          = [],
                    /** @type {Subject[]} */    subjectsNoEnabledGrade          = [],
                    /** @type {Subject[]} */    subjectsNoGrade                 = []
                ;
                //#endregion

                // Pre-emptively compute all the subjects' stats
                if (computeSubjects === true) Object.values(this.#subjects).forEach(subject => { subject.computeStats(); })
                else if (typeof computeSubjects === "string" || computeSubjects instanceof Subject) this.getSubject(computeSubjects).computeStats();
                else if (Array.isArray(computeSubjects)) Object.values(this.getSubjects(...computeSubjects)).forEach(subject => { subject.computeStats() })

                for (const subject of Object.values(this.#subjects)) {
                    const nbGrades = subject.grades.length;

                    grades              .push(...subject.grades);
                    realGrades          .push(...subject.realGrades);
                    simGrades           .push(...subject.simGrades);
                    enabledRealGrades   .push(...subject.enabledRealGrades);
                    disabledRealGrades  .push(...subject.disabledRealGrades);
                    enabledSimGrades    .push(...subject.enabledSimGrades);
                    disabledSimGrades   .push(...subject.disabledSimGrades);

                    totalCoefSubjects           += subject.coef;

                    if (nbGrades == 0 || nbGrades == subject.disabledGrades.length) {
                        if (nbGrades == 0) {
                            totalCoefSubjectsNoGrade += subject.coef;
                            subjectsNoGrade.push(subject);
                        }

                        if (nbGrades == subject.disabledGrades.length) {
                            totalCoefSubjectsNoEnabledGrade += subject.coef;
                            subjectsNoEnabledGrade.push(subject);
                        }
                    }
                    else {
                        if (subject.totalCoefGrades)
                        if      (subject.totalCoefGrades < 100) subjectsBelow100.push(subject);
                        else if (subject.totalCoefGrades > 100) subjectsAbove100.push(subject);

                        if      (subject.totalCoefRealGrades < 100) subjectsReallyBelow100.push(subject);
                        else if (subject.totalCoefRealGrades > 100) subjectsReallyAbove100.push(subject);
                    }



                    totalCoefGrades             += subject.totalCoefGrades ? subject.totalCoefGrades : 0;
                    totalCoefRealGrades         += subject.totalCoefRealGrades ? subject.totalCoefRealGrades : 0;
                    totalCoefEnabledGrades      += subject.totalCoefEnabledGrades ? subject.totalCoefEnabledGrades : 0;
                    totalCoefEnabledRealGrades  += subject.totalCoefEnabledRealGrades ? subject.totalCoefEnabledRealGrades : 0;
                }

                const nbSubjects = Object.keys(this.#subjects).length;

                this.#grades                            = grades;
                this.#realGrades                        = realGrades;
                this.#simGrades                         = simGrades;
                this.#enabledRealGrades                 = enabledRealGrades;
                this.#disabledRealGrades                = disabledRealGrades;
                this.#enabledSimGrades                  = enabledSimGrades;
                this.#disabledSimGrades                 = disabledSimGrades;

                this.#totalCoefSubjects                 = totalCoefSubjects;
                this.#totalCoefSubjectsNoGrade          = totalCoefSubjectsNoGrade;
                this.#totalCoefSubjectsNoEnabledGrade   = totalCoefSubjectsNoEnabledGrade;

                this.#totalCoefGrades                   = Math.round(totalCoefGrades/nbSubjects);
                this.#totalCoefRealGrades               = Math.round(totalCoefRealGrades/nbSubjects);
                this.#totalCoefEnabledGrades            = Math.round(totalCoefEnabledGrades/nbSubjects);
                this.#totalCoefEnabledRealGrades        = Math.round(totalCoefEnabledRealGrades/nbSubjects);

                this.#subjectsBelow100                  = subjectsBelow100;
                this.#subjectsAbove100                  = subjectsAbove100;
                this.#subjectsReallyBelow100            = subjectsReallyBelow100;
                this.#subjectsReallyAbove100            = subjectsReallyAbove100;
                this.#subjectsNoEnabledGrade            = subjectsNoEnabledGrade;
                this.#subjectsNoGrade                   = subjectsNoGrade;

                this.#average    = Subject.average(...Object.values(this.subjects));
                this.#classAvg   = Subject.classAverage(...Object.values(this.subjects));

                return this;
            }



            // MARK: _  updateUpHierarchyStats()
            updateUpHierarchyStats() {
                this.#semester.computeStats(this)
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Module = Module;


    // MARK: ———            SEMESTER           ———
    class Semester {





        // MARK:                 — properties —
        //#region 


            /**
             * Number of ***this*** {@link Semester}. 
             * @type {number}
             */
            #number;

            /**
             * Average of the user for ***this*** {@link Semester}, a positive float number below 20.
             * @type {number}
             */
            #average = NaN;

            /**
             * Average of the class for ***this*** {@link Semester}, a positive float number below 20.
             * @type {number}
             */
            #classAvg = NaN;



            /**
             * Object of all the {@link Module}s in ***this*** {@link Semester}, with the {@link Module}'s name as key and the {@link Module} itself as value. 
             * @type {Object.<string, Module>}
             */
            #modules = {};


            /**
             * The unclassified {@link Module} of ***this*** {@link Semester}. 
             * @type {Module}
             */
            #unclassifiedModule;


            /**
             * Array of all the {@link Modules}s in ***this*** {@link Semester}. 
             * @type {Object.<string, Module>}
             */
            #modulesNoEnabledGrade = {};

            /**
             * Array of the {@link Modules}s in ***this*** {@link Semester}. 
             * @type {Object.<string, Module>}
             */
            #modulesNoGrade = {};




            /**
             * Array of the {@link Subject}s in ***this*** {@link Semester}. 
             * @type {Object.<string, Subject>}
             */
            #subjects = {};


            /**
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefSubjects = NaN;

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefSubjectsNoGrade = NaN;

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefSubjectsNoEnabledGrade = NaN;




            /**
             * Array of the {@link Grade}s in ***this*** {@link Semester}. 
             * @type {Grade[]}
             */
            #grades = [];


            /**
             * Array of the simulated {@link Grade}s in ***this*** {@link Semester}. 
             * @type {Grade[]}
             */
            #simGrades = [];

            /**
             * Array of the disabled real {@link Grade}s in ***this*** {@link Semester}. 
             * @type {Grade[]}
             */
            #disabledRealGrades = [];

            /**
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Semester}. 
             * @type {Grade[]}
             */
            #disabledSimGrades = [];



            /**
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefGrades = NaN;

            /**
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefRealGrades = NaN;

            /**
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefEnabledGrades = NaN;

            /**
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Semester}. 
             * @type {number}
             */
            #totalCoefEnabledRealGrades = NaN;



            /**
             * The {@link SemesterCard} corresponding to ***this*** {@link Semester}. 
             * @type {SemesterCard}
             * @readonly
             */
            #semesterCard;


        //#endregion — properties —





        // MARK:                 — constructor —
        /**
         * Constructs an object of class {@link Semester} from its given number.
         * Automatically creates its attributed {@link SemesterCard}, along with its undefined {@link Module}.
         *
         * @param {number|string} number
         */
        constructor(number) {
            this.#number = typeof number === "string" ? parseInt(number) : number;

            this.#unclassifiedModule = new Module(Module.unclassified, this);

            this.#semesterCard = new SemesterCard(this);
        }


        // MARK:               — encapsulation —
        //#region 


            /**
             * Number of ***this*** {@link Semester}. @type {number}
             */
            get number()      { return this.#number }
            set number(value) {
                this.#number = Number(value);
            }


            /**
             * Average of the user for ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly
             */
            get average()   { return this.#average }

            /**
             * Average of the class for ***this*** {@link Semester}, a positive float number below 20 @type {number} @readonly
             */
            get classAvg()  { return this.#classAvg }



            /**
             * Object of the {@link Module}s in ***this*** {@link Semester}, with the {@link Module}'s name as key and the {@link Module} as value. @type {Object.<string, Module>} @readonly
             */
            get modules()  { return this.#modules }

            /**
             * The undefined {@link Module} of ***this*** {@link Semester}. @type {Module} @readonly
             */
            get undefinedModule()  { return this.#unclassifiedModule }


            /**
             * Array of the {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly
             */
            get grades()    { return this.#grades }

            /** Array of the {@link Subject}s in ***this*** {@link Semester}. @type {Object.<string, Subject>} */
            get subjects()    { return this.#subjects }
            set subjects(value) {
                this.#subjects = value;
            }

            /**
             * Array of the simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly 
             */
            get simGrades() { return this.#simGrades }

            /**
             * Array of the disabled real {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly
             */
            get disabledRealGrades() { return this.#disabledRealGrades }

            /**
             * Array of the disabled simulated {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly
             */
            get disabledSimGrades() { return this.#disabledSimGrades }

            /**
             * Total of the coefficients of all the {@link Subject}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefSubjects() { return this.#totalCoefSubjects }

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefSubjectsNoGrade() { return this.#totalCoefSubjectsNoGrade }

            /**
             * Total of the coefficients of all the {@link Subject}s that don't have any enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefSubjectsNoEnabledGrade() { return this.#totalCoefSubjectsNoEnabledGrade }

            /**
             * Total of the coefficients of all the {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefGrades() { return this.#totalCoefGrades }

            /**
             * Total of the coefficients of all the real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefRealGrades() { return this.#totalCoefRealGrades }

            /**
             * Total of the coefficients of all the simulated {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefSimGrades() { return this.#totalCoefGrades - this.#totalCoefRealGrades }

            /**
             * Total of the coefficients of all the enabled {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefEnabledGrades() { return this.#totalCoefEnabledGrades }

            /**
             * Total of the coefficients of all the enabled real {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefEnabledRealGrades() { return this.#totalCoefEnabledRealGrades }

            /**
             * Total of the coefficients of all the enabled simulated {@link Grade}s in ***this*** {@link Semester}. @type {number} @readonly
             */
            get totalCoefEnabledSimGrades() { return this.#totalCoefEnabledGrades - this.#totalCoefEnabledRealGrades }



        //#endregion — encapsulation —





        // MARK:                  — methods —
        //#region 




            // MARK: _  toString()
            toString() { return this.#number }





            // MARK: _  equals()
            /**
             *
             * @param {any} semester
             */
            equals(semester) {
                if (!(semester instanceof Semester)) {
                    return false;
                }

                if (this.#number == semester.#number) {
                    return true;
                }

                return false;
            }



            // MARK: _  static average()
            /**
             * 
             * @param  {...(Semester|undefined)} semesters 
             */
            static average(...semesters) {
                let avg = 0, totalSemCoef = 0;

                for (const semester of semesters) {
                    if (semester && !isNaN(semester.#average)) {
                        avg += semester.#average
                        totalSemCoef += 1;
                    }
                }

                return Math.round(100*avg/totalSemCoef)/100 || NaN;
            }



            // MARK: _  static classAverage()
            /**
             * 
             * @param  {...(Semester|undefined)} semesters 
             */
            static classAverage(...semesters) {
                let avg = 0, totalSemCoef = 0;

                for (const semester of semesters) {
                    if (semester && !isNaN(semester.#classAvg)) {
                        avg += semester.#classAvg
                        totalSemCoef += 1;
                    }
                }

                return Math.round(100*avg/totalSemCoef)/100 || NaN;
            }




            // MARK: _  getModule()
            /**
             * 
             * @param {Module|string} module 
             */
            getModule(module) {
                for (const mod of Object.values(this.#modules)) {
                    if (module instanceof Module && module.equals(mod)) return mod;
                    else if (typeof module === "string" && module == mod.name) return mod;
                }

                throw new Error("Module of name \""+ (module instanceof Module ? module.name : module) + "\" does not exist in the Semester n°"+this.#number+".");
            }


            // MARK: _  getModules()
            /**
             * 
             * @param {(Module|string)[]} modules 
             */
            getModules(...modules) {
                const out = [];
                for (const module of modules) { out.push(this.getModule(module)) }
                return out;
            }


            // MARK: _  hasModule()
            /**
             * 
             * @param {Module|string} module 
             */
            hasModule(module) {
                try {
                    this.getModule(module);
                    return true;
                }
                catch(e) { return false; }
            }


            // MARK: _  hasModules()
            /**
             * 
             * @param {(Module|string)[]} modules 
             */
            hasModules(modules) {
                try {
                    this.getModules(...modules);
                    return true;
                }
                catch(e) { return false; }
            }


            // MARK: _  addModules()
            /**
             * Adds the {@link Module}.s to ***this*** {@link Semester}.
             * @param {Module[]} modules The {@link Module}.s (or its/their name) to add to ***this*** {@link Semester}.
             *
             * @returns {Semester} ***This*** {@link Semester}.
             */
            addModules(...modules) {
                modules = modules.flat();

                for (const module of modules) {
                    if (this.hasModule(module)) {
                        throw new Error(
                            "This Semester \""+this.#number+"\" already has a Module called \""+module.name+"\"."
                            + (modules.length > 1 ? " Aborting the process without adding any of the given Modules." : "")
                        )
                    }
                }

                for (const module of modules) {
                    this.#modules[module.name] = module;
                }

                return this;
            }


            // MARK: _  removeModules()
            /**
             * Removes the {@link Module}.s from ***this*** {@link Semester}.
             * @param {(Module|string)[]} modules The {@link Module}.s (or its/their name) to remove from ***this*** {@link Semester}.
             *
             * @returns {Object.<string, Module>} The {@link Module}s removed from ***this*** {@link Semester}.
             */
            removeModules(...modules) {
                modules = modules.flat();
                /** @type {Object.<string, Module>} */ let out = {};

                for (const module of modules) {
                    if (!this.hasModule(module)) {
                        throw new Error(
                            "This Semester \""+this.#number+"\" does not have a Module called \""+(module instanceof Module ? module.name : module)+"\"."
                            + (modules.length > 1 ? " Aborting the process without removing any of the given Modules." : "")
                        )
                    }
                    if (module === this.#unclassifiedModule || module === Module.unclassified) {
                        throw new Error(
                            "Removing the \""+Module.unclassified+"\" Module is strictly forbidden."
                            + (modules.length > 1 ? " Aborting the process without removing any of the given Modules." : "")
                        )
                    }
                }

                for (const module of modules) {
                    const name = module instanceof Module ? module.name : module;
                    out[name] = this.#modules[name];

                    delete this.#modules[name];
                }

                return out;
            }




            // MARK: _  getSubject()
            /**
             * 
             * @param {Subject|string} subject 
             * @param {Module|string|undefined} module 
             * @returns {Subject}
             */
            getSubject(subject, module=undefined) {
                if (module instanceof Module)   return module.getSubject(subject);
                if (module !== undefined)       return this.getModule(module).getSubject(subject);

                for (const subjName in this.#subjects) {
                    const subj = this.#subjects[subjName];

                    if (subject instanceof Subject) if (subject.equals(subj)) return subj;
                    if (typeof subject == "string") if (subject == subj.name) return subj;
                }

                throw new Error("Subject of name "+(subject instanceof Subject ? subject.name : subject)+"does not exist in the Semester n°"+this.#number+".")
            }


            // MARK: _  hasSubject()
            /**
             * 
             * @param {Subject|string} subject 
             * @param {Module|string|undefined} module 
             * @returns {boolean}
             */
            hasSubject(subject, module=undefined) {
                try {
                    this.getSubject(subject, module);
                    return true;
                }
                catch(e) { return false; }
            }






            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Semester}.
             * @param {boolean|string|Module|(string|Module)[]} [computeModules=true] 
             * `true` if the stats of the {@link Module}s of ***this*** {@link Semester} has to be computed **before** computing ***this*** {@link Semester}'s stats, `false` otherwise. 
             * If you give a string or a Module, only the specified Module will be updated as well. 
             * You may give an array of strings and/or Modules to update the stats of multiple Modules as well.
             * @param {boolean|string|Subject|(string|Subject)[]} [computeSubjects=true]
             * `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed **before** computing ***this*** {@link Semester}'s stats, `false` otherwise. 
             * If you give a string or a Subject, only the specified Subject will be updated as well. 
             * You may give an array of strings and/or Subjects to update the stats of multiple Subjects as well.
             */
            computeStats(computeModules=true, computeSubjects=true) {
                //#region
                let
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsBelow100          = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsAbove100          = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsReallyBelow100    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsReallyAbove100    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsNoEnabledGrade    = {},
                    /** @type {Object.<string, Subject>} Keys are the name of the corresponding Subject value. */ subjectsNoGrade           = {},

                    /** @type {number} */ totalCoefSubjects                 = 0,
                    /** @type {number} */ totalCoefSubjectsNoGrade          = 0,
                    /** @type {number} */ totalCoefSubjectsNoEnabledGrade   = 0,

                    /** @type {number} */ totalCoefGrades                   = 0,
                    /** @type {number} */ totalCoefRealGrades               = 0,
                    /** @type {number} */ totalCoefEnabledGrades            = 0,
                    /** @type {number} */ totalCoefEnabledRealGrades        = 0,

                    /** @type {Grade[]} */ grades               = [],
                    /** @type {Grade[]} */ simGrades            = [],
                    /** @type {Grade[]} */ disabledRealGrades   = [],
                    /** @type {Grade[]} */ disabledSimGrades    = []
                ;
                //#endregion

                // Pre-emptively compute all the modules' stats
                if (computeModules === true) Object.values(this.#modules).forEach(module => { module.computeStats(computeSubjects); })
                else if (typeof computeModules === "string" || computeModules instanceof Module) this.getModule(computeModules).computeStats(computeSubjects);
                else if (Array.isArray(computeModules)) this.getModules(...computeModules).forEach(module => { module.computeStats(computeSubjects) })

                for (const module of Object.values(this.#modules || {})) {

                    for (const subject of Object.values(module.subjects || {})) {

                        this.#subjects[subject.name] = subject;

                        grades              .push(...subject.grades);
                        simGrades           .push(...subject.simGrades);
                        disabledRealGrades  .push(...subject.disabledRealGrades);
                        disabledSimGrades   .push(...subject.disabledSimGrades);

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

                    }

                }

                const nbSubjects = Object.keys(this.#subjects).length;

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

                this.#average    = Module.average(...Object.values(this.modules));
                this.#classAvg   = Module.classAverage(...Object.values(this.modules));

                return this;
            }

        //#endregion — methods —





        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Semester = Semester;







    //-MARK: 
    ;




    // MARK: ———             SETTING             ———
    class Setting {







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Setting = Setting;


    // MARK: ———            SETTINGS            ———
    class Settings {







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).Settings = Settings;





    // MARK: ———   KEYBOARDSHORTCUT   ———
    class KeyboardShortcut {







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).KeyboardShortcut = KeyboardShortcut;


    // MARK: ———  KEYBOARDSHORTCUTS  ———
    class KeyboardShortcuts {







        // MARK: _________________________________________

    }
    /** @type {any} */ (globalThis).KeyboardShortcuts = KeyboardShortcuts;
//#endregion BACKEND





// MARK: ——————————————————
//#endregion















//#region — FRONTEND —
// MARK: ——————————————————





//#region ========  FRONTEND  ========




    // MARK: ——————————————————
    ;







    // MARK: ———               CARD               ———
    class Card {





        // MARK:                  — properties —
        //#region 

            /** The {@link HTMLElement} linked to ***this*** {@link Card}. @type {HTMLElement} */
            #html;


        //#endregion                  — properties —





        // MARK:                  — constructor —
        /**
         *
         * @param {string} htmlClassName Name of the HTML class of ***this*** {@link Card}'s outerHTML.
         * @param {string} id Id of ***this*** {@link Card}'s outerHTML.
         * @param {HTMLElement|Card|undefined} parent Parent
         */
        constructor(htmlClassName, id, parent=undefined) {
            if (typeof htmlClassName != "string") { throw new TypeError("Improper Card construction: wrong 'className' argument type, was expecting a string.") }
            if (typeof id != "string") { throw new TypeError("Improper Card construction: wrong 'id' argument type, was expecting a string.") }
            if (!(parent instanceof HTMLElement || parent instanceof Card || parent == undefined)) { throw new TypeError("Improper Card construction: wrong 'parent' argument type, was expecting an HTMLElement, a Card, or left undefined.") }


            this.#html = document.createElement("div");
            this.#html.className = htmlClassName;
            this.#html.id = id;

            if (parent instanceof HTMLElement)  parent.appendChild(this.#html);
            else if (parent instanceof Card)    parent.html.appendChild(this.#html);
        }



        // MARK:               — encapsulation —
        //#region 

            /** The {@link HTMLElement} linked to ***this*** {@link Card}. @type {HTMLElement} @readonly Outside of its class methods */
            get html() { return this.#html; }


        //#endregion               — encapsulation —





        // MARK:                   — methods —
        //#region 

            render() {

            }


        //#endregion




        // MARK: ——————————————————
    }
    /** @type {any} */ (globalThis).Card = Card;


    // MARK: ———         SUBJECTCARD        ———
    class SubjectCard extends Card {





        // MARK:                  — properties —
        //#region 


            /** The {@link Subject} corresponding to ***this*** {@link SubjectCard}. @type {Subject} @readonly */
            #subject;


            /** The {@link Module} corresponding to ***this*** {@link SubjectCard}. @type {Module|string|undefined} @readonly */
            #module;


            /** The {@link Semester} corresponding to ***this*** {@link SubjectCard}. @type {Semester|number|undefined} @readonly */
            #semester;


        //#endregion                  — properties —





        // MARK:                 — constructor —
        /**
         * @param {Subject} subject The {@link Subject} to create a {@link SubjectCard} from.
         */
        constructor(subject) {
            const moduleName    = subject.module instanceof Module ? subject.module.name : subject.module;
            const semesterName  = subject.semester instanceof Semester ? subject.semester.number : subject.semester;

            super("subject-card", "subject-card-"+subject.name.replaceSpacesWithDashes()+"-from-"+moduleName?.replaceSpacesWithDashes()+"-in-semester-"+semesterName);

            this.#subject = subject;
        }


        // MARK:               — encapsulation —
        //#region 


            /**
             * The {@link Subject} corresponding to ***this*** {@link SubjectCard}.
             */
            get subject() { return this.#subject }

            /**
             * The {@link Module} corresponding to ***this*** {@link SubjectCard}.
             * @readonly
             */
            get module() { return this.#module }

            /**
             * The {@link Semester} corresponding to ***this*** {@link SubjectCard}.
             * @readonly
             */
            get semester() { return this.#semester }


        //#endregion               — encapsulation —



        // MARK: ——————————————————
    }
    /** @type {any} */ (globalThis).SubjectCard = SubjectCard;


    // MARK: ———         MODULECARD        ———
    class ModuleCard extends Card {





        // MARK:                  — properties —
        //#region 


            /** The {@link Module} corresponding to ***this*** {@link ModuleCard}. @type {Module} @readonly */
            #module;

            /** The {@link Semester} corresponding to ***this*** {@link ModuleCard}. @type {Semester|number|undefined} @readonly */
            #semester;


        //#endregion                  — properties —





        // MARK:                 — constructor —
        /**
         * @param {Module} module The {@link Module} to create a {@link ModuleCard} from.
         */
        constructor(module) {
            const semesterName  = module.semester instanceof Semester ? module.semester.number : module.semester;

            super("module-card", "module-card-"+module.name.replaceSpacesWithDashes()+"-in-semester-"+semesterName);

            this.#module = module;
            this.#semester = module.semester;
        }


        // MARK:               — encapsulation —
        //#region 


            /**
             * The {@link Module} corresponding to ***this*** {@link ModuleCard}. @type {Module} @readonly */
            get module() { return this.#module }

            /**
             * The {@link Semester} corresponding to ***this*** {@link ModuleCard}. @type {Semester|number|undefined} @readonly */
            get semester() { return this.#semester }


        //#endregion               — encapsulation —


        // MARK: ——————————————————
    }
    /** @type {any} */ (globalThis).ModuleCard = ModuleCard;


    // MARK: ———        SEMESTERCARD       ———
    class SemesterCard extends Card {





        // MARK:                  — properties —
        //#region 


            /** The {@link Semester} corresponding to ***this*** {@link SemesterCard}. @type {Semester} @readonly */
            #semester;


        //#endregion                   — properties —





        // MARK:                 — constructor —
        /**
         * @param {Semester} semester The {@link Semester} to create a {@link SemesterCard} from.
         * @throws {TypeError} if a parameter isn't of the expected type.
         */
        constructor(semester) {
            if (!(semester instanceof Semester)) { throw new TypeError("Improper SemesterCard construction: wrong 'semester' argument type, was expecting a Semester") }
            super("semester-card", "semester-card-"+semester.number);

            this.#semester = semester;
        }


        // MARK:               — encapsulation —
        //#region 


            /**
             * The {@link Semester} corresponding to ***this*** {@link SemesterCard}. @type {Semester} @readonly */
            get semester() { return this.#semester }


        //#endregion                — encapsulation —
    }
    /** @type {any} */ (globalThis).SemesterCard = SemesterCard;
//#endregion FRONTEND





// MARK: ——————————————————
//#endregion













// MARK: ——————————————————
;




// MARK: ======= ECAMDashboard ======
class ECAMDashboard {





    // MARK:                  — properties —
    //#region


        /**
         * Object with values being the key of the localStorage cache containing data for this ECAMDashboard, 
         * associated with keys that are short description of the value's meaning.
         * @readonly
         * @type {{
         *      "moduleConfig": "ECAM_GRADES_DASHBOARD-module_config",
         *      "simGrades":    "ECAM_GRADES_DASHBOARD-sim_grades"
         * }}
         */
        static cacheKeys = {
            /** @readonly */ moduleConfig:    "ECAM_GRADES_DASHBOARD-module_config",
            /** @readonly */ simGrades:       "ECAM_GRADES_DASHBOARD-sim_grades"
        };


        /**
         * Array of all the {@link Grade}s of the user. 
         * @type {Grade[]}
         */
        grades          = [];

        /**
         * Array of all the {@link Subject}s of the user. 
         * @type {Subject[]}
         */
        subjects        = [];

        /**
         * Array of all the {@link Module}s of the user. 
         * @type {Module[]}
         */
        modules         = [];

        
        /**
         * Array of all the {@link Semester}s of the user. 
         * @type {(Semester|undefined)[]}
         */
        semesters       = [];

        /**
         * Array of all the non-read {@link Grade}s of the user. 
         * @type {Grade[]}
         */
        newGrades       = [];


        /**
         * Global average of the user.
         * @type {number}
         */
        average = NaN;


        /**
         * Global average of the user's class.
         * @type {number}
         */
        classAvg = NaN;


        /**
         * Array of all the disabled {@link Grade}s of the user. 
         * ```
         * JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES") || "[]" )
         * ```
         * @type {Grade[]}
         */
        disabledGrades  = [];



        /**
         * Array of all the simulated {@link Grade}s of the user.
         * @type {Grade[]}
         */
        sim             = [];


        /**
         * Object representing the configuration of the modules for the user.
         * @type {{
         *      [semesterNumber: number]: {
         *          __object__: Semester,
         *          __modules__: string[],
         *          modules: {
         *              [moduleName: string]: {
         *                  __object__: Module,
         *                  __subjects__: string[],
         *                  subjects: {
         *                      [subjectName: string]: {
         *                          __object__: Subject, 
         *                          coefficient: number 
         *                      }
         *                  }
         *              }
         *          }
         *      }
         * }}
         */
        moduleConfig    = {};


        offline = false;



        /**
         * Fallback semester.
         * @readonly
         */
        unknownSemester = this.addSemester(0);



    //#endregion                  — properties —





    // MARK:                 — constructor —
    /**
     * 
     * @param {boolean} offline 
     */
    constructor(offline=false) {
        this.initCSS();
        this.offline = offline;

        this.parseGrades();

        if (!offline) {
            const notes = document.createElement("li");
            notes.className = "private-community current-site";
            notes.title     = "Notes";
            notes.innerHTML = `<a href="/group/education/notes"><span class="site-name">Notes</span></a>`;

            const shortcutsBar = document.querySelector("#ecam-place-menu");
            const scolarite = shortcutsBar?.querySelector(".private-community.current-site");
            scolarite?.classList.remove("current-site");
            shortcutsBar?.querySelector(".taglib-my-places")?.appendChild(notes);
        }


        const container = document.querySelector("#currentNote");
        const ecamDash = document.createElement("div");

        ecamDash.id = "ecam-dash-3-0";
        ecamDash.dataset.offlineMode = ""+offline;

        container?.appendChild(ecamDash);

    }



    // MARK:                   — methods —
    //#region





        // MARK: _  parseGrades()
        /**
         * Reads the grades from the grades table, and create {@link Grade} instances.
         *
         * @returns ***this*** {@link ECAMDashboard}
         */
        parseGrades() {
            this.retrieveCachedModuleConfig();


            if (document.querySelector(".greyGridTable")) {
                const rows = document.querySelectorAll("table.greyGridTable tbody tr");

                for (const row of rows) {
                    const cells = row.querySelectorAll("td");

                    if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                        const label     = cells[1].textContent.trim();
                        const grade     = parseFloat(cells[0].textContent.replace(",", ".").replace("/20", "")) || 0;
                        const coef      = parseFloat(cells[2].textContent.replace(",", ".").replace("%",   "")) || 0;
                        const classAvg  = parseFloat(cells[3].textContent.replace(",", ".").replace("/20", "")) || 0;
                        const prof      = cells[4].textContent.trim();
                        const date      = cells[5].textContent.trim();
                        const semMatch  = label.match(/Semester\s+(\d+)/i);
                        const semester  = semMatch ? parseInt(semMatch[1]) : this.unknownSemester.number;
                        const parts     = label.split(" - ").map(p => p.trim());
                        const subject   = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : label;
                        const title     = parts.length >= 2 ? parts.at(-1) : "";
                        const module    = this.hasSubject(subject, undefined, semester)
                            ? this.getSubject(subject, undefined, semester).module.name
                            : Module.unclassified
                        ;

                        // if ( subject === "Mathematics for Engineers 5" ) debugger;

                        this.addGrade(
                            grade, 
                            coef, 
                            subject, 
                            module, 
                            semester, 
                            title, 
                            false, 
                            classAvg, 
                            prof, 
                            date, 
                            undefined
                        )
                    }
                }


                // if (this.savedReadGrades.length == 0) {
                //     this.newGrades = [];
                //     this.savedReadGrades = this.grades;
                // }
                // else {
                //     this.newGrades = compareArraysOfObjects(this.grades, this.savedReadGrades).more;
                // }
            }
            else {
                // this.newGrades = [];
                // this.grades = this.savedReadGrades;
            }

            this.retrieveCachedSimGrades();
            this.computeAllStats();

            return this;
        }





        // MARK: _  gradeFromString()
        /**
         * 
         * @param {string} string 
         */
        gradeFromString(string) {
            const delimit = Grade.gradePathSeparator;
            const semRegExp             = new RegExp(`(?<semester>[^(${ delimit})]+)${delimit}`);
            const modRegExp             = new RegExp(`(?<module>[^(${   delimit})]+)${delimit}`);
            const subjRegExp            = new RegExp(`(?<subject>[^(${  delimit})]+)${delimit}`);
            const titleRegExp           = /(?<title>.+) :/;
            const gradeRegExp           = /(?<grade>\d{1,2}(?:\.\d{1,2})?)\/20 vs /;
            const classAvgRegExp        = /(?<classAvg>(?:\d{1,2}(?:\.\d{1,2})?)| — )\/20, /;
            const coefRegExp            = /(?<coef>\d{1,2}(?:\.\d{1,2})?)% /;
            const idRegExp              = /(\((?<id>\d+)\) )?/;
            const profRegExp            = /(\((?<prof>[^\)]+)\) )?/;
            const dateRegExp            = /\((?<date>[^\)]+)\) /;
            const enabledRegExp         = /\[(?<enabled>ON|OFF)/;
            const markedAsReadRegExp    = /(?<markedAsRead>, UNREAD)?\]/;

            const regExp = new RegExp(
                semRegExp.source
                +modRegExp.source
                +subjRegExp.source
                +titleRegExp.source
                +gradeRegExp.source
                +classAvgRegExp.source
                +coefRegExp.source
                +idRegExp.source
                +profRegExp.source
                +dateRegExp.source
                +enabledRegExp.source
                +markedAsReadRegExp.source
            );


            const match = string.match(regExp);

            if (match) {
                // const grade = new Grade(
                //     parseFloat(match[5]),
                //     parseFloat(match[7]),
                //     match[3],
                //     match[4],
                //     !isNaN(parseInt(match[8])),
                //     parseFloat(match[6]),
                //     undefined,
                //     undefined,
                //     parseInt(match[1]),
                //     match[2],
                //     parseInt(match[8])
                // );
                // parsedGrade.enabled       = match[9]  === "ON";
                // parsedGrade.markedAsRead  = match[10] !== "UNREAD";

                const semester      = this.ensureSemester(typeof match?.groups?.semester === "string" ? parseInt(match?.groups?.semester) : NaN);
                const module        = this.ensureModule(match?.groups?.module || "", semester);
                const subject       = this.ensureSubject(match?.groups?.subject || "", module, semester);
                const title         = match?.groups?.title;
                const grade         = parseFloat(match?.groups?.grade || "NaN");
                const classAvg      = parseFloat(match?.groups?.classAvg || "NaN");
                const coef          = parseFloat(match?.groups?.coef || "NaN");
                const id            = parseFloat(match?.groups?.id || "NaN");
                const isSim         = !isNaN(id);
                const prof          = match?.groups?.prof;
                const date          = match?.groups?.date;
                const enabled       = (match?.groups?.enabled === "ON" || match?.groups?.enabled === "OFF") ? (match?.groups?.enabled === "ON") : true;
                const markedAsRead  = match?.groups?.markedAsRead === ", UNREAD";

                const parsedGrade = new Grade(
                    grade,
                    coef,
                    subject,
                    title,
                    isSim,
                    classAvg,
                    prof,
                    date,
                    id
                );

                parsedGrade.enabled       = enabled;
                parsedGrade.markedAsRead  = markedAsRead;

                return parsedGrade;
            }
        }




        //#region — Frontend





            // MARK: _  initCSS()
            initCSS() {

                



                //#region =======  STYLES  CSS  ========

                    let styles = ``;





                    //#region -DASHBOARD   _________________________

                        styles += `
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap');
                            @import url('https://fonts.googleapis.com/css2?family=Jura:wght@300..700&display=swap');
                            
                            * { 
                                box-sizing: border-box; 
                            }
                            
                            html {
                                font-family: sans-serif;
                                -ms-text-size-adjust: 100%;
                                -moz-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                            }

                            body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, textarea, p, blockquote, th, td {
                                margin: 0;
                                padding: 0;
                            }
                            
                            .ecam-dash { 
                                display: flex; 
                                flex-direction: column; 
                                justify-content:center; 
                                align-items: center; 
                                width: 97%; 
                                margin: 20px 1.5% 0px 1.5%; 
                                color: #1a1a1a;
                                font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; 
                                /* font-family: "Jura", sans-serif;
                                font-optical-sizing: auto;
                                font-style: normal; */
                            }

                            table {
                                border-collapse: collapse;
                                border-spacing: 0;
                            }
                            

                            .offline-mode-title    { display: flex; justify-content: center; align-items: center; text-align: center; height: 60px; font-size: 50px; letter-spacing: 0.23em; font-family: "Rubik Glitch", system-ui; opacity: 0; transition: all 1s ease; }
                            .offline-mode-title.show    { opacity: 1; }
                            .offline-mode-subtitle { display: flex; justify-content: center; align-items: center; text-align: center; font-size: 17px; margin-bottom: 30px; opacity: 0; transition: all 1s ease; }
                            .offline-mode-subtitle.show { opacity: 1; }

                            #dash-header { display: flex; justify-content: space-between; align-items: center; padding: 30px 40px; margin-bottom: 15px; width: 100%; background: linear-gradient(135deg, #5b62bf 0%, #2A2F72 100%); color: white; border-radius: 20px; box-shadow: 3px 5px 5px 0px #00000042; }
                            .dash-title { display: flex; justify-content: center; align-items: center; gap: 5px; font-size: 28px; font-weight: 700; margin: 0; }
                            .dash-title-text  {  }
                            .patch-notes-link { display: flex; justify-content: center; align-items: center; gap: 5px; cursor: pointer; color: inherit; }
                            .dash-subtitle { font-size: 16px; opacity: 95%; padding: 5px 0px; background: transparent; color: white; }
                            
                            .currently-loading      { display: flex; justify-content: center; align-items: center; height: 100px; width: 100px; min-height: 100px; min-width: 100px; position: fixed; bottom: 30px; right: -100px; opacity: 0%; z-index: 1500; transition: opacity 0.2s ease; }
                            .currently-loading.show { right: 30px; opacity: 100%; }
                            .loading-symbol         { position: absolute; top: 100px; right: 100px; height: 100px; width: 100px; clip-path: circle(20px); background: #594a8fe0; offset-path: circle(50px); offset-distance: var(--offset-offset); }
                            .loading-symbol.blur    { backdrop-filter: blur(2px); }
                            .loading-symbol.show    { animation: loading 1s infinite; }
                            @keyframes loading  { from {offset-distance: var(--offset-offset)} to {offset-distance: calc(var(--offset-offset) + 100%)} }

                            .new-user-notif     { display: flex; justify-content: center; align-items: center; width: 0; height: 0; position: relative; right: 296px; top: -22px; border-radius: 20px; text-align: center; cursor: pointer; user-select: none; z-index: 301; transition: all 0.3s ease; --hoveringElem-amp: 5px; animation: hoveringElem 2s infinite alternate ease-in-out; --arrow-join: round; } 
                            .new-user-notif-text    { min-width: 450px; min-height: 53px; padding: 10px; background: #00037b; outline: 3px solid; border-radius: 20px; font-size: 23px; text-wrap-mode: wrap; line-height: 24px; z-index: 10; }
                            .new-user-notif-arrow       { width: 0px; height: 0px; position: relative; transition: all 0.5s ease }
                            .new-user-notif-arrow-svg        { width: 0; height: 0; min-width: 210px; min-height: 70px; }
                            .new-user-notif-arrow-path       { animation: hoveringArrow 2s infinite alternate ease-in-out; }
                            .new-user-notif-arrow-path.outside   { fill: none; stroke: #ffffff; stroke-width: 15px; stroke-linejoin: var(--arrow-join); }
                            .new-user-notif-arrow-path.inside    { fill: none; stroke: #00037b; stroke-width: 8px;  stroke-linejoin: var(--arrow-join); }
                            @keyframes hoveringArrow { from { d: path('M 0 30 c 10,59, 134,90, 165,16 m -19,3 l 21,-6 l 8,18'); } to { d: path('M 0 30 c 23,67, 156,87, 178,0 m -23,8 l 25,-15 l 13,22'); } }

                            .focus-notif-fullscreen-effect   { position: fixed; width: 100%; height: 100%; right: 0px; top: 0px; background: black; overflow: clip; opacity: 0%; z-index: 8; transition: all 0.5s ease; }
                            .focus-notif-fullscreen-effect.focus { opacity: 60%; }
                        `;
                        
                        
                        //#region -Buttons
                            styles += `
                                .lang-btn           { border: 2px solid #000000ff; background: #6f79ff; border-radius: 18px; width: 36px; height: 36px; }
                                .lang-btn.active    { border: 2px solid #ceefffff; }
                                .lang-btn:hover     { border: 2px solid #afe4ffff; background: #a6acff; }
                            `;
                        
                        
                            //#region -over header buttons
                            
                                styles += `

                                    .over-header-btns                   { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; position: relative; height: 0px; width: 95%; top: 0px; gap: 8px; color: white; }                        
                                    .over-header-btn                            { display: flex; justify-content: center; align-items: center; border-radius: 20px; position: relative; transition: all 0.2s ease; height: 40px; cursor: pointer; user-select: none; text-decoration: none; text-wrap-mode: nowrap; overflow: clip; }
                                `;


                                // MARK: help buttons
                                styles += `
                                    .over-header-help-btns                  { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; /* z-index: 301; */ }


                                    .over-header-btn.how-to-use-btn                 { justify-content: center;  background: #0059ad; width: 40px; padding-left: 0px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; }
                                    .over-header-btn.how-to-use-btn:hover           { outline-color: white; background: #2888e2; }
                                    .over-header-btn.how-to-use-btn.open            { outline-color: white; }

                                    .over-header-how-to-use-btns                        { display: flex; justify-content: flex-end; align-items: center; gap: 9px; width: 0; height: 0; position: relative; top: 20px; right: -70px; opacity: 0%; z-index: 6; transition: all 0.2s ease; }
                                    .over-header-how-to-use-btns.open                   { top: 35px; opacity: 100%; }

                                    .over-header-btn.help                                   { background: #0059ad; outline: 2px solid #c022ff; box-shadow: 5px 7px 6px 0px black; padding: 0px 10px; font-size: 15px; border: none; color: inherit; }
                                    .over-header-btn.help:hover                             { background: #1672c9; outline-color:     #ffffff; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.help:focus                             { background: #1672c9; outline-color:     #ffffff; box-shadow: 7px 9px 6px 2px black; }

                                    .over-header-btn.help.doc-btn                               {  }
                                    .over-header-btn.help.doc-btn.fr                            { width: 180px; }
                                    .over-header-btn.help.doc-btn.fr::before                    { content: "Voir documentation"; }
                                    .over-header-btn.help.doc-btn.en                            { width: 180px; }
                                    .over-header-btn.help.doc-btn.en::before                    { content: "See documentation"; }
                                    
                                    .over-header-btn.help.keybinds-btn                          {  }
                                    .over-header-btn.help.keybinds-btn.fr                       { width: 180px; }
                                    .over-header-btn.help.keybinds-btn.fr::before               { content: "Raccourcis clavier ⌨️"; }
                                    .over-header-btn.help.keybinds-btn.en                       { width: 190px; }
                                    .over-header-btn.help.keybinds-btn.en::before               { content: "Keyboard shortcuts ⌨️"; }

                                    .over-header-btn.help.tuto-btn                              { font-weight: 700; }
                                    .over-header-btn.help.tuto-btn.fr                           { width: 168px; }
                                    .over-header-btn.help.tuto-btn.fr::before                   { content: "Démarrer tutoriel ▶︎"; }
                                    .over-header-btn.help.tuto-btn.en                           { width: 135px; }
                                    .over-header-btn.help.tuto-btn.en::before                   { content: "Start tutorial ▶︎"; }

                                    .over-header-btn.help.first-steps-btn                       { font-weight: 700; }
                                    .over-header-btn.help.first-steps-btn.fr                    { width: 168px; }
                                    .over-header-btn.help.first-steps-btn.fr::before            { content: "► Premiers pas ◄"; }
                                    .over-header-btn.help.first-steps-btn.en                    { width: 135px; }
                                    .over-header-btn.help.first-steps-btn.en::before            { content: "► First steps ◄"; }
                                `;



                                // MARK: settings button
                                styles += `
                                    .over-header-btn.settings-btn           { justify-content: center;  background: #0059ad; width: 40px; padding-left: 0px;  font-size: 20px; outline: 3px solid #c022ff; border: none; color: inherit; z-index: 5; }
                                    .over-header-btn.settings-btn:hover     { outline-color: white; background: #2888e2; }
                                    .over-header-btn.settings-btn.open      { outline-color: white; }
                                `;



                                // MARK: issues buttons
                                styles += `
                                    .over-header-report-btns                { display: flex; flex-direction: row; justify-content: flex-end; align-items: center; }


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
                                    
                                    .over-header-btn.issue.mail-info.fr.open            { width: 337px; right: -685px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.share-config.fr.open         { width: 557px; right: -640px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.suggest-idea.fr.open         { width: 391px; right: -261px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.report-issue.fr.open         { width: 234px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }

                                    .over-header-btn.issue.mail-info.en.open            { width: 330px; right: -580px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.share-config.en.open         { width: 455px; right: -530px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.suggest-idea.en.open         { width: 329px; right: -215px; box-shadow: 5px 7px 6px 0px black; }
                                    .over-header-btn.issue.report-issue.en.open         { width: 191px; right: -40px;  box-shadow: 5px 7px 6px 0px black; }
                                    

                                    .over-header-btn.issue.mail-info.open:hover          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.share-config.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.suggest-idea.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.report-issue.open:hover       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }

                                    .over-header-btn.issue.mail-info.open:focus          { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.share-config.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.suggest-idea.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                    .over-header-btn.issue.report-issue.open:focus       { color: #b8d7ff; outline-color: teal; box-shadow: 7px 9px 6px 2px black; }
                                `;

                            //#endregion

                            


                            // MARK: -other buttons
                            styles += `
                            
                                .header-actions                 { display: flex; gap: 12px; }
                                .config-btns-container          { display: flex; flex-direction: column; }
                                .btn                                { display: flex; justify-content: center; align-items: center; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s ease; font-size: 14px; }
                                .btn-edit-mode:hover:not(:disabled) { transform: scale(0.95); background: linear-gradient(135deg, #7d92eeff 0%, #8e5ebeff 100%); }
                                .btn-edit-mode                      { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: grid; width: 126px; height: 108px; transition: all 0.2s ease }
                                .btn-edit-mode.on                   { transform: scale(0.95); box-shadow: inset 0px 0px 6px 4px #ffffff; }
                                .btn-export                         { background: white; color: #666; width: 140px; height: 50px; margin-bottom: 8px; }
                                .btn-import                         { background: white; color: #666; width: 140px; height: 50px; z-index: 1; }
                                .btn-export:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                                .btn-import:hover                   { background: white; border: 1px solid #667eea; color: #667eea; transform: scale(0.95); box-shadow: 3px 5px 5px 0px #00000042; }
                                .btn-icon                           { font-size: 20px; margin-bottom: 2px }
                                .btn:disabled                       { opacity: 50%; cursor: not-allowed; }
                            `;

                        //#endregion





                        //MARK: -settings
                        styles += `

                            .settings-modal-container   { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 1000; }
                            .settings-modal                 { display: flex; padding: 40px 30px; --modal-max-width: 1000px; --modal-max-height: 500px; overflow: auto; }
                            .settings-modal-body                { display: flex; flex-direction: column; width: 100%; }
                            .settings-row-family                    { display: flex; flex-direction: column; width: 100%; background: linear-gradient(90deg, #5c5c5c38 0%, transparent 50%); background-size: 200% 200%; background-position: 100% 100%; transition: all 0.3s ease; }
                            .settings-row-family.disabled           { background-position: 0% 100%; }
                            .settings-row                               { --padding-left: 0px; display: flex; justify-content: space-between; align-items: center; gap: 20px; background: linear-gradient(90deg, #5c5c5c5c 0%, transparent 50%); background-size: 200% 200%; background-position: 100% 100%; transition: all 0.3s ease; }
                            .settings-row.parent                        { --padding-left: 0px; background: none; }
                            .settings-row.child                         { --padding-left: 5px; margin-left: 20px; padding-left: var(--padding-left); border-left: 1px solid #80808073; border-top: 1px solid #80808073; border-top-left-radius: 15px; }
                            .settings-row.disabled                      { background-position: 0% 100%; opacity: 80%; padding-left: calc(5px + var(--padding-left)); }
                            .settings-text                                  { display: flex; flex-direction: column; gap: 8px; padding: 13px 0px; }
                            .settings-checkbox                              { zoom: 130%; }
                        
                        `;


                        //MARK: keybinds
                        styles += `

                            .keyboard-shortcut-list-container   { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 900; }
                            .keyboard-shortcut-list-modal           { display: flex; padding: 30px; overflow: auto; }

                            .keybinds-table-row     { height: var(--row-height); border-top: 1px solid black; }
                            .keybinds-table-cell        { padding: 15px 0px 15px 15px; }
                            .keybinds-table-cell.text       { border-right: 1px solid black; }

                        `;


                        //MARK: TUTOS
                        styles += `
                            .tuto-tip-notif-container   { display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; width: 0; height: 0; z-index: 10; opacity: 0; transform: scale(110%); --infinite-alternate-scale-up-scale: 100%; user-select: text; transition: all 0.3s ease;}
                            .tuto-tip-notif         { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 15px; padding: 20px; background: linear-gradient( #5334ff 0%, #7a62ff 100%); border-radius: 7px; outline: 5px solid; color: white; font-size: 31px; line-height: 31px; text-align: center; --hoveringElem-amp: 10px; animation: focusBlinkAnimation 2s infinite alternate ease-in-out, hoveringElem 2s infinite alternate ease-in-out; transition: all 0.3s ease; }
                            .tuto-tip-notif:hover   { animation-play-state: running, paused; }

                            .tuto-tip-btns-container 	{ display: flex; flex-direction: column; justify-content: center; align-items: center; color: white; font-size: 28px; font-weight: 700; text-wrap-mode: nowrap; }
                            .tuto-tip-btns-container-header	{ display: flex; flex-direction: column; justify-content: center; align-items: center; text-wrap-mode: nowrap; width: 0; height: 0; }	
                            .tuto-tip-btns-body				{ display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px 10px; gap: 20px; overflow-x: visible; overflow-y: auto; }	
                            .tuto-tip-btn						{ display: flex; justify-content: center; align-items: center; padding: 15px; outline: 2px solid white; border-radius: 10px; background: linear-gradient( #5334ff75 0%, #7a62ff75 100%); color: white; font-size: 26px; font-weight: 700; text-wrap-mode: nowrap; cursor: pointer; animation: none; animation-play-state: paused; transition: all 0.2s ease; }
                            .tuto-tip-btn:hover 				{ animation: focusBlinkAnimation 1s infinite alternate ease-in-out; transform: scale(101%); }

                            @keyframes focusBlinkAnimation  { from { filter: brightness(1); } to { filter: brightness(1.5) } }

                            .skip-tuto-btn          { display: flex; justify-content: center; align-items: center; padding: 10px; position: fixed; top: 45px; right: 20px; background: #4c84fde8; border-radius: 10px; color: white; font-size: 20px; text-decoration: underline; cursor: pointer; opacity: 0; z-index: 5000; transition: all 0.5s ease; }
                            .skip-tuto-btn::before      { content: "Skip tutorial"; }

                            .tuto-lang-btn-toggle-container	{ display: flex; justify-content: center; align-items: center; position: fixed; top: 48px; right: 200px; outline: 2px solid white; border-radius: 20px; width: 100px; height: 31px; overflow: clip; z-index: 12; opacity: 0; cursor: pointer; transition: all 0.5s ease; }
                            .tuto-lang-btn-toggle		{ display: flex; justify-content: space-evenly; align-items: center; padding: 10px; position: relative; min-width: 170px; height: 31px; background: linear-gradient(90deg, #3636ffc5 20%, #8e38ffc5 80%); transform: translateX(0px); transition: all 0.2s ease; }
                            .tuto-lang-btn-toggle.fr	{ transform: translateX(35px);  }
                            .tuto-lang-btn-toggle.en	{ transform: translateX(-35px); }
                        `;


                        // MARK: import menu
                        styles += `

                            .import-menu        { display: flex; justify-content: space-around; position: relative; right: 375px; top: 0; color: black; font-size: 15px; border-radius: 13px; height: 0; width: 0; opacity: 0%; z-index: 0; transition: all 0.2s ease; }
                            .import-menu.show   { top: 16px; opacity: 100%; }
                            .import-menu-body   { display: flex; justify-content: space-around; align-items: center; border-radius: 13px; background: white; box-shadow: 5px 4px 20px 0px #00000066; min-height: 60px; min-width: 540px; transition: all 0.2s ease; }
                            .import-menu-btn        { display: flex; justify-content: center; align-items: center; text-align: center; user-select: none; cursor: pointer; background: white; border-radius: 12px; border: 2px solid; height: 40px; width: 40%; padding: 5px; transition: all 0.2s ease; }
                            .import-menu-btn:hover  { background: #dddddd; }
                            .import-menu-btn.file   {  }
                            .import-menu-btn.clear  { width: 15%; }
                            .import-menu-btn.online {  }
                            

                            .online-cfg-picker-menu-container   { display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 999; }
                            .online-cfg-picker-menu                 { display: flex; flex-direction: column; justify-content: flex-start; padding: 20px 35px; z-index: 1000; }
                            .online-cfg-picker-menu-header              { display: flex; justify-content: center; align-items: center; padding: 6px 0px; font-size: 15px; z-index: 1010; }

                            .online-cfg-picker-menu-body            { display: flex; flex-direction: row; overflow: auto; }
                            .online-cfg-picker-menu-body-content  { display: flex; flex-direction: row; justify-content: center; align-items: flex-start; width: 100%; height: 100%; min-width: 640px; min-height: 263px; padding: 5px 0px; }
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
                            .main-average-card { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 104px; background: linear-gradient(135deg, #ffffff 30%, #514ba2ff 75%); border-radius: 20px; padding: 30px; margin-bottom: 15px; }

                            .average-display { display: flex; align-items: baseline; gap: 10px; }
                            .average-number     { font-size: 48px; font-weight: 800; -webkit-text-fill-color: #2A2F72; padding-top: 9px; }
                            .average-label      { font-size: 18px; color: #666; font-weight: 500; }
                            .average-stats { display: flex; gap: 30px; }
                            .stat-item { text-align: center; }
                            .stat-value { font-size: 24px; font-weight: 700; color: #c1a7ffff; }
                            .stat-label { font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
                        `;


                        // MARK: new grades
                        styles += `
                            .new-grades-card                { display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 25px; padding: 10px; gap:10px; width: 100%; border-radius: 16px; border: 4px solid #446dff; background: #e3e9ffff; box-shadow: 0px 0px 15px 5px #322bff87; scroll-margin: 105px; transition: box-shadow 0.3s ease}
                            .new-grades-card.myhighlight    { box-shadow: 0px 0px 20px 20px #322bff87; }
                            .new-grades-card.none           { border: 1px solid #446dff; background: #f7f9ffff; box-shadow: none; opacity: 80%; }
                            .new-grades-card-header         { display: flex; justify-content: space-between; align-items: center; margin: 5px 0px; }
                            .new-grades-card-header.none    { justify-content: center; }
                            .new-grades-card-title          { font-size: 20px; font-weight: 800; color: #2A2F72; margin-left: 25px; display:flex; align-items:center }
                            .new-grades-card-title.none     { font-size: 18px; font-weight: 700; }
                            .new-grades-content             { display: flex; flex-direction: column; gap: 20px; }
                            .new-grades-subject-card        { display: flex; flex-direction: column; border: 2px solid #c1a7ffff; border-radius: 12px; transition: border 0.3s ease; }
                            .new-grades-subject-card-title  { border: 2px solid #c1a7ffff; border-radius: 12px; margin: -2px -2px 5px -2px; font-size: 16px; font-weight: 600; background: #c1ceff; padding: 5px 0px 5px 10px; transition: border 0.3s ease, background 0.3s ease; }
                            .new-grades-subject-card.hover          { cursor: alias; border: 2px solid #dcccff; }
                            .new-grades-subject-card-title.hover    { cursor: alias; border: 2px solid #dcccff; background: #d7dfff; }
                            .new-grades-table               {  }
                            .new-grades-table-grades        {  }
                        `;


                        // MARK: notifs
                        styles += `

                            .update-available-notif     { display: flex; align-items: center; justify-content: space-evenly; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 95%; height: 70px; position:fixed; left:2.5%; right:0px; top:-75px; z-index: 400; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                            .update-available-notif.on  { top: 2px }
                            .update-available-notif-header  { display: flex; justify-content: center; align-items: center; width: 80%; font-size: 25px; gap: 15px; }
                            .update-available-notif-text        { display: flex; justify-content: center; align-items: center; }
                            .update-available-notif-patch-notes { display: flex; justify-content: center; align-items: center; padding: 5px; border: 2px solid; border-radius: 20px; }
                            .update-available-notif-btns    { display: flex; justify-content: space-between; align-items: center; flex-direction: row; width: 20%; }
                            .update-btn                     { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #007cffff; transition: all 0.3s ease; text-decoration: none; outline: none; color: inherit; }
                            .update-btn:focus               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                            .update-btn:hover               { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }
                            .dismiss-update-btn             { display: flex; justify-content: center; align-items: center; border: 2px solid; border-radius: 14px; width: 80%; height: 30px; padding: 5px 15px; cursor:pointer; background: #ff00218f; transition: all 0.3s ease; }
                            .dismiss-update-btn:hover       { color: #b8d7ff; width: 95%; height: 40px; font-size: 20px; }

                            .new-grades-notif           { display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #dafaff; font-weight: 800; font-size: 17px; background: #6554ff; width: 90%; height: 50px; cursor:pointer; position:fixed; left:5%; right:0px; top:-55px; z-index:299; box-shadow: 0 0 5px rgba(0,0,0,0.5); user-select: none; transition: all 0.5s ease; }
                            .new-grades-notif.on        { top:50px }

                            .temp-notif         { display: flex; justify-content: center; align-items: center; position: fixed; top: 0px; background: linear-gradient(180deg, #432eff 0%, #7060ff5d 100%); padding: 10px 30px; border-radius: 0px 0px 20px 20px; color: black; font-size: 20px; font-weight: 500; text-align: center; opacity: 0%; z-index: 2000; transition: all 1s ease; }
                            .temp-notif.show        { color: white; opacity: 100%; }
                            .temp-notif.fr::before      { content: "Tu ne peux pas sélectionner une carte de module ET une carte de sujet ! Ne mélange pas les sélections !" }
                            .temp-notif.en::before      { content: "You can't select a module card AND a subject card! Don't mix up the selections!" }

                            .new-indicator-container    { display: flex; width: 0; height: 0; position: relative; }
                            .new-indicator                  { --new-indicator-base-color: #008cff; --new-indicator-highlight-color: #81c6ff; display: flex; min-width: 10px; min-height: 10px; border-radius: 5px; background: var(--new-indicator-base-color); animation: newIndicator 1s alternate infinite ease; }
                            @keyframes newIndicator { from { background: var(--new-indicator-base-color); } to {background: var(--new-indicator-highlight-color);} }

                        `;


                        // MARK: semester filter
                        styles += `
                            .controls-bar       { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 16px 20px; width: 100%; background: white; border-radius: 16px; border: 1px solid #e5e5e5; }
                            .filter-title       { border-radius: 20px; color: white; font-weight: 700; font-size: 14px; padding: 10px 15px; margin-right: 70%; margin-bottom: -15px; background: linear-gradient(45deg, #446dff 20%, #1222ff12 60%, #ffffff00 89%); position: relative; transition: all 0.2s ease; }
                            .filter-tabs        { display: flex; background: #f7f7f7; padding: 4px; border-radius: 12px; gap: 4px; height: 44px; }
                            .filter-tab         { display: flex; justify-content: center; padding: 10px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; color: #666; transition: all 0.2s ease; font-size: 14px; width: 57px; }
                            .filter-tab:hover   { background: white; color: #333333ff; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(110%); }
                            .filter-tab.active  { background: white; color: #667eeaff; box-shadow: 3px 5px 5px 0px #00000042; }
                        `;


                        // MARK: view mode buttons
                        styles += `
                            .view-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 4px; background: #f7f7f7; border-radius: 8px; }
                            .fold-toggle        { display: flex; align-items: center; justify-content: center; gap: 8px; height: 40px; width: 180px; background: #f7f7f7; outline: 1px solid; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; user-select: none; transition: all 0.3s ease; }
                            .fold-toggle:hover  { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                            .fold-toggle.active { background: white; box-shadow: 3px 5px 5px 0px #00000042, inset 0px 0px 5px 2px #00000042; }
                            .fold-toggle.fr::after  { content: "Plier tous les modules" }
                            .fold-toggle.en::after  { content: "Fold all modules" }
                            .view-btn           { background: transparent; padding: 8px 12px; border: none; outline: 1px solid #adadad; border-radius: 6px; cursor: pointer; font-size: 18px; transition: all 0.2s ease; width: 48px; height: 40px; }
                            .view-btn:hover     { background: white; box-shadow: 3px 5px 5px 0px #00000042; transform: scale(0.95); }
                            .view-btn.active    { background: white; box-shadow: 3px 5px 5px 0px #00000042; outline-color: black; }
                        `;

                    //#endregion
                    
                    



                    //#region -DROP FIELDS __________________________
                        styles += `
                            .drop-field     { display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 20px; overflow: clip; user-select: none; }
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
                            .drop-field-remove-from-module-minus.hover               { font-size: 90px; }
                            .drop-field-remove-from-module-text                      { font-size: 25px; position: relative; overflow-x: clip; text-wrap-mode: nowrap; transition: all 0.5s cubic-bezier(0, 1, 0.25, 1); }
                            .drop-field-remove-from-module-text.top                  { bottom:  10px; left: 0px; }
                            .drop-field-remove-from-module-text.bottom               { top:     10px; right:0px; }
                            .drop-field-remove-from-module-text.top.hover            { bottom:  30px; left: 20px; font-size: 30px; }
                            .drop-field-remove-from-module-text.bottom.hover         { top:     30px; right:20px; font-size: 30px; }

                            .drop-field-remove-from-module-text.top.fr::before       { content: "Enlever"; }
                            .drop-field-remove-from-module-text.bottom.fr::after     { content: "du module"; }
                            .drop-field-remove-from-module-text.top.en::before       { content: "Remove"; }
                            .drop-field-remove-from-module-text.bottom.en::after     { content: "from module"; }

                            .drop-field-remove-from-module-hitbox                    { position: fixed; top: 50px; left:0px; height: calc(100% - 100px); width: 0%; border-radius: 0px 20px 20px 0px; transition: all 0.2s ease; }
                            .drop-field-remove-from-module-hitbox.show               { width: 15%; border-width: 2px 2px 2px 0px; cursor: pointer; z-index: 298; }
                        `;
                            

                        // MARK: drop insert fields
                        styles += `

                            .drop-field.insert-field.module                     { justify-content: flex-start; width: 98%; height: 4px; color: #9b9b9b00; opacity: 0%; border: 2px dashed #9b9b9bff; background: #bdb8ff3d; font-size: 25px; font-weight: 800; user-select: none; margin: 48px 0px; transition: all 0.2s ease; }
                            .drop-field.insert-field.module.show                { color: #9b9b9bff; border-color: #9b9b9bff; opacity: 50%;  border-width: 2px 0px; border-radius: 0px; height: 50px; margin: 25px 0px; }
                            .drop-field.insert-field.module.show.hover          { color: #887bffff; border-color: #7fc2ffff; opacity: 100%; border-width: 2px 2px; border-radius: 20px; }

                            .drop-field.insert-field.subject                    { justify-content: flex-start; width: 98%; height: 4px; color: #9b9b9bff; opacity: 0%; border: 2px dashed #9b9b9b54; background: #bdb8ff1a; font-size: 25px; font-weight: 800; user-select: none; margin: 30px 0px; transition: all 0.2s ease; }
                            .drop-field.insert-field.subject.show               { color: #9b9b9bff; border-color: #9b9b9b54; opacity: 50%;  border-width: 2px 0px; border-radius: 0px; height: 30px; margin: 17px 0px; }
                            .drop-field.insert-field.subject.show.hover         { color: #887bffff; border-color: #7fc2ffff; opacity: 100%; border-width: 2px 2px; border-radius: 20px; }
                            
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





                    //#region -CONTENT AREA _______________________
                        styles += `
                            .content-area { display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; }
                        `;




                        // MARK: Intranet table
                        styles += `
                            .intranet-fold { background: #f9fafb; margin: 20px 0px; border-radius: 20px; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: center; align-items: center; cursor: pointer; font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; color: #1a1a1a; }
                            .intranet-fold:hover { background: #f3f4f6; }
                            .intranet-text { display: flex; align-items: center; font-size: 18px; font-weight: 600; color: #1a1a1a; }
                            .intranet-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease; }
                            .intranet-toggle.openLeft { transform: rotate(-180deg); }
                            .intranet-toggle.openRight { transform: rotate(180deg); }
                        `;


                        // MARK: semester section
                        styles += `
                            .semester-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: white; border-radius: 24px; overflow: hidden; border: 1px solid #e5e5e5; transition: all 0.3s ease; }
                            .semester-header        { display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f9fafb; padding: 20px 24px; border-bottom: 1px solid #e5e5e5; cursor: pointer; }
                            .semester-header:hover  { background: #f3f4f6; }
                            .semester-info              { display: flex; align-items: center; gap: 12px; }
                            .semester-name              { font-size: 24px; font-weight: 600; color: #1a1a1a; }
                            .semester-averages          { display: flex; align-items: baseline; gap: 6px; padding: 6px 12px; background: white; border: 1px solid #575757; border-radius: 8px; font-size: 19px; font-weight: 600; transition: all 0.2s ease; }
                            .semester-averages.good         { color: #10b981; border-color: #10b98130; }
                            .semester-averages.bad          { color: #ef4444; border-color: #ef444430; }

                            .semester-toggle                { display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; font-size: 18px; transition: transform 0.3s ease; }
                            .semester-toggle.open           { transform: rotate(180deg); }

                            .semester-content               { padding: 50px 24px; display: none; }
                            .semester-content.show          { display: flex; flex-direction: row; width: 100%; gap: 0px; transition: all 0.2s ease; }
                            .semester-content.show.edit     { padding: 24px; }
                            .semester-content.show.dragging { width: 73%; gap: 20px; }

                            .semester-body      { display: flex; flex-direction: column; width: 100%; gap: 20px; transition: gap 0.2s ease; }
                        `;
                            


                        

                        // MARK: -MODULES SECTION
                        styles += `

                            .modules-section                                { display: flex; flex-direction: column; gap: 50px; align-items: center; width: 100%; transition: all 0.3s ease; }
                            .modules-section.edit                           { gap: 12.5px; }
                        `;
                            





                        // MARK: -MODULE CARDS
                        styles += `

                            .module-card                { display: flex; flex-direction: column; align-items: center; width: 100%; position: relative; background: #fafafa; border-radius: 25px; outline: 3px solid #e5e5e5; scroll-margin: 70px; overflow: clip; transition: all 0.2s ease; }
                            .module-card.validated      { outline-color: #10b981ff; background: radial-gradient(transparent 0%, #f0fdf4ff 75%); }
                            .module-card.failed         { outline-color: #ef4444ff; background: radial-gradient(transparent 0%, #fef2f2ff 75%); }
                            .module-card.unknown        { outline-color: #6d6d6dff; background: radial-gradient(transparent 0%, #d1d1d1ff 75%); }

                            .module-card-header                  { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 18px 20px; border-bottom: 3px solid #e5e5e5; border-radius: 22px 22px 0px 0px; width: 100%; min-height: 80px; max-height: 80px; cursor: pointer; z-index: 2; transition: all 0.1s ease; }
                            .module-card-header.fold             { border-radius: 25px; }
                            .module-card-header.validated        { border-color: #10b981ff; background: linear-gradient(300deg, #e0ffeaff 30%, transparent); }
                            .module-card-header.failed           { border-color: #ef4444ff; background: linear-gradient(300deg, #ffd9d9ff 30%, transparent); }
                            .module-card-header.unknown          { border-color: #6d6d6dff; background: linear-gradient(300deg, #acacacff 30%, transparent); }
                            .module-card-header:hover            { filter: brightness(calc(0.01 * 105)); opacity: 90%; }
                            .module-delete-btn                  { border-radius: 14px; background: transparent; margin: 0; text-transform: none; -webkit-appearance: button; font: 1em Arial,Helvetica,Verdana,sans-serif; width: auto; padding: 5px; overflow: visible; cursor: pointer; color: #34404F; text-shadow: none; font-weight: normal; border: 3px solid; border-color: white; transition: all 0.2s ease; } 

                            .module-card-header-left-side        { display: flex; align-items: center; justify-content: flex-start; width: 35%; }
                            .module-title                    { font-size: 20px; font-weight: 800; color: #1a1a1a; width:42%; margin-bottom: 2px; }
                            .module-title.input              { font-size: 20px; font-weight: 800; color: #1a1a1a; width:90%; border-radius: 12px; padding-left: 10px; }


                            .module-subject-total-coef-div   { display: flex; flex-direction: column; text-align: left; width:47%; gap:4px; padding: 0px 10px; font-size: 14px; opacity: 100%; transition: all 0.1s ease; }
                            .module-subject-total-coef-value { display: flex; text-align: left; font-size: 13px; font-weight: 600; gap: 8px; }
                            .module-subject-total-coef-debug { display: flex; text-align: left; font-size: 13px; }


                            .module-card-content            { display: flex; flex-direction: column; width: 100%; align-items: center; gap: 0px; padding: 8px 0px 18px 0px; opacity: 100%; transition: all 0.2s ease; }
                            .module-card-content.edit-mode  { gap: 5px; }

                            .module-info                        { display: flex; flex-direction: row; justify-content: space-around; align-items: center; position: relative; top: -10px; width:97%; min-height: 36px; background: #eef2ff00; border:1px solid #c7d2fe00; padding: 0px 8px 3px 8px; border-radius: 0px 0px 8px 8px; margin-top: -1px; opacity: 100%; transition: all 0.2s ease; }
                            .module-info-bar                    { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width:48%; background: #eef2ff; border:1px solid #c7d2fe; padding: 3px 15px; border-radius: 0px 0px 8px 8px; }
                            .module-info-clear                  { display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 12px; background: #d7e0ff; border: 2px solid; border-radius: 10px; padding: 2px 7px; user-select: none; width: 220px; margin-right: 8px; cursor: pointer; transition: all 0.2s ease; }
                            .module-info-clear:hover            { width: 240px; font-size: 11.5px; margin-right: 0px; background: #eef2ff; }
                            .module-info-clear.disabled         {  }
                            .module-info-clear.sim              {  }

                            .module-card-header-right-side  { display: flex; justify-content: flex-end; align-items: center; width: 20%; gap: 6px; font-size: 19px; font-weight: 600; text-wrap-mode: nowrap; }
                            .module-class-average               { display: flex; justify-content: flex-end; align-items: center; width: 80px; font-size: 17px; }
                            .module-average                     { display: flex; justify-content: flex-end; align-items: center; font-size: 26px; font-weight: 800; }
                            .module-average.good                { color: #10b981; }
                            .module-average.bad                 { color: #ef4444; }
                            .module-average.unknown             { color: #6d6d6dff; }
                            .module-toggle                      { display: flex; justify-content: center; align-items: center; width: 24px; height: 24px; line-height: 1px; margin-left: 5px; font-size: 18px; color: #000000; transition: transform 0.3s ease; }
                            .module-toggle.open                 { transform: rotate(180deg); }


                            .module-details                     { display: flex; flex-direction: column; align-items: center; width: 97%; gap: 30px; opacity: 100%; transition: all 0.2s ease; }
                            .module-details.edit-mode           { gap: 0px; }

                        `;
                            



                        // MARK: -UNCLASSIFIED SECTION
                        styles += `

                            .unclassified-section   { display: flex; flex-direction: column; align-items: center; width: 100%; background: #fff8f0; border-radius: 20px; padding: 20px; border: 2px dashed #fbbf24; transition: height 0.2s ease; }
                            .unclassified-content   { display: flex; flex-direction: column; align-items: center; gap: 25px; width: 99%; height: 100%; }
                            .unclassified-title     { display: flex; align-items: center; gap: 8px; width: 97%; font-size: 16px; font-weight: 600; color: #92400e; margin-bottom: 16px; }
                        `;
                            



                        //#region -SUBJECT CARDS .....................................
                            styles += `

                                .subject-card               { display: flex; flex-direction: column; justify-content: space-between; align-items: center; width: 100%; height: 100%; min-height: 70px; position: relative; border-radius: 20px; outline: 4px solid #ffffffff; opacity: 100%; overflow: clip; transition: outline-color 0.3s ease, transform 0.3s ease, all 0.2s ease; }
                                .subject-card.detailed      { }
                                .subject-card.compact       { }
                                .subject-card.scroll-to     { transform: scale(102%); outline-color: #5f77ff; border-color: #5f77ff; }

                                .subject-card.good                  { box-shadow: 0px 0px 0px 0px  #39ff8f; background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                                .subject-card.good:hover            { box-shadow: 0px 0px 13px 5px #39ff8f; }
                                .subject-card.meh                   { box-shadow: 0px 0px 0px 0px  #fff27b; background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                                .subject-card.meh:hover             { box-shadow: 0px 0px 13px 5px #fff27b; }
                                .subject-card.bad                   { box-shadow: 0px 0px 0px 0px  #ff7b7b; background: linear-gradient(300deg, #fef2f2 30%, transparent); }
                                .subject-card.bad:hover             { box-shadow: 0px 0px 13px 5px #ff7b7b; }
                                .subject-card.unknown               { box-shadow: 0px 0px 0px 0px  #6d6d6d; background: linear-gradient(300deg, #c5c5c5 30%, transparent); }
                                .subject-card.unknown:hover         { box-shadow: 0px 0px 13px 5px #6d6d6d; }
                                
                                .subject-card-header        { display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%; min-height: 70px; border-radius: 20px 20px 0px 0px; outline: 4px solid white; padding: 5px 11px; font-weight:700; font-size: 15px; vertical-align: top; cursor: pointer; z-index: 1; transition: all 0.2s ease; }
                                .subject-card-header.compact    { border-radius: 20px; }
                                .subject-card-header.good       { background: linear-gradient(300deg, #e3ffeb 30%, transparent); }
                                .subject-card-header.meh        { background: linear-gradient(300deg, #ffe8d0 30%, transparent); }
                                .subject-card-header.bad        { background: linear-gradient(300deg, #ffe0e0 30%, transparent); }
                                .subject-card-header.unknown    { background: linear-gradient(300deg, #b8b8b8 30%, transparent); }

                                .subject-card-header-left-side          { display: flex; justify-content: flex-start; align-items: center; gap: 8px; width: 50%; height: 100%; text-wrap-mode: nowrap; }
                                .subject-card-header-left-side-text     { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 8px; padding-left: 20px; width: 95%; height: 100%; text-wrap-mode: nowrap; }
                                .subject-card-header-left-side-text.edit    { padding-left: 0; }
                                .subject-card-header-grades-details         { opacity: 0%; transition: all 0.2s ease; }
                                .subject-card-header-grades-details.show    { opacity: 100%; }
                                .subject-name                   { font-weight: 800; color: #1a1a1a; font-size: 16px }
                                .subject-name.input             { font-weight: 800; color: #1a1a1a; font-size: 16px; border: 2px solid #797979; border-radius: 15px; padding-left: 8px; width: calc(100% + 10px); height: 25px;}
                                .subject-coef-input-box         { padding-left: 5px; width: 48px; border-radius: 8px; }

                                .subject-total-coef-div        { display: flex; flex-direction: column; gap: 4px; text-align: left; width: 0; font-size: 13px; text-wrap-mode: nowrap; opacity: 100%; transition: all 0.1s ease; }
                                .subject-total-coef-value      { display: flex; gap: 15px; text-align: left; font-weight: 600; gap: 8px; }
                                .subject-total-coef-debug      { display: flex; gap: 15px; text-align: left; font-weight: 400; }
                                .subject-insert-field                           { display: flex: flex-direction: column; align-items: center; height: 0px; width: 100%; margin: 0px 0px; transition: height 0.2s ease, margin 0.2s ease; }
                                .subject-insert-field.show                      { height: 50px; margin: 10px 0px; }
                                
                                .subject-card-header-right-side    { display: flex; justify-content: flex-end; align-items: center; width: 0; height: 100%; gap: 4px; font-size: 17px; text-wrap-mode: nowrap; }
                                .subj-average           { display: flex; justify-content: flex-end; padding-right: 20px; font-size: 24px; font-weight: 800; text-wrap-mode: nowrap; transition: all 0.2s ease; }
                                .subj-average.good      { color: #10b981; }
                                .subj-average.bad       { color: #ef4444; }
                                .subject-delete-btn     { border-radius: 14px; background: transparent; margin: 0; text-transform: none; -webkit-appearance: button; font: 1em Arial,Helvetica,Verdana,sans-serif; width: auto; padding: 5px; overflow: visible; cursor: pointer; color: #34404F; text-shadow: none; font-weight: normal; border: 3px solid; border-color: white; transition: all 0.2s ease; } 


                                .selected-card-notif-container              { display: grid; justify-items: end; gap: 10px; position: fixed; top: 50px; right: 10px; z-index: 301; transition: width 0.3s ease; }
                                .selected-card-notif-div                    { display: flex; flex-direction: row; align-items: center; justify-content: flex-start; position: relative; left: 500px; height: 60px; width: max-content; background: #9696ff; border-radius: 18px; border: 5px solid #d4daff; font-size: 13px; font-weight: 500; color: black; padding: 10px; gap: 5px; transition: left 0.3s ease, box-shadow 0.3s ease; }
                                .selected-card-notif-div.on                 { left: 0px; box-shadow: 4px 5px 11px 0px #00000061; }
                                .selected-card-notif-div-scroll-btn         { font-size: 20px; line-height: 21px; height: 20px; user-select: none; cursor: alias; transition: color 0.2s ease; }
                                .selected-card-notif-div-scroll-btn:hover   { color: white; }
                                .selected-card-notif-div-del-btn            { color: #640000; font-size: 20px; line-height: 17px; height: 20px; cursor: pointer; user-select: none; transition: color 0.2s ease; }
                                .selected-card-notif-div-del-btn:hover      { color: #ffffff; }
                            `;
                                



                            // MARK: grades table
                            styles += `

                                .grades-table                        { background: linear-gradient(300deg, #c5c5c5 30%, transparent); width: 98%; margin-top: 4px; transition: all 0.2s ease; }
                                .grades-table.good                   { background: linear-gradient(300deg, #f0fdf4 30%, transparent); }
                                .grades-table.meh                    { background: linear-gradient(300deg, #fff2e4 30%, transparent); }
                                .grades-table.bad                    { background: linear-gradient(300deg, #fef2f2 30%, transparent); }

                                .grade-row                           { border-bottom: 1px solid white /* #e4e4e4 */; height: 40px; transition: background 0.3s ease; }
                                .grade-row.last                      { border-bottom: none; }
                                .grade-row.sim                       { background: #e9efff9a; }
                                .grade-row:hover                     { background: #eeedfd; }


                                .grades-table th                     { padding: 10px 12px; height: 39px; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border: 3px solid white; border-right-width: 2px; border-left-width: 2px; border-top-width: 0px; text-align: center; text-wrap-mode: nowrap; }
                                .grades-table td                     { padding: 10px; font-size: 14px; max-height: 45px; min-height: 40px; text-wrap-mode: nowrap; }

                                .grades-table-header-type               { width: 30%; }
                                .grades-table-header-type.dragging      { width: 30%; }
                                .grades-table-type                   { padding-left:30px; transition: all 0.2s ease; }

                                .grades-table-header-grade              { width: 13%; }
                                .grades-table-header-grade.dragging     { width: 15%; }
                                .grades-table-grade                  { text-align: right; transition: all 0.2s ease; }

                                .grades-table-header-coef               { width: 10%; }
                                .grades-table-header-coef.dragging      { width: 15%; }
                                .grades-table-coef                   { text-align: right; transition: all 0.2s ease; }

                                .grades-table-header-classAvg           { width: 10%; }
                                .grades-table-header-classAvg.dragging  { width: 15%; }
                                .grades-table-classAvg               { text-align: right; transition: all 0.2s ease; }

                                .grades-table-header-date               { width: 10%; }
                                .grades-table-header-date.dragging      {  }
                                .grades-table-date                   { text-align: right; transition: all 0.2s ease; }

                                .grades-table-header-teacher            { width: 32%; }
                                .grades-table-header-teacher.dragging   { color: transparent; border-right-width: 0px; }
                                .grades-table-teacher                { text-align: end;   transition: all 0.2s ease; display: table-cell; font-size:12px;color: #999; }

                                .grades-table-header-add-sim-cell       { width: 0%; }
                                .grades-table-add-sim-cell           { transition: all 0.2s ease; }


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
                                .sim-add-btn                { display: flex; align-items: center; justify-content: center; height: 25px; width: 67px; max-width: 140px; margin-bottom: 0; padding: 6px 10px; border: 1px solid; border-radius: 15px; user-select: none; }
                                .simulated-grade-input         { border-radius: 10px; border: 1px outset #667eea; padding: 2px 10px}
                                .simulated-grade-input.sim-inp-type    { width: 55%;  max-width:250px; height:25px }
                                .simulated-grade-input.sim-inp-grade    { width: 100%; max-width:75px;  height:25px }
                                .simulated-grade-input.sim-inp-coef    { width: 100%; max-width:60px;  height:25px }
                                .simulated-grade-input.sim-inp-date    { width: 100%; max-width:140px; height:25px }
                                .simulated-grade-input-edit    { border-radius: 10px; border-color: #667eea; padding: 2px 10px; color: inherit; }
                                .grade-sim-del-btn           { border: none; border-radius: 6px; cursor: pointer; }
                                .grade-checkbox  { cursor: pointer; }
                            `;
                            


                            // MARK: icons
                            styles += `

                                .fold-icon  { cursor: pointer; user-select: none; }

                                .drag-icon                  { display: flex; justify-content: center; align-items: center; border: 2px solid; color: black; border-radius: 8px; line-height: 0px; cursor: pointer; user-select: none; transition: all 0.2s ease; }
                                .drag-icon:hover            { color: #a1a1a1; }
                                .drag-icon.subject              { width: 25px; height: 25px; font-size: 17px; }
                                .drag-icon.module               { width: 30px; height: 30px; font-size: 26px; font-weight: 600; }

                                .tick-icon          { height: 30px; width: 30px; font-size: 35px; line-height: 28px; color: #004cff; cursor:pointer; user-select:none; transition: all 0.2s ease; }
                                .tick-icon.subject  { height: 27px; width: 27px; }
                                .tick-icon.module   {  }
                                .tick-icon:hover    { color: #89adff; }
                            `;
                        

                            // MARK: .................................................................
                        //#endregion
                        




                        
                        // MARK: _________________________________________
                    //#endregion
                        

                        





                    //#region -_____ HIGHEST INSTANCE STYLES _____




                    
                        // MARK: Animations
                        styles += `

                            /* @media (max-width: 768px)   {
                                #dash-header { flex-direction:column; align-items:start; gap:16px; } 
                                .average-display { flex-direction:column; gap:4px; } .average-number { font-size:36px; } 
                            } */

                            .loading            { text-align: center; padding: 40px; color: #999; }
                            @keyframes dots     { 0%,20%{content:'.';} 40%{content:'..';} 60%,100%{content:'...';} }
                            .loading::after     { content: '...'; animation: dots 1.5s steps(4, end) infinite; }

                            @keyframes fadeIn   { from { opacity: 0%; transform: translateY(10px); } to { opacity: 100%; transform: translateY(0); } }
                            .fade-in            { animation: fadeIn 0.3s ease; }

                            @keyframes scrollTo { 15% {transform: scale(100%);} 100% {transform: scale(102%); outline-color: #5f77ff; border-color: #5f77ff} }

                            @keyframes slightHorizShake { 0% {left: 0px} 25% {left: 3px} 50% {left: -3px} 75% {left: 3px} 100% {left: 0px} }
                            .slight-horiz-shake { animation: var(--slight-horiz-shake-duration, 0.3s) slightHorizShake ease; }

                            @keyframes infiniteAlternateScaleUp     { from {transform: scale(100%)} to {transform: scale(var(--infinite-alternate-scale-up-scale, 110%))} }
                            .infinite-alternate-scale-up    { animation: infiniteAlternateScaleUp var(--infinite-alternate-scale-up-duration, 1s) alternate infinite ease-in-out; }

                            @keyframes hoveringElem  { from { transform: translateY(0px); } to { transform: translateY(var(--hoveringElem-amp, 20px)); } }
                        `;


                        // MARK: Modal
                        styles += `
                        
                            .modal  { --bg-end-color: white; --bg-start-color: #ffffff61; --bg-start-gradient: 20%; --scrollbar-thumb-color: #888; --scrollbar-thumb-color-hover: #555; max-width: min(var(--modal-max-width, 100%), 100%); max-height: min(var(--modal-max-height, 100%), 100%); transform: translateZ(0) scale(110%); border-radius: 20px; border: 0px solid #ffffff; background: radial-gradient(closest-corner, var(--bg-start-color) var(--bg-start-gradient), var(--bg-end-color)); opacity: 0%; transition: all 0.3s ease; }
                            .modal.blur { backdrop-filter: blur(calc(250px / 100)); }
                            .modal.show { border-width: 8px; transform: translateZ(0) scale(100%); opacity: 100%; }

                            .modal-close-btn-container { width: var(--modal-close-btn-container-size); height: var(--modal-close-btn-container-size); font-size: 20px; user-select: none; cursor: pointer; transition: all 0.2s ease; }
                            .modal-close-btn-container:hover { transform: scale(var(--modal-close-btn-container-transform-scale-hover)) }
                            .modal-close-btn           { display: flex; justify-content: center; align-items: center; transition: all 0.2s ease; }
                            .modal-close-btn.hover      { font-size: 30px; }
                            .modal-close-btn-cross          { stroke: var(--cross-color);        stroke-width: var(--cross-thickness);        stroke-linecap: var(--cross-stroke-linecap); d: path(var(--cross-path)); fill: none; }
                            .modal-close-btn-cross.hover    { stroke: var(--cross-color-hover);  stroke-width: var(--cross-thickness-hover);  stroke-linecap: var(--cross-stroke-linecap-hover); d: path(var(--cross-path-hover)); }
                            .modal-close-btn-circle         { stroke: var(--border-color);       stroke-width: var(--border-thickness);       r: calc(var(--border-radius) - var(--border-thickness)); fill: none; }
                            .modal-close-btn-circle.hover   { stroke: var(--border-color-hover); stroke-width: var(--border-thickness-hover); r: calc(var(--border-radius-hover) - var(--border-thickness-hover)); }

                        `;


                        // MARK: Fonts
                        styles += `
                            .jura {
                                font-family: "Jura", sans-serif;
                                font-optical-sizing: auto;
                                font-weight: 500;
                                font-style: normal;
                            }

                        `;


                        // MARK: Scroll bar
                        styles += `
                            /* width */
                            ::-webkit-scrollbar {
                                width: var(--scrollbar-width, 10px);
                            }

                            /* Track */
                            ::-webkit-scrollbar-track {
                                background: var(--scrollbar-track-color, #ddcdff);
                                border-radius: 170px;
                            }

                            /* Handle */
                            ::-webkit-scrollbar-thumb {
                                background: var(--scrollbar-thumb-color, #616bff);
                                border-radius: 100px;
                            }

                            /* Handle on hover */
                            ::-webkit-scrollbar-thumb:hover {
                                background: var(--scrollbar-thumb-color-hover, #9fa6ff);
                            }
                        `;

                    //#endregion



                //#endregion

                
                const styleSheet = document.createElement("style");
                styleSheet.textContent = styles;
                document.head.appendChild(styleSheet);

            }

        //#endregion — Frontend






        //#region — Cache methods







            // MARK: _  cacheModuleConfig()
            cacheModuleConfig() {
                localStorage.setItem(
                    ECAMDashboard.cacheKeys.moduleConfig, 
                    JSON.stringify(this.moduleConfig, (key, value) => { if (key === "__object__") return undefined; else return value; })
                );

                return this;
            }



            // MARK: _  retrieveCachedModuleConfig()
            /**
             * Attempts to find in the cache of the user a moduleConfig v3, and prepares the moduleConfig object.
             * If couldn't find any, tries to get an old moduleConfig from the cache, and translates it before saving it as a moduleConfig v3.
             * @returns `true` if no new module configuration has been recovered from cache, `false` otherwise.
             */
            retrieveCachedModuleConfig() {

                let valid = true;

                try { this.moduleConfig = JSON.parse( localStorage.getItem(ECAMDashboard.cacheKeys.moduleConfig) || "{}" ); }
                catch (e) {
                    this.moduleConfig = {};
                    valid = false;
                }

                if (valid && Object.keys(this.moduleConfig).length > 0) {
                    // Preparing the Semester, Module and Subject objects from the moduleConfig

                    for (const _sem of Object.keys(this.moduleConfig)) {
                        const sem = parseInt(_sem);
                        const semesterObj = this.ensureSemester(sem);
                        this.moduleConfig[sem].__object__ = semesterObj;

                        for (const module of Object.keys(this.moduleConfig[sem].modules)) {
                            const moduleObj = this.ensureModule(module, semesterObj);
                            this.moduleConfig[sem].modules[module].__object__ = moduleObj;

                            for (const subjectEntry of Object.entries(this.moduleConfig[sem].modules[module].subjects)) {
                                const subjectObj = this.ensureSubject(subjectEntry[0], moduleObj, semesterObj, subjectEntry[1].coefficient);
                                this.moduleConfig[sem].modules[module].subjects[subjectEntry[0]].__object__ = subjectObj;
                            }
                        }
                    }

                }
                else {
                    // Couldn't find a moduleConfig v3, trying now to get an old moduleConfig
                    const oldModuleConfigStringified = localStorage.getItem("ECAM_DASHBOARD_MODULE_CONFIG");

                    if (oldModuleConfigStringified) {
                        // If old moduleConfig found, translate it to v3 and prepare the Semester, Module and Subject objects from it
                        const oldModuleConfig = JSON.parse(oldModuleConfigStringified);

                        for (const _sem of Object.keys(oldModuleConfig)) {
                            const sem = parseInt(_sem);
                            const semesterObj = this.ensureSemester(sem);

                            this.moduleConfig[sem] = {
                                "__object__": semesterObj, 
                                "__modules__": [],
                                "modules": {}
                            };

                            for (const moduleEntry of Object.entries(oldModuleConfig[sem])) {

                                if (moduleEntry[0] == "__modules__") this.moduleConfig[sem].__modules__ = moduleEntry[1];
                                else {
                                    const moduleObj = this.ensureModule(moduleEntry[0], semesterObj);

                                    this.moduleConfig[sem].modules[moduleEntry[0]] = {
                                        "__object__": moduleObj,
                                        "__subjects__": [],
                                        "subjects": {}
                                    };

                                    for (const subjectEntry of Object.entries(moduleEntry[1])) {

                                        if (subjectEntry[0] == "subjects") this.moduleConfig[sem].modules[moduleEntry[0]].__subjects__ = subjectEntry[1];
                                        else if (subjectEntry[0] == "coefficients") {
                                            for (const entry of Object.entries(subjectEntry[1])) {
                                                const subjectObj = this.ensureSubject(entry[0], moduleObj, semesterObj, entry[1]);

                                                this.moduleConfig[sem].modules[moduleEntry[0]].subjects[entry[0]] = {
                                                    "__object__": subjectObj,
                                                    "coefficient": entry[1]
                                                };
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.cacheModuleConfig();
                    // TODO: localStorage.removeItem("ECAM_DASHBOARD_MODULE_CONFIG");
                }

                return this;
            }






            // MARK: _  cacheSimGrades()
            // TODO
            cacheSimGrades() {
                // JSON.stringify(this.sim, (_key, value) => { return value.toString() });

                localStorage.setItem(
                    ECAMDashboard.cacheKeys.simGrades, 
                    Array(this.sim).join(" "+Grade.gradesSeparator+" ")
                );
                return this;
            }



            // MARK: _  retrieveCachedSimGrades()
            retrieveCachedSimGrades() {
                /** @type { Grade[] } */
                let newSim = [];

                try { 
                    // newSim = JSON.parse(
                    //     localStorage.getItem(ECAMDashboard.cacheKeys.cachedSimGrades), (_key, value) => { return Grade.fromString(value, this) } 
                    // ) || []; 

                    (localStorage.getItem(ECAMDashboard.cacheKeys.simGrades) || "" ).split(Grade.gradesSeparator).forEach(g => {
                        const parsedGrade = this.gradeFromString(g);
                        if (parsedGrade) newSim.push(parsedGrade);
                    })
                }
                catch (e) {}


                if (newSim.length == 0) {
                    /**
                     * @type {{
                     *      [semesterNumber: number]: {
                     *          [moduleName: string]: {
                     *              [subjectName: string]: [{
                     *                  "grade": number, 
                     *                  "coef": number, 
                     *                  "classAvg": number | " — ", 
                     *                  "semester": number, 
                     *                  "subject": string, 
                     *                  "type": string, 
                     *                  "__sim": boolean, 
                     *                  "libelle": string, 
                     *                  "prof": string,
                     *                  "date": string,
                     *                  "id": number
                     *              }]
                     *          }
                     *      }
                     * }}
                     */
                    const oldSim = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES") || "{}" ) || {};

                    for (const sem of Object.values(oldSim)) {
                        for (const mod of Object.entries(sem)) {
                            for (const subj of Object.values(mod[1])) {
                                for (const grade of Object.values(subj)) {
                                    const g = grade;
                                    const simGrade = this.addGrade(
                                        g.grade,
                                        g.coef,
                                        g.subject,
                                        mod[0],
                                        g.semester,
                                        g.type,
                                        g.__sim,
                                        g.classAvg === " — " ? undefined : g.classAvg,
                                        g.prof,
                                        g.date,
                                        g.id
                                    );

                                    if (simGrade) this.sim.push(simGrade);
                                }
                            }
                        }
                    }

                    this.cacheSimGrades()
                    // TODO: localStorage.removeItem("ECAM_DASHBOARD_SIM_GRADES");
                }
                else this.sim = newSim;


                return this;
            }



        //#endregion — Cache methods






        //#region — Backend manipulation







            // MARK: _  computeAllStats()
            /**
             * Compute the stats of every {@link Semester}, {@link Module} and {@link Subject}.
             *
             * @returns ***this*** {@link ECAMDashboard}.
             */
            computeAllStats() {
                this.semesters.forEach(sem => { if (sem) sem.computeStats(true, true) })

                // this.average = Semester.average(...this.semesters)
                // this.classAvg = Semester.classAverage(...this.semesters)
                this.average = Grade.average(...this.grades)
                this.classAvg = Grade.classAverage(...this.grades)

                return this;
            }





            //MARK:     — Grades
            //#region 






                // MARK: _  addGrade()
                /**
                 * 
                 * @param {number}              grade 
                 * @param {number}              coef 
                 * @param {Subject|string}      subject 
                 * @param {Module|string}       module 
                 * @param {Semester|number}     semester 
                 * @param {string|undefined}    [title=" — "] 
                 * @param {boolean|undefined}   [isSim=false] 
                 * @param {number|undefined}    [classAvg=undefined] 
                 * @param {string|undefined}    [prof=" — "] 
                 * @param {string|undefined}    [date=" — "] 
                 * @param {number|undefined}    [id=undefined] 
                 * @param {boolean}             [enabled=true] 
                 */
                addGrade(grade, coef, subject, module, semester, title=" — ", isSim=false, classAvg=undefined, prof=" — ", date=" — ", id=undefined, enabled=true) {
                    const sem  = this.ensureSemester(semester);
                    const mod  = this.ensureModule(module, semester);
                    const subj = this.ensureSubject(subject, module, semester);


                    if (!this.hasGrade(
                        grade,
                        subj,
                        mod,
                        sem,
                        coef,
                        title,
                        isSim,
                        classAvg,
                        prof,
                        date,
                        id
                    )) {
                        const newGrade = new Grade(
                            grade,
                            coef,
                            subj,
                            title,
                            isSim,
                            classAvg,
                            prof,
                            date,
                            id,
                            enabled
                        );
                        
                        this.grades.push(newGrade);
                        if (isSim)      this.sim.push(newGrade);
                        if (!enabled)   this.disabledGrades.push(newGrade);

                        return newGrade;
                    }

                    throw new Error(
                        "The "+Grade.name+" could not be created, as another exists under the same informations:"
                        +"\n- title: "+title
                        +"\n- grade: "+grade
                        +"\n- coef: "+coef
                        +"\n- date: "+date
                        +"\n- sem\\mod\\subj: "+subj.toString()
                        +"\n- isSim: "+isSim
                        +"\n- classAvg: "+classAvg
                        +"\n- prof: "+prof
                        +"\n- id: "+id
                    )

                }




                // MARK: _  getGrade()
                /**
                 *
                 * @param {Grade|number|string}                 grade
                 * @param {Subject|string}                      subj
                 * @param {Module|string|undefined}             module
                 * @param {Semester|number|string|undefined}    semester
                 * @param {number|string|undefined}             coef
                 * @param {string|undefined}                    title
                 * @param {boolean|undefined}                   isSim
                 * @param {number|string|undefined}             classAvg
                 * @param {string|undefined}                    prof
                 * @param {string|undefined}                    date
                 * @param {number|string|undefined}             id
                 * 
                 * @returns {Grade}
                 * @throws {Error} If the grade is not known to ***this*** {@link ECAMDashboard}.
                 */
                getGrade(grade, subj, module=undefined, semester=undefined, coef=undefined, title=undefined, isSim=undefined, classAvg=undefined, prof=undefined, date=undefined, id=undefined) {
                    const subject = this.getSubject(subj instanceof Subject ? subj.name : subj);

                    for (const g of this.grades) {
                        if (
                            grade instanceof Grade
                            ? g.equals(grade)
                            : (
                                g.grade === (typeof grade === "string" ? parseFloat(grade) : grade)
                                &&
                                g.subject.equals(subject)
                                &&
                                g.module.name === (module instanceof Module ? module.name : module)
                                &&
                                g.semester.number === (semester instanceof Semester ? semester.number : (typeof semester === "string" ? parseInt(semester) : semester))
                                &&
                                (coef && g.coef === (typeof coef === "string" ? parseFloat(coef) : coef))
                                &&
                                (title && g.title === title)
                                &&
                                (isSim && g.isSim === isSim)
                                &&
                                (classAvg && g.classAvg === (typeof classAvg === "string" ? parseFloat(classAvg) : classAvg))
                                &&
                                (prof && g.prof === prof)
                                &&
                                (date && g.date === date)
                                &&
                                (id && g.id === (typeof id === "string" ? parseInt(id) : id))
                            )
                        ) return g
                    }

                    throw new Error(
                        "The Grade with the following informations is not known to this "+ECAMDashboard.name+":"
                        +"\n- title: "+title
                        +"\n- grade: "+grade
                        +"\n- coef: "+coef
                        +"\n- date: "+date
                        +"\n- sem\\mod\\subj: "+subj
                        +"\n- isSim: "+isSim
                        +"\n- classAvg: "+classAvg
                        +"\n- prof: "+prof
                        +"\n- id: "+id
                    );
                }


                // MARK: _  getDisabledGrade()
                /**
                 *
                 * @param {Grade|number|string}                 grade
                 * @param {Subject|string}                      subj
                 * @param {Module|string|undefined}             module
                 * @param {Semester|number|string|undefined}    semester
                 * @param {number|string|undefined}             coef
                 * @param {string|undefined}                    title
                 * @param {boolean|undefined}                   isSim
                 * @param {number|string|undefined}             classAvg
                 * @param {string|undefined}                    prof
                 * @param {string|undefined}                    date
                 * @param {number|string|undefined}             id
                 * 
                 * @returns {Grade}
                 * @throws {Error} If the grade is not known to ***this*** {@link ECAMDashboard}.
                 */
                getDisabledGrade(grade, subj, module=undefined, semester=undefined, coef=undefined, title=undefined, isSim=undefined, classAvg=undefined, prof=undefined, date=undefined, id=undefined) {
                    const subject = this.getSubject(subj instanceof Subject ? subj.name : subj);

                    for (const g of this.disabledGrades) {
                        if (
                            grade instanceof Grade
                            ? g.equals(grade)
                            : (
                                g.grade === (typeof grade === "string" ? parseFloat(grade) : grade)
                                &&
                                g.coef === (typeof coef === "string" ? parseFloat(coef) : coef)
                                &&
                                g.subject.equals(subject)
                                &&
                                g.module.name === (module instanceof Module ? module.name : module)
                                &&
                                g.semester.number === (semester instanceof Semester ? semester.number : (typeof semester === "string" ? parseInt(semester) : semester))
                                &&
                                g.title === title
                                &&
                                g.isSim === isSim
                                &&
                                g.classAvg === (typeof classAvg === "string" ? parseFloat(classAvg) : classAvg)
                                &&
                                g.prof === prof
                                &&
                                g.date === date
                                &&
                                g.id === (typeof id === "string" ? parseInt(id) : id)
                            )
                        ) return g
                    }

                    throw new Error(
                        "The Grade with the following informations is not amongst the disabled Grades known to this "+ECAMDashboard.name+":"
                        +"\n- title: "+title
                        +"\n- grade: "+grade
                        +"\n- coef: "+coef
                        +"\n- date: "+date
                        +"\n- sem\\mod\\subj: "+subj
                        +"\n- isSim: "+isSim
                        +"\n- classAvg: "+classAvg
                        +"\n- prof: "+prof
                        +"\n- id: "+id
                    );
                }




                // MARK: _  hasGrade()
                /**
                 *
                 * @param {Grade|number|string} grade
                 * @param {Subject|string} subj
                 * @param {Module|string|undefined} mod
                 * @param {Semester|number|string|undefined} sem
                 * @param {number|string|undefined} coef
                 * @param {string|undefined} title
                 * @param {boolean|undefined} isSim
                 * @param {number|string|undefined} classAvg
                 * @param {string|undefined} prof
                 * @param {string|undefined} date
                 * @param {number|string|undefined} id
                 * 
                 * @returns {boolean}
                 */
                hasGrade(grade, subj, mod=undefined, sem=undefined, coef=undefined, title=undefined, isSim=undefined, classAvg=undefined, prof=undefined, date=undefined, id=undefined) {
                    try {
                        this.getGrade(
                            grade, 
                            subj,
                            mod, 
                            sem, 
                            coef, 
                            title, 
                            isSim, 
                            classAvg, 
                            prof, 
                            date, 
                            id
                        );
                        return true;
                    }
                    catch(e) { return false; }
                }


                // MARK: _  hasDisabledGrade()
                /**
                 *
                 * @param {Grade|number|string} grade
                 * @param {Subject|string} subj
                 * @param {Module|string|undefined} mod
                 * @param {Semester|number|string|undefined} sem
                 * @param {number|string|undefined} coef
                 * @param {string|undefined} title
                 * @param {boolean|undefined} isSim
                 * @param {number|string|undefined} classAvg
                 * @param {string|undefined} prof
                 * @param {string|undefined} date
                 * @param {number|string|undefined} id
                 * 
                 * @returns {boolean}
                 */
                hasDisabledGrade(grade, subj, mod=undefined, sem=undefined, coef=undefined, title=undefined, isSim=undefined, classAvg=undefined, prof=undefined, date=undefined, id=undefined) {
                    try {
                        this.getDisabledGrade(
                            grade, 
                            subj,
                            mod, 
                            sem, 
                            coef, 
                            title, 
                            isSim, 
                            classAvg, 
                            prof, 
                            date, 
                            id
                        );
                        return true;
                    }
                    catch(e) { return false; }
                }



                // MARK: _  enableGrades()
                /**
                 * Enables the given {@link Grade}.s.
                 * @param  {...Grade} grades The {@link Grade}.s to enable.
                 */
                enableGrades(...grades) {
                    for (const grade of grades) {
                        grade.enabled = true;
                        const index = this.disabledGrades.indexOf(grade);
                        this.disabledGrades.splice(index, 1)
                    }

                    return this;
                }


                // MARK: _  disableGrades()
                /**
                 * Disables the given {@link Grade}.s.
                 * @param  {...Grade} grades The {@link Grade}.s to disable.
                 */
                disableGrades(...grades) {
                    for (const grade of grades) {
                        grade.enabled = false;
                        this.disabledGrades.push(grade);
                    }

                    return this;
                }


                // MARK: _  toggleGrades()
                /**
                 * Enables every given disabled {@link Grade} and disables every given enabled {@link Grade}.
                 * @param  {...Grade} grades The {@link Grade}.s to switch from enabled to disabled or vice-versa.
                 */
                toggleGrades(...grades) {
                    for (const grade of grades) {
                        if (grade.enabled) {
                            this.disableGrades(grade);
                        }
                        else {
                            this.enableGrades(grade);
                        }
                    }
                }

            //#endregion 





            // MARK:     — Subjects
            //#region 






                // MARK: _  addSubject()
                /**
                 * 
                 * @param {Subject|string}      subject 
                 * @param {Module|string}       module 
                 * @param {Semester|number}     semester
                 * @param {number|undefined}    [coefficient=undefined]
                 * @returns 
                 */
                addSubject(subject, module, semester, coefficient=undefined) {
                    const sem  = this.ensureSemester(semester);
                    const mod  = this.ensureModule(module, semester);

                    if (!this.hasSubject(subject, mod, sem)) {
                        const newSubj = new Subject(subject instanceof Subject ? subject.name : subject, mod, coefficient);
                        this.subjects.push(newSubj);
                        return newSubj;
                    }

                    throw new Error(
                        "The "+Subject.name+" could not be created, as another exists under the same name: "
                        +"\n- semester: "+(semester instanceof Semester ? semester.number : semester)
                        +"\n- module: "+(module instanceof Module ? module.name : module)
                        +"\n- name: "+(subject instanceof Subject ? subject.name : subject)
                        +"\n- coef: "+coefficient
                    )
                }



                // MARK: _  getSubject()
                /**
                 *
                 * @param {Subject|string} subject The name of the {@link Subject} to find.
                 * @param {Module | string | undefined} [module=undefined] Name of the module of the subject to search.
                 * @param {Semester | number | undefined} [semester=undefined] Number of the seemester of the subject to search.
                 * @returns {Subject}
                 * @throws {Error} If the subject is not known to ***this*** {@link ECAMDashboard}.
                 */
                getSubject(subject, module=undefined, semester=undefined) {
                    if (module instanceof Module)       return module.getSubject(subject);
                    if (module !== undefined)           return this.getModule(module, semester).getSubject(subject);
                    if (semester instanceof Semester)   return semester.getSubject(subject);
                    if (semester !== undefined)         return this.getSemester(semester).getSubject(subject);

                    for (const subj of this.subjects) {
                        if (subject instanceof Subject ? subj.equals(subject) : subj.name == subject) {
                            return subj;
                        }
                    }

                    throw new Error("Subject of name \""+subject+"\" is not known to this "+ECAMDashboard.name+".");
                }


                
                // MARK: _  hasSubject()
                /**
                 *
                 * @param {Subject|string} subject The {@link Subject} containing the same informations as the {@link Subject} to find, or its name. If giving its name, you may give next the name of its module and the number of its semester for more precisions.
                 * @param {Module | string | undefined} [module=undefined] Name of the module of the subject to search.
                 * @param {Semester | number | undefined} [semester=undefined] Number of the seemester of the subject to search.
                 * @returns {boolean}
                 */
                hasSubject(subject, module=undefined, semester=undefined) {

                    try {
                        this.getSubject(subject, module, semester);
                        return true;
                    }
                    catch(e) {
                        return false;
                    }
                }



                // MARK: _  ensureSubject()
                /**
                 * Tries to get the {@link Subject} corresponding to the given {@link Subject} (or its name),
                 * and if it does not exits, create it and return it.
                 * 
                 * @param {Subject|string}            subject                   The {@link Subject} (or its name) to find/create in the data of ***this*** {@link ECAMDashboard}.
                 * @param {Module|string}     module                    The {@link Module} (or its name) to which should belong the {@link Subject} to find/create.
                 * @param {Semester|number}   semester                  The {@link Semester} (or its number) to which should belong the {@link Subject} to find/create.
                 * @param {number|undefined}  [coefficient=undefined]   The coefficient of the {@link Subject} to find/create. If the {@link Subject} did exist but the given coefficient does not match the current {@link Subject}'s coefficient, modify the {@link Subject}'s coefficient to make them match.
                 * 
                 * @returns {Subject} The {@link Subject} in the data of ***this*** {@link ECAMDashboard}, whether it was found or created.
                 */
                ensureSubject(subject, module, semester, coefficient=undefined) {
                    try {
                        const subj = this.getSubject(subject, module, semester);
                        if (coefficient) if (subj.coef != coefficient) subj.coef = coefficient;
                        return subj;
                    }
                    catch (e) {
                        const subj = this.addSubject(subject, module, semester, coefficient)
                        return subj;
                    }
                }

            //#endregion 





            // MARK:     — Modules
            //#region 






                // MARK: _  addModule()
                /**
                 * 
                 * @param {Module|string} module 
                 * @param {Semester|number} semester 
                 * @returns The {@link Module} created.
                 */
                addModule(module, semester) {
                    const sem = this.ensureSemester(semester);

                    if (!this.hasModule(module, sem)) {
                        const newMod = new Module(module instanceof Module ? module.name : module, sem);
                        this.modules.push(newMod);
                        return newMod;
                    }

                    throw new Error("The "+Module.name+" could not be created, as another exists under the same name.")
                }



                // MARK: _  getModule()
                /**
                 *
                 * @param {Module|string} module
                 * @param {Semester | number | undefined} semester
                 * @returns {Module}
                 * @throws {Error} If the module is not known to ***this*** {@link ECAMDashboard}.
                 */
                getModule(module, semester=undefined) {
                    if (semester instanceof Semester)   return semester.getModule(module);
                    if (semester !== undefined)         return this.getSemester(semester).getModule(module);

                    for (const mod of this.modules) {
                        if (module instanceof Module ? mod.equals(module) : mod.name == module) {
                            return mod;
                        }
                    }

                    throw new Error("Module of name \""+module+"\" is not known to this "+ECAMDashboard.name+".");
                }



                // MARK: _  hasModule()
                /**
                 *
                 * @param {Module|string} module
                 * @param {Semester|number|undefined} semester
                 * @returns {boolean}
                 */
                hasModule(module, semester=undefined) {
                    try {
                        this.getModule(module, semester);
                        return true;
                    }
                    catch (e) { return false; }
                }



                // MARK: _  ensureModule()
                /**
                 * Tries to get the {@link Module} corresponding to the given {@link Module} (or its name),
                 * and if it does not exits, create it and return it.
                 * 
                 * @param {Module|string}              module      The {@link Module} (or its name) to find/create in the data of ***this*** {@link ECAMDashboard}.
                 * @param {Semester|number}     semester    The {@link Semester} (or its number) to which should belong the {@link Module} to find/create.
                 * @returns {Module} The {@link Module} in the data of ***this*** {@link ECAMDashboard}, whether it was found or created.
                 */
                ensureModule(module, semester) {
                    try {
                        const mod = this.getModule(module, semester);
                        return mod;
                    }
                    catch (e) {
                        const mod = this.addModule(module, semester);
                        return mod;
                    }
                }

            //#endregion 





            // MARK:     — Semesters
            //#region 






                // MARK: _  addSemester()
                /**
                 * 
                 * @param {Semester|number} semester 
                 * @returns 
                 */
                addSemester(semester) {
                    if (!this.hasSemester(semester)) {
                        const newSem = new Semester(semester instanceof Semester ? semester.number : semester);
                        this.semesters[newSem.number] = newSem;
                        return newSem;
                    }

                    throw new Error("The "+Semester.name+" could not be created, as another exists under the same number.");
                }



                // MARK: _  getSemester()
                /**
                 *
                 * @param {Semester|number} semester
                 * @returns {Semester}
                 * @throws {Error} If the semester is not known to ***this*** {@link ECAMDashboard}.
                 */
                getSemester(semester) {
                    for (const sem of this.semesters) {
                        if (sem) if (semester instanceof Semester ? sem.equals(semester) : sem.number == semester) {
                            return sem;
                        }
                    }

                    throw new Error(
                        "Semester n°"+semester+" is not known to this "+ECAMDashboard.name+"."
                    );
                }



                // MARK: _  hasSemester()
                /**
                 * 
                 * @param {Semester|number} semester 
                 * @returns {boolean}
                 */
                hasSemester(semester) {
                    try {
                        this.getSemester(semester);
                        return true;
                    }
                    catch(e) { return false; }
                }



                // MARK: _  ensureSemester()
                /**
                 * Tries to get the {@link Semester} corresponding to the given {@link Semester} (or its number),
                 * and if it does not exits, create it and return it.
                 * 
                 * @param {Semester|number} semester The {@link Semester} (or its number) to find/create in the data of ***this*** {@link ECAMDashboard}.
                 * @returns {Semester} The {@link Semester} in the data of ***this*** {@link ECAMDashboard}, whether it was found or created.
                 */
                ensureSemester(semester) {
                    try {
                        const sem = this.getSemester(semester)
                        return sem
                    }
                    catch (e) {
                        const sem = this.addSemester(semester)
                        return sem
                    }
                }

            //#endregion 


        //#endregion — Backend manipulation


    //#endregion — methods —

}
/** @type {any} */ (globalThis).ECAMDashboard = ECAMDashboard;


// MARK: ——————————————————
;








/** @type {ECAMDashboard} */
globalThis.ecamDash2 = new ECAMDashboard();