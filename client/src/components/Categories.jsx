import { categories } from "../data";
import "../styles/Categories.scss"
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="categories">
      <h1>About Us?</h1>
      <p style={{fontSize: "Larger", marginTop: "20px"}}>
      Unleash the power of your funding projects with our empowering platform! Whether you're 
      a Visionary Creator or an Enthusiastic Supporter, dive into a world of opportunities where 
      innovation meets impact. 
      </p>

      <div className="categories_list">
        {categories?.slice(1, 5).map((category, index) => (
          <Link to={`/properties/category/${category.label}`}>
            <div className="category" key={index}>
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{category.icon}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
