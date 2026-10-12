import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { IS_MOCK } from "@/services/api";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-bold">JalRakshak</p>
          <p className="mt-2 max-w-md text-sm opacity-80">{t("footer.disclaimer")}</p>
          <p className="mt-3 text-xs opacity-70">Data mode: {IS_MOCK ? "Demo (fictional data, stored in this browser)" : "Connected backend"}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Official sources</p>
          <ul className="space-y-1 text-sm opacity-85">
            <li><a className="hover:underline" href="https://www.dhm.gov.np/" target="_blank" rel="noreferrer">Dept. of Hydrology & Meteorology</a></li>
            <li><a className="hover:underline" href="https://ndrrma.gov.np/np/" target="_blank" rel="noreferrer">NDRRMA Nepal</a></li>
            <li><a className="hover:underline" href="https://bipadportal.gov.np/" target="_blank" rel="noreferrer">BIPAD Portal</a></li>
            <li>Police 100 · Fire 101 · Ambulance 102</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Project</p>
          <ul className="space-y-1 text-sm opacity-85">
            <li><Link className="hover:underline" to="/about">About & privacy</Link></li>
            <li><Link className="hover:underline" to="/preparedness">Preparedness</Link></li>
            <li><Link className="hover:underline" to="/track">Track a request</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
