// Care Staffing site NAVIGATION STRUCTURE only. NAP (phone/email/address/trading_name)
// is NEVER here — it comes from the page JSON `nap` block (registry-sourced, staffing
// 020 3973 8887) so a wrong/cross-division number is impossible by construction.
//
// SCAFFOLD NOTE (Gate 1): the nav links below are placeholders derived from the URL
// inventory (AUDIT/STAFFING-URL-INVENTORY.md) and point at the canonical slugs the
// migration will produce. The pages themselves are migrated in Gate 2+. The shell
// renders today; content lands later.
export const siteNav = {
  brandName: 'Vigil Care Staffing',
  primary: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Healthcare Assistants', href: '/healthcare-assistants' },
    { label: 'Support Workers', href: '/support-workers' },
    { label: 'Locations', href: '/locations' },
  ],
  footer: [
    {
      heading: 'Services',
      links: [
        { label: 'Healthcare Assistants', href: '/healthcare-assistants' },
        { label: 'Support Workers', href: '/support-workers' },
        { label: 'Healthcare Cleaners', href: '/healthcare-cleaners' },
        { label: 'Temporary Staffing', href: '/temporary-staffing-solutions-london' },
      ],
    },
  ],
  companyReg: 'Company Reg. 11756806',
};
