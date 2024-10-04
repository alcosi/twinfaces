type ChoiceType = "ONLY" | "ONLY_NOT" | "ANY";
type TriStateFlag = boolean | "indeterminate"

export const mapToChoice = (input: TriStateFlag): ChoiceType => {
    if (input === 'indeterminate') return "ANY";

    return input ? "ONLY" : "ONLY_NOT";
}