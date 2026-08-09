-- Migration 008: Marketplace link per komponen
alter table public.pc_components
  add column if not exists marketplace_url text;
