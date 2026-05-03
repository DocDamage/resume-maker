import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aiChat } from "@/utils/aiEngine";
import { useAIStore } from "@/stores/aiStore";
import { Loader2, MessageCircle, HelpCircle, Lightbulb } from "lucide-react";

interface InterviewQuestion {
  category: string;
  question: string;
  tip: string;
}

export function InterviewQuestionGenerator() {
  const resume = useResumeStore((s) => s.resume);
  const provider = useAIStore((s) => s.provider);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[] | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const bullets = resume.experience.flatMap((e) => e.description);
      const prompt = `Based on this resume, generate 8 likely interview questions a hiring manager would ask.

Resume:
- ${resume.personal.fullName}, ${resume.personal.title}
- Summary: ${resume.summary}
- Experience bullets:
${bullets.map((b) => "  • " + b).join("\n")}
- Skills: ${resume.skills.flatMap((s) => s.skills).join(", ")}

Output ONLY JSON array like:
[{"category":"Behavioral","question":"...","tip":"..."},...]

Categories to include: Behavioral, Technical, Leadership, Project Deep-dive, Situational. Make questions specific to the resume content. Tips should be 1-sentence advice on how to answer well.`;

      if (provider === "local") {
        // Fallback heuristic questions
        setQuestions(generateFallbackQuestions(resume));
      } else {
        const result = await aiChat({
          system: "You are a hiring manager. Respond with valid JSON only.",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          response_format: { type: "json_object" },
        });
        const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const arr = Array.isArray(parsed) ? parsed : parsed.questions || parsed.items || [];
        setQuestions(arr.slice(0, 8));
      }
    } catch {
      setQuestions(generateFallbackQuestions(resume));
    } finally {
      setLoading(false);
    }
  };

  const categoryColors: Record<string, string> = {
    Behavioral: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Technical: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Leadership: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "Project Deep-dive": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    Situational: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HelpCircle size={18} />
          Interview Prep
          <Badge variant="outline" className="ml-auto text-[10px]">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate likely interview questions based on your actual resume bullets. Practice with questions tailored to your experience.
        </p>
        <Button onClick={generate} disabled={loading} size="sm">
          {loading ? <Loader2 size={14} className="animate-spin mr-1" /> : <MessageCircle size={14} className="mr-1" />}
          Generate Questions
        </Button>

        {questions && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((q, i) => (
              <div key={i} className="rounded-md border p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] ${categoryColors[q.category] || "bg-gray-100 text-gray-800"}`}>
                    {q.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{q.question}</p>
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Lightbulb size={12} className="mt-0.5 shrink-0 text-yellow-600" />
                  {q.tip}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function generateFallbackQuestions(resume: ReturnType<typeof useResumeStore.getState>["resume"]): InterviewQuestion[] {
  const bullets = resume.experience.flatMap((e) => e.description);
  const qs: InterviewQuestion[] = [];

  qs.push({
    category: "Behavioral",
    question: `Tell me about a time you demonstrated leadership in your role as ${resume.personal.title}.`,
    tip: "Use the STAR method: Situation, Task, Action, Result.",
  });

  if (bullets.some((b) => b.includes("%") || b.includes("improve"))) {
    qs.push({
      category: "Project Deep-dive",
      question: "Walk me through a project where you improved a key metric. How did you measure success?",
      tip: "Be specific about the baseline, your actions, and the final numbers.",
    });
  }

  if (resume.skills.some((s) => s.skills.some((sk) => sk.toLowerCase().includes("react") || sk.toLowerCase().includes("angular") || sk.toLowerCase().includes("vue")))) {
    qs.push({
      category: "Technical",
      question: "Why did your team choose this frontend framework, and what tradeoffs did you consider?",
      tip: "Show you understand architecture decisions, not just syntax.",
    });
  }

  qs.push({
    category: "Situational",
    question: "Describe a situation where you had to learn a new technology quickly to meet a deadline.",
    tip: "Emphasize your learning process and how you applied it under pressure.",
  });

  qs.push({
    category: "Technical",
    question: "How do you approach debugging a production issue that you can't reproduce locally?",
    tip: "Mention logging, monitoring, feature flags, and incremental rollbacks.",
  });

  if (bullets.some((b) => b.toLowerCase().includes("team") || b.toLowerCase().includes("mentor"))) {
    qs.push({
      category: "Leadership",
      question: "Tell me about a time you mentored someone. What was the outcome?",
      tip: "Focus on the other person's growth, not just your own actions.",
    });
  }

  qs.push({
    category: "Behavioral",
    question: "What's the most challenging technical problem you've solved in the past year?",
    tip: "Choose something complex but explain it simply. Show your thought process.",
  });

  qs.push({
    category: "Situational",
    question: "How do you handle disagreements with teammates about technical approaches?",
    tip: "Show diplomacy, data-driven decision making, and willingness to compromise.",
  });

  return qs;
}
