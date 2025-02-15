import React, { useState } from 'react';
import { fetchReport, updateReport, deleteReport } from '@/features/auth/reports/reports_api'; // API 함수 import

const ReportTestPage = () => {
    const [reportId, setReportId] = useState('');
    const [reportData, setReportData] = useState(null); // 조회된 리포트 데이터 상태
    const [updateData, setUpdateData] = useState({}); // 수정할 데이터 상태
    const [error, setError] = useState(null); // 에러 상태
  
    // 리포트 조회 핸들러
    const handleFetchReport = async () => {
      try {
        const response = await fetchReport(reportId);
        if (response.success) {
          setReportData(response.data);
          setError(null);
          alert(response.message || `리포트 ID ${reportId} 조회 성공`);
        } else {
          throw new Error(response.message || '리포트 조회 실패');
        }
      } catch (err) {
        console.error('리포트 조회 실패:', err);
        setError(err.message || '리포트 조회 중 오류 발생');
        setReportData(null);
      }
    };
  
    // 리포트 수정 핸들러
    const handleUpdateReport = async () => {
      try {
        const response = await updateReport(reportId, updateData);
        if (response.success) {
          setReportData(response.data);
          setError(null);
          alert(response.message || `리포트 ID ${reportId} 수정 성공`);
        } else {
          throw new Error(response.message || '리포트 수정 실패');
        }
      } catch (err) {
        console.error('리포트 수정 실패:', err);
        setError(err.message || '리포트 수정 중 오류 발생');
      }
    };
  
    // 리포트 삭제 핸들러
    const handleDeleteReport = async () => {
      try {
        const response = await deleteReport(reportId);
        if (response.success) {
          setReportData(null); // 삭제 후 데이터 초기화
          setError(null);
          alert(response.message || `리포트 ID ${reportId} 삭제 성공`);
        } else {
          throw new Error(response.message || '리포트 삭제 실패');
        }
      } catch (err) {
        console.error('리포트 삭제 실패:', err);
        setError(err.message || '리포트 삭제 중 오류 발생');
      }
    };
  
    return (
      <div className="report-test-page">
        <h1>리포트 테스트 페이지</h1>
        
        {/* 리포트 ID 입력 */}
        <input
          type="text"
          placeholder="리포트 ID 입력"
          value={reportId}
          onChange={(e) => setReportId(e.target.value)}
        />
  
        {/* 조회 버튼 */}
        <button onClick={handleFetchReport}>조회</button>
  
        {/* 수정 폼 */}
        <div>
          <h2>리포트 수정</h2>
          <textarea
            placeholder="수정할 데이터(JSON 형식)"
            value={JSON.stringify(updateData)}
            onChange={(e) => setUpdateData(JSON.parse(e.target.value))}
          />
          <button onClick={handleUpdateReport}>수정</button>
        </div>
  
        {/* 삭제 버튼 */}
        <button onClick={handleDeleteReport}>삭제</button>
  
        {/* 결과 표시 */}
        {reportData && (
          <div className="report-data">
            <h2>조회된 리포트:</h2>
            <pre>{JSON.stringify(reportData, null, 2)}</pre>
          </div>
        )}
  
        {/* 에러 메시지 */}
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };
  
  export default ReportTestPage;
