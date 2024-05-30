import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategoryId: '',
    activeRatingsId: '',
    apiStatus: apiStatusConstants.initial,
    apiRequestError: false,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      searchInput,
      activeOptionId,
      activeCategoryId,
      activeRatingsId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingsId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        apiRequestError: true,
        isLoading: false,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, apiRequestError} = this.state

    // TODO: Add No Products View
    if (apiRequestError) {
      return this.renderFailureView()
    }
    return (
      <>
        {productsList.length === 0 ? (
          <div className="failure-view-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <h1 className="failure-header">No Products Found</h1>
            <p className="failure-paragraph">
              We could not find any products. Try other filters.
            </p>
          </div>
        ) : (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="failure-header">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We are having some trouble processing your request. <br /> Please try
        again.
      </p>
    </div>
  )

  changeCategoryId = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  changeRatingsId = ratingId => {
    this.setState({activeRatingsId: ratingId}, this.getProducts)
  }

  changeSearchInput = value => {
    this.setState({searchInput: value}, this.getProducts)
  }

  enterSearchInput = searchInput => {
    this.setState({searchInput}, this.getProducts)
  }

  clearFilter = () => {
    this.setState(
      {searchInput: '', activeCategoryId: '', activeRatingsId: ''},
      this.getProducts,
    )
  }

  render() {
    const {
      isLoading,
      searchInput,
      activeCategoryId,
      activeRatingsId,
    } = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          searchInput={searchInput}
          categoryList={categoryOptions}
          ratingsList={ratingsList}
          activeCategoryId={activeCategoryId}
          activeRatingsId={activeRatingsId}
          changeSearchInput={this.changeSearchInput}
          changeCategoryId={this.changeCategoryId}
          changeRatingsId={this.changeRatingsId}
          enterSearchInput={this.enterSearchInput}
          clearFilter={this.clearFilter}
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
