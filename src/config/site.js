export const SITE = {
  name: 'Tachyon Intelligence',
  tagline: 'Intelligence at the Speed of Thought.',

  // Add the official address here when it exists. While null, the site shows a placeholder.
  email: null,

  // Optional: a POST endpoint for the contact form. While empty, the form hands the
  // composed enquiry to WhatsApp so nothing is silently dropped.
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',

  phones: [
    { display: '+91 99010 56155', tel: '+919901056155', wa: '919901056155' },
    { display: '+91 98451 51666', tel: '+919845151666', wa: '919845151666' },
  ],

  // Add profile URLs to turn the footer placeholders into links.
  socials: [
    { label: 'LinkedIn', url: null },
    { label: 'Instagram', url: null },
    { label: 'X', url: null },
    { label: 'YouTube', url: null },
  ],
}

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'technology', label: 'Technology' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
