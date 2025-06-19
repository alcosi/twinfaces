import { cn } from "@/shared/libs";

export type PasswordStrengthIndicator = 0 | 1 | 2 | 3;

type props = {
  strength: PasswordStrengthIndicator;
};

export function ShowPasswordStrength({ strength }: props) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: strength + 1 }).map((_, index) => (
        <div
          key={index}
          className={cn("h-1 w-8 rounded-md", {
            "bg-red-500": strength === 0,
            "bg-orange-500": strength === 1,
            "bg-yellow-500": strength === 2,
            "bg-green-500": strength === 3,
          })}
        />
      ))}
    </div>
  );
}

export function checkPasswordStrength(password: string) {
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

  if (strength <= 2) return 1;
  if (strength === 3 || strength === 4) return 2;
  if (strength === 5) return 3;
}
