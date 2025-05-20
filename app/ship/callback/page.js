"use client"

import { useShip711StoreCallback } from '../_hooks/use-ship-711-store'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ShipCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShipCallbackContent />
    </Suspense>
  )
}

function ShipCallbackContent() {
  const searchParams = useSearchParams()
  // 呼叫回送到母視窗用的勾子函式
  useShip711StoreCallback()

  return (
    <>
      {/* 以下並非必要，可寫可不寫。只是為了自動關閉功能出意外時手動使用 */}
      <div>
        <div>
          <p>
            <button
              onClick={() => {
                window.close()
              }}
            >
              關閉視窗
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
