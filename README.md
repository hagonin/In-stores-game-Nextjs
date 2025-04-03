# NexusHub: In-Game Store Platform

A responsive game marketplace built with Next.js, featuring a carousel banner, infinite scroll for game discovery, and a responsive grid layout.

## Setup Instructions

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/hagonin/in-game-stores.git
   cd in-game-stores
   ```

2. Install dependencies

   ```
   npm install
   # or
   yarn install
   ```

3. Environment Setup

   - Create a `.env.local` file in the root directory
   - Add your RAWG API key:
     ```
     NEXT_PUBLIC_RAWG_API_KEY=your_api_key_here
     ```
   - Get your API key from [RAWG.io](https://rawg.io/apidocs)

4. Start the development server

   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Key Features

### 1. Interactive Carousel Banner

A modern, touch-friendly banner that shows off featured games:

- Swipe or drag to move between games on different screens.
- Infinte cycle carousel
- Navigate manually with intuitive control buttons.

### 2. Smart Grid Layout

A clean, organized way to display games on any screen size:

- Games arrange themselves on different screens
- Cards maintain consistent sizing
- Hover over a game to see additional details
- Easy to use with keyboard
- Smooth animations when interacting with game cards

### 3. Infinite Scroll

- Load new games automatically when scrolling down
- Show loading animations
- Prevent duplicate games from appearing in results
- Handle error
- Back-to-top button when scrolling far down

## Time Allocation Reflection

**Project Planning (20%):**

- Reviewing designs and planning component structure
- Researching API capabilities and limitations
- Setting up the project architecture with AI-agent to create a skeleton structure

**Core Functionality (65%):**

- Implementing API service and data fetching logic
- Building the responsive grid with proper spacing and alignment
- Creating the carousel banner with animation effects
- Developing the infinite scroll behavior with appropriate loading states
- Adding hover animations and transitions (combining Tailwind and Framer Motion)

**Polish and Refinements (15%):**

- Optimizing performance with proper React patterns
- Implementing error handling and fallbacks
- Setting up tests across devices (implementation in progress)

I focused on three main components:

- **Carousel banner**: The first element users see, designed to feel dynamic and polished
- **Infinite scroll**: Connection with the API to load more content when scrolling down
- **Responsive grid view**: Essential for showcasing games and testing the infinite scroll feature

## Technical Challenges & Solutions

### 1. Responsive Grid Layout with Consistent Card Sizes

**Challenge**: Cards of different heights and widths caused layout issues when screen sizes changed.  
**Solution**: Implemented CSS Grid with auto-fill and minmax() functions, used dynamic height classes based on screen size, and applied aspect ratio techniques.

### 2. Infinite Scroll with API Pagination

**Challenge**: The API returned duplicate results when scrolling down.  
**Solution**: Used Intersection Observer API (instead of scroll events), added skeleton loading states, and filtered out duplicates from results.

### 3. Touch Device Compatibility

**Challenge**: Hover effects didn't work properly on touch devices.  
**Solution**: Used Framer Motion's `MotionConfig` and `drag` props combined with Tailwind's responsive classes (`md:`, `lg:`) for responsive hover animations.

Due to time constraints, I focused on implementing the core functionality of the carousel banner, grid view, and infinite scroll, while prioritizing a clean and modular codebase. The optional "Store Administration Interface Concept" was not implemented in this submission.

## Future Enhancements

With additional time, I would implement:

### 1. Admin Interface

- Drag-and-drop product manager
- Scheduling system for promotional events
- Preview mode before publishing

### 2. User Experience Improvements

- Filtering and sorting capabilities
- Search with auto-suggestions
- Enhanced mobile-friendly touch controls

### 3. Performance Optimizations

- Better image optimization techniques
- Virtualized lists for extremely large catalogs
- Client-side caching to reduce redundant API calls

## Technologies Used

- **Next.js**: React framework for SSR and API routes
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Axios**: HTTP client for API requests
- **RAWG API**: Game data source

## Testing

The project includes comprehensive test coverage for key features:

### Running Tests

```bash
# Run tests once
npx test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

- **Infinite Scroll**: Tests for proper loading, intersection detection, and data handling
- **Scroll-to-Top Button**: Tests for visibility, click handling, and scrolling behavior
- **Integration Tests**: Tests for component interactions and state management

## License

MIT
