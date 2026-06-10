'use client';

import {
  Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import type { FeedbackEntry } from '@/types/feedback';

interface Props {
  entries: FeedbackEntry[];
}

const ACCENT = '#f4a27a';
const MUTED  = 'rgba(250,250,249,0.18)';
const TEXT   = '#a8a89e';

export function FeedbackCharts({ entries }: Props) {
  // Rating distribution 1–5
  const distribution = [1, 2, 3, 4, 5].map((star) => ({
    star: `${star}★`,
    count: entries.filter((e) => e.rating === star).length,
  }));

  // Submissions per day (last 30 days)
  const byDay: Record<string, number> = {};
  entries.forEach((e) => {
    const day = e.createdAt.slice(0, 10); // "YYYY-MM-DD"
    byDay[day] = (byDay[day] ?? 0) + 1;
  });
  const timeline = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      count,
    }));

  if (entries.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      {/* Rating distribution */}
      <div>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT, marginBottom: '1.25rem' }}>
          Rating distribution
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={distribution} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke={MUTED} />
            <XAxis dataKey="star" tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{ background: '#0f2318', border: `1px solid ${MUTED}`, borderRadius: 0, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              itemStyle={{ color: ACCENT }}
              cursor={{ fill: 'rgba(250,250,249,0.04)' }}
            />
            <Bar dataKey="count" radius={0}>
              {distribution.map((d, i) => (
                <Cell key={i} fill={d.count === Math.max(...distribution.map((x) => x.count)) ? ACCENT : MUTED} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Submissions over time */}
      <div>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT, marginBottom: '1.25rem' }}>
          Submissions over time
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={timeline}>
            <CartesianGrid stroke={MUTED} />
            <XAxis dataKey="date" tick={{ fill: TEXT, fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fill: TEXT, fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
            <Tooltip
              contentStyle={{ background: '#0f2318', border: `1px solid ${MUTED}`, borderRadius: 0, fontSize: 12 }}
              labelStyle={{ color: TEXT }}
              itemStyle={{ color: ACCENT }}
            />
            <Line type="monotone" dataKey="count" stroke={ACCENT} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
