type ChoiceType = "ONLY" | "ONLY_NOT" | "ANY";
type TriStateFlag = boolean | "indeterminate"

export const mapToChoice = (input?: TriStateFlag): ChoiceType => {
    if (input === 'indeterminate' || input === undefined) return "ANY";

    return input ? "ONLY" : "ONLY_NOT";
}

export const toArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
};