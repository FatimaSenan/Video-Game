import React, { useState, useEffect } from 'react';
import "../styles/Enigme3.css";

function Enigme3() {
  const [result, setResult] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [imageArea, setImageArea] = useState(
    <>
      <img src="/images/download.png" alt="Ours sur iceberg" className="enigme3-bear-img" />
      <div className="enigme3-iceberg" id="iceberg"></div>
      <div className="enigme3-water" id="water"></div>
      <div className="enigme3-island" id="island"></div>
    </>
  );

  useEffect(() => {
    setTimeout(() => {
      setAlertMessage('⚠️ Attention ! L\'iceberg est sur le point de se fissurer !');
      setAlertType('warning');
      setButtonsVisible(true);
      setImageArea(
        <>
          <div className="enigme3-iceberg cracked"></div>
          <img
            src="/images/download.png"
            alt="Ours sur la glace fissurée"
            className="enigme3-bear-img"
            style={{ position: 'absolute', bottom: '180px', left: '50%', transform: 'translateX(-50%)' }}
          />
          <div className="enigme3-water"></div>
        </>
      );
    }, 3000);
  }, []);

  const choose = (option) => {
    if (option === 'tapis') {
      setResult("Bonne décision ! L'ours répartit son poids, la pression diminue et il traverse sans danger.");
      setImageArea(
        <>
          <div className="enigme3-iceberg enigme3-slide-to-island"></div>
          <img src="/images/gg.png" alt="Bravo !" className="enigme3-gg-img" />
          <div className="enigme3-island" style={{ display: 'block' }}></div>
          <div className="enigme3-water"></div>
        </>
      );
      setAlertMessage('✅ Très bien !');
      setAlertType('success');
    } else {
      setResult("Mauvais choix ! La pression reste forte, la glace se casse et l'ours tombe !");
      setImageArea(
        <>
          <div className="enigme3-iceberg cracked"></div>
          <img
            src="/images/download.png"
            alt="Ours sur la glace fissurée"
            className="enigme3-bear-img"
            style={{ position: 'absolute', bottom: '180px', left: '50%', transform: 'translateX(-50%)' }}
          />
          <div className="enigme3-water"></div>
        </>
      );
      setAlertMessage('❌ Mauvais choix, recommencement dans 3 secondes…');
      setAlertType('error');
      setButtonsVisible(false);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="enigme3-container">
      {alertMessage && (
        <div className={`enigme3-alert ${alertType}`}>
          {alertMessage}
        </div>
      )}

      <h1 className="enigme3-title">Énigme : L'ours et la glace</h1>

      <div className="enigme3-image-area">
        {imageArea}
      </div>

      {buttonsVisible && (
        <div className="enigme3-buttons">
          <button onClick={() => choose('tapis')}>Transformer l'ours en tapis</button>
          <button onClick={() => choose('normal')}>Garder sa forme normale</button>
        </div>
      )}

      <div className="enigme3-result">
        {result}
      </div>
    </div>
  );
}

export default Enigme3;
