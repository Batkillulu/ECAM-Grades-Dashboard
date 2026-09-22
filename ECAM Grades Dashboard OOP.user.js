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





    //#region ———              STRING              ———
    String.prototype.replaceSpacesWithDashes = function () {
        return String(this).replaceAll(/\s/ig, "-")
    };
    //#endregion 


    //#region ———            FUNCTION           ———
    Function.prototype.getArguments = function (args=undefined, allowedTypes=undefined) {
        var argNames = this.toString().match(/\(([^\)]*)\)/)[1].split(/,[\n\r\t\s]*/).map(arg => { return arg.replaceAll(/=.+/g, "") });

        switch (
            (args !== undefined && isArguments(args) ? "args" : "no-args")
            + ", " +
            (allowedTypes !== undefined && ParameterTypeError.verifyAllowedTypes(allowedTypes) ? "allowedTypes" : "no-allowedTypes")
        ) {
            case "args, allowedTypes":
                var out = {};
                argNames.forEach((arg, i) => {
                    out[arg] = {
                        "value": args[i],
                        "allowedTypes": allowedTypes[i]
                    };
                });
            return out;

            case "no-args, allowedTypes":
                var out = {};
                argNames.forEach((arg, i) => {
                    out[arg] = {
                        "allowedTypes": allowedTypes[i]
                    };
                });
            return out;

            case "args, no-allowedTypes":
                var out = {};
                argNames.forEach((arg, i) => {
                    out[arg] = {
                        "value": args[i],
                        "allowedTypes": "any"
                    };
                });
            return out;

            default: return argNames;
        }
    }


    Function.prototype.getArgument = function (index, args=undefined) {
        return isArguments(args) ? Object.entries(this.getArguments(args))[index] : this.getArguments(args)[index];
    }


    Function.prototype.getArgumentFromValue = function (args, value, allowedTypes) {
        Object.entries(this.getArguments(args, allowedTypes)).forEach(arg => {
            if (arg[1].value === arg) return arg;
        })
        throw new Error("Couldn't find the given value \""+value+"\" from this function's given args.");
    }
    //#endregion 



    /**
     * @param {Object[]} a The base Array of Objects of the comparison.
     * @param {Object[]} b The Array of Object to which the base Array of Objects will be compared to.
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


    /**
     * Checks whether the given value is a function that can be used to construct an Object.
     * @param {Function} func The Function to verify.
     * @returns `true` if the given value is a function that can be used to construct an Object, `false` otherwise.
     */
    function isConstructible(func) {
        if (typeof func !== "function") return false;
        try {
            Reflect.construct(String, [], func); // "value" as newTarget, doesn't actually run value's body meaningfully but validates [[Construct]]
            return true;
        } catch {
            return false;
        }
    }


    /**
     * Checks whether the given value is a class.
     * @param {Function} func The Function to verify.
     * @returns `true` if the given value is a class, `false` otherwise.
     */
    function isClass(func) {
        if (typeof func !== "function") return false;
        return /^class[\s{]/.test(Function.prototype.toString.call(func));
    }



    /**
     * Checks whether the given value is an {@link IArguments}.
     * @param {IArguments} args `arguments` object.
     * @returns `true` if args is an {@link IArguments}, `false` otherwise.
     */
    function isArguments(args) {
        return (args?.toString() || "nope") === "[object Arguments]";
    }




//#endregion General functions









//#region — BACKEND —
//MARK: ——————————————————





//#region ========= BACKEND =========




    // MARK: ——————————————————
    ;







    // MARK: ———    ParameterTypeError     ———
    /**
     * A subclass of TypeError offering methods to check on the parameters of a method and verify that they are of the expected type.
     * 
     * <!-- // TODO: ParameterTypeError should be only used in active development and REMOVED from the final version of the code. -->
     */
    class ParameterTypeError extends TypeError {





        //MARK:                — properties —
        //#region


            /**
             * Controls whether the ParameterTypeError should be verified in the code. 
             * Setting it to `false` renders {@link ParameterTypeError.verifyParam()} and {@link ParameterTypeError.verifyParams()} ineffective.
             * @type {boolean} 
             */
            static active = false;


            /** Message of ***this*** {@link ParameterTypeError}. @type {string} */
            #message;


            /** Cause of ***this*** {@link ParameterTypeError}. @type {Error} */
            #cause;


            /** Class to which belongs causing ***this*** {@link ParameterTypeError}. @type {new (...args: any[]) => any} @readonly */
            #classCause;


            /** Name of the method causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            #methodNameCause;


            /** Name of the parameter causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            #paramNameCause;


            /** Value of the parameter causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            #paramValueCause;


            /** Primordial types. @readonly */
            static basicAllowedTypes = [ "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined" ];


            /** Handled custom allowed types. @readonly */
            static customAllowedTypes = [
                "any",
                "class", 
                "constructor",
                "arguments"
            ];


            /** Handled named types. @readonly */
            static handledAllowedTypes = this.basicAllowedTypes.concat(this.customAllowedTypes);



            /** Default allowed types. @readonly */
            static #defaultAllowedTypes = ["string", "class", "constructor", "(string | class | constructor)[]"];


            /** Format of a message for a {@link ParameterTypeError}. @type {string} */
            static #messageFormat = "\n"+
                "    class:  ${className}\n"+
                "    method: ${methodName}\n"+
                "    parameter: \n"+
                "        name:          ${parameterName}\n"+
                "        expected type: ${expectedType}\n"+
                "        actual type:   ${actualType}\n"
            ;

            static #defaultMessageHeader = "Improper ParameterTypeError instantiation: parameter is NOT of an expected type.";


        //#endregion — properties —





        // MARK:               — constructor —
        /**
         * 
         * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
         * @param {any} actualValue 
         * @param {string} parameterName 
         * @param {string | Function} methodName 
         * @param {string | new (...args: any[]) => any} className 
         * @param {string} message 
         * @param {Error} cause 
         */
        constructor(actualValue, allowedTypes, parameterName="(unknown)", methodName="<anonymous>", className="<anonymous>", message=ParameterTypeError.#defaultMessageHeader, cause=undefined) {
            /* ParameterTypeError.verifyParams(
                "<init>",
                ParameterTypeError.name,
                undefined,
                {
                    "allowedTypes": "string", 
                    "actualValue": parameterName, 
                    "parameterName": "parameterName"
                },
                {
                    "allowedTypes": ParameterTypeError.#defaultAllowedTypes, 
                    "actualValue": allowedTypes, 
                    "parameterName": "expectedType"
                },
                {
                    "allowedTypes": ["string", "Function"], 
                    "actualValue": methodName, 
                    "parameterName": "methodName"
                },
                {
                    "allowedTypes": ["string", "class"], 
                    "actualValue": className, 
                    "parameterName": "className"
                },
                {
                    "allowedTypes": "string", 
                    "actualValue": message, 
                    "parameterName": "message"
                },
                {
                    "allowedTypes": ["Error", "undefined"], 
                    "actualValue": cause, 
                    "parameterName": "cause"
                }
            ); */
            ParameterTypeError.verifyParams(arguments, 
                ["any", ParameterTypeError.#defaultAllowedTypes, "string", "string", "string", "string", "Error"], 
                ParameterTypeError, className, message
            );


            const formattedMessage = ParameterTypeError.#messageFormat
                .replace("${className}", className)
                .replace("${methodName}", methodName)
                .replace("${parameterName}", parameterName)
                .replace("${expectedType}", allowedTypes)
                .replace("${actualType}", (typeof actualValue === "object" ? actualValue.__proto__.toString() : typeof actualValue))
            ;

            super(message+formattedMessage, { cause });

            this.#cause = cause;
            this.#classCause = className;
            this.#methodNameCause = methodName;
            this.#paramNameCause = parameterName;
            this.#paramValueCause = actualValue;
        }


        //MARK:             — encapsulation —
        //#region


            /** Message of ***this*** {@link ParameterTypeError}. @type {string} */
            get message() { return this.#message }
            set message(value) {
                ParameterTypeError.verifyParam(value, "string", "value", "message", ParameterTypeError.name)
                this.#message = value;
            }

            /** Cause of ***this*** {@link ParameterTypeError}. @type {Error} */
            get cause() { return this.#cause }
            set cause(value) {
                ParameterTypeError.verifyParam(value, Error, "value", "cause", ParameterTypeError.name)
                this.#cause = value;
            }


            /** Class to which belongs causing ***this*** {@link ParameterTypeError}. @type {new (...args: any[]) => any} @readonly */
            get classCause() { return this.#classCause }


            /** Name of the method causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            get methodNameCause() { return this.#methodNameCause }


            /** Name of the parameter causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            get paramNameCause() { return this.#paramNameCause }


            /** Value of the parameter causing ***this*** {@link ParameterTypeError}. @type {string} @readonly */
            get paramValueCause() { return this.#paramValueCause }



        //#endregion — encapsulation —





        //MARK:                 — methods —
        //#region




            // MARK: _  verifyParams()
            /**
             * 
             * @param {IArguments} args 
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
             * @param {Function} func 
             * @param {string | (new (...args: any[]) => any)} className 
             * @param {string} message 
             */
            static verifyParams(args, allowedTypes=ParameterTypeError.#defaultAllowedTypes, func, className="<unknown>", message=undefined) {
                if (!this.active) return;

                if (!isArguments(args)) { throw new ParameterTypeError(
                    args,
                    "arguments",
                    this.verifyParams.getArgumentFromValue(arguments, args)[0],
                    this.verifyParams.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParams.getArgumentFromValue(arguments, args)[0]+" must be an arguments object."
                )}
                this.verifyAllowedTypes(allowedTypes);
                if (typeof func !== "function") { throw new ParameterTypeError(
                    func,
                    "function",
                    this.verifyParams.getArgumentFromValue(arguments, func)[0],
                    this.verifyParams.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParams.getArgumentFromValue(arguments, func)[0]+" must be a function."
                )}
                if (typeof className !== "string" && !isClass(className)) { throw new ParameterTypeError(
                    className,
                    ["string", "class"],
                    this.verifyParams.getArgumentFromValue(arguments, className)[0],
                    this.verifyParams.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParams.getArgumentFromValue(arguments, className)[0]+" must be a string or a class."
                )}
                if (typeof message !== "string") { throw new ParameterTypeError(
                    message,
                    "string",
                    this.verifyParams.getArgumentFromValue(arguments, message)[0],
                    this.verifyParams.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParams.getArgumentFromValue(arguments, message)[0]+" must be a string."
                )}

                const argsObj = func.getArguments(args, allowedTypes);

                Object.entries(argsObj).forEach(a => {
                    ParameterTypeError.verifyParam(
                        a[1].value, 
                        a[1].type, 
                        a[0],
                        func,
                        className,
                        message
                    )
                })
            }



            // MARK: _  verifyParam()
            /**
             * Verifies that the given {@link actualValue} is at least of one of the given {@link allowedTypes}.
             * 
             * @param {any} actualValue The value of the parameter.
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes Name of the type the parameter is expected to be, or its prototype. May be composed in an array to give multiple allowed types.
             * @param {string} parameterName Name of the method's parameter whose type is to be verified.
             * @param {string | Function} methodName Name of the method whose parameter is to be verified.
             * @param {string | (new (...args: any[]) => any)} className Name of the class to which belongs the currently executed method.
             * @param {string} message Message of the {@link ParameterTypeError} to build and throw.
             */
            static verifyParam(actualValue, allowedTypes=ParameterTypeError.#defaultAllowedTypes, parameterName=undefined, methodName=undefined, className=undefined, message=undefined) {
                if (!this.active) return;

                this.verifyAllowedTypes(allowedTypes);
                if (typeof parameterName !== "string") { throw new ParameterTypeError(
                    parameterName,
                    "string",
                    this.verifyParam.getArgumentFromValue(arguments, parameterName)[0],
                    this.verifyParam.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParam.getArgumentFromValue(arguments, parameterName)[0]+" must be a string."
                )}
                if (typeof methodName !== "string" && typeof methodName !== "function") { throw new ParameterTypeError(
                    methodName,
                    ["string", "function"],
                    this.verifyParam.getArgumentFromValue(arguments, methodName)[0],
                    this.verifyParam.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParam.getArgumentFromValue(arguments, methodName)[0]+" must be a string or a function."
                )}
                if (typeof className !== "string" && !isClass(className)) { throw new ParameterTypeError(
                    className,
                    ["string", "class"],
                    this.verifyParam.getArgumentFromValue(arguments, className)[0],
                    this.verifyParam.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParam.getArgumentFromValue(arguments, className)[0]+" must be a string or a class."
                )}
                if (typeof message !== "string") { throw new ParameterTypeError(
                    message,
                    "string",
                    this.verifyParam.getArgumentFromValue(arguments, message)[0],
                    this.verifyParam.name,
                    ParameterTypeError.name,
                    "The given "+this.verifyParam.getArgumentFromValue(arguments, message)[0]+" must be a string."
                )}

                const actualValuesIter = actualValue instanceof Array ? actualValue : [actualValue];

                const allowedTypesIter = allowedTypes instanceof Array
                    ? allowedTypes.map(type => type?.toString() || "nope")
                    : (typeof allowedTypes === "string" 
                        ? allowedTypes.replaceAll(" ", "").split("|")
                        : [ allowedTypes.name ]
                    )
                ;

                if (actualValue instanceof Array) {
                    for (const actualValueElem of actualValue) {
                        var isValid = false;

                        for (const allowedType of allowedTypesIter) {
                            try {
                                this.#verifyValueAgainstAllowedTypes(value, allowedType);
                                isValid = true;
                                break;
                            }
                            catch (err) {}
                        }

                        if (!isValid) {

                        }
                    }
                }
                else for (const allowedType of allowedTypesIter) {
                    try {
                        this.#verifyValueAgainstAllowedTypes(value, allowedType);
                        return;
                    }
                    catch (err) {}
                }


                throw new ParameterTypeError(
                    actualValue,
                    allowedTypes,
                    parameterName,
                    methodName ? (typeof methodName === "function" ? methodName.name : methodName) : "<init>",
                    className ? (typeof className === "function" ? className.name : className) : ParameterTypeError.name,
                    message || ParameterTypeError.#defaultMessageHeader
                )

            }


            // MARK: _  #verifyArray()
            /**
             * Verifies that all the elements of the given array of values are of one of the types in the given allowedTypes.
             * 
             * @param {Array} values 
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
             */
            static #verifyArray(values, allowedTypes=ParameterTypeError.#defaultAllowedTypes) {
                ParameterTypeError.verifyParam(
                    values, 
                    "Array", 
                    this.#verifyArray.getArgumentFromValue(arguments, values)[0], 
                    this.#verifyArray.name, 
                    ParameterTypeError.name, 
                    "The given "+this.#verifyArray.getArgumentFromValue(arguments, values)[0]+" is NOT an Array."
                );
                ParameterTypeError.verifyAllowedTypes(allowedTypes);

                var isValid = false;
                for (const value of values) {
                    try {
                        this.#verifyValueAgainstAllowedTypes(value, allowedTypes)
                        isValid = true;
                        break;
                    }
                    catch (err) {}
                }

                if (!isValid) throw new ParameterTypeError(
                    values,
                    allowedTypes,
                    ParameterTypeError.#verifyArray.getArgumentFromValue(arguments, values)[0],
                    this.#verifyArray.name,
                    ParameterTypeError.name,
                    "The given "+this.#verifyArray.getArgumentFromValue(arguments, values)[0]
                    +" does NOT have all its elements respecting the given allowedTypes."
                )
            }




            // MARK: _  #verifyValueAgainstAllowedTypes()
            /**
             * Verifies that the given value is of one of the types in the given allowedTypes.
             * 
             * @param {any} value 
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
             */
            static #verifyValueAgainstAllowedTypes(value, allowedTypes=ParameterTypeError.#defaultAllowedTypes) {
                this.verifyAllowedTypes(allowedTypes);

                var isValid = false;
                var allowedTypesIter = allowedTypes instanceof Array
                    ? allowedTypes.map(type => typeof type === "string" ? type : (type instanceof Array ? type : type.toString()))
                    : (typeof allowedTypes === "string" 
                        ? allowedTypes.replaceAll(" ", "").split("|")
                        : [ allowedTypes.name ]
                    )
                ;

                for (const allowedType of allowedTypesIter) {
                    if (!isValid) {
                        const match = allowedType.match(/\(([^\)]*)\)\[\]/);
                        if (match || allowedType instanceof Array) {
                            this.#verifyArray(value, allowedType);
                        }
                        else if (!ParameterTypeError.handledAllowedTypes.includes(allowedType)) {
                            if (!globalThis[allowedType]) {
                                throw new ParameterTypeError(
                                    allowedType,
                                    this.#defaultAllowedTypes,
                                    ParameterTypeError.#verifyValueAgainstAllowedTypes.getArgumentFromValue(arguments, allowedType)[0],
                                    ParameterTypeError.#verifyValueAgainstAllowedTypes.name,
                                    ParameterTypeError.name,
                                    "\""+allowedType+"\" is not a class known to globalThis."
                                )
                            }
    
                            if (value instanceof globalThis[allowedType]) isValid = true;
                        }
                        else if (allowedType === "constructor") { if (isConstructible(value)) isValid = true; }
                        else if (allowedType === "class")       { if (isClass(value)) isValid = true; }
                        else if (allowedType === "arguments")   { if (isArguments(value)) isValid = true; }
                        else if (allowedType === "any")         { isValid = true; }
                        else if (typeof value === allowedType)  { isValid = true; }
                    }
                }


                if (!isValid) {
                    throw new ParameterTypeError(
                        value,
                        allowedTypes,
                        ParameterTypeError.#verifyValueAgainstAllowedTypes.getArgumentFromValue(arguments, value)[0],
                        ParameterTypeError.#verifyValueAgainstAllowedTypes.name,
                        ParameterTypeError.name,
                        "The given "+ParameterTypeError.#verifyValueAgainstAllowedTypes.getArgumentFromValue(arguments, value)[0]+" is of an unexpected type."
                    )
                }
            }


            // MARK: _  prepareAllowedTypes()
            /**
             * 
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
             */
            static prepareAllowedTypes(allowedTypes) {
                this.verifyAllowedTypes(allowedTypes);
            }



            // MARK: _  verifyAllowedTypes()
            /**
             * Verifies that the given allowedTypes is properly defined.
             * 
             * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]} allowedTypes 
             */
            static verifyAllowedTypes(allowedTypes) {
                if (allowedTypes instanceof Array) { allowedTypes.forEach(allowedType => { this.verifyAllowedTypes(allowedType) }) }
                else if ( typeof allowedTypes !== "string" && (globalThis[allowedTypes] ? !isConstructible(allowedTypes) : false) ) throw new ParameterTypeError(
                    allowedTypes,
                    this.#defaultAllowedTypes,
                    this.verifyAllowedTypes.getArgumentFromValue(arguments, allowedTypes)[0],
                    this.verifyAllowedTypes.name,
                    ParameterTypeError.name,
                    "Improper ParameterTypeError use: given "+this.verifyAllowedTypes.getArgumentFromValue(arguments, allowedTypes)[0]
                    +" is NOT a string, a class, a constructible nor an Array of any of the previous three (possibly recursively)."
                );
            }



        //#endregion .                 — methods —


    }








    //-MARK: 
    ;











    // MARK: ———              GRADE               ———
    class Grade {





        //#region .                — properties —


            /** Value of ***this*** {@link Grade}, a positive float number below 20. @type {number} */
            #grade;

            /** The {@link Subject} (or its name) of ***this*** {@link Grade}. @type {Subject} @readonly */
            #subject;

            /** The {@link Module} (or its name) of ***this*** {@link Grade}. Has a getter and a setter. @type {Module}  */
            #module;

            /** The {@link Semester} (or its number) of ***this*** {@link Grade}. @type {Semester} @readonly */
            #semester;

            /** Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, in %. @type {number} */
            #coef;

            /** Title of ***this*** {@link Grade} (default when no title was given: " — "). @type {string} */
            #title;

            /** `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. @type {boolean} @readonly */
            #isSim;

            /** A 17-digits *wannabe unique* id number for a simulated grade, built from the time stamp of its creation. @type {number} @readonly */
            #id;

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
         * @param {Subject|string}  subject                 The {@link Subject} (or its name if you give the {@link ECAMDashboard}) ***this*** {@link Grade} will belong to.
         * @param {string}          [title=" — "]           Title of ***this*** {@link Grade}. Default value is " — ".
         * @param {boolean}         [isSim=false]           `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
         * @param {number|" — "}    [classAvg=" — "]        Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. Default value is " — ".
         * @param {string}          [prof=" — "]            Name of the teacher.s who published ***this*** {@link Grade}. Default value is " — ".
         * @param {string}          [date=" — "]            Date of publication of ***this*** {@link Grade} entered by the administration. Default value is " — ". ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
         * @param {Semester|number} [semester=undefined]    The {@link Semester} (or its number if you give the {@link ECAMDashboard}) ***this*** {@link Grade} will belong to. Default is undefined.
         * @param {Module|string}   [module=undefined]      The {@link Module} (or its name if you give the {@link ECAMDashboard}) ***this*** {@link Grade} will belong to. Default is undefined.
         * @param {ECAMDashboard}   [ecamDash=undefined]    The {@link ECAMDashboard}, in order to access the backend to retrieve existing {@link Subject}s, {@link Module}s and {@link Semester}s.
         * @param {number}          [id=undefined]          A wannabe unique id number for a simulated grade, built from the time stamp of its creation.
         *
         *
         * @throws {ParameterTypeError} If a parameter is of an unexpected type.
         */
        constructor(grade, coef, subject, title=" — ", isSim=false, classAvg=" — ", prof=" — ", date=" — ", semester="?", module=undefined, ecamDash=undefined, id=undefined) {

            // Parameters verification
            //#region
            if (isNaN(grade))                   { throw new ParameterTypeError("Improper Grade construction.") }
            if (!(typeof subject == "string" || subject instanceof Subject))  {
                throw new TypeError("Improper Grade construction: wrong '" + "subject" + "' parameter type, was expecting a Subject or a string.")
            }
            if (isNaN(coef))                    { throw new TypeError("Improper Grade construction: wrong '" + "coef"    + "' parameter type, was expecting a number.") }
            if (typeof title != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "title"   + "' parameter type, was expecting a string.") }
            if (typeof isSim != "boolean")      { throw new TypeError("Improper Grade construction: wrong '" + "isSim"   + "' parameter type, was expecting a boolean.")}
            if (typeof prof  != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "prof"    + "' parameter type, was expecting a string.") }
            if (typeof date  != "string")       { throw new TypeError("Improper Grade construction: wrong '" + "date"    + "' parameter type, was expecting a string.") }
            if (!(semester instanceof Semester || !isNaN(semester) || semester == undefined))    {
                throw new TypeError("Improper Grade construction: wrong '" + "semester"+ "' parameter type, was expecting a Semester, a number, or undefined.")
            }
            if (!(module instanceof Module || typeof module == "string" || module == undefined)) {
                throw new TypeError("Improper Grade construction: wrong '" + "module"   + "' parameter type, was expecting a Module, a string, or undefined.")
            }
            if (!(ecamDash instanceof ECAMDashboard || ecamDash == undefined)) {
                throw new TypeError("Improper Grade construction: wrong '" + "ecamDash" + "' parameter type, was expecting an ECAMDashboard or undefined.")
            }
            if (isNaN(id) && id != undefined) {
                throw new TypeError("Improper Grade construction: wrong '" + "id"       + "' parameter type, was expecting a number or undefined.")
            }
            //#endregion


            this.#grade     = grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20;
            this.#coef      = coef <= 100 ? (coef  >= 0 ? Number(coef)  : 0) : 100;

            if (!ecamDash) {
                this.#subject   = subject;
                this.#module    = module ? module : (subject instanceof Subject ? subject.module : "__#unclassified#__");
                this.#semester  = semester ? semester : (subject instanceof Subject ? subject.semester : 0);
            }
            else {
                this.#subject   = ecamDash.getSubject(subject, module, semester);

                if (this.#subject === null) {

                    if ( (this.#semester = ecamDash.getSemester(semester)) === null )       this.#semester = new Semester(semester);

                    if ( (this.#module = ecamDash.getModule(module, semester)) === null )   this.#module = this.#semester.undefinedModule;

                    this.#subject = new Subject(subject?.name || subject, 100, this.#module, this.#semester);

                }
                else {
                    this.#module    = this.#subject.module;
                    this.#semester  = this.#subject.semester;
                }

                this.#subject.addGrade(this);

            }

            this.#title     = title;
            this.#isSim     = isSim;

            if (isSim) {
                if (id) this.#id = id;
                else {
                    const t = new Date();
                    this.#id = ""
                        + t.getFullYear()
                        + String(t.getMonth())          .padStart(2, "0")
                        + String(t.getDate())           .padStart(2, "0")
                        + String(t.getHours())          .padStart(2, "0")
                        + String(t.getMinutes())        .padStart(2, "0")
                        + String(t.getSeconds())        .padStart(2, "0")
                        + String(t.getMilliseconds())   .padStart(3, "0")
                    ;
                }
            }

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

            /** The {@link Subject} (or its name) of ***this*** {@link Grade}. @type {Subject} @readonly */
            get subject()   { return this.#subject  }
            set subject(value)    {
                if (!(value instanceof Subject)) {throw new Error("Invalid Grade.subject setting: tried to set 'module' to a type other than Module")}

                this.#subject = value;
            }

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

            /** A 17-digits *wannabe unique* id number for a simulated grade, built from the time stamp of its creation. @type {string} @readonly */
            get id()        { return this.#id       }

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


            toString() {
                return "" +
                    this.#semester + "//\\" +
                    this.#module + "//\\" +
                    this.#subject + "//\\" +
                    this.#title + " : " +
                    this.#grade + "/20 vs " +
                    this.#classAvg + "/20, " +
                    this.#coef + "% " +
                    ( this.#isSim ? "("+this.#id+") " : "" ) +
                    "["+(this.#enabled ? "ON" : "OFF")+( this.#isSim ? "" : ( this.#markedAsRead ? "" : ", UNREAD") )+"]"
                ;
            }

            /**
             *
             * @param {string} string
             * @param {ECAMDashboard} ecamDash
             */
            static fromString(string, ecamDash=undefined) {
                /**
                 * @type { RegExpMatchArray | null }
                 */
                const match = string.match(/(?:(.+)(?:\/\/\\(.+))(?:\/\/\\(.+))(?:\/\/\\(.+))) : (\d{1,2}(?:\.\d{1,2})?)\/20 vs ((?:\d{1,2}(?:\.\d{1,2})?)| — )\/20, (\d{1,2}(?:\.\d{1,2})?)%(?: \((\d+)\))? \[(ON|OFF)(?:, (UNREAD))?\]/);

                if (match) {
                    const grade = new Grade(
                        match[5],
                        match[7],
                        match[3],
                        match[4],
                        !isNaN(match[8]),
                        match[6],
                        undefined,
                        undefined,
                        match[1],
                        match[2],
                        ecamDash,
                        match[8]
                    );

                    grade.enabled       = match[9]  === "ON";
                    grade.markedAsRead  = match[10] !== "UNREAD";

                    return grade;
                }
            }



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

            /** The {@link Semester} (or its number) of ***this*** {@link Subject}. @type {Semester} @readonly */
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
         * Constructs an object of class {@link Subject}.
         *
         * The array of {@link Grade}s may be empty/undefined, in this case, the next parameters `name` and `module` **must** be provided. This will create a simulated subject.
         *
         *
         * @param {string}      name                    Name to give to ***this*** {@link Subject}.
         * @param {number}      [coef=100]              Coefficient of ***this*** {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
         * @param {Module}      [module=undefined]      The {@link Module} ***this*** {@link Subject} will belong to. Default value is `undefined`. Leave it `undefined` and give a {@link Semester} if you want to add this subject to the undefinedModule of the given {@link Semester}.
         * @param {Semester}    [semester=undefined]    The {@link Semester} ***this*** {@link Subject} will belong to. Default value is `undefined`.
         *
         * @throws {TypeError} If a parameter is of an unexpected type.
         */
        constructor(name, coef=100, module=undefined, semester=undefined) {



            //#region
            if (typeof name !== "string")   { throw new TypeError("Improper Subject construction: wrong 'name' argument type, was expecting a string") }
            if (isNaN(coef))                { throw new TypeError("Improper Subject construction: wrong 'coef' optional argument type, was expecting a number") }
            if (module !== undefined && !(module instanceof Module))    { throw new TypeError("Improper Subject construction: wrong 'module' optional argument type, was expecting a Module") }
            //#endregion

            this.#name      = name;
            this.#coef      = coef <= 100 ? (coef >= 0 ? Number(coef) : 0) : 100;

            this.#module    = module || semester.undefinedModule;
            this.#semester  = semester || module.semester;

            if (module instanceof Module) {
                module.addSubject(this);
            }
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
             * Adds a {@link Grade} to ***this*** {@link Subject}.
             * @param {Grade} grade The {@link Grade} to add to ***this*** {@link Subject}.
             * @returns {Subject} ***this*** {@link Subject}.
             */
            addGrade(grade) {
                if (!(grade instanceof Grade)) { throw new TypeError("Invalid Subject.addGrades() call: wrong 'grade' parameter type, was expecting a number.") }
                this.#grades.push(grade);

                return this;
            }
            /**
             * Adds a **new** {@link Grade} to ***this*** {@link Subject}.
             * @param {number}  grade               Value of ***this*** {@link Grade}, a positive float number below 20.
             * @param {number}  coef                Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
             * @param {string}  [title=" — "]       Title of ***this*** {@link Grade}. Default value is " — ".
             * @param {boolean} [isSim=false]       `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
             * @param {number}  [classAvg=" — "]    Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. Default value is " — ".
             * @param {string}  [prof=" — "]        Name of the teacher.s who published ***this*** {@link Grade}. Default value is " — ".
             * @param {string}  [date=" — "]        Date of publication of ***this*** {@link Grade} entered by the administration. Default value is " — ". ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
             * @returns {Grade} The **new** {@link Grade} added to ***this*** {@link Subject}.
             * @throws {TypeError} If a parameter is of an unexpected type.
             */
            addNewGrade(grade, coef, title, isSim, classAvg, prof, date) {
                const newGrade = new Grade(grade, coef, this, title, isSim, classAvg, prof, date, this.#semester, this.#module);
                this.#grades.push(newGrade);

                return newGrade;
            }

            /**
             * @typedef {Object} NewGradeEntry
             * @property {number}       grade               Value of ***this*** {@link Grade}, a positive float number below 20.
             * @property {number}       coef                Value of the coefficient of ***this*** {@link Grade} in its {@link Subject}, a positive float number below 100, as a %.
             * @property {string}       [title=" — "]       Title of ***this*** {@link Grade}. Default value is " — ".
             * @property {boolean}      [isSim=false]       `true` if ***this*** {@link Grade} is a simulated grade, `false` otherwise. `false` by default.
             * @property {number|" — "} [classAvg=" — "]    Value of the class' average of ***this*** {@link Grade}, a positive float number below 20. Default value is " — ".
             * @property {string}       [prof=" — "]        Name of the teacher.s who published ***this*** {@link Grade}. Default value is " — ".
             * @property {string}       [date=" — "]        Date of publication of ***this*** {@link Grade} entered by the administration. Default value is " — ". ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet*.
             */
            /**
             *
             * @param  {...NewGradeEntry} gradesData
             * @returns {Grade} The **new** {@link Grade} added to ***this*** {@link Subject}.
             * @throws {TypeError} If a parameter is of an unexpected type.
             */
            addNewGrades(...gradesData) {
                let out = [];

                gradesData.forEach(gradeData => {
                    if (typeof gradeData !== "object") {
                        throw new TypeError("Invalid Subject.addNewGrades() call: was expecting Objects like {grade: number, coef: number, ...}.");
                    }

                    const {grade, coef, title=" — ", isSim="false", classAvg=" — ", prof=" — ", date=" — "} = gradeData;

                    const newGrade = new Grade(grade, coef, this, isSim, classAvg, prof, date, this.#semester, this.#module);
                    this.#grades.push(newGrade);
                    out.push(newGrade);
                })

                return out;
            }

            /**
             * The {@link Module} of ***this*** {@link Subject}. @type {Module} */
            get module()    { return this.#module   }
            set module(value)    {
                if (!(value instanceof Module)) {throw new TypeError("Invalid Subject.module setting: tried to set 'module' to a type other than Module.")}
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



            /**
             *
             * @param {Subject} subject
             * @returns
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

            /** The {@link Semester} of ***this*** {@link Module}, or its number. @type {Semester} @readonly */
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
            #subjectsBelow100 = [];

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average *above 100*. @type {Subject[]} @readonly */
            #subjectsAbove100 = [];

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *below 100*. @type {Subject[]} @readonly */
            #subjectsReallyBelow100 = [];

            /** All the {@link Subject}s in ***this*** {@link Module} that have an average of their real grades only *above 100*. @type {Subject[]} @readonly */
            #subjectsReallyAbove100 = [];

            /** All the {@link Subject}s in ***this*** {@link Module} that don't have any grade. @type {Subject[]} @readonly */
            #subjectsNoGrade = [];

            /** All the {@link Subject}s in ***this*** {@link Module} that don't have any enabled grade. @type {Subject[]} @readonly */
            #subjectsNoEnabledGrade = [];



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



            //#region
            if (typeof name != "string")      { throw new TypeError("Improper Module construction: wrong 'name' argument type, was expecting a string.") }
            if (!(semester instanceof Semester) && semester !== undefined)  { throw new TypeError("Improper Module construction: wrong 'semester' optional argument type, was expecting a Semester, a number, or undefined.") }
            if (!(subjects instanceof Array)) { throw new TypeError("Improper Module construction: the 'subjects' optional parameter is not an ARRAY, was expecting an Array of Subjects or of strings.") }

            /** @type {Map<string, Subject>} */
            let subjectsEntries = new Map();
            const semesterObj  = semester  || subjects[0]?.semester;

            subjects.forEach(subject => {
                if (!(subject instanceof Subject || typeof subject == "string")) {
                    throw new TypeError("Improper Module construction: the 'subjects' optional parameter is not an Array of SUBJECTS or STRINGS (and ONLY Subjects OR strings), was expecting an Array of Subjects or of strings.")
                }

                if (subject instanceof Subject) {
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

                if (semester instanceof Semester) semester.addModules(this);
            }
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
             * Adds a **new** {@link Subject} to ***this*** {@link Module}.
             * @param {string}      name                    Name to give to ***this*** {@link Subject}.
             * @param {number}      [coef=100]              Coefficient of ***this*** {@link Subject} in its {@link Module}, a positive float number below 100, as a %. Default value is 100.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            addNewSubject(subject, coef=100) {
                const newSubj = new Subject(subject, coef, this, this.#semester);
                this.#subjects[newSubj.name] = newSubj;

                return this;
            }
            /**
             * Adds new {@link Subject}s to ***this*** {@link Module}, from an object containing the name of the subject and its coef.
             * @param {{name: string, coef?: number}[]} subjectsData
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            addNewSubjects(...subjectsData) {
                let out = {};

                subjectsData.forEach(subjectData => {
                    if (typeof subjectData !== "object" || subjectData === null) {
                        throw new TypeError("Invalid Module.addNewSubjects() call: was expecting Objects like: {subject: string, coef: number | undefined}.")
                    }

                    const {name, coef=100} = subjectData;

                    if (typeof name != "string") {
                        throw new TypeError("Invalid Module.addNewSubjects() call: wrong type for a 'name' property, was expecting a string.")
                    }
                    if (isNaN(coef) && coef != undefined) {
                        throw new TypeError("Invalid Module.addNewSubjects() call: wrong type for a 'coef' property, was expecting a number or undefined.")
                    }

                    const newSubj = new Subject(name, coef, this, this.#semester);

                    out[newSubj.name] = this.#subjects[newSubj.name] = newSubj;
                })

                return out;
            }

            /**
             * Adds a {@link Subject} to ***this*** {@link Module}.
             * @param {Subject} subject The {@link Subject} to add to ***this*** {@link Module}.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            addSubject(subject) {
                if (!(subject instanceof Subject)) {
                    throw new TypeError("Invalid Module.addSubject() call: wrong type for the 'subject' parameter, was expecting a Subject")
                }

                this.#subjects[subject.name] = subject;

                return this;
            }
            /**
             * Adds {@link Subject}s (or their name) to ***this*** {@link Module}.
             * @param {Subject[]} subjects The {@link Subject}s (or their name) to add to ***this*** {@link Module}.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            addSubjects(...subjects) {
                subjects = subjects.flat();

                subjects.forEach(subject => {
                    if (!(subject instanceof Subject)) {
                        throw new TypeError("Invalid Module.addSubjects() call: wrong type for the 'subjects' parameter.s, was expecting Subjects.")
                    }

                    this.#subjects[subject.name] = subject;
                })

                return this;
            }

            /**
             * Removes a {@link Subject} from ***this*** {@link Module}.
             * @param {Subject|string} subject The {@link Subject} (or its name) to remove from ***this*** {@link Module}.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            removeSubject(subject) {
                if (!(subject instanceof Subject || typeof subject == "string")) {
                    throw new TypeError("Invalid Module.removeSubject() call: wrong type for the 'subject' parameter, was expecting a Subject or a string.")
                }
                const name = subject instanceof Subject ? subject.name : subject;
                delete this.#subjects[name];

                return this;
            }
            /**
             * Removes {@link Subject}s from ***this*** {@link Module}.
             * @param {Subject[]|string[]} subjects The {@link Subject}s (or their name) to remove from ***this*** {@link Module}.
             *
             * @returns {Module} ***this*** {@link Module}.
             */
            removeSubjects(...subjects) {
                subjects = subjects.flat();

                subjects.forEach(subject => {
                    if (!(subject instanceof Subject || typeof subject == "string")) {
                        throw new TypeError("Invalid Module.removeSubjects() call: wrong type for the 'subject' parameter, was expecting Subjects or strings")
                    }

                    const name = subject instanceof Subject ? subject.name : subject;

                    delete this.#subjects[name];
                })

                return this;
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



            /**
             *
             * @param {Module} module
             * @returns
             */
            equals(module) {
                if (!(module instanceof Module)) {
                    return false;
                }

                if (true
                    && this.#name == module.#name
                    && this.#semester.equals(module.#semester)
                ) {
                    return true;
                }

                return false;
            }


            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Module}.
             * @param {boolean} [recomputeSubjects=true] `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed, `false` otherwise.
             */
            computeStats(recomputeSubjects=true) {
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
                        if      (subject.totalCoefGrades < 100) subjectsBelow100.push(subject);
                        else if (subject.totalCoefGrades > 100) subjectsAbove100.push(subject);

                        if      (subject.totalCoefRealGrades < 100) subjectsReallyBelow100.push(subject);
                        else if (subject.totalCoefRealGrades > 100) subjectsReallyAbove100.push(subject);
                    }



                    totalCoefGrades             += subject.totalCoefGrades;
                    totalCoefRealGrades         += subject.totalCoefRealGrades;
                    totalCoefEnabledGrades      += subject.totalCoefEnabledGrades;
                    totalCoefEnabledRealGrades  += subject.totalCoefEnabledRealGrades;
                })

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



            //#region
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
            this.addModules(...modules);

            Object.values(this.#modules).forEach(module => {
                this.#subjects = module.subjects;
                this.#grades   = module.grades;
            })

            this.#semesterCard = new SemesterCard(this);
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




            // MARK: _  toString()
            toString() { return this.#number }





            // MARK: _  equals()
            /**
             *
             * @param {Module} semester
             * @returns
             */
            equals(semester) {
                if (!(semester instanceof Semester)) {
                    return false;
                }

                if (true
                    && this.#number == semester.#number
                    && this.#average == semester.#average
                    && this.#classAvg == semester.#classAvg
                ) {
                    return true;
                }

                return false;
            }




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
    ;







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

//#endregion FRONTEND





//MARK: ——————————————————
//#endregion













//MARK: ——————————————————
;




// MARK: ======= ECAMDashboard ======
class ECAMDashboard {





    // MARK:                  — properties —
    //#region

        /** Array of all the {@link Grade}s of the user. @type {Grade[]} */
        grades      = [];

        /** Array of all the {@link Subject}s of the user. @type {Subject[]} */
        subjects    = [];

        /** Array of all the {@link Module}s of the user. @type {Module[]} */
        modules     = [];

        /** Array of all the {@link Semester}s of the user. @type {Semester[]} */
        semesters   = [];

        /** Array of all the non-read {@link Grade}s of the user. @type {Grade[]} */
        newGrades   = [];

        /** Array of the string representation of all the read {@link Grade}s of the user. @type {Grade[]} */
        savedReadGrades = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SAVED_READ_GRADES") ) || [];

        /** Array of the string representation of all the {@link Grade}s disabled by the user. @type {Grade[]} */
        disabledGrades  = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_DISABLED_GRADES") )   || [];

        /** Arrary of the string representation of all the simulated {@link Grade}s created by the user. @type {Grade[]} */
        sim             = [];


        /**
         * Object representing a convenient structure to access all the backend data, in a "*JavaScript Object-access style*".
         * @type {Object.< number, { "__object__": Semester, "__modules__": string[], "module": Object.< string, { "__object__": Module, "__subjects__": string[], "subject": Object.< string, { "__object__": Subject, "grades": Grade[] } > } > } >}
         */
        gradesData = {};

        /**
         * Object representing the configuration of the modules for the user.
         * @type {Object.< number, { "__object__": Semester, "__modules__": string[], "modules": Object.< string, { "__object__": Module, "__subjects__": string[], "subject": Object.< string, { "__object__": Subject, "coefficient": number } > } > } >}
         */
        moduleConfig = {};



    //#endregion .                — properties —





    // MARK:                 — constructor —
    constructor() {

    }



    // MARK:                   — methods —
    //#region




        //#region — Cache methods







            // MARK: _  cacheModuleConfig()
            cacheModuleConfig() {
                localStorage.setItem("ECAM-DASHBOARD-module-config-v3", JSON.stringify(this.moduleConfig, (key, value) => { if (key == "__object__") return undefined; else return value; }))
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

                try { this.moduleConfig = JSON.parse( localStorage.getItem("ECAM-DASHBOARD-module-config-v3") ) || {}; }
                catch (e) {
                    this.moduleConfig = {};
                    valid = false;
                }

                if (valid && Object.keys(this.moduleConfig) > 0) {

                    // Preparing the Semester, Module and Subject objects from the moduleConfig

                    Object.keys(this.moduleConfig).forEach(_sem => {
                        const sem = parseInt(_sem);
                        const semesterObj = new Semester(sem);
                        this.semesters.push(semesterObj);
                        this.moduleConfig[sem].__object__ = semesterObj;

                        Object.keys(this.moduleConfig[sem].modules).forEach(module => {
                            const moduleObj = new Module(module, semesterObj);
                            this.modules.push(moduleObj);
                            this.moduleConfig[sem].modules[module].__object__ = moduleObj;

                            Object.entries(this.moduleConfig[sem].modules[module].subject).forEach(subjectEntry => {
                                const subjectObj = new Subject(subjectEntry[0], subjectEntry[1].coefficient, moduleObj);
                                this.subjects.push(subjectObj);
                                this.moduleConfig[sem].modules[module].subject[subjectEntry[0]].__object__ = subjectObj;
                            })
                        })
                    })

                }
                else {
                    // Couldn't find a moduleConfig v3, trying now to get an old moduleConfig
                    const oldModuleConfigStringified = localStorage.getItem("ECAM_DASHBOARD_MODULE_CONFIG");

                    if (oldModuleConfigStringified) {
                        // If old moduleConfig found, translate it to v3 and prepare the Semester, Module and Subject objects from it
                        const oldModuleConfig = JSON.parse(oldModuleConfigStringified);

                        Object.keys(oldModuleConfig).forEach(_sem => {
                            const sem = parseInt(_sem);
                            const semesterObj = new Semester(sem);

                            this.semesters.push(semesterObj);
                            this.moduleConfig[sem] = {"__object__": semesterObj, "modules": {}};

                            Object.entries(oldModuleConfig[sem]).forEach(moduleEntry => {

                                if (moduleEntry[0] == "__modules__") this.moduleConfig[sem].__modules__ = moduleEntry[1];
                                else {
                                    const moduleObj = new Module(moduleEntry[0], semesterObj);

                                    this.modules.push(moduleObj);
                                    this.moduleConfig[sem].modules[moduleEntry[0]] = {"__object__": moduleObj, "subject": {}};

                                    Object.entries(moduleEntry[1]).forEach(subjectEntry => {

                                        if (subjectEntry[0] == "subjects") this.moduleConfig[sem].modules[moduleEntry[0]].__subjects__ = subjectEntry[1];
                                        else if (subjectEntry[0] == "coefficients") {
                                            Object.entries(subjectEntry[1]).forEach(entry => {
                                                const subjectObj = new Subject(entry[0], entry[1], moduleObj);

                                                this.subjects.push(subjectObj);
                                                this.moduleConfig[sem].modules[moduleEntry[0]].subject[entry[0]] = {
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
                    // TODO: localStorage.removeItem("ECAM_DASHBOARD_MODULE_CONFIG");
                }

                return this;
            }




            // MARK: _  cacheSimGrades()
            // TODO
            cacheSimGrades() {
                localStorage.setItem("ECAM-DASHBOARD-sim-grades-v3", JSON.stringify(this.sim, (_key, value) => { return value.toString() }));
                return this;
            }


            // MARK: _  retrieveCachedSimGrades()
            retrieveCachedSimGrades() {
                /** @type { Grade[] | null } */
                let newSim = [];
                // debugger;

                try { newSim = JSON.parse( localStorage.getItem("ECAM-DASHBOARD-sim-grades-v3"), (_key, value) => { return Grade.fromString(value, this) } ) || []; }
                catch (e) {}


                if (newSim.length == 0) {
                    /** @type { Object.< string, Object.< string, Object.< string, Object[] > > > } */
                    const oldSim = JSON.parse( localStorage.getItem("ECAM_DASHBOARD_SIM_GRADES") ) || {};

                    if (Object.keys(oldSim).length > 0) {
                        Object.values(oldSim).forEach(sem => {
                            Object.entries(sem).forEach(mod => {
                                Object.values(mod[1]).forEach(subj => {
                                    Object.values(subj).forEach(grade => {
                                        /** @type {{"grade": number, "coef": number, "classAvg": number | " — ", "semester": number, "subject": string, "type": string, "__sim": boolean, "libelle": string, "id": number}} */
                                        const g = grade;
                                        const simGrade = new Grade(
                                            g.grade,
                                            g.coef,
                                            g.subject,
                                            g.type,
                                            g.__sim,
                                            undefined,
                                            undefined,
                                            undefined,
                                            g.semester,
                                            mod[0],
                                            this,
                                            g.id
                                        );
                                        // debugger;
                                        this.sim.push(simGrade);
                                        this.grades.push(simGrade);
                                    })
                                })
                            })
                        })
                    }

                    this.cacheSimGrades()
                    // localStorage.removeItem("ECAM_DASHBOARD_SIM_GRADES");
                }
                else this.sim = newSim;


                return this;
            }



        //#endregion — Cache methods





        // MARK: _  parseGrades()
        /**
         * Reads the grades from the grades table, and create {@link Grade} instances.
         *
         * @returns ***this*** {@link ECAMDashboard}
         */
        parseGrades() {
            this.retrieveCachedModuleConfig();
            this.retrieveCachedSimGrades();


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
                        const parts     = libelle.split(" - ").map(p => p.trim());
                        const subject   = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : libelle;
                        const title     = parts.length >= 2 ? parts.at(-1) : "";

                        this.grades.push( new Grade(grade, coef, subject, title, false, classAvg, prof, date, semester, undefined, this) );
                    }
                });


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

            return this.computeStatsForEverything();
        }



        // MARK: _  getGrade()
        /**
         *
         * @param {Grade} grade
         * @returns
         */
        getGrade(grade) {
            if (!(grade instanceof Grade)) return null

            this.grades.forEach(g => {
                if ( g.equals(grade) ) return g;
            })

            return null
        }


        // MARK: _  getSubject()
        /**
         *
         * @param {Subject | string} subject The {@link Subject} containing the same informations as the {@link Subject} to find, or its name. If giving its name, you may give next the name of its module and the number of its semester for more precisions.
         * @param {string} [module=undefined] Name of the module of the subject to search.
         * @param {number} [semester=undefined] Number of the seemester of the subject to search.
         * @returns {Subject | null}
         */
        getSubject(subject, module=undefined, semester=undefined) {
            if (!(subject instanceof Subject || typeof subject == "string")) return null

            this.subjects.forEach(subj => {
                if (subject instanceof Subject) if (subj.equals(subject)) return subj;

                if (typeof subject == "string") if (subj.name == subject)
                    if (!module || (subj.module.name == module) )
                        if ( !semester || (subj.semester.number == semester))
                            return subj;
            })

            return null
        }


        // MARK: _  getModule()
        /**
         *
         * @param {Module | string} module
         * @returns {Module | null}
         */
        getModule(module, semester=undefined) {
            if (!(module instanceof Module || typeof module == "string")) return null

            this.modules.forEach(mod => {
                if (module instanceof Module && mod.equals(module)) return mod;

                if (typeof module == "string" && mod.name == module)
                    if ( !semester || (mod.semester.number == semester))
                        return mod;
            })

            return null
        }


        // MARK: _  getSemester()
        /**
         *
         * @param {Semester | number} semester
         * @returns {Semester | null}
         */
        getSemester(semester) {
            if (!(semester instanceof Semester || !isNaN(semester))) return null

            this.semesters.forEach(sem => {
                if (semester instanceof Module && sem.equals(semester))  return semester;
                if (typeof semester == "string" && sem.name == semester) return semester;
            })

            return null
        }



        // MARK: _  computeStatsForEverything()
        /**
         * Compute the stats of every {@link Semester}, {@link Module} and {@link Subject}.
         *
         * @returns ***this*** {@link ECAMDashboard}.
         */
        computeStatsForEverything() {
            this.semesters.forEach(sem => { sem.computeStats(true, true) })

            return this;
        }


    //#endregion — methods —

}



//MARK: ——————————————————
;







//#region <— Globalize classes —>
globalThis.ParameterTypeError   = ParameterTypeError;

globalThis.Grade                = Grade;
globalThis.Subject              = Subject;
globalThis.Module               = Module;
globalThis.Semester             = Semester;

globalThis.Setting              = Setting;
globalThis.Settings             = Settings;
globalThis.KeyboardShortcut     = KeyboardShortcut;
globalThis.KeyboardShortcuts    = KeyboardShortcuts;


globalThis.Card                 = Card;
globalThis.SubjectCard          = SubjectCard;
globalThis.ModuleCard           = ModuleCard;
globalThis.SemesterCard         = SemesterCard;


globalThis.ECAMDashboard        = ECAMDashboard;
// MARK: <— Globalize classes —>
//#endregion







ParameterTypeError.active = true;

/** @type {ECAMDashboard} */
ecamDash2 = new ECAMDashboard().parseGrades();

paramsToVerify = [
    ["Le Goat"], 
    "string", 
    "v1", 
    "taunt", 
    "Gabriel", 
    "You're getting rusty, machine!!"
];

ParameterTypeError.verifyParam(...paramsToVerify);
