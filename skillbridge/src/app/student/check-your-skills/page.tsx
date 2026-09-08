'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckYourSkillsPage() {
  const [selectedOption, setSelectedOption] = useState('B');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Operational Banner & Career Alignment */}
      <div className="w-full bg-surface-container-lowest px-space-lg lg:px-space-2xl py-space-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
          <div className="space-y-space-xs max-w-3xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Official AICTE-Aligned Benchmarking Engine</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Check Your Skills</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Discover your technical proficiencies and identify high-leverage knowledge areas to advance toward your designated professional objective.
            </p>
          </div>
          {/* Quick Context Box */}
          <div className="flex flex-wrap items-center gap-space-md p-space-md rounded-xl bg-surface-container-low text-on-surface">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Benchmark Standard</span>
              <span className="font-title-sm text-title-sm font-semibold flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                Machine Learning Engineer
              </span>
            </div>
            <div className="h-8 w-px bg-outline-variant/50 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Adaptive Metrics</span>
              <span className="font-code-sm text-code-sm font-semibold text-on-surface">12 Item Test · Level 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-space-lg lg:px-space-2xl py-space-xl space-y-space-2xl">
        {/* Assessment Module Selection & Active Pipeline Deck */}
        <section className="space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">Domain Curriculum</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Required Proficiency Assessments</h2>
            </div>
            <div className="inline-flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px] text-secondary">history</span>
              <span>Cycle 2024–Q3 Evaluation</span>
            </div>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Module 1: Active In-Progress */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-space-xs py-space-2xs rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">In Progress</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">04/12 Qs</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface">Databases & SQL Internals</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Distributed systems, indexing, multi-stage joins, and ACID compliance.</p>
              </div>
              <div className="mt-space-lg pt-space-sm space-y-space-xs">
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '33%' }}></div>
                </div>
                <div className="flex items-center justify-between text-body-sm font-label-sm text-on-surface-variant">
                  <span>Progress</span>
                  <span className="font-code-sm">33% complete</span>
                </div>
              </div>
            </div>

            {/* Module 2: Completed */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-space-xs py-space-2xs rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">Verified</span>
                  <span className="font-code-sm text-code-sm text-secondary font-bold">82 / 100</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface">Core Python & Data Structures</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Object lifecycle, memory profilers, generators, and algorithm complexity.</p>
              </div>
              <div className="mt-space-lg pt-space-sm flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Validated Nov 12</span>
                <button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-space-2xs" type="button">
                  Review Dossier <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Module 3: Scheduled / Available */}
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold">Ready</span>
                  <span className="font-code-sm text-code-sm text-on-surface-variant">~18 mins</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface">ML Foundations & Calculus</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Cost functions, gradient derivation, regularizations, and model bias.</p>
              </div>
              <div className="mt-space-lg pt-space-sm">
                <button className="w-full py-space-xs px-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm transition-colors text-center" type="button">
                  Enroll in Test
                </button>
              </div>
            </div>

            {/* Module 4: Locked Pending Previous */}
            <div className="p-space-lg rounded-xl bg-surface-container-low/70 flex flex-col justify-between opacity-80">
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <span className="px-space-xs py-space-2xs rounded bg-surface-container text-outline font-label-sm text-label-sm font-bold">Sequential Gate</span>
                  <span className="material-symbols-outlined text-[18px] text-outline">lock</span>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface-variant">Distributed Data Systems</h3>
                <p className="font-body-sm text-body-sm text-outline">MapReduce primitives, Spark partitioning, and data serialization protocols.</p>
              </div>
              <div className="mt-space-lg pt-space-sm text-body-sm text-outline font-label-sm">
                Requires SQL & Python verification
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE EXAM ARENA */}
        <section className="rounded-xl bg-surface-container-lowest shadow-md overflow-hidden">
          {/* Session HUD Strip */}
          <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-md">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-title-md text-title-md text-on-surface font-bold">Question 4</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">of 12</span>
              </div>
              <span className="text-outline font-body-sm">·</span>
              <span className="px-space-xs py-space-2xs rounded bg-surface-container-highest font-code-sm text-code-sm text-on-surface font-semibold">
                Category: Distributed Relational Architecture
              </span>
            </div>
            <div className="flex items-center gap-space-lg w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
                <span className="material-symbols-outlined text-[18px]">timer</span>
                <span>Est. Remaining: <strong>07:45</strong></span>
              </div>
              <button className="px-space-sm py-space-2xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
                Save & Exit
              </button>
            </div>
          </div>
          
          {/* Linear Micro Progress Track */}
          <div className="w-full bg-surface-container h-1">
            <div className="bg-primary h-1 transition-all duration-300" style={{ width: '33.33%' }}></div>
          </div>

          {/* Test Canvas */}
          <div className="p-space-lg lg:p-space-2xl space-y-space-xl">
            {/* Question Stem */}
            <div className="space-y-space-sm max-w-4xl">
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-bold">
                <span className="material-symbols-outlined text-[16px] text-primary">help_outline</span>
                Analytical Scenario 4.2
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-medium">
                In a distributed relational database cluster handling heavy transaction logs, which composite indexing strategy is most effective for accelerating search queries containing both an exact equality condition on <code className="font-code-sm px-space-2xs py-space-2xs rounded bg-surface-container text-primary font-bold">user_id</code> and a bounded range filter on <code className="font-code-sm px-space-2xs py-space-2xs rounded bg-surface-container text-primary font-bold">timestamp</code>?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Target performance goal: Minimize cluster I/O scan depth and ensure optimal B-Tree page traversal order during query planner execution.
              </p>
            </div>

            {/* Answers Architecture */}
            <fieldset className="space-y-space-sm max-w-4xl">
              <legend className="sr-only">Choose one solution</legend>
              
              {/* Option A */}
              <label className={`group relative flex items-start gap-space-md p-space-base rounded-lg transition-all cursor-pointer ${selectedOption === 'A' ? 'bg-surface-container shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                <input 
                  type="radio" 
                  name="assessment_q4" 
                  value="A" 
                  checked={selectedOption === 'A'}
                  onChange={() => setSelectedOption('A')}
                  className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary accent-primary" 
                />
                <div className="flex flex-col space-y-space-2xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-primary">Option A</span>
                    <span className="font-code-sm text-code-sm text-outline">INDEX_TYPE: BTREE_SINGLE</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Single-column B-tree index on the <code className="font-code-sm text-on-surface font-semibold">timestamp</code> column only, delegating the user identification evaluation to post-scan memory filtering.
                  </p>
                </div>
              </label>

              {/* Option B (Correct Pattern) */}
              <label className={`group relative flex items-start gap-space-md p-space-base rounded-lg transition-all cursor-pointer ${selectedOption === 'B' ? 'bg-surface-container shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                <input 
                  type="radio" 
                  name="assessment_q4" 
                  value="B" 
                  checked={selectedOption === 'B'}
                  onChange={() => setSelectedOption('B')}
                  className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary accent-primary" 
                />
                <div className="flex flex-col space-y-space-2xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-primary">Option B</span>
                    <span className="font-code-sm text-code-sm text-primary font-bold">INDEX_TYPE: COMPOSITE_PREFIX</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface">
                    Composite index with <code className="font-code-sm text-on-surface font-semibold">user_id</code> as the leading prefix column, followed immediately by <code className="font-code-sm text-on-surface font-semibold">timestamp</code>.
                  </p>
                  <div className="text-body-sm font-label-sm text-secondary pt-space-2xs flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Allows exact match seek followed by sequential boundary leaf scan within the slice.</span>
                  </div>
                </div>
              </label>

              {/* Option C */}
              <label className={`group relative flex items-start gap-space-md p-space-base rounded-lg transition-all cursor-pointer ${selectedOption === 'C' ? 'bg-surface-container shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                <input 
                  type="radio" 
                  name="assessment_q4" 
                  value="C" 
                  checked={selectedOption === 'C'}
                  onChange={() => setSelectedOption('C')}
                  className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary accent-primary" 
                />
                <div className="flex flex-col space-y-space-2xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-primary">Option C</span>
                    <span className="font-code-sm text-code-sm text-outline">INDEX_TYPE: HASH_GIN_DUAL</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Hash index dedicated strictly to <code className="font-code-sm text-on-surface font-semibold">user_id</code> coupled with an independent Generalized Inverted Index (GIN) configured over the timestamp field.
                  </p>
                </div>
              </label>

              {/* Option D */}
              <label className={`group relative flex items-start gap-space-md p-space-base rounded-lg transition-all cursor-pointer ${selectedOption === 'D' ? 'bg-surface-container shadow-sm' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                <input 
                  type="radio" 
                  name="assessment_q4" 
                  value="D" 
                  checked={selectedOption === 'D'}
                  onChange={() => setSelectedOption('D')}
                  className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary accent-primary" 
                />
                <div className="flex flex-col space-y-space-2xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold group-hover:text-primary">Option D</span>
                    <span className="font-code-sm text-code-sm text-outline">INDEX_TYPE: CLUSTERED_LEAF</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Clustered physical index structured exclusively on the chronological sequence of the <code className="font-code-sm text-on-surface font-semibold">timestamp</code>, without generating a secondary index registry.
                  </p>
                </div>
              </label>
            </fieldset>

            {/* Workbench Evaluation Action Tray */}
            <div className="pt-space-md flex flex-col-reverse sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm w-full sm:w-auto">
                <button className="px-space-base py-space-sm rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm transition-colors flex items-center justify-center gap-space-xs w-full sm:w-auto" type="button">
                  <span className="material-symbols-outlined text-[18px]">west</span>
                  Previous Question
                </button>
                <button className="px-space-base py-space-sm rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-title-sm text-title-sm transition-colors flex items-center justify-center gap-space-xs" type="button">
                  <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                  Mark for Review
                </button>
              </div>
              <div className="flex items-center gap-space-sm w-full sm:w-auto">
                <button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`px-space-lg py-space-sm rounded bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm transition-colors flex items-center justify-center gap-space-xs shadow-sm w-full sm:w-auto ${isSubmitting ? 'opacity-75' : ''}`} 
                  type="button"
                >
                  {isSubmitting ? (
                    <><span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> Recording Evaluation...</>
                  ) : (
                    <>Confirm & Next Question <span className="material-symbols-outlined text-[18px]">east</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ASSESSMENT VERIFICATION REPORT */}
        <section className="space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-space-xs">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Accredited Transcript</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Recent Assessment Results: Data & Querying</h2>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
              <span>Verified by SkillBridge Adaptive System</span>
            </div>
          </div>

          {/* Bento-style Analytical Review Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg rounded-xl bg-surface-container-lowest p-space-lg lg:p-space-xl shadow-sm">
            {/* Metric Gauge Left Column */}
            <div className="lg:col-span-4 flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-low space-y-space-lg">
              <div className="space-y-space-xs">
                <span className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Evaluation Confirmed
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Proficiency Tier: Level 4</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Validated against National Qualification Framework descriptors.</p>
              </div>
              
              {/* Inline Metric Visualizer */}
              <div className="flex flex-col items-center justify-center py-space-sm relative">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                  <circle className="text-surface-container" cx="60" cy="60" fill="transparent" r="50" stroke="currentColor" strokeWidth="10"></circle>
                  <circle className="text-secondary" cx="60" cy="60" fill="transparent" r="50" stroke="currentColor" strokeDasharray="314.159" strokeDashoffset="56.5" strokeLinecap="round" strokeWidth="10"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">82<span className="text-title-sm text-outline font-normal">/100</span></span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">Proficient</span>
                </div>
              </div>

              <div className="space-y-space-2xs text-body-sm pt-space-xs">
                <div className="flex justify-between font-label-sm text-on-surface-variant">
                  <span>National Percentile:</span>
                  <span className="font-code-sm font-bold text-on-surface">Top 14%</span>
                </div>
                <div className="flex justify-between font-label-sm text-on-surface-variant">
                  <span>Time Taken:</span>
                  <span className="font-code-sm font-bold text-on-surface">16m 42s</span>
                </div>
                <div className="flex justify-between font-label-sm text-on-surface-variant">
                  <span>Verification Token:</span>
                  <span className="font-code-sm text-primary font-bold">#SB-SQL-9827</span>
                </div>
              </div>
            </div>

            {/* Analytical Breakdown Right Columns */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-space-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Confirmed Strengths */}
                <div className="p-space-md rounded-lg bg-surface-container-low space-y-space-sm">
                  <div className="flex items-center gap-space-xs text-secondary font-title-sm text-title-sm font-bold">
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                    Strong Areas Demonstrated
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">done</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Complex Relational Joins</strong>
                        <p className="text-on-surface-variant text-body-sm">Deep understanding of multi-table hash joins, merge joins, and Cartesian handling.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">done</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Aggregation & Subqueries</strong>
                        <p className="text-on-surface-variant text-body-sm">Effective filtering across nested CTE expressions and correlated predicates.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">done</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Transaction Isolations</strong>
                        <p className="text-on-surface-variant text-body-sm">Clear grasp of snapshot isolation and repeatable read locking guarantees.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Areas to Elevate */}
                <div className="p-space-md rounded-lg bg-surface-container-low space-y-space-sm">
                  <div className="flex items-center gap-space-xs text-tertiary font-title-sm text-title-sm font-bold">
                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                    Targeted Skills to Improve
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">priority_high</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Window Functions & Framing</strong>
                        <p className="text-on-surface-variant text-body-sm">Struggled with ROWS BETWEEN bounds in partition aggregation.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">priority_high</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Query Execution Plans (EXPLAIN)</strong>
                        <p className="text-on-surface-variant text-body-sm">Room to improve identifying cost-dominant disk spilling events.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-[16px] text-tertiary mt-0.5">priority_high</span>
                      <div>
                        <strong className="text-on-surface font-semibold">Horizontal Table Sharding</strong>
                        <p className="text-on-surface-variant text-body-sm">Incomplete formulation on range vs consistent hash rebalancing keys.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Official Institutional Endorsement CTA Strip */}
              <div className="pt-space-md flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low/50 p-space-md rounded-lg">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">Dossier Available for Employers</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Attested via SkillBridge National Skill Protocol</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm">
                  <button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm transition-colors flex items-center gap-space-2xs" type="button">
                    <span className="material-symbols-outlined text-[18px]">school</span>
                    Add to Learning Plan
                  </button>
                  <button className="px-space-md py-space-xs rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm transition-colors flex items-center gap-space-2xs" type="button">
                    <span className="material-symbols-outlined text-[18px]">build</span>
                    View Skills to Improve
                  </button>
                  <button className="px-space-md py-space-xs rounded bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm transition-colors flex items-center gap-space-2xs shadow-sm" type="button">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    Add to Verified Skills
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Institutional Guidelines & Integrity Disclaimer Footer */}
        <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-start gap-space-sm max-w-3xl">
            <span className="material-symbols-outlined text-[20px] text-outline mt-0.5">policy</span>
            <p>
              Skill assessments are calibrated according to standardized AICTE skill descriptors and industry criteria. Verified test results are directly queryable by authenticated corporate recruiters on the SkillBridge Partner Network.
            </p>
          </div>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm text-outline">
            <span>ISO/IEC 17024 Compliant Engine</span>
            <span>·</span>
            <span>Session Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
