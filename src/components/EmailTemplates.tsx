import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCopy, CheckCircle, Mail, Clock, Handshake, Star, AlertCircle } from "lucide-react";

interface Template {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  subject: string;
  body: string;
}

export function EmailTemplates() {
  const resume = useResumeStore((s) => s.resume);
  const [copied, setCopied] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: "follow-up",
      label: "Application Follow-Up",
      category: "Post-Apply",
      icon: <Clock size={14} />,
      subject: `Following up on ${resume.personal.title} application`,
      body: `Hi [Hiring Manager Name],\n\nI hope this message finds you well. I wanted to follow up on my application for the [Role] position at [Company] that I submitted on [Date].\n\nI'm very excited about the opportunity to bring my experience in ${resume.skills.flatMap((s) => s.skills).slice(0, 4).join(", ")} to your team.\n\nPlease let me know if there's any additional information I can provide. I would welcome the chance to discuss how I can contribute.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}\n${resume.personal.phone}`,
    },
    {
      id: "thank-you",
      label: "Post-Interview Thank You",
      category: "Post-Interview",
      icon: <Star size={14} />,
      subject: "Thank you — [Role] interview",
      body: `Hi [Interviewer Name],\n\nThank you for taking the time to speak with me today about the [Role] position. I enjoyed learning more about [Company]'s approach to [specific topic discussed] and the challenges your team is tackling.\n\nOur conversation reinforced my enthusiasm for the role. I'm confident my background in ${resume.skills.flatMap((s) => s.skills).slice(0, 3).join(", ")} would allow me to make meaningful contributions quickly.\n\nPlease don't hesitate to reach out if you need any additional information. I look forward to hearing about next steps.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}\n${resume.personal.phone}`,
    },
    {
      id: "referral",
      label: "Referral Request",
      category: "Networking",
      icon: <Handshake size={14} />,
      subject: `Interested in [Role] at [Company] — referral request`,
      body: `Hi [Contact Name],\n\nI hope you're doing well! I noticed that [Company] is hiring for a [Role] and I immediately thought of you.\n\nGiven my experience with ${resume.skills.flatMap((s) => s.skills).slice(0, 3).join(", ")}, I believe I'd be a strong fit for the team.\n\nWould you be open to referring me, or perhaps having a brief chat about the role and team culture? I'd really appreciate any insight you could share.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}\n${resume.personal.linkedin ? `LinkedIn: ${resume.personal.linkedin}` : ""}`,
    },
    {
      id: "counter-offer",
      label: "Salary Counter-Offer",
      category: "Negotiation",
      icon: <AlertCircle size={14} />,
      subject: `Regarding [Company] offer — [Role]`,
      body: `Hi [Hiring Manager/Recruiter Name],\n\nThank you again for the offer to join [Company] as [Role]. I'm truly excited about the opportunity and the team.\n\nAfter careful consideration of the overall package and my market research for similar roles in [Location], I was hoping we could discuss the base salary. Based on my [X years] of experience and specialized skills in ${resume.skills.flatMap((s) => s.skills).slice(0, 3).join(", ")}, I was expecting a base in the range of [Your Range].\n\nI'm confident we can find a number that works for both of us. I'm very eager to join the team and start contributing.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}\n${resume.personal.phone}`,
    },
    {
      id: "decline",
      label: "Decline Offer (Graceful)",
      category: "Negotiation",
      icon: <Mail size={14} />,
      subject: `Thank you — [Role] at [Company]`,
      body: `Hi [Hiring Manager/Recruiter Name],\n\nThank you so much for the offer and for the time you and the team invested in the interview process. I've genuinely enjoyed getting to know [Company] and learning about the exciting work you're doing.\n\nAfter careful consideration, I've decided to pursue another opportunity that aligns more closely with my current career goals.\n\nI hope our paths cross again in the future, and I wish you and the team continued success.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}`,
    },
    {
      id: "re-engagement",
      label: "Re-engagement (Stale Application)",
      category: "Post-Apply",
      icon: <Clock size={14} />,
      subject: `Re: [Role] application — ${resume.personal.fullName}`,
      body: `Hi [Hiring Manager/Recruiter Name],\n\nI hope you're doing well. I wanted to circle back regarding my application for the [Role] position at [Company].\n\nSince applying, I've [brief update: earned a certification / shipped a project / learned a new skill], and I'm more excited than ever about the possibility of joining your team.\n\nIf the role is still open, I'd love to continue the conversation. If not, I'd welcome being considered for future opportunities.\n\nBest regards,\n${resume.personal.fullName}\n${resume.personal.email}\n${resume.personal.phone}`,
    },
  ];

  const handleCopy = (template: Template) => {
    const text = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(template.id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail size={18} />
          Email Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Pre-written email templates for every stage of the job search. Personalized with your resume data.
        </p>
        <div className="space-y-2">
          {templates.map((t) => (
            <div key={t.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t.icon}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                  <Badge variant="outline" className="text-[9px]">{t.category}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleCopy(t)}
                >
                  {copied === t.id ? (
                    <><CheckCircle size={12} className="mr-1 text-green-600" /> Copied</>
                  ) : (
                    <><ClipboardCopy size={12} className="mr-1" /> Copy</>
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded border border-dashed line-clamp-3">
                <strong>Subject:</strong> {t.subject}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
