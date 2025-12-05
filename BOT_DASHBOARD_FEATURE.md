# Bot Management Dashboard Feature

## Overview
A comprehensive bot management component for the dashboard that displays all user's bots with their competition usage and enforces competition-specific bot usage rules.

## Feature Highlights

### 1. **Bot Cards with Competition Usage**
- Displays all bots registered by the user
- Shows which competitions each bot is used in
- Visual indicators for payment status (Completed/Pending)
- Bot specifications (weight, dimensions, weapon type)

### 2. **Competition-Specific Rules Display**
Clearly shows the bot usage rules for each competition:

#### RoboWars ⚔️
- **Rule**: One bot per entry
- **Restriction**: Each competition entry must use a unique bot
- **Color**: Red indicator
- **Validation**: Warns if same bot is used multiple times

#### RoboRace 🏁
- **Rule**: Same bot, multiple entries allowed
- **Flexibility**: Can reuse same bot for multiple entries
- **Color**: Blue indicator

#### RoboSoccer ⚽
- **Rule**: Same bot, multiple entries allowed
- **Flexibility**: Can reuse same bot for multiple entries
- **Color**: Green indicator

### 3. **Rule Violation Detection**
- Automatically detects when a bot is used in multiple RoboWars entries
- Displays warning message for rule violations
- Helps users avoid registration errors

## Component Structure

### File Location
```
src/components/BotManagement.tsx
```

### Integration
```typescript
// In dashboard page
import { BotManagement } from '@/components/BotManagement'

<BotManagement 
  bots={botsWithUsage} 
  isLoading={loadingBots} 
  onRefresh={handleRefreshBots}
/>
```

## Data Structure

### BotWithUsage Interface
```typescript
interface BotWithUsage {
  id: string | null
  bot_name: string
  weight: number
  dimensions: string
  weapon_type?: string | null
  is_weapon_bot: boolean
  team_id?: string
  created_at?: string | null
  competitions: CompetitionUsage[]
}
```

### CompetitionUsage Interface
```typescript
interface CompetitionUsage {
  competition_type: string
  competition_name: string
  payment_status: string
  registration_status: string
}
```

## Dashboard Integration

### State Management
```typescript
const [botsWithUsage, setBotsWithUsage] = useState<BotWithUsage[]>([])
const [loadingBots, setLoadingBots] = useState(false)
```

### Data Fetching
```typescript
const fetchBotsWithUsage = async (regData: RegistrationData) => {
  // Maps bots from registration data
  // Associates each bot with its competitions
  // Returns bot array with competition usage
}
```

### Refresh Functionality
```typescript
const handleRefreshBots = async () => {
  // Fetches latest registration data
  // Updates bot list with current competition usage
  // Reflects payment status changes
}
```

## UI Features

### 1. **Bot Card Layout**
```
┌─────────────────────────────────────┐
│ Bot Name                     🔧 Hammer│
│ ⚖️ 15kg  📏 40x40x40cm            │
├─────────────────────────────────────┤
│ 🏆 Used in Competitions            │
│ ┌─────────────────────────────────┐ │
│ │ ⚔️ RoboWars         ✓ Confirmed│ │
│ │ 🏁 RoboRace         ⏳ Pending │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│         [View Details]              │
└─────────────────────────────────────┘
```

### 2. **Competition Rules Info Box**
```
╔═══════════════════════════════════════╗
║ ⓘ Bot Usage Rules by Competition     ║
║                                       ║
║ ⚔️ RoboWars: One bot per entry       ║
║    Each entry requires a unique bot   ║
║                                       ║
║ 🏁 RoboRace: Same bot, multiple      ║
║    Can use same bot for entries      ║
║                                       ║
║ ⚽ RoboSoccer: Same bot, multiple    ║
║    Can use same bot for entries      ║
╚═══════════════════════════════════════╝
```

### 3. **Rule Violation Warning**
```
┌─────────────────────────────────────┐
│ ⚠️ Rule Violation:                  │
│ RoboWars allows only one bot per    │
│ entry. This bot is used in 2        │
│ RoboWars entries.                   │
└─────────────────────────────────────┘
```

## Animation Features

### Framer Motion Animations
1. **Card Entry**: Staggered fade-in with Y-axis translation
2. **Hover Effects**: Scale animation on buttons and cards
3. **Loading State**: Rotating spinner animation
4. **Empty State**: Fade-in for empty bot list

## User Interactions

### Actions Available
1. **Refresh**: Update bot list and competition status
2. **View Details**: Navigate to bot details page (future feature)
3. **Register New Bot**: Navigate to competition registration
4. **Visual Feedback**: Payment status indicators

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width bot cards
- Stacked competition indicators

### Desktop (≥ 768px)
- Two-column grid layout
- Side-by-side bot cards
- Optimized spacing

## Status Indicators

### Payment Status
- ✓ Confirmed (Green) - Payment completed
- ⏳ Pending (Yellow) - Payment pending
- Both with background color and border styling

### Bot Features
- 🔧 Weapon Bot - Badge for bots with weapons
- Shows weapon type when applicable

## Error States

### No Bots Registered
```
┌─────────────────────────────────────┐
│          🤖                         │
│   No bots registered yet            │
│                                     │
│   [Register for Competition]        │
└─────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────┐
│          ⟲                          │
│     Loading bots...                 │
└─────────────────────────────────────┘
```

## Competition Color Coding

### Visual Consistency
- **RoboWars**: Red theme (`text-red-600`)
- **RoboRace**: Blue theme (`text-blue-600`)
- **RoboSoccer**: Green theme (`text-green-600`)

## Usage Examples

### Basic Integration
```typescript
<BotManagement 
  bots={botsWithUsage} 
  isLoading={false}
/>
```

### With Refresh Handler
```typescript
<BotManagement 
  bots={botsWithUsage} 
  isLoading={loadingBots} 
  onRefresh={handleRefreshBots}
/>
```

### Loading State
```typescript
<BotManagement 
  bots={[]} 
  isLoading={true}
/>
```

## API Integration

### Data Source
The component consumes data from `/api/check-registration`:
- Fetches user's bots from `savedBots` array
- Gets competition registrations from `registeredCompetitions`
- Maps bots to their associated competitions

### Data Processing
```typescript
// In Dashboard
const botsWithCompetitions = regData.savedBots.map(bot => {
  const competitions = regData.registeredCompetitions
    .filter(comp => comp.bot_id === bot.id)
    .map(comp => ({
      competition_type: comp.competition_type,
      competition_name: COMPETITIONS[comp.competition_type]?.name,
      payment_status: comp.payment_status,
      registration_status: comp.registration_status
    }))
  
  return { ...bot, competitions }
})
```

## Validation Logic

### RoboWars Rule Enforcement
```typescript
// Detect multiple RoboWars entries for same bot
const roboWarsCount = bot.competitions.filter(
  c => c.competition_type === 'ROBOWARS'
).length

if (roboWarsCount > 1) {
  // Show warning message
}
```

## Performance Considerations

### Optimization Strategies
1. **Memoization**: Bot data processed once on load
2. **Conditional Rendering**: Only renders when data available
3. **Lazy Loading**: Animations triggered on viewport entry
4. **Efficient Filtering**: Uses array methods for competition matching

## Future Enhancements

### Planned Features
1. **Bot Details Modal**: Click to view full bot specifications
2. **Edit Bot**: Update bot information
3. **Delete Bot**: Remove bot from team (with validation)
4. **Bot Images**: Upload and display bot photos
5. **Competition History**: Show past competition results
6. **Performance Metrics**: Track bot performance stats

## Testing Scenarios

### Test Cases
1. ✅ Display bots with no competitions
2. ✅ Display bots used in single competition
3. ✅ Display bots used in multiple competitions
4. ✅ Detect RoboWars rule violation
5. ✅ Show loading state
6. ✅ Show empty state
7. ✅ Refresh functionality
8. ✅ Responsive layout
9. ✅ Payment status indicators
10. ✅ Weapon bot badge display

## Accessibility

### Features
- Semantic HTML structure
- Clear visual hierarchy
- Color-coded status indicators
- Icon + text combinations
- Keyboard navigable buttons
- Screen reader friendly labels

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Required Libraries
```json
{
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "next": "^15.x",
  "react": "^18.x"
}
```

## File Structure
```
src/
├── components/
│   └── BotManagement.tsx          # Main component
├── app/
│   └── dashboard/
│       └── page.tsx               # Dashboard integration
└── types/
    └── global.d.ts                # Type definitions
```

## Summary

The Bot Management Dashboard feature provides:
✅ **Clear visualization** of all user bots
✅ **Competition usage tracking** for each bot
✅ **Rule enforcement** for competition-specific restrictions
✅ **Visual indicators** for payment and registration status
✅ **Responsive design** for all screen sizes
✅ **Interactive animations** for better UX
✅ **Real-time updates** with refresh functionality

This feature enhances the user experience by providing complete transparency about bot usage across competitions and helps prevent registration errors by clearly displaying the rules for each competition type.
