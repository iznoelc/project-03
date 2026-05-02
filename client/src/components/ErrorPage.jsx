/**
 * ErrorPage.jsx
 * 
 * Shows an error page based on the response code.
 * 
 * @author Esperanza Paulino
 */

import { useLocation } from "react-router-dom"; 
import { useRouteError } from "react-router-dom"; 
//displays our logo and standard error message
//to make it look pretty
function ErrorShell({ children }) { 
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                {/* <img src={ErrorGleebus} alt="ErrorGleebus" className="w-100 h-100 object-contain"/>  */}
            <div>
            <h1 className="text-5xl font-bold">The Gleebus website has been thrown off track!</h1>
            <div className="py-6">
                <div role="alert" className="alert alert-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{children}</span>
                </div>
                </div>
                    <button className="btn btn-primary" onClick={() => (window.location.href = "/")}>Back to home</button>
                </div>
            </div>
        </div>
    ); 
}

//<div>{children}</div> 

//switch to define which error to display
function renderErrorContent(code) { 
    switch (code) { 
        case "NETWORK_ERROR": 
            return <p>We couldn’t reach the server. Check your connection.</p>; 
        case "INVALID_CREDENTIALS": 
            return <p>Your login information was incorrect.</p>; 
        case "VALIDATION_ERROR": 
            return <p>Some fields need attention before continuing.</p>; 
        case 400: 
            return <p>Your request wasn’t valid. Please try again.</p>; 
        case 403: 
            return <p>You don’t have permission to view this page.</p>; 
        case 404: 
            return <p>We couldn’t find the page you were looking for, how about you try visiting these pages instead: Home, Dashboard, Login.</p>; 
        case 408: 
            return <p>The request timed out. Try again.</p>; 
        case 429: 
            return <p>You’re doing that too quickly. Please slow down.</p>;
        case 503: 
            return <p>We’re temporarily unavailable. Please check back soon.</p>; 
        default: 
            return <p>An unexpected error occurred, try refreshing and troubleshooting.</p>; 
} }

//makes it so that you can navigate to the error page manually as well as when its triggered automatically
export default function ErrorPage() { 
    const { state } = useLocation(); 
    const code = state?.code; 
    return ( 
    <ErrorShell> {renderErrorContent(code)} </ErrorShell> 
); }

//make it so that automatic triggers route here too
export function ErrorBoundary() { 
    const error = useRouteError(); 
    let code = null; 
    if (error instanceof Response) { 
        code = error.status; 
    } else { 
        try { 
            code = JSON.parse(error.message).code; 
        } catch { /* empty */ } 
    } 
    return ( 
        <ErrorShell> {renderErrorContent(code)} </ErrorShell> 
    ); 
}