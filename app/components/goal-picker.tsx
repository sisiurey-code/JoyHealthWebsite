import Link from "next/link";
import { GOAL_PATHS, type GoalPath } from "../lib/goal-paths";

function GoalIcon({ icon }: Readonly<{ icon: GoalPath["icon"] }>) {
  const shapes = {
    plate: <><circle cx="16" cy="16" r="11" /><circle cx="16" cy="16" r="6" /></>,
    dumbbell: <path d="M5 12v8M9 9v14M23 9v14M27 12v8M9 16h14" />,
    puzzle: <path d="M7 9h6a3 3 0 1 1 6 0h6v6a3 3 0 1 0 0 6v6h-6a3 3 0 1 1-6 0H7z" />,
    label: <><rect x="7" y="5" width="18" height="22" rx="2" /><path d="M11 11h10M11 15h10M11 19h6" /></>,
  } as const;
  return (
    <svg className="goal-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      {shapes[icon]}
    </svg>
  );
}

/**
 * The home hero: "I want to …" answered in place. Radio buttons and CSS
 * `:has()` choose the visible answer, so it needs no JavaScript. Every answer
 * is in the HTML; browsers without `:has()` show them all. The picker opts out
 * of the Markdown twin, which reads the answers as plain question sections.
 */
export function GoalPicker() {
  return (
    <section className="hero goal-hero" aria-labelledby="hero-title">
      <div className="goal-hero-inner content-shell">
        <p className="hero-kicker">
          <span aria-hidden="true">01</span>
          Food, supplements, and straight answers
        </p>
        <h1 id="hero-title">Healthy living, made clearer.</h1>
        <fieldset className="goal-picker" data-agent="skip">
          <legend>I want to</legend>
          {GOAL_PATHS.map((path, index) => (
            <span key={path.id} className="goal-option" data-tone={path.tone}>
              <input type="radio" name="goal" id={`goal-${path.id}`} defaultChecked={index === 0} />
              <label htmlFor={`goal-${path.id}`}>
                <GoalIcon icon={path.icon} />
                {path.verb}
              </label>
            </span>
          ))}
        </fieldset>
        <div className="goal-replies">
          {GOAL_PATHS.map((path) => (
            <article key={path.id} className="goal-reply" data-tone={path.tone} aria-labelledby={`${path.id}-title`}>
              <h2 id={`${path.id}-title`}>{path.question}</h2>
              <p className="goal-answer">{path.answer}</p>
              <ol className="goal-steps">
                <li>
                  <span className="goal-step-label">Try this</span>
                  <p>{path.tryThis}</p>
                </li>
                <li>
                  <span className="goal-step-label">Read</span>
                  <ul>
                    {path.read.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>{link.title}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <span className="goal-step-label">{path.look.kind === "product" ? "Look at" : "Use"}</span>
                  <p>
                    <Link href={path.look.href}>
                      {path.look.title} <span aria-hidden="true">→</span>
                    </Link>{" "}
                    {path.look.note}
                  </p>
                </li>
              </ol>
            </article>
          ))}
        </div>
        <p className="goal-more">
          Or <Link href="/usana#products">compare the supplements</Link>, or{" "}
          <Link href="/nutrition#guides-title">browse every guide</Link>.
        </p>
      </div>
    </section>
  );
}
