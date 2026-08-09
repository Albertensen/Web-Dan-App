-- Migration 004b: Component prices (harga referensi official)
insert into public.component_prices (component_id, source, url, price) 
select id, 'official', null, 
  case 
    when name like 'Ryzen 5 7600' then 3500000
    when name like 'Ryzen 7 7800X3D' then 5800000
    when name like 'Ryzen 9 7950X' then 9500000
    when name like 'Ryzen 5 5600' then 1900000
    when name like 'Core i5-13600K%' then 4600000
    when name like 'Core i7-14700K%' then 5700000
    when name like 'Core i9-14900K%' then 8900000
    when name like 'Ryzen 5 7500F%' then 2500000
    when name like 'RTX 4060 8GB%' then 4500000
    when name like 'RTX 4070 Super%' then 9000000
    when name like 'RTX 4080 Super%' then 17000000
    when name like 'RX 7800 XT%' then 7800000
    when name like 'RX 7600%' then 3800000
    when name like 'RTX 4090%' then 28000000
    when name like 'Corsair Vengeance 16GB DDR5' then 1200000
    when name like 'G.Skill Trident Z5 32GB' then 2400000
    when name like 'Corsair Vengeance 16GB DDR4' then 700000
    when name like 'Kingston Fury 32GB DDR4' then 1400000
    when name like 'Samsung 980 Pro 1TB' then 2200000
    when name like 'Samsung 990 Pro 2TB' then 3800000
    when name like 'WD Blue 1TB SATA' then 900000
    when name like 'Crucial P3 Plus 1TB' then 1600000
    when name like 'MSI B650 Tomahawk' then 3200000
    when name like 'Gigabyte B650M Aorus' then 2500000
    when name like 'ASUS ROG Strix Z790-E' then 6500000
    when name like 'MSI B760 Gaming Plus' then 2800000
    when name like 'Corsair RM650x' then 1600000
    when name like 'Seasonic Focus GX-750' then 1900000
    when name like 'be quiet! Pure Power 850W' then 2100000
    when name like 'NZXT H5 Flow' then 1300000
    when name like 'Lian Li Lancool 216' then 1400000
    when name like 'Fractal Design Meshify C' then 1600000
    when name like 'Noctua NH-U12S' then 1300000
    when name like 'Arctic Liquid Freezer II 360' then 1600000
    else 1000000
  end
from public.pc_components;
