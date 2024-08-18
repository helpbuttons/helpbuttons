export const userPattern = /@[\w]+/gi;
export function mentionsOfMessage(message, username) {
  const matches = message.match(userPattern);
  if (!matches) {
    return [];
  }

  const usersNames = matches.map((user) => user.substring(1));
  return usersNames.filter((usernm) => usernm != username);
}
