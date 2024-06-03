import bcrypt from "bcrypt";

export async function hashPassword(plainPassword: string): Promise<string> {
  const hash = await bcrypt
    .hash(plainPassword, 10)
    .then(function (hash: string): string {
      return hash;
    });
  return hash;
}

export async function compareHash(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  const result = await bcrypt
    .compare(plainPassword, hash)
    .then(function (result): boolean {
      if (result) {
        return true;
      }

      return false;
    });
  return result;
}
