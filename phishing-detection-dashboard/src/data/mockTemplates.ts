import { ScanResult, QuizQuestion } from "../types";

export interface ScanPreset {
  id: string;
  name: string;
  type: "url" | "email" | "image" | "combined";
  label: string;
  payload: {
    url?: string;
    emailText?: string;
    imageData?: string; // we can use illustrative base64 or custom indicators
    fileName?: string;
  };
  mockOutput: ScanResult; // fallback if API key isn't provided yet
}

export const SCAN_PRESETS: ScanPreset[] = [
  {
    id: "preset-paypal-phish",
    name: "PayPal Account Hold Fake Alert",
    type: "email",
    label: "Phishing Email",
    payload: {
      emailText: `Subject: URGENT: Your PayPal account has been limited!
From: PayPal Security <secureservice-alert-update-9428@customer-support-portal.net>

Dear Customer,

We detected some suspicious activity on your PayPal account on June 17, 2026. For your security, we have restricted your account access until you confirm your identity.

If you do not update your account within 24 hours, your account will be permanently suspended and any remaining funds will be frozen.

Please click the secure link below to verify your identity and restore access:
https://secure-paypal-login.account-resolution-alert.info/webscr?cmd=_login-run

Thank you for your prompt attention.

Sincerely,
PayPal Account Protection Services`
    },
    mockOutput: {
      prediction: "Phishing",
      confidence: 0.98,
      riskLevel: "High",
      reasons: [
        "Extremely urgent action demanded under threat of suspension or frozen funds.",
        "Sender address domain does not originate from standard paypal.com domain.",
        "Redirect target URL uses deceptive subdomains mimicking PayPal, but on lookalike customer-support-portal.com.",
        "Generic greeting ('Dear Customer') instead of personalized name."
      ],
      action: "Quarantine Email immediately and Block sender domain",
      threatTypes: ["Brand Impersonation", "Credential Harvesting", "Urgency Call to Action"],
      indicators: [
        { label: "Domain Legitimacy", status: "severe", detail: "Sender domain 'customer-support-portal.net' is not PayPal's official domain." },
        { label: "Target URL SSL Check", status: "warning", detail: "Destination domain does not match official brand and represents a credential trap." },
        { label: "Urgency Multiplier", status: "severe", detail: "Demanded verification within 24 hours under financial threat." },
        { label: "Greeting Authenticity", status: "warning", detail: "Used generic 'Dear Customer' instead of account holder's legal name." }
      ],
      extractedDetails: {
        senderEmail: "secureservice-alert-update-9428@customer-support-portal.net",
        impersonatorBrand: "PayPal",
        domainReputation: "Deceptive/Flagged",
        sslStatus: "Suspicious Let's Encrypt Cert",
        suspiciousKeywords: ["URGENT", "restricted", "suspended", "frozen", "verify"]
      }
    }
  },
  {
    id: "preset-bank-url-phish",
    name: "Lookalike Banking Login Portal",
    type: "url",
    label: "Phishing URL",
    payload: {
      url: "https://chase-security-verify-online.web-account-resolution.top/login.html"
    },
    mockOutput: {
      prediction: "Phishing",
      confidence: 0.97,
      riskLevel: "High",
      reasons: [
        "Atypical high-risk top-level domain '.top' linked to high rates of deceptive campaigns.",
        "Impersonation of Chase Bank inside subdomains ('chase-security-verify-online') to deceive viewers.",
        "Target endpoint represents credential-harvesting parameters."
      ],
      action: "Block URL on Web Gateway and Alert Incident Response team",
      threatTypes: ["Credential Harvesting", "Social Engineering"],
      indicators: [
        { label: "TLD Risk score", status: "severe", detail: "Uses '.top' which has a verified reputation of hosting phishing pages." },
        { label: "Subdomain Cloning", status: "severe", detail: "Matches 'Chase Bank' brand name in subdomains on completely unrelated primary domain." },
        { label: "SSL Certificate", status: "warning", detail: "Domain registered less than 48 hours ago, bypassing standard reputation filters." }
      ],
      extractedDetails: {
        impersonatorBrand: "Chase Bank",
        domainReputation: "Extremely High Threat",
        sslStatus: "Active - Domain Validated Only",
        suspiciousKeywords: ["chase", "security", "verify", "web-account"]
      }
    }
  },
  {
    id: "preset-google-legit",
    name: "Legitimate Google SSO Endpoint",
    type: "url",
    label: "Legitimate URL",
    payload: {
      url: "https://accounts.google.com/v3/signin/identifier?authuser=0&flowName=GlifWebSignIn"
    },
    mockOutput: {
      prediction: "Legitimate",
      confidence: 0.99,
      riskLevel: "Low",
      reasons: [
        "Fully authentic Google accounts sub-domain verified with high-reputation EV cert.",
        "Highly-trusted registrar history and verified corporate infrastructure.",
        "SSL configurations match Google's standard secure key rotation policy."
      ],
      action: "Allow and proceed",
      threatTypes: ["None"],
      indicators: [
        { label: "Domain Legitimacy", status: "safe", detail: "Valid Google domain 'google.com' matching standard web auth endpoints." },
        { label: "TLD Risk score", status: "safe", detail: "Standard high-trust '.com' registration." },
        { label: "SSL Authority", status: "safe", detail: "Verified Google Trust Services global root certificate." }
      ],
      extractedDetails: {
        impersonatorBrand: "None",
        domainReputation: "Excellent (Trusted Enterprise)",
        sslStatus: "Fully Validated Google Trust Corp",
        suspiciousKeywords: []
      }
    }
  },
  {
    id: "preset-netflix-image",
    name: "Replica Netflix Invoice Attachment",
    type: "image",
    label: "Phishing Screenshot",
    payload: {
      fileName: "netflix_billing_suspended.jpg",
      // Simple transparent base64 1x1 png representing an image preset
      imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    },
    mockOutput: {
      prediction: "Phishing",
      confidence: 0.95,
      riskLevel: "High",
      reasons: [
        "Visual design mimics Netflix invoice branding, but contains a highly suspect 'Update Payment' anchor button.",
        "Language embedded in image displays fear-inducing threats about account termination within 2 hours.",
        "OCR text extraction identifies suspicious redirect links hosting malware parameters."
      ],
      action: "Flag attachment as malicious, delete from mail servers",
      threatTypes: ["Brand Impersonation", "Phishing Attachment"],
      indicators: [
        { label: "Brand Cloning", status: "severe", detail: "Replica Netflix logo and fonts utilized without matching authorization signatures." },
        { label: "Visual Deception", status: "severe", detail: "Action buttons designed to bypass automated security filters while drawing user attention." },
        { label: "Threat Urgency", status: "severe", detail: "Threatens payment resolution failure inside a 2-hour window." }
      ],
      extractedDetails: {
        impersonatorBrand: "Netflix",
        domainReputation: "Malicious Attachment OCR Flag",
        sslStatus: "N/A - Image File",
        suspiciousKeywords: ["NETFLIX", "payment method", "suspended", "update now", "declined"]
      }
    }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    type: "email",
    sender: "Internal IT Helpdesk <it-support-tickets@company-portal-update.com>",
    subjectOrUrl: "ACTION REQUIRED: Mandatory corporate password reset",
    bodyPreview: "Hello Team, we are migrating to a new single-sign-on system starting this weekend. You must click here http://www.company-portal-update.com/reset-password to sync your current NT account credentials. Fail to do so before 5PM today will lock you out of Microsoft Outlook.",
    isPhishing: true,
    explanation: "This is a classic 'urgency ticket' spoofing internal IT. The domain 'company-portal-update.com' is not your organization's domain, and the link uses unencrypted http protocol which is highly dangerous.",
    redFlags: [
      "Suspicious external domain pretending to be internal IT",
      "Extremely short deadline (locked out by 5PM today)",
      "Unencrypted 'http://' protocol link for password input",
      "Vague warning with immediate penalty"
    ]
  },
  {
    id: "q2",
    type: "url",
    sender: "Legitimate Corporate Link",
    subjectOrUrl: "https://github.com/login/oauth/authorize?client_id=12345&redirect_uri=https://company.okta.com",
    bodyPreview: "Standard secure authentication redirect for modern Single Sign-On.",
    isPhishing: false,
    explanation: "This is a legitimate OAuth authorization URL redirecting to your company's secure Okta tenant on github.com. Both domains are secure, well-known, and standard for enterprise apps.",
    redFlags: [
      "Authentic SSL domain origins",
      "Transparent OAuth query params",
      "No artificial threats of account locking"
    ]
  },
  {
    id: "q3",
    type: "email",
    sender: "DocuSign Secure Envelope <docusing@document-signs.com>",
    subjectOrUrl: "CRITICAL: Signature Requested - Termination Package and Offboarding Agreement",
    bodyPreview: "Please review and digitally sign your offboard contract agreement immediately. Failure to complete digital signature of this document within 4 hours can delay final severance and tax files.",
    isPhishing: true,
    explanation: "Notice the sender domain misspells DocuSign as 'docusing' (typosquatting) and uses an external resolver 'document-signs.com'. Phishers use shock-value subjects like terminations to panic you.",
    redFlags: [
      "DocuSign brand name misspelled 'docusing'",
      "Sender domain 'document-signs.com' mimics signature portals",
      "Panic-inducing severance lockout claim",
      "Extremely short deadline (4 hours)"
    ]
  },
  {
    id: "q4",
    type: "url",
    sender: "Microsoft Cloud Login Spoof",
    subjectOrUrl: "https://login.microsoftonline.com.secure-app-redic-portal.xyz/common/oauth2/v2.0",
    bodyPreview: "Fake Outlook/Microsoft login target hosting credentials.",
    isPhishing: true,
    explanation: "This link attempts to abuse subdomain stacking. While it starts with 'login.microsoftonline.com', the ACTUAL primary domain is 'secure-app-redic-portal.xyz'. This is a highly severe credential harvest site.",
    redFlags: [
      "Actual primary domain is '.xyz', not Microsoft",
      "Subdomain stacking hides the true domain",
      "Used to capture corporate login details"
    ]
  }
];
