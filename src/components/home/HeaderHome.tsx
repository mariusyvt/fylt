import { Search } from "lucide-react";

export default function HeaderHome(){
    return (
        <header className="main-header">
            <div className="header-text">
                <p className="welcome-msg">Bonjour, Chef 👋</p>
                <h2 className="main-title">Que cuisinez-vous ?</h2>
            </div>
            <button className="circle-btn">
                <Search size={20} />
            </button>
        </header>
    )
}