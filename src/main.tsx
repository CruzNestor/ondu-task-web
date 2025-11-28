import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import App from "./App.tsx";
import theme from "./assets/theme/MyTheme.ts";

import { CssBaseline, ThemeProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);