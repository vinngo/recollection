# Product Requirements Document: The Memory Vault
**Author:** Project Architect  
**Version:** 1.0  
**Status:** Implementation Ready

---

## 1. Project Overview
A high-performance, minimalist digital gallery for hosting personal life memories (photos/videos). This project serves as a self-hosted, "clean" alternative to social media, optimized for longevity and zero-cost scaling.

## 2. Core Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Styling:** Tailwind CSS + Shadcn/UI (Custom Registry)
* **Database:** NeonDB (PostgreSQL)
* **Storage:** Cloudflare R2 (Object Storage)
* **Delivery:** Cloudflare Workers (Edge Image Proxy)

---

## 3. Functional Requirements

### 3.1 Public Gallery Experience
- **Responsive Masonry Grid:** Display images in a fluid, Pinterest-style layout.
- **Dynamic Lightbox:** High-resolution detail view with metadata overlay.
- **Edge Optimization:** Images served via Worker proxy for auto-WebP/AVIF conversion and resizing.
- **SEO/Social Sharing:** Dynamic OpenGraph images for every memory.

### 3.2 Administrative Features
- **Hidden Admin Route:** Path-based access protected by environment variable secrets.
- **Presigned Upload Flow:** Direct-to-R2 uploads to bypass server limits.
- **Metadata Management:** Form to store titles, dates, and locations in NeonDB.

---

## 4. Technical Architecture

### 4.1 Data Model (NeonDB)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `r2_key` | String | Unique path to object in R2 |
| `title` | String | Display title of the memory |
| `captured_at` | DateTime | When the memory occurred |
| `metadata` | JSONB | Location, camera specs, or tags |

### 4.2 Compute Hierarchy
- **Next.js API:** Handles heavy "Admin" tasks and database writes.
- **Cloudflare Workers:** Acts as the high-speed "Concierge" for public image delivery.

---

## 5. Success Criteria (MVP)
1. [ ] Successfully upload a high-res image directly to R2.
2. [ ] Metadata successfully persists in NeonDB.
3. [ ] Images render on the frontend through the Worker proxy with <100ms TTFB.
4. [ ] Mobile-first UI passes Lighthouse accessibility audits.

---
