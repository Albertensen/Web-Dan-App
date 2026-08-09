-- Part 2: RAM, Storage, Motherboard, PSU, Case, Cooler

-- RAM (4)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('Corsair Vengeance 16GB DDR5 5600', 'Corsair', 'ram', 'DDR5',
 '{"capacity_gb":16,"speed_mhz":5600,"modules":2,"type":"DDR5","tdp":null}', null),
('G.Skill Trident Z5 32GB DDR5 6000', 'G.Skill', 'ram', 'DDR5',
 '{"capacity_gb":32,"speed_mhz":6000,"modules":2,"type":"DDR5","tdp":null}', null),
('Corsair Vengeance 16GB DDR4 3200', 'Corsair', 'ram', 'DDR4',
 '{"capacity_gb":16,"speed_mhz":3200,"modules":2,"type":"DDR4","tdp":null}', null),
('Kingston Fury 32GB DDR4 3600', 'Kingston', 'ram', 'DDR4',
 '{"capacity_gb":32,"speed_mhz":3600,"modules":2,"type":"DDR4","tdp":null}', null);

-- Storage (4)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('Samsung 980 Pro 1TB NVMe', 'Samsung', 'storage', 'NVMe M.2',
 '{"capacity_tb":1,"interface":"PCIe 4.0","form_factor":"M.2 2280","read_mb_s":7000,"write_mb_s":5000}', null),
('Samsung 990 Pro 2TB NVMe', 'Samsung', 'storage', 'NVMe M.2',
 '{"capacity_tb":2,"interface":"PCIe 4.0","form_factor":"M.2 2280","read_mb_s":7450,"write_mb_s":6900}', null),
('WD Blue 1TB SATA SSD', 'WD', 'storage', 'SATA',
 '{"capacity_tb":1,"interface":"SATA III","form_factor":"2.5 inch","read_mb_s":560,"write_mb_s":530}', null),
('Crucial P3 Plus 1TB NVMe', 'Crucial', 'storage', 'NVMe M.2',
 '{"capacity_tb":1,"interface":"PCIe 4.0","form_factor":"M.2 2280","read_mb_s":5000,"write_mb_s":3600}', null);

-- Motherboard (4)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('MSI B650 Tomahawk WiFi', 'MSI', 'motherboard', 'AM5',
 '{"form_factor":"ATX","chipset":"B650","ram_slots":4,"max_ram_gb":192,"pcie":"4.0","m2_slots":2}', null),
('Gigabyte B650M Aorus Elite', 'Gigabyte', 'motherboard', 'AM5',
 '{"form_factor":"Micro-ATX","chipset":"B650","ram_slots":4,"max_ram_gb":128,"pcie":"4.0","m2_slots":2}', null),
('ASUS ROG Strix Z790-E', 'ASUS', 'motherboard', 'LGA1700',
 '{"form_factor":"ATX","chipset":"Z790","ram_slots":4,"max_ram_gb":192,"pcie":"5.0","m2_slots":4}', null),
('MSI B760 Gaming Plus', 'MSI', 'motherboard', 'LGA1700',
 '{"form_factor":"ATX","chipset":"B760","ram_slots":4,"max_ram_gb":192,"pcie":"4.0","m2_slots":2}', null);

-- PSU (3)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('Corsair RM650x 650W', 'Corsair', 'psu', null,
 '{"wattage":650,"efficiency":"80+ Gold","modular":"Full","form_factor":"ATX"}', null),
('Seasonic Focus GX-750 750W', 'Seasonic', 'psu', null,
 '{"wattage":750,"efficiency":"80+ Gold","modular":"Full","form_factor":"ATX"}', null),
('be quiet! Pure Power 850W', 'be quiet!', 'psu', null,
 '{"wattage":850,"efficiency":"80+ Gold","modular":"Semi","form_factor":"ATX"}', null);

-- Case (3)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('NZXT H5 Flow', 'NZXT', 'case', null,
 '{"form_factor":"Mid-Tower","max_gpu_mm":365,"max_cooler_mm":165,"psu_form":"ATX"}', null),
('Lian Li Lancool 216', 'Lian Li', 'case', null,
 '{"form_factor":"Mid-Tower","max_gpu_mm":392,"max_cooler_mm":180,"psu_form":"ATX"}', null),
('Fractal Design Meshify C', 'Fractal', 'case', null,
 '{"form_factor":"Mid-Tower","max_gpu_mm":315,"max_cooler_mm":172,"psu_form":"ATX"}', null);

-- Cooler (2)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('Noctua NH-U12S', 'Noctua', 'cooler', null,
 '{"type":"Air","height_mm":158,"tdp_rating":160,"sockets":["AM5","AM4","LGA1700","LGA1200"]}', null),
('Arctic Liquid Freezer II 360', 'Arctic', 'cooler', null,
 '{"type":"AIO 360mm","height_mm":57,"tdp_rating":350,"sockets":["AM5","AM4","LGA1700","LGA1200"]}', null);
