# Vigil Care Staffing — CLAUDE.md

## Project Overview
Care staffing agency website for Vigil Care Staffing.
B2B division serving care homes, NHS, supported
living and private clients across London.
CQC-compliant care professionals.

## Repository
GitHub: https://github.com/netyvee/staffing.git
Local: C:\laragon\www\staffing
Domain: staffing.vigilservices.co.uk

## Division Identity
Name: Vigil Care Staffing
Brand: navy #0a1628 background, white text, teal #4ecdc4 CTA, #7fb2d4 secondary
       (shared website palette — the earlier blue #378ADD is the CRM-internal
       Staffing admin colour, NEVER used on the website; corrected W-FRAMEWORK-F1, C-4)
Phone: 020 3973 8887
Email: staffing@vigilservices.co.uk
Service type: Staffing

## Related Repositories
CRM: C:\laragon\www\app (netyvee/app)
Cleaning: C:\laragon\www\vigil-cleaning
Security: C:\laragon\www\security
Care: C:\laragon\www\care

## CRM Integration
Enquiry page: https://app.vigilservices.co.uk/enquire/staffing
API endpoint: POST https://app.vigilservices.co.uk/api/enquiry
Service type value: "Staffing"

## Services Offered
- Temporary staffing solutions
- Permanent placements
- Urgent last-minute cover
- Healthcare assistants
- Support workers
- Senior carers
- Nurses

## Target Audience (B2B)
- Care homes
- NHS facilities
- Supported living providers
- Private care clients
- Local authorities

## Key Differentiators
- Enhanced DBS checked staff
- Right-to-work verified
- CQC compliant
- Can fill shifts within hours
- Same staff requested repeatedly
- Free weekly planning tools on PSL

## CTA Strategy
All CTAs point to:
https://app.vigilservices.co.uk/enquire/staffing

Primary CTA text: "Request staff now"
Secondary CTA text: "Add us to your PSL"

## Important Notes
- B2B audience — professional urgent tone
- Speed is the key value proposition
- Compliance is critical selling point
- AWR 2010 compliance required
- 12-week qualifying period applies

## Deployment
Next.js render-from-JSON engine on Vercel (auto-deploys on push to main).
Page content lives in content/pages/*.json, committed by the CRM
(netyvee/app vigil:web-publish-site — QA-gated auto-publish on CRM deploy).
Do NOT hand-edit page JSON; content changes go through the CRM.
(The old WordPress site is the MIGRATION SOURCE only — corrected W-FRAMEWORK-F1.)

## NEVER
- Promise staff availability without checking
- Mention specific pay rates publicly
- Change the navy/teal website colour scheme (navy #0a1628, teal #4ecdc4 —
  blue #378ADD is CRM-internal only, never on the website)
- Use vague language about compliance
