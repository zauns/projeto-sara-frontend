export function formatCNPJ(cnpj: string): string {
  const digitsOnly = cnpj.replace(/\D/g, "");
  return digitsOnly
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

export function isValidCNPJ(cnpj: string): boolean {
  const digitsOnly = cnpj.replace(/\D/g, "");

  if (digitsOnly.length !== 14 || /^(\d)\1+$/.test(digitsOnly)) {
    return false;
  }

  let length = digitsOnly.length - 2;
  let numbers = digitsOnly.substring(0, length);
  const digits = digitsOnly.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) {
    return false;
  }

  length = length + 1;
  numbers = digitsOnly.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
}

export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 11) {
    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  // Retorna os dígitos se não corresponder a nenhum formato esperado
  return digitsOnly.slice(0, 11);
}

export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, "");
  // Verifica se tem 10 (fixo) ou 11 (móvel) dígitos
  return digitsOnly.length === 10 || digitsOnly.length === 11;
}
