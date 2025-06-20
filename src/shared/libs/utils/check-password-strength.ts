export type PasswordStrengthIndicatorType =
  | "very-weak"
  | "weak"
  | "medium"
  | "strong";

export function checkPasswordStrength(
  password: string
): PasswordStrengthIndicatorType {
  let strength = 0;

  const lengthRegex = /.{8,}/;
  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (lengthRegex.test(password)) strength++;
  if (upperCaseRegex.test(password)) strength++;
  if (lowerCaseRegex.test(password)) strength++;
  if (numberRegex.test(password)) strength++;
  if (specialCharRegex.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength === 3 || strength === 4) return "medium";
  if (strength === 5) return "strong";

  return "very-weak";
}
