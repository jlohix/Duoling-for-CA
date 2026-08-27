import { useEffect, useState } from "react";
import {
  formatTimer,
  msUntilStreakExpiry,
  streakExpiresTonight,
  todayKey,
  visibleStreak,
} from "../state/progress";

const DISMISS_KEY = "circuito-streak-notice-v1";
const PING_KEY = "circuito-streak-ping-v1";

function dismissedToday() {
  try {
    return localStorage.getItem(DISMISS_KEY) === todayKey();
  } catch {
    return false;
  }
}

function pingedToday() {
  try {
    return localStorage.getItem(PING_KEY) === todayKey();
  } catch {
    return false;
  }
}

function sendDesktopPing(days) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (pingedToday()) return;
  try {
    new Notification("Your Circuito streak expires tonight", {
      body: `Practice today to keep a ${days}-day streak. It resets at midnight.`,
      tag: "circuito-streak",
    });
    localStorage.setItem(PING_KEY, todayKey());
  } catch {
    /* ignore blocked notifications */
  }
}

function NoticeCard({
  urgent,
  saved,
  title,
  text,
  timerMs,
  timerLabel,
  onPractice,
  notifyState,
  onNotify,
  onDismiss,
}) {
  return (
    <aside
      className={`streak-notice ${urgent ? "urgent" : ""} ${saved ? "saved" : ""}`}
      role="status"
    >
      <span className="streak-notice-icon" aria-hidden="true">
        <i className="fa fa-fire" />
      </span>
      <div className="streak-notice-copy">
        <p className="streak-notice-title">{title}</p>
        <p className="streak-notice-text">{text}</p>
      </div>
      {timerMs != null ? (
        <div className="streak-timer-wrap">
          <p className="streak-timer-label">{timerLabel}</p>
          <p className="streak-timer" aria-live="off">
            {formatTimer(timerMs)}
          </p>
        </div>
      ) : null}
      {onPractice || onNotify || onDismiss ? (
        <div className="streak-notice-actions">
          {onPractice ? (
            <button type="button" className="primary" onClick={onPractice}>
              Practice
            </button>
          ) : null}
          {notifyState === "default" && onNotify ? (
            <button type="button" className="ghost" onClick={onNotify}>
              Notify me
            </button>
          ) : null}
          {onDismiss ? (
            <button type="button" className="ghost" onClick={onDismiss}>
              Dismiss
            </button>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}

export default function StreakNotice({
  progress,
  onPractice,
  variant = "banner",
}) {
  const onProfile = variant === "profile";
  const atRisk = streakExpiresTonight(progress);
  const days = visibleStreak(progress);
  const [hidden, setHidden] = useState(() => dismissedToday());
  const [leftMs, setLeftMs] = useState(() => msUntilStreakExpiry(progress));
  const [notifyState, setNotifyState] = useState(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  useEffect(() => {
    setHidden(dismissedToday());
  }, [atRisk]);

  useEffect(() => {
    if (!onProfile && !atRisk) return undefined;
    setLeftMs(msUntilStreakExpiry(progress));
    const id = window.setInterval(
      () => setLeftMs(msUntilStreakExpiry(progress)),
      1000
    );
    return () => window.clearInterval(id);
  }, [atRisk, onProfile, progress]);

  useEffect(() => {
    if (!atRisk || hidden) return;
    sendDesktopPing(days);
  }, [atRisk, hidden, days]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, todayKey());
    } catch {
      /* ignore */
    }
    setHidden(true);
  }

  async function enableReminders() {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifyState(result);
    if (result === "granted") sendDesktopPing(days);
  }

  if (onProfile) {
    if (atRisk) {
      return (
        <NoticeCard
          urgent={leftMs < 3 * 60 * 60 * 1000}
          title={`${days}-day streak expires at midnight`}
          text="Finish a lesson before the timer hits zero to keep it going."
          timerMs={leftMs}
          timerLabel="Expires in"
          onPractice={onPractice}
          notifyState={notifyState}
          onNotify={enableReminders}
        />
      );
    }
    if (days > 0) {
      return (
        <NoticeCard
          saved
          title={`${days}-day streak is saved for today`}
          text="Come back tomorrow. Skip a day and it resets at that midnight."
          timerMs={leftMs}
          timerLabel="Expires in"
        />
      );
    }
    return (
      <NoticeCard
        days={0}
        title="No streak yet"
        text="Finish a lesson today to start a streak. Keep it by practicing once each day."
        onPractice={onPractice}
      />
    );
  }

  if (!atRisk || hidden) return null;

  return (
    <NoticeCard
      urgent={leftMs < 3 * 60 * 60 * 1000}
      title={`${days}-day streak expires at midnight`}
      text="Finish a lesson before the timer hits zero to keep it going."
      timerMs={leftMs}
      timerLabel="Expires in"
      onPractice={onPractice}
      notifyState={notifyState}
      onNotify={enableReminders}
      onDismiss={dismiss}
    />
  );
}
