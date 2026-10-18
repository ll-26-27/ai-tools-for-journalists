import Link from "next/link";
import { thumb } from "../../lib/clients.mjs";

// The client cards on /clients and the home page: hero shot, sector, name, and the artist behind it.
export default function ClientGrid({ clients }) {
  return (
    <ul className="client-grid">
      {clients.map((client) => (
        <li key={client.slug}>
          <Link href={`/clients/${client.slug}`} className="client-card">
            {client.image && <img src={thumb(client.image)} alt={client.work || client.client} loading="lazy" />}
            <span className="client-card-copy">
              <span className="eyebrow">{client.sector}</span>
              <strong>{client.client}</strong>
              <span>After {client.based_on}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
