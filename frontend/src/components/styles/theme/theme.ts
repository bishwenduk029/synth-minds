import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      "50": "#E9FBF1",
      "100": "#C2F4D9",
      "200": "#9BEEC1",
      "300": "#74E7A8",
      "400": "#4DE090",
      "500": "#26D977",
      "600": "#1EAE5F",
      "700": "#178247",
      "800": "#0F5730",
      "900": "#082B18",
    },
    beige: {
      50: "#D7D5D4",
      100: "#CDCACA",
      200: "#B9B6B5",
      300: "#A5A1A0",
      400: "#918D8B",
      500: "#7D7876",
      600: "#605C5B",
      700: "#434140",
      800: "#262524",
      900: "#0A0909",
    },
    main: {
      dark: "rgb(45, 55, 72)",
      font: "#fff",
    },
  },
  styles: {
    global: {
      body: {
        bg: "rgb(45, 55, 72)",
      },
    },
  },
  components: {
    Button: {
      variants: {
        brand: {
          transition: "all 0.2s",
          bg: "brand.400",
          shadow: "lg",
          borderWidth: "1px",
          borderColor: "blackAlpha.100",
          _hover: {
            shadow: "md",
          },
        },
      },
    },
    Link: {
      variants: {
        brand: {
          transition: "all 0.2s",
          bg: "brand.500",
          color: "blackAlpha.700",
          shadow: "lg",
          borderWidth: "1px",
          borderColor: "blackAlpha.100",
          _hover: {
            shadow: "md",
          },
        },
      },
    },
  },
});

export default theme;
