# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProSono MVP is a sleep education web application built with React 19 and TypeScript, targeting students aged 15-18. The application focuses on evidence-based sleep education to improve academic performance and well-being.

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom sleep/health-focused color palette
- **Routing**: React Router v6 with protected routes
- **Code Quality**: Biome (linting + formatting)
- **Authentication**: JWT-based with automatic token refresh

## Development Commands

```bash
# Development
npm run dev              # Start development server (port 3000)

# Building & Quality
npm run build           # TypeScript compile + Vite build
npm run preview         # Preview production build
npm run type-check      # TypeScript validation without emitting

# Code Quality
npm run lint            # Check code with Biome
npm run lint:fix        # Auto-fix Biome issues
npm run format          # Format code with Biome
```

## Architecture

### Authentication System
- **Core**: `useAuth` hook provides global authentication state via React Context
- **Token Management**: Automatic JWT refresh in `services/api.ts` with localStorage persistence
- **Route Protection**: `ProtectedRoute` component wraps authenticated pages
- **API Integration**: Centralized `ApiService` class handles all HTTP requests with automatic token injection

### State Management Pattern
- React Context for global auth state (`hooks/useAuth.tsx`)
- Local component state with hooks for UI state
- No external state management library - leverages React 19's built-in patterns

### Custom Design System
- **Colors**: ProSono brand palette with sleep/health theme (primary: blues, accent: greens, secondary: purples, sleep: light blues)
- **Components**: Utility classes in `globals.css` (`.btn-primary`, `.input-field`, `.card`)
- **Typography**: Inter font family as default

### API Architecture
- **Base Service**: `services/api.ts` - Generic HTTP client with automatic auth
- **Domain Services**: 
  - `services/authService.ts` - Authentication-specific endpoints
  - `services/surveyService.ts` - Sleep assessment survey endpoints
  - `services/dailySurveyService.ts` - Daily sleep tracking endpoints
- **Error Handling**: Centralized API error types and handling
- **Environment**: API URL configurable via `VITE_API_URL` environment variable

### Sleep Tracking System
- **User Status Flow**: `pre_evaluation` → `sleep_tracking` → `post_evaluation`
- **Assessment**: 20-question true/false survey (POST /surveys) with automatic status progression
- **Daily Tracking**: Sleep data collection form (POST /daily-surveys) with edit capabilities
- **Dashboard Metrics**: Real-time display of streak, mean sleep duration, and survey scores
- **Data Structure**: User data includes nested `dailySurveys` object with dates, streak, and metrics

### Component Structure
- **Layout**: Header/Footer in `components/layout/` with responsive navigation
- **Auth Flow**: Login/Register forms with validation and error handling
- **Pages**: Landing (public), Dashboard, SleepAssessment, SleepTracking, and Profile (all protected)
- **Types**: Comprehensive TypeScript interfaces in `types/` directory

### API Data Structures

#### User Object (GET /user)
```typescript
interface User {
  email: string;
  firstName: string;
  lastName: string;
  status: 'pre_evaluation' | 'sleep_tracking' | 'post_evaluation';
  surveyScore?: number;
  dailySurveys: {
    target: number;
    dates: string[];          // Array of "YYYY-MM-DD" format dates
    streak: number;           // Consecutive days of sleep tracking
    meanSleepDuration: number; // Average sleep in minutes
  };
}
```

#### Daily Survey (POST /daily-surveys)
```typescript
interface DailySurveyData {
  horaLevantasteHoje: string;    // "HH:MM" format
  horaDeitasteOntem: string;     // "HH:MM" format  
  tempoAteAdormecer: number;     // Minutes to fall asleep
  vezesAcordasteNoite: number;   // Times woken up
  horasQueDormiste: number;      // Total sleep in minutes
  qualidadeSonoNoite: number;    // Sleep quality (0-5 scale)
  observacaoNoitePassada?: string; // Optional notes
}
```

### Development Notes
- Uses React 19 patterns (no explicit `React.FC`, direct imports)
- Strict TypeScript configuration with `exactOptionalPropertyTypes`
- Environment variables prefixed with `VITE_` for client-side access
- Mobile-first responsive design approach
- Dashboard auto-refreshes user data on load to sync latest status
- Sleep tracking form pre-populates when editing existing surveys