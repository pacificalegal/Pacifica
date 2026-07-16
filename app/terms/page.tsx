import Link from "next/link";
import LegalTerms from "../legal-terms";
export default function TermsPage(){return <main className="legal-public-page"><header><Link href="/" className="brand">Pacifica Legal Insurance</Link><Link href="/portal" className="login-link">Member portal</Link></header><section><LegalTerms/><p className="legal-links"><Link href="/deductibles">Deductible terms</Link> · <Link href="/">Return home</Link></p></section></main>}

