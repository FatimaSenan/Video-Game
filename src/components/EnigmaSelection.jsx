import { Link } from "react-router-dom"
import "../styles/EnigmaSelection.css";

function EnigmaSelection() {
  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">مغامرات بيري العلمية</h1>
      </div>

      <div className="enigma-links-container">
        <a href="/saveTheBear/index.html">
          <div className="enigma-card">
            <span className="enigma-number">1</span>
            <span className="enigma-text">محتويات اللغز 1</span>
            <div className="enigma-icon">🧪</div>
          </div>
        </a>

        <Link to="/enigme2" className="enigma-link">
          <div className="enigma-card">
            <span className="enigma-number">2</span>
            <span className="enigma-text">محتويات اللغز</span>
            <div className="enigma-icon">🌲</div>
          </div>
        </Link>

        <Link to="/enigme3" className="enigma-link">
          <div className="enigma-card">
            <span className="enigma-number">3</span>
            <span className="enigma-text">محتويات اللغز</span>
            <div className="enigma-icon">⚗️</div>
          </div>
        </Link>

        <Link to="/enigme4" className="enigma-link">
          <div className="enigma-card">
            <span className="enigma-number">4</span>
            <span className="enigma-text">محتويات اللغز</span>
            <div className="enigma-icon">❄️</div>
          </div>
        </Link>
      </div>

      {/* Bear character animation */}
      <div className="bear-character">
        <div className="bear-face">
          <div className="bear-eye left"></div>
          <div className="bear-eye right"></div>
          <div className="bear-nose"></div>
        </div>
        <div className="bear-arm"></div>
      </div>
    </div>
  )
}

export default EnigmaSelection