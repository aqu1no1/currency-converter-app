import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';

import { Icon } from '@components/icons/Icon';
import type { IconName } from '@constants/icons';
import { FONTS, TYPE } from '@constants/theme';
import { useTheme } from '@theme/ThemeProvider';

type TabName = 'home' | 'converter' | 'rates' | 'history' | 'settings';
type AppTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICONS: Record<TabName, IconName> = {
  home: 'home',
  converter: 'converter',
  rates: 'rates',
  history: 'history',
  settings: 'settings',
};

/**
 * Barra de abas flutuante do app, com as 5 abas principais.
 *
 * Fica sobre o fundo da tela, com a aba ativa em verde-menta, e vibra de leve
 * ao trocar de aba. Respeita a área segura inferior do aparelho.
 *
 * @example
 * ```tsx
 * <Tabs tabBar={(props) => <AppTabBar {...props} />} />
 * ```
 */
export function AppTabBar({ state, descriptors, navigation }: AppTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingBottom: Math.max(insets.bottom, 14),
      }}
    >
      <View
        accessibilityRole="tablist"
        style={[styles.container, { backgroundColor: colors.primary }]}
      >
        {state.routes.map((route, index) => {
          const name = route.name as TabName;
          const focused = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  void Haptics.selectionAsync().catch(() => undefined);
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={({ pressed }) => [
                styles.tab,
                focused && { backgroundColor: colors.accent },
                pressed && styles.pressed,
              ]}
            >
              <Icon
                name={TAB_ICONS[name]}
                size={21}
                color={focused ? colors.textOnAccent : colors.textOnBrandMuted}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  { color: focused ? colors.textOnAccent : colors.textOnBrandMuted },
                  focused && styles.activeLabel,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 12,
    padding: 6,
    gap: 2,
    borderRadius: 26,
  },
  tab: {
    minHeight: 54,
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 2,
  },
  label: { fontFamily: FONTS.bodyMedium, fontSize: TYPE.tab },
  activeLabel: { fontFamily: FONTS.bodySemiBold },
  pressed: { transform: [{ scale: 0.97 }] },
});
