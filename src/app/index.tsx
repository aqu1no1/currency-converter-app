import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInUp, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@components/brand/Logo';
import { Button } from '@components/ui/Button';
import { FloatingCoins } from '@components/welcome/FloatingCoins';
import { SUPPORTED_CURRENCIES } from '@constants/currencies.constants';
import { APP_ROUTES } from '@constants/routes.constants';
import { FONTS, RADIUS, SIZES, TYPE } from '@constants/theme';
import { useCurrencies } from '@hooks/useCurrencies';
import { useWelcomeGate } from '@hooks/useWelcomeGate';
import { useTheme } from '@theme/ThemeProvider';

const CONTENT_TOP = 56;
const ACTIONS_BOTTOM = 40;
const LOGO_SIZE = 200;

function rise(delay: number) {
  return FadeInUp.duration(500)
    .delay(delay)
    .easing(Easing.bezier(0.2, 0.7, 0.2, 1))
    .withInitialValues({ opacity: 0, transform: [{ translateY: 14 }] })
    .reduceMotion(ReduceMotion.System);
}

export default function Welcome() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate, replace } = useRouter();
  const insets = useSafeAreaInsets();
  const { data: currencies } = useCurrencies();
  const { isReady, shouldShowWelcome, completedOnLoad, markWelcomeCompleted } = useWelcomeGate();
  const currencyCodes = currencies?.length
    ? currencies.map(({ code }) => code)
    : SUPPORTED_CURRENCIES;

  useEffect(() => {
    if (isReady && completedOnLoad) replace(APP_ROUTES.home);
  }, [completedOnLoad, isReady, replace]);

  async function openConverter() {
    await markWelcomeCompleted();
    replace(APP_ROUTES.converter);
  }

  if (!isReady || completedOnLoad || !shouldShowWelcome) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.surfaceBrand }]}>
      <StatusBar style="light" />
      <FloatingCoins />

      <View style={[styles.content, { paddingTop: Math.max(CONTENT_TOP, insets.top) }]}>
        <Animated.View entering={rise(0)}>
          <Logo variant="mark" tone="onDark" size={LOGO_SIZE} />
        </Animated.View>

        <Animated.View entering={rise(80)} style={styles.texts}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.textOnBrand }]}>
            {t('common.appName')}
          </Text>
          <Text style={[styles.description, { color: colors.textOnBrandMuted }]}>
            {t('welcome.description')}
          </Text>
        </Animated.View>

        <Animated.View entering={rise(160)} style={styles.chips}>
          {currencyCodes.map((code) => (
            <Text
              key={code}
              style={[styles.chip, { backgroundColor: colors.chipOnBrand, color: colors.accent }]}
            >
              {code}
            </Text>
          ))}
        </Animated.View>
      </View>

      <Animated.View
        entering={rise(160)}
        style={[
          styles.actions,
          { paddingBottom: Math.max(ACTIONS_BOTTOM, insets.bottom + SIZES.sectionGap) },
        ]}
      >
        <Button tone="brand" onPress={() => navigate(APP_ROUTES.onboarding)}>
          {t('welcome.start')}
        </Button>
        <Button tone="brand" variant="outline" onPress={() => void openConverter()}>
          {t('welcome.convertNow')}
        </Button>
        <Text style={[styles.disclaimer, { color: colors.textOnBrandMuted }]}>
          {t('welcome.disclaimer')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sectionGap,
    paddingHorizontal: SIZES.screenPadding,
  },
  texts: {
    gap: SIZES.itemGap,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: TYPE.display,
    lineHeight: TYPE.display * 1.05,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.body,
    fontSize: TYPE.body,
    lineHeight: TYPE.body * 1.5,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 320,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
    fontFamily: FONTS.bodySemiBold,
    fontSize: TYPE.caption,
  },
  actions: {
    gap: SIZES.itemGap,
    paddingTop: SIZES.sectionGap,
    paddingHorizontal: SIZES.screenPadding,
  },
  disclaimer: {
    fontFamily: FONTS.body,
    fontSize: TYPE.caption,
    lineHeight: TYPE.caption * 1.35,
    textAlign: 'center',
  },
});
