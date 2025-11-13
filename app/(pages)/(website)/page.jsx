import FlipbookViewer from '@/app/_components/ui/flipbook-viewer/flipbook-viewer'
import React from 'react'

const Page = () => {
  const shareUrl = 'https://almaquinta.com/';

  return (
    <div className="block">
      <FlipbookViewer pdfUrl='/recetario_v2.pdf' shareUrl={shareUrl} />
    </div>
  )
}

export default Page