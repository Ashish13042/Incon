import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div style={{ padding: '16px 24px', backgroundColor: '#13141a', borderBottom: '1px solid #222', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>✦ Incon</Link>
        </div>
    )
}

export default Navbar;
