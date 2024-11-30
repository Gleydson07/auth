export function generateProvisionalPasswordHash(length: number = 8){
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const upperCase = lowerCase.toUpperCase();
    const numbers = "0123456789";
    const specials = "!@#$%&*";

    const groups = [lowerCase, upperCase, numbers, specials];
    const pass = [];

    for (let i = 0; i < length; i++) {
      const group = groups[Math.floor(Math.random() * groups.length)];
      pass.push(group[Math.floor(Math.random() * group.length)]);
    }

    return pass.join("");
}
