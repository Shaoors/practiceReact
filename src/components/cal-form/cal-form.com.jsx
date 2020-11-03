import React from "react";

const CalForm = ({ name, handleChange, handleSubmit }) => {
  return (
    <form>
      <label> Name</label>
      <input onChange={handleChange} value={name} />

      <span onClick={handleSubmit}> OK</span>
    </form>
  );
};

export default CalForm;
