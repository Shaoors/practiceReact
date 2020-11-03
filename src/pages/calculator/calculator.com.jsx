import React, { useState } from "react";
import CalForm from "../../components/cal-form/cal-form.com";

const CalculatorPage = () => {
  const [name, setName] = useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (name.length < 5) {
      alert("name value must be gretaer then 5");
      return;
    }
    //send this name to backend
    setName("s");
  };

  let st = {
    colour: "red",
  };

  return (
    <div>
      <CalForm
        name={name}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </div>
  );
};

export default CalculatorPage;
