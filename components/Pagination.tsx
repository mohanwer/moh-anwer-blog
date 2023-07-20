import Link from 'next/link'

export interface PaginationProps {
  totalPages: number
  currentPage: number
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const prevPageExists = currentPage - 1 > 0
  const nextPageExists = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPageExists && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPageExists}>
            Previous
          </button>
        )}
        {prevPageExists && (
          <Link href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}>
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPageExists && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPageExists}>
            Next
          </button>
        )}
        {nextPageExists && (
          <button>
            <Link href={`/blog/page/${currentPage + 1}`}>Next</Link>
          </button>
        )}
      </nav>
    </div>
  )
}
