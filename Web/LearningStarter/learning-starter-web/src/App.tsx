import { Routes } from "./routes/config";
import { AuthProvider } from "./authentication/use-auth";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  Container,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { SearchProvider } from "./context/search-context";
import { CartProvider } from "./context/cart-context";


function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme: colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider position="top-right" autoClose={3000} limit={5}>
          <Container
            fluid
            px={0}
            className="App"
          >
            <AuthProvider>
              <SearchProvider>
                <CartProvider>
                  <Routes />
                </CartProvider>
              </SearchProvider>
            </AuthProvider>
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
