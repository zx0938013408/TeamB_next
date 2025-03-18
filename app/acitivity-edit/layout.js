
import '@/styles/page.module.css'

import ActivityDetails from '@/components/ActivityDetails'

export default function AcitivityEdit({ children }) {
  return (
      <>
        <main className="activity-page">
          <div className="activity-container">
            <ActivityDetails currentCount={1} totalCount={8} />
            {children}
          </div>
        </main>
      </>
  );
}
