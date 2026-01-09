// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "folder.fill": "folder",
  "message.fill": "chat",
  "star.fill": "star",
  "person.fill": "person",
  "heart.fill": "favorite",
  "doc.fill": "description",
  "photo.fill": "image",
  "lock.fill": "lock",
  "envelope.fill": "email",
  "magnifyingglass": "search",
  "plus": "add",
  "xmark": "close",
  "checkmark": "check",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "gear": "settings",
  "bell.fill": "notifications",
  "hand.thumbsup.fill": "thumb-up",
  "bubble.left.fill": "comment",
  "square.and.arrow.up": "share",
  "arrow.down.doc.fill": "download",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  "chevron.left": "chevron-left",
  "clock.fill": "schedule",
  "person.2.fill": "people",
  "shield.fill": "shield",
  "camera.fill": "camera-alt",
  "pencil": "edit",
  "trash.fill": "delete",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "gift.fill": "card-giftcard",
  "megaphone.fill": "campaign",
  "doc.text.fill": "article",
  "chart.bar.fill": "bar-chart",
  "link": "link",
  "calendar": "event",
  "building.2.fill": "business",
  "phone.fill": "phone",
  "questionmark.circle.fill": "help",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
