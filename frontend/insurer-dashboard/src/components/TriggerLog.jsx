import { triggers } from "../data/mockData";

export default function TriggerLog() {
  const unapproved = triggers.filter(t => !t.approved);

  return (
    <div className="p-4 bg-white shadow rounded">
      <ul>
        {unapproved.map((t, i) => (
          <li key={i} className="border-b py-2">
            <strong>{t.type}</strong> at {t.location} — {t.time}
            <span className="text-gray-600"> (Affected Riders: {t.affected})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
