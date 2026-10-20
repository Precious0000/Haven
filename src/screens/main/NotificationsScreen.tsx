import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { useCare } from '../../careData';
import { colors, fonts, radius } from '../../theme';

export function NotificationsScreen({ navigation }: RootScreenProps<'Notifications'>) {
  const { notifications, unreadCount, markRead, markAllRead } = useCare();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Notifications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.count}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</Text>
          {unreadCount > 0 ? (
            <Pressable onPress={markAllRead} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.link}>Mark all as read</Text>
            </Pressable>
          ) : null}
        </View>

        {notifications.length === 0 ? <Text style={styles.empty}>No notifications yet.</Text> : null}

        {notifications.map((n) => (
          <Pressable
            key={n.id}
            style={[styles.card, !n.read && styles.cardUnread]}
            accessibilityRole="button"
            onPress={() => {
              markRead(n.id);
              if (n.target) navigation.navigate(n.target);
            }}
          >
            <View style={[styles.dot, { opacity: n.read ? 0 : 1 }]} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{n.title}</Text>
                <Text style={styles.time}>{n.time}</Text>
              </View>
              <Text style={styles.body}>{n.body}</Text>
            </View>
            {n.target ? <Ionicons name="chevron-forward" size={16} color={colors.navy70} /> : null}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  count: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4 },
  link: { fontFamily: fonts.regular, fontSize: 13, color: '#3b82f6' },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  cardUnread: { borderColor: colors.sage50, backgroundColor: '#f6fbfb' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage100 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, color: colors.dark12 },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark4 },
  body: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.dark6 },
});
