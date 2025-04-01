
# NexusHub: In-Game Store Platform

A modern, responsive game marketplace built with Next.js, featuring a carousel banner, infinite scroll for game discovery, and a responsive grid layout.

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

### 1. Carousel Banner

The carousel banner showcases featured games with smooth transitions and responsive design.

**Implementation Highlights:**
- Framer Motion animations for smooth transitions
- Responsive images that adapt to mobile and desktop
- Dynamic content loading from the API

### 2. Infinite Scroll

The infinite scroll implementation allows users to continuously discover games without pagination controls.

**Implementation Highlights:**
- Optimized API calls with debounce to prevent excessive requests
- Elegant loading states with skeleton placeholders
- Intelligent handling of duplicate results from the API
- End-of-content detection and smooth UX for scrolling back to top

### 3. Grid Layout

The responsive game grid adapts to any screen size while maintaining visual consistency.

**Implementation Highlights:**
- CSS Grid implementation with auto-fill and minmax for fluid layouts
- Consistent card sizing across viewports
- Animated hover effects for enhanced user interaction
- Accessibility considerations for keyboard navigation

## Time Allocation Reflection

**Project Planning (15%):**
- Reviewing designs and planning component structure
- Researching API capabilities and limitations
- Setting up the project architecture

**Core Functionality (60%):**
- Implementing API service and data fetching logic
- Building the responsive grid with proper spacing and alignment
- Creating the carousel banner with animation effects
- Developing the infinite scroll behavior with appropriate loading states

**Polish and Refinements (25%):**
- Optimizing performance with proper React patterns
- Adding hover animations and transitions
- Implementing error handling and fallbacks
- Testing across devices and fixing edge cases

The most challenging aspect was : 
- Balancing API efficiency with user experience, particularly in the infinite scroll implementation. 
- Handling potential duplicates from the API while maintaining smooth loading animations required careful state management. 
- Adapting the grid to various screen sizes and game counts required a flexible row configuration.

## Technologies Used

- **Next.js**: React framework for SSR and API routes
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Axios**: HTTP client for API requests
- **RAWG API**: Game data source

## License

MIT
