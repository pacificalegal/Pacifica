import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";
const protectedRoutes=createRouteMatcher(["/portal(.*)","/admin(.*)","/membership(.*)","/api/stripe(.*)","/api/documents(.*)"]);
export default clerkMiddleware(async(auth,req)=>{if(protectedRoutes(req)&&!req.nextUrl.pathname.startsWith("/api/stripe/webhook"))await auth.protect()});
export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};

