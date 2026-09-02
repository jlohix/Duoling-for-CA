const STEPS = [
  {
    title: "Learn path",
    text: "Open Learn in the sidebar. You see sections as cards. Open a section to walk Easy, then Average, then Challenging. Topics unlock in order. Section 1 (Basic laws) starts with circuit labs before Easy. Section 2 (Energy storage) starts with the DC C and L lab before Easy. Section 4 (Op-amps) starts with inverting and non-inverting walkthroughs before Easy. Section 5 (Laplace) starts with nine walkthroughs before Easy, ending with worked examples. Past year papers sit at the bottom of Learn for exam practice.",
  },
  {
    title: "Lessons",
    text: "Each lesson starts with a short warm-up. You can skip it and go straight to the question bank. Hints are optional. Closing mid-quiz warns you that this run is lost, but XP already earned stays. Missed questions come back in a Review round.",
  },
  {
    title: "XP",
    text: "Correct first-try answers pay 10 XP on Easy, 20 on Average, and 30 on Challenging. Finishing the lesson adds 20 / 40 / 60 XP. Replaying a finished lesson is practice only (no extra XP).",
  },
  {
    title: "Streak",
    text: "Practice at least once a calendar day. The flame chip and Profile notice count down to midnight. Skip a full day and the streak resets.",
  },
  {
    title: "Skip a locked topic",
    text: "The next locked unit can be unlocked with a 5-question quiz. You need 4 out of 5 correct on the first try. A second miss ends that attempt; missed questions are not retried.",
  },
  {
    title: "Profile and Progress",
    text: "Profile lists strengths (about 80%+ first try) and weaknesses (under 60%) after at least 3 answers. Progress shows every topic and your strongest / focus area.",
  },
  {
    title: "Trophy leagues",
    text: "Everyone starts in Bronze. Every 3 days, the top 20% in your league promote and the bottom 20% demote. XP only ranks the board for that round. It does not jump you to Emerald.",
  },
  {
    title: "Class and cohort",
    text: "Class board ranks students in your class (EE01–EE16) by total XP. Cohort board ranks those 16 classes by combined XP. Individual shows the top 10 students in the cohort, with your place on the last row. Your class is set by a teacher, not on Profile.",
  },
  {
    title: "Theme",
    text: "Use Light / Dark at the bottom of the sidebar. The choice is saved on this browser.",
  },
];

export default function Guide() {
  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Help</p>
          <h1>How to use Circuito</h1>
        </div>
      </header>
      <p className="focus-line">
        Short tour of the site. Open Updates in the sidebar to see what
        changed.
      </p>
      <ol className="guide-steps">
        {STEPS.map((step, index) => (
          <li key={step.title} className="profile-block guide-step">
            <p className="guide-num">{index + 1}</p>
            <div>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
