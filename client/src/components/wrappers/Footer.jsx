import GleebusLogo from "../../assets/GleebusLogo.png"

export default function Footer(){
    return (
        <footer className="footer sm:footer-horizontal bg-base-300 p-10">
            <aside>
                <img src={GleebusLogo} className="w-24" />
                <h1 className="text-lg">Gleebuslings</h1>
                <p className="text-opacity-50">Providing character management services since 2026</p>
            </aside>
            <nav>
                <h6 className="footer-title">Get Connected!</h6>
                <div className="grid grid-flow-col gap-4">
                <a className="hover:underline hover:cursor-pointer">Contact us</a>
                </div>
            </nav>
        </footer>
    )
}