import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

/**
 * FooterLogos - Rodapé com as 4 logos em linha
 * Grupo ONE, Espaçolaser, Meta, TráfegON
 */
export function FooterLogos() {
  return (
    <View style={styles.container}>
      <View style={styles.logosRow}>
        <Image
          source={require("@/assets/images/logos/grupoone-branca.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Image
          source={require("@/assets/images/logos/espacolaser-branca.png")}
          style={styles.logoWide}
          contentFit="contain"
        />
        <Image
          source={require("@/assets/images/logos/meta-branca.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Image
          source={require("@/assets/images/logos/trafegon-branca.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#003FC3",
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
  },
  logosRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 24,
  },
  logoWide: {
    width: 80,
    height: 24,
  },
});
