"use client";
import { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { API_SERVER } from "@/config/api-path";
import Styles from "@/app/activity-create/create.module.css";


export default function RegisteredListModal({ show, onHide, activityId }) {
  const [registeredList, setRegisteredList] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [founderName, setFounderName] = useState("");
  const [totalRegistered, setTotalRegistered] = useState("");
  const [needNum, setNeedNum] = useState("");
  const printRef = useRef(null);
  const totalRegisteredPay = registeredList.reduce((acc, cur) => acc + cur.num, 0);

  useEffect(() => {
    if (show && activityId) {
      fetch(`${API_SERVER}/registered/activity/${activityId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRegisteredList(data.rows);
            if (data.rows.length > 0) {
              setActivityName(data.rows[0].activity_name);
              setFounderName(data.rows[0].founder_name);
              setTotalRegistered(data.rows[0].total_registered);
              setNeedNum(data.rows[0].need_num);
            }
          } else {
            console.error("❌ 查詢報名資料失敗", data.error);
          }
        })
        .catch((err) => console.error("❌ 取得報名資料失敗", err));
    }
  }, [show, activityId]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>列印報名資料</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>${activityName} 報名現況 (${totalRegistered} / ${needNum} 人)</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          {activityName} 報名現況 ( {totalRegistered} / {needNum} 人 )
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={printRef}>
          {registeredList.length === 0 ? (
            <p>目前尚無報名資料。</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>報名者</th>
                  <th>人數</th>
                  <th>備註</th>
                  <th>報名時間</th>
                  <th className="text-end">應付金額</th>
                </tr>
              </thead>
              <tbody>
                {registeredList.map((item) => (
                  <tr key={item.registered_id}>
                    <td>{item.member_name}</td>
                    <td>{item.num}</td>
                    <td>{item.notes || "-"}</td>
                    <td>{new Date(item.registered_time).toLocaleString()}</td>
                    <td className="text-end">
                      <strong>
                        {(item.num * item.payment).toLocaleString()} 元
                      </strong>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>團主：{founderName}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-end">
                    <strong>
                      現場應收：
                      {(totalRegistered * registeredList[0].payment).toLocaleString()} 元
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className={Styles.cancelBtn}  onClick={onHide}>
          關閉
        </Button>
        <Button variant="outline-primary" className={Styles.okBtn} onClick={handlePrint}>
          列印
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 