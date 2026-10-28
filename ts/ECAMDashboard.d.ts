// MARK: ECAMDashboard
declare class ECAMDashboard {

    /**
     * Object with values being the key of the localStorage cache containing data for this ECAMDashboard, 
     * associated with keys that are short description of the value's meaning.
     */
    readonly cacheKeys: {
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
