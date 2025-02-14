import { useState } from 'react';
import './ConsumablesReport.scss';

export const ConsumablesReport = () => {
  const [report, setReport] = useState('');

  return (
    <div className="consumables-report">
      <h2>소모품 보고</h2>
      <textarea
        value={report}
        onChange={(e) => setReport(e.target.value)}
        placeholder="소모품 관련 보고 사항을 입력하세요."
      />
    </div>
  );
};