import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { colors, fonts } from '../theme';

export type Status = 'Normal' | 'High' | 'Low' | 'Slightly Elevated';

const BADGE: Record<Status, { bg: string; fg: string }> = {
  Normal: { bg: '#e0f3e6', fg: '#1f9d55' },
  High: { bg: '#fde8e8', fg: '#d93636' },
  Low: { bg: '#fff1c9', fg: '#e8891a' },
  'Slightly Elevated': { bg: '#fff1c9', fg: '#e8891a' },
};

export function Badge({ status }: { status: Status }) {
  const c = BADGE[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{status}</Text>
    </View>
  );
}

export function ReadingRow({ value, unit, when, status, last }: { value: string; unit: string; when: string; status: Status; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View style={{ gap: 2 }}>
        <Text style={styles.rowValue}>
          {value} <Text style={styles.rowUnit}>{unit}</Text>
        </Text>
        <Text style={styles.rowWhen}>{when}</Text>
      </View>
      <Badge status={status} />
    </View>
  );
}

type ChartProps = {
  values: number[];
  labels: string[];
  min: number;
  max: number;
  height?: number;
  color?: string;
  hollow?: boolean;
};

/** Simple line chart drawn with plain Views (no chart library needed). */
export function LineChart({ values, labels, min, max, height = 150, color = '#0a4d52', hollow }: ChartProps) {
  const [w, setW] = useState(0);
  const pad = 14;
  const n = values.length;
  const pts = values.map((v, i) => ({
    x: pad + (i / (n - 1)) * Math.max(0, w - pad * 2),
    y: height - ((v - min) / (max - min)) * height,
  }));
  const dot = hollow ? 10 : 8;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
      <View style={{ height }}>
        {[0.15, 0.5, 0.85].map((g) => (
          <View key={g} style={[styles.grid, { top: height * g }]} />
        ))}
        {w > 0 &&
          pts.slice(0, -1).map((a, i) => {
            const b = pts[i + 1];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
            return (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: (a.x + b.x) / 2 - len / 2,
                  top: (a.y + b.y) / 2 - 1,
                  width: len,
                  height: 2,
                  backgroundColor: color,
                  transform: [{ rotate: `${ang}deg` }],
                }}
              />
            );
          })}
        {w > 0 &&
          pts.map((p, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: p.x - dot / 2,
                top: p.y - dot / 2,
                width: dot,
                height: dot,
                borderRadius: dot / 2,
                backgroundColor: hollow ? colors.white : color,
                borderWidth: hollow ? 2 : 0,
                borderColor: color,
              }}
            />
          ))}
      </View>
      <View style={{ height: 28, marginTop: 10 }}>
        {w > 0 &&
          labels.map((l, i) => (
            <Text key={l} style={[styles.axis, { left: pts[i].x - 20 }]}>
              {l}
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontFamily: fonts.regular, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#ececec' },
  rowValue: { fontFamily: fonts.semibold, fontSize: 16, color: colors.dark12 },
  rowUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  rowWhen: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  grid: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopColor: '#dfe6e6', borderStyle: 'dashed' },
  axis: { position: 'absolute', width: 40, textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
});
