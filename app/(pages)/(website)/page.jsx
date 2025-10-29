import FlipbookViewer from '@/app/_components/ui/flipbook-viewer/flipbook-viewer'
import React from 'react'

const Page = () => {
  return (
    <div className="block">
      <FlipbookViewer pdfUrl='/recetas.pdf' />
    </div>
  )
}

export default Page