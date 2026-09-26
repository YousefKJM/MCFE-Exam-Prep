import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: served at https://<user>.github.io/MCFE-Exam-Prep/
export default defineConfig({
  plugins: [react()],
  base: "/MCFE-Exam-Prep/",
});
