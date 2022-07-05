import React, { useState } from "react";

function Ex4(){

  const [count, setCount] = useState(0); 
  const [pas, setPas] = useState(1);
  const [value, setValue] = useState(0);

  return (
      <div>
          <p>Compteur : {count} </p>
          <input placeholder={"Pas"} type={"number"} onChange={(e) => {setPas(parseInt(e.target.value, 10))}}/>
          <input placeholder={"Modifier la valeur du compteur"} type={"number"} onChange={(e) => {setValue(parseInt(e.target.value, 10))}}/>

          <button onClick={() => setCount(count + pas)}>
              Inc
          </button>
          <button onClick={() => setCount(count - pas)}>
              Dec
          </button> 
          <button onClick={() => setCount(0)}>
              Reinitialize
          </button>
          <button onClick={() => setCount(value)}>
              Update value
          </button>
      </div>
  );
};

export default Ex4;
