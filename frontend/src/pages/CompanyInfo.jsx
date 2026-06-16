import FeaturePage from '../components/FeaturePage'

const FIELDS = [
  { key: 'logo', label: 'Company logo', type: 'image', kind: 'logo', hint: 'Any logo — auto-fitted to the card' },
  { key: 'companyName', label: 'Company Name', placeholder: 'Quantum Eclipse', required: true, half: true },
  { key: 'domain', label: 'Domain', placeholder: 'https://quantum-eclipse.1now.app', half: true },
  { key: 'country', label: 'Country Name', placeholder: 'Pakistan', half: true },
  { key: 'phone', label: 'Phone Number', placeholder: '+1 555 0148', type: 'tel', half: true },
  { key: 'address', label: 'Main Address', placeholder: 'Lahore, Pakistan' },
  { key: 'email', label: 'Company Email', placeholder: 'hello@company.com', required: true, type: 'email' },
  { key: 'tagline', label: 'Tagline', placeholder: 'Premium rentals, effortless booking.' },
]

const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.key, '']))

export default function CompanyInfo() {
  return (
    <FeaturePage
      type="business_card"
      section="business_card"
      breadcrumb={['Settings', 'General', 'Company Info']}
      tabs={['Company Info', 'Company States', 'Company Locations', 'Vehicle Categories', 'Vehicle Features', 'Extras', 'Other Settings']}
      panelTitle="Company Information"
      recordId="#1979"
      generateLabel="Generate Business Card"
      fields={FIELDS}
      defaults={DEFAULTS}
    />
  )
}
