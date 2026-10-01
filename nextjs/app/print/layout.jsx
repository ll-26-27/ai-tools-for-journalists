// Print pages: black ink on white, no chrome, tuned for Letter paper.
export const metadata = { title: { default: "Print · AI tools for journalists", template: "%s · Print · AI tools for journalists" } };

export default function PrintLayout({ children }) {
  return <div className="print-root">{children}</div>;
}
