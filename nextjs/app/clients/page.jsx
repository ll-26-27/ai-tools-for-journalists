import { getClients, sheetUrl } from "../../lib/clients.mjs";
import ClientGrid from "../components/ClientGrid.jsx";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const clients = await getClients();
  return (
    <>
      <SiteHeader current="clients" />
      <main id="main" className="wide-shell">
        <header className="article-heading">
          <p className="eyebrow">Client list · {clients.length} clients</p>
          <h1>Clients</h1>
          <p className="lede">Fictional clients for the studio, each modeled on an artist, with a hero shot from Wikimedia Commons. The list lives in a <a className="inline-link" href={sheetUrl} target="_blank" rel="noreferrer">Google Sheet</a>; edit it there and this page follows within a minute.</p>
        </header>
        <ClientGrid clients={clients} />
      </main>
      <SiteFooter />
    </>
  );
}
