-- Migration 004: Seed PC Components untuk PC Builder
-- 30 komponen realistis (CPU, GPU, RAM, Storage, Motherboard, PSU, Case, Cooler)
-- dengan normalized specs (socket, tdp, power_consumption, form_factor)

-- CPU (8)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('Ryzen 5 7600', 'AMD', 'cpu', 'AM5',
 '{"cores":6,"threads":12,"base_clock":"3.8GHz","boost_clock":"5.1GHz","tdp":65,"integrated_gpu":"Radeon 760M","generation":"Zen 4"}', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400'),
('Ryzen 7 7800X3D', 'AMD', 'cpu', 'AM5',
 '{"cores":8,"threads":16,"base_clock":"4.2GHz","boost_clock":"5.0GHz","tdp":120,"integrated_gpu":null,"generation":"Zen 4 3D V-Cache"}', null),
('Ryzen 9 7950X', 'AMD', 'cpu', 'AM5',
 '{"cores":16,"threads":32,"base_clock":"4.5GHz","boost_clock":"5.7GHz","tdp":170,"integrated_gpu":"Radeon 610M","generation":"Zen 4"}', null),
('Ryzen 5 5600', 'AMD', 'cpu', 'AM4',
 '{"cores":6,"threads":12,"base_clock":"3.5GHz","boost_clock":"4.4GHz","tdp":65,"integrated_gpu":null,"generation":"Zen 3"}', null),
('Core i5-13600K', 'Intel', 'cpu', 'LGA1700',
 '{"cores":14,"threads":20,"base_clock":"3.5GHz","boost_clock":"5.1GHz","tdp":125,"integrated_gpu":"UHD 770","generation":"Raptor Lake"}', null),
('Core i7-14700K', 'Intel', 'cpu', 'LGA1700',
 '{"cores":20,"threads":28,"base_clock":"3.4GHz","boost_clock":"5.6GHz","tdp":125,"integrated_gpu":"UHD 770","generation":"Raptor Lake Refresh"}', null),
('Core i9-14900K', 'Intel', 'cpu', 'LGA1700',
 '{"cores":24,"threads":32,"base_clock":"3.2GHz","boost_clock":"6.0GHz","tdp":125,"integrated_gpu":"UHD 770","generation":"Raptor Lake Refresh"}', null),
('Ryzen 5 7500F', 'AMD', 'cpu', 'AM5',
 '{"cores":6,"threads":12,"base_clock":"3.7GHz","boost_clock":"5.0GHz","tdp":65,"integrated_gpu":null,"generation":"Zen 4"}', null);

-- GPU (6)
insert into public.pc_components (name, brand, component_type, socket, specs, image_url) values
('RTX 4060 8GB', 'NVIDIA', 'gpu', null,
 '{"vram_gb":8,"tdp":115,"length_mm":240,"pcie":"4.0 x8","recommended_psu":550}', null),
('RTX 4070 Super 12GB', 'NVIDIA', 'gpu', null,
 '{"vram_gb":12,"tdp":220,"length_mm":285,"pcie":"4.0 x16","recommended_psu":650}', null),
('RTX 4080 Super 16GB', 'NVIDIA', 'gpu', null,
 '{"vram_gb":16,"tdp":320,"length_mm":310,"pcie":"4.0 x16","recommended_psu":750}', null),
('RX 7800 XT 16GB', 'AMD', 'gpu', null,
 '{"vram_gb":16,"tdp":263,"length_mm":280,"pcie":"4.0 x16","recommended_psu":700}', null),
('RX 7600 8GB', 'AMD', 'gpu', null,
 '{"vram_gb":8,"tdp":165,"length_mm":240,"pcie":"4.0 x8","recommended_psu":550}', null),
('RTX 4090 24GB', 'NVIDIA', 'gpu', null,
 '{"vram_gb":24,"tdp":450,"length_mm":336,"pcie":"4.0 x16","recommended_psu":850}', null);
