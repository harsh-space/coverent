import { triggers } from "../data/mockData";

export default function TriggerLog() {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Trigger Log</h2>
      <ul>
        {triggers.map((t, i) => (
          <li key={i} className="border-b py-2">
            <strong>{t.type}</strong> at {t.location} — {t.time}  
            <span className="text-gray-600"> (Affected Riders: {t.affected})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
