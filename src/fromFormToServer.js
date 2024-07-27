const fromFormToServer = (personInForm) => ({
    type: [
      personInForm.isForeign ? 'foreign' : null,
      personInForm.isJuridical ? 'juridical' : 'physical',
    ].filter(Boolean).join('_'),
    tin: personInForm.isForeign ? null : personInForm.tin,
    name: personInForm.isJuridical ? null : personInForm.title,
    foreign_tin: personInForm.isForeign ? personInForm.tin : null,
    company_title: personInForm.isJuridical ? personInForm.title : null,
});
  
export default fromFormToServer;
