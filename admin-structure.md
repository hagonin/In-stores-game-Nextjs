** Structure of admin page : 
- Next.js + App Router for routing
- Axios for all external API communication
- React Query for state, mutations, and revalidation
- Typed modules using TypeScript for each domain
- Feature-first for clarity, scaling, and autonomy
- Authentication and role security via middleware and session helpers

** This is the main routing layer of the admin interface : 

/app
│
├── admin/
│   ├── layout.tsx                      # Admin layout (sidebar, header…)
│   ├── page.tsx                        # Admin dashboard (default landing)
│   │
│   ├── games/
│   │   ├── page.tsx                    # Game List (SSR)
│   │   ├── new/page.tsx                # Create game
│   │   ├── [id]/edit/page.tsx          # Edit game
│   │
│   ├── promotions/                     # Promotions management
│   │   ├── page.tsx
│   │   ├── new/page.tsx                # Banner management
│   │   ├── [id]/edit/page.tsx
│   │
│   ├── banners/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/edit/page.tsx
│   │  
│   ├── users/                          # Admin users and roles
│   │   ├── page.tsx                    # User list
│   │   ├── new/page.tsx                # Create user
│   │   ├── [id]/edit/page.tsx          # Edit user role/access
│   │                           
│   ├── settings/                       # System config, flags, preferences
│   │   ├── page.tsx
│   │           

/features
│
├── games/
│   ├── components/
│   │   ├── GameList.tsx                # Table of games with filters/actions
│   │   ├── GameForm.tsx                # Form for create/edit game
│   ├── api/
│   │   ├── gameService.ts              # Axios-based API functions
│   ├── hooks/
│   │   ├── useGames.ts                 # React Query hooks : fetch, create, update
│   ├── types.ts
│
├── promotions/
│   ├── components/                     # UI PromotionList, PromotionForm, PromoCalendarView
│   ├── api/
│   │   ├── promotionService.ts
│   ├── hooks/
│   │   ├── usePromotions.ts
│   │   ├── useCreatePromotion.ts                         
│   ├── types.ts
│
├── banners/
│   ├── components/                     # UI BannerList, BannerForm, BannerPreview
│   ├── api/
│   │   ├── bannerService.ts
│   ├── hooks/
│   │   ├── useBanners.ts
│   ├── types.ts
│
├── users/
│   ├── components/                     # UI UserList, UserForm, UserRoles
│   ├── api/
│   │   ├── userService.ts      
│   ├── hooks/  
│   │   ├── useUsers.ts
│   │   ├── useRoleManagement.ts
│   ├── types.ts
│
├── components/shared
│   ├── Sidebar.tsx                     # Main admin nav
│   ├── Topbar.tsx                      # Header with user info/logout
│   ├── Datatable.tsx                   # Customizable table
│   ├── Modal.tsx                       # Reusable dialog
│   ├── ConfirmDialog.tsx               # Confirm before actions
│   ├── StatCard.tsx                    # Metrics display
│   ├── EmptyState.tsx                  # Friendly fallback UI
│   ├── AsyncState.tsx                  # Loading/Error display
│   
├── lib/
│   ├── axios                           # Axios instance with interceptors, baseURL auth headers
│   │   ├── axiosClient.ts
│   
│   ├── auth
│   │   ├── middleware.ts               # Protects routes by user role
│   │   ├── getSessionUser.ts           # Get session user info
│   │   ├── checkPermission.ts          # Validate roles for actions
│   
├── styles/                             # Global styles and design tokens
│   ├── global.css
│   ├── theme.ts
│   ├── admin.ts
       
