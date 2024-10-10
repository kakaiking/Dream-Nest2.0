import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Accordion from '../components/Accordion'

const FaqPage = () => {
  return (
    <div>
      <Navbar />
      <div style={{justifyContent: "center", width: "500px",textAlign: "center", margin: "20px auto"}}>
        <h2 >Frequently Asked Questions: </h2>
      </div>
      <div className="faq">
      
        <Accordion />
      </div>
      <Footer />
    </div>
  )
}

export default FaqPage
