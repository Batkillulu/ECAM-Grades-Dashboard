// global.d.ts



interface String {

    /**
     * Replaces every whitespace character in ***this*** string by a single dash.
     * @returns {string} ***This*** string after replacing every whitespace by a single dash.
     */
    replaceSpacesWithDashes(): string

}


interface Function {

    /**
     * Gets the name of the arguments of ***this*** Function in an Array. 
     * If {@link args} is given an {@link IArguments} object, 
     * maps the name of the parameters to their corresponding values instead.
     * @param args Arguments of the function, simply give "arguments".
     * @param allowedTypes Description of the allowed types of each arguments.
     */
    getArguments(args?: IArguments=arguments, allowedTypes: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]): 
    {string: { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }} | string[]


    /**
     * Gets the name of the {@link index}-th arguments of ***this*** Function in an Array. 
     * If {@link args} is given an {@link IArguments} object, 
     * maps the name of the {@link index}-th parameters to its corresponding value instead.
     * @param index Index of the argument to get.
     * @param args Arguments of the function, simply give "arguments".
     * @param allowedTypes Description of the allowed types of each arguments.
     */
    getArgument(index:number, args?: IArguments, allowedTypes?: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]): 
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }] | any


    /**
     * Gets the argument (entry with the name of the argument as key, 
     * and as value an object with the "value" field associated to the value of the argument 
     * and the "allowedTypes" field associated to the allowedTypes of the argument) 
     * corresponding to the given value.
     * @param args 
     * @param value 
     * @param allowedTypes
     */
    getArgumentFromValue(args: IArguments, value: any, allowedTypes: string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[]): 
    [string, { "value": any, "allowedTypes": string | (new (...args: any[]) => any) | (string | (new (...args: any[]) => any))[] }]

}
