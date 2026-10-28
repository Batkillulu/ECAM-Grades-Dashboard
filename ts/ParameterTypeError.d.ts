// MARK: ParameterTypeError
/**
 * Error thrown when a value doesn't match the `allowedType` it was checked against.
 * Also hosts the static verification API (`verifyParam` / `verifyParams`).
 */
declare class ParameterTypeError extends TypeError {

    //MARK:                — static config —

    /** When `false`, `verifyParam()` and `verifyParams()` become no-ops. */
    static active: boolean;

    /** Primordial `typeof` results usable as type names in a type-expression string. */
    static basicAllowedTypes: string[];

    /** Pseudo-types usable in a type-expression string: `"any" | "array" | "class" | "constructor" | "arguments"`. */
    static customAllowedTypes: string[];

    /** `basicAllowedTypes` + `customAllowedTypes`. */
    static handledAllowedTypes: string[];


    //MARK:               — constructor —

    /**
     * @param actualValue The offending value.
     * @param allowedTypes What it was supposed to be.
     * @param parameterName Name of the offending parameter.
     * @param methodName Method (or its name) in which the check happened.
     * @param className Class (or its name) to which that method belongs.
     * @param message Header of the error message (the details are appended automatically).
     * @param cause Underlying error, if any.
     */
    constructor(
        actualValue: any,
        allowedTypes: ParameterTypeError.AllowedType,
        parameterName?: string,
        methodName?: string | Function,
        className?: string | Function,
        message?: string,
        cause?: Error
    );


    //MARK:             — encapsulation —

    /** Underlying cause of this error. */
    readonly cause: Error | undefined;

    /** Name of the class in which the failing check happened. */
    readonly classCause: string;

    /** Name of the method in which the failing check happened. */
    readonly methodNameCause: string;

    /** Name of the offending parameter. */
    readonly paramNameCause: string;

    /** Value of the offending parameter. */
    readonly paramValueCause: any;


    //MARK:             — public methods —

    /**
     * Makes classes resolvable BY NAME inside type-expression strings (e.g. `"string|Module"`).
     * Needed because `class` declarations are not properties of `globalThis`.
     * @throws {TypeError} If an argument isn't a named class/constructor.
     */
    static registerClass(...classes: Function[]): void;

    /**
     * Verifies that `actualValue` matches `allowedType`.
     *
     * `allowedType` can be:
     *  - a type-expression string (`"string|number"`, `"number[3]"`, `"[1, number, 3]"`, `"/[a-z]+/i"`,
     *    `"{ \"prop1\": string, \"prop2\"?: number, string?: boolean }"`, ...);
     *  - a class/constructor (checked with `instanceof`);
     *  - a `RegExp` (matches strings/numbers via `.test(String(value))`);
     *  - an array: a TUPLE (same length, positional types);
     *  - `{ anyOf: [...] }`: a UNION of raw type specs;
     *  - any other plain object: an EXACT-SHAPE object type.
     *
     * @throws {ParameterTypeError} If `actualValue` doesn't match.
     * @throws {ReferenceError} If a type-expression string names a class that is neither registered nor on `globalThis`.
     * @throws {SyntaxError} If a type-expression string is malformed.
     */
    static verifyParam(
        actualValue: any,
        allowedType: ParameterTypeError.AllowedType,
        parameterName?: string,
        methodName?: string | Function,
        className?: string | Function,
        message?: string
    ): void;

    /**
     * Verifies every argument in `args` against the `allowedTypes` entry at the same index.
     * Extra arguments beyond `allowedTypes.length` are ignored.
     *
     * @param args Typically the callee's `arguments` object.
     * @param allowedTypes One entry per positional parameter to check.
     * @param methodName Pass the actual function/class (not just its name) to get real parameter names
     *        in error messages; for a class, its constructor's parameters are used.
     * @param className
     * @param message
     * @throws {ParameterTypeError}
     */
    static verifyParams(
        args: IArguments | any[],
        allowedTypes: ParameterTypeError.AllowedType[],
        methodName?: string | Function,
        className?: string | Function,
        message?: string
    ): void;


    //MARK:             — private members —

    #cause: Error | undefined;
    #classCause: string;
    #methodNameCause: string;
    #paramNameCause: string;
    #paramValueCause: any;

    static #defaultMessageHeader: string;
    static #typeExpressionCache: Map<string, ParameterTypeError.TypeNode>;
    static #classRegistry: Map<string, Function>;

    static #matchesType(value: any, type: ParameterTypeError.AllowedType): boolean;
    static #matchesTuple(value: any, typeArray: ParameterTypeError.AllowedType[]): boolean;
    static #matchesExactShape(value: any, spec: { [key: string]: ParameterTypeError.AllowedType }): boolean;
    static #matchesNode(value: any, node: ParameterTypeError.TypeNode): boolean;
    static #findMatchingRecordRule(rules: ParameterTypeError.RecordRule[], key: string): ParameterTypeError.RecordRule | null;
    static #matchesKeyPattern(key: string, kp: ParameterTypeError.KeyPattern): boolean;

    static #parseTypeExpression(str: string): ParameterTypeError.TypeNode;
    static #tokenizeTypeExpression(str: string): ParameterTypeError.Token[];

    static #describeType(value: any): string;
    static #describeAllowedType(type: ParameterTypeError.AllowedType): string;
    static #isClass(value: any): boolean;
    static #isArguments(value: any): boolean;
    static #extractParamNames(fct: any): string[] | null;
    static #extractBalancedParens(src: string, openIndex: number): string | null;
    static #splitTopLevel(str: string, separator: string): string[];
    static #stripDefaultValue(paramStr: string): string;
}



//MARK: Namespace
declare namespace ParameterTypeError {

    /** Parsed form of a type-expression string (internal AST). */
    type TypeNode =
        | { kind: "literal"; value: string | number | boolean }
        | { kind: "primitive"; name: string }
        | { kind: "special"; name: string }
        | { kind: "named"; name: string }
        | { kind: "regex"; regex: RegExp }
        | { kind: "union"; options: TypeNode[] }
        | { kind: "array"; element: TypeNode; length: number | null }
        | { kind: "tuple"; elements: TypeNode[] }
        | { kind: "record"; rules: RecordRule[] };

    /** How a record rule recognizes the keys it governs (internal AST). */
    type KeyPattern =
        | { kind: "literal"; value: string }
        | { kind: "regex"; regex: RegExp }
        | { kind: "typename"; name: string };

    /** One `KeyPattern(s): ValueType` rule of a record type (internal AST). */
    interface RecordRule {
        keyPatterns: KeyPattern[];
        valueType: TypeNode;
        optional: boolean;
        /** Rules written as one `(..)|(..)` member share a group id. */
        group: number;
    }

    /** Token produced while tokenizing a type-expression string (internal). */
    interface Token {
        type: string;
        literalType?: "string" | "number" | "boolean" | "regex";
        value?: any;
    }

    /** A single parameter's type spec; nests arbitrarily. */
    type AllowedType =
        | string
        | Function
        | RegExp
        | AllowedType[]
        | { anyOf: AllowedType[] }
        | { [key: string]: AllowedType };
}
