import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient } from "../../../lib/clients.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = await getClient(slug);
  return client ? { title: client.client, description: client.brief } : {};
}

export default async function ClientPage({ params }) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();
  const facts = [["Modeled on", `${client.based_on}${client.artist_years ? ` (${client.artist_years})` : ""}`], ["Sector", client.sector], ["Based in", client.location]].filter(([, value]) => value);

  return (
    <>
      <SiteHeader current="clients" />
      <main id="main">
        {client.image && (
          <figure className="client-hero">
            <img src={client.image} alt={client.work || client.client} />
            <figcaption>
              {client.based_on}, <em>{client.work}</em>{client.work_year ? `, ${client.work_year}` : ""}.
              {client.image_page && <> <a href={client.image_page} target="_blank" rel="noreferrer">Wikimedia Commons</a>{client.license ? `, ${client.license}` : ""}.</>}
            </figcaption>
          </figure>
        )}
        <div className="article-shell client-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/clients">Clients</Link><span>/</span><span>{client.client}</span></nav>
          <header className="article-heading">
            <p className="eyebrow">{client.sector}</p>
            <h1>{client.client}</h1>
            {client.brief && <p className="lede">{client.brief}</p>}
          </header>
          <dl className="client-facts">
            {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
