import React, { useState, useEffect } from 'react'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import ProductList from './components/ProductList'
import Pagination from './components/Pagination'

const App = () => {
	const [products, setProducts] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	const getTimestamp = () => {
		const currentDate = new Date()
		const timestamp = currentDate.toISOString().slice(0, 10).replace(/-/g, '')
		return timestamp
	}

	const authString = () => {
		const timestamp = getTimestamp()
		return CryptoJS.MD5(`Valantis_${timestamp}`).toString()
	}

	const fetchProducts = async (page = 1, filters = {}) => {
		try {
			// Fetching product IDs
			const responseIds = await axios.post(
				'https://api.valantis.store:41000/',
				{
					action: 'get_ids',
					params: {
						offset: (page - 1) * 50,
						limit: 50,
					},
				},
				{
					headers: {
						'X-Auth': authString(),
					},
				}
			)

			const productIds = responseIds.data.result

			if (productIds.length > 0) {
				// Fetching product details
				const responseItems = await axios.post(
					'https://api.valantis.store:41000/',
					{
						action: 'get_items',
						params: {
							ids: productIds,
						},
					},
					{
						headers: {
							'X-Auth': authString(),
						},
					}
				)

				const uniqueProducts = getUniqueProducts(responseItems.data.result)
				const filteredProducts = applyFilters(uniqueProducts, filters)

				setProducts(filteredProducts)
				setTotalPages(Math.ceil(filteredProducts.length / 10))
			} else {
				setProducts([])
				setTotalPages(1)
			}
		} catch (error) {
			console.error(
				'Error fetching products:',
				error.response?.data?.result || error.message
			)
		}
	}

	const getUniqueProducts = products => {
		const uniqueIds = new Set()
		return products.filter(product => {
			if (!uniqueIds.has(product.id)) {
				uniqueIds.add(product.id)
				return true
			}
			return false
		})
	}

	const applyFilters = (products, filters) => {
		return products.filter(product => {
			return (
				(!filters.name ||
					product.product.toLowerCase().includes(filters.name.toLowerCase())) &&
				(!filters.price || product.price === filters.price) &&
				(!filters.brand || product.brand === filters.brand)
			)
		})
	}

	useEffect(() => {
		fetchProducts(currentPage)
	}, [currentPage])

	const handlePageChange = page => {
		setCurrentPage(page)
	}

	return (
		<div>
			<h1>Product List</h1>
			<ProductList products={products} />
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>
		</div>
	)
}

export default App
