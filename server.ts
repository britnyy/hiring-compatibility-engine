import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to lazily initialize GoogleGenAI with safe validation
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Single Candidate Compatibility Assessor API
app.post('/api/assess-candidate', async (req, res) => {
  try {
    const { roleProfile, questions, candidate } = req.body;

    if (!roleProfile || !questions || !candidate) {
      return res.status(400).json({ error: 'Missing required appraisal payload.' });
    }

    const ai = getGeminiClient();

    // FALLBACK ANALYSIS - If API Key is missing or invalid, generate a highly high-quality, mathematically consistent profile evaluation anyway.
    if (!ai) {
      console.warn('GEMINI_API_KEY is not defined. Initiating offline clinical heuristics fallback...');
      
      // Calculate scores based on the candidate answers to default questions
      const scoreAutonomy = candidate.answers.find((a: any) => a.questionId === 'q1')?.score || 3;
      const scorePace = candidate.answers.find((a: any) => a.questionId === 'q2')?.score || 3;
      const scoreCandor = candidate.answers.find((a: any) => a.questionId === 'q3')?.score || 3;
      const scoreResilience = candidate.answers.find((a: any) => a.questionId === 'q5')?.score || 3;
      const scoreConscientiousness = candidate.answers.find((a: any) => a.questionId === 'q6')?.score || 3;
      const scoreValues = candidate.answers.find((a: any) => a.questionId === 'q8')?.score || 3;

      // Simple heuristic weights based on role requirements
      let jobFit = 70;
      let cultureFit = 70;
      
      if (roleProfile.roleName.toLowerCase().includes('engineer')) {
        // High autonomy & precision needed
        jobFit = Math.round((scoreAutonomy * 10) + (scoreConscientiousness * 10));
        // Candor & resilience for startup culture
        cultureFit = Math.round((scoreCandor * 10) + (scoreResilience * 10));
      } else {
        jobFit = Math.round((scorePace * 10) + (scoreAutonomy * 10));
        cultureFit = Math.round((scoreValues * 10) + (scoreCandor * 10));
      }

      jobFit = Math.min(100, Math.max(30, jobFit));
      cultureFit = Math.min(100, Math.max(30, cultureFit));
      const overallFit = Math.round((jobFit + cultureFit) / 2);
      const synergyScore = Math.round((scoreValues * 10) + (scoreResilience * 6) + (scoreAutonomy * 4));

      let recommendation = 'Recommended';
      let prediction = 'Autonomous Performer - Standard Adaptability Support';

      if (overallFit > 85) {
        recommendation = 'Highly Recommended';
        prediction = 'High Autonomy Catalyst - Minimal Mentorship Needed';
      } else if (overallFit < 60) {
        recommendation = 'Alternative Option';
        prediction = 'Mentorship Contextualized - High Onboarding Guidance Required';
      }

      const mockResult = {
        scoreFitOverall: overallFit,
        scoreFitJob: jobFit,
        scoreFitCulture: cultureFit,
        retentionScore: Math.min(100, synergyScore),
        retentionPrediction: prediction,
        successCatalysts: [
          `Solid alignment on the core ${roleProfile.roleName} deliverables.`,
          'Strong performance index recorded on team resilience scenarios.',
          'Demonstrates professional personal accountability under work pressure.'
        ],
        conflictPoints: [
          'Slight divergence in pacing expectations and process standardization rules.',
          'May require periodic mentorship to navigate non-negotiables.'
        ],
        cultureFitSummary: `The candidate possesses a good overlap with the ${roleProfile.roleName} culture parameters, showing balanced motivations around career development and internal accountability.`,
        suitabilityRecommendation: recommendation,
        detailedExplanation: `(Assessments generated via Offline Psychological Model fallback. For complete, in-depth Gemini-driven contextual analysis, please configure your GEMINI_API_KEY in Settings > Secrets.) This candidate shows reliable core traits matching typical requirements for ${roleProfile.roleName}. They show constructive conflict resolution styles.`,
        assessedAt: new Date().toISOString()
      };

      return res.json(mockResult);
    }

    // Prepare prompt utilizing deep I-O Psychology framing
    const prompt = `
      You are an elite Industrial-Organizational (I-O) Psychologist and Chief Talent Assessor.
      Perform an objective, highly comprehensive compatibility assessment of a job candidate based on:
      
      1. THE ROLE DESCRIPTION (Hiring Requirements):
         - Role Name: ${roleProfile.roleName}
         - Department: ${roleProfile.department}
         - Essential Traits: ${JSON.stringify(roleProfile.traits)}
         - Non-Negotiables: ${JSON.stringify(roleProfile.nonNegotiables)}
         - Long-Term Drivers: ${JSON.stringify(roleProfile.retentionDrivers)}
         - Company Culture: ${roleProfile.companyCulture}

      2. CANDIDATE PROFILE:
         - Name: ${candidate.name}
         - Headline: ${candidate.headline}

      3. STANDARD QUESTIONNAIRE RESPONSES (Answers range from 1 to 5, where 5 is high alignment/strongly agree with the statement):
         ${JSON.stringify(
           candidate.answers.map((ans: any) => {
             const matchingQ = questions.find((q: any) => q.id === ans.questionId);
             return {
               statement: matchingQ ? matchingQ.text : 'Unknown',
               dimension: matchingQ ? matchingQ.constructLabel : 'Unknown Construct',
               score: ans.score
             };
           }),
           null,
           2
         )}

      Assess the core Person-Job (P-J) fit, Person-Organization (P-O) fit, and onboarding synergy/potential friction levels based on I-O psychology research (e.g., Schneider's ASA framework, Locke's Goal-setting theory, Big Five conscientiousness as a performance predictor).
      
      Determine the overall fit metrics, culture alignment, success catalysts, potential points of conflict (blind spots), onboarding velocity, and direct suitability feedback to the Hiring Manager.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreFitOverall: { type: Type.INTEGER, description: 'Overall fitness score from 0 to 100.' },
            scoreFitJob: { type: Type.INTEGER, description: 'Core job duty alignment from 0 to 100.' },
            scoreFitCulture: { type: Type.INTEGER, description: 'Company culture match from 0 to 100.' },
            retentionScore: { type: Type.INTEGER, description: 'Coaching & Growth Adaptability Index from 0 to 100, where high scores denote self-sufficiency, rapid onboarding adaptability, and very low training support needed.' },
            retentionPrediction: { type: Type.STRING, description: 'Predictive Coaching & Mentorship requirement scale (e.g., "High Autonomy Catalyst - Minimal Mentorship Needed", "Autonomous Performer - Standard Adaptability Support", "Structured Adaptability - Moderate Supervision Needed", "Mentorship Contextualized - High Onboarding Guidance Required").' },
            successCatalysts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 clear, specific reasons why this candidate will excel.'
            },
            conflictPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 realistic points of potential operational conflict or communication blind spots.'
            },
            cultureFitSummary: { type: Type.STRING, description: 'Summary of how and why they fit or mismatch company culture.' },
            suitabilityRecommendation: { 
              type: Type.STRING, 
              description: 'MUST be exactly one of: "Highly Recommended", "Recommended", "Alternative Option", "Not Recommended".' 
            },
            detailedExplanation: { type: Type.STRING, description: 'In-depth, professional developmental analysis referencing the questionnaire constructs.' }
          },
          required: [
            'scoreFitOverall',
            'scoreFitJob',
            'scoreFitCulture',
            'retentionScore',
            'retentionPrediction',
            'successCatalysts',
            'conflictPoints',
            'cultureFitSummary',
            'suitabilityRecommendation',
            'detailedExplanation'
          ]
        }
      }
    });

    const reportText = response.text;
    if (!reportText) {
      throw new Error('No assessment output received from Gemini API.');
    }

    const reportJson = JSON.parse(reportText.trim());
    return res.json({
      ...reportJson,
      assessedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Failure in assess-candidate handler:', error);
    return res.status(500).json({ error: 'Assessment synthesis failed: ' + error.message });
  }
});

// 2. Candidate Comparative Analysis API
app.post('/api/compare-candidates', async (req, res) => {
  try {
    const { roleProfile, candidates } = req.body;

    if (!roleProfile || !candidates || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'Missing comparison details.' });
    }

    const completedCandidates = candidates.filter(c => c.assessment && c.status === 'completed');
    if (completedCandidates.length === 0) {
      return res.status(400).json({ error: 'No assessed candidates available to compile a matrix.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.warn('GEMINI_API_KEY is not defined. Compiling offline comparative heuristics...');
      
      // Sort candidates by overall score descending
      const sorted = [...completedCandidates].sort((a, b) => b.assessment!.scoreFitOverall - a.assessment!.scoreFitOverall);
      const bestCandidate = sorted[0];

      return res.json({
        recommendedCandidateId: bestCandidate.id,
        rankingReasons: sorted.map((c, idx) => `${idx + 1}. ${c.name} (Fit: ${c.assessment!.scoreFitOverall}% | ${c.assessment!.suitabilityRecommendation}) - Highlights high competence indicators.`),
        visualInsights: [
          {
            label: 'Values Orientation',
            description: 'Comparison of value drivers. High candidates match autonomy; others indicate traditional hierarchy expectations.'
          },
          {
            label: 'Operational Pacing',
            description: 'Alignment with speed vs. quality. Some candidates balance precision while others favor fast agile delivery templates.'
          },
          {
            label: 'Onboarding Synergy & Acceleration',
            description: 'Measures readiness for rapid, friction-free contribution. Highlights developmental mentoring requirements.'
          }
        ],
        topFitAnalysis: `Offline comparative rank selected ${bestCandidate.name} as the highest structural fit. (Configure a GEMINI_API_KEY in Secrets to activate full psychological synthesis comparison.)`
      });
    }

    const prompt = `
      You are an elite talent strategist. Compare these candidates who applied for the role of ${roleProfile.roleName} in ${roleProfile.department}.
      
      ROLE CONTEXT:
      - Essential Traits Needed: ${JSON.stringify(roleProfile.traits)}
      - Culture parameters: ${roleProfile.companyCulture}
      
      CANDIDATES PERFORMANCE LOGS:
      ${JSON.stringify(
        completedCandidates.map(c => ({
          id: c.id,
          name: c.name,
          overallFit: c.assessment!.scoreFitOverall,
          jobFit: c.assessment!.scoreFitJob,
          cultureFit: c.assessment!.scoreFitCulture,
          retentionScore: c.assessment!.retentionScore,
          pred: c.assessment!.retentionPrediction,
          rec: c.assessment!.suitabilityRecommendation,
          catalysts: c.assessment!.successCatalysts,
          conflicts: c.assessment!.conflictPoints
        })),
        null,
        2
      )}

      Deliver a Comparative Recommendation Matrix. Rank them clearly, name the absolute optimal best match candidate, and outline structured comparative insights along core organizational dimensions.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCandidateId: { type: Type.STRING, description: 'The absolute ID of the best fit candidate.' },
            rankingReasons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 ranking analysis lines explaining the ranking of all candidates.'
            },
            visualInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: 'Dimension label, e.g. "Values & Candor", "Agility vs. Quality".' },
                  description: { type: Type.STRING, description: 'A detailed 2-sentence comparative evaluation.' }
                },
                required: ['label', 'description']
              },
              description: 'Cross-candidate metrics explanations.'
            },
            topFitAnalysis: { type: Type.STRING, description: 'Detailed expert rationale explaining why the recommended candidate is the absolute best match for this particular team setup.' }
          },
          required: [
            'recommendedCandidateId',
            'rankingReasons',
            'visualInsights',
            'topFitAnalysis'
          ]
        }
      }
    });

    const matrixText = response.text;
    if (!matrixText) {
      throw new Error('Comparison output was not generated.');
    }

    return res.json(JSON.parse(matrixText.trim()));

  } catch (error: any) {
    console.error('Failure in compare-candidates handler:', error);
    return res.status(500).json({ error: 'Comparative matrix compilation failed: ' + error.message });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Recruitment Compatibility Assessor backend running on port ${PORT}`);
  });
}

startServer();

