# Changelog

Semua perubahan penting proyek TeknoHub dicatat di sini.

## [2026-08-09] — Tekno Zone Rebrand (Apple-inspired Ice Slate & Midnight Navy)

### Changed
- Brand: TeknoHub → **Tekno Zone** (light-first, Apple minimalist aesthetic)
- Design tokens: iceBg `#CBD5E1` background, cardClean `#F8FAFC` cards, chromeAccent `#0B1F45` navy buttons/accents, techDark `#0F172A` text, subGray `#334155` muted
- Typography: SF Pro Display/Inter stack, `-0.015em` tracking, bold tight headings
- Homepage: hero "Inovasi di setiap komponen pilihan", Store 3 featured (Ultrabook/AI Engine Station/Peripherals), AI Builder dark consultation panel, Forum reputation tiers (Silver/Gold/Diamond anti-fake review) + Verified Evidence
- Navbar: transparent backdrop-blur-xl, navy dot logo, Store/AI PC Builder/Forum menu
- ProductCard/ThreadCard: clean surface cards, rounded-[2.5rem], navy accents

## [2026-08-09] — Design System Upgrade (awesome-design-md Shopify)

### Changed
- Implementasi DESIGN.md dari getdesign.md (Shopify: cinematic dark, neon green accent, monumental typography)
- Design token system: CSS Custom Properties di globals.css
- Tailwind extend: custom colors, shadows glow, keyframes fadeInUp/glowPulse/shimmer/cardLift
- Redesign: Homepage hero monumental, Navbar glassmorphism, ProductCard premium, ThreadCard, Builder UI
- Semua komponen menggunakan CSS variables — zero hardcoded colors

## [2026-08-09] — Fase 4: PC Builder AI 100% + Fitur AI

### Added
- Interactive AI PC Builder Chat + Live Summary Sync (di /builder)
- 24/7 Global AI Customer Service (CS) Floating Widget (seluruh web)
- Quote System (request penawaran, admin review, invoice PDF)
- Camofox anti-detect scraper (Tokopedia + Shopee) + cron update harga
