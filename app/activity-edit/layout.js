
import '@/styles/member-activity-edit/page.module.css'

import Details from '@/components/member-activity-edit/Details'

export default function AcitivityEdit({ children }) {
  return (
      <>
        <div className="activity-page">
          <div className="activity-container">
            <Details currentCount={1} totalCount={8} />
            {children}
          </div>
        </div>
      </>
  );
}
