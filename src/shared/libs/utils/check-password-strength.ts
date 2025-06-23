export type PasswordStrengthIndicatorType =
  | "very-weak"
  | "weak"
  | "medium"
  | "strong";

export function checkPasswordStrength(
  password: string
): PasswordStrengthIndicatorType {
  let strength = 0;

  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  const passwordLength = password.length >= 8;

  if (!passwordLength) return "very-weak";

  if (upperCaseRegex.test(password)) strength++;
  if (lowerCaseRegex.test(password)) strength++;
  if (numberRegex.test(password)) strength++;
  if (specialCharRegex.test(password)) strength++;

  if (strength <= 1) return "weak";
  if (strength === 2 || strength === 3) return "medium";
  if (strength === 4) return "strong";

  return "very-weak";
}
