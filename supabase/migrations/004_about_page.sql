-- ============================================================
-- ABOUT PAGE CONTENT (singleton row)
-- ============================================================
create table about_page (
  id            integer primary key default 1 check (id = 1),
  name          text not null default 'Rahul Thareja',
  tagline       text not null default 'Robotics Engineer · Hardware Hacker · Security Researcher',
  bio           text[] not null default '{}',
  photo_url     text,
  stat_products text not null default '9+',
  stat_orders   text not null default '63+',
  stat_rating   text not null default '5.0★',
  story         text[] not null default '{}',
  skills        jsonb not null default '[]',
  timeline      jsonb not null default '[]',
  updated_at    timestamptz not null default now()
);

-- Seed with current hardcoded content so the page works immediately
insert into about_page (
  id, name, tagline, bio, photo_url,
  stat_products, stat_orders, stat_rating,
  story, skills, timeline
) values (
  1,
  'Rahul Thareja',
  'Robotics Engineer · Hardware Hacker · Security Researcher',
  array[
    'I''m a Robotics Engineer by profession and hardware hacker by passion, based in Delhi, India. I founded C1ph3r Fsociety to design and build offensive security tools from scratch — entirely self-funded from my day job.',
    'Every device you see in the store has been designed by me, PCB laid out by me, assembled by me, tested by me, and shipped by me. There are no resellers or Alibaba sourcing here — only original hardware built with purpose.'
  ],
  null,
  '9+', '63+', '5.0★',
  array[
    'Like a lot of hardware hackers, it started with a problem: I wanted to do hands-on wireless security research, but the commercially available tools were either too expensive, closed-source, or frankly not very interesting to work with.',
    'So I started building my own. First for personal use — a BLE jammer to understand how Bluetooth disruption actually worked at the firmware level. Then I got into RF. Then WiFi deauthentication. Before long I had a workbench full of custom hardware that I''d built from scratch.',
    'Friends started asking where to get them. I put the first batch on Tindie in June 2025, fully expecting maybe five orders. Within weeks I had shipped dozens, with customers from Europe, the Middle East, and Southeast Asia. The demand confirmed what I suspected: there''s a real market for honest, well-documented security hardware.',
    'C1ph3r Fsociety is still a one-person operation. I design, assemble, test, and ship every unit myself. That won''t scale forever — but it means every customer is getting something made with actual care and attention.'
  ],
  '[
    {"category": "Hardware",  "items": ["ESP32 / ESP8266", "PCB Design (KiCad)", "Embedded C/C++", "RF Circuits", "BLE Stack", "Soldering & Assembly"]},
    {"category": "Software",  "items": ["Arduino / PlatformIO", "Python", "JavaScript / TypeScript", "Linux / Kali", "Git", "Firmware OTA"]},
    {"category": "Security",  "items": ["BLE Pentesting", "WiFi Security", "RF Signal Analysis", "Red Team Tools", "Signal Jamming", "Protocol Reverse Engineering"]},
    {"category": "Other",     "items": ["Robotics (ROS)", "3D Printing", "CNC", "Workshop Facilitation", "Technical Writing"]}
  ]'::jsonb,
  '[
    {"year": "2024", "title": "C1ph3r Fsociety Founded",  "desc": "Started designing and building offensive security hardware tools in Delhi."},
    {"year": "2025", "title": "First Products Shipped",   "desc": "Launched on Tindie — DisruptorX, RF Annihilator, WiFi BLE Pentest Pro."},
    {"year": "2025", "title": "63+ Orders Worldwide",     "desc": "Shipped hardware to security researchers, red teamers, and educators worldwide."},
    {"year": "2026", "title": "Expanded Product Line",    "desc": "Spectrum Slayer HellSpawn, Marauder OG, DisruptorX V2 and more."}
  ]'::jsonb
);

alter table about_page enable row level security;
create policy "Public read about_page"  on about_page for select using (true);
create policy "Admin write about_page"  on about_page for all using (auth.role() = 'authenticated');
