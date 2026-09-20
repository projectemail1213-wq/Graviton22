import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ZipArchive } from "archiver";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Config Status
  app.get("/api/config", (_req, res) => {
    res.json({
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.8-flash",
      status: "ready"
    });
  });

  // Export & Download Entire Project as ZIP
  app.get("/api/download-zip", (_req, res) => {
    try {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="graviton-ai-project.zip"');

      const archive = new ZipArchive({
        zlib: { level: 9 },
      });

      archive.on("error", (err: any) => {
        console.error("Archive error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to generate project archive" });
        }
      });

      archive.pipe(res);

      // Add all project source files, skipping bulky artifacts
      archive.glob("**/*", {
        cwd: process.cwd(),
        ignore: [
          "node_modules/**",
          "dist/**",
          ".git/**",
          ".cache/**",
          "*.log",
          ".env",
        ],
        dot: true,
      });

      archive.finalize();
    } catch (err: any) {
      console.error("Download error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err?.message || "Failed to create archive" });
      }
    }
  });

  // API Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history = [], forceMock = false } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

    // If API key is present and user didn't force mock mode, use real Gemini
    if (hasApiKey && !forceMock) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        // Construct contents
        const formattedHistory = history.map((item: { role: string; content: string }) => ({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: item.content }],
        }));

        const contents = [
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction:
              "You are Graviton, a calm, deeply intelligent, futuristic AI workspace copilot. Your responses are clear, insightful, beautifully structured, and concise. You provide thoughtful synthesis, clear reasoning, code snippets when relevant, and maintain an elegant, understated, respectful tone.",
          },
        });

        const replyText = response.text || "I have analyzed your prompt and generated these insights.";
        return res.json({
          reply: replyText,
          source: "gemini",
        });
      } catch (err: any) {
        console.error("Gemini API error, falling back to simulated intelligence:", err?.message);
        // Fall back gracefully to mock system if API call fails
      }
    }

    // Mock Mode / Fallback Intelligence System
    const mockReply = generateSimulatedResponse(message);
    return res.json({
      reply: mockReply,
      source: "mock",
    });
  });

  // Intelligent Contextual Mock Response Generator
  function generateSimulatedResponse(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes("explain") || lower.includes("quantum") || lower.includes("relativity") || lower.includes("gravity")) {
      return `### Gravitational Fields & Spacetime Curvature

In modern theoretical physics, gravity is not merely an invisible tensile force acting at distance—it represents the **intrinsic curvature of four-dimensional spacetime** induced by mass and energy.

> *"Matter tells spacetime how to curve, and spacetime tells matter how to move."*  
> — John Archibald Wheeler

#### Core Conceptual Framework
1. **The Geodesic Principle**: Free-falling particles traverse geodesics—the straightest possible trajectories across bent spacetime manifolds.
2. **Gravitational Time Dilation**: Clocks run measurably slower closer to intense gravitational wells ($\Delta t' = \Delta t \sqrt{1 - 2GM/rc^2}$).
3. **Quantum Tension**: General relativity treats spacetime as a continuous fabric, while quantum field theory discretizes interactions into quanta (gravitons). Reconciling this duality remains one of modern science's greatest frontiers.

*How would you like to expand this concept—mathematical foundations or cosmological implications?*`;
    }

    if (lower.includes("learn") || lower.includes("study") || lower.includes("teach") || lower.includes("how to")) {
      return `### Accelerated Learning Blueprint: High-Leverage Mastery

To absorb complex domains with high retention, Graviton structures learning into four recursive phases:

\`\`\`plaintext
[Deconstruct Domain] ➔ [Identify Core 20%] ➔ [Active Feedback Loops] ➔ [Feynman Synthesis]
\`\`\`

#### Structured Action Steps
- **Step 1: First-Principles Deconstruction**: Strip the subject down to its non-negotiable axioms before memorizing terminology.
- **Step 2: Mental Model Stacking**: Connect new principles to physical metaphors you already intuitively grasp.
- **Step 3: Rapid Friction Testing**: Build a small project or solve real problems within 48 hours of reading theory.

What domain or topic are we targeting for your curriculum today?`;
    }

    if (lower.includes("code") || lower.includes("react") || lower.includes("python") || lower.includes("typescript") || lower.includes("function") || lower.includes("write something")) {
      return `### High-Performance Reactive State Machine

Here is a clean, modern implementation of an autonomous state orchestrator designed for fluid user interfaces:

\`\`\`typescript
interface StateNode<T> {
  readonly state: T;
  readonly timestamp: number;
}

export class GravitonStream<T> {
  private listeners = new Set<(val: T) => void>();
  private current: T;

  constructor(initial: T) {
    this.current = initial;
  }

  get value(): T {
    return this.current;
  }

  dispatch(next: T): void {
    if (Object.is(this.current, next)) return;
    this.current = next;
    this.listeners.forEach((listener) => listener(this.current));
  }

  subscribe(listener: (val: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
\`\`\`

#### Key Architectural Highlights
- **Zero redundant renders**: Uses strict equality guards before dispatching updates.
- **Clean teardown**: Returns an unsubscribe disposal function to prevent memory leaks.
- **Minimalist footprint**: Zero external dependencies with complete type inference.`;
    }

    if (lower.includes("idea") || lower.includes("explore") || lower.includes("brainstorm") || lower.includes("creative")) {
      return `### Conceptual Horizons: Exploratory Synthesis

Here are three distinct ideation vectors based on your inquiry:

1. **The Ambient Spatial Workspace**  
   *Core Concept*: An interface that dynamically recalibrates its visual density based on user eye fixation and interaction velocity, eliminating cognitive overhead.

2. **Deterministic Context Anchoring**  
   *Core Concept*: Transforming fleeting ephemeral thoughts into durable knowledge graphs through automated vector indexing and semantic clustering.

3. **Symbiotic AI Telemetry**  
   *Core Concept*: Machine learning agents that mirror human cognitive flow states, silently pre-computing reference materials seconds before they are explicitly prompted.

Which direction would you like to unpack and develop further?`;
    }

    // Default thoughtful Graviton response
    return `### Graviton Synthesis

I have processed your query: **"${prompt.length > 80 ? prompt.slice(0, 77) + '...' : prompt}"**

#### Analysis & Key Takeaways
- **Dimensionality**: Your inquiry touches upon core structural principles. By breaking down the problem into atomic variables, we uncover direct optimization paths.
- **Synthesis**: A minimalist, high-leverage approach yields the cleanest resolution with minimal friction.
- **Next Horizon**: We can develop this into an actionable workflow, test edge cases, or draft comprehensive documentation.

Feel free to ask follow-up questions or prompt me to refine specific aspects.`;
  }

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Graviton server running at http://localhost:${PORT}`);
  });
}

startServer();
