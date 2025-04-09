'use client';

// import { useState, useEffect } from 'react';
// import Modal from '@/components/modal/modal.js';
// import ScratchCard from '@/app/test/_components/ScratchCard.js';
// import { useAuth } from '@/context/auth-context';
// import styles from '@/app/test/_components/ScratchCard.module.css'

// const ScratchBtn = (props) => {
//   const { auth } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isClaimed, setIsClaimed] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
  
//   useEffect(() => {
//     if (!auth?.id) {
//       setIsLoading(false);
//       return;
//     }
//     checkMonthlyClaim();
//   }, [auth?.id]);

//   const checkMonthlyClaim = () => {
//     try {
//       const now = new Date();
//       const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
//       const userId = auth?.id;

//       if (!userId) {
//         setIsLoading(false);
//         return;
//       }

//       const claimRecord = localStorage.getItem(`scratch_card_${userId}`);
//       if (claimRecord) {
//         const record = JSON.parse(claimRecord);
//         if (record.month === currentMonth) {
//           setIsClaimed(true);
//         }
//       }
//     } catch (error) {
//       console.error("檢查領取記錄時出錯:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handlePrizeClaimed = (prizeId) => {
//     console.log("優惠已成功領取！獎品ID:", prizeId);

//     try {
//       const now = new Date();
//       const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
//       const userId = auth?.id;

//       if (userId) {
//         const record = {
//           userId: userId,
//           prizeId: prizeId,
//           month: currentMonth,
//           claimedAt: now.toISOString()
//         };
//         localStorage.setItem(`scratch_card_${userId}`, JSON.stringify(record));
//       }
//     } catch (error) {
//       console.error("保存領取記錄時出錯:", error);
//     }

//     setIsClaimed(true);

//     // 通知父層更新優惠券
//     if (typeof props.onPrizeClaimed === 'function') {
//       props.onPrizeClaimed();
//     }
//   };

//   const getNextMonth = () => {
//     const now = new Date();
//     const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//     return nextMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center mt-10">
//         <div className="px-6 py-3 rounded-lg text-lg font-semibold text-gray-600">
//           載入中...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center mt-10 space-y-4">
//       <button 
//         onClick={!isClaimed ? openModal : undefined} 
//         disabled={isClaimed}
//         className={`px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all ${
//           isClaimed 
//             ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
//             : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white hover:shadow-lg transform hover:-translate-y-1'
//         }`}
//       >
//         {isClaimed ? '已領取本月優惠' : '領取本月優惠'}
//       </button>

//       {isClaimed && (
//         <div className="text-sm text-gray-600">
//           下次可領取時間：{getNextMonth()}
//         </div>
//       )}

//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         <div className="p-4">
//           <ScratchCard onPrizeClaimed={handlePrizeClaimed} />
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ScratchBtn;

import { useState, useEffect } from 'react';
import Modal from '@/components/modal/modal.js';
import ScratchCard from '@/app/test/_components/ScratchCard.js';
import { useAuth } from '@/context/auth-context';
import styles from '@/app/test/_components/ScratchCard.module.css';

const ScratchBtn = (props) => {
  const { auth } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!auth?.id) {
      setIsLoading(false);
      return;
    }
    checkMonthlyClaim();
  }, [auth?.id]);

  const checkMonthlyClaim = () => {
    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
      const userId = auth?.id;

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const claimRecord = localStorage.getItem(`scratch_card_${userId}`);
      if (claimRecord) {
        const record = JSON.parse(claimRecord);
        if (record.month === currentMonth) {
          setIsClaimed(true);
        }
      }
    } catch (error) {
      console.error("檢查領取記錄時出錯:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrizeClaimed = (prizeId) => {
    console.log("優惠已成功領取！獎品ID:", prizeId);

    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
      const userId = auth?.id;

      if (userId) {
        const record = {
          userId: userId,
          prizeId: prizeId,
          month: currentMonth,
          claimedAt: now.toISOString()
        };
        localStorage.setItem(`scratch_card_${userId}`, JSON.stringify(record));
      }
    } catch (error) {
      console.error("保存領取記錄時出錯:", error);
    }

    setIsClaimed(true);

    // 通知父層更新優惠券
    if (typeof props.onPrizeClaimed === 'function') {
      props.onPrizeClaimed();
    }
  };

  const getNextMonth = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="px-6 py-3 rounded-lg text-lg font-semibold text-gray-600">
          載入中...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scratchBtnContainer}>
      <button 
        onClick={!isClaimed ? openModal : undefined} 
        disabled={isClaimed}
        className={`${styles.scratchBtn} ${isClaimed ? styles.scratchBtnClaimed : styles.scratchBtnNotClaimed}`}
      >
        {isClaimed ? '已領取本月優惠' : '領取本月優惠'}
      </button>

      {isClaimed && (
        <div className={styles.claimedText}>
          下次可領取時間：{getNextMonth()}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalContent}>
          <ScratchCard onPrizeClaimed={handlePrizeClaimed} />
        </div>
      </Modal>
    </div>
  );
};

export default ScratchBtn;