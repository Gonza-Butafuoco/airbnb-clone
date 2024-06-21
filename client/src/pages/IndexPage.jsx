import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [accommodations, setAccommodations] = useState([]);

  
  useEffect(() => {
    axios.get("http://localhost:4000/all-accommodations")
      .then((response) => {
        setAccommodations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching accommodations:', error);
      });
  }, []);

  
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {accommodations.length > 0 &&
        accommodations.map((accommodation) => (
          <Link to={'accommodation/' + accommodation._id} >
            <div className="bg-gray-500 mb-2 rounded-2xl flex shadow shadow-gray-700  ">
              {accommodation.photos?.[0] && (
                <img
                  className=" rounded-2xl object-cover aspect-square  "
                  src={
                    "http://localhost:4000/uploads/" + accommodation.photos?.[0]
                  }
                  alt=""
                />
              )}
            </div>
            <h2 className="text-lg truncate mt-2">{accommodation.title}</h2>
            <h3 className="font-bold mt-0.5">{accommodation.address}</h3>
            <div className="text-base mt-0.5">
             <span className="font-bold">${accommodation.price}</span>  Per Night
            </div>
          </Link>
        ))}
    </div>
  );
}
