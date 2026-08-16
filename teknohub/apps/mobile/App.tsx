import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

type TabType = 'home' | 'shop' | 'builder' | 'forum' | 'profile';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>
            Tekno<Text style={styles.logoAccent}>Zone</Text>
          </Text>
        </View>
        <Text style={styles.headerTagline}>Pusat Hardware &amp; AI Builder</Text>
      </View>

      {/* Main Content View per Tab */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {currentTab === 'home' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔥 Selamat Datang di TeknoZone</Text>
            <Text style={styles.cardDesc}>
              Platform e-commerce komponen elektronik, forum teknologi, dan rekomendasi rakit PC dengan AI Agent lokal.
            </Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>⭐ 34+ Komponen Resmi</Text>
              <Text style={styles.highlightText}>🤖 Konsultasi AI 24/7</Text>
              <Text style={styles.highlightText}>💬 Komunitas &amp; Reputasi Forum</Text>
            </View>
          </View>
        )}

        {currentTab === 'shop' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🛍️ Katalog Produk &amp; Hardware</Text>
            <Text style={styles.cardDesc}>Temukan prosesor, kartu grafis, memori RAM, dan periferal terbaik.</Text>
            <View style={styles.gridBox}>
              <Text style={styles.itemBadge}>RTX 4060 Gaming</Text>
              <Text style={styles.itemBadge}>Ryzen 7 7800X3D</Text>
              <Text style={styles.itemBadge}>DDR5 32GB 6000MHz</Text>
              <Text style={styles.itemBadge}>NVMe SSD 1TB Gen4</Text>
            </View>
          </View>
        )}

        {currentTab === 'builder' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🤖 AI PC Builder Assistant</Text>
            <Text style={styles.cardDesc}>Pilih use-case dan tentukan budget untuk rekomendasi racikan rakit PC terbaik.</Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>🎮 Gaming Esports (1080p / 1440p)</Text>
              <Text style={styles.highlightText}>🎬 Video Editing &amp; Content Creator</Text>
              <Text style={styles.highlightText}>⚡ AI &amp; Deep Learning Station</Text>
            </View>
          </View>
        )}

        {currentTab === 'forum' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💬 Forum Komunitas Tech &amp; AI</Text>
            <Text style={styles.cardDesc}>Diskusikan racikan PC, benchmark, troubleshooting, dan info teknologi terkini.</Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>#hardware · Diskusi Komponen</Text>
              <Text style={styles.highlightText}>#ai · Model Lokal &amp; Prompting</Text>
              <Text style={styles.highlightText}>#gaming · Setup &amp; Benchmark</Text>
            </View>
          </View>
        )}

        {currentTab === 'profile' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👤 Profil &amp; Aktivitas Pengguna</Text>
            <Text style={styles.cardDesc}>Kelola pesanan belanja, ulasan produk, dan akses portal manajemen toko.</Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>📦 Riwayat Pesanan &amp; Resi Kurir</Text>
              <Text style={styles.highlightText}>⭐ Riwayat Ulasan &amp; Rating</Text>
              <Text style={styles.highlightText}>🏪 Seller &amp; Store Dashboard</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'home' && styles.activeTab]}
          onPress={() => setCurrentTab('home')}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.activeLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'shop' && styles.activeTab]}
          onPress={() => setCurrentTab('shop')}
        >
          <Text style={styles.tabIcon}>🛍️</Text>
          <Text style={[styles.tabLabel, currentTab === 'shop' && styles.activeLabel]}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'builder' && styles.activeTab]}
          onPress={() => setCurrentTab('builder')}
        >
          <Text style={styles.tabIcon}>🤖</Text>
          <Text style={[styles.tabLabel, currentTab === 'builder' && styles.activeLabel]}>Builder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'forum' && styles.activeTab]}
          onPress={() => setCurrentTab('forum')}
        >
          <Text style={styles.tabIcon}>💬</Text>
          <Text style={[styles.tabLabel, currentTab === 'forum' && styles.activeLabel]}>Forum</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, currentTab === 'profile' && styles.activeTab]}
          onPress={() => setCurrentTab('profile')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, currentTab === 'profile' && styles.activeLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1F45',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0B1F45',
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A6E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  logoAccent: {
    color: '#2563EB',
  },
  headerTagline: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#CBD5E1',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0B1F45',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  highlightBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  gridBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#0B1F45',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0B1F45',
    borderTopWidth: 1,
    borderTopColor: '#1E3A6E',
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#1E3A6E',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
