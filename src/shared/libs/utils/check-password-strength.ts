/**
 * 0 = very weak
 * 1 = weak
 * 2 = medium
 * 3 = strong
 */
export type PasswordStrengthLevel = 0 | 1 | 2 | 3;

export function checkPasswordStrength(password: string): PasswordStrengthLevel {
  if (password.length < 8) {
    return 0;
  }

  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  const passedTests = [
    upperCaseRegex,
    lowerCaseRegex,
    numberRegex,
    specialCharRegex,
  ].reduce((acc, testCase) => {
    if (testCase.test(password)) {
      acc.push(true);
    }
    return acc;
  }, [] as Array<Boolean>).length;

  if (passedTests <= 1) {
    return 1;
  } else if (passedTests === 2 || passedTests === 3) {
    return 2;
  } else {
    return 3;
  }
}
