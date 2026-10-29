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









//#region — General Variables —

const nbRegExpSrc = "/\\d+((\\.|\\,)\\d+)?/";
const intRegExpSrc = "/\\d+/";

//#endregion 














//#region — BACKEND —
// MARK: ——————————————————





//#region ========= BACKEND =========




    // MARK: ——————————————————
    ;







    // MARK: ———    ParameterTypeError     ———
    class ParameterTypeError extends TypeError {
        



        // MARK:                — static config —
        //#region

            static active = true;

            static basicAllowedTypes = ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"];
            static customAllowedTypes = ["any", "array", "class", "constructor", "arguments"];
            static handledAllowedTypes = this.basicAllowedTypes.concat(this.customAllowedTypes);

            static #defaultMessageHeader = "Improper parameter type: parameter is NOT of an expected type.";

            /**
             * Cache of parsed type-expression strings -> AST, so a given spec is only parsed once.
             * @type {Map<string, ParameterTypeError.TypeNode>}
             */
            static #typeExpressionCache = new Map();

        //#endregion




        // MARK:           — instance properties —
        //#region

            /** @type {Error | undefined} */
            #cause;
            /** @type {string} */
            #classCause;
            /** @type {string} */
            #methodNameCause;
            /** @type {string} */
            #paramNameCause;
            /** @type {*} */
            #paramValueCause;

        //#endregion




        // MARK:               — constructor —
        /**
         * @param {*}                               actualValue The offending value.
         * @param {ParameterTypeError.AllowedType}  allowedTypes What it was supposed to be.
         * @param {string | undefined}              parameterName Name of the offending parameter.
         * @param {string | Function | undefined}   methodName Method (or its name) in which the check happened.
         * @param {string | Function | undefined}   className Class (or its name) to which that method belongs.
         * @param {string | undefined}              message Header of the error message (the details are appended automatically).
         * @param {Error | undefined}               cause Underlying error, if any.
         */
        constructor(actualValue, allowedTypes, parameterName = "(unknown)", methodName = "<anonymous>", className = "<anonymous>", message = ParameterTypeError.#defaultMessageHeader, cause = undefined) {
            const resolvedMethodName = typeof methodName === "function" ? (methodName.name || "<anonymous>") : methodName;
            const resolvedClassName = typeof className === "function" ? (className.name || "<anonymous>") : className;

            const expectedTypeStr = ParameterTypeError.#describeAllowedType(allowedTypes);
            const actualTypeStr = ParameterTypeError.#describeType(actualValue);

            const formattedMessage =
                "\n" +
                `    class:  ${resolvedClassName}\n` +
                `    method: ${resolvedMethodName}\n` +
                "    parameter:\n" +
                `        name:          ${parameterName}\n` +
                `        expected type: ${expectedTypeStr}\n` +
                `        actual type:   ${actualTypeStr}\n`;

            super(message + formattedMessage, { cause });

            this.#cause = cause;
            this.#classCause = resolvedClassName;
            this.#methodNameCause = resolvedMethodName;
            this.#paramNameCause = parameterName;
            this.#paramValueCause = actualValue;
        }




        // MARK:              — encapsulation —
        //#region

            get cause() { return this.#cause; }
            get classCause() { return this.#classCause; }
            get methodNameCause() { return this.#methodNameCause; }
            get paramNameCause() { return this.#paramNameCause; }
            get paramValueCause() { return this.#paramValueCause; }

        //#endregion




        // MARK:             — public methods —
        //#region



            // MARK: _  verifyParams()
            /**
             * Verifies that `args` match their corresponding allowedType at the same index in `allowedTypes`.
             * Throws a {@link ParameterTypeError} otherwise.
             *
             * `allowedTypes` can be:
             *  - a type-expression STRING — see the grammar notes below.
             *  - a class/constructor reference (checked via `instanceof`).
             *  - a RegExp instance, or a `"/pattern/flags"` string — matches string/number values via `.test(String(value))`.
             *  - a raw JS ARRAY — a TUPLE: value must be an array of the exact same length, each
             *    position checked against the type at that index. Elements can themselves be any
             *    of the things in this list, nested arbitrarily.
             *  - a raw JS OBJECT (plain, not array/RegExp) — an EXACT-SHAPE object type: value must
             *    be a plain object with exactly the same key set, each value checked against the
             *    (recursively any-of-the-above) type given for that key.
             *
             * Type-expression STRING grammar:
             *  - plain type name: "string" | "number" | "boolean" | "function" | "object" | "bigint" | "symbol" | "undefined"
             *  - pseudo-type: "any" | "array" | "class" | "constructor" | "arguments"
             *  - a class name reachable via globalThis: "Error", "MyGlobalClass", ...
             *  - a literal to enforce exactly: "3", "true", '"yes"'
             *  - union: "A|B"
             *  - array: "X[]" (any length) / "X[3]" (exact length)
             *  - tuple: "[A, B, C]"
             *  - regex literal: "/pattern/flags" (bare or quoted) — matches string/number values
             *  - RECORD (structural object) type: "{ KeyPattern: ValueType, ... }" where each
             *    KeyPattern is a quoted literal key ('"foo"'), a regex ("/tag-\d+/"), the pseudo
             *    key-types "string" (any non-numeric-looking key) / "number" (any numeric-looking
             *    key) / "any" (every key), or a "|"-union of these sharing one ValueType. Independent
             *    pairs with DIFFERENT value types are unioned by wrapping each in parens:
             *    "(\"a\": boolean)|(\"b\": number)". Every key actually present on the value must be
             *    covered by some rule (most specific rule wins: literal > regex > pseudo key-type);
             *    an uncovered key fails the match. ValueType can itself be any type expression,
             *    including another nested record.
             *
             * All of the above nest arbitrarily.
             *
             * @param {IArguments | any[]} argument Typically the callee's `arguments` object.
             * @param {ParameterTypeError.AllowedType[]} allowedTypes One entry per positional parameter to check.
             * @param {string | Function} [method]
             * @param {string | Function} [className]
             * @param {string} [message]
             * @returns {void}
             */
            static verifyParams(argument, allowedTypes, method = "<anonymous>", className = "<anonymous>", message = undefined) {
                if (!this.active) return;

                if (!this.#isArguments(argument) && !Array.isArray(argument)) {
                    throw new ParameterTypeError(
                        argument, "arguments", "args", "verifyParams", ParameterTypeError.name,
                        "The given args must be an arguments object or an array."
                    );
                }
                if (!Array.isArray(allowedTypes)) {
                    throw new ParameterTypeError(
                        allowedTypes, "array", "allowedTypes", "verifyParams", ParameterTypeError.name,
                        "The given allowedTypes must be an array, with one entry per parameter to check."
                    );
                }

                const argsArray = Array.from(argument);
                const paramNames = this.#extractParamNames(method);

                for (let i = 0; i < allowedTypes.length; i++) {
                    const parameterName = paramNames?.[i] ?? `arg${i + 1}`;

                    this.#verifyParam(argsArray[i], allowedTypes[i], 
                        parameterName, method, className, message
                    )
                }
            }

        //#endregion




        // MARK:              — type matching —
        //#region




            // MARK: _  #verifyParam()
            /**
             * Verifies that `actualValue` matches `allowedType`. Throws a {@link ParameterTypeError} otherwise.
             * (See {@link ParameterTypeError.verifyParams} for what `allowedType` can be.)
             *
             * @param {*} actualValue
             * @param {ParameterTypeError.AllowedType} allowedType
             * @param {string} [parameterName]
             * @param {string | Function} [methodName]
             * @param {string | Function} [className]
             * @param {string} [message]
             * @returns {void}
             */
            static #verifyParam(actualValue, allowedType, parameterName = "(unknown)", methodName = "<anonymous>", className = "<anonymous>", message = undefined) {
                if (!this.active) return;

                if (!this.#matchesType(actualValue, allowedType)) {
                    debugger;
                    throw new ParameterTypeError(
                        actualValue,
                        allowedType,
                        parameterName,
                        methodName,
                        className,
                        message ?? this.#defaultMessageHeader
                    );
                }
            }





            // MARK: _  #matchesType()
            /**
             * 
             * @param {*} value 
             * @param {ParameterTypeError.AllowedType} type 
             * @returns {boolean}
             */
            static #matchesType(value, type) {
                if (Array.isArray(type)) {
                    return this.#matchesTuple(value, type);
                }
                if (typeof type === "function") {
                    return value instanceof type || value === type;
                }
                if (type instanceof RegExp) {
                    return (typeof value === "string" || typeof value === "number") && type.test(String(value));
                }
                if (type !== null && typeof type === "object") {
                    return this.#matchesExactShape(value, type);
                }
                if (typeof type !== "string") return false;

                const node = this.#parseTypeExpression(type);
                return this.#matchesNode(value, node);
            }



            // MARK: _  #matchesTuple()
            /**
             * 
             * @param {*} value 
             * @param {ParameterTypeError.AllowedType[]} typeArray 
             * @returns {boolean}
             */
            static #matchesTuple(value, typeArray) {
                if (!Array.isArray(value)) return false;
                if (value.length !== typeArray.length) return false;
                return typeArray.every((t, i) => this.#matchesType(value[i], t));
            }



            // MARK: _  #matchesExactShape()
            /**
             * 
             * @param {*} value 
             * @param {{ [key: string]: ParameterTypeError.AllowedType }} spec 
             * @returns {boolean}
             */
            static #matchesExactShape(value, spec) {
                if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
                const specKeys = Object.keys(spec);
                const valueKeys = Object.keys(value);
                if (specKeys.length !== valueKeys.length) return false;
                return specKeys.every(key =>
                    Object.prototype.hasOwnProperty.call(value, key) && this.#matchesType(value[key], spec[key])
                );
            }



            // MARK: _  #matchesNode()
            /**
             * 
             * @param {*} value 
             * @param {ParameterTypeError.TypeNode} node 
             * @returns {boolean}
             */
            static #matchesNode(value, node) {
                switch (node.kind) {
                    case "literal":
                        return value === node.value;

                    case "primitive":
                        return typeof value === node.name;

                    case "special":
                        switch (node.name) {
                            case "any": return true;
                            case "array": return Array.isArray(value);
                            case "class": return this.#isClass(value);
                            case "constructor": return typeof value === "function";
                            case "arguments": return this.#isArguments(value);
                        }
                        return false;

                    case "named": {
                        const ctor = /** @type {any} */ (globalThis)[node.name];
                        return typeof ctor === "function" && value instanceof ctor;
                    }

                    case "regex":
                        return (typeof value === "string" || typeof value === "number") && node.regex.test(String(value));

                    case "union":
                        return node.options.some(opt => this.#matchesNode(value, opt));

                    case "array": {
                        if (!Array.isArray(value)) return false;
                        if (node.length !== null && value.length !== node.length) return false;
                        return value.every(v => this.#matchesNode(v, node.element));
                    }

                    case "tuple": {
                        if (!Array.isArray(value)) return false;
                        if (value.length !== node.elements.length) return false;
                        return node.elements.every((elNode, idx) => this.#matchesNode(value[idx], elNode));
                    }

                    case "record": {
                        /** @type {Set<ParameterTypeError.RecordRule>} */
                        const used = new Set();
                        for (const key of Object.keys(value)) {
                            const rule = this.#findMatchingRecordRule(node.rules, key);
                            if (!rule) return false;
                            if (!this.#matchesNode(value[key], rule.valueType)) return false;
                            used.add(rule);
                        }
                        /** @type {Map<number, boolean>} */
                        const groupOk = new Map();
                        for (const rule of node.rules) {
                            groupOk.set(rule.group, groupOk.get(rule.group) || rule.optional || used.has(rule));
                        }
                        return ![...groupOk.values()].includes(false);
                    }
                }
                return false;
            }



            // MARK: _  #findMatchingRecordRule()
            /** 
             * Picks the most specific rule (literal > regex > pseudo key-type) whose key-pattern matches `key`.
             * @param {ParameterTypeError.RecordRule[]} rules 
             * @param {string} key 
             * @return {ParameterTypeError.RecordRule | null}
             */
            static #findMatchingRecordRule(rules, key) {
                /** @type {ParameterTypeError.RecordRule | null} */
                let best = null;
                let bestTier = Infinity;
                for (const rule of rules) {
                    for (const kp of rule.keyPatterns) {
                        if (this.#matchesKeyPattern(key, kp)) {
                            const tier = kp.kind === "literal" ? 0 : kp.kind === "regex" ? 1 : 2;
                            if (tier < bestTier) { bestTier = tier; best = rule; }
                            break;
                        }
                    }
                }
                return best;
            }



            // MARK: _  #matchesKeyPattern()
            /**
             * 
             * @param {string} key 
             * @param {ParameterTypeError.KeyPattern} kp 
             * @returns {boolean}
             */
            static #matchesKeyPattern(key, kp) {
                switch (kp.kind) {
                    case "literal": return key === kp.value;
                    case "regex": return kp.regex.test(key);
                    case "typename": {
                        const isNumericKey = /^-?\d+(\.\d+)?$/.test(key);
                        if (kp.name === "any") return true;
                        if (kp.name === "number") return isNumericKey;
                        if (kp.name === "string") return !isNumericKey;
                        return false;
                    }
                }
                return false;
            }

        //#endregion




        // MARK:       — type-expression parsing —
        //#region





            // MARK: _  #parseTypeExpression()
            /**
             * 
             * @param {string} str 
             * @returns {ParameterTypeError.TypeNode}
             */
            static #parseTypeExpression(str) {
                const cached = this.#typeExpressionCache.get(str);
                if (cached) return cached;

                /** @type {ParameterTypeError.TypeNode} */
                let node;
                try {
                    const tokens = this.#tokenizeTypeExpression(str);
                    let pos = 0;

                    const peek = () => tokens[pos];
                    const advance = () => tokens[pos++];
                    /** @param {string} type */
                    const expect = (type) => {
                        const t = advance();
                        if (!t || t.type !== type) throw new SyntaxError(`expected "${type}" but got ${t ? `"${t.type}"` : "end of input"}`);
                        return t;
                    };

                    /** @returns {ParameterTypeError.TypeNode} */
                    const parseType = () => parseUnion();

                    /** @returns {ParameterTypeError.TypeNode} */
                    const parseUnion = () => {
                        let n = parsePostfix();
                        if (peek() && peek().type === "|") {
                            const options = [n];
                            while (peek() && peek().type === "|") {
                                advance();
                                options.push(parsePostfix());
                            }
                            n = { kind: "union", options };
                        }
                        return n;
                    };

                    /** @returns {ParameterTypeError.TypeNode} */
                    const parsePostfix = () => {
                        let n = parsePrimary();
                        while (peek() && peek().type === "[") {
                            advance();
                            let length = null;
                            if (peek() && peek().type === "literal" && peek().literalType === "number") {
                                length = advance().value;
                            }
                            expect("]");
                            n = { kind: "array", element: n, length };
                        }
                        return n;
                    };

                    /** @returns {ParameterTypeError.KeyPattern} */
                    const parseKeyPatternAtom = () => {
                        const t = peek();
                        if (!t) throw new SyntaxError("expected a key pattern");
                        if (t.type === "literal") {
                            advance();
                            if (t.literalType === "regex") return { kind: "regex", regex: t.value };
                            if (t.literalType === "string") return { kind: "literal", value: t.value };
                            throw new SyntaxError(`a ${t.literalType} literal cannot be used as an object key pattern`);
                        }
                        if (t.type === "identifier") {
                            advance();
                            return { kind: "typename", name: t.value };
                        }
                        throw new SyntaxError(`unexpected token "${t.type}" in key pattern`);
                    };

                    /** @returns {ParameterTypeError.KeyPattern[]} */
                    const parseKeyPatternUnion = () => {
                        const patterns = [parseKeyPatternAtom()];
                        while (peek() && peek().type === "|") {
                            advance();
                            patterns.push(parseKeyPatternAtom());
                        }
                        return patterns;
                    };

                    /**
                     * @param {number} group
                     * @returns {ParameterTypeError.RecordRule}
                     */
                    const parseRecordPair = (group) => {
                        const keyPatterns = parseKeyPatternUnion();
                        let optional = false;
                        if (peek() && peek().type === "?") { advance(); optional = true; }
                        expect(":");
                        const valueType = parseType();
                        return { keyPatterns, valueType, optional, group };
                    };

                    /**
                     * @param {ParameterTypeError.RecordRule[]} rules
                     * @returns {void}
                     */
                    const parseRecordMemberInto = (rules) => {
                        const group = rules.length; // rules from one "(..)|(..)" member share a group id
                        if (peek() && peek().type === "(") {
                            while (true) {
                                expect("(");
                                rules.push(parseRecordPair(group));
                                expect(")");
                                if (peek() && peek().type === "|") { advance(); continue; }
                                break;
                            }
                        } else {
                            rules.push(parseRecordPair(group));
                        }
                    };

                    /** @returns {ParameterTypeError.TypeNode} */
                    const parsePrimary = () => {
                        const t = peek();
                        if (!t) throw new SyntaxError("unexpected end of type expression");

                        if (t.type === "(") {
                            advance();
                            const inner = parseType();
                            expect(")");
                            return inner;
                        }
                        if (t.type === "[") {
                            advance();
                            /** @type {ParameterTypeError.TypeNode[]} */
                            const elements = [];
                            if (peek() && peek().type !== "]") {
                                elements.push(parseType());
                                while (peek() && peek().type === ",") {
                                    advance();
                                    elements.push(parseType());
                                }
                            }
                            expect("]");
                            return { kind: "tuple", elements };
                        }
                        if (t.type === "{") {
                            advance();
                            /** @type {ParameterTypeError.RecordRule[]} */
                            const rules = [];
                            if (peek() && peek().type !== "}") {
                                parseRecordMemberInto(rules);
                                while (peek() && peek().type === ",") {
                                    advance();
                                    parseRecordMemberInto(rules);
                                }
                            }
                            expect("}");
                            return { kind: "record", rules };
                        }
                        if (t.type === "literal") {
                            advance();
                            if (t.literalType === "regex") return { kind: "regex", regex: t.value };
                            return { kind: "literal", value: t.value };
                        }
                        if (t.type === "identifier") {
                            advance();
                            if (ParameterTypeError.basicAllowedTypes.includes(t.value)) return { kind: "primitive", name: t.value };
                            if (ParameterTypeError.customAllowedTypes.includes(t.value)) return { kind: "special", name: t.value };
                            return { kind: "named", name: t.value };
                        }
                        throw new SyntaxError(`unexpected token "${t.type}"`);
                    };

                    node = parseType();
                    if (pos !== tokens.length) throw new SyntaxError(`unexpected trailing content starting at token ${pos}`);
                }
                catch (err) {
                    throw new SyntaxError(`Invalid type expression "${str}": ${/** @type {Error} */ (err).message}`);
                }

                this.#typeExpressionCache.set(str, node);
                return node;
            }



            // MARK: _  #tokenizeTypeExpression()
            /**
             * 
             * @param {string} str 
             * @returns {ParameterTypeError.Token[]}
             */
            static #tokenizeTypeExpression(str) {
                /** @type {ParameterTypeError.Token[]} */
                const tokens = [];
                const n = str.length;
                let i = 0;

                /**
                 * @param {string} rawValue
                 * @returns {RegExp | null}
                 */
                const asRegexShape = (rawValue) => {
                    const m = /^\/(.*)\/([a-zA-Z]*)$/.exec(rawValue);
                    if (!m) return null;
                    try { return new RegExp(m[1], m[2]); } catch { return null; }
                };

                while (i < n) {
                    const c = str[i];

                    if (/\s/.test(c)) { i++; continue; }

                    if ("()[]{},|:?".includes(c)) { tokens.push({ type: c }); i++; continue; }

                    if (c === '"' || c === "'") {
                        const quote = c;
                        let j = i + 1;
                        let value = "";
                        while (j < n && str[j] !== quote) {
                            if (str[j] === "\\" && j + 1 < n) { value += str[j + 1]; j += 2; continue; }
                            value += str[j];
                            j++;
                        }
                        if (j >= n) throw new SyntaxError("unterminated string literal");
                        const regex = asRegexShape(value);
                        if (regex) tokens.push({ type: "literal", literalType: "regex", value: regex });
                        else tokens.push({ type: "literal", literalType: "string", value });
                        i = j + 1;
                        continue;
                    }

                    if (c === "/") {
                        let j = i + 1;
                        let body = "";
                        let terminated = false;
                        while (j < n) {
                            if (str[j] === "\\" && j + 1 < n) { body += str[j] + str[j + 1]; j += 2; continue; }
                            if (str[j] === "/") { terminated = true; j++; break; }
                            body += str[j];
                            j++;
                        }
                        if (!terminated) throw new SyntaxError("unterminated regex literal");
                        const flagsMatch = /^[a-zA-Z]*/.exec(str.slice(j));
                        const flags = flagsMatch ? flagsMatch[0] : "";
                        j += flags.length;
                        let regex;
                        try { regex = new RegExp(body, flags); }
                        catch (err) { throw new SyntaxError(`invalid regex literal /${body}/${flags}: ${/** @type {Error} */ (err).message}`); }
                        tokens.push({ type: "literal", literalType: "regex", value: regex });
                        i = j;
                        continue;
                    }

                    const numMatch = /^-?\d+(\.\d+)?/.exec(str.slice(i));
                    if (numMatch) {
                        tokens.push({ type: "literal", literalType: "number", value: Number(numMatch[0]) });
                        i += numMatch[0].length;
                        continue;
                    }

                    const idMatch = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(str.slice(i));
                    if (idMatch) {
                        const word = idMatch[0];
                        if (word === "true" || word === "false") {
                            tokens.push({ type: "literal", literalType: "boolean", value: word === "true" });
                        } else {
                            tokens.push({ type: "identifier", value: word });
                        }
                        i += word.length;
                        continue;
                    }

                    throw new SyntaxError(`unexpected character "${c}" at position ${i}`);
                }

                return tokens;
            }

        //#endregion




        // MARK:               — misc internals —
        //#region





            /**
             * @param {*} value
             * @returns {string}
             */
            static #describeType(value) {
                if (value === null) return "null";
                if (Array.isArray(value)) return `array[${value.length}]`;
                if (this.#isArguments(value)) return "arguments";
                if (typeof value === "object") return value.constructor?.name ?? "object";
                if (typeof value === "function") return this.#isClass(value) ? "class" : "function";
                return typeof value;
            }

            /**
             * @param {ParameterTypeError.AllowedType} type
             * @returns {string}
             */
            static #describeAllowedType(type) {
                if (typeof type === "function") return type.name || "<anonymous class>";
                if (Array.isArray(type)) return "[" + type.map(t => this.#describeAllowedType(t)).join(", ") + "]";
                if (type instanceof RegExp) return type.toString();
                if (type !== null && typeof type === "object") {
                    return "{" + Object.entries(type).map(([k, v]) => `${k}: ${this.#describeAllowedType(v)}`).join(", ") + "}";
                }
                return String(type);
            }

            /**
             * @param {*} value
             * @returns {boolean}
             */
            static #isClass(value) {
                return typeof value === "function" && /^class[\s{]/.test(Function.prototype.toString.call(value));
            }

            /**
             * @param {*} value
             * @returns {boolean}
             */
            static #isArguments(value) {
                return Object.prototype.toString.call(value) === "[object Arguments]";
            }

            /**
             * @param {*} fct A function, or a class (then its constructor's parameters are used).
             * @returns {string[] | null}
             */
            static #extractParamNames(fct) {
                if (typeof fct !== "function") return null;

                const src = Function.prototype.toString.call(fct);

                let openIndex;
                if (isClass(fct)) {
                    const ctorMatch = /\bconstructor\s*(?=\()/.exec(src);
                    if (!ctorMatch) return null; // implicit constructor: fall back to arg1, arg2...
                    openIndex = src.indexOf("(", ctorMatch.index);
                } else {
                    openIndex = src.indexOf("(");
                }

                let paramsStr;
                if (openIndex === -1) {
                    // parenless single-param arrow: `x => ...`
                    const arrowMatch = src.match(/^\s*(?:async\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*=>/);
                    paramsStr = arrowMatch ? arrowMatch[1] : "";
                } else {
                    paramsStr = this.#extractBalancedParens(src, openIndex) ?? "";
                }

                if (paramsStr.trim() === "") return [];

                return this.#splitTopLevel(paramsStr, ",")
                    .map(p => this.#stripDefaultValue(p).replace(/^\.\.\./, "").trim())
                    .filter(Boolean);
            }

            /**
             * @param {string} src
             * @param {number} openIndex
             * @returns {string | null}
             */
            static #extractBalancedParens(src, openIndex) {
                let depth = 0;
                for (let i = openIndex; i < src.length; i++) {
                    if (src[i] === "(") depth++;
                    else if (src[i] === ")") {
                        depth--;
                        if (depth === 0) return src.slice(openIndex + 1, i);
                    }
                }
                return null;
            }

            /**
             * @param {string} str
             * @param {string} separator
             * @returns {string[]}
             */
            static #splitTopLevel(str, separator) {
                /** @type {string[]} */
                const parts = [];
                let depth = 0;
                let current = "";
                for (const c of str) {
                    if ("([{".includes(c)) depth++;
                    else if (")]}".includes(c)) depth--;
                    if (c === separator && depth === 0) { parts.push(current); current = ""; }
                    else current += c;
                }
                parts.push(current);
                return parts;
            }

            /**
             * @param {string} paramStr
             * @returns {string}
             */
            static #stripDefaultValue(paramStr) {
                let depth = 0;
                for (let i = 0; i < paramStr.length; i++) {
                    const c = paramStr[i];
                    if ("([{".includes(c)) depth++;
                    else if (")]}".includes(c)) depth--;
                    else if (
                        c === "=" && depth === 0 &&
                        paramStr[i + 1] !== ">" &&
                        !["=", "!", "<", ">"].includes(paramStr[i - 1] ?? "")
                    ) return paramStr.slice(0, i).trim();
                }
                return paramStr.trim();
            }

        //#endregion

    }




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
             * Value of the class' average of ***this*** {@link Grade}, a positive float number below 20 
             * @type {number}
             */
            #classAvg = NaN;

            /** 
             * Name of the teacher.s who published ***this*** {@link Grade} (default when no teacher was given: " — ") 
             * @type {string}
             */
            #prof;

            /** 
             * Date of publication of ***this*** {@link Grade} entered by the administration (default when no date was given: " — ").
             * ***Warning**, may differ from the actual date at which the grade was uploaded on the intranet.* 
             * @type {string}
             */
            #date;

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
         */
        constructor(grade, coef, subject, title=" — ", isSim=false, classAvg=undefined, prof=" — ", date=" — ", id=undefined) {
            this.#grade = typeof grade === "number" ? (grade <= 20 ? (grade >= 0 ? Number(grade) : 0) : 20) : parseFloat(grade);
            this.#coef  = typeof coef === "number" ? (coef <= 100 ? (coef  >= 0 ? Number(coef)  : 0) : 100) : parseFloat(coef);


            this.#subject   = subject;
            this.#module    = subject.module;
            this.#semester  = subject.semester;


            this.#title = title;
            this.#isSim = isSim;

            if (isSim) {
                if (id) this.#id = id;
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
                else if (classAvg.match(RegExp(nbRegExpSrc))) {
                    this.#classAvg = parseFloat(classAvg) <= 20 ? (parseFloat(classAvg) >= 0 ? parseFloat(classAvg) : 0) : 20;
                }
            }

            this.#prof      = prof;
            this.#date      = date;


            this.#enabled = true;

            this.#markedAsRead = false;
        }


        // MARK:               — encapsulation —
        //#region


            /** 
             * Value of ***this*** {@link Grade}, a positive float number below 20.
             */
            get grade()     { return this.#grade }
            set grade(value) {
                this.#grade = value <= 20 ? (value >= 0 ? Number(value) : 0) : 20;
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
                this.#semester = value;
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
             */
            get classAvg()  { return this.#classAvg }
            /**
             * @param {number|string|undefined} value 
             */
            set classAvg(value) {
                ParameterTypeError.verifyParams(arguments, ["number|string|undefined"], Object.getOwnPropertyDescriptors(Grade.prototype).classAvg.set, Grade)

                if (typeof value === "string") { value = parseInt(value); }

                this.#classAvg = (!value || isNaN(value)) ? NaN : ( (value) <= 20 ? (value >= 0 ? value : 0) : 20 );
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
                        && grade.#grade 	== this.#grade
                        && grade.#classAvg 	== this.#classAvg
                        && grade.#coef 		== this.#coef
                        && grade.#semester 	== this.#semester
                        && grade.#subject 	== this.#subject
                        && grade.#title 	== this.#title
                        && grade.#prof 		== this.#prof
                        && grade.#date 		== this.#date
                        && grade.#isSim     == this.#isSim
                        && grade.#id        == this.#id
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
                ParameterTypeError.verifyParams(arguments, [Grade, "string"], Grade.prototype.correspondsTo, Grade);
                var out = false;

                if (grade instanceof Grade) out = this.getUniqueIdentifier() === grade.getUniqueIdentifier();
                else out = this.getUniqueIdentifier() === grade;

                return out;
            }





            // MARK: _  static average()
            /**
             * The {@link Grade.average()} static method calculates the weighted average between all the given {@link Grade}s' value, rounded to the nearest hundredth of the average.
             *
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted average from.
             */
            static average(...grades) {
                ParameterTypeError.verifyParams(arguments, [Grade.name+"[]|"+Grade.name], Grade.average, Grade);

                if (grades instanceof Array) {
                    let validArrayOfGrades = true, average = 0, totalCoef = 0;

                    grades.forEach(grade => {
                        if (grade instanceof Grade) {
                            average += grade.#grade * grade.#coef;
                            totalCoef += grade.#coef;
                        }
                        else validArrayOfGrades = false;
                    })

                    if (!validArrayOfGrades) return NaN;
                    else return Math.round(100*average/totalCoef)/100 || NaN;

                }
                return NaN;
            }


            // MARK: _  static classAverage()
            /**
             * The {@link Grade.classAverage()} static method calculates the weighted average between all the given {@link Grade}s' classAvg value,
             * rounded to the nearest hundredth of the average.
             *
             * @param {Grade[]} grades Array of {@link Grade}s to calculate the weighted class average from.
             */
            static classAverage(...grades) {
                ParameterTypeError.verifyParams(arguments, [Grade.name+"[]|"+Grade.name], Grade.classAverage, Grade);

                let average = 0, totalCoef = 0, i = -1;

                for (const grade of grades) {
                    i++;

                    if (grade.#classAvg) {
                        average += grade.#classAvg * grade.#coef;
                        totalCoef += grade.#coef;
                    }
                    else console.log("Grade n°"+i+" does not have a class average.")
                }

                return Math.round(100*average/totalCoef)/100 || NaN;
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



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
                if (typeof value != "string") { throw new TypeError("Invalid Subject.name setting: tried to set 'name' to a type other than string") }
                this.#name = value;
            }

            /**
             * Coefficient of ***this*** {@link Subject} in its {@link Module}.
             */
            get coef()      { return this.#coef     }
            set coef(value) {
                if (isNaN(value)) { throw new TypeError("Invalid Subject.coef setting: tried to set 'coef' to a type other than number") }
                this.#coef = value <= 100 ? (value >= 0 ? value : 0) : 100;
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
                this.#module = value;
            }

            /**
             * The {@link Semester} (or its number) of ***this*** {@link Subject}.
             */
            get semester()  { return this.#semester }
            set semester(value) {
                this.#semester = value;
            }

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
                    && (
                        this.#module instanceof Module 
                        ? this.#module.equals(subject.#module instanceof Module ? subject.#module : undefined)
                        : true
                    )
                    && (
                        this.#semester instanceof Semester
                        ? this.#semester.equals(subject.#semester)
                        : true
                    )
                ) {
                    return true;
                }

                return false;
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


                
                return this.computeStats();
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

                this.#average   = Grade.average(...this.#grades);
                this.#classAvg  = Grade.classAverage(...this.#grades);

                return this;
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



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
         * Constructs an object of class {@link Module} from its given name and .
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
                if (typeof value != "string") { throw new Error("Invalid Module.name setting: tried to set 'name' to a type other than string") }
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
             */
            get semester()  { return this.#semester }
            set semester(value) {
                this.#semester = value;
            }

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
                    && (this.#semester instanceof Semester ? this.#semester.equals(module.#semester) : this.#semester === module.#semester)
                ) {
                    return true;
                }

                return false;
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
                ParameterTypeError.verifyParams(arguments, [Subject.name+"|string"], Module.prototype.getSubject, Module);

                Object.values(this.#subjects).forEach(subj => {
                    if (subject instanceof Subject && subject.equals(subj)) return subj;
                    else if (typeof subject === "string" && subject === subj.name) return subj;
                })

                throw new Error("Subject of name \""+ (subject instanceof Subject ? subject.name : subject) + "\" does not exists in the Module of name \""+ this.#name+ "\".");
            }



            // MARK: _  hasSubject()
            /**
             * Checks whether the given {@link Subject} (or the {@link Subject} whose name corresponds to the given string)
             * exists in ***this*** {@link Module}.
             * 
             * @param {Subject|string} subject The {@link Subject} (or its name) belonging to ***this*** {@link Module}.
             */
            hasSubject(subject) {
                ParameterTypeError.verifyParams(arguments, [Subject.name+"|string"], Module.prototype.hasSubject, Module);

                try {
                    this.getSubject(subject);
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

                subjects.forEach(subject => {
                    this.#subjects[subject.name] = subject;
                    this.#semester.subjects[subject.name] = subject;
                })

                return this.computeStats();
            }



            // MARK: _  removeSubject()
            /**
             * Removes {@link Subject}s from ***this*** {@link Module}.
             * @param {(Subject|string)[]} subjects The {@link Subject}s (or their name) to remove from ***this*** {@link Module}.
             *
             * @throws {Error} If trying to remove a subject that can't be found in ***this*** {@link Module}.
             * @returns {Module} ***this*** {@link Module}.
             */
            removeSubject(...subjects) {
                ParameterTypeError.verifyParams(arguments, ["("+Subject.name+"|string"+")[]"], Module.prototype.removeSubject, Module)
                subjects = subjects.flat();

                subjects.forEach(subject => {
                    const name = subject instanceof Subject ? subject.name : subject;

                    if (!this.#subjects[name]) throw new Error("This "+Module.name+" n°"+this.#name+" does not have the "+Subject.name+" of name \""+name+"\".");

                    delete this.#subjects[name];
                })

                return this;
            }






            // MARK: _  computeStats()
            /**
             * Computes the total coefficients, the average and the class average of ***this*** {@link Module}.
             * @param {boolean} [recomputeSubjects=true] `true` if the stats of the {@link Subject}s of ***this*** {@link Semester} has to be computed, `false` otherwise.
             */
            computeStats(recomputeSubjects=true) {

                ParameterTypeError.verifyParams(arguments, ["boolean"], Subject.prototype.computeStats, Subject);

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
                if (recomputeSubjects) Object.values(this.#subjects).forEach(subject => { if (subject instanceof Subject) subject.computeStats(); })

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

                this.#average    = Grade.average(...this.grades);
                this.#classAvg   = Grade.classAverage(...this.grades);

                return this;
            }

        //#endregion — methods —







        // MARK: _________________________________________

    }



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
             * The undefined {@link Module} of ***this*** {@link Semester}. 
             * @type {Module}
             */
            #undefinedModule;


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




            /**
             * Fallback semester.
             * @readonly
             */
            static unknownSemester = new Semester(-1);


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

            this.#undefinedModule = new Module(Module.unclassified, this);

            this.#semesterCard = new SemesterCard(this);
        }


        // MARK:               — encapsulation —
        //#region 


            /**
             * Number of ***this*** {@link Semester}. @type {number}
             */
            get number()      { return this.#number }
            set number(value) {
                if (isNaN(value)) { throw new Error("Invalid Semester.name setting: tried to set 'number' to a type other than a number") }
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
            get undefinedModule()  { return this.#undefinedModule }


            /**
             * Array of the {@link Grade}s in ***this*** {@link Semester}. @type {Grade[]} @readonly
             */
            get grades()    { return this.#grades }

            /** Array of the {@link Subject}s in ***this*** {@link Semester}. @type {Object.<string, Subject>} */
            get subjects()    { return this.#subjects }
            set subjects(value) {
                ParameterTypeError.verifyParams(arguments, ["{string: "+Subject.name+"}"], "set Semester.subjects", Semester);

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
             * @returns {boolean}
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




            // MARK: _  getModule()
            /**
             * 
             * @param {Module|string} module 
             * @returns {Module}
             */
            getModule(module) {
                ParameterTypeError.verifyParams(arguments, [Module.name+"|string"], Semester.prototype.getModule, Semester)

                for (const mod of Object.values(this.#modules)) {
                    if (module instanceof Module && module.equals(mod)) return mod;
                    else if (typeof module === "string" && module === mod.name) return mod;
                }

                throw new Error("Module of name \""+ (module instanceof Module ? module.name : module) + "\" does not exist in the Semester n°"+this.#number+".");

            }



            // MARK: _  hasModule()
            /**
             * 
             * @param {Module|string} module 
             * @returns {boolean}
             */
            hasModule(module) {
                ParameterTypeError.verifyParams(arguments, [Module.name+"|string"], Semester.prototype.hasModule, Semester)

                try {
                    this.getModule(module);
                    return true;
                }
                catch(e) { return false; }
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
                    if (typeof subject === "string") if (subject === subj.name) return subj;
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
                ParameterTypeError.verifyParams(arguments, [
                    Subject.name+"|string", 
                    Module.name+"|string|undefined"
                ], Semester.prototype.hasSubject, Semester);

                try {
                    this.getSubject(subject, module);
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

                modules.forEach(module => {
                    this.#modules[module.name] = module;
                })

                return this.computeStats();
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

                modules.forEach(module => {
                    if (module == this.#modules[Module.unclassified] || module == Module.unclassified) {
                        throw new Error(
                            "Invalid "+Semester.name+"."+Semester.prototype.removeModules.name+"() call: can not remove the \""+Module.unclassified+"\" Module."
                        )
                    }

                    const name = module instanceof Module ? module.name : module;
                    out[name] = this.#modules[name];

                    if (!this.#modules[name]) throw new Error(
                        "This "+Semester.name+" n°"+this.#number+" does not have the "+Module.name+" of name \""+name+"\"."
                    );

                    delete this.#modules[name];
                })

                return out;
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
                if (recomputeModules) Object.values(this.#modules).forEach(module => { module.computeStats(recomputeSubjects); })

                Object.values(this.#modules || {}).forEach(module => {

                    Object.values(module.subjects || {}).forEach(subject => {

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

                this.#average    = Grade.average(...this.grades);
                this.#classAvg   = Grade.classAverage(...this.grades);

                return this;
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
            ParameterTypeError.verifyParams(arguments, [Subject], SubjectCard, SubjectCard);
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
            ParameterTypeError.verifyParams(arguments, [Module], ModuleCard, ModuleCard);
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
        grades      = [];

        /**
         * Array of all the {@link Subject}s of the user. 
         * @type {Subject[]}
         */
        subjects    = [];

        /**
         * Array of all the {@link Module}s of the user. 
         * @type {Module[]}
         */
        modules     = [];

        
        /**
         * Array of all the {@link Semester}s of the user. 
         * @type {Semester[]}
         */
        semesters   = [];

        /**
         * Array of all the non-read {@link Grade}s of the user. 
         * @type {Grade[]}
         */
        newGrades   = [];


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
        moduleConfig = {};



    //#endregion                  — properties —





    // MARK:                 — constructor —
    constructor() {}



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

                rows.forEach(row => {
                    const cells = row.querySelectorAll("td");

                    if (cells.length >= 6 && cells[0].textContent.includes("/20")) {
                        const label     = cells[1].textContent.trim();
                        const grade     = parseFloat(cells[0].textContent.replace(",", ".").replace("/20", "")) || 0;
                        const coef      = parseFloat(cells[2].textContent.replace(",", ".").replace("%",   "")) || 0;
                        const classAvg  = parseFloat(cells[3].textContent.replace(",", ".").replace("/20", "")) || 0;
                        const prof      = cells[4].textContent.trim();
                        const date      = cells[5].textContent.trim();
                        const semMatch  = label.match(/Semester\s+(\d+)/i);
                        const semester  = semMatch ? parseInt(semMatch[1]) : Semester.unknownSemester;
                        const parts     = label.split(" - ").map(p => p.trim());
                        const subject   = parts.length >= 3 ? parts.slice(1,-1).join(" - ") : label;
                        const title     = parts.length >= 2 ? parts.at(-1) : "";

                        this.addGrade(
                            grade, 
                            coef, 
                            subject, 
                            Module.unclassified, 
                            semester, 
                            title, 
                            false, 
                            classAvg, 
                            prof, 
                            date, 
                            undefined
                        )
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


            /**
             * @type { RegExpMatchArray | null }
             */
            // const match = string.match(/(?:(.+)(?:\/\/\\(.+))(?:\/\/\\(.+))(?:\/\/\\(.+))) : (\d{1,2}(?:\.\d{1,2})?)\/20 vs ((?:\d{1,2}(?:\.\d{1,2})?)| — )\/20, (\d{1,2}(?:\.\d{1,2})?)%(?: \((\d+)\))? \[(ON|OFF)(?:, (UNREAD))?\]/);
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
                    console.log("Found a valid cached module.")

                    // Preparing the Semester, Module and Subject objects from the moduleConfig

                    Object.keys(this.moduleConfig).forEach(_sem => {
                        const sem = parseInt(_sem);
                        const semesterObj = this.ensureSemester(sem);
                        this.moduleConfig[sem].__object__ = semesterObj;

                        Object.keys(this.moduleConfig[sem].modules).forEach(module => {
                            const moduleObj = this.ensureModule(module, semesterObj);
                            this.moduleConfig[sem].modules[module].__object__ = moduleObj;

                            Object.entries(this.moduleConfig[sem].modules[module].subjects).forEach(subjectEntry => {
                                const subjectObj = this.ensureSubject(subjectEntry[0], moduleObj, semesterObj, subjectEntry[1].coefficient);
                                this.moduleConfig[sem].modules[module].subjects[subjectEntry[0]].__object__ = subjectObj;
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
                            const semesterObj = this.ensureSemester(sem);

                            this.moduleConfig[sem] = {
                                "__object__": semesterObj, 
                                "__modules__": [],
                                "modules": {}
                            };

                            Object.entries(oldModuleConfig[sem]).forEach(moduleEntry => {

                                if (moduleEntry[0] == "__modules__") this.moduleConfig[sem].__modules__ = moduleEntry[1];
                                else {
                                    const moduleObj = this.ensureModule(moduleEntry[0], semesterObj);

                                    this.moduleConfig[sem].modules[moduleEntry[0]] = {
                                        "__object__": moduleObj,
                                        "__subjects__": [],
                                        "subjects": {}
                                    };

                                    Object.entries(moduleEntry[1]).forEach(subjectEntry => {

                                        if (subjectEntry[0] == "subjects") this.moduleConfig[sem].modules[moduleEntry[0]].__subjects__ = subjectEntry[1];
                                        else if (subjectEntry[0] == "coefficients") {
                                            Object.entries(subjectEntry[1]).forEach(entry => {
                                                const subjectObj = this.ensureSubject(entry[0], moduleObj, semesterObj, entry[1]);

                                                this.moduleConfig[sem].modules[moduleEntry[0]].subjects[entry[0]] = {
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

                    Object.values(oldSim).forEach(sem => {
                        Object.entries(sem).forEach(mod => {
                            Object.values(mod[1]).forEach(subj => {
                                Object.values(subj).forEach(grade => {
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
                                })
                            })
                        })
                    })

                    this.cacheSimGrades()
                    // TODO: localStorage.removeItem("ECAM_DASHBOARD_SIM_GRADES");
                }
                else this.sim = newSim;


                return this;
            }



        //#endregion — Cache methods






        //#region — Backend manipulation





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
                    "The Grade of string representation \""
                    +(
                        grade instanceof Grade 
                        ? grade.toString() 
                        : new Grade(
                            grade, 
                            coef ? coef : NaN, 
                            subject, 
                            title, 
                            isSim, 
                            classAvg, 
                            prof, 
                            date, 
                            typeof id === "string" ? parseInt(id) : id
                        ).toString()
                    ) 
                    + "\" is not known to this "+ECAMDashboard.name+"."
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
                if (semester instanceof Semester)   return semester.getSubject(subject);
                if (semester !== undefined)         return this.getSemester(semester).getSubject(subject);
                if (module instanceof Module)       return module.getSubject(subject);
                if (module !== undefined)           return this.getModule(module).getSubject(subject);

                for (const subj of this.subjects) { if (subj.name == subject) return subj; }

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

                for (const mod of this.modules) { if (mod.name == module) return mod; }

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




            // MARK: _  getSemester()
            /**
             *
             * @param {Semester|number} semester
             * @returns {Semester}
             * @throws {Error} If the semester is not known to ***this*** {@link ECAMDashboard}.
             */
            getSemester(semester) {
                for (const sem of this.semesters) { if (sem.number == semester) return sem; }

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



            // MARK: _  addGrade()
            /**
             * 
             * @param {number}              grade 
             * @param {number}              coef 
             * @param {Subject|string}      subject 
             * @param {Module|string}       module 
             * @param {Semester|number}     semester 
             * @param {string|undefined}    title 
             * @param {boolean|undefined}   isSim 
             * @param {number|undefined}    classAvg 
             * @param {string|undefined}    prof 
             * @param {string|undefined}    date 
             * @param {number|undefined}    id 
             */
            addGrade(grade, coef, subject, module, semester, title=" — ", isSim=false, classAvg=undefined, prof=" — ", date=" — ", id=undefined) {
                var subj = subject instanceof Subject ? subject : this.ensureSubject(subject, module, semester);
                var mod = subj.module;
                var sem = subj.semester;

                
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
                        id
                    );

                    this.grades.push(newGrade);
                    if (isSim) this.sim.push(newGrade);

                    return newGrade;
                }

                throw new Error("The "+Grade.name+" could not be created, as another exists under the same informations.")

            }


            // MARK: _  addSubject()
            /**
             * 
             * @param {string}              subject 
             * @param {Module|string}       module 
             * @param {Semester|number}     semester
             * @param {number|undefined}    [coefficient=undefined]
             * @returns 
             */
            addSubject(subject, module, semester, coefficient=undefined) {
                var mod = module instanceof Module ? module : this.ensureModule(module, semester);

                if (!this.hasSubject(subject, module, semester)) {
                    const newSubj = new Subject(subject, mod, coefficient);
                    this.subjects.push(newSubj);
                    return newSubj;
                }

                throw new Error("The "+Subject.name+" could not be created, as another exists under the same name.")
            }



            // MARK: _  ensureSubject()
            /**
             * Tries to get the {@link Subject} corresponding to the given {@link Subject} (or its name),
             * and if it does not exits, create it and return it.
             * 
             * @param {string}            subject                   The {@link Subject} (or its name) to find/create in the data of ***this*** {@link ECAMDashboard}.
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
                    return this.addSubject(subject, module, semester, coefficient)
                }
            }


            // MARK: _  addModule()
            /**
             * 
             * @param {string} module 
             * @param {Semester|number} semester 
             * @returns The {@link Module} created.
             */
            addModule(module, semester) {
                /** @type {Semester|undefined} */ 
                var sem = semester instanceof Semester ? semester : this.ensureSemester(semester);

                if (!this.hasModule(module, semester)) {
                    const newMod = new Module(module, sem);
                    this.modules.push(newMod);
                    return newMod;
                }

                throw new Error("The "+Module.name+" could not be created, as another exists under the same name.")
            }



            // MARK: _  ensureModule()
            /**
             * Tries to get the {@link Module} corresponding to the given {@link Module} (or its name),
             * and if it does not exits, create it and return it.
             * 
             * @param {string}              module      The {@link Module} (or its name) to find/create in the data of ***this*** {@link ECAMDashboard}.
             * @param {Semester|number}     semester    The {@link Semester} (or its number) to which should belong the {@link Module} to find/create.
             * @returns {Module} The {@link Module} in the data of ***this*** {@link ECAMDashboard}, whether it was found or created.
             */
            ensureModule(module, semester) {
                try {
                    return this.getModule(module, semester);
                }
                catch (e) {
                    return this.addModule(module, semester)
                }
            }


            // MARK: _  addSemester()
            /**
             * 
             * @param {number} semester 
             * @returns 
             */
            addSemester(semester) {
                if (!this.hasSemester(semester)) {
                    const newSem = new Semester(semester);
                    this.semesters.push(newSem);
                    return newSem;
                }

                throw new Error("The "+Semester.name+" could not be created, as another exists under the same number.");
            }



            // MARK: _  ensureSemester()
            /**
             * Tries to get the {@link Semester} corresponding to the given {@link Semester} (or its number),
             * and if it does not exits, create it and return it.
             * 
             * @param {number} semester The {@link Semester} (or its number) to find/create in the data of ***this*** {@link ECAMDashboard}.
             * @returns {Semester} The {@link Semester} in the data of ***this*** {@link ECAMDashboard}, whether it was found or created.
             */
            ensureSemester(semester) {
                try {
                    return this.getSemester(semester);
                }
                catch (e) {
                    return this.addSemester(semester)
                }
            }





            // MARK: _  computeAllStats()
            /**
             * Compute the stats of every {@link Semester}, {@link Module} and {@link Subject}.
             *
             * @returns ***this*** {@link ECAMDashboard}.
             */
            computeAllStats() {
                this.semesters.forEach(sem => { sem.computeStats(true, true) })

                return this;
            }


        //#endregion — Backend manipulation


    //#endregion — methods —

}



// MARK: ——————————————————
;







//#region <— Globalize classes —>
/** @type {any} */ (globalThis).ParameterTypeError   = ParameterTypeError;

/** @type {any} */ (globalThis).Grade                = Grade;
/** @type {any} */ (globalThis).Subject              = Subject;
/** @type {any} */ (globalThis).Module               = Module;
/** @type {any} */ (globalThis).Semester             = Semester;

/** @type {any} */ (globalThis).Setting              = Setting;
/** @type {any} */ (globalThis).Settings             = Settings;
/** @type {any} */ (globalThis).KeyboardShortcut     = KeyboardShortcut;
/** @type {any} */ (globalThis).KeyboardShortcuts    = KeyboardShortcuts;


/** @type {any} */ (globalThis).Card                 = Card;
/** @type {any} */ (globalThis).SubjectCard          = SubjectCard;
/** @type {any} */ (globalThis).ModuleCard           = ModuleCard;
/** @type {any} */ (globalThis).SemesterCard         = SemesterCard;


/** @type {any} */ (globalThis).ECAMDashboard        = ECAMDashboard;
// MARK: <— Globalize classes —>
//#endregion







ParameterTypeError.active = false;

/** @type {ECAMDashboard} */
globalThis.ecamDash2 = new ECAMDashboard().parseGrades();
