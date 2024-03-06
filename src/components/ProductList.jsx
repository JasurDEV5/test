import React from 'react'
import cl from './ProductList.module.css'
const ProductList = ({ products }) => {
	return (
		<ul className={cl.product_card}>
			{products.map(product => (
				<li key={product.id} className={cl.product_item}>
					<strong>ID:</strong> {product.id}, <strong>Name:</strong>{' '}
					{product.product}, <strong>Price:</strong> {product.price},{' '}
					<strong>Brand:</strong> {product.brand || 'N/A'}
				</li>
			))}
		</ul>
	)
}

export default ProductList
