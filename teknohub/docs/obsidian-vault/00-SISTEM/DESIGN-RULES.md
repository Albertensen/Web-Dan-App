# DESIGN-RULES — Tekno Zone (Apple-inspired Ice Slate & Midnight Navy)

> Berlaku utk SEMUA komponen UI Tekno Zone. Persis spesifikasi "Tekno Zone".
> Gaya: Apple minimalist, light-first, deep slate, generous white space.

## Tokens (globals.css `:root` + tailwind.config)

| Token | Nilai | Fungsi |
|---|---|---|
| `--color-background` | `#CBD5E1` (iceBg) | Background utama — ice slate, bukan hitam/putih silau |
| `--color-surface` | `#F8FAFC` (cardClean) | Kartu produk/clean surface |
| `--color-surface-2` | `#E2E8F0` | Placeholder image, bg sekunder |
| `--color-accent` | `#0B1F45` (chromeAccent) | Tombol utama, badge, sorotan teks — Midnight Navy |
| `--color-accent-secondary` | `#1E3A6E` | Navy lebih terang (hover/gradient) |
| `--color-text-primary` | `#0F172A` (techDark) | Teks utama |
| `--color-text-muted` | `#334155` (subGray) | Teks sekunder |
| `--color-text-tertiary` | `#64748B` | Teks tersier |
| `--color-border` | `#CBD5E1` | Border umum |

## Tipografi

- Stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif`
- Tracking rapat: `letter-spacing: -0.015em`
- Heading: bold (`font-bold`), tight (`tracking-tight`), tegas
- Whitespace generous (py-24/32, mb-16)

## Kartu

- `rounded-[2.5rem]` sudut melengkung sempurna
- `bg-surface` (#F8FAFC) + `border border-slate-300`
- Hover: `hover:border-accent` + shadow halus
- Featured card: `border-2 border-accent` + badge "Pro Choice"

## Tombol

- Primary: `bg-accent text-white rounded-full hover:bg-black`
- Secondary: `bg-surface border border-slate-400 hover:border-accent`

## Struktur Homepage (sesuai referensi)

1. Hero: badge pill "Designed for Performance" + H1 monumental + 2 CTA pill
2. Store: `#store` — 3 featured cards (Ultrabook, AI Engine Station Pro Choice, Peripherals)
3. AI Builder: `#ai-builder` — kiri copy + checklist, kanan dark chat panel mock
4. Forum: `#forum` — 3 tier cards (Silver 1-9, Gold 10-50 amber, Diamond >50 navy) + 2 contoh ulasan (Diamond positif, Silver kendala + Verified Evidence Attached)
5. Footer: minimal `© 2026 Tekno Zone`

## Navbar

- `sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border/50`
- Logo: dot navy `w-2.5 h-2.5 bg-accent rounded-full` + "Tekno Zone" semibold
- Menu: Store, AI PC Builder, Forum Komunitas (text-xs, hover:text-accent)
- CTA: `bg-foreground hover:bg-accent` pill "Masuk"
