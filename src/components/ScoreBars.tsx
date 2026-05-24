import type { ScoreMetric } from "@/lib/data";

type ScoreBarsProps = {
  scores: ScoreMetric[];
};

export function ScoreBars({ scores }: ScoreBarsProps) {
  return (
    <div className="score-bars">
      {scores.map((score) => (
        <div className="score-row" key={score.label}>
          <div className="score-label">
            <span>{score.label}</span>
            <strong>{score.score}/10</strong>
          </div>
          <div className="score-track" aria-hidden="true">
            <div style={{ width: `${score.score * 10}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
