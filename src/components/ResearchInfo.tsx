import { BookOpen, Award, Layers, ShieldAlert } from 'lucide-react';

export default function ResearchInfo() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <BookOpen className="w-5 h-5" id="research-icon" />
        </div>
        <div>
          <h2 className="font-display text-lg font-medium text-slate-950" id="research-title">I-O Psychology Core Framework</h2>
          <p className="text-xs text-slate-500">The validated science of human performance and retention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <div>
              <h3 className="font-medium text-sm text-slate-900">Person-Organization Fit (P-O Fit)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                P-O Fit measures the value congruence between employees and their organizations. Decades of psychology review indicate high P-O Fit correlates with improved job satisfaction, greater commitment, and highly reliable retention rates over 3+ year horizons.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <div>
              <h3 className="font-medium text-sm text-slate-900">Person-Job Fit (P-J Fit)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                P-J Fit assesses the alignment of a candidate&apos;s primary Knowledge, Skills, Abilities, and style with specific job responsibilities. Highly proactive individuals perform best under fluid autonomy, while structured managers thrive with predictability.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <div>
              <h3 className="font-medium text-sm text-slate-900">Conscientiousness (The Key Predictor)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Within the Big Five structure, conscientiousness represents an individual&apos;s attention to detail, reliability, and grit. Validation studies position this as the single strongest personal indicator of workplace accuracy and milestone delivery.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">4</div>
            <div>
              <h3 className="font-medium text-sm text-slate-900">Attraction-Selection-Attrition (ASA)</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Schneider&apos;s ASA model demonstrates that organizations naturally attract and select candidates similar to their existing team. However, individuals with severe value mismatches rapidly drop out during times of high workflow friction (attrition phase).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex gap-3">
        <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" id="award-badge" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Strategic Professional Standard</span>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
            By analyzing candidate profiles against complex corporate traits using validated questionnaires, this portal helps recruitment managers reduce early attrition costs (averaging 1.5x of annual employee salary) through high-integrity data.
          </p>
        </div>
      </div>
    </div>
  );
}
