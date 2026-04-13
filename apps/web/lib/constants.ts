export type AppRole = "admin" | "teacher" | "student";

export function getRolePath(role: AppRole) {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    default:
      return "/login";
  }
}
