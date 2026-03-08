Starting out, my thought process whenever I am starting on a new project is scaffolding an MVP (Minimum viable product). The time expectation being 2-3 hours, means that I need to move quick, especially when some of the frameworks and tools are unfamiliar to me. I can optimize afterwards as time allows, but I want to make sure I hit all the core functionality and test and make sure everything works before adding additional styling or other improvements. 

## **Architecture Decisions & Trade-offs**
- The first thing I did after creating the git repository was leveraging a supabase starter template to help save time, as I have not used Supabase before. `npx create-next-app -e with-supabase`. This helped me build out the basic project structure, and saved me having to write a lot of authorization boilerplate.

- Another decision I had to make early on was choosing sonner over toast. This was because shadcn has deprecated the toast component. Even though toast is what I am most familiar with, and have used in the past, I wanted to make sure I didn't implement a component that would quickly have to be fixed/replaced. Technical debt is never a wise choice, especially when I could nip it in the bud early.

- I ran into some errors pretty early in my testing due to a lack of suspense boundaries. This was something I had seen before at my previous place of employment, so I knew quickly that I needed to add them for all async data accesses, which helps the page function while data is loading, and overall improves the user experience.

- I also decided early that I wanted to implement Google OAuth and deploy to Vercel, so I had to setup accounts and secret management for these.

- Decided on a one-to-many relationship for events -> venues, for simplicity. One event can have multiple venues. Additionally, made deletes cascade for events -> venues. There are other ways to solve the problem of having "orphaned" data after a delete (since a venue depends on its relationship to an event), but having it automatically handled by the db is easiest in this use-case. In some other situations, it also makes sense to block users from deleting data that has other data dependant on it (forcing the user wants to clean it up themselves), but it depends on the context in my opinion.

- Leveraged RLS in Supabase to ensure users can't alter other user's events, even if they try to workaround the application code. Just an additional layer of security.

- Added a timer to the search component to prevent the onChange event from firing every keystroke. This helps prevent unnecessary database calls. This is a more responsive solution than requiring the user to hit Enter or press a button to actually fire off the search.

- Server Actions over API routes is something I was not super familiar with, but now that I have learned a little about it, I'm fully onboard with it. Anything that reduces boilerplate code is a win in my book, and this functionality in Next.js seems super powerful. I am surprised I wasn't very aware of this. Obviously with something like a mobile app, there are still benefits to building out REST api endpoints, but for this project, and most web application use cases, Server Actions seem significantly better.

- Added a safeAction wrapper for error handling and type consistency. Having a central location for this makes it easier to maintain and guarantees consistent responses.

## **Improvements I would make with more time**
- Unit/Integration tests. This is probably the single most important thing I would add. At my first job, when I started, there were no unit tests on our monolith legacy webapp, which was over 300k lines of code. Which meant every code change, no matter how small, was terrifyingly dangerous. Adding unit tests, especially early, helps you make code changes in confidence, and improves code quality and maintainability. It also makes the code easier to understand, as you can leverage the tests to understand edge cases and design choices of the original developers.

- Adding pagination. For a demo/small web-app like this, I didn't worry about it, but obviously this would never scale to production.

- I am a big fan of optimistic UI updates. It improves the user experience, and looks clean when done properly. For example, when updating the event, you could assume the database/api calls would succeed (revert them later if they don't) and utilize toast/sonner notifications to let the user know once the actions were successful/unsuccessful.

- Allow individual venue editing instead of full replacement. Fully replacing was a time-saving maneuver, and didn't really affect functionality, but I would definitely want to make sure I optimized this before this went to prod.

- Add alert dialog component to confirm deletes so UI is more complete.

## Running Project Locally
1. Clone the repo
2. `npm install`
3. Create a `.env.local` with your Supabase URL and anon key
4. `npm run dev`
5. Visit `http://localhost:3000`