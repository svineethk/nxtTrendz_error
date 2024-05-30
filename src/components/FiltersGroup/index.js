import {FaSearch} from 'react-icons/fa'

import './index.css'

const FiltersGroup = props => {
  const {
    searchInput,
    categoryList,
    ratingsList,
    activeCategoryId,
    activeRatingsId,
    changeSearchInput,
    changeCategoryId,
    changeRatingsId,
    enterSearchInput,
    clearFilter,
  } = props

  const changeSearchValue = event => {
    changeSearchInput(event.target.value)
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      enterSearchInput(searchInput)
    }
  }
  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          value={searchInput}
          onChange={changeSearchValue}
          onKeyDown={onEnterSearchInput}
        />
        <FaSearch />
      </div>
      <h1>Category</h1>
      <ul className="category-container">
        {categoryList.map(eachCategory => (
          <li className="list" key={eachCategory.categoryId}>
            <button
              type="button"
              className="category-button"
              onClick={() => {
                changeCategoryId(eachCategory.categoryId)
              }}
            >
              <p
                className={`${
                  eachCategory.categoryId === activeCategoryId
                    ? 'category-name-active'
                    : 'category-name-normal '
                }`}
              >
                {eachCategory.name}
              </p>
            </button>
          </li>
        ))}
      </ul>
      <h1>Rating</h1>
      <ul className="ratings-list-container">
        {ratingsList.map(eachRating => (
          <li className="list" key={eachRating.ratingId}>
            <button
              type="button"
              className="category-rating"
              onClick={() => changeRatingsId(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="rating-image"
              />
              <p
                className={`${
                  eachRating.ratingId === activeRatingsId
                    ? 'rating-name-active'
                    : 'rating-name-normal '
                }`}
              >
                &up
              </p>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="clear-filter-button"
        onClick={clearFilter}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
