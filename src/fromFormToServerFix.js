const fromFormToServerFix = (personInForm) => ({
    type: [
      personInForm.isForeign ? 'foreign' : null,
      personInForm.isJuridical ? 'juridical' : 'physical',
    ].filter(Boolean).join('_'),
    tin: personInForm.isForeign ? null : (personInForm.tin !== undefined ? personInForm.tin : null),
    name: personInForm.isJuridical ? null : (personInForm.title !== undefined ? personInForm.title : null),
    foreign_tin: personInForm.isForeign ? (personInForm.tin !== undefined ? personInForm.tin : null) : null,
    company_title: personInForm.isJuridical ? (personInForm.title !== undefined ? personInForm.title : null) : null,
});
  
export default fromFormToServerFix;
