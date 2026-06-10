import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <h1>Video Drop</h1>
      <p>Private file sharing — upload images & videos, view them anywhere.</p>
      <div className="actions">
        <Link to="/upload" className="btn primary">Go to Upload</Link>
        <Link to="/files" className="btn">Go to Files</Link>
      </div>
    </section>
  );
}
