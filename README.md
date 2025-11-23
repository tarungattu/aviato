# 3D Portfolio for Tarun Gattu

A minimalist 3D portfolio site featuring a stylized plane navigation metaphor, built with React, React Three Fiber, and Tailwind CSS.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install react react-dom three @types/three @react-three/fiber @react-three/drei lucide-react framer-motion
    # Dev dependencies
    npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom autoprefixer postcss
    ```
    *Note: Since this is a generated response, ensure your package.json scripts are set up for Vite.*

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Customization

*   **Content:** Edit `src/data.ts` to update text, projects, skills, and timeline. The types are defined in `src/types.ts`.
*   **3D Model:** The plane is currently a procedural code-generated model (`src/components/LowPolyPlane.tsx`) to ensure it runs without external assets. To use a `.gltf` model:
    1.  Place your model in the `public/` folder.
    2.  Use `gltfjsx` to generate a React component or use `useGLTF` in a new component.
    3.  Replace `<LowPolyPlane />` in `src/components/World.tsx`.
*   **Camera Waypoints:** Modify `CAMERA_POSITIONS` in `src/components/World.tsx` to change where the camera moves for each section.

## Architecture

*   **`App.tsx`**: Main entry, handles state (`activeSection`) and keyboard inputs.
*   **`World.tsx`**: The R3F Canvas. Handles camera interpolation logic based on the active section.
*   **`Overlay.tsx`**: The HTML UI. Displays content panels based on state. Standard Tailwind styling.
*   **`LowPolyPlane.tsx`**: A purely code-based geometric plane (no GLTF loader required for initial demo).

## Performance

*   Uses `LowPolyPlane` to avoid heavy asset downloading.
*   Uses `isReducedMotion` to stop animations for accessibility.
*   Lazy loads 3D elements via Suspense.
