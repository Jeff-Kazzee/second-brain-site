import { ThemeProvider } from "@/components/theme-provider";
import Landing from "@/pages/Landing";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Landing />
    </ThemeProvider>
  );
}
