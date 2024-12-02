export const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;



{/* 

    
    <div>
        {Object.keys(menuData).map((mealType) => (
          <div key={mealType} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuData[mealType]?.map((item) => (
                <div key={item.name} className="p-4 bg-white shadow rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    {Object.entries(item.portions || {}).map(([size, price]) => (
                      <div key={size} className="flex flex-col space-y-2">
                        <label className="flex items-center text-gray-700">
                          <input
                            type="radio"
                            name={`${mealType}-${item.name}`}
                            onChange={() =>
                              handlePortionSelect(mealType, item.name, size, price)
                            }
                            className="mr-2"
                          />
                          <span>{`${size.charAt(0).toUpperCase() + size.slice(1)} - ₹${price}`}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleQuantityChange(mealType, item.name, -1)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-4">
                      {selectedItems[mealType]?.[item.name]?.quantity || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(mealType, item.name, 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div> 
      
      
      
      */}