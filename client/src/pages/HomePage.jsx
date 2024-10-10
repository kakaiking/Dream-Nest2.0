import Navbar from "../components/Navbar"
import Slide from "../components/Slide"
import Categories from "../components/Categories"
import Listings from "../components/Listings"
import Footer from "../components/Footer"

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Slide />
      <Listings />
      <Categories />
      <Footer />
    </>
  )
}

export default HomePage