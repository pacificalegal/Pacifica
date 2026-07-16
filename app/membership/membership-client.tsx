"use client";
import { useState } from "react";
import LegalTerms, { TERMS_VERSION } from "../legal-terms";

export default function MembershipClient({ alreadyAccepted }: { alreadyAccepted: boolean }) {
  const [open, setOpen] = useState(!alreadyAccepted);
  const [checked, setChecked] = useState(false);
  const [accepted, setAccepted] = useState(alreadyAccepted);

  function accept() {
    if (!checked) return;
    setAccepted(true);
    setOpen(false);
  }

  return <>
    <article className="enrollment-card">
      <p className="eyebrow dark">ANNUAL MEMBERSHIP</p>
      <h1>Get signed up today</h1>
      <p>Review and accept the membership agreement before continuing to secure checkout.</p>
      <div className="enrollment-highlights"><span>12-month membership term</span><span>Secure recurring billing through Stripe</span><span>Coverage subject to eligibility and plan terms</span></div>
      {!accepted ? <button className="button button-gold" onClick={() => setOpen(true)}>Review membership terms</button> :
      <form action="/api/stripe/checkout" method="post">
        <input type="hidden" name="termsAccepted" value="yes" />
        <input type="hidden" name="termsVersion" value={TERMS_VERSION} />
        <label className="final-consent"><input type="checkbox" name="billingConsent" required /> <span>I agree to the annual membership and authorize recurring installments as described in the terms.</span></label>
        <button className="button button-gold" type="submit">Continue to secure checkout</button>
      </form>}
      <p className="legal-links"><button type="button" onClick={() => setOpen(true)}>Read terms and conditions</button> · <a href="/deductibles">Deductible terms</a></p>
    </article>

    {open && <div className="terms-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div className="terms-modal">
        <div className="terms-modal-head"><div><small>MEMBERSHIP AGREEMENT</small><h2 id="terms-title">Terms and conditions</h2></div>{alreadyAccepted && <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">×</button>}</div>
        <div className="terms-scroll"><LegalTerms /></div>
        <div className="terms-accept">
          <label><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> <span>I have read and agree to the Terms and Conditions, including the annual term, recurring billing, deductibles, exclusions, and cancellation provisions.</span></label>
          <button className="button button-gold" disabled={!checked} onClick={accept}>Accept and continue</button>
        </div>
      </div>
    </div>}
  </>;
}

