import { Profile, Project, Skill, Experience } from "./types";

export const sampleProfile: Profile = {
  id: "sample",
  name: "Arin",
  title: "Software/AI Developer & Insurance Broker",
  bio: "Hey, I'm Arin. An entrepreneur, outdoorsman, and family man. I write and put together code for real world use cases, building production software that helps teams hit their numbers, with a soft spot for sales tooling. Currently building OnlyDialer for sales teams, and shipping web and AI work for insurance brokers and small business clients on the side.",
  email: "akinsuranceagent@gmail.com",
  github_url: "https://github.com/Arink1",
  linkedin_url: "",
  resume_url: "",
  avatar_url: "",
  expertise: [
    "Sales calling and dialer platforms (OnlyDialer)",
    "Multi-tenant SaaS with Stripe billing, Twilio telephony, and white-label",
    "AI integrations using Claude, GPT, and local LLMs",
    "Next.js, React, and Django full-stack",
    "WordPress sites built to rank and convert",
  ],
};

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "OnlyDialer CRM",
    description: "Full-featured sales CRM with integrated payments and telephony, the OnlyDialer pipeline hub.",
    long_description: "The CRM half of the OnlyDialer sales suite, built to manage leads and customer pipelines end-to-end. Integrates Stripe for subscription and one-off payments, and Twilio for voice and SMS outreach directly from the dashboard. Prisma-backed Postgres schema with role-based access for agents and admins. Lives at crm.onlydialer.com alongside the OnlyDialer power dialer and SMS platform.",
    image_url: "",
    tech_stack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Twilio", "Tailwind CSS"],
    category: "Web App",
    github_url: "",
    live_url: "https://crm.onlydialer.com",
    video_url: "",
    features: [
      "Lead pipeline management with stage tracking",
      "Stripe subscription and one-time payment flows",
      "Twilio-powered click-to-call and SMS",
      "Role-based admin and agent dashboards",
      "Prisma + PostgreSQL data layer",
    ],
    featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    iframe_url: "https://crm.onlydialer.com",
    images: [],
    compliance: ["HIPAA", "CMS"],
  },
  {
    id: "2",
    title: "OnlyDialer",
    description: "Power dialer built for higher pickup rates and conversions, the core of the OnlyDialer sales suite.",
    long_description: "OnlyDialer is the calling engine at the heart of a multi-tenant SaaS sales suite (dialer, CRM, and SMS), purpose-built to drive higher pickup rates and more conversions for sales teams. The platform unifies the power dialer, CRM, and SMS/drip campaign tool behind a shared auth layer and Chrome extension, with per-org Twilio sub-accounts, Stripe per-seat + metered billing, plan-based feature gating, and white-label support for enterprise tiers. The live dialer runs on the Twilio Voice SDK with local presence, 2FA login, call history, and recording playback. Live at onlydialer.com, paired with crm.onlydialer.com and sms.onlydialer.com.",
    image_url: "",
    tech_stack: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "Twilio Voice SDK", "Stripe", "Chrome Extension"],
    category: "Web App",
    github_url: "",
    live_url: "https://onlydialer.com",
    video_url: "",
    features: [
      "Power dialer tuned for higher pickup rates and conversions",
      "Local presence dialing to lift answer rates",
      "Multi-tenant architecture with org-scoped data",
      "Call recording, history, and 2FA-protected agent login",
      "SMS + drip campaign engine paired with the CRM",
      "Stripe per-seat and metered usage billing",
      "Chrome extension for quick actions",
      "White-label support for enterprise tier",
    ],
    featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    iframe_url: "https://onlydialer.com",
    images: [],
    compliance: ["HIPAA", "CMS"],
  },
  {
    id: "3",
    title: "OnlyDialer SMS",
    description: "Outbound SMS campaign platform, the texting arm of the OnlyDialer sales suite.",
    long_description: "The SMS half of the OnlyDialer sales suite. A web app for composing, scheduling, and tracking outbound SMS campaigns through Twilio. Supports templated messages, opt-out handling, delivery reporting, and 2FA-protected access. Sits alongside the OnlyDialer power dialer and CRM at sms.onlydialer.com.",
    image_url: "",
    tech_stack: ["Next.js", "React", "TypeScript", "Twilio SMS", "Prisma", "PostgreSQL"],
    category: "Web App",
    github_url: "",
    live_url: "https://sms.onlydialer.com",
    video_url: "",
    features: [
      "Templated bulk SMS campaigns",
      "Opt-out and compliance handling",
      "Delivery and reply reporting",
      "2FA-protected agent accounts",
      "Scheduled send windows",
    ],
    featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    iframe_url: "https://sms.onlydialer.com",
    images: [],
    compliance: ["HIPAA", "CMS"],
  },
  {
    id: "4",
    title: "Brand Forge",
    description: "AI brand-identity generator running on a local LLM.",
    long_description: "A Next.js 16 app that generates full brand identities (names, taglines, color palettes, and logo concepts) using a locally hosted Ollama model. Includes domain availability checks and one-click PDF export of the generated brand book, so the whole workflow runs without a paid API.",
    image_url: "",
    tech_stack: ["Next.js 16", "React 19", "TypeScript", "Ollama", "Tailwind CSS"],
    category: "AI/ML",
    github_url: "https://github.com/Arink1/brand-forge",
    live_url: "",
    video_url: "",
    features: [
      "Local LLM inference via Ollama (no paid API)",
      "Color palette and typography suggestions",
      "Domain availability lookup",
      "One-click PDF brand book export",
      "Fully private. Nothing leaves the machine",
    ],
    featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    iframe_url: "/demos/brand-forge",
    images: [],
  },
  {
    id: "5",
    title: "Intelligence App",
    description: "Interactive geospatial data-visualization web app.",
    long_description: "A React dashboard for exploring large geospatial datasets. Uses Deck.gl layered on top of Mapbox to render aggregated point, heatmap, and hex-bin views at interactive framerates. Supports layer toggling, attribute-based filtering, and on-map inspection of underlying records.",
    image_url: "/projects/intelligence-app/int1.png",
    tech_stack: ["React", "TypeScript", "Deck.gl", "Mapbox GL", "Vite"],
    category: "Web App",
    github_url: "https://github.com/Arink1/intelligence-app",
    live_url: "",
    video_url: "",
    features: [
      "Deck.gl layer compositing over Mapbox",
      "Hex-bin and heatmap aggregation at scale",
      "Attribute-based filtering and search",
      "On-map record inspection",
      "Client-side rendering of 100k+ points",
    ],
    featured: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    iframe_url: "",
    images: [],
  },
  {
    id: "6",
    title: "Health & Advisor Sites",
    description: "Live WordPress sites I designed, built, and run for health-insurance and financial-advisor brands, with React / Next.js variants ready to deploy.",
    long_description: "A trio of production WordPress sites I designed, built, and operate end-to-end for health-insurance and financial-advisor brands: arinhealthagent.com, bryanhealthagent.com, and mayoradvisors.com. Each is live, indexed, and pulling real organic traffic (analytics screenshots below). I own everything from branding and theme work to hosting, DNS, and ongoing updates. Beyond the WordPress builds, I also have React / Next.js variants of these sites ready to deploy, with custom lead-capture and quote-request forms wired up for when a client wants to graduate off WordPress.",
    image_url: "/projects/arin-health-agent/arinhealthagent-analytics.png",
    tech_stack: ["WordPress", "PHP", "MySQL", "Next.js", "React", "TypeScript"],
    category: "Web App",
    github_url: "",
    live_url: "https://arinhealthagent.com",
    video_url: "",
    features: [
      "Three live WordPress sites: arinhealthagent.com, bryanhealthagent.com, mayoradvisors.com",
      "Real organic traffic across all three (Google Analytics screenshots below)",
      "End-to-end ownership: branding, theme, hosting, DNS, ongoing updates",
      "React / Next.js variants of each site ready to deploy",
      "Custom lead-capture and quote-request forms wired into the Next.js variants",
    ],
    featured: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    iframe_url: "https://arinhealthagent.com",
    images: [
      "/projects/arin-health-agent/arinhealthagent-analytics.png",
      "/projects/arin-health-agent/bryanhealthagent-analytics.png",
      "/projects/arin-health-agent/mayoradvisors-analytics.png",
    ],
    compliance: ["HIPAA", "CMS"],
  },
  {
    id: "8",
    title: "AI Trading Bot",
    description: "Python desktop app for AI-assisted market analysis and trading.",
    long_description: "A CustomTkinter desktop app that pulls equity data from yfinance and crypto data via CCXT to drive a unified charting, analysis, and automated trading interface. Includes Matplotlib-based technical charts, a news feed aggregator, and a trading console that can execute strategies against supported exchanges.",
    image_url: "",
    tech_stack: ["Python", "CustomTkinter", "Matplotlib", "yfinance", "CCXT"],
    category: "AI/ML",
    github_url: "",
    live_url: "",
    video_url: "",
    features: [
      "Equity data via yfinance",
      "Crypto market data and trading via CCXT",
      "Matplotlib technical charting",
      "News aggregation feed",
      "Automated strategy execution against live exchanges",
    ],
    featured: false,
    sort_order: 8,
    created_at: new Date().toISOString(),
    iframe_url: "https://frontend-kappa-three-44.vercel.app",
    images: [],
  },
  {
    id: "9",
    title: "IrisEileens",
    description: "Custom Shopify storefront for a jewelry brand.",
    long_description: "A Shopify storefront built for a jewelry brand, with custom theme work on top of Shopify's Liquid templating, a curated product catalog, cart flow, and checkout powered by Shopify's native commerce stack. Owned the design, theme customization, product data setup, and storefront launch.",
    image_url: "/projects/iriseileens/Res1.png",
    tech_stack: ["Shopify", "Liquid", "HTML/CSS", "JavaScript"],
    category: "Web App",
    github_url: "",
    live_url: "",
    video_url: "",
    features: [
      "Custom Shopify theme and layout",
      "Product catalog with variants",
      "Shopify-native cart and checkout flow",
      "Responsive storefront design",
    ],
    featured: false,
    sort_order: 9,
    created_at: new Date().toISOString(),
    iframe_url: "",
    images: ["/projects/iriseileens/res2.png"],
  },
  {
    id: "7",
    title: "ExposedPIA",
    description: "First fully designed and deployed WordPress site. Live production site for a private investigation agency.",
    long_description: "A complete WordPress build for a private investigation agency at exposedpia.com. This was my first fully designed and deployed production website. I owned every piece from branding and layout through theme implementation, hosting, DNS, and launch. Drives lead capture and service inquiries for the agency.",
    image_url: "",
    tech_stack: ["WordPress", "PHP", "MySQL", "HTML/CSS"],
    category: "Web App",
    github_url: "",
    live_url: "https://exposedpia.com",
    video_url: "",
    features: [
      "End-to-end design, theme build-out, and deployment",
      "Lead-capture and service inquiry forms",
      "Responsive layout across devices",
      "Production WordPress hosting with live domain",
    ],
    featured: false,
    sort_order: 10,
    created_at: new Date().toISOString(),
    iframe_url: "https://exposedpia.com",
    images: [],
  },
  {
    id: "11",
    title: "Marijuana Land",
    description: "Cannabis retail site I built end-to-end, launching late 2026 in Michigan's Upper Peninsula.",
    long_description: "A cannabis retail website I built from the ground up for a client opening their first dispensary in Michigan's Upper Peninsula in late 2026. Sourced and partnered with a designer to lock in the brand identity and logo, then constructed the site on WordPress with a Dockerized local-to-production workflow. I've owned every piece of it: theme build-out, deployment, backups, and ongoing troubleshooting, through to the production launch.",
    image_url: "/projects/marijuana-land/MJL1.png",
    tech_stack: ["WordPress", "PHP", "MySQL", "Docker", "HTML/CSS"],
    category: "Web App",
    github_url: "",
    live_url: "",
    video_url: "",
    features: [
      "Custom frontend theme and block styling",
      "Dockerized local dev environment",
      "Scripted database + content backups",
      "Cannabis-brand design system",
    ],
    featured: false,
    sort_order: 11,
    created_at: new Date().toISOString(),
    iframe_url: "",
    images: [
      "/projects/marijuana-land/MJL2.png",
      "/projects/marijuana-land/MJL3.png",
      "/projects/marijuana-land/MJL4.png",
    ],
  },
  {
    id: "13",
    title: "HG Grapple Gun",
    description: "Custom Garry's Mod weapon addon written in Lua.",
    long_description: "A Garry's Mod SWEP (scripted weapon) that gives players a grapple pistol. Latch onto surfaces and pull yourself across the map. Handles configurable pull force, max grapple distance, and cooldown, and follows the standard GMod shared/init/cl_init Lua structure.",
    image_url: "",
    tech_stack: ["Lua", "Garry's Mod", "Source Engine"],
    category: "Game",
    github_url: "https://github.com/Arink1/hg-grapple-gun",
    live_url: "",
    video_url: "",
    features: [
      "Latch-and-pull grapple physics",
      "Configurable pull force and distance",
      "Cooldown and ammo handling",
      "Standard GMod SWEP structure",
    ],
    featured: false,
    sort_order: 13,
    created_at: new Date().toISOString(),
    images: [],
    code_language: "lua",
    code_snippet: `-- weapon_grapple_pistol.lua
-- Simple grappling pistol for DarkRP (or sandbox). No workshop content needed.

AddCSLuaFile()

SWEP.Base           = "weapon_base"
SWEP.PrintName      = "Grapple Pistol"
SWEP.Author         = "YourServer"
SWEP.Instructions   = "Hold Right Click: grapple. Reload: cancel."
SWEP.Spawnable      = true
SWEP.AdminOnly      = false
SWEP.Category       = "Tools"

SWEP.UseHands       = true
SWEP.ViewModel      = "models/weapons/c_pistol.mdl"
SWEP.WorldModel     = "models/weapons/w_pistol.mdl"
SWEP.ViewModelFOV   = 62

SWEP.Primary.ClipSize    = -1
SWEP.Primary.DefaultClip = -1
SWEP.Primary.Automatic   = false
SWEP.Primary.Ammo        = "none"

SWEP.Secondary.ClipSize    = -1
SWEP.Secondary.DefaultClip = -1
SWEP.Secondary.Automatic   = false
SWEP.Secondary.Ammo        = "none"

-- Config
local MAX_DIST    = 4000
local MIN_DIST    = 120
local STOP_DIST   = 80
local PULL_FORCE  = 450
local UP_BOOST    = 80
local COOLDOWN    = 0.1

function SWEP:Initialize()
    self:SetHoldType("pistol")
    if SERVER then
        self:SetGrappling(false)
        self:SetGrapplePos(Vector(0, 0, 0))
    end
end

function SWEP:SetupDataTables()
    self:NetworkVar("Bool", 0, "Grappling")
    self:NetworkVar("Vector", 0, "GrapplePos")
end

function SWEP:CanPrimaryAttack()
    return true
end

function SWEP:PrimaryAttack()
    -- no action on primary; grapple uses right click
end

function SWEP:SecondaryAttack()
    if not IsValid(self.Owner) then return end
    if self:GetGrappling() then return end
    self:SetNextSecondaryFire(CurTime() + COOLDOWN)

    local shootPos = self.Owner:GetShootPos()
    local dir = self.Owner:GetAimVector()

    local tr = util.TraceLine({
        start  = shootPos,
        endpos = shootPos + dir * MAX_DIST,
        filter = self.Owner
    })

    if not tr.Hit or tr.HitSky then
        self.Owner:EmitSound("buttons/button10.wav")
        return
    end

    local dist = tr.HitPos:Distance(self.Owner:GetPos())
    if dist < MIN_DIST then
        self.Owner:EmitSound("buttons/button10.wav")
        return
    end

    if SERVER then
        self:SetGrapplePos(tr.HitPos)
        self:SetGrappling(true)
    end
    self.Owner:EmitSound("weapons/airboat/airboat_gun_energy1.wav", 75, 130, 0.7, CHAN_AUTO)
end

function SWEP:Reload()
    self:CancelGrapple()
end

function SWEP:CancelGrapple()
    if SERVER and self:GetGrappling() then
        self:SetGrappling(false)
        self:SetGrapplePos(Vector(0, 0, 0))
        if IsValid(self.Owner) then
            self.Owner:EmitSound("buttons/button18.wav", 60, 100, 0.6)
        end
    end
end

function SWEP:Think()
    if CLIENT then return end
    if not IsValid(self.Owner) then return end

    if not self.Owner:KeyDown(IN_ATTACK2) then
        -- stop when right click is released
        if self:GetGrappling() then self:CancelGrapple() end
        return
    end
    if not self:GetGrappling() then
        -- trigger trace once on hold
        self:SecondaryAttack()
        return
    end

    local ply = self.Owner
    local pos = ply:GetPos()
    local target = self:GetGrapplePos()
    if not target then
        self:CancelGrapple()
        return
    end

    local delta = target - pos
    local dist = delta:Length()

    if dist < STOP_DIST then
        self:CancelGrapple()
        return
    end

    local dir = delta:GetNormalized()
    local vel = dir * PULL_FORCE + Vector(0, 0, UP_BOOST)
    -- Reduce existing velocity influence so it feels snappier
    ply:SetVelocity(vel - ply:GetVelocity() * 0.3)
end

-- Optional beam effect (clientside)
if CLIENT then
    function SWEP:DrawHUD()
        -- simple crosshair line
        surface.SetDrawColor(0, 200, 255, 180)
        local x, y = ScrW() / 2, ScrH() / 2
        surface.DrawLine(x - 8, y, x + 8, y)
        surface.DrawLine(x, y - 8, x, y + 8)
    end

    function SWEP:PostDrawViewModel(vm, ply, weapon)
        if not weapon.GetGrappling or not weapon.GetGrapplePos then return end
        if weapon:GetGrappling() then
            render.SetMaterial(Material("cable/cable2"))
            local attach = vm:GetAttachment(1)
            local startPos = attach and attach.Pos or vm:GetPos()
            render.DrawBeam(startPos, weapon:GetGrapplePos(), 3, 0, 1, Color(160, 160, 160, 200))
        end
    end

    function SWEP:DrawWorldModel()
        self:DrawModel()
        if not self.GetGrappling or not self.GetGrapplePos then return end
        if not self:GetGrappling() then return end

        local owner = self:GetOwner()
        local startPos
        if IsValid(owner) then
            local attach = owner:GetAttachment(owner:LookupAttachment("anim_attachment_RH"))
            startPos = attach and attach.Pos or owner:GetShootPos()
        else
            startPos = self:GetPos()
        end

        render.SetMaterial(Material("cable/cable2"))
        render.DrawBeam(startPos, self:GetGrapplePos(), 3, 0, 1, Color(160, 160, 160, 200))
    end
end`,
  },
];

export const sampleSkills: Skill[] = [
  // Frontend
  { id: "f1", name: "React", category: "Frontend", sort_order: 1 },
  { id: "f2", name: "Next.js", category: "Frontend", sort_order: 2 },
  { id: "f3", name: "TypeScript", category: "Frontend", sort_order: 3 },
  { id: "f4", name: "Tailwind CSS", category: "Frontend", sort_order: 4 },
  { id: "f5", name: "Framer Motion", category: "Frontend", sort_order: 5 },
  { id: "f6", name: "HTML/CSS", category: "Frontend", sort_order: 6 },

  // Backend & Data
  { id: "b1", name: "Node.js", category: "Backend & Data", sort_order: 1 },
  { id: "b2", name: "Python", category: "Backend & Data", sort_order: 2 },
  { id: "b3", name: "Django", category: "Backend & Data", sort_order: 3 },
  { id: "b4", name: "Django REST Framework", category: "Backend & Data", sort_order: 4 },
  { id: "b5", name: "REST APIs", category: "Backend & Data", sort_order: 5 },
  { id: "b6", name: "PostgreSQL", category: "Backend & Data", sort_order: 6 },
  { id: "b7", name: "Prisma", category: "Backend & Data", sort_order: 7 },
  { id: "b8", name: "MySQL", category: "Backend & Data", sort_order: 8 },

  // AI / LLMs
  { id: "a1", name: "Claude", category: "AI / LLMs", sort_order: 1 },
  { id: "a2", name: "GPT", category: "AI / LLMs", sort_order: 2 },
  { id: "a3", name: "Ollama (local LLMs)", category: "AI / LLMs", sort_order: 3 },
  { id: "a4", name: "Prompt engineering", category: "AI / LLMs", sort_order: 4 },

  // Telephony & Payments
  { id: "t1", name: "Twilio Voice SDK", category: "Telephony & Payments", sort_order: 1 },
  { id: "t2", name: "Twilio SMS", category: "Telephony & Payments", sort_order: 2 },
  { id: "t3", name: "Stripe", category: "Telephony & Payments", sort_order: 3 },

  // DevOps & Cloud
  { id: "d1", name: "Docker", category: "DevOps & Cloud", sort_order: 1 },
  { id: "d2", name: "AWS", category: "DevOps & Cloud", sort_order: 2 },
  { id: "d3", name: "AWS Elastic Beanstalk", category: "DevOps & Cloud", sort_order: 3 },
  { id: "d4", name: "Vercel", category: "DevOps & Cloud", sort_order: 4 },
  { id: "d5", name: "Supabase", category: "DevOps & Cloud", sort_order: 5 },
  { id: "d6", name: "Git", category: "DevOps & Cloud", sort_order: 6 },
  { id: "d7", name: "CI/CD", category: "DevOps & Cloud", sort_order: 7 },

  // CMS & Storefronts
  { id: "c1", name: "WordPress", category: "CMS & Storefronts", sort_order: 1 },
  { id: "c2", name: "Shopify", category: "CMS & Storefronts", sort_order: 2 },
  { id: "c3", name: "PHP", category: "CMS & Storefronts", sort_order: 3 },
  { id: "c4", name: "Liquid", category: "CMS & Storefronts", sort_order: 4 },
];

export const sampleExperiences: Experience[] = [
  {
    id: "4",
    company: "Publix Super Markets",
    role: "Seafood & Meat Clerk",
    description: "Customer-facing role across the Seafood and Meat departments. Assist customers with product selection and preparation guidance, prepare and package fresh product to order, and maintain food-safety and sanitation standards across both departments.",
    start_date: "",
    end_date: null,
    sort_order: 5,
  },
  {
    id: "1",
    company: "First Family Insurance, Sunrise, FL",
    role: "Licensed Insurance Broker",
    description: "Matched health and life insurance policies to individual and family needs through phone, email, and virtual consultations. During this role I designed and shipped my first fully custom, production-ready public-facing software (arinhealthagent.com), a Django + Next.js platform handling lead intake, household member capture, and quote requests end-to-end. Owned architecture, AWS Elastic Beanstalk deployment, and ongoing maintenance.",
    start_date: "2024-10-12",
    end_date: "2025-12-14",
    sort_order: 2,
  },
  {
    id: "2",
    company: "MGI Farms, Michigan",
    role: "Operations Manager & Web Developer",
    description: "Assisted day-to-day operations across a seasonal harvest cycle recruiting, screening, onboarding, and coordinating interviews while also owning internal web development work. Built tooling to streamline hiring and communication workflows between management and prospective employees.",
    start_date: "2024-08-01",
    end_date: "2024-11-30",
    sort_order: 3,
  },
  {
    id: "3",
    company: "Teleperformance, Remote",
    role: "Customer Service Representative",
    description: "Handled inbound customer service for SimpliSafe home security and alarm systems across phone and digital channels. Troubleshot alarm issues, resolved account questions and service requests, and maintained high customer satisfaction while adhering to compliance standards.",
    start_date: "2023-03-01",
    end_date: "2024-01-20",
    sort_order: 4,
  },
];
