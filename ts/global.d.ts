// global.d.ts


// MARK: String
interface String {

    /**
     * Replaces every whitespace character in ***this*** string by a single dash.
     * @returns {string} ***This*** string after replacing every whitespace by a single dash.
     */
    replaceSpacesWithDashes(): string

}


// MARK: Function
interface Function {

    /**
     * @param {IArguments} [args] The callee's `arguments` object.
     * @param {(string | Function | (string|Function)[])[]} [allowedTypes] One entry per parameter.
     * @returns {string[] | Object<string, {value?: any, allowedTypes?: any}>}
     *   With neither `args` nor `allowedTypes`: an ordered array of parameter names.
     *   Otherwise: an object keyed by parameter name (in declaration order), each holding
     *   a `value` (when `args` is a real arguments object) and/or `allowedTypes` (when
     *   `allowedTypes` is a well-formed allowedTypes array) — whichever were actually given.
     */
    getArguments(args?: IArguments, allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]):
    {string: { "value": any, "allowedTypes"?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }} | string[]


    /**
     * @param {number} index Position of the parameter to fetch.
     * @param {IArguments} [args] The callee's `arguments` object.
     * @returns {string | [string, {value: any}]} Without `args`: just the parameter's name. With `args`: an `[name, {value}]` entry.
     */
    getArgument(index:number, args?: IArguments, allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]):
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }] | any


    /**
     * Finds the `[name, {value, allowedTypes}]` entry whose captured value is `value`.
     *
     * @param {IArguments} args The callee's `arguments` object.
     * @param {any} value The value to look for.
     * @param {(string | Function | (string|Function)[])[]} [allowedTypes]
     * @returns {[string, {value: any, allowedTypes?: any}]}
     * @throws {Error} If no parameter currently holds `value`.
     */
    getArgumentFromValue(args: IArguments, value: any, allowedTypes: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]):
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }]

}



interface ParameterTypeError {

    /**
     * Verifies every argument in `args` against the type(s) at the same index in `allowedTypes`.
     * Extra elements in `args` beyond `allowedTypes.length` are ignored.
     *
     * @param args Typically the callee's `arguments` object.
     * @param allowedTypes One entry per positional parameter to check (see {@link ParameterTypeError.verifyParam}).
     * @param method Pass the actual {@link Function} (not just its name) to get real parameter names in error messages. Otherwise, just its name to have only have its name appear in the error.
     * @param className Pass the actual Class (not just its name) to get 
     * @param message
     */
    verifyParams(
        args: IArguments | any[], 
        allowedTypes: string | Function | RegExp | any[] | object, 
        method:string | Function = "<anonymous>", 
        className:string | Function = "<anonymous>", 
        message:string = undefined
    )
}



// MARK: ECAMDashboard
interface ECAMDashboard {

    /**
     * Object with values being the key of the localStorage cache containing data for this ECAMDashboard, 
     * associated with keys that are short description of the value's meaning.
     */
    cacheKeys: {
        cachedModuleConfig: "ECAM-DASHBOARD-module-config-v3",
        cachedSimGrades: "ECAM-DASHBOARD-sim-grades-v3"
    };

    /** Array of all the {@link Grade}s of the user. */
    grades: Grade[];

    /** Array of all the {@link Subject}s of the user. */
    subjects: Subject[];

    /** Array of all the {@link Module}s of the user. */
    modules: Module[];

    /** Array of all the {@link Semester}s of the user. */
    semesters: Semester[];

    /** Array of all the non-read {@link Grade}s of the user. */
    newGrades: Grade[];

    /** Array of the string representation of all the read {@link Grade}s of the user. */
    savedReadGrades: Grade[];

    /** Array of the string representation of all the {@link Grade}s disabled by the user. */
    disabledGrades: Grade[];

    /** Arrary of the string representation of all the simulated {@link Grade}s created by the user. */
    sim: Grade[];




    /**
     * Object representing a convenient structure to access all the backend data, in a "*JavaScript Object-access style*".
     */
    gradesData: {
        [semesterNumber: number]: {
            __object__: Semester;
            __modules__: string[];
            modules: {
                [moduleName: string]: {
                    __object__: Module;
                    __subjects__: string[];
                    subjects: {
                        [subjectName: string]: {
                            __object__: Subject;
                            grades: Grade[]
                        };
                    };
                };
            };
        };
    };


    /**
     * Object representing the configuration of the modules for the user.
     */
    moduleConfig: {
        [semesterNumber: number]: {
            __object__: Semester;
            __modules__: string[];
            modules: {
                [moduleName: string]: {
                    __object__: Module;
                    __subjects__: string[];
                    subjects: {
                        [subjectName: string]: {
                            __object__: Subject;
                            coefficient: number
                        };
                    };
                };
            };
        };
    };
}