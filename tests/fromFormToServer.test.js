import { describe, it, expect } from 'vitest';
import fromFormToServer from '../src/fromFormToServer.js';
import fromFormToServerFix from '../src/fromFormToServerFix.js';
import chalk from 'chalk';

const testCases = [
  // Отечественные юридические лица
  {
    description: '1. Отечественное юридическое лицо / Domestic juridical entity',
    input: { isForeign: false, isJuridical: true, title: 'ООО "Капибара"', tin: '1234567890' },
    expected: { type: 'juridical', tin: '1234567890', name: null, foreign_tin: null, company_title: 'ООО "Капибара"' },
  },
  {
    description: '2. Отечественное юридическое лицо без названия / Domestic juridical entity with empty title',
    input: { isForeign: false, isJuridical: true, title: '', tin: '1234567890' },
    expected: { type: 'juridical', tin: '1234567890', name: null, foreign_tin: null, company_title: '' },
  },
  {
    description: '3. Отечественное юридическое лицо с длинным названием / Domestic juridical entity with long title',
    input: { isForeign: false, isJuridical: true, title: 'ОАО'.repeat(20), tin: '1234567890' },
    expected: { type: 'juridical', tin: '1234567890', name: null, foreign_tin: null, company_title: 'ОАО'.repeat(20) },
  },
  {
    description: '4. Отечественное юридическое лицо со специальными символами в названии / Domestic juridical entity with special characters in the title',
    input: { isForeign: false, isJuridical: true, title: '%$#@**;', tin: '1234567890' },
    expected: { type: 'juridical', tin: '1234567890', name: null, foreign_tin: null, company_title: '%$#@**;' },
  },
  {
    description: '5. Отечественное юридическое лицо без ИНН / Domestic juridical entity without tin',
    input: { isForeign: false, isJuridical: true, title: 'ООО "Капибара"', tin: '' },
    expected: { type: 'juridical', tin: '', name: null, foreign_tin: null, company_title: 'ООО "Капибара"' },
  },
  {
    description: '6. Отечественное юридическое лицо с пробелами в ИНН / Domestic juridical entity with spaces in tin',
    input: { isForeign: false, isJuridical: true, title: 'ООО "Капибара"', tin: '12 34 567890' },
    expected: { type: 'juridical', tin: '12 34 567890', name: null, foreign_tin: null, company_title: 'ООО "Капибара"' },
  },
  {
    description: '7. Отечественное юридическое лицо с пустыми полями / Domestic juridical entity with empty fields',
    input: { isForeign: false, isJuridical: true, title: '', tin: '' },
    expected: { type: 'juridical', tin: '', name: null, foreign_tin: null, company_title: '' },
  },
  // Отечественное физическое лицо
  {
    description: '8. Отечественное физическое лицо / Domestic physical person',
    input: { isForeign: false, isJuridical: false, title: 'Иван Иванов Иванович', tin: '123456789012' },
    expected: { type: 'physical', tin: '123456789012', name: 'Иван Иванов Иванович', foreign_tin: null, company_title: null },
  },
  {
    description: '9. Отечественное физическое лицо без отчества / Domestic physical person without middle name',
    input: { isForeign: false, isJuridical: false, title: 'Иван Иванов', tin: '123456789012' },
    expected: { type: 'physical', tin: '123456789012', name: 'Иван Иванов', foreign_tin: null, company_title: null },
  },
  {
    description: '10. Отечественное физическое лицо с двойной фамилией / Domestic physical person with a double surname',
    input: { isForeign: false, isJuridical: false, title: 'Иван Иванов-Сидоров Иванович', tin: '123456789012' },
    expected: { type: 'physical', tin: '123456789012', name: 'Иван Иванов-Сидоров Иванович', foreign_tin: null, company_title: null },
  },
  {
    description: '11. Отечественное физическое лицо без ИНН / Domestic physical person without tin',
    input: { isForeign: false, isJuridical: false, title: 'Иван Иванов-Сидоров Иванович', tin: '' },
    expected: { type: 'physical', tin: '', name: 'Иван Иванов-Сидоров Иванович', foreign_tin: null, company_title: null },
  },
  {
    description: '12. Отечественное физическое лицо с пробелами в ИНН / Domestic physical person with spaces in tin',
    input: { isForeign: false, isJuridical: false, title: 'Иван Иванов-Сидоров Иванович', tin: '12 34 567890 12' },
    expected: { type: 'physical', tin: '12 34 567890 12', name: 'Иван Иванов-Сидоров Иванович', foreign_tin: null, company_title: null },
  },
  {
    description: '13. Отечественное физическое лицо с пустыми полями / Domestic physical person with empty fields',
    input: { isForeign: false, isJuridical: false, title: '', tin: '' },
    expected: { type: 'physical', tin: '', name: '', foreign_tin: null, company_title: null },
  },
  // Иностранное юридическое лицо
  {
    description: '14. Иностранное юридическое лицо / Foreign juridical entity',
    input: { isForeign: true, isJuridical: true, title: 'ABC Corp.', tin: '1234567890' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '1234567890', company_title: 'ABC Corp.' },
  },
  {
    description: '15. Иностранное юридическое лицо без названия / Foreign juridical entity with empty title',
    input: { isForeign: true, isJuridical: true, title: '', tin: '1234567890' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '1234567890', company_title: '' },
  },
  {
    description: '16. Иностранное юридическое лицо с длинным названием / Foreign juridical entity with long title',
    input: { isForeign: true, isJuridical: true, title: 'ADA'.repeat(20), tin: '1234567890' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '1234567890', company_title: 'ADA'.repeat(20) },
  },
  {
    description: '17. Иностранное юридическое лицо без ИНН / Foreign juridical entity without tin',
    input: { isForeign: true, isJuridical: true, title: 'ADA', tin: '' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '', company_title: 'ADA' },
  },
  {
    description: '18. Иностранное юридическое лицо с пробелами в ИНН / Foreign juridical entity with spaces in tin',
    input: { isForeign: true, isJuridical: true, title: 'ADA', tin: '12 34 567890' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '12 34 567890', company_title: 'ADA' },
  },
  {
    description: '19. Иностранное юридическое лицо с пустыми полями / Foreign juridical entity with empty fields',
    input: { isForeign: true, isJuridical: true, title: '', tin: '' },
    expected: { type: 'foreign_juridical', tin: null, name: null, foreign_tin: '', company_title: '' },
  },
  // Иностарнное физическое лицо
  {
    description: '20. Иностранное физическое лицо / Foreign physical person',
    input: { isForeign: true, isJuridical: false, title: 'John Dod', tin: '123456789012' },
    expected: { type: 'foreign_physical', tin: null, name: 'John Dod', foreign_tin: '123456789012', company_title: null },
  },
  {
    description: '21. Иностранное физическое лицо без ФИО / Foreign physical entity with empty title',
    input: { isForeign: true, isJuridical: false, title: '', tin: '123456789012' },
    expected: { type: 'foreign_physical', tin: null, name: '', foreign_tin: '123456789012', company_title: null },
  },
  // Null значения
  {
    description: '22. Null значения / Null values',
    input: { isForeign: null, isJuridical: null, title: null, tin: null },
    expected: { type: 'physical', tin: null, name: null, foreign_tin: null, company_title: null },
  },
  // Undefined значения
  {
    description: '23. Undefined значения / Undefined values',
    input: { isForeign: undefined, isJuridical: undefined, title: undefined, tin: undefined },
    expected: { type: 'physical', tin: null, name: null, foreign_tin: null, company_title: null },
  },
];

const createTest = (description, input, expected, fn) => {
  it(description, () => {
    const result = fn(input);

    console.log(chalk.blue('Test Description:'), chalk.bold(description));
    console.log(chalk.green('Result:'), result);
    console.log(chalk.yellow('Expected:'), expected);

    console.table({
      'Type': result.type,
      'TIN': result.tin,
      'Name': result.name,
      'Foreign TIN': result.foreign_tin,
      'Company Title': result.company_title
    });

    expect(result).toEqual(expected);
  });
};

// describe('fromFormToServer', () => {
//   testCases.forEach(({ description, input, expected }) => {
//     createTest(description, input, expected, fromFormToServer);
//   });
// });

describe('fromFormToServerFix', () => {
  testCases.forEach(({ description, input, expected }) => {
    createTest(description, input, expected, fromFormToServerFix);
  });
});
