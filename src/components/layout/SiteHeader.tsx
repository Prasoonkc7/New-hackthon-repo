import { Link } from "@tanstack/react-router";
import { Droplets, Languages, LogIn, LogOut, Menu, Phone, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type TKey } from "@/lib/i18n";
import { ROLE_LABEL, useAuth } from "@/lib/auth";

const NAV: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/dashboard", key: "nav.dashboard" },
  { to: "/map", key: "nav.map" },
  { to: "/request-help", key: "nav.help" },
  { to: "/shelters", key: "nav.shelters" },
  { to: "/recovery", key: "nav.recovery" },
  { to: "/preparedness", key: "nav.preparedness" },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-navy text-teal">
        <Droplets className="size-5" />
      </span>
      <span className="text-lg">JalRakshak</span>
    </Link>
  );
}

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <Button variant="ghost" size="sm" onClick={() => setLang(lang === "en" ? "ne" : "en")} aria-label="Switch language / भाषा बदल्नुहोस्">
      <Languages /> {lang === "en" ? "नेपाली" : "English"}
    </Button>
  );
}

function AccountMenu() {
  const { user, role, signOut } = useAuth();
  const { t } = useI18n();
  if (!user)
    return (
      <Button variant="outline" size="sm" asChild>
        <Link to="/login"><LogIn /> {t("nav.login")}</Link>
      </Button>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Account menu"><User /> <span className="hidden xl:inline">{ROLE_LABEL[role]}</span></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <div className="text-sm">{user.email}</div>
          <div className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[role]} · prototype mode</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/recovery">My recovery applications</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/track">{t("nav.track")}</Link></DropdownMenuItem>
        {role === "admin" || role === "responder" ? (
          <DropdownMenuItem asChild><Link to="/admin"><ShieldCheck /> {t("nav.admin")}</Link></DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}><LogOut /> {t("nav.logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { can } = useAuth();
  const [open, setOpen] = useState(false);
  const linkCls = "rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
  const active = { className: "bg-muted text-foreground" };
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkCls} activeProps={active} activeOptions={{ exact: n.to === "/" }}>
              {t(n.key)}
            </Link>
          ))}
          {can("admin", "responder") && (
            <Link to="/admin" className={linkCls} activeProps={active}>{t("nav.admin")}</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <LangToggle />
            <AccountMenu />
          </div>
          <Button variant="sos" size="sm" asChild>
            <Link to="/request-help"><Phone /> <span className="hidden sm:inline">{t("nav.sosLong")}</span><span className="sm:hidden">{t("nav.sos")}</span></Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader><SheetTitle>JalRakshak</SheetTitle></SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className={linkCls} activeProps={active} activeOptions={{ exact: n.to === "/" }}>{t(n.key)}</Link>
                ))}
                <Link to="/report-hazard" className={linkCls}>{t("nav.reportHazard")}</Link>
                <Link to="/relief" className={linkCls}>{t("nav.relief")}</Link>
                <Link to="/track" className={linkCls}>{t("nav.track")}</Link>
                {can("admin", "responder") && <Link to="/admin" className={linkCls}>{t("nav.admin")}</Link>}
              </nav>
              <div className="mt-4 flex flex-wrap gap-2 px-4">
                <LangToggle />
                <AccountMenu />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
