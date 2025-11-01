
# AI Tools Showcase

This project is a modern, feature-rich web application designed to showcase a curated list of AI tools. It provides a platform for users to discover, review, and discuss the latest advancements in artificial intelligence. The application includes a dynamic AI tool directory, a full-featured blog, and a user-driven ratings and reviews system.

Built with a focus on security, performance, and user experience, this platform leverages a powerful stack including React, Vite, Supabase, and Tailwind CSS.

---

## ✨ Core Features

- **AI Tool Directory:** Browse a comprehensive list of AI tools, filterable by category. Each tool has a dedicated page with a description, key features, and a direct link to the official website.
- **User Authentication:** Secure user sign-up and login functionality powered by Supabase Auth.
- **Blog Platform:** A fully implemented blog where users can read and create posts. The blog is built with a modern, clean UI and supports user-specific content.
- **User Ratings and Reviews:** A five-star rating system and comments section on each tool's page. Only logged-in users can contribute, and security policies prevent duplicate or unauthorized reviews.
- **Secure by Design:** The application is built with Supabase's Row Level Security (RLS) to ensure data is accessed safely and securely.

---

## 🚀 Technology Stack

- **Frontend:** [React](https://react.dev/) with [Vite](https://vitejs.dev/) for a fast and modern development experience.
- **Backend & Database:** [Supabase](https://supabase.com/) for the PostgreSQL database, authentication, and auto-generated APIs.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) for a utility-first CSS framework that enables rapid UI development.
- **Routing:** [React Router](https://reactrouter.com/) for declarative routing.
- **Icons:** [Lucide React](https://lucide.dev/) for a beautiful and consistent icon set.

---

## 🛠️ Getting Started

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to the **SQL Editor** and run all the migration scripts located in the `supabase/migrations` directory of this project. This will create the necessary tables (`ai_tools`, `posts`, `reviews`) and security policies.
3.  In your Supabase project, go to **Project Settings** > **API**.
4.  Find your **Project URL** and your `anon` **Public Key**.

### 4. Environment Variables

Create a `.env` file in the root of the project and add your Supabase credentials:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

### 5. Run the Development Server

```bash
npm run dev
```

The application should now be running on `http://localhost:5173`.

---

## 📄 Database Schema

- **`ai_tools`**: Stores the list of AI tools, including their name, description, category, and other metadata.
- **`posts`**: Contains all blog posts, linking to the `user_id` of the author.
- **`reviews`**: Manages user-submitted ratings and comments for each AI tool. It is secured with policies to ensure users can only create or manage their own reviews.
- **`users_public_data`**: A database view that safely exposes non-sensitive user data (like names) to the public, used for displaying author and reviewer names.
