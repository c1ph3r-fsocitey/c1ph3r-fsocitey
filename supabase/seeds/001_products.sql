-- ============================================================
-- C1PH3R FSOCIETY — Product Seed Data
-- All products from the Tindie store (tindie.com/stores/c1ph3r_fsocitey)
-- ============================================================

insert into products (name, slug, tagline, description, long_description, price, price_inr, images, category, tags, stock, sku, specs, features, legal_disclaimer, is_active, is_featured) values

(
  'DisruptorX',
  'disruptorx',
  'Advanced BLE Jammer, Scanner, Analyzer & Spoofer',
  'Multi-functional BLE jammer, scanner, analyzer, and spoofer. ESP32 Wroom32-based.',
  'DisruptorX is a powerful multi-functional device designed to analyze, jam, spoof, and disrupt Bluetooth Low Energy (BLE) signals. Based on the ESP32 Wroom32 module, it comes equipped with advanced features to target and attack Bluetooth devices. Whether you''re performing red team engagements or studying BLE networks, this tool serves multiple purposes, from signal analysis to jamming and spoofing.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/VTG6UEOe1nEo9q-eVbXrnx4bYcA=/p/114x76/i/531155/products/2025-06-13T14:07:52.208Z-DisruptorX.png'],
  'ble-tools',
  ARRAY['BLE', 'ESP32', 'Jammer', 'Scanner', 'Spoofer', 'Sour Apple'],
  10, 'CF-DX-001',
  '{"Core Module": "ESP32 Wroom32", "Protocol": "BLE 4.0/5.0", "Power": "USB-C", "Firmware": "Open Source (Arduino compatible)"}',
  ARRAY['Signal Jamming', 'Signal Scanning', 'Signal Spoofing', 'BLE Analyzer', 'Sour Apple Exploit'],
  'For authorized ethical hacking, security research, and educational purposes ONLY. Unauthorized use may violate local laws.',
  true, true
),

(
  'DisruptorX V2',
  'disruptorx-v2',
  'BLE Jammer & Analyzer — Generation 2',
  'Upgraded version of DisruptorX with improved BLE jamming, scanning, spoofing, and analysis capabilities.',
  'DisruptorX V2 is an upgraded multi-functional device designed to analyze, jam, spoof, and disrupt Bluetooth Low Energy (BLE) signals. Based on the ESP32 Wroom32 module with improvements over the original DisruptorX.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/tRHmu08bONrVPUoTnv_yKWvJEPc=/p/114x76/i/531155/products/2025-07-04T13:42:19.518Z-FreqFuckerUltra..jpeg'],
  'ble-tools',
  ARRAY['BLE', 'ESP32', 'V2', 'Jammer', 'Upgraded'],
  8, 'CF-DX2-001',
  '{"Core Module": "ESP32 Wroom32", "Protocol": "BLE 4.0/5.0", "Power": "USB-C", "Version": "V2"}',
  ARRAY['Enhanced BLE Jamming', 'Improved Signal Scanning', 'BLE Spoofing', 'Sour Apple Exploit', 'Updated Firmware'],
  'For authorized ethical hacking, security research, and educational purposes ONLY.',
  true, true
),

(
  'RF Annihilator',
  'rf-annihilator',
  'Professional RF Testing Tool for Security Research',
  'Advanced RF signal generator, analyzer, and cloning tool. 315MHz, 433MHz, ISM bands. Replay attacks, protocol reverse engineering.',
  'Unleash the power of radio frequency analysis with the RF Annihilator, an advanced RF signal generator, analyzer, and cloning tool designed for security professionals, penetration testers, and wireless researchers.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/4TZa1c5GMwKavvgZoHhGsh9UsuA=/p/3x140:1280x960/114x76/i/531155/products/2026-01-05T05:59:48.260Z-rf_ani..jpeg'],
  'rf-tools',
  ARRAY['RF', '315MHz', '433MHz', 'ISM', 'ESP32', 'Replay', 'Signal Cloning'],
  3, 'CF-RFA-001',
  '{"Core Module": "ESP32", "Frequency Range": "315MHz, 433MHz, ISM Bands", "Connectivity": "USB-C", "Firmware": "Open Source (Arduino/Rust compatible)"}',
  ARRAY['Precision Signal Cloning', 'Multi-Frequency Signal Generation', 'Advanced Signal Analysis', 'Raw Data Capture & Export', 'Open-Source Firmware'],
  'For authorized penetration testing, security research, IoT development, and education ONLY.',
  true, true
),

(
  'Spectrum Slayer HellSpawn',
  'spectrum-slayer-hellspawn',
  '5GHz Wi-Fi Deauthenticator Tool',
  'Advanced 5GHz Wi-Fi security assessment tool. Targeted deauth, DFS channel support, USB-powered.',
  'The Spectrum Slayer HellSpawn is an advanced 5GHz Wi-Fi security assessment tool designed for ethical hackers, penetration testers, and network security professionals. Built around the AI-Thinker BW16 module.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/ZGcoUXQ0qHd0nQYpsJWuJXSL7io=/p/114x76/i/531155/products/2026-03-17T08:30:25.167Z-hellspawn.png'],
  'wifi-tools',
  ARRAY['WiFi 5GHz', 'Deauther', 'AI-Thinker BW16', 'DFS', 'USB-C'],
  3, 'CF-SSH-001',
  '{"Core Module": "AI-Thinker BW16", "Frequency": "5GHz WiFi (DFS channels)", "Power": "USB-C", "Range": "~50m optimal", "Firmware": "Open Source (Arduino/PlatformIO)"}',
  ARRAY['5GHz Band Targeting', 'Targeted Deauthentication', 'DFS Channel Support', 'Compact & USB-Powered', 'Open-Source Firmware'],
  'For authorized penetration testing, security training, IoT hardening, and red team exercises ONLY.',
  true, true
),

(
  'RF Fucker',
  'rf-fucker',
  'Multi-Band RF Research Tool',
  'Compact RF research tool for multi-band signal analysis and testing across ISM bands.',
  'The RF Fucker is a compact multi-band RF research tool for signal analysis, generation, and testing across ISM bands. Ideal for security researchers studying wireless protocols.',
  49.99, 4199.00,
  ARRAY[]::text[],
  'rf-tools',
  ARRAY['RF', 'Multi-Band', 'ISM', 'ESP32'],
  10, 'CF-RFF-001',
  '{"Module": "ESP32", "Protocol": "ISM Bands", "Power": "USB-C"}',
  ARRAY['Multi-Band RF Support', 'Signal Analysis', 'Compact Design', 'Open Firmware'],
  'For authorized testing only.',
  true, false
),

(
  'WiFi BLE Pentest Pro',
  'wifi-ble-pentest-pro',
  'Wireless Security Assessment Platform',
  'All-in-one WiFi + BLE toolkit. Evil twin, rogue AP, BLE sniffing, Evil Portal. GhostESP firmware compatible.',
  'The WiFi BLE Pentest Pro is an ESP32-based wireless security platform designed for professional penetration testers, red teams, and security researchers.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/VmdOi0BoWWVY7HrOLONfcVdbzVs=/p/114x76/i/531155/products/2025-06-25T11:08:35.974Z-blitz2.png'],
  'multi-tools',
  ARRAY['WiFi 2.4GHz', 'BLE', 'GhostESP', 'Evil Twin', 'Rogue AP', 'Evil Portal'],
  2, 'CF-WBP-001',
  '{"Core Module": "ESP32 (GhostESP compatible)", "Wireless": "WiFi 2.4/5GHz + BLE", "Power": "USB-C", "Range": "WiFi ~100m, BLE ~10-30m", "Docs": "ghostesp.net"}',
  ARRAY['Network Scanning & Recon', 'Packet Capture & Analysis', 'Rogue AP Deployment', 'Evil Portal (Captive Portal)', 'Beacon Spoofing', 'BLE Sniffing & Spoofing', 'Device Enumeration'],
  'For authorized penetration testing, red team exercises, IoT research, and security education ONLY.',
  true, true
),

(
  'Marauder OG',
  'marauder-og',
  'ESP32 Marauder + GPS — Plug and Play',
  'Upgraded ESP32 Marauder with onboard GPS. Wardriving, signal mapping, location-based security research. Pre-flashed.',
  'Introducing the ESP32 Marauder with GPS, a fully assembled, plug-and-play wireless security toolkit designed for WiFi pentesting, BLE scanning, wardriving, and advanced wireless reconnaissance.',
  59.99, 5039.00,
  ARRAY['https://img.tindie.com/images/resize/lWtigo7bdOhbKRg3n5JHtNJCqSs=/p/114x76/i/531155/products/2025-12-11T12:02:14.270Z-marauder_og..jpeg'],
  'wifi-tools',
  ARRAY['Marauder', 'GPS', 'Wardriving', 'WiFi', 'BLE', 'Plug and Play'],
  5, 'CF-MOG-001',
  '{"Module": "ESP32 Marauder", "GPS": "Integrated GPS Module", "Power": "USB-C / Power Bank", "Firmware": "Pre-flashed Marauder"}',
  ARRAY['Integrated GPS Module', 'Pre-Flashed Marauder Firmware', 'Real-Time WiFi and BLE Scanning', 'Custom PCB with Clean Layout', 'USB-Powered & Fully Portable'],
  'For authorized pentesting and wireless research ONLY.',
  true, true
),

(
  'BLE STLTHFCKR',
  'ble-stlthfckr',
  'Stealth BLE Research Device with External Antenna',
  'Compact, stealthy BLE research device with external antenna support for massive range.',
  'The BLE STLTHFCKR is a compact, stealthy BLE research device designed for authorized BLE reconnaissance and testing. With external antenna support, the range is massive — reviewers have added 12dBi antennas with great results.',
  30.00, 2520.00,
  ARRAY[]::text[],
  'ble-tools',
  ARRAY['BLE', 'Stealth', 'External Antenna', 'Long Range', 'Recon'],
  15, 'CF-BSF-001',
  '{"Protocol": "Bluetooth Low Energy", "Antenna": "External SMA (12dBi compatible)", "Form Factor": "Compact / Stealth"}',
  ARRAY['Stealth Form Factor', 'External Antenna Support (up to 12dBi)', 'Long Range BLE Recon', 'BLE Device Scanning'],
  'For authorized testing only.',
  true, true
),

(
  'DeskMate Mochi',
  'deskmate-mochi',
  'Cute Educational Desktop Companion',
  'A friendly desktop companion for makers, hackers, and embedded systems learners.',
  'The DeskMate Mochi is a fun educational kit for learning ESP32 programming and embedded systems fundamentals. Perfect for students, educators, and makers who want a programmable desktop companion.',
  39.99, 3360.00,
  ARRAY[]::text[],
  'educational',
  ARRAY['Educational', 'Desktop', 'ESP32', 'Beginners', 'Fun'],
  20, 'CF-DMM-001',
  '{"Module": "ESP32", "Category": "Educational Kit", "Skill Level": "Beginner to Intermediate"}',
  ARRAY['Programmable via Arduino/PlatformIO', 'Educational & Fun', 'Desktop Widget', 'ESP32-Based'],
  null,
  true, false
);

-- Seed admin user (update password via Supabase Auth dashboard)
insert into admin_users (email, role, name) values
('rahulthegreat2001@gmail.com', 'super_admin', 'Rahul Thareja')
on conflict (email) do nothing;

-- Seed shipping rates
insert into shipping_rates (name, carrier, estimated_days, price, currency, countries) values
('Free Worldwide Shipping', 'India Post / Speed Post', '10–20 business days', 0.00, 'USD', ARRAY['*']),
('Express International',   'DHL / FedEx',            '5–7 business days',   15.00, 'USD', ARRAY['*']);

-- Sample coupon
insert into coupons (code, type, value, min_order, max_uses, is_active) values
('WELCOME10', 'percentage', 10, 30.00, 100, true),
('FLAT5',     'fixed',       5, 25.00, 50,  true);
