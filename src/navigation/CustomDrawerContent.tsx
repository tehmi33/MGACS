import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../context/AuthContext";

const CustomDrawerContent = (props: any) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { logout, untrustAllDevices, firstName } = auth;

  const handleLogout = () => {
  logout();
};

const handleUntrust = () => {
  untrustAllDevices();
};

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <Icon name="account-circle" size={60} color="blue" />
          <Text style={styles.username}>
            {firstName || "User"}
          </Text>
        </View>
      </DrawerContentScrollView>

      {/* Bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleUntrust}>
          <Icon name="security" size={22} color="#F44336" />
          <Text style={styles.actionText}>Untrust Devices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
          <Icon name="logout" size={22} color="#F44336" />
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  username: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 15,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#F44336",
  },
});
