"use client";
import {useState} from "react";import Link from "next/link";
const coverage={
 "Infractions":{icon:"◇",title:"Help when an infraction interrupts your life",text:"Submit citations, notices, photographs, and deadlines from your phone. Eligible matters can be routed for legal review according to your plan.",items:["Traffic and eligible infraction intake","Secure document uploads","Attorney routing"]},
 "Documents":{icon:"▤",title:"Understand before you sign",text:"Organize agreements, notices, and other important paperwork in one secure account for review and follow-up.",items:["Contract and notice intake","Document organization","Status notifications"]},
 "Misdemeanors":{icon:"§",title:"A clear starting point for misdemeanor matters",text:"Tell us what happened, identify any court date or deadline, and upload the documents you received. Coverage remains subject to the membership agreement.",items:["Secure case intake","Deadline identification","Attorney assignment"]}
};
const resources=[
 ["I received a ticket—what now?","Photograph both sides, note the response deadline, and upload everything through your secure account as soon as possible."],
 ["What should I upload?","Notices, citations, letters, agreements, photographs, screenshots, and anything showing a deadline or case number."],
 ["How quickly is my matter reviewed?","New matters are placed in the review queue immediately. Timing depends on urgency, coverage, and the type of legal issue."],
 ["Are my files private?","Files are stored in protected account storage. Notifications should link authorized recipients to the secure portal rather than emailing attachments."],
];
export default function InteractiveSections(){const [active,setActive]=useState<keyof typeof coverage>("Infractions"),[open,setOpen]=useState(0);const c=coverage[active];return <>
 <section className="coverage-explorer"><div className="section-heading"><p className="eyebrow dark">Explore your protection</p><h2>Support for the moments<br/>that cannot wait.</h2><p>Choose a category to see how the member process works.</p></div><div className="explorer-body"><div className="category-tabs" role="tablist">{Object.keys(coverage).map(k=><button role="tab" aria-selected={active===k} className={active===k?'active':''} onClick={()=>setActive(k as keyof typeof coverage)} key={k}>{k}<span>→</span></button>)}</div><article className="coverage-focus"><span>{c.icon}</span><h3>{c.title}</h3><p>{c.text}</p><ul>{c.items.map(x=><li key={x}>✓ {x}</li>)}</ul><Link href="/portal">Start a matter</Link></article></div></section>
 <section className="resources-section" id="resources"><div className="resource-intro"><p className="eyebrow">Member resources</p><h2>Know what to do next.</h2><p>Quick answers for common questions. These temporary resources can be expanded into a full member knowledge center.</p><Link href="/portal" className="button button-gold">Open your account</Link></div><div className="faq-list">{resources.map(([q,a],i)=><article className={open===i?'open':''} key={q}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{String(i+1).padStart(2,'0')}</span>{q}<b>{open===i?'−':'+'}</b></button>{open===i&&<p>{a}</p>}</article>)}</div></section>
 </>}
