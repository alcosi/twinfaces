type ChoiceType = "ONLY" | "ONLY_NOT" | "ANY";
type TriStateFlag = boolean | "indeterminate"


export const mapToChoice = (input: TriStateFlag | undefined): ChoiceType => {
    if (input === true) return "ONLY";
    if (input === false) return "ONLY_NOT"

    return "ANY";
}

export const toArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
};