# OBSIDIAN | Digital Architecture Collective

![Obsidian Studio](https://placehold.co/1200x600/050505/FFF/png?text=OBSIDIAN+STUDIO)

> "We do not just build structures; we curate atmospheres."

**OBSIDIAN** is a cutting-edge portfolio and digital experience platform designed with a **Luxurious Brutalist** aesthetic. It blends immersive web audio, WebGL-like interactions, and kinetic typography to present architectural work as a living entity.

Built with **Next.js 16** and **Tailwind CSS v4**, this project pushes the boundaries of standard web design with a custom-built, file-based CMS for complete autonomy.

---

## 🌑 Key Features

### 🏛 Immersive Frontend
*   **3D Parallax Carousel**: A custom-built cylindrical carousel that rotates and skews based on scroll velocity and mouse tilts.
*   **Sonic Atmosphere**: Integrated `SoundManager` providing an immersive ambient drone and satisfying UI click mechanics (toggleable).
*   **Kinetic Interactions**:
    *   Canvas-based Particle Mouse Trail.
    *   "Concrete Curtain" dramatic page transitions.
    *   Liquid/Lava text masking effects.
    *   Custom magnetic cursors.

### 🔐 Headless-style CMS (Local)
A fully functional, secure Admin Portal built directly into the app:
*   **Three-Pill Management**: Manage **Work** (Projects), **Studio** (Text content), and **Contact** (Socials) via distinct tabs.
*   **Authentication**: Secure login protection for the `/admin` route.
*   **Smart Media Handling**:
    *   **Direct File Upload**: Upload images directly to the server.
    *   **Intelligent Cropping**: Automatically detects invalid aspect ratios and launches an in-app **Image Cropper** to enforce the strict design guidelines (Portrait Ratio).
*   **Brutalist UI Components**: Custom Toast Notifications and Modals that match the site's design language, replacing default browser alerts.

---

## 🛠 Technology Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Language**: TypeScript
*   **Data**: JSON-based flat-file database (No external database required)
*   **Tools**: `lucide-react`, `react-easy-crop`, `sharp`

---

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/mrhdayat/obsidian-app.git
    cd obsidian-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open the App**:
    Visit `http://localhost:3000` to see the live site.

---

## 🔓 Admin Access

To manage the content, navigate to `/admin`.

*   **URL**: `http://localhost:3000/admin`
*   **Username**: `admin`
*   **Password**: `obsidian2025`

> **Note**: This project uses a JSON-based database located in `/data`. In a production environment (Vercel/Netlify), these files are ephemeral. For permanent storage in production, consider connecting the existing API routes to a cloud database like Supabase or MongoDB.

---

## 📂 Project Structure

```bash
.
├── app/
│   ├── admin/         # CMS Dashboard (Protected)
│   ├── api/           # Backend API Routes (Projects, Content, Uploads)
│   ├── login/         # Security Gate
│   ├── studio/        # Studio Page (Dynamic)
│   ├── work/          # Work Index (Dynamic)
│   └── layout.tsx     # Root Layout (Sound, Cursor, Transition Providers)
├── components/
│   ├── ui/            # Reusable components (Carousel, Modal, Toasts, Cropper)
│   └── layout/        # Header, SmoothScroll
├── data/
│   ├── content.json   # Text content database
│   └── projects.json  # Portfolio database
├── public/
│   └── uploads/       # Uploaded media storage
└── lib/               # Utilities
```

---

## 🎨 Design Philosophy

The design follows a strict "Digital Branding" philosophy:
*   **Typography**: Oswald (Headers, Uppercase) & Inter (Body, Mono).
*   **Colors**: #050505 (Void Black) & White.
*   **Interaction**: Every click and hover must feel "heavy" and significant.

---

## © Credits

Developed by **Draco Seven** (System).
Concept for **Obsidian Arch**.
