import { useState } from "react";
import "./index.css";

const FoodComponent = (props) => {
  const { description, name, price, image } = props;
  const [count, setCount] = useState(0);
  const handleCount = (value) => {
    if (value === 0 && count !== 0) {
      setCount(count - 1);
    } else if (value === 1) {
      setCount(count + 1);
    }
  };
  return (
    <>
      <div className="row bgr-food ">
        <div className="col-md-6 col-sm-12">
          <img className="img-100" alt="logo" src={image} />
        </div>
        <div className="flex flex-col gap-3">
          <p>{name}</p>
          <p>
            Giá: <strong>{price} Đ</strong>
          </p>
          <p className="flex items-center gap-3">
            <button
              className="bg-[#263A29] text-[#fff] w-5 h-5 flex items-center justify-center"
              onClick={() => handleCount(0)}
            >
              -
            </button>
            <span style={{ padding: "0px 8px" }}>{count}</span>
            <button
              className="bg-[#263A29] text-[#fff] w-5 h-5 flex items-center justify-center"
              onClick={() => handleCount(1)}
            >
              +
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
export default FoodComponent;
