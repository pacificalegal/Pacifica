import Link from "next/link";

export default function DeductiblesPage() {
  return <main className="legal-public-page"><header><Link href="/" className="brand">Pacifica Legal Insurance</Link><Link href="/portal" className="login-link">Member portal</Link></header><section>
    <p className="eyebrow dark">MEMBERSHIP COSTS</p><h1>Deductibles</h1><p className="legal-intro">A deductible is the member's share for each eligible matter. It is separate from membership installments and applies only after Pacifica confirms the matter is eligible.</p>
    <div className="deductible-grid"><article><span>Traffic-related matters</span><b>$250</b><p>Per eligible covered traffic matter.</p></article><article><span>Misdemeanor matters</span><b>$750</b><p>Per eligible covered misdemeanor matter.</p></article></div>
    <article className="deductible-terms"><h2>How deductibles work</h2><ul><li>Submitting a case does not confirm coverage or create attorney representation.</li><li>The deductible becomes due only for a matter Pacifica confirms as eligible under the applicable plan.</li><li>Each separate incident, citation, charge, case, or proceeding may be treated as a separate matter.</li><li>Related allegations may be combined or separated according to the plan and written coverage decision.</li><li>Pacifica may approve adding a deductible to monthly billing or another written payment arrangement. Approval is not automatic.</li><li>Failure to pay an agreed deductible or installment may delay or suspend services to the extent permitted by law and professional obligations.</li><li>Fines, penalties, bail, bonds, restitution, court costs, filing fees, towing, experts, investigators, travel, and other third-party charges are not part of the deductible unless expressly stated in writing.</li><li>Work outside the covered scope may require a separate attorney agreement and additional payment.</li></ul></article>
    <p className="legal-links"><Link href="/terms">Full terms and conditions</Link> · <Link href="/portal">Return to portal</Link></p>
  </section></main>;
}

