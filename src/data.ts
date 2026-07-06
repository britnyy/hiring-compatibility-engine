import { Question, Candidate, HiringManagerProfile } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'I prefer to establish my own direction and goals rather than waiting for structural guidelines from my supervisor.',
    construct: 'P_J_FIT_AUTONOMY',
    constructLabel: 'Need for Autonomy',
    type: 'scale',
    category: 'Work Style'
  },
  {
    id: 'q2',
    text: 'I perform best in environments where rapid execution and speed are prioritized over slow, perfect quality.',
    construct: 'P_J_FIT_WORKSTYLE',
    constructLabel: 'Pace vs. Precision Preference',
    type: 'scale',
    category: 'Work Style'
  },
  {
    id: 'q3',
    text: 'I value absolute transparency and direct, unvarnished performance feedback over diplomacy.',
    construct: 'P_O_FIT_VALUE',
    constructLabel: 'Values Alignment (Directness)',
    type: 'scale',
    category: 'Values'
  },
  {
    id: 'q4',
    text: 'I prioritize having a strong sense of overarching mission or purpose over financial package optimization.',
    construct: 'P_O_FIT_VALUE',
    constructLabel: 'Values Alignment (Purpose)',
    type: 'scale',
    category: 'Values'
  },
  {
    id: 'q5',
    text: 'When a critical unexpected issue compromises my current sprint, I maintain high focus and adapt without significant frustration.',
    construct: 'BIG5_RESILIENCE',
    constructLabel: 'Resilience & Stress Tolerance',
    type: 'scale',
    category: 'Personality'
  },
  {
    id: 'q6',
    text: 'I am extremely meticulous, ensuring all work outputs are double-checked for minutiae and logical precision.',
    construct: 'BIG5_CONSCIENTIOUSNESS',
    constructLabel: 'Conscientiousness & Detail-Orientation',
    type: 'scale',
    category: 'Personality'
  },
  {
    id: 'q7',
    text: 'I prefer taking deep solo ownership of a project rather than relying on heavy group consensus to move forward.',
    construct: 'BIG5_AGREEABLENESS',
    constructLabel: 'Social Interdependence',
    type: 'scale',
    category: 'Personality'
  },
  {
    id: 'q8',
    text: 'I feel most aligned when my personal growth vector matches the company\'s learning opportunity, even when role descriptions are highly fluid.',
    construct: 'RETENTION_DRIVER_MATCH',
    constructLabel: 'Retention Motivation Alignment',
    type: 'scale',
    category: 'Values'
  },
  {
    id: 'q9',
    text: 'I prefer highly structured, predictable working hours with clear boundaries between life and professional demands.',
    construct: 'P_O_FIT_ENVIRONMENT',
    constructLabel: 'Flexible vs. Structured Boundaries',
    type: 'scale',
    category: 'Work Style'
  },
  {
    id: 'q10',
    text: 'Scenario: You notice an edge-case bug in a feature your team completed. The client hasn’t reported it, and fixing it would delay the impending release by 2 days. What is your chosen action?',
    construct: 'BIG5_CONSCIENTIOUSNESS',
    constructLabel: 'Conscientiousness (Product Stewardship)',
    type: 'scenario',
    choices: [
      'Proactively report the issue with a remediation plan and advocate for delaying the launch.',
      'Document the bug in the backlog, launch on time, and build a patch for the next cycle.',
      'Wait for the client or users to run into it first so resources aren’t wasted unilaterally.',
      'Ignore it because edge cases are rarely encountered by normal users.'
    ],
    category: 'Situational Judgement'
  },
  {
    id: 'q11',
    text: 'Scenario: Your manager implements a workflow change that you strongly believe introduces critical inefficiency and developer friction. How do you address it?',
    construct: 'BIG5_AGREEABLENESS',
    constructLabel: 'Collaboration & Conflict Resolution',
    type: 'scenario',
    choices: [
      'Compile concrete workflow diagnostics data and present alternative paths to them in an in-depth 1-on-1.',
      'Slightly bypass or ignore the rules to preserve personal workspace efficiency.',
      'Openly highlight the flaws in team channels to form a unified developer front.',
      'Quietly comply with the change, accepting that leadership makes final determinations.'
    ],
    category: 'Situational Judgement'
  },
  {
    id: 'q12',
    text: 'Scenario: Due to server migration failures under tight client deadlines, your team is asked to work significant overtime weekend hours. How do you process this work crisis?',
    construct: 'BIG5_RESILIENCE',
    constructLabel: 'Resilience (Team Crises)',
    type: 'scenario',
    choices: [
      'Step up, organize sub-teams to expedite resolution, and check in regularly with teammates.',
      'Fulfill minimal required emergency tasks but strictly log concerns about systemic planning gaps.',
      'Refuse the overtime to safeguard personal mental health indicators, suggesting outsourcing.',
      'Become detached, letting other colleagues handle communication lines.'
    ],
    category: 'Situational Judgement'
  }
];

export const DEFAULT_ROLE_PROFILES: HiringManagerProfile[] = [
  {
    roleName: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    traits: [
      'Extreme technical self-sufficiency',
      'Meticulous documentation standards',
      'High adaptability under high-stress system migrations',
      'Collaborative constructor'
    ],
    nonNegotiables: [
      'Direct, continuous feedback orientation (high candor)',
      'High product stewardship (no cutting corners on security/quality)',
      'Readiness for occasional cross-functional support'
    ],
    retentionDrivers: [
      'Deep autonomy over technological stack decisions',
      'Direct interaction with state-of-the-art tooling',
      'Clear technological growth paths'
    ],
    companyCulture: 'A high-performance product-centric environment based on Radical Candor, extreme technical ownership, swift iteration speed with light bureaucracy, and continuous professional learning.'
  },
  {
    roleName: 'Lead Product Designer',
    department: 'Design & UX',
    traits: [
      'Empathetic design leadership',
      'Iterative experimental cadence',
      'User-centric systems thinker',
      'High cross-functional communication clarity'
    ],
    nonNegotiables: [
      'Accepting of intense constructive peer design critiques',
      'Comfortable with extreme fluidity and shifting requirements',
      'Strong collaborative co-design style'
    ],
    retentionDrivers: [
      'High impact on product roadmap decisions',
      'A psychological safe culture that celebrates failures as learning experiences',
      'Ample creative budget and dedicated learning time'
    ],
    companyCulture: 'A collaborative, boundary-pushing studio culture emphasizing meticulous attention to craft, structured cross-functional alignments, data-grounded intuition, and constant healthy feedback loops.'
  }
];

export const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Emma Chen',
    email: 'emma.chen@io-psych.org',
    headline: 'Senior Engineer | Devops Engineer | 8 Years XP',
    status: 'completed',
    appliedRole: 'Senior Full-Stack Engineer',
    answers: [
      { questionId: 'q1', score: 4 }, // High autonomy
      { questionId: 'q2', score: 4 }, // High pace
      { questionId: 'q3', score: 5 }, // Extreme directness fit
      { questionId: 'q4', score: 4 }, // High purpose match
      { questionId: 'q5', score: 5 }, // Extreme resilience
      { questionId: 'q6', score: 4 }, // High detail
      { questionId: 'q7', score: 3 }, // Moderate individual/team balance
      { questionId: 'q8', score: 5 }, // Growth match
      { questionId: 'q9', score: 2 }, // Prefers flexible boundaries (fine with chaos)
      { questionId: 'q10', score: 1 }, // Option 1: Proactively report with delaying launch plan
      { questionId: 'q11', score: 1 }, // Option 1: Present diagnostics in 1-on-1
      { questionId: 'q12', score: 1 }  // Option 1: Step up, coordinate resolution
    ],
    assessment: {
      scoreFitOverall: 94,
      scoreFitJob: 96,
      scoreFitCulture: 92,
      retentionScore: 95,
      retentionPrediction: 'Excelling - Predicted 4+ Years',
      successCatalysts: [
        'Exceptional alignment with Radical Candor culture (Values directness rating: 5/5)',
        'Extremely high crisis resilience and self-management capabilities',
        'Strong alignment with product stewardship requirements (Advocates for delayed launches on critical bugs)'
      ],
      conflictPoints: [
        'High desire for stack autonomy might lead to friction if uniform container standards are enforced'
      ],
      cultureFitSummary: 'Emma thrives in environments with low bureaucracy, extreme accountability, and high-impact autonomy. Her communication style of radical candor matches the hiring team\'s expectations perfectly.',
      suitabilityRecommendation: 'Highly Recommended',
      detailedExplanation: 'Based on quantitative psychological profiles, Emma showcases perfect fit parameters for high-autonomy environments. Her situational responses demonstrate genuine ownership which protects the code base from cutting corners.',
      assessedAt: '2026-06-22T02:00:00.000`Z'
    }
  },
  {
    id: 'cand-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@talentbase.io',
    headline: 'Full-Stack Developer | Lead Developer | 6 Years XP',
    status: 'completed',
    appliedRole: 'Senior Full-Stack Engineer',
    answers: [
      { questionId: 'q1', score: 3 }, // Moderate autonomy
      { questionId: 'q2', score: 3 }, // Balanced pace/precision
      { questionId: 'q3', score: 4 }, // Likes candor
      { questionId: 'q4', score: 3 }, // Balanced packages/purpose
      { questionId: 'q5', score: 4 }, // Good resilience
      { questionId: 'q6', score: 5 }, // Extremely meticulous
      { questionId: 'q7', score: 4 }, // Prefers substantial solo ownership
      { questionId: 'q8', score: 4 }, // Good growth match
      { questionId: 'q9', score: 4 }, // Prefers some set boundaries
      { questionId: 'q10', score: 2 }, // Option 2: Backlog, launch and build patch later
      { questionId: 'q11', score: 1 }, // Option 1: Present diagnostics in 1-on-1
      { questionId: 'q12', score: 2 }  // Option 2: Fulfill required EMERGENCY tasks, log concerns
    ],
    assessment: {
      scoreFitOverall: 78,
      scoreFitJob: 82,
      scoreFitCulture: 74,
      retentionScore: 80,
      retentionPrediction: 'Stable Fit - Predicted 2-3 Years',
      successCatalysts: [
        'Meticulous technical detail-orientation (5/5 conscientiousness)',
        'Constructive communication channels in times of workflow disputes',
        'Reliable execution focus'
      ],
      conflictPoints: [
        'High preference for clear, distinct boundaries (Score: 4/5) might conflict with fluid developer expectations during emergency system failures',
        'Moderate discomfort with extreme ambiguity'
      ],
      cultureFitSummary: 'Alex possesses a robust structure fit but relies heavily on clear guidelines and healthy work-life pacing. Alignment is mostly good, but will require mentoring during highly chaotic schedules.',
      suitabilityRecommendation: 'Recommended',
      detailedExplanation: 'Alex has very high core programming standards and is structured. He is a solid engineer, though his work pattern prefers predictable goals.',
      assessedAt: '2026-06-22T01:30:00.000Z'
    }
  },
  {
    id: 'cand-3',
    name: 'David Kim',
    email: 'david.kim@legacydev.net',
    headline: 'Senior Backend Specialist | 10 Years XP',
    status: 'completed',
    appliedRole: 'Senior Full-Stack Engineer',
    answers: [
      { questionId: 'q1', score: 2 }, // Low autonomy (prefers clear guidelines)
      { questionId: 'q2', score: 1 }, // High precision, completely slow execution
      { questionId: 'q3', score: 2 }, // Prefers soft diplomacy and supportive environment
      { questionId: 'q4', score: 2 }, // High financial packages focus
      { questionId: 'q5', score: 2 }, // Fails to handle sudden sprint disruptions smoothly
      { questionId: 'q6', score: 5 }, // Extreme detail
      { questionId: 'q7', score: 5 }, // High solo owner, dislikes consensus but also dislikes teamwork
      { questionId: 'q8', score: 2 }, // Low growth fit
      { questionId: 'q9', score: 5 }, // Rigid boundaries required
      { questionId: 'q10', score: 3 }, // Option 3: Wait for client to find bug
      { questionId: 'q11', score: 4 }, // Option 4: Quietly comply and feel disengaged
      { questionId: 'q12', score: 3 }  // Option 3: Refuse overtime outright
    ],
    assessment: {
      scoreFitOverall: 48,
      scoreFitJob: 55,
      scoreFitCulture: 40,
      retentionScore: 35,
      retentionPrediction: 'High Retention Risk - Less than 1 Year',
      successCatalysts: [
        'Extremly deep technical accuracy (Double-checks everything, zero tolerance for error)'
      ],
      conflictPoints: [
        'Major values mismatch with high autonomy structure. David requires rigid boundaries (5/5 rating) and predefined tickets.',
        'High conflict with direct performance evaluation styles. Extreme comfort mismatch with Radical Candor code review loops.',
        'Vulnerable to high disengagement when workflows change without warning.'
      ],
      cultureFitSummary: 'David requires highly predictable environment settings and supportive, formal interaction pipelines. The high candor, high agency, fluid startup-like culture of the company poses severe friction points.',
      suitabilityRecommendation: 'Alternative Option',
      detailedExplanation: 'While highly capable technogically as a backend specialist, David’s ideal organizational fit is inside larger, highly structured enterprise companies with stable architectures and isolated developer tickets.',
      assessedAt: '2026-06-22T01:00:00.000Z'
    }
  },
  {
    id: 'cand-4',
    name: 'Sofia Vance',
    email: 'sofia.vance@studio-fit.design',
    headline: 'Senior UX Designer | Interaction lead | 7 Years XP',
    status: 'completed',
    appliedRole: 'Lead Product Designer',
    answers: [
      { questionId: 'q1', score: 5 },
      { questionId: 'q2', score: 4 },
      { questionId: 'q3', score: 4 },
      { questionId: 'q4', score: 5 },
      { questionId: 'q5', score: 4 },
      { questionId: 'q6', score: 5 },
      { questionId: 'q7', score: 2 },
      { questionId: 'q8', score: 5 },
      { questionId: 'q9', score: 2 },
      { questionId: 'q10', score: 1 },
      { questionId: 'q11', score: 1 },
      { questionId: 'q12', score: 1 }
    ],
    assessment: {
      scoreFitOverall: 92,
      scoreFitJob: 94,
      scoreFitCulture: 90,
      retentionScore: 96,
      retentionPrediction: 'Excelling - Predicted 4+ Years',
      successCatalysts: [
        'Exceptional alignment with iterative research & co-design parameters',
        'Strong alignment with studio construct of constructive criticism',
        'Demonstrates intense pride of craftsmanship matching the non-negotiables'
      ],
      conflictPoints: [
        'Strong push for constant UX research cycles might sometimes delay hyper-swift development prints'
      ],
      cultureFitSummary: 'Sofia showcases an outstanding fit with the collaborative, high-feedback culture. Her dedication to craft and user empathy aligns perfectly with the Lead Product Designer guidelines.',
      suitabilityRecommendation: 'Highly Recommended',
      detailedExplanation: 'Based on targeted assessment parameters, Sofia has extremely strong scores on both autonomy and constructive criticism feedback resilience. She thrives inside high-agency environments where design is valued as a leading product pillar.',
      assessedAt: '2026-06-22T03:15:00.000Z'
    }
  },
  {
    id: 'cand-5',
    name: 'Marcus Reynolds',
    email: 'm.reynolds@conceptlab.dev',
    headline: 'UI Designer | Visual Designer | 4 Years XP',
    status: 'completed',
    appliedRole: 'Lead Product Designer',
    answers: [
      { questionId: 'q1', score: 3 },
      { questionId: 'q2', score: 5 },
      { questionId: 'q3', score: 3 },
      { questionId: 'q4', score: 4 },
      { questionId: 'q5', score: 3 },
      { questionId: 'q6', score: 3 },
      { questionId: 'q7', score: 4 },
      { questionId: 'q8', score: 4 },
      { questionId: 'q9', score: 3 },
      { questionId: 'q10', score: 2 },
      { questionId: 'q11', score: 3 },
      { questionId: 'q12', score: 2 }
    ],
    assessment: {
      scoreFitOverall: 72,
      scoreFitJob: 76,
      scoreFitCulture: 68,
      retentionScore: 75,
      retentionPrediction: 'Stable Fit - Predicted 2-3 Years',
      successCatalysts: [
        'Extremely fast visual ideation and prototyping speeds',
        'Autonomous task ownership of core interface patterns'
      ],
      conflictPoints: [
        'Lower score on detail check (3/5) might require engineering double-checking of spacing tokens',
        'Prefers solo work channels which may mismatch with hyper-integrated design team alignment patterns'
      ],
      cultureFitSummary: 'Marcus shows a healthy match with fast pacing demands, but has slightly lower alignment with deep co-design practices and extreme collective critique standards.',
      suitabilityRecommendation: 'Recommended',
      detailedExplanation: 'Marcus is a rapid, concept-driven designer who can turn around visual solutions quickly. He is highly active and responsive, but fits better under structured design briefs rather than ultra-ambiguous product scopes.',
      assessedAt: '2026-06-22T04:20:00.000Z'
    }
  }
];
