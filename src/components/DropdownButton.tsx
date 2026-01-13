import React, { useRef, useState } from "react";
import { Modal } from "react-native";
import { Dimensions } from "react-native";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export interface MenuItem {
  label: string;
  icon?: string;
  iconType?: "feather" | "fontawesome";
  onPress: () => void;
}

interface Props {
  menuItems: MenuItem[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_MENU_WIDTH = SCREEN_WIDTH * 0.8;

/* ---------------- ICON SWITCHER ---------------- */

const MenuIcon = ({
  name,
  type = "feather",
}: {
  name: string;
  type?: "feather" | "fontawesome";
}) => {
  if (type === "fontawesome") {
    return <FontAwesomeIcon name={name} size={18} color="#4b5563" />;
  }
  return <FeatherIcon name={name} size={18} color="#4b5563" />;
};

/* ---------------- COMPONENT ---------------- */

const DropdownButton: React.FC<Props> = ({ menuItems }) => {
  const [open, setOpen] = useState(false);
  const [btnLayout, setBtnLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [menuWidth, setMenuWidth] = useState(0);
  const btnRef = useRef<View>(null);

  const isOverflowingRight =
    btnLayout.x + menuWidth > SCREEN_WIDTH - 8;

  const dropdownLeft = isOverflowingRight
    ? btnLayout.x + btnLayout.width - menuWidth
    : btnLayout.x;

  return (
    <>
      {/* Button wrapper */}
      <View ref={btnRef}>
        <Pressable
          onPress={() => {
            btnRef.current?.measureInWindow((x, y, width, height) => {
              setBtnLayout({ x, y, width, height });
              setOpen(true);
            });
          }}
          style={[
            styles.button,
            open ? styles.buttonOpened : styles.buttonClosed,
          ]}
        >
          <FeatherIcon name="plus" size={18} color={open ? "#E8EFFF" : "#004DFF"} />
          <FeatherIcon
            name="chevron-down"
            size={16}
            color={open ? "#E8EFFF" : "#004DFF"}
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>

      {/* Modal */}
      <Modal visible={open} transparent animationType="none">
        <Pressable style={styles.fullscreenOverlay} onPress={() => setOpen(false)} />

        {/* Dropdown positioned based on measured ABSOLUTE coordinates */}
        <View
          style={{
            position: "absolute",
            top: btnLayout.y + btnLayout.height,
            left: dropdownLeft,
            zIndex: 9999,
            maxWidth: MAX_MENU_WIDTH,
          }}
        >
          <View
            style={[styles.dropdown, { maxWidth: MAX_MENU_WIDTH }]}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setMenuWidth(Math.min(w, MAX_MENU_WIDTH));
            }}
          >
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.menuItem}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
              >
                {item.icon && (
                  <View style={{ marginRight: 8 }}>
                    <MenuIcon name={item.icon} type={item.iconType} />
                  </View>
                )}
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};


export default DropdownButton;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#004DFF",
  },
  buttonOpened: {
    backgroundColor: "#004DFF",
  },
  buttonClosed: {
    backgroundColor: "#E8EFFF",
  },

  fullscreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  dropdown: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 6,
    minWidth: 160,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  menuText: {
    fontSize: 14,
    color: "#374151",
  },

});
