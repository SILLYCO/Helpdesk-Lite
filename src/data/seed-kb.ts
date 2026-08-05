import type { KnowledgeArticle } from "@/types"

export const SEED_KB_ARTICLES: KnowledgeArticle[] = [
  {
    id: "kb-101",
    title: "Troubleshooting Cisco AnyConnect VPN Disconnections",
    category: "Network",
    summary: "Fix frequent VPN disconnects on macOS and Windows following security policy updates.",
    content: `### Summary
If your VPN disconnects every 15-30 minutes, it is likely caused by an expired session token or conflicting IPv6 settings.

### Resolution Steps
1. Open **Cisco AnyConnect Secure Mobility Client**.
2. Click the gear icon to open **Preferences**.
3. Under **Preferences**, uncheck *Allow Local LAN Access* and re-check it.
4. If running macOS 14+, execute the following in Terminal to flush DNS caches:
   \`\`\`bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   \`\`\`
5. Re-authenticate using your Acme SSO credentials.`,
    tags: ["VPN", "Network", "macOS", "AnyConnect"],
    helpfulCount: 42,
    unhelpfulCount: 3,
    views: 310,
    updatedAt: "2026-07-25",
  },
  {
    id: "kb-102",
    title: "Requesting Figma Enterprise License & Workspace Access",
    category: "Software Access",
    summary: "Standard operating procedure for requesting Figma Design or Dev Mode seat allocations.",
    content: `### Overview
Acme Corporation provides Figma Enterprise licenses for Product Designers, Product Managers, and Engineers.

### How to Request
1. Submit a support ticket in HelpDesk Lite under **Software Access**.
2. Select your Department Manager for approval.
3. Your seat will be provisioned automatically within 2 business hours of manager sign-off.`,
    tags: ["Figma", "Design", "Software", "Access"],
    helpfulCount: 28,
    unhelpfulCount: 1,
    views: 185,
    updatedAt: "2026-07-20",
  },
  {
    id: "kb-103",
    title: "MacBook Pro M-Series Peripheral & Display Setup",
    category: "Hardware",
    summary: "Configuring dual 4K monitors and Thunderbolt docking stations for Apple Silicon laptops.",
    content: `### External Display Limits
- **M1/M2/M3 Base**: Supports 1 external display via DisplayPort or HDMI.
- **M1/M2/M3 Pro & Max**: Supports up to 2-4 external displays.

### Recommended Dock Setup
Connect the CalDigit TS4 dock using the included 40Gbps Thunderbolt 4 cable directly to the rear left USB-C port.`,
    tags: ["Hardware", "Monitor", "MacBook", "Display"],
    helpfulCount: 19,
    unhelpfulCount: 0,
    views: 140,
    updatedAt: "2026-07-15",
  },
  {
    id: "kb-104",
    title: "Setting Up Multi-Factor Authentication (MFA) with Okta",
    category: "Software",
    summary: "Step-by-step instructions to register a new mobile phone or security key for 2FA.",
    content: `### Steps
1. Visit \`https://sso.acme.com/account/settings\`.
2. Click **Add Security Key or Biometrics** or **Set up Okta Verify**.
3. Scan the QR code using Okta Verify on iOS/Android.`,
    tags: ["MFA", "Okta", "Security", "Auth"],
    helpfulCount: 56,
    unhelpfulCount: 2,
    views: 520,
    updatedAt: "2026-08-01",
  },
]
