/**
 * Gets the initials from a given project name or client name
 *
 * @param {String} string - the project or client name
 * @param {Number} initialLength - the length of the initials
 * @returns {String} the initials of the project or client
 */
export function getInitials(
  string: string | null | undefined,
  initialLength = 2
): string {
  if (string) {
    const initials = string.split(" ");

    if (initialLength === 1) return `${initials[0]?.charAt(0)}`;

    return `${initials[0]?.charAt(0)}${initials[1]?.charAt(0)}`;
  }

  return "";
}
