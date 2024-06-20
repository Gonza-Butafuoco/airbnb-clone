import { Link, Navigate, useParams } from "react-router-dom";
import AccommodationsForm from "../components/AccommodationsForm";
import axios from "axios";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";

export default function AccommodationsPage() {
  const { action } = useParams();
  const [accommodations, setAccommodations] = useState([]);
  useEffect(() => {
    axios.get("/accommodations").then(({ data }) => {
      setAccommodations(data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <p className=" mb-6 pt-1">List of all accommodations </p>
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/accommodations/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add New Accommodation
        </Link>
      </div>
      <div className="mt-4">
        {accommodations.length > 0 &&
          accommodations.map((accommodations) => (
            <Link to={'/account/accommodations/' +accommodations._id } className=" flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl ">
              <div className=" flex w-32 h-32 bg-gray-300 grow shrink-0">
                {accommodations.photos.length > 0 && (
                  <img className=" object-cover w-full  " src={'http://localhost:4000/uploads/'+accommodations.photos[0]} alt="" />
                )}
              </div>
              <div className="grow-0 shrink">
              <h2 className="text-xl ">{accommodations.title}</h2>
              <p className="text-sm mt-2 ">{accommodations.description}</p>
              </div>
            </Link>
          ))}
      </div>

      {action === "new" && <AccommodationsForm />}
    </div>
  );
}
