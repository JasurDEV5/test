import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

	return (
		<div>
			<span>Page:</span>
			{pages.map(page => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					disabled={page === currentPage}
				>
					{page}
				</button>
			))}
		</div>
	)
}

export default Pagination
