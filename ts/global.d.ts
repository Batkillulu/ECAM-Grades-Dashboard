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
    {[name: string]: { "value": any, "allowedTypes"?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }} | string[]


    /**
     * @param {number} index Position of the parameter to fetch.
     * @param {IArguments} [args] The callee's `arguments` object.
     * @returns {string | [string, {value: any}]} Without `args`: just the parameter's name. With `args`: an `[name, {value}]` entry.
     */
    getArgument(index:number, args?: IArguments):
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }] | any


    /**
     * Finds the `[name, {value, allowedTypes}]` entry whose captured value is `value`.
     *
     * @param {IArguments} args The callee's `arguments` object.
     * @param {any} value The value to look for.
     * @param {string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]|undefined} [allowedTypes]
     * @returns {[string, {value: any, allowedTypes?: any}]}
     * @throws {Error} If no parameter currently holds `value`.
     */
    getArgumentFromValue(args: IArguments, value: any, allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]):
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any)) }]

}
