
export interface Permissions {
    allowShowHide: boolean
    allowCreateShapes: boolean
    allowEditShapes: {
        own: boolean
        others: boolean
    }
    allowDeleteShapes: {
        own: boolean
        others: boolean
    }
}

export const createPermissions = (isTeacher: boolean): Permissions => {
    if (isTeacher) {
        return createTeacherPermissions();
    } else {
        return createStudentPermissions();
    }
};

export const createEmptyPermissions = (): Permissions => {
    return {
        allowShowHide: false,
        allowCreateShapes: false,
        allowEditShapes: {
            own: false,
            others: false
        },
        allowDeleteShapes: {
            own: false,
            others: false
        }
    };
};

export const createTeacherPermissions = (): Permissions => {
    return {
        allowShowHide: true,
        allowCreateShapes: true,
        allowEditShapes: {
            own: true,
            others: true
        },
        allowDeleteShapes: {
            own: true,
            others: true
        }
    };
};

export const createStudentPermissions = (): Permissions => {
    return {
        allowShowHide: false,
        allowCreateShapes: true,
        allowEditShapes: {
            own: true,
            others: false
        },
        allowDeleteShapes: {
            own: true,
            others: false
        }
    };
};
