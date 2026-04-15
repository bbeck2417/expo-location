import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "ghostwhite",
  },

  // This ensures the map fills the entire screen
  mapView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  // A container for your text so it's readable over the map
  infoBox: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(248, 248, 255, 0.9)", // 'ghostwhite' with transparency
    padding: 15,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  label: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },

  address: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
});
