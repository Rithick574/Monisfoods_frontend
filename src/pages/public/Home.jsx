import React from 'react'
import { BiSearch } from "react-icons/bi";
import BgImage from '../../assets/pic.jpg'
import breakfast from '../../assets/breakfast.jpg'
import lunch from '../../assets/lunchh.jpeg'
import dinner from '../../assets/dinner.jpg'
import logo from '../../assets/monis_logo1.png'

function Home() {
  return (


    <div>
<div className="lg:h-screen bg-color lg:flex lg:items-center overflow-clip">
            <div className="lg:w-1/2 flex-shrink-0 text-white pt-32 px-10 lg:pl-48 ">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
               Monis Food: Authentic Flavors, Exceptional Service
              </h1>
              <p className="font-semibold text-gray-500 text-sm mb-5 lg:text-lg mb-10 lg:mb-">
              At Monis Food, we believe that eating healthy should be easy and enjoyable for everyone.
               That's why we are committed to delivering high-quality, nutritious meals directly to students, teachers, and parents.
                Through our convenient service, Monis Food On Demand, we offer fresh, delicious meals every day for breakfast, lunch,
                 and snacks, ensuring that our customers have access to wholesome food choices that fuel their busy lives.
              </p>
              <div className="flex justify-between rounded-2xl py-2 pl-2 lg:pl-5 pr-2 font-semibold">
                {/* <div className="flex items-center lg:gap-3">
                  <BiSearch className="text-2xl text-blue-600" />
                  <input
                    type="text"
                    placeholder="Find the best product"
                    className="text-black outline-none w-full"
                  />
                </div> */}
                {/* <button className="btn-blue"
                //  onClick={gotoLogin}
                 >
                  Search
                </button> */}
              </div>
            </div>
          
            {/* <img
              src={BgImage}
              className="lg:w-[1200px] lg:-ml-32 lg:mt-16"
              alt="Bg Image"
            /> */}
          </div>

          <section className="wrapper mt-2">
  <div className="container-fostrap">
    <div className="mb-4"></div>
    <div className="content">
      <div className="container mx-auto">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="card bg-white shadow-md hover:shadow-xl rounded-3xl overflow-hidden">
              <div className="img-card block overflow-hidden flex justify-center  items-center" >
                <img src={breakfast} className="w-44 h-44 object-cover rounded-full transition-transform duration-300 hover:scale-110" />
              </div>
              <div className="card-content p-4 text-left">
                <h4 className="card-title font-bold text-xl mb-2">
                <div className="text-black no-underline text-center block">
                 Breakfast
                    </div>

                </h4>
                {/* <p className="text-gray-700">
                  Tutorial to make a carousel bootstrap by adding more wonderful effect fadein ...
                </p> */}
              </div>
              <div className="card-read-more border-t border-gray-200">
              <p className="block text-center py-2 font-semibold uppercase text-black-600">
        Book by 8 PM
      </p>
              </div>
            </div>
          </div>

          {/* Second Card */}
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="card bg-white shadow-md hover:shadow-xl rounded-3xl overflow-hidden">
              <div className="img-card block overflow-hidden flex justify-center items-center" >
                <img src={lunch} className="w-44 h-44 object-cover rounded-full transition-transform duration-300 hover:scale-110" />
              </div>
              <div className="card-content p-4 text-left">
                <h4 className="card-title font-bold text-xl mb-2">
                  <div  className="text-black no-underline text-center block">
                    Lunch
                  </div>
                </h4>
                {/* <p className="text-gray-700">
                  Material Design is a visual programming language made by Google...
                </p> */}
              </div>
              <div className="card-read-more border-t border-gray-200">
              <p className="block text-center py-2 font-semibold uppercase text-black-600">
        Book by 8 PM
      </p>
              </div>
            </div>
          </div>

          {/* Third Card */}
          <div className="w-full sm:w-1/3 px-2 mb-4">
            <div className="card bg-white shadow-md hover:shadow-xl rounded-3xl overflow-hidden">
              <div className="img-card block overflow-hidden flex justify-center items-center" >
                <img src={dinner} className="w-44 h-44 object-cover rounded-full transition-transform duration-300 hover:scale-110" />
              </div>
              <div className="card-content p-4 text-left">
                <h4 className="card-title font-bold text-xl mb-2">
                  <div className="text-black no-underline text-center block">
                    Dinner
                  </div>
                </h4>
                {/* <p className="text-gray-700">
                  Tutorials button hover animation, although very much a hover button is very beautiful...
                </p> */}
              </div>
              <div className="card-read-more border-t border-gray-200">
              <p className="block text-center py-2 font-semibold uppercase text-black-600">
        Book by 8 PM
      </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div className="bg-black flex justify-center items-center p-4">
      <img src={logo}  alt="Logo" />
    </div>

    </div>
  )
}

export default Home
