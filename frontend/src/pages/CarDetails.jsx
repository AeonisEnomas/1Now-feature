import FeaturePage from '../components/FeaturePage'

const FIELDS = [
  { key: 'image', label: 'Vehicle photo', type: 'image', hint: 'A clear photo of the car · shown on the post' },
  { key: 'year', label: 'Year', placeholder: '2023', required: true, half: true },
  { key: 'make', label: 'Make', placeholder: 'Tesla', required: true, half: true },
  { key: 'model', label: 'Model', placeholder: 'Model 3', required: true, half: true },
  { key: 'price', label: 'Daily Price', placeholder: '$89', required: true, half: true },
  { key: 'transmission', label: 'Transmission', type: 'select', options: ['Automatic', 'Manual'], half: true },
  { key: 'fuel', label: 'Fuel Type', type: 'select', options: ['Electric', 'Hybrid', 'Petrol', 'Diesel'], half: true },
  { key: 'seats', label: 'Seats', placeholder: '5', type: 'number', half: true },
  { key: 'mileage', label: 'Mileage / Range', placeholder: '350 mi range', half: true },
  { key: 'location', label: 'Pickup Location', placeholder: 'Los Angeles, CA', half: true },
  { key: 'badge', label: 'Badge', placeholder: 'Available Now', half: true },
  { key: 'tagline', label: 'Tagline', placeholder: 'Drive in style this weekend.', half: true },
  { key: 'cta', label: 'Call to action', placeholder: 'DM to book', half: true },
]

const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.key, '']))

export default function CarDetails() {
  return (
    <FeaturePage
      type="car_post"
      section="car_post"
      breadcrumb={['Fleet', 'Vehicles', 'Car Details']}
      tabs={['Details', 'Pricing', 'Availability', 'Photos', 'Documents']}
      panelTitle="Vehicle Information"
      recordId="#A-204"
      generateLabel="Generate Car Post"
      fields={FIELDS}
      defaults={DEFAULTS}
    />
  )
}
