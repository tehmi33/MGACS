import React from "react";
import { SafeAreaViewBase, View , StyleSheet} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

export  default function GradiantLayout(props: any) {
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#2563EB', '#1E40AF']}
                style={styles.gradient}
            >
              <SafeAreaViewBase style={styles.safe}>{props.children}</SafeAreaViewBase>
            </LinearGradient>
        </View>
    );
};
const styles = StyleSheet.create({
 gradient:{
    flex:1,
 },
 safe:{
    flex:1
 }
});

