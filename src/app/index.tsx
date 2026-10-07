import { StyleSheet, View } from 'react-native';

import { Logo } from '@components/brand/Logo';

export default function Index() {
  return (
    <View style={styles.container}>
      <Logo variant="full" tone="onDark" size={42} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F3D2E',
  },
});
