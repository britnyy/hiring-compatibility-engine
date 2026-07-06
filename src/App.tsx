import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings2, 
  Brain, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Award, 
  Layers, 
  Sparkles, 
  Check, 
  RotateCcw,
  BookOpen,
  UserPlus,
  Compass,
  ArrowLeft,
  ChevronRight,
  Info,
  Calendar,
  Layers2
} from 'lucide-react';
import { DEFAULT_QUESTIONS, DEFAULT_ROLE_PROFILES, DEFAULT_CANDIDATES } from './data';
import { HiringManagerProfile, Question, Candidate, AssessmentResult } from './types';
import ResearchInfo from './components/ResearchInfo';

export function getPsychometricReference(construct: string) {
  switch (construct) {
    case 'P_J_FIT_AUTONOMY':
      return { testName: "Self-Determination Inventory (SDI)", scale: "Deci & Ryan's Work Autonomy Index" };
    case 'P_J_FIT_WORKSTYLE':
      return { testName: "O*NET Work Styles Profile", scale: "Pacing & Precision Orientation Scale" };
    case 'P_O_FIT_VALUE':
      return { testName: "Organizational Culture Profile (OCP)", scale: "O'Reilly & Chatman's Value Congruence Index" };
    case 'P_O_FIT_ENVIRONMENT':
      return { testName: "Work Environment Scale (WES)", scale: "Moos Boundary & Hierarchy Adaptability" };
    case 'BIG5_RESILIENCE':
      return { testName: "International Personality Item Pool (IPIP-NEO-120)", scale: "Emotional Stability / Stress Resilience" };
    case 'BIG5_CONSCIENTIOUSNESS':
      return { testName: "International Personality Item Pool (IPIP-NEO-120)", scale: "Conscientiousness / Product Stewardship" };
    case 'BIG5_AGREEABLENESS':
      return { testName: "International Personality Item Pool (IPIP-NEO-120)", scale: "Agreeableness / Team Interdependence Scale" };
    case 'RETENTION_DRIVER_MATCH':
      return { testName: "Job Diagnostic Survey (JDS)", scale: "Hackman-Oldham Psychological Growth matching" };
    default:
      return { testName: "", scale: "" };
  }
}

export function getTailoredQuestionText(question: Question, role: HiringManagerProfile): string {
  const roleName = role?.roleName || 'the requested';
  const department = role?.department || 'our department';
  const companyCulture = role?.companyCulture || '';
  const traits = role?.traits || [];
  const nonNegotiables = role?.nonNegotiables || [];
  const retentionDrivers = role?.retentionDrivers || [];

  switch (question?.id) {
    case 'q1': // Autonomy
      const traitWord = traits[0] || 'self-sufficiency';
      return `For the ${roleName} role, how do you align with this: "I prefer to establish my own direction and goals (aligning with ${traitWord.toLowerCase()}) rather than waiting for structural guidelines."`;
    case 'q2': // Pace vs Precision
      return `In ${department}, we often balance speed and accuracy. How do you relate to this: "I perform best in environments where rapid execution and speed are prioritized over slow, perfect quality."`;
    case 'q3': // Values - Directness
      return `Our culture is described as: "${companyCulture}". To what extent does this statement match your natural behavior: "I value absolute transparency and direct, unvarnished performance feedback over diplomacy."`;
    case 'q4': // Values - Purpose
      return `Regarding the mission of our ${department} team: "I prioritize having a strong sense of overarching mission or purpose over financial package optimization."`;
    case 'q5': // Resilience
      const resilienceTrait = traits.find(t => t.toLowerCase().includes('stress') || t.toLowerCase().includes('adapt') || t.toLowerCase().includes('resilien')) || 'handling challenging situations';
      return `When sudden crises occur in the ${roleName} workflow (such as those requiring ${resilienceTrait.toLowerCase()}): "When critical unexpected issues compromise my current sprint, I maintain high focus and adapt."`;
    case 'q6': // Conscientiousness
      const detailTrait = nonNegotiables.find(n => n.toLowerCase().includes('meticulous') || n.toLowerCase().includes('stewardship') || n.toLowerCase().includes('quality')) || 'high quality standards';
      return `Regarding our non-negotiables for ${roleName} (which highlight ${detailTrait.toLowerCase()}): "I am extremely meticulous, ensuring all work outputs are double-checked for minutiae and logical precision."`;
    case 'q7': // Agreeableness / Social Interdependence
      return `Within our collaborative ${department} setup: "I prefer taking deep solo ownership of a project rather than relying on heavy group consensus to move forward."`;
    case 'q8': // Retention
      const focusDriver = retentionDrivers[0] || 'growth and development';
      return `Regarding your long-term career indicators (such as ${focusDriver.toLowerCase()}): "I feel most aligned when my personal growth vector matches the company's learning opportunity."`;
    case 'q9': // PO Environment - boundaries
      return `Adapting to the environment of our ${department} department: "I prefer highly structured, predictable working hours with clear boundaries between life and professional demands."`;
    case 'q10': // Conscientiousness scenario
      const qualityStandard = nonNegotiables.find(n => n.toLowerCase().includes('quality') || n.toLowerCase().includes('stewardship') || n.toLowerCase().includes('meticulous')) || 'high deliverables standards';
      return `Scenario: You notice an edge-case bug in a feature you completed for the ${roleName} role. The client has not reported it yet, and fixing it would delay the impending release by 2 days. Keeping in mind our standard for ${qualityStandard.toLowerCase()}, what is your chosen action?`;
    case 'q11': // Agreeableness resolution scenario
      const cultureExcerpt = companyCulture.length > 80 ? `${companyCulture.slice(0, 80)}...` : companyCulture;
      return `Scenario: Your manager in the ${department} department implements a workflow change that you believe introduces critical inefficiency. How do you address this within our culture of "${cultureExcerpt}"?`;
    case 'q12': // Resilience crisis scenario
      return `Scenario: Due to critical client-facing failures for ${roleName}, your team is asked to assist with urgent overtime weekend hours. How do you process this work crisis?`;
    default:
      return question?.text || '';
  }
}

export default function App() {
  // State management
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('io_candidates');
    return saved ? JSON.parse(saved) : DEFAULT_CANDIDATES;
  });
  
  const [roleProfile, setRoleProfile] = useState<HiringManagerProfile>(() => {
    const saved = localStorage.getItem('io_role_profile');
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PROFILES[0];
  });

  const [questions] = useState<Question[]>(DEFAULT_QUESTIONS);
  
  // Navigation & Active Views
  const [activeTab, setActiveTab] = useState<'intro' | 'role' | 'pipeline' | 'comparative'>('intro');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>('cand-1');
  
  // Custom Role Profile Form
  const [roleEditName, setRoleEditName] = useState(roleProfile.roleName);
  const [roleEditDept, setRoleEditDept] = useState(roleProfile.department);
  const [roleEditCulture, setRoleEditCulture] = useState(roleProfile.companyCulture);
  const [newTrait, setNewTrait] = useState('');
  const [newNonNeg, setNewNonNeg] = useState('');
  const [newRetDriver, setNewRetDriver] = useState('');

  // Add Candidate Form
  const [newCandName, setNewCandName] = useState('');
  const [newCandEmail, setNewCandEmail] = useState('');
  const [newCandHeadline, setNewCandHeadline] = useState('');
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);

  // Active Questionnaire State
  const [assessorCandidateId, setAssessorCandidateId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});

  // Comparative Matrix state
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Status & Loading states
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessError, setAssessError] = useState<string | null>(null);

  // Active role segment candidate list
  const activeCandidates = candidates.filter(c => (c.appliedRole || 'Senior Full-Stack Engineer') === roleProfile.roleName);

  // Auto-switch selected candidate if the active role changes and has candidates
  useEffect(() => {
    if (activeCandidates.length > 0) {
      if (!selectedCandidateId || !activeCandidates.some(c => c.id === selectedCandidateId)) {
        setSelectedCandidateId(activeCandidates[0].id);
      }
    } else {
      setSelectedCandidateId(null);
    }
  }, [roleProfile.roleName]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('io_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('io_role_profile', JSON.stringify(roleProfile));
  }, [roleProfile]);

  // Load Comparative Analysis automatically on mounts / updates
  useEffect(() => {
    const completed = activeCandidates.filter(c => c.assessment && c.status === 'completed');
    if (completed.length > 0) {
      triggerComparativeSynthesis(completed);
    } else {
      setComparisonResult(null);
    }
  }, [candidates, roleProfile.roleName]);

  // Trigger candidate assessment using our real API
  const handleAssessCandidate = async (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setIsAssessing(true);
    setAssessError(null);

    // Update state to "assessing"
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'assessing' } : c));

    try {
      const response = await fetch('/api/assess-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleProfile,
          questions,
          candidate
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const assessment: AssessmentResult = await response.json();
      
      setCandidates(prev => prev.map(c => 
        c.id === candidateId 
          ? { ...c, status: 'completed', assessment } 
          : c
      ));

      setSelectedCandidateId(candidateId);
    } catch (err: any) {
      console.error(err);
      setAssessError(err.message || 'Error occurred during assessment.');
      setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: 'failed' } : c));
    } finally {
      setIsAssessing(false);
    }
  };

  // Comparative Analysis API trigger
  const triggerComparativeSynthesis = async (completedList: Candidate[]) => {
    setIsComparing(true);
    setCompareError(null);

    try {
      const response = await fetch('/api/compare-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleProfile,
          candidates: completedList
        })
      });

      if (!response.ok) {
        throw new Error('Comparison API reported error.');
      }

      const data = await response.json();
      setComparisonResult(data);
    } catch (err: any) {
      console.error(err);
      setCompareError(err.message || 'Comparison synthesis failed.');
    } finally {
      setIsComparing(false);
    }
  };

  // Add Candidate to Pipeline
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) return;

    const newCand: Candidate = {
      id: 'cand-' + Date.now(),
      name: newCandName,
      email: newCandEmail || `${newCandName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      headline: newCandHeadline || 'Applicant Candidate',
      answers: [],
      status: 'pending',
      appliedRole: roleProfile.roleName
    };

    setCandidates(prev => [...prev, newCand]);
    setNewCandName('');
    setNewCandEmail('');
    setNewCandHeadline('');
    setIsAddingCandidate(false);
  };

  // Delete candidate
  const handleDeleteCandidate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this candidate?')) {
      setCandidates(prev => prev.filter(c => c.id !== id));
      if (selectedCandidateId === id) {
        setSelectedCandidateId(null);
      }
    }
  };

  // Initiate Live Interview Assessment
  const startLiveAssessment = (candidateId: string) => {
    setAssessorCandidateId(candidateId);
    setCurrentQuestionIndex(0);
    // Prefill with existing questionnaire answers or start clean
    const candidate = candidates.find(c => c.id === candidateId);
    const initialAnswers: Record<string, number> = {};
    if (candidate && candidate.answers.length > 0) {
      candidate.answers.forEach(a => {
        initialAnswers[a.questionId] = a.score;
      });
    }
    setAssessmentAnswers(initialAnswers);
    setActiveTab('pipeline');
  };

  // Record active interview answer
  const handleAnswerSelect = (questionId: string, ratingValue: number) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: ratingValue
    }));
  };

  // Finish Questionnaire and run automatic Assessment
  const submitCandidateAnswers = () => {
    if (!assessorCandidateId) return;

    // Convert Record to CandidateAnswers
    const finalAnswers = Object.entries(assessmentAnswers).map(([qId, score]) => ({
      questionId: qId,
      score
    }));

    // Save answers into the candidates list
    setCandidates(prev => prev.map(c => {
      if (c.id === assessorCandidateId) {
        return {
          ...c,
          answers: finalAnswers,
          status: 'pending' // Ready for assessment
        };
      }
      return c;
    }));

    const candId = assessorCandidateId;
    setAssessorCandidateId(null);
    setCurrentQuestionIndex(0);
    
    // Automatically trigger assessment right away
    setTimeout(() => {
      handleAssessCandidate(candId);
    }, 100);
  };

  // Quick Mock / Autofill current candidate's questions for instant preview
  const autofillCandidateResponses = () => {
    const autofilled: Record<string, number> = {};
    questions.forEach(q => {
      // Create random but sensible answers (mostly around 3, 4 or 5 for strong candidates)
      const randomScore = Math.floor(Math.random() * 4) + 2; // 2 to 5
      autofilled[q.id] = randomScore;
    });
    setAssessmentAnswers(autofilled);
    // Go to final question or let them review
    setCurrentQuestionIndex(questions.length - 1);
  };

  // Update actively hiring Role parameters
  const saveRoleSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleProfile({
      roleName: roleEditName,
      department: roleEditDept,
      traits: roleProfile.traits,
      nonNegotiables: roleProfile.nonNegotiables,
      retentionDrivers: roleProfile.retentionDrivers,
      companyCulture: roleEditCulture
    });
    alert('Hiring Profile successfully updated! Newly triggered assessments will incorporate these definitions.');
  };

  // Management of bullet points
  const removeRoleTrait = (index: number) => {
    setRoleProfile(prev => ({
      ...prev,
      traits: prev.traits.filter((_, i) => i !== index)
    }));
  };

  const addRoleTrait = () => {
    if (newTrait.trim()) {
      setRoleProfile(prev => ({
        ...prev,
        traits: [...prev.traits, newTrait.trim()]
      }));
      setNewTrait('');
    }
  };

  const removeNonNeg = (index: number) => {
    setRoleProfile(prev => ({
      ...prev,
      nonNegotiables: prev.nonNegotiables.filter((_, i) => i !== index)
    }));
  };

  const addNonNeg = () => {
    if (newNonNeg.trim()) {
      setRoleProfile(prev => ({
        ...prev,
        nonNegotiables: [...prev.nonNegotiables, newNonNeg.trim()]
      }));
      setNewNonNeg('');
    }
  };

  const removeRetDriver = (index: number) => {
    setRoleProfile(prev => ({
      ...prev,
      retentionDrivers: prev.retentionDrivers.filter((_, i) => i !== index)
    }));
  };

  const addRetDriver = () => {
    if (newRetDriver.trim()) {
      setRoleProfile(prev => ({
        ...prev,
        retentionDrivers: [...prev.retentionDrivers, newRetDriver.trim()]
      }));
      setNewRetDriver('');
    }
  };

  // Quick load of preset templates
  const loadPresetProfile = (p: HiringManagerProfile) => {
    setRoleProfile(p);
    setRoleEditName(p.roleName);
    setRoleEditDept(p.department);
    setRoleEditCulture(p.companyCulture);
  };

  // Retrieve current active candidate
  const currentCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex flex-col md:flex-row antialiased">
      
      {/* 1. Sidebar */}
      <aside className="w-full md:w-24 bg-[#141414] text-[#E4E3E0] flex md:flex-col items-center justify-between p-4 md:py-8 border-b md:border-b-0 md:border-r border-[#141414] shrink-0 sticky top-0 md:h-screen z-50">
        <div className="flex md:flex-col items-center gap-6 w-full">
          {/* Logo element from Artistic theme */}
          <div className="w-12 h-12 bg-[#2a2a2a] border border-[#444444] rounded-full flex items-center justify-center text-[#E4E3E0] font-display text-lg font-bold tracking-tighter" title="IO Psycho Appraisal Core">
            IO
          </div>
          
          <nav className="flex md:flex-col gap-1 md:gap-3 w-full mt-2 md:mt-8">
            <button 
              onClick={() => { setActiveTab('intro'); setAssessorCandidateId(null); }}
              className={`flex-1 md:w-full py-2 px-3 rounded flex flex-col items-center gap-1 transition-all ${activeTab === 'intro' ? 'bg-[#E4E3E0] text-[#141414]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title="Academic Theory & Intro Overview"
            >
              <Brain className="w-5 h-5" id="nav-intro" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Intro</span>
            </button>

            <button 
              onClick={() => { setActiveTab('role'); setAssessorCandidateId(null); }}
              className={`flex-1 md:w-full py-2 px-3 rounded flex flex-col items-center gap-1 transition-all ${activeTab === 'role' ? 'bg-[#E4E3E0] text-[#141414]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              title="Hiring Criteria Blueprint first"
            >
              <Settings2 className="w-5 h-5" id="nav-role" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Criteria</span>
            </button>

            <button 
              onClick={() => { setActiveTab('pipeline'); setAssessorCandidateId(null); }}
              className={`flex-1 md:w-full py-2 px-3 rounded flex flex-col items-center gap-1 transition-all ${activeTab === 'pipeline' ? 'bg-[#E4E3E0] text-[#141414]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Users className="w-5 h-5" id="nav-pipeline" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Pipeline</span>
            </button>
            
            <button 
              onClick={() => { setActiveTab('comparative'); setAssessorCandidateId(null); }}
              className={`flex-1 md:w-full py-2 px-3 rounded flex flex-col items-center gap-1 transition-all ${activeTab === 'comparative' ? 'bg-[#E4E3E0] text-[#141414]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Activity className="w-5 h-5" id="nav-comparison" />
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold">Compare</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:flex flex-col items-center gap-1 opacity-40 font-mono text-[9px] text-center">
          <span>VER 1.4</span>
          <span>STABLE</span>
        </div>
      </aside>

      {/* 2. Main Work Content pane */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {activeTab === 'intro' ? (
          <div className="flex-1 p-4 lg:p-12 max-w-4xl mx-auto flex flex-col justify-center space-y-6 my-4">
            <div className="bg-white border-2 border-black rounded-lg shadow-xl overflow-hidden">
              <div className="bg-black text-[#E4E3E0] p-6 sm:p-8 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-widest bg-zinc-800 text-indigo-400 px-3 py-1 rounded-full border border-zinc-700 inline-block">
                  METHODOLOGY & ORIENTATION OVERVIEW
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Recruitment Compatibility Assessor
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  An Industrial-Organizational (I-O) psychology framework designed to check dynamic candidates against core organizational culture styles and role-specific demands. Underpinned by standard psychometric taxonomies.
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">1</span>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Person-Organization Fit (P-O Match)</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-serif">
                      Measures values congruence between employees and company culture (utilizing O&apos;Reilly&apos;s OCP benchmark). Decades of validation prove high P-O Fit drives long-term motivation, superior job satisfaction, and reduced conflict friction.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">2</span>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Person-Job Fit (P-J Match)</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-serif">
                      Examines the alignment between a candidate&apos;s primary work styles (using O*NET parameters) and active job profiles. Autonomy preferences, pacing styles, and precise detail requirements are calculated dynamically.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">3</span>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Five-Factor Personality & Scenarios</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-serif">
                      Utilizes constructs from Goldberg&apos;s International Personality Item Pool (IPIP) to assess Resilience (stress tolerance) and Conscientiousness (product stewardship). Tracks performance stability during critical team crises.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">4</span>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900">Onboarding Synergy vs Coaching Needs</h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-serif">
                      Calculates initial team friction levels rather than subjective feelings. Maps potential adaptation blockages, strategic growth alignment, and developmental training areas before a contract is finalized.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-indigo-50/50 p-4 sm:p-6 rounded-lg border border-indigo-100">
                  <div className="space-y-1">
                    <h4 className="font-mono text-xs font-bold text-indigo-700 uppercase">Interactive Workspace Flow</h4>
                    <p className="text-[11px] text-slate-600">
                      Step 1: Write down or load the hiring blueprint traits. &bull; Step 2: Complete candidate questionnaires. &bull; Step 3: Run advanced comparisons.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('role')}
                    className="px-6 py-3 bg-black hover:bg-zinc-850 text-[#E4E3E0] font-mono text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all shrink-0 flex items-center gap-2"
                  >
                    Enter Workspace
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header Ribbon bar */}
            <header className="border-b border-black/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#E4E3E0]/60 backdrop-blur shrink-0 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-black text-[#E4E3E0] px-2 py-0.5 rounded-full">Project: #HR-PSY-026</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">I-O Psychology Core</span>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 mt-1">
              {roleProfile.roleName} <span className="font-serif italic font-light text-slate-700">Comptability Engine</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-white/50 border border-slate-300 py-1.5 px-3 rounded">
              Active Focus: <strong className="text-slate-900">{roleProfile.department}</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Inner Screening Views */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          
          {/* ASSESSOR QUESTIONNAIRE SCREEN (Overlay / Mode style) */}
          {assessorCandidateId ? (
            <div className="max-w-3xl mx-auto bg-white border-2 border-black rounded-lg shadow-xl overflow-hidden my-4 fade-in-active">
              <div className="bg-black text-[#E4E3E0] p-6 flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs text-indigo-400 tracking-wider">PSYCHOMETRIC INSTRUMENT</span>
                  <h2 className="font-display text-xl font-bold">
                    Assessing: {candidates.find(c => c.id === assessorCandidateId)?.name}
                  </h2>
                </div>
                <button 
                  onClick={() => setAssessorCandidateId(null)}
                  className="px-3 py-1 bg-zinc-800 text-xs rounded hover:bg-zinc-700 font-mono"
                >
                  Exit Assessment
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span>CONSTRUCT: <strong className="text-indigo-600">{questions[currentQuestionIndex].constructLabel}</strong></span>
                  <span>QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
                </div>

                {/* Question Statement */}
                <div className="bg-[#E4E3E0]/35 border border-black/5 rounded p-6 sm:p-8">
                  <span className="font-mono text-xs uppercase text-slate-500 block mb-2">{questions[currentQuestionIndex].category} Dimension</span>
                  <p className="font-display font-medium text-lg sm:text-xl text-slate-900 leading-normal italic">
                    &ldquo;{getTailoredQuestionText(questions[currentQuestionIndex], roleProfile)}&rdquo;
                  </p>
                </div>

                {/* Input selection controls based on type */}
                {questions[currentQuestionIndex].type === 'scale' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, val)}
                          className={`py-4 rounded-lg border-2 text-center font-display font-bold transition-all ${
                            assessmentAnswers[questions[currentQuestionIndex].id] === val
                              ? 'bg-black text-[#E4E3E0] border-black'
                              : 'border-slate-200 hover:border-black text-slate-700 bg-slate-50'
                          }`}
                        >
                          <div className="text-xl">{val}</div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 px-1">
                      <span>STRONGLY DISAGREE</span>
                      <span>NEUTRAL / MIXED</span>
                      <span>STRONGLY AGREE</span>
                    </div>
                  </div>
                ) : (
                  // Scenario Choice Type
                  <div className="space-y-3">
                    {questions[currentQuestionIndex].choices?.map((choiceText, index) => {
                      const choiceScore = index + 1; // map index 0 to scale 1, etc.
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, choiceScore)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-start gap-3 ${
                            assessmentAnswers[questions[currentQuestionIndex].id] === choiceScore
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-medium'
                              : 'border-slate-200 hover:border-slate-400 bg-white text-slate-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            assessmentAnswers[questions[currentQuestionIndex].id] === choiceScore
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-400 bg-white'
                          }`}>
                            {assessmentAnswers[questions[currentQuestionIndex].id] === choiceScore && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-xs sm:text-sm leading-relaxed">{choiceText}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2 border-2 border-slate-200 text-xs font-mono uppercase bg-white rounded disabled:opacity-40"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={autofillCandidateResponses}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono"
                    title="Populates all remaining questionnaire questions with highly reliable randomized parameters"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Auto-simulate Candidate Responses
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      disabled={!assessmentAnswers[questions[currentQuestionIndex].id]}
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-6 py-2 bg-black text-[#E4E3E0] text-xs font-mono uppercase rounded disabled:opacity-40"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!assessmentAnswers[questions[currentQuestionIndex].id]}
                      onClick={submitCandidateAnswers}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold uppercase rounded tracking-wider shadow-md"
                    >
                      Submit Psychometric Audit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'pipeline' ? (
            /* PIPELINE VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Candidates list */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-slate-700">Candidates ({activeCandidates.length})</h3>
                  <button
                    onClick={() => setIsAddingCandidate(!isAddingCandidate)}
                    className="text-xs bg-black text-[#E4E3E0] px-3 py-1.5 rounded flex items-center gap-1.5 hover:opacity-90 transition-all font-mono"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Candidate
                  </button>
                </div>

                {isAddingCandidate && (
                  <form onSubmit={handleAddCandidate} className="bg-white border-2 border-black rounded-lg p-4 space-y-3 shadow-md">
                    <h4 className="font-mono text-xs font-bold uppercase">Quick Add Profile</h4>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Candidate Name</label>
                      <input
                        type="text"
                        required
                        value={newCandName}
                        onChange={e => setNewCandName(e.target.value)}
                        placeholder="e.g. Liam Henderson"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-[#E4E3E0]/40 border border-slate-300 rounded focus:border-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Contact Email</label>
                      <input
                        type="email"
                        value={newCandEmail}
                        onChange={e => setNewCandEmail(e.target.value)}
                        placeholder="liam.h@io.org"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-[#E4E3E0]/40 border border-slate-300 rounded focus:border-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase">Brief Headline / Bio</label>
                      <input
                        type="text"
                        value={newCandHeadline}
                        onChange={e => setNewCandHeadline(e.target.value)}
                        placeholder="React Lead | 5 YRS Experience"
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-[#E4E3E0]/40 border border-slate-300 rounded focus:border-black outline-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingCandidate(false)}
                        className="px-3 py-1.5 text-xs font-mono uppercase text-slate-600 hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-mono uppercase bg-black text-[#E4E3E0] rounded"
                      >
                        Create Profile
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {activeCandidates.map((cand) => {
                    const isActive = cand.id === selectedCandidateId;
                    return (
                      <div
                        key={cand.id}
                        id={`cand-card-${cand.id}`}
                        onClick={() => setSelectedCandidateId(cand.id)}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer relative group ${
                          isActive
                            ? 'bg-white border-black shadow-lg scale-[1.01]'
                            : 'bg-white/70 hover:bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="font-display font-semibold text-slate-900 text-sm sm:text-base">{cand.name}</h4>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{cand.headline}</p>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteCandidate(cand.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-opacity"
                            title="Remove candidate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-mono text-slate-500">{cand.email}</span>
                          
                          {/* Status Flags */}
                          {cand.status === 'completed' && cand.assessment ? (
                            <span className="text-xs font-mono uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-indigo-600 animate-pulse" />
                              Fit: {cand.assessment.scoreFitOverall}%
                            </span>
                          ) : cand.status === 'assessing' ? (
                            <span className="text-xs font-mono uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Activity className="w-3 h-3 animate-spin text-amber-600" />
                              Assessing...
                            </span>
                          ) : (
                            <span className="text-xs font-mono uppercase text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                              Questionnaire Pending
                            </span>
                          )}
                        </div>

                        {cand.answers.length === 0 && (
                          <div className="mt-3 bg-indigo-50/50 border border-indigo-100 rounded p-2 flex items-center justify-between">
                            <span className="text-[10px] text-indigo-950 font-medium">Ready for interview questions</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startLiveAssessment(cand.id);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-mono uppercase font-bold py-1 px-2.5 rounded flex items-center gap-1"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" />
                              Start Audit
                            </button>
                          </div>
                        )}

                        {cand.answers.length > 0 && !cand.assessment && (
                          <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2 flex items-center justify-between">
                            <span className="text-[10px] text-amber-950 font-medium">Answers submitted ({cand.answers.length})</span>
                            <button
                              disabled={isAssessing}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssessCandidate(cand.id);
                              }}
                              className="bg-black hover:bg-zinc-800 text-[#E4E3E0] text-[10px] font-mono uppercase font-bold py-1 px-2.5 rounded flex items-center gap-1 disabled:opacity-40"
                            >
                              <Brain className="w-3 h-3 animate-pulse" />
                              Run Appraisal
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Candidate Selection Profile Assessed Reports */}
              <div className="lg:col-span-8">
                {currentCandidate ? (
                  <div className="bg-white border-2 border-black rounded-lg shadow-xl overflow-hidden min-h-[450px]">
                    <div className="bg-black text-[#E4E3E0] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="font-mono text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded tracking-wide font-bold uppercase">Candidate Entity</span>
                        <h2 className="font-display font-bold text-2xl mt-1">{currentCandidate.name}</h2>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{currentCandidate.headline} &bull; {currentCandidate.email}</p>
                      </div>


                    </div>

                    {/* Report Render Core */}
                    {currentCandidate.status === 'completed' && currentCandidate.assessment ? (
                      <div className="p-6 md:p-8 space-y-8">
                        {/* Upper row: Score highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-b border-slate-100 pb-6">
                          
                          {/* Score circle custom layout */}
                          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">FIT PROBABILITY</span>
                            <div className="score-circle">
                              <span className="text-4xl font-display font-bold tracking-tighter text-slate-950">
                                {currentCandidate.assessment.scoreFitOverall}%
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 uppercase font-semibold">OVERALL</span>
                            </div>
                            <span className="text-xs bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mt-3 font-mono">
                              {currentCandidate.assessment.suitabilityRecommendation}
                            </span>
                          </div>

                          <div className="space-y-4 md:col-span-3">
                            <div>
                              <div className="flex justify-between items-center text-xs font-mono text-slate-600 mb-1">
                                <span>PERSON-JOB (P-J) MATCH</span>
                                <span className="font-bold">{currentCandidate.assessment.scoreFitJob}%</span>
                              </div>
                              <div className="stat-bar">
                                <div className="stat-fill" style={{ width: `${currentCandidate.assessment.scoreFitJob}%` }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center text-xs font-mono text-slate-600 mb-1">
                                <span>PERSON-ORGANIZATION (P-O) CULTURE MATCH</span>
                                <span className="font-bold">{currentCandidate.assessment.scoreFitCulture}%</span>
                              </div>
                              <div className="stat-bar">
                                <div className="stat-fill bg-indigo-600" style={{ width: `${currentCandidate.assessment.scoreFitCulture}%` }}></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center text-xs font-mono text-slate-600 mb-1">
                                <span>COACHING & GROWTH COHESION INDEX</span>
                                <span className="font-bold">{currentCandidate.assessment.retentionScore}%</span>
                              </div>
                              <div className="stat-bar">
                                <div className="stat-fill bg-indigo-600" style={{ width: `${currentCandidate.assessment.retentionScore}%` }}></div>
                              </div>
                              <p className="text-[11px] font-mono text-indigo-700 font-semibold mt-1 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 shrink-0" />
                                Growth Coaching Vector: {currentCandidate.assessment.retentionPrediction}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* Critical Insights Box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                              Success Catalysts
                            </h4>
                            <ul className="space-y-2.5">
                              {currentCandidate.assessment.successCatalysts.map((val, i) => (
                                <li key={i} className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded p-3 leading-relaxed flex items-start gap-2.5">
                                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{val}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-600"></span>
                              Potential Points of Conflict
                            </h4>
                            <ul className="space-y-2.5">
                              {currentCandidate.assessment.conflictPoints.map((val, i) => (
                                <li key={i} className="text-xs text-slate-700 bg-red-50/50 border border-red-100 rounded p-3 leading-relaxed flex items-start gap-2.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                  <span>{val}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Culture Match Rationale */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 space-y-2">
                          <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                            Culture Alignment Profile
                          </h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-serif italic text-base">
                            &ldquo;{currentCandidate.assessment.cultureFitSummary}&rdquo;
                          </p>
                        </div>

                        {/* Detailed psychological write up */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                            I-O Psychology Developmental Report
                          </h4>
                          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap space-y-2 bg-[#E4E3E0]/20 p-4 rounded border border-black/5 font-mono">
                            {currentCandidate.assessment.detailedExplanation}
                          </div>
                        </div>

                        {/* Standard questionnaire debug lookup */}
                        <div className="pt-6 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                              Psychometric Item Values
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500">Scale: 1 (Lowest Match) to 5 (Full Agreement)</span>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono whitespace-nowrap">
                              <thead>
                                <tr className="border-b border-black">
                                  <th className="py-2 text-[10px] text-slate-500 uppercase">Construct</th>
                                  <th className="py-2 text-[10px] text-slate-500 uppercase">Statement Item</th>
                                  <th className="py-2 text-[10px] text-slate-500 uppercase text-center">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {questions.map(q => {
                                  const ans = currentCandidate.answers.find(a => a.questionId === q.id);
                                  const psychRef = getPsychometricReference(q.construct);
                                  return (
                                    <tr key={q.id} className="hover:bg-slate-50 border-b border-black/5">
                                      <td className="py-3">
                                        <div className="font-semibold text-slate-900">{q.constructLabel}</div>
                                        {psychRef.testName ? (
                                          <div className="text-[9px] text-indigo-700 font-mono mt-0.5">{psychRef.testName} &mdash; <span className="italic">{psychRef.scale}</span></div>
                                        ) : null}
                                      </td>
                                      <td className="py-3 max-w-sm whitespace-normal text-xs leading-relaxed text-slate-700" title={getTailoredQuestionText(q, roleProfile)}>{getTailoredQuestionText(q, roleProfile)}</td>
                                      <td className="py-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                                          ans ? 'bg-black text-[#E4E3E0]' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                          {ans ? ans.score : '-'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-[#E4E3E0] rounded-full flex items-center justify-center mx-auto text-[#141414]">
                          <Activity className="w-8 h-8 animate-pulse" />
                        </div>
                        
                        <div className="max-w-md mx-auto space-y-2">
                          <h3 className="font-display font-bold text-lg text-slate-900">Psychology Assessment Pending</h3>
                          {currentCandidate.answers.length === 0 ? (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              This candidate hasn&apos;t completed the standard I-O Backed Questionnaire. To initiate evaluation, click the &ldquo;Start Audit&rdquo; option to capture their scores.
                            </p>
                          ) : (
                            <p className="text-xs text-slate-600 leading-relaxed">
                              The candidate&apos;s answer payload is recorded but has not been analyzed yet. Click &ldquo;Run Appraisal&rdquo; to send responses for complete AI validation scoring.
                            </p>
                          )}
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                          {currentCandidate.answers.length === 0 ? (
                            <button
                              onClick={() => startLiveAssessment(currentCandidate.id)}
                              className="px-4 py-2 bg-indigo-600 text-white font-mono uppercase text-xs font-bold rounded shadow hover:bg-indigo-700"
                            >
                              Initiate Interview Questionnaire
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAssessCandidate(currentCandidate.id)}
                              className="px-4 py-2 bg-black text-[#E4E3E0] font-mono uppercase text-xs font-bold rounded shadow hover:opacity-90"
                            >
                              Snythesize Compatibility Score
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-12 bg-white rounded-lg border-2 border-slate-300 text-center text-slate-500">
                    No active candidate selected. Please choose or add a profile from the sidebar layout.
                  </div>
                )}
              </div>

            </div>
          ) : activeTab === 'role' ? (
            /* TARGET HIRING PROFILE & AMBIENT CULTURE RULES FORM */
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              <div className="md:col-span-8 space-y-6">
                <form onSubmit={saveRoleSettings} className="bg-white border-2 border-black rounded-lg shadow-md p-6 space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-display font-medium text-lg text-slate-950">Active Role Configuration Form</h3>
                    <p className="text-xs text-slate-500">Define the core target alignment attributes. Our evaluations compare candidates against these guidelines.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-600 uppercase font-bold">Role Title</label>
                      <input
                        type="text"
                        required
                        value={roleEditName}
                        onChange={e => setRoleEditName(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:border-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-600 uppercase font-bold">Department</label>
                      <input
                        type="text"
                        required
                        value={roleEditDept}
                        onChange={e => setRoleEditDept(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:border-black outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 uppercase font-bold">Company Culture Blueprint Summary</label>
                    <textarea
                      required
                      value={roleEditCulture}
                      onChange={e => setRoleEditCulture(e.target.value)}
                      rows={4}
                      className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded focus:border-black outline-none leading-relaxed"
                      placeholder="e.g. Collaborative design environment valuing fast failure feedback..."
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-mono text-indigo-700 font-semibold uppercase flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      Dynamic Parameters Active
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-black text-[#E4E3E0] font-mono text-xs uppercase font-bold rounded shadow hover:opacity-90"
                    >
                      Save Profile Parameters
                    </button>
                  </div>
                </form>

                {/* Trait lists & items form indicators */}
                <div className="bg-white border-2 border-black rounded-lg p-6 space-y-6 shadow-md">
                  
                  {/* Traits List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-mono text-xs font-bold uppercase text-slate-800">Essential Traits We Need</h4>
                      <span className="text-[10px] font-mono text-slate-400">Values congruence parameters</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {roleProfile.traits.map((tr, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs flex items-center gap-1.5 font-mono text-slate-800">
                          {tr}
                          <button onClick={() => removeRoleTrait(index)} className="text-slate-400 hover:text-red-600 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTrait}
                        onChange={e => setNewTrait(e.target.value)}
                        placeholder="Add candidate critical trait..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded outline-none"
                      />
                      <button
                        onClick={addRoleTrait}
                        className="px-4 py-1.5 bg-zinc-800 text-white font-mono text-xs uppercase rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Non-Negotiables List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className="font-mono text-xs font-bold uppercase text-red-700">Strict Non-Negotiables</h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {roleProfile.nonNegotiables.map((nn, index) => (
                        <span key={index} className="px-3 py-1 bg-red-50 border border-red-100 rounded text-xs flex items-center gap-1.5 font-mono text-slate-800">
                          {nn}
                          <button onClick={() => removeNonNeg(index)} className="text-red-400 hover:text-red-600 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNonNeg}
                        onChange={e => setNewNonNeg(e.target.value)}
                        placeholder="Add strict non-negotiable expectation..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded outline-none"
                      />
                      <button
                        onClick={addNonNeg}
                        className="px-4 py-1.5 bg-zinc-800 text-white font-mono text-xs uppercase rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Retention Drivers List */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className="font-mono text-xs font-bold uppercase text-emerald-700">Employee Retention Catalyst Drivers</h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {roleProfile.retentionDrivers.map((rd, index) => (
                        <span key={index} className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded text-xs flex items-center gap-1.5 font-mono text-slate-800">
                          {rd}
                          <button onClick={() => removeRetDriver(index)} className="text-slate-400 hover:text-red-600 font-bold">&times;</button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRetDriver}
                        onChange={e => setNewRetDriver(e.target.value)}
                        placeholder="Add primary retention factor (e.g. Growth budget)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded outline-none"
                      />
                      <button
                        onClick={addRetDriver}
                        className="px-4 py-1.5 bg-zinc-800 text-white font-mono text-xs uppercase rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Preset selection widget */}
              <div className="md:col-span-4 bg-zinc-900 text-[#E4E3E0] rounded-lg p-5 border border-black space-y-4 shadow-xl">
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase text-indigo-400">Preset Blueprints</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Quick load structured profiles backed by general industry templates.</p>
                </div>

                <div className="space-y-3">
                  {DEFAULT_ROLE_PROFILES.map((prof, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPresetProfile(prof)}
                      className={`w-full p-3.5 border text-left rounded-lg transition-all ${
                        roleProfile.roleName === prof.roleName
                          ? 'bg-white text-zinc-950 border-white'
                          : 'border-zinc-700 bg-zinc-800/40 text-slate-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="font-mono text-[9px] uppercase tracking-wider block opacity-60">{prof.department}</span>
                      <strong className="font-display block text-sm mt-0.5">{prof.roleName}</strong>
                      <p className="text-[10px] mt-1 line-clamp-2 text-slate-500">{prof.companyCulture}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <div className="text-[10px] text-slate-400 leading-normal">
                    Seeing stale data or custom roles from previous configurations?
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore all candidates and role profiles to defaults? This will erase custom candidate inputs and appraisals.')) {
                        localStorage.removeItem('io_candidates');
                        localStorage.removeItem('io_role_profile');
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 bg-red-950/40 hover:bg-red-900/40 border border-red-800/60 text-red-300 rounded font-mono text-[10px] uppercase font-bold tracking-wider transition-all"
                  >
                    Clear Browser Storage & Reset Defaults
                  </button>
                </div>
              </div>

            </div>
          ) : activeTab === 'comparative' ? (
            /* CANDIDATE COMPARATIVE MATRIX */
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className="bg-white border-2 border-black rounded-lg shadow-xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h3 className="font-display font-medium text-lg text-slate-950">Comparative Selection Matrix</h3>
                    <p className="text-xs text-slate-500">Side-by-side evaluation of all candidate variables to help find the optimal fit.</p>
                  </div>

                  <button
                    onClick={() => {
                      const completed = activeCandidates.filter(c => c.assessment && c.status === 'completed');
                      if (completed.length > 0) {
                        triggerComparativeSynthesis(completed);
                      } else {
                        alert('No completed candidate assessments found inside the active pipeline to perform matrix calculations.');
                      }
                    }}
                    disabled={isComparing || activeCandidates.filter(c => c.assessment && c.status === 'completed').length === 0}
                    className="px-4 py-2 bg-[#141414] hover:bg-zinc-800 text-white font-mono text-xs uppercase font-bold rounded shadow transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
                    Refresh Comparison Core
                  </button>
                </div>

                {/* Candidate list comparative mini charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeCandidates.map(cand => (
                    <div 
                      key={cand.id} 
                      onClick={() => { setSelectedCandidateId(cand.id); setActiveTab('pipeline'); }}
                      className={`p-4 border-2 rounded-lg cursor-pointer hover:border-black transition-all ${
                        cand.status === 'completed' ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/40 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <h4 className="font-display font-bold text-sm text-slate-900">{cand.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{cand.headline}</p>
                      
                      {cand.assessment ? (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-slate-600">
                            <span>OVERALL FIT</span>
                            <span className="font-bold">{cand.assessment.scoreFitOverall}%</span>
                          </div>
                          <div className="stat-bar bg-slate-200">
                            <div className="stat-fill" style={{ width: `${cand.assessment.scoreFitOverall}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                            <span>COACHING REQ:</span>
                            <span className="font-semibold text-indigo-700 text-[9px] uppercase">{cand.assessment.retentionPrediction}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-indigo-700 italic mt-4">Psychological assessment pending</p>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              {/* Large Synthesis Block */}
              {isComparing ? (
                <div className="p-12 text-center bg-white rounded-lg border-2 border-black space-y-3">
                  <Activity className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                  <p className="font-mono text-xs text-slate-600">Compiling multi-candidate psychometric vectors and running general fit ranks...</p>
                </div>
              ) : comparisonResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Rationale & Recommendation */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Top Choice Ribbon */}
                    <div className="bg-zinc-950 text-white rounded-lg p-6 border border-zinc-800 shadow-xl space-y-4">
                      <div className="flex justify-between items-center bg-zinc-800/60 p-3 rounded border border-zinc-700/50">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-500" />
                          <span className="font-mono text-xs font-bold uppercase text-indigo-400">RECOMMENDED APPLICANT ENTITY</span>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-600 px-2 py-0.5 rounded text-[#E4E3E0] font-bold">1ST RANK MATCH</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-serif text-3xl italic tracking-tight text-white">
                          {candidates.find(c => c.id === comparisonResult.recommendedCandidateId)?.name || 'Perfect Candidate Match'}
                        </h3>
                        <p className="text-xs text-slate-300 font-mono">
                          {candidates.find(c => c.id === comparisonResult.recommendedCandidateId)?.headline || ''}
                        </p>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-300 font-mono bg-[#E4E3E0]/5 p-4 rounded border border-white/5">
                        {comparisonResult.topFitAnalysis}
                      </div>
                    </div>

                    {/* General Rank Reasons */}
                    <div className="bg-white border-2 border-black rounded-lg p-6 space-y-4 shadow-md">
                      <h4 className="font-mono text-xs font-bold uppercase text-slate-800">Rankings & Appraisal Reasoning</h4>
                      <ul className="space-y-2.5">
                        {comparisonResult.rankingReasons?.map((reason: string, idx: number) => (
                          <li key={idx} className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded p-4 leading-relaxed flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-[#E4E3E0] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Right Column: Key evaluation dimensions */}
                  <div className="lg:col-span-4 bg-white border-2 border-black rounded-lg p-5 space-y-5 shadow-lg">
                    <h4 className="font-mono text-xs font-bold uppercase text-slate-800 border-b border-slate-100 pb-2.5">Fit Vector Explanations</h4>
                    
                    <div className="space-y-4">
                      {comparisonResult.visualInsights?.map((insight: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <span className="font-mono text-xs font-bold text-slate-900 block">{insight.label}</span>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-serif italic">
                            &ldquo;{insight.description}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded border border-slate-200 mt-2">
                      <p className="text-[10px] font-mono text-slate-500 leading-normal">
                        Ranks are calculated dynamically using active values criteria, including direct traits expectations and non-negotiable vectors.
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center bg-white/70 rounded-lg border border-dashed border-slate-300 text-slate-500">
                  Please trigger matrix analysis to review rankings. Ensure at least one candidate has completed the questionnaire.
                </div>
              )}

            </div>
          ) : null}

        </div>
      </>
    )}
  </main>

    </div>
  );
}
