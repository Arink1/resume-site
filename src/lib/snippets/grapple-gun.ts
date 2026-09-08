// Garry's Mod SWEP source shown on the HG Grapple Gun project page.
export const grappleGunSnippet = `
-- weapon_grapple_pistol.lua
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
end`;
