import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import VisitorEntryCard from "../../components/VisitorEntryCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function VisitorInformation({ route }: any) {
  const {
    primaryMember = "Tehreem",
    visitorsCount = 2,
    vehiclesCount = 1,
    status = "pending",
    startDateTime = new Date().toISOString(),
    endDateTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
  } = route?.params ?? {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitor Information</Text>
        <Text style={styles.headerSubtitle}>
          Review your visitor entry details
        </Text>
      </View>

      {/* Card */}
      <VisitorEntryCard
        primaryMember={primaryMember}
        visitorsCount={visitorsCount}
        vehiclesCount={vehiclesCount}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        status="pending"
      />
      <VisitorEntryCard
        primaryMember={primaryMember}
        visitorsCount={visitorsCount}
        vehiclesCount={vehiclesCount}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        status="approved"
      />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    padding: 20,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

});
