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
      setAlertMessage('⚠️ انتبه! الجبل الجليدي على وشك أن يتشقق!');
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
      setResult("قرار جيد! الدب وزّع وزنه، فانخفض الضغط وعبَر بأمان.");
      setImageArea(
        <>
          <div className="enigme3-iceberg enigme3-slide-to-island"></div>
          <img src="/images/gg.png" alt="Bravo !" className="enigme3-gg-img" />
          <div className="enigme3-island" style={{ display: 'block' }}></div>
          <div className="enigme3-water"></div>
        </>
      );
      setAlertMessage('✅ رائع جدًا! !');
      setAlertType('success');
    } else {
      setResult("خيار سيئ! لا تزال الضغوط قوية، تنكسر الجليد ويسقط الدب!");
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
      setAlertMessage('❌ خيار سيئ، سيتم البدء من جديد خلال 3 ثوانٍ...');
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


      <div className="enigme3-image-area">
        {imageArea}
      </div>

      {buttonsVisible && (
        <div className="enigme3-buttons">
          <button onClick={() => choose('tapis')}>تحويل الدب إلى بساط.</button>
          <button onClick={() => choose('normal')}>الحفاظ على شكله الطبيعي</button>
        </div>
      )}

      <div className="enigme3-result">
        {result}
      </div>
    </div>
  );
}

export default Enigme3;
